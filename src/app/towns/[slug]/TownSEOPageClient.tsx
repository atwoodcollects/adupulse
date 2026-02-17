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
  approvalsPerTenThousandResidents,
  type PermitRecord,
} from '@/lib/townAnalytics'
import { useSubscription } from '@/lib/subscription'
import {
  allEntries as complianceTowns,
  getStatusCounts,
  type TownComplianceProfile,
  type ComplianceProvision,
} from '@/app/compliance/compliance-data'
import {
  type Audience,
  AUDIENCE_STORAGE_KEY,
  AUDIENCE_CONTENT,
} from '@/lib/audience'
import type { BuildingPermitData } from '@/data/building_permits_2024'
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  Lock,
  ArrowRight,
  Users,
  Hammer,
  BookOpen,
  BarChart3,
  Scale,
  Home,
  Landmark,
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

// ── Strip house number from address for display ─────────────────────
const streetName = (addr: string) => addr.replace(/^\d+\s+/, '')

// ── Provision sort order ─────────────────────────────────────────────
const statusOrder: Record<string, number> = { inconsistent: 0, review: 1, compliant: 2 }

// ── Icon lookup for audience next steps ──────────────────────────────
const iconMap: Record<string, typeof Users> = {
  Users, Hammer, BookOpen, BarChart3, Scale,
}

// ── Audience Toggle ──────────────────────────────────────────────────
function AudienceToggle({ value, onChange }: { value: Audience; onChange: (a: Audience) => void }) {
  const options: { key: Audience; label: string; icon: typeof Home }[] = [
    { key: 'homeowner', label: 'Homeowner', icon: Home },
    { key: 'builder', label: 'Builder', icon: Hammer },
    { key: 'lender', label: 'Lender', icon: Landmark },
  ]
  return (
    <div className="flex bg-gray-800/50 border border-gray-700 rounded-lg p-1 mb-8">
      {options.map(opt => (
        <button
          key={opt.key}
          onClick={() => onChange(opt.key)}
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
            value === opt.key
              ? 'bg-gray-700 text-white'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <opt.icon className="w-4 h-4" />
          <span className="hidden sm:inline">{opt.label}</span>
        </button>
      ))}
    </div>
  )
}

