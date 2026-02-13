'use client'

import Link from 'next/link'
import { useState } from 'react'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import townSEOData from '@/data/town_seo_data'
import { computeScorecard } from '@/lib/townAnalytics'
import { towns as complianceTowns, getStatusCounts } from '@/app/compliance/compliance-data'

// --- Types ---

type Grade = 'A' | 'B' | 'C' | 'D' | 'F'
type Quadrant = 'Green Light' | 'Paper Tiger' | 'Untapped' | 'Walled Off'
type SortKey = 'grade' | 'rules' | 'ops' | 'alpha'

interface ScoredTown {
  slug: string
  name: string
  county: string
  grade: Grade
  overallScore: number
  rulesScore: number
  rulesLabel: string
  opsScore: number
  opsLabel: string
  quadrant: Quadrant
  hasCompliance: boolean
  inconsistent: number
  review: number
  submitted: number
  hasPermitData: boolean
}

// --- Scoring ---

function frictionLabel(score: number): string {
  if (score >= 65) return 'Low'
  if (score >= 40) return 'Medium'
  return 'High'
}

function gradeFromScore(score: number): Grade {
  if (score >= 80) return 'A'
  if (score >= 65) return 'B'
  if (score >= 50) return 'C'
  if (score >= 35) return 'D'
  return 'F'
}

function getQuadrant(submitted: number, rulesScore: number): Quadrant {
  const highPermits = submitted >= 15
  const cleanBylaws = rulesScore >= 65
  if (highPermits && cleanBylaws) return 'Green Light'
  if (highPermits && !cleanBylaws) return 'Paper Tiger'
  if (!highPermits && cleanBylaws) return 'Untapped'
  return 'Walled Off'
}

const complianceMap = new Map(complianceTowns.map(t => [t.slug, t]))

