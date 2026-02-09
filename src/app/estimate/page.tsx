'use client'

import { useState } from 'react'
import Link from 'next/link'
import SavingsCalculator from '@/components/SavingsCalculator'

// --- EXISTING COST DATA ---
const costData = {
  detached: { diy: { min: 117, max: 222, avg: 170 }, contractor: { min: 280, max: 460, avg: 340 } },
  attached: { diy: { min: 150, max: 250, avg: 200 }, contractor: { min: 280, max: 350, avg: 310 } },
  conversion: { diy: { min: 50, max: 120, avg: 85 }, contractor: { min: 100, max: 200, avg: 150 } }
}

const townMultipliers: Record<string, number> = {
  newton: 1.15, milton: 1.0, plymouth: 0.95, duxbury: 1.05,
  needham: 1.10, andover: 1.05, sudbury: 1.08, boston: 1.20, other: 1.0
}

const allComparisons = [
  { town: 'milton', label: '1450 Canton Ave', type: 'detached', sqft: 701, cost: 82000, builder: 'diy', ppsf: 117, notes: 'Nest Home Plans design' },
  { town: 'milton', label: '1112 Randolph Ave', type: 'detached', sqft: 900, cost: 200000, builder: 'diy', ppsf: 222, notes: 'ADU above 2-car garage' },
  { town: 'milton', label: '109 Whitelawn Ave', type: 'attached', sqft: 900, cost: 253358, builder: 'contractor', ppsf: 281, notes: '2BR, accessibility features' },
  { town: 'plymouth', label: '16 Jessica Way', type: 'detached', sqft: 936, cost: 325000, builder: 'contractor', ppsf: 347, notes: '' },
  { town: 'plymouth', label: '1 Brandies Ln', type: 'detached', sqft: 896, cost: 125000, builder: 'contractor', ppsf: 139, notes: 'Lowest $/sf detached' },
  { town: 'plymouth', label: '899 Old Sandwich Rd', type: 'attached', sqft: 812, cost: 150000, builder: 'contractor', ppsf: 185, notes: '3-car garage with ADU' },
  { town: 'plymouth', label: '19 Country Club Dr', type: 'detached', sqft: 1000, cost: 350000, builder: 'contractor', ppsf: 350, notes: '' },
  { town: 'plymouth', label: '12 Copper Lantern Dr', type: 'attached', sqft: 496, cost: 228000, builder: 'contractor', ppsf: 459, notes: 'Small unit, high $/sf' },
  { town: 'plymouth', label: '58 Tananger Rd', type: 'attached', sqft: 788, cost: 462834, builder: 'contractor', ppsf: 587, notes: '1BR with garage below' },
  { town: 'plymouth', label: '26 Quail Run', type: 'detached', sqft: 900, cost: 370000, builder: 'contractor', ppsf: 411, notes: '2BR/1BA with 2-car garage' },
  { town: 'duxbury', label: '275 Powder Point Ave', type: 'detached', sqft: 899, cost: 319500, builder: 'contractor', ppsf: 355, notes: '' },
  { town: 'duxbury', label: '36 Elm St', type: 'conversion', sqft: 0, cost: 290500, builder: 'contractor', ppsf: 0, notes: 'Internal conversion' },
  { town: 'duxbury', label: '45 Driftwood Dr', type: 'detached', sqft: 640, cost: 224250, builder: 'contractor', ppsf: 350, notes: 'Modular (Backyard ADUs LLC)' },
  { town: 'duxbury', label: '58 Franklin Ter', type: 'detached', sqft: 900, cost: 248000, builder: 'contractor', ppsf: 276, notes: '' },
  { town: 'needham', label: '61 Grant St', type: 'conversion', sqft: 0, cost: 69000, builder: 'contractor', ppsf: 0, notes: 'Internal conversion' },
  { town: 'newton', label: '38 Circuit Ave', type: 'detached', sqft: 1110, cost: 785000, builder: 'contractor', ppsf: 707, notes: 'High-end build' },
  { town: 'newton', label: '143 Valentine St', type: 'conversion', sqft: 982, cost: 400000, builder: 'contractor', ppsf: 407, notes: 'Basement conversion' },
  { town: 'newton', label: '87 Auburndale Ave', type: 'detached', sqft: 557, cost: 150000, builder: 'contractor', ppsf: 269, notes: '' },
  { town: 'newton', label: '15 Crescent St', type: 'conversion', sqft: 1278, cost: 750000, builder: 'contractor', ppsf: 587, notes: '' },
  { town: 'newton', label: '28 Hillcrest Rd', type: 'conversion', sqft: 874, cost: 100000, builder: 'contractor', ppsf: 114, notes: 'Lowest cost conversion' },
  { town: 'newton', label: '64 Windermere Rd', type: 'conversion', sqft: 999, cost: 150000, builder: 'contractor', ppsf: 150, notes: '' },
]

