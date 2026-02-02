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
  // Milton
  { town: 'milton', label: '1450 Canton Ave', type: 'detached', sqft: 701, cost: 82000, builder: 'diy', ppsf: 117 },
  { town: 'milton', label: '1112 Randolph Ave', type: 'detached', sqft: 900, cost: 200000, builder: 'diy', ppsf: 222 },
  { town: 'milton', label: '109 Whitelawn Ave', type: 'attached', sqft: 900, cost: 253358, builder: 'contractor', ppsf: 281 },
  // Plymouth
  { town: 'plymouth', label: '16 Jessica Way', type: 'detached', sqft: 936, cost: 325000, builder: 'contractor', ppsf: 347 },
  { town: 'plymouth', label: '1 Brandies Ln', type: 'detached', sqft: 896, cost: 125000, builder: 'contractor', ppsf: 139 },
  { town: 'plymouth', label: '899 Old Sandwich Rd', type: 'attached', sqft: 812, cost: 150000, builder: 'contractor', ppsf: 185 },
  { town: 'plymouth', label: '19 Country Club Dr', type: 'detached', sqft: 1000, cost: 350000, builder: 'contractor', ppsf: 350 },
  { town: 'plymouth', label: '12 Copper Lantern Dr', type: 'attached', sqft: 496, cost: 228000, builder: 'contractor', ppsf: 459 },
  { town: 'plymouth', label: '58 Tananger Rd', type: 'attached', sqft: 788, cost: 462834, builder: 'contractor', ppsf: 587 },
  { town: 'plymouth', label: '26 Quail Run', type: 'detached', sqft: 900, cost: 370000, builder: 'contractor', ppsf: 411 },
  // Duxbury
  { town: 'duxbury', label: '275 Powder Point Ave', type: 'detached', sqft: 899, cost: 319500, builder: 'contractor', ppsf: 355 },
  { town: 'duxbury', label: '36 Elm St', type: 'conversion', sqft: 0, cost: 290500, builder: 'contractor', ppsf: 0 },
  { town: 'duxbury', label: '45 Driftwood Dr', type: 'detached', sqft: 640, cost: 224250, builder: 'contractor', ppsf: 350 },
  { town: 'duxbury', label: '58 Franklin Ter', type: 'detached', sqft: 900, cost: 248000, builder: 'contractor', ppsf: 276 },
  // Needham
  { town: 'needham', label: '61 Grant St', type: 'conversion', sqft: 0, cost: 69000, builder: 'contractor', ppsf: 0 },
]

export default function EstimatePage() {
  const [town, setTown] = useState('milton')
  const [type, setType] = useState<'detached' | 'attached' | 'conversion'>('detached')
  const [sqft, setSqft] = useState(800)
  const [builder, setBuilder] = useState<'diy' | 'contractor'>('contractor')

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

  // Filter comparisons based on selections
  const filteredComparisons = allComparisons.filter(c => {
    // Prioritize same town, then same type, then same builder
    const townMatch = c.town === town
    const typeMatch = c.type === type
    const builderMatch = c.builder === builder
    
    // Show if matches at least type OR (town + builder)
    return typeMatch || (townMatch && builderMatch) || townMatch
  }).sort((a, b) => {
    // Sort by relevance: town match > type match > builder match
    const aScore = (a.town === town ? 4 : 0) + (a.type === type ? 2 : 0) + (a.builder === builder ? 1 : 0)
    const bScore = (b.town === town ? 4 : 0) + (b.type === type ? 2 : 0) + (b.builder === builder ? 1 : 0)
    return bScore - aScore
  }).slice(0, 5)

  const townNames: Record<string, string> = {
    milton: 'Milton',
    plymouth: 'Plymouth',
    duxbury: 'Duxbury',
    needham: 'Needham',
    newton: 'Newton',
    boston: 'Boston',
    andover: 'Andover',
    sudbury: 'Sudbury'
  }

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
                <select 
                  value={town} 
                  onChange={(e) => setTown(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                >
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
                    <button
                      key={t}
                      onClick={() => setType(t)}
                      className={`px-3 py-2 rounded-lg text-sm capitalize ${
                        type === t 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-text-secondary text-sm block mb-2">Square Feet: {sqft}</label>
                <input
                  type="range"
                  min="300"
                  max="1200"
                  step="50"
                  value={sqft}
                  onChange={(e) => setSqft(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-text-muted mt-1">
                  <span>300 sf</span>
                  <span>1200 sf</span>
                </div>
              </div>

              <div>
                <label className="text-text-secondary text-sm block mb-2">Builder</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setBuilder('diy')}
                    className={`px-3 py-2 rounded-lg text-sm ${
                      builder === 'diy' 
                        ? 'bg-emerald-600 text-white' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    DIY / Homeowner
                  </button>
                  <button
                    onClick={() => setBuilder('contractor')}
                    className={`px-3 py-2 rounded-lg text-sm ${
                      builder === 'contractor' 
                        ? 'bg-amber-600 text-white' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    Contractor
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 border border-border rounded-lg p-4 sm:p-6">
            <h2 className="text-white font-medium mb-4">Estimated Cost</h2>
            
            <div className="text-center py-4">
              <div className="text-4xl sm:text-5xl font-bold text-white mb-2">
                {formatCost(result.avg)}
              </div>
              <div className="text-text-secondary text-sm">
                Range: {formatCost(result.low)} - {formatCost(result.high)}
              </div>
              <div className="text-text-muted text-xs mt-1">
                ~${Math.round(result.ppsf)}/sf
              </div>
            </div>

            <div className="border-t border-border pt-4 mt-4">
              <h3 className="text-text-secondary text-sm mb-3">Cost Breakdown (typical)</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-muted">Building/Labor</span>
                  <span className="text-white">{formatCost(result.avg * 0.65)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Electrical</span>
                  <span className="text-white">{formatCost(result.avg * 0.10)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Plumbing</span>
                  <span className="text-white">{formatCost(result.avg * 0.12)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">HVAC</span>
                  <span className="text-white">{formatCost(result.avg * 0.08)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Permits/Other</span>
                  <span className="text-white">{formatCost(result.avg * 0.05)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-gray-800/50 border border-border rounded-lg p-4 sm:p-6">
          <h2 className="text-white font-medium mb-4">Similar Permitted Projects</h2>
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
                    <th className="text-left p-2">Builder</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredComparisons.map((c, i) => (
                    <tr key={i} className="border-b border-border/50">
                      <td className="p-2 text-white">
                        <span className="text-text-muted">{townNames[c.town] || c.town}</span> {c.label}
                      </td>
                      <td className="p-2">
                        <span className={`px-2 py-0.5 rounded text-xs capitalize ${
                          c.type === type ? 'bg-blue-500/20 text-blue-400' : 'text-text-secondary'
                        }`}>
                          {c.type}
                        </span>
                      </td>
                      <td className="p-2 text-text-secondary">{c.sqft > 0 ? c.sqft : '—'}</td>
                      <td className="p-2 text-text-secondary">{formatCost(c.cost)}</td>
                      <td className="p-2 text-text-secondary">{c.ppsf > 0 ? '$' + c.ppsf : '—'}</td>
                      <td className="p-2">
                        <span className={`px-2 py-0.5 rounded text-xs uppercase ${
                          c.builder === 'diy' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          {c.builder}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-text-muted text-sm">No matching permits found. Try adjusting your filters.</p>
          )}
          <p className="text-text-muted text-xs mt-3">Source: Town building permit applications (2025)</p>
        </div>
      </div>
    </div>
  )
}
