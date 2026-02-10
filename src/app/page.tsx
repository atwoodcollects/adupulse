'use client'

import Link from 'next/link'
import TownNav from '@/components/TownNav'
import { useState, useEffect, lazy, Suspense } from 'react'
import { useTown } from '@/contexts/TownContext'

// Lazy load the map — only renders when user taps "Map" tab
const TownMap = lazy(() => import('@/components/TownMap'))

const towns = [
  { name: 'Boston', submitted: 69, approved: 44, region: 'Metro Boston', hasDetail: true },
  { name: 'Lawrence', submitted: 44, approved: 32, region: 'Merrimack Valley', hasDetail: false },
  { name: 'Plymouth', submitted: 42, approved: 34, region: 'South Shore', hasDetail: true },
  { name: 'Newton', submitted: 40, approved: 18, region: 'Metro Boston', hasDetail: true },
  { name: 'Somerville', submitted: 40, approved: 24, region: 'Metro Boston', hasDetail: false },
  { name: 'Barnstable', submitted: 31, approved: 6, region: 'Cape Cod', hasDetail: false },
  { name: 'Worcester', submitted: 31, approved: 23, region: 'Central MA', hasDetail: false },
  { name: 'Haverhill', submitted: 29, approved: 13, region: 'Merrimack Valley', hasDetail: false },
  { name: 'Methuen', submitted: 28, approved: 21, region: 'Merrimack Valley', hasDetail: false },
  { name: 'Nantucket', submitted: 27, approved: 27, region: 'Islands', hasDetail: false },
  { name: 'Lowell', submitted: 26, approved: 26, region: 'Merrimack Valley', hasDetail: false },
  { name: 'Fall River', submitted: 25, approved: 13, region: 'South Coast', hasDetail: false },
  { name: 'Milton', submitted: 25, approved: 24, region: 'Metro Boston', hasDetail: true },
  { name: 'Marshfield', submitted: 24, approved: 11, region: 'South Shore', hasDetail: false },
  { name: 'Amherst', submitted: 23, approved: 12, region: 'Pioneer Valley', hasDetail: false },
  { name: 'Lynn', submitted: 22, approved: 9, region: 'North Shore', hasDetail: false },
  { name: 'Medford', submitted: 22, approved: 19, region: 'Metro Boston', hasDetail: false },
  { name: 'Northampton', submitted: 20, approved: 15, region: 'Pioneer Valley', hasDetail: false },
  { name: 'Billerica', submitted: 18, approved: 13, region: 'Merrimack Valley', hasDetail: false },
  { name: 'Fairhaven', submitted: 18, approved: 18, region: 'South Coast', hasDetail: false },
  { name: 'Middleborough', submitted: 18, approved: 18, region: 'South Shore', hasDetail: false },
  { name: 'Raynham', submitted: 18, approved: 18, region: 'South Shore', hasDetail: false },
  { name: 'Freetown', submitted: 17, approved: 13, region: 'South Coast', hasDetail: false },
  { name: 'Quincy', submitted: 17, approved: 6, region: 'Metro Boston', hasDetail: false },
  { name: 'Revere', submitted: 17, approved: 9, region: 'Metro Boston', hasDetail: true },
  { name: 'Brockton', submitted: 16, approved: 5, region: 'South Shore', hasDetail: false },
  { name: 'Shrewsbury', submitted: 16, approved: 9, region: 'Central MA', hasDetail: false },
  { name: 'Attleboro', submitted: 15, approved: 10, region: 'South Coast', hasDetail: false },
  { name: 'Harwich', submitted: 15, approved: 15, region: 'Cape Cod', hasDetail: false },
  { name: 'Tisbury', submitted: 15, approved: 14, region: 'Islands', hasDetail: false },
  { name: 'Brookline', submitted: 14, approved: 10, region: 'Metro Boston', hasDetail: false },
  { name: 'Taunton', submitted: 14, approved: 7, region: 'South Coast', hasDetail: false },
  { name: 'Westport', submitted: 14, approved: 14, region: 'South Coast', hasDetail: false },
  { name: 'Beverly', submitted: 12, approved: 12, region: 'North Shore', hasDetail: false },
  { name: 'Dracut', submitted: 12, approved: 10, region: 'Merrimack Valley', hasDetail: false },
  { name: 'Falmouth', submitted: 12, approved: 12, region: 'Cape Cod', hasDetail: true },
  { name: 'Ipswich', submitted: 12, approved: 9, region: 'North Shore', hasDetail: false },
  { name: 'Peabody', submitted: 12, approved: 7, region: 'North Shore', hasDetail: false },
  { name: 'Randolph', submitted: 12, approved: 5, region: 'Metro Boston', hasDetail: false },
  { name: 'Lexington', submitted: 6, approved: 6, region: 'Metro Boston', hasDetail: true },
  { name: 'Needham', submitted: 4, approved: 4, region: 'Metro Boston', hasDetail: true },
  { name: 'Duxbury', submitted: 3, approved: 2, region: 'South Shore', hasDetail: true },
  { name: 'Sudbury', submitted: 3, approved: 3, region: 'Metro Boston', hasDetail: true },
  { name: 'Andover', submitted: 10, approved: 9, region: 'Merrimack Valley', hasDetail: true },
  { name: 'Arlington', submitted: 7, approved: 6, region: 'Metro Boston', hasDetail: false },
  { name: 'Cambridge', submitted: 8, approved: 6, region: 'Metro Boston', hasDetail: false },
  { name: 'Framingham', submitted: 8, approved: 6, region: 'Metro Boston', hasDetail: false },
  { name: 'Malden', submitted: 8, approved: 5, region: 'Metro Boston', hasDetail: false },
  { name: 'Salem', submitted: 9, approved: 9, region: 'North Shore', hasDetail: false },
  { name: 'Chelmsford', submitted: 7, approved: 7, region: 'Merrimack Valley', hasDetail: false },
  { name: 'Danvers', submitted: 9, approved: 2, region: 'North Shore', hasDetail: false },
  { name: 'Gardner', submitted: 7, approved: 0, region: 'Central MA', hasDetail: false },
  { name: 'Everett', submitted: 7, approved: 2, region: 'Metro Boston', hasDetail: false },
  { name: 'Wayland', submitted: 7, approved: 2, region: 'Metro Boston', hasDetail: false },
]

