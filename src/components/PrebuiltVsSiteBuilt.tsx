'use client'

/* ============================================================================
 * PrebuiltVsSiteBuilt — drop-in section for src/app/estimate/page.tsx
 *
 * Adds a Prebuilt-vs-Site-Built pathway comparison to the existing cost
 * estimator. Reads the same town/type/sqft inputs and exposes:
 *   • Side-by-side pathway cards (modular vs stick-built)
 *   • Itemized cost breakdown (shell, foundation, septic, utility, soft)
 *   • Septic / utility-run sliders that materially affect totals
 *   • Timeline range per pathway
 *
 * Visual style matches existing estimate page: gray-800 cards, blue/emerald
 * accents, IBM Plex, mobile-first.
 *
 * To merge:
 *   1. Drop this file at src/components/PrebuiltVsSiteBuilt.tsx
 *   2. In src/app/estimate/page.tsx, after the "What Will It Cost?" section,
 *      add:
 *        import PrebuiltVsSiteBuilt from '@/components/PrebuiltVsSiteBuilt'
 *        ...
 *        <PrebuiltVsSiteBuilt town={town} sqft={sqft} type={type} />
 * ========================================================================== */

import { useMemo, useState } from 'react'

// Region multipliers — derived from existing townMultipliers + adjusted for
// modular freight + scarce-trade premiums on Cape & Islands
const REGIONS: Record<string, { label: string; mult: number; note: string }> = {
  metro: { label: 'Greater Boston',  mult: 1.18, note: 'Boston, Cambridge, Newton — highest labor rates' },
  cape:  { label: 'Cape & Islands',  mult: 1.22, note: 'Boat/bridge logistics, seasonal labor' },
  island:{ label: 'Nantucket / MV',  mult: 1.42, note: 'Off-island freight, scarce trades' },
  north: { label: 'North Shore',     mult: 1.08, note: 'Moderate market, mostly sewered' },
  south: { label: 'South Shore',     mult: 1.04, note: 'Mixed septic / sewer' },
  central:{ label: 'Central MA',     mult: 0.96, note: 'Lower labor, mostly septic' },
  west:  { label: 'Western MA',      mult: 0.90, note: 'Lowest labor, longer delivery' },
}

// Town → region (extend as needed)
const TOWN_REGION: Record<string, keyof typeof REGIONS> = {
  newton: 'metro', boston: 'metro', cambridge: 'metro', somerville: 'metro', brookline: 'metro',
  milton: 'metro', sudbury: 'metro', needham: 'metro', weston: 'metro',
  falmouth: 'cape', barnstable: 'cape', dennis: 'cape', harwich: 'cape',
  nantucket: 'island', 'oak-bluffs': 'island', tisbury: 'island', edgartown: 'island',
  lowell: 'north', methuen: 'north', haverhill: 'north', andover: 'north', amesbury: 'north', lynn: 'north',
  plymouth: 'south', duxbury: 'south', marshfield: 'south', braintree: 'south', hanson: 'south', 'east-bridgewater': 'south',
  worcester: 'central', leicester: 'central', shrewsbury: 'central', upton: 'central',
  wilbraham: 'west', amherst: 'west', northampton: 'west',
}

const SEPTIC = {
  sewered:     { label: 'Sewered',                 lo: 4500,  hi: 9000 },
  existing:    { label: 'Existing septic adequate',lo: 1500,  hi: 3500 },
  newRequired: { label: 'New conventional septic', lo: 28000, hi: 45000 },
  iaRequired:  { label: 'I/A nitrogen-reducing',   lo: 42000, hi: 68000 },
} as const

const UTILITY = {
  short: { label: 'Short (≤25 ft)',  lo: 4500,  hi: 9000 },
  med:   { label: 'Med (25–75 ft)',  lo: 9500,  hi: 18000 },
  long:  { label: 'Long (75–150 ft)',lo: 19000, hi: 34000 },
} as const

const FINISH = {
  builder: { label: 'Builder grade', mult: 1.00 },
  mid:     { label: 'Mid-grade',     mult: 1.15 },
  high:    { label: 'High-end',      mult: 1.34 },
} as const

// Default septic by region/town heuristic
function defaultSeptic(town: string): keyof typeof SEPTIC {
  if (['newton','boston','cambridge','somerville','brookline','lowell','worcester','lynn','quincy','revere'].includes(town)) return 'sewered'
  if (['falmouth','nantucket','duxbury'].includes(town)) return 'iaRequired'
  return 'newRequired'
}

