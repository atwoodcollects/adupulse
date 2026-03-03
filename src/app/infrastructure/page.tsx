import { Metadata } from 'next'
import Link from 'next/link'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import { infrastructureTowns, getStatusCounts, getTownStatusLabel } from './infrastructure-data'

export const metadata: Metadata = {
  title: 'Infrastructure Tracker — Local BoH Rules vs. Title 5 | ADU Pulse',
  description:
    'Where local Board of Health septic rules exceed Title 5 minimums — and what that means for ADU feasibility in Massachusetts.',
  openGraph: {
    title: 'Infrastructure Tracker — Local BoH Rules vs. Title 5 | ADU Pulse',
    description:
      'Where local Board of Health septic rules exceed Title 5 minimums — and what that means for ADU feasibility in Massachusetts.',
    url: 'https://www.adupulse.com/infrastructure',
    siteName: 'ADU Pulse',
    type: 'website',
  },
  alternates: { canonical: 'https://www.adupulse.com/infrastructure' },
}

export default function InfrastructurePage() {
  return (
    <div className="min-h-screen bg-gray-900">
      <NavBar current="Infrastructure" />
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
          <span className="text-gray-400">Infrastructure Tracker</span>
        </nav>

        {/* Page header */}
        <div className="max-w-4xl mx-auto mb-4">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Infrastructure Tracker
            </h1>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded">
              {infrastructureTowns.length} {infrastructureTowns.length === 1 ? 'Community' : 'Communities'}
            </span>
          </div>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-2xl mb-4">
            Where local Board of Health rules exceed Title 5 minimums &mdash; and what that means for ADU feasibility.
          </p>
          <div className="border-l-4 border-blue-500/50 bg-blue-900/10 rounded-r-lg p-4 max-w-2xl">
            <p className="text-sm text-blue-200/90 leading-relaxed">
              Massachusetts law (M.G.L. c. 111, &sect; 31) authorizes local Boards of Health to adopt
              septic regulations stricter than the state Title 5 baseline. This tracker identifies where
              local rules exceed state minimums and assesses the practical impact on ADU development.
              Exceeding Title 5 is not a legal deficiency &mdash; it is an exercise of granted local authority.
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Town cards */}
          <div className="space-y-2 mb-10">
            {infrastructureTowns.map(town => {
              const counts = getStatusCounts(town.provisions)
              const statusLabel = getTownStatusLabel(town)
              const total = town.provisions.length

              return (
                <Link
                  key={town.slug}
                  href={`/infrastructure/${town.slug}`}
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
                      {town.county}
                    </p>
                  </div>

                  {/* Stacked bar */}
                  <div className="hidden sm:block w-32 shrink-0">
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden flex">
                      {counts.barrier > 0 && (
                        <div
                          className="bg-red-400"
                          style={{ width: `${(counts.barrier / total) * 100}%` }}
                        />
                      )}
                      {counts.exceeds > 0 && (
                        <div
                          className="bg-orange-400"
                          style={{ width: `${(counts.exceeds / total) * 100}%` }}
                        />
                      )}
                      {counts.review > 0 && (
                        <div
                          className="bg-amber-400"
                          style={{ width: `${(counts.review / total) * 100}%` }}
                        />
                      )}
                      {counts.consistent > 0 && (
                        <div
                          className="bg-emerald-400"
                          style={{ width: `${(counts.consistent / total) * 100}%` }}
                        />
                      )}
                    </div>
                  </div>

                  {/* Counts */}
                  <div className="hidden md:flex items-center gap-3 text-xs text-gray-500 shrink-0">
                    <span>
                      <span className="text-orange-400 font-medium">{counts.exceeds}</span> exceeds
                    </span>
                    <span>
                      <span className="text-red-400 font-medium">{counts.barrier}</span> barrier
                    </span>
                    <span>
                      <span className="text-emerald-400 font-medium">{counts.consistent}</span> ok
                    </span>
                  </div>

                  {/* Mobile counts */}
                  <div className="flex md:hidden items-center gap-2 text-xs shrink-0">
                    <span className="text-orange-400 font-medium">{counts.exceeds}</span>
                    <span className="text-gray-600">/</span>
                    <span className="text-red-400 font-medium">{counts.barrier}</span>
                    <span className="text-gray-600">/</span>
                    <span className="text-emerald-400 font-medium">{counts.consistent}</span>
                  </div>

                  {/* Chevron */}
                  <svg className="w-4 h-4 text-gray-500 group-hover:text-gray-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              )
            })}
          </div>

          {/* Methodology note */}
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 text-xs text-gray-500 leading-relaxed">
            <p className="font-semibold text-gray-400 mb-1">Methodology</p>
            <p>
              This analysis compares local Board of Health supplementary rules against the state
              Title 5 baseline (
              <a
                href="https://www.law.cornell.edu/regulations/massachusetts/310-CMR-15-211"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline underline-offset-2"
              >
                310 CMR 15.000
              </a>
              ). Unlike zoning &mdash; where Chapter 150 preempts certain local restrictions &mdash; local
              Boards of Health are explicitly authorized under{' '}
              <a
                href="https://malegislature.gov/Laws/GeneralLaws/PartI/TitleXVI/Chapter111/Section31"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline underline-offset-2"
              >
                M.G.L. c. 111, &sect; 31
              </a>
              {' '}to adopt standards stricter than Title 5. Exceeding the state baseline is not a legal
              deficiency. This analysis measures the gap between local and state requirements and assesses
              practical impact on ADU feasibility. It does not constitute legal advice.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
