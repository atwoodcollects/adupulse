'use client'

import Link from 'next/link'
import TownNav from '@/components/TownNav'

const permits = [
  {
    id: 'B-25-470',
    address: '31A Bertwell Rd',
    status: 'Active',
    dateSubmitted: '2025-04-25',
    dateIssued: '2025-07-16',
    cost: 511330,
    sqft: 805,
    bedrooms: 2,
    type: 'Detached',
    subtype: 'New construction',
    builder: 'Contractor',
    builderName: 'The Lagasse Group LLC',
    builderLocation: 'Natick, MA',
    description: 'Demo existing garage, construct new two story garage with apartment above including bathroom and kitchen. New utilities from existing home.',
    architect: false,
    engineer: false,
    hersRating: 54,
    sprinklers: false,
  },
  {
    id: 'B-25-1530',
    address: '26 Douglas Rd',
    status: 'Active',
    dateSubmitted: '2025-11-20',
    dateIssued: '2025-12-23',
    cost: 250516,
    sqft: 862,
    bedrooms: 1,
    type: 'Attached',
    subtype: 'Basement conversion',
    builder: 'Contractor',
    builderName: 'International Construction & Development Inc',
    builderLocation: 'Milton, MA',
    description: 'Separate lower level from 1st floor to create ADU in lower level, partial gut rehab and install new kitchen. Mini splits for heating/cooling, new heat pump water heater.',
    architect: false,
    engineer: false,
    hersRating: null,
    sprinklers: false,
    ownerType: 'Lexhab (housing org)',
  },
  {
    id: 'B-25-1474',
    address: '302 Marrett Rd',
    status: 'Active',
    dateSubmitted: '2025-11-06',
    dateIssued: null,
    cost: 150000,
    sqft: 898,
    bedrooms: 2,
    type: 'Detached',
    subtype: 'New construction',
    builder: 'DIY',
    builderName: 'Homeowner (hiring subs)',
    builderLocation: null,
    description: 'New accessory dwelling unit',
    architect: false,
    engineer: false,
    hersRating: 53,
    sprinklers: false,
  },
  {
    id: 'B-25-1488',
    address: '5A Solly\'s Way',
    status: 'Active',
    dateSubmitted: '2025-11-11',
    dateIssued: '2025-11-18',
    cost: 87285,
    sqft: 985,
    bedrooms: 1,
    type: 'Attached',
    subtype: 'Basement conversion',
    builder: 'Contractor',
    builderName: 'Kyle Matthew Construction LLC',
    builderLocation: 'Harvard, MA',
    description: 'Finish partially completed basement ADU from previous permit #B-24-1533. Finish basement entrance (doghouse).',
    architect: false,
    engineer: false,
    hersRating: null,
    sprinklers: true,
    notes: 'Lower cost - finishing prior work',
  },
  {
    id: 'B-25-632',
    address: '390 Marrett Rd',
    status: 'Active',
    dateSubmitted: '2025-05-30',
    dateIssued: null,
    cost: 30000,
    sqft: 743,
    bedrooms: 1,
    type: 'Attached',
    subtype: 'Basement conversion',
    builder: 'DIY',
    builderName: 'Homeowner (all work)',
    builderLocation: null,
    description: 'Build ADU in the existing basement',
    architect: true,
    architectName: 'CLDA Architect (Xiaoying Chen)',
    engineer: false,
    hersRating: null,
    sprinklers: false,
    notes: 'Full DIY - likely just materials cost',
  },
  {
    id: 'B-25-609',
    address: '39 Woodpark Cir',
    status: 'Complete',
    dateSubmitted: '2025-05-24',
    dateIssued: '2025-08-11',
    dateCOO: '2025-08-13',
    cost: 3900,
    sqft: 893,
    bedrooms: 2,
    type: 'Attached',
    subtype: 'Internal separation',
    builder: 'DIY',
    builderName: 'Homeowner (all work)',
    builderLocation: null,
    description: 'Separate existing addition (built after 1976) from main house to create ADU. Both already had separate entrances.',
    architect: false,
    engineer: false,
    hersRating: null,
    sprinklers: false,
    notes: 'Minimal work - addition already existed with separate entrance',
  },
]

const formatCost = (cost: number) => {
  if (cost >= 1000000) return '$' + (cost / 1000000).toFixed(2) + 'M'
  if (cost >= 1000) return '$' + Math.round(cost / 1000) + 'K'
  return '$' + cost.toLocaleString()
}

