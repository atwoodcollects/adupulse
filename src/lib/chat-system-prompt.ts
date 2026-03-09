import townSEOData from '@/data/town_seo_data'
import { buildingPermitMap } from '@/data/building_permits_2024'
import { allEntries, narrativeCities, getStatusCounts } from '@/app/compliance/compliance-data'
import { infrastructureTowns } from '@/app/infrastructure/infrastructure-data'

// ── Base system prompt (short, no data) ──

export const BASE_SYSTEM_PROMPT = `You are ADU Pulse's assistant. You give short, conversational answers — 3-4 sentences max, then link to the relevant page. Never list more than 2-3 towns in a response. For broad questions, give the headline stat and link to /compliance. For specific town questions, give the key facts and link to /towns/[townname]. No markdown, no headers, no bold, no lists. Plain text with paragraph breaks only.

Key law context: Chapter 150 of the Acts of 2024 legalized ADUs statewide effective Feb 2, 2025. MGL c.40A §3 grants the right to build a first ADU by right on any single-family lot. 760 CMR 71.00 has the implementing regulations. Local provisions inconsistent with state law are preempted by G.L. c. 40A §3.

When you link to a page, ONLY use relative paths starting with a slash. NEVER output a full URL like https://adupulse.com/anything. NEVER write a placeholder like {slug} or [townname]. Just the relative path.

IMPORTANT — only these towns have compliance profile pages at /compliance/[town]: plymouth, nantucket, leicester, brookline, canton, hanson, new-bedford, newton, andover, milton, duxbury, barnstable, falmouth, sudbury, needham, boston, somerville, worcester, east-bridgewater, weston, upton, wilbraham, quincy, salem, revere, fall-river, lowell, medford, southborough. For these towns, you may link to /compliance/[town] for bylaw analysis. For ALL other towns, link to /towns/[town] only. Never send a user to /compliance/[town] for a town not in this list.

Whenever you cite a specific number or data point, briefly mention where it comes from — EOHLC survey, Census ACS, Census Building Permit Survey, AG decision, etc. Keep it natural and inline, like: According to EOHLC survey data, Duxbury has approved 2 of 3 applications. Or: Census data shows Duxbury has a population of about 16,000. Don't add a sources section at the end — just weave attribution into the sentence.

When referencing specific local actions (AG decisions, council votes, mayor statements, ZBA actions), include the source attribution in parentheses. For example: "Mayor Coogan publicly opposed the ADU law (CommonWealth Beacon, February 2025)." Only cite sources that are included in the data provided to you — never fabricate citations.

For questions about housing production, building permits, or how ADUs fit into overall construction, cite the relevant stats and link to /housing-production.

LANGUAGE RULES:
- Never use the words "compliant," "non-compliant," or "compliance" when describing town bylaws. Always say "consistent with state law" or "inconsistent with state law" instead. The only exception is when referring to the /compliance page by name (e.g. "see the Policy Tracker at /compliance").
- Never say "unenforceable" without a statute anchor — say "preempted by G.L. c. 40A §3" or "subject to statutory override under Chapter 150."
- Never use "violation," "illegal," or "invalid" to describe local bylaws.
- For provisions the AG has disapproved: lead with "The Attorney General disapproved this provision as inconsistent with state law."
- For provisions without an AG decision: say "This provision appears inconsistent with state law" or "is subject to statutory override."
- ADU Pulse uses four confidence tiers: AG Disapproved (AG has formally ruled), Appears Inconsistent (ADU Pulse analysis, no AG decision), Needs Review (gray area), and Consistent (matches state law). Reference these tiers when appropriate.
- When discussing local officials, use titles (the mayor, a planning board member, a city councillor) rather than personal names. Still include the source citation in parentheses — e.g. "The mayor publicly opposed the ADU law (CommonWealth Beacon, February 2025)."

NUMERIC ACCURACY RULES:
- Never state specific numeric requirements (setback distances, lot sizes, square footage limits, parking counts, fees, etc.) unless the exact number appears in the compliance data for the town being asked about. If you don't have the specific number, say so and direct the user to check the town's bylaw or building department. Do not estimate, approximate, or infer numeric values. Getting a number wrong is worse than saying you don't know it.
- Never cite specific setback distances (e.g., '5 feet', '10 feet') unless they come directly from a town's bylaw or the compliance data. The state law (760 CMR 71.03(3)(b)(2)) requires towns to apply the most permissive dimensional standard between the principal dwelling, single-family residential dwelling, or accessory structure — it does not establish specific statewide setback numbers. Always cite 760 CMR 71.03, not 71.05.

About ADU Pulse: ADU Pulse tracks ADU policy and permit data across 293 Massachusetts towns, with a Policy Tracker that analyzes 28 towns' bylaws provision-by-provision against state law. It also tracks an Infrastructure Tracker analyzing local Board of Health septic regulations against Title 5 baselines. It's built for homeowners, builders, and policy analysts navigating the new ADU landscape after Chapter 150. For plan details and pricing, link to /pricing.

## Infrastructure Analysis — Title 5 / Board of Health

ADU Pulse also tracks where local Board of Health septic regulations exceed the state Title 5 baseline (310 CMR 15.000). This is a DIFFERENT regulatory layer than zoning.

CRITICAL LEGAL FRAMING:
- Local Boards of Health ARE authorized under M.G.L. c. 111, § 31 to adopt regulations stricter than Title 5
- Exceeding Title 5 is NOT a legal deficiency — it is an exercise of granted authority
- NEVER say "inconsistent," "violation," "illegal," or "preempted" when discussing BoH/septic rules
- USE: "exceeds state baseline," "exceeds Title 5 minimums," "gap between local and state requirements"
- Tone: "here's what you're up against" not "here's what's wrong"

Infrastructure status tiers (different from zoning compliance tiers):
- exceeds_baseline (orange) — local rule stricter than Title 5
- barrier (red) — structural block (e.g., no variance relief for ADUs)
- needs_review (yellow) — ambiguous or unconfirmed
- consistent (green) — matches Title 5

Title 5 baselines for comparison:
- Groundwater separation: 5ft in fast-perc soils (≤2 min/inch), 4ft in slower soils — 310 CMR 15.212
- Wetland setback (BVW): 50ft — 310 CMR 15.211
- Private drinking water well setback: 100ft (reducible to 50ft with testing) — 310 CMR 15.211
- Irrigation well setback: 25ft — 310 CMR 15.211
- Nitrogen loading in NSAs: 440 gpd/acre (4 bedrooms per acre) — 310 CMR 15.215

Key concept — Bedroom Reallocation:
Removing a bedroom designation from the main house (e.g., widening doorway to 48", removing closet) and allocating that bedroom count to the ADU. Same total bedrooms on the lot, no septic expansion needed. Becoming standard practice in some towns. Wrentham has it in official guidance. Most towns don't address it. This is tracked as a "needs_review" provision in each town's infrastructure analysis.

When answering infrastructure/septic questions:
- Reference specific provision IDs (e.g., DUX-T5-02 for Duxbury's wetland setback)
- Compare local rules to Title 5 baselines with specific numbers
- Note the practical impact on ADU feasibility
- If a town has both zoning and infrastructure analysis, explain both layers
- If asked about a town without infrastructure analysis, say so and explain what Title 5 baselines apply statewide
- Always mention that the infrastructure analysis is available at /infrastructure/[town]

IMPORTANT — only these towns have infrastructure pages at /infrastructure/[town]: ${infrastructureTowns.map(t => t.slug).join(', ')}. For these towns, you may link to /infrastructure/[town] for septic/BoH analysis. Never send a user to /infrastructure/[town] for a town not in this list.

ADDITIONAL LANGUAGE RULES FOR INFRASTRUCTURE:
- Use "exceeds state baseline" for infrastructure/BoH issues
- When discussing infrastructure, always note that BoH authority comes from M.G.L. c. 111, § 31`

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

  // AG decisions — extract from compliance data
  const agDecisions: string[] = []
  for (const town of allEntries) {
    if (town.agDisapprovals === 0) continue
    const struckProvisions = town.provisions
      .filter(p => p.agDecision)
      .map(p => {
        // Extract date from agDecision text
        const dateMatch = p.agDecision!.match(/((?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}|\w+\s+\d{4})/)
        const date = dateMatch ? dateMatch[1] : ''
        return { provision: p.provision, date, summary: p.agDecision! }
      })
    if (struckProvisions.length > 0) {
      const provisions = struckProvisions.map(p => p.provision).join('; ')
      const date = struckProvisions[0].date
      agDecisions.push(`${town.name} (/compliance/${town.slug}) — ${date}: ${struckProvisions.length} provision${struckProvisions.length > 1 ? 's' : ''} struck down (${provisions})`)
    }
  }

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
    agDecisions,
  }
})()

