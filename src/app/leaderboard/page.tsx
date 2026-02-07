'use client'

import Link from 'next/link'
import TownNav from '@/components/TownNav'
import { useState } from 'react'

const towns = [
  { name: 'Boston', submitted: 69, approved: 44, detached: 11, attached: 58, population: 675647, region: 'Metro Boston' },
  { name: 'Lawrence', submitted: 44, approved: 32, detached: 18, attached: 26, population: 89143, region: 'Merrimack Valley' },
  { name: 'Plymouth', submitted: 42, approved: 34, detached: 18, attached: 24, population: 61217, region: 'South Shore' },
  { name: 'Newton', submitted: 40, approved: 18, detached: 16, attached: 24, population: 88923, region: 'Metro Boston' },
  { name: 'Somerville', submitted: 40, approved: 24, detached: 34, attached: 6, population: 81045, region: 'Metro Boston' },
  { name: 'Barnstable', submitted: 31, approved: 6, detached: 13, attached: 18, population: 48237, region: 'Cape Cod' },
  { name: 'Worcester', submitted: 31, approved: 23, detached: 15, attached: 16, population: 206518, region: 'Central MA' },
  { name: 'Haverhill', submitted: 29, approved: 13, detached: 13, attached: 16, population: 67787, region: 'Merrimack Valley' },
  { name: 'Methuen', submitted: 28, approved: 21, detached: 9, attached: 19, population: 50706, region: 'Merrimack Valley' },
  { name: 'Nantucket', submitted: 27, approved: 27, detached: 24, attached: 3, population: 14255, region: 'Islands' },
  { name: 'Lowell', submitted: 26, approved: 26, detached: 9, attached: 17, population: 115554, region: 'Merrimack Valley' },
  { name: 'Fall River', submitted: 25, approved: 13, detached: 9, attached: 16, population: 94000, region: 'South Coast' },
  { name: 'Milton', submitted: 25, approved: 24, detached: 1, attached: 24, population: 27620, region: 'Metro Boston' },
  { name: 'Marshfield', submitted: 24, approved: 11, detached: 18, attached: 6, population: 26100, region: 'South Shore' },
  { name: 'Amherst', submitted: 23, approved: 12, detached: 14, attached: 9, population: 40096, region: 'Pioneer Valley' },
  { name: 'Lynn', submitted: 22, approved: 9, detached: 5, attached: 17, population: 101253, region: 'North Shore' },
  { name: 'Medford', submitted: 22, approved: 19, detached: 13, attached: 9, population: 59659, region: 'Metro Boston' },
  { name: 'Northampton', submitted: 20, approved: 15, detached: 7, attached: 13, population: 29571, region: 'Pioneer Valley' },
  { name: 'Billerica', submitted: 18, approved: 13, detached: 6, attached: 12, population: 43799, region: 'Merrimack Valley' },
  { name: 'Fairhaven', submitted: 18, approved: 18, detached: 9, attached: 9, population: 16441, region: 'South Coast' },
  { name: 'Middleborough', submitted: 18, approved: 18, detached: 14, attached: 4, population: 25726, region: 'South Shore' },
  { name: 'Raynham', submitted: 18, approved: 18, detached: 1, attached: 17, population: 14921, region: 'South Shore' },
  { name: 'Freetown', submitted: 17, approved: 13, detached: 12, attached: 5, population: 9513, region: 'South Coast' },
  { name: 'Quincy', submitted: 17, approved: 6, detached: 3, attached: 14, population: 101636, region: 'Metro Boston' },
  { name: 'Revere', submitted: 17, approved: 9, detached: 0, attached: 17, population: 62186, region: 'Metro Boston' },
  { name: 'Brockton', submitted: 16, approved: 5, detached: 8, attached: 8, population: 105643, region: 'South Shore' },
  { name: 'Shrewsbury', submitted: 16, approved: 9, detached: 3, attached: 13, population: 38526, region: 'Central MA' },
  { name: 'Attleboro', submitted: 15, approved: 10, detached: 3, attached: 12, population: 46036, region: 'South Coast' },
  { name: 'Harwich', submitted: 15, approved: 15, detached: 15, attached: 0, population: 13336, region: 'Cape Cod' },
  { name: 'Tisbury', submitted: 15, approved: 14, detached: 6, attached: 9, population: 4815, region: 'Islands' },
  { name: 'Brookline', submitted: 14, approved: 10, detached: 8, attached: 6, population: 63191, region: 'Metro Boston' },
  { name: 'Taunton', submitted: 14, approved: 7, detached: 11, attached: 3, population: 60897, region: 'South Coast' },
  { name: 'Westport', submitted: 14, approved: 14, detached: 5, attached: 9, population: 16118, region: 'South Coast' },
  { name: 'Beverly', submitted: 12, approved: 12, detached: 10, attached: 2, population: 42670, region: 'North Shore' },
  { name: 'Dracut', submitted: 12, approved: 10, detached: 7, attached: 5, population: 32377, region: 'Merrimack Valley' },
  { name: 'Falmouth', submitted: 12, approved: 12, detached: 7, attached: 5, population: 33696, region: 'Cape Cod' },
  { name: 'Ipswich', submitted: 12, approved: 9, detached: 7, attached: 5, population: 14150, region: 'North Shore' },
  { name: 'Peabody', submitted: 12, approved: 7, detached: 4, attached: 8, population: 54458, region: 'North Shore' },
  { name: 'Randolph', submitted: 12, approved: 5, detached: 5, attached: 7, population: 34984, region: 'Metro Boston' },
  { name: 'Lexington', submitted: 6, approved: 6, detached: 2, attached: 4, population: 34454, region: 'Metro Boston' },
  { name: 'Needham', submitted: 4, approved: 4, detached: 1, attached: 3, population: 31388, region: 'Metro Boston' },
  { name: 'Duxbury', submitted: 3, approved: 2, detached: 3, attached: 0, population: 16090, region: 'South Shore' },
  { name: 'Sudbury', submitted: 3, approved: 3, detached: 2, attached: 1, population: 19655, region: 'Metro Boston' },
  { name: 'Andover', submitted: 10, approved: 9, detached: 3, attached: 7, population: 36480, region: 'Merrimack Valley' },
  { name: 'Arlington', submitted: 7, approved: 6, detached: 3, attached: 4, population: 46308, region: 'Metro Boston' },
  { name: 'Cambridge', submitted: 8, approved: 6, detached: 4, attached: 4, population: 118403, region: 'Metro Boston' },
  { name: 'Framingham', submitted: 8, approved: 6, detached: 2, attached: 6, population: 72362, region: 'Metro Boston' },
  { name: 'Malden', submitted: 8, approved: 5, detached: 3, attached: 5, population: 66263, region: 'Metro Boston' },
  { name: 'Salem', submitted: 9, approved: 9, detached: 2, attached: 7, population: 44480, region: 'North Shore' },
  { name: 'Chelmsford', submitted: 7, approved: 7, detached: 3, attached: 4, population: 35939, region: 'Merrimack Valley' },
  { name: 'Danvers', submitted: 9, approved: 2, detached: 3, attached: 6, population: 28549, region: 'North Shore' },
  { name: 'Gardner', submitted: 7, approved: 0, detached: 2, attached: 5, population: 21557, region: 'Central MA' },
  { name: 'Everett', submitted: 7, approved: 2, detached: 3, attached: 4, population: 49075, region: 'Metro Boston' },
  { name: 'Wayland', submitted: 7, approved: 2, detached: 6, attached: 1, population: 13835, region: 'Metro Boston' },
]