// ── Per-Capita Card ──────────────────────────────────────────────────
function PerCapitaCard({
  townPerCapita,
  statewidePerCapita,
  town,
  label,
}: {
  townPerCapita: number
  statewidePerCapita: number
  town: TownSEOData
  label: string
}) {
  const multiplier = statewidePerCapita > 0 ? townPerCapita / statewidePerCapita : 0
  const maxBar = Math.max(townPerCapita, statewidePerCapita) * 1.2 || 1
  const aboveAvg = multiplier >= 1

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5 mb-8">
      <div className="text-[10px] uppercase tracking-wider text-gray-500 mb-3">
        {label}
      </div>
      <div className="flex items-end gap-3 mb-4">
        <span className={`text-4xl sm:text-5xl font-bold ${aboveAvg ? 'text-emerald-400' : 'text-amber-400'}`}>
          {townPerCapita.toFixed(1)}
        </span>
        <div className="mb-1.5">
          <span className="text-gray-500 text-sm">per 10K residents</span>
          <span className={`block text-xs ${aboveAvg ? 'text-emerald-400/70' : 'text-amber-400/70'}`}>
            {multiplier.toFixed(1)}x state average
          </span>
        </div>
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400 w-20 shrink-0 truncate">{town.name}</span>
          <div className="flex-1 h-3 bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${aboveAvg ? 'bg-emerald-400' : 'bg-amber-400'}`}
              style={{ width: `${(townPerCapita / maxBar) * 100}%` }}
            />
          </div>
          <span className="text-xs text-gray-400 w-8 text-right">{townPerCapita.toFixed(1)}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500 w-20 shrink-0">State avg</span>
          <div className="flex-1 h-3 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gray-500 rounded-full"
              style={{ width: `${(statewidePerCapita / maxBar) * 100}%` }}
            />
          </div>
          <span className="text-xs text-gray-500 w-8 text-right">{statewidePerCapita.toFixed(1)}</span>
        </div>
      </div>

      <p className="text-gray-500 text-xs">
        Based on {town.approved} approved ADU applications and {town.population.toLocaleString()} residents
      </p>
    </div>
  )
}

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
                <td className="py-2.5 pr-3 text-white text-xs">{streetName(p.address)}</td>
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
              <div className="text-white font-medium text-xs">{streetName(p.address)}</div>
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
  audience,
  ruleWord,
}: {
  provision: ComplianceProvision
  isPro: boolean
  townSlug: string
  audience: Audience
  ruleWord: string
}) {
  const [expanded, setExpanded] = useState(false)
  const content = AUDIENCE_CONTENT[audience]

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
                <span className="text-gray-500 uppercase tracking-wider text-[10px]">Local {ruleWord}</span>
                <p className="text-gray-400 leading-relaxed mt-0.5">{provision.localBylaw}</p>
              </div>
            </div>
            <p className="text-xs text-gray-500">{provision.impact}</p>
            {provision.agDecision && (
              <p className="text-xs text-red-300 bg-red-400/5 border border-red-400/20 rounded p-2">{provision.agDecision}</p>
            )}
            <div className="flex items-start gap-2 mt-2 p-2 rounded bg-gray-900/50 border border-gray-700/30">
              <span className="text-[10px] uppercase tracking-wider text-gray-500 shrink-0 mt-0.5 leading-tight w-24">
                {content.provisionBottomLineLabel}
              </span>
              <p className="text-xs text-gray-300">{content.provisionBottomLine(provision)}</p>
            </div>
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
  statewidePerCapita,
  townPerCapita,
  buildingPermits,
}: {
  town: TownSEOData
  nearbyTowns: TownSEOData[]
  statewidePerCapita: number
  townPerCapita: number
  buildingPermits: BuildingPermitData | null
}) {
  const { setSelectedTown } = useTown()
  const { isPro } = useSubscription()

  useEffect(() => { setSelectedTown(town.name) }, [town.name, setSelectedTown])

  // Audience toggle with localStorage persistence
  const [audience, setAudience] = useState<Audience>('homeowner')
  useEffect(() => {
    const saved = localStorage.getItem(AUDIENCE_STORAGE_KEY) as Audience | null
    if (saved && ['homeowner', 'builder', 'lender'].includes(saved)) {
      setAudience(saved)
    }
  }, [])
  const handleAudienceChange = (a: Audience) => {
    setAudience(a)
    localStorage.setItem(AUDIENCE_STORAGE_KEY, a)
  }

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

  // Sorted provisions: inconsistent first, then review, then compliant
  const sortedProvisions = useMemo(() => {
    if (!compliance) return []
    return [...compliance.provisions].sort((a, b) => statusOrder[a.status] - statusOrder[b.status])
  }, [compliance])

  // Terminology: "Bylaw" for towns, "Ordinance" for cities
  const isCity = compliance?.municipalityType === 'city'
  const ruleWord = isCity ? 'Ordinance' : 'Bylaw'

  // Summary sentence
  const complianceSummary = compliance
    ? ` and has ${complianceCounts!.compliant} of ${compliance.provisions.length} ${ruleWord.toLowerCase()} provisions consistent with state law`
    : ''
  const summaryLine = `${town.name} has approved ${town.approved} of ${town.submitted} ADU applications (${town.approvalRate}% approval rate)${complianceSummary}.`

  // Quadrant insight (only for towns with compliance data)
  const quadrantInsight = useMemo(() => {
    if (!compliance || !complianceCounts) return null
    const hasInconsistent = complianceCounts.inconsistent > 0
    const highApproval = town.approvalRate >= 60
    if (!hasInconsistent && highApproval) return {
      dot: 'bg-emerald-400',
      bg: 'bg-emerald-400/5 border-emerald-400/20',
      text: `${ruleWord}s align with state law and permits are moving. Good conditions for an ADU project.`,
    }
    if (hasInconsistent && highApproval) return {
      dot: 'bg-yellow-400',
      bg: 'bg-yellow-400/5 border-yellow-400/20',
      text: `Some ${ruleWord.toLowerCase()} provisions aren\u2019t yet consistent with state law, but permits are still being approved. State law overrides inconsistent local rules.`,
    }
    if (!hasInconsistent && !highApproval) return {
      dot: 'bg-orange-400',
      bg: 'bg-orange-400/5 border-orange-400/20',
      text: `${ruleWord}s align with state law, but the approval rate is below average. Expect a longer permitting timeline.`,
    }
    return {
      dot: 'bg-red-400',
      bg: 'bg-red-400/5 border-red-400/20',
      text: `Some ${ruleWord.toLowerCase()} provisions aren\u2019t yet consistent with state law, and the approval rate is below average. Check specific provisions before applying.`,
    }
  }, [compliance, complianceCounts, town.approvalRate, ruleWord])

  // Audience content
  const audienceContent = AUDIENCE_CONTENT[audience]

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
        <div className="mb-6">
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
          {quadrantInsight && (
            <div className={`mt-3 flex items-start gap-2.5 rounded-lg border px-3 py-2.5 ${quadrantInsight.bg}`}>
              <span className={`w-2 h-2 rounded-full ${quadrantInsight.dot} mt-1 shrink-0`} />
              <span className="text-gray-400 text-xs leading-relaxed">{quadrantInsight.text}</span>
            </div>
          )}
        </div>

        {/* ── AUDIENCE TOGGLE ── */}
        <AudienceToggle value={audience} onChange={handleAudienceChange} />

        {/* ── PER-CAPITA CARD ── */}
        <PerCapitaCard
          townPerCapita={townPerCapita}
          statewidePerCapita={statewidePerCapita}
          town={town}
          label={audienceContent.perCapitaLabel}
        />

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
              <span className="text-gray-500 text-sm mb-1.5 inline-flex items-center gap-1">
                approval rate
                <span className="relative group cursor-help">
                  <span className="text-gray-600 hover:text-gray-400 transition-colors">&#9432;</span>
                  <span className="absolute top-full sm:bottom-full sm:top-auto right-0 mt-1.5 sm:mt-0 sm:mb-1.5 px-2.5 py-1.5 text-[10px] text-gray-300 bg-gray-800 border border-gray-700 rounded-lg shadow-xl max-w-[min(12rem,calc(100vw-2rem))] w-max text-left opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-10">
                    Share of 2025 applications approved in 2025
                  </span>
                </span>
              </span>
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

        {/* ── SECTION 2: BYLAW/ORDINANCE CONSISTENCY ── */}
        <section className="mb-10">
          <h2 className="text-lg font-bold text-white mb-4">{ruleWord} Consistency</h2>

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

              {/* Provision list — sorted by status */}
              <div className="divide-y divide-gray-700/30">
                {sortedProvisions.map(p => (
                  <ProvisionRow key={p.id} provision={p} isPro={isPro} townSlug={town.slug} audience={audience} ruleWord={ruleWord} />
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-gray-700/50">
                <Link href={`/compliance/${town.slug}`} className="inline-flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 transition-colors">
                  Full {town.name} consistency analysis <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5 text-center">
              <p className="text-gray-400 text-sm">We haven&apos;t reviewed {town.name}&apos;s {ruleWord.toLowerCase()}s yet.</p>
              <p className="text-gray-500 text-xs mt-1">Check back soon — we&apos;re adding new communities regularly.</p>
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

        {/* ── SECTION 3.5: ADU IMPACT ON HOUSING PRODUCTION ── */}
        {buildingPermits && buildingPermits.totalUnits > 0 && (
          <section className="mb-10">
            <h2 className="text-lg font-bold text-white mb-4">ADU Impact on Housing Production</h2>
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5">
              {buildingPermits.totalUnits < 5 ? (
                <>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    In 2024, {town.name} issued <span className="text-white font-medium">{buildingPermits.totalUnits}</span> total
                    residential building permit{buildingPermits.totalUnits !== 1 ? 's' : ''}. In the first year of the ADU law, <span className="text-emerald-400 font-medium">{town.approved}</span> ADU
                    permit{town.approved !== 1 ? 's were' : ' was'} approved.
                  </p>
                  <p className="text-amber-400/80 text-xs mt-3">
                    Limited 2024 building permit data available. ADU share of production not shown.
                  </p>
                  <p className="text-gray-500 text-xs mt-3">
                    Source: Census Bureau (2024) via UMass Donahue Institute; EOHLC ADU Survey (2025)
                  </p>
                </>
              ) : (
                (() => {
                  const aduShare = Math.round((town.approved / buildingPermits.totalUnits) * 1000) / 10
                  const maxBar = Math.max(buildingPermits.totalUnits, town.approved) * 1.1 || 1
                  return (
                    <>
                      <p className="text-gray-400 text-sm leading-relaxed mb-5">
                        In 2024, {town.name} issued <span className="text-white font-medium">{buildingPermits.totalUnits.toLocaleString()}</span> total
                        residential building permits. In the first year of the ADU law, <span className="text-emerald-400 font-medium">{town.approved}</span> ADU
                        permits were approved — equivalent to <span className="text-white font-medium">{aduShare}%</span> of prior-year housing production.
                      </p>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-gray-400 w-36 shrink-0">2024 Building Permits</span>
                          <div className="flex-1 h-4 bg-gray-700 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(buildingPermits.totalUnits / maxBar) * 100}%` }} />
                          </div>
                          <span className="text-xs text-white w-12 text-right font-medium">{buildingPermits.totalUnits.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-gray-400 w-36 shrink-0">2025 ADU Approvals</span>
                          <div className="flex-1 h-4 bg-gray-700 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${(town.approved / maxBar) * 100}%` }} />
                          </div>
                          <span className="text-xs text-emerald-400 w-12 text-right font-medium">{town.approved}</span>
                        </div>
                      </div>
                      <p className="text-gray-500 text-xs mt-4">
                        Source: Census Bureau (2024) via UMass Donahue Institute; EOHLC ADU Survey (2025)
                      </p>
                    </>
                  )
                })()
              )}
            </div>
          </section>
        )}

        {/* ── SECTION 4: HOW TOWN COMPARES ── */}
        {nearbyTowns.length > 0 && (
          <section className="mb-10">
            <h2 className="text-lg font-bold text-white mb-4">How {town.name} Compares</h2>
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
              {/* Desktop header row */}
              <div className="hidden sm:grid grid-cols-5 gap-2 px-4 py-2 text-[10px] uppercase tracking-wider text-gray-500 border-b border-gray-700/50">
                <span>Town</span>
                <span className="text-center">Grade</span>
                <span className="text-center">Approval Rate</span>
                <span className="text-center">Per 10K</span>
                <span className="text-right">Permits</span>
              </div>

              {/* Desktop rows */}
              <div className="hidden sm:block">
                {nearbyTowns.slice(0, 4).map((t, i) => {
                  const sc = computeScorecard(t)
                  const tgc = gradeColors[sc.overall] || gradeColors.C
                  const tpc = approvalsPerTenThousandResidents(t)
                  return (
                    <Link
                      key={t.slug}
                      href={`/towns/${t.slug}`}
                      className={`grid grid-cols-5 gap-2 items-center px-4 py-3 hover:bg-gray-700/30 transition-colors ${
                        i < Math.min(nearbyTowns.length, 4) - 1 ? 'border-b border-gray-700/30' : ''
                      }`}
                    >
                      <div className="min-w-0">
                        <span className="text-white text-sm font-medium truncate block">{t.name}</span>
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
                      <div className="text-center">
                        <span className="text-sm text-gray-400">{tpc.toFixed(1)}</span>
                      </div>
                      <div className="text-right text-sm text-gray-400">{t.approved}</div>
                    </Link>
                  )
                })}
              </div>

              {/* Mobile card view */}
              <div className="sm:hidden divide-y divide-gray-700/30">
                {nearbyTowns.slice(0, 4).map(t => {
                  const sc = computeScorecard(t)
                  const tgc = gradeColors[sc.overall] || gradeColors.C
                  const tpc = approvalsPerTenThousandResidents(t)
                  return (
                    <Link
                      key={t.slug}
                      href={`/towns/${t.slug}`}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-700/30 transition-colors"
                    >
                      <span className={`text-lg font-bold ${tgc.text} w-8 shrink-0`}>{sc.overall}</span>
                      <div className="flex-1 min-w-0">
                        <span className="text-white text-sm font-medium block truncate">{t.name}</span>
                        <span className="text-gray-500 text-xs">{t.approvalRate}% rate · {tpc.toFixed(1)} per 10K</span>
                      </div>
                      <span className="text-gray-400 text-sm shrink-0">{t.approved}</span>
                    </Link>
                  )
                })}
              </div>
            </div>
            <div className="mt-3">
              <Link href={`/compare?a=${town.slug}`} className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors">
                Compare more towns <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </section>
        )}

        {/* ── SECTION 5: NEXT STEPS (audience-aware) ── */}
        <section className="mb-10">
          <h2 className="text-lg font-bold text-white mb-4">Next Steps</h2>
          <div className="space-y-2">
            {audienceContent.nextSteps.map((step, i) => {
              const Icon = iconMap[step.icon] || BookOpen
              const colors = ['text-emerald-400', 'text-blue-400', 'text-purple-400']
              return (
                <Link
                  key={i}
                  href={step.href}
                  className="flex items-center gap-3 bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3.5 hover:border-gray-600 transition-colors group"
                >
                  <Icon className={`w-5 h-5 ${colors[i % colors.length]} shrink-0`} />
                  <span className="text-sm text-gray-300 flex-1">{step.label.replace("your town's", `${town.name}'s`).replace('your county', `${town.county} County`)}</span>
                  <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors shrink-0" />
                </Link>
              )
            })}
          </div>
        </section>

        {/* ── SOURCE FOOTER ── */}
        <div className="text-gray-500 text-xs leading-relaxed p-4 bg-gray-800/30 rounded-lg border border-gray-700/50 space-y-2">
          <p>
            <span className="text-gray-400 font-medium">Sources:</span> {town.source}{town.sourceDate ? ` (${town.sourceDate})` : ''}.
            {town.hasPermitData && ' Individual permit records from municipal building department.'}
            {' '}Population estimates from 2024 Census ACS.
          </p>
          <p>
            <span className="text-gray-400 font-medium">Disclaimer:</span>{' '}
            ADU Pulse provides data for informational purposes only. It does not constitute legal, financial, or construction advice.
            {ruleWord} consistency analysis reflects our interpretation of public records and may not reflect the most current local amendments.
          </p>
          <p>
            See <Link href="/methodology" className="text-blue-400 hover:underline">methodology</Link> for details on data collection, scoring, and consistency analysis.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
