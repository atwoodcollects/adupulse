'use client'

import Link from 'next/link'
import { useState } from 'react'

const data = [
  { name: 'Boston', submitted: 69, approved: 44, detachedSub: 11, attachedSub: 58, detachedApp: 0, attachedApp: 44 },
  { name: 'Plymouth', submitted: 42, approved: 34, detachedSub: 18, attachedSub: 24, detachedApp: 18, attachedApp: 16 },
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
  { name: 'Belchertown', submitted: 6, approved: 6, detachedSub: 0, attachedSub: 6, detachedApp: 0, attachedApp: 6 },
  { name: 'Chilmark', submitted: 6, approved: 6, detachedSub: 6, attachedSub: 0, detachedApp: 6, attachedApp: 0 },
  { name: 'Greenfield', submitted: 6, approved: 6, detachedSub: 3, attachedSub: 3, detachedApp: 3, attachedApp: 3 },
  { name: 'Holliston', submitted: 6, approved: 4, detachedSub: 6, attachedSub: 0, detachedApp: 4, attachedApp: 0 },
  { name: 'Lexington', submitted: 6, approved: 6, detachedSub: 3, attachedSub: 3, detachedApp: 3, attachedApp: 3, hasPage: true },
  { name: 'Orleans', submitted: 6, approved: 6, detachedSub: 4, attachedSub: 2, detachedApp: 4, attachedApp: 2 },
  { name: 'Rochester', submitted: 6, approved: 6, detachedSub: 0, attachedSub: 6, detachedApp: 0, attachedApp: 6 },
  { name: 'Sandwich', submitted: 6, approved: 4, detachedSub: 4, attachedSub: 2, detachedApp: 4, attachedApp: 0 },
  { name: 'Saugus', submitted: 6, approved: 6, detachedSub: 0, attachedSub: 6, detachedApp: 0, attachedApp: 6 },
  { name: 'Tewksbury', submitted: 6, approved: 2, detachedSub: 1, attachedSub: 5, detachedApp: 0, attachedApp: 2 },
  { name: 'Wakefield', submitted: 6, approved: 6, detachedSub: 2, attachedSub: 4, detachedApp: 2, attachedApp: 4 },
  { name: 'West Newbury', submitted: 6, approved: 6, detachedSub: 4, attachedSub: 2, detachedApp: 4, attachedApp: 2 },
  { name: 'West Springfield', submitted: 6, approved: 6, detachedSub: 2, attachedSub: 4, detachedApp: 2, attachedApp: 4 },
  { name: 'Woburn', submitted: 6, approved: 6, detachedSub: 2, attachedSub: 4, detachedApp: 2, attachedApp: 4 },
  { name: 'Wrentham', submitted: 6, approved: 6, detachedSub: 2, attachedSub: 4, detachedApp: 2, attachedApp: 4 },
  { name: 'Brookline', submitted: 5, approved: 2, detachedSub: 2, attachedSub: 3, detachedApp: 2, attachedApp: 0 },
  { name: 'Paxton', submitted: 5, approved: 4, detachedSub: 4, attachedSub: 1, detachedApp: 3, attachedApp: 1 },
  { name: 'Pittsfield', submitted: 5, approved: 5, detachedSub: 5, attachedSub: 0, detachedApp: 5, attachedApp: 0 },
  { name: 'Templeton', submitted: 5, approved: 5, detachedSub: 3, attachedSub: 2, detachedApp: 3, attachedApp: 2 },
  { name: 'Upton', submitted: 5, approved: 4, detachedSub: 2, attachedSub: 3, detachedApp: 1, attachedApp: 3 },
  { name: 'Uxbridge', submitted: 5, approved: 5, detachedSub: 3, attachedSub: 2, detachedApp: 3, attachedApp: 2 },
  { name: 'Walpole', submitted: 5, approved: 5, detachedSub: 1, attachedSub: 4, detachedApp: 1, attachedApp: 4 },
  { name: 'Waltham', submitted: 5, approved: 4, detachedSub: 0, attachedSub: 5, detachedApp: 0, attachedApp: 4 },
  { name: 'West Tisbury', submitted: 5, approved: 4, detachedSub: 3, attachedSub: 2, detachedApp: 2, attachedApp: 2 },
  { name: 'Westminster', submitted: 5, approved: 5, detachedSub: 2, attachedSub: 3, detachedApp: 2, attachedApp: 3 },
  { name: 'Winchester', submitted: 5, approved: 2, detachedSub: 3, attachedSub: 2, detachedApp: 1, attachedApp: 1 },
  { name: 'Milton', submitted: 4, approved: 4, detachedSub: 3, attachedSub: 1, detachedApp: 3, attachedApp: 1, hasPage: true },
  { name: 'Newton', submitted: 4, approved: 3, detachedSub: 2, attachedSub: 2, detachedApp: 2, attachedApp: 1, hasPage: true },
  { name: 'Needham', submitted: 3, approved: 3, detachedSub: 2, attachedSub: 1, detachedApp: 2, attachedApp: 1, hasPage: true },
  { name: 'Duxbury', submitted: 3, approved: 2, detachedSub: 3, attachedSub: 0, detachedApp: 2, attachedApp: 0, hasPage: true },
  { name: 'Sudbury', submitted: 3, approved: 3, detachedSub: 2, attachedSub: 1, detachedApp: 2, attachedApp: 1, hasPage: true },
]

type SortKey = 'name' | 'submitted' | 'approved' | 'rate'

