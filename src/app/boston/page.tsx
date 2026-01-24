'use client'

import { useEffect, useState, useMemo } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend
} from 'recharts'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface Permit {
  id: string
  address: string
  permit_number: string
  filing_date: string
  issued_date: string | null
  days_to_issuance: number | null
  days_at_zba: number | null
  permit_type: string
  work_type: string
  neighborhood: string
  by_right: boolean
  status: string
  zip_code: string
}

interface Stats {
  total: number
  approved: number
  pending: number
  abandoned: number
  avgDays: number
  medianDays: number
  byRightPct: number
}

interface NeighborhoodData {
  neighborhood: string
  count: number
  approved: number
  approvalRate: number
  avgDays: number
  abandonedRate: number
}

const COLORS = {
  approved: '#10b981',
  pending: '#f59e0b', 
  abandoned: '#ef4444',
  byRight: '#8b5cf6',
  relief: '#6366f1'
}

// ADU Policy effective date
const ADU_POLICY_DATE = '2025-02-02'

export default function BostonPage() {
  const [allPermits, setAllPermits] = useState<Permit[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'approved' | 'pending' | 'abandoned'>('all')
  const [neighborhoodFilter, setNeighborhoodFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState<'insights' | 'permits'>('insights')

  // Filter permits to only those after ADU policy date
  const permits = useMemo(() => {
    return allPermits.filter(p => p.filing_date >= ADU_POLICY_DATE)
  }, [allPermits])

  // Calculate stats
  const stats = useMemo<Stats | null>(() => {
    if (permits.length === 0) return null
    
    const approved = permits.filter(p => p.status === 'approved')
    const pending = permits.filter(p => p.status === 'pending')
    const abandoned = permits.filter(p => p.status === 'abandoned')
    const byRight = permits.filter(p => p.by_right)
    
    const daysArray = approved
      .filter(p => p.days_to_issuance !== null)
      .map(p => p.days_to_issuance as number)
      .sort((a, b) => a - b)
    
    const avgDays = daysArray.length > 0 
      ? Math.round(daysArray.reduce((a, b) => a + b, 0) / daysArray.length)
      : 0
    
    const medianDays = daysArray.length > 0
      ? daysArray[Math.floor(daysArray.length / 2)]
      : 0

    return {
      total: permits.length,
      approved: approved.length,
      pending: pending.length,
      abandoned: abandoned.length,
      avgDays,
      medianDays,
      byRightPct: Math.round((byRight.length / permits.length) * 100)
    }
  }, [permits])

  // Calculate neighborhood data
  const neighborhoods = useMemo<NeighborhoodData[]>(() => {
    const neighborhoodMap = new Map<string, { 
      count: number
      approved: number
      abandoned: number
      totalDays: number
      daysCount: number
    }>()
    
    permits.forEach(p => {
      const n = p.neighborhood || 'Unknown'
      const current = neighborhoodMap.get(n) || { 
        count: 0, approved: 0, abandoned: 0, totalDays: 0, daysCount: 0 
      }
      current.count++
      if (p.status === 'approved') {
        current.approved++
        if (p.days_to_issuance) {
          current.totalDays += p.days_to_issuance
          current.daysCount++
        }
      }
      if (p.status === 'abandoned') current.abandoned++
      neighborhoodMap.set(n, current)
    })

    return Array.from(neighborhoodMap.entries())
      .map(([neighborhood, data]) => ({ 
        neighborhood, 
        count: data.count,
        approved: data.approved,
        approvalRate: data.count > 0 ? Math.round((data.approved / data.count) * 100) : 0,
        avgDays: data.daysCount > 0 ? Math.round(data.totalDays / data.daysCount) : 0,
        abandonedRate: data.count > 0 ? Math.round((data.abandoned / data.count) * 100) : 0
      }))
      .sort((a, b) => b.count - a.count)
  }, [permits])

  // Timeline distribution data
  const timelineData = useMemo(() => {
    const approved = permits.filter(p => p.status === 'approved' && p.days_to_issuance !== null)
    const buckets = [
      { name: '0-30', min: 0, max: 30, count: 0 },
      { name: '31-90', min: 31, max: 90, count: 0 },
      { name: '91-180', min: 91, max: 180, count: 0 },
      { name: '181-365', min: 181, max: 365, count: 0 },
      { name: '365+', min: 366, max: Infinity, count: 0 },
    ]
    
    approved.forEach(p => {
      const days = p.days_to_issuance!
      const bucket = buckets.find(b => days >= b.min && days <= b.max)
      if (bucket) bucket.count++
    })
    
    return buckets.map(b => ({ name: b.name + ' days', count: b.count }))
  }, [permits])

  // Monthly trend data
  const trendData = useMemo(() => {
    const monthMap = new Map<string, number>()
    
    permits.forEach(p => {
      const month = p.filing_date.substring(0, 7) // YYYY-MM
      monthMap.set(month, (monthMap.get(month) || 0) + 1)
    })
    
    return Array.from(monthMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([month, count]) => ({
        month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        applications: count
      }))
  }, [permits])

  // Status distribution for pie chart
  const statusData = useMemo(() => {
    if (!stats) return []
    return [
      { name: 'Approved', value: stats.approved, color: COLORS.approved },
      { name: 'Pending', value: stats.pending, color: COLORS.pending },
      { name: 'Abandoned', value: stats.abandoned, color: COLORS.abandoned },
    ]
  }, [stats])

  // By-right vs relief data
  const zoningData = useMemo(() => {
    const byRight = permits.filter(p => p.by_right).length
    const relief = permits.length - byRight
    return [
      { name: 'By-Right', value: byRight, color: COLORS.byRight },
      { name: 'Needed Relief', value: relief, color: COLORS.relief },
    ]
  }, [permits])

  // Top neighborhoods chart data
  const topNeighborhoodsData = useMemo(() => {
    return neighborhoods.slice(0, 10).map(n => ({
      name: n.neighborhood.length > 12 ? n.neighborhood.substring(0, 12) + '...' : n.neighborhood,
      fullName: n.neighborhood,
      applications: n.count,
      approved: n.approved,
      avgDays: n.avgDays
    }))
  }, [neighborhoods])

  useEffect(() => {
    async function fetchData() {
      const { data: permitData, error } = await supabase
        .from('permits')
        .select('*')
        .order('filing_date', { ascending: false })

      if (error) {
        console.error('Error fetching permits:', error)
        return
      }

      setAllPermits(permitData || [])
      setLoading(false)
    }

    fetchData()
  }, [])

  // Filter permits for table
  const filteredPermits = permits.filter(p => {
    if (filter !== 'all' && p.status !== filter) return false
    if (neighborhoodFilter !== 'all' && p.neighborhood !== neighborhoodFilter) return false
    if (searchTerm && !p.address.toLowerCase().includes(searchTerm.toLowerCase())) return false
    return true
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-900/50 text-green-300 border border-green-700'
      case 'pending': return 'bg-yellow-900/50 text-yellow-300 border border-yellow-700'
      case 'abandoned': return 'bg-red-900/50 text-red-300 border border-red-700'
      default: return 'bg-gray-700 text-gray-300'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-xl text-gray-300">Loading Boston ADU data...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-blue-400 hover:text-blue-300">
            ← Back to ADU Pulse
          </Link>
          <div className="text-center">
            <h1 className="text-xl font-bold text-white">Boston ADU Permits</h1>
            <p className="text-xs text-gray-400">Since Feb 2, 2025 (Statewide ADU Policy)</p>
          </div>
          <div className="w-32"></div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        {stats && (
          <div className="flex gap-2 md:gap-4 mb-8">
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
              <div className="text-xl md:text-3xl font-bold text-white">{stats.total}</div>
              <div className="text-sm text-gray-400">Applications</div>
            </div>
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
              <div className="text-xl md:text-3xl font-bold text-green-400">{stats.approved}</div>
              <div className="text-sm text-gray-400">Approved</div>
            </div>
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
              <div className="text-xl md:text-3xl font-bold text-yellow-400">{stats.pending}</div>
              <div className="text-sm text-gray-400">Pending</div>
            </div>
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
              <div className="text-xl md:text-3xl font-bold text-red-400">{stats.abandoned}</div>
              <div className="text-sm text-gray-400">Abandoned</div>
            </div>
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
              <div className="text-xl md:text-3xl font-bold text-blue-400">{stats.medianDays}</div>
              <div className="text-sm text-gray-400">Median Days</div>
            </div>
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
              <div className="text-xl md:text-3xl font-bold text-purple-400">{stats.byRightPct}%</div>
              <div className="text-sm text-gray-400">By-Right</div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('insights')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              activeTab === 'insights'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            📊 Insights & Charts
          </button>
          <button
            onClick={() => setActiveTab('permits')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              activeTab === 'permits'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            📋 Permit Data
          </button>
        </div>

        {activeTab === 'insights' && (
          <div className="space-y-8">
            {/* Row 1: Timeline + Status */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Timeline Distribution */}
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                <h3 className="text-lg font-semibold mb-2">⏱️ Time to Approval</h3>
                <p className="text-sm text-gray-400 mb-4">How long approved permits took</p>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={timelineData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                    <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                      labelStyle={{ color: '#f3f4f6' }}
                    />
                    <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-4 p-3 bg-blue-900/30 rounded-lg border border-blue-800">
                  <p className="text-sm text-blue-200">
                    <strong>💡 Client insight:</strong> Set expectations for 3-6 month approval timeline. 
                    Median is {stats?.medianDays} days.
                  </p>
                </div>
              </div>

              {/* Status + Zoning Pie Charts */}
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">📈 Status</h3>
                    <ResponsiveContainer width="100%" height={180}>
                      <PieChart>
                        <Pie
                          data={statusData}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={70}
                          dataKey="value"
                          label={({ name, percent }) => `${((percent ?? 0) * 100).toFixed(0)}%`}
                          labelLine={false}
                        >
                          {statusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex justify-center gap-4 text-xs">
                      <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-green-500"></span> Approved</span>
                      <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-yellow-500"></span> Pending</span>
                      <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-500"></span> Abandoned</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">⚖️ Zoning</h3>
                    <ResponsiveContainer width="100%" height={180}>
                      <PieChart>
                        <Pie
                          data={zoningData}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={70}
                          dataKey="value"
                          label={({ name, percent }) => `${((percent ?? 0) * 100).toFixed(0)}%`}
                          labelLine={false}
                        >
                          {zoningData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex justify-center gap-4 text-xs">
                      <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-purple-500"></span> By-Right</span>
                      <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-indigo-500"></span> Needed Relief</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-purple-900/30 rounded-lg border border-purple-800">
                  <p className="text-sm text-purple-200">
                    <strong>💡 Sales angle:</strong> {100 - (stats?.byRightPct || 0)}% of Boston ADUs need zoning relief — 
                    that's where consultants add the most value.
                  </p>
                </div>
              </div>
            </div>

            {/* Row 2: Monthly Trend */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <h3 className="text-lg font-semibold mb-2">📅 Application Trend</h3>
              <p className="text-sm text-gray-400 mb-4">Monthly applications since policy effective date</p>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                    labelStyle={{ color: '#f3f4f6' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="applications" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    dot={{ fill: '#10b981', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Row 3: Top Neighborhoods */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <h3 className="text-lg font-semibold mb-2">🏘️ Top Neighborhoods by Activity</h3>
              <p className="text-sm text-gray-400 mb-4">Where ADU applications are concentrated</p>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topNeighborhoodsData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis type="number" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                  <YAxis type="category" dataKey="name" tick={{ fill: '#9ca3af', fontSize: 11 }} width={100} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                    formatter={(value, name, props) => [value, name === 'applications' ? 'Total Apps' : name === 'approved' ? 'Approved' : 'Avg Days']}
                    labelFormatter={(label) => topNeighborhoodsData.find(n => n.name === label)?.fullName || label}
                  />
                  <Legend />
                  <Bar dataKey="applications" fill="#3b82f6" name="Applications" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="approved" fill="#10b981" name="Approved" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 p-3 bg-green-900/30 rounded-lg border border-green-800">
                <p className="text-sm text-green-200">
                  <strong>💡 Market insight:</strong> {neighborhoods[0]?.neighborhood || 'Dorchester'} leads with {neighborhoods[0]?.count || 0} applications. 
                  Focus marketing efforts in high-activity neighborhoods.
                </p>
              </div>
            </div>

            {/* Neighborhood Stats Table */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <h3 className="text-lg font-semibold mb-4">📊 Neighborhood Comparison</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="px-4 py-3 text-left text-gray-400">Neighborhood</th>
                      <th className="px-4 py-3 text-right text-gray-400">Apps</th>
                      <th className="px-4 py-3 text-right text-gray-400">Approved</th>
                      <th className="px-4 py-3 text-right text-gray-400">Approval Rate</th>
                      <th className="px-4 py-3 text-right text-gray-400">Avg Days</th>
                      <th className="px-4 py-3 text-right text-gray-400">Abandoned</th>
                    </tr>
                  </thead>
                  <tbody>
                    {neighborhoods.slice(0, 15).map(n => (
                      <tr key={n.neighborhood} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                        <td className="px-4 py-3 font-medium">{n.neighborhood}</td>
                        <td className="px-4 py-3 text-right">{n.count}</td>
                        <td className="px-4 py-3 text-right text-green-400">{n.approved}</td>
                        <td className="px-4 py-3 text-right">
                          <span className={n.approvalRate >= 50 ? 'text-green-400' : n.approvalRate >= 25 ? 'text-yellow-400' : 'text-red-400'}>
                            {n.approvalRate}%
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right text-blue-400">{n.avgDays || '-'}</td>
                        <td className="px-4 py-3 text-right text-red-400">{n.abandonedRate}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'permits' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Neighborhood Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
                <h2 className="text-lg font-semibold mb-4">Filter by Neighborhood</h2>
                <div className="space-y-1 max-h-96 overflow-y-auto">
                  <button
                    onClick={() => setNeighborhoodFilter('all')}
                    className={`w-full text-left px-3 py-2 rounded text-sm transition ${
                      neighborhoodFilter === 'all' 
                        ? 'bg-blue-600 text-white' 
                        : 'hover:bg-gray-700 text-gray-300'
                    }`}
                  >
                    All ({permits.length})
                  </button>
                  {neighborhoods.map(n => (
                    <button
                      key={n.neighborhood}
                      onClick={() => setNeighborhoodFilter(n.neighborhood)}
                      className={`w-full text-left px-3 py-2 rounded text-sm flex justify-between transition ${
                        neighborhoodFilter === n.neighborhood 
                          ? 'bg-blue-600 text-white' 
                          : 'hover:bg-gray-700 text-gray-300'
                      }`}
                    >
                      <span>{n.neighborhood}</span>
                      <span className="text-gray-400">{n.count}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Permit Table */}
            <div className="lg:col-span-3">
              <div className="bg-gray-800 rounded-lg border border-gray-700">
                {/* Filters */}
                <div className="p-4 border-b border-gray-700 flex flex-wrap gap-4 items-center">
                  <div className="flex gap-2">
                    {(['all', 'approved', 'pending', 'abandoned'] as const).map(status => (
                      <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-3 py-1 rounded text-sm transition ${
                          filter === status 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Search address..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-3 py-1 bg-gray-700 border border-gray-600 rounded text-sm flex-1 max-w-xs text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  />
                  <div className="text-sm text-gray-400">
                    {filteredPermits.length} of {permits.length}
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-700/50">
                      <tr>
                        <th className="px-4 py-3 text-left font-medium text-gray-400">Address</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-400">Neighborhood</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-400">Filed</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-400">Status</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-400">Days</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-400">By-Right</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700/50">
                      {filteredPermits.slice(0, 100).map(permit => (
                        <tr key={permit.id} className="hover:bg-gray-700/30">
                          <td className="px-4 py-3">
                            <div className="font-medium text-white">{permit.address}</div>
                            <div className="text-xs text-gray-500">{permit.permit_number}</div>
                          </td>
                          <td className="px-4 py-3 text-gray-300">{permit.neighborhood}</td>
                          <td className="px-4 py-3 text-gray-300">
                            {permit.filing_date ? new Date(permit.filing_date).toLocaleDateString() : '-'}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(permit.status)}`}>
                              {permit.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-300">
                            {permit.days_to_issuance ?? '-'}
                          </td>
                          <td className="px-4 py-3">
                            {permit.by_right ? (
                              <span className="text-green-400">✓</span>
                            ) : (
                              <span className="text-gray-500">-</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredPermits.length > 100 && (
                  <div className="p-4 text-center text-sm text-gray-400 border-t border-gray-700">
                    Showing first 100 of {filteredPermits.length} permits
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Data Source Footer */}
        <div className="mt-8 p-4 bg-gray-800/50 rounded-lg border border-gray-700 text-center">
          <p className="text-sm text-gray-400">
            Data: <a href="https://data.boston.gov/dataset/zoning-reform-impact-tracker" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Boston Zoning Reform Impact Tracker</a> via Analyze Boston • Updated daily
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Note: Boston operates under its own ADU ordinance, separate from the statewide ADU law.
          </p>
        </div>
      </main>
    </div>
  )
}
