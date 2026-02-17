'use client'

import Link from 'next/link'
import { useState, useMemo } from 'react'
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import townSEOData from '@/data/town_seo_data'
import { buildingPermitMap } from '@/data/building_permits_2024'
import {
  allEntries as complianceTowns,
  getStatusCounts,
} from '@/app/compliance/compliance-data'

// --- Types ---

type SortKey = 'aduShare' | 'totalPermits' | 'aduApproved' | 'approvalRate' | 'alpha'
type ConsistencyStatus = 'green' | 'yellow' | 'red' | 'gray'

interface HousingRow {
  slug: string
  name: string
  county: string
  totalBuildingPermits: number
  aduSubmitted: number
  aduApproved: number
  approvalRate: number
  aduShareOfProduction: number | null
  consistencyStatus: ConsistencyStatus
}

// --- Build data ---

const complianceMap = new Map(complianceTowns.map(t => [t.slug, t]))

const allRows: HousingRow[] = townSEOData
  .filter(t => t.responded && t.submitted > 0)
  .map(town => {
    const bp = buildingPermitMap.get(town.slug)
    const totalBP = bp?.totalUnits || 0
    const aduShare = totalBP >= 10
      ? Math.round((town.approved / totalBP) * 1000) / 10
      : null

    const comp = complianceMap.get(town.slug)
    let consistencyStatus: ConsistencyStatus = 'gray'
    if (comp) {
      const counts = getStatusCounts(comp.provisions)
      if (counts.inconsistent > 0) consistencyStatus = 'red'
      else if (counts.review > 0) consistencyStatus = 'yellow'
      else consistencyStatus = 'green'
    }

    return {
      slug: town.slug,
      name: town.name,
      county: town.county,
      totalBuildingPermits: totalBP,
      aduSubmitted: town.submitted,
      aduApproved: town.approved,
      approvalRate: town.approvalRate,
      aduShareOfProduction: aduShare,
      consistencyStatus,
    }
  })

// --- Summary stats ---

const sufficientRows = allRows.filter(r => r.totalBuildingPermits >= 10)
const totalBuildingPermits = sufficientRows.reduce((s, r) => s + r.totalBuildingPermits, 0)
const totalAduApproved = sufficientRows.reduce((s, r) => s + r.aduApproved, 0)
const townsWithBoth = sufficientRows.length
const overallAduShare = totalBuildingPermits > 0
  ? Math.round((totalAduApproved / totalBuildingPermits) * 1000) / 10
  : 0

// --- Insight stats ---

const rowsWithShareAndCompliance = allRows.filter(
  r => r.aduShareOfProduction !== null && r.consistencyStatus !== 'gray'
)
const consistentRows = rowsWithShareAndCompliance.filter(r => r.consistencyStatus === 'green')
const inconsistentRows = rowsWithShareAndCompliance.filter(r => r.consistencyStatus === 'red')

function avgShare(rows: HousingRow[]): string {
  if (rows.length === 0) return '—'
  const sum = rows.reduce((s, r) => s + (r.aduShareOfProduction || 0), 0)
  return (sum / rows.length).toFixed(1)
}

// --- Config ---

const consistencyConfig: Record<ConsistencyStatus, { dot: string; label: string }> = {
  green: { dot: 'bg-emerald-400', label: 'Consistent' },
  yellow: { dot: 'bg-amber-400', label: 'Under review' },
  red: { dot: 'bg-red-400', label: 'Inconsistent' },
  gray: { dot: 'bg-gray-600', label: 'No data' },
}

const PAGE_SIZE = 50

// --- Component ---