const formatDate = (date: string | null) => {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function LexingtonPage() {
  const totalPermits = permits.length
  const totalCost = permits.reduce((sum, p) => sum + p.cost, 0)
  const avgCost = Math.round(totalCost / totalPermits)
  const completedPermits = permits.filter(p => p.status === 'Complete').length
  
  const detachedPermits = permits.filter(p => p.type === 'Detached')
  const attachedPermits = permits.filter(p => p.type === 'Attached')
  
  const diyPermits = permits.filter(p => p.builder === 'DIY')
  const contractorPermits = permits.filter(p => p.builder === 'Contractor')
  
  const diyAvgPpsf = diyPermits.length > 0 
    ? Math.round(diyPermits.reduce((sum, p) => sum + (p.cost / p.sqft), 0) / diyPermits.length)
    : 0
  const contractorAvgPpsf = contractorPermits.length > 0
    ? Math.round(contractorPermits.reduce((sum, p) => sum + (p.cost / p.sqft), 0) / contractorPermits.length)
    : 0

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-4"><Link href="/" className="text-blue-400 text-sm">← Back</Link><TownNav current="Lexington" /></div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Lexington ADU Permits</h1>
        <p className="text-text-secondary text-sm mb-6">Detailed permit data from 2025</p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-800/50 border border-border rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-white">{totalPermits}</div>
            <div className="text-text-muted text-sm">Total Permits</div>
          </div>
          <div className="bg-gray-800/50 border border-border rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-emerald-400">{completedPermits}</div>
            <div className="text-text-muted text-sm">Completed</div>
          </div>
          <div className="bg-gray-800/50 border border-border rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-white">{formatCost(avgCost)}</div>
            <div className="text-text-muted text-sm">Avg Cost</div>
          </div>
          <div className="bg-gray-800/50 border border-border rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-white">{formatCost(totalCost)}</div>
            <div className="text-text-muted text-sm">Total Invested</div>
          </div>
        </div>

        {/* Key Insights */}
        <div className="bg-gray-800/50 border border-border rounded-lg p-4 sm:p-6 mb-6">
          <h2 className="text-white font-medium mb-4">Key Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-700/30 rounded-lg p-4">
              <h3 className="text-text-secondary text-sm mb-2">DIY vs Contractor</h3>
              <div className="flex justify-between items-center mb-2">
                <span className="text-emerald-400">DIY/Homeowner</span>
                <span className="text-white font-medium">${diyAvgPpsf}/sf avg</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-amber-400">Contractor</span>
                <span className="text-white font-medium">${contractorAvgPpsf}/sf avg</span>
              </div>
              <p className="text-text-muted text-xs mt-3">DIY ranges from $4/sf (internal separation) to $167/sf (new detached). Contractor ranges from $89/sf to $635/sf.</p>
            </div>
            <div className="bg-gray-700/30 rounded-lg p-4">
              <h3 className="text-text-secondary text-sm mb-2">Type Breakdown</h3>
              <div className="flex justify-between items-center mb-2">
                <span className="text-blue-400">Detached</span>
                <span className="text-white font-medium">{detachedPermits.length} permits</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-purple-400">Attached/Conversion</span>
                <span className="text-white font-medium">{attachedPermits.length} permits</span>
              </div>
              <p className="text-text-muted text-xs mt-3">Conversions dominate: 3 basement, 1 internal separation. Detached includes 1 ADU-over-garage at $635/sf.</p>
            </div>
          </div>
          <div className="mt-4 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <h3 className="text-blue-400 text-sm font-medium mb-2">Notable: $3,900 ADU</h3>
            <p className="text-text-secondary text-sm">39 Woodpark Cir separated an existing addition (built after 1976) that already had a separate entrance. Minimal work to formalize as ADU. COO issued in 81 days.</p>
          </div>
        </div>

        {/* Permits Table */}
        <div className="bg-gray-800/50 border border-border rounded-lg p-4 sm:p-6">
          <h2 className="text-white font-medium mb-4">All Permits</h2>
          <div className="space-y-4">
            {permits.map((permit) => (
              <div key={permit.id} className="bg-gray-700/30 rounded-lg p-4">
                <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
                  <div>
                    <div className="text-white font-medium">{permit.address}</div>
                    <div className="text-text-muted text-xs">{permit.id} · Submitted {formatDate(permit.dateSubmitted)}</div>
                  </div>
                  <div className="flex gap-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      permit.status === 'Complete' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {permit.status}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      permit.builder === 'DIY' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {permit.builder}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                  <div>
                    <div className="text-text-muted text-xs">Cost</div>
                    <div className="text-white font-medium">{formatCost(permit.cost)}</div>
                  </div>
                  <div>
                    <div className="text-text-muted text-xs">Size</div>
                    <div className="text-white">{permit.sqft} sf</div>
                  </div>
                  <div>
                    <div className="text-text-muted text-xs">$/sf</div>
                    <div className="text-white">${Math.round(permit.cost / permit.sqft)}</div>
                  </div>
                  <div>
                    <div className="text-text-muted text-xs">Bedrooms</div>
                    <div className="text-white">{permit.bedrooms}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                  <div>
                    <div className="text-text-muted text-xs">Type</div>
                    <div className="text-white">{permit.type}</div>
                  </div>
                  <div>
                    <div className="text-text-muted text-xs">Subtype</div>
                    <div className="text-white">{permit.subtype}</div>
                  </div>
                  <div>
                    <div className="text-text-muted text-xs">Architect</div>
                    <div className="text-white">{permit.architect ? 'Yes' : 'No'}</div>
                  </div>
                  <div>
                    <div className="text-text-muted text-xs">HERS Rating</div>
                    <div className="text-white">{permit.hersRating || '—'}</div>
                  </div>
                </div>

                <div className="mb-2">
                  <div className="text-text-muted text-xs">Builder</div>
                  <div className="text-text-secondary text-sm">{permit.builderName}{permit.builderLocation ? ` (${permit.builderLocation})` : ''}</div>
                </div>

                <div>
                  <div className="text-text-muted text-xs">Description</div>
                  <div className="text-text-secondary text-sm">{permit.description}</div>
                </div>

                {permit.notes && (
                  <div className="mt-2 text-xs text-amber-400/80 italic">{permit.notes}</div>
                )}

                {permit.dateCOO && (
                  <div className="mt-2 text-xs text-emerald-400">COO issued: {formatDate(permit.dateCOO)}</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Source */}
        <div className="mt-6 text-text-muted text-xs">
          Source: Town of Lexington Building Department permit records (2025)
        </div>
      </div>
    </div>
  )
}
