'use client'

import { useState } from 'react'
import Link from 'next/link'
import TownNav from '@/components/TownNav'
import permits from '@/data/newton_permits.json'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, ScatterChart, Scatter, ZAxis } from 'recharts'

export default function NewtonPage() {
  const [sortField, setSortField] = useState<'applied' | 'issued' | 'address' | 'cost' | 'sqft' | 'ppsf'>('issued')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [activeTab, setActiveTab] = useState<'permits' | 'insights'>('insights')
  const [typeFilter, setTypeFilter] = useState<'all' | 'Internal' | 'Detached'>('all')

  // Add $/sqft to permits
  const permitsWithPPSF = permits.map(p => ({
    ...p,
    ppsf: Math.round(p.cost / p.sqft)
  }))

  // Filter by type
  const filteredPermits = typeFilter === 'all' 
    ? permitsWithPPSF 
    : permitsWithPPSF.filter(p => p.type === typeFilter)

  // Basic stats
  const stats = {
    total: permits.length,
    approved: permits.filter(p => p.status.includes('Issued')).length,
    coIssued: permits.filter(p => p.status === 'CO Issued').length,
    pending: permits.filter(p => p.status === 'Pending').length
  }

  // Cost stats
  const totalCost = permits.reduce((sum, p) => sum + (p.cost || 0), 0)
  const avgCost = Math.round(totalCost / permits.length)
  const avgPPSF = Math.round(totalCost / permits.reduce((sum, p) => sum + p.sqft, 0))

  // Type breakdown for pie chart
  const typeData = [
    { name: 'Internal', value: permits.filter(p => p.type === 'Internal').length, color: '#10b981' },
    { name: 'Detached', value: permits.filter(p => p.type === 'Detached').length, color: '#6366f1' },
  ]

  // Cost distribution for bar chart
  const costBuckets = [
    { range: '<$100K', count: permits.filter(p => p.cost < 100000).length },
    { range: '$100-250K', count: permits.filter(p => p.cost >= 100000 && p.cost < 250000).length },
    { range: '$250-500K', count: permits.filter(p => p.cost >= 250000 && p.cost < 500000).length },
    { range: '$500K+', count: permits.filter(p => p.cost >= 500000).length },
  ]

  // Avg cost by type
  const internalPermits = permits.filter(p => p.type === 'Internal')
  const detachedPermits = permits.filter(p => p.type === 'Detached')
  const avgByType = [
    { type: 'Internal', avg: Math.round(internalPermits.reduce((s, p) => s + p.cost, 0) / internalPermits.length / 1000) },
    { type: 'Detached', avg: Math.round(detachedPermits.reduce((s, p) => s + p.cost, 0) / detachedPermits.length / 1000) },
  ]

  // Scatter data for cost vs sqft
  const scatterData = permitsWithPPSF.map(p => ({
    sqft: p.sqft,
    cost: p.cost / 1000,
    ppsf: p.ppsf,
    address: p.address,
    type: p.type
  }))

  const parseDate = (d: string) => {
    if (!d) return new Date(0)
    const [m, day, y] = d.split('/')
    return new Date(2000 + parseInt(y), parseInt(m) - 1, parseInt(day))
  }

  const sortedPermits = [...filteredPermits].sort((a, b) => {
    if (sortField === 'address') {
      return sortDir === 'asc' ? a.address.localeCompare(b.address) : b.address.localeCompare(a.address)
    }
    if (sortField === 'cost' || sortField === 'sqft' || sortField === 'ppsf') {
      return sortDir === 'asc' ? a[sortField] - b[sortField] : b[sortField] - a[sortField]
    }
    const dateA = parseDate(a[sortField])
    const dateB = parseDate(b[sortField])
    return sortDir === 'asc' ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime()
  })

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDir('desc')
    }
  }

  const formatCost = (cost: number) => {
    if (cost >= 1000000) return `$${(cost / 1000000).toFixed(1)}M`
    if (cost >= 1000) return `$${Math.round(cost / 1000)}K`
    return `$${cost}`
  }

  // Find outliers
  const maxCost = Math.max(...permits.map(p => p.cost))
  const minCost = Math.min(...permits.map(p => p.cost))

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 md:py-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <Link href="/" className="text-blue-400 text-sm mb-2 inline-block">← Back to Dashboard</Link>
            <h1 className="text-2xl md:text-3xl font-bold text-white">Newton ADU Permits</h1>
            <p className="text-text-secondary text-sm">Newton · Data via City of Newton FOIA</p>
          </div>
          <TownNav current="Newton" />
        </div>

        {/* Stats Row */}
        <div className="flex justify-center gap-1 md:gap-4 mb-6">
          <div className="flex-1 min-w-0 bg-gray-800/50 border border-border rounded-lg p-3 md:p-4 text-center">
            <div className="text-lg md:text-2xl font-bold text-emerald-400">{stats.approved}</div>
            <div className="text-xs text-text-muted">Approved</div>
          </div>
          <div className="flex-1 min-w-0 bg-gray-800/50 border border-border rounded-lg p-3 md:p-4 text-center">
            <div className="text-lg md:text-2xl font-bold text-blue-400">{formatCost(avgCost)}</div>
            <div className="text-xs text-text-muted">Avg Cost</div>
          </div>
          <div className="flex-1 min-w-0 bg-gray-800/50 border border-border rounded-lg p-3 md:p-4 text-center">
            <div className="text-lg md:text-2xl font-bold text-purple-400">${avgPPSF}/sf</div>
            <div className="text-xs text-text-muted">Avg $/Sqft</div>
          </div>
          <div className="flex-1 min-w-0 bg-gray-800/50 border border-border rounded-lg p-3 md:p-4 text-center">
            <div className="text-lg md:text-2xl font-bold text-yellow-400">{formatCost(totalCost)}</div>
            <div className="text-xs text-text-muted">Invested</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-4 border-b border-border">
          <button
            onClick={() => setActiveTab('insights')}
            className={`pb-2 px-1 text-sm font-medium ${activeTab === 'insights' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-text-secondary hover:text-white'}`}
          >
            Insights
          </button>
          <button
            onClick={() => setActiveTab('permits')}
            className={`pb-2 px-1 text-sm font-medium ${activeTab === 'permits' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-text-secondary hover:text-white'}`}
          >
            Permits
          </button>
        </div>

        {/* Insights Tab */}
        {activeTab === 'insights' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Cost vs Sqft Scatter */}
            <div className="bg-gray-800/50 border border-border rounded-lg p-4 md:col-span-2">
              <h3 className="text-white font-medium mb-4">Cost vs Square Footage</h3>
              <ResponsiveContainer width="100%" height={250}>
                <ScatterChart margin={{ top: 10, right: 30, bottom: 10, left: 10 }}>
                  <XAxis 
                    dataKey="sqft" 
                    name="Sqft" 
                    tick={{ fill: '#9ca3af', fontSize: 12 }} 
                    label={{ value: 'Square Feet', position: 'bottom', fill: '#9ca3af', fontSize: 12 }}
                  />
                  <YAxis 
                    dataKey="cost" 
                    name="Cost" 
                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                    label={{ value: 'Cost ($K)', angle: -90, position: 'insideLeft', fill: '#9ca3af', fontSize: 12 }}
                  />
                  <ZAxis dataKey="ppsf" range={[60, 400]} name="$/sqft" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                    formatter={(value, name) => {
                      if (name === 'Cost') return [`$${value}K`, name]
                      if (name === '$/sqft') return [`$${value}`, name]
                      return [value, name]
                    }}
                    labelFormatter={(label) => `${label} sqft`}
                  />
                  <Scatter 
                    data={scatterData.filter(d => d.type === 'Internal')} 
                    fill="#10b981" 
                    name="Internal"
                  />
                  <Scatter 
                    data={scatterData.filter(d => d.type === 'Detached')} 
                    fill="#6366f1" 
                    name="Detached"
                  />
                </ScatterChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-6 mt-2 text-xs">
                <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-emerald-500"></span> Internal</span>
                <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-indigo-500"></span> Detached</span>
              </div>
            </div>

            {/* Cost Distribution */}
            <div className="bg-gray-800/50 border border-border rounded-lg p-4">
              <h3 className="text-white font-medium mb-4">Cost Distribution</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={costBuckets}>
                  <XAxis dataKey="range" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Type Breakdown */}
            <div className="bg-gray-800/50 border border-border rounded-lg p-4">
              <h3 className="text-white font-medium mb-4">ADU Types</h3>
              <div className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={typeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {typeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Avg Cost by Type */}
            <div className="bg-gray-800/50 border border-border rounded-lg p-4">
              <h3 className="text-white font-medium mb-4">Avg Cost by Type ($K)</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={avgByType} layout="vertical">
                  <XAxis type="number" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                  <YAxis type="category" dataKey="type" tick={{ fill: '#9ca3af', fontSize: 12 }} width={80} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                    formatter={(value) => [`$${value}K`, 'Avg Cost']}
                  />
                  <Bar dataKey="avg" fill="#6366f1" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Key Stats */}
            <div className="bg-gray-800/50 border border-border rounded-lg p-4">
              <h3 className="text-white font-medium mb-4">Key Insights</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Most Common Type</span>
                  <span className="text-white">Internal ({typeData[0].value} of {stats.total})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Avg Sqft</span>
                  <span className="text-white">{Math.round(permits.reduce((s, p) => s + p.sqft, 0) / permits.length)} sqft</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Avg $/Sqft</span>
                  <span className="text-white">${avgPPSF}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary">Highest Cost</span>
                  <span className="text-red-400 font-medium">{formatCost(maxCost)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary">Lowest Cost</span>
                  <span className="text-yellow-400 font-medium">{formatCost(minCost)} ⚠️</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Permits Tab */}
        {activeTab === 'permits' && (
          <>
            {/* Type Filter */}
            <div className="mb-4 flex items-center gap-3">
              <span className="text-text-secondary text-sm">Filter:</span>
              <select 
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as typeof typeFilter)}
                className="bg-gray-800 border border-border rounded px-3 py-1 text-sm text-white"
              >
                <option value="all">All Types</option>
                <option value="Internal">Internal</option>
                <option value="Detached">Detached</option>
              </select>
              <span className="text-text-muted text-sm">
                Showing {filteredPermits.length} of {permits.length}
              </span>
            </div>

            <div className="bg-surface border border-border rounded-lg overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-text-secondary">
                    <th className="text-left p-3 cursor-pointer hover:text-white" onClick={() => handleSort('address')}>
                      Address {sortField === 'address' && (sortDir === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="text-left p-3 cursor-pointer hover:text-white" onClick={() => handleSort('issued')}>
                      Issued {sortField === 'issued' && (sortDir === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="text-left p-3">Type</th>
                    <th className="text-left p-3 cursor-pointer hover:text-white" onClick={() => handleSort('cost')}>
                      Cost {sortField === 'cost' && (sortDir === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="text-left p-3 cursor-pointer hover:text-white" onClick={() => handleSort('sqft')}>
                      Sqft {sortField === 'sqft' && (sortDir === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="text-left p-3 cursor-pointer hover:text-white" onClick={() => handleSort('ppsf')}>
                      $/Sqft {sortField === 'ppsf' && (sortDir === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="text-left p-3">Status</th>
                    <th className="text-left p-3">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedPermits.map((permit, i) => (
                    <tr key={i} className="border-b border-border/50 hover:bg-gray-800/30">
                      <td className="p-3 text-white font-medium">{permit.address}</td>
                      <td className="p-3 text-text-secondary">{permit.issued}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded text-xs ${
                          permit.type === 'Internal' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-indigo-500/20 text-indigo-400'
                        }`}>
                          {permit.type}
                        </span>
                      </td>
                      <td className={`p-3 ${permit.cost === maxCost ? 'text-red-400 font-medium' : permit.cost === minCost ? 'text-yellow-400' : 'text-text-secondary'}`}>
                        {formatCost(permit.cost)}
                        {permit.cost === maxCost && ' 🔺'}
                        {permit.cost === minCost && ' ⚠️'}
                      </td>
                      <td className="p-3 text-text-secondary">{permit.sqft}</td>
                      <td className="p-3 text-text-secondary">${permit.ppsf}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded text-xs ${
                          permit.status === 'CO Issued' ? 'bg-purple-500/20 text-purple-400' :
                          permit.status.includes('Issued') ? 'bg-emerald-500/20 text-emerald-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {permit.status}
                        </span>
                      </td>
                      <td className="p-3 text-text-secondary text-xs max-w-[200px] truncate" title={permit.notes}>
                        {permit.notes || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        <p className="text-text-muted text-xs mt-4 text-center">
          Data source: City of Newton via FOIA Request
        </p>
      </div>
    </div>
  )
}
