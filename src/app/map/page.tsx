'use client'

import Link from 'next/link'
import { useState, useMemo } from 'react'
import townSEOData from '@/data/town_seo_data'
import { approvalsPerThousandParcels, computeScorecard, generateCSV, downloadCSV } from '@/lib/townAnalytics'

type SortKey = 'approved' | 'approvalRate' | 'submitted' | 'perK' | 'grade' | 'name'
type FilterApproval = 'all' | 'high' | 'medium' | 'low'
type FilterVolume = 'all' | 'high' | 'medium' | 'low'

export default function MapPage() {
  const [search, setSearch] = useState('')
  const [county, setCounty] = useState('all')
  const [approvalFilter, setApprovalFilter] = useState<FilterApproval>('all')
  const [volumeFilter, setVolumeFilter] = useState<FilterVolume>('all')
  const [sortBy, setSortBy] = useState<SortKey>('approved')
  const [sortAsc, setSortAsc] = useState(false)

  const counties = useMemo(() => ['all', ...Array.from(new Set(townSEOData.map(t => t.county))).sort()], [])

  const enriched = useMemo(() => townSEOData.map(t => ({
    ...t,
    perK: approvalsPerThousandParcels(t),
    scorecard: computeScorecard(t),
  })), [])

  const filtered = useMemo(() => {
    let result = enriched

    if (search) {
      const q = search.toLowerCase()
      result = result.filter(t => t.name.toLowerCase().includes(q) || t.county.toLowerCase().includes(q))
    }
    if (county !== 'all') result = result.filter(t => t.county === county)
    if (approvalFilter !== 'all') {
      result = result.filter(t =>
        approvalFilter === 'high' ? t.approvalRate >= 80 :
        approvalFilter === 'medium' ? t.approvalRate >= 40 && t.approvalRate < 80 :
        t.approvalRate < 40
      )
    }
    if (volumeFilter !== 'all') {
      result = result.filter(t =>
        volumeFilter === 'high' ? t.submitted >= 20 :
        volumeFilter === 'medium' ? t.submitted >= 10 && t.submitted < 20 :
        t.submitted < 10
      )
    }

    result.sort((a, b) => {
      let cmp = 0
      switch (sortBy) {
        case 'name': cmp = a.name.localeCompare(b.name); break
        case 'approved': cmp = a.approved - b.approved; break
        case 'approvalRate': cmp = a.approvalRate - b.approvalRate; break
        case 'submitted': cmp = a.submitted - b.submitted; break
        case 'perK': cmp = (a.perK ?? -1) - (b.perK ?? -1); break
        case 'grade': cmp = a.scorecard.overallScore - b.scorecard.overallScore; break
      }
      return sortAsc ? cmp : -cmp
    })

    return result
  }, [enriched, search, county, approvalFilter, volumeFilter, sortBy, sortAsc])

  const handleSort = (key: SortKey) => {
    if (sortBy === key) setSortAsc(!sortAsc)
    else { setSortBy(key); setSortAsc(false) }
  }

  const sortIcon = (key: SortKey) => sortBy === key ? (sortAsc ? ' ↑' : ' ↓') : ''

  const gradeColor = (g: string) => g === 'A' ? 'text-emerald-400' : g === 'B' ? 'text-blue-400' : g === 'C' ? 'text-amber-400' : 'text-red-400'
  const rateColor = (r: number) => r >= 80 ? 'text-emerald-400' : r >= 50 ? 'text-amber-400' : 'text-red-400'

  const totalSubmitted = filtered.reduce((s, t) => s + t.submitted, 0)
  const totalApproved = filtered.reduce((s, t) => s + t.approved, 0)

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-lg md:text-xl font-bold text-white tracking-tight">ADU Pulse</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 md:py-10">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">Massachusetts ADU Explorer</h1>
          <p className="text-gray-400 text-sm">Filter, sort, and compare ADU permit data across {townSEOData.length} towns.</p>
        </div>

        {/* Summary bar */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-gray-800/50 border border-border rounded-xl p-3 text-center">
            <div className="text-white font-bold text-xl">{filtered.length}</div>
            <div className="text-gray-500 text-xs">Towns</div>
          </div>
          <div className="bg-gray-800/50 border border-border rounded-xl p-3 text-center">
            <div className="text-white font-bold text-xl">{totalSubmitted}</div>
            <div className="text-gray-500 text-xs">Total Applications</div>
          </div>
          <div className="bg-gray-800/50 border border-border rounded-xl p-3 text-center">
            <div className="text-emerald-400 font-bold text-xl">{totalApproved}</div>
            <div className="text-gray-500 text-xs">Total Approved</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gray-800/50 border border-border rounded-xl p-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Search */}
            <div>
              <label className="text-gray-500 text-xs block mb-1">Search</label>
              <input type="text" placeholder="Town or county..." value={search} onChange={e => setSearch(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 min-h-[44px]" />
            </div>
            {/* County */}
            <div>
              <label className="text-gray-500 text-xs block mb-1">County</label>
              <select value={county} onChange={e => setCounty(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 min-h-[44px]">
                {counties.map(c => <option key={c} value={c}>{c === 'all' ? 'All Counties' : c}</option>)}
              </select>
            </div>
            {/* Approval rate */}
            <div>
              <label className="text-gray-500 text-xs block mb-1">Approval Rate</label>
              <select value={approvalFilter} onChange={e => setApprovalFilter(e.target.value as FilterApproval)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 min-h-[44px]">
                <option value="all">All Rates</option>
                <option value="high">High (80%+)</option>
                <option value="medium">Medium (40-79%)</option>
                <option value="low">Low (&lt;40%)</option>
              </select>
            </div>
            {/* Volume */}
            <div>
              <label className="text-gray-500 text-xs block mb-1">Permit Volume</label>
              <select value={volumeFilter} onChange={e => setVolumeFilter(e.target.value as FilterVolume)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 min-h-[44px]">
                <option value="all">All Volumes</option>
                <option value="high">High (20+)</option>
                <option value="medium">Medium (10-19)</option>
                <option value="low">Low (&lt;10)</option>
              </select>
            </div>
            {/* Sort */}
            <div>
              <label className="text-gray-500 text-xs block mb-1">Sort By</label>
              <select value={sortBy} onChange={e => { setSortBy(e.target.value as SortKey); setSortAsc(false) }}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 min-h-[44px]">
                <option value="approved">Most Approved</option>
                <option value="submitted">Most Submitted</option>
                <option value="approvalRate">Approval Rate</option>
                <option value="perK">Per 1K Parcels</option>
                <option value="grade">Town Grade</option>
                <option value="name">Name</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results - Mobile cards */}
        <div className="sm:hidden space-y-3">
          {filtered.map(t => (
            <Link key={t.slug} href={`/towns/${t.slug}`} className="block bg-gray-800/50 border border-border rounded-xl p-4 hover:bg-gray-700/50 active:bg-gray-700 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="text-white font-bold">{t.name}</div>
                  <div className="text-gray-500 text-xs">{t.county} County</div>
                </div>
                <span className={`text-xl font-bold ${gradeColor(t.scorecard.overall)}`}>{t.scorecard.overall}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-white font-bold">{t.submitted}</div>
                  <div className="text-gray-600 text-[10px]">Submitted</div>
                </div>
                <div>
                  <div className={`font-bold ${rateColor(t.approvalRate)}`}>{t.approvalRate}%</div>
                  <div className="text-gray-600 text-[10px]">Rate</div>
                </div>
                <div>
                  <div className="text-blue-400 font-bold">{t.perK ?? '—'}</div>
                  <div className="text-gray-600 text-[10px]">Per 1K</div>
                </div>
              </div>
              {t.hasPermitData && <div className="text-[10px] text-blue-400 mt-2">📋 Detailed permit data available</div>}
            </Link>
          ))}
        </div>

        {/* Results - Desktop table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 text-xs border-b border-gray-700">
                <th className="text-left py-3 pr-3 cursor-pointer hover:text-white" onClick={() => handleSort('name')}>Town{sortIcon('name')}</th>
                <th className="text-left py-3 pr-3">County</th>
                <th className="text-right py-3 pr-3 cursor-pointer hover:text-white" onClick={() => handleSort('submitted')}>Submitted{sortIcon('submitted')}</th>
                <th className="text-right py-3 pr-3 cursor-pointer hover:text-white" onClick={() => handleSort('approved')}>Approved{sortIcon('approved')}</th>
                <th className="text-right py-3 pr-3 cursor-pointer hover:text-white" onClick={() => handleSort('approvalRate')}>Rate{sortIcon('approvalRate')}</th>
                <th className="text-right py-3 pr-3 cursor-pointer hover:text-white" onClick={() => handleSort('perK')}>Per 1K{sortIcon('perK')}</th>
                <th className="text-center py-3 pr-3 cursor-pointer hover:text-white" onClick={() => handleSort('grade')}>Grade{sortIcon('grade')}</th>
                <th className="text-right py-3">Data</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(t => (
                <tr key={t.slug} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                  <td className="py-2.5 pr-3">
                    <Link href={`/towns/${t.slug}`} className="text-blue-400 hover:underline font-medium">{t.name}</Link>
                  </td>
                  <td className="py-2.5 pr-3 text-gray-400 text-xs">{t.county}</td>
                  <td className="py-2.5 pr-3 text-right text-white">{t.submitted}</td>
                  <td className="py-2.5 pr-3 text-right text-emerald-400">{t.approved}</td>
                  <td className="py-2.5 pr-3 text-right">
                    <span className={rateColor(t.approvalRate)}>{t.approvalRate}%</span>
                  </td>
                  <td className="py-2.5 pr-3 text-right text-blue-400">{t.perK ?? '—'}</td>
                  <td className="py-2.5 pr-3 text-center">
                    <span className={`font-bold ${gradeColor(t.scorecard.overall)}`}>{t.scorecard.overall}</span>
                  </td>
                  <td className="py-2.5 text-right">
                    {t.hasPermitData && <span className="text-[10px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded-full">Permits</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg mb-2">No towns match your filters</p>
            <button onClick={() => { setSearch(''); setCounty('all'); setApprovalFilter('all'); setVolumeFilter('all') }}
              className="text-blue-400 text-sm hover:underline">Clear all filters</button>
          </div>
        )}

        {/* Export */}
        <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-800">
          <p className="text-gray-500 text-xs">Showing {filtered.length} of {townSEOData.length} towns</p>
          <button onClick={() => {
            const csv = generateCSV(filtered.map(t => ({ ...t })))
            downloadCSV('adupulse-town-data.csv', csv)
          }} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm rounded-lg transition-colors min-h-[44px]">
            📊 Export Filtered CSV
          </button>
        </div>
      </main>

      <footer className="border-t border-gray-800 mt-12">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 text-xs text-gray-500">
            <div>&copy; 2026 ADU Pulse</div>
            <div className="flex gap-4">
              <Link href="/" className="hover:text-white min-h-[44px] flex items-center">Home</Link>
              <Link href="/estimate" className="hover:text-white min-h-[44px] flex items-center">Estimator</Link>
              <Link href="/blog" className="hover:text-white min-h-[44px] flex items-center">Blog</Link>
              <Link href="/methodology" className="hover:text-white min-h-[44px] flex items-center">Methodology</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
