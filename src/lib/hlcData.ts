import hlcTowns from '@/data/hlc_adu_data.json'

export interface HLCTown {
  name: string
  muni_id: number | null
  applications: number
  approved: number
  rejected: number
  detached_apps: number
  attached_apps: number
  lat: number | null
  lng: number | null
}

export function getHLCStats() {
  const totalApplications = hlcTowns.reduce((sum, t) => sum + t.applications, 0)
  const totalApproved = hlcTowns.reduce((sum, t) => sum + t.approved, 0)
  const totalRejected = hlcTowns.reduce((sum, t) => sum + t.rejected, 0)
  const townsWithData = hlcTowns.filter(t => t.applications > 0).length
  
  return {
    totalApplications,
    totalApproved,
    totalRejected,
    townsReporting: hlcTowns.length,
    townsWithData
  }
}

export function getHLCTopTowns(limit = 20): HLCTown[] {
  return [...hlcTowns]
    .sort((a, b) => b.approved - a.approved)
    .slice(0, limit)
}

export function getAllHLCTowns(): HLCTown[] {
  return hlcTowns as HLCTown[]
}
