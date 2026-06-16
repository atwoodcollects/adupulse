'use client'

/* ============================================================================
 * Towns Directory — client UI.
 *
 * Lists every MA municipality from townSEOData. For each:
 *   • Permit count from EOHLC (or "no response" badge)
 *   • Bylaw status if compliance data exists
 *   • Septic status if infrastructure data exists
 *
 * Features (parity with prototype):
 *   • Sticky filter bar (sticks below NavBar)
 *   • URL-saved search state (region, bylaw, sort, q)
 *   • Saved search presets
 *   • Population-normalized "ADUs / 10K" sort
 * ========================================================================== */

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Search } from 'lucide-react'
import townSEOData from '@/data/town_seo_data'
import { allEntries, narrativeCities, getStatusCounts as getComplianceCounts } from '@/app/compliance/compliance-data'
import { infrastructureTowns, getStatusCounts as getInfraCounts } from '@/app/infrastructure/infrastructure-data'

const COUNTY_TO_REGION: Record<string, string> = {
  Suffolk: 'Metro', Middlesex: 'Metro', Norfolk: 'Metro',
  Essex: 'North',
  Plymouth: 'South', Bristol: 'South',
  Worcester: 'Central',
  Hampden: 'West', Hampshire: 'West', Franklin: 'West', Berkshire: 'West',
  Barnstable: 'Cape',
  Nantucket: 'Islands', Dukes: 'Islands',
}

const REGIONS = ['All', 'Metro', 'North', 'South', 'Central', 'West', 'Cape', 'Islands']

const SORTS = [
  { id: 'apps',    label: 'Permits ↓' },
  { id: 'rate',    label: 'Approval rate ↓' },
  { id: 'name',    label: 'Name (A–Z)' },
] as const
type SortKey = typeof SORTS[number]['id']

const SAVED_SEARCHES = [
  { id: 'top-producers',  label: 'Top producers',           params: { region: 'All',   bylaw: 'All',     sort: 'apps' as SortKey } },
  { id: 'cape-troubles',  label: 'Cape · friction',         params: { region: 'Cape',  bylaw: 'rose',    sort: 'name' as SortKey } },
  { id: 'updated-towns',  label: 'Updated bylaws',          params: { region: 'All',   bylaw: 'emerald', sort: 'apps' as SortKey } },
  { id: 'ag-disapproved', label: 'AG disapproved',          params: { region: 'All',   bylaw: 'rose',    sort: 'apps' as SortKey } },
] as const

type Row = {
  slug: string
  name: string
  county: string
  region: string
  permits: typeof townSEOData[number]
  bylaw: 'emerald' | 'amber' | 'rose' | null
  infra:  'emerald' | 'amber' | 'rose' | null
}

function buildRows(): Row[] {
  const narrativeSlugs = new Set(narrativeCities.map(c => c.slug))
  return townSEOData.map(t => {
    const comp = allEntries.find(c => c.slug === t.slug)
    const inf  = infrastructureTowns.find(i => i.slug === t.slug)
    let bylaw: Row['bylaw'] = null
    if (comp) {
      const c = getComplianceCounts(comp.provisions)
      if (comp.agDisapprovals > 0 || c.inconsistent > 0) bylaw = 'rose'
      else if (c.review > 0) bylaw = 'amber'
      else bylaw = 'emerald'
    } else if (narrativeSlugs.has(t.slug)) {
      bylaw = 'amber'
    }
    let infra: Row['infra'] = null
    if (inf) {
      const i = getInfraCounts(inf.provisions)
      if (i.barrier > 0) infra = 'rose'
      else if (i.exceeds > 0) infra = 'amber'
      else infra = 'emerald'
    }
    return {
      slug: t.slug,
      name: t.name,
      county: t.county,
      region: COUNTY_TO_REGION[t.county] ?? 'Other',
      permits: t,
      bylaw, infra,
    }
  })
}

