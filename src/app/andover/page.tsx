'use client'
import { useState } from 'react'
import Link from 'next/link'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const permits = [
  { id: 'B-25-899', address: '41 PINE ST', date: '2025-07-22', cost: 1100000, type: 'Basement ADU', status: 'approved' },
  { id: 'B-25-629', address: '60 HIGH ST', date: '2025-08-08', cost: 428866, type: 'Garage + In-Law', status: 'approved' },
  { id: 'B-25-7', address: '7 CYR CI', date: '2025-03-31', cost: 405124, type: 'Garage + In-Law', status: 'approved' },
]
const totalPermits = permits.length
const avgCost = Math.round(permits.reduce((sum, p) => sum + p.cost, 0) / permits.length)
const totalInvestment = permits.reduce((sum, p) => sum + p.cost, 0)
const typeBreakdown = permits.reduce((acc, p) => { acc[p.type] = (acc[p.type] || 0) + 1; return acc }, {} as Record<string, number>)
const typeData = Object.entries(typeBreakdown).map(([name, value]) => ({ name, value }))
const costRanges = [
  { range: '<$500K', count: permits.filter(p => p.cost < 500000).length },
  { range: '$500K-1M', count: permits.filter(p => p.cost >= 500000 && p.cost < 1000000).length },
  { range: '$1M+', count: permits.filter(p => p.cost >= 1000000).length },
]
const COLORS = ['#22c55e', '#3b82f6', '#f59e0b']

export default function AndoverPage() {
  const [activeTab, setActiveTab] = useState<'insights' | 'permits'>('insights')
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0c0c0c' }}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-start mb-8">
          <Link href="/" className="text-blue-400 hover:text-blue-300 text-sm">Back to ADU Pulse</Link>
          <div className="text-center flex-1">
            <h1 className="text-2xl font-bold text-white">Andover ADU Permits</h1>
            <p className="text-gray-400 text-xs">Since Feb 2, 2025</p>
          </div>
          <div className="w-24"></div>
        </div>
        <div className="flex gap-2 md:gap-4 mb-8">
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-3 md:p-4 text-center flex-1 min-w-0"><div className="text-xl md:text-3xl font-bold text-white">{totalPermits}</div><div className="text-gray-400 text-xs">Applications</div></div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-3 md:p-4 text-center flex-1 min-w-0"><div className="text-xl md:text-3xl font-bold text-green-400">{totalPermits}</div><div className="text-gray-400 text-xs">Approved</div></div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-3 md:p-4 text-center flex-1 min-w-0"><div className="text-xl md:text-3xl font-bold text-blue-400">${(avgCost / 1000).toFixed(0)}K</div><div className="text-gray-400 text-xs">Avg Cost</div></div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-3 md:p-4 text-center flex-1 min-w-0"><div className="text-xl md:text-3xl font-bold text-purple-400">${(totalInvestment / 1000000).toFixed(1)}M</div><div className="text-gray-400 text-xs">Total Investment</div></div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-3 md:p-4 text-center flex-1 min-w-0"><div className="text-xl md:text-3xl font-bold text-yellow-400">{Object.keys(typeBreakdown).length}</div><div className="text-gray-400 text-xs">ADU Types</div></div>
        </div>
        <div className="flex gap-2 mb-6">
          <button onClick={() => setActiveTab('insights')} className={`px-4 py-2 rounded-lg text-sm font-medium ${activeTab === 'insights' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300'}`}>Insights</button>
          <button onClick={() => setActiveTab('permits')} className={`px-4 py-2 rounded-lg text-sm font-medium ${activeTab === 'permits' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300'}`}>Permits</button>
        </div>
        {activeTab === 'insights' ? (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
              <h3 className="text-white font-semibold mb-4">Cost Distribution</h3>
              <ResponsiveContainer width="100%" height={200}><BarChart data={costRanges}><XAxis dataKey="range" tick={{ fill: '#9ca3af', fontSize: 12 }} /><YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} /><Tooltip /><Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer>
            </div>
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
              <h3 className="text-white font-semibold mb-4">ADU Types</h3>
              <ResponsiveContainer width="100%" height={200}><PieChart><Pie data={typeData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ percent }) => `${((percent ?? 0) * 100).toFixed(0)}%`}>{typeData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-2 mt-2">{typeData.map((e, i) => <div key={e.name} className="flex items-center gap-1 text-xs"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div><span className="text-gray-300">{e.name}</span></div>)}</div>
            </div>
          </div>
        ) : (
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg overflow-hidden">
            <table className="w-full"><thead className="bg-gray-800/50"><tr><th className="text-left text-gray-300 p-4">Address</th><th className="text-left text-gray-300 p-4">Type</th><th className="text-left text-gray-300 p-4">Cost</th><th className="text-left text-gray-300 p-4">Date</th></tr></thead>
            <tbody>{permits.map(p => <tr key={p.id} className="border-t border-gray-800"><td className="p-4"><div className="text-white">{p.address}</div><div className="text-gray-500 text-sm">{p.id}</div></td><td className="p-4 text-gray-300">{p.type}</td><td className="p-4 text-gray-300">${p.cost.toLocaleString()}</td><td className="p-4 text-gray-400">{new Date(p.date).toLocaleDateString()}</td></tr>)}</tbody></table>
          </div>
        )}
        <div className="mt-8 text-center text-gray-500 text-sm">Data source: Town of Andover (andoverma.gov)</div>
      </div>
    </div>
  )
}