const scoredTowns: ScoredTown[] = townSEOData
  .filter(t => t.responded && t.submitted > 0)
  .map(town => {
    const base = computeScorecard(town)
    let rulesScore = base.rulesFrictionScore
    const compliance = complianceMap.get(town.slug)
    let inconsistent = 0
    let review = 0

    if (compliance) {
      const counts = getStatusCounts(compliance.provisions)
      inconsistent = counts.inconsistent
      review = counts.review
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
      rulesScore,
      rulesLabel: frictionLabel(rulesScore),
      opsScore,
      opsLabel: frictionLabel(opsScore),
      quadrant: getQuadrant(town.submitted, rulesScore),
      hasCompliance: !!compliance,
      inconsistent,
      review,
      submitted: town.submitted,
      hasPermitData: !!town.hasPermitData,
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

const quadrantConfig: Record<Quadrant, { color: string; bg: string }> = {
  'Green Light': { color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  'Paper Tiger': { color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
  'Untapped': { color: 'text-blue-400', bg: 'bg-blue-400/10' },
  'Walled Off': { color: 'text-red-400', bg: 'bg-red-400/10' },
}

// --- Component ---

export default function ScoresPage() {
  const [sortBy, setSortBy] = useState<SortKey>('grade')
  const [regionFilter, setRegionFilter] = useState('')

  const regions = Array.from(new Set(scoredTowns.map(t => t.county))).sort()

  const filtered = regionFilter
    ? scoredTowns.filter(t => t.county === regionFilter)
    : scoredTowns

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'alpha') return a.name.localeCompare(b.name)
    if (sortBy === 'grade') return b.overallScore - a.overallScore
    if (sortBy === 'rules') return b.rulesScore - a.rulesScore
    if (sortBy === 'ops') return b.opsScore - a.opsScore
    return 0
  })

  const totalA = scoredTowns.filter(t => t.grade === 'A').length
  const totalB = scoredTowns.filter(t => t.grade === 'B').length
  const totalCompliance = scoredTowns.filter(t => t.hasCompliance).length

  return (
    <div className="min-h-screen bg-gray-900">
      <NavBar current="Scores" />

      <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            ADU-Friendliness Scores
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            How ADU-friendly is each town in practice? We combine permit data
            with bylaw compliance into a single grade.
          </p>
        </div>

        {/* Matrix legend */}
        <div className="grid grid-cols-2 gap-px bg-gray-700 rounded-xl overflow-hidden max-w-lg mx-auto mb-8 border border-gray-700">
          <div className="bg-emerald-900/20 p-3 md:p-4">
            <div className="text-emerald-400 font-bold text-sm">Green Light</div>
            <div className="text-gray-400 text-xs mt-0.5">High permits, clean bylaws</div>
          </div>
          <div className="bg-yellow-900/20 p-3 md:p-4">
            <div className="text-yellow-400 font-bold text-sm">Paper Tiger</div>
            <div className="text-gray-400 text-xs mt-0.5">High permits, messy bylaws</div>
          </div>
          <div className="bg-blue-900/20 p-3 md:p-4">
            <div className="text-blue-400 font-bold text-sm">Untapped</div>
            <div className="text-gray-400 text-xs mt-0.5">Low permits, clean bylaws</div>
          </div>
          <div className="bg-red-900/20 p-3 md:p-4">
            <div className="text-red-400 font-bold text-sm">Walled Off</div>
            <div className="text-gray-400 text-xs mt-0.5">Low permits, messy bylaws</div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="flex flex-wrap gap-4 justify-center text-sm text-gray-400 mb-6">
          <span><span className="text-white font-medium">{scoredTowns.length}</span> towns scored</span>
          <span><span className="text-white font-medium">{totalCompliance}</span> with bylaw analysis</span>
          <span><span className="text-emerald-400 font-medium">{totalA + totalB}</span> rated A or B</span>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex gap-2 flex-wrap">
            {([
              ['grade', 'Grade'],
              ['rules', 'Rules Friction'],
              ['ops', 'Operational Friction'],
              ['alpha', 'A-Z'],
            ] as const).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setSortBy(key)}
                className={`px-3 py-1.5 text-xs rounded-full ${
                  sortBy === key
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <select
            value={regionFilter}
            onChange={e => setRegionFilter(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none"
          >
            <option value="">All Counties</option>
            {regions.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        {/* Town list */}
        <div className="space-y-2">
          {sorted.map(town => {
            const qc = quadrantConfig[town.quadrant]
            const href = town.hasPermitData
              ? `/${town.slug}`
              : `/towns/${town.slug}`
            return (
              <Link
                key={town.slug}
                href={href}
                className="flex items-center gap-4 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 md:px-5 md:py-4 hover:border-gray-600 transition-colors group"
              >
                {/* Grade */}
                <div className={`w-12 h-12 rounded-lg border flex items-center justify-center text-2xl font-black shrink-0 ${gradeBg[town.grade]} ${gradeColor[town.grade]}`}>
                  {town.grade}
                </div>

                {/* Town info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-white font-bold group-hover:text-blue-400 transition-colors truncate">
                      {town.name}
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${qc.bg} ${qc.color}`}>
                      {town.quadrant}
                    </span>
                    {town.hasCompliance && (
                      <Link
                        href={`/compliance/${town.slug}`}
                        className="text-[10px] px-1.5 py-0.5 rounded-full bg-purple-400/10 text-purple-400 font-medium hover:bg-purple-400/20 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Bylaw Analyzed
                      </Link>
                    )}
                  </div>
                  <div className="text-gray-500 text-xs mt-0.5">{town.county} County</div>
                </div>

                {/* Sub-scores */}
                <div className="hidden md:flex items-center gap-6 text-sm shrink-0">
                  <div className="text-center">
                    <div className="text-gray-500 text-[10px] uppercase tracking-wider">Rules</div>
                    <div className="text-white font-medium">{town.rulesScore}</div>
                    <div className={`text-[10px] ${town.rulesLabel === 'Low' ? 'text-emerald-400' : town.rulesLabel === 'Medium' ? 'text-yellow-400' : 'text-red-400'}`}>
                      {town.rulesLabel} friction
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-500 text-[10px] uppercase tracking-wider">Ops</div>
                    <div className="text-white font-medium">{town.opsScore}</div>
                    <div className={`text-[10px] ${town.opsLabel === 'Low' ? 'text-emerald-400' : town.opsLabel === 'Medium' ? 'text-yellow-400' : 'text-red-400'}`}>
                      {town.opsLabel} friction
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-500 text-[10px] uppercase tracking-wider">Score</div>
                    <div className={`font-bold ${gradeColor[town.grade]}`}>{town.overallScore}</div>
                  </div>
                </div>

                {/* Mobile score */}
                <div className={`md:hidden text-lg font-bold shrink-0 ${gradeColor[town.grade]}`}>
                  {town.overallScore}
                </div>
              </Link>
            )
          })}
        </div>

        {/* CTA */}
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
              Provision-by-provision breakdown of where town bylaws conflict
              with state law.
            </p>
            <span className="text-purple-400 text-sm mt-2 inline-block">
              Compliance Tracker &rarr;
            </span>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}