type SortKey = 'approved' | 'rate' | 'perCapita' | 'submitted'

const regions = ['All Regions', 'Metro Boston', 'Cape Cod', 'Islands', 'South Shore', 'North Shore', 'Merrimack Valley', 'South Coast', 'Central MA', 'Pioneer Valley']

export default function LeaderboardPage() {
  const [sortBy, setSortBy] = useState<SortKey>('approved')
  const [region, setRegion] = useState('All Regions')
  const [searchTown, setSearchTown] = useState('')

  const filtered = towns
    .filter(t => region === 'All Regions' || t.region === region)
    .map(t => ({
      ...t,
      rate: t.submitted > 0 ? t.approved / t.submitted : 0,
      perCapita: (t.approved / t.population) * 10000
    }))
    .sort((a, b) => {
      if (sortBy === 'rate') return b.rate - a.rate
      if (sortBy === 'perCapita') return b.perCapita - a.perCapita
      if (sortBy === 'submitted') return b.submitted - a.submitted
      return b.approved - a.approved
    })

  const searchedTown = searchTown 
    ? filtered.find(t => t.name.toLowerCase().includes(searchTown.toLowerCase()))
    : null
  const searchedRank = searchedTown ? filtered.indexOf(searchedTown) + 1 : null

  const getRankBadge = (rank: number) => {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return `#${rank}`
  }

  const getMetricLabel = () => {
    if (sortBy === 'rate') return 'Approval Rate'
    if (sortBy === 'perCapita') return 'Per 10k Residents'
    if (sortBy === 'submitted') return 'Submitted'
    return 'Approved'
  }

  const getMetricValue = (t: typeof filtered[0]) => {
    if (sortBy === 'rate') return Math.min(Math.round(t.rate * 100), 100) + '%'
    if (sortBy === 'perCapita') return t.perCapita.toFixed(1)
    if (sortBy === 'submitted') return t.submitted
    return t.approved
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-lg md:text-xl font-bold text-white tracking-tight">ADU Pulse</span>
            </Link>
            <TownNav current="Leaderboard" />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white text-center mb-2">ADU Leaderboard</h1>
        <p className="text-gray-400 text-center mb-8">Which MA towns are leading the ADU race?</p>

        {/* Find Your Town */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 mb-6">
          <label className="text-gray-400 text-sm mb-2 block">Find your town</label>
          <input
            type="text"
            placeholder="Enter town name..."
            value={searchTown}
            onChange={(e) => setSearchTown(e.target.value)}
            className="w-full bg-gray-900 border border-gray-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
          />
          {searchedTown && searchedRank && (
            <div className="mt-3 p-3 bg-blue-900/30 border border-blue-500/30 rounded-lg">
              <span className="text-white font-medium">{searchedTown.name}</span> is ranked{' '}
              <span className="text-emerald-400 font-bold">#{searchedRank}</span> of {filtered.length} towns
              {region !== 'All Regions' && ` in ${region}`} by {getMetricLabel().toLowerCase()}.
              <Link 
                href={`/compare?a=${searchedTown.name}&b=${filtered[0].name}`}
                className="block mt-2 text-blue-400 text-sm hover:underline"
              >
                Compare to #{1} {filtered[0].name} →
              </Link>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Sort By */}
          <div className="flex gap-2 flex-wrap">
            {(['approved', 'rate', 'perCapita', 'submitted'] as SortKey[]).map(key => (
              <button
                key={key}
                onClick={() => setSortBy(key)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  sortBy === key ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {key === 'approved' && 'Approved'}
                {key === 'rate' && 'Approval Rate'}
                {key === 'perCapita' && 'Per Capita'}
                {key === 'submitted' && 'Submitted'}
              </button>
            ))}
          </div>

          {/* Region Filter */}
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500"
          >
            {regions.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        {/* Leaderboard */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-12 gap-2 px-4 py-3 border-b border-gray-700 text-gray-400 text-sm">
            <div className="col-span-1">Rank</div>
            <div className="col-span-5">Town</div>
            <div className="col-span-3 text-right">{getMetricLabel()}</div>
            <div className="col-span-3 text-right">Compare</div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-gray-700/50">
            {filtered.slice(0, 25).map((town, i) => (
              <div 
                key={town.name} 
                className={`grid grid-cols-12 gap-2 px-4 py-3 items-center hover:bg-gray-700/30 ${
                  i < 3 ? 'bg-gradient-to-r from-emerald-900/20 to-transparent' : ''
                }`}
              >
                <div className="col-span-1 text-lg">
                  {getRankBadge(i + 1)}
                </div>
                <div className="col-span-5">
                  <span className="text-white font-medium">{town.name}</span>
                  <span className="text-gray-500 text-xs ml-2">{town.region}</span>
                </div>
                <div className="col-span-3 text-right">
                  <span className={`font-bold ${i < 3 ? 'text-emerald-400' : 'text-white'}`}>
                    {getMetricValue(town)}
                  </span>
                </div>
                <div className="col-span-3 text-right">
                  <Link
                    href={`/compare?a=${town.name}&b=${filtered[0].name === town.name ? filtered[1]?.name : filtered[0].name}`}
                    className="text-blue-400 text-sm hover:underline"
                  >
                    Compare
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {filtered.length > 25 && (
            <div className="px-4 py-3 text-center text-gray-500 text-sm border-t border-gray-700">
              Showing top 25 of {filtered.length} towns
            </div>
          )}
        </div>

        {/* Bottom 5 - Shame Section */}
        <div className="mt-8">
          <h2 className="text-lg font-bold text-white mb-4">⚠️ Room for Improvement</h2>
          <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
            <div className="divide-y divide-gray-700/50">
              {filtered.slice(-5).reverse().map((town, i) => (
                <div 
                  key={town.name} 
                  className="grid grid-cols-12 gap-2 px-4 py-3 items-center hover:bg-gray-700/30"
                >
                  <div className="col-span-1 text-gray-500">
                    #{filtered.length - 4 + i}
                  </div>
                  <div className="col-span-5">
                    <span className="text-white font-medium">{town.name}</span>
                    <span className="text-gray-500 text-xs ml-2">{town.region}</span>
                  </div>
                  <div className="col-span-3 text-right">
                    <span className="font-bold text-red-400">
                      {getMetricValue(town)}
                    </span>
                  </div>
                  <div className="col-span-3 text-right">
                    <Link
                      href={`/compare?a=${town.name}&b=${filtered[0].name}`}
                      className="text-blue-400 text-sm hover:underline"
                    >
                      Compare
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 text-center">
          <Link 
            href="/compare" 
            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium"
          >
            Challenge Your Town →
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-12">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 text-xs text-gray-500">
            <div>Data: EOHLC Survey Feb 2026</div>
            <div className="flex gap-4">
              <Link href="/" className="hover:text-white">Home</Link>
              <Link href="/compare" className="hover:text-white">Compare</Link>
              <Link href="/blog" className="hover:text-white">Blog</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
