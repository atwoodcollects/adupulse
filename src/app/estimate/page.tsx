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

  const comparisons = [
    { label: 'Milton 1450 Canton Ave', type: 'Detached', sqft: 701, cost: 82000, builder: 'DIY', ppsf: 117 },
    { label: 'Milton 1112 Randolph Ave', type: 'Detached', sqft: 900, cost: 200000, builder: 'DIY', ppsf: 222 },
    { label: 'Milton 109 Whitelawn Ave', type: 'Attached', sqft: 900, cost: 253358, builder: 'Contractor', ppsf: 281 },
    { label: 'Plymouth 16 Jessica Way', type: 'Detached', sqft: 936, cost: 325000, builder: 'Contractor', ppsf: 347 },
    { label: 'Plymouth 19 Country Club Dr', type: 'Detached', sqft: 1000, cost: 350000, builder: 'Contractor', ppsf: 350 },
  ]

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
          <h2 className="text-white font-medium mb-4">Real Permit Comparisons</h2>
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
                {comparisons.map((c, i) => (
                  <tr key={i} className="border-b border-border/50">
                    <td className="p-2 text-white">{c.label}</td>
                    <td className="p-2 text-text-secondary">{c.type}</td>
                    <td className="p-2 text-text-secondary">{c.sqft}</td>
                    <td className="p-2 text-text-secondary">{formatCost(c.cost)}</td>
                    <td className="p-2 text-text-secondary">${c.ppsf}</td>
                    <td className="p-2">
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        c.builder === 'DIY' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        {c.builder}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-text-muted text-xs mt-3">Source: Town building permit applications (2025)</p>
        </div>
      </div>
    </div>
  )
}
