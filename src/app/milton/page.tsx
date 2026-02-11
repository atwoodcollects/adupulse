'use client'

import { useState } from 'react'
import Link from 'next/link'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import permits from '@/data/milton_permits.json'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

export default function MiltonPage() {
  const [expandedRow, setExpandedRow] = useState<number | null>(null)

  const permitsWithCost = permits.filter(p => p.cost > 0)
  const permitsWithSqft = permits.filter(p => p.sqft > 0)
  
  const stats = {
    total: permits.length,
    avgCost: permitsWithCost.length > 0 ? Math.round(permitsWithCost.reduce((a, b) => a + b.cost, 0) / permitsWithCost.length) : 0,
    avgSqft: permitsWithSqft.length > 0 ? Math.round(permitsWithSqft.reduce((a, b) => a + b.sqft, 0) / permitsWithSqft.length) : 0,
    avgPpsf: permitsWithCost.filter(p => p.sqft > 0).length > 0 ? Math.round(permitsWithCost.filter(p => p.sqft > 0).reduce((a, b) => a + b.cost / b.sqft, 0) / permitsWithCost.filter(p => p.sqft > 0).length) : 0
  }

  const typeData = [
    { name: 'Conv', value: permits.filter(p => p.type === 'Conversion').length, color: '#10b981' },
    { name: 'Detached', value: permits.filter(p => p.type === 'Detached').length, color: '#f59e0b' },
    { name: 'Attached', value: permits.filter(p => p.type === 'Attached').length, color: '#6366f1' },
  ].filter(d => d.value > 0)

  const formatCost = (cost: number) => {
    if (cost >= 1000000) return '$' + (cost / 1000000).toFixed(1) + 'M'
    if (cost >= 1000) return '$' + Math.round(cost / 1000) + 'K'
    return cost > 0 ? '$' + cost : '—'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Issued': return 'bg-emerald-500/20 text-emerald-400'
      case 'Complete': return 'bg-blue-500/20 text-blue-400'
      case 'Final Inspection': return 'bg-purple-500/20 text-purple-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Conversion': return 'bg-emerald-500/20 text-emerald-400'
      case 'Attached': return 'bg-indigo-500/20 text-indigo-400'
      case 'Detached': return 'bg-amber-500/20 text-amber-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-4 sm:mb-6">
          <div>
            <Link href="/" className="text-blue-400 text-xs sm:text-sm mb-1 inline-block">← Back</Link>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">Milton ADU Permits</h1>
            <p className="text-text-secondary text-xs sm:text-sm">Data via Town of Milton Permit Portal</p>
          </div>
          <NavBar current="Milton" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6">
          <div className="bg-gray-800/50 border border-border rounded-lg p-2 sm:p-3 md:p-4 text-center">
            <div className="text-base sm:text-lg md:text-2xl font-bold text-white">{stats.total}</div>
            <div className="text-[10px] sm:text-xs text-text-muted">Total</div>
          </div>
          <div className="bg-gray-800/50 border border-border rounded-lg p-2 sm:p-3 md:p-4 text-center">
            <div className="text-base sm:text-lg md:text-2xl font-bold text-white">{stats.avgSqft}</div>
            <div className="text-[10px] sm:text-xs text-text-muted">Avg Sqft</div>
          </div>
          <div className="bg-gray-800/50 border border-border rounded-lg p-2 sm:p-3 md:p-4 text-center">
            <div className="text-base sm:text-lg md:text-2xl font-bold text-white">{formatCost(stats.avgCost)}</div>
            <div className="text-[10px] sm:text-xs text-text-muted">Avg Cost</div>
          </div>
          <div className="bg-gray-800/50 border border-border rounded-lg p-2 sm:p-3 md:p-4 text-center">
            <div className="text-base sm:text-lg md:text-2xl font-bold text-white">${stats.avgPpsf}</div>
            <div className="text-[10px] sm:text-xs text-text-muted">Avg $/sf</div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="bg-gray-800/50 border border-border rounded-lg p-3 sm:p-4">
            <h3 className="text-white text-sm sm:text-base font-medium mb-3">ADU Types</h3>
            <ResponsiveContainer width="100%" height={140}>
              <PieChart>
                <Pie data={typeData} cx="50%" cy="50%" innerRadius={30} outerRadius={50} dataKey="value" label={({ name, value }) => name + ': ' + value} labelLine={false}>
                  {typeData.map((entry, index) => (<Cell key={'cell-' + index} fill={entry.color} />))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-gray-800/50 border border-border rounded-lg p-3 sm:p-4">
            <h3 className="text-white text-sm sm:text-base font-medium mb-3">Key Insights</h3>
            <div className="space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between"><span className="text-text-secondary">DIY Detached</span><span className="text-white">$117-$222/sf</span></div>
              <div className="flex justify-between"><span className="text-text-secondary">Contractor Attached</span><span className="text-white">$281/sf</span></div>
              <div className="flex justify-between"><span className="text-text-secondary">Pre-designed Plans</span><span className="text-emerald-400">Available</span></div>
            </div>
          </div>
        </div>

        <div className="hidden sm:block bg-surface border border-border rounded-lg overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-text-secondary">
                <th className="text-left p-3">Permit</th>
                <th className="text-left p-3">Address</th>
                <th className="text-left p-3">Issued</th>
                <th className="text-left p-3">Type</th>
                <th className="text-left p-3">Cost</th>
                <th className="text-left p-3">Sqft</th>
                <th className="text-left p-3">Notes</th>
              </tr>
            </thead>
            <tbody>
              {permits.map((permit, i) => (
                <tr key={i} className="border-b border-border/50 hover:bg-gray-800/30">
                  <td className="p-3 text-text-secondary text-xs">{permit.permit}</td>
                  <td className="p-3 text-white font-medium">{permit.address}</td>
                  <td className="p-3 text-text-secondary">{permit.issued}</td>
                  <td className="p-3"><span className={'px-2 py-1 rounded text-xs ' + getTypeColor(permit.type)}>{permit.type}</span></td>
                  <td className="p-3 text-text-secondary">{formatCost(permit.cost)}</td>
                  <td className="p-3 text-text-secondary">{permit.sqft > 0 ? permit.sqft : '—'}</td>
                  <td className="p-3 text-text-secondary text-xs">{permit.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="sm:hidden space-y-2">
          {permits.map((permit, i) => (
            <div key={i} className="bg-gray-800/50 border border-border rounded-lg p-3" onClick={() => setExpandedRow(expandedRow === i ? null : i)}>
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{permit.address}</p>
                  <p className="text-text-muted text-xs">{permit.permit} • {permit.issued}</p>
                </div>
                <span className={'px-2 py-0.5 rounded text-[10px] ml-2 ' + getStatusColor(permit.status)}>{permit.status}</span>
              </div>
              <div className="flex gap-3 text-xs">
                {permit.sqft > 0 && <span className="text-text-secondary">{permit.sqft}sf</span>}
                {permit.cost > 0 && <span className="text-white">{formatCost(permit.cost)}</span>}
                <span className={'px-1.5 py-0.5 rounded ' + getTypeColor(permit.type)}>{permit.type}</span>
              </div>
              {expandedRow === i && permit.notes && (
                <div className="mt-2 pt-2 border-t border-border/50 text-xs">
                  <span className="text-text-muted">Notes: </span><span className="text-text-secondary">{permit.notes}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        <p className="text-text-muted text-[10px] sm:text-xs mt-3 sm:mt-4 text-center">Data source: Town of Milton Permit Portal (2025-2026)</p>
      </div>
    </div>
  )
}
