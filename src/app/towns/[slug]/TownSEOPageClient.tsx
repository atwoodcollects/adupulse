'use client'

import Link from 'next/link'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import { useState, useEffect, useMemo } from 'react'
import { useTown } from '@/contexts/TownContext'
import type { TownSEOData } from '@/data/town_seo_data'
import {
  approvalsPerThousandParcels,
  submittedPerThousandParcels,
  computeTimelines,
  computeCostStats,
  computeScorecard,
  generateCSV,
  generatePermitCSV,
  downloadCSV,
  type PermitRecord,
  type TimelineStats,
  type CostStats,
  type TownScorecard,
} from '@/lib/townAnalytics'

// Permit data imports (dynamic)
import andoverPermits from '@/data/andover_permits.json'
import miltonPermits from '@/data/milton_permits.json'
import plymouthPermits from '@/data/plymouth_permits.json'
import duxburyPermits from '@/data/duxbury_permits.json'
import falmouthPermits from '@/data/falmouth_permits.json'
import sudburyPermits from '@/data/sudbury_permits.json'
import newtonPermits from '@/data/newton_permits.json'
import needhamPermits from '@/data/needham_permits.json'

const permitDataMap: Record<string, PermitRecord[]> = {
  andover: andoverPermits as PermitRecord[],
  milton: miltonPermits as PermitRecord[],
  plymouth: plymouthPermits as PermitRecord[],
  duxbury: duxburyPermits as PermitRecord[],
  falmouth: falmouthPermits as PermitRecord[],
  sudbury: sudburyPermits as PermitRecord[],
  newton: newtonPermits as PermitRecord[],
  needham: needhamPermits as PermitRecord[],
}

// --- Share Component ---
function ShareButtons({ town, variant = 'default' }: { town: TownSEOData; variant?: 'default' | 'insight' }) {
  const [copied, setCopied] = useState(false)
  const [canNativeShare, setCanNativeShare] = useState(false)
  useEffect(() => { setCanNativeShare(!!navigator?.share) }, [])
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
  const handleCopy = () => { navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2000) }
  const handleNativeShare = () => { if (navigator.share) navigator.share({ title: `${town.name} ADU Data`, text, url }) }
  return (
    <div className="flex flex-wrap items-center gap-2">
      {canNativeShare && (
        <button onClick={handleNativeShare} className="px-3 py-2 sm:py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs rounded-lg transition-colors min-h-[44px] sm:min-h-0 font-medium">📤 Share</button>
      )}
      <button onClick={handleCopy} className="px-3 py-2 sm:py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs rounded-lg transition-colors min-h-[44px] sm:min-h-0">{copied ? '✓ Copied!' : '🔗 Copy link'}</button>
      <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer" className="px-3 py-2 sm:py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs rounded-lg transition-colors min-h-[44px] sm:min-h-0">𝕏 Share</a>
      <a href={`sms:?body=${encodeURIComponent(text + ' ' + url)}`} className="sm:hidden px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs rounded-lg transition-colors min-h-[44px]">💬 Text</a>
      <a href={`mailto:?subject=${encodeURIComponent(`${town.name} ADU Data`)}&body=${encodeURIComponent(text + '\n\n' + url)}`} className="px-3 py-2 sm:py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs rounded-lg transition-colors min-h-[44px] sm:min-h-0">✉️ Email</a>
    </div>
  )
}

// --- Progressive Disclosure Card ---
function InsightCard({ title, value, color, children, defaultOpen = false, badge }: {
  title: string; value: string | number; color?: string; children: React.ReactNode; defaultOpen?: boolean; badge?: string
}) {
  const [expanded, setExpanded] = useState(defaultOpen)
  return (
    <div className="bg-gray-800/50 border border-border rounded-xl overflow-hidden">
      <button onClick={() => setExpanded(!expanded)} className="w-full flex items-center justify-between p-4 text-left min-h-[64px] hover:bg-gray-700/30 active:bg-gray-700/50 transition-colors">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <div className="text-text-muted text-xs mb-0.5">{title}</div>
            {badge && <span className="text-[10px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded-full">{badge}</span>}
          </div>
          <div className={`text-xl sm:text-2xl font-bold ${color || 'text-white'} truncate`}>{value}</div>
        </div>
        <span className={`text-gray-500 text-sm transition-transform ml-2 shrink-0 ${expanded ? 'rotate-180' : ''}`}>▼</span>
      </button>
      {expanded && <div className="px-4 pb-4 border-t border-border/50 pt-3">{children}</div>}
    </div>
  )
}

