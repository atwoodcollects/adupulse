'use client'

import Link from 'next/link'
import { useState, useEffect, useMemo } from 'react'
import { useTown } from '@/contexts/TownContext'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import type { TownSEOData } from '@/data/town_seo_data'
import {
  computeCostStats,
  computeScorecard,
  type PermitRecord,
  type CostStats,
} from '@/lib/townAnalytics'
import { useSubscription } from '@/lib/subscription'
import {
  towns as complianceTowns,
  getStatusCounts,
  type TownComplianceProfile,
  type ComplianceProvision,
} from '@/app/compliance/compliance-data'
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  Lock,
  ArrowRight,
  Users,
  Hammer,
  BookOpen,
  ChevronDown,
} from 'lucide-react'

// Permit data imports
import andoverPermits from '@/data/andover_permits.json'
import miltonPermits from '@/data/milton_permits.json'
import plymouthPermits from '@/data/plymouth_permits.json'
import duxburyPermits from '@/data/duxbury_permits.json'
import falmouthPermits from '@/data/falmouth_permits.json'
import sudburyPermits from '@/data/sudbury_permits.json'
import newtonPermits from '@/data/newton_permits.json'
import needhamPermits from '@/data/needham_permits.json'

const permitDataMap: Record<string, PermitRecord[]> = {
  andover: andoverPermits as unknown as PermitRecord[],
  milton: miltonPermits as unknown as PermitRecord[],
  plymouth: plymouthPermits as unknown as PermitRecord[],
  duxbury: duxburyPermits as unknown as PermitRecord[],
  falmouth: falmouthPermits as unknown as PermitRecord[],
  sudbury: sudburyPermits as unknown as PermitRecord[],
  newton: newtonPermits as unknown as PermitRecord[],
  needham: needhamPermits as unknown as PermitRecord[],
}

// ── Grade colors ──────────────────────────────────────────────────────
const gradeColors: Record<string, { text: string; bg: string; border: string }> = {
  A: { text: 'text-emerald-400', bg: 'bg-emerald-400/15', border: 'border-emerald-400/30' },
  B: { text: 'text-blue-400', bg: 'bg-blue-400/15', border: 'border-blue-400/30' },
  C: { text: 'text-amber-400', bg: 'bg-amber-400/15', border: 'border-amber-400/30' },
  D: { text: 'text-red-400', bg: 'bg-red-400/15', border: 'border-red-400/30' },
  F: { text: 'text-red-400', bg: 'bg-red-400/15', border: 'border-red-400/30' },
}

// ── Provision status icons ────────────────────────────────────────────
function StatusDot({ status }: { status: 'inconsistent' | 'review' | 'compliant' }) {
  if (status === 'compliant') return <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
  if (status === 'review') return <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
  return <XCircle className="w-4 h-4 text-red-400 shrink-0" />
}

// ── Currency format ───────────────────────────────────────────────────
const fmt = (n: number) =>
  n > 0
    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
    : '—'

// ── Permit Table ──────────────────────────────────────────────────────
function PermitTable({ permits, isPro }: { permits: PermitRecord[]; isPro: boolean }) {
  const [showAll, setShowAll] = useState(false)
  const displayed = showAll ? permits : permits.slice(0, 5)

  return (
    <div>
      {/* Desktop table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-500 text-xs border-b border-gray-700">
              <th className="text-left py-2 pr-3">Address</th>
              <th className="text-left py-2 pr-3">Type</th>
              <th className="text-left py-2 pr-3">Status</th>
              <th className="text-right py-2">Value</th>
            </tr>
          </thead>
          <tbody>
            {displayed.map((p, i) => (
              <tr key={i} className="border-b border-gray-800/50 text-gray-300">
                <td className="py-2.5 pr-3 text-white text-xs">{p.address}</td>
                <td className="py-2.5 pr-3 text-xs">{p.type}</td>
                <td className="py-2.5 pr-3">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                    p.status === 'Issued' ? 'bg-emerald-500/20 text-emerald-400' :
                    p.status === 'Pending' ? 'bg-amber-500/20 text-amber-400' :
                    p.status === 'Rejected' ? 'bg-red-500/20 text-red-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>{p.status}</span>
                </td>
                <td className="py-2.5 text-right text-xs">{fmt(p.cost)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
            <div className="flex gap-3 text-xs text-gray-400">
              <span>{p.type}</span>
              <span>{fmt(p.cost)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Paywall / show more */}
      {permits.length > 5 && !showAll && (
        isPro ? (
          <button onClick={() => setShowAll(true)} className="text-blue-400 text-sm hover:underline mt-3">
            Show all {permits.length} permits
          </button>
        ) : (
          <div className="relative mt-3">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900 pointer-events-none" />
            <Link href="/pricing" className="relative block p-4 rounded-lg border border-amber-500/30 bg-amber-500/5 text-center">
              <Lock className="w-4 h-4 text-amber-400 mx-auto mb-1" />
              <span className="text-amber-400 text-sm font-medium">See all {permits.length} permits with Pro</span>
              <span className="block text-gray-500 text-xs mt-0.5">Every address, cost, sqft, and contractor</span>
            </Link>
          </div>
        )
      )}
    </div>
  )
}

