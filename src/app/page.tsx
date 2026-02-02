'use client'

import TownNav from '@/components/TownNav'

import { useEffect, useState } from 'react'
import { getRecentPermits, Permit } from '@/lib/supabase'
import { getHLCStats, getHLCTopTowns, HLCTown } from '@/lib/hlcData'
import dynamic from 'next/dynamic'

const TownMap = dynamic(() => import('@/components/TownMap'), { ssr: false })

// Stats Card Component
function StatCard({ value, label, trend }: { value: string | number, label: string, trend?: string }) {
  return (
    <div className="stat-card animate-fade-in text-center">
      <div className="stat-value text-text-primary">{value}</div>
      <div className="stat-label">{label}</div>
      {trend && <div className="text-xs text-approved mt-2">{trend}</div>}
    </div>
  )
}

// Town Leaderboard Row
function TownRow({ rank, town }: { rank: number, town: HLCTown }) {
  const approvalRate = town.applications > 0 
    ? Math.round((town.approved / town.applications) * 100)
    : 0

  return (
    <div className="town-row group">
      <span className="town-rank">#{rank}</span>
      <div className="flex-1 ml-4">
        <div className="town-name group-hover:text-accent transition-colors">{town.name}</div>
        
      </div>
      <div className="text-right">
        <div className="town-count">{town.approved}<span className="text-text-muted text-sm font-normal">/{town.applications}</span></div>
        <div className="text-xs text-text-muted">
          {approvalRate}% approved
          
        </div>
      </div>
    </div>
  )
}

