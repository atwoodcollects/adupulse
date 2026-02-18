import townSEOData from '@/data/town_seo_data'
import { buildingPermitMap } from '@/data/building_permits_2024'
import { allEntries, narrativeCities, getStatusCounts } from '@/app/compliance/compliance-data'

// ── Base system prompt (short, no data) ──

export const BASE_SYSTEM_PROMPT = `You are ADU Pulse's assistant. You give short, conversational answers — 3-4 sentences max, then link to the relevant page. Never list more than 2-3 towns in a response. For broad questions, give the headline stat and link to /compliance. For specific town questions, give the key facts and link to /towns/[townname]. No markdown, no headers, no bold, no lists. Plain text with paragraph breaks only.

Key law context: Chapter 150 of the Acts of 2024 legalized ADUs statewide effective Feb 2, 2025. MGL c.40A §3 grants the right to build a first ADU by right on any single-family lot. 760 CMR 71.00 has the implementing regulations. Local provisions inconsistent with state law are unenforceable.

When you link to a page, ONLY use relative paths starting with a slash. NEVER output a full URL like https://adupulse.com/anything. NEVER write a placeholder like {slug} or [townname]. Just the relative path.

IMPORTANT — only these towns have compliance profile pages at /compliance/[town]: plymouth, nantucket, leicester, brookline, canton, hanson, new-bedford, newton, andover, milton, duxbury, barnstable, falmouth, sudbury, needham, boston, somerville, worcester, east-bridgewater, weston, upton, wilbraham, quincy, salem, revere, fall-river, lowell, medford. For these towns, you may link to /compliance/[town] for bylaw analysis. For ALL other towns, link to /towns/[town] only. Never send a user to /compliance/[town] for a town not in this list.

Whenever you cite a specific number or data point, briefly mention where it comes from — EOHLC survey, Census ACS, Census Building Permit Survey, AG decision, etc. Keep it natural and inline, like: According to EOHLC survey data, Duxbury has approved 2 of 3 applications. Or: Census data shows Duxbury has a population of about 16,000. Don't add a sources section at the end — just weave attribution into the sentence.

For questions about housing production, building permits, or how ADUs fit into overall construction, cite the relevant stats and link to /housing-production.`

// ── Headline stats for broad questions ──

const stats = (() => {
  const allProvisions = allEntries.flatMap(t => t.provisions)
  const inconsistent = allProvisions.filter(p => p.status === 'inconsistent').length
  const review = allProvisions.filter(p => p.status === 'review').length
  const townsWithIssues = allEntries.filter(t => t.provisions.some(p => p.status === 'inconsistent')).length
  const totalTracked = allEntries.length + narrativeCities.length

  // Top issue categories
  const issueCounts: Record<string, number> = {}
  for (const p of allProvisions.filter(p => p.status === 'inconsistent')) {
    const name = p.provision
    issueCounts[name] = (issueCounts[name] || 0) + 1
  }
  const topIssues = Object.entries(issueCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name, count]) => `${name} (${count} towns)`)

  const totalApproved = townSEOData.filter(t => t.responded).reduce((s, t) => s + t.approved, 0)
  const totalSubmitted = townSEOData.filter(t => t.responded).reduce((s, t) => s + t.submitted, 0)
  const respondedCount = townSEOData.filter(t => t.responded).length

  // Housing production stats (Census Building Permit Survey 2024)
  const respondedWithPermits = townSEOData.filter(t => t.responded && t.submitted > 0)
  const top10ByApproved = [...respondedWithPermits]
    .sort((a, b) => b.approved - a.approved)
    .slice(0, 10)
    .map(t => {
      const bp = buildingPermitMap.get(t.slug)
      const totalBP = bp?.totalUnits || 0
      const aduShare = totalBP >= 10
        ? Math.round((t.approved / totalBP) * 1000) / 10
        : null
      return `${t.name}: ${t.approved} approved of ${t.submitted} submitted${aduShare !== null ? `, ADUs = ${aduShare}% of total building permits` : ''}`
    })

  // Statewide housing production totals (towns with 10+ building permits)
  const sufficientRows = respondedWithPermits.filter(t => {
    const bp = buildingPermitMap.get(t.slug)
    return bp && bp.totalUnits >= 10
  })
  const totalBuildingPermits = sufficientRows.reduce((s, t) => {
    const bp = buildingPermitMap.get(t.slug)
    return s + (bp?.totalUnits || 0)
  }, 0)
  const totalAduApprovedForShare = sufficientRows.reduce((s, t) => s + t.approved, 0)
  const overallAduShare = totalBuildingPermits > 0
    ? Math.round((totalAduApprovedForShare / totalBuildingPermits) * 1000) / 10
    : 0

  return {
    inconsistentProvisions: inconsistent,
    reviewProvisions: review,
    townsWithInconsistencies: townsWithIssues,
    communitiesTracked: totalTracked,
    topIssueTypes: topIssues,
    respondedTowns: respondedCount,
    totalApproved,
    totalSubmitted,
    top10ByApproved,
    totalBuildingPermits,
    totalAduApprovedForShare,
    overallAduShare,
    townsWithBothDatasets: sufficientRows.length,
  }
})()

