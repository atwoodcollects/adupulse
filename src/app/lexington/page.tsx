'use client'
import { useState } from 'react'
import Link from 'next/link'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const permits = [
  { id: 'B-24-591', address: '9A WASHINGTON ST', date: '2025-07-03', cost: 500000, type: 'Detached ADU', status: 'approved' },
  { id: 'B-25-470', address: '31A BERTWELL RD', date: '2025-07-16', cost: 511330, type: 'Detached ADU', status: 'approved' },
  { id: 'B-24-1571', address: '18R BACON ST', date: '2025-03-24', cost: 407528, type: 'Detached ADU', status: 'approved' },
  { id: 'B-24-1385', address: '33 WOODPARK CIR', date: '2025-12-10', cost: 386684, type: 'Detached ADU', status: 'approved' },
  { id: 'B-25-1530', address: '26 DOUGLAS RD', date: '2025-12-23', cost: 250516, type: 'Basement ADU', status: 'approved' },
  { id: 'B-25-876', address: '14 RIDGE RD', date: '2025-12-19', cost: 226847, type: 'In-Law Suite', status: 'approved' },
  { id: 'B-25-657', address: '20 BIRD HILL RD', date: '2025-07-28', cost: 173376, type: 'In-Law Suite', status: 'approved' },
  { id: 'B-25-1488', address: '5A SOLLYS WAY', date: '2025-11-18', cost: 87285, type: 'Basement ADU', status: 'approved' },
  { id: 'B-25-701', address: '39 WOODPARK CIR', date: '2025-06-20', cost: 20000, type: 'CR-ADU', status: 'approved' },
  { id: 'B-25-442', address: '35 MOON HILL RD', date: '2025-05-22', cost: 4200, type: 'ADU Alteration', status: 'approved' },
  ]
const totalPermits = permits.length
const avgCost = Math.round(permits.reduce((sum, p) => sum + p.cost, 0) / permits.length)
const totalInvestment = permits.reduce((sum, p) => sum + p.cost, 0)
const typeBreakdown = permits.reduce((acc, p) => { acc[p.type] = (acc[p.type] || 0) + 1; return acc }, {} as Record<string, number>)
const typeData = Object.entries(typeBreakdown).map(([name, value]) => ({ name, value }))
const costRanges = [
  { range: '<$100K', count: permits.filter(p => p.cost < 100000).length },
  { range: '$100-250K', count: permits.filter(p => p.cost >= 100000 && p.cost < 250000).length },
  { range: '$250-400K', count: permits.filter(p => p.cost >= 250000 && p.cost < 400000).length },
  { range: '$400K+', count: permits.filter(p => p.cost >= 400000).length },
  ]
const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6']

export default function LexingtonPage() {
    const [activeTab, setActiveTab] = useState<'insights' | 'permits'>('insights')
    return (
          <div className="min-h-screen" style={{ backgroundColor: '#0c0c0c' }}>
                  <div className="max-w-7xl mx-auto px-4 py-8">
                          <div className="flex justify-between items-start mb-8">
                                    <Link href="/" className="text-blue-4</div>