// Recent Permit Row
function PermitRow({ permit }: { permit: Permit }) {
  const statusColors = {
    approved: 'badge-approved',
    denied: 'badge-denied',
    applied: 'badge-pending',
    withdrawn: 'badge-pending',
    completed: 'badge-approved',
  }

  return (
    <tr className="hover:bg-surface-raised transition-colors">
      <td className="py-3 px-4">
        <div className="font-medium">{permit.town?.name}</div>
        <div className="text-xs text-text-muted">{permit.address || 'Address withheld'}</div>
      </td>
      <td className="py-3 px-4">
        <span className={`badge ${statusColors[permit.status]}`}>
          {permit.status}
        </span>
      </td>
      <td className="py-3 px-4 text-text-secondary">
        {permit.adu_type || '—'}
      </td>
      <td className="py-3 px-4 text-text-secondary">
        {permit.sqft ? `${permit.sqft} sqft` : '—'}
      </td>
      <td className="py-3 px-4 text-text-secondary">
        {permit.approved_date 
          ? new Date(permit.approved_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
          : '—'
        }
      </td>
      <td className="py-3 px-4 text-right font-display text-accent">
        {permit.days_to_decision ? `${permit.days_to_decision}d` : '—'}
      </td>
    </tr>
  )
}

// Main Dashboard
export default function Dashboard() {
  const [towns, setTowns] = useState<HLCTown[]>([])
  const [permits, setPermits] = useState<Permit[]>([])
  const [stats, setStats] = useState({ totalApplications: 0, totalApproved: 0, totalRejected: 0, townsReporting: 0, townsWithData: 0 })
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'recent'>('leaderboard')

  useEffect(() => {
    async function fetchData() {
      try {
        const [townsData, statsData, permitsData] = await Promise.all([
          getHLCTopTowns(20),
          Promise.resolve(getHLCStats()),
          getRecentPermits(20)
        ])
        setTowns(townsData)
        setStats(statsData)
        setPermits(permitsData)
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-text-secondary">Loading permit data...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-2xl font-bold tracking-tight">
                ADU PULSE
              </h1>
              <p className="text-text-secondary text-sm mt-1">
                Real-time permit data for Massachusetts
              </p>
              <p className="text-text-muted text-xs mt-1">
                Data: MA EOHLC Survey (Jan-Jun 2025). Next state update expected Spring 2026.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="pulse-dot mr-2"></div>
              <span className="text-xs text-text-muted uppercase tracking-wide">Live</span>
              <TownNav current="All Towns" />
            </div>
          </div>
        </div>
      </header>

      {/* Stats */}
      <section className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
          <div className="flex gap-2 md:gap-4">
            <StatCard 
              value={stats.totalApproved} 
              label="Approved" 
            />
            <StatCard 
              value={stats.totalApplications} 
              label="Applied" 
            />
            <StatCard 
              value={stats.totalRejected} 
              label="Rejected" 
            />
            <StatCard 
              value={stats.townsReporting} 
              label="Towns" 
            />
          </div>
        </div>
      </section>

      {/* Map Placeholder + Data */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Map */}
          <div className="lg:col-span-2">
            <div className="bg-surface border border-border rounded-lg overflow-hidden">
              <TownMap towns={towns} />
            </div>
            {/* Map Legend */}
            <div className="flex flex-wrap items-center gap-3 md:gap-6 mt-4 text-xs md:text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-approved"></div>
                <span className="text-text-secondary">10+ approved</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-pending"></div>
                <span className="text-text-secondary">4-9 approved</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-text-muted"></div>
                <span className="text-text-secondary">1-3 approved</span>
              </div>
            </div>
          </div>

          {/* Sidebar - Leaderboard/Recent Toggle */}
          <div className="bg-surface border border-border rounded-lg overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-border">
              <button
                onClick={() => setActiveTab('leaderboard')}
                className={`flex-1 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'leaderboard' 
                    ? 'text-accent border-b-2 border-accent' 
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                Top Towns
              </button>
              <button
                onClick={() => setActiveTab('recent')}
                className={`flex-1 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'recent' 
                    ? 'text-accent border-b-2 border-accent' 
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                Recent
              </button>
            </div>

            {/* Content */}
            <div className="max-h-[500px] overflow-y-auto">
              {activeTab === 'leaderboard' ? (
                towns.length > 0 ? (
                  towns.slice(0, 15).map((town, i) => (
                    <TownRow key={town.name} rank={i + 1} town={town} />
                  ))
                ) : (
                  <div className="p-8 text-center text-text-muted">
                    No permit data yet.<br />
                    <span className="text-sm">Data collection in progress.</span>
                  </div>
                )
              ) : (
                permits.length > 0 ? (
                  permits.map(permit => (
                    <div key={permit.id} className="town-row">
                      <div className="flex-1">
                        <div className="font-medium">{permit.town?.name}</div>
                        <div className="text-xs text-text-muted">
                          {permit.adu_type} · {permit.sqft ? `${permit.sqft} sqft` : 'Size TBD'}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`badge ${permit.status === 'approved' ? 'badge-approved' : 'badge-pending'}`}>
                          {permit.status}
                        </span>
                        <div className="text-xs text-text-muted mt-1">
                          {permit.approved_date && new Date(permit.approved_date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-text-muted">
                    No recent permits.<br />
                    <span className="text-sm">Check back soon.</span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </section>
      {/* Email Capture */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 mt-12">
        <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/30 rounded-lg p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h2 className="text-xl font-bold text-white mb-2">What will an ADU cost in your town?</h2>
              <p className="text-text-secondary">Try our free estimator based on real permit data.</p>
            </div>
            <a href="/estimate" className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
              Get Estimate →
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-text-muted text-sm">
              Data source: MA EOHLC ADU Survey (H1 2025). 242 of 351 municipalities reporting. Survey period: Jan–Jun 2025. Next update expected: Q1 2026.
            </div>
            <div className="flex items-center gap-6 text-sm">
              <a href="#" className="text-text-secondary hover:text-accent transition-colors">
                About
              </a>
              <a href="#" className="text-text-secondary hover:text-accent transition-colors">
                Methodology
              </a>
              <a href="#" className="text-text-secondary hover:text-accent transition-colors">
                API
              </a>
              <a href="#" className="text-text-secondary hover:text-accent transition-colors">
                Contact
              </a>
            </div>
          </div>
          <div className="text-text-muted text-xs mt-4">
            Built by Nick Welch · Powered by public data
          </div>
        </div>
      </footer>
    </div>
  )
}
// cache bust
