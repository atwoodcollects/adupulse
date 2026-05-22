'use client'

/* ============================================================================
 * Regulations Explorer — client UI.
 *
 * Derives rule × town matrix at module-load from compliance-data.ts:
 *   • Groups provisions by topic (max-size, parking, owner-occ, etc.)
 *   • Each cell shows local rule vs. state baseline, evidence-basis colored
 *   • Filter by category, search by rule name, multi-select up to 8 towns
 * ========================================================================== */

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Search } from 'lucide-react'
import { allEntries, getEvidenceBasis, evidenceBasisConfig, type ComplianceProvision, type ProvisionCategory } from '@/app/compliance/compliance-data'

/* ── Build a rule → town matrix from raw provisions ──────────────────── */
type Rule = {
  topic: string                    // canonical bucket: "Max Size", "Parking", etc.
  category: ProvisionCategory
  stateText: string                // representative state-law sentence
  towns: Record<string, ComplianceProvision>  // slug -> provision
}

// Heuristic topic extractor based on provision-name keywords. Conservative:
// when in doubt we use the original provision name as its own topic.
function topicOf(name: string): string {
  const n = name.toLowerCase()
  if (n.includes('owner') && n.includes('occupanc')) return 'Owner-Occupancy'
  if (n.includes('family') && (n.includes('occup') || n.includes('only')))   return 'Family-Only Occupancy'
  if (n.includes('parking'))            return 'Parking'
  if (n.includes('size') || n.includes('900 sq') || n.includes('square foot')) return 'Maximum Size'
  if (n.includes('bedroom'))             return 'Bedroom Limit'
  if (n.includes('lot size') || n.includes('minimum lot')) return 'Minimum Lot Size'
  if (n.includes('special permit') || n.includes('discretionary')) return 'Special Permit / Discretionary Review'
  if (n.includes('by-right') || n.includes('ministerial'))         return 'By-Right Permitting'
  if (n.includes('detached'))            return 'Detached ADU Allowance'
  if (n.includes('attached'))            return 'Attached ADU Restrictions'
  if (n.includes('design') || n.includes('architectural') || n.includes('harmonious')) return 'Design Standards'
  if (n.includes('site plan'))           return 'Site Plan Review'
  if (n.includes('setback'))             return 'Setbacks'
  if (n.includes('short-term') || n.includes('str') || n.includes('rental') && n.includes('period')) return 'Short-Term Rental'
  if (n.includes('district') || n.includes('zoning'))              return 'District / Zoning Scope'
  if (n.includes('height'))              return 'Height'
  if (n.includes('footprint'))           return 'Footprint'
  if (n.includes('building code') || n.includes('title 5'))        return 'Code & Septic Compliance'
  if (n.includes('number of'))           return 'Number of ADUs'
  return name // fall back to raw name
}

function buildRules(): Rule[] {
  const rules = new Map<string, Rule>()
  for (const town of allEntries) {
    for (const p of town.provisions) {
      const topic = topicOf(p.provision)
      let rule = rules.get(topic)
      if (!rule) {
        rule = { topic, category: p.category, stateText: p.stateLaw, towns: {} }
        rules.set(topic, rule)
      }
      // Pick the most-detailed state-law text we've seen for this topic
      if (p.stateLaw.length > rule.stateText.length) rule.stateText = p.stateLaw
      rule.towns[town.slug] = p
    }
  }
  // Sort: topics that appear most often first
  return [...rules.values()].sort((a, b) => Object.keys(b.towns).length - Object.keys(a.towns).length)
}

const CATEGORIES: { id: ProvisionCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All categories' },
  { id: 'Use & Occupancy', label: 'Use & Occupancy' },
  { id: 'Dimensional & Parking', label: 'Dimensional & Parking' },
  { id: 'Building & Safety', label: 'Building & Safety' },
  { id: 'Process & Administration', label: 'Process & Admin' },
]

const DEFAULT_TOWNS = ['falmouth', 'newton', 'boston', 'worcester', 'somerville', 'plymouth']

/* ── UI ───────────────────────────────────────────────────────────────── */