const topTowns = [...towns].sort((a, b) => b.approved - a.approved).slice(0, 5)

const activeChallenges = [
  { townA: 'Newton', townB: 'Brookline', end: '2026-05-31', daysLeft: 113 },
  { townA: 'Plymouth', townB: 'Marshfield', end: '2026-05-31', daysLeft: 113 },
]

const intents = [
  { icon: '✅', label: 'Check feasibility', desc: 'Can I build an ADU?', href: '/quiz', color: 'border-emerald-500/30 bg-emerald-900/20' },
  { icon: '💰', label: 'Estimate cost & ROI', desc: 'What will it cost?', href: '/estimate', color: 'border-blue-500/30 bg-blue-900/20' },
  { icon: '🏗️', label: 'Find a builder', desc: 'Get group rates', href: '/club', color: 'border-purple-500/30 bg-purple-900/20' },
  { icon: '📊', label: 'Compare towns', desc: 'How does mine stack up?', href: '/leaderboard', color: 'border-amber-500/30 bg-amber-900/20' },
]

const MOBILE_INITIAL_COUNT = 10

export default function Home() {
  const { selectedTown, setSelectedTown } = useTown()
  const [mobileTab, setMobileTab] = useState<'towns' | 'map'>('towns')
  const [sortBy, setSortBy] = useState<'volume' | 'rate' | 'alpha'>('volume')
  const [showAllTowns, setShowAllTowns] = useState(false)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)

  // Check if desktop to auto-load map
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    setIsDesktop(mq.matches)
    if (mq.matches) setMapLoaded(true)
    const handler = (e: MediaQueryListEvent) => {
      setIsDesktop(e.matches)
      if (e.matches) setMapLoaded(true)
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const sortedTowns = [...towns].sort((a, b) => {
    if (sortBy === 'alpha') return a.name.localeCompare(b.name)
    if (sortBy === 'rate') {
      const rateA = a.submitted > 0 ? a.approved / a.submitted : 0
      const rateB = b.submitted > 0 ? b.approved / b.submitted : 0
      return rateB - rateA
    }
    return b.approved - a.approved
  })

  const totalApproved = towns.reduce((sum, t) => sum + t.approved, 0)
  const totalSubmitted = towns.reduce((sum, t) => sum + t.submitted, 0)
  const overallRate = Math.round((totalApproved / totalSubmitted) * 100)

  const myTownData = selectedTown ? towns.find(t => t.name === selectedTown) : null

  // Handle map tab — trigger lazy load
  const handleMapTab = () => {
    setMobileTab('map')
    setMapLoaded(true)
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-lg md:text-xl font-bold text-white tracking-tight">ADU Pulse</span>
            </div>
            <TownNav current="Home" />
          </div>
        </div>
      </header>

      {/* Club Banner */}
      <Link href="/club" className="block bg-gradient-to-r from-emerald-900/40 to-blue-900/40 border-b border-emerald-500/20 hover:from-emerald-900/60 hover:to-blue-900/60 transition-colors">
        <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-center gap-2 text-sm">
          <span className="bg-emerald-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">NEW</span>
          <span className="text-gray-300">Join your town&apos;s ADU group — save 15-20% with group builder rates</span>
          <span className="text-emerald-400">→</span>
        </div>
      </Link>

      <main className="max-w-6xl mx-auto px-4 py-6 md:py-8">
        {/* MOBILE: Personalized town header */}
        {myTownData && (
          <div className="md:hidden bg-gray-800 border border-gray-700 rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">📍</span>
                <span className="text-white font-bold">Your Town: {selectedTown}</span>
              </div>
              <button onClick={() => setSelectedTown('')} className="text-gray-500 text-xs hover:text-gray-300 min-h-[32px] px-2">Change</button>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center mb-3">
              <div className="bg-gray-900/50 rounded-lg p-2">
                <div className="text-emerald-400 font-bold">{myTownData.approved}</div>
                <div className="text-gray-500 text-[10px]">Approved</div>
              </div>
              <div className="bg-gray-900/50 rounded-lg p-2">
                <div className="text-white font-bold">{myTownData.submitted}</div>
                <div className="text-gray-500 text-[10px]">Submitted</div>
              </div>
              <div className="bg-gray-900/50 rounded-lg p-2">
                <div className="text-white font-bold">{myTownData.submitted > 0 ? Math.round((myTownData.approved / myTownData.submitted) * 100) : 0}%</div>
                <div className="text-gray-500 text-[10px]">Rate</div>
              </div>
            </div>
            <Link href={`/towns/${selectedTown?.toLowerCase().replace(/\s+/g, '-')}`}
              className="block text-center text-blue-400 text-sm font-medium py-2.5 bg-blue-600/10 rounded-lg hover:bg-blue-600/20 min-h-[44px]">
              View full {selectedTown} data →
            </Link>
          </div>
        )}

        {/* MOBILE: Intent-based entry */}
        <div className="md:hidden mb-6">
          <h2 className="text-gray-400 text-sm font-medium mb-3">What are you trying to do?</h2>
          <div className="grid grid-cols-2 gap-3">
            {intents.map(intent => (
              <Link key={intent.href} href={intent.href}
                className={`rounded-xl p-3.5 border ${intent.color} hover:opacity-90 active:opacity-75 transition-opacity min-h-[80px]`}>
                <div className="text-2xl mb-1">{intent.icon}</div>
                <div className="text-white font-medium text-sm">{intent.label}</div>
                <div className="text-gray-400 text-xs">{intent.desc}</div>
              </Link>
            ))}
          </div>
        </div>

        {/* Hero Stats */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">Tracking MA&apos;s ADU Progress</h1>
          <p className="text-gray-400 mb-6">Real permit data from 217 towns</p>

          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mb-8">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
              <div className="text-2xl md:text-3xl font-bold text-emerald-400">1,224</div>
              <div className="text-gray-400 text-xs md:text-sm">Approved</div>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
              <div className="text-2xl md:text-3xl font-bold text-white">217</div>
              <div className="text-gray-400 text-xs md:text-sm">Towns</div>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
              <div className="text-2xl md:text-3xl font-bold text-white">{overallRate}%</div>
              <div className="text-gray-400 text-xs md:text-sm">Approval Rate</div>
            </div>
          </div>

          {/* Desktop-only action buttons */}
          <div className="hidden md:flex flex-wrap justify-center gap-3 mb-8">
            <Link href="/town" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium">Find Your Town</Link>
            <Link href="/scorecards" className="px-5 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium">Town Scorecards</Link>
            <Link href="/leaderboard" className="px-5 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium">Leaderboard</Link>
            <Link href="/compare" className="px-5 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium">Compare Towns</Link>
          </div>
        </div>

        {/* Mobile Tabs */}
        <div className="md:hidden flex gap-1 mb-4">
          <button onClick={() => setMobileTab('towns')}
            className={`flex-1 py-2.5 text-center font-medium transition-colors min-h-[44px] rounded-lg ${
              mobileTab === 'towns' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400'}`}>
            📋 Towns
          </button>
          <button onClick={handleMapTab}
            className={`flex-1 py-2.5 text-center font-medium transition-colors min-h-[44px] rounded-lg ${
              mobileTab === 'map' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400'}`}>
            🗺️ Map
          </button>
        </div>

        {/* Towns + Map Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Town List */}
          <div className={`${mobileTab === 'towns' ? 'block' : 'hidden'} md:block`}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-white">All Towns</h2>
              <div className="flex gap-1.5 sm:gap-2">
                {(['volume', 'rate', 'alpha'] as const).map(key => (
                  <button key={key} onClick={() => setSortBy(key)}
                    className={`px-3 py-2 text-xs rounded-full min-h-[36px] min-w-[52px] font-medium ${
                      sortBy === key ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
                    {key === 'volume' && 'Volume'}
                    {key === 'rate' && 'Rate'}
                    {key === 'alpha' && 'A-Z'}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
              {/* On mobile: show limited list. On desktop: show all with scroll */}
              <div className="md:max-h-[500px] md:overflow-y-auto">
                {sortedTowns
                  .slice(0, showAllTowns ? undefined : MOBILE_INITIAL_COUNT)
                  .map(town => {
                    const rate = town.submitted > 0 ? Math.round((town.approved / town.submitted) * 100) : 0
                    const href = `/towns/${town.name.toLowerCase().replace(/\s+/g, "-")}`
                    const isMyTown = town.name === selectedTown

                    return (
                      <Link key={town.name} href={href}
                        onClick={() => setSelectedTown(town.name)}
                        className={`flex items-center justify-between px-4 py-3 border-b border-gray-700/50 hover:bg-gray-700/30 active:bg-gray-700/50 transition-colors min-h-[52px] ${
                          isMyTown ? 'bg-blue-600/10 border-l-2 border-l-blue-500' : ''
                        }`}>
                        <div>
                          <span className="text-white font-medium">{town.name}</span>
                          {town.hasDetail && <span className="ml-2 text-blue-400 text-xs">●</span>}
                          {isMyTown && <span className="ml-2 text-blue-400 text-xs">📍</span>}
                          <span className="text-gray-500 text-xs ml-2">{town.region}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-emerald-400 font-bold">{town.approved}</span>
                          <span className="text-gray-500 text-sm ml-2">{rate}%</span>
                        </div>
                      </Link>
                    )
                  })}
              </div>

              {/* Mobile: Show more / Show less */}
              {!showAllTowns && sortedTowns.length > MOBILE_INITIAL_COUNT && (
                <button
                  onClick={() => setShowAllTowns(true)}
                  className="md:hidden w-full py-3.5 text-blue-400 text-sm font-medium hover:bg-gray-700/30 active:bg-gray-700/50 transition-colors min-h-[48px] border-t border-gray-700/50"
                >
                  Show all {sortedTowns.length} towns ↓
                </button>
              )}
              {showAllTowns && sortedTowns.length > MOBILE_INITIAL_COUNT && (
                <button
                  onClick={() => setShowAllTowns(false)}
                  className="md:hidden w-full py-3.5 text-gray-500 text-sm font-medium hover:bg-gray-700/30 active:bg-gray-700/50 transition-colors min-h-[48px] border-t border-gray-700/50"
                >
                  Show less ↑
                </button>
              )}
            </div>
            <p className="text-gray-500 text-xs mt-2"><span className="text-blue-400">●</span> = Detailed permit data available</p>
          </div>

          {/* Map — lazy loaded: only renders on desktop or when mobile user taps Map tab */}
          <div className={`${mobileTab === 'map' || isDesktop ? 'block' : 'hidden'} ${!isDesktop && mobileTab !== 'map' ? 'md:block' : ''}`}>
            <h2 className="text-lg font-bold text-white mb-3">Map</h2>
            {mapLoaded ? (
              <Suspense fallback={<div className="bg-gray-800 border border-gray-700 rounded-xl h-[400px] sm:h-[500px] flex items-center justify-center text-gray-500">Loading map...</div>}>
                <TownMap />
              </Suspense>
            ) : (
              <div className="bg-gray-800 border border-gray-700 rounded-xl h-[400px] flex items-center justify-center text-gray-500 text-sm">
                Tap &ldquo;Map&rdquo; to load
              </div>
            )}
          </div>
        </div>

        {/* Club + Builders CTAs */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <Link href="/club" className="bg-gradient-to-r from-emerald-900/30 to-blue-900/30 border border-emerald-500/20 rounded-xl p-5 hover:from-emerald-900/50 hover:to-blue-900/50 transition-colors group min-h-[100px]">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">🏘️</span>
              <h3 className="text-lg font-bold text-white">ADU Club</h3>
              <span className="bg-emerald-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">NEW</span>
            </div>
            <p className="text-gray-400 text-sm mb-2">Join homeowners in your town to unlock 15-20% group rates from vetted builders.</p>
            <span className="text-emerald-400 text-sm group-hover:underline">Join your town&apos;s group →</span>
          </Link>
          <Link href="/builders" className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/20 rounded-xl p-5 hover:from-blue-900/50 hover:to-purple-900/50 transition-colors group min-h-[100px]">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">🏗️</span>
              <h3 className="text-lg font-bold text-white">For Builders</h3>
            </div>
            <p className="text-gray-400 text-sm mb-2">Get clustered, pre-qualified leads from homeowners in towns you serve.</p>
            <span className="text-blue-400 text-sm group-hover:underline">Join builder network →</span>
          </Link>
        </div>

        {/* Challenges + Top Towns */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">🏆 Active Challenges</h2>
              <div className="flex gap-4">
                <Link href="/challenges" className="text-blue-400 text-sm hover:underline min-h-[44px] flex items-center">All</Link>
                <Link href="/challenge/new" className="text-blue-400 text-sm hover:underline min-h-[44px] flex items-center">Create</Link>
              </div>
            </div>
            <div className="space-y-3">
              {activeChallenges.map((c, i) => (
                <Link key={i} href={`/challenge?a=${c.townA}&b=${c.townB}&start=2026-03-01&end=${c.end}`}
                  className="block bg-gray-900 rounded-lg p-3.5 hover:bg-gray-700/50 active:bg-gray-700 transition-colors min-h-[52px]">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-medium">{c.townA} vs {c.townB}</span>
                    <span className="text-gray-400 text-sm">{c.daysLeft} days left</span>
                  </div>
                </Link>
              ))}
            </div>
            <Link href="/challenge/new" className="block mt-4 text-center py-3 border border-dashed border-gray-600 rounded-lg text-gray-400 hover:text-white hover:border-gray-500 transition-colors text-sm min-h-[48px] flex items-center justify-center">
              + Issue a Challenge
            </Link>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">📊 Top Towns</h2>
              <Link href="/leaderboard" className="text-blue-400 text-sm hover:underline min-h-[44px] flex items-center">Full list →</Link>
            </div>
            <div className="space-y-2">
              {topTowns.map((town, i) => (
                <Link key={town.name} href={`/town/${encodeURIComponent(town.name)}`}
                  className="flex items-center justify-between py-3 px-3 bg-gray-900 rounded-lg hover:bg-gray-700/50 active:bg-gray-700 transition-colors min-h-[52px]">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500 w-6">#{i + 1}</span>
                    <span className="text-white font-medium">{town.name}</span>
                  </div>
                  <span className="text-emerald-400 font-bold">{town.approved}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Blog Preview */}
        <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/20 rounded-xl p-4 md:p-6 mb-8">
          <div className="text-blue-400 text-sm font-medium mb-1">Latest Analysis</div>
          <h3 className="text-lg md:text-xl font-bold text-white mb-2">What 1,224 ADU Permits Taught Me About Massachusetts Housing</h3>
          <p className="text-gray-400 text-sm mb-3 hidden md:block">One year in: which towns are succeeding, which are stalling, and why the numbers tell a more complicated story.</p>
          <Link href="/blog/massachusetts-adu-year-one" className="text-blue-400 text-sm hover:underline">Read the full analysis →</Link>
        </div>

        {/* Cost Estimator CTA */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-white">💰 Planning an ADU?</h3>
              <p className="text-gray-400 text-sm">Get a rough cost estimate based on real permit data.</p>
            </div>
            <Link href="/estimate" className="px-5 py-3 md:py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium text-center min-h-[48px] flex items-center justify-center">Cost Estimator →</Link>
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-800 mt-12">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-sm text-gray-500">
            <div>
              <p>Data: EOHLC Survey Feb 2026 · Population: Census 2024</p>
              <p className="text-xs mt-1"><span className="text-blue-400">●</span> Blue towns have detailed permit data scraped directly from town portals.</p>
            </div>
            <div className="flex flex-wrap gap-1">
              <Link href="/blog" className="hover:text-white min-h-[44px] min-w-[44px] flex items-center justify-center px-2.5">Blog</Link>
              <Link href="/club" className="hover:text-white min-h-[44px] min-w-[44px] flex items-center justify-center px-2.5">Club</Link>
              <Link href="/builders" className="hover:text-white min-h-[44px] min-w-[44px] flex items-center justify-center px-2.5">Builders</Link>
              <Link href="/scorecards" className="hover:text-white min-h-[44px] min-w-[44px] flex items-center justify-center px-2.5">Scorecards</Link>
              <Link href="/leaderboard" className="hover:text-white min-h-[44px] min-w-[44px] flex items-center justify-center px-2.5">Leaderboard</Link>
              <Link href="/challenge/new" className="hover:text-white min-h-[44px] min-w-[44px] flex items-center justify-center px-2.5">Challenge</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
