'use client'

import Link from 'next/link'
import TownNav from '@/components/TownNav'
import { useState } from 'react'

interface TownData {
  name: string
  submitted: number
  approved: number
  region: string
  hasDetail: boolean
  sfParcels?: number
  medianReviewDays?: number
  varianceRate?: number
  avgValue?: number
}

const towns: TownData[] = [
  { name: 'Boston', submitted: 69, approved: 44, region: 'Metro Boston', hasDetail: true, sfParcels: 48200, medianReviewDays: 52, varianceRate: 12, avgValue: 285000 },
  { name: 'Lawrence', submitted: 44, approved: 32, region: 'Merrimack Valley', hasDetail: false, sfParcels: 7100, medianReviewDays: 38, varianceRate: 5, avgValue: 195000 },
  { name: 'Plymouth', submitted: 42, approved: 34, region: 'South Shore', hasDetail: true, sfParcels: 22800, medianReviewDays: 41, varianceRate: 8, avgValue: 245000 },
  { name: 'Newton', submitted: 40, approved: 18, region: 'Metro Boston', hasDetail: true, sfParcels: 23500, medianReviewDays: 68, varianceRate: 22, avgValue: 340000 },
  { name: 'Somerville', submitted: 40, approved: 24, region: 'Metro Boston', hasDetail: false, sfParcels: 8900, medianReviewDays: 45, varianceRate: 15, avgValue: 275000 },
  { name: 'Barnstable', submitted: 31, approved: 6, region: 'Cape Cod', hasDetail: false, sfParcels: 18500, medianReviewDays: 78, varianceRate: 35, avgValue: 265000 },
  { name: 'Worcester', submitted: 31, approved: 23, region: 'Central MA', hasDetail: false, sfParcels: 32600, medianReviewDays: 44, varianceRate: 9, avgValue: 210000 },
  { name: 'Haverhill', submitted: 29, approved: 13, region: 'Merrimack Valley', hasDetail: false, sfParcels: 15200, medianReviewDays: 55, varianceRate: 18, avgValue: 225000 },
  { name: 'Methuen', submitted: 28, approved: 21, region: 'Merrimack Valley', hasDetail: false, sfParcels: 12800, medianReviewDays: 35, varianceRate: 6, avgValue: 215000 },
  { name: 'Nantucket', submitted: 27, approved: 27, region: 'Islands', hasDetail: false, sfParcels: 5200, medianReviewDays: 32, varianceRate: 0, avgValue: 420000 },
  { name: 'Lowell', submitted: 26, approved: 26, region: 'Merrimack Valley', hasDetail: false, sfParcels: 14100, medianReviewDays: 28, varianceRate: 0, avgValue: 190000 },
  { name: 'Fall River', submitted: 25, approved: 13, region: 'South Coast', hasDetail: false, sfParcels: 16400, medianReviewDays: 62, varianceRate: 20, avgValue: 175000 },
  { name: 'Milton', submitted: 25, approved: 24, region: 'Metro Boston', hasDetail: true, sfParcels: 8600, medianReviewDays: 36, varianceRate: 4, avgValue: 310000 },
  { name: 'Marshfield', submitted: 24, approved: 11, region: 'South Shore', hasDetail: false, sfParcels: 10200, medianReviewDays: 58, varianceRate: 25, avgValue: 255000 },
  { name: 'Amherst', submitted: 23, approved: 12, region: 'Pioneer Valley', hasDetail: false, sfParcels: 6800, medianReviewDays: 50, varianceRate: 15, avgValue: 235000 },
  { name: 'Lexington', submitted: 6, approved: 6, region: 'Metro Boston', hasDetail: true, sfParcels: 10500, medianReviewDays: 42, varianceRate: 0, avgValue: 365000 },
  { name: 'Needham', submitted: 4, approved: 4, region: 'Metro Boston', hasDetail: true, sfParcels: 9800, medianReviewDays: 39, varianceRate: 0, avgValue: 355000 },
  { name: 'Andover', submitted: 10, approved: 9, region: 'Merrimack Valley', hasDetail: true, sfParcels: 11200, medianReviewDays: 40, varianceRate: 5, avgValue: 295000 },
  { name: 'Falmouth', submitted: 12, approved: 12, region: 'Cape Cod', hasDetail: true, sfParcels: 14600, medianReviewDays: 34, varianceRate: 0, avgValue: 275000 },
  { name: 'Duxbury', submitted: 3, approved: 2, region: 'South Shore', hasDetail: true, sfParcels: 5400, medianReviewDays: 48, varianceRate: 10, avgValue: 325000 },
  { name: 'Sudbury', submitted: 3, approved: 3, region: 'Metro Boston', hasDetail: true, sfParcels: 6100, medianReviewDays: 38, varianceRate: 0, avgValue: 350000 },
  { name: 'Revere', submitted: 17, approved: 9, region: 'Metro Boston', hasDetail: true, sfParcels: 7800, medianReviewDays: 55, varianceRate: 18, avgValue: 235000 },
]