export default function RegulationsExplorerClient() {
  const rules = useMemo(buildRules, [])
  const [category, setCategory] = useState<ProvisionCategory | 'all'>('all')
  const [query, setQuery] = useState('')
  const [selectedTowns, setSelectedTowns] = useState<string[]>(DEFAULT_TOWNS)
  const [expandedRule, setExpandedRule] = useState<string | null>(null)

  const allTowns = useMemo(() => allEntries.map(t => ({ slug: t.slug, name: t.name })).sort((a, b) => a.name.localeCompare(b.name)), [])

  const filteredRules = useMemo(() => rules.filter(r => {
    if (category !== 'all' && r.category !== category) return false
    if (query && !r.topic.toLowerCase().includes(query.toLowerCase()) && !r.stateText.toLowerCase().includes(query.toLowerCase())) return false
    return true
  }), [rules, category, query])

  function toggleTown(slug: string) {
    setSelectedTowns(prev => prev.includes(slug)
      ? prev.filter(s => s !== slug)
      : prev.length < 8 ? [...prev, slug] : prev)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      {/* Filters bar */}
      <div className="bg-gray-800/50 border border-border rounded-xl p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 flex items-center gap-2 bg-gray-900/60 border border-border rounded-lg px-3 py-2">
            <Search className="w-4 h-4 text-gray-500 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search rules…"
              className="flex-1 bg-transparent text-white text-sm placeholder-gray-500 focus:outline-none"
            />
          </div>
          <select
            value={category}
            onChange={e => setCategory(e.target.value as ProvisionCategory | 'all')}
            className="bg-gray-900/60 border border-border rounded-lg px-3 py-2 text-white text-sm"
          >
            {CATEGORIES.map(c => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Town picker */}
      <div className="bg-gray-800/50 border border-border rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
            Select towns · max 8
          </span>
          <button
            onClick={() => setSelectedTowns(DEFAULT_TOWNS)}
            className="text-[11px] font-mono text-blue-400 hover:text-blue-300"
          >
            RESET
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {allTowns.map(t => {
            const on = selectedTowns.includes(t.slug)
            return (
              <button
                key={t.slug}
                onClick={() => toggleTown(t.slug)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  on
                    ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                    : 'text-gray-400 border-gray-700 hover:text-white hover:border-gray-600'
                }`}
              >
                {t.name}
              </button>
            )
          })}
        </div>
      </div>

      {/* Rule grid */}
      <div className="overflow-x-auto rounded-xl border border-border">
        <div className="min-w-[900px]">
          {/* Header row */}
          <div
            className="grid bg-gray-800/80 border-b border-border"
            style={{ gridTemplateColumns: `220px 180px repeat(${selectedTowns.length}, minmax(160px, 1fr))` }}
          >
            <div className="px-4 py-3 text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Rule</div>
            <div className="px-4 py-3 bg-emerald-400/5 border-l border-emerald-400/20">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-semibold">State Baseline</span>
              </div>
              <p className="text-[10px] text-gray-500 mt-0.5">Chapter 150</p>
            </div>
            {selectedTowns.map(slug => {
              const town = allEntries.find(t => t.slug === slug)
              return (
                <div key={slug} className="px-4 py-3 border-l border-border">
                  <Link href={`/town/${slug}`} className="text-sm font-semibold text-white hover:text-blue-400">
                    {town?.name ?? slug}
                  </Link>
                  <p className="text-[10px] font-mono text-gray-500 mt-1 uppercase tracking-wider">Open profile →</p>
                </div>
              )
            })}
          </div>

          {/* Body rows */}
          {filteredRules.map((rule) => (
            <div
              key={rule.topic}
              className="grid border-b border-border/50 last:border-b-0 hover:bg-gray-800/30 transition-colors"
              style={{ gridTemplateColumns: `220px 180px repeat(${selectedTowns.length}, minmax(160px, 1fr))` }}
            >
              <div className="px-4 py-3 border-r border-border/50">
                <p className="text-[10px] font-mono uppercase tracking-wider text-gray-500 mb-1">{rule.category}</p>
                <p className="text-sm font-semibold text-white leading-snug">{rule.topic}</p>
                <button
                  onClick={() => setExpandedRule(expandedRule === rule.topic ? null : rule.topic)}
                  className="text-[10px] font-mono text-blue-400 hover:text-blue-300 mt-2"
                >
                  {expandedRule === rule.topic ? '− HIDE STATE LAW' : '+ STATE LAW'}
                </button>
              </div>
              <div className="px-4 py-3 bg-emerald-400/[0.03] border-l border-emerald-400/10">
                {expandedRule === rule.topic ? (
                  <p className="text-xs text-gray-300 leading-relaxed">{rule.stateText}</p>
                ) : (
                  <p className="text-xs text-gray-400 leading-relaxed line-clamp-3">{rule.stateText}</p>
                )}
              </div>
              {selectedTowns.map(slug => {
                const p = rule.towns[slug]
                if (!p) {
                  return (
                    <div key={slug} className="px-4 py-3 border-l border-border/40 text-gray-600 text-xs italic">
                      No data
                    </div>
                  )
                }
                const cfg = evidenceBasisConfig[getEvidenceBasis(p)]
                return (
                  <div key={slug} className={`px-4 py-3 border-l border-border/40 ${cfg.bg}`}>
                    <div className="flex items-start gap-2 mb-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} mt-1.5 shrink-0`} />
                      <p className={`text-[10px] font-semibold uppercase tracking-wider ${cfg.color}`}>{cfg.label}</p>
                    </div>
                    <p className="text-xs text-gray-300 leading-snug line-clamp-3">{p.localBylaw}</p>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {filteredRules.length === 0 && (
        <div className="text-center py-12 text-gray-500 text-sm border border-dashed border-border rounded-xl">
          No rules match your filters.{' '}
          <button onClick={() => { setCategory('all'); setQuery('') }} className="text-blue-400 hover:underline">
            Clear filters
          </button>
        </div>
      )}

      {/* Legend */}
      <div className="bg-gray-800/50 border border-border rounded-xl p-4">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-3">Status legend</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Object.entries(evidenceBasisConfig).map(([key, cfg]) => (
            <div key={key} className="flex items-start gap-2">
              <span className={`w-2 h-2 rounded-full ${cfg.dot} mt-1 shrink-0`} />
              <div>
                <p className={`text-xs font-semibold ${cfg.color}`}>{cfg.label}</p>
                <p className="text-[10px] text-gray-500 leading-snug mt-0.5">
                  {key === 'ag_disapproved' && 'Formally struck by MA Attorney General'}
                  {key === 'statutory_conflict' && 'Independent analysis: preempted by Ch. 150'}
                  {key === 'ambiguous' && 'Grey area — may face challenge'}
                  {key === 'consistent' && 'Aligns with Ch. 150 / 760 CMR 71.00'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