export default function HousingProductionPage() {
  const [search, setSearch] = useState('')
  const [countyFilter, setCountyFilter] = useState('')
  const [sortBy, setSortBy] = useState<SortKey>('aduShare')
  const [page, setPage] = useState(0)

  const counties = useMemo(
    () => Array.from(new Set(allRows.map(t => t.county))).sort(),
    [],
  )

  const filtered = useMemo(() => {
    let result = allRows

    if (search) {
      const q = search.toLowerCase()
      result = result.filter(t => t.name.toLowerCase().includes(q))
    }
    if (countyFilter) {
      result = result.filter(t => t.county === countyFilter)
    }

    result = [...result].sort((a, b) => {
      if (sortBy === 'alpha') return a.name.localeCompare(b.name)
      if (sortBy === 'totalPermits') return b.totalBuildingPermits - a.totalBuildingPermits
      if (sortBy === 'aduApproved') return b.aduApproved - a.aduApproved
      if (sortBy === 'approvalRate') return b.approvalRate - a.approvalRate
      // aduShare — nulls sort to bottom
      const aShare = a.aduShareOfProduction ?? -1
      const bShare = b.aduShareOfProduction ?? -1
      return bShare - aShare
    })

    return result
  }, [search, countyFilter, sortBy])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  return (
    <div className="min-h-screen bg-gray-900">
      <NavBar current="Housing" />

      <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            ADU Impact on Housing Production
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            How first-year ADU permits compare to traditional housing production
          </p>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { value: townsWithBoth, label: 'Towns With Data' },
            { value: totalBuildingPermits.toLocaleString(), label: '2024 Building Permits' },
            { value: totalAduApproved.toLocaleString(), label: '2025 ADU Approvals' },
            { value: `${overallAduShare}%`, label: 'ADU Share of Production' },
          ].map((s, i) => (
            <div key={i} className="bg-gray-800 border border-gray-700 rounded-xl p-3 sm:p-4 text-center">
              <p className={`text-2xl sm:text-3xl font-bold ${i === 3 ? 'text-emerald-400' : 'text-white'}`}>
                {s.value}
              </p>
              <p className="text-xs text-gray-400 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Data source callout */}
        <div className="bg-gray-800/40 border border-gray-700/50 rounded-xl px-4 py-3 mb-6 text-xs text-gray-500 leading-relaxed space-y-1">
          <p>
            <span className="text-gray-400">Building Permits:</span> U.S. Census Building Permits Survey (2024) via UMass Donahue Institute
            &nbsp;&middot;&nbsp;
            <span className="text-gray-400">ADU Permits:</span> EOHLC ADU Survey (Feb 2026)
          </p>
          <p>
            2024 is used as baseline — the last full year before ADUs were legalized statewide (Feb 2, 2025).
            Census BPS has a known ~14% undercount for Massachusetts. Towns with fewer than 10 reported building permits are excluded from ADU Share calculations.
          </p>
        </div>

        {/* Sticky filter bar */}
        <div className="sticky top-0 z-10 bg-gray-900/95 backdrop-blur border-b border-gray-800 -mx-4 px-4 py-4 mb-6 space-y-3">
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

          <div className="flex flex-wrap items-center gap-3">
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

            <select
              value={sortBy}
              onChange={e => { setSortBy(e.target.value as SortKey); setPage(0) }}
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none ml-auto"
            >
              <option value="aduShare">Sort: ADU Share</option>
              <option value="totalPermits">Sort: 2024 Permits</option>
              <option value="aduApproved">Sort: ADU Approved</option>
              <option value="approvalRate">Sort: Approval Rate</option>
              <option value="alpha">Sort: Town Name</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
          {/* Header row */}
          <div className="hidden md:grid grid-cols-12 gap-2 px-4 py-3 border-b border-gray-700 text-gray-500 text-xs uppercase tracking-wider">
            <div className="col-span-3">Town</div>
            <div className="col-span-1">County</div>
            <div className="col-span-2 text-right">2024 Permits</div>
            <div className="col-span-1 text-right">ADU Apps</div>
            <div className="col-span-1 text-right">Approved</div>
            <div className="col-span-1 text-right">Rate</div>
            <div className="col-span-2 text-right">ADU Share</div>
            <div className="col-span-1 text-center">Bylaws</div>
          </div>

          {/* Data rows */}
          <div className="divide-y divide-gray-700/50">
            {paged.map(row => {
              const cc = consistencyConfig[row.consistencyStatus]
              const lowData = row.totalBuildingPermits > 0 && row.totalBuildingPermits < 10
              const shareDisplay = row.aduShareOfProduction !== null
                ? `${row.aduShareOfProduction}%`
                : lowData ? 'Limited data' : 'N/A'
              const shareColor = row.aduShareOfProduction === null
                ? 'text-gray-600'
                : row.aduShareOfProduction >= 10
                  ? 'text-emerald-400'
                  : row.aduShareOfProduction >= 5
                    ? 'text-amber-400'
                    : 'text-white'

              return (
                <Link
                  key={row.slug}
                  href={`/towns/${row.slug}`}
                  className="block md:grid md:grid-cols-12 md:gap-2 px-4 py-3 md:items-center hover:bg-gray-700/30 transition-colors group"
                >
                  {/* Mobile layout */}
                  <div className="md:hidden">
                    <div className="flex items-center justify-between">
                      <div className="min-w-0">
                        <span className="text-white font-medium group-hover:text-blue-400 transition-colors truncate block">
                          {row.name}
                        </span>
                        <span className="text-gray-500 text-xs">{row.county}</span>
                      </div>
                      <span
                        className={`w-2.5 h-2.5 rounded-full shrink-0 ml-2 ${cc.dot}`}
                        title={cc.label}
                      />
                    </div>
                    <div className="flex items-baseline gap-2 mt-1.5 text-xs text-gray-400">
                      <span><span className="text-white font-medium">{row.aduApproved}</span> approved</span>
                      <span className="text-gray-600">&middot;</span>
                      <span className={`font-medium ${shareColor}`}>{shareDisplay}</span>
                      <span>ADU share</span>
                    </div>
                  </div>

                  {/* Desktop layout */}
                  <div className="hidden md:block col-span-3 min-w-0">
                    <span className="text-white font-medium group-hover:text-blue-400 transition-colors truncate block">
                      {row.name}
                    </span>
                  </div>
                  <div className="hidden md:block col-span-1 text-gray-500 text-sm truncate">
                    {row.county}
                  </div>
                  <div className="hidden md:block col-span-2 text-right text-gray-400 text-sm">
                    {row.totalBuildingPermits > 0 ? row.totalBuildingPermits.toLocaleString() : '—'}
                  </div>
                  <div className="hidden md:block col-span-1 text-right text-gray-400 text-sm">
                    {row.aduSubmitted}
                  </div>
                  <div className="hidden md:block col-span-1 text-right text-white text-sm">
                    {row.aduApproved}
                  </div>
                  <div className="hidden md:block col-span-1 text-right text-sm text-white">
                    {row.approvalRate}%
                  </div>
                  <div className={`hidden md:block col-span-2 text-right text-sm font-medium ${shareColor}`}>
                    {shareDisplay}
                  </div>
                  <div className="hidden md:flex col-span-1 justify-center">
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

        {/* Insight: Does Bylaw Consistency Matter? */}
        <section className="mt-12">
          <h2 className="text-xl font-bold text-white mb-2">
            Does Bylaw Consistency Matter?
          </h2>
          <p className="text-gray-400 text-sm mb-6">
            Comparing average ADU share of housing production for towns with consistent
            vs. inconsistent bylaws (among {rowsWithShareAndCompliance.length} towns
            with both datasets).
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-emerald-900/20 border border-emerald-500/20 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span className="text-emerald-400 font-bold text-sm">Consistent Bylaws</span>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{avgShare(consistentRows)}%</div>
              <div className="text-gray-400 text-xs">avg ADU share of housing production</div>
              <div className="text-gray-500 text-xs mt-2">{consistentRows.length} towns</div>
            </div>

            <div className="bg-red-900/20 border border-red-500/20 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <span className="text-red-400 font-bold text-sm">Inconsistent Bylaws</span>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{avgShare(inconsistentRows)}%</div>
              <div className="text-gray-400 text-xs">avg ADU share of housing production</div>
              <div className="text-gray-500 text-xs mt-2">{inconsistentRows.length} towns</div>
            </div>
          </div>
        </section>

        {/* Methodology */}
        <section className="mt-12 border-t border-gray-800 pt-8">
          <h3 className="text-sm font-bold text-white mb-2">Methodology</h3>
          <div className="text-gray-500 text-xs space-y-2 leading-relaxed">
            <p>
              Building permit data is from the 2024 Annual New Privately-Owned Residential Building
              Permits survey, conducted by the U.S. Census Bureau and processed by the UMass Donahue
              Institute. We use imputed columns that include estimated data for non-reporting and
              partial-reporting municipalities, providing the most complete picture.
            </p>
            <p>
              ADU data is from the EOHLC ADU Survey, published February 2026, covering the first year
              of Massachusetts&apos; ADU law (Chapter 150 of the Acts of 2024, effective Feb 2, 2025).
            </p>
            <p>
              <strong className="text-gray-400">ADU Share of Housing Production</strong> = (2025 ADU permits
              approved) / (2024 total residential units permitted) &times; 100. This metric compares ADU output
              in the first year of the law against the most recent full year of traditional housing production.
              Values above 100% indicate a town approved more ADU permits in year one than it issued total
              building permits the prior year.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
