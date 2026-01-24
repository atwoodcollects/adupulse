'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

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
  byRightPct: number
}

interface NeighborhoodCount {
  neighborhood: string
  count: number
  approved: number
}

export default function BostonPage() {
  const [permits, setPermits] = useState<Permit[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [neighborhoods, setNeighborhoods] = useState<NeighborhoodCount[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'approved' | 'pending' | 'abandoned'>('all')
  const [neighborhoodFilter, setNeighborhoodFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

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

      setPermits(permitData || [])

      if (permitData) {
        const approved = permitData.filter(p => p.status === 'approved')
        const pending = permitData.filter(p => p.status === 'pending')
        const abandoned = permitData.filter(p => p.status === 'abandoned')
        const byRight = permitData.filter(p => p.by_right)
        
        const daysArray = approved
          .filter(p => p.days_to_issuance !== null)
          .map(p => p.days_to_issuance as number)
        
        const avgDays = daysArray.length > 0 
          ? Math.round(daysArray.reduce((a, b) => a + b, 0) / daysArray.length)
          : 0

        setStats({
          total: permitData.length,
          approved: approved.length,
          pending: pending.length,
          abandoned: abandoned.length,
          avgDays,
          byRightPct: Math.round((byRight.length / permitData.length) * 100)
        })

        const neighborhoodMap = new Map<string, { count: number; approved: number }>()
        permitData.forEach(p => {
          const n = p.neighborhood || 'Unknown'
          const current = neighborhoodMap.get(n) || { count: 0, approved: 0 }
          current.count++
          if (p.status === 'approved') current.approved++
          neighborhoodMap.set(n, current)
        })

        const neighborhoodArray = Array.from(neighborhoodMap.entries())
          .map(([neighborhood, data]) => ({ neighborhood, ...data }))
          .sort((a, b) => b.count - a.count)

        setNeighborhoods(neighborhoodArray)
      }

      setLoading(false)
    }

    fetchData()
  }, [])

  const filteredPermits = permits.filter(p => {
    if (filter !== 'all' && p.status !== filter) return false
    if (neighborhoodFilter !== 'all' && p.neighborhood !== neighborhoodFilter) return false
    if (searchTerm && !p.address.toLowerCase().includes(searchTerm.toLowerCase())) return false
    return true
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'abandoned': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading Boston ADU data...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            ← Back to ADU Pulse
          </Link>
          <h1 className="text-xl font-bold text-gray-900">Boston ADU Permits</h1>
          <div className="w-24"></div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-3xl font-bold text-gray-900">{stats.total.toLocaleString()}</div>
              <div className="text-sm text-gray-500">Total Applications</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-3xl font-bold text-green-600">{stats.approved}</div>
              <div className="text-sm text-gray-500">Approved</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
              <div className="text-sm text-gray-500">Pending</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-3xl font-bold text-red-600">{stats.abandoned}</div>
              <div className="text-sm text-gray-500">Abandoned</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-3xl font-bold text-blue-600">{stats.avgDays}</div>
              <div className="text-sm text-gray-500">Avg Days to Approval</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-3xl font-bold text-purple-600">{stats.byRightPct}%</div>
              <div className="text-sm text-gray-500">By-Right</div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold mb-4">By Neighborhood</h2>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                <button
                  onClick={() => setNeighborhoodFilter('all')}
                  className={`w-full text-left px-3 py-2 rounded text-sm ${
                    neighborhoodFilter === 'all' ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'
                  }`}
                >
                  All Neighborhoods ({permits.length})
                </button>
                {neighborhoods.map(n => (
                  <button
                    key={n.neighborhood}
                    onClick={() => setNeighborhoodFilter(n.neighborhood)}
                    className={`w-full text-left px-3 py-2 rounded text-sm flex justify-between ${
                      neighborhoodFilter === n.neighborhood ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'
                    }`}
                  >
                    <span>{n.neighborhood}</span>
                    <span className="text-gray-500">{n.count}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 mt-4 text-sm">
              <div className="font-semibold text-blue-900 mb-1">Data Source</div>
              <div className="text-blue-800">
                Boston Zoning Reform Impact Tracker via{' '}
                <a 
                  href="https://data.boston.gov/dataset/zoning-reform-impact-tracker" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="underline"
                >
                  Analyze Boston
                </a>
              </div>
              <div className="text-blue-700 mt-1">Updated daily • Jan 2018 - Present</div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b flex flex-wrap gap-4 items-center">
                <div className="flex gap-2">
                  {(['all', 'approved', 'pending', 'abandoned'] as const).map(status => (
                    <button
                      key={status}
                      onClick={() => setFilter(status)}
                      className={`px-3 py-1 rounded text-sm ${
                        filter === status 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
                  className="px-3 py-1 border rounded text-sm flex-1 max-w-xs"
                />
                <div className="text-sm text-gray-500">
                  Showing {filteredPermits.length} of {permits.length}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-gray-500">Address</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-500">Neighborhood</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-500">Filed</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-500">Status</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-500">Days</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-500">By-Right</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredPermits.slice(0, 100).map(permit => (
                      <tr key={permit.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-900">{permit.address}</div>
                          <div className="text-xs text-gray-500">{permit.permit_number}</div>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{permit.neighborhood}</td>
                        <td className="px-4 py-3 text-gray-600">
                          {permit.filing_date ? new Date(permit.filing_date).toLocaleDateString() : '-'}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(permit.status)}`}>
                            {permit.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {permit.days_to_issuance ?? '-'}
                        </td>
                        <td className="px-4 py-3">
                          {permit.by_right ? (
                            <span className="text-green-600">✓</span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredPermits.length > 100 && (
                <div className="p-4 text-center text-sm text-gray-500 border-t">
                  Showing first 100 of {filteredPermits.length} permits
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Key Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
            <div>
              <div className="font-medium text-gray-900 mb-1">Timeline</div>
              <div className="text-gray-600">
                Average approval takes <strong>277 days</strong>. Fastest was same-day, 
                longest was 4.6 years.
              </div>
            </div>
            <div>
              <div className="font-medium text-gray-900 mb-1">Zoning Relief</div>
              <div className="text-gray-600">
                <strong>69%</strong> of ADU applications required zoning relief. 
                Only 31% were approved by-right.
              </div>
            </div>
            <div>
              <div className="font-medium text-gray-900 mb-1">Abandonment</div>
              <div className="text-gray-600">
                <strong>26%</strong> of applications were abandoned before approval, 
                suggesting cost or complexity barriers.
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-500 text-center">
          Note: Boston operates under its own ADU ordinance, separate from the statewide ADU law.
        </div>
      </main>
    </div>
  )
}
