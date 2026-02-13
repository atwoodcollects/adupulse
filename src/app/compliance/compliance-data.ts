// compliance-data.ts
// ADU Bylaw Consistency Data — 12 towns profiled against 760 CMR 71.00 and Chapter 150
// Per EOHLC guidance: local zoning that conflicts with the ADU statute is unenforceable,
// but towns are not "out of compliance" — state law simply overrides inconsistent provisions.

export type ComplianceStatus = 'inconsistent' | 'review' | 'compliant';

export type ProvisionCategory =
  | 'Use & Occupancy'
  | 'Dimensional & Parking'
  | 'Building & Safety'
  | 'Process & Administration';

export interface Citation {
  label: string;
  url: string;
}

export interface ComplianceProvision {
  id: string;
  provision: string;
  category: ProvisionCategory;
  status: ComplianceStatus;
  stateLaw: string;
  localBylaw: string;
  impact: string;
  agDecision?: string;
  citations: Citation[];
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
// SOURCE URLS — centralized for consistency and maintainability
// ---------------------------------------------------------------------------
const SOURCES = {
  /** Chapter 150 of the Acts of 2024 — full session law */
  ch150: 'https://malegislature.gov/Laws/SessionLaws/Acts/2024/Chapter150',
  /** Sections 7 & 8 of Chapter 150 — clean HTML on mass.gov */
  ch150_s78: 'https://www.mass.gov/info-details/chapter-150-section-7-and-8-of-the-acts-of-2024-adus',
  /** MGL c.40A §3 — Zoning Act, Dover Amendment (as amended) */
  mgl40a_s3: 'https://malegislature.gov/Laws/GeneralLaws/PartI/TitleVII/Chapter40A/Section3',
  /** MGL c.40A §1A — Definitions (ADU definition) */
  mgl40a_s1a: 'https://malegislature.gov/Laws/GeneralLaws/PartI/TitleVII/Chapter40A/Section1A',
  /** 760 CMR 71.00 — EOHLC ADU Regulations (final version PDF) */
  cmr71: 'https://www.mass.gov/doc/760-cmr-7100-protected-use-adus-final-version/download',
  /** EOHLC ADU landing page */
  eohlc_adu: 'https://www.mass.gov/info-details/accessory-dwelling-units',
  /** EOHLC ADU FAQ */
  eohlc_faq: 'https://www.mass.gov/info-details/accessory-dwelling-unit-adu-faqs',
  /** AG MLU Decision Lookup */
  ag_mlu: 'https://massago.onbaseonline.com/Massago/1700PublicAccess/MLU.htm',
  /** Leicester AG Decision — Article 9, 5/27/2025 */
  ag_leicester: 'https://www.leicesterma.org/DocumentCenter/View/3522/Attorney-General-Decision--Article-9-ADU-Bylaw-5-27-2025',
  /** Brookline AG Decision — Fall TM 2024, June 2025 */
  ag_brookline: 'https://www.brooklinema.gov/DocumentCenter/View/57994/FALL-TM-2024-AGO-Decision_ADU-June-2025',
  /** Hanson AG Decision — Article 22, 2025 */
  ag_hanson: 'https://www.hanson-ma.gov/planning-boarddepartment/files/adu-bylaw-approved-attorney-general-2025',
  /** Canton AG Decision — 6/4/2025 (referenced in EOHLC FAQ) */
  ag_canton: 'https://www.mass.gov/info-details/accessory-dwelling-unit-adu-faqs',
  /** Newton ADU zoning page */
  newton_adu: 'https://www.newtonma.gov/government/planning/zoning-and-development/zoning-updates/accessory-dwelling-units-adu',
  /** Newton ADU ordinance update (Fig City News) */
  newton_news: 'https://figcitynews.com/2025/04/city-council-revises-rules-for-accessory-dwelling-units/',
  /** Andover ADU page */
  andover_adu: 'https://andoverma.gov/1507/Accessory-Dwelling-Units',
  /** Andover 2025 Town Meeting recap */
  andover_tm: 'https://andoverma.gov/1532/2025-Annual-Town-Meeting-Recap',
  /** Milton ADU bylaw article */
  milton_article: 'https://www.miltonma.gov/DocumentCenter/View/7946/Article-11-Green-Sheetpdf',
  /** Milton ADU info */
  milton_adu: 'https://www.miltonma.gov/DocumentCenter/View/2560/Accessory-Dwelling-Units-PDF',
  /** Duxbury ADU news */
  duxbury_news: 'https://www.duxburyclipper.com/articles/new-accesory-dwelling-unit-law-considered/',
  /** Duxbury STM zoning article */
  duxbury_stm: 'https://www.town.duxbury.ma.us/sites/g/files/vyhlif10506/f/uploads/article_1_-_mbta_zoning_06.16.2025.pdf',
  /** Barnstable ADU meeting page */
  barnstable_adu: 'https://barnstable.gov/departments/planninganddevelopment/projects/ADU-Meeting.asp',
  /** Barnstable ADU ordinance update */
  barnstable_update: 'https://tobweb.town.barnstable.ma.us/TownCouncilCommunications/2025-05-15%20AGENDA%20ITEM%202025-060%20Accessory%20Dwelling%20Unit%20Update%20overview.pdf',
} as const;

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
    permits: { submitted: 42, approved: 34, denied: 8, pending: 0, approvalRate: 81 },
    provisions: [
      {
        id: 'ply-01',
        provision: 'Owner-Occupancy Requirement',
        category: 'Use & Occupancy',
        status: 'inconsistent',
        stateLaw:
          'MGL c.40A §3 (as amended by Ch. 150) — towns may not require owner-occupancy for ADUs as a protected use.',
        localBylaw:
          'Plymouth §205-51 requires the property owner to occupy either the principal dwelling or the ADU.',
        impact:
          'This provision is unenforceable under state law. Homeowners may build ADUs regardless of occupancy status.',
        citations: [
          { label: 'MGL c.40A §3', url: SOURCES.mgl40a_s3 },
          { label: 'Ch. 150 §§7–8', url: SOURCES.ch150_s78 },
          { label: '760 CMR 71.03(2)', url: SOURCES.cmr71 },
        ],
      },
      {
        id: 'ply-02',
        provision: 'Bedroom-Based Parking',
        category: 'Dimensional & Parking',
        status: 'inconsistent',
        stateLaw:
          '760 CMR 71.05(2) — parking for an ADU shall not exceed 1 space. May not impose bedroom-based ratios.',
        localBylaw:
          'Plymouth requires 1 parking space per bedroom for the ADU, which can exceed the state maximum of 1 total.',
        impact:
          'The bedroom-based ratio is unenforceable — state law caps parking at 1 space regardless of bedroom count.',
        citations: [
          { label: '760 CMR 71.05(2)', url: SOURCES.cmr71 },
          { label: 'MGL c.40A §3', url: SOURCES.mgl40a_s3 },
        ],
      },
      {
        id: 'ply-03',
        provision: 'District Scope Limitation',
        category: 'Use & Occupancy',
        status: 'inconsistent',
        stateLaw:
          'MGL c.40A §3 — ADUs are a protected use allowed by right on any lot with a single-family dwelling, in any zoning district.',
        localBylaw:
          'Plymouth limits ADUs to single-family residential zoning districts, excluding mixed-use and other zones where single-family homes exist.',
        impact:
          'This district restriction is unenforceable. Homeowners in any zoning district with a single-family dwelling may build an ADU under state law.',
        citations: [
          { label: 'MGL c.40A §3', url: SOURCES.mgl40a_s3 },
          { label: '760 CMR 71.02 (definitions)', url: SOURCES.cmr71 },
          { label: 'EOHLC FAQ', url: SOURCES.eohlc_faq },
        ],
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
        citations: [
          { label: '760 CMR 71.05(5)', url: SOURCES.cmr71 },
          { label: '760 CMR 71.03(3)(a)', url: SOURCES.cmr71 },
        ],
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
        citations: [
          { label: '760 CMR 71.05(1)', url: SOURCES.cmr71 },
          { label: '760 CMR 71.03(3)(b)(2)', url: SOURCES.cmr71 },
        ],
      },
      {
        id: 'ply-06',
        provision: 'ADU Size Limits',
        category: 'Dimensional & Parking',
        status: 'compliant',
        stateLaw:
          '760 CMR 71.05(3) — ADUs must be allowed up to 900 sq ft or 50% of principal dwelling living area, whichever is less.',
        localBylaw: 'Plymouth allows ADUs up to 900 sq ft, consistent with state maximum.',
        impact: 'Consistent with state law.',
        citations: [
          { label: '760 CMR 71.05(3)', url: SOURCES.cmr71 },
          { label: 'MGL c.40A §1A', url: SOURCES.mgl40a_s1a },
        ],
      },
      {
        id: 'ply-07',
        provision: 'By-Right Permitting',
        category: 'Process & Administration',
        status: 'compliant',
        stateLaw:
          'MGL c.40A §3 — ADUs that meet state requirements must be allowed by right with no special permit or variance.',
        localBylaw: 'Plymouth allows conforming ADUs by right through building permit process.',
        impact: 'Consistent with state law.',
        citations: [
          { label: 'MGL c.40A §3', url: SOURCES.mgl40a_s3 },
          { label: 'Ch. 150 §8', url: SOURCES.ch150_s78 },
        ],
      },
      {
        id: 'ply-08',
        provision: 'Number of ADUs Allowed',
        category: 'Use & Occupancy',
        status: 'compliant',
        stateLaw: 'MGL c.40A §3 — at least one ADU must be allowed per single-family lot.',
        localBylaw: 'Plymouth allows one ADU per single-family lot.',
        impact: 'Consistent with state law.',
        citations: [
          { label: 'MGL c.40A §3', url: SOURCES.mgl40a_s3 },
        ],
      },
      {
        id: 'ply-09',
        provision: 'Building Code Compliance',
        category: 'Building & Safety',
        status: 'compliant',
        stateLaw:
          '760 CMR 71.05(4) — ADUs must meet Massachusetts building code (780 CMR) and Title 5 septic requirements.',
        localBylaw: 'Plymouth requires full building code and Title 5 compliance for all ADUs.',
        impact: 'Consistent with state law.',
        citations: [
          { label: '760 CMR 71.05(4)', url: SOURCES.cmr71 },
        ],
      },
      {
        id: 'ply-10',
        provision: 'Detached ADU Allowance',
        category: 'Use & Occupancy',
        status: 'compliant',
        stateLaw:
          'MGL c.40A §3 — ADUs may be within, attached to, or detached from the principal dwelling.',
        localBylaw: 'Plymouth allows internal, attached, and detached ADUs.',
        impact: 'Consistent with state law.',
        citations: [
          { label: 'MGL c.40A §3', url: SOURCES.mgl40a_s3 },
          { label: '760 CMR 71.03(2)(e)', url: SOURCES.cmr71 },
        ],
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
    permits: { submitted: 27, approved: 27, denied: 0, pending: 0, approvalRate: 100 },
    provisions: [
      {
        id: 'nan-01',
        provision: 'Owner-Occupancy Requirement',
        category: 'Use & Occupancy',
        status: 'inconsistent',
        stateLaw: 'MGL c.40A §3 — towns may not require owner-occupancy for ADUs.',
        localBylaw:
          'Nantucket §139-16A requires the property owner to reside on the premises.',
        impact:
          'This provision is unenforceable under state law. Absentee owners may build ADUs regardless of this local requirement.',
        citations: [
          { label: 'MGL c.40A §3', url: SOURCES.mgl40a_s3 },
          { label: '760 CMR 71.03(2)(a)', url: SOURCES.cmr71 },
        ],
      },
      {
        id: 'nan-02',
        provision: 'Internal-Only ADU Restriction',
        category: 'Use & Occupancy',
        status: 'inconsistent',
        stateLaw:
          'MGL c.40A §3 — ADUs may be within, attached to, or detached from the principal dwelling.',
        localBylaw:
          'Pre-state-law bylaw only allows ADUs within the existing footprint of a single-family home. No detached or new-construction ADUs.',
        impact:
          'The internal-only restriction is unenforceable. Homeowners may build detached or attached ADUs under state law.',
        citations: [
          { label: 'MGL c.40A §3', url: SOURCES.mgl40a_s3 },
          { label: '760 CMR 71.03(2)(e)', url: SOURCES.cmr71 },
        ],
      },
      {
        id: 'nan-03',
        provision: 'ADU Size Cap Below State Minimum',
        category: 'Dimensional & Parking',
        status: 'inconsistent',
        stateLaw: '760 CMR 71.05(3) — ADUs must be allowed up to 900 sq ft.',
        localBylaw: 'Nantucket caps ADUs at 800 sq ft under pre-existing bylaw.',
        impact:
          'The 800 sq ft cap is unenforceable — state law guarantees up to 900 sq ft.',
        citations: [
          { label: '760 CMR 71.05(3)', url: SOURCES.cmr71 },
          { label: 'MGL c.40A §1A', url: SOURCES.mgl40a_s1a },
          { label: 'EOHLC FAQ', url: SOURCES.eohlc_faq },
        ],
      },
      {
        id: 'nan-04',
        provision: 'Principal Dwelling Scope',
        category: 'Use & Occupancy',
        status: 'inconsistent',
        stateLaw:
          'MGL c.40A §3 — ADUs are a protected use on any lot with a "single-family dwelling."',
        localBylaw:
          'Nantucket restricts ADUs to "single-family residential" properties only, excluding properties with nonconforming uses or mixed designations.',
        impact:
          'This restriction is unenforceable. Any lot with a single-family dwelling qualifies under state law, regardless of other designations.',
        citations: [
          { label: 'MGL c.40A §3', url: SOURCES.mgl40a_s3 },
          { label: '760 CMR 71.02 (definitions)', url: SOURCES.cmr71 },
        ],
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
        citations: [
          { label: 'Ch. 150 §8 (STR clause)', url: SOURCES.ch150_s78 },
          { label: '760 CMR 71.00', url: SOURCES.cmr71 },
        ],
      },
      {
        id: 'nan-06',
        provision: 'By-Right Permitting',
        category: 'Process & Administration',
        status: 'compliant',
        stateLaw: 'MGL c.40A §3 — conforming ADUs must be allowed by right.',
        localBylaw:
          'Nantucket allows conforming ADUs by right (though conformance is narrowly defined under current bylaw).',
        impact:
          'Technically consistent on process, but the restrictive eligibility criteria limit what qualifies for by-right treatment.',
        citations: [
          { label: 'MGL c.40A §3', url: SOURCES.mgl40a_s3 },
        ],
      },
      {
        id: 'nan-07',
        provision: 'Parking',
        category: 'Dimensional & Parking',
        status: 'compliant',
        stateLaw: '760 CMR 71.05(2) — parking may not exceed 1 space per ADU.',
        localBylaw: 'Nantucket requires 1 additional parking space per ADU.',
        impact: 'Consistent with state law.',
        citations: [
          { label: '760 CMR 71.05(2)', url: SOURCES.cmr71 },
        ],
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
    permits: { submitted: 2, approved: 2, denied: 0, pending: 0, approvalRate: 100 },
    provisions: [
      {
        id: 'lei-01',
        provision: 'Bedroom Limit on ADUs',
        category: 'Dimensional & Parking',
        status: 'inconsistent',
        stateLaw:
          '760 CMR 71.05 — no provision authorizes towns to limit the number of bedrooms in an ADU. Size is governed by square footage only.',
        localBylaw: 'Leicester limited ADUs to a maximum of 2 bedrooms.',
        impact:
          'This bedroom limit is unenforceable under state law. The AG formally disapproved this provision.',
        agDecision:
          'AG disapproved May 2025 — bedroom limits not authorized under Ch. 150 or 760 CMR 71.00.',
        citations: [
          { label: '760 CMR 71.05', url: SOURCES.cmr71 },
          { label: 'MGL c.40A §3', url: SOURCES.mgl40a_s3 },
          { label: 'AG Decision — Leicester (5/27/2025)', url: SOURCES.ag_leicester },
          { label: 'EOHLC FAQ (bedroom limits)', url: SOURCES.eohlc_faq },
        ],
      },
      {
        id: 'lei-02',
        provision: 'Single-Family Zoning District Restriction',
        category: 'Use & Occupancy',
        status: 'inconsistent',
        stateLaw:
          'MGL c.40A §3 — ADUs allowed on any lot with a single-family dwelling, regardless of zoning district.',
        localBylaw:
          'Leicester restricted ADUs to single-family residential zoning districts only.',
        impact:
          'This district restriction is unenforceable. The AG formally disapproved this provision.',
        agDecision:
          'AG disapproved May 2025 — cannot limit ADUs to specific zoning districts.',
        citations: [
          { label: 'MGL c.40A §3', url: SOURCES.mgl40a_s3 },
          { label: '760 CMR 71.02 (definitions)', url: SOURCES.cmr71 },
          { label: 'AG Decision — Leicester (5/27/2025)', url: SOURCES.ag_leicester },
        ],
      },
      {
        id: 'lei-03',
        provision: '"All Dimensional" Compliance Requirement',
        category: 'Dimensional & Parking',
        status: 'inconsistent',
        stateLaw:
          '760 CMR 71.05(1) — setbacks and dimensional requirements for ADUs may not exceed those for principal structures.',
        localBylaw:
          'Leicester required ADUs to comply with "all applicable dimensional requirements" — interpreted to mean the combined footprint must meet lot coverage, FAR, and setback rules designed for single structures.',
        impact:
          'This blanket dimensional requirement is unenforceable. The AG disapproved it as exceeding state limits.',
        agDecision:
          'AG disapproved May 2025 — blanket dimensional compliance exceeds state limits.',
        citations: [
          { label: '760 CMR 71.05(1)', url: SOURCES.cmr71 },
          { label: '760 CMR 71.03(3)(b)(2)', url: SOURCES.cmr71 },
          { label: 'AG Decision — Leicester (5/27/2025)', url: SOURCES.ag_leicester },
        ],
      },
      {
        id: 'lei-04',
        provision: 'ADU Size Limits',
        category: 'Dimensional & Parking',
        status: 'compliant',
        stateLaw: '760 CMR 71.05(3) — ADUs must be allowed up to 900 sq ft.',
        localBylaw: 'Leicester allows ADUs up to 900 sq ft.',
        impact: 'Consistent with state law.',
        citations: [
          { label: '760 CMR 71.05(3)', url: SOURCES.cmr71 },
        ],
      },
      {
        id: 'lei-05',
        provision: 'By-Right Permitting',
        category: 'Process & Administration',
        status: 'compliant',
        stateLaw: 'MGL c.40A §3 — conforming ADUs must be allowed by right.',
        localBylaw: 'Leicester allows conforming ADUs by right through building permit.',
        impact: 'Consistent with state law.',
        citations: [
          { label: 'MGL c.40A §3', url: SOURCES.mgl40a_s3 },
        ],
      },
      {
        id: 'lei-06',
        provision: 'Detached ADU Allowance',
        category: 'Use & Occupancy',
        status: 'compliant',
        stateLaw: 'MGL c.40A §3 — ADUs may be internal, attached, or detached.',
        localBylaw: 'Leicester allows all three ADU types.',
        impact: 'Consistent with state law.',
        citations: [
          { label: 'MGL c.40A §3', url: SOURCES.mgl40a_s3 },
        ],
      },
      {
        id: 'lei-07',
        provision: 'Parking',
        category: 'Dimensional & Parking',
        status: 'compliant',
        stateLaw: '760 CMR 71.05(2) — parking may not exceed 1 space.',
        localBylaw: 'Leicester requires no more than 1 parking space.',
        impact: 'Consistent with state law.',
        citations: [
          { label: '760 CMR 71.05(2)', url: SOURCES.cmr71 },
        ],
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
    permits: { submitted: 5, approved: 2, denied: 3, pending: 0, approvalRate: 40 },
    provisions: [
      {
        id: 'brk-01',
        provision: 'Floor Area Ratio (FAR) Cap on ADUs',
        category: 'Dimensional & Parking',
        status: 'inconsistent',
        stateLaw:
          '760 CMR 71.05(1) — dimensional requirements for ADUs may not exceed those for principal structures in the same district.',
        localBylaw:
          'Brookline imposed a FAR cap on lots with ADUs that effectively limited ADU size below the 900 sq ft state minimum on smaller lots.',
        impact:
          'This FAR cap is unenforceable where it reduces ADU size below 900 sq ft. The AG formally disapproved this provision.',
        agDecision:
          'AG disapproved June 2025 — FAR caps that reduce ADU size below state minimums violate Ch. 150.',
        citations: [
          { label: '760 CMR 71.05(1)', url: SOURCES.cmr71 },
          { label: '760 CMR 71.03(3)(b)(2)', url: SOURCES.cmr71 },
          { label: 'MGL c.40A §3', url: SOURCES.mgl40a_s3 },
          { label: 'AG Decision — Brookline (June 2025)', url: SOURCES.ag_brookline },
        ],
      },
      {
        id: 'brk-02',
        provision: 'Pre-Existing Nonconforming Conditions',
        category: 'Dimensional & Parking',
        status: 'inconsistent',
        stateLaw:
          'MGL c.40A §3 — ADUs are a protected use and must be allowed by right. Nonconforming status of the lot should not prevent ADU construction.',
        localBylaw:
          'Brookline required that lots with pre-existing nonconforming conditions (setbacks, lot coverage) could not add ADUs unless the nonconformity was cured.',
        impact:
          'This provision is unenforceable. Pre-existing nonconformities cannot bar ADU construction under state law. The AG formally disapproved this.',
        agDecision:
          'AG disapproved June 2025 — pre-existing nonconformities cannot bar ADU construction.',
        citations: [
          { label: 'MGL c.40A §3', url: SOURCES.mgl40a_s3 },
          { label: '760 CMR 71.02 (Protected Use ADU definition)', url: SOURCES.cmr71 },
          { label: 'AG Decision — Brookline (June 2025)', url: SOURCES.ag_brookline },
        ],
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
        citations: [
          { label: '760 CMR 71.05(5)', url: SOURCES.cmr71 },
          { label: '760 CMR 71.03(3)(a)', url: SOURCES.cmr71 },
          { label: 'EOHLC Model Zoning (historic districts)', url: SOURCES.eohlc_adu },
        ],
      },
      {
        id: 'brk-04',
        provision: 'ADU Size Limits',
        category: 'Dimensional & Parking',
        status: 'compliant',
        stateLaw: '760 CMR 71.05(3) — must allow up to 900 sq ft.',
        localBylaw: 'Brookline allows up to 900 sq ft.',
        impact: 'Consistent with state law.',
        citations: [
          { label: '760 CMR 71.05(3)', url: SOURCES.cmr71 },
        ],
      },
      {
        id: 'brk-05',
        provision: 'By-Right Permitting',
        category: 'Process & Administration',
        status: 'compliant',
        stateLaw: 'MGL c.40A §3 — conforming ADUs must be allowed by right.',
        localBylaw:
          'Brookline allows conforming ADUs by right (outside historic districts).',
        impact: 'Consistent with state law for non-historic areas.',
        citations: [
          { label: 'MGL c.40A §3', url: SOURCES.mgl40a_s3 },
        ],
      },
      {
        id: 'brk-06',
        provision: 'Detached ADU Allowance',
        category: 'Use & Occupancy',
        status: 'compliant',
        stateLaw: 'MGL c.40A §3 — internal, attached, or detached.',
        localBylaw: 'All three types permitted.',
        impact: 'Consistent with state law.',
        citations: [
          { label: 'MGL c.40A §3', url: SOURCES.mgl40a_s3 },
        ],
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
        impact: 'Consistent with state law — transit waiver properly applied.',
        citations: [
          { label: '760 CMR 71.05(2)', url: SOURCES.cmr71 },
          { label: '760 CMR 71.03(2)(b)', url: SOURCES.cmr71 },
        ],
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
    permits: { submitted: 2, approved: 1, denied: 1, pending: 0, approvalRate: 50 },
    provisions: [
      {
        id: 'can-01',
        provision: 'Minimum Lot Size Requirement',
        category: 'Dimensional & Parking',
        status: 'inconsistent',
        stateLaw:
          'MGL c.40A §3 — ADUs are a protected use on "any" lot with a single-family dwelling. No minimum lot size may be imposed beyond what applies to the principal dwelling.',
        localBylaw:
          'Canton imposed a minimum lot size of 10,000 sq ft for ADU eligibility.',
        impact:
          'This lot size requirement is unenforceable under state law. The AG formally disapproved this provision.',
        agDecision:
          'AG disapproved June 2025 — minimum lot size requirements for ADUs violate Ch. 150.',
        citations: [
          { label: 'MGL c.40A §3', url: SOURCES.mgl40a_s3 },
          { label: '760 CMR 71.03(3)(b)(2)', url: SOURCES.cmr71 },
          { label: 'AG Decision — Canton (6/4/2025)', url: SOURCES.ag_canton },
          { label: 'EOHLC FAQ (lot size)', url: SOURCES.eohlc_faq },
        ],
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
        citations: [
          { label: '760 CMR 71.05(1)', url: SOURCES.cmr71 },
          { label: '760 CMR 71.03(3)(a)', url: SOURCES.cmr71 },
        ],
      },
      {
        id: 'can-03',
        provision: 'ADU Size Limits',
        category: 'Dimensional & Parking',
        status: 'compliant',
        stateLaw: '760 CMR 71.05(3) — must allow up to 900 sq ft.',
        localBylaw: 'Canton allows up to 900 sq ft.',
        impact: 'Consistent with state law.',
        citations: [
          { label: '760 CMR 71.05(3)', url: SOURCES.cmr71 },
        ],
      },
      {
        id: 'can-04',
        provision: 'By-Right Permitting',
        category: 'Process & Administration',
        status: 'compliant',
        stateLaw: 'MGL c.40A §3 — conforming ADUs by right.',
        localBylaw: 'Canton allows conforming ADUs by right.',
        impact: 'Consistent with state law.',
        citations: [
          { label: 'MGL c.40A §3', url: SOURCES.mgl40a_s3 },
        ],
      },
      {
        id: 'can-05',
        provision: 'Detached ADU Allowance',
        category: 'Use & Occupancy',
        status: 'compliant',
        stateLaw: 'MGL c.40A §3 — internal, attached, or detached.',
        localBylaw: 'All three types permitted.',
        impact: 'Consistent with state law.',
        citations: [
          { label: 'MGL c.40A §3', url: SOURCES.mgl40a_s3 },
        ],
      },
      {
        id: 'can-06',
        provision: 'Parking',
        category: 'Dimensional & Parking',
        status: 'compliant',
        stateLaw: '760 CMR 71.05(2) — max 1 space.',
        localBylaw: 'Canton requires 1 space max.',
        impact: 'Consistent with state law.',
        citations: [
          { label: '760 CMR 71.05(2)', url: SOURCES.cmr71 },
        ],
      },
      {
        id: 'can-07',
        provision: 'Owner-Occupancy',
        category: 'Use & Occupancy',
        status: 'compliant',
        stateLaw: 'MGL c.40A §3 — no owner-occupancy requirement allowed.',
        localBylaw: 'Canton does not require owner-occupancy.',
        impact: 'Consistent with state law.',
        citations: [
          { label: 'MGL c.40A §3', url: SOURCES.mgl40a_s3 },
        ],
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
    permits: { submitted: 3, approved: 2, denied: 1, pending: 0, approvalRate: 67 },
    provisions: [
      {
        id: 'han-01',
        provision: 'Site Plan Review as De Facto Special Permit',
        category: 'Process & Administration',
        status: 'inconsistent',
        stateLaw:
          'MGL c.40A §3 — ADUs must be allowed by right. No special permit, site plan review with denial authority, or discretionary approval may be required.',
        localBylaw:
          'Hanson requires site plan review with Planning Board authority to impose conditions and potentially deny applications based on subjective criteria.',
        impact:
          'This discretionary review process is unenforceable for Protected Use ADUs. The AG formally disapproved this provision.',
        agDecision:
          'AG partial disapproval 2025 — site plan review functioning as special permit violates Ch. 150.',
        citations: [
          { label: 'MGL c.40A §3', url: SOURCES.mgl40a_s3 },
          { label: '760 CMR 71.03(3)(5)', url: SOURCES.cmr71 },
          { label: 'AG Decision — Hanson (2025)', url: SOURCES.ag_hanson },
        ],
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
          'May discourage ADU construction if owners believe they would have to remove the unit upon selling. Creates legal ambiguity around property transfers.',
        citations: [
          { label: '760 CMR 71.00', url: SOURCES.cmr71 },
          { label: '760 CMR 71.03(2)', url: SOURCES.cmr71 },
          { label: 'Ch. 150 §8', url: SOURCES.ch150_s78 },
        ],
      },
      {
        id: 'han-03',
        provision: 'ADU Size Limits',
        category: 'Dimensional & Parking',
        status: 'compliant',
        stateLaw: '760 CMR 71.05(3) — must allow up to 900 sq ft.',
        localBylaw: 'Hanson allows up to 900 sq ft.',
        impact: 'Consistent with state law.',
        citations: [
          { label: '760 CMR 71.05(3)', url: SOURCES.cmr71 },
        ],
      },
      {
        id: 'han-04',
        provision: 'Detached ADU Allowance',
        category: 'Use & Occupancy',
        status: 'compliant',
        stateLaw: 'MGL c.40A §3 — internal, attached, or detached.',
        localBylaw: 'All three types permitted.',
        impact: 'Consistent with state law.',
        citations: [
          { label: 'MGL c.40A §3', url: SOURCES.mgl40a_s3 },
        ],
      },
      {
        id: 'han-05',
        provision: 'Parking',
        category: 'Dimensional & Parking',
        status: 'compliant',
        stateLaw: '760 CMR 71.05(2) — max 1 space.',
        localBylaw: 'Hanson requires 1 space max.',
        impact: 'Consistent with state law.',
        citations: [
          { label: '760 CMR 71.05(2)', url: SOURCES.cmr71 },
        ],
      },
      {
        id: 'han-06',
        provision: 'Owner-Occupancy',
        category: 'Use & Occupancy',
        status: 'compliant',
        stateLaw: 'MGL c.40A §3 — no owner-occupancy requirement allowed.',
        localBylaw: 'Hanson does not require owner-occupancy.',
        impact: 'Consistent with state law.',
        citations: [
          { label: 'MGL c.40A §3', url: SOURCES.mgl40a_s3 },
        ],
      },
    ],
  },

  // ── NEW BEDFORD ──────────────────────────────────────────────────────
  {
    slug: 'new-bedford',
    name: 'New Bedford',
    county: 'Bristol',
    population: 101_000,
    bylawLastUpdated: 'September 2024',
    bylawSource: 'New Bedford Zoning Ordinance Ch. 9, §§2340 & 1200',
    agDisapprovals: 0,
    permits: { submitted: 6, approved: 2, denied: 4, pending: 0, approvalRate: 33 },
    provisions: [
      {
        id: 'nb-01',
        provision: 'Short-Term Rental Restriction',
        category: 'Use & Occupancy',
        status: 'review',
        stateLaw:
          '760 CMR 71.00 is silent on short-term rental of ADUs. Towns may regulate STR separately but may not use STR restrictions to effectively ban or discourage ADU construction.',
        localBylaw:
          'New Bedford §2340 requires ADU lease terms of at least 31 days, effectively banning short-term rental use of ADUs.',
        impact:
          'Removes a key revenue model for homeowners considering ADU construction. While towns can regulate STRs generally, an ADU-specific STR ban may face challenge if shown to discourage ADU development.',
        citations: [
          { label: 'Ch. 150 §8 (STR clause)', url: SOURCES.ch150_s78 },
          { label: '760 CMR 71.00', url: SOURCES.cmr71 },
          { label: 'EOHLC FAQ', url: SOURCES.eohlc_faq },
        ],
      },
      {
        id: 'nb-02',
        provision: 'Design Guidelines for Detached ADUs',
        category: 'Building & Safety',
        status: 'review',
        stateLaw:
          '760 CMR 71.05(5) — towns may impose "reasonable" design standards for detached ADUs but may not use them to effectively prohibit construction.',
        localBylaw:
          'New Bedford imposes optional design guidelines for by-right ADUs (up to 900 sq ft) but makes them mandatory for special permit ADUs (900-1,200 sq ft), including architectural compatibility requirements.',
        impact:
          'By-right tier design guidelines are advisory and likely consistent. Mandatory guidelines for the special permit tier are permissible since that tier is beyond the state-guaranteed minimum. Grey area if advisory guidelines are applied as de facto requirements.',
        citations: [
          { label: '760 CMR 71.05(5)', url: SOURCES.cmr71 },
          { label: '760 CMR 71.03(3)(a)', url: SOURCES.cmr71 },
        ],
      },
      {
        id: 'nb-03',
        provision: 'Special Permit for Larger ADUs',
        category: 'Process & Administration',
        status: 'review',
        stateLaw:
          'MGL c.40A §3 — ADUs meeting state requirements (up to 900 sq ft) must be allowed by right. Towns may create additional permitting tiers for ADUs exceeding the state minimum.',
        localBylaw:
          'New Bedford allows ADUs up to 900 sq ft by right but requires a special permit for ADUs between 900 and 1,200 sq ft.',
        impact:
          'The special permit tier for 900-1,200 sq ft is likely permissible since it exceeds the state-guaranteed by-right minimum. However, the discretionary approval process for the larger tier could be challenged if applied to restrict overall ADU development.',
        citations: [
          { label: 'MGL c.40A §3', url: SOURCES.mgl40a_s3 },
          { label: '760 CMR 71.03(7)', url: SOURCES.cmr71 },
        ],
      },
      {
        id: 'nb-04',
        provision: 'By-Right Permitting',
        category: 'Process & Administration',
        status: 'compliant',
        stateLaw:
          'MGL c.40A §3 — conforming ADUs must be allowed by right with no special permit or variance.',
        localBylaw:
          'New Bedford allows ADUs up to 900 sq ft by right through the building permit process. No special permit, variance, or discretionary review required for conforming units.',
        impact: 'Consistent with state law.',
        citations: [
          { label: 'MGL c.40A §3', url: SOURCES.mgl40a_s3 },
          { label: 'Ch. 150 §8', url: SOURCES.ch150_s78 },
        ],
      },
      {
        id: 'nb-05',
        provision: 'ADU Size Limits',
        category: 'Dimensional & Parking',
        status: 'compliant',
        stateLaw:
          '760 CMR 71.05(3) — ADUs must be allowed up to 900 sq ft or 50% of principal dwelling living area, whichever is less.',
        localBylaw:
          'New Bedford allows ADUs up to 900 sq ft by right, with an additional special permit tier allowing up to 1,200 sq ft.',
        impact: 'Consistent with state law — meets and exceeds the state minimum.',
        citations: [
          { label: '760 CMR 71.05(3)', url: SOURCES.cmr71 },
          { label: 'MGL c.40A §1A', url: SOURCES.mgl40a_s1a },
        ],
      },
      {
        id: 'nb-06',
        provision: 'Detached ADU Allowance',
        category: 'Use & Occupancy',
        status: 'compliant',
        stateLaw:
          'MGL c.40A §3 — ADUs may be within, attached to, or detached from the principal dwelling.',
        localBylaw: 'New Bedford allows internal, attached, and detached ADUs.',
        impact: 'Consistent with state law.',
        citations: [
          { label: 'MGL c.40A §3', url: SOURCES.mgl40a_s3 },
        ],
      },
      {
        id: 'nb-07',
        provision: 'Owner-Occupancy',
        category: 'Use & Occupancy',
        status: 'compliant',
        stateLaw:
          'MGL c.40A §3 — towns may not require owner-occupancy for ADUs as a protected use.',
        localBylaw: 'New Bedford does not require owner-occupancy for ADU properties.',
        impact: 'Consistent with state law.',
        citations: [
          { label: 'MGL c.40A §3', url: SOURCES.mgl40a_s3 },
          { label: '760 CMR 71.03(2)(a)', url: SOURCES.cmr71 },
        ],
      },
      {
        id: 'nb-08',
        provision: 'Parking',
        category: 'Dimensional & Parking',
        status: 'compliant',
        stateLaw:
          '760 CMR 71.05(2) — parking for an ADU shall not exceed 1 space. Must be waived within 0.5 miles of public transit.',
        localBylaw:
          'New Bedford requires a maximum of 1 parking space per ADU and waives the requirement for properties within 0.5 miles of SRTA transit stops.',
        impact: 'Consistent with state law — transit proximity waiver properly applied.',
        citations: [
          { label: '760 CMR 71.05(2)', url: SOURCES.cmr71 },
          { label: '760 CMR 71.03(2)(b)', url: SOURCES.cmr71 },
        ],
      },
      {
        id: 'nb-09',
        provision: 'District Scope',
        category: 'Use & Occupancy',
        status: 'compliant',
        stateLaw:
          'MGL c.40A §3 — ADUs are a protected use allowed by right on any lot with a single-family dwelling, in any zoning district.',
        localBylaw:
          'New Bedford allows ADUs in all zoning districts where single-family dwellings are permitted.',
        impact: 'Consistent with state law.',
        citations: [
          { label: 'MGL c.40A §3', url: SOURCES.mgl40a_s3 },
        ],
      },
      {
        id: 'nb-10',
        provision: 'Number of ADUs Allowed',
        category: 'Use & Occupancy',
        status: 'compliant',
        stateLaw:
          'MGL c.40A §3 — at least one ADU must be allowed per single-family lot.',
        localBylaw: 'New Bedford allows one ADU per single-family lot.',
        impact: 'Consistent with state law.',
        citations: [
          { label: 'MGL c.40A §3', url: SOURCES.mgl40a_s3 },
        ],
      },
    ],
  },

  // ── NEWTON ──────────────────────────────────────────────────────────
  {
    slug: 'newton',
    name: 'Newton',
    county: 'Norfolk',
    population: 88_900,
    bylawLastUpdated: 'April 2025',
    bylawSource: 'Newton Zoning Ordinance §30-22 (April 2025 amendments)',
    agDisapprovals: 0,
    permits: { submitted: 40, approved: 18, denied: 0, pending: 22, approvalRate: 45 },
    provisions: [
      {
        id: 'new-01',
        provision: 'Owner-Occupancy Requirement',
        category: 'Use & Occupancy',
        status: 'compliant',
        stateLaw:
          'MGL c.40A §3 (as amended by Ch. 150) — towns may not require owner-occupancy for ADUs as a protected use.',
        localBylaw:
          'Newton removed owner-occupancy requirement in April 2025 per state law.',
        impact: 'Consistent with state law.',
        citations: [
          { label: 'MGL c.40A §3', url: SOURCES.mgl40a_s3 },
          { label: 'Newton ADU Zoning', url: SOURCES.newton_adu },
          { label: 'Fig City News', url: SOURCES.newton_news },
        ],
      },
      {
        id: 'new-02',
        provision: 'By-Right Permitting (under 900 sqft)',
        category: 'Process & Administration',
        status: 'compliant',
        stateLaw:
          'MGL c.40A §3 — ADUs that meet state requirements must be allowed by right with no special permit or variance.',
        localBylaw:
          'Internal ADUs and detached ADUs up to 900 sqft are by-right, only building permit required.',
        impact: 'Consistent with state law.',
        citations: [
          { label: 'MGL c.40A §3', url: SOURCES.mgl40a_s3 },
          { label: 'Newton ADU Zoning', url: SOURCES.newton_adu },
        ],
      },
      {
        id: 'new-03',
        provision: 'Special Permit for Larger ADUs',
        category: 'Process & Administration',
        status: 'review',
        stateLaw:
          'MGL c.40A §3 — ADUs meeting state requirements (up to 900 sq ft) must be allowed by right. Towns may create additional permitting tiers for ADUs exceeding the state minimum.',
        localBylaw:
          'ADUs between 900-1500 sqft still require special permit from City Council.',
        impact:
          'State law only guarantees by-right up to 900 sqft, so this may be permissible but creates a two-tier system that could discourage larger builds.',
        citations: [
          { label: 'MGL c.40A §3', url: SOURCES.mgl40a_s3 },
          { label: '760 CMR 71.03(7)', url: SOURCES.cmr71 },
          { label: 'Newton ADU Zoning', url: SOURCES.newton_adu },
        ],
      },
      {
        id: 'new-04',
        provision: 'Design Compatibility Standards',
        category: 'Building & Safety',
        status: 'review',
        stateLaw:
          '760 CMR 71.05(5) — towns may impose "reasonable" design standards for detached ADUs but may not use them to effectively prohibit construction.',
        localBylaw:
          'ADU must match "character and architecture" of primary dwelling.',
        impact:
          'State allows "reasonable" design standards but subjective compatibility review could function as gatekeeping.',
        citations: [
          { label: '760 CMR 71.05(5)', url: SOURCES.cmr71 },
          { label: 'Newton ADU Zoning', url: SOURCES.newton_adu },
        ],
      },
      {
        id: 'new-05',
        provision: 'Historic District Carriage House Exemption',
        category: 'Use & Occupancy',
        status: 'review',
        stateLaw:
          'MGL c.40A §3 — ADUs are a protected use; regulations should apply uniformly across property types.',
        localBylaw:
          'Historic carriage houses get different rules — bypass size/setback requirements — creating an unequal system.',
        impact:
          'Benefits wealthier historic properties over standard lots. May face equal protection challenge if shown to create a two-tier system.',
        citations: [
          { label: 'MGL c.40A §3', url: SOURCES.mgl40a_s3 },
          { label: 'Newton ADU Zoning', url: SOURCES.newton_adu },
          { label: 'Fig City News', url: SOURCES.newton_news },
        ],
      },
      {
        id: 'new-06',
        provision: 'ADU Size Limits',
        category: 'Dimensional & Parking',
        status: 'compliant',
        stateLaw:
          '760 CMR 71.05(3) — ADUs must be allowed up to 900 sq ft or 50% of principal dwelling living area, whichever is less.',
        localBylaw:
          'By-right up to 900 sqft or 50% of principal dwelling, consistent with state law.',
        impact: 'Consistent with state law.',
        citations: [
          { label: '760 CMR 71.05(3)', url: SOURCES.cmr71 },
          { label: 'Newton ADU Zoning', url: SOURCES.newton_adu },
        ],
      },
      {
        id: 'new-07',
        provision: 'Parking Requirements',
        category: 'Dimensional & Parking',
        status: 'compliant',
        stateLaw:
          '760 CMR 71.05(2) — parking for an ADU shall not exceed 1 space.',
        localBylaw: 'No additional parking required for ADUs.',
        impact: 'Consistent with state law.',
        citations: [
          { label: '760 CMR 71.05(2)', url: SOURCES.cmr71 },
        ],
      },
      {
        id: 'new-08',
        provision: 'STR Prohibition',
        category: 'Use & Occupancy',
        status: 'compliant',
        stateLaw:
          '760 CMR 71.00 is silent on short-term rental of ADUs. Towns may regulate STR separately.',
        localBylaw:
          'ADUs prohibited from short-term rental use (under 30 days).',
        impact: 'Towns can regulate STRs per state law. Consistent.',
        citations: [
          { label: 'Ch. 150 §8 (STR clause)', url: SOURCES.ch150_s78 },
          { label: 'Newton ADU Zoning', url: SOURCES.newton_adu },
        ],
      },
      {
        id: 'new-09',
        provision: 'Number of ADUs',
        category: 'Use & Occupancy',
        status: 'compliant',
        stateLaw: 'MGL c.40A §3 — at least one ADU must be allowed per single-family lot.',
        localBylaw: 'One ADU per lot.',
        impact: 'Consistent with state law.',
        citations: [
          { label: 'MGL c.40A §3', url: SOURCES.mgl40a_s3 },
        ],
      },
      {
        id: 'new-10',
        provision: 'Detached ADU Allowance',
        category: 'Use & Occupancy',
        status: 'compliant',
        stateLaw:
          'MGL c.40A §3 — ADUs may be within, attached to, or detached from the principal dwelling.',
        localBylaw: 'Both internal and detached ADUs permitted.',
        impact: 'Consistent with state law.',
        citations: [
          { label: 'MGL c.40A §3', url: SOURCES.mgl40a_s3 },
        ],
      },
    ],
  },

  // ── ANDOVER ─────────────────────────────────────────────────────────
  {
    slug: 'andover',
    name: 'Andover',
    county: 'Essex',
    population: 36_500,
    bylawLastUpdated: 'April 2025 (AG review pending)',
    bylawSource: 'Andover Zoning Bylaw Article VIII, Art. 22 (April 2025 Town Meeting)',
    agDisapprovals: 0,
    permits: { submitted: 10, approved: 9, denied: 0, pending: 1, approvalRate: 90 },
    provisions: [
      {
        id: 'and-01',
        provision: 'Site Plan Review by ZBA',
        category: 'Process & Administration',
        status: 'review',
        stateLaw:
          'MGL c.40A §3 — ADUs must be allowed by right. No special permit, site plan review with denial authority, or discretionary approval may be required.',
        localBylaw:
          'ADU applications subject to site plan review by Zoning Board of Appeals.',
        impact:
          'While not technically a special permit, site plan review with ZBA discretion could function as de facto special permit — same pattern AG disapproved in Hanson.',
        citations: [
          { label: 'MGL c.40A §3', url: SOURCES.mgl40a_s3 },
          { label: '760 CMR 71.03(3)(5)', url: SOURCES.cmr71 },
          { label: 'Andover ADU Page', url: SOURCES.andover_adu },
        ],
      },
      {
        id: 'and-02',
        provision: 'Parking Requirement (>0.5mi from transit)',
        category: 'Dimensional & Parking',
        status: 'review',
        stateLaw:
          '760 CMR 71.05(2) — parking for an ADU shall not exceed 1 space. Must be waived within 0.5 miles of public transit.',
        localBylaw:
          'One off-street parking space required if property is more than half mile from public transit.',
        impact:
          'State law caps parking at 1 space, and Andover has limited transit — this effectively requires parking for most properties. May be reasonable but burdens suburban lots.',
        citations: [
          { label: '760 CMR 71.05(2)', url: SOURCES.cmr71 },
          { label: 'Andover ADU Page', url: SOURCES.andover_adu },
        ],
      },
      {
        id: 'and-03',
        provision: 'STR Prohibition',
        category: 'Use & Occupancy',
        status: 'compliant',
        stateLaw:
          '760 CMR 71.00 is silent on short-term rental of ADUs. Towns may regulate STR separately.',
        localBylaw: 'ADUs may not be used as short-term rentals.',
        impact: 'Permitted under state law. Consistent.',
        citations: [
          { label: 'Ch. 150 §8 (STR clause)', url: SOURCES.ch150_s78 },
          { label: 'Andover ADU Page', url: SOURCES.andover_adu },
        ],
      },
      {
        id: 'and-04',
        provision: 'No Condo Conversion',
        category: 'Use & Occupancy',
        status: 'compliant',
        stateLaw:
          'MGL c.40A §3 — ADUs are a protected use. State law does not require towns to allow condo conversion of ADUs.',
        localBylaw: 'ADUs cannot be converted to condominiums.',
        impact: 'Consistent with state law.',
        citations: [
          { label: 'MGL c.40A §3', url: SOURCES.mgl40a_s3 },
          { label: 'Andover Town Meeting Recap', url: SOURCES.andover_tm },
        ],
      },
      {
        id: 'and-05',
        provision: 'Principal Structure Must Be Complete',
        category: 'Process & Administration',
        status: 'review',
        stateLaw:
          'MGL c.40A §3 — ADUs are a protected use on any lot with a single-family dwelling.',
        localBylaw:
          'Principal structures must be completed before ADU may be built.',
        impact:
          'Could delay legitimate projects where ADU is planned simultaneously with new construction.',
        citations: [
          { label: 'MGL c.40A §3', url: SOURCES.mgl40a_s3 },
          { label: 'Andover ADU Page', url: SOURCES.andover_adu },
        ],
      },
      {
        id: 'and-06',
        provision: 'By-Right Permitting',
        category: 'Process & Administration',
        status: 'compliant',
        stateLaw:
          'MGL c.40A §3 — ADUs that meet state requirements must be allowed by right.',
        localBylaw: 'ADUs up to 900 sqft allowed by right (subject to site plan review).',
        impact: 'Consistent with state law (process concern addressed in and-01).',
        citations: [
          { label: 'MGL c.40A §3', url: SOURCES.mgl40a_s3 },
        ],
      },
      {
        id: 'and-07',
        provision: 'ADU Size Limits',
        category: 'Dimensional & Parking',
        status: 'compliant',
        stateLaw:
          '760 CMR 71.05(3) — ADUs must be allowed up to 900 sq ft or 50% of principal dwelling living area, whichever is less.',
        localBylaw: '900 sqft or 50% of principal dwelling.',
        impact: 'Consistent with state law.',
        citations: [
          { label: '760 CMR 71.05(3)', url: SOURCES.cmr71 },
        ],
      },
      {
        id: 'and-08',
        provision: 'Number of ADUs',
        category: 'Use & Occupancy',
        status: 'compliant',
        stateLaw: 'MGL c.40A §3 — at least one ADU must be allowed per single-family lot.',
        localBylaw: 'One ADU per lot.',
        impact: 'Consistent with state law.',
        citations: [
          { label: 'MGL c.40A §3', url: SOURCES.mgl40a_s3 },
        ],
      },
    ],
  },

  // ── MILTON ──────────────────────────────────────────────────────────
  {
    slug: 'milton',
    name: 'Milton',
    county: 'Norfolk',
    population: 28_000,
    bylawLastUpdated: 'Pre-2025 (Town Meeting referred back to Planning Board)',
    bylawSource: 'Milton Zoning Bylaw §275-10.13',
    agDisapprovals: 0,
    permits: { submitted: 25, approved: 24, denied: 0, pending: 1, approvalRate: 96 },
    provisions: [
      {
        id: 'mil-01',
        provision: 'Owner-Occupancy Requirement',
        category: 'Use & Occupancy',
        status: 'inconsistent',
        stateLaw:
          'MGL c.40A §3 (as amended by Ch. 150) — towns may not require owner-occupancy for ADUs as a protected use.',
        localBylaw:
          'Requires notarized affidavit that owner occupies either principal dwelling or ADU.',
        impact:
          'State law prohibits owner-occupancy requirements. Unenforceable.',
        citations: [
          { label: 'MGL c.40A §3', url: SOURCES.mgl40a_s3 },
          { label: 'Ch. 150 §§7–8', url: SOURCES.ch150_s78 },
          { label: 'Milton ADU Bylaw', url: SOURCES.milton_article },
        ],
      },
      {
        id: 'mil-02',
        provision: 'Family-Only Occupancy Restriction',
        category: 'Use & Occupancy',
        status: 'inconsistent',
        stateLaw:
          'MGL c.40A §3 — ADUs are a protected use. Towns may not restrict who can occupy an ADU.',
        localBylaw:
          'Current bylaw restricts ADU occupants to family members or domestic employees.',
        impact:
          'State law prohibits restricting who can occupy an ADU. Unenforceable.',
        citations: [
          { label: 'MGL c.40A §3', url: SOURCES.mgl40a_s3 },
          { label: '760 CMR 71.03(2)', url: SOURCES.cmr71 },
          { label: 'Milton ADU Info', url: SOURCES.milton_adu },
        ],
      },
      {
        id: 'mil-03',
        provision: 'Special Permit for Detached/Addition ADUs',
        category: 'Process & Administration',
        status: 'inconsistent',
        stateLaw:
          'MGL c.40A §3 — ADUs that meet state requirements must be allowed by right with no special permit or variance.',
        localBylaw:
          'Detached ADUs and additions require special permit from Board of Appeals.',
        impact:
          'State law requires by-right permitting for first ADU. Unenforceable.',
        citations: [
          { label: 'MGL c.40A §3', url: SOURCES.mgl40a_s3 },
          { label: 'Ch. 150 §8', url: SOURCES.ch150_s78 },
          { label: 'Milton ADU Bylaw', url: SOURCES.milton_article },
        ],
      },
      {
        id: 'mil-04',
        provision: 'Site Plan Review by Planning Board',
        category: 'Process & Administration',
        status: 'review',
        stateLaw:
          'MGL c.40A §3 — ADUs must be allowed by right. No discretionary approval may be required.',
        localBylaw:
          'Proposed updated bylaw requires site plan approval by Planning Board for expansions and detached structures.',
        impact:
          'Could function as de facto special permit depending on implementation.',
        citations: [
          { label: 'MGL c.40A §3', url: SOURCES.mgl40a_s3 },
          { label: 'Milton ADU Bylaw', url: SOURCES.milton_article },
        ],
      },
      {
        id: 'mil-05',
        provision: 'Design Compatibility Standards',
        category: 'Building & Safety',
        status: 'review',
        stateLaw:
          '760 CMR 71.05(5) — towns may impose "reasonable" design standards for detached ADUs but may not use them to effectively prohibit construction.',
        localBylaw:
          'Exterior changes must be "compatible with architectural style" with "careful attention to detailing."',
        impact:
          'Subjective standard that could delay or deny projects.',
        citations: [
          { label: '760 CMR 71.05(5)', url: SOURCES.cmr71 },
          { label: 'Milton ADU Bylaw', url: SOURCES.milton_article },
        ],
      },
      {
        id: 'mil-06',
        provision: '12-Month Minimum Lease',
        category: 'Use & Occupancy',
        status: 'compliant',
        stateLaw:
          '760 CMR 71.00 is silent on short-term rental of ADUs. Towns may regulate STR separately.',
        localBylaw: 'Minimum lease of 12 months, no short-term rentals.',
        impact: 'Permitted under state law. Consistent.',
        citations: [
          { label: 'Ch. 150 §8 (STR clause)', url: SOURCES.ch150_s78 },
        ],
      },
      {
        id: 'mil-07',
        provision: 'ADU Size Limits',
        category: 'Dimensional & Parking',
        status: 'compliant',
        stateLaw:
          '760 CMR 71.05(3) — ADUs must be allowed up to 900 sq ft or 50% of principal dwelling living area, whichever is less.',
        localBylaw: '900 sqft or 50% of principal dwelling.',
        impact: 'Consistent with state law.',
        citations: [
          { label: '760 CMR 71.05(3)', url: SOURCES.cmr71 },
        ],
      },
      {
        id: 'mil-08',
        provision: 'Parking (>0.5mi from transit)',
        category: 'Dimensional & Parking',
        status: 'compliant',
        stateLaw:
          '760 CMR 71.05(2) — parking may not exceed 1 space. Must be waived within 0.5 miles of public transit.',
        localBylaw:
          'One space required if more than 0.5 miles from transit station.',
        impact: 'Consistent with state allowance.',
        citations: [
          { label: '760 CMR 71.05(2)', url: SOURCES.cmr71 },
        ],
      },
      {
        id: 'mil-09',
        provision: 'Number of ADUs',
        category: 'Use & Occupancy',
        status: 'compliant',
        stateLaw: 'MGL c.40A §3 — at least one ADU must be allowed per single-family lot.',
        localBylaw: 'One ADU per lot.',
        impact: 'Consistent with state law.',
        citations: [
          { label: 'MGL c.40A §3', url: SOURCES.mgl40a_s3 },
        ],
      },
      {
        id: 'mil-10',
        provision: 'Landscaping Buffer',
        category: 'Building & Safety',
        status: 'compliant',
        stateLaw:
          '760 CMR 71.05(5) — towns may impose reasonable design and site standards.',
        localBylaw: '3-foot buffer along driveways/parking.',
        impact: 'Minor requirement unlikely to be challenged.',
        citations: [
          { label: '760 CMR 71.05(5)', url: SOURCES.cmr71 },
        ],
      },
    ],
  },

  // ── DUXBURY ─────────────────────────────────────────────────────────
  {
    slug: 'duxbury',
    name: 'Duxbury',
    county: 'Plymouth',
    population: 16_000,
    bylawLastUpdated: 'June 2025 (STM amendments pending AG approval)',
    bylawSource: 'Duxbury Zoning Bylaw',
    agDisapprovals: 0,
    permits: { submitted: 3, approved: 2, denied: 0, pending: 1, approvalRate: 67 },
    provisions: [
      {
        id: 'dux-01',
        provision: 'Owner-Occupancy Requirement',
        category: 'Use & Occupancy',
        status: 'inconsistent',
        stateLaw:
          'MGL c.40A §3 (as amended by Ch. 150) — towns may not require owner-occupancy for ADUs as a protected use.',
        localBylaw:
          'Old bylaw requires owner to reside in either ADU or primary dwelling.',
        impact:
          'State law prohibits owner-occupancy requirements. Unenforceable.',
        citations: [
          { label: 'MGL c.40A §3', url: SOURCES.mgl40a_s3 },
          { label: 'Ch. 150 §§7–8', url: SOURCES.ch150_s78 },
          { label: 'Duxbury Clipper', url: SOURCES.duxbury_news },
        ],
      },
      {
        id: 'dux-02',
        provision: 'Special Permit Requirement',
        category: 'Process & Administration',
        status: 'inconsistent',
        stateLaw:
          'MGL c.40A §3 — ADUs that meet state requirements must be allowed by right with no special permit or variance.',
        localBylaw:
          'Old bylaw requires special permit from Board of Appeals for ADUs.',
        impact:
          'State law requires by-right permitting. Unenforceable.',
        citations: [
          { label: 'MGL c.40A §3', url: SOURCES.mgl40a_s3 },
          { label: 'Ch. 150 §8', url: SOURCES.ch150_s78 },
          { label: 'Duxbury Clipper', url: SOURCES.duxbury_news },
        ],
      },
      {
        id: 'dux-03',
        provision: '10-Year Home Age Requirement',
        category: 'Process & Administration',
        status: 'inconsistent',
        stateLaw:
          'MGL c.40A §3 — ADUs are a protected use on any lot with a single-family dwelling. No age-of-structure requirement is authorized.',
        localBylaw:
          'Primary home must be at least 10 years old to apply for ADU.',
        impact:
          'No basis in state law — restricts ADU creation on newer homes. Unenforceable.',
        citations: [
          { label: 'MGL c.40A §3', url: SOURCES.mgl40a_s3 },
          { label: 'EOHLC FAQ', url: SOURCES.eohlc_faq },
          { label: 'Duxbury Clipper', url: SOURCES.duxbury_news },
        ],
      },
      {
        id: 'dux-04',
        provision: 'Site Plan Review as Quasi-Special-Permit',
        category: 'Process & Administration',
        status: 'review',
        stateLaw:
          'MGL c.40A §3 — ADUs must be allowed by right. No discretionary approval may be required.',
        localBylaw:
          'Planning Board intends to use site plan review process for ADUs. Board member stated it could be used "almost like a special permit."',
        impact:
          'Gray area — depends on whether review is ministerial or discretionary.',
        citations: [
          { label: 'MGL c.40A §3', url: SOURCES.mgl40a_s3 },
          { label: 'Duxbury STM Article', url: SOURCES.duxbury_stm },
          { label: 'Duxbury Clipper', url: SOURCES.duxbury_news },
        ],
      },
      {
        id: 'dux-05',
        provision: 'STR Regulation Pending',
        category: 'Use & Occupancy',
        status: 'review',
        stateLaw:
          '760 CMR 71.00 is silent on short-term rental of ADUs. Towns may regulate STR separately but may not use restrictions to effectively ban ADUs.',
        localBylaw:
          'Town is developing short-term rental bylaw specifically targeting ADUs.',
        impact:
          'Outcome depends on whether restrictions are reasonable per state law.',
        citations: [
          { label: 'Ch. 150 §8 (STR clause)', url: SOURCES.ch150_s78 },
          { label: 'Duxbury Clipper', url: SOURCES.duxbury_news },
        ],
      },
      {
        id: 'dux-06',
        provision: 'ADU Size Limits',
        category: 'Dimensional & Parking',
        status: 'compliant',
        stateLaw:
          '760 CMR 71.05(3) — ADUs must be allowed up to 900 sq ft or 50% of principal dwelling living area, whichever is less.',
        localBylaw: 'Consistent with state limits.',
        impact: 'Consistent with state law.',
        citations: [
          { label: '760 CMR 71.05(3)', url: SOURCES.cmr71 },
        ],
      },
      {
        id: 'dux-07',
        provision: 'Detached ADU Allowance',
        category: 'Use & Occupancy',
        status: 'compliant',
        stateLaw:
          'MGL c.40A §3 — ADUs may be within, attached to, or detached from the principal dwelling.',
        localBylaw: 'Both internal and detached ADUs permitted.',
        impact: 'Consistent with state law.',
        citations: [
          { label: 'MGL c.40A §3', url: SOURCES.mgl40a_s3 },
        ],
      },
      {
        id: 'dux-08',
        provision: 'Number of ADUs',
        category: 'Use & Occupancy',
        status: 'compliant',
        stateLaw: 'MGL c.40A §3 — at least one ADU must be allowed per single-family lot.',
        localBylaw: 'One ADU per lot.',
        impact: 'Consistent with state law.',
        citations: [
          { label: 'MGL c.40A §3', url: SOURCES.mgl40a_s3 },
        ],
      },
    ],
  },

  // ── BARNSTABLE ──────────────────────────────────────────────────────
  {
    slug: 'barnstable',
    name: 'Barnstable',
    county: 'Barnstable',
    population: 48_000,
    bylawLastUpdated: 'May 2025',
    bylawSource: 'Barnstable Zoning Ordinance §240-47.2 (May 2025 amendments)',
    agDisapprovals: 0,
    permits: { submitted: 31, approved: 6, denied: 0, pending: 25, approvalRate: 19 },
    provisions: [
      {
        id: 'bar-01',
        provision: 'Entrance Visibility Requirement',
        category: 'Building & Safety',
        status: 'review',
        stateLaw:
          '760 CMR 71.05(5) — towns may impose "reasonable" design standards for detached ADUs but may not use them to effectively prohibit construction.',
        localBylaw:
          'ADU entrance must be "less visible from the street view" than the main entrance.',
        impact:
          'This is a design restriction that could be used to deny otherwise compliant ADUs on corner lots or properties with limited frontage. Gray area — could be "reasonable" or could function as gatekeeping.',
        citations: [
          { label: '760 CMR 71.05(5)', url: SOURCES.cmr71 },
          { label: 'Barnstable ADU Meeting', url: SOURCES.barnstable_adu },
        ],
      },
      {
        id: 'bar-02',
        provision: 'Site Plan/Floor Plan/Elevation Submission',
        category: 'Process & Administration',
        status: 'review',
        stateLaw:
          'MGL c.40A §3 — ADUs must be allowed by right. Documentation requirements should not function as a barrier to construction.',
        localBylaw:
          'Requires submission of site plans, floor plans, and elevations before building permit issuance.',
        impact:
          'While not a formal special permit, the level of documentation could function as a barrier and introduces subjective review of exterior changes.',
        citations: [
          { label: 'MGL c.40A §3', url: SOURCES.mgl40a_s3 },
          { label: 'Barnstable ADU Update', url: SOURCES.barnstable_update },
        ],
      },
      {
        id: 'bar-03',
        provision: 'Design Compatibility Standards',
        category: 'Building & Safety',
        status: 'review',
        stateLaw:
          '760 CMR 71.05(5) — towns may impose "reasonable" design standards but may not use them to effectively prohibit construction.',
        localBylaw:
          'ADU must maintain appearance of single-family property, with "consistent design" including architectural details, roof design, building spacing, materials.',
        impact:
          'Subjective standards that could delay projects.',
        citations: [
          { label: '760 CMR 71.05(5)', url: SOURCES.cmr71 },
          { label: 'Barnstable ADU Meeting', url: SOURCES.barnstable_adu },
        ],
      },
      {
        id: 'bar-04',
        provision: 'Owner-Occupancy Requirement',
        category: 'Use & Occupancy',
        status: 'compliant',
        stateLaw:
          'MGL c.40A §3 — towns may not require owner-occupancy for ADUs as a protected use.',
        localBylaw:
          'Removed in May 2025 update — no longer requires owner-occupancy.',
        impact: 'Consistent with state law.',
        citations: [
          { label: 'MGL c.40A §3', url: SOURCES.mgl40a_s3 },
          { label: 'Barnstable ADU Update', url: SOURCES.barnstable_update },
        ],
      },
      {
        id: 'bar-05',
        provision: 'By-Right Permitting',
        category: 'Process & Administration',
        status: 'compliant',
        stateLaw:
          'MGL c.40A §3 — ADUs that meet state requirements must be allowed by right.',
        localBylaw: 'First ADU allowed by right, only building permit required.',
        impact: 'Consistent with state law.',
        citations: [
          { label: 'MGL c.40A §3', url: SOURCES.mgl40a_s3 },
        ],
      },
      {
        id: 'bar-06',
        provision: 'ADU Size Limits',
        category: 'Dimensional & Parking',
        status: 'compliant',
        stateLaw:
          '760 CMR 71.05(3) — ADUs must be allowed up to 900 sq ft or 50% of principal dwelling living area, whichever is less.',
        localBylaw:
          'Not larger than 1/2 gross floor area or 900 sqft, consistent with state law. Special permit available for larger.',
        impact: 'Consistent with state law.',
        citations: [
          { label: '760 CMR 71.05(3)', url: SOURCES.cmr71 },
        ],
      },
      {
        id: 'bar-07',
        provision: 'STR Regulation',
        category: 'Use & Occupancy',
        status: 'compliant',
        stateLaw:
          '760 CMR 71.00 is silent on short-term rental of ADUs. Towns may regulate STR separately.',
        localBylaw:
          'ADUs subject to standard rental requirements. 12-month lease minimum.',
        impact: 'Consistent with state law.',
        citations: [
          { label: 'Ch. 150 §8 (STR clause)', url: SOURCES.ch150_s78 },
        ],
      },
      {
        id: 'bar-08',
        provision: 'Number of ADUs',
        category: 'Use & Occupancy',
        status: 'compliant',
        stateLaw: 'MGL c.40A §3 — at least one ADU must be allowed per single-family lot.',
        localBylaw: 'One by right, special permit for additional.',
        impact: 'Consistent with state law.',
        citations: [
          { label: 'MGL c.40A §3', url: SOURCES.mgl40a_s3 },
        ],
      },
      {
        id: 'bar-09',
        provision: 'Parking Requirements',
        category: 'Dimensional & Parking',
        status: 'compliant',
        stateLaw:
          '760 CMR 71.05(2) — parking for an ADU shall not exceed 1 space.',
        localBylaw: 'Parking restrictions clarified per state law.',
        impact: 'Consistent with state law.',
        citations: [
          { label: '760 CMR 71.05(2)', url: SOURCES.cmr71 },
        ],
      },
      {
        id: 'bar-10',
        provision: 'Detached ADU Allowance',
        category: 'Use & Occupancy',
        status: 'compliant',
        stateLaw:
          'MGL c.40A §3 — ADUs may be within, attached to, or detached from the principal dwelling.',
        localBylaw: 'Both internal and detached ADUs permitted.',
        impact: 'Consistent with state law.',
        citations: [
          { label: 'MGL c.40A §3', url: SOURCES.mgl40a_s3 },
        ],
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// HELPERS
// ---------------------------------------------------------------------------

export function getStatusCounts(provisions: ComplianceProvision[]) {
  return {
    inconsistent: provisions.filter((p) => p.status === 'inconsistent').length,
    review: provisions.filter((p) => p.status === 'review').length,
    compliant: provisions.filter((p) => p.status === 'compliant').length,
  };
}

export function getStatewideStats(allTowns: TownComplianceProfile[]) {
  const totalInconsistent = allTowns.reduce(
    (sum, t) => sum + t.provisions.filter((p) => p.status === 'inconsistent').length,
    0,
  );
  const totalAgDisapprovals = allTowns.reduce(
    (sum, t) => sum + t.agDisapprovals,
    0,
  );
  const townsWithInconsistencies = allTowns.filter((t) =>
    t.provisions.some((p) => p.status === 'inconsistent'),
  ).length;

  return { totalInconsistent, totalAgDisapprovals, townsWithInconsistencies, townsTracked: allTowns.length };
}

export function generateBottomLine(town: TownComplianceProfile): string {
  const counts = getStatusCounts(town.provisions);
  const hasAg = town.agDisapprovals > 0;

  if (counts.inconsistent === 0 && counts.review === 0) {
    return `${town.name}'s ADU bylaw appears fully consistent with Chapter 150 and 760 CMR 71.00. No inconsistencies identified.`;
  }

  const parts: string[] = [];

  if (counts.inconsistent > 0) {
    parts.push(
      `${town.name} has ${counts.inconsistent} provision${counts.inconsistent > 1 ? 's' : ''} inconsistent with state ADU law — these are unenforceable under Chapter 150`,
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

export function getTownStatusLabel(town: TownComplianceProfile): {
  label: string;
  color: string;
  bg: string;
} {
  if (town.agDisapprovals > 0) {
    return {
      label: `${town.agDisapprovals} AG DISAPPROVAL${town.agDisapprovals > 1 ? 'S' : ''}`,
      color: 'text-red-400',
      bg: 'bg-red-400/10',
    };
  }
  const counts = getStatusCounts(town.provisions);
  if (counts.inconsistent > 0) {
    return { label: 'NOT UPDATED', color: 'text-amber-400', bg: 'bg-amber-400/10' };
  }
  return { label: 'UPDATED', color: 'text-emerald-400', bg: 'bg-emerald-400/10' };
}

export const categories: ProvisionCategory[] = [
  'Use & Occupancy',
  'Dimensional & Parking',
  'Building & Safety',
  'Process & Administration',
];
