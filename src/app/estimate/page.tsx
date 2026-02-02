'use client'

import { useState } from 'react'
import Link from 'next/link'

const costData = {
  detached: {
    diy: { min: 117, max: 222, avg: 170 },
    contractor: { min: 280, max: 460, avg: 340 }
  },
  attached: {
    diy: { min: 150, max: 250, avg: 200 },
    contractor: { min: 280, max: 350, avg: 310 }
  },
  conversion: {
    diy: { min: 50, max: 120, avg: 85 },
    contractor: { min: 100, max: 200, avg: 150 }
  }
}

const townMultipliers: Record<string, number> = {
  newton: 1.15,
  milton: 1.0,
  plymouth: 0.95,
  duxbury: 1.05,
  needham: 1.10,
  andover: 1.05,
  sudbury: 1.08,
  boston: 1.20,
  other: 1.0
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

const getPermitCounts = () => {
  const counts: Record<string, number> = {}
  allComparisons.forEach(c => {
    const key = `${c.type}-${c.builder}`
    counts[key] = (counts[key] || 0) + 1
  })
  return counts
}

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
        <h3 className="text-white font-medium mb-1">You're on the list!</h3>
        <p className="text-text-secondary text-sm">We'll notify you when we add your town.</p>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/30 rounded-lg p-4 sm:p-6">
      <h2 className="text-white font-medium mb-2">Don't see your town?</h2>
      <p className="text-text-secondary text-sm mb-4">Tell us which town to add next. We'll email you when it's live.</p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-400"
          />
          <input
            type="text"
            required
            placeholder="Town you want tracked"
            value={requestedTown}
            onChange={(e) => setRequestedTown(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-400"
          />
          <select
            required
            value={considering}
            onChange={(e) => setConsidering(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
          >
            <option value="" disabled>Building an ADU?</option>
            <option value="yes">Yes, planning to</option>
            <option value="maybe">Maybe / Researching</option>
            <option value="no">No, just curious</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full sm:w-auto px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium disabled:opacity-50"
        >
          {submitting ? 'Submitting...' : 'Notify me'}
        </button>
      </form>
    </div>
  )
}

export default function EstimatePage() {
  const [town, setTown] = useState('milton')
  const [type, setType] = useState<'detached' | 'attached' | 'conversion'>('detached')
  const [sqft, setSqft] = useState(800)
  const [builder, setBuilder] = useState<'diy' | 'contractor'>('contractor')

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

  const townNames: Record<string, string> = { milton: 'Milton', plymouth: 'Plymouth', duxbury: 'Duxbury', needham: 'Needham', newton: 'Newton', boston: 'Boston', andover: 'Andover', sudbury: 'Sudbury' }
  const townLinks: Record<string, string> = { milton: '/milton', plymouth: '/plymouth', duxbury: '/duxbury', needham: '/needham', newton: '/newton', boston: '/boston', andover: '/andover', sudbury: '/sudbury' }

  const getConfidenceLevel = () => {
    if (dataCount >= 5) return { label: 'High', color: 'text-emerald-400', bg: 'bg-emerald-500/20' }
    if (dataCount >= 2) return { label: 'Medium', color: 'text-amber-400', bg: 'bg-amber-500/20' }
    return { label: 'Limited', color: 'text-red-400', bg: 'bg-red-500/20' }
  }
  const confidence = getConfidenceLevel()

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <Link href="/" className="text-blue-400 text-sm mb-2 inline-block">← Back</Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">ADU Cost Estimator</h1>
        <p className="text-text-secondary text-sm mb-6">Based on real MA permit data from 2025</p>

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
                  <option value="other">Other MA Town</option>
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

        {/* Email Capture - MOVED UP */}
        <div className="mt-6">
          <EmailCapture />
        </div>

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
            {['milton', 'plymouth', 'newton', 'duxbury'].map(t => (<Link key={t} href={townLinks[t]} className="text-blue-400 text-xs hover:underline">{townNames[t]}</Link>))}
          </div>
        </div>
      </div>
    </div>
  )
}
