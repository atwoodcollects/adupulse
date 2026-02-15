'use client'

import Link from 'next/link'
import { useState, useMemo } from 'react'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import {
  townEntries,
  cities,
  allEntries,
  narrativeCities,
  getStatusCounts,
  getStatewideStats,
  getTownStatusLabel,
  type TownComplianceProfile,
} from './compliance-data'
import { formatReviewDate } from '@/lib/dates'

type SortKey = 'issues' | 'fewest' | 'alpha'
type StatusFilter = 'all' | 'ag' | 'not-updated' | 'updated'

const tagConfig: Record<string, { label: string; color: string; bg: string }> = {
  'passive-resistance': { label: 'PASSIVE RESISTANCE', color: 'text-amber-400', bg: 'bg-amber-400/10' },
  'no-ordinance': { label: 'NO LOCAL ORDINANCE', color: 'text-blue-400', bg: 'bg-blue-400/10' },
  'stalled': { label: 'STALLED', color: 'text-gray-300', bg: 'bg-gray-600/30' },
}

function applyFilter(list: TownComplianceProfile[], filter: StatusFilter) {
  if (filter === 'ag') return list.filter(t => t.agDisapprovals > 0)
  if (filter === 'not-updated') return list.filter(t => getStatusCounts(t.provisions).inconsistent > 0)
  if (filter === 'updated') return list.filter(t => {
    const counts = getStatusCounts(t.provisions)
    return counts.inconsistent === 0 && t.agDisapprovals === 0
  })
  return list
}

function applySort(list: TownComplianceProfile[], sortBy: SortKey) {
  return [...list].sort((a, b) => {
    if (sortBy === 'alpha') return a.name.localeCompare(b.name)
    const ca = getStatusCounts(a.provisions)
    const cb = getStatusCounts(b.provisions)
    const aIssues = ca.inconsistent + ca.review + a.agDisapprovals
    const bIssues = cb.inconsistent + cb.review + b.agDisapprovals
    if (sortBy === 'issues') return bIssues - aIssues
    return aIssues - bIssues
  })
}

