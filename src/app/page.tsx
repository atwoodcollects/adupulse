'use client'

import TownNav from '@/components/TownNav'
import { HLCTown } from '@/lib/hlcData'
import Link from 'next/link'
import { useState } from 'react'
import dynamic from 'next/dynamic'

const TownMap = dynamic(() => import('@/components/TownMap'), { ssr: false })

const data = [
  { name: 'Boston', submitted: 69, approved: 44, detachedSub: 11, attachedSub: 58, detachedApp: 0, attachedApp: 44, hasPage: true },
  { name: 'Plymouth', submitted: 42, approved: 34, detachedSub: 18, attachedSub: 24, detachedApp: 18, attachedApp: 16, hasPage: true },
  { name: 'Somerville', submitted: 40, approved: 24, detachedSub: 34, attachedSub: 6, detachedApp: 21, attachedApp: 3 },
  { name: 'Barnstable', submitted: 31, approved: 6, detachedSub: 13, attachedSub: 18, detachedApp: 2, attachedApp: 4 },
  { name: 'Worcester', submitted: 31, approved: 23, detachedSub: 15, attachedSub: 16, detachedApp: 12, attachedApp: 11 },
  { name: 'Haverhill', submitted: 29, approved: 13, detachedSub: 13, attachedSub: 16, detachedApp: 6, attachedApp: 7 },
  { name: 'Fall River', submitted: 25, approved: 13, detachedSub: 9, attachedSub: 16, detachedApp: 8, attachedApp: 5 },
  { name: 'Amherst', submitted: 23, approved: 12, detachedSub: 14, attachedSub: 9, detachedApp: 7, attachedApp: 5 },
  { name: 'Billerica', submitted: 18, approved: 13, detachedSub: 6, attachedSub: 12, detachedApp: 5, attachedApp: 8 },
  { name: 'Fairhaven', submitted: 18, approved: 18, detachedSub: 9, attachedSub: 9, detachedApp: 9, attachedApp: 9 },
  { name: 'Raynham', submitted: 18, approved: 18, detachedSub: 1, attachedSub: 17, detachedApp: 1, attachedApp: 17 },
  { name: 'Freetown', submitted: 17, approved: 13, detachedSub: 12, attachedSub: 5, detachedApp: 8, attachedApp: 5 },
  { name: 'Quincy', submitted: 17, approved: 6, detachedSub: 3, attachedSub: 14, detachedApp: 0, attachedApp: 6 },
  { name: 'Revere', submitted: 17, approved: 9, detachedSub: 0, attachedSub: 17, detachedApp: 0, attachedApp: 9, hasPage: true },
  { name: 'Brockton', submitted: 16, approved: 5, detachedSub: 8, attachedSub: 8, detachedApp: 2, attachedApp: 3 },
  { name: 'Shrewsbury', submitted: 16, approved: 9, detachedSub: 3, attachedSub: 13, detachedApp: 2, attachedApp: 7 },
  { name: 'Attleboro', submitted: 15, approved: 10, detachedSub: 3, attachedSub: 12, detachedApp: 3, attachedApp: 7 },
  { name: 'Harwich', submitted: 15, approved: 15, detachedSub: 15, attachedSub: 0, detachedApp: 15, attachedApp: 0 },
  { name: 'Tisbury', submitted: 15, approved: 14, detachedSub: 6, attachedSub: 9, detachedApp: 5, attachedApp: 9 },
  { name: 'Taunton', submitted: 14, approved: 7, detachedSub: 11, attachedSub: 3, detachedApp: 5, attachedApp: 2 },
  { name: 'Westport', submitted: 14, approved: 14, detachedSub: 5, attachedSub: 9, detachedApp: 5, attachedApp: 9 },
  { name: 'Beverly', submitted: 12, approved: 12, detachedSub: 10, attachedSub: 2, detachedApp: 10, attachedApp: 2 },
  { name: 'Dracut', submitted: 12, approved: 10, detachedSub: 7, attachedSub: 5, detachedApp: 7, attachedApp: 3 },
  { name: 'Falmouth', submitted: 12, approved: 12, detachedSub: 7, attachedSub: 5, detachedApp: 7, attachedApp: 5, hasPage: true },
  { name: 'Peabody', submitted: 12, approved: 7, detachedSub: 4, attachedSub: 8, detachedApp: 2, attachedApp: 5 },
  { name: 'Randolph', submitted: 12, approved: 5, detachedSub: 5, attachedSub: 7, detachedApp: 4, attachedApp: 1 },
  { name: 'Abington', submitted: 11, approved: 3, detachedSub: 6, attachedSub: 5, detachedApp: 2, attachedApp: 1 },
  { name: 'Bellingham', submitted: 11, approved: 7, detachedSub: 5, attachedSub: 6, detachedApp: 4, attachedApp: 3 },
  { name: 'Braintree', submitted: 11, approved: 10, detachedSub: 4, attachedSub: 7, detachedApp: 3, attachedApp: 7 },
  { name: 'Edgartown', submitted: 11, approved: 4, detachedSub: 11, attachedSub: 0, detachedApp: 4, attachedApp: 0 },
  { name: 'Somerset', submitted: 11, approved: 9, detachedSub: 6, attachedSub: 5, detachedApp: 4, attachedApp: 5 },
  { name: 'Stoughton', submitted: 11, approved: 5, detachedSub: 5, attachedSub: 6, detachedApp: 3, attachedApp: 2 },
  { name: 'Andover', submitted: 10, approved: 9, detachedSub: 3, attachedSub: 7, detachedApp: 3, attachedApp: 6, hasPage: true },
  { name: 'Charlton', submitted: 10, approved: 5, detachedSub: 3, attachedSub: 7, detachedApp: 1, attachedApp: 4 },
  { name: 'Hanover', submitted: 10, approved: 8, detachedSub: 8, attachedSub: 2, detachedApp: 6, attachedApp: 2 },
  { name: 'Norwood', submitted: 10, approved: 6, detachedSub: 3, attachedSub: 7, detachedApp: 2, attachedApp: 4 },
  { name: 'Oak Bluffs', submitted: 10, approved: 8, detachedSub: 7, attachedSub: 3, detachedApp: 5, attachedApp: 3 },
  { name: 'Pepperell', submitted: 10, approved: 10, detachedSub: 2, attachedSub: 8, detachedApp: 2, attachedApp: 8 },
  { name: 'Danvers', submitted: 9, approved: 2, detachedSub: 3, attachedSub: 6, detachedApp: 0, attachedApp: 2 },
  { name: 'Foxborough', submitted: 9, approved: 9, detachedSub: 5, attachedSub: 4, detachedApp: 5, attachedApp: 4 },
  { name: 'Hamilton', submitted: 9, approved: 9, detachedSub: 5, attachedSub: 4, detachedApp: 5, attachedApp: 4 },
  { name: 'Salem', submitted: 9, approved: 9, detachedSub: 2, attachedSub: 7, detachedApp: 2, attachedApp: 7 },
  { name: 'Scituate', submitted: 9, approved: 9, detachedSub: 4, attachedSub: 5, detachedApp: 4, attachedApp: 5 },
  { name: 'Cambridge', submitted: 8, approved: 6, detachedSub: 4, attachedSub: 4, detachedApp: 3, attachedApp: 3 },
  { name: 'East Bridgewater', submitted: 8, approved: 8, detachedSub: 5, attachedSub: 3, detachedApp: 5, attachedApp: 3 },
  { name: 'Framingham', submitted: 8, approved: 6, detachedSub: 2, attachedSub: 6, detachedApp: 1, attachedApp: 5 },
  { name: 'Swansea', submitted: 8, approved: 8, detachedSub: 1, attachedSub: 7, detachedApp: 1, attachedApp: 7 },
  { name: 'Yarmouth', submitted: 8, approved: 16, detachedSub: 3, attachedSub: 5, detachedApp: 3, attachedApp: 13 },
  { name: 'Arlington', submitted: 7, approved: 6, detachedSub: 3, attachedSub: 4, detachedApp: 2, attachedApp: 4 },
  { name: 'Chelmsford', submitted: 7, approved: 7, detachedSub: 3, attachedSub: 4, detachedApp: 3, attachedApp: 4 },
  { name: 'Dennis', submitted: 7, approved: 6, detachedSub: 4, attachedSub: 3, detachedApp: 4, attachedApp: 2 },
  { name: 'Everett', submitted: 7, approved: 2, detachedSub: 3, attachedSub: 4, detachedApp: 2, attachedApp: 0 },
  { name: 'Gardner', submitted: 7, approved: 0, detachedSub: 2, attachedSub: 5, detachedApp: 0, attachedApp: 0 },
  { name: 'Groveland', submitted: 7, approved: 7, detachedSub: 5, attachedSub: 2, detachedApp: 5, attachedApp: 2 },
  { name: 'Wayland', submitted: 7, approved: 2, detachedSub: 6, attachedSub: 1, detachedApp: 2, attachedApp: 0 },
  { name: 'Westwood', submitted: 7, approved: 6, detachedSub: 3, attachedSub: 4, detachedApp: 2, attachedApp: 4 },
  { name: 'Lexington', submitted: 6, approved: 6, detachedSub: 3, attachedSub: 3, detachedApp: 3, attachedApp: 3, hasPage: true },
  { name: 'Milton', submitted: 4, approved: 4, detachedSub: 3, attachedSub: 1, detachedApp: 3, attachedApp: 1, hasPage: true },
  { name: 'Newton', submitted: 4, approved: 3, detachedSub: 2, attachedSub: 2, detachedApp: 2, attachedApp: 1, hasPage: true },
  { name: 'Needham', submitted: 3, approved: 3, detachedSub: 2, attachedSub: 1, detachedApp: 2, attachedApp: 1, hasPage: true },
  { name: 'Duxbury', submitted: 3, approved: 2, detachedSub: 3, attachedSub: 0, detachedApp: 2, attachedApp: 0, hasPage: true },
  { name: 'Sudbury', submitted: 3, approved: 3, detachedSub: 2, attachedSub: 1, detachedApp: 2, attachedApp: 1, hasPage: true },
]