// ── Provision Row (compliance) ────────────────────────────────────────
function ProvisionRow({
  provision,
  isPro,
  townSlug,
}: {
  provision: ComplianceProvision
  isPro: boolean
  townSlug: string
}) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="flex flex-col">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-3 py-2 text-left hover:bg-gray-800/30 -mx-1 px-1 rounded transition-colors"
      >
        <StatusDot status={provision.status} />
        <span className="text-sm text-gray-300 flex-1 min-w-0 truncate">{provision.provision}</span>
        {provision.agDecision && (
          <span className="text-[10px] font-semibold uppercase text-red-400 bg-red-400/10 px-1.5 py-0.5 rounded shrink-0">AG</span>
        )}
        <ChevronDown className={`w-3.5 h-3.5 text-gray-500 shrink-0 transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </button>

      {expanded && (
        isPro ? (
          <div className="ml-7 mb-3 pl-3 border-l border-gray-700/50 space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-gray-500 uppercase tracking-wider text-[10px]">State Law</span>
                <p className="text-gray-400 leading-relaxed mt-0.5">{provision.stateLaw}</p>
              </div>
              <div>
                <span className="text-gray-500 uppercase tracking-wider text-[10px]">Local Bylaw</span>
                <p className="text-gray-400 leading-relaxed mt-0.5">{provision.localBylaw}</p>
              </div>
            </div>
            <p className="text-xs text-gray-500">{provision.impact}</p>
            {provision.agDecision && (
              <p className="text-xs text-red-300 bg-red-400/5 border border-red-400/20 rounded p-2">{provision.agDecision}</p>
            )}
            <Link href={`/compliance/${townSlug}/${provision.id}`} className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300">
              Full analysis <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        ) : (
          <div className="ml-7 mb-3">
            <Link href="/pricing" className="block p-3 rounded-lg border border-amber-500/30 bg-amber-500/5 text-center">
              <span className="text-amber-400 text-xs font-medium">Unlock detailed analysis with Pro</span>
            </Link>
          </div>
        )
      )}
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════════════
export default function TownSEOPageClient({
  town,
  nearbyTowns,
}: {
  town: TownSEOData
  nearbyTowns: TownSEOData[]
}) {
  const { setSelectedTown } = useTown()
  const { isPro } = useSubscription()

  useEffect(() => { setSelectedTown(town.name) }, [town.name, setSelectedTown])

  // Analytics
  const permits = permitDataMap[town.slug] || null
  const costStats = useMemo(() => (permits ? computeCostStats(permits) : null), [permits])
  const scorecard = useMemo(() => computeScorecard(town), [town])
  const gc = gradeColors[scorecard.overall] || gradeColors.C

  // Compliance data lookup
  const compliance: TownComplianceProfile | null = useMemo(
    () => complianceTowns.find(t => t.slug === town.slug) || null,
    [town.slug],
  )
  const complianceCounts = useMemo(
    () => (compliance ? getStatusCounts(compliance.provisions) : null),
    [compliance],
  )

  // Summary sentence
  const complianceSummary = compliance
    ? ` and has ${complianceCounts!.compliant} of ${compliance.provisions.length} bylaw provisions consistent with state law`
    : ''
  const summaryLine = `${town.name} has approved ${town.approved} of ${town.submitted} ADU applications (${town.approvalRate}% approval rate)${complianceSummary}.`

  return (
    <div className="min-h-screen bg-gray-900">
      <NavBar />
      <main className="max-w-4xl mx-auto px-4 py-6 md:py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-6 text-gray-400">
          <Link href="/" className="text-blue-400 hover:text-blue-300 transition-colors">Dashboard</Link>
          <span className="text-gray-600">/</span>
          <Link href="/map" className="text-blue-400 hover:text-blue-300 transition-colors">Towns</Link>
          <span className="text-gray-600">/</span>
          <span>{town.name}</span>
        </nav>

        {/* ── HERO BLOCK ── */}
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-3">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">{town.name}</h1>
              <p className="text-gray-500 text-sm mt-0.5">{town.county} County · Pop. {town.population.toLocaleString()}</p>
            </div>
            <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl ${gc.bg} border-2 ${gc.border} flex items-center justify-center shrink-0`}>
              <span className={`text-3xl sm:text-4xl font-bold ${gc.text}`}>{scorecard.overall}</span>
            </div>
          </div>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed">{summaryLine}</p>
        </div>

        {/* ── SECTION 1: PERMITS ── */}
        <section className="mb-10">
          <h2 className="text-lg font-bold text-white mb-4">Permits</h2>

          {/* Approval rate + stacked bar */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5 mb-4">
            <div className="flex items-end gap-3 mb-3">
              <span className={`text-4xl sm:text-5xl font-bold ${
                town.approvalRate >= 80 ? 'text-emerald-400' :
                town.approvalRate >= 50 ? 'text-amber-400' : 'text-red-400'
              }`}>
                {town.approvalRate}%
              </span>
              <span className="text-gray-500 text-sm mb-1.5">approval rate</span>
            </div>

            {/* Stacked bar */}
            <div className="h-3 bg-gray-700 rounded-full overflow-hidden flex mb-3">
              {town.approved > 0 && (
                <div className="bg-emerald-400 transition-all" style={{ width: `${(town.approved / town.submitted) * 100}%` }} />
              )}
              {town.denied > 0 && (
                <div className="bg-red-400 transition-all" style={{ width: `${(town.denied / town.submitted) * 100}%` }} />
              )}
              {town.pending > 0 && (
                <div className="bg-amber-400 transition-all" style={{ width: `${(town.pending / town.submitted) * 100}%` }} />
              )}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-gray-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                {town.approved} approved
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-400" />
                {town.denied} denied
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                {town.pending} pending
              </span>
            </div>

            <p className="text-gray-500 text-xs mt-3">
              {town.submitted} applications since the ADU law took effect in Feb 2025
            </p>
          </div>

          {/* Permit table */}
          {permits && permits.length > 0 && (
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 sm:p-5">
              <PermitTable permits={permits} isPro={isPro} />
            </div>
          )}
        </section>

        {/* ── SECTION 2: BYLAW CONSISTENCY ── */}
        <section className="mb-10">
          <h2 className="text-lg font-bold text-white mb-4">Bylaw Consistency</h2>

          {compliance && complianceCounts ? (
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5">
              {/* Fraction + progress bar */}
              <div className="flex items-center gap-4 mb-4">
                <div>
                  <span className="text-3xl font-bold text-white">{complianceCounts.compliant}</span>
                  <span className="text-gray-500 text-lg font-medium"> / {compliance.provisions.length}</span>
                </div>
                <div className="flex-1">
                  <div className="text-xs text-gray-500 mb-1">provisions consistent with Chapter 150</div>
                  <div className="h-2.5 bg-gray-700 rounded-full overflow-hidden flex">
                    {complianceCounts.compliant > 0 && (
                      <div className="bg-emerald-400" style={{ width: `${(complianceCounts.compliant / compliance.provisions.length) * 100}%` }} />
                    )}
                    {complianceCounts.review > 0 && (
                      <div className="bg-amber-400" style={{ width: `${(complianceCounts.review / compliance.provisions.length) * 100}%` }} />
                    )}
                    {complianceCounts.inconsistent > 0 && (
                      <div className="bg-red-400" style={{ width: `${(complianceCounts.inconsistent / compliance.provisions.length) * 100}%` }} />
                    )}
                  </div>
                </div>
              </div>

              {/* Provision list */}
              <div className="divide-y divide-gray-700/30">
                {compliance.provisions.map(p => (
                  <ProvisionRow key={p.id} provision={p} isPro={isPro} townSlug={town.slug} />
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-gray-700/50">
                <Link href={`/compliance/${town.slug}`} className="inline-flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 transition-colors">
                  Full {town.name} compliance analysis <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5 text-center">
              <p className="text-gray-400 text-sm">We haven&apos;t reviewed {town.name}&apos;s bylaws yet.</p>
              <p className="text-gray-500 text-xs mt-1">Check back soon — we&apos;re adding new towns regularly.</p>
            </div>
          )}
        </section>

        {/* ── SECTION 3: COST SNAPSHOT ── */}
        <section className="mb-10">
          <h2 className="text-lg font-bold text-white mb-4">Cost Snapshot</h2>

          {costStats ? (
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5">
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">Low</div>
                  <div className="text-white font-bold text-lg sm:text-xl">{fmt(costStats.min)}</div>
                </div>
                <div className="text-center">
                  <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">Median</div>
                  <div className="text-emerald-400 font-bold text-lg sm:text-xl">{fmt(costStats.median)}</div>
                </div>
                <div className="text-center">
                  <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">High</div>
                  <div className="text-white font-bold text-lg sm:text-xl">{fmt(costStats.max)}</div>
                </div>
              </div>
              <p className="text-gray-500 text-xs mb-3">
                Based on {costStats.count} permitted ADU projects in {town.name}
              </p>
              <Link href="/estimate" className="inline-flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 transition-colors">
                Try the full cost estimator <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5">
              <p className="text-gray-400 text-sm">No cost data available yet for {town.name}.</p>
              <Link href="/estimate" className="inline-flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 transition-colors mt-2">
                Try the cost estimator <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </section>

        {/* ── SECTION 4: HOW TOWN COMPARES ── */}
        {nearbyTowns.length > 0 && (
          <section className="mb-10">
            <h2 className="text-lg font-bold text-white mb-4">How {town.name} Compares</h2>
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
              {/* Header row */}
              <div className="hidden sm:grid grid-cols-4 gap-2 px-4 py-2 text-[10px] uppercase tracking-wider text-gray-500 border-b border-gray-700/50">
                <span>Town</span>
                <span className="text-center">Grade</span>
                <span className="text-center">Approval Rate</span>
                <span className="text-right">Permits</span>
              </div>
              {nearbyTowns.slice(0, 4).map((t, i) => {
                const sc = computeScorecard(t)
                const tgc = gradeColors[sc.overall] || gradeColors.C
                return (
                  <Link
                    key={t.slug}
                    href={`/towns/${t.slug}`}
                    className={`grid grid-cols-4 gap-2 items-center px-4 py-3 hover:bg-gray-700/30 transition-colors ${
                      i < Math.min(nearbyTowns.length, 4) - 1 ? 'border-b border-gray-700/30' : ''
                    }`}
                  >
                    <div className="min-w-0">
                      <span className="text-white text-sm font-medium truncate block">{t.name}</span>
                      <span className="text-gray-500 text-xs sm:hidden">{t.county}</span>
                    </div>
                    <div className="text-center">
                      <span className={`text-sm font-bold ${tgc.text}`}>{sc.overall}</span>
                    </div>
                    <div className="text-center">
                      <span className={`text-sm font-medium ${
                        t.approvalRate >= 80 ? 'text-emerald-400' :
                        t.approvalRate >= 50 ? 'text-amber-400' : 'text-red-400'
                      }`}>{t.approvalRate}%</span>
                    </div>
                    <div className="text-right text-sm text-gray-400">{t.approved}</div>
                  </Link>
                )
              })}
            </div>
            <div className="mt-3">
              <Link href={`/compare?a=${town.slug}`} className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors">
                Compare more towns <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </section>
        )}

        {/* ── SECTION 5: NEXT STEPS ── */}
        <section className="mb-10">
          <h2 className="text-lg font-bold text-white mb-4">Next Steps</h2>
          <div className="space-y-2">
            <Link href="/club" className="flex items-center gap-3 bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3.5 hover:border-gray-600 transition-colors group">
              <Users className="w-5 h-5 text-emerald-400 shrink-0" />
              <span className="text-sm text-gray-300 flex-1">Join {town.name}&apos;s ADU Club for group builder rates</span>
              <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors shrink-0" />
            </Link>
            <Link href="/builders" className="flex items-center gap-3 bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3.5 hover:border-gray-600 transition-colors group">
              <Hammer className="w-5 h-5 text-blue-400 shrink-0" />
              <span className="text-sm text-gray-300 flex-1">Find builders working in {town.county} County</span>
              <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors shrink-0" />
            </Link>
            <Link href="/blog" className="flex items-center gap-3 bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3.5 hover:border-gray-600 transition-colors group">
              <BookOpen className="w-5 h-5 text-purple-400 shrink-0" />
              <span className="text-sm text-gray-300 flex-1">Read our analysis of Year One ADU data</span>
              <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors shrink-0" />
            </Link>
          </div>
        </section>

        {/* Data source */}
        <div className="text-gray-500 text-xs leading-relaxed p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
          <p>
            <span className="text-gray-400 font-medium">Source:</span> {town.source}{town.sourceDate ? ` (${town.sourceDate})` : ''}.
            {town.hasPermitData && ' Individual permit records from municipal building department.'}
            {' '}Population and parcel estimates from 2024 Census ACS.
            {' '}See <Link href="/methodology" className="text-blue-400 hover:underline">methodology</Link> for details.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