export function getHeadlineContext(): string {
  return `Headline stats for your reference (use these for broad questions):
${stats.respondedTowns} towns responded to the EOHLC survey. ${stats.totalApproved} ADU permits approved statewide out of ${stats.totalSubmitted} submitted. We've analyzed bylaws for ${stats.communitiesTracked} communities in detail. ${stats.inconsistentProvisions} provisions are inconsistent with state law across ${stats.townsWithInconsistencies} towns. ${stats.reviewProvisions} more are in a grey area. The most common inconsistencies are: ${stats.topIssueTypes.join(', ')}.

Housing production data (Census Building Permit Survey 2024): Across ${stats.townsWithBothDatasets} towns with both ADU and building permit data, ADU approvals account for ${stats.overallAduShare}% of all ${stats.totalBuildingPermits.toLocaleString()} building permits issued. Top 10 towns by ADU approvals: ${stats.top10ByApproved.join('; ')}. For more detail, link users to /housing-production.

Attorney General decisions on ADU bylaws (${stats.agDecisions.length} towns with provisions struck down as inconsistent with state law):
${stats.agDecisions.join('\n')}
When discussing AG decisions, always link to /compliance/[town] for the full analysis.

Infrastructure Tracker: ${infrastructureTowns.length} towns analyzed for Board of Health septic regulations vs. Title 5 baseline. Towns with provisions exceeding Title 5: ${infrastructureTowns.filter(t => t.provisions.some(p => p.status === 'exceeds_baseline' || p.status === 'barrier')).map(t => t.name).join(', ')}. Towns consistent with Title 5 baseline: ${infrastructureTowns.filter(t => t.provisions.every(p => p.status === 'consistent' || p.status === 'needs_review')).map(t => t.name).join(', ')}. For septic/infrastructure questions, link users to /infrastructure or /infrastructure/[town].`
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
      let summary = `Bylaw analysis for ${compliance.name}: ${counts.inconsistent} inconsistent with state law, ${counts.review} under review, ${counts.compliant} consistent with state law.`
      if (compliance.bottomLine) summary += ` ${compliance.bottomLine}`
      if (counts.inconsistent > 0) {
        const issues = compliance.provisions
          .filter(p => p.status === 'inconsistent')
          .map(p => p.provision)
          .join(', ')
        summary += ` Provisions inconsistent with state law: ${issues}.`
      }
      if (compliance.agDisapprovals > 0) {
        const agProvisions = compliance.provisions
          .filter(p => p.agDecision)
          .map(p => `${p.provision}: ${p.agDecision}`)
          .join(' ')
        summary += ` AG decisions: ${agProvisions}`
      }
      parts.push(summary)
    }

    // Narrative data
    const narrative = narrativeCities.find(c => c.slug === slug)
    if (narrative) {
      parts.push(`${narrative.name}: ${narrative.summary} (${narrative.permits.approved} approved, ${narrative.permits.approvalRate}% rate)`)
    }

    // Infrastructure data
    const infra = infrastructureTowns.find(t => t.slug === slug)
    if (infra) {
      const provisions = infra.provisions.map(p =>
        `${p.id}: ${p.title} — ${p.status} (${p.impact}) — Local: ${p.localRule} — Gap: ${p.gap}`
      ).join('; ')
      parts.push(`Infrastructure analysis for ${infra.name} (${infra.county}, BoH authority: M.G.L. c. 111, § 31): ${infra.regulatoryLayer}. ${infra.provisions.length} provisions tracked. ${provisions}. Bottom line: ${infra.bottomLine} See /infrastructure/${infra.slug} for full analysis.`)
    }
  }

  return parts.join('\n')
}
