import type { TownSEOData } from '@/data/town_seo_data'

// --- Normalized Metrics ---
export function approvalsPerThousandParcels(town: TownSEOData): number | null {
  if (!town.singleFamilyParcels || town.singleFamilyParcels === 0) return null
  return Math.round((town.approved / town.singleFamilyParcels) * 1000 * 100) / 100
}

export function submittedPerThousandParcels(town: TownSEOData): number | null {
  if (!town.singleFamilyParcels || town.singleFamilyParcels === 0) return null
  return Math.round((town.submitted / town.singleFamilyParcels) * 1000 * 100) / 100
}

export function approvalsPerTenThousandResidents(town: TownSEOData): number {
  if (town.population === 0) return 0
  return Math.round(((town.approved / town.population) * 10000) * 10) / 10
}

export function computeStatewidePerCapitaAverage(allTowns: TownSEOData[]): number {
  const withApprovals = allTowns.filter(t => t.approved > 0 && t.population > 0)
  if (withApprovals.length === 0) return 0
  const totalApproved = withApprovals.reduce((sum, t) => sum + t.approved, 0)
  const totalPopulation = withApprovals.reduce((sum, t) => sum + t.population, 0)
  return Math.round(((totalApproved / totalPopulation) * 10000) * 10) / 10
}

// --- Timeline Computation ---
export interface PermitRecord {
  permit: string
  address: string
  applied: string
  issued: string
  status: string
  cost: number
  sqft: number
  type: string
  contractor: string
  notes: string
}

export interface TimelineStats {
  medianDays: number
  minDays: number
  maxDays: number
  avgDays: number
  count: number
  permits: { address: string; days: number; applied: string; issued: string }[]
}

function parseDate(dateStr: string): Date | null {
  if (!dateStr || dateStr.trim() === '') return null
  const parts = dateStr.split('/')
  if (parts.length === 3) {
    const month = parseInt(parts[0]) - 1
    const day = parseInt(parts[1])
    const year = parseInt(parts[2]) + (parseInt(parts[2]) < 100 ? 2000 : 0)
    return new Date(year, month, day)
  }
  return null
}

function daysBetween(d1: Date, d2: Date): number {
  return Math.round(Math.abs(d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24))
}

export function computeTimelines(permits: PermitRecord[]): TimelineStats | null {
  const withTimelines = permits
    .filter(p => p.applied && p.issued && p.status === 'Issued')
    .map(p => {
      const applied = parseDate(p.applied)
      const issued = parseDate(p.issued)
      if (!applied || !issued) return null
      return { address: p.address, days: daysBetween(applied, issued), applied: p.applied, issued: p.issued }
    })
    .filter((p): p is NonNullable<typeof p> => p !== null && p.days > 0)
    .sort((a, b) => a.days - b.days)

  if (withTimelines.length === 0) return null

  const days = withTimelines.map(p => p.days)
  const mid = Math.floor(days.length / 2)
  const median = days.length % 2 === 0 ? Math.round((days[mid - 1] + days[mid]) / 2) : days[mid]

  return {
    medianDays: median,
    minDays: days[0],
    maxDays: days[days.length - 1],
    avgDays: Math.round(days.reduce((a, b) => a + b, 0) / days.length),
    count: days.length,
    permits: withTimelines,
  }
}

// --- Cost Analysis ---
export interface CostStats {
  min: number
  max: number
  median: number
  avg: number
  count: number
  byType: Record<string, { min: number; max: number; avg: number; count: number }>
}

export function computeCostStats(permits: PermitRecord[]): CostStats | null {
  const withCosts = permits.filter(p => p.cost > 0).sort((a, b) => a.cost - b.cost)
  if (withCosts.length === 0) return null

  const costs = withCosts.map(p => p.cost)
  const mid = Math.floor(costs.length / 2)
  const median = costs.length % 2 === 0 ? Math.round((costs[mid - 1] + costs[mid]) / 2) : costs[mid]

  const byType: CostStats['byType'] = {}
  withCosts.forEach(p => {
    if (!byType[p.type]) byType[p.type] = { min: Infinity, max: 0, avg: 0, count: 0 }
    const t = byType[p.type]
    t.min = Math.min(t.min, p.cost)
    t.max = Math.max(t.max, p.cost)
    t.avg = ((t.avg * t.count) + p.cost) / (t.count + 1)
    t.count++
  })
  // Round averages
  Object.values(byType).forEach(t => { t.avg = Math.round(t.avg) })

  return {
    min: costs[0],
    max: costs[costs.length - 1],
    median,
    avg: Math.round(costs.reduce((a, b) => a + b, 0) / costs.length),
    count: costs.length,
    byType,
  }
}

// --- Town Scorecard ---
export interface TownScorecard {
  overall: 'A' | 'B' | 'C' | 'D' | 'F'
  overallScore: number
  rulesFriction: 'Low' | 'Medium' | 'High'
  rulesFrictionScore: number
  operationalFriction: 'Low' | 'Medium' | 'High'
  operationalFrictionScore: number
  factors: string[]
}

