'use client'

import Link from 'next/link'
import { useState, useMemo } from 'react'
import { useTown } from '@/contexts/TownContext'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import townSEOData from '@/data/town_seo_data'
import { allEntries as complianceData, getStatewideStats, getStatusCounts, getTownStatusLabel } from '@/app/compliance/compliance-data'
import { Search, FileWarning, AlertTriangle, Gavel, ClipboardCheck, Home as HomeIcon, Hammer, Landmark, ArrowRight, BookOpen } from 'lucide-react'

const featuredTowns = townSEOData
  .sort((a, b) => b.approved - a.approved)
  .slice(0, 5)

// Mobile shows 3, desktop shows 5
const MOBILE_TOWN_COUNT = 3

// Dynamic stats from compliance data
const statewide = getStatewideStats(complianceData)
const townsWithReview = complianceData.filter(t => t.provisions.some(p => p.status === 'review')).length

// Top 3 towns by most issues — previewed in Section 3
const complianceTowns = complianceData
  .map(t => {
    const counts = getStatusCounts(t.provisions)
    const statusLabel = getTownStatusLabel(t)
    return {
      name: t.name,
      slug: t.slug,
      county: t.county,
      conflicts: counts.inconsistent,
      reviews: counts.review,
      ok: counts.compliant,
      status: statusLabel.label,
      statusColor: `${statusLabel.color} ${statusLabel.bg}`,
    }
  })
  .sort((a, b) => (b.conflicts + b.reviews) - (a.conflicts + a.reviews))
  .slice(0, 3)

