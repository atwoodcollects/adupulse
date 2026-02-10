'use client'

import Link from 'next/link'
import TownNav from '@/components/TownNav'
import { useState, useEffect } from 'react'
import { useTown } from '@/contexts/TownContext'
import type { TownSEOData } from '@/data/town_seo_data'

// --- Share Component with multiple channels ---
function ShareButtons({ town, variant = 'default' }: { town: TownSEOData; variant?: 'default' | 'insight' }) {
  const [copied, setCopied] = useState(false)
  const url = `https://www.adupulse.com/towns/${town.slug}`

  const shareTexts = {
    default: `${town.name} has ${town.approved} approved ADU permits with a ${town.approvalRate}% approval rate.`,
    insight: town.approvalRate >= 80
      ? `${town.name} approves ADUs at ${town.approvalRate}% — way above the state average!`
      : town.approvalRate >= 50
      ? `${town.name}'s ADU approval rate is ${town.approvalRate}%. See how it compares.`
      : `${town.name} is approving just ${town.approvalRate}% of ADU applications. Here's the data.`,
  }

  const text = shareTexts[variant]

  const handleCopy = () => {
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleNativeShare = () => {
    if (navigator.share) {
      navigator.share({ title: `${town.name} ADU Data`, text, url })
    }
  }

  const canNativeShare = typeof navigator !== 'undefined' && !!navigator.share

  return (
    <div className="flex flex-wrap items-center gap-2">
      {canNativeShare && (
        <button onClick={handleNativeShare}
          className="px-3 py-2 sm:py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs rounded-lg transition-colors min-h-[44px] sm:min-h-0 font-medium">
          📤 Share
        </button>
      )}
      <button onClick={handleCopy}
        className="px-3 py-2 sm:py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs rounded-lg transition-colors min-h-[44px] sm:min-h-0">
        {copied ? '✓ Copied!' : '🔗 Copy link'}
      </button>
      <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`}
        target="_blank" rel="noopener noreferrer"
        className="px-3 py-2 sm:py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs rounded-lg transition-colors min-h-[44px] sm:min-h-0">
        𝕏 Share
      </a>
      <a href={`sms:?body=${encodeURIComponent(text + ' ' + url)}`}
        className="sm:hidden px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs rounded-lg transition-colors min-h-[44px]">
        💬 Text
      </a>
      <a href={`mailto:?subject=${encodeURIComponent(`${town.name} ADU Data`)}&body=${encodeURIComponent(text + '\n\n' + url)}`}
        className="px-3 py-2 sm:py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs rounded-lg transition-colors min-h-[44px] sm:min-h-0">
        ✉️ Email
      </a>
    </div>
  )
}

// --- Progressive Disclosure Card ---
function InsightCard({ title, value, color, children, defaultOpen = false }: {
  title: string; value: string | number; color?: string; children: React.ReactNode; defaultOpen?: boolean
}) {
  const [expanded, setExpanded] = useState(defaultOpen)

  return (
    <div className="bg-gray-800/50 border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 text-left min-h-[64px] hover:bg-gray-700/30 active:bg-gray-700/50 transition-colors"
      >
        <div>
          <div className="text-text-muted text-xs mb-0.5">{title}</div>
          <div className={`text-xl sm:text-2xl font-bold ${color || 'text-white'}`}>{value}</div>
        </div>
        <span className={`text-gray-500 text-sm transition-transform ${expanded ? 'rotate-180' : ''}`}>▼</span>
      </button>
      {expanded && (
        <div className="px-4 pb-4 border-t border-border/50 pt-3">
          {children}
        </div>
      )}
    </div>
  )
}

// --- State average for comparison ---
const STATE_AVG_RATE = 69

export default function TownSEOPageClient({ town, nearbyTowns, otherTowns }: {
  town: TownSEOData; nearbyTowns: TownSEOData[]; otherTowns: TownSEOData[]
}) {
  const { setSelectedTown } = useTown()
  const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)

  // Remember this town selection
  useEffect(() => {
    setSelectedTown(town.name)
  }, [town.name, setSelectedTown])

  const vsAvg = town.approvalRate - STATE_AVG_RATE
  const vsLabel = vsAvg > 0
    ? `${vsAvg}pt above state average`
    : vsAvg < 0
    ? `${Math.abs(vsAvg)}pt below state average`
    : 'At state average'

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

        {/* Hero — one key insight first */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
            {town.name} ADU Permits
          </h1>
          <p className="text-text-secondary text-sm">
            {town.county} County · Pop. {town.population.toLocaleString()} · Source: {town.source}
          </p>
        </div>

        {/* The ONE key insight — approval likelihood */}
        <div className={`rounded-xl p-5 sm:p-6 mb-4 border ${
          town.approvalRate >= 80 ? 'bg-emerald-900/20 border-emerald-500/30' :
          town.approvalRate >= 50 ? 'bg-amber-900/20 border-amber-500/30' :
          'bg-red-900/20 border-red-500/30'
        }`}>
          <div className="text-xs uppercase tracking-widest text-gray-400 mb-2">Approval Likelihood</div>
          <div className="flex items-end gap-3 mb-2">
            <span className={`text-4xl sm:text-5xl font-bold ${
              town.approvalRate >= 80 ? 'text-emerald-400' :
              town.approvalRate >= 50 ? 'text-amber-400' :
              'text-red-400'
            }`}>
              {town.approvalRate >= 80 ? 'High' : town.approvalRate >= 50 ? 'Medium' : 'Low'}
            </span>
            <span className="text-gray-400 text-lg mb-1">({town.approvalRate}%)</span>
          </div>
          <p className="text-gray-400 text-sm">{vsLabel} · {town.approved} of {town.submitted} applications approved</p>
        </div>

        {/* Share prompt — right after the key insight */}
        <div className="mb-6">
          <ShareButtons town={town} variant="insight" />
        </div>

        {/* Progressive disclosure cards */}
        <div className="space-y-3 mb-6">
          {/* Permit breakdown */}
          <InsightCard
            title="Permit Activity"
            value={`${town.submitted} submitted`}
            defaultOpen={false}
          >
            <div className="grid grid-cols-3 gap-3 mb-3">
              <div className="text-center bg-gray-900/50 rounded-lg p-2.5">
                <div className="text-emerald-400 font-bold text-lg">{town.approved}</div>
                <div className="text-text-muted text-[10px]">Approved</div>
              </div>
              <div className="text-center bg-gray-900/50 rounded-lg p-2.5">
                <div className="text-red-400 font-bold text-lg">{town.denied}</div>
                <div className="text-text-muted text-[10px]">Denied</div>
              </div>
              <div className="text-center bg-gray-900/50 rounded-lg p-2.5">
                <div className="text-amber-400 font-bold text-lg">{town.pending}</div>
                <div className="text-text-muted text-[10px]">Pending</div>
              </div>
            </div>
            {/* Approval bar */}
            <div className="h-3 bg-gray-700 rounded-full overflow-hidden mb-1">
              <div className="h-full bg-emerald-500 rounded-full transition-all duration-700" style={{ width: `${town.approvalRate}%` }} />
            </div>
            <div className="flex justify-between text-xs text-text-muted">
              <span>{town.approved} approved</span>
              <span>{town.denied} denied · {town.pending} pending</span>
            </div>
          </InsightCard>

          {/* Market context */}
          {(town.avgRent || town.medianHome) && (
            <InsightCard
              title="Market Context"
              value={town.avgRent ? `${fmt(town.avgRent)}/mo avg rent` : fmt(town.medianHome || 0)}
            >
              <div className="space-y-3">
                {town.avgRent && (
                  <div className="flex justify-between items-center">
                    <span className="text-text-muted text-sm">ADU rental potential (conservative)</span>
                    <span className="text-emerald-400 font-medium">{fmt(town.avgRent * 0.85)}/mo</span>
                  </div>
                )}
                {town.medianHome && (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-text-muted text-sm">Median home value</span>
                      <span className="text-white font-medium">{fmt(town.medianHome)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-text-muted text-sm">Est. ADU property uplift</span>
                      <span className="text-emerald-400 font-medium">{fmt(town.medianHome * 0.15)} – {fmt(town.medianHome * 0.20)}</span>
                    </div>
                  </>
                )}
                <Link href="/estimate" className="block text-blue-400 text-sm hover:underline mt-2">
                  Get a detailed cost estimate for {town.name} →
                </Link>
              </div>
            </InsightCard>
          )}

          {/* By-right info */}
          {town.byRight && (
            <InsightCard title="Permitting" value="By-right eligible" color="text-emerald-400">
              <div className="text-gray-400 text-sm leading-relaxed space-y-2">
                <p>Under the state&apos;s 2024 by-right law, single-family homeowners in {town.name} can build one ADU without a special permit.</p>
                <div className="grid sm:grid-cols-2 gap-2 mt-3">
                  {[
                    'No special permit or variance',
                    'Standard building permit process',
                    'Up to 900 sf or 50% of primary',
                    'Owner occupancy in either unit',
                  ].map((text, i) => (
                    <div key={i} className="flex gap-2 items-start min-h-[32px]">
                      <span className="text-emerald-400 mt-0.5 shrink-0">✓</span>
                      <span className="text-sm">{text}</span>
                    </div>
                  ))}
                </div>
                {town.localPermitUrl && (
                  <a href={town.localPermitUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline text-sm block mt-2">
                    {town.name} permit office →
                  </a>
                )}
              </div>
            </InsightCard>
          )}

          {/* What people like you do */}
          <InsightCard title="People Like You" value={`Usually build ${town.approvalRate >= 70 ? 'detached' : 'conversion'} ADUs`}>
            <div className="text-gray-400 text-sm leading-relaxed space-y-3">
              <p>
                In towns like {town.name}, most homeowners spend <span className="text-white font-medium">$270K–$340K</span> on
                a {town.approvalRate >= 70 ? 'detached' : 'conversion'} ADU and see a payback in <span className="text-white font-medium">7–9 years</span> through
                rental income.
              </p>
              <div className="bg-gray-900/50 rounded-lg p-3">
                <div className="text-xs text-text-muted mb-2 uppercase tracking-wider">Typical {town.name} ADU</div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <div className="text-white font-bold">750–900</div>
                    <div className="text-text-muted text-[10px]">Sq ft</div>
                  </div>
                  <div>
                    <div className="text-white font-bold">$285K</div>
                    <div className="text-text-muted text-[10px]">Median cost</div>
                  </div>
                  <div>
                    <div className="text-emerald-400 font-bold">8.2yr</div>
                    <div className="text-text-muted text-[10px]">Payback</div>
                  </div>
                </div>
              </div>
              <Link href="/estimate" className="block text-blue-400 text-sm hover:underline">
                Customize this estimate for your project →
              </Link>
            </div>
          </InsightCard>
        </div>

        {/* Local context prose */}
        <div className="bg-gray-800/50 border border-border rounded-xl p-5 mb-6">
          <h2 className="text-white font-bold mb-3">ADUs in {town.name}</h2>
          <div className="text-gray-400 text-sm leading-relaxed space-y-3">
            <p>
              {town.name} has received {town.submitted} ADU applications since Massachusetts&apos; by-right ADU law took effect.
              Of those, {town.approved} have been approved ({town.approvalRate}% approval rate){town.denied > 0 ? `, ${town.denied} denied,` : ''}
              and {town.pending} are still pending review.
            </p>
            {town.notes && <p>{town.notes}</p>}
          </div>
        </div>

        {/* CTAs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
          <Link href="/estimate"
            className="bg-blue-600 hover:bg-blue-500 text-white text-center py-3.5 sm:py-3 px-4 rounded-xl font-medium text-sm transition-colors min-h-[48px] flex items-center justify-center gap-2">
            💰 Estimate ADU Cost
          </Link>
          <Link href="/quiz"
            className="bg-gray-700 hover:bg-gray-600 text-white text-center py-3.5 sm:py-3 px-4 rounded-xl font-medium text-sm transition-colors min-h-[48px] flex items-center justify-center gap-2">
            📝 Take ADU Quiz
          </Link>
          <Link href="/club"
            className="bg-gray-700 hover:bg-gray-600 text-white text-center py-3.5 sm:py-3 px-4 rounded-xl font-medium text-sm transition-colors min-h-[48px] flex items-center justify-center gap-2">
            👥 Join {town.name} Group
          </Link>
        </div>

        {/* Nearby towns */}
        {nearbyTowns.length > 0 && (
          <div className="mb-6">
            <h2 className="text-white font-bold mb-3">Other {town.county} County Towns</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {nearbyTowns.map(t => (
                <Link key={t.slug} href={`/towns/${t.slug}`}
                  className="bg-gray-800/50 border border-border rounded-xl p-4 hover:bg-gray-700/50 active:bg-gray-700 transition-colors min-h-[56px] flex items-center">
                  <div className="flex justify-between items-center w-full">
                    <div>
                      <div className="text-white font-medium">{t.name}</div>
                      <div className="text-text-muted text-xs mt-0.5">{t.approved} approved · {t.approvalRate}% rate</div>
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
                <Link key={t.slug} href={`/towns/${t.slug}`}
                  className="text-blue-400 text-sm hover:underline py-2 min-h-[44px] flex items-center">
                  {t.name} ({t.approved} approved)
                </Link>
              ))}
              <Link href="/leaderboard" className="text-gray-500 text-sm hover:text-white py-2 min-h-[44px] flex items-center">
                View all towns →
              </Link>
            </div>
          </div>
        )}

        {/* Data source note */}
        <div className="text-text-muted text-xs leading-relaxed p-3 bg-gray-800/20 rounded-lg border border-border/50">
          Data source: {town.source}. Population: 2024 Census ACS estimates.
          {town.avgRent && ' Rent data: aggregated listing platforms.'} See our{' '}
          <Link href="/methodology" className="text-blue-400 hover:underline">methodology</Link> for details.
        </div>
      </main>

      <footer className="border-t border-gray-800 mt-12">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 text-xs text-gray-500">
            <div>&copy; 2026 ADU Pulse</div>
            <div className="flex gap-4">
              <Link href="/" className="hover:text-white min-h-[44px] flex items-center">Home</Link>
              <Link href="/estimate" className="hover:text-white min-h-[44px] flex items-center">Estimator</Link>
              <Link href="/blog" className="hover:text-white min-h-[44px] flex items-center">Blog</Link>
              <Link href="/methodology" className="hover:text-white min-h-[44px] flex items-center">Methodology</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