export function computeScorecard(town: TownSEOData, timelineStats?: TimelineStats | null): TownScorecard {
  // Rules friction: based on approval rate and by-right status
  let rulesScore = 0
  if (town.byRight) rulesScore += 40
  if (town.approvalRate >= 80) rulesScore += 40
  else if (town.approvalRate >= 60) rulesScore += 25
  else if (town.approvalRate >= 40) rulesScore += 15
  else rulesScore += 5
  if (town.denied === 0) rulesScore += 20
  else if (town.denied <= 2) rulesScore += 10

  // Operational friction: based on pending ratio, timeline, volume
  let opsScore = 0
  const pendingRate = town.submitted > 0 ? town.pending / town.submitted : 0
  if (pendingRate <= 0.1) opsScore += 30
  else if (pendingRate <= 0.25) opsScore += 20
  else if (pendingRate <= 0.4) opsScore += 10
  else opsScore += 0

  if (timelineStats) {
    if (timelineStats.medianDays <= 30) opsScore += 40
    else if (timelineStats.medianDays <= 60) opsScore += 30
    else if (timelineStats.medianDays <= 90) opsScore += 20
    else opsScore += 10
  } else {
    // No timeline data — estimate from pending ratio
    if (pendingRate <= 0.15) opsScore += 25
    else opsScore += 15
  }

  if (town.submitted >= 15) opsScore += 30
  else if (town.submitted >= 8) opsScore += 20
  else opsScore += 10

  // Normalize to 100
  rulesScore = Math.min(100, rulesScore)
  opsScore = Math.min(100, opsScore)
  const overall = Math.round((rulesScore + opsScore) / 2)

  const factors: string[] = []
  if (town.byRight) factors.push('By-right ADU construction enabled')
  else factors.push('May require special permit or variance')
  if (town.approvalRate >= 80) factors.push(`High approval rate (${town.approvalRate}%)`)
  else if (town.approvalRate >= 50) factors.push(`Moderate approval rate (${town.approvalRate}%)`)
  else factors.push(`Low approval rate (${town.approvalRate}%) — higher friction expected`)
  if (town.denied === 0) factors.push('Zero denials on record')
  if (pendingRate > 0.35) factors.push(`High pending backlog (${Math.round(pendingRate * 100)}% of applications)`)
  if (timelineStats) factors.push(`Median review time: ${timelineStats.medianDays} days`)
  if (town.submitted >= 20) factors.push('High permit volume — experienced building department')
  else if (town.submitted <= 5) factors.push('Low permit volume — limited track record')

  const grade = (s: number): 'A' | 'B' | 'C' | 'D' | 'F' =>
    s >= 80 ? 'A' : s >= 65 ? 'B' : s >= 50 ? 'C' : s >= 35 ? 'D' : 'F'
  const friction = (s: number): 'Low' | 'Medium' | 'High' =>
    s >= 65 ? 'Low' : s >= 40 ? 'Medium' : 'High'

  return {
    overall: grade(overall),
    overallScore: overall,
    rulesFriction: friction(rulesScore),
    rulesFrictionScore: rulesScore,
    operationalFriction: friction(opsScore),
    operationalFrictionScore: opsScore,
    factors,
  }
}

// --- CSV Export ---
export function townToCSVRow(town: TownSEOData): Record<string, string | number> {
  const perK = approvalsPerThousandParcels(town)
  return {
    Town: town.name,
    County: town.county,
    Population: town.population,
    'Single Family Parcels (est.)': town.singleFamilyParcels || 'N/A',
    'Applications Submitted': town.submitted,
    Approved: town.approved,
    Denied: town.denied,
    Pending: town.pending,
    'Approval Rate (%)': town.approvalRate,
    'Approvals per 1K Parcels': perK ?? 'N/A',
    'By Right': town.byRight ? 'Yes' : 'No',
    'Avg Rent': town.avgRent || 'N/A',
    'Median Home Value': town.medianHome || 'N/A',
    Source: town.source,
  }
}

export function generateCSV(towns: TownSEOData[]): string {
  const rows = towns.map(townToCSVRow)
  if (rows.length === 0) return ''
  const headers = Object.keys(rows[0])
  const lines = [
    headers.join(','),
    ...rows.map(row => headers.map(h => {
      const val = row[h]
      const str = String(val)
      return str.includes(',') ? `"${str}"` : str
    }).join(','))
  ]
  return lines.join('\n')
}

export function downloadCSV(filename: string, csvContent: string) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  link.click()
  URL.revokeObjectURL(link.href)
}

export function permitToCSVRow(permit: PermitRecord, town: string): Record<string, string | number> {
  return {
    Town: town,
    Permit: permit.permit,
    Address: permit.address,
    Applied: permit.applied,
    Issued: permit.issued,
    Status: permit.status,
    'Est. Cost': permit.cost || 'N/A',
    'Sq Ft': permit.sqft || 'N/A',
    Type: permit.type,
    Contractor: permit.contractor,
    Notes: permit.notes,
  }
}

export function generatePermitCSV(permits: PermitRecord[], town: string): string {
  const rows = permits.map(p => permitToCSVRow(p, town))
  if (rows.length === 0) return ''
  const headers = Object.keys(rows[0])
  const lines = [
    headers.join(','),
    ...rows.map(row => headers.map(h => {
      const val = row[h]
      const str = String(val)
      return str.includes(',') || str.includes('"') ? `"${str.replace(/"/g, '""')}"` : str
    }).join(','))
  ]
  return lines.join('\n')
}