export default function Home() {
  const { setSelectedTown } = useTown()
  const [search, setSearch] = useState('')

  const searchResults = useMemo(() => {
    if (!search.trim()) return []
    const q = search.toLowerCase()
    return townSEOData.filter(t => t.name.toLowerCase().includes(q)).slice(0, 6)
  }, [search])

  // Statewide stats from EOHLC survey (includes all 293 towns with applications, not just the 54 with SEO data)
  const totalApproved = 1224
  const totalTowns = 293
  const overallRate = 68

  return (
    <div className="min-h-screen bg-gray-900">
      <NavBar current="Home" />

      <main className="max-w-5xl mx-auto px-4">
        {/* ─── HERO ─── */}
        <section className="py-8 sm:py-12 md:py-20">
          <div className="max-w-3xl mx-auto text-center mb-8 sm:mb-10">
            <div className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-red-400 bg-red-400/10 border border-red-400/20 px-2.5 sm:px-3 py-1.5 rounded-full mb-4 sm:mb-6">
              <FileWarning className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
              <span>{statewide.totalInconsistent} inconsistent. {statewide.totalAgDisapprovals} AG disapprovals. {statewide.communitiesTracked} communities.</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 leading-[1.15] tracking-tight">
              Massachusetts legalized ADUs.<br className="hidden sm:block" />
              We&apos;re tracking how it&apos;s actually going.
            </h1>
            <p className="text-gray-400 text-base md:text-lg">
              ADU Pulse tracks every permit and reads every bylaw so you don&apos;t have to.
            </p>
          </div>

          {/* Town search — primary CTA */}
          <div className="max-w-2xl mx-auto mb-8 sm:mb-10 relative">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
              <input
                type="text"
                placeholder="Search your town..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-gray-800 border-2 border-gray-600 hover:border-gray-500 rounded-xl pl-12 pr-4 py-4 sm:py-5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 text-base sm:text-lg min-h-[56px] transition-colors"
              />
            </div>
            <p className="text-center text-gray-500 text-xs sm:text-sm mt-2.5">
              See permits, bylaws, costs, and consistency for any MA town
            </p>
            {search && searchResults.length > 0 && (
              <div className="absolute left-0 right-0 top-[56px] sm:top-[64px] mt-1 bg-gray-800 border border-gray-700 rounded-xl overflow-hidden shadow-2xl z-20">
                {searchResults.map(t => (
                  <Link
                    key={t.slug}
                    href={`/towns/${t.slug}`}
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
              <div className="absolute left-0 right-0 top-[56px] sm:top-[64px] mt-1 bg-gray-800 border border-gray-700 rounded-xl p-4 shadow-2xl z-20">
                <p className="text-gray-400 text-sm">No towns found for &ldquo;{search}&rdquo;</p>
                <p className="text-gray-500 text-xs mt-1">We track {totalTowns} towns with EOHLC survey data.</p>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-2xl mx-auto">
            <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-3 sm:p-5 text-center">
              <div className="text-xl sm:text-3xl font-bold text-emerald-400 mb-0.5">{totalApproved.toLocaleString()}</div>
              <div className="text-gray-300 text-[10px] sm:text-sm font-medium">Approved</div>
              <div className="text-gray-500 text-[9px] sm:text-xs mt-0.5 hidden sm:block">from the Feb 2026 EOHLC survey</div>
            </div>
            <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-3 sm:p-5 text-center">
              <div className="text-xl sm:text-3xl font-bold text-white mb-0.5">{totalTowns}</div>
              <div className="text-gray-300 text-[10px] sm:text-sm font-medium">Towns</div>
              <div className="text-gray-500 text-[9px] sm:text-xs mt-0.5 hidden sm:block">of 350 municipalities statewide</div>
            </div>
            <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-3 sm:p-5 text-center">
              <div className="text-xl sm:text-3xl font-bold text-white mb-0.5">{overallRate}%</div>
              <div className="text-gray-300 text-[10px] sm:text-sm font-medium">Approval Rate</div>
              <div className="text-gray-500 text-[9px] sm:text-xs mt-0.5 hidden sm:block">Share of 2025 applications approved in 2025</div>
            </div>
          </div>
        </section>

        {/* ─── SECTION 1: WHAT THE DATA SHOWS ─── */}
        <section className="mb-14">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-5">What the Data Shows</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link href="/compliance" className="bg-gray-800/60 border border-gray-700 rounded-xl p-5 hover:border-red-500/30 transition-colors group">
              <AlertTriangle className="w-5 h-5 text-red-400 mb-3" />
              <div className="text-3xl sm:text-4xl font-bold text-white mb-1">{statewide.totalInconsistent}</div>
              <p className="text-gray-400 text-sm leading-relaxed mb-3">bylaw provisions not yet consistent with state law</p>
              <span className="inline-flex items-center gap-1 text-xs text-red-400 group-hover:text-red-300 transition-colors">
                View inconsistencies <ArrowRight className="w-3 h-3" />
              </span>
            </Link>
            <Link href="/compliance" className="bg-gray-800/60 border border-gray-700 rounded-xl p-5 hover:border-amber-500/30 transition-colors group">
              <Gavel className="w-5 h-5 text-amber-400 mb-3" />
              <div className="text-3xl sm:text-4xl font-bold text-white mb-1">{statewide.totalAgDisapprovals}</div>
              <p className="text-gray-400 text-sm leading-relaxed mb-3">Attorney General disapprovals issued</p>
              <span className="inline-flex items-center gap-1 text-xs text-amber-400 group-hover:text-amber-300 transition-colors">
                See AG decisions <ArrowRight className="w-3 h-3" />
              </span>
            </Link>
            <Link href="/compliance" className="bg-gray-800/60 border border-gray-700 rounded-xl p-5 hover:border-blue-500/30 transition-colors group">
              <ClipboardCheck className="w-5 h-5 text-blue-400 mb-3" />
              <div className="text-3xl sm:text-4xl font-bold text-white mb-1">{townsWithReview}</div>
              <p className="text-gray-400 text-sm leading-relaxed mb-3">towns with provisions under review</p>
              <span className="inline-flex items-center gap-1 text-xs text-blue-400 group-hover:text-blue-300 transition-colors">
                Check your town <ArrowRight className="w-3 h-3" />
              </span>
            </Link>
          </div>
        </section>

        {/* ─── SECTION 2: TOP TOWNS BY PERMITS ─── */}
        <section className="mb-14">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-5">Top Towns by Permits</h2>
          <div className="bg-gray-800/40 border border-gray-700 rounded-xl overflow-hidden">
            {featuredTowns.map((t, i) => {
              const rateColor = t.approvalRate >= 80 ? 'text-emerald-400' : t.approvalRate >= 50 ? 'text-amber-400' : 'text-red-400'
              // Hide 4th and 5th on mobile
              const mobileHidden = i >= MOBILE_TOWN_COUNT ? 'hidden sm:flex' : 'flex'
              return (
                <Link
                  key={t.slug}
                  href={`/towns/${t.slug}`}
                  className={`${mobileHidden} items-center px-4 py-3 hover:bg-gray-700/40 transition-colors ${i < featuredTowns.length - 1 ? 'border-b border-gray-700/50' : ''}`}
                  onClick={() => setSelectedTown(t.name)}
                >
                  <span className="text-gray-600 text-sm w-7 shrink-0 font-medium">#{i + 1}</span>
                  <span className="text-white font-medium flex-1 min-w-0 truncate">{t.name}</span>
                  <span className="text-gray-500 text-xs mr-4 hidden sm:inline">{t.county}</span>
                  <span className="text-emerald-400 font-bold text-sm w-12 text-right">{t.approved}</span>
                  <span className={`text-xs w-12 text-right ${rateColor}`}>{t.approvalRate}%</span>
                </Link>
              )
            })}
          </div>
          <div className="mt-3 text-center">
            <Link href="/map" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors">
              View all {totalTowns} towns <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>

        {/* ─── SECTION 3: BYLAW CONSISTENCY TRACKER ─── */}
        <section className="mb-14">
          <h2 className="text-lg font-bold text-white mb-1">How Consistent Is Your Town?</h2>
          <p className="text-gray-400 text-sm mb-5">
            We read local ADU bylaws and check them against Chapter 150 and 760 CMR 71.00.
          </p>
          <div className="space-y-2 mb-4">
            {complianceTowns.map(town => (
              <Link
                key={town.slug}
                href={`/compliance/${town.slug}`}
                className="flex items-center gap-2 sm:gap-3 bg-gray-800/60 border border-gray-700 rounded-lg px-3 sm:px-4 py-3 hover:border-gray-600 transition-colors group"
              >
                <span className={`w-2 h-2 rounded-full shrink-0 ${town.conflicts > 2 ? 'bg-red-400' : 'bg-amber-400'}`} />
                <div className="flex-1 min-w-0">
                  <span className="text-white font-medium text-sm group-hover:text-blue-400 transition-colors truncate block">{town.name}</span>
                  <span className="text-gray-500 text-xs">{town.county}</span>
                </div>
                <div className="flex items-center gap-2 text-xs shrink-0">
                  <span className="text-red-400 font-medium">{town.conflicts}</span>
                  <span className="text-amber-400 font-medium">{town.reviews}</span>
                  <span className="text-emerald-400 font-medium">{town.ok}</span>
                </div>
                <span className={`text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider px-1 sm:px-1.5 py-0.5 rounded shrink-0 hidden sm:inline ${town.statusColor}`}>
                  {town.status}
                </span>
              </Link>
            ))}
          </div>
          <Link href="/compliance" className="inline-flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 transition-colors">
            Check your town&apos;s consistency <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </section>

        {/* ─── SECTION 4: WHO THIS IS FOR ─── */}
        <section className="mb-14">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-5">Who This Is For</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link href="/club" className="bg-gray-800/50 border border-gray-700 rounded-xl p-5 hover:border-emerald-500/30 transition-colors group">
              <HomeIcon className="w-5 h-5 text-emerald-400 mb-3" />
              <h3 className="text-white font-bold mb-1">Homeowners</h3>
              <p className="text-gray-400 text-sm mb-3">Check if an ADU makes sense, estimate costs, and see if your town&apos;s bylaws are consistent with state law.</p>
              <span className="inline-flex items-center gap-1 text-xs text-emerald-400 group-hover:text-emerald-300 transition-colors">
                Explore ADU options <ArrowRight className="w-3 h-3" />
              </span>
            </Link>
            <Link href="/builders" className="bg-gray-800/50 border border-gray-700 rounded-xl p-5 hover:border-blue-500/30 transition-colors group">
              <Hammer className="w-5 h-5 text-blue-400 mb-3" />
              <h3 className="text-white font-bold mb-1">Builders</h3>
              <p className="text-gray-400 text-sm mb-3">See where ADU demand is highest, get clustered leads, and close more projects per town.</p>
              <span className="inline-flex items-center gap-1 text-xs text-blue-400 group-hover:text-blue-300 transition-colors">
                See builder opportunities <ArrowRight className="w-3 h-3" />
              </span>
            </Link>
            <Link href="/compliance" className="bg-gray-800/50 border border-gray-700 rounded-xl p-5 hover:border-purple-500/30 transition-colors group">
              <Landmark className="w-5 h-5 text-purple-400 mb-3" />
              <h3 className="text-white font-bold mb-1">Lenders &amp; Municipalities</h3>
              <p className="text-gray-400 text-sm mb-3">Access permit analytics, bylaw consistency analysis, and market intelligence across MA towns.</p>
              <span className="inline-flex items-center gap-1 text-xs text-purple-400 group-hover:text-purple-300 transition-colors">
                Bylaw Consistency Tracker <ArrowRight className="w-3 h-3" />
              </span>
            </Link>
          </div>
        </section>

        {/* ─── SECTION 5: LATEST ANALYSIS ─── */}
        <section className="mb-14">
          <Link href="/blog/boston-adu-exemption" className="block bg-gray-800/40 border border-gray-700 rounded-xl p-5 md:p-6 hover:border-gray-600 transition-colors group">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">Latest Analysis</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">
              Boston Is Exempt from the ADU Law. Here&apos;s What That Means.
            </h3>
            <p className="text-gray-400 text-sm">
              Why Chapter 40A doesn&apos;t apply to Boston, what the city is doing instead, and how it affects the statewide numbers.
            </p>
          </Link>
        </section>
      </main>
      <Footer />
    </div>
  )
}
