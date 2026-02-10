'use client'

import Link from 'next/link'
import TownNav from '@/components/TownNav'
import { useState } from 'react'
import type { TownSEOData } from '@/data/town_seo_data'

function ShareButtons({ town }: { town: TownSEOData }) {
  const [copied, setCopied] = useState(false)
  const url = `https://www.adupulse.com/towns/${town.slug}`
  const text = `${town.name} has ${town.approved} approved ADU permits with a ${town.approvalRate}% approval rate. See the data:`

  const handleCopy = () => {
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleCopy}
        className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs rounded-lg transition-colors"
      >
        {copied ? '✓ Copied!' : '🔗 Copy link'}
      </button>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs rounded-lg transition-colors"
      >
        𝕏 Share
      </a>
    </div>
  )
}

function StatCard({ label, value, sub, color }: { label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div className="bg-gray-800/50 border border-border rounded-lg p-3 sm:p-4 text-center">
      <div className={`text-xl sm:text-2xl font-bold ${color || 'text-white'}`}>{value}</div>
      <div className="text-text-muted text-xs mt-0.5">{label}</div>
      {sub && <div className="text-text-muted text-[10px] mt-0.5">{sub}</div>}
    </div>
  )
}

export default function TownSEOPageClient({
  town,
  nearbyTowns,
  otherTowns,
}: {
  town: TownSEOData
  nearbyTowns: TownSEOData[]
  otherTowns: TownSEOData[]
}) {
  const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-lg md:text-xl font-bold text-white tracking-tight">ADU Pulse</span>
            </Link>
            <TownNav current={town.name} />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 md:py-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-4">
          <Link href="/" className="text-blue-400 hover:underline">Dashboard</Link>
          <span className="text-gray-600">/</span>
          <Link href="/leaderboard" className="text-blue-400 hover:underline">Towns</Link>
          <span className="text-gray-600">/</span>
          <span className="text-gray-400">{town.name}</span>
        </div>

        {/* Hero */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              {town.name} ADU Permits &amp; Data
            </h1>
            <p className="text-text-secondary text-sm mt-1">
              {town.county} County &middot; Pop. {town.population.toLocaleString()} &middot; Source: {town.source}
            </p>
          </div>
          <ShareButtons town={town} />
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <StatCard label="Submitted" value={town.submitted} />
          <StatCard label="Approved" value={town.approved} color="text-emerald-400" />
          <StatCard label="Denied" value={town.denied} color="text-red-400" />
          <StatCard label="Approval Rate" value={`${town.approvalRate}%`} color={town.approvalRate >= 70 ? 'text-emerald-400' : town.approvalRate >= 50 ? 'text-amber-400' : 'text-red-400'} />
        </div>

        {/* Approval rate bar */}
        <div className="bg-gray-800/50 border border-border rounded-lg p-4 mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-text-secondary">Approval Rate</span>
            <span className="text-white font-medium">{town.approvalRate}%</span>
          </div>
          <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-700"
              style={{ width: `${town.approvalRate}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-text-muted mt-1">
            <span>{town.approved} approved</span>
            <span>{town.denied} denied &middot; {town.pending} pending</span>
          </div>
        </div>

        {/* Market context (if available) */}
        {(town.avgRent || town.medianHome) && (
          <div className="grid sm:grid-cols-2 gap-3 mb-6">
            {town.avgRent && (
              <div className="bg-gray-800/50 border border-border rounded-lg p-4">
                <div className="text-text-muted text-xs mb-1">Average Rent</div>
                <div className="text-2xl font-bold text-white">{fmt(town.avgRent)}<span className="text-text-muted text-sm font-normal">/mo</span></div>
                <div className="text-text-muted text-xs mt-1">Potential ADU rental income (conservative: {fmt(town.avgRent * 0.85)}/mo)</div>
              </div>
            )}
            {town.medianHome && (
              <div className="bg-gray-800/50 border border-border rounded-lg p-4">
                <div className="text-text-muted text-xs mb-1">Median Home Value</div>
                <div className="text-2xl font-bold text-white">{fmt(town.medianHome)}</div>
                <div className="text-text-muted text-xs mt-1">Est. ADU property uplift: {fmt(town.medianHome * 0.15)} - {fmt(town.medianHome * 0.20)}</div>
              </div>
            )}
          </div>
        )}

        {/* Local context */}
        <div className="bg-gray-800/50 border border-border rounded-lg p-5 mb-6">
          <h2 className="text-white font-bold mb-3">ADUs in {town.name}</h2>
          <div className="text-gray-400 text-sm leading-relaxed space-y-3">
            <p>
              {town.name} has received {town.submitted} ADU applications since Massachusetts&apos; by-right ADU law took effect.
              Of those, {town.approved} have been approved ({town.approvalRate}% approval rate),
              {town.denied > 0 ? ` ${town.denied} denied,` : ''}
              and {town.pending} are still pending review.
            </p>
            {town.byRight && (
              <p>
                Under the state&apos;s 2024 by-right law, single-family homeowners in {town.name} can build one ADU on their property without a special permit in most cases. This has significantly streamlined the approval process compared to the previous zoning-based approach.
              </p>
            )}
            {town.notes && <p>{town.notes}</p>}
            <p>
              For detailed cost estimates specific to {town.name}, use our{' '}
              <Link href="/estimate" className="text-blue-400 hover:underline">Cost Estimator</Link>.
              To compare {town.name} with other towns, check the{' '}
              <Link href="/leaderboard" className="text-blue-400 hover:underline">ADU Leaderboard</Link>.
            </p>
          </div>
        </div>

        {/* By-right explainer */}
        {town.byRight && (
          <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/20 rounded-lg p-5 mb-6">
            <h3 className="text-white font-bold mb-2">By-Right ADU Rules in {town.name}</h3>
            <div className="text-gray-400 text-sm leading-relaxed space-y-2">
              <p>
                Massachusetts&apos; 2024 ADU law allows single-family homeowners to build one ADU by right.
                In {town.name}, this generally means:
              </p>
              <div className="grid sm:grid-cols-2 gap-3 mt-3">
                <div className="flex gap-2 items-start">
                  <span className="text-emerald-400 mt-0.5">✓</span>
                  <span>No special permit or variance required</span>
                </div>
                <div className="flex gap-2 items-start">
                  <span className="text-emerald-400 mt-0.5">✓</span>
                  <span>Standard building permit process</span>
                </div>
                <div className="flex gap-2 items-start">
                  <span className="text-emerald-400 mt-0.5">✓</span>
                  <span>Up to 900 sq ft or 50% of primary dwelling</span>
                </div>
                <div className="flex gap-2 items-start">
                  <span className="text-emerald-400 mt-0.5">✓</span>
                  <span>Owner occupancy in either unit required</span>
                </div>
              </div>
              {town.localPermitUrl && (
                <p className="mt-3">
                  <a href={town.localPermitUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                    {town.name} permit office →
                  </a>
                </p>
              )}
            </div>
          </div>
        )}

        {/* CTAs */}
        <div className="grid sm:grid-cols-3 gap-3 mb-8">
          <Link
            href="/estimate"
            className="bg-blue-600 hover:bg-blue-500 text-white text-center py-3 px-4 rounded-lg font-medium text-sm transition-colors"
          >
            💰 Estimate ADU Cost
          </Link>
          <Link
            href="/quiz"
            className="bg-gray-700 hover:bg-gray-600 text-white text-center py-3 px-4 rounded-lg font-medium text-sm transition-colors"
          >
            📝 Take ADU Quiz
          </Link>
          <Link
            href="/club"
            className="bg-gray-700 hover:bg-gray-600 text-white text-center py-3 px-4 rounded-lg font-medium text-sm transition-colors"
          >
            👥 Join {town.name} Group
          </Link>
        </div>

        {/* Nearby towns */}
        {nearbyTowns.length > 0 && (
          <div className="mb-6">
            <h2 className="text-white font-bold mb-3">Other {town.county} County Towns</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {nearbyTowns.map(t => (
                <Link
                  key={t.slug}
                  href={`/towns/${t.slug}`}
                  className="bg-gray-800/50 border border-border rounded-lg p-4 hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-white font-medium">{t.name}</div>
                      <div className="text-text-muted text-xs mt-0.5">{t.approved} approved &middot; {t.approvalRate}% rate</div>
                    </div>
                    <span className="text-blue-400 text-sm">→</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* More towns */}
        {otherTowns.length > 0 && (
          <div className="mb-6">
            <h2 className="text-white font-bold mb-3">More Massachusetts Towns</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {otherTowns.map(t => (
                <Link
                  key={t.slug}
                  href={`/towns/${t.slug}`}
                  className="text-blue-400 text-sm hover:underline py-1"
                >
                  {t.name} ({t.approved} approved)
                </Link>
              ))}
              <Link href="/leaderboard" className="text-gray-500 text-sm hover:text-white py-1">
                View all towns →
              </Link>
            </div>
          </div>
        )}

        {/* Data source note */}
        <div className="text-text-muted text-xs leading-relaxed p-3 bg-gray-800/20 rounded-lg border border-border/50">
          Data source: {town.source}. Population: 2024 Census ACS estimates.
          {town.avgRent && ' Rent data: aggregated listing platforms.'} See our{' '}
          <Link href="/methodology" className="text-blue-400 hover:underline">methodology</Link> for details on data collection, definitions, and known limitations.
        </div>
      </main>

      <footer className="border-t border-gray-800 mt-12">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 text-xs text-gray-500">
            <div>&copy; 2026 ADU Pulse</div>
            <div className="flex gap-4">
              <Link href="/" className="hover:text-white">Home</Link>
              <Link href="/estimate" className="hover:text-white">Estimator</Link>
              <Link href="/blog" className="hover:text-white">Blog</Link>
              <Link href="/methodology" className="hover:text-white">Methodology</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
