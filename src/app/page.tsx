'use client'

import Link from 'next/link'
import { useState, useMemo, useRef } from 'react'
import { useTown } from '@/contexts/TownContext'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import townSEOData from '@/data/town_seo_data'
import { approvalsPerTenThousandResidents } from '@/lib/townAnalytics'

// Build towns array with per-capita from real data
const allTowns = townSEOData
  .filter(t => t.approved > 0)
  .map(t => ({
    slug: t.slug,
    name: t.name,
    county: t.county,
    permits: t.approved,
    approvalRate: t.approvalRate,
    pop: t.population,
    per10k: approvalsPerTenThousandResidents(t),
  }))

// Statewide stats from EOHLC survey
const totalApproved = 1224
const totalTowns = 293
const overallRate = 68

type SortKey = 'permits' | 'percapita' | 'approval'

export default function Home() {
  const { setSelectedTown } = useTown()
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const [sortBy, setSortBy] = useState<SortKey>('permits')
  const inputRef = useRef<HTMLInputElement>(null)

  const filtered = useMemo(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase()
    return allTowns
      .filter(t => t.name.toLowerCase().includes(q) || t.county.toLowerCase().includes(q))
      .slice(0, 6)
  }, [query])

  const topTowns = useMemo(() => {
    const sorted = [...allTowns]
    if (sortBy === 'permits') sorted.sort((a, b) => b.permits - a.permits)
    else if (sortBy === 'percapita') sorted.sort((a, b) => b.per10k - a.per10k)
    else sorted.sort((a, b) => b.approvalRate - a.approvalRate)
    return sorted.slice(0, 8)
  }, [sortBy])

  const showResults = focused && query.trim().length > 0

  return (
    <div className="min-h-screen bg-gray-900">
      <NavBar current="Home" />

      <main>
        {/* ===== HERO + SEARCH ===== */}
        <div className="px-5 pt-10 pb-9">
          <div className="max-w-[560px] mx-auto text-center">
            <h1 className="font-bold text-white tracking-tight leading-[1.15] mb-6" style={{ fontSize: 'clamp(26px, 5.5vw, 36px)', letterSpacing: -0.8 }}>
              Massachusetts legalized ADUs.
              <br />
              <span className="text-emerald-400">We&apos;re tracking how it&apos;s actually going.</span>
            </h1>

            {/* Search */}
            <div className="relative max-w-[440px] mx-auto">
              <div
                className={`flex items-center rounded-xl px-4 transition-all duration-200 bg-gray-800 border-2 ${
                  focused ? 'border-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.1)]' : 'border-gray-600 shadow-none'
                }`}
              >
                <span className="text-lg mr-2.5 text-gray-500 select-none">&#x2315;</span>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Enter your town name..."
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setTimeout(() => setFocused(false), 200)}
                  className="flex-1 py-3.5 border-none outline-none text-base bg-transparent text-white placeholder-gray-500"
                />
                {query && (
                  <button
                    onClick={() => { setQuery(''); inputRef.current?.focus() }}
                    className="text-base text-gray-500 hover:text-gray-300 cursor-pointer p-1 bg-transparent border-none"
                  >
                    &#x2715;
                  </button>
                )}
              </div>

              {/* Search results dropdown */}
              {showResults && (
                <div className="absolute top-full left-0 right-0 mt-1.5 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl overflow-hidden z-50">
                  {filtered.length === 0 ? (
                    <div className="px-5 py-4 text-[13px] text-gray-400 text-center">
                      No towns found matching &ldquo;{query}&rdquo;
                    </div>
                  ) : (
                    filtered.map((t, i) => (
                      <Link
                        key={t.slug}
                        href={`/towns/${t.slug}`}
                        className={`flex items-center py-3 px-4 gap-3 no-underline hover:bg-gray-700/50 transition-colors ${
                          i < filtered.length - 1 ? 'border-b border-gray-700/50' : ''
                        }`}
                        onMouseDown={e => e.preventDefault()}
                        onClick={() => { setQuery(''); setSelectedTown(t.name) }}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-white">{t.name}</div>
                          <div className="text-[11px] text-gray-500">{t.county} County · Pop. {t.pop.toLocaleString()}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-emerald-400">{t.permits}</div>
                          <div className="font-mono text-[9px] text-gray-500 uppercase">permits</div>
                        </div>
                        <div className="text-right min-w-[42px]">
                          <div className={`text-sm font-bold ${
                            t.approvalRate >= 70 ? 'text-emerald-400' :
                            t.approvalRate >= 50 ? 'text-amber-400' : 'text-red-400'
                          }`}>{t.approvalRate}%</div>
                          <div className="font-mono text-[9px] text-gray-500 uppercase">approval</div>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Stats row */}
          <div className="flex justify-center mt-7" style={{ gap: 'clamp(20px, 6vw, 48px)' }}>
            {[
              { val: totalApproved.toLocaleString(), label: 'ADUs Approved' },
              { val: String(totalTowns), label: 'Towns Tracked' },
              { val: `${overallRate}%`, label: 'Approval Rate', tip: 'Share of 2025 applications approved in 2025' },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="font-bold text-emerald-400 tracking-tight" style={{ fontSize: 'clamp(20px, 5vw, 28px)', letterSpacing: -0.5 }}>{s.val}</div>
                <div className="font-mono text-[10px] text-gray-500 uppercase tracking-wider mt-0.5 inline-flex items-center gap-1">
                  {s.label}
                  {s.tip && (
                    <span className="relative group cursor-help">
                      <span className="text-gray-600 hover:text-gray-400 transition-colors">&#9432;</span>
                      <span className="absolute top-full sm:bottom-full sm:top-auto left-1/2 -translate-x-1/2 mt-1.5 sm:mt-0 sm:mb-1.5 px-2.5 py-1.5 text-[10px] normal-case tracking-normal text-gray-300 bg-gray-800 border border-gray-700 rounded-lg shadow-xl w-48 text-center opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-10">
                        {s.tip}
                      </span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===== TOP TOWNS ===== */}
        <div className="px-5 pb-8 max-w-[600px] mx-auto">
          <div className="flex items-baseline justify-between mb-3.5 flex-wrap gap-2">
            <h2 className="text-xl font-bold text-white m-0">Top Towns</h2>
            <div className="flex gap-1 bg-gray-800 rounded-lg p-0.5">
              {([
                { id: 'permits' as SortKey, label: 'Total Permits' },
                { id: 'percapita' as SortKey, label: 'Per Capita' },
                { id: 'approval' as SortKey, label: 'Approval %' },
              ]).map(s => (
                <button
                  key={s.id}
                  onClick={() => setSortBy(s.id)}
                  className={`px-2.5 py-[5px] border-none rounded-md cursor-pointer font-mono text-[10px] transition-all duration-150 ${
                    sortBy === s.id
                      ? 'bg-gray-700 shadow-sm font-semibold text-white'
                      : 'bg-transparent font-normal text-gray-500'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            {topTowns.map((t, i) => (
              <Link
                key={t.slug}
                href={`/towns/${t.slug}`}
                className="flex items-center py-3 px-3.5 gap-2.5 bg-gray-800/60 border border-gray-700 rounded-lg no-underline hover:border-gray-600 transition-colors min-h-[48px]"
                onClick={() => setSelectedTown(t.name)}
              >
                {/* Rank */}
                <div className={`font-mono text-xs font-semibold w-5 text-center shrink-0 ${i < 3 ? 'text-emerald-400' : 'text-gray-600'}`}>
                  {i + 1}
                </div>

                {/* Town info */}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-white truncate">{t.name}</div>
                  <div className="text-[11px] text-gray-500">{t.county} · {t.pop.toLocaleString()}</div>
                </div>

                {/* Stats — all three always visible */}
                <div className="flex gap-3 items-center shrink-0">
                  <div className="text-center min-w-[36px]">
                    <div className={`text-sm font-bold ${sortBy === 'permits' ? 'text-emerald-400' : 'text-gray-400'}`}>{t.permits}</div>
                    <div className="font-mono text-[8px] text-gray-600 uppercase">permits</div>
                  </div>
                  <div className="text-center min-w-[36px]">
                    <div className={`text-sm font-bold ${sortBy === 'percapita' ? 'text-blue-400' : 'text-gray-400'}`}>{t.per10k}</div>
                    <div className="font-mono text-[8px] text-gray-600 uppercase">per 10k</div>
                  </div>
                  <div className="text-center min-w-[36px]">
                    <div className={`text-sm font-bold ${
                      sortBy === 'approval'
                        ? (t.approvalRate >= 70 ? 'text-emerald-400' : t.approvalRate >= 50 ? 'text-amber-400' : 'text-red-400')
                        : 'text-gray-400'
                    }`}>{t.approvalRate}%</div>
                    <div className="font-mono text-[8px] text-gray-600 uppercase">approval</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-3 text-center">
            <Link href="/map" className="font-mono text-xs text-blue-400 no-underline font-medium hover:text-blue-300 transition-colors">
              View all {totalTowns} towns →
            </Link>
          </div>
        </div>

        {/* ===== WHAT'S ON EVERY TOWN PAGE ===== */}
        <div className="px-5 py-7 max-w-[600px] mx-auto border-t border-gray-800">
          <h2 className="text-xl font-bold text-white mb-3.5">What&apos;s on every town page</h2>
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: '📊', title: 'Permit Data', desc: 'Applications, approvals, and per-capita rates from EOHLC' },
              { icon: '📋', title: 'Bylaw Analysis', desc: "Which local rules conflict with state law — and what's unenforceable" },
              { icon: '💰', title: 'Cost Estimates', desc: 'Real project costs from permitted ADUs in your area' },
              { icon: '🔄', title: 'Town Comparison', desc: 'How your town stacks up against nearby communities' },
            ].map((f, i) => (
              <div key={i} className="p-3.5 bg-gray-800/60 border border-gray-700 rounded-lg">
                <div className="text-xl mb-1.5">{f.icon}</div>
                <div className="text-[13px] font-semibold text-white mb-0.5">{f.title}</div>
                <div className="text-xs text-gray-400 leading-[1.45]">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ===== AUDIENCE CTAs ===== */}
        <div className="px-5 py-7 max-w-[600px] mx-auto">
          <div className="flex flex-col gap-2">
            <Link
              href="/club"
              className="flex items-center gap-3.5 py-4 px-[18px] rounded-lg no-underline text-white bg-emerald-700 hover:bg-emerald-600 transition-colors"
            >
              <div className="text-2xl">🏠</div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold">ADU Club for Homeowners</div>
                <div className="text-xs text-emerald-200/70 mt-0.5">Group builder rates in your town. Free to join.</div>
              </div>
              <div className="text-base text-emerald-200/50">→</div>
            </Link>

            <Link
              href="/builders"
              className="flex items-center gap-3.5 py-4 px-[18px] rounded-lg no-underline text-white bg-gray-800/60 border border-gray-700 hover:border-gray-600 transition-colors"
            >
              <div className="text-2xl">🔨</div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold">For Builders</div>
                <div className="text-xs text-gray-400 mt-0.5">Demand data, clustered leads, and market intelligence.</div>
              </div>
              <div className="text-base text-gray-600">→</div>
            </Link>
          </div>
        </div>

        {/* ===== BLOG PREVIEW ===== */}
        <div className="px-5 pt-5 pb-8 max-w-[600px] mx-auto border-t border-gray-800">
          <Link
            href="/blog/massachusetts-adu-year-one"
            className="block py-[18px] px-5 bg-gray-800/60 border border-gray-700 rounded-lg no-underline hover:border-gray-600 transition-colors"
          >
            <div className="font-mono text-[10px] text-gray-500 uppercase tracking-wider mb-1.5">
              Latest Analysis
            </div>
            <div className="text-base font-bold text-white leading-[1.3] mb-1.5">
              What 1,224 ADU Permits Taught Me About Massachusetts Housing
            </div>
            <div className="text-xs text-gray-400 leading-[1.5]">
              One year in: which towns are succeeding, which are stalling, and why the numbers tell a more complicated story.
            </div>
          </Link>
        </div>

        {/* Data attribution */}
        <div className="px-5 pb-6 max-w-[600px] mx-auto border-t border-gray-800 pt-5">
          <div className="text-[11px] text-gray-500 leading-relaxed">
            Data: EOHLC ADU Survey Feb 2026 (293 of 351 MA municipalities).
            Population: Census ACS 2024.
            Approval rate = share of 2025 applications approved in 2025.
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