// --- NEW: MARKET DATA FOR ROI CALCULATOR ---
const townMarketData: Record<string, { avgRent: number; rentYoY: number; medianHome: number; propertyUplift: number }> = {
  boston:    { avgRent: 2850, rentYoY: -0.8, medianHome: 785000, propertyUplift: 0.18 },
  newton:   { avgRent: 2950, rentYoY: -0.3, medianHome: 1150000, propertyUplift: 0.15 },
  milton:   { avgRent: 2400, rentYoY: -0.6, medianHome: 720000, propertyUplift: 0.18 },
  plymouth: { avgRent: 2100, rentYoY: -1.1, medianHome: 520000, propertyUplift: 0.20 },
  duxbury:  { avgRent: 2700, rentYoY: -0.5, medianHome: 950000, propertyUplift: 0.16 },
  needham:  { avgRent: 3000, rentYoY: -0.2, medianHome: 1250000, propertyUplift: 0.14 },
  andover:  { avgRent: 2650, rentYoY: -0.4, medianHome: 880000, propertyUplift: 0.16 },
  sudbury:  { avgRent: 2800, rentYoY: -0.3, medianHome: 1050000, propertyUplift: 0.15 },
}

const NATIONAL_RENT_YOY = -1.4
const NATIONAL_AVG_RENT = 1695
const ASSISTED_LIVING_MONTHLY_MA = 6500

type GoalKey = 'rental' | 'family' | 'aging' | 'value'

const GOALS: Record<GoalKey, { icon: string; label: string; desc: string }> = {
  rental: { icon: '💰', label: 'Rental Income', desc: 'Generate monthly cash flow' },
  family: { icon: '👨‍👩‍👧', label: 'Family Housing', desc: 'House a family member' },
  aging:  { icon: '🏡', label: 'Age in Place', desc: 'Stay home as you age' },
  value:  { icon: '📈', label: 'Property Value', desc: 'Increase home equity' },
}

// --- HELPERS ---
const getPermitCounts = () => {
  const counts: Record<string, number> = {}
  allComparisons.forEach(c => {
    const key = `${c.type}-${c.builder}`
    counts[key] = (counts[key] || 0) + 1
  })
  return counts
}

const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
const fmtPct = (n: number) => `${n > 0 ? '+' : ''}${n.toFixed(1)}%`

// --- NEW COMPONENTS ---