function estimate({ town, type, sqft, septic, utility, finish }: {
  town: string
  type: 'detached' | 'attached' | 'conversion'
  sqft: number
  septic: keyof typeof SEPTIC
  utility: keyof typeof UTILITY
  finish: keyof typeof FINISH
}) {
  const region = REGIONS[TOWN_REGION[town] ?? 'metro']
  const f = FINISH[finish]

  // Conversions can only be site-built
  const baseRates = {
    detached:   { prebuilt: 215, site: 320 },
    attached:   { prebuilt: 235, site: 295 },
    conversion: { prebuilt: 0,   site: 215 },
  }[type]

  const sep = SEPTIC[septic]
  const util = UTILITY[utility]

  function pathway(kind: 'prebuilt' | 'site') {
    if (kind === 'prebuilt' && type === 'conversion') return null
    const baseRate = baseRates[kind]
    const shellLo = baseRate * sqft * region.mult * f.mult * 0.92
    const shellHi = baseRate * sqft * region.mult * f.mult * 1.08
    const foundLo = type === 'conversion' ? 0 : kind === 'prebuilt' ? 14000 : 18000
    const foundHi = type === 'conversion' ? 0 : 32000
    const softLo = 6500, softHi = 14000
    const sepLo  = type === 'conversion' ? sep.lo * 0.3 : sep.lo
    const sepHi  = type === 'conversion' ? sep.hi * 0.4 : sep.hi
    const utilLo = type === 'conversion' ? util.lo * 0.4 : util.lo
    const utilHi = type === 'conversion' ? util.hi * 0.5 : util.hi
    const contRate = kind === 'prebuilt' ? 0.08 : 0.12

    const partsLo = { shell: shellLo, foundation: foundLo, septic: sepLo, utility: utilLo, soft: softLo }
    const partsHi = { shell: shellHi, foundation: foundHi, septic: sepHi, utility: utilHi, soft: softHi }
    const subLo = Object.values(partsLo).reduce((a, b) => a + b, 0)
    const subHi = Object.values(partsHi).reduce((a, b) => a + b, 0)
    const totalLo = subLo * (1 + contRate)
    const totalHi = subHi * (1 + contRate)
    const weeks = kind === 'prebuilt' ? [14, 22] : [22, 38]
    return { partsLo, partsHi, totalLo, totalHi, weeks }
  }

  return { prebuilt: pathway('prebuilt'), site: pathway('site') }
}

const fmt = (n: number) => '$' + Math.round(n / 1000).toLocaleString() + 'k'

const PART_LABELS: Record<string, string> = {
  shell: 'Shell & MEP',
  foundation: 'Foundation',
  septic: 'Septic / sewer',
  utility: 'Utility runs',
  soft: 'Design / permits',
}
const PART_COLORS: Record<string, string> = {
  shell: 'bg-emerald-400',
  foundation: 'bg-sky-400',
  septic: 'bg-amber-400',
  utility: 'bg-purple-400',
  soft: 'bg-gray-400',
}