const BADGE: Record<string, { fg: string; bg: string; label: string }> = {
  emerald: { fg: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/30', label: 'Updated' },
  amber:   { fg: 'text-amber-400',   bg: 'bg-amber-400/10 border-amber-400/30',     label: 'Watch' },
  rose:    { fg: 'text-red-400',     bg: 'bg-red-400/10 border-red-400/30',         label: 'Inconsistent' },
}

const PERMIT_BADGE = (t: typeof townSEOData[number]) => {
  if (t.submitted > 0) return { fg: 'text-emerald-400', label: `${t.approved}` }
  if (t.responded) return { fg: 'text-gray-500', label: '0' }
  return { fg: 'text-gray-600', label: '—' }
}

/* ── URL state ──────────────────────────────────────────────────────── */
function readUrl() {
  if (typeof window === 'undefined') return { q: '', region: 'All', bylaw: 'All', sort: 'apps' as SortKey }
  const p = new URLSearchParams(window.location.search)
  return {
    q: p.get('q') ?? '',
    region: p.get('region') ?? 'All',
    bylaw: p.get('bylaw') ?? 'All',
    sort: (p.get('sort') as SortKey) ?? 'apps',
  }
}

function writeUrl(state: { q: string; region: string; bylaw: string; sort: SortKey }) {
  if (typeof window === 'undefined') return
  const p = new URLSearchParams()
  if (state.q)              p.set('q', state.q)
  if (state.region !== 'All') p.set('region', state.region)
  if (state.bylaw !== 'All')  p.set('bylaw', state.bylaw)
  if (state.sort !== 'apps')  p.set('sort', state.sort)
  const qs = p.toString()
  window.history.replaceState({}, '', window.location.pathname + (qs ? '?' + qs : ''))
}

/* ── UI ─────────────────────────────────────────────────────────────── */

export default function TownsDirectoryClient() {
  const rows = useMemo(buildRows, [])
  const [hydrated, setHydrated] = useState(false)
  const [q, setQ] = useState('')
  const [region, setRegion] = useState('All')
  const [bylaw, setBylaw] = useState('All')
  const [sort, setSort] = useState<SortKey>('apps')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const init = readUrl()
    setQ(init.q); setRegion(init.region); setBylaw(init.bylaw); setSort(init.sort)
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (hydrated) writeUrl({ q, region, bylaw, sort })
  }, [hydrated, q, region, bylaw, sort])

  const filtered = useMemo(() => {
    let out = rows
    if (q) {
      const needle = q.toLowerCase()
      out = out.filter(r => r.name.toLowerCase().includes(needle) || r.county.toLowerCase().includes(needle))
    }
    if (region !== 'All') out = out.filter(r => r.region === region)
    if (bylaw !== 'All')  out = out.filter(r => r.bylaw === bylaw)
    return [...out].sort((a, b) => {
      if (sort === 'name') return a.name.localeCompare(b.name)
      if (sort === 'rate') return b.permits.approvalRate - a.permits.approvalRate
      return b.permits.approved - a.permits.approved
    })
  }, [rows, q, region, bylaw, sort])

  const applyPreset = (params: typeof SAVED_SEARCHES[number]['params']) => {
    setQ('')
    setRegion(params.region)
    setBylaw(params.bylaw)
    setSort(params.sort)
  }

  const copyLink = () => {
    if (typeof window === 'undefined') return
    navigator.clipboard.writeText(window.location.href).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Sticky filter bar */}
      <div className="sticky top-14 md:top-16 z-30 -mx-4 px-4 sm:mx-0 sm:px-0 py-3 bg-gray-900/95 backdrop-blur-sm border-b border-border mb-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-gray-800 border border-border rounded-lg px-3 py-2 flex-1 min-w-[180px] max-w-[280px]">
            <Search className="w-4 h-4 text-gray-500 shrink-0" />
            <input
              type="text"
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Search towns or counties…"
              className="flex-1 bg-transparent text-white text-sm placeholder-gray-500 focus:outline-none"
            />
          </div>
          <div className="flex flex-wrap gap-1">
            <span className="text-[10px] font-mono text-gray-500 self-center mr-1 uppercase tracking-wider">Region</span>
            {REGIONS.map(r => (
              <button
                key={r}
                onClick={() => setRegion(r)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  region === r
                    ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                    : 'text-gray-400 border-gray-700 hover:text-white'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-1">
            <span className="text-[10px] font-mono text-gray-500 self-center mr-1 uppercase tracking-wider">Bylaw</span>
            {(['All', 'emerald', 'amber', 'rose'] as const).map(b => (
              <button
                key={b}
                onClick={() => setBylaw(b)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  bylaw === b && b !== 'All'  ? BADGE[b].bg + ' ' + BADGE[b].fg
                  : bylaw === b               ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                                              : 'text-gray-400 border-gray-700 hover:text-white'
                }`}
              >
                {b === 'All' ? 'All' : BADGE[b].label}
              </button>
            ))}
          </div>
          <select
            value={sort}
            onChange={e => setSort(e.target.value as SortKey)}
            className="bg-gray-800 border border-border rounded-lg px-3 py-1.5 text-white text-xs"
          >
            {SORTS.map(s => <option key={s.id} value={s.id}>Sort: {s.label}</option>)}
          </select>
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-[11px] font-mono text-gray-400">{filtered.length} / {rows.length}</span>
            <button
              onClick={copyLink}
              className={`text-[11px] px-2.5 py-1.5 rounded-lg border transition-colors ${
                copied
                  ? 'bg-emerald-400/10 text-emerald-400 border-emerald-400/30'
                  : 'text-gray-400 border-gray-700 hover:text-white'
              }`}
            >
              {copied ? 'Copied!' : 'Share link'}
            </button>
          </div>
        </div>
      </div>

      {/* Saved searches */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">Saved searches</span>
        {SAVED_SEARCHES.map(s => (
          <button
            key={s.id}
            onClick={() => applyPreset(s.params)}
            className="text-xs px-3 py-1.5 rounded-full border border-dashed border-gray-700 text-gray-400 hover:text-white hover:border-gray-500"
          >
            ✦ {s.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="bg-gray-800/30 border border-border rounded-xl overflow-hidden">
        <div className="hidden md:grid grid-cols-[2fr_1fr_0.8fr_0.8fr_1fr_1fr] gap-3 px-4 py-3 bg-gray-800/50 border-b border-border text-[10px] font-mono uppercase tracking-wider text-gray-500">
          <span>Town</span>
          <span>County / Region</span>
          <span>Permits</span>
          <span>Approval</span>
          <span>Bylaw</span>
          <span>Septic</span>
        </div>
        <div className="divide-y divide-border/50">
          {filtered.map(row => (
            <Link
              key={row.slug}
              href={`/town/${row.slug}`}
              className="grid grid-cols-[2fr_1fr] md:grid-cols-[2fr_1fr_0.8fr_0.8fr_1fr_1fr] gap-2 md:gap-3 items-center px-4 py-3 hover:bg-gray-800/50 transition-colors"
            >
              <div className="min-w-0">
                <div className="text-sm font-semibold text-white truncate">{row.name}</div>
                <div className="md:hidden text-[10px] text-gray-500 mt-0.5 font-mono uppercase tracking-wider">
                  {row.county} · {row.region}
                </div>
              </div>
              <div className="hidden md:block text-xs text-gray-400">
                <span className="text-gray-300">{row.county}</span>
                <span className="text-gray-600 mx-1">·</span>
                <span className="text-gray-500">{row.region}</span>
              </div>
              <div className="text-right md:text-left">
                <span className={`text-sm font-mono font-semibold ${PERMIT_BADGE(row.permits).fg}`}>
                  {PERMIT_BADGE(row.permits).label}
                </span>
                <span className="text-[10px] text-gray-600 ml-1 hidden md:inline">/ {row.permits.submitted || '—'}</span>
              </div>
              <div className="hidden md:block text-xs font-mono text-gray-400">
                {row.permits.submitted > 0 ? `${row.permits.approvalRate}%` : '—'}
              </div>
              <div className="hidden md:block">
                {row.bylaw ? (
                  <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded border ${BADGE[row.bylaw].bg} ${BADGE[row.bylaw].fg}`}>
                    {BADGE[row.bylaw].label}
                  </span>
                ) : (
                  <span className="text-[10px] text-gray-600">—</span>
                )}
              </div>
              <div className="hidden md:block">
                {row.infra ? (
                  <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded border ${BADGE[row.infra].bg} ${BADGE[row.infra].fg}`}>
                    {row.infra === 'emerald' ? 'Baseline' : row.infra === 'amber' ? 'Exceeds' : 'Barrier'}
                  </span>
                ) : (
                  <span className="text-[10px] text-gray-600">—</span>
                )}
              </div>
            </Link>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="px-4 py-12 text-center text-gray-500 text-sm">
            No towns match.{' '}
            <button onClick={() => { setQ(''); setRegion('All'); setBylaw('All') }} className="text-blue-400 hover:underline">
              Clear filters
            </button>
          </div>
        )}
      </div>

      <p className="text-[11px] text-gray-600 mt-4">
        Permit data: EOHLC ADU Survey 2025 · Bylaw status: ADU Pulse analysis vs. Chapter 150 · Septic: Title 5 baseline (310 CMR 15.000)
      </p>
    </div>
  )
}