function RentMarketCallout({ town, townKey }: { town: string; townKey: string }) {
  const data = townMarketData[townKey]
  if (!data) return null

  const diff = data.rentYoY - NATIONAL_RENT_YOY
  const better = diff > 0

  return (
    <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/30 rounded-lg p-4 sm:p-6 relative overflow-hidden">
      <div className={`absolute -top-10 -right-10 w-28 h-28 rounded-full ${better ? 'bg-emerald-500/10' : 'bg-amber-500/10'}`} />
      <div className="text-xs uppercase tracking-widest text-blue-400 mb-3 font-medium">
        📍 National Headlines vs. Your Town
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <div>
          <div className="text-text-muted text-xs mb-1">US Avg Rent YoY</div>
          <div className="text-2xl font-bold text-red-400">{fmtPct(NATIONAL_RENT_YOY)}</div>
          <div className="text-text-muted text-xs mt-0.5">{fmt(NATIONAL_AVG_RENT)}/mo avg</div>
        </div>
        <div className="hidden sm:block border-l border-blue-500/20 pl-6">
          <div className="text-text-muted text-xs mb-1">{town} Rent YoY</div>
          <div className={`text-2xl font-bold ${better ? 'text-emerald-400' : 'text-amber-400'}`}>{fmtPct(data.rentYoY)}</div>
          <div className="text-text-muted text-xs mt-0.5">{fmt(data.avgRent)}/mo avg</div>
        </div>
        <div className="sm:hidden">
          <div className="text-text-muted text-xs mb-1">{town} Rent YoY</div>
          <div className={`text-2xl font-bold ${better ? 'text-emerald-400' : 'text-amber-400'}`}>{fmtPct(data.rentYoY)}</div>
          <div className="text-text-muted text-xs mt-0.5">{fmt(data.avgRent)}/mo avg</div>
        </div>
        <div className="hidden sm:block border-l border-blue-500/20 pl-6">
          <div className="text-text-muted text-xs mb-1">Local Context</div>
          <div className="text-text-secondary text-sm leading-relaxed">
            {better
              ? `${town} is outperforming the national average by ${diff.toFixed(1)}pp. Local demand remains stronger than headlines suggest.`
              : `${town} is tracking close to national trends. Focus on non-rental value drivers like property uplift.`
            }
          </div>
        </div>
      </div>
    </div>
  )
}

function GoalSelector({ selected, onSelect }: { selected: GoalKey; onSelect: (g: GoalKey) => void }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
      {(Object.entries(GOALS) as [GoalKey, typeof GOALS[GoalKey]][]).map(([key, { icon, label, desc }]) => {
        const active = selected === key
        return (
          <button
            key={key}
            onClick={() => onSelect(key)}
            className={`text-left rounded-lg p-3 transition-all border ${
              active
                ? 'bg-blue-600/20 border-blue-500/50'
                : 'bg-gray-800/50 border-border hover:bg-gray-700/50'
            }`}
          >
            <div className="text-xl mb-1">{icon}</div>
            <div className={`text-sm font-medium ${active ? 'text-white' : 'text-gray-400'}`}>{label}</div>
            <div className="text-text-muted text-xs mt-0.5">{desc}</div>
          </button>
        )
      })}
    </div>
  )
}