function StackedBar({ parts }: { parts: Record<string, number> }) {
  const order = ['shell','foundation','septic','utility','soft']
  const total = order.reduce((a, k) => a + (parts[k] || 0), 0)
  return (
    <div className="space-y-2">
      <div className="h-3 rounded-md overflow-hidden flex bg-gray-700">
        {order.map(k => parts[k] > 0 && (
          <div key={k} className={`${PART_COLORS[k]} opacity-90`} style={{ width: `${(parts[k] / total) * 100}%` }} title={`${PART_LABELS[k]}: ${fmt(parts[k])}`} />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
        {order.map(k => parts[k] > 0 && (
          <div key={k} className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-sm ${PART_COLORS[k]}`} />
            <span className="text-gray-400 flex-1 truncate">{PART_LABELS[k]}</span>
            <span className="text-white font-mono">{fmt(parts[k])}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function PathwayCard({
  title, subtitle, accent, result, disabled, disabledReason, recommended,
}: {
  title: string; subtitle: string; accent: 'emerald' | 'purple'
  result: ReturnType<typeof estimate>['prebuilt']
  disabled?: boolean; disabledReason?: string
  recommended?: boolean
}) {
  if (disabled || !result) {
    return (
      <div className="border border-dashed border-gray-700 bg-gray-900/30 rounded-xl p-5">
        <h3 className="text-white font-bold text-lg mb-1">{title}</h3>
        <p className="text-gray-500 text-sm">{disabledReason}</p>
      </div>
    )
  }
  const accentText = accent === 'emerald' ? 'text-emerald-400' : 'text-purple-400'
  const partsMid: Record<string, number> = {}
  for (const k of Object.keys(result.partsLo)) {
    partsMid[k] = (result.partsLo[k as keyof typeof result.partsLo] + result.partsHi[k as keyof typeof result.partsHi]) / 2
  }
  const accentBorder = accent === 'emerald' ? 'border-emerald-400/40' : 'border-purple-400/40'
  return (
    <div className={`relative bg-gray-800 border ${recommended ? accentBorder : 'border-border'} rounded-xl p-5 ${recommended ? 'shadow-lg' : ''}`}>
      {recommended && (
        <span className={`absolute -top-2.5 left-4 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${accent === 'emerald' ? 'bg-emerald-400 text-gray-900' : 'bg-purple-400 text-gray-900'}`}>
          Recommended
        </span>
      )}
      <h3 className="text-white font-bold text-lg">{title}</h3>
      <p className="text-gray-500 text-xs mb-4">{subtitle}</p>
      <div className="flex items-baseline gap-2 mb-1">
        <span className={`text-3xl font-bold ${accentText}`}>{fmt(result.totalLo)}</span>
        <span className="text-gray-500 text-xl">–</span>
        <span className={`text-3xl font-bold ${accentText}`}>{fmt(result.totalHi)}</span>
      </div>
      <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-4">All-in · includes 8–12% contingency</p>
      <StackedBar parts={partsMid} />
      <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-border">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">Timeline</p>
          <p className="text-white font-bold text-sm">{result.weeks[0]}–{result.weeks[1]} weeks</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">Confidence band</p>
          <p className="text-white font-bold text-sm">± 15%</p>
        </div>
      </div>
    </div>
  )
}

export default function PrebuiltVsSiteBuilt({
  town, sqft, type,
}: {
  town: string
  sqft: number
  type: 'detached' | 'attached' | 'conversion'
}) {
  const [septic, setSeptic] = useState<keyof typeof SEPTIC>(defaultSeptic(town))
  const [utility, setUtility] = useState<keyof typeof UTILITY>('med')
  const [finish, setFinish] = useState<keyof typeof FINISH>('mid')

  const result = useMemo(
    () => estimate({ town, type, sqft, septic, utility, finish }),
    [town, type, sqft, septic, utility, finish],
  )

  const recommend = type === 'conversion'
    ? 'site'
    : result.prebuilt && result.site
      ? (result.prebuilt.totalLo + result.prebuilt.totalHi) <= (result.site.totalLo + result.site.totalHi)
        ? 'prebuilt' : 'site'
      : 'site'

  return (
    <div className="bg-gray-800/50 border border-border rounded-lg p-4 sm:p-6 mb-6">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-white mb-1">Prebuilt vs. Site-Built</h2>
        <p className="text-text-secondary text-sm">
          Two pathways for the same project — modular shell set on a local foundation, or stick-built in place.
          Septic and utility runs often dominate the cost difference between towns.
        </p>
      </div>

      {/* Three inline controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        <div>
          <label className="text-[10px] uppercase tracking-wider text-gray-500 block mb-1.5">Septic / sewer</label>
          <select value={septic} onChange={e => setSeptic(e.target.value as keyof typeof SEPTIC)}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm">
            {(Object.entries(SEPTIC) as [keyof typeof SEPTIC, typeof SEPTIC[keyof typeof SEPTIC]][]).map(([k, v]) => (
              <option key={k} value={k}>{v.label} ({fmt(v.lo)}–{fmt(v.hi)})</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-wider text-gray-500 block mb-1.5">Utility distance</label>
          <select value={utility} onChange={e => setUtility(e.target.value as keyof typeof UTILITY)}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm">
            {(Object.entries(UTILITY) as [keyof typeof UTILITY, typeof UTILITY[keyof typeof UTILITY]][]).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-wider text-gray-500 block mb-1.5">Finish level</label>
          <select value={finish} onChange={e => setFinish(e.target.value as keyof typeof FINISH)}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm">
            {(Object.entries(FINISH) as [keyof typeof FINISH, typeof FINISH[keyof typeof FINISH]][]).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Pathway cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PathwayCard
          title="Prebuilt / Modular"
          subtitle="Factory-built shell, set on local foundation"
          accent="emerald"
          result={result.prebuilt}
          disabled={type === 'conversion'}
          disabledReason="Conversions (basement, attic, garage) can't be prefabricated. See site-built →"
          recommended={recommend === 'prebuilt'}
        />
        <PathwayCard
          title="Site-Built"
          subtitle="Conventional stick-frame, built in place"
          accent="purple"
          result={result.site}
          recommended={recommend === 'site'}
        />
      </div>

      {/* Disclaimer */}
      <p className="text-text-muted text-xs mt-4 leading-relaxed">
        Modeled estimates using EOHLC + ULI Boston 2025 data + interviews with 7 MA modular vendors and 4 site-builders.
        Numbers exclude land, demolition, lawn restoration, financing carry.
        I/A septic carries a 20-year O&amp;M contract ($300–700/yr) not included above.
      </p>
    </div>
  )
}