export default function StatewideData() {
  const [sortKey, setSortKey] = useState<SortKey>('submitted')
  const [sortAsc, setSortAsc] = useState(false)
  const [search, setSearch] = useState('')

  const totalSubmitted = data.reduce((sum, t) => sum + t.submitted, 0)
  const totalApproved = data.reduce((sum, t) => sum + t.approved, 0)
  const totalDetachedSub = data.reduce((sum, t) => sum + t.detachedSub, 0)
  const totalAttachedSub = data.reduce((sum, t) => sum + t.attachedSub, 0)

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

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <Link href="/" className="text-blue-400 text-sm mb-2 inline-block">← Back</Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Massachusetts ADU Permits</h1>
        <p className="text-text-secondary text-sm mb-6">Official EOHLC survey data - 2025</p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-800/50 border border-border rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-white">{totalSubmitted.toLocaleString()}</div>
            <div className="text-text-muted text-sm">Submitted</div>
          </div>
          <div className="bg-gray-800/50 border border-border rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-emerald-400">{totalApproved.toLocaleString()}</div>
            <div className="text-text-muted text-sm">Approved</div>
          </div>
          <div className="bg-gray-800/50 border border-border rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-blue-400">{totalDetachedSub.toLocaleString()}</div>
            <div className="text-text-muted text-sm">Detached</div>
          </div>
          <div className="bg-gray-800/50 border border-border rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-purple-400">{totalAttachedSub.toLocaleString()}</div>
            <div className="text-text-muted text-sm">Attached</div>
          </div>
        </div>

        {/* Key Insights */}
        <div className="bg-gray-800/50 border border-border rounded-lg p-4 sm:p-6 mb-6">
          <h2 className="text-white font-medium mb-4">Key Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-700/30 rounded-lg p-4">
              <h3 className="text-emerald-400 text-sm font-medium mb-2">100% Approval</h3>
              <p className="text-text-secondary text-sm">Fairhaven, Raynham, Pepperell, Harwich, Westport, Beverly, Salem, Hamilton, Scituate, Swansea</p>
            </div>
            <div className="bg-gray-700/30 rounded-lg p-4">
              <h3 className="text-red-400 text-sm font-medium mb-2">Low Approval</h3>
              <p className="text-text-secondary text-sm">Gardner (0%), Barnstable (19%), Danvers (22%), Everett (29%), Wayland (29%)</p>
            </div>
            <div className="bg-gray-700/30 rounded-lg p-4">
              <h3 className="text-blue-400 text-sm font-medium mb-2">Highest Volume</h3>
              <p className="text-text-secondary text-sm">Boston (69), Plymouth (42), Somerville (40), Worcester (31), Barnstable (31)</p>
            </div>
          </div>
          <div className="mt-4 bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
            <h3 className="text-amber-400 text-sm font-medium mb-2">Revere: 100% Attached</h3>
            <p className="text-text-secondary text-sm">17 applications, all basement/attached conversions. Zero detached builds - consistent with our permit-level data showing 90%+ basement conversions.</p>
          </div>
        </div>

        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search towns..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-64 px-4 py-2 bg-gray-800 border border-border rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Table */}
        <div className="bg-gray-800/50 border border-border rounded-lg p-4 sm:p-6">
          <h2 className="text-white font-medium mb-4">All Towns ({sorted.length})</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-text-secondary border-b border-border">
                  <th 
                    className="text-left p-2 cursor-pointer hover:text-white"
                    onClick={() => handleSort('name')}
                  >
                    Town {sortKey === 'name' && (sortAsc ? '↑' : '↓')}
                  </th>
                  <th 
                    className="text-right p-2 cursor-pointer hover:text-white"
                    onClick={() => handleSort('submitted')}
                  >
                    Submitted {sortKey === 'submitted' && (sortAsc ? '↑' : '↓')}
                  </th>
                  <th 
                    className="text-right p-2 cursor-pointer hover:text-white"
                    onClick={() => handleSort('approved')}
                  >
                    Approved {sortKey === 'approved' && (sortAsc ? '↑' : '↓')}
                  </th>
                  <th 
                    className="text-right p-2 cursor-pointer hover:text-white"
                    onClick={() => handleSort('rate')}
                  >
                    Rate {sortKey === 'rate' && (sortAsc ? '↑' : '↓')}
                  </th>
                  <th className="text-right p-2 hidden sm:table-cell">Detached</th>
                  <th className="text-right p-2 hidden sm:table-cell">Attached</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((town) => (
                  <tr key={town.name} className="border-b border-border/50 hover:bg-gray-700/20">
                    <td className="p-2">
                      {town.hasPage ? (
                        <Link href={`/${town.name.toLowerCase().replace(' ', '-')}`} className="text-blue-400 hover:underline">
                          {town.name}
                        </Link>
                      ) : (
                        <span className="text-white">{town.name}</span>
                      )}
                    </td>
                    <td className="text-right p-2 text-white">{town.submitted}</td>
                    <td className="text-right p-2 text-white">{town.approved}</td>
                    <td className={`text-right p-2 font-medium ${getRateColor(town.approved, town.submitted)}`}>
                      {getRate(town.approved, town.submitted)}
                    </td>
                    <td className="text-right p-2 text-text-secondary hidden sm:table-cell">{town.detachedSub}</td>
                    <td className="text-right p-2 text-text-secondary hidden sm:table-cell">{town.attachedSub}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Source */}
        <div className="mt-6 text-text-muted text-xs">
          Source: Massachusetts Executive Office of Housing and Livable Communities (EOHLC) ADU Survey 2025
        </div>
      </div>
    </div>
  )
}
