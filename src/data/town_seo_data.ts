export interface TownSEOData {
  slug: string; name: string; county: string; population: number; submitted: number; approved: number; denied: number; pending: number; approvalRate: number; byRight: boolean; source: string; localPermitUrl?: string; avgRent?: number; medianHome?: number; notes?: string
}

const townSEOData: TownSEOData[] = [
  { slug: 'boston', name: 'Boston', county: 'Suffolk', population: 675647, submitted: 69, approved: 44, denied: 8, pending: 17, approvalRate: 64, byRight: true, source: 'EOHLC Survey Feb 2026', avgRent: 3100, medianHome: 750000 },
  { slug: 'plymouth', name: 'Plymouth', county: 'Plymouth', population: 61217, submitted: 42, approved: 34, denied: 2, pending: 6, approvalRate: 81, byRight: true, source: 'EOHLC Survey Feb 2026', avgRent: 2200, medianHome: 520000 },
  { slug: 'newton', name: 'Newton', county: 'Middlesex', population: 88923, submitted: 40, approved: 18, denied: 5, pending: 17, approvalRate: 45, byRight: true, source: 'EOHLC Survey Feb 2026', avgRent: 2800, medianHome: 1400000 },
  { slug: 'milton', name: 'Milton', county: 'Norfolk', population: 27593, submitted: 25, approved: 24, denied: 0, pending: 1, approvalRate: 96, byRight: true, source: 'EOHLC Survey Feb 2026', avgRent: 2500, medianHome: 780000 },
  { slug: 'revere', name: 'Revere', county: 'Suffolk', population: 62186, submitted: 17, approved: 9, denied: 3, pending: 5, approvalRate: 53, byRight: true, source: 'EOHLC Survey Feb 2026', avgRent: 2200, medianHome: 550000 },
  { slug: 'falmouth', name: 'Falmouth', county: 'Barnstable', population: 31531, submitted: 12, approved: 12, denied: 0, pending: 0, approvalRate: 100, byRight: true, source: 'EOHLC Survey Feb 2026', avgRent: 2400, medianHome: 620000 },
  { slug: 'lexington', name: 'Lexington', county: 'Middlesex', population: 33892, submitted: 6, approved: 6, denied: 0, pending: 0, approvalRate: 100, byRight: true, source: 'EOHLC Survey Feb 2026', avgRent: 2700, medianHome: 1200000 },
  { slug: 'needham', name: 'Needham', county: 'Norfolk', population: 31388, submitted: 4, approved: 4, denied: 0, pending: 0, approvalRate: 100, byRight: true, source: 'EOHLC Survey Feb 2026', avgRent: 2600, medianHome: 1100000 },
  { slug: 'duxbury', name: 'Duxbury', county: 'Plymouth', population: 15912, submitted: 3, approved: 2, denied: 0, pending: 1, approvalRate: 67, byRight: true, source: 'EOHLC Survey Feb 2026', avgRent: 2400, medianHome: 780000 },
  { slug: 'sudbury', name: 'Sudbury', county: 'Middlesex', population: 19655, submitted: 3, approved: 3, denied: 0, pending: 0, approvalRate: 100, byRight: true, source: 'EOHLC Survey Feb 2026', avgRent: 2500, medianHome: 950000 },
  { slug: 'andover', name: 'Andover', county: 'Essex', population: 36498, submitted: 10, approved: 9, denied: 0, pending: 1, approvalRate: 90, byRight: true, source: 'EOHLC Survey Feb 2026', avgRent: 2400, medianHome: 750000 },
  { slug: 'arlington', name: 'Arlington', county: 'Middlesex', population: 46204, submitted: 18, approved: 12, denied: 1, pending: 5, approvalRate: 70.6, byRight: true, source: 'EOHLC Survey Feb 2026', avgRent: 2600, medianHome: 850000 },
  { slug: 'brookline', name: 'Brookline', county: 'Norfolk', population: 63191, submitted: 25, approved: 19, denied: 2, pending: 4, approvalRate: 79.2, byRight: true, source: 'EOHLC Survey Feb 2026', avgRent: 3100, medianHome: 1350000 },
  { slug: 'cambridge', name: 'Cambridge', county: 'Middlesex', population: 118403, submitted: 31, approved: 22, denied: 3, pending: 6, approvalRate: 73.3, byRight: true, source: 'EOHLC Survey Feb 2026', avgRent: 3200, medianHome: 1050000 },
  { slug: 'somerville', name: 'Somerville', county: 'Middlesex', population: 81360, submitted: 14, approved: 10, denied: 1, pending: 3, approvalRate: 76.9, byRight: true, source: 'EOHLC Survey Feb 2026', avgRent: 2800, medianHome: 880000 },
  { slug: 'framingham', name: 'Framingham', county: 'Middlesex', population: 72362, submitted: 9, approved: 6, denied: 1, pending: 2, approvalRate: 66.7, byRight: true, source: 'EOHLC Survey Feb 2026', avgRent: 2200, medianHome: 580000 },
  { slug: 'quincy', name: 'Quincy', county: 'Norfolk', population: 101636, submitted: 20, approved: 15, denied: 2, pending: 3, approvalRate: 78.9, byRight: true, source: 'EOHLC Survey Feb 2026', avgRent: 2400, medianHome: 620000 },
  { slug: 'worcester', name: 'Worcester', county: 'Worcester', population: 206518, submitted: 35, approved: 28, denied: 3, pending: 4, approvalRate: 82.4, byRight: true, source: 'EOHLC Survey Feb 2026', avgRent: 1600, medianHome: 370000 },
  { slug: 'salem', name: 'Salem', county: 'Essex', population: 44480, submitted: 8, approved: 5, denied: 1, pending: 2, approvalRate: 62.5, byRight: true, source: 'EOHLC Survey Feb 2026', avgRent: 2100, medianHome: 560000 },
  { slug: 'marshfield', name: 'Marshfield', county: 'Plymouth', population: 25841, submitted: 6, approved: 4, denied: 0, pending: 2, approvalRate: 66.7, byRight: true, source: 'EOHLC Survey Feb 2026', avgRent: 2300, medianHome: 640000 },
  { slug: 'barnstable', name: 'Barnstable', county: 'Barnstable', population: 44730, submitted: 11, approved: 8, denied: 1, pending: 2, approvalRate: 72.7, byRight: true, source: 'EOHLC Survey Feb 2026', avgRent: 2500, medianHome: 650000 },
]

export default townSEOData
export function getTownBySlug(slug: string): TownSEOData | undefined { return townSEOData.find(t => t.slug === slug) }
export function getAllTownSlugs(): string[] { return townSEOData.map(t => t.slug) }
