'use client'

import Link from 'next/link'
import { useState, useMemo } from 'react'
import {
  Search,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  ShieldAlert,
  Clock,
  XCircle,
} from 'lucide-react'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import townSEOData from '@/data/town_seo_data'
import { computeScorecard } from '@/lib/townAnalytics'
import {
  towns as complianceTowns,
  getStatusCounts,
} from '@/app/compliance/compliance-data'

// --- Types ---

type Grade = 'A' | 'B' | 'C' | 'D' | 'F'
type Quadrant = 'Green Light' | 'Paper Tiger' | 'Pipeline Problem' | 'Walled Off'
type SortKey = 'grade' | 'approved' | 'rate' | 'alpha'
type ConsistencyStatus = 'green' | 'yellow' | 'red' | 'gray'

interface RankedTown {
  slug: string
  name: string
  county: string
  grade: Grade
  overallScore: number
  approved: number
  approvalRate: number
  consistency: ConsistencyStatus
  inconsistent: number
  quadrant: Quadrant | null
}

// --- Scoring ---

function gradeFromScore(score: number): Grade {
  if (score >= 80) return 'A'
  if (score >= 65) return 'B'
  if (score >= 50) return 'C'
  if (score >= 35) return 'D'
  return 'F'
}

function getConsistency(slug: string): { status: ConsistencyStatus; inconsistent: number; review: number } {
  const town = complianceMap.get(slug)
  if (!town) return { status: 'gray', inconsistent: 0, review: 0 }
  const counts = getStatusCounts(town.provisions)
  if (counts.inconsistent > 0) return { status: 'red', inconsistent: counts.inconsistent, review: counts.review }
  if (counts.review > 0) return { status: 'yellow', inconsistent: 0, review: counts.review }
  return { status: 'green', inconsistent: 0, review: 0 }
}

function getQuadrant(approvalRate: number, inconsistent: number, hasCompliance: boolean): Quadrant | null {
  if (!hasCompliance) return null
  const highApproval = approvalRate >= 65
  const clean = inconsistent === 0
  if (clean && highApproval) return 'Green Light'
  if (!clean && highApproval) return 'Paper Tiger'
  if (clean && !highApproval) return 'Pipeline Problem'
  return 'Walled Off'
}

// --- Build data ---

const complianceMap = new Map(complianceTowns.map(t => [t.slug, t]))

const allTowns: RankedTown[] = townSEOData
  .filter(t => t.responded && t.submitted > 0)
  .map(town => {
    const base = computeScorecard(town)
    let rulesScore = base.rulesFrictionScore
    const compliance = complianceMap.get(town.slug)
    const { status, inconsistent, review } = getConsistency(town.slug)

    if (compliance) {
      rulesScore -= inconsistent * 8
      rulesScore -= review * 3
      rulesScore -= compliance.agDisapprovals * 5
      rulesScore = Math.max(0, rulesScore)
    }

    const opsScore = base.operationalFrictionScore
    const overallScore = Math.round((rulesScore + opsScore) / 2)

    return {
      slug: town.slug,
      name: town.name,
      county: town.county,
      grade: gradeFromScore(overallScore),
      overallScore,
      approved: town.approved,
      approvalRate: town.approvalRate,
      consistency: status,
      inconsistent,
      quadrant: getQuadrant(town.approvalRate, inconsistent, !!compliance),
    }
  })

// --- Colors ---

const gradeColor: Record<Grade, string> = {
  A: 'text-emerald-400',
  B: 'text-blue-400',
  C: 'text-yellow-400',
  D: 'text-orange-400',
  F: 'text-red-400',
}

const gradeBg: Record<Grade, string> = {
  A: 'bg-emerald-400/10 border-emerald-400/30',
  B: 'bg-blue-400/10 border-blue-400/30',
  C: 'bg-yellow-400/10 border-yellow-400/30',
  D: 'bg-orange-400/10 border-orange-400/30',
  F: 'bg-red-400/10 border-red-400/30',
}

const consistencyConfig: Record<ConsistencyStatus, { dot: string; label: string }> = {
  green: { dot: 'bg-emerald-400', label: 'Consistent' },
  yellow: { dot: 'bg-amber-400', label: 'Under review' },
  red: { dot: 'bg-red-400', label: 'Inconsistent' },
  gray: { dot: 'bg-gray-600', label: 'No data' },
}

const PAGE_SIZE = 50
const grades: Grade[] = ['A', 'B', 'C', 'D', 'F']

// --- Component ---

