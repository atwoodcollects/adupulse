'use client'

import Link from 'next/link'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import { useState } from 'react'

interface TownData {
  name: string
  submitted: number
  approved: number
  region: string
  hasDetail: boolean
}

const towns: TownData[] = [
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

function getRateColor(rate: number): string {
  if (rate >= 80) return 'text-emerald-400'
  if (rate >= 60) return 'text-blue-400'
  if (rate >= 40) return 'text-yellow-400'
  return 'text-red-400'
}

function getRateLabel(rate: number): string {
  if (rate >= 80) return 'High'
  if (rate >= 60) return 'Moderate'
  if (rate >= 40) return 'Low'
  return 'Very Low'
}

type SortKey = 'rate' | 'volume' | 'approved' | 'alpha'

export default function ScorecardsPage() {
  const [sortBy, setSortBy] = useState<SortKey>('rate')
  const [regionFilter, setRegionFilter] = useState('')

  const regions = Array.from(new Set(towns.map(t => t.region))).sort()

  const enriched = towns.map(t => {
    const rate = t.submitted > 0 ? Math.round((t.approved / t.submitted) * 100) : 0
    const pending = t.submitted - t.approved
    return { ...t, rate, pending }
  })

  const filtered = regionFilter ? enriched.filter(t => t.region === regionFilter) : enriched

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'alpha') return a.name.localeCompare(b.name)
    if (sortBy === 'rate') return b.rate - a.rate
    if (sortBy === 'volume') return b.submitted - a.submitted
    if (sortBy === 'approved') return b.approved - a.approved
    return 0
  })

  return (
    <div className="min-h-screen bg-gray-900">
      <NavBar current="Scorecards" />

      <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Town Scorecards</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            How is your town handling ADU permits? Compare approval rates, volume, and pending applications across Massachusetts.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex gap-2 flex-wrap">
            {(['rate', 'volume', 'approved', 'alpha'] as const).map(key => (
              <button
                key={key}
                onClick={() => setSortBy(key)}
                className={`px-3 py-1.5 text-xs rounded-full ${sortBy === key ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
              >
                {key === 'rate' && 'Approval Rate'}
                {key === 'volume' && 'Most Submitted'}
                {key === 'approved' && 'Most Approved'}
                {key === 'alpha' && 'A-Z'}
              </button>
            ))}
          </div>
          <select
            value={regionFilter}
            onChange={e => setRegionFilter(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none"
          >
            <option value="">All Regions</option>
            {regions.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mb-6 text-xs text-gray-500">
          <span><span className="text-emerald-400 font-bold">80%+</span> = High approval</span>
          <span><span className="text-blue-400 font-bold">60-79%</span> = Moderate</span>
          <span><span className="text-yellow-400 font-bold">40-59%</span> = Low</span>
          <span><span className="text-red-400 font-bold">&lt;40%</span> = Very low</span>
        </div>

        {/* Scorecard grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sorted.map(town => {
            const href = town.hasDetail ? `/${town.name.toLowerCase()}` : `/town/${encodeURIComponent(town.name)}`
            return (
              <Link
                key={town.name}
                href={href}
                className="bg-gray-800 border border-gray-700 rounded-xl p-5 hover:border-gray-600 transition-colors group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-white font-bold text-lg group-hover:text-blue-400 transition-colors">{town.name}</h3>
                    <span className="text-gray-500 text-xs">{town.region}</span>
                  </div>
                  <div className={`text-3xl font-black ${getRateColor(town.rate)}`}>{town.rate}%</div>
                </div>

                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div>
                    <div className="text-gray-500 text-xs">Submitted</div>
                    <div className="text-white font-medium">{town.submitted}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-xs">Approved</div>
                    <div className="text-emerald-400 font-medium">{town.approved}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-xs">Pending/Denied</div>
                    <div className="text-gray-400 font-medium">{town.pending}</div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-700/50">
                  <div className="flex justify-between items-center text-xs">
                    <span className={`font-medium ${getRateColor(town.rate)}`}>{getRateLabel(town.rate)} approval rate</span>
                    {town.hasDetail && <span className="text-blue-400">Detailed data ●</span>}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* CTA */}
        <div className="mt-10 grid md:grid-cols-2 gap-4">
          <Link href="/club" className="bg-gradient-to-r from-emerald-900/30 to-blue-900/30 border border-emerald-500/20 rounded-xl p-6 hover:from-emerald-900/50 hover:to-blue-900/50 transition-colors">
            <h3 className="text-white font-bold mb-1">Planning an ADU?</h3>
            <p className="text-gray-400 text-sm">Join your town&apos;s ADU group for 15-20% group builder rates.</p>
            <span className="text-emerald-400 text-sm mt-2 inline-block">Join the Club &rarr;</span>
          </Link>
          <Link href="/builders" className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/20 rounded-xl p-6 hover:from-blue-900/50 hover:to-purple-900/50 transition-colors">
            <h3 className="text-white font-bold mb-1">Are you a builder?</h3>
            <p className="text-gray-400 text-sm">Get clustered leads from homeowners in towns you serve.</p>
            <span className="text-blue-400 text-sm mt-2 inline-block">Join Builder Network &rarr;</span>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}
