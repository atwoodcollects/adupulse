'use client'

import { useEffect, useState } from 'react'
import { getTowns, getStats, getRecentPermits, Town, Permit } from '@/lib/supabase'
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
function TownRow({ rank, town }: { rank: number, town: Town }) {
  const approvalRate = town.total_applications > 0 
    ? Math.round((town.total_approved / town.total_applications) * 100)
    : 0

  return (
    <div className="town-row group">
      <span className="town-rank">#{rank}</span>
      <div className="flex-1 ml-4">
        <div className="town-name group-hover:text-accent transition-colors">{town.name}</div>
        <div className="text-xs text-text-muted mt-0.5">{town.county} County</div>
      </div>
      <div className="text-right">
        <div className="town-count">{town.total_approved}<span className="text-text-muted text-sm font-normal">/{town.total_applications}</span></div>
        <div className="text-xs text-text-muted">
          {approvalRate}% approved
          {town.avg_days_to_approve && ` · ${Math.round(town.avg_days_to_approve)}d avg`}
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
  const [towns, setTowns] = useState<Town[]>([])
  const [permits, setPermits] = useState<Permit[]>([])
  const [stats, setStats] = useState({ totalApplications: 0, totalApproved: 0, totalDenied: 0, avgDays: 0, townsWithData: 0 })
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'recent'>('leaderboard')

  useEffect(() => {
    async function fetchData() {
      try {
        const [townsData, statsData, permitsData] = await Promise.all([
          getTowns(),
          getStats(),
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-text-secondary">Loading permit data...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-2xl font-bold tracking-tight">
                ADU PULSE
              </h1>
              <p className="text-text-secondary text-sm mt-1">
                Real-time permit data for Massachusetts
              </p>
              <p className="text-text-muted text-xs mt-1">
                Data last updated: January 23, 2026
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="pulse-dot mr-2"></div>
              <span className="text-xs text-text-muted uppercase tracking-wide">Live</span>
            </div>
          </div>
        </div>
      </header>

      {/* Stats */}
      <section className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-4 gap-4">
            <StatCard 
              value={stats.totalApproved} 
              label="Approved" 
            />
            <StatCard 
              value={stats.totalApplications} 
              label="Applied" 
            />
            <StatCard 
              value={stats.avgDays > 0 ? `${stats.avgDays}d` : '—'} 
              label="Avg Days" 
            />
            <StatCard 
              value={stats.townsWithData} 
              label="Towns" 
            />
          </div>
        </div>
      </section>

      {/* Map Placeholder + Data */}
      <section className="max-w-7xl mx-auto px-6 py-8">
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
                    <TownRow key={town.id} rank={i + 1} town={town} />
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

      {/* Full Permits Table */}
      <section className="max-w-7xl mx-auto px-6 py-8">
        <h2 className="font-display text-lg font-semibold mb-4">All Permits</h2>
        <div className="bg-surface border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Type</th>
                  <th>Size</th>
                  <th>Approved</th>
                  <th className="text-right">Time</th>
                </tr>
              </thead>
              <tbody>
                {permits.length > 0 ? (
                  permits.map(permit => (
                    <PermitRow key={permit.id} permit={permit} />
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-text-muted">
                      No permit data collected yet. Start sending FOIA requests!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
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