export function getHeadlineContext(): string {
  return `Headline stats for your reference (use these for broad questions):
${stats.respondedTowns} towns responded to the EOHLC survey. ${stats.totalApproved} ADU permits approved statewide out of ${stats.totalSubmitted} submitted. We've analyzed bylaws for ${stats.communitiesTracked} communities in detail. ${stats.inconsistentProvisions} provisions are inconsistent with state law across ${stats.townsWithInconsistencies} towns. ${stats.reviewProvisions} more are in a grey area. The most common inconsistencies are: ${stats.topIssueTypes.join(', ')}.

Housing production data (Census Building Permit Survey 2024): Across ${stats.townsWithBothDatasets} towns with both ADU and building permit data, ADU approvals account for ${stats.overallAduShare}% of all ${stats.totalBuildingPermits.toLocaleString()} building permits issued. Top 10 towns by ADU approvals: ${stats.top10ByApproved.join('; ')}. For more detail, link users to /housing-production.`
}

// ── Town data lookup ──

const townNameMap = new Map<string, string>() // lowercase name → slug
for (const t of townSEOData) {
  townNameMap.set(t.name.toLowerCase(), t.slug)
}

export function detectTowns(message: string): string[] {
  const lower = message.toLowerCase()
  const found: string[] = []
  townNameMap.forEach((slug, name) => {
    const regex = new RegExp(`\\b${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`)
    if (regex.test(lower)) {
      found.push(slug)
    }
  })
  return found
}

export function getTownContext(slugs: string[]): string {
  const parts: string[] = []

  for (const slug of slugs.slice(0, 3)) { // max 3 towns
    // Permit data
    const seo = townSEOData.find(t => t.slug === slug)
    if (seo) {
      let permitLine = `Permit data for ${seo.name}: ${seo.submitted} submitted, ${seo.approved} approved, ${seo.denied} denied, ${seo.approvalRate}% approval rate. Population ${seo.population.toLocaleString()}, ${seo.county} County. By-right: ${seo.byRight ? 'yes' : 'no'}.`
      // Add building permit context if available
      const bp = buildingPermitMap.get(slug)
      if (bp && bp.totalUnits > 0) {
        const aduShare = bp.totalUnits >= 10
          ? ` ADUs represent ${Math.round((seo.approved / bp.totalUnits) * 1000) / 10}% of total housing production.`
          : ''
        permitLine += ` Census Building Permit Survey 2024: ${bp.totalUnits} total building permits (${bp.singleFamilyUnits} single-family, ${bp.multifamilyUnits} multifamily).${aduShare}`
      }
      parts.push(permitLine)
    }

    // Compliance data
    const compliance = allEntries.find(t => t.slug === slug)
    if (compliance) {
      const counts = getStatusCounts(compliance.provisions)
      let summary = `Bylaw analysis for ${compliance.name}: ${counts.inconsistent} inconsistent, ${counts.review} under review, ${counts.compliant} compliant.`
      if (compliance.bottomLine) summary += ` ${compliance.bottomLine}`
      if (counts.inconsistent > 0) {
        const issues = compliance.provisions
          .filter(p => p.status === 'inconsistent')
          .map(p => p.provision)
          .join(', ')
        summary += ` Inconsistent provisions: ${issues}.`
      }
      parts.push(summary)
    }

    // Narrative data
    const narrative = narrativeCities.find(c => c.slug === slug)
    if (narrative) {
      parts.push(`${narrative.name}: ${narrative.summary} (${narrative.permits.approved} approved, ${narrative.permits.approvalRate}% rate)`)
    }
  }

  return parts.join('\n')
}
