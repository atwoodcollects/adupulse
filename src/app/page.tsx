'use client'

import TownNav from '@/components/TownNav'
import { HLCTown } from '@/lib/hlcData'
import Link from 'next/link'
import { useState } from 'react'
import dynamic from 'next/dynamic'

const TownMap = dynamic(() => import('@/components/TownMap'), { ssr: false })

const data = [
  { name: 'Boston', submitted: 69, approved: 44, detachedSub: 11, attachedSub: 58, detachedApp: 0, attachedApp: 44, hasPage: true },
  { name: 'Lawrence', submitted: 44, approved: 32, detachedSub: 18, attachedSub: 26, detachedApp: 18, attachedApp: 14 },
  { name: 'Plymouth', submitted: 42, approved: 34, detachedSub: 18, attachedSub: 24, detachedApp: 18, attachedApp: 16, hasPage: true },
  { name: 'Newton', submitted: 40, approved: 18, detachedSub: 16, attachedSub: 24, detachedApp: 6, attachedApp: 12, hasPage: true },
  { name: 'Somerville', submitted: 40, approved: 24, detachedSub: 34, attachedSub: 6, detachedApp: 21, attachedApp: 3 },
  { name: 'Barnstable', submitted: 31, approved: 6, detachedSub: 13, attachedSub: 18, detachedApp: 2, attachedApp: 4 },
  { name: 'Worcester', submitted: 31, approved: 23, detachedSub: 15, attachedSub: 16, detachedApp: 12, attachedApp: 11 },
  { name: 'Haverhill', submitted: 29, approved: 13, detachedSub: 13, attachedSub: 16, detachedApp: 6, attachedApp: 7 },
  { name: 'Methuen', submitted: 28, approved: 21, detachedSub: 9, attachedSub: 19, detachedApp: 7, attachedApp: 14 },
  { name: 'Nantucket', submitted: 27, approved: 27, detachedSub: 24, attachedSub: 3, detachedApp: 24, attachedApp: 3 },
  { name: 'Lowell', submitted: 26, approved: 26, detachedSub: 9, attachedSub: 17, detachedApp: 9, attachedApp: 17 },
  { name: 'Fall River', submitted: 25, approved: 13, detachedSub: 9, attachedSub: 16, detachedApp: 8, attachedApp: 5 },
  { name: 'Milton', submitted: 25, approved: 24, detachedSub: 1, attachedSub: 24, detachedApp: 1, attachedApp: 23, hasPage: true },
  { name: 'Marshfield', submitted: 24, approved: 11, detachedSub: 18, attachedSub: 6, detachedApp: 8, attachedApp: 3 },
  { name: 'Amherst', submitted: 23, approved: 12, detachedSub: 14, attachedSub: 9, detachedApp: 7, attachedApp: 5 },
  { name: 'Lynn', submitted: 22, approved: 9, detachedSub: 5, attachedSub: 17, detachedApp: 4, attachedApp: 5 },
  { name: 'Medford', submitted: 22, approved: 19, detachedSub: 13, attachedSub: 9, detachedApp: 12, attachedApp: 7 },
  { name: 'Northampton', submitted: 20, approved: 15, detachedSub: 7, attachedSub: 13, detachedApp: 2, attachedApp: 13 },
  { name: 'Billerica', submitted: 18, approved: 13, detachedSub: 6, attachedSub: 12, detachedApp: 5, attachedApp: 8 },
  { name: 'Fairhaven', submitted: 18, approved: 18, detachedSub: 9, attachedSub: 9, detachedApp: 9, attachedApp: 9 },
  { name: 'Middleborough', submitted: 18, approved: 18, detachedSub: 14, attachedSub: 4, detachedApp: 14, attachedApp: 4 },
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
  { name: 'Ipswich', submitted: 12, approved: 9, detachedSub: 7, attachedSub: 5, detachedApp: 6, attachedApp: 3 },
  { name: 'Peabody', submitted: 12, approved: 7, detachedSub: 4, attachedSub: 8, detachedApp: 2, attachedApp: 5 },
  { name: 'Randolph', submitted: 12, approved: 5, detachedSub: 5, attachedSub: 7, detachedApp: 4, attachedApp: 1 },
  { name: 'Abington', submitted: 11, approved: 3, detachedSub: 6, attachedSub: 5, detachedApp: 2, attachedApp: 1 },
  { name: 'Bellingham', submitted: 11, approved: 7, detachedSub: 5, attachedSub: 6, detachedApp: 4, attachedApp: 3 },
  { name: 'Braintree', submitted: 11, approved: 10, detachedSub: 4, attachedSub: 7, detachedApp: 3, attachedApp: 7 },
  { name: 'Edgartown', submitted: 11, approved: 4, detachedSub: 11, attachedSub: 0, detachedApp: 4, attachedApp: 0 },
  { name: 'Melrose', submitted: 11, approved: 11, detachedSub: 8, attachedSub: 3, detachedApp: 8, attachedApp: 3 },
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
  { name: 'Lynnfield', submitted: 9, approved: 9, detachedSub: 4, attachedSub: 5, detachedApp: 4, attachedApp: 5 },
  { name: 'Newburyport', submitted: 9, approved: 8, detachedSub: 5, attachedSub: 4, detachedApp: 5, attachedApp: 3 },
  { name: 'Salem', submitted: 9, approved: 9, detachedSub: 2, attachedSub: 7, detachedApp: 2, attachedApp: 7 },
  { name: 'Scituate', submitted: 9, approved: 9, detachedSub: 4, attachedSub: 5, detachedApp: 4, attachedApp: 5 },
  { name: 'Cambridge', submitted: 8, approved: 6, detachedSub: 4, attachedSub: 4, detachedApp: 3, attachedApp: 3 },
  { name: 'East Bridgewater', submitted: 8, approved: 8, detachedSub: 5, attachedSub: 3, detachedApp: 5, attachedApp: 3 },
  { name: 'Framingham', submitted: 8, approved: 6, detachedSub: 2, attachedSub: 6, detachedApp: 1, attachedApp: 5 },
  { name: 'Malden', submitted: 8, approved: 5, detachedSub: 3, attachedSub: 5, detachedApp: 2, attachedApp: 3 },
  { name: 'Millbury', submitted: 8, approved: 7, detachedSub: 5, attachedSub: 3, detachedApp: 4, attachedApp: 3 },
  { name: 'Swansea', submitted: 8, approved: 8, detachedSub: 1, attachedSub: 7, detachedApp: 1, attachedApp: 7 },
  { name: 'Yarmouth', submitted: 8, approved: 16, detachedSub: 3, attachedSub: 5, detachedApp: 3, attachedApp: 13 },
  { name: 'Arlington', submitted: 7, approved: 6, detachedSub: 3, attachedSub: 4, detachedApp: 2, attachedApp: 4 },
  { name: 'Chelmsford', submitted: 7, approved: 7, detachedSub: 3, attachedSub: 4, detachedApp: 3, attachedApp: 4 },
  { name: 'Dennis', submitted: 7, approved: 6, detachedSub: 4, attachedSub: 3, detachedApp: 4, attachedApp: 2 },
  { name: 'Everett', submitted: 7, approved: 2, detachedSub: 3, attachedSub: 4, detachedApp: 2, attachedApp: 0 },
  { name: 'Gardner', submitted: 7, approved: 0, detachedSub: 2, attachedSub: 5, detachedApp: 0, attachedApp: 0 },
  { name: 'Groveland', submitted: 7, approved: 7, detachedSub: 5, attachedSub: 2, detachedApp: 5, attachedApp: 2 },
  { name: 'Littleton', submitted: 7, approved: 7, detachedSub: 0, attachedSub: 7, detachedApp: 0, attachedApp: 7 },
  { name: 'Mansfield', submitted: 7, approved: 7, detachedSub: 3, attachedSub: 4, detachedApp: 3, attachedApp: 4 },
  { name: 'Wayland', submitted: 7, approved: 2, detachedSub: 6, attachedSub: 1, detachedApp: 2, attachedApp: 0 },
  { name: 'Westwood', submitted: 7, approved: 6, detachedSub: 3, attachedSub: 4, detachedApp: 2, attachedApp: 4 },
  { name: 'Lexington', submitted: 6, approved: 6, detachedSub: 2, attachedSub: 4, detachedApp: 2, attachedApp: 4, hasPage: true },
  { name: 'Needham', submitted: 4, approved: 4, detachedSub: 1, attachedSub: 3, detachedApp: 1, attachedApp: 3, hasPage: true },
  { name: 'Duxbury', submitted: 3, approved: 2, detachedSub: 3, attachedSub: 0, detachedApp: 2, attachedApp: 0, hasPage: true },
  { name: 'Sudbury', submitted: 3, approved: 3, detachedSub: 2, attachedSub: 1, detachedApp: 2, attachedApp: 1, hasPage: true },
]

