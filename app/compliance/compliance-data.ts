// compliance-data.ts
// ADU Bylaw Compliance Data — 6 towns profiled against 760 CMR 71.00 and Chapter 150

export type ComplianceStatus = 'conflict' | 'review' | 'compliant';

export type ProvisionCategory =
  | 'Use & Occupancy'
  | 'Dimensional & Parking'
  | 'Building & Safety'
  | 'Process & Administration';

export interface ComplianceProvision {
  id: string;
  provision: string;
  category: ProvisionCategory;
  status: ComplianceStatus;
  stateLaw: string;
  localBylaw: string;
  impact: string;
  agDecision?: string; // AG disapproval reference if applicable
}

export interface TownPermitData {
  submitted: number;
  approved: number;
  denied: number;
  pending: number;
  approvalRate: number;
}

export interface TownComplianceProfile {
  slug: string;
  name: string;
  county: string;
  population: number;
  bylawLastUpdated: string;
  bylawSource: string;
  agDisapprovals: number;
  permits: TownPermitData;
  provisions: ComplianceProvision[];
}

// ---------------------------------------------------------------------------
// TOWN DATA
// ---------------------------------------------------------------------------

export const towns: TownComplianceProfile[] = [
  // ── PLYMOUTH ──────────────────────────────────────────────────────────
  {
    slug: 'plymouth',
    name: 'Plymouth',
    county: 'Plymouth',
    population: 63_000,
    bylawLastUpdated: 'October 2024',
    bylawSource: 'Plymouth Zoning Bylaw §205-51',
    agDisapprovals: 0,
    permits: {
      submitted: 42,
      approved: 34,
      denied: 5,
      pending: 3,
      approvalRate: 81,
    },
    provisions: [
      {
        id: 'ply-01',
        provision: 'Owner-Occupancy Requirement',
        category: 'Use & Occupancy',
        status: 'conflict',
        stateLaw:
          'MGL c.40A §3 (as amended by Ch. 150) — towns may not require owner-occupancy for ADUs as a protected use.',
        localBylaw:
          'Plymouth §205-51 requires the property owner to occupy either the principal dwelling or the ADU.',
        impact:
          'Blocks investor-owned ADU construction. Would disqualify properties purchased specifically for ADU rental income.',
      },
      {
        id: 'ply-02',
        provision: 'Bedroom-Based Parking',
        category: 'Dimensional & Parking',
        status: 'conflict',
        stateLaw:
          '760 CMR 71.05(2) — parking for an ADU shall not exceed 1 space. May not impose bedroom-based ratios.',
        localBylaw:
          'Plymouth requires 1 parking space per bedroom for the ADU, which can exceed the state maximum of 1 total.',
        impact:
          'A 2-bedroom ADU would need 2 spaces — double the state max. Creates site plan barriers on smaller lots.',
      },
      {
        id: 'ply-03',
        provision: 'District Scope Limitation',
        category: 'Use & Occupancy',
        status: 'conflict',
        stateLaw:
          'MGL c.40A §3 — ADUs are a protected use allowed by right on any lot with a single-family dwelling, in any zoning district.',
        localBylaw:
          'Plymouth limits ADUs to single-family residential zoning districts, excluding mixed-use and other zones where single-family homes exist.',
        impact:
          'Homeowners in mixed-use or rural districts with single-family homes cannot build ADUs despite state law protections.',
      },
      {
        id: 'ply-04',
        provision: 'Design Review / Compatibility',
        category: 'Building & Safety',
        status: 'review',
        stateLaw:
          '760 CMR 71.05(5) — towns may impose "reasonable" design standards for detached ADUs but may not use them to effectively prohibit construction.',
        localBylaw:
          'Plymouth requires architectural compatibility with the principal dwelling including materials, roof pitch, and fenestration patterns.',
        impact:
          'Ambiguous standard — could increase costs or delay permits if applied subjectively. Grey area until challenged.',
      },
      {
        id: 'ply-05',
        provision: 'Setback Requirements',
        category: 'Dimensional & Parking',
        status: 'review',
        stateLaw:
          '760 CMR 71.05(1) — setbacks for detached ADUs may not exceed those for principal structures in the same district.',
        localBylaw:
          'Plymouth applies principal-structure setbacks but also adds a 10-foot minimum from the principal dwelling.',
        impact:
          'The 10-foot separation rule may be permissible as "reasonable" or may be challenged as exceeding state limits on narrow lots.',
      },
      {
        id: 'ply-06',
        provision: 'ADU Size Limits',
        category: 'Dimensional & Parking',
        status: 'compliant',
        stateLaw:
          '760 CMR 71.05(3) — ADUs must be allowed up to 900 sq ft or 50% of principal dwelling living area, whichever is less.',
        localBylaw:
          'Plymouth allows ADUs up to 900 sq ft, consistent with state maximum.',
        impact: 'No conflict — meets state minimum allowance.',
      },
      {
        id: 'ply-07',
        provision: 'By-Right Permitting',
        category: 'Process & Administration',
        status: 'compliant',
        stateLaw:
          'MGL c.40A §3 — ADUs that meet state requirements must be allowed by right with no special permit or variance.',
        localBylaw:
          'Plymouth allows conforming ADUs by right through building permit process.',
        impact: 'No conflict — by-right pathway exists.',
      },
      {
        id: 'ply-08',
        provision: 'Number of ADUs Allowed',
        category: 'Use & Occupancy',
        status: 'compliant',
        stateLaw:
          'MGL c.40A §3 — at least one ADU must be allowed per single-family lot.',
        localBylaw: 'Plymouth allows one ADU per single-family lot.',
        impact: 'No conflict — meets state minimum.',
      },
      {
        id: 'ply-09',
        provision: 'Building Code Compliance',
        category: 'Building & Safety',
        status: 'compliant',
        stateLaw:
          '760 CMR 71.05(4) — ADUs must meet Massachusetts building code (780 CMR) and Title 5 septic requirements.',
        localBylaw:
          'Plymouth requires full building code and Title 5 compliance for all ADUs.',
        impact: 'No conflict — standard safety requirements.',
      },
      {
        id: 'ply-10',
        provision: 'Detached ADU Allowance',
        category: 'Use & Occupancy',
        status: 'compliant',
        stateLaw:
          'MGL c.40A §3 — ADUs may be within, attached to, or detached from the principal dwelling.',
        localBylaw:
          'Plymouth allows internal, attached, and detached ADUs.',
        impact: 'No conflict — all ADU types permitted.',
      },
    ],
  },

  // ── NANTUCKET ─────────────────────────────────────────────────────────
  {
    slug: 'nantucket',
    name: 'Nantucket',
    county: 'Nantucket',
    population: 14_000,
    bylawLastUpdated: 'Pre-2024 (not updated post-Chapter 150)',
    bylawSource: 'Nantucket Zoning Bylaw §139-16A',
    agDisapprovals: 0,
    permits: {
      submitted: 20,
      approved: 18,
      denied: 1,
      pending: 1,
      approvalRate: 90,
    },
    provisions: [
      {
        id: 'nan-01',
        provision: 'Owner-Occupancy Requirement',
        category: 'Use & Occupancy',
        status: 'conflict',
        stateLaw:
          'MGL c.40A §3 — towns may not require owner-occupancy for ADUs.',
        localBylaw:
          'Nantucket §139-16A requires the property owner to reside on the premises.',
        impact:
          'Prevents absentee owners from building ADUs — significant on an island with many seasonal/investment properties.',
      },
      {
        id: 'nan-02',
        provision: 'Internal-Only ADU Restriction',
        category: 'Use & Occupancy',
        status: 'conflict',
        stateLaw:
          'MGL c.40A §3 — ADUs may be within, attached to, or detached from the principal dwelling.',
        localBylaw:
          'Pre-state-law bylaw only allows ADUs within the existing footprint of a single-family home. No detached or new-construction ADUs.',
        impact:
          'Eliminates detached ADU construction entirely. Forces costly interior conversions and limits ADU size to existing space.',
      },
      {
        id: 'nan-03',
        provision: 'ADU Size Cap Below State Minimum',
        category: 'Dimensional & Parking',
        status: 'conflict',
        stateLaw:
          '760 CMR 71.05(3) — ADUs must be allowed up to 900 sq ft.',
        localBylaw:
          'Nantucket caps ADUs at 800 sq ft under pre-existing bylaw.',
        impact:
          'Denies 100 sq ft of state-guaranteed space. May seem minor but impacts feasibility for 2-bedroom ADUs.',
      },
      {
        id: 'nan-04',
        provision: 'Principal Dwelling Scope',
        category: 'Use & Occupancy',
        status: 'conflict',
        stateLaw:
          'MGL c.40A §3 — ADUs are a protected use on any lot with a "single-family dwelling."',
        localBylaw:
          'Nantucket restricts ADUs to "single-family residential" properties only, excluding properties with nonconforming uses or mixed designations.',
        impact:
          'Narrows eligible properties beyond state intent. Island has many grandfathered/nonconforming uses that would be excluded.',
      },
      {
        id: 'nan-05',
        provision: 'Short-Term Rental of ADUs',
        category: 'Use & Occupancy',
        status: 'review',
        stateLaw:
          '760 CMR 71.00 is silent on short-term rental of ADUs. Towns may regulate STR separately but may not use STR restrictions to effectively ban ADUs.',
        localBylaw:
          'Nantucket has active STR litigation and imposed a moratorium on "tertiary dwellings." The interaction between ADU law and STR regulations is unresolved.',
        impact:
          'Legal uncertainty for builders and homeowners. STR income is a primary financial motivator for ADU construction on Nantucket.',
      },
      {
        id: 'nan-06',
        provision: 'By-Right Permitting',
        category: 'Process & Administration',
        status: 'compliant',
        stateLaw:
          'MGL c.40A §3 — conforming ADUs must be allowed by right.',
        localBylaw:
          'Nantucket allows conforming ADUs by right (though conformance is narrowly defined under current bylaw).',
        impact:
          'Technically compliant on process, but the restrictive eligibility criteria limit what qualifies for by-right treatment.',
      },
      {
        id: 'nan-07',
        provision: 'Parking',
        category: 'Dimensional & Parking',
        status: 'compliant',
        stateLaw:
          '760 CMR 71.05(2) — parking may not exceed 1 space per ADU.',
        localBylaw: 'Nantucket requires 1 additional parking space per ADU.',
        impact: 'No conflict — meets state cap.',
      },
    ],
  },

  // ── LEICESTER ─────────────────────────────────────────────────────────
  {
    slug: 'leicester',
    name: 'Leicester',
    county: 'Worcester',
    population: 11_500,
    bylawLastUpdated: 'May 2025 (AG partial disapproval)',
    bylawSource: 'Leicester Zoning Bylaw — Town Meeting Article 9',
    agDisapprovals: 3,
    permits: {
      submitted: 4,
      approved: 3,
      denied: 0,
      pending: 1,
      approvalRate: 75,
    },
    provisions: [
      {
        id: 'lei-01',
        provision: 'Bedroom Limit on ADUs',
        category: 'Dimensional & Parking',
        status: 'conflict',
        stateLaw:
          '760 CMR 71.05 — no provision authorizes towns to limit the number of bedrooms in an ADU. Size is governed by square footage only.',
        localBylaw:
          'Leicester limited ADUs to a maximum of 2 bedrooms.',
        impact:
          'Restricts family-sized ADUs. A 900 sq ft ADU could accommodate 3 bedrooms but would be prohibited.',
        agDecision:
          'AG disapproved May 2025 — bedroom limits not authorized under Ch. 150 or 760 CMR 71.00.',
      },
      {
        id: 'lei-02',
        provision: 'Single-Family Zoning District Restriction',
        category: 'Use & Occupancy',
        status: 'conflict',
        stateLaw:
          'MGL c.40A §3 — ADUs allowed on any lot with a single-family dwelling, regardless of zoning district.',
        localBylaw:
          'Leicester restricted ADUs to single-family residential zoning districts only.',
        impact:
          'Excludes single-family homes in agricultural, rural, or mixed-use districts from building ADUs.',
        agDecision:
          'AG disapproved May 2025 — cannot limit ADUs to specific zoning districts.',
      },
      {
        id: 'lei-03',
        provision: '"All Dimensional" Compliance Requirement',
        category: 'Dimensional & Parking',
        status: 'conflict',
        stateLaw:
          '760 CMR 71.05(1) — setbacks and dimensional requirements for ADUs may not exceed those for principal structures.',
        localBylaw:
          'Leicester required ADUs to comply with "all applicable dimensional requirements" — interpreted to mean the combined footprint must meet lot coverage, FAR, and setback rules designed for single structures.',
        impact:
          'Effectively prevents ADUs on nonconforming lots (which are common in older MA towns), creating a de facto ban for many properties.',
        agDecision:
          'AG disapproved May 2025 — blanket dimensional compliance exceeds state limits.',
      },
      {
        id: 'lei-04',
        provision: 'ADU Size Limits',
        category: 'Dimensional & Parking',
        status: 'compliant',
        stateLaw:
          '760 CMR 71.05(3) — ADUs must be allowed up to 900 sq ft.',
        localBylaw: 'Leicester allows ADUs up to 900 sq ft.',
        impact: 'No conflict — meets state minimum.',
      },
      {
        id: 'lei-05',
        provision: 'By-Right Permitting',
        category: 'Process & Administration',
        status: 'compliant',
        stateLaw:
          'MGL c.40A §3 — conforming ADUs must be allowed by right.',
        localBylaw:
          'Leicester allows conforming ADUs by right through building permit.',
        impact: 'No conflict — by-right pathway exists.',
      },
      {
        id: 'lei-06',
        provision: 'Detached ADU Allowance',
        category: 'Use & Occupancy',
        status: 'compliant',
        stateLaw:
          'MGL c.40A §3 — ADUs may be internal, attached, or detached.',
        localBylaw: 'Leicester allows all three ADU types.',
        impact: 'No conflict.',
      },
      {
        id: 'lei-07',
        provision: 'Parking',
        category: 'Dimensional & Parking',
        status: 'compliant',
        stateLaw:
          '760 CMR 71.05(2) — parking may not exceed 1 space.',
        localBylaw: 'Leicester requires no more than 1 parking space.',
        impact: 'No conflict.',
      },
    ],
  },

  // ── BROOKLINE ─────────────────────────────────────────────────────────
  {
    slug: 'brookline',
    name: 'Brookline',
    county: 'Norfolk',
    population: 63_000,
    bylawLastUpdated: 'June 2025 (AG partial disapproval)',
    bylawSource: 'Brookline Zoning Bylaw — Town Meeting Article',
    agDisapprovals: 2,
    permits: {
      submitted: 12,
      approved: 8,
      denied: 2,
      pending: 2,
      approvalRate: 67,
    },
    provisions: [
      {
        id: 'brk-01',
        provision: 'Floor Area Ratio (FAR) Cap on ADUs',
        category: 'Dimensional & Parking',
        status: 'conflict',
        stateLaw:
          '760 CMR 71.05(1) — dimensional requirements for ADUs may not exceed those for principal structures in the same district.',
        localBylaw:
          'Brookline imposed a FAR cap on lots with ADUs that effectively limited ADU size below the 900 sq ft state minimum on smaller lots.',
        impact:
          'On Brookline\'s characteristically small urban lots, the FAR calculation leaves insufficient buildable area. Effectively a size ban for many properties.',
        agDecision:
          'AG disapproved June 2025 — FAR caps that reduce ADU size below state minimums violate Ch. 150.',
      },
      {
        id: 'brk-02',
        provision: 'Pre-Existing Nonconforming Conditions',
        category: 'Dimensional & Parking',
        status: 'conflict',
        stateLaw:
          'MGL c.40A §3 — ADUs are a protected use and must be allowed by right. Nonconforming status of the lot should not prevent ADU construction.',
        localBylaw:
          'Brookline required that lots with pre-existing nonconforming conditions (setbacks, lot coverage) could not add ADUs unless the nonconformity was cured.',
        impact:
          'A large percentage of Brookline lots are nonconforming due to the town\'s dense, historic development pattern. This provision would block ADUs on most eligible properties.',
        agDecision:
          'AG disapproved June 2025 — pre-existing nonconformities cannot bar ADU construction.',
      },
      {
        id: 'brk-03',
        provision: 'Historic District Design Review',
        category: 'Building & Safety',
        status: 'review',
        stateLaw:
          '760 CMR 71.05(5) — towns may impose reasonable design standards but may not use them to effectively prohibit ADUs.',
        localBylaw:
          'Brookline requires Historic District Commission review for ADUs in designated areas, with authority to modify or deny based on architectural compatibility.',
        impact:
          'HDC review with denial authority could function as a de facto special permit. Unclear if this would survive a legal challenge.',
      },
      {
        id: 'brk-04',
        provision: 'ADU Size Limits',
        category: 'Dimensional & Parking',
        status: 'compliant',
        stateLaw:
          '760 CMR 71.05(3) — must allow up to 900 sq ft.',
        localBylaw: 'Brookline allows up to 900 sq ft.',
        impact: 'No conflict.',
      },
      {
        id: 'brk-05',
        provision: 'By-Right Permitting',
        category: 'Process & Administration',
        status: 'compliant',
        stateLaw:
          'MGL c.40A §3 — conforming ADUs must be allowed by right.',
        localBylaw:
          'Brookline allows conforming ADUs by right (outside historic districts).',
        impact: 'No conflict for non-historic areas.',
      },
      {
        id: 'brk-06',
        provision: 'Detached ADU Allowance',
        category: 'Use & Occupancy',
        status: 'compliant',
        stateLaw:
          'MGL c.40A §3 — internal, attached, or detached.',
        localBylaw: 'All three types permitted.',
        impact: 'No conflict.',
      },
      {
        id: 'brk-07',
        provision: 'Parking',
        category: 'Dimensional & Parking',
        status: 'compliant',
        stateLaw:
          '760 CMR 71.05(2) — max 1 space; waived within 0.5 mi of transit.',
        localBylaw:
          'Brookline waives ADU parking within 0.5 miles of MBTA stations, otherwise 1 space max.',
        impact: 'No conflict — transit waiver properly applied.',
      },
    ],
  },

  // ── CANTON ────────────────────────────────────────────────────────────
  {
    slug: 'canton',
    name: 'Canton',
    county: 'Norfolk',
    population: 24_000,
    bylawLastUpdated: 'June 2025 (AG partial disapproval)',
    bylawSource: 'Canton Zoning Bylaw — Town Meeting Article',
    agDisapprovals: 1,
    permits: {
      submitted: 6,
      approved: 5,
      denied: 0,
      pending: 1,
      approvalRate: 83,
    },
    provisions: [
      {
        id: 'can-01',
        provision: 'Minimum Lot Size Requirement',
        category: 'Dimensional & Parking',
        status: 'conflict',
        stateLaw:
          'MGL c.40A §3 — ADUs are a protected use on "any" lot with a single-family dwelling. No minimum lot size may be imposed beyond what applies to the principal dwelling.',
        localBylaw:
          'Canton imposed a minimum lot size of 10,000 sq ft for ADU eligibility.',
        impact:
          'Disqualifies a significant portion of Canton\'s housing stock — many older neighborhoods have lots under 10,000 sq ft. One of the most consequential AG rulings statewide.',
        agDecision:
          'AG disapproved June 2025 — minimum lot size requirements for ADUs violate Ch. 150.',
      },
      {
        id: 'can-02',
        provision: 'Impervious Surface Cap',
        category: 'Dimensional & Parking',
        status: 'review',
        stateLaw:
          '760 CMR 71.05(1) — dimensional requirements may not exceed those for principal structures.',
        localBylaw:
          'Canton applies an impervious surface coverage limit that, on smaller lots, may prevent ADU construction when combined with existing driveway and structure coverage.',
        impact:
          'May function as a de facto size or feasibility restriction on constrained lots. Has not been formally challenged.',
      },
      {
        id: 'can-03',
        provision: 'ADU Size Limits',
        category: 'Dimensional & Parking',
        status: 'compliant',
        stateLaw:
          '760 CMR 71.05(3) — must allow up to 900 sq ft.',
        localBylaw: 'Canton allows up to 900 sq ft.',
        impact: 'No conflict.',
      },
      {
        id: 'can-04',
        provision: 'By-Right Permitting',
        category: 'Process & Administration',
        status: 'compliant',
        stateLaw:
          'MGL c.40A §3 — conforming ADUs by right.',
        localBylaw: 'Canton allows conforming ADUs by right.',
        impact: 'No conflict.',
      },
      {
        id: 'can-05',
        provision: 'Detached ADU Allowance',
        category: 'Use & Occupancy',
        status: 'compliant',
        stateLaw:
          'MGL c.40A §3 — internal, attached, or detached.',
        localBylaw: 'All three types permitted.',
        impact: 'No conflict.',
      },
      {
        id: 'can-06',
        provision: 'Parking',
        category: 'Dimensional & Parking',
        status: 'compliant',
        stateLaw:
          '760 CMR 71.05(2) — max 1 space.',
        localBylaw: 'Canton requires 1 space max.',
        impact: 'No conflict.',
      },
      {
        id: 'can-07',
        provision: 'Owner-Occupancy',
        category: 'Use & Occupancy',
        status: 'compliant',
        stateLaw:
          'MGL c.40A §3 — no owner-occupancy requirement allowed.',
        localBylaw: 'Canton does not require owner-occupancy.',
        impact: 'No conflict — updated post-state-law.',
      },
    ],
  },

  // ── HANSON ────────────────────────────────────────────────────────────
  {
    slug: 'hanson',
    name: 'Hanson',
    county: 'Plymouth',
    population: 11_000,
    bylawLastUpdated: '2025 (AG partial disapproval)',
    bylawSource: 'Hanson Zoning Bylaw — Town Meeting Article',
    agDisapprovals: 1,
    permits: {
      submitted: 3,
      approved: 2,
      denied: 0,
      pending: 1,
      approvalRate: 67,
    },
    provisions: [
      {
        id: 'han-01',
        provision: 'Site Plan Review as De Facto Special Permit',
        category: 'Process & Administration',
        status: 'conflict',
        stateLaw:
          'MGL c.40A §3 — ADUs must be allowed by right. No special permit, site plan review with denial authority, or discretionary approval may be required.',
        localBylaw:
          'Hanson requires site plan review with Planning Board authority to impose conditions and potentially deny applications based on subjective criteria.',
        impact:
          'Converts a by-right process into a discretionary one. Planning Board can effectively block ADUs through conditions or denial — violates the by-right mandate.',
        agDecision:
          'AG partial disapproval 2025 — site plan review functioning as special permit violates Ch. 150.',
      },
      {
        id: 'han-02',
        provision: 'Deed Restriction Requirement',
        category: 'Use & Occupancy',
        status: 'review',
        stateLaw:
          '760 CMR 71.00 does not prohibit deed restrictions, but restrictions that effectively limit the protected use (e.g., requiring the ADU to be removed upon sale) may violate Ch. 150.',
        localBylaw:
          'Hanson requires a deed restriction recorded with the Registry of Deeds tying the ADU to the current property owner.',
        impact:
          'May discourage ADU construction if owners believe they\'d have to remove the unit upon selling. Creates legal ambiguity around property transfers.',
      },
      {
        id: 'han-03',
        provision: 'ADU Size Limits',
        category: 'Dimensional & Parking',
        status: 'compliant',
        stateLaw:
          '760 CMR 71.05(3) — must allow up to 900 sq ft.',
        localBylaw: 'Hanson allows up to 900 sq ft.',
        impact: 'No conflict.',
      },
      {
        id: 'han-04',
        provision: 'Detached ADU Allowance',
        category: 'Use & Occupancy',
        status: 'compliant',
        stateLaw:
          'MGL c.40A §3 — internal, attached, or detached.',
        localBylaw: 'All three types permitted.',
        impact: 'No conflict.',
      },
      {
        id: 'han-05',
        provision: 'Parking',
        category: 'Dimensional & Parking',
        status: 'compliant',
        stateLaw: '760 CMR 71.05(2) — max 1 space.',
        localBylaw: 'Hanson requires 1 space max.',
        impact: 'No conflict.',
      },
      {
        id: 'han-06',
        provision: 'Owner-Occupancy',
        category: 'Use & Occupancy',
        status: 'compliant',
        stateLaw:
          'MGL c.40A §3 — no owner-occupancy requirement allowed.',
        localBylaw: 'Hanson does not require owner-occupancy.',
        impact: 'No conflict.',
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// HELPERS
// ---------------------------------------------------------------------------

export function getStatusCounts(provisions: ComplianceProvision[]) {
  return {
    conflicts: provisions.filter((p) => p.status === 'conflict').length,
    review: provisions.filter((p) => p.status === 'review').length,
    compliant: provisions.filter((p) => p.status === 'compliant').length,
  };
}

export function getStatewideStats(allTowns: TownComplianceProfile[]) {
  const totalConflicts = allTowns.reduce(
    (sum, t) => sum + t.provisions.filter((p) => p.status === 'conflict').length,
    0,
  );
  const totalAgDisapprovals = allTowns.reduce(
    (sum, t) => sum + t.agDisapprovals,
    0,
  );
  const townsNotUpdated = allTowns.filter((t) =>
    t.provisions.some((p) => p.status === 'conflict'),
  ).length;

  return { totalConflicts, totalAgDisapprovals, townsNotUpdated, townsTracked: allTowns.length };
}

export function generateBottomLine(town: TownComplianceProfile): string {
  const counts = getStatusCounts(town.provisions);
  const hasAg = town.agDisapprovals > 0;

  if (counts.conflicts === 0 && counts.review === 0) {
    return `${town.name}'s ADU bylaw appears fully compliant with Chapter 150 and 760 CMR 71.00. No conflicts identified.`;
  }

  const parts: string[] = [];

  if (counts.conflicts > 0) {
    parts.push(
      `${town.name} has ${counts.conflicts} provision${counts.conflicts > 1 ? 's' : ''} that conflict with state ADU law`,
    );
  }

  if (hasAg) {
    parts.push(
      `${town.agDisapprovals} ha${town.agDisapprovals > 1 ? 've' : 's'} been formally disapproved by the Attorney General`,
    );
  }

  if (counts.review > 0) {
    parts.push(
      `${counts.review} additional provision${counts.review > 1 ? 's' : ''} ${counts.review > 1 ? 'are' : 'is'} in a legal grey area that may face future challenges`,
    );
  }

  return parts.join('. ') + '.';
}

export const categories: ProvisionCategory[] = [
  'Use & Occupancy',
  'Dimensional & Parking',
  'Building & Safety',
  'Process & Administration',
];
