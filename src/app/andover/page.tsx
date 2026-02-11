'use client'

import { useState } from 'react'
import Link from 'next/link'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import permits from '@/data/andover_permits.json'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

export default function AndoverPage() {
  const [activeTab, setActiveTab] = useState<'permits' | 'insights'>('insights')
  const [expandedRow, setExpandedRow] = useState<number | null>(null)

  const activePermits = permits.filter(p => p.status === 'Pending' || p.status === 'Issued')
  
  const permitsWithPPSF = permits.map(p => ({
    ...p,
    ppsf: p.sqft > 0 ? Math.round(p.cost / p.sqft) : 0
  }))

  const stats = {
    total: permits.length,
    issued: permits.filter(p => p.status === 'Issued').length,
    pending: permits.filter(p => p.status === 'Pending').length,
    rejected: permits.filter(p => p.status === 'Rejected' || p.status === 'Stopped' || p.status === 'Withdrawn').length
  }

  const permitsWithCost = activePermits.filter(p => p.cost > 0)
  const totalCost = permitsWithCost.reduce((sum, p) => sum + p.cost, 0)
  const avgCost = permitsWithCost.length > 0 ? Math.round(totalCost / permitsWithCost.length) : 0
  const avgPPSF = permitsWithCost.length > 0 ? Math.round(totalCost / permitsWithCost.reduce((sum, p) => sum + p.sqft, 0)) : 0

  const daysToApproval = 57

  const statusData = [
    { name: 'Issued', value: stats.issued, color: '#10b981' },
    { name: 'Pending', value: stats.pending, color: '#f59e0b' },
    { name: 'Rejected/Stopped', value: stats.rejected, color: '#ef4444' },
  ].filter(d => d.value > 0)

  const typeData = [
    { name: 'Internal', value: permits.filter(p => p.type === 'Internal').length, color: '#10b981' },
    { name: 'Attached', value: permits.filter(p => p.type === 'Attached').length, color: '#6366f1' },
    { name: 'Detached', value: permits.filter(p => p.type === 'Detached').length, color: '#f59e0b' },
  ].filter(d => d.value > 0)

  const formatCost = (cost: number) => {
    if (cost >= 1000000) return `$${(cost / 1000000).toFixed(1)}M`
    if (cost >= 1000) return `$${Math.round(cost / 1000)}K`
    return `$${cost}`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Issued': return 'bg-emerald-500/20 text-emerald-400'
      case 'Pending': return 'bg-yellow-500/20 text-yellow-400'
      case 'Rejected': return 'bg-red-500/20 text-red-400'
      case 'Stopped': return 'bg-red-500/20 text-red-400'
      case 'Withdrawn': return 'bg-gray-500/20 text-gray-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-4 sm:mb-6">
          <div>
            <Link href="/" className="text-blue-400 text-xs sm:text-sm mb-1 inline-block">← Back</Link>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">Andover ADU Permits</h1>
            <p className="text-text-secondary text-xs sm:text-sm">Data via Town of Andover OpenGov Portal</p>
          </div>
          <NavBar current="Andover" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6">
          <div className="bg-gray-800/50 border border-border rounded-lg p-2 sm:p-3 md:p-4 text-center">
            <div className="text-base sm:text-lg md:text-2xl font-bold text-emerald-400">{stats.issued}</div>
            <div className="text-[10px] sm:text-xs text-text-muted">Issued</div>
          </div>
          <div className="bg-gray-800/50 border border-border rounded-lg p-2 sm:p-3 md:p-4 text-center">
            <div className="text-base sm:text-lg md:text-2xl font-bold text-yellow-400">{stats.pending}</div>
            <div className="text-[10px] sm:text-xs text-text-muted">Pending</div>
          </div>
          <div className="bg-gray-800/50 border border-border rounded-lg p-2 sm:p-3 md:p-4 text-center">
            <div className="text-base sm:text-lg md:text-2xl font-bold text-red-400">{stats.rejected}</div>
            <div className="text-[10px] sm:text-xs text-text-muted">Rejected</div>
          </div>
          <div className="bg-gray-800/50 border border-border rounded-lg p-2 sm:p-3 md:p-4 text-center">
            <div className="text-base sm:text-lg md:text-2xl font-bold text-blue-400">{daysToApproval}</div>
            <div className="text-[10px] sm:text-xs text-text-muted">Days to Approval</div>
          </div>
        </div>

        <div className="flex gap-4 mb-3 sm:mb-4 border-b border-border">
          <button onClick={() => setActiveTab('insights')} className={`pb-2 px-1 text-xs sm:text-sm font-medium ${activeTab === 'insights' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-text-secondary hover:text-white'}`}>Insights</button>
          <button onClick={() => setActiveTab('permits')} className={`pb-2 px-1 text-xs sm:text-sm font-medium ${activeTab === 'permits' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-text-secondary hover:text-white'}`}>Permits</button>
        </div>

        {activeTab === 'insights' && (
          <div className="space-y-3 sm:space-y-4">
            <div className="bg-gray-800/50 border border-border rounded-lg p-3 sm:p-4">
              <h3 className="text-white text-sm sm:text-base font-medium mb-3">Approval Funnel</h3>
              <div className="flex items-center justify-center gap-2 sm:gap-4">
                <div className="text-center"><div className="text-2xl sm:text-3xl font-bold text-white">{stats.total}</div><div className="text-[10px] sm:text-xs text-text-muted">Applied</div></div>
                <div className="text-text-muted">→</div>
                <div className="text-center"><div className="text-2xl sm:text-3xl font-bold text-yellow-400">{stats.pending}</div><div className="text-[10px] sm:text-xs text-text-muted">Pending</div></div>
                <div className="text-text-muted">→</div>
                <div className="text-center"><div className="text-2xl sm:text-3xl font-bold text-emerald-400">{stats.issued}</div><div className="text-[10px] sm:text-xs text-text-muted">Issued</div></div>
              </div>
              <div className="mt-3 text-center text-xs text-text-secondary">{Math.round((stats.issued / stats.total) * 100)}% approval rate • {Math.round((stats.rejected / stats.total) * 100)}% rejection rate</div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="bg-gray-800/50 border border-border rounded-lg p-3 sm:p-4">
                <h3 className="text-white text-sm sm:text-base font-medium mb-3">Application Status</h3>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart><Pie data={statusData} cx="50%" cy="50%" innerRadius={35} outerRadius={55} dataKey="value" label={({ name, value }) => `${name}: ${value}`} labelLine={false}>{statusData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}</Pie><Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px', fontSize: '12px' }} labelStyle={{ color: '#fff' }} itemStyle={{ color: '#fff' }} /></PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-gray-800/50 border border-border rounded-lg p-3 sm:p-4">
                <h3 className="text-white text-sm sm:text-base font-medium mb-3">ADU Types</h3>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart><Pie data={typeData} cx="50%" cy="50%" innerRadius={35} outerRadius={55} dataKey="value" label={({ name, value }) => `${name}: ${value}`} labelLine={false}>{typeData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}</Pie><Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px', fontSize: '12px' }} labelStyle={{ color: '#fff' }} itemStyle={{ color: '#fff' }} /></PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-gray-800/50 border border-border rounded-lg p-3 sm:p-4">
                <h3 className="text-white text-sm sm:text-base font-medium mb-3">Rejection Reasons</h3>
                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="flex justify-between"><span className="text-text-secondary">Withdrawn by applicant</span><span className="text-red-400">1</span></div>
                  <div className="flex justify-between"><span className="text-text-secondary">Wrong permit type</span><span className="text-red-400">1</span></div>
                  <div className="flex justify-between"><span className="text-text-secondary">Stopped (unclear)</span><span className="text-red-400">1</span></div>
                </div>
                <div className="mt-3 pt-2 border-t border-border/50 text-xs text-text-muted">💡 1 rejection was due to wrong permit type (ADU vs Family Dwelling Unit)</div>
              </div>

              <div className="bg-gray-800/50 border border-border rounded-lg p-3 sm:p-4">
                <h3 className="text-white text-sm sm:text-base font-medium mb-3">Timeline Metrics</h3>
                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="flex justify-between"><span className="text-text-secondary">First Application</span><span className="text-white">Feb 3, 2025</span></div>
                  <div className="flex justify-between"><span className="text-text-secondary">First Issued</span><span className="text-emerald-400">Jan 20, 2026</span></div>
                  <div className="flex justify-between"><span className="text-text-secondary">Days to Approval</span><span className="text-blue-400 font-medium">57 days</span></div>
                </div>
              </div>

              <div className="bg-gray-800/50 border border-border rounded-lg p-3 sm:p-4">
                <h3 className="text-white text-sm sm:text-base font-medium mb-3">Cost Analysis</h3>
                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="flex justify-between"><span className="text-text-secondary">Avg Cost</span><span className="text-white">{formatCost(avgCost)}</span></div>
                  <div className="flex justify-between"><span className="text-text-secondary">Avg $/Sqft</span><span className="text-white">${avgPPSF}</span></div>
                  <div className="flex justify-between"><span className="text-text-secondary">Range</span><span className="text-white">$150K - $450K</span></div>
                  <div className="flex justify-between"><span className="text-text-secondary">Total Pipeline</span><span className="text-emerald-400 font-medium">{formatCost(totalCost)}</span></div>
                </div>
              </div>

              <div className="bg-gray-800/50 border border-border rounded-lg p-3 sm:p-4">
                <h3 className="text-white text-sm sm:text-base font-medium mb-3">Active Contractors</h3>
                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="flex justify-between"><span className="text-text-secondary">Mass ADU Inc</span><span className="text-emerald-400">1 pending</span></div>
                  <div className="flex justify-between"><span className="text-text-secondary">Connor Building</span><span className="text-emerald-400">1 pending</span></div>
                  <div className="flex justify-between"><span className="text-text-secondary">Bradford Construction</span><span className="text-emerald-400">1 issued ✓</span></div>
                  <div className="flex justify-between"><span className="text-text-secondary">Ted's Construction</span><span className="text-red-400">2 stopped</span></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'permits' && (
          <>
            <div className="sm:hidden space-y-2">
              {permitsWithPPSF.map((permit, i) => (
                <div key={i} className="bg-gray-800/50 border border-border rounded-lg p-3" onClick={() => setExpandedRow(expandedRow === i ? null : i)}>
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1 min-w-0"><p className="text-white text-sm font-medium truncate">{permit.address}</p><p className="text-text-muted text-xs">{permit.permit} • Applied {permit.applied}</p></div>
                    <span className={`px-2 py-0.5 rounded text-[10px] ml-2 ${getStatusColor(permit.status)}`}>{permit.status}</span>
                  </div>
                  {permit.cost > 0 && <div className="flex gap-3 text-xs"><span className="text-white">{formatCost(permit.cost)}</span><span className="text-text-secondary">{permit.sqft}sf</span><span className="text-text-secondary">${permit.ppsf}/sf</span></div>}
                  {expandedRow === i && <div className="mt-2 pt-2 border-t border-border/50 text-xs"><div className="mb-1"><span className="text-text-muted">Contractor: </span><span className="text-text-secondary">{permit.contractor}</span></div>{permit.notes && <div><span className="text-text-muted">Notes: </span><span className="text-text-secondary">{permit.notes}</span></div>}</div>}
                  <p className="text-text-muted text-[10px] mt-1 text-center">{expandedRow === i ? '▲ Tap to collapse' : '▼ Tap for details'}</p>
                </div>
              ))}
            </div>

            <div className="hidden sm:block bg-surface border border-border rounded-lg overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border text-text-secondary"><th className="text-left p-3">Permit</th><th className="text-left p-3">Address</th><th className="text-left p-3">Applied</th><th className="text-left p-3">Status</th><th className="text-left p-3">Type</th><th className="text-left p-3">Cost</th><th className="text-left p-3">Sqft</th><th className="text-left p-3">$/Sqft</th><th className="text-left p-3">Contractor</th></tr></thead>
                <tbody>
                  {permitsWithPPSF.map((permit, i) => (
                    <tr key={i} className="border-b border-border/50 hover:bg-gray-800/30">
                      <td className="p-3 text-text-secondary text-xs">{permit.permit}</td>
                      <td className="p-3 text-white font-medium">{permit.address}</td>
                      <td className="p-3 text-text-secondary">{permit.applied}</td>
                      <td className="p-3"><span className={`px-2 py-1 rounded text-xs ${getStatusColor(permit.status)}`}>{permit.status}</span></td>
                      <td className="p-3"><span className={`px-2 py-1 rounded text-xs ${permit.type === 'Internal' ? 'bg-emerald-500/20 text-emerald-400' : permit.type === 'Attached' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{permit.type}</span></td>
                      <td className="p-3 text-text-secondary">{permit.cost > 0 ? formatCost(permit.cost) : '—'}</td>
                      <td className="p-3 text-text-secondary">{permit.sqft > 0 ? permit.sqft : '—'}</td>
                      <td className="p-3 text-text-secondary">{permit.ppsf > 0 ? `$${permit.ppsf}` : '—'}</td>
                      <td className="p-3 text-text-secondary text-xs max-w-[150px] truncate">{permit.contractor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        <p className="text-text-muted text-[10px] sm:text-xs mt-3 sm:mt-4 text-center">Data source: Town of Andover OpenGov Portal • Last updated Jan 31, 2026</p>
      </div>
    </div>
  )
}