function getGrade(rate: number, reviewDays: number, varianceRate: number): { letter: string, color: string } {
  let score = 0
  if (rate >= 80) score += 3; else if (rate >= 60) score += 2; else if (rate >= 40) score += 1
  if (reviewDays <= 35) score += 3; else if (reviewDays <= 50) score += 2; else if (reviewDays <= 65) score += 1
  if (varianceRate <= 5) score += 3; else if (varianceRate <= 15) score += 2; else if (varianceRate <= 25) score += 1

  if (score >= 8) return { letter: 'A', color: 'text-emerald-400' }
  if (score >= 6) return { letter: 'B', color: 'text-blue-400' }
  if (score >= 4) return { letter: 'C', color: 'text-yellow-400' }
  return { letter: 'D', color: 'text-red-400' }
}

type SortKey = 'grade' | 'rate' | 'speed' | 'density' | 'alpha'

export default function ScorecardsPage() {
  const [sortBy, setSortBy] = useState<SortKey>('grade')
  const [regionFilter, setRegionFilter] = useState('')

  const regions = Array.from(new Set(towns.map(t => t.region))).sort()

  const enriched = towns.map(t => {
    const rate = t.submitted > 0 ? Math.round((t.approved / t.submitted) * 100) : 0
    const per1k = t.sfParcels ? ((t.approved / t.sfParcels) * 1000).toFixed(1) : '—'
    const grade = getGrade(rate, t.medianReviewDays || 60, t.varianceRate || 20)
    return { ...t, rate, per1k, grade }
  })

  const filtered = regionFilter ? enriched.filter(t => t.region === regionFilter) : enriched

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'alpha') return a.name.localeCompare(b.name)
    if (sortBy === 'rate') return b.rate - a.rate
    if (sortBy === 'speed') return (a.medianReviewDays || 99) - (b.medianReviewDays || 99)
    if (sortBy === 'density') return parseFloat(String(b.per1k)) - parseFloat(String(a.per1k))
    // grade
    const gradeOrder: Record<string, number> = { A: 4, B: 3, C: 2, D: 1 }
    return (gradeOrder[b.grade.letter] || 0) - (gradeOrder[a.grade.letter] || 0)
  })

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-lg md:text-xl font-bold text-white tracking-tight">ADU Pulse</span>
            </Link>
            <TownNav current="Scorecards" />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Town Scorecards</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            How ADU-friendly is your town? We grade each town on approval rate, review speed, and
            whether you&apos;ll need a variance.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex gap-2 flex-wrap">
            {(['grade', 'rate', 'speed', 'density', 'alpha'] as const).map(key => (
              <button
                key={key}
                onClick={() => setSortBy(key)}
                className={`px-3 py-1.5 text-xs rounded-full ${sortBy === key ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
              >
                {key === 'grade' && 'Overall Grade'}
                {key === 'rate' && 'Approval Rate'}
                {key === 'speed' && 'Fastest Review'}
                {key === 'density' && 'Per 1K Parcels'}
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
          <span><span className="text-emerald-400 font-bold">A</span> = ADU-friendly</span>
          <span><span className="text-blue-400 font-bold">B</span> = Mostly smooth</span>
          <span><span className="text-yellow-400 font-bold">C</span> = Some friction</span>
          <span><span className="text-red-400 font-bold">D</span> = Significant barriers</span>
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
                  <div className={`text-3xl font-black ${town.grade.color}`}>{town.grade.letter}</div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-gray-500 text-xs">Approval Rate</div>
                    <div className="text-white font-medium">{town.rate}%</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-xs">Median Review</div>
                    <div className="text-white font-medium">{town.medianReviewDays || '—'} days</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-xs">Per 1K Parcels</div>
                    <div className="text-white font-medium">{town.per1k}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-xs">Variance Needed</div>
                    <div className="text-white font-medium">{town.varianceRate || 0}%</div>
                  </div>
                </div>

                {town.avgValue && (
                  <div className="mt-3 pt-3 border-t border-gray-700/50">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Avg. Construction Value</span>
                      <span className="text-emerald-400 font-medium">${(town.avgValue / 1000).toFixed(0)}K</span>
                    </div>
                  </div>
                )}
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

      <footer className="border-t border-gray-800 mt-12">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-sm text-gray-500">
            <div>
              <p>Data: EOHLC Survey Feb 2026 · Review times and variance rates are estimates based on available permit data.</p>
            </div>
            <div className="flex gap-6">
              <Link href="/" className="hover:text-white">Home</Link>
              <Link href="/club" className="hover:text-white">Club</Link>
              <Link href="/builders" className="hover:text-white">Builders</Link>
              <Link href="/blog" className="hover:text-white">Blog</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
