'use client'

import Link from 'next/link'
import { useState, useMemo } from 'react'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import {
  towns,
  getStatusCounts,
  getStatewideStats,
  getTownStatusLabel,
  type TownComplianceProfile,
} from './compliance-data'

type SortKey = 'issues' | 'fewest' | 'alpha'
type StatusFilter = 'all' | 'ag' | 'not-updated' | 'updated'

export default function CompliancePage() {
  const [sortBy, setSortBy] = useState<SortKey>('issues')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [auditOpen, setAuditOpen] = useState(false)

  const statewide = useMemo(() => getStatewideStats(towns), [])

  const filtered = useMemo(() => {
    let list = [...towns]
    if (statusFilter === 'ag') {
      list = list.filter(t => t.agDisapprovals > 0)
    } else if (statusFilter === 'not-updated') {
      list = list.filter(t => {
        const counts = getStatusCounts(t.provisions)
        return counts.inconsistent > 0
      })
    } else if (statusFilter === 'updated') {
      list = list.filter(t => {
        const counts = getStatusCounts(t.provisions)
        return counts.inconsistent === 0 && t.agDisapprovals === 0
      })
    }
    return list
  }, [statusFilter])

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      if (sortBy === 'alpha') return a.name.localeCompare(b.name)
      const ca = getStatusCounts(a.provisions)
      const cb = getStatusCounts(b.provisions)
      const aIssues = ca.inconsistent + ca.review + a.agDisapprovals
      const bIssues = cb.inconsistent + cb.review + b.agDisapprovals
      if (sortBy === 'issues') return bIssues - aIssues
      return aIssues - bIssues // fewest
    })
  }, [filtered, sortBy])

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
          <span className="text-gray-400">Compliance</span>
        </nav>

        {/* Page header */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Bylaw Consistency Tracker
            </h1>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded">
              {towns.length} Towns
            </span>
          </div>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-2xl">
            How consistent are local ADU bylaws with Massachusetts Chapter 150
            and 760 CMR 71.00? Inconsistent provisions are unenforceable — we
            read the bylaws so you don&apos;t have to.
          </p>
          <p className="text-gray-500 text-sm leading-relaxed max-w-2xl mt-2">
            If a town&apos;s bylaw conflicts with state law, those provisions cannot legally be enforced — yet they still create confusion for homeowners and uncertainty for builders.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* ── STATEWIDE SNAPSHOT ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {[
              { value: statewide.totalInconsistent, label: 'Unenforceable Provisions', color: 'text-red-400' },
              { value: statewide.totalAgDisapprovals, label: 'AG Disapprovals', color: 'text-red-400' },
              { value: statewide.townsWithInconsistencies, label: 'Towns w/ Inconsistencies', color: 'text-amber-400' },
              { value: statewide.townsTracked, label: 'Towns Tracked', color: 'text-emerald-400' },
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
                <p className="mb-3">Every bylaw analysis in this tracker follows the same process:</p>
                <ol className="list-decimal list-inside space-y-2 mb-3">
                  <li>We read the full local ADU bylaw or ordinance as adopted by the municipality.</li>
                  <li>We compare each provision against Massachusetts Chapter 150 (the Affordable Homes Act) and the implementing regulations at 760 CMR 71.00.</li>
                  <li>We review all published Attorney General decisions on that town&apos;s bylaw, including partial disapprovals.</li>
                  <li>We flag provisions as <span className="text-red-400">Inconsistent</span> (conflicts with state law), <span className="text-amber-400">Needs Review</span> (gray area or discretionary), or <span className="text-emerald-400">Consistent</span> (clearly within state authority).</li>
                </ol>
                <p className="mb-3">
                  This is legal research, not legal advice. We cite specific statutes and AG decisions for every finding. Town bylaws can change — we track the latest version available and note the last update date for each municipality.
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

          {/* ── TOWN TABLE ── */}
          <div className="space-y-2">
            {sorted.map(town => (
              <TownRow key={town.slug} town={town} />
            ))}
            {sorted.length === 0 && (
              <p className="text-center text-gray-500 py-8 text-sm">
                No towns match the current filter.
              </p>
            )}
          </div>

          {/* ── METHODOLOGY NOTE ── */}
          <div className="mt-8 bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 text-xs text-gray-500 leading-relaxed">
            <p className="font-semibold text-gray-400 mb-1">Methodology</p>
            <p>
              This analysis compares each town&apos;s published ADU zoning bylaw or
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
              . Per{' '}
              <a
                href="https://www.mass.gov/info-details/accessory-dwelling-units"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline underline-offset-2"
              >
                EOHLC guidance
              </a>
              , towns are not &ldquo;out of compliance&rdquo; if their local zoning has not
              been updated — however, any local provisions inconsistent with the ADU statute
              are unenforceable as of February 2, 2025. Local permitting decisions should not
              take into account zoning rules that conflict with state law. Attorney General
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
        <p className="text-gray-500 text-xs mt-0.5">{town.county} County</p>
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