type SortKey = 'name' | 'submitted' | 'approved' | 'rate'

function StatCard({ value, label }: { value: string | number, label: string }) {
  return (
    <div className="stat-card animate-fade-in text-center">
      <div className="stat-value text-text-primary">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  )
}

export default function Dashboard() {
  const [sortKey, setSortKey] = useState<SortKey>('submitted')
  const [sortAsc, setSortAsc] = useState(false)
  const [search, setSearch] = useState('')

  const totalSubmitted = 989
  const totalApproved = 1224
  const totalDetached = 447
  const totalAttached = 542

  const filtered = data.filter(t => 
    t.name.toLowerCase().includes(search.toLowerCase())
  )

  const sorted = [...filtered].sort((a, b) => {
    let aVal: number | string, bVal: number | string
    if (sortKey === 'name') {
      aVal = a.name
      bVal = b.name
    } else if (sortKey === 'rate') {
      aVal = a.submitted > 0 ? a.approved / a.submitted : 0
      bVal = b.submitted > 0 ? b.approved / b.submitted : 0
    } else {
      aVal = a[sortKey]
      bVal = b[sortKey]
    }
    if (aVal < bVal) return sortAsc ? -1 : 1
    if (aVal > bVal) return sortAsc ? 1 : -1
    return 0
  })

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc)
    } else {
      setSortKey(key)
      setSortAsc(false)
    }
  }

  const getRate = (approved: number, submitted: number) => {
    if (submitted === 0) return '—'
    return Math.round((approved / submitted) * 100) + '%'
  }

  const getRateColor = (approved: number, submitted: number) => {
    if (submitted === 0) return 'text-text-muted'
    const rate = approved / submitted
    if (rate >= 0.9) return 'text-emerald-400'
    if (rate >= 0.7) return 'text-blue-400'
    if (rate >= 0.5) return 'text-amber-400'
    return 'text-red-400'
  }

  // Convert data for map component
  const mapTowns: HLCTown[] = data.map(t => ({
    name: t.name,
    muni_id: null,
    applications: t.submitted,
    approved: t.approved,
    rejected: t.submitted - t.approved,
    detached_apps: t.detachedSub,
    attached_apps: t.attachedSub,
    lat: null,
    lng: null
  }))

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-2xl font-bold tracking-tight">
                ADU PULSE
              </h1>
              <p className="text-text-secondary text-sm mt-1">
                Massachusetts ADU permit tracking
              </p>
              <p className="text-text-muted text-xs mt-1">
                Data: EOHLC Survey Jan 2026 (statewide totals) + direct permit scraping (town pages)
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="pulse-dot mr-2"></div>
              <span className="text-xs text-text-muted uppercase tracking-wide">Live</span>
              <TownNav current="All Towns" />
            </div>
          </div>
        </div>
      </header>

      {/* Stats */}
      <section className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
          <div className="flex gap-2 md:gap-4">
            <StatCard value={totalSubmitted.toLocaleString()} label="Submitted" />
            <StatCard value={totalApproved.toLocaleString()} label="Approved" />
            <StatCard value={totalDetached.toLocaleString()} label="Detached" />
            <StatCard value={totalAttached.toLocaleString()} label="Attached" />
          </div>
        </div>
      </section>

      {/* Map + Table */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Map */}
          <div className="lg:col-span-2">
            <div className="bg-surface border border-border rounded-lg overflow-hidden">
              <TownMap towns={mapTowns} />
            </div>
            {/* Map Legend */}
            <div className="flex flex-wrap items-center gap-3 md:gap-6 mt-4 text-xs md:text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-approved"></div>
                <span className="text-text-secondary">10+ approved</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-pending"></div>
                <span className="text-text-secondary">4-9 approved</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-text-muted"></div>
                <span className="text-text-secondary">1-3 approved</span>
              </div>
            </div>

            {/* Key Insights */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-800/50 border border-border rounded-lg p-4">
                <h3 className="text-emerald-400 text-sm font-medium mb-2">100% Approval</h3>
                <p className="text-text-secondary text-xs">Fairhaven, Raynham, Pepperell, Harwich, Westport, Beverly, Salem</p>
              </div>
              <div className="bg-gray-800/50 border border-border rounded-lg p-4">
                <h3 className="text-red-400 text-sm font-medium mb-2">Low Approval</h3>
                <p className="text-text-secondary text-xs">Gardner (0%), Barnstable (19%), Danvers (22%), Everett (29%)</p>
              </div>
              <div className="bg-gray-800/50 border border-border rounded-lg p-4">
                <h3 className="text-blue-400 text-sm font-medium mb-2">Highest Volume</h3>
                <p className="text-text-secondary text-xs">Boston (69), Plymouth (42), Somerville (40), Worcester (31)</p>
              </div>
            </div>
          </div>

          {/* Sidebar - Sortable Table */}
          <div className="bg-surface border border-border rounded-lg overflow-hidden">
            <div className="p-4 border-b border-border">
              <input
                type="text"
                placeholder="Search towns..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-border rounded-lg text-white text-sm placeholder-text-muted focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="max-h-[500px] overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-surface">
                  <tr className="text-text-secondary border-b border-border">
                    <th 
                      className="text-left p-3 cursor-pointer hover:text-white"
                      onClick={() => handleSort('name')}
                    >
                      Town {sortKey === 'name' && (sortAsc ? '↑' : '↓')}
                    </th>
                    <th 
                      className="text-right p-3 cursor-pointer hover:text-white"
                      onClick={() => handleSort('submitted')}
                    >
                      Sub {sortKey === 'submitted' && (sortAsc ? '↑' : '↓')}
                    </th>
                    <th 
                      className="text-right p-3 cursor-pointer hover:text-white"
                      onClick={() => handleSort('rate')}
                    >
                      Rate {sortKey === 'rate' && (sortAsc ? '↑' : '↓')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((town) => (
                    <tr key={town.name} className="border-b border-border/50 hover:bg-gray-700/20">
                      <td className="p-3">
                        {town.hasPage ? (
                          <Link href={`/${town.name.toLowerCase().replace(' ', '-')}`} className="text-blue-400 hover:underline">
                            {town.name}
                          </Link>
                        ) : (
                          <span className="text-white">{town.name}</span>
                        )}
                      </td>
                      <td className="text-right p-3 text-white">{town.submitted}</td>
                      <td className={`text-right p-3 font-medium ${getRateColor(town.approved, town.submitted)}`}>
                        {getRate(town.approved, town.submitted)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 mt-8">
        <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/30 rounded-lg p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h2 className="text-xl font-bold text-white mb-2">What will an ADU cost in your town?</h2>
              <p className="text-text-secondary">Try our free estimator based on real permit data.</p>
            </div>
            <a href="/estimate" className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
              Get Estimate →
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-text-muted text-sm">
              EOHLC survey data is self-reported by towns (Jan 2026 update: 1,224 approved in 217 communities). Town pages show real-time permit data scraped directly from municipal portals.
            </div>
            <div className="flex items-center gap-6 text-sm">
              <a href="/statewide" className="text-text-secondary hover:text-accent transition-colors">
                Full Data
              </a>
              <a href="/estimate" className="text-text-secondary hover:text-accent transition-colors">
                Estimator
              </a>
            </div>
          </div>
          <div className="text-text-muted text-xs mt-4">
            Built by Nick Welch · Powered by public data
          </div>
        </div>
      </footer>
    </div>
  )
}