export default function RankingsPage() {
  const [search, setSearch] = useState('')
  const [countyFilter, setCountyFilter] = useState('')
  const [gradeFilter, setGradeFilter] = useState<Set<Grade>>(new Set())
  const [sortBy, setSortBy] = useState<SortKey>('grade')
  const [page, setPage] = useState(0)

  const counties = useMemo(
    () => Array.from(new Set(allTowns.map(t => t.county))).sort(),
    [],
  )

  const filtered = useMemo(() => {
    let result = allTowns

    if (search) {
      const q = search.toLowerCase()
      result = result.filter(t => t.name.toLowerCase().includes(q))
    }
    if (countyFilter) {
      result = result.filter(t => t.county === countyFilter)
    }
    if (gradeFilter.size > 0) {
      result = result.filter(t => gradeFilter.has(t.grade))
    }

    result = [...result].sort((a, b) => {
      if (sortBy === 'alpha') return a.name.localeCompare(b.name)
      if (sortBy === 'approved') return b.approved - a.approved
      if (sortBy === 'rate') return b.approvalRate - a.approvalRate
      return b.overallScore - a.overallScore
    })

    return result
  }, [search, countyFilter, gradeFilter, sortBy])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  const totalA = allTowns.filter(t => t.grade === 'A').length
  const totalB = allTowns.filter(t => t.grade === 'B').length
  const totalCompliance = allTowns.filter(t => t.consistency !== 'gray').length

  // Quadrant counts (only compliance-profiled towns)
  const quadrantCounts = useMemo(() => {
    const counts = { 'Green Light': 0, 'Paper Tiger': 0, 'Pipeline Problem': 0, 'Walled Off': 0 }
    for (const t of allTowns) {
      if (t.quadrant) counts[t.quadrant]++
    }
    return counts
  }, [])

  function toggleGrade(g: Grade) {
    setGradeFilter(prev => {
      const next = new Set(prev)
      if (next.has(g)) next.delete(g)
      else next.add(g)
      return next
    })
    setPage(0)
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <NavBar current="Rankings" />

      <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Massachusetts ADU Town Rankings
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Every town scored on permits, approval rates, and bylaw consistency
          </p>
        </div>

        {/* Stats bar */}
        <div className="flex flex-wrap gap-4 justify-center text-sm text-gray-400 mb-6">
          <span>
            <span className="text-white font-medium">{allTowns.length}</span> towns
            scored
          </span>
          <span>
            <span className="text-white font-medium">{totalCompliance}</span> with
            bylaw analysis
          </span>
          <span>
            <span className="text-emerald-400 font-medium">{totalA + totalB}</span>{' '}
            rated A or B
          </span>
        </div>

        {/* Sticky filter bar */}
        <div className="sticky top-0 z-10 bg-gray-900/95 backdrop-blur border-b border-gray-800 -mx-4 px-4 py-4 mb-6 space-y-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search by town name..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(0) }}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Filters row */}
          <div className="flex flex-wrap items-center gap-3">
            {/* County dropdown */}
            <select
              value={countyFilter}
              onChange={e => { setCountyFilter(e.target.value); setPage(0) }}
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none"
            >
              <option value="">All Counties</option>
              {counties.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            {/* Grade pills */}
            <div className="flex gap-1.5">
              {grades.map(g => (
                <button
                  key={g}
                  onClick={() => toggleGrade(g)}
                  className={`w-8 h-8 rounded-lg border text-sm font-black transition-colors ${
                    gradeFilter.has(g)
                      ? `${gradeBg[g]} ${gradeColor[g]}`
                      : 'bg-gray-800 border-gray-700 text-gray-500 hover:text-gray-300'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>

            {/* Sort dropdown */}
            <select
              value={sortBy}
              onChange={e => { setSortBy(e.target.value as SortKey); setPage(0) }}
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none ml-auto"
            >
              <option value="grade">Sort: Grade</option>
              <option value="approved">Sort: Permits Approved</option>
              <option value="rate">Sort: Approval Rate</option>
              <option value="alpha">Sort: Town Name</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
          {/* Header row */}
          <div className="hidden md:grid grid-cols-12 gap-2 px-4 py-3 border-b border-gray-700 text-gray-500 text-xs uppercase tracking-wider">
            <div className="col-span-1">#</div>
            <div className="col-span-3">Town</div>
            <div className="col-span-2">County</div>
            <div className="col-span-1 text-center">Grade</div>
            <div className="col-span-2 text-right">Approved</div>
            <div className="col-span-2 text-right">Appr. Rate</div>
            <div className="col-span-1 text-center">Bylaws</div>
          </div>

          {/* Data rows */}
          <div className="divide-y divide-gray-700/50">
            {paged.map((town, i) => {
              const rank = page * PAGE_SIZE + i + 1
              const cc = consistencyConfig[town.consistency]
              return (
                <Link
                  key={town.slug}
                  href={`/towns/${town.slug}`}
                  className="grid grid-cols-12 gap-2 px-4 py-3 items-center hover:bg-gray-700/30 transition-colors group"
                >
                  {/* Rank */}
                  <div className="col-span-2 md:col-span-1 text-gray-500 text-sm">
                    {rank}
                  </div>

                  {/* Town (mobile: spans more) */}
                  <div className="col-span-6 md:col-span-3 min-w-0">
                    <span className="text-white font-medium group-hover:text-blue-400 transition-colors truncate block">
                      {town.name}
                    </span>
                    <span className="md:hidden text-gray-500 text-xs">{town.county}</span>
                  </div>

                  {/* County (hidden mobile) */}
                  <div className="hidden md:block col-span-2 text-gray-500 text-sm truncate">
                    {town.county}
                  </div>

                  {/* Grade */}
                  <div className="col-span-1 flex justify-center">
                    <span
                      className={`w-8 h-8 rounded-lg border flex items-center justify-center text-sm font-black ${gradeBg[town.grade]} ${gradeColor[town.grade]}`}
                    >
                      {town.grade}
                    </span>
                  </div>

                  {/* Approved */}
                  <div className="hidden md:block col-span-2 text-right text-white text-sm">
                    {town.approved}
                  </div>

                  {/* Approval Rate */}
                  <div
                    className="col-span-2 text-right text-sm text-white"
                    title="Share of 2025 applications approved in 2025"
                  >
                    {town.approvalRate}%
                  </div>

                  {/* Consistency dot */}
                  <div className="col-span-1 flex justify-center">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${cc.dot}`}
                      title={cc.label}
                    />
                    <span className="sr-only">{cc.label}</span>
                  </div>
                </Link>
              )
            })}

            {paged.length === 0 && (
              <div className="px-4 py-8 text-center text-gray-500">
                No towns match your filters.
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-700 text-sm">
              <span className="text-gray-500">
                Showing {page * PAGE_SIZE + 1}&ndash;
                {Math.min((page + 1) * PAGE_SIZE, filtered.length)} of{' '}
                {filtered.length}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="p-1.5 rounded-lg bg-gray-800 border border-gray-700 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                  className="p-1.5 rounded-lg bg-gray-800 border border-gray-700 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Quadrant Insight */}
        <section className="mt-12">
          <h2 className="text-xl font-bold text-white mb-2">
            Understanding the Quadrants
          </h2>
          <p className="text-gray-400 text-sm mb-6">
            For the {totalCompliance} towns with bylaw analysis, we classify each
            by whether their bylaws are consistent with state law and whether
            permits are actually getting approved.
          </p>

          <div className="grid grid-cols-2 gap-px bg-gray-700 rounded-xl overflow-hidden max-w-2xl">
            {/* Green Light */}
            <div className="bg-emerald-900/20 p-4 md:p-5">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 mb-2" />
              <div className="text-emerald-400 font-bold text-sm">Green Light</div>
              <div className="text-gray-400 text-xs mt-1">
                Consistent bylaws, high approval rate
              </div>
              <div className="text-emerald-400/70 text-xs mt-2 font-medium">
                {quadrantCounts['Green Light']} towns
              </div>
            </div>

            {/* Paper Tiger */}
            <div className="bg-yellow-900/20 p-4 md:p-5">
              <ShieldAlert className="w-5 h-5 text-yellow-400 mb-2" />
              <div className="text-yellow-400 font-bold text-sm">Paper Tiger</div>
              <div className="text-gray-400 text-xs mt-1">
                Inconsistent bylaws, high approval rate
              </div>
              <div className="text-yellow-400/70 text-xs mt-2 font-medium">
                {quadrantCounts['Paper Tiger']} towns
              </div>
            </div>

            {/* Pipeline Problem */}
            <div className="bg-blue-900/20 p-4 md:p-5">
              <Clock className="w-5 h-5 text-blue-400 mb-2" />
              <div className="text-blue-400 font-bold text-sm">Pipeline Problem</div>
              <div className="text-gray-400 text-xs mt-1">
                Consistent bylaws, low approval rate
              </div>
              <div className="text-blue-400/70 text-xs mt-2 font-medium">
                {quadrantCounts['Pipeline Problem']} towns
              </div>
            </div>

            {/* Walled Off */}
            <div className="bg-red-900/20 p-4 md:p-5">
              <XCircle className="w-5 h-5 text-red-400 mb-2" />
              <div className="text-red-400 font-bold text-sm">Walled Off</div>
              <div className="text-gray-400 text-xs mt-1">
                Inconsistent bylaws, low approval rate
              </div>
              <div className="text-red-400/70 text-xs mt-2 font-medium">
                {quadrantCounts['Walled Off']} towns
              </div>
            </div>
          </div>
        </section>

        {/* CTAs */}
        <div className="mt-10 grid md:grid-cols-2 gap-4">
          <Link
            href="/club"
            className="bg-gradient-to-r from-emerald-900/30 to-blue-900/30 border border-emerald-500/20 rounded-xl p-6 hover:from-emerald-900/50 hover:to-blue-900/50 transition-colors"
          >
            <h3 className="text-white font-bold mb-1">Planning an ADU?</h3>
            <p className="text-gray-400 text-sm">
              Join your town&apos;s ADU group for 15-20% group builder rates.
            </p>
            <span className="text-emerald-400 text-sm mt-2 inline-block">
              Join the Club &rarr;
            </span>
          </Link>
          <Link
            href="/compliance"
            className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/20 rounded-xl p-6 hover:from-purple-900/50 hover:to-blue-900/50 transition-colors"
          >
            <h3 className="text-white font-bold mb-1">
              See the bylaw analysis
            </h3>
            <p className="text-gray-400 text-sm">
              Provision-by-provision breakdown of where town bylaws conflict with
              state law.
            </p>
            <span className="text-purple-400 text-sm mt-2 inline-block">
              Bylaw Tracker &rarr;
            </span>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}
