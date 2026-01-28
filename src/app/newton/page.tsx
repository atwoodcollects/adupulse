'use client'

import { useState } from 'react'
import Link from 'next/link'
import TownNav from '@/components/TownNav'
import permits from '@/data/newton_permits.json'

export default function NewtonPage() {
  const [sortField, setSortField] = useState<'applied' | 'issued' | 'address'>('applied')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  const stats = {
    total: permits.length,
    approved: permits.filter(p => p.status.includes('Issued')).length,
    coIssued: permits.filter(p => p.status === 'CO Issued').length,
    pending: permits.filter(p => p.status === 'Pending').length
  }

  const parseDate = (d: string) => {
    const [m, day, y] = d.split('/')
    return new Date(2000 + parseInt(y), parseInt(m) - 1, parseInt(day))
  }

  const sortedPermits = [...permits].sort((a, b) => {
    if (sortField === 'address') {
      return sortDir === 'asc' ? a.address.localeCompare(b.address) : b.address.localeCompare(a.address)
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

        {/* Stats */}
        <div className="flex justify-center gap-1 md:gap-4 mb-6">
          <div className="flex-1 min-w-0 bg-gray-800/50 border border-border rounded-lg p-3 md:p-4 text-center">
            <div className="text-lg md:text-2xl font-bold text-emerald-400">{stats.approved}</div>
            <div className="text-xs text-text-muted">Approved</div>
          </div>
          <div className="flex-1 min-w-0 bg-gray-800/50 border border-border rounded-lg p-3 md:p-4 text-center">
            <div className="text-lg md:text-2xl font-bold text-blue-400">{stats.total}</div>
            <div className="text-xs text-text-muted">Apps</div>
          </div>
          <div className="flex-1 min-w-0 bg-gray-800/50 border border-border rounded-lg p-3 md:p-4 text-center">
            <div className="text-lg md:text-2xl font-bold text-purple-400">{stats.coIssued}</div>
            <div className="text-xs text-text-muted">CO Issued</div>
          </div>
          <div className="flex-1 min-w-0 bg-gray-800/50 border border-border rounded-lg p-3 md:p-4 text-center">
            <div className="text-lg md:text-2xl font-bold text-yellow-400">100%</div>
            <div className="text-xs text-text-muted">Rate</div>
          </div>
        </div>

        {/* Permits Table */}
        <div className="bg-surface border border-border rounded-lg overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-text-secondary">
                <th className="text-left p-3 cursor-pointer hover:text-white" onClick={() => handleSort('address')}>
                  Address {sortField === 'address' && (sortDir === 'asc' ? '↑' : '↓')}
                </th>
                <th className="text-left p-3 cursor-pointer hover:text-white" onClick={() => handleSort('applied')}>
                  Applied {sortField === 'applied' && (sortDir === 'asc' ? '↑' : '↓')}
                </th>
                <th className="text-left p-3 cursor-pointer hover:text-white" onClick={() => handleSort('issued')}>
                  Issued {sortField === 'issued' && (sortDir === 'asc' ? '↑' : '↓')}
                </th>
                <th className="text-left p-3">Permit #</th>
                <th className="text-left p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {sortedPermits.map((permit, i) => (
                <tr key={i} className="border-b border-border/50 hover:bg-gray-800/30">
                  <td className="p-3 text-white font-medium">{permit.address}</td>
                  <td className="p-3 text-text-secondary">{permit.applied}</td>
                  <td className="p-3 text-text-secondary">{permit.issued}</td>
                  <td className="p-3 text-text-secondary">{permit.permit}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs ${
                      permit.status === 'CO Issued' ? 'bg-purple-500/20 text-purple-400' :
                      permit.status.includes('Issued') ? 'bg-emerald-500/20 text-emerald-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {permit.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-text-muted text-xs mt-4 text-center">
          Data source: <a href="https://permiteyes.online/newton/publicview.php" target="_blank" className="text-blue-400 hover:underline">Newton City of Newton FOIA Portal</a>
        </p>
      </div>
    </div>
  )
}
