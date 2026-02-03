'use client'

import Link from 'next/link'

const permits = [
  { id: 'B25-001490', address: '43 Shawmut St', status: 'Issued', date: '2026-01-15', description: 'Built a 214SF Kitchen and living room addition connecting to existing master bedroom turning the total of 526SF ADU', sqft: 526, type: 'Addition' },
  { id: 'B25-001422', address: '366 Proctor Ave', status: 'Issued', date: '2026-01-06', description: 'Add an ADU', sqft: null, type: 'Basement' },
  { id: 'B25-001549', address: '93 Bellingham Ave', status: 'Issued', date: '2025-12-17', description: 'ADU', sqft: null, type: 'Basement' },
  { id: 'B25-001424', address: '521 Park Ave', status: 'Issued', date: '2025-12-01', description: 'Construct New 891 sqft ADU in the basement', sqft: 891, type: 'Basement' },
  { id: 'B25-001184', address: '25 Newbury St', status: 'Issued', date: '2025-11-07', description: 'Finish basement as ADU', sqft: null, type: 'Basement' },
  { id: 'B25-001277', address: '42 Butler St', status: 'Issued', date: '2025-10-22', description: 'ADU', sqft: null, type: 'Basement' },
  { id: 'B25-001224', address: '38 Larkin St', status: 'Issued', date: '2025-10-20', description: 'ADU application as per plans', sqft: null, type: 'Basement' },
  { id: 'B25-001156', address: '234 Beach St', status: 'Issued', date: '2025-10-10', description: 'Adding an Accessory Dwelling Unit (ADU) to the basement. Separate MEP permits to follow.', sqft: null, type: 'Basement' },
  { id: 'B25-000973', address: '42 Hopkins St', status: 'Issued', date: '2025-09-29', description: 'ADU single family addition as per plans', sqft: null, type: 'Addition' },
  { id: 'B25-001115', address: '70 Conant St', status: 'Issued', date: '2025-09-23', description: 'Renovate existing enclosed basement to install accessory dwelling unit', sqft: null, type: 'Basement' },
  { id: 'B25-000978', address: '11 Bixby St', status: 'Issued', date: '2025-09-09', description: 'Convert existing basement into a ADU', sqft: null, type: 'Basement' },
  { id: 'B25-000876', address: '5 Dedham St', status: 'Closed', date: '2025-09-05', description: 'Turn an existing basement into an ADU unit and remediate a violation on first floor bathroom', sqft: null, type: 'Basement', note: 'Violation remediation' },
  { id: 'B25-000966', address: '141 Lincoln St', status: 'Closed', date: '2025-08-29', description: 'Additional dwelling unit as per plans', sqft: null, type: 'Basement' },
  { id: 'B25-000861', address: '180 Revere St', status: 'Issued', date: '2025-08-28', description: 'Application for ADU building', sqft: null, type: 'Basement' },
  { id: 'B25-000905', address: '51 Victoria St', status: 'Issued', date: '2025-08-21', description: 'Adding an Accessory Dwelling Unit (ADU) to the basement. Separate sprinkler plans to follow.', sqft: null, type: 'Basement' },
  { id: 'B25-000950', address: '70 Lowe St', status: 'Issued', date: '2025-08-11', description: 'Convert basement into an ADU', sqft: null, type: 'Basement' },
  { id: 'B25-000153', address: '11 Wilson St', status: 'Issued', date: '2025-07-30', description: 'Build Basement ADU unit', sqft: null, type: 'Basement' },
  { id: 'B25-000725', address: '39 Haddon St', status: 'Issued', date: '2025-07-29', description: 'Proposed ADU in basement as per plans provided also to correct current violations on property', sqft: null, type: 'Basement', note: 'Violation correction' },
  { id: 'B25-000680', address: '37 Page St', status: 'Issued', date: '2025-07-23', description: '37 Page Street lower level create ADU unit with two bedrooms for rent', sqft: null, type: 'Basement', bedrooms: 2 },
  { id: 'B25-000702', address: '43 Witherbee Ave', status: 'Issued', date: '2025-07-10', description: 'Correction of existing building code violation. ADU unit on upper level as per plans', sqft: null, type: 'Upper level', note: 'Violation correction' },
  { id: 'B25-000765', address: '35 Liberty Ave', status: 'Issued', date: '2025-07-03', description: 'Construct a ADU unit', sqft: null, type: 'Basement' },
  { id: 'B25-000233', address: '206 Reservoir Ave', status: 'Issued', date: '2025-06-25', description: 'Change existing basement to ADU', sqft: null, type: 'Basement' },
  { id: 'B25-000559', address: '70 Liberty Ave', status: 'Closed', date: '2025-06-03', description: 'Add ADU and addition. Remove and replace roofing shingles, Install new vinyl siding. Remove and replace windows, and new doors. Frame new dormer, Refinish 1st, 2nd floor and basement. New flooring, new blueboard, plaster, new kitchen cabinets. Remodel 3 bathrooms.', sqft: null, type: 'Major renovation + ADU' },
  { id: 'B25-000458', address: '331 Proctor Ave', status: 'Issued', date: '2025-05-23', description: 'Add a bathroom and a wet bar to basement', sqft: null, type: 'Basement' },
  { id: 'B25-000373', address: '132 Breedens', status: 'Issued', date: '2025-04-16', description: 'Add ADU. Add a new egress window', sqft: null, type: 'Basement' },
  { id: 'B25-000323', address: '51 Oakwood Ave', status: 'Closed', date: '2025-04-08', description: 'Adding kitchen and bedroom downstairs', sqft: null, type: 'Basement' },
  { id: 'B24-001690', address: '134 Reservoir Ave', status: 'Closed', date: '2025-02-25', description: 'Add ADU', sqft: null, type: 'Basement' },
  { id: 'B24-000967', address: '67 Curtis Rd', status: 'Issued', date: '2025-02-11', description: 'Install kitchen, flooring and remodel bathroom', sqft: null, type: 'Basement' },
  { id: 'B24-001611', address: '36 Festa Rd', status: 'Issued', date: '2025-02-11', description: 'ADU', sqft: null, type: 'Basement' },
  { id: 'B25-000048', address: '91 Fenley St', status: 'Closed', date: '2025-02-10', description: 'Add ADU in basement. Legalize work done without permits: Kitchens, bathrooms, electrical work, front retaining wall, front steps.', sqft: null, type: 'Basement', note: 'Legalizing prior work' },
  { id: 'B25-000078', address: '22 Conant St', status: 'Closed', date: '2025-02-10', description: 'ADU', sqft: null, type: 'Basement' },
  { id: 'B24-001526', address: '104 Cummings Ave', status: 'Closed', date: '2025-02-03', description: 'Add kitchen and bathroom in the basement to create ADU', sqft: null, type: 'Basement' },
  { id: 'B25-000063', address: '98 Atlantic Ave', status: 'Issued', date: '2025-01-31', description: 'ADU', sqft: null, type: 'Basement' },
]

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function ReverePage() {
  const totalPermits = permits.length
  const issuedPermits = permits.filter(p => p.status === 'Issued').length
  const closedPermits = permits.filter(p => p.status === 'Closed').length
  
  const basementCount = permits.filter(p => p.type === 'Basement').length
  const additionCount = permits.filter(p => p.type === 'Addition' || p.type === 'Major renovation + ADU').length
  const otherCount = permits.filter(p => p.type === 'Upper level').length
  
  const violationCount = permits.filter(p => p.note?.includes('Violation') || p.note?.includes('Legalizing')).length

  const permitsWithSqft = permits.filter(p => p.sqft)
  const avgSqft = permitsWithSqft.length > 0 
    ? Math.round(permitsWithSqft.reduce((sum, p) => sum + (p.sqft || 0), 0) / permitsWithSqft.length)
    : null

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <Link href="/" className="text-blue-400 text-sm mb-2 inline-block">← Back</Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Revere ADU Permits</h1>
        <p className="text-text-secondary text-sm mb-6">Jan 2025 - Jan 2026</p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-800/50 border border-border rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-white">{totalPermits}</div>
            <div className="text-text-muted text-sm">Total Permits</div>
          </div>
          <div className="bg-gray-800/50 border border-border rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-emerald-400">{issuedPermits}</div>
            <div className="text-text-muted text-sm">Issued</div>
          </div>
          <div className="bg-gray-800/50 border border-border rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-blue-400">{closedPermits}</div>
            <div className="text-text-muted text-sm">Closed</div>
          </div>
          <div className="bg-gray-800/50 border border-border rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-white">{avgSqft ? `${avgSqft} sf` : '—'}</div>
            <div className="text-text-muted text-sm">Avg Size</div>
          </div>
        </div>

        {/* Key Insights */}
        <div className="bg-gray-800/50 border border-border rounded-lg p-4 sm:p-6 mb-6">
          <h2 className="text-white font-medium mb-4">Key Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-700/30 rounded-lg p-4">
              <h3 className="text-text-secondary text-sm mb-2">Type Breakdown</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-purple-400">Basement Conversions</span>
                  <span className="text-white font-medium">{basementCount} ({Math.round(basementCount/totalPermits*100)}%)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-400">Additions</span>
                  <span className="text-white font-medium">{additionCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-amber-400">Upper Level</span>
                  <span className="text-white font-medium">{otherCount}</span>
                </div>
              </div>
              <p className="text-text-muted text-xs mt-3">Revere is almost entirely basement conversions - different pattern than suburban towns.</p>
            </div>
            <div className="bg-gray-700/30 rounded-lg p-4">
              <h3 className="text-text-secondary text-sm mb-2">Permit Velocity</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary">Permits per month</span>
                  <span className="text-white font-medium">~3</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary">100% approval rate</span>
                  <span className="text-emerald-400 font-medium">✓</span>
                </div>
              </div>
              <p className="text-text-muted text-xs mt-3">Steady flow of permits throughout 2025. No denials in dataset.</p>
            </div>
          </div>
          <div className="mt-4 bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
            <h3 className="text-amber-400 text-sm font-medium mb-2">Legalizing Existing Work: {violationCount} permits</h3>
            <p className="text-text-secondary text-sm">Several permits mention "correcting violations" or "legalizing work done without permits" - suggests basement ADUs were already common in Revere before formal permitting.</p>
          </div>
        </div>

        {/* Permits Table */}
        <div className="bg-gray-800/50 border border-border rounded-lg p-4 sm:p-6">
          <h2 className="text-white font-medium mb-4">All Permits ({totalPermits})</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-text-secondary border-b border-border">
                  <th className="text-left p-2">Address</th>
                  <th className="text-left p-2">Type</th>
                  <th className="text-left p-2">Sqft</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Date</th>
                  <th className="text-left p-2 hidden md:table-cell">Description</th>
                </tr>
              </thead>
              <tbody>
                {permits.map((permit) => (
                  <tr key={permit.id} className="border-b border-border/50 hover:bg-gray-700/20">
                    <td className="p-2">
                      <div className="text-white">{permit.address}</div>
                      <div className="text-text-muted text-xs">{permit.id}</div>
                    </td>
                    <td className="p-2">
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        permit.type === 'Basement' ? 'bg-purple-500/20 text-purple-400' :
                        permit.type === 'Addition' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-amber-500/20 text-amber-400'
                      }`}>
                        {permit.type}
                      </span>
                    </td>
                    <td className="p-2 text-text-secondary">{permit.sqft || '—'}</td>
                    <td className="p-2">
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        permit.status === 'Issued' ? 'bg-emerald-500/20 text-emerald-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {permit.status}
                      </span>
                    </td>
                    <td className="p-2 text-text-secondary">{formatDate(permit.date)}</td>
                    <td className="p-2 text-text-muted text-xs hidden md:table-cell max-w-xs truncate">{permit.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Note about cost data */}
        <div className="mt-6 bg-gray-800/50 border border-border rounded-lg p-4">
          <p className="text-text-muted text-sm">💡 <strong className="text-white">Cost data coming soon.</strong> Revere permits don't display costs in the public search - need to dig into individual applications for estimates.</p>
        </div>

        {/* Source */}
        <div className="mt-4 text-text-muted text-xs">
          Source: City of Revere Building Department permit records via Citizenserve portal
        </div>
      </div>
    </div>
  )
}