// --- Score Bar Component ---
function ScoreBar({ label, score, color }: { label: string; score: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-400">{label}</span>
        <span className="text-white font-medium">{score}/100</span>
      </div>
      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${score}%` }} />
      </div>
    </div>
  )
}

// --- Builder Alert Signup ---
function BuilderAlertSignup({ town }: { town: TownSEOData }) {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [role, setRole] = useState<'builder' | 'homeowner' | 'lender' | ''>('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Wire to API/Supabase
    console.log('Alert signup:', { email, role, town: town.slug })
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-xl p-4 text-center">
        <div className="text-emerald-400 font-medium mb-1">✓ You&apos;re on the list</div>
        <p className="text-gray-400 text-sm">We&apos;ll email you when new permits are filed in {town.name}.</p>
      </div>
    )
  }

  return (
    <div className="bg-gray-800/50 border border-blue-500/30 rounded-xl p-4 sm:p-5">
      <div className="flex items-start gap-3 mb-3">
        <span className="text-2xl">🔔</span>
        <div>
          <h3 className="text-white font-bold text-sm">Get {town.name} ADU Alerts</h3>
          <p className="text-gray-400 text-xs mt-0.5">New permits, approval changes, and market updates for {town.name}.</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {(['builder', 'homeowner', 'lender'] as const).map(r => (
            <button key={r} type="button" onClick={() => setRole(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors min-h-[36px] ${role === r ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'}`}>
              {r === 'builder' ? '🔨 Builder' : r === 'homeowner' ? '🏠 Homeowner' : '🏦 Lender'}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input type="email" required placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)}
            className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 min-h-[44px]" />
          <button type="submit" disabled={!email || !role}
            className="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors min-h-[44px] shrink-0">
            Subscribe
          </button>
        </div>
      </form>
    </div>
  )
}