function RentScenarioSlider({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const scenarios = [
    { val: -2, label: 'Pessimistic', color: 'text-red-400' },
    { val: -1, label: 'Slight decline', color: 'text-amber-400' },
    { val: 0, label: 'Flat', color: 'text-gray-400' },
    { val: 1, label: 'Slight growth', color: 'text-emerald-400' },
    { val: 2, label: 'Optimistic', color: 'text-emerald-400' },
  ]
  const current = scenarios.find(s => s.val === value) || scenarios[2]

  return (
    <div className="bg-gray-800/30 border border-border rounded-lg p-4">
      <div className="flex justify-between items-center mb-3">
        <span className="text-text-muted text-xs uppercase tracking-wider">Rent Growth Scenario</span>
        <span className={`text-sm font-semibold font-mono ${current.color}`}>
          {value > 0 ? '+' : ''}{value}% YoY — {current.label}
        </span>
      </div>
      <input
        type="range" min={-2} max={2} step={1} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-400"
      />
      <div className="flex justify-between text-xs text-text-muted mt-1">
        <span>-2%</span><span>0%</span><span>+2%</span>
      </div>
    </div>
  )
}

function ValueBreakdown({
  goal, townKey, aduCost, rentScenario, years
}: {
  goal: GoalKey; townKey: string; aduCost: number; rentScenario: number; years: number
}) {
  const data = townMarketData[townKey]
  if (!data) return null

  const monthlyRent = data.avgRent * 0.85 // conservative: 85% of market for ADU

  // Cumulative rent over N years with scenario growth
  let cumulativeRent = 0
  let currentRent = monthlyRent
  for (let y = 0; y < years; y++) {
    cumulativeRent += currentRent * 12
    currentRent *= (1 + rentScenario / 100)
  }

  const propertyUplift = data.medianHome * data.propertyUplift
  const familySavings = monthlyRent * 12 * years
  const agingSavings = ASSISTED_LIVING_MONTHLY_MA * 12 * Math.min(years, 5)

  const lines: { label: string; value: number; color: string }[] = []

  if (goal === 'rental' || goal === 'value') {
    lines.push({ label: `Rental income (${years}yr, ${rentScenario > 0 ? '+' : ''}${rentScenario}% scenario)`, value: cumulativeRent, color: 'text-blue-400' })
  }
  lines.push({ label: 'Est. property value increase', value: propertyUplift, color: 'text-emerald-400' })
  if (goal === 'family') {
    lines.push({ label: `Family housing savings (${years}yr)`, value: familySavings, color: 'text-amber-400' })
  }
  if (goal === 'aging') {
    lines.push({ label: `Avoided assisted living costs (up to 5yr)`, value: agingSavings, color: 'text-purple-400' })
  }

  const totalValue = lines.reduce((s, l) => s + l.value, 0)
  const roi = ((totalValue - aduCost) / aduCost * 100)
  const paybackYears = goal === 'rental' ? (aduCost / (monthlyRent * 12)) : null

  // Colors for bar segments (raw tailwind doesn't work for dynamic widths, using inline for the bar)
  const barColors: Record<string, string> = {
    'text-blue-400': '#60a5fa',
    'text-emerald-400': '#34d399',
    'text-amber-400': '#fbbf24',
    'text-purple-400': '#a78bfa',
  }

  return (
    <div className="bg-gray-800/50 border border-border rounded-lg p-4 sm:p-6">
      <div className="text-xs uppercase tracking-widest text-blue-400 mb-4 font-medium">
        {years}-Year Value Breakdown — {GOALS[goal]?.icon} {GOALS[goal]?.label}
      </div>

      {/* Cost line */}
      <div className="flex justify-between items-center py-2.5 border-b border-border">
        <span className="text-text-secondary text-sm">Est. ADU construction cost</span>
        <span className="text-red-400 font-semibold font-mono">-{fmt(aduCost)}</span>
      </div>

      {/* Value lines */}
      {lines.map((line, i) => (
        <div key={i} className="flex justify-between items-center py-2.5 border-b border-border/50">
          <span className="text-text-muted text-sm">{line.label}</span>
          <span className={`font-semibold font-mono ${line.color}`}>+{fmt(line.value)}</span>
        </div>
      ))}

      {/* Bar visualization */}
      <div className="mt-4 mb-3 h-2 rounded-full bg-gray-700/50 overflow-hidden flex">
        {lines.map((line, i) => (
          <div
            key={i}
            className="h-full transition-all duration-500"
            style={{
              width: `${(line.value / totalValue) * 100}%`,
              backgroundColor: barColors[line.color] || '#60a5fa',
            }}
          />
        ))}
      </div>

      {/* Totals */}
      <div className="flex justify-between items-center pt-4 border-t-2 border-border mt-2">
        <div>
          <div className="text-text-secondary text-sm">Total est. value created</div>
          <div className="text-3xl sm:text-4xl font-bold text-white font-mono">{fmt(totalValue)}</div>
        </div>
        <div className="text-right">
          <div className={`text-xl sm:text-2xl font-bold font-mono ${roi > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {roi > 0 ? '+' : ''}{roi.toFixed(0)}% ROI
          </div>
          {paybackYears && (
            <div className="text-text-muted text-sm mt-0.5">~{paybackYears.toFixed(1)} year payback</div>
          )}
        </div>
      </div>
    </div>
  )
}

// --- EXISTING COMPONENTS ---

function EmailCapture() {
  const [email, setEmail] = useState('')
  const [requestedTown, setRequestedTown] = useState('')
  const [considering, setConsidering] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await fetch('https://formspree.io/f/xzdvvzyr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, town: requestedTown, considering, source: 'estimate_page' })
      })
      setSubmitted(true)
    } catch (err) {
      console.error(err)
    }
    setSubmitting(false)
  }

  if (submitted) {
    return (
      <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/30 rounded-lg p-4 text-center">
        <div className="text-2xl mb-2">✓</div>
        <h3 className="text-white font-medium mb-1">You&apos;re on the list!</h3>
        <p className="text-text-secondary text-sm">We&apos;ll notify you when we add your town.</p>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/30 rounded-lg p-4 sm:p-6">
      <h2 className="text-white font-medium mb-2">Don&apos;t see your town?</h2>
      <p className="text-text-secondary text-sm mb-4">Tell us which town to add next. We&apos;ll email you when it&apos;s live.</p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-400" />
          <input type="text" required placeholder="Town you want tracked" value={requestedTown} onChange={(e) => setRequestedTown(e.target.value)} className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-400" />
          <select required value={considering} onChange={(e) => setConsidering(e.target.value)} className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm">
            <option value="" disabled>Building an ADU?</option>
            <option value="yes">Yes, planning to</option>
            <option value="maybe">Maybe / Researching</option>
            <option value="no">No, just curious</option>
          </select>
        </div>
        <button type="submit" disabled={submitting} className="w-full sm:w-auto px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium disabled:opacity-50">
          {submitting ? 'Submitting...' : 'Notify me'}
        </button>
      </form>
    </div>
  )
}

// --- MAIN PAGE ---

export default function EstimatePage() {
  const [town, setTown] = useState('milton')
  const [type, setType] = useState<'detached' | 'attached' | 'conversion'>('detached')
  const [sqft, setSqft] = useState(800)
  const [builder, setBuilder] = useState<'diy' | 'contractor'>('contractor')

  // New state for ROI section
  const [goal, setGoal] = useState<GoalKey>('rental')
  const [rentScenario, setRentScenario] = useState(0)
  const [roiYears, setRoiYears] = useState(10)

  const permitCounts = getPermitCounts()

  const calculate = () => {
    const base = costData[type][builder]
    const multiplier = townMultipliers[town] || 1.0
    const lowEst = Math.round(base.min * sqft * multiplier)
    const highEst = Math.round(base.max * sqft * multiplier)
    const avgEst = Math.round(base.avg * sqft * multiplier)
    return { low: lowEst, high: highEst, avg: avgEst, ppsf: base.avg * multiplier }
  }

  const result = calculate()

  const formatCost = (cost: number) => {
    if (cost >= 1000000) return '$' + (cost / 1000000).toFixed(2) + 'M'
    if (cost >= 1000) return '$' + Math.round(cost / 1000) + 'K'
    return '$' + cost
  }

  const getFilteredComparisons = () => {
    let filtered = allComparisons.filter(c => c.type === type)
    const townFiltered = filtered.filter(c => c.town === town)
    if (townFiltered.length >= 2) filtered = townFiltered
    return filtered.sort((a, b) => {
      const aScore = (a.town === town ? 4 : 0) + (a.type === type ? 2 : 0) + (a.builder === builder ? 1 : 0)
      const bScore = (b.town === town ? 4 : 0) + (b.type === type ? 2 : 0) + (b.builder === builder ? 1 : 0)
      return bScore - aScore
    }).slice(0, 5)
  }

  const filteredComparisons = getFilteredComparisons()
  const dataCount = permitCounts[`${type}-${builder}`] || 0
  const totalTypeCount = allComparisons.filter(c => c.type === type).length

  const townNames: Record<string, string> = {
    milton: 'Milton', plymouth: 'Plymouth', duxbury: 'Duxbury', needham: 'Needham',
    newton: 'Newton', boston: 'Boston', andover: 'Andover', sudbury: 'Sudbury'
  }

  const townLinks: Record<string, string> = {
    milton: '/milton', plymouth: '/plymouth', duxbury: '/duxbury', needham: '/needham',
    newton: '/newton', boston: '/boston', andover: '/andover', sudbury: '/sudbury'
  }

  const getConfidenceLevel = () => {
    if (dataCount >= 5) return { label: 'High', color: 'text-emerald-400', bg: 'bg-emerald-500/20' }
    if (dataCount >= 2) return { label: 'Medium', color: 'text-amber-400', bg: 'bg-amber-500/20' }
    return { label: 'Limited', color: 'text-red-400', bg: 'bg-red-500/20' }
  }

  const confidence = getConfidenceLevel()
  const hasMarketData = !!townMarketData[town]

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <Link href="/" className="text-blue-400 text-sm mb-2 inline-block">← Back</Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">ADU Cost Estimator</h1>
        <p className="text-text-secondary text-sm mb-6">Based on real MA permit data from 2025</p>

        {/* ========== EXISTING: Cost Estimator ========== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800/50 border border-border rounded-lg p-4 sm:p-6">
            <h2 className="text-white font-medium mb-4">Your Project</h2>
            <div className="space-y-4">
              <div>
                <label className="text-text-secondary text-sm block mb-2">Town</label>
                <select value={town} onChange={(e) => setTown(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white">
                  <option value="boston">Boston</option>
                  <option value="newton">Newton</option>
                  <option value="milton">Milton</option>
                  <option value="plymouth">Plymouth</option>
                  <option value="duxbury">Duxbury</option>
                  <option value="needham">Needham</option>
                  <option value="andover">Andover</option>
                  <option value="sudbury">Sudbury</option>
                </select>
              </div>
              <div>
                <label className="text-text-secondary text-sm block mb-2">ADU Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['detached', 'attached', 'conversion'] as const).map((t) => (
                    <button key={t} onClick={() => setType(t)} className={`px-3 py-2 rounded-lg text-sm capitalize ${type === t ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>{t}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-text-secondary text-sm block mb-2">Square Feet: {sqft}</label>
                <input type="range" min="300" max="1200" step="50" value={sqft} onChange={(e) => setSqft(Number(e.target.value))} className="w-full" />
                <div className="flex justify-between text-xs text-text-muted mt-1"><span>300 sf</span><span>1200 sf</span></div>
              </div>
              <div>
                <label className="text-text-secondary text-sm block mb-2">Builder</label>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => setBuilder('diy')} className={`px-3 py-2 rounded-lg text-sm ${builder === 'diy' ? 'bg-emerald-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>DIY / Homeowner</button>
                  <button onClick={() => setBuilder('contractor')} className={`px-3 py-2 rounded-lg text-sm ${builder === 'contractor' ? 'bg-amber-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>Contractor</button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 border border-border rounded-lg p-4 sm:p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-white font-medium">Estimated Cost</h2>
              <span className={`px-2 py-1 rounded text-xs ${confidence.bg} ${confidence.color}`}>{confidence.label} confidence</span>
            </div>
            <div className="text-center py-4">
              <div className="text-4xl sm:text-5xl font-bold text-white mb-2">{formatCost(result.avg)}</div>
              <div className="text-text-secondary text-sm">Range: {formatCost(result.low)} - {formatCost(result.high)}</div>
              <div className="text-text-muted text-xs mt-1">~${Math.round(result.ppsf)}/sf</div>
            </div>
            <div className="bg-gray-700/30 rounded-lg p-3 mb-4">
              <div className="text-xs text-text-muted mb-1">$/sf range for {type} + {builder === 'diy' ? 'DIY' : 'Contractor'}</div>
              <div className="text-sm text-white">${costData[type][builder].min} - ${costData[type][builder].max}/sf<span className="text-text-muted ml-2">({dataCount > 0 ? dataCount : totalTypeCount} permits)</span></div>
            </div>
            <div className="border-t border-border pt-4">
              <h3 className="text-text-secondary text-sm mb-3">Cost Breakdown (typical)</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-text-muted">Building/Labor</span><span className="text-white">{formatCost(result.avg * 0.65)}</span></div>
                <div className="flex justify-between"><span className="text-text-muted">Electrical</span><span className="text-white">{formatCost(result.avg * 0.10)}</span></div>
                <div className="flex justify-between"><span className="text-text-muted">Plumbing</span><span className="text-white">{formatCost(result.avg * 0.12)}</span></div>
                <div className="flex justify-between"><span className="text-text-muted">HVAC</span><span className="text-white">{formatCost(result.avg * 0.08)}</span></div>
                <div className="flex justify-between"><span className="text-text-muted">Permits/Other</span><span className="text-white">{formatCost(result.avg * 0.05)}</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* ========== EXISTING: Savings Calculator + Email ========== */}
        <div className="mt-6">
          <SavingsCalculator />
        </div>

        {/* ========== NEW: Goal-Based ROI Section ========== */}
        {hasMarketData && (
          <div className="mt-6 space-y-4">
            {/* Section header */}
            <div className="border-t border-border pt-6">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-xl">⚡</span>
                <h2 className="text-xl font-bold text-white">What&apos;s your ADU really worth?</h2>
              </div>
              <p className="text-text-secondary text-sm mb-4 ml-9">
                See the full ROI picture based on your goal — not just the sticker price.
              </p>
            </div>

            {/* Rent market callout */}
            <RentMarketCallout town={townNames[town] || town} townKey={town} />

            {/* Goal selector */}
            <div>
              <label className="text-text-secondary text-sm block mb-2">What&apos;s your primary goal?</label>
              <GoalSelector selected={goal} onSelect={setGoal} />
            </div>

            {/* Controls row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <RentScenarioSlider value={rentScenario} onChange={setRentScenario} />
              <div className="bg-gray-800/30 border border-border rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-text-muted text-xs uppercase tracking-wider">Time Horizon</span>
                  <span className="text-sm font-semibold text-white">{roiYears} years</span>
                </div>
                <input
                  type="range" min={5} max={20} step={5} value={roiYears}
                  onChange={e => setRoiYears(Number(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-400"
                />
                <div className="flex justify-between text-xs text-text-muted mt-1">
                  <span>5yr</span><span>10yr</span><span>15yr</span><span>20yr</span>
                </div>
              </div>
            </div>

            {/* Value breakdown */}
            <ValueBreakdown
              goal={goal}
              townKey={town}
              aduCost={result.avg}
              rentScenario={rentScenario}
              years={roiYears}
            />

            {/* Disclaimer */}
            <div className="text-text-muted text-xs leading-relaxed p-3 bg-gray-800/20 rounded-lg border border-border/50">
              ⚠️ Estimates are illustrative and based on local market averages. Actual costs, rents, and property values vary significantly. Assisted living cost based on MA state average of $6,500/mo. Consult a financial advisor before making investment decisions.
            </div>
          </div>
        )}

        {/* ========== EXISTING: Email Capture ========== */}
        <div className="mt-6">
          <EmailCapture />
        </div>

        {/* ========== EXISTING: Similar Permitted Projects ========== */}
        <div className="mt-6 bg-gray-800/50 border border-border rounded-lg p-4 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-white font-medium">Similar Permitted Projects</h2>
            {townLinks[town] && <Link href={townLinks[town]} className="text-blue-400 text-xs hover:underline">View all {townNames[town]} permits →</Link>}
          </div>
          {filteredComparisons.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-text-secondary border-b border-border">
                    <th className="text-left p-2">Location</th>
                    <th className="text-left p-2">Type</th>
                    <th className="text-left p-2">Sqft</th>
                    <th className="text-left p-2">Cost</th>
                    <th className="text-left p-2">$/sf</th>
                    <th className="text-left p-2 hidden sm:table-cell">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredComparisons.map((c, i) => (
                    <tr key={i} className="border-b border-border/50">
                      <td className="p-2"><span className="text-white">{c.label}</span><span className="text-text-muted text-xs block">{townNames[c.town]}</span></td>
                      <td className="p-2"><span className={`px-2 py-0.5 rounded text-xs capitalize ${c.type === type ? 'bg-blue-500/20 text-blue-400' : 'text-text-secondary'}`}>{c.type}</span></td>
                      <td className="p-2 text-text-secondary">{c.sqft > 0 ? c.sqft : '—'}</td>
                      <td className="p-2 text-white font-medium">{formatCost(c.cost)}</td>
                      <td className="p-2 text-text-secondary">{c.ppsf > 0 ? '$' + c.ppsf : '—'}</td>
                      <td className="p-2 text-text-muted text-xs hidden sm:table-cell">{c.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-text-muted text-sm mb-2">Limited data for {townNames[town]} + {type}.</p>
              <p className="text-text-secondary text-xs">Showing estimates based on similar MA towns.</p>
            </div>
          )}
          <div className="mt-4 pt-4 border-t border-border flex flex-wrap gap-2">
            <span className="text-text-muted text-xs">Explore town data:</span>
            {['milton', 'plymouth', 'newton', 'duxbury'].map(t => (
              <Link key={t} href={townLinks[t]} className="text-blue-400 text-xs hover:underline">{townNames[t]}</Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