export default function CompliancePage() {
  const [sortBy, setSortBy] = useState<SortKey>('issues')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [auditOpen, setAuditOpen] = useState(false)

  const statewide = useMemo(() => getStatewideStats(allEntries), [])

  const sortedTowns = useMemo(
    () => applySort(applyFilter([...townEntries], statusFilter), sortBy),
    [statusFilter, sortBy],
  )

  const sortedCities = useMemo(
    () => applySort(applyFilter([...cities], statusFilter), sortBy),
    [statusFilter, sortBy],
  )

  return (
    <div className="min-h-screen bg-gray-900">
      <NavBar />
      <main className="px-4 py-6 sm:py-10">
        {/* Breadcrumbs */}
        <nav className="max-w-4xl mx-auto mb-6 text-sm text-gray-400">
          <Link
            href="/"
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            Dashboard
          </Link>
          <span className="mx-2 text-gray-600">/</span>
          <span className="text-gray-400">Consistency Tracker</span>
        </nav>

        {/* Page header */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Consistency Tracker
            </h1>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded">
              {allEntries.length} Communities
            </span>
          </div>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-2xl">
            How consistent are local ADU bylaws and ordinances with Massachusetts Chapter 150
            and 760 CMR 71.00? Inconsistent provisions are unenforceable — we
            read the rules so you don&apos;t have to.
          </p>
          <p className="text-gray-500 text-sm leading-relaxed max-w-2xl mt-2">
            If a community&apos;s bylaw or ordinance conflicts with state law, those provisions cannot legally be enforced — yet they still create confusion for homeowners and uncertainty for builders.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* ── STATEWIDE SNAPSHOT ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {[
              { value: statewide.totalInconsistent, label: 'Unenforceable Provisions', color: 'text-red-400' },
              { value: statewide.totalAgDisapprovals, label: 'AG Disapprovals', color: 'text-red-400' },
              { value: statewide.townsWithInconsistencies, label: 'w/ Inconsistencies', color: 'text-amber-400' },
              { value: statewide.communitiesTracked, label: 'Communities Tracked', color: 'text-emerald-400' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-gray-800 border border-gray-700 rounded-xl p-3 sm:p-4 text-center"
              >
                <p className={`text-2xl sm:text-3xl font-bold ${stat.color}`}>
                  {stat.value}
                </p>
                <p className="text-xs text-gray-400 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* ── HOW WE AUDIT ── */}
          <div className="mb-6">
            <button
              onClick={() => setAuditOpen(!auditOpen)}
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              How We Determine Inconsistencies {auditOpen ? '▾' : '▸'}
            </button>
            {auditOpen && (
              <div className="mt-3 bg-gray-800/30 border border-gray-700/50 rounded-lg p-4 text-sm text-gray-400 leading-relaxed">
                <p className="mb-3">Every analysis in this tracker follows the same process:</p>
                <ol className="list-decimal list-inside space-y-2 mb-3">
                  <li>We read the full local ADU bylaw or ordinance as adopted by the municipality.</li>
                  <li>We compare each provision against Massachusetts Chapter 150 (the Affordable Homes Act) and the implementing regulations at 760 CMR 71.00.</li>
                  <li>For towns, we review all published Attorney General decisions on that town&apos;s bylaw, including partial disapprovals. City ordinances are not subject to AG review — those inconsistencies are identified through our independent analysis.</li>
                  <li>We flag provisions as <span className="text-red-400">Inconsistent</span> (conflicts with state law), <span className="text-amber-400">Needs Review</span> (gray area or discretionary), or <span className="text-emerald-400">Consistent</span> (clearly within state authority).</li>
                </ol>
                <p className="mb-3">
                  Bylaw analysis is powered by AI to identify local provisions that may conflict with state law. AG disapprovals are independently sourced and serve as additional validation. AI analysis may not capture every nuance of local zoning interpretation — towns marked needs review reflect provisions where further legal evaluation is recommended.
                </p>
                <p className="mb-3">
                  This is legal research, not legal advice. We cite specific statutes and AG decisions for every finding. Local rules can change — we track the latest version available and note the last review date for each community.
                </p>
                <p className="text-gray-500">
                  Questions about our methodology? Contact{' '}
                  <a href="mailto:nick@adupulse.com" className="text-blue-400 hover:underline">nick@adupulse.com</a>
                </p>
              </div>
            )}
          </div>

          {/* ── SORT & FILTER ── */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div className="flex gap-2 flex-wrap">
              {([
                ['issues', 'Most Issues'],
                ['fewest', 'Fewest Issues'],
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
            <div className="flex gap-2 flex-wrap">
              {([
                ['all', 'All'],
                ['ag', 'AG Disapproval'],
                ['not-updated', 'Not Updated'],
                ['updated', 'Updated'],
              ] as const).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setStatusFilter(key)}
                  className={`px-3 py-1.5 text-xs rounded-full ${
                    statusFilter === key
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* ── TOWNS SECTION ── */}
          <div className="mb-10">
            <h2 className="text-lg font-bold text-white mb-1">Towns — AG Reviewed</h2>
            <p className="text-gray-500 text-xs mb-4">Town bylaws are subject to Attorney General review. Inconsistencies below reflect AG disapprovals and our independent analysis.</p>
            <div className="space-y-2">
              {sortedTowns.map(town => (
                <TownRow key={town.slug} town={town} />
              ))}
              {sortedTowns.length === 0 && (
                <p className="text-center text-gray-500 py-8 text-sm">
                  No towns match the current filter.
                </p>
              )}
            </div>
          </div>

          {/* ── CITIES SECTION ── */}
          <div className="mb-10">
            <h2 className="text-lg font-bold text-white mb-1">Cities — Independent Analysis</h2>
            <p className="text-gray-500 text-xs mb-3">City ordinances are not reviewed by the Massachusetts Attorney General.</p>
            <div className="mb-4 border-l-4 border-amber-500/50 bg-amber-900/10 rounded-r-lg p-4">
              <p className="text-sm text-amber-200/90 leading-relaxed">
                Unlike town bylaws, city ordinances are not reviewed by the Massachusetts Attorney General. These inconsistencies were identified through ADU Pulse&apos;s independent analysis against G.L. c. 40A &sect;3 and 760 CMR 71.00.
              </p>
            </div>
            <div className="space-y-2">
              {sortedCities.map(town => (
                <TownRow key={town.slug} town={town} />
              ))}
              {sortedCities.length === 0 && (
                <p className="text-center text-gray-500 py-8 text-sm">
                  No cities match the current filter.
                </p>
              )}
            </div>
          </div>

          {/* ── SPECIAL CASES SECTION ── */}
          {narrativeCities.length > 0 && (
            <div className="mb-10">
              <h2 className="text-lg font-bold text-white mb-1">Special Cases</h2>
              <p className="text-gray-500 text-xs mb-4">Cities with unique ADU policy situations that don&apos;t fit the standard provision-by-provision analysis.</p>
              <div className="space-y-2">
                {narrativeCities.map(city => {
                  const tag = tagConfig[city.tag] ?? tagConfig['stalled']
                  return (
                    <Link
                      key={city.slug}
                      href={`/compliance/${city.slug}`}
                      className="flex items-center gap-4 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 md:px-5 md:py-4 hover:border-gray-600 transition-colors group"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-white font-bold group-hover:text-blue-400 transition-colors truncate">
                            {city.name}
                          </span>
                          <span className={`text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded ${tag.color} ${tag.bg}`}>
                            {tag.label}
                          </span>
                        </div>
                        <p className="text-gray-500 text-xs mt-0.5 truncate">{city.summary}</p>
                      </div>
                      <div className="hidden md:flex items-center gap-3 text-xs text-gray-500 shrink-0">
                        <span>
                          <span className="text-emerald-400 font-medium">{city.permits.approved}</span> approved
                        </span>
                        <span>
                          <span className="text-white font-medium">{city.permits.approvalRate}%</span> rate
                        </span>
                      </div>
                      <svg className="w-4 h-4 text-gray-500 group-hover:text-gray-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}

          {/* ── METHODOLOGY NOTE ── */}
          <div className="mt-8 bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 text-xs text-gray-500 leading-relaxed">
            <p className="font-semibold text-gray-400 mb-1">Methodology</p>
            <p>
              This analysis compares each community&apos;s published ADU zoning bylaw or
              ordinance against Massachusetts{' '}
              <a
                href="https://malegislature.gov/Laws/SessionLaws/Acts/2024/Chapter150"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline underline-offset-2"
              >
                Chapter 150 (2024)
              </a>
              ,{' '}
              <a
                href="https://malegislature.gov/Laws/GeneralLaws/PartI/TitleVII/Chapter40A/Section3"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline underline-offset-2"
              >
                MGL c.40A §3
              </a>
              , and{' '}
              <a
                href="https://www.mass.gov/doc/760-cmr-7100-protected-use-adus-final-version/download"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline underline-offset-2"
              >
                760 CMR 71.00
              </a>
              . Town bylaws are subject to AG review; city ordinances are analyzed independently by ADU Pulse. Per{' '}
              <a
                href="https://www.mass.gov/info-details/accessory-dwelling-units"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline underline-offset-2"
              >
                EOHLC guidance
              </a>
              , communities are not &ldquo;inconsistent&rdquo; simply because their local zoning has not
              been updated — however, any local provisions inconsistent with the ADU statute
              are unenforceable as of February 2, 2025. Attorney General
              disapproval data sourced from published{' '}
              <a
                href="https://massago.onbaseonline.com/Massago/1700PublicAccess/MLU.htm"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline underline-offset-2"
              >
                AG Municipal Law Unit decisions
              </a>
              . This is not legal advice — consult a zoning attorney for project-specific
              guidance.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

// ── TOWN ROW ────────────────────────────────────────────────────────────
function TownRow({ town }: { town: TownComplianceProfile }) {
  const counts = getStatusCounts(town.provisions)
  const statusLabel = getTownStatusLabel(town)
  const total = town.provisions.length

  return (
    <Link
      href={`/compliance/${town.slug}`}
      className="flex items-center gap-4 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 md:px-5 md:py-4 hover:border-gray-600 transition-colors group"
    >
      {/* Town info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-white font-bold group-hover:text-blue-400 transition-colors truncate">
            {town.name}
          </span>
          <span className={`text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded ${statusLabel.color} ${statusLabel.bg}`}>
            {statusLabel.label}
          </span>
        </div>
        <p className="text-gray-500 text-xs mt-0.5">
          {town.county} County
          <span className="hidden lg:inline text-gray-600 ml-2">
            Reviewed {formatReviewDate(town.lastReviewed)}
          </span>
        </p>
      </div>

      {/* Stacked bar */}
      <div className="hidden sm:block w-32 shrink-0">
        <div className="h-2 bg-gray-700 rounded-full overflow-hidden flex">
          {counts.inconsistent > 0 && (
            <div
              className="bg-red-400"
              style={{ width: `${(counts.inconsistent / total) * 100}%` }}
            />
          )}
          {counts.review > 0 && (
            <div
              className="bg-amber-400"
              style={{ width: `${(counts.review / total) * 100}%` }}
            />
          )}
          {counts.compliant > 0 && (
            <div
              className="bg-emerald-400"
              style={{ width: `${(counts.compliant / total) * 100}%` }}
            />
          )}
        </div>
      </div>

      {/* Counts */}
      <div className="hidden md:flex items-center gap-3 text-xs text-gray-500 shrink-0">
        <span>
          <span className="text-red-400 font-medium">{counts.inconsistent}</span> inconsistent
        </span>
        <span>
          <span className="text-amber-400 font-medium">{counts.review}</span> review
        </span>
        <span>
          <span className="text-emerald-400 font-medium">{counts.compliant}</span> ok
        </span>
      </div>

      {/* Mobile counts */}
      <div className="flex md:hidden items-center gap-2 text-xs shrink-0">
        <span className="text-red-400 font-medium">{counts.inconsistent}</span>
        <span className="text-gray-600">/</span>
        <span className="text-amber-400 font-medium">{counts.review}</span>
        <span className="text-gray-600">/</span>
        <span className="text-emerald-400 font-medium">{counts.compliant}</span>
      </div>

      {/* Chevron */}
      <svg className="w-4 h-4 text-gray-500 group-hover:text-gray-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  )
}
