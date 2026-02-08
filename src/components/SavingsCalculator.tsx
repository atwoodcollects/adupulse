'use client'

import { useState } from 'react'

const presets = {
  'Detached cottage': { min: 150000, max: 400000, default: 250000 },
  'Attached addition': { min: 100000, max: 300000, default: 200000 },
  'Basement/garage conversion': { min: 80000, max: 200000, default: 120000 },
}

type PresetKey = keyof typeof presets

export default function SavingsCalculator() {
  const [aduType, setAduType] = useState<PresetKey>('Detached cottage')
  const [aduCost, setAduCost] = useState(250000)
  const [years, setYears] = useState(5)

  const assistedLivingMonthly = 6000
  const assistedLivingAnnual = assistedLivingMonthly * 12
  const assistedLivingTotal = assistedLivingAnnual * years
  const savings = assistedLivingTotal - aduCost
  const breakeven = Math.ceil(aduCost / assistedLivingAnnual * 10) / 10
  const weeklySavings = savings > 0 ? Math.round(savings / (years * 52)) : 0
  const groceryTrips = savings > 0 ? Math.round(savings / 150) : 0

  const handleTypeChange = (type: PresetKey) => {
    setAduType(type)
    setAduCost(presets[type].default)
  }

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">💡</span>
        <h3 className="text-xl font-bold text-white">What could you save?</h3>
      </div>
      <p className="text-gray-400 text-sm mb-6">
        Compare your ADU cost to what assisted living would cost over time. ADUs aren&apos;t just housing — they&apos;re a financial strategy.
      </p>

      <div className="mb-5">
        <label className="text-gray-400 text-sm mb-2 block">ADU type</label>
        <div className="grid grid-cols-3 gap-2">
          {(Object.keys(presets) as PresetKey[]).map(type => (
            <button
              key={type}
              onClick={() => handleTypeChange(type)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                aduType === type
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
              }`}
            >
              {type.split('/')[0]}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <label className="text-gray-400 text-sm">Estimated ADU cost</label>
          <span className="text-white font-bold">${aduCost.toLocaleString()}</span>
        </div>
        <input
          type="range"
          min={presets[aduType].min}
          max={presets[aduType].max}
          step={5000}
          value={aduCost}
          onChange={e => setAduCost(Number(e.target.value))}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-400"
        />
        <div className="flex justify-between text-xs text-gray-600 mt-1">
          <span>${presets[aduType].min.toLocaleString()}</span>
          <span>${presets[aduType].max.toLocaleString()}</span>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <label className="text-gray-400 text-sm">Compare over</label>
          <span className="text-white font-bold">{years} years</span>
        </div>
        <input
          type="range"
          min={1}
          max={15}
          step={1}
          value={years}
          onChange={e => setYears(Number(e.target.value))}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-400"
        />
        <div className="flex justify-between text-xs text-gray-600 mt-1">
          <span>1 year</span>
          <span>15 years</span>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-400">Your ADU (one-time cost)</span>
            <span className="text-white font-medium">${aduCost.toLocaleString()}</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-4">
            <div
              className="bg-emerald-500 h-4 rounded-full transition-all duration-500"
              style={{ width: `${Math.min((aduCost / assistedLivingTotal) * 100, 100)}%` }}
            />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-400">Assisted living ({years} {years === 1 ? 'year' : 'years'})</span>
            <span className="text-red-400 font-medium">${assistedLivingTotal.toLocaleString()}</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-4">
            <div className="bg-red-500 h-4 rounded-full transition-all duration-500" style={{ width: '100%' }} />
          </div>
        </div>
      </div>

      {savings > 0 ? (
        <div className="bg-emerald-900/20 border border-emerald-500/20 rounded-lg p-4">
          <div className="text-center mb-3">
            <div className="text-emerald-400 font-bold text-2xl">${savings.toLocaleString()}</div>
            <div className="text-gray-400 text-sm">saved over {years} years vs. assisted living</div>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <div className="text-white font-bold">{breakeven} yrs</div>
              <div className="text-gray-500 text-xs">Breakeven</div>
            </div>
            <div>
              <div className="text-white font-bold">${weeklySavings}/wk</div>
              <div className="text-gray-500 text-xs">Weekly savings</div>
            </div>
            <div>
              <div className="text-white font-bold">{groceryTrips}</div>
              <div className="text-gray-500 text-xs">Grocery trips</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-800 border border-gray-600 rounded-lg p-4 text-center">
          <p className="text-gray-400 text-sm">
            Over {years} {years === 1 ? 'year' : 'years'}, the costs are comparable. Extend the timeline to see where an ADU wins.
          </p>
        </div>
      )}

      <p className="text-gray-600 text-xs mt-3 text-center">
        Based on MA average assisted living cost of $6,000/month. ADU costs from real permit data.
      </p>
    </div>
  )
}