// --- Timeline Display ---
function TimelineDisplay({ stats }: { stats: TimelineStats }) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-3">
        <div className="text-center bg-gray-900/50 rounded-lg p-2.5">
          <div className="text-emerald-400 font-bold text-lg">{stats.minDays}d</div>
          <div className="text-text-muted text-[10px]">Fastest</div>
        </div>
        <div className="text-center bg-gray-900/50 rounded-lg p-2.5">
          <div className="text-blue-400 font-bold text-lg">{stats.medianDays}d</div>
          <div className="text-text-muted text-[10px]">Median</div>
        </div>
        <div className="text-center bg-gray-900/50 rounded-lg p-2.5">
          <div className="text-amber-400 font-bold text-lg">{stats.maxDays}d</div>
          <div className="text-text-muted text-[10px]">Slowest</div>
        </div>
      </div>
      {/* Individual permit timelines */}
      <div className="space-y-1.5">
        {stats.permits.map((p, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <div className="w-24 sm:w-32 text-gray-500 truncate">{p.address}</div>
            <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min(100, (p.days / stats.maxDays) * 100)}%` }} />
            </div>
            <div className="text-white font-medium w-10 text-right">{p.days}d</div>
          </div>
        ))}
      </div>
      <p className="text-gray-500 text-xs">Based on {stats.count} issued permits with application and issue dates.</p>
    </div>
  )
}

// --- Permit Table ---
function PermitTable({ permits, town }: { permits: PermitRecord[]; town: TownSEOData }) {
  const [showAll, setShowAll] = useState(false)
  const displayed = showAll ? permits : permits.slice(0, 5)
  const fmt = (n: number) => n > 0 ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n) : '—'

  return (
    <div>
      {/* Mobile card view */}
      <div className="sm:hidden space-y-2">
        {displayed.map((p, i) => (
          <div key={i} className="bg-gray-900/50 rounded-lg p-3 text-sm">
            <div className="flex justify-between items-start mb-1.5">
              <div className="text-white font-medium text-xs">{p.address}</div>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                p.status === 'Issued' ? 'bg-emerald-500/20 text-emerald-400' :
                p.status === 'Pending' ? 'bg-amber-500/20 text-amber-400' :
                p.status === 'Rejected' ? 'bg-red-500/20 text-red-400' :
                'bg-gray-500/20 text-gray-400'
              }`}>{p.status}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs text-gray-400">
              <div><span className="text-gray-600">Type:</span> {p.type}</div>
              <div><span className="text-gray-600">Cost:</span> {fmt(p.cost)}</div>
              <div><span className="text-gray-600">Sqft:</span> {p.sqft || '—'}</div>
            </div>
            {p.contractor && p.contractor !== 'TBD' && (
              <div className="text-xs text-gray-500 mt-1">📎 {p.contractor}</div>
            )}
          </div>
        ))}
      </div>
      {/* Desktop table view */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-500 text-xs border-b border-gray-700">
              <th className="text-left py-2 pr-3">Address</th>
              <th className="text-left py-2 pr-3">Type</th>
              <th className="text-left py-2 pr-3">Status</th>
              <th className="text-right py-2 pr-3">Cost</th>
              <th className="text-right py-2 pr-3">Sqft</th>
              <th className="text-left py-2">Contractor</th>
            </tr>
          </thead>
          <tbody>
            {displayed.map((p, i) => (
              <tr key={i} className="border-b border-gray-800/50 text-gray-300">
                <td className="py-2 pr-3 text-white text-xs">{p.address}</td>
                <td className="py-2 pr-3 text-xs">{p.type}</td>
                <td className="py-2 pr-3">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                    p.status === 'Issued' ? 'bg-emerald-500/20 text-emerald-400' :
                    p.status === 'Pending' ? 'bg-amber-500/20 text-amber-400' :
                    p.status === 'Rejected' ? 'bg-red-500/20 text-red-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>{p.status}</span>
                </td>
                <td className="py-2 pr-3 text-right text-xs">{fmt(p.cost)}</td>
                <td className="py-2 pr-3 text-right text-xs">{p.sqft || '—'}</td>
                <td className="py-2 text-xs text-gray-500 max-w-[180px] truncate">{p.contractor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {permits.length > 5 && !showAll && (
        <button onClick={() => setShowAll(true)} className="text-blue-400 text-sm hover:underline mt-3 min-h-[44px]">
          Show all {permits.length} permits →
        </button>
      )}
    </div>
  )
}

// --- State average ---
const STATE_AVG_RATE = 69

export default function TownSEOPageClient({ town, nearbyTowns, otherTowns }: {
  town: TownSEOData; nearbyTowns: TownSEOData[]; otherTowns: TownSEOData[]
}) {
  const { setSelectedTown } = useTown()
  const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)

  useEffect(() => { setSelectedTown(town.name) }, [town.name, setSelectedTown])

  // Compute analytics
  const permits = permitDataMap[town.slug] || null
  const timelineStats = useMemo(() => permits ? computeTimelines(permits) : null, [permits])
  const costStats = useMemo(() => permits ? computeCostStats(permits) : null, [permits])
  const scorecard = useMemo(() => computeScorecard(town, timelineStats), [town, timelineStats])
  const perKApprovals = approvalsPerThousandParcels(town)
  const perKSubmitted = submittedPerThousandParcels(town)

  const vsAvg = town.approvalRate - STATE_AVG_RATE
  const vsLabel = vsAvg > 0 ? `${vsAvg}pt above state average` : vsAvg < 0 ? `${Math.abs(vsAvg)}pt below state average` : 'At state average'

  const gradeColor = (g: string) => g === 'A' ? 'text-emerald-400' : g === 'B' ? 'text-blue-400' : g === 'C' ? 'text-amber-400' : 'text-red-400'
  const gradeBarColor = (s: number) => s >= 65 ? 'bg-emerald-500' : s >= 40 ? 'bg-amber-500' : 'bg-red-500'

  const handleExportTown = () => {
    const csv = generateCSV([town])
    downloadCSV(`${town.slug}-adu-data.csv`, csv)
  }

  const handleExportPermits = () => {
    if (!permits) return
    const csv = generatePermitCSV(permits, town.name)
    downloadCSV(`${town.slug}-permits.csv`, csv)
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <NavBar current="Home" />

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
        <div className="mb-4">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">{town.name} ADU Permits</h1>
            {/* Scorecard badge */}
            <div className="flex items-center gap-1.5">
              <span className={`text-2xl font-bold ${gradeColor(scorecard.overall)}`}>{scorecard.overall}</span>
              <span className="text-gray-500 text-xs">Town Grade</span>
            </div>
          </div>
          <p className="text-text-secondary text-sm">
            {town.county} County · Pop. {town.population.toLocaleString()}
            {town.singleFamilyParcels ? ` · ~${town.singleFamilyParcels.toLocaleString()} SF parcels` : ''}
          </p>
        </div>

        {/* Key insight — approval likelihood */}
        <div className={`rounded-xl p-5 sm:p-6 mb-4 border ${
          town.approvalRate >= 80 ? 'bg-emerald-900/20 border-emerald-500/30' :
          town.approvalRate >= 50 ? 'bg-amber-900/20 border-amber-500/30' :
          'bg-red-900/20 border-red-500/30'
        }`}>
          <div className="text-xs uppercase tracking-widest text-gray-400 mb-2">Approval Likelihood</div>
          <div className="flex items-end gap-3 mb-2">
            <span className={`text-4xl sm:text-5xl font-bold ${
              town.approvalRate >= 80 ? 'text-emerald-400' : town.approvalRate >= 50 ? 'text-amber-400' : 'text-red-400'
            }`}>
              {town.approvalRate >= 80 ? 'High' : town.approvalRate >= 50 ? 'Medium' : 'Low'}
            </span>
            <span className="text-gray-400 text-lg mb-1">({town.approvalRate}%)</span>
          </div>
          <p className="text-gray-400 text-sm">
            {vsLabel} · {town.approved} of {town.submitted} applications approved
            {perKApprovals !== null && ` · ${perKApprovals} approvals per 1,000 SF parcels`}
          </p>
        </div>

        {/* Share + Export row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <ShareButtons town={town} variant="insight" />
          <div className="flex gap-2">
            <button onClick={handleExportTown} className="px-3 py-2 sm:py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs rounded-lg transition-colors min-h-[44px] sm:min-h-0">
              📊 Export CSV
            </button>
            {permits && (
              <button onClick={handleExportPermits} className="px-3 py-2 sm:py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs rounded-lg transition-colors min-h-[44px] sm:min-h-0">
                📋 Export Permits
              </button>
            )}
          </div>
        </div>

        {/* Normalized metrics bar (item #1) */}
        {perKApprovals !== null && (
          <div className="bg-gray-800/50 border border-border rounded-xl p-4 mb-4">
            <div className="text-xs uppercase tracking-widest text-gray-500 mb-3">Normalized Metrics</div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-white font-bold text-xl">{perKSubmitted}</div>
                <div className="text-gray-500 text-xs">Applications per 1K parcels</div>
              </div>
              <div>
                <div className="text-emerald-400 font-bold text-xl">{perKApprovals}</div>
                <div className="text-gray-500 text-xs">Approvals per 1K parcels</div>
              </div>
            </div>
            <p className="text-gray-600 text-[10px] mt-2">Normalized against ~{town.singleFamilyParcels?.toLocaleString()} estimated single-family parcels (Census ACS)</p>
          </div>
        )}

        {/* Progressive disclosure cards */}
        <div className="space-y-3 mb-6">
          {/* Town Scorecard (item #2) */}
          <InsightCard title="Town Scorecard" value={`Grade: ${scorecard.overall}`} color={gradeColor(scorecard.overall)} badge="NEW" defaultOpen={false}>
            <div className="space-y-4">
              <div className="space-y-3">
                <ScoreBar label={`Rules Friction: ${scorecard.rulesFriction}`} score={scorecard.rulesFrictionScore} color={gradeBarColor(scorecard.rulesFrictionScore)} />
                <ScoreBar label={`Operational Friction: ${scorecard.operationalFriction}`} score={scorecard.operationalFrictionScore} color={gradeBarColor(scorecard.operationalFrictionScore)} />
              </div>
              <div className="space-y-1.5">
                {scorecard.factors.map((f, i) => (
                  <div key={i} className="flex gap-2 items-start text-xs">
                    <span className={`shrink-0 mt-0.5 ${i < 2 ? 'text-emerald-400' : 'text-gray-500'}`}>{scorecard.rulesFrictionScore >= 60 && i < 2 ? '✓' : '·'}</span>
                    <span className="text-gray-400">{f}</span>
                  </div>
                ))}
              </div>
              <p className="text-gray-600 text-[10px]">Scorecard separates zoning/regulatory friction from operational/processing friction. Higher scores = less friction.</p>
            </div>
          </InsightCard>

          {/* Permit Activity */}
          <InsightCard title="Permit Activity" value={`${town.submitted} submitted`} defaultOpen={false}>
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
            <div className="h-3 bg-gray-700 rounded-full overflow-hidden mb-1">
              <div className="h-full bg-emerald-500 rounded-full transition-all duration-700" style={{ width: `${town.approvalRate}%` }} />
            </div>
            <div className="flex justify-between text-xs text-text-muted">
              <span>{town.approved} approved</span>
              <span>{town.denied} denied · {town.pending} pending</span>
            </div>
          </InsightCard>

          {/* Timeline Data (item #5) */}
          {timelineStats && (
            <InsightCard title="Permit Timeline" value={`${timelineStats.medianDays} day median`} color="text-blue-400" badge="TIMELINE DATA">
              <TimelineDisplay stats={timelineStats} />
            </InsightCard>
          )}

          {/* Cost Analysis from permit data */}
          {costStats && (
            <InsightCard title="Actual Costs (Permit Data)" value={fmt(costStats.median)} color="text-emerald-400" badge="REAL DATA">
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center bg-gray-900/50 rounded-lg p-2.5">
                    <div className="text-white font-bold">{fmt(costStats.min)}</div>
                    <div className="text-text-muted text-[10px]">Lowest</div>
                  </div>
                  <div className="text-center bg-gray-900/50 rounded-lg p-2.5">
                    <div className="text-emerald-400 font-bold">{fmt(costStats.median)}</div>
                    <div className="text-text-muted text-[10px]">Median</div>
                  </div>
                  <div className="text-center bg-gray-900/50 rounded-lg p-2.5">
                    <div className="text-white font-bold">{fmt(costStats.max)}</div>
                    <div className="text-text-muted text-[10px]">Highest</div>
                  </div>
                </div>
                {Object.keys(costStats.byType).length > 1 && (
                  <div className="space-y-1.5">
                    <div className="text-xs text-gray-500 uppercase tracking-wider">By ADU Type</div>
                    {Object.entries(costStats.byType).map(([type, stats]) => (
                      <div key={type} className="flex items-center justify-between text-xs bg-gray-900/30 rounded-lg px-3 py-2">
                        <span className="text-gray-300">{type}</span>
                        <span className="text-white font-medium">{fmt(stats.min)} – {fmt(stats.max)} <span className="text-gray-500">({stats.count})</span></span>
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-gray-500 text-xs">Based on {costStats.count} permits with reported construction costs.</p>
              </div>
            </InsightCard>
          )}

          {/* Detailed Permit Table */}
          {permits && permits.length > 0 && (
            <InsightCard title="Individual Permits" value={`${permits.length} on file`} badge="PERMIT DATA">
              <PermitTable permits={permits} town={town} />
            </InsightCard>
          )}

          {/* Market context */}
          {(town.avgRent || town.medianHome) && (
            <InsightCard title="Market Context" value={town.avgRent ? `${fmt(town.avgRent)}/mo avg rent` : fmt(town.medianHome || 0)}>
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
                <Link href="/estimate" className="block text-blue-400 text-sm hover:underline mt-2">Get a detailed cost estimate for {town.name} →</Link>
              </div>
            </InsightCard>
          )}

          {/* By-right info */}
          {town.byRight && (
            <InsightCard title="Permitting" value="By-right eligible" color="text-emerald-400">
              <div className="text-gray-400 text-sm leading-relaxed space-y-2">
                <p>Under the state&apos;s 2024 by-right law, single-family homeowners in {town.name} can build one ADU without a special permit.</p>
                <div className="grid sm:grid-cols-2 gap-2 mt-3">
                  {['No special permit or variance', 'Standard building permit process', 'Up to 900 sf or 50% of primary', 'Owner occupancy in either unit'].map((text, i) => (
                    <div key={i} className="flex gap-2 items-start min-h-[32px]">
                      <span className="text-emerald-400 mt-0.5 shrink-0">✓</span>
                      <span className="text-sm">{text}</span>
                    </div>
                  ))}
                </div>
                {town.localPermitUrl && (
                  <a href={town.localPermitUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline text-sm block mt-2">{town.name} permit office →</a>
                )}
              </div>
            </InsightCard>
          )}
        </div>

        {/* Builder Alert Signup (item #3) */}
        <div className="mb-6">
          <BuilderAlertSignup town={town} />
        </div>

        {/* Local context prose */}
        <div className="bg-gray-800/50 border border-border rounded-xl p-5 mb-6">
          <h2 className="text-white font-bold mb-3">ADUs in {town.name}</h2>
          <div className="text-gray-400 text-sm leading-relaxed space-y-3">
            <p>
              {town.name} has received {town.submitted} ADU applications since Massachusetts&apos; by-right ADU law took effect.
              Of those, {town.approved} have been approved ({town.approvalRate}% approval rate){town.denied > 0 ? `, ${town.denied} denied,` : ''}
              {' '}and {town.pending} are still pending review.
              {perKApprovals !== null && ` Normalized for housing stock, that's ${perKApprovals} approvals per 1,000 single-family parcels.`}
            </p>
            {timelineStats && (
              <p>
                Based on {timelineStats.count} issued permits with timeline data, the median application-to-approval time is{' '}
                <span className="text-white font-medium">{timelineStats.medianDays} days</span>, ranging from {timelineStats.minDays} to {timelineStats.maxDays} days.
              </p>
            )}
            {town.notes && <p>{town.notes}</p>}
          </div>
        </div>

        {/* CTAs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
          <Link href="/estimate" className="bg-blue-600 hover:bg-blue-500 text-white text-center py-3.5 sm:py-3 px-4 rounded-xl font-medium text-sm transition-colors min-h-[48px] flex items-center justify-center gap-2">💰 Estimate ADU Cost</Link>
          <Link href="/quiz" className="bg-gray-700 hover:bg-gray-600 text-white text-center py-3.5 sm:py-3 px-4 rounded-xl font-medium text-sm transition-colors min-h-[48px] flex items-center justify-center gap-2">📝 Take ADU Quiz</Link>
          <Link href="/club" className="bg-gray-700 hover:bg-gray-600 text-white text-center py-3.5 sm:py-3 px-4 rounded-xl font-medium text-sm transition-colors min-h-[48px] flex items-center justify-center gap-2">👥 Join {town.name} Group</Link>
        </div>

        {/* Nearby towns */}
        {nearbyTowns.length > 0 && (
          <div className="mb-6">
            <h2 className="text-white font-bold mb-3">Other {town.county} County Towns</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {nearbyTowns.map(t => {
                const perK = approvalsPerThousandParcels(t)
                return (
                  <Link key={t.slug} href={`/towns/${t.slug}`} className="bg-gray-800/50 border border-border rounded-xl p-4 hover:bg-gray-700/50 active:bg-gray-700 transition-colors min-h-[56px] flex items-center">
                    <div className="flex justify-between items-center w-full">
                      <div>
                        <div className="text-white font-medium">{t.name}</div>
                        <div className="text-text-muted text-xs mt-0.5">
                          {t.approved} approved · {t.approvalRate}% rate
                          {perK !== null && <span className="text-gray-600"> · {perK}/1K</span>}
                        </div>
                      </div>
                      <span className="text-blue-400 text-sm">→</span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* More towns + map link */}
        {otherTowns.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-white font-bold">More Massachusetts Towns</h2>
              <Link href="/map" className="text-blue-400 text-sm hover:underline min-h-[44px] flex items-center">🗺 Map view →</Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {otherTowns.map(t => (
                <Link key={t.slug} href={`/towns/${t.slug}`} className="text-blue-400 text-sm hover:underline py-2 min-h-[44px] flex items-center">{t.name} ({t.approved} approved)</Link>
              ))}
              <Link href="/leaderboard" className="text-gray-500 text-sm hover:text-white py-2 min-h-[44px] flex items-center">View all towns →</Link>
            </div>
          </div>
        )}

        {/* Enhanced Data Source Citation (item #7) */}
        <div className="text-text-muted text-xs leading-relaxed p-4 bg-gray-800/30 rounded-lg border border-border/50 space-y-1.5">
          <div className="flex items-start gap-2">
            <span className="text-gray-600 shrink-0">📊</span>
            <div>
              <span className="text-gray-400 font-medium">Primary data source:</span>{' '}
              {town.source}{town.sourceDate ? ` (${town.sourceDate})` : ''}.
              {town.hasPermitData && ' Individual permit records from municipal building department.'}
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-gray-600 shrink-0">🏘</span>
            <div>
              <span className="text-gray-400 font-medium">Housing data:</span>{' '}
              Population and single-family parcel estimates from 2024 Census ACS.
              {town.avgRent && ' Rent data from aggregated listing platforms.'}
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-gray-600 shrink-0">⚖️</span>
            <div>
              Per-capita normalization uses estimated single-family parcels. Actual parcel counts may vary.
              See <Link href="/methodology" className="text-blue-400 hover:underline">methodology</Link> for details.
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
