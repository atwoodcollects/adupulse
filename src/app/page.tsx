'use client'

import Link from 'next/link'
import { useState, useMemo, Suspense, lazy } from 'react'
import { useTown } from '@/contexts/TownContext'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import townSEOData from '@/data/town_seo_data'

const TownMap = lazy(() => import('@/components/TownMap'))

const featuredTowns = townSEOData
  .sort((a, b) => b.approved - a.approved)
  .slice(0, 8)

export default function Home() {
  const { selectedTown, setSelectedTown } = useTown()
  const [search, setSearch] = useState('')

  const searchResults = useMemo(() => {
    if (!search.trim()) return []
    const q = search.toLowerCase()
    return townSEOData.filter(t => t.name.toLowerCase().includes(q)).slice(0, 6)
  }, [search])

  // Statewide stats from EOHLC survey (includes all 221 towns with applications, not just the 54 with SEO data)
  const totalApproved = 1224
  const totalTowns = 221
  const overallRate = 68

  const myTownData = selectedTown
    ? townSEOData.find(t => t.name === selectedTown)
    : null

  return (
    <div className="min-h-screen bg-gray-900">
      <NavBar current="Home" />

      <main className="max-w-5xl mx-auto px-4">
        {/* ─── HERO ─── */}
        <section className="text-center py-10 md:py-16">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 leading-tight">
            Real ADU Permit Data<br className="hidden sm:block" /> for Massachusetts
          </h1>
          <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto mb-8">
            ADU Pulse tracks real permit data from {totalTowns} Massachusetts towns so homeowners, builders, and lenders can make smarter ADU decisions.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-md mx-auto mb-8">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-3 sm:p-4">
              <div className="text-2xl md:text-3xl font-bold text-emerald-400">{totalApproved.toLocaleString()}</div>
              <div className="text-gray-400 text-xs">Approved</div>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-3 sm:p-4">
              <div className="text-2xl md:text-3xl font-bold text-white">{totalTowns}</div>
              <div className="text-gray-400 text-xs">Towns Tracked</div>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-3 sm:p-4">
              <div className="text-2xl md:text-3xl font-bold text-white">{overallRate}%</div>
              <div className="text-gray-400 text-xs">Approval Rate</div>
            </div>
          </div>

          {/* Town search */}
          <div className="max-w-md mx-auto relative">
            <input
              type="text"
              placeholder="Search your town..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 text-base min-h-[48px]"
            />
            {search && searchResults.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-gray-800 border border-gray-700 rounded-xl overflow-hidden shadow-xl z-20">
                {searchResults.map(t => (
                  <Link key={t.slug} href={`/towns/${t.slug}`}
                    className="flex items-center justify-between px-4 py-3 hover:bg-gray-700/50 transition-colors min-h-[48px]"
                    onClick={() => { setSearch(''); setSelectedTown(t.name) }}>
                    <div>
                      <span className="text-white font-medium">{t.name}</span>
                      <span className="text-gray-500 text-xs ml-2">{t.county} County</span>
                    </div>
                    <div className="text-right">
                      <span className="text-emerald-400 font-bold text-sm">{t.approved}</span>
                      <span className="text-gray-500 text-xs ml-1.5">{t.approvalRate}%</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
            {search && searchResults.length === 0 && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-gray-800 border border-gray-700 rounded-xl p-4 shadow-xl z-20">
                <p className="text-gray-400 text-sm">No towns found for &ldquo;{search}&rdquo;</p>
                <p className="text-gray-500 text-xs mt-1">We track {totalTowns} towns with EOHLC survey data.</p>
              </div>
            )}
          </div>
        </section>

        {/* ─── PERSONA ROUTING ─── */}
        <section className="mb-12">
          <h2 className="text-center text-gray-500 text-sm uppercase tracking-wider mb-4">I&apos;m looking for...</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link href="/club"
              className="bg-gray-800/50 border border-emerald-500/20 rounded-xl p-5 hover:bg-emerald-900/20 transition-colors group min-h-[120px]">
              <div className="text-2xl mb-2">🏠</div>
              <h3 className="text-white font-bold mb-1">I&apos;m a Homeowner</h3>
              <p className="text-gray-400 text-sm mb-2">Check if an ADU makes sense, estimate costs, and join your town&apos;s group for 15-20% savings.</p>
              <span className="text-emerald-400 text-sm group-hover:underline">Explore ADU options →</span>
            </Link>
            <Link href="/builders"
              className="bg-gray-800/50 border border-blue-500/20 rounded-xl p-5 hover:bg-blue-900/20 transition-colors group min-h-[120px]">
              <div className="text-2xl mb-2">🔨</div>
              <h3 className="text-white font-bold mb-1">I&apos;m a Builder</h3>
              <p className="text-gray-400 text-sm mb-2">See where ADU demand is highest, get clustered leads, and close more projects per town.</p>
              <span className="text-blue-400 text-sm group-hover:underline">See builder opportunities →</span>
            </Link>
            <Link href="/map"
              className="bg-gray-800/50 border border-purple-500/20 rounded-xl p-5 hover:bg-purple-900/20 transition-colors group min-h-[120px]">
              <div className="text-2xl mb-2">🏦</div>
              <h3 className="text-white font-bold mb-1">Lender or Municipality</h3>
              <p className="text-gray-400 text-sm mb-2">Access normalized permit analytics, approval rates, and market intelligence across MA towns.</p>
              <span className="text-purple-400 text-sm group-hover:underline">Explore the data →</span>
            </Link>
          </div>
        </section>

        {/* ─── PERSONALIZED TOWN (if selected) ─── */}
        {myTownData && (
          <section className="mb-10">
            <div className="bg-gray-800 border border-blue-500/20 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">📍</span>
                  <h3 className="text-white font-bold">Your Town: {myTownData.name}</h3>
                </div>
                <button onClick={() => setSelectedTown('')} className="text-gray-500 text-xs hover:text-gray-300">Change</button>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center mb-3">
                <div className="bg-gray-900/50 rounded-lg p-2.5">
                  <div className="text-emerald-400 font-bold text-lg">{myTownData.approved}</div>
                  <div className="text-gray-500 text-[10px]">Approved</div>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-2.5">
                  <div className="text-white font-bold text-lg">{myTownData.submitted}</div>
                  <div className="text-gray-500 text-[10px]">Submitted</div>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-2.5">
                  <div className="text-white font-bold text-lg">{myTownData.approvalRate}%</div>
                  <div className="text-gray-500 text-[10px]">Rate</div>
                </div>
              </div>
              <Link href={`/towns/${myTownData.slug}`}
                className="block text-center text-blue-400 text-sm font-medium py-2.5 bg-blue-600/10 rounded-lg hover:bg-blue-600/20 min-h-[44px] flex items-center justify-center">
                View full {myTownData.name} data →
              </Link>
            </div>
          </section>
        )}

        {/* ─── FEATURED TOWNS ─── */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">Top Towns by Permits</h2>
            <Link href="/map" className="text-blue-400 text-sm hover:underline">View all {totalTowns} towns →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {featuredTowns.map((t, i) => {
              const rateColor = t.approvalRate >= 80 ? 'text-emerald-400' : t.approvalRate >= 50 ? 'text-amber-400' : 'text-red-400'
              return (
                <Link key={t.slug} href={`/towns/${t.slug}`}
                  className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 hover:bg-gray-700/50 transition-colors min-h-[60px] flex items-center"
                  onClick={() => setSelectedTown(t.name)}>
                  <span className="text-gray-600 w-6 text-sm shrink-0">#{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-medium">{t.name}</div>
                    <div className="text-gray-500 text-xs">{t.county} County</div>
                  </div>
                  <div className="text-right shrink-0 ml-3">
                    <div className="text-emerald-400 font-bold">{t.approved}</div>
                    <div className={`text-xs ${rateColor}`}>{t.approvalRate}%</div>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        {/* ─── TOOLS ROW ─── */}
        <section className="mb-12">
          <h2 className="text-lg font-bold text-white mb-4">ADU Tools</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: '💰', label: 'Cost Estimator', desc: 'Based on real permit data', href: '/estimate', color: 'border-emerald-500/20' },
              { icon: '📝', label: 'ADU Quiz', desc: 'Check if an ADU fits', href: '/quiz', color: 'border-blue-500/20' },
              { icon: '⚖️', label: 'Compare Towns', desc: 'Side-by-side data', href: '/compare', color: 'border-purple-500/20' },
              { icon: '📊', label: 'Scorecards', desc: 'Town-by-town grades', href: '/scorecards', color: 'border-amber-500/20' },
            ].map(tool => (
              <Link key={tool.href} href={tool.href}
                className={`bg-gray-800/50 border ${tool.color} rounded-xl p-4 hover:bg-gray-700/30 transition-colors min-h-[90px]`}>
                <div className="text-2xl mb-2">{tool.icon}</div>
                <div className="text-white font-medium text-sm">{tool.label}</div>
                <div className="text-gray-500 text-xs">{tool.desc}</div>
              </Link>
            ))}
          </div>
        </section>

        {/* ─── CLUB + BUILDERS ─── */}
        <section className="grid sm:grid-cols-2 gap-4 mb-12">
          <Link href="/club"
            className="bg-gradient-to-r from-emerald-900/30 to-blue-900/30 border border-emerald-500/20 rounded-xl p-5 hover:from-emerald-900/50 hover:to-blue-900/50 transition-colors group">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">🏘️</span>
              <h3 className="text-lg font-bold text-white">ADU Buyers Club</h3>
              <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">NEW</span>
            </div>
            <p className="text-gray-400 text-sm mb-2">Join homeowners in your town to unlock 15-20% group rates from vetted builders. Free to join, no commitment.</p>
            <span className="text-emerald-400 text-sm group-hover:underline">Join your town&apos;s group →</span>
          </Link>
          <Link href="/builders"
            className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/20 rounded-xl p-5 hover:from-blue-900/50 hover:to-purple-900/50 transition-colors group">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">🔨</span>
              <h3 className="text-lg font-bold text-white">For Builders</h3>
            </div>
            <p className="text-gray-400 text-sm mb-2">Stop marketing blind. See where ADU demand is highest, get clustered pre-qualified leads, and close more projects.</p>
            <span className="text-blue-400 text-sm group-hover:underline">See builder dashboard →</span>
          </Link>
        </section>

        {/* ─── BLOG / SOCIAL PROOF ─── */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/20 rounded-xl p-5 md:p-6">
            <div className="text-blue-400 text-sm font-medium mb-1">Latest Analysis</div>
            <h3 className="text-lg md:text-xl font-bold text-white mb-2">What 1,224 ADU Permits Taught Me About Massachusetts Housing</h3>
            <p className="text-gray-400 text-sm mb-3 hidden sm:block">One year in: which towns are succeeding, which are stalling, and why the numbers tell a more complicated story.</p>
            <Link href="/blog/massachusetts-adu-year-one" className="text-blue-400 text-sm hover:underline">Read the full analysis →</Link>
          </div>
        </section>

        {/* ─── COST ESTIMATOR CTA ─── */}
        <section className="mb-12">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white">💰 Planning an ADU?</h3>
                <p className="text-gray-400 text-sm">Get a rough cost estimate based on real MA permit data.</p>
              </div>
              <Link href="/estimate"
                className="px-5 py-3 sm:py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium text-center min-h-[48px] flex items-center justify-center shrink-0">
                Cost Estimator →
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