type SortKey = 'name' | 'submitted' | 'approved' | 'rate'
type MobileView = 'list' | 'map'

export default function Dashboard() {
  const [sortKey, setSortKey] = useState<SortKey>('submitted')
  const [sortAsc, setSortAsc] = useState(false)
  const [search, setSearch] = useState('')
  const [mobileView, setMobileView] = useState<MobileView>('list')

  const totalSubmitted = 1639
  const totalApproved = 1224
  const totalDetached = 775
  const totalAttached = 864
  const approvalRate = Math.round((totalApproved / totalSubmitted) * 100)

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
    const rate = Math.round((approved / submitted) * 100)
    return Math.min(rate, 100) + '%'
  }

  const getRateColor = (approved: number, submitted: number) => {
    if (submitted === 0) return 'text-gray-500'
    const rate = approved / submitted
    if (rate >= 0.9) return 'text-emerald-400'
    if (rate >= 0.7) return 'text-blue-400'
    if (rate >= 0.5) return 'text-amber-400'
    return 'text-red-400'
  }

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
      <header className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <h1 className="text-lg md:text-xl font-bold text-white tracking-tight">
                ADU Pulse
              </h1>
            </div>
            <TownNav current="All Towns" />
          </div>
        </div>
      </header>

      {/* Stats - Horizontal scroll on mobile */}
      <section className="border-b border-gray-800 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex gap-6 md:gap-8 min-w-max md:min-w-0 md:justify-center">
            <div className="text-center">
              <div className="text-xl md:text-2xl font-bold text-white">{totalSubmitted.toLocaleString()}</div>
              <div className="text-xs text-gray-500">Submitted</div>
            </div>
            <div className="text-center">
              <div className="text-xl md:text-2xl font-bold text-emerald-400">{totalApproved.toLocaleString()}</div>
              <div className="text-xs text-gray-500">Approved</div>
            </div>
            <div className="text-center">
              <div className="text-xl md:text-2xl font-bold text-blue-400">{approvalRate}%</div>
              <div className="text-xs text-gray-500">Rate</div>
            </div>
            <div className="text-center">
              <div className="text-xl md:text-2xl font-bold text-white">{totalDetached.toLocaleString()}</div>
              <div className="text-xs text-gray-500">Detached</div>
            </div>
            <div className="text-center">
              <div className="text-xl md:text-2xl font-bold text-white">{totalAttached.toLocaleString()}</div>
              <div className="text-xs text-gray-500">Attached</div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Tab Toggle */}
      <div className="md:hidden border-b border-gray-800">
        <div className="flex">
          <button
            onClick={() => setMobileView('list')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              mobileView === 'list'
                ? 'text-white border-b-2 border-blue-500 bg-gray-800/50'
                : 'text-gray-400'
            }`}
          >
            📋 Towns
          </button>
          <button
            onClick={() => setMobileView('map')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              mobileView === 'map'
                ? 'text-white border-b-2 border-blue-500 bg-gray-800/50'
                : 'text-gray-400'
            }`}
          >
            🗺️ Map
          </button>
        </div>
      </div>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto">
        {/* Desktop Layout */}
        <div className="hidden md:grid md:grid-cols-5 gap-6 p-6">
          {/* Map - 3 cols */}
          <div className="col-span-3">
            <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
              <TownMap towns={mapTowns} />
            </div>
            <div className="flex items-center justify-center gap-6 mt-3 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                <span className="text-gray-500">10+</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                <span className="text-gray-500">4-9</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-gray-500"></div>
                <span className="text-gray-500">1-3</span>
              </div>
            </div>
            {/* Insights */}
            <div className="grid grid-cols-3 gap-3 mt-4">
              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3">
                <h3 className="text-emerald-400 text-xs font-semibold mb-1">🏆 100% Approval</h3>
                <p className="text-gray-500 text-xs">Nantucket, Lowell, Fairhaven, Harwich</p>
              </div>
              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3">
                <h3 className="text-red-400 text-xs font-semibold mb-1">⚠️ Low Approval</h3>
                <p className="text-gray-500 text-xs">Gardner (0%), Barnstable (19%)</p>
              </div>
              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3">
                <h3 className="text-blue-400 text-xs font-semibold mb-1">📈 Top Volume</h3>
                <p className="text-gray-500 text-xs">Boston (69), Lawrence (44)</p>
              </div>
            </div>
          </div>

          {/* Town List - 2 cols */}
          <div className="col-span-2">
            <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
              <div className="p-3 border-b border-gray-700">
                <input
                  type="text"
                  placeholder="Search 217 towns..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="max-h-[480px] overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-gray-800 z-10">
                    <tr className="text-gray-400 border-b border-gray-700">
                      <th className="text-left py-2.5 px-3 cursor-pointer hover:text-white" onClick={() => handleSort('name')}>
                        Town {sortKey === 'name' && (sortAsc ? '↑' : '↓')}
                      </th>
                      <th className="text-right py-2.5 px-3 cursor-pointer hover:text-white" onClick={() => handleSort('submitted')}>
                        Apps {sortKey === 'submitted' && (sortAsc ? '↑' : '↓')}
                      </th>
                      <th className="text-right py-2.5 px-3 cursor-pointer hover:text-white" onClick={() => handleSort('rate')}>
                        Rate {sortKey === 'rate' && (sortAsc ? '↑' : '↓')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700/50">
                    {sorted.map((town) => (
                      <tr key={town.name} className="hover:bg-gray-700/30">
                        <td className="py-2.5 px-3">
                          {town.hasPage ? (
                            <Link href={`/${town.name.toLowerCase().replace(/ /g, '-')}`} className="text-blue-400 hover:underline">
                              {town.name}
                            </Link>
                          ) : (
                            <span className="text-white">{town.name}</span>
                          )}
                        </td>
                        <td className="text-right py-2.5 px-3">
                          <span className="text-white">{town.approved}</span>
                          <span className="text-gray-500">/{town.submitted}</span>
                        </td>
                        <td className={`text-right py-2.5 px-3 font-medium ${getRateColor(town.approved, town.submitted)}`}>
                          {getRate(town.approved, town.submitted)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden">
          {mobileView === 'list' ? (
            <div className="p-4">
              {/* Search */}
              <input
                type="text"
                placeholder="Search towns..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500 mb-3"
              />
              
              {/* Sort buttons */}
              <div className="flex gap-2 mb-3">
                <button
                  onClick={() => handleSort('submitted')}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                    sortKey === 'submitted' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400'
                  }`}
                >
                  Volume {sortKey === 'submitted' && (sortAsc ? '↑' : '↓')}
                </button>
                <button
                  onClick={() => handleSort('rate')}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                    sortKey === 'rate' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400'
                  }`}
                >
                  Rate {sortKey === 'rate' && (sortAsc ? '↑' : '↓')}
                </button>
                <button
                  onClick={() => handleSort('name')}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                    sortKey === 'name' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400'
                  }`}
                >
                  A-Z {sortKey === 'name' && (sortAsc ? '↑' : '↓')}
                </button>
              </div>

              {/* Town Cards */}
              <div className="space-y-2">
                {sorted.map((town) => (
                  <div key={town.name} className="bg-gray-800 border border-gray-700 rounded-lg p-3 flex items-center justify-between">
                    <div>
                      {town.hasPage ? (
                        <Link href={`/${town.name.toLowerCase().replace(/ /g, '-')}`} className="text-blue-400 font-medium">
                          {town.name}
                        </Link>
                      ) : (
                        <span className="text-white font-medium">{town.name}</span>
                      )}
                      <div className="text-xs text-gray-500 mt-0.5">
                        {town.approved} approved / {town.submitted} submitted
                      </div>
                    </div>
                    <div className={`text-lg font-bold ${getRateColor(town.approved, town.submitted)}`}>
                      {getRate(town.approved, town.submitted)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-4">
              <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
                <TownMap towns={mapTowns} />
              </div>
              <div className="flex items-center justify-center gap-4 mt-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                  <span className="text-gray-500">10+</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                  <span className="text-gray-500">4-9</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-500"></div>
                  <span className="text-gray-500">1-3</span>
                </div>
              </div>
              {/* Mobile Insights */}
              <div className="mt-4 space-y-2">
                <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3 flex items-center justify-between">
                  <span className="text-emerald-400 text-sm">🏆 100% Approval</span>
                  <span className="text-gray-400 text-xs">Nantucket, Lowell, Harwich</span>
                </div>
                <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3 flex items-center justify-between">
                  <span className="text-red-400 text-sm">⚠️ Low Approval</span>
                  <span className="text-gray-400 text-xs">Gardner 0%, Barnstable 19%</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-blue-500/30 rounded-xl p-4 md:p-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h2 className="text-base md:text-lg font-bold text-white">What will an ADU cost in your town?</h2>
              <p className="text-gray-400 text-sm">Based on real permit data</p>
            </div>
            <a href="/estimate" className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium text-sm">
              Get Estimate →
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 text-xs text-gray-500">
            <div>Data: EOHLC Survey Feb 2026 • 1,224 ADUs in 217 towns</div>
            <div className="flex gap-4">
              <a href="/statewide" className="hover:text-white">Full Data</a>
              <a href="/estimate" className="hover:text-white">Estimator</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
