'use client'

import { useState } from 'react'
import Link from 'next/link'
import TownNav from '@/components/TownNav'
import permits from '@/data/needham_permits.json'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

export default function NeedhamPage() {
  const [expandedRow, setExpandedRow] = useState<number | null>(null)

  const permitsWithPPSF = permits.map(p => ({
    ...p,
    ppsf: p.sqft > 0 && p.cost > 0 ? Math.round(p.cost / p.sqft) : 0
  }))

  const stats = {
    total: permits.length,
    issued: permits.filter(p => p.status === 'Issued').length,
    active: permits.filter(p => p.status === 'Active').length
  }

  const typeData = [
    { name: 'Internal', value: permits.filter(p => p.type === 'Internal').length, color: '#10b981' },
  ].filter(d => d.value > 0)

  const formatCost = (cost: number) => {
    if (cost >= 1000000) return `$${(cost / 1000000).toFixed(1)}M`
    if (cost >= 1000) return `$${Math.round(cost / 1000)}K`
    return cost > 0 ? `$${cost}` : '—'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Issued': return 'bg-emerald-500/20 text-emerald-400'
      case 'Active': return 'bg-yellow-500/20 text-yellow-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-4 sm:mb-6">
          <div>
            <Link href="/" className="text-blue-400 text-xs sm:text-sm mb-1 inline-block">← Back</Link>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">Needham ADU Permits</h1>
            <p className="text-text-secondary text-xs sm:text-sm">Data via Town of Needham Quarterly Permit Reports</p>
          </div>
          <TownNav current="Needham" />
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6">
          <div className="bg-gray-800/50 border border-border rounded-lg p-2 sm:p-3 md:p-4 text-center">
            <div className="text-base sm:text-lg md:text-2xl font-bold text-white">{stats.total}</div>
            <div className="text-[10px] sm:text-xs text-text-muted">Total</div>
          </div>
          <div className="bg-gray-800/50 border border-border rounded-lg p-2 sm:p-3 md:p-4 text-center">
            <div className="text-base sm:text-lg md:text-2xl font-bold text-emerald-400">{stats.issued}</div>
            <div className="text-[10px] sm:text-xs text-text-muted">Issued</div>
          </div>
          <div className="bg-gray-800/50 border border-border rounded-lg p-2 sm:p-3 md:p-4 text-center">
            <div className="text-base sm:text-lg md:text-2xl font-bold text-yellow-400">{stats.active}</div>
            <div className="text-[10px] sm:text-xs text-text-muted">Active</div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="bg-gray-800/50 border border-border rounded-lg p-3 sm:p-4">
            <h3 className="text-white text-sm sm:text-base font-medium mb-3">ADU Types</h3>
            <ResponsiveContainer width="100%" height={140}>
              <PieChart>
                <Pie data={typeData} cx="50%" cy="50%" innerRadius={30} outerRadius={50} dataKey="value" label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                  {typeData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px', fontSize: '12px' }} labelStyle={{ color: '#fff' }} itemStyle={{ color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-2 text-center text-xs text-text-muted">100% internal conversions (basement/garage)</div>
          </div>

          <div className="bg-gray-800/50 border border-border rounded-lg p-3 sm:p-4">
            <h3 className="text-white text-sm sm:text-base font-medium mb-3">Key Insights</h3>
            <div className="space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between"><span className="text-text-secondary">Total Permits</span><span className="text-white">3</span></div>
              <div className="flex justify-between"><span className="text-text-secondary">Avg Size</span><span className="text-white">691sf</span></div>
              <div className="flex justify-between"><span className="text-text-secondary">Types</span><span className="text-emerald-400">All Internal</span></div>
              <div className="flex justify-between"><span className="text-text-secondary">Detached Units</span><span className="text-text-muted">0</span></div>
            </div>
            <div className="mt-3 pt-2 border-t border-border/50 text-xs text-text-muted">No detached ADU permits yet</div>
          </div>
        </div>

        <div className="sm:hidden space-y-2">
          {permitsWithPPSF.map((permit, i) => (
            <div key={i} className="bg-gray-800/50 border border-border rounded-lg p-3" onClick={() => setExpandedRow(expandedRow === i ? null : i)}>
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1 min-w-0"><p className="text-white text-sm font-medium truncate">{permit.address}</p><p className="text-text-muted text-xs">{permit.permit} • Issued {permit.issued}</p></div>
                <span className={`px-2 py-0.5 rounded text-[10px] ml-2 ${getStatusColor(permit.status)}`}>{permit.status}</span>
              </div>
              <div className="flex gap-3 text-xs">
                {permit.sqft > 0 && <span className="text-text-secondary">{permit.sqft}sf</span>}
                {permit.cost > 0 && <span className="text-white">{formatCost(permit.cost)}</span>}
                <span className="text-emerald-400">{permit.type}</span>
              </div>
              {expandedRow === i && <div className="mt-2 pt-2 border-t border-border/50 text-xs"><div className="mb-1"><span className="text-text-muted">Contractor: </span><span className="text-text-secondary">{permit.contractor}</span></div>{permit.notes && <div><span className="text-text-muted">Notes: </span><span className="text-text-secondary">{permit.notes}</span></div>}</div>}
              <p className="text-text-muted text-[10px] mt-1 text-center">{expandedRow === i ? 'Tap to collapse' : 'Tap for details'}</p>
            </div>
          ))}
        </div>

        <div className="hidden sm:block bg-surface border border-border rounded-lg overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border text-text-secondary"><th className="text-left p-3">Permit</th><th className="text-left p-3">Address</th><th className="text-left p-3">Issued</th><th className="text-left p-3">Status</th><th className="text-left p-3">Type</th><th className="text-left p-3">Cost</th><th className="text-left p-3">Sqft</th><th className="text-left p-3">Contractor</th></tr></thead>
            <tbody>
              {permitsWithPPSF.map((permit, i) => (
                <tr key={i} className="border-b border-border/50 hover:bg-gray-800/30">
                  <td className="p-3 text-text-secondary text-xs">{permit.permit}</td>
                  <td className="p-3 text-white font-medium">{permit.address}</td>
                  <td className="p-3 text-text-secondary">{permit.issued}</td>
                  <td className="p-3"><span className={`px-2 py-1 rounded text-xs ${getStatusColor(permit.status)}`}>{permit.status}</span></td>
                  <td className="p-3"><span className="px-2 py-1 rounded text-xs bg-emerald-500/20 text-emerald-400">{permit.type}</span></td>
                  <td className="p-3 text-text-secondary">{formatCost(permit.cost)}</td>
                  <td className="p-3 text-text-secondary">{permit.sqft > 0 ? permit.sqft : '—'}</td>
                  <td className="p-3 text-text-secondary text-xs max-w-[150px] truncate">{permit.contractor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-text-muted text-[10px] sm:text-xs mt-3 sm:mt-4 text-center">Data source: Town of Needham Quarterly Building Permit Reports (2025)</p>
      </div>
    </div>
  )
}
