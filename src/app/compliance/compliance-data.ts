// compliance-data.ts
// ADU Bylaw & Ordinance Consistency Data — 25 communities (21 towns + 4 cities) profiled against 760 CMR 71.00 and Chapter 150
// Per EOHLC guidance: local zoning that conflicts with the ADU statute is preempted by state law,
// but towns are not "out of compliance" — state law simply overrides inconsistent provisions.

export type ComplianceStatus = 'inconsistent' | 'review' | 'compliant';

// ── EVIDENCE BASIS — derived at runtime from existing provision data ─────
export type EvidenceBasis = 'ag_disapproved' | 'statutory_conflict' | 'ambiguous' | 'consistent';

export function getEvidenceBasis(provision: ComplianceProvision): EvidenceBasis {
  if (provision.agDecision) return 'ag_disapproved';
  if (provision.status === 'inconsistent') return 'statutory_conflict';
  if (provision.status === 'review') return 'ambiguous';
  return 'consistent';
}

export const evidenceBasisConfig: Record<
  EvidenceBasis,
  { label: string; color: string; bg: string; border: string; dot: string }
> = {
  ag_disapproved: {
    label: 'AG Disapproved',
    color: 'text-red-400',
    bg: 'bg-red-400/10',
    border: 'border-red-400/30',
    dot: 'bg-red-400',
  },
  statutory_conflict: {
    label: 'Appears Inconsistent',
    color: 'text-orange-400',
    bg: 'bg-orange-400/10',
    border: 'border-orange-400/30',
    dot: 'bg-orange-400',
  },
  ambiguous: {
    label: 'Needs Review',
    color: 'text-amber-400',
    bg: 'bg-amber-400/10',
    border: 'border-amber-400/30',
    dot: 'bg-amber-400',
  },
  consistent: {
    label: 'Consistent',
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
    border: 'border-emerald-400/30',
    dot: 'bg-emerald-400',
  },
};

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
  municipalityType?: 'town' | 'city';
  lastReviewed: string;
  bylawLastUpdated: string;
  bylawSource: string;
  agDisapprovals: number;
  permits: TownPermitData;
  bottomLine?: string;
  provisions: ComplianceProvision[];
  resistanceTag?: 'legislative-challenge';
  isExempt?: boolean;
  // ── Provenance fields ──
  agDecisionDate?: string;
  agDecisionUrl?: string;
  bylawRetrievedAt?: string;
  bylawSourceUrl?: string;
  bylawSourceTitle?: string;
  bylawVersionDate?: string;
}

export interface NarrativeCityProfile {
  slug: string;
  name: string;
  county: string;
  population: number;
  municipalityType: 'city';
  lastReviewed: string;
  permits: TownPermitData;
  tag: 'administrative-friction' | 'no-ordinance' | 'stalled';
  title: string;
  summary: string;
  body: string;
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
  /** Falmouth ADU page */
  falmouth_adu: 'https://www.falmouthma.gov/1087/Accessory-Dwelling-Units',
  /** Falmouth zoning bylaw */
  falmouth_bylaw: 'https://ecode360.com/14216444',
  /** Sudbury ADU planning page */
  sudbury_adu: 'https://sudbury.ma.us/planning/2025/01/22/accessory-dwelling-units-adus/',
  /** Sudbury AG Decision — STM May 2025, Article 28 */
  sudbury_ag: 'https://www.mass.gov/doc/sudbury-special-town-meeting-may-5-2025-article-28/download',
  /** Needham ADU page */
  needham_adu: 'https://www.needhamma.gov/5594/Accessory-Dwelling-Units',
  /** Needham ADU planning presentation 2025 */
  needham_planning: 'https://www.needhamma.gov/DocumentCenter/View/27812/ADU-Presentation-2025',
  /** Boston ADU program page */
  boston_adu: 'https://search.boston.gov/departments/housing/addition-dwelling-units/adu-program',
  /** Boston BPDA ADU zoning */
  boston_zoning: 'https://www.bostonplans.org/adu_zoning',
  /** Somerville ADU rules (YourMaADU) */
  somerville_adu: 'https://www.yourmaadu.com/local-adu-rules-ma/adu-in-somerville-ma',
  /** Somerville Ord. 2025-16 */
  somerville_ord: 'https://somervillema.legistar.com/View.ashx?GUID=684A11FC-7B75-49E2-9364-7C4D3769530F&ID=15180327&M=F',
  /** Worcester ADU planning page */
  worcester_adu: 'https://www.worcesterma.gov/planning-regulatory/planning-initiatives/accessory-dwelling-units',
  /** Worcester Landlord Summit 2025 — ADU updates */
  worcester_summit: 'https://masslandlords.net/worcester-landlord-summit-2025-gives-updates-on-adus-rental-registry/',
  /** East Bridgewater AG Decision — Case #11579, April 14, 2025 */
  ag_east_bridgewater: 'https://massago.onbaseonline.com/Massago/1700PublicAccess/MLU.htm',
  /** Weston AG Decision — Case #11649, June 9, 2025 */
  ag_weston: 'https://massago.onbaseonline.com/Massago/1700PublicAccess/MLU.htm',
  /** Upton AG Decision — Case #11658, June 9, 2025 */
  ag_upton: 'https://massago.onbaseonline.com/Massago/1700PublicAccess/MLU.htm',
  /** Wilbraham AG Decision — Case #11778, December 19, 2025 */
  ag_wilbraham: 'https://massago.onbaseonline.com/Massago/1700PublicAccess/MLU.htm',
  /** Quincy ADU Guidelines (Feb 28, 2025) */
  quincy_adu: 'https://www.quincyma.gov/government/planning___community_development/accessory_dwelling_units.php',
  /** Salem ADU Ordinance */
  salem_adu: 'https://www.salem.com/planning-and-community-development/pages/accessory-dwelling-units',
  /** Revere ADU Ordinance — Title 17, Chapter 17.25 */
  revere_adu: 'https://www.revere.org/departments/planning-development/accessory-dwelling-units',
  /** Revere Home Rule Petition — March 2025 */
  revere_home_rule: 'https://www.revere.org/departments/city-council',
  /** Revere Journal — Home Rule Petition coverage, March 2025 */
  revere_journal: 'https://reverejournal.com/2025/03/18/councillors-look-for-relief-from-mandated-state-adu-ordinance/',
  /** CommonWealth Beacon — Fall River ADU opposition, February 2025 */
  fall_river_beacon: 'https://commonwealthbeacon.org/government/behind-the-scenes-of-the-fight-over-accessory-dwelling-units/',
  /** Fall River Reporter — ZBA "no ADU" conditions, August 2025 */
  fall_river_reporter: 'https://fallriverreporter.com/fall-river-zoning-board-of-appeals-grants-zoning-variances-and-special-permits-for-several-projects-that-would-generate-new-housing-units/',
  /** Lowell Sun — Council defeats ADU ordinance 7-4, October 2023 */
  lowell_sun: 'https://www.lowellsun.com/2023/10/18/rip-adus-for-now/',
  /** City of Medford — Council withdraws ADU proposal, December 2025 */
  medford_zoning: 'https://www.medfordma.org/departments/planning-development-sustainability/zoning',
  /** This Week in Worcester — Council votes 9-2 on owner-occupancy, December 2023 */
  worcester_twiw: 'https://thisweekinworcester.com/accessory-dwelling-units-council-121223/',
  /** Green Needham — 12 ADUs in 3+ years, April 2023 */
  needham_green: 'https://www.greenneedham.org/blog/2023/04/a-needed-amendment-to-the-accessory-dwelling-unit-bylaw/',
  /** My Southborough — AG partial disapproval of ADU bylaw, February 2026 */
  southborough_ag: 'https://www.mysouthborough.com/2026/02/17/ags-office-partially-approves-towns-adu-bylaw/',
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
    population: 61217,
    lastReviewed: '2026-02-15',
    bylawLastUpdated: 'October 2024',
    bylawSource: 'Plymouth Zoning Bylaw §205-51',
    agDisapprovals: 0,
    permits: { submitted: 42, approved: 34, denied: 8, pending: 0, approvalRate: 81 },
    bylawRetrievedAt: '2026-02-19',
    bylawSourceTitle: 'Zoning Bylaw',
    bottomLine: 'Plymouth has 3 inconsistent provisions on the books that haven’t been reviewed by the AG. Owner-occupancy and lot frontage requirements mirror provisions struck down in other towns. These are preempted by state law but may still be applied locally.',
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
          'This provision appears inconsistent with G.L. c. 40A §3 and is preempted by state law. Homeowners may build ADUs regardless of occupancy status.',
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
          'The bedroom-based ratio is preempted by state law — parking is capped at 1 space regardless of bedroom count.',
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
          'This district restriction is preempted by state law. Homeowners in any zoning district with a single-family dwelling may build an ADU under G.L. c. 40A §3.',
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
    population: 14255,
    lastReviewed: '2026-02-15',
    bylawLastUpdated: 'Pre-2025 (not updated for Chapter 150)',
    bylawSource: 'Nantucket Zoning Bylaw §139-16A',
    agDisapprovals: 0,
    permits: { submitted: 27, approved: 27, denied: 0, pending: 0, approvalRate: 100 },
    bylawRetrievedAt: '2026-02-19',
    bylawSourceTitle: 'Zoning Bylaw',
    bottomLine: 'Nantucket’s HDC review adds a layer of design scrutiny that doesn’t exist on the mainland. The 4 inconsistent provisions are preempted by state law, but the island’s unique regulatory culture means pushback is common. Budget extra time for approvals.',
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
          'This provision appears inconsistent with G.L. c. 40A §3 and is preempted by state law. Absentee owners may build ADUs regardless of this local requirement.',
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
          'The internal-only restriction is preempted by state law. Homeowners may build detached or attached ADUs under G.L. c. 40A §3.',
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
          'The 800 sq ft cap is preempted by state law — 760 CMR 71.05(3) guarantees up to 900 sq ft.',
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
          'This restriction appears inconsistent with state law. Any lot with a single-family dwelling qualifies under G.L. c. 40A §3, regardless of other designations.',
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
    population: 11087,
    lastReviewed: '2025-05-27',
    bylawLastUpdated: 'May 2025 (AG partial disapproval)',
    bylawSource: 'Leicester Zoning Bylaw — Town Meeting Article 9',
    agDisapprovals: 3,
    permits: { submitted: 2, approved: 2, denied: 0, pending: 0, approvalRate: 100 },
    agDecisionDate: '2025-05-27',
    agDecisionUrl: SOURCES.ag_leicester,
    bylawRetrievedAt: '2026-02-19',
    bylawSourceTitle: 'Zoning Bylaw',
    bottomLine: 'Leicester was one of the first AG decisions and set the precedents other towns ignored. The bedroom cap, single-family restriction, and dimensional provisions were all struck down. The remaining bylaw is workable but the town’s enforcement posture may still reflect the old rules.',
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
          'The AG disapproved this bedroom limit as inconsistent with state law.',
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
          'The AG disapproved this district restriction as inconsistent with state law.',
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
          'The AG disapproved this blanket dimensional requirement as exceeding state limits.',
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
    population: 63191,
    lastReviewed: '2025-06-01',
    bylawLastUpdated: 'June 2025 (AG partial disapproval)',
    bylawSource: 'Brookline Zoning Bylaw — Town Meeting Article',
    agDisapprovals: 2,
    permits: { submitted: 5, approved: 2, denied: 3, pending: 0, approvalRate: 40 },
    agDecisionDate: '2025-06-01',
    agDecisionUrl: SOURCES.ag_brookline,
    bylawRetrievedAt: '2026-02-19',
    bylawSourceTitle: 'Zoning Bylaw',
    bottomLine: 'Brookline’s bylaw is relatively clean with only one inconsistent provision (owner-occupancy for detached ADUs). The town is generally ADU-friendly with an 81% approval rate. Builders can operate with reasonable confidence here.',
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
          'The AG disapproved this FAR cap as inconsistent with state law where it reduces ADU size below 900 sq ft.',
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
          'The AG disapproved this provision as inconsistent with state law. Pre-existing nonconformities cannot bar ADU construction under G.L. c. 40A §3.',
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
    population: 24370,
    lastReviewed: '2025-06-04',
    bylawLastUpdated: 'June 2025 (AG partial disapproval)',
    bylawSource: 'Canton Zoning Bylaw — Town Meeting Article',
    agDisapprovals: 1,
    permits: { submitted: 2, approved: 1, denied: 1, pending: 0, approvalRate: 50 },
    agDecisionDate: '2025-06-04',
    agDecisionUrl: SOURCES.ag_canton,
    bylawRetrievedAt: '2026-02-19',
    bylawSourceTitle: 'Zoning Bylaw',
    bottomLine: 'Canton lost its minimum lot size requirement to the AG in June 2025. The remaining bylaw is mostly consistent but the special permit requirement is a significant barrier — it adds months and creates discretionary denial risk.',
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
          'The AG disapproved this lot size requirement as inconsistent with state law.',
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
    population: 10639,
    lastReviewed: '2025-06-01',
    bylawLastUpdated: '2025 (AG partial disapproval)',
    bylawSource: 'Hanson Zoning Bylaw — Town Meeting Article',
    agDisapprovals: 1,
    permits: { submitted: 3, approved: 2, denied: 1, pending: 0, approvalRate: 67 },
    agDecisionDate: '2025-06-01',
    agDecisionUrl: SOURCES.ag_hanson,
    bylawRetrievedAt: '2026-02-19',
    bylawSourceTitle: 'Zoning Bylaw',
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
          'The AG disapproved this discretionary review process as inconsistent with state law for Protected Use ADUs.',
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
    population: 101079,
    lastReviewed: '2026-02-15',
    bylawLastUpdated: 'September 2024',
    bylawSource: 'New Bedford Zoning Ordinance Ch. 9, §§2340 & 1200',
    agDisapprovals: 0,
    permits: { submitted: 6, approved: 2, denied: 4, pending: 0, approvalRate: 33 },
    bylawRetrievedAt: '2026-02-19',
    bylawSourceTitle: 'Zoning Ordinance',
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
    population: 88923,
    lastReviewed: '2026-02-15',
    bylawLastUpdated: 'April 2025',
    bylawSource: 'Newton Zoning Ordinance §30-22 (April 2025 amendments)',
    agDisapprovals: 0,
    permits: { submitted: 40, approved: 18, denied: 0, pending: 22, approvalRate: 45 },
    bylawRetrievedAt: '2026-02-19',
    bylawSourceUrl: SOURCES.newton_adu,
    bylawSourceTitle: 'Zoning Ordinance',
    bottomLine: 'Newton’s two-tier system creates confusion but most ADUs can proceed by right. The site plan review path adds cost and time for larger units but isn’t technically a barrier. Builders should confirm which tier applies before quoting projects.',
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
    population: 36569,
    lastReviewed: '2026-02-15',
    bylawLastUpdated: 'April 2025 (AG review pending)',
    bylawSource: 'Andover Zoning Bylaw Article VIII, Art. 22 (April 2025 Town Meeting)',
    agDisapprovals: 0,
    permits: { submitted: 10, approved: 9, denied: 0, pending: 1, approvalRate: 90 },
    bylawRetrievedAt: '2026-02-19',
    bylawSourceUrl: SOURCES.andover_adu,
    bylawSourceTitle: 'Zoning Bylaw',
    bottomLine: 'Andover’s ZBA site plan review is the main friction point — it’s not a special permit, but it adds time, cost, and unpredictability. ADUs are allowed by right, but expect the review process to take longer than towns without ZBA involvement.',
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
    population: 28630,
    lastReviewed: '2026-02-15',
    bylawLastUpdated: 'Pre-2025 (Town Meeting referred back to Planning Board)',
    bylawSource: 'Milton Zoning Bylaw §275-10.13',
    agDisapprovals: 0,
    permits: { submitted: 25, approved: 24, denied: 0, pending: 1, approvalRate: 96 },
    bylawRetrievedAt: '2026-02-19',
    bylawSourceUrl: SOURCES.milton_adu,
    bylawSourceTitle: 'Zoning Bylaw',
    bottomLine: 'Milton’s bylaw predates the state ADU law and has not been reconciled with G.L. c. 40A §3. Three provisions — owner-occupancy, family/caregiver restrictions, and the special permit requirement — are preempted by state law. Homeowners should cite G.L. c. 40A §3 if the town tries to enforce them.',
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
    population: 16090,
    lastReviewed: '2026-02-15',
    bylawLastUpdated: 'June 2025 (STM amendments pending AG approval)',
    bylawSource: 'Duxbury Zoning Bylaw',
    agDisapprovals: 0,
    permits: { submitted: 3, approved: 2, denied: 0, pending: 1, approvalRate: 67 },
    bylawRetrievedAt: '2026-02-19',
    bylawSourceTitle: 'Zoning Bylaw',
    bottomLine: "Duxbury's bylaw is technically consistent but designed to feel like a special permit process. The planning board review, design standards, and documentation requirements create soft barriers. Experienced builders will navigate it fine; first-time ADU owners may find it intimidating.",
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
          'Planning Board intends to use site plan review process for ADUs. A board member stated it could be used "almost like a special permit" (Duxbury Clipper, October 2024).',
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
    population: 48916,
    lastReviewed: '2026-02-15',
    bylawLastUpdated: 'May 2025',
    bylawSource: 'Barnstable Zoning Ordinance §240-47.2 (May 2025 amendments)',
    agDisapprovals: 0,
    permits: { submitted: 31, approved: 6, denied: 0, pending: 25, approvalRate: 19 },
    bylawRetrievedAt: '2026-02-19',
    bylawSourceUrl: SOURCES.barnstable_adu,
    bylawSourceTitle: 'Zoning Ordinance',
    bottomLine: 'Barnstable has the lowest approval rate in the tracker at 19%. The entrance visibility requirement and site plan review process appear to be limiting approvals. Builders should factor in a longer timeline and potential pushback from planning staff.',
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

  // ── FALMOUTH ────────────────────────────────────────────────────────────
  {
    slug: 'falmouth',
    name: 'Falmouth',
    county: 'Barnstable',
    population: 32517,
    lastReviewed: '2026-02-15',
    bylawLastUpdated: 'Pre-Chapter 150',
    bylawSource: 'Falmouth Zoning Bylaw Chapter 240, ADU provisions (amendments under Planning Board review)',
    agDisapprovals: 0,
    permits: { submitted: 12, approved: 12, denied: 0, pending: 0, approvalRate: 100 },
    bylawRetrievedAt: '2026-02-19',
    bylawSourceUrl: SOURCES.falmouth_adu,
    bylawSourceTitle: 'Zoning Bylaw',
    bottomLine: 'Falmouth requires site plan review for ALL ADU types — internal, attached, and detached. The $200 fee and abutter notification create a quasi-hearing process. The design compatibility requirement is subjective and could be used to slow approvals.',
    provisions: [
      {
        id: 'fal-01',
        provision: 'Site Plan Review for ALL ADUs',
        category: 'Process & Administration',
        status: 'review',
        stateLaw:
          '760 CMR 71.04(1) — Protected-use ADUs shall be subject only to reasonable regulations concerning dimensional and design standards. Site plan review is permissible but must not function as a de facto special permit.',
        localBylaw:
          'Site plan review required for internal, attached, AND detached ADUs. $200 fee plus abutter notification.',
        impact:
          'While not technically a special permit, the universal application to all ADU types and public notification process could function as a de facto barrier. Most towns only require site plan review for detached ADUs.',
        citations: [
          { label: 'Falmouth ADU Info', url: SOURCES.falmouth_adu },
          { label: 'Falmouth Zoning Bylaw', url: SOURCES.falmouth_bylaw },
          { label: '760 CMR 71.00', url: SOURCES.cmr71 },
        ],
      },
      {
        id: 'fal-02',
        provision: 'Design Compatibility / Single-Family Appearance',
        category: 'Building & Safety',
        status: 'review',
        stateLaw:
          '760 CMR 71.04(1) — Dimensional and design standards are permitted but must be reasonable and not function as barriers to ADU construction.',
        localBylaw:
          'ADU must maintain single-family appearance of property.',
        impact:
          'Subjective standard that could be used to deny or delay otherwise compliant projects.',
        citations: [
          { label: 'Falmouth Zoning Bylaw', url: SOURCES.falmouth_bylaw },
          { label: '760 CMR 71.00', url: SOURCES.cmr71 },
        ],
      },
      {
        id: 'fal-03',
        provision: 'Abutter Notification Requirement',
        category: 'Process & Administration',
        status: 'review',
        stateLaw:
          '760 CMR 71.04(1) — Protected-use ADUs are by-right and shall not require discretionary review. Notification requirements that create opportunities for opposition may undermine by-right status.',
        localBylaw:
          'Abutters must be notified of ADU site plan review applications.',
        impact:
          'Creates opportunity for neighbor opposition and potential delays even though ADUs are by-right under state law.',
        citations: [
          { label: 'Falmouth ADU Info', url: SOURCES.falmouth_adu },
          { label: '760 CMR 71.00', url: SOURCES.cmr71 },
        ],
      },
      {
        id: 'fal-04',
        provision: '6-Month Minimum Lease',
        category: 'Use & Occupancy',
        status: 'compliant',
        stateLaw:
          'MGL c.40A §3 — Towns may regulate short-term rentals of ADUs.',
        localBylaw:
          'Minimum lease of 6 months, no short-term rentals under 6 months.',
        impact:
          'Consistent with state law. Towns may regulate STRs.',
        citations: [
          { label: 'MGL c.40A §3', url: SOURCES.mgl40a_s3 },
        ],
      },
      {
        id: 'fal-05',
        provision: 'By-Right Permitting',
        category: 'Process & Administration',
        status: 'compliant',
        stateLaw:
          'MGL c.40A §3 — First ADU on a lot is permitted by right.',
        localBylaw:
          'First ADU allowed by right per state law.',
        impact:
          'Consistent with state law.',
        citations: [
          { label: 'MGL c.40A §3', url: SOURCES.mgl40a_s3 },
        ],
      },
      {
        id: 'fal-06',
        provision: 'ADU Size Limits',
        category: 'Dimensional & Parking',
        status: 'compliant',
        stateLaw:
          '760 CMR 71.05(1) — ADU shall not exceed 900 sqft or 50% of the principal dwelling gross floor area.',
        localBylaw:
          'Consistent with state limits (900 sqft or 50% of principal).',
        impact:
          'Consistent with state law.',
        citations: [
          { label: '760 CMR 71.00', url: SOURCES.cmr71 },
        ],
      },
      {
        id: 'fal-07',
        provision: 'Number of ADUs',
        category: 'Use & Occupancy',
        status: 'compliant',
        stateLaw:
          'MGL c.40A §3 — At least one ADU shall be permitted by right on each lot.',
        localBylaw:
          'One per lot.',
        impact:
          'Consistent with state law.',
        citations: [
          { label: 'MGL c.40A §3', url: SOURCES.mgl40a_s3 },
        ],
      },
      {
        id: 'fal-08',
        provision: 'Detached ADU Allowance',
        category: 'Use & Occupancy',
        status: 'compliant',
        stateLaw:
          'MGL c.40A §3 — ADUs may be within, attached to, or detached from the principal dwelling.',
        localBylaw:
          'Both internal and detached permitted.',
        impact:
          'Consistent with state law.',
        citations: [
          { label: 'MGL c.40A §3', url: SOURCES.mgl40a_s3 },
        ],
      },
    ],
  },

  // ── SUDBURY ─────────────────────────────────────────────────────────────
  {
    slug: 'sudbury',
    name: 'Sudbury',
    county: 'Middlesex',
    population: 18934,
    lastReviewed: '2025-10-01',
    bylawLastUpdated: 'May 2025 (AG partially disapproved Oct 2025)',
    bylawSource: 'Sudbury Zoning Bylaw, Art. 28 (May 2025 STM — AG partially disapproved October 2025)',
    agDisapprovals: 3,
    permits: { submitted: 3, approved: 3, denied: 0, pending: 0, approvalRate: 100 },
    agDecisionDate: '2025-10-01',
    agDecisionUrl: SOURCES.sudbury_ag,
    bylawRetrievedAt: '2026-02-19',
    bylawSourceUrl: SOURCES.sudbury_adu,
    bylawSourceTitle: 'Zoning Bylaw',
    bottomLine: 'Sudbury’s bylaw was partially gutted by the AG in October 2025 — 3 provisions deleted, 1 partially struck. The surviving ‘architecturally harmonious’ requirement is a gray area. Confirm with the building department which version of the bylaw they’re enforcing.',
    provisions: [
      {
        id: 'sud-01',
        provision: 'Single-Family Dwelling Restriction',
        category: 'Use & Occupancy',
        status: 'inconsistent',
        stateLaw:
          'MGL c.40A §3 — ADUs must be allowed on any lot in a single-family residential zoning district, not just lots with single-family homes.',
        localBylaw:
          'Bylaw limited ADUs to single-family dwellings only.',
        impact:
          'AG DISAPPROVED — deleted "single-family" language. Restricting ADUs to lots with single-family homes excludes legally compliant lots.',
        agDecision:
          'AG Decision October 2025: Disapproved. Restriction of ADUs to single-family dwellings conflicts with G.L. c. 40A §3 and 760 CMR 71.00.',
        citations: [
          { label: 'Sudbury ADU Planning', url: SOURCES.sudbury_adu },
          { label: 'AG Decision — Art. 28', url: SOURCES.sudbury_ag },
          { label: 'MGL c.40A §3', url: SOURCES.mgl40a_s3 },
        ],
      },
      {
        id: 'sud-02',
        provision: 'Minimum Lot Size Requirements',
        category: 'Dimensional & Parking',
        status: 'inconsistent',
        stateLaw:
          '760 CMR 71.03(4)(a) — No minimum lot size requirements may be imposed for protected-use ADUs.',
        localBylaw:
          'Bylaw imposed minimum lot size requirements for ADU construction.',
        impact:
          'AG DISAPPROVED — deleted lot size provisions. State law does not allow minimum lot size requirements for protected use ADUs.',
        agDecision:
          'AG Decision October 2025: Disapproved. Minimum lot size requirement conflicts with 760 CMR 71.03(4)(a).',
        citations: [
          { label: 'AG Decision — Art. 28', url: SOURCES.sudbury_ag },
          { label: '760 CMR 71.00', url: SOURCES.cmr71 },
        ],
      },
      {
        id: 'sud-03',
        provision: 'Principal Dwelling Setback on ADUs',
        category: 'Dimensional & Parking',
        status: 'inconsistent',
        stateLaw:
          '760 CMR 71.05 — ADUs cannot be subject to stricter dimensional requirements than the principal dwelling.',
        localBylaw:
          'Bylaw applied principal dwelling setback requirements to ADUs.',
        impact:
          'AG DISAPPROVED — deleted setback provisions that exceeded single-family standards. ADUs cannot be subject to stricter dimensional requirements than the principal dwelling.',
        agDecision:
          'AG Decision October 2025: Disapproved. ADU setbacks cannot exceed those applicable to principal dwelling per 760 CMR 71.05.',
        citations: [
          { label: 'AG Decision — Art. 28', url: SOURCES.sudbury_ag },
          { label: '760 CMR 71.00', url: SOURCES.cmr71 },
        ],
      },
      {
        id: 'sud-04',
        provision: 'Parking Provisions (Partial)',
        category: 'Dimensional & Parking',
        status: 'inconsistent',
        stateLaw:
          '760 CMR 71.05(2) — No more than 1 parking space may be required per ADU.',
        localBylaw:
          'Portions of parking requirements exceeded state limits.',
        impact:
          'AG DISAPPROVED portions — deleted provisions requiring more than 1 parking space.',
        agDecision:
          'AG Decision October 2025: Partially disapproved. Parking cannot exceed 1 space per 760 CMR 71.05(2).',
        citations: [
          { label: 'AG Decision — Art. 28', url: SOURCES.sudbury_ag },
          { label: '760 CMR 71.00', url: SOURCES.cmr71 },
        ],
      },
      {
        id: 'sud-05',
        provision: 'Architecturally Harmonious Requirement',
        category: 'Building & Safety',
        status: 'review',
        stateLaw:
          '760 CMR 71.04(1) — Design standards must be reasonable and not function as barriers to ADU construction.',
        localBylaw:
          'ADU must be "architecturally harmonious" with the principal dwelling.',
        impact:
          'AG did not challenge this provision, but subjective standard could function as gatekeeping depending on who interprets "harmonious."',
        citations: [
          { label: 'Sudbury ADU Planning', url: SOURCES.sudbury_adu },
          { label: '760 CMR 71.00', url: SOURCES.cmr71 },
        ],
      },
      {
        id: 'sud-06',
        provision: 'No New Driveway Connections',
        category: 'Dimensional & Parking',
        status: 'review',
        stateLaw:
          '760 CMR 71.05 — Dimensional standards must not be more restrictive than those for the principal dwelling.',
        localBylaw:
          'ADUs may not create new driveway connections to the street.',
        impact:
          'Could limit placement options on some lots and adds cost if existing driveway must be reconfigured.',
        citations: [
          { label: 'Sudbury ADU Planning', url: SOURCES.sudbury_adu },
          { label: '760 CMR 71.00', url: SOURCES.cmr71 },
        ],
      },
      {
        id: 'sud-07',
        provision: 'By-Right Permitting',
        category: 'Process & Administration',
        status: 'compliant',
        stateLaw:
          'MGL c.40A §3 — First ADU on a lot is permitted by right.',
        localBylaw:
          'First ADU allowed by right (as approved by AG).',
        impact:
          'Consistent with state law.',
        citations: [
          { label: 'MGL c.40A §3', url: SOURCES.mgl40a_s3 },
        ],
      },
      {
        id: 'sud-08',
        provision: 'ADU Size Limits',
        category: 'Dimensional & Parking',
        status: 'compliant',
        stateLaw:
          '760 CMR 71.05(1) — ADU shall not exceed 900 sqft or 50% of the principal dwelling gross floor area.',
        localBylaw:
          '900 sqft or 50% of principal dwelling (as approved by AG).',
        impact:
          'Consistent with state law.',
        citations: [
          { label: '760 CMR 71.00', url: SOURCES.cmr71 },
        ],
      },
      {
        id: 'sud-09',
        provision: 'STR Prohibition',
        category: 'Use & Occupancy',
        status: 'compliant',
        stateLaw:
          'MGL c.40A §3 — Towns may regulate short-term rentals of ADUs.',
        localBylaw:
          'Short-term rentals prohibited.',
        impact:
          'Consistent with state law. Permitted under state law.',
        citations: [
          { label: 'MGL c.40A §3', url: SOURCES.mgl40a_s3 },
        ],
      },
      {
        id: 'sud-10',
        provision: 'Number of ADUs',
        category: 'Use & Occupancy',
        status: 'compliant',
        stateLaw:
          'MGL c.40A §3 — At least one ADU shall be permitted by right on each lot.',
        localBylaw:
          'One per lot.',
        impact:
          'Consistent with state law.',
        citations: [
          { label: 'MGL c.40A §3', url: SOURCES.mgl40a_s3 },
        ],
      },
    ],
  },

  // ── NEEDHAM ─────────────────────────────────────────────────────────────
  {
    slug: 'needham',
    name: 'Needham',
    county: 'Norfolk',
    population: 32091,
    lastReviewed: '2026-02-15',
    bylawLastUpdated: '2023 (Planning Board planning fall 2025 update)',
    bylawSource: 'Needham Zoning Bylaw (2023, Planning Board planning fall 2025 update)',
    agDisapprovals: 0,
    permits: { submitted: 4, approved: 4, denied: 0, pending: 0, approvalRate: 100 },
    bylawRetrievedAt: '2026-02-19',
    bylawSourceUrl: SOURCES.needham_adu,
    bylawSourceTitle: 'Zoning Bylaw',
    bottomLine: 'Needham is a textbook restrictive town — special permit required, no detached ADUs, owner-occupancy enforced. The result: 12 ADUs in 3+ years (Green Needham, April 2023). All 4 inconsistent provisions are preempted by state law. Planning Board is working on updates but hasn’t adopted them yet.',
    provisions: [
      {
        id: 'nee-01',
        provision: 'Owner-Occupancy Requirement',
        category: 'Use & Occupancy',
        status: 'inconsistent',
        stateLaw:
          'MGL c.40A §3 — No owner-occupancy requirement may be imposed for protected-use ADUs.',
        localBylaw:
          'Requires owner to occupy either the principal dwelling or ADU.',
        impact:
          'State law prohibits owner-occupancy requirements. Unenforceable.',
        citations: [
          { label: 'Needham ADU Info', url: SOURCES.needham_adu },
          { label: 'MGL c.40A §3', url: SOURCES.mgl40a_s3 },
          { label: '760 CMR 71.00', url: SOURCES.cmr71 },
        ],
      },
      {
        id: 'nee-02',
        provision: 'Attached-Only Restriction',
        category: 'Use & Occupancy',
        status: 'inconsistent',
        stateLaw:
          'MGL c.40A §3 — ADUs may be within, attached to, or detached from the principal dwelling. Towns must allow all types.',
        localBylaw:
          'Only attached/internal ADUs permitted — detached ADUs are prohibited.',
        impact:
          'State law requires towns to allow all types of ADUs (internal, attached, and detached). Unenforceable.',
        citations: [
          { label: 'Needham ADU Info', url: SOURCES.needham_adu },
          { label: 'MGL c.40A §3', url: SOURCES.mgl40a_s3 },
        ],
      },
      {
        id: 'nee-03',
        provision: 'Special Permit Requirement',
        category: 'Process & Administration',
        status: 'inconsistent',
        stateLaw:
          'MGL c.40A §3 — First ADU on a lot is permitted by right. No special permit or discretionary review allowed.',
        localBylaw:
          'ADUs require special permit from Board of Appeals.',
        impact:
          'State law requires by-right permitting for first ADU. Unenforceable. Result: only 12 ADUs permitted in 3+ years (Green Needham, April 2023).',
        citations: [
          { label: 'Needham ADU Presentation', url: SOURCES.needham_planning },
          { label: 'MGL c.40A §3', url: SOURCES.mgl40a_s3 },
        ],
      },
      {
        id: 'nee-04',
        provision: 'Occupancy Restrictions (Legacy)',
        category: 'Use & Occupancy',
        status: 'inconsistent',
        stateLaw:
          'MGL c.40A §3 — No restrictions on the use and occupancy of ADU tenants are permitted.',
        localBylaw:
          'Legacy bylaw included family member/caregiver occupancy restrictions.',
        impact:
          'State law prohibits use and occupancy restrictions on ADU tenants. Unenforceable.',
        citations: [
          { label: 'Needham ADU Info', url: SOURCES.needham_adu },
          { label: 'MGL c.40A §3', url: SOURCES.mgl40a_s3 },
          { label: '760 CMR 71.00', url: SOURCES.cmr71 },
        ],
      },
      {
        id: 'nee-05',
        provision: 'By-Right Permitting',
        category: 'Process & Administration',
        status: 'compliant',
        stateLaw:
          'MGL c.40A §3 — First ADU on a lot is permitted by right.',
        localBylaw:
          'State law overrides special permit requirement — ADUs should be processed by-right regardless of local bylaw.',
        impact:
          'Consistent with state law (state law overrides).',
        citations: [
          { label: 'MGL c.40A §3', url: SOURCES.mgl40a_s3 },
        ],
      },
      {
        id: 'nee-06',
        provision: 'ADU Size Limits',
        category: 'Dimensional & Parking',
        status: 'compliant',
        stateLaw:
          '760 CMR 71.05(1) — ADU shall not exceed 900 sqft or 50% of the principal dwelling gross floor area.',
        localBylaw:
          'Consistent with state limits.',
        impact:
          'Consistent with state law.',
        citations: [
          { label: '760 CMR 71.00', url: SOURCES.cmr71 },
        ],
      },
      {
        id: 'nee-07',
        provision: 'STR Restrictions',
        category: 'Use & Occupancy',
        status: 'compliant',
        stateLaw:
          'MGL c.40A §3 — Towns may regulate short-term rentals of ADUs.',
        localBylaw:
          'Short-term rental restrictions apply.',
        impact:
          'Consistent with state law.',
        citations: [
          { label: 'MGL c.40A §3', url: SOURCES.mgl40a_s3 },
        ],
      },
      {
        id: 'nee-08',
        provision: 'Number of ADUs',
        category: 'Use & Occupancy',
        status: 'compliant',
        stateLaw:
          'MGL c.40A §3 — At least one ADU shall be permitted by right on each lot.',
        localBylaw:
          'One per lot.',
        impact:
          'Consistent with state law.',
        citations: [
          { label: 'MGL c.40A §3', url: SOURCES.mgl40a_s3 },
        ],
      },
    ],
  },

  // ── BOSTON ───────────────────────────────────────────────────────────────
  {
    slug: 'boston',
    name: 'Boston',
    county: 'Suffolk',
    population: 675647,
    lastReviewed: '2026-02-15',
    isExempt: true,
    bylawLastUpdated: 'Ongoing (BPDA zoning updates)',
    bylawSource: 'Boston Zoning Code (BPDA Citywide ADU Program, ongoing zoning updates)',
    agDisapprovals: 0,
    permits: { submitted: 69, approved: 44, denied: 0, pending: 0, approvalRate: 64 },
    bylawRetrievedAt: '2026-02-19',
    bylawSourceUrl: SOURCES.boston_adu,
    bylawSourceTitle: 'Zoning Code',
    bottomLine: 'Boston is exempt from the state ADU law entirely — it’s the only municipality in Massachusetts that doesn’t operate under G.L. c. 40A. Owner-occupancy is required, only internal conversions are allowed, and workshop attendance is mandatory. The BPDA is working on zoning updates but hasn’t changed the rules yet. The zero-interest loan program (up to $30K) is a genuine advantage.',
    provisions: [
      {
        id: 'bos-01',
        provision: 'State Law Exemption',
        category: 'Process & Administration',
        status: 'inconsistent',
        stateLaw:
          'MGL c.40A §3 — Statewide ADU by-right law applies to all municipalities subject to G.L. c. 40A.',
        localBylaw:
          'Boston is the only municipality in Massachusetts exempt from G.L. c. 40A.',
        impact:
          'The statewide ADU by-right law does not apply. Homeowners must navigate Boston\'s own zoning code and ADU program instead.',
        citations: [
          { label: 'Boston ADU Program', url: SOURCES.boston_adu },
          { label: 'BPDA ADU Zoning', url: SOURCES.boston_zoning },
          { label: 'MGL c.40A §3', url: SOURCES.mgl40a_s3 },
        ],
      },
      {
        id: 'bos-02',
        provision: 'Owner-Occupancy Requirement',
        category: 'Use & Occupancy',
        status: 'inconsistent',
        stateLaw:
          'MGL c.40A §3 — No owner-occupancy requirement may be imposed for protected-use ADUs (does not apply to Boston).',
        localBylaw:
          'Boston\'s ADU program requires owner-occupancy of the property.',
        impact:
          'State law (which doesn\'t apply to Boston) prohibits this requirement. Boston can legally maintain it, but it limits ADU creation compared to the rest of the state.',
        citations: [
          { label: 'Boston ADU Program', url: SOURCES.boston_adu },
        ],
      },
      {
        id: 'bos-03',
        provision: 'Internal-Only Restriction (Current Program)',
        category: 'Use & Occupancy',
        status: 'inconsistent',
        stateLaw:
          'MGL c.40A §3 — ADUs may be within, attached to, or detached from the principal dwelling (does not apply to Boston).',
        localBylaw:
          'Current ADU program only allows units within the existing footprint of the home (basement, attic conversions).',
        impact:
          'Detached and external ADUs are not yet allowed by-right, though the BPDA is actively working on zoning updates to change this.',
        citations: [
          { label: 'Boston ADU Program', url: SOURCES.boston_adu },
          { label: 'BPDA ADU Zoning', url: SOURCES.boston_zoning },
        ],
      },
      {
        id: 'bos-04',
        provision: 'Workshop Attendance Requirement',
        category: 'Process & Administration',
        status: 'review',
        stateLaw:
          '760 CMR 71.04(1) — Protected-use ADUs shall not require discretionary review or additional procedural barriers beyond a building permit.',
        localBylaw:
          'Homeowners must attend an ADU workshop before their plans are reviewed.',
        impact:
          'While educational, this adds a step not required anywhere else in the state and could delay projects.',
        citations: [
          { label: 'Boston ADU Program', url: SOURCES.boston_adu },
        ],
      },
      {
        id: 'bos-05',
        provision: '1-3 Family Property Limitation',
        category: 'Use & Occupancy',
        status: 'review',
        stateLaw:
          'MGL c.40A §3 — ADUs are permitted on any lot with a residential dwelling in a single-family zoning district.',
        localBylaw:
          'ADUs can only be added to properties with 1-3 existing dwelling units.',
        impact:
          'Properties with 4+ units are excluded, unlike the state law which applies broadly.',
        citations: [
          { label: 'Boston ADU Program', url: SOURCES.boston_adu },
        ],
      },
      {
        id: 'bos-06',
        provision: 'Zoning Board of Appeal Relief',
        category: 'Process & Administration',
        status: 'review',
        stateLaw:
          'MGL c.40A §3 — First ADU on a lot is permitted by right. No discretionary review allowed.',
        localBylaw:
          'Many ADU projects in Boston still require relief from the Zoning Board of Appeal, even with the ADU program.',
        impact:
          'The ADU Guidebook designs are described as requiring permits and potentially still needing ZBA relief.',
        citations: [
          { label: 'Boston ADU Program', url: SOURCES.boston_adu },
          { label: 'BPDA ADU Zoning', url: SOURCES.boston_zoning },
        ],
      },
      {
        id: 'bos-07',
        provision: 'ADU Size Limits',
        category: 'Dimensional & Parking',
        status: 'compliant',
        stateLaw:
          '760 CMR 71.05(1) — ADU shall not exceed 900 sqft or 50% of the principal dwelling gross floor area.',
        localBylaw:
          'Units must be self-contained with sleeping, cooking, and sanitary facilities. Size governed by existing structure constraints.',
        impact:
          'Consistent with state law.',
        citations: [
          { label: 'Boston ADU Program', url: SOURCES.boston_adu },
        ],
      },
      {
        id: 'bos-08',
        provision: 'Rental Registry',
        category: 'Process & Administration',
        status: 'compliant',
        stateLaw:
          'MGL c.40A §3 — Towns may impose reasonable administrative requirements.',
        localBylaw:
          'ADUs used as rentals must be registered per Ch. 9-1.3 of the City of Boston Rental Registry Ordinance.',
        impact:
          'Consistent with state law.',
        citations: [
          { label: 'Boston ADU Program', url: SOURCES.boston_adu },
        ],
      },
      {
        id: 'bos-09',
        provision: 'ADU Loan Program',
        category: 'Process & Administration',
        status: 'compliant',
        stateLaw:
          'No state requirement — this is an additional city benefit.',
        localBylaw:
          'City offers zero-interest deferred equity loans up to $30,000 for eligible homeowners.',
        impact:
          'A positive incentive not offered elsewhere.',
        citations: [
          { label: 'Boston ADU Program', url: SOURCES.boston_adu },
        ],
      },
      {
        id: 'bos-10',
        provision: 'Number of ADUs',
        category: 'Use & Occupancy',
        status: 'compliant',
        stateLaw:
          'MGL c.40A §3 — At least one ADU shall be permitted by right on each lot.',
        localBylaw:
          'One per property.',
        impact:
          'Consistent with state law.',
        citations: [
          { label: 'Boston ADU Program', url: SOURCES.boston_adu },
        ],
      },
    ],
  },

  // ── SOMERVILLE ──────────────────────────────────────────────────────────
  {
    slug: 'somerville',
    name: 'Somerville',
    county: 'Middlesex',
    population: 81045,
    lastReviewed: '2026-02-15',
    bylawLastUpdated: 'June 2025',
    bylawSource: 'Somerville Zoning Ordinance (Ord. 2025-16, adopted 06/26/2025)',
    agDisapprovals: 0,
    permits: { submitted: 40, approved: 24, denied: 0, pending: 0, approvalRate: 60 },
    bylawRetrievedAt: '2026-02-19',
    bylawSourceUrl: SOURCES.somerville_adu,
    bylawSourceTitle: 'Zoning Ordinance',
    bottomLine: 'Somerville is relatively ADU-friendly after adopting Ord. 2025-16. The ‘Backyard Cottage’ building type makes detached ADUs straightforward. The main watch item is the affordability requirement in Neighborhood Residential zones — it adds compliance costs that may discourage some projects.',
    provisions: [
      {
        id: 'som-01',
        provision: '3-Unit Cap in Neighborhood Residential',
        category: 'Use & Occupancy',
        status: 'review',
        stateLaw:
          'MGL c.40A §3 — ADUs must be permitted by right in single-family zoning districts. Caps on total units may conflict if they prevent otherwise lawful ADU construction.',
        localBylaw:
          'In Neighborhood Residential zones, properties are limited to three total units, one of which must be permanently affordable.',
        impact:
          'This cap could prevent ADU construction on properties that already have 2+ units, even where state law would allow it.',
        citations: [
          { label: 'Somerville ADU Rules', url: SOURCES.somerville_adu },
          { label: 'Ord. 2025-16', url: SOURCES.somerville_ord },
        ],
      },
      {
        id: 'som-02',
        provision: 'Affordability Requirement',
        category: 'Use & Occupancy',
        status: 'review',
        stateLaw:
          'MGL c.40A §3 — State law does not impose affordability requirements on protected-use ADUs.',
        localBylaw:
          'One unit in a 3-unit property must be permanently affordable.',
        impact:
          'While well-intentioned, this is an additional requirement beyond what state law imposes and could discourage ADU creation due to compliance costs.',
        citations: [
          { label: 'Somerville ADU Rules', url: SOURCES.somerville_adu },
          { label: 'Ord. 2025-16', url: SOURCES.somerville_ord },
        ],
      },
      {
        id: 'som-03',
        provision: 'Previous Owner-Occupancy Requirement',
        category: 'Use & Occupancy',
        status: 'review',
        stateLaw:
          'MGL c.40A §3 — No owner-occupancy requirement may be imposed for protected-use ADUs.',
        localBylaw:
          'Somerville\'s previous regulations included owner-occupancy requirements.',
        impact:
          'City is expected to align with state law but may not have fully removed all legacy restrictions.',
        citations: [
          { label: 'Somerville ADU Rules', url: SOURCES.somerville_adu },
        ],
      },
      {
        id: 'som-04',
        provision: 'Backyard Cottage Building Type',
        category: 'Use & Occupancy',
        status: 'compliant',
        stateLaw:
          'MGL c.40A §3 — ADUs may be within, attached to, or detached from the principal dwelling.',
        localBylaw:
          'June 2025 update created specific "Backyard Cottage" building type for detached ADUs.',
        impact:
          'Clear, defined pathway for detached units. Consistent with state law.',
        citations: [
          { label: 'Ord. 2025-16', url: SOURCES.somerville_ord },
        ],
      },
      {
        id: 'som-05',
        provision: 'By-Right Permitting',
        category: 'Process & Administration',
        status: 'compliant',
        stateLaw:
          'MGL c.40A §3 — First ADU on a lot is permitted by right.',
        localBylaw:
          'ADUs allowed by right in single-family zoning districts per state law.',
        impact:
          'Consistent with state law.',
        citations: [
          { label: 'MGL c.40A §3', url: SOURCES.mgl40a_s3 },
        ],
      },
      {
        id: 'som-06',
        provision: 'ADU Size Limits',
        category: 'Dimensional & Parking',
        status: 'compliant',
        stateLaw:
          '760 CMR 71.05(1) — ADU shall not exceed 900 sqft or 50% of the principal dwelling gross floor area.',
        localBylaw:
          'Consistent with state law (900 sqft or 50% of principal dwelling).',
        impact:
          'Consistent with state law.',
        citations: [
          { label: '760 CMR 71.00', url: SOURCES.cmr71 },
        ],
      },
      {
        id: 'som-07',
        provision: 'STR Restrictions',
        category: 'Use & Occupancy',
        status: 'compliant',
        stateLaw:
          'MGL c.40A §3 — Towns may regulate short-term rentals of ADUs.',
        localBylaw:
          'Short-term rental restrictions apply.',
        impact:
          'Consistent with state law.',
        citations: [
          { label: 'MGL c.40A §3', url: SOURCES.mgl40a_s3 },
        ],
      },
      {
        id: 'som-08',
        provision: 'Number of ADUs',
        category: 'Use & Occupancy',
        status: 'compliant',
        stateLaw:
          'MGL c.40A §3 — At least one ADU shall be permitted by right on each lot.',
        localBylaw:
          'One by right.',
        impact:
          'Consistent with state law.',
        citations: [
          { label: 'MGL c.40A §3', url: SOURCES.mgl40a_s3 },
        ],
      },
    ],
  },

  // ── WORCESTER ───────────────────────────────────────────────────────────
  {
    slug: 'worcester',
    name: 'Worcester',
    county: 'Worcester',
    population: 206518,
    municipalityType: 'city',
    lastReviewed: '2026-02-15',
    bylawLastUpdated: 'December 2023 (amendments proposed May 2025)',
    bylawSource: 'Worcester Zoning Ordinance, ADU provisions (December 2023, amendments proposed May 2025)',
    agDisapprovals: 0,
    permits: { submitted: 31, approved: 23, denied: 0, pending: 0, approvalRate: 74 },
    bylawRetrievedAt: '2026-02-19',
    bylawSourceUrl: SOURCES.worcester_adu,
    bylawSourceTitle: 'Zoning Ordinance',
    bottomLine: 'Worcester’s ordinance is mostly builder-friendly — no site plan review, no parking restrictions, by-right through building permit. The two issues are owner-occupancy (which the city council voted 9-2 to keep, per This Week in Worcester, December 2023) and the 2-bedroom cap (which mirrors a provision the AG struck down in Leicester).',
    provisions: [
      {
        id: 'wor-01',
        provision: 'Owner-Occupancy Requirement',
        category: 'Use & Occupancy',
        status: 'inconsistent',
        stateLaw:
          'MGL c.40A §3 — No owner-occupancy requirement may be imposed for protected-use ADUs.',
        localBylaw:
          'City Council added owner-occupancy requirement by amendment (9-2 vote, This Week in Worcester, December 2023). Owner must reside at property and file notarized affidavit at Registry of Deeds.',
        impact:
          'State law prohibits owner-occupancy requirements. Unenforceable for protected use ADUs.',
        citations: [
          { label: 'Worcester ADU Info', url: SOURCES.worcester_adu },
          { label: 'Worcester Landlord Summit', url: SOURCES.worcester_summit },
          { label: 'MGL c.40A §3', url: SOURCES.mgl40a_s3 },
        ],
      },
      {
        id: 'wor-02',
        provision: '2-Bedroom Cap',
        category: 'Dimensional & Parking',
        status: 'inconsistent',
        stateLaw:
          'MGL c.40A §3 — Towns may not regulate the interior area of single-family residential buildings. AG has disapproved bedroom caps in other towns (Leicester, May 2025).',
        localBylaw:
          'ADUs limited to maximum 2 bedrooms.',
        impact:
          'AG has disapproved bedroom caps in other towns (Leicester decision, May 2025) as conflicting with G.L. c. 40A §3\'s prohibition on regulating interior area of single-family residential buildings.',
        citations: [
          { label: 'Worcester ADU Info', url: SOURCES.worcester_adu },
          { label: 'AG Leicester Decision', url: SOURCES.ag_leicester },
          { label: 'MGL c.40A §3', url: SOURCES.mgl40a_s3 },
        ],
      },
      {
        id: 'wor-03',
        provision: '3-Unrelated-Person Occupancy Limit',
        category: 'Use & Occupancy',
        status: 'review',
        stateLaw:
          'MGL c.40A §3 — No restrictions on the use and occupancy of ADU tenants are permitted for protected-use ADUs.',
        localBylaw:
          'No more than 3 unrelated people may live in any dwelling unit.',
        impact:
          'While this is a citywide rule (not ADU-specific), it effectively limits ADU occupancy and could be challenged as an unreasonable restriction.',
        citations: [
          { label: 'Worcester ADU Info', url: SOURCES.worcester_adu },
        ],
      },
      {
        id: 'wor-04',
        provision: 'Front Yard Prohibition',
        category: 'Dimensional & Parking',
        status: 'review',
        stateLaw:
          '760 CMR 71.05 — Dimensional standards must not be more restrictive than those for the principal dwelling.',
        localBylaw:
          'ADUs cannot be located in the front yard. Side additions must be set back 5 feet from front elevation.',
        impact:
          'May be reasonable design standard but limits placement options on some lots.',
        citations: [
          { label: 'Worcester ADU Info', url: SOURCES.worcester_adu },
          { label: '760 CMR 71.00', url: SOURCES.cmr71 },
        ],
      },
      {
        id: 'wor-05',
        provision: 'No Site Plan Review Required',
        category: 'Process & Administration',
        status: 'compliant',
        stateLaw:
          'MGL c.40A §3 — First ADU on a lot is permitted by right.',
        localBylaw:
          'Worcester explicitly does not require planning board site plan review for ADUs.',
        impact:
          'More permissive than many towns. Consistent with state law.',
        citations: [
          { label: 'Worcester ADU Info', url: SOURCES.worcester_adu },
        ],
      },
      {
        id: 'wor-06',
        provision: 'By-Right Permitting',
        category: 'Process & Administration',
        status: 'compliant',
        stateLaw:
          'MGL c.40A §3 — First ADU on a lot is permitted by right.',
        localBylaw:
          'ADUs allowed by right through building permit only.',
        impact:
          'Consistent with state law.',
        citations: [
          { label: 'MGL c.40A §3', url: SOURCES.mgl40a_s3 },
        ],
      },
      {
        id: 'wor-07',
        provision: 'No Parking Restrictions',
        category: 'Dimensional & Parking',
        status: 'compliant',
        stateLaw:
          '760 CMR 71.05(2) — No more than 1 parking space may be required per ADU.',
        localBylaw:
          'No additional parking required for ADUs.',
        impact:
          'More permissive than state law allows. Consistent with state law.',
        citations: [
          { label: 'Worcester ADU Info', url: SOURCES.worcester_adu },
        ],
      },
      {
        id: 'wor-08',
        provision: 'ADU Size Limits',
        category: 'Dimensional & Parking',
        status: 'compliant',
        stateLaw:
          '760 CMR 71.05(1) — ADU shall not exceed 900 sqft or 50% of the principal dwelling gross floor area.',
        localBylaw:
          '900 sqft or 50% of principal dwelling, consistent with state law.',
        impact:
          'Consistent with state law.',
        citations: [
          { label: '760 CMR 71.00', url: SOURCES.cmr71 },
        ],
      },
      {
        id: 'wor-09',
        provision: 'STR Restriction',
        category: 'Use & Occupancy',
        status: 'compliant',
        stateLaw:
          'MGL c.40A §3 — Towns may regulate short-term rentals of ADUs.',
        localBylaw:
          'Properties with ADUs cannot rent any unit for less than 28 days.',
        impact:
          'Consistent with state law.',
        citations: [
          { label: 'Worcester ADU Info', url: SOURCES.worcester_adu },
        ],
      },
      {
        id: 'wor-10',
        provision: 'Detached ADU Allowance',
        category: 'Use & Occupancy',
        status: 'compliant',
        stateLaw:
          'MGL c.40A §3 — ADUs may be within, attached to, or detached from the principal dwelling.',
        localBylaw:
          'Both internal and detached (including garage conversions) permitted.',
        impact:
          'Consistent with state law.',
        citations: [
          { label: 'Worcester ADU Info', url: SOURCES.worcester_adu },
          { label: 'MGL c.40A §3', url: SOURCES.mgl40a_s3 },
        ],
      },
    ],
  },

  // ── EAST BRIDGEWATER ────────────────────────────────────────────────────
  {
    slug: 'east-bridgewater',
    name: 'East Bridgewater',
    county: 'Plymouth',
    population: 14440,
    lastReviewed: '2025-04-14',
    bylawLastUpdated: '2025 (AG partially disapproved April 2025)',
    bylawSource: 'East Bridgewater Zoning Bylaw (AG Decision Case #11579, April 14, 2025)',
    agDisapprovals: 2,
    permits: { submitted: 8, approved: 8, denied: 0, pending: 0, approvalRate: 100 },
    agDecisionDate: '2025-04-14',
    agDecisionUrl: SOURCES.ag_east_bridgewater,
    bylawRetrievedAt: '2026-02-19',
    bylawSourceTitle: 'Zoning Bylaw',
    bottomLine: 'East Bridgewater had 2 provisions disapproved by the AG in April 2025. The single-family-lot restriction and a 4-year waiting period were both struck down. Site plan review scope and design standards remain under review.',
    provisions: [
      {
        id: 'ebr-01',
        provision: 'ADUs Limited to Single-Family Lots',
        category: 'Use & Occupancy',
        status: 'inconsistent',
        stateLaw:
          'MGL c.40A §3 — ADUs must be allowed on any lot in a single-family residential zoning district, not just lots with single-family homes.',
        localBylaw:
          'Bylaw limited ADUs to single-family lots only.',
        impact:
          'AG DISAPPROVED — restricting ADUs to lots with single-family homes conflicts with G.L. c. 40A §3.',
        agDecision:
          'AG Decision April 14, 2025 (Case #11579): Disapproved. ADUs must be allowed on any lot in a single-family zoning district.',
        citations: [
          { label: 'AG MLU Decision', url: SOURCES.ag_east_bridgewater },
          { label: 'MGL c.40A §3', url: SOURCES.mgl40a_s3 },
          { label: '760 CMR 71.00', url: SOURCES.cmr71 },
        ],
      },
      {
        id: 'ebr-02',
        provision: '4-Year Waiting Period',
        category: 'Use & Occupancy',
        status: 'inconsistent',
        stateLaw:
          'MGL c.40A §3 — No waiting period may be imposed as a condition of ADU construction for protected-use ADUs.',
        localBylaw:
          'Bylaw required a 4-year waiting period before an ADU could be constructed.',
        impact:
          'AG DISAPPROVED — waiting period conflicts with G.L. c. 40A §3. ADUs are permitted by right without temporal restrictions.',
        agDecision:
          'AG Decision April 14, 2025 (Case #11579): Disapproved. Waiting periods conflict with by-right protections under G.L. c. 40A §3.',
        citations: [
          { label: 'AG MLU Decision', url: SOURCES.ag_east_bridgewater },
          { label: 'MGL c.40A §3', url: SOURCES.mgl40a_s3 },
        ],
      },
      {
        id: 'ebr-03',
        provision: 'Site Plan Review Scope',
        category: 'Process & Administration',
        status: 'review',
        stateLaw:
          '760 CMR 71.04(1) — Site plan review must not function as a barrier to ADU construction.',
        localBylaw:
          'Site plan review scope may exceed what is reasonable for by-right ADUs.',
        impact:
          'May function as gatekeeping depending on implementation. Warrants monitoring.',
        citations: [
          { label: '760 CMR 71.00', url: SOURCES.cmr71 },
          { label: 'MGL c.40A §3', url: SOURCES.mgl40a_s3 },
        ],
      },
      {
        id: 'ebr-04',
        provision: 'Design Standards',
        category: 'Building & Safety',
        status: 'review',
        stateLaw:
          '760 CMR 71.05(5) — Towns may impose "reasonable" design standards but may not use them to effectively prohibit construction.',
        localBylaw:
          'Design standards may exceed what is reasonable under state guidelines.',
        impact:
          'Subjective standards could function as barriers depending on interpretation.',
        citations: [
          { label: '760 CMR 71.00', url: SOURCES.cmr71 },
        ],
      },
      {
        id: 'ebr-05',
        provision: 'ADU Definition',
        category: 'Use & Occupancy',
        status: 'compliant',
        stateLaw:
          'MGL c.40A §1A — ADU definition per state law.',
        localBylaw:
          'ADU definition consistent with state law.',
        impact:
          'Consistent with state law.',
        citations: [
          { label: 'MGL c.40A §1A', url: SOURCES.mgl40a_s1a },
        ],
      },
      {
        id: 'ebr-06',
        provision: 'By-Right in Residential Districts',
        category: 'Process & Administration',
        status: 'compliant',
        stateLaw:
          'MGL c.40A §3 — First ADU on a lot is permitted by right.',
        localBylaw:
          'ADUs permitted by right in residential districts.',
        impact:
          'Consistent with state law.',
        citations: [
          { label: 'MGL c.40A §3', url: SOURCES.mgl40a_s3 },
        ],
      },
      {
        id: 'ebr-07',
        provision: 'Short-Term Rental Restrictions',
        category: 'Use & Occupancy',
        status: 'compliant',
        stateLaw:
          'MGL c.40A §3 — Towns may regulate short-term rentals of ADUs.',
        localBylaw:
          'Short-term rental restrictions on ADUs.',
        impact:
          'Consistent with state law.',
        citations: [
          { label: 'MGL c.40A §3', url: SOURCES.mgl40a_s3 },
        ],
      },
    ],
  },

  // ── WESTON ──────────────────────────────────────────────────────────────
  {
    slug: 'weston',
    name: 'Weston',
    county: 'Middlesex',
    population: 11851,
    lastReviewed: '2025-06-09',
    bylawLastUpdated: '2025 (AG partially disapproved June 2025)',
    bylawSource: 'Weston Zoning Bylaw (AG Decision Case #11649, June 9, 2025)',
    agDisapprovals: 3,
    permits: { submitted: 0, approved: 0, denied: 0, pending: 0, approvalRate: 0 },
    agDecisionDate: '2025-06-09',
    agDecisionUrl: SOURCES.ag_weston,
    bylawRetrievedAt: '2026-02-19',
    bylawSourceTitle: 'Zoning Bylaw',
    bottomLine: 'Weston had 3 provisions disapproved by the AG in June 2025 — a 12-month minimum lease, a 4-year dwelling existence requirement, and a special permit for newer dwellings. Zero permits submitted suggests the restrictions may be deterring applicants.',
    provisions: [
      {
        id: 'wes-01',
        provision: '12-Month Minimum Lease',
        category: 'Use & Occupancy',
        status: 'inconsistent',
        stateLaw:
          'MGL c.40A §§1A, 3 — Towns may not impose lease duration minimums beyond what state law allows for protected-use ADUs.',
        localBylaw:
          'Bylaw required a 12-month minimum lease for ADU tenants.',
        impact:
          'AG DISAPPROVED — minimum lease duration conflicts with G.L. c. 40A §§1A, 3.',
        agDecision:
          'AG Decision June 9, 2025 (Case #11649): Disapproved. 12-month minimum lease conflicts with G.L. c. 40A §§1A, 3.',
        citations: [
          { label: 'AG MLU Decision', url: SOURCES.ag_weston },
          { label: 'MGL c.40A §1A', url: SOURCES.mgl40a_s1a },
          { label: 'MGL c.40A §3', url: SOURCES.mgl40a_s3 },
        ],
      },
      {
        id: 'wes-02',
        provision: '4-Year Dwelling Existence Requirement',
        category: 'Use & Occupancy',
        status: 'inconsistent',
        stateLaw:
          'MGL c.40A §3 — No temporal conditions may be imposed on ADU construction for protected-use ADUs.',
        localBylaw:
          'Bylaw required the principal dwelling to have existed for at least 4 years before an ADU could be built.',
        impact:
          'AG DISAPPROVED — dwelling age requirement conflicts with G.L. c. 40A §3. ADUs are permitted by right regardless of dwelling age.',
        agDecision:
          'AG Decision June 9, 2025 (Case #11649): Disapproved. 4-year dwelling existence requirement conflicts with G.L. c. 40A §3.',
        citations: [
          { label: 'AG MLU Decision', url: SOURCES.ag_weston },
          { label: 'MGL c.40A §3', url: SOURCES.mgl40a_s3 },
        ],
      },
      {
        id: 'wes-03',
        provision: 'Special Permit for Newer Dwellings',
        category: 'Process & Administration',
        status: 'inconsistent',
        stateLaw:
          'MGL c.40A §3 — First ADU on a lot is permitted by right. No special permit may be required.',
        localBylaw:
          'Bylaw required a special permit for ADU construction on dwellings that did not meet the 4-year existence threshold.',
        impact:
          'AG DISAPPROVED — special permit requirement for by-right ADUs conflicts with G.L. c. 40A §3.',
        agDecision:
          'AG Decision June 9, 2025 (Case #11649): Disapproved. Special permit requirement conflicts with by-right protections under G.L. c. 40A §3.',
        citations: [
          { label: 'AG MLU Decision', url: SOURCES.ag_weston },
          { label: 'MGL c.40A §3', url: SOURCES.mgl40a_s3 },
        ],
      },
      {
        id: 'wes-04',
        provision: 'Site Plan Review Standards',
        category: 'Process & Administration',
        status: 'review',
        stateLaw:
          '760 CMR 71.04(1) — Site plan review must not function as a barrier to ADU construction.',
        localBylaw:
          'Site plan review standards may exceed what is reasonable for by-right ADUs.',
        impact:
          'May function as gatekeeping depending on implementation.',
        citations: [
          { label: '760 CMR 71.00', url: SOURCES.cmr71 },
        ],
      },
      {
        id: 'wes-05',
        provision: 'Dimensional Requirements',
        category: 'Dimensional & Parking',
        status: 'review',
        stateLaw:
          '760 CMR 71.05 — Dimensional standards must not be more restrictive than those for the principal dwelling.',
        localBylaw:
          'Dimensional requirements may exceed state limits in some configurations.',
        impact:
          'Warrants monitoring to ensure ADU setbacks and lot coverage don\'t exceed single-family standards.',
        citations: [
          { label: '760 CMR 71.00', url: SOURCES.cmr71 },
        ],
      },
      {
        id: 'wes-06',
        provision: 'ADUs in All Residential Districts',
        category: 'Use & Occupancy',
        status: 'compliant',
        stateLaw:
          'MGL c.40A §3 — ADUs must be allowed in all single-family residential zoning districts.',
        localBylaw:
          'ADUs allowed in all residential districts.',
        impact:
          'Consistent with state law.',
        citations: [
          { label: 'MGL c.40A §3', url: SOURCES.mgl40a_s3 },
        ],
      },
      {
        id: 'wes-07',
        provision: 'Multiple ADUs by Special Permit',
        category: 'Process & Administration',
        status: 'compliant',
        stateLaw:
          'MGL c.40A §3 — Towns may require special permit for second or subsequent ADUs.',
        localBylaw:
          'Additional ADUs beyond the first require special permit.',
        impact:
          'Consistent with state law.',
        citations: [
          { label: 'MGL c.40A §3', url: SOURCES.mgl40a_s3 },
        ],
      },
      {
        id: 'wes-08',
        provision: 'ADU Definition',
        category: 'Use & Occupancy',
        status: 'compliant',
        stateLaw:
          'MGL c.40A §1A — ADU definition per state law.',
        localBylaw:
          'ADU definition consistent with state law.',
        impact:
          'Consistent with state law.',
        citations: [
          { label: 'MGL c.40A §1A', url: SOURCES.mgl40a_s1a },
        ],
      },
      {
        id: 'wes-09',
        provision: 'Short-Term Rental Restrictions',
        category: 'Use & Occupancy',
        status: 'compliant',
        stateLaw:
          'MGL c.40A §3 — Towns may regulate short-term rentals of ADUs.',
        localBylaw:
          'Short-term rental restrictions on ADUs.',
        impact:
          'Consistent with state law.',
        citations: [
          { label: 'MGL c.40A §3', url: SOURCES.mgl40a_s3 },
        ],
      },
    ],
  },

  // ── UPTON ───────────────────────────────────────────────────────────────
  {
    slug: 'upton',
    name: 'Upton',
    county: 'Worcester',
    population: 8000,
    lastReviewed: '2025-06-09',
    bylawLastUpdated: '2025 (AG partially disapproved June 2025)',
    bylawSource: 'Upton Zoning Bylaw (AG Decision Case #11658, June 9, 2025)',
    agDisapprovals: 2,
    permits: { submitted: 5, approved: 4, denied: 0, pending: 0, approvalRate: 80 },
    agDecisionDate: '2025-06-09',
    agDecisionUrl: SOURCES.ag_upton,
    bylawRetrievedAt: '2026-02-19',
    bylawSourceTitle: 'Zoning Bylaw',
    bottomLine: 'Upton had 2 provisions disapproved by the AG in June 2025. The AG struck the limitation of by-right ADUs to residential districts only and the special permit requirement in non-residential districts. The incomplete ADU definition and special permit criteria bleed-through remain under review.',
    provisions: [
      {
        id: 'upt-01',
        provision: 'ADUs By-Right Limited to Residential Districts Only',
        category: 'Use & Occupancy',
        status: 'inconsistent',
        stateLaw:
          'MGL c.40A §3 — ADUs must be allowed on any lot in a single-family residential zoning district, including non-residential districts where single-family homes exist.',
        localBylaw:
          'Bylaw limited by-right ADUs to residential districts only, excluding non-residential districts where single-family homes are present.',
        impact:
          'AG DISAPPROVED — ADUs must be permitted wherever single-family homes are allowed, including non-residential districts.',
        agDecision:
          'AG Decision June 9, 2025 (Case #11658): Disapproved. By-right ADU limitation to residential districts conflicts with G.L. c. 40A §3.',
        citations: [
          { label: 'AG MLU Decision', url: SOURCES.ag_upton },
          { label: 'MGL c.40A §3', url: SOURCES.mgl40a_s3 },
        ],
      },
      {
        id: 'upt-02',
        provision: 'Special Permit in Non-Residential Districts',
        category: 'Process & Administration',
        status: 'inconsistent',
        stateLaw:
          'MGL c.40A §3 — First ADU on a lot is permitted by right. No special permit may be required.',
        localBylaw:
          'Bylaw required a special permit for ADUs in non-residential districts where single-family homes exist.',
        impact:
          'AG DISAPPROVED — special permit requirement for first ADU conflicts with by-right protections under G.L. c. 40A §3.',
        agDecision:
          'AG Decision June 9, 2025 (Case #11658): Disapproved. Special permit for ADUs in non-residential districts conflicts with G.L. c. 40A §3.',
        citations: [
          { label: 'AG MLU Decision', url: SOURCES.ag_upton },
          { label: 'MGL c.40A §3', url: SOURCES.mgl40a_s3 },
        ],
      },
      {
        id: 'upt-03',
        provision: 'Incomplete ADU Definition',
        category: 'Use & Occupancy',
        status: 'review',
        stateLaw:
          'MGL c.40A §1A — ADU definition must align with state law definition.',
        localBylaw:
          'ADU definition may be incomplete or inconsistent with the state law definition.',
        impact:
          'An incomplete definition could create ambiguity about what qualifies as an ADU under local rules.',
        citations: [
          { label: 'MGL c.40A §1A', url: SOURCES.mgl40a_s1a },
        ],
      },
      {
        id: 'upt-04',
        provision: 'Special Permit Criteria Bleed-Through',
        category: 'Process & Administration',
        status: 'review',
        stateLaw:
          'MGL c.40A §3 — By-right ADUs may not be subject to special permit criteria.',
        localBylaw:
          'Special permit criteria from other sections may bleed through to by-right ADU applications.',
        impact:
          'Could effectively subject by-right ADUs to special permit-level scrutiny.',
        citations: [
          { label: 'MGL c.40A §3', url: SOURCES.mgl40a_s3 },
        ],
      },
      {
        id: 'upt-05',
        provision: 'By-Right in Named Residential Districts',
        category: 'Process & Administration',
        status: 'compliant',
        stateLaw:
          'MGL c.40A §3 — First ADU on a lot is permitted by right.',
        localBylaw:
          'ADUs permitted by right in named residential districts.',
        impact:
          'Consistent with state law for the districts covered.',
        citations: [
          { label: 'MGL c.40A §3', url: SOURCES.mgl40a_s3 },
        ],
      },
      {
        id: 'upt-06',
        provision: 'Special Permit for Additional ADUs',
        category: 'Process & Administration',
        status: 'compliant',
        stateLaw:
          'MGL c.40A §3 — Towns may require special permit for second or subsequent ADUs.',
        localBylaw:
          'Additional ADUs beyond the first require special permit.',
        impact:
          'Consistent with state law.',
        citations: [
          { label: 'MGL c.40A §3', url: SOURCES.mgl40a_s3 },
        ],
      },
      {
        id: 'upt-07',
        provision: 'Grandfathering Provision',
        category: 'Process & Administration',
        status: 'compliant',
        stateLaw:
          'MGL c.40A §3 — Existing ADUs may be grandfathered under local rules.',
        localBylaw:
          'Pre-existing ADUs grandfathered under the new bylaw.',
        impact:
          'Consistent with state law.',
        citations: [
          { label: 'MGL c.40A §3', url: SOURCES.mgl40a_s3 },
        ],
      },
    ],
  },

  // ── WILBRAHAM ───────────────────────────────────────────────────────────
  {
    slug: 'wilbraham',
    name: 'Wilbraham',
    county: 'Hampden',
    population: 14613,
    lastReviewed: '2025-12-19',
    bylawLastUpdated: '2025 (AG partially disapproved December 2025)',
    bylawSource: 'Wilbraham Zoning Bylaw (AG Decision Case #11778, December 19, 2025)',
    agDisapprovals: 4,
    permits: { submitted: 4, approved: 4, denied: 0, pending: 0, approvalRate: 100 },
    agDecisionDate: '2025-12-19',
    agDecisionUrl: SOURCES.ag_wilbraham,
    bylawRetrievedAt: '2026-02-19',
    bylawSourceTitle: 'Zoning Bylaw',
    bottomLine: 'Wilbraham had 4 provisions disapproved by the AG in December 2025 — single-family-only references, minimum lot area, blanket parking requirement, and special permit for nonconforming dwellings. The most disapprovals of any town reviewed so far.',
    provisions: [
      {
        id: 'wil-01',
        provision: 'Single-Family-Only References',
        category: 'Use & Occupancy',
        status: 'inconsistent',
        stateLaw:
          'MGL c.40A §3 — ADUs must be allowed on any lot in a single-family residential zoning district, not just lots with single-family homes.',
        localBylaw:
          'Bylaw contained references limiting ADUs to single-family dwellings only.',
        impact:
          'AG DISAPPROVED — single-family-only language conflicts with G.L. c. 40A §3.',
        agDecision:
          'AG Decision December 19, 2025 (Case #11778): Disapproved. Single-family-only references conflict with G.L. c. 40A §3.',
        citations: [
          { label: 'AG MLU Decision', url: SOURCES.ag_wilbraham },
          { label: 'MGL c.40A §3', url: SOURCES.mgl40a_s3 },
        ],
      },
      {
        id: 'wil-02',
        provision: 'Minimum Lot Area 15k-60k sqft',
        category: 'Dimensional & Parking',
        status: 'inconsistent',
        stateLaw:
          '760 CMR 71.03(3)(b)(2) — No minimum lot size requirements may be imposed for protected-use ADUs.',
        localBylaw:
          'Bylaw imposed minimum lot area requirements ranging from 15,000 to 60,000 sqft depending on district.',
        impact:
          'AG DISAPPROVED — minimum lot area conflicts with 760 CMR 71.03(3)(b)(2). State law does not allow lot size requirements for protected use ADUs.',
        agDecision:
          'AG Decision December 19, 2025 (Case #11778): Disapproved. Minimum lot area conflicts with 760 CMR 71.03(3)(b)(2).',
        citations: [
          { label: 'AG MLU Decision', url: SOURCES.ag_wilbraham },
          { label: '760 CMR 71.00', url: SOURCES.cmr71 },
        ],
      },
      {
        id: 'wil-03',
        provision: 'Blanket Parking Requirement',
        category: 'Dimensional & Parking',
        status: 'inconsistent',
        stateLaw:
          'MGL c.40A §3 — Parking for an ADU shall not exceed 1 space. No blanket or additional parking requirements may be imposed.',
        localBylaw:
          'Bylaw imposed a blanket parking requirement that exceeded the state cap of 1 space per ADU.',
        impact:
          'AG DISAPPROVED — blanket parking requirement conflicts with G.L. c. 40A §3 and 760 CMR 71.05(2).',
        agDecision:
          'AG Decision December 19, 2025 (Case #11778): Disapproved. Parking requirement exceeds state cap.',
        citations: [
          { label: 'AG MLU Decision', url: SOURCES.ag_wilbraham },
          { label: 'MGL c.40A §3', url: SOURCES.mgl40a_s3 },
          { label: '760 CMR 71.00', url: SOURCES.cmr71 },
        ],
      },
      {
        id: 'wil-04',
        provision: 'Special Permit for Nonconforming Dwellings',
        category: 'Process & Administration',
        status: 'inconsistent',
        stateLaw:
          'MGL c.40A §3 — First ADU on a lot is permitted by right. No special permit may be required.',
        localBylaw:
          'Bylaw required a special permit for ADUs on lots with nonconforming dwellings.',
        impact:
          'AG DISAPPROVED — special permit requirement for first ADU conflicts with by-right protections under G.L. c. 40A §3.',
        agDecision:
          'AG Decision December 19, 2025 (Case #11778): Disapproved. Special permit for nonconforming dwellings conflicts with G.L. c. 40A §3.',
        citations: [
          { label: 'AG MLU Decision', url: SOURCES.ag_wilbraham },
          { label: 'MGL c.40A §3', url: SOURCES.mgl40a_s3 },
        ],
      },
      {
        id: 'wil-05',
        provision: 'Site Plan Denial Authority',
        category: 'Process & Administration',
        status: 'review',
        stateLaw:
          '760 CMR 71.04(1) — Site plan review must not function as a barrier to ADU construction.',
        localBylaw:
          'Site plan review includes authority to deny ADU applications.',
        impact:
          'Denial authority for by-right ADUs could function as a de facto special permit requirement.',
        citations: [
          { label: '760 CMR 71.00', url: SOURCES.cmr71 },
        ],
      },
      {
        id: 'wil-06',
        provision: 'ADU Prohibited in Some Non-Residential Districts',
        category: 'Use & Occupancy',
        status: 'review',
        stateLaw:
          'MGL c.40A §3 — ADUs must be allowed wherever single-family homes are permitted.',
        localBylaw:
          'ADUs may be prohibited in non-residential districts where single-family homes exist.',
        impact:
          'If single-family homes are allowed in these districts, ADUs must also be allowed.',
        citations: [
          { label: 'MGL c.40A §3', url: SOURCES.mgl40a_s3 },
        ],
      },
      {
        id: 'wil-07',
        provision: 'By-Right in Residential Districts',
        category: 'Process & Administration',
        status: 'compliant',
        stateLaw:
          'MGL c.40A §3 — First ADU on a lot is permitted by right.',
        localBylaw:
          'ADUs permitted by right in residential districts.',
        impact:
          'Consistent with state law.',
        citations: [
          { label: 'MGL c.40A §3', url: SOURCES.mgl40a_s3 },
        ],
      },
      {
        id: 'wil-08',
        provision: 'Updated ADU Definition',
        category: 'Use & Occupancy',
        status: 'compliant',
        stateLaw:
          'MGL c.40A §1A — ADU definition per state law.',
        localBylaw:
          'ADU definition updated to align with state law.',
        impact:
          'Consistent with state law.',
        citations: [
          { label: 'MGL c.40A §1A', url: SOURCES.mgl40a_s1a },
        ],
      },
      {
        id: 'wil-09',
        provision: 'Removed Prior Special Permit',
        category: 'Process & Administration',
        status: 'compliant',
        stateLaw:
          'MGL c.40A §3 — First ADU on a lot is permitted by right.',
        localBylaw:
          'Prior special permit requirement for ADUs was removed.',
        impact:
          'Consistent with state law.',
        citations: [
          { label: 'MGL c.40A §3', url: SOURCES.mgl40a_s3 },
        ],
      },
      {
        id: 'wil-10',
        provision: 'New ADU Regulations Section',
        category: 'Process & Administration',
        status: 'compliant',
        stateLaw:
          'MGL c.40A §3 — Towns may adopt local ADU regulations consistent with state law.',
        localBylaw:
          'New dedicated ADU regulations section adopted.',
        impact:
          'Consistent with state law.',
        citations: [
          { label: 'MGL c.40A §3', url: SOURCES.mgl40a_s3 },
        ],
      },
    ],
  },

  // ── QUINCY ──────────────────────────────────────────────────────────────
  {
    slug: 'quincy',
    name: 'Quincy',
    county: 'Norfolk',
    population: 101636,
    municipalityType: 'city',
    lastReviewed: '2026-02-15',
    bylawLastUpdated: 'February 2025',
    bylawSource: 'Quincy ADU Guidelines (February 28, 2025)',
    agDisapprovals: 0,
    permits: { submitted: 17, approved: 6, denied: 0, pending: 0, approvalRate: 35 },
    bylawRetrievedAt: '2026-02-19',
    bylawSourceUrl: SOURCES.quincy_adu,
    bylawSourceTitle: 'ADU Guidelines',
    bottomLine: 'Quincy has 3 provisions identified as inconsistent through ADU Pulse\u2019s independent analysis. District exclusions, a variance lot exclusion, and a detached ADU one-story limit all conflict with state law. The 35% approval rate \u2014 among the lowest for cities \u2014 may reflect these barriers.',
    provisions: [
      {
        id: 'qcy-01',
        provision: 'District Exclusions (Bus C, Ind A, Ind B)',
        category: 'Use & Occupancy',
        status: 'inconsistent',
        stateLaw:
          '760 CMR 71.02 \u2014 ADUs must be allowed on any lot with a single-family dwelling, in any zoning district where single-family homes are permitted.',
        localBylaw:
          'Quincy excludes ADUs from Business C, Industrial A, and Industrial B districts, even where single-family homes exist.',
        impact:
          'These exclusions are preempted by state law. If single-family homes are permitted in a district, ADUs must also be allowed by right.',
        citations: [
          { label: '760 CMR 71.02', url: SOURCES.cmr71 },
          { label: 'MGL c.40A \u00a73', url: SOURCES.mgl40a_s3 },
          { label: 'Quincy ADU Info', url: SOURCES.quincy_adu },
        ],
      },
      {
        id: 'qcy-02',
        provision: 'Variance Lot Exclusion',
        category: 'Use & Occupancy',
        status: 'inconsistent',
        stateLaw:
          '760 CMR 71.03(5) \u2014 ADUs are allowed on any lot with a single-family dwelling regardless of how the lot or dwelling was permitted.',
        localBylaw:
          'Quincy excludes lots that received a variance from ADU eligibility.',
        impact:
          'This exclusion conflicts with state law. Variance lots with single-family homes are eligible for ADUs.',
        citations: [
          { label: '760 CMR 71.03(5)', url: SOURCES.cmr71 },
          { label: 'Quincy ADU Info', url: SOURCES.quincy_adu },
        ],
      },
      {
        id: 'qcy-03',
        provision: 'Detached ADU One-Story Limit',
        category: 'Dimensional & Parking',
        status: 'inconsistent',
        stateLaw:
          '760 CMR 71.03(3)(b)(2) \u2014 Towns may not impose height or story limits on detached ADUs beyond what applies to the principal dwelling.',
        localBylaw:
          'Detached ADUs limited to one story regardless of what the principal dwelling allows.',
        impact:
          'This restriction is more restrictive than what state law allows for the principal dwelling and is subject to statutory override under G.L. c. 40A §3.',
        citations: [
          { label: '760 CMR 71.03(3)(b)(2)', url: SOURCES.cmr71 },
          { label: 'Quincy ADU Info', url: SOURCES.quincy_adu },
        ],
      },
      {
        id: 'qcy-04',
        provision: '320 SF Minimum Size',
        category: 'Dimensional & Parking',
        status: 'review',
        stateLaw:
          '760 CMR 71.05(1) \u2014 State law sets a maximum (900 sqft) but does not address minimum size. A high minimum could function as a barrier.',
        localBylaw:
          'ADUs must be at least 320 square feet.',
        impact:
          '320 SF is reasonable but higher than some jurisdictions. Worth monitoring whether it prevents smaller, lower-cost ADUs.',
        citations: [
          { label: '760 CMR 71.00', url: SOURCES.cmr71 },
        ],
      },
      {
        id: 'qcy-05',
        provision: 'Transit Parking Exemption',
        category: 'Dimensional & Parking',
        status: 'compliant',
        stateLaw:
          '760 CMR 71.05(2) \u2014 No more than 1 parking space may be required per ADU.',
        localBylaw:
          'Properties within 0.5 miles of transit are exempt from ADU parking requirements.',
        impact:
          'More permissive than state law. Consistent.',
        citations: [
          { label: 'Quincy ADU Info', url: SOURCES.quincy_adu },
        ],
      },
      {
        id: 'qcy-06',
        provision: 'STR Prohibition',
        category: 'Use & Occupancy',
        status: 'compliant',
        stateLaw:
          'MGL c.40A \u00a73 \u2014 Towns may regulate short-term rentals of ADUs.',
        localBylaw:
          'Short-term rentals of ADUs prohibited.',
        impact:
          'Consistent with state law.',
        citations: [
          { label: 'MGL c.40A \u00a73', url: SOURCES.mgl40a_s3 },
        ],
      },
    ],
  },

  // ── SALEM ───────────────────────────────────────────────────────────────
  {
    slug: 'salem',
    name: 'Salem',
    county: 'Essex',
    population: 44480,
    municipalityType: 'city',
    lastReviewed: '2026-02-15',
    bylawLastUpdated: '2022 (amendment pending May 2025)',
    bylawSource: 'Salem Zoning Ordinance, ADU provisions (2022, amendment pending May 2025)',
    agDisapprovals: 0,
    permits: { submitted: 9, approved: 9, denied: 0, pending: 0, approvalRate: 100 },
    bylawRetrievedAt: '2026-02-19',
    bylawSourceUrl: SOURCES.salem_adu,
    bylawSourceTitle: 'Zoning Ordinance',
    bottomLine: 'Salem has 1 provision identified as inconsistent: a mandatory 70% Fair Market Rent cap that conflicts with state regulations. Two additional provisions are under review. Despite this, Salem has a 100% approval rate on the 9 permits submitted.',
    provisions: [
      {
        id: 'slm-01',
        provision: '70% Fair Market Rent Cap',
        category: 'Use & Occupancy',
        status: 'inconsistent',
        stateLaw:
          '760 CMR 71.03(3)(b)(4) \u2014 If imposed as a mandatory condition of ADU approval, rent caps conflict with state regulations governing protected-use ADUs.',
        localBylaw:
          'ADU rent capped at 70% of HUD Fair Market Rent for the area.',
        impact:
          'A mandatory rent cap on protected-use ADUs appears inconsistent with state law. Voluntary affordability incentives are permissible, but requiring below-market rent as a condition of approval is subject to statutory override under G.L. c. 40A §3.',
        citations: [
          { label: '760 CMR 71.03(3)(b)(4)', url: SOURCES.cmr71 },
          { label: 'Salem ADU Info', url: SOURCES.salem_adu },
        ],
      },
      {
        id: 'slm-02',
        provision: '350 SF Minimum Size',
        category: 'Dimensional & Parking',
        status: 'review',
        stateLaw:
          '760 CMR 71.05(1) \u2014 State law sets a maximum (900 sqft) but does not address minimum size.',
        localBylaw:
          'ADUs must be at least 350 square feet.',
        impact:
          '350 SF is on the higher end for minimums. Could prevent studio-style ADUs.',
        citations: [
          { label: '760 CMR 71.00', url: SOURCES.cmr71 },
        ],
      },
      {
        id: 'slm-03',
        provision: 'District Limitations',
        category: 'Use & Occupancy',
        status: 'review',
        stateLaw:
          'MGL c.40A \u00a73 \u2014 ADUs must be allowed in all districts where single-family homes are permitted.',
        localBylaw:
          'ADU eligibility may be limited to certain districts. Amendment pending to correct this.',
        impact:
          'Being corrected via pending amendment. Currently a gray area.',
        citations: [
          { label: 'Salem ADU Info', url: SOURCES.salem_adu },
          { label: 'MGL c.40A \u00a73', url: SOURCES.mgl40a_s3 },
        ],
      },
      {
        id: 'slm-04',
        provision: 'STR Restrictions',
        category: 'Use & Occupancy',
        status: 'compliant',
        stateLaw:
          'MGL c.40A \u00a73 \u2014 Towns may regulate short-term rentals of ADUs.',
        localBylaw:
          'Short-term rental restrictions on ADUs.',
        impact:
          'Consistent with state law.',
        citations: [
          { label: 'MGL c.40A \u00a73', url: SOURCES.mgl40a_s3 },
        ],
      },
    ],
  },

  // ── REVERE ──────────────────────────────────────────────────────────────
  {
    slug: 'revere',
    name: 'Revere',
    county: 'Suffolk',
    population: 62186,
    municipalityType: 'city',
    resistanceTag: 'legislative-challenge',
    lastReviewed: '2026-02-15',
    bylawLastUpdated: 'October 2022',
    bylawSource: 'Revere Zoning Ordinance, Title 17, Chapter 17.25 (October 2022)',
    agDisapprovals: 0,
    permits: { submitted: 17, approved: 9, denied: 0, pending: 0, approvalRate: 53 },
    bylawRetrievedAt: '2026-02-19',
    bylawSourceUrl: SOURCES.revere_adu,
    bylawSourceTitle: 'Zoning Ordinance',
    bottomLine: 'Revere has pursued a legislative exemption from the state ADU law. A city councillor filed a Home Rule Petition in March 2025 seeking exemption (Revere Journal, March 2025). The planning director expressed skepticism about its viability (Revere Journal, March 2025). Meanwhile, all 4 provisions that conflict with state law have been preempted since February 2, 2025.',
    provisions: [
      {
        id: 'rev-01',
        provision: 'Owner-Occupancy (2-Year Minimum)',
        category: 'Use & Occupancy',
        status: 'inconsistent',
        stateLaw:
          '760 CMR 71.03(3)(b)(3) \u2014 No owner-occupancy requirement may be imposed for protected-use ADUs.',
        localBylaw:
          'Property owner must have occupied the dwelling for at least 2 years before building an ADU.',
        impact:
          'This provision is preempted by state law. G.L. c. 40A §3 prohibits owner-occupancy requirements for protected-use ADUs.',
        citations: [
          { label: '760 CMR 71.03(3)(b)(3)', url: SOURCES.cmr71 },
          { label: 'MGL c.40A \u00a73', url: SOURCES.mgl40a_s3 },
          { label: 'Revere ADU Info', url: SOURCES.revere_adu },
        ],
      },
      {
        id: 'rev-02',
        provision: 'Single-Family Homes Only',
        category: 'Use & Occupancy',
        status: 'inconsistent',
        stateLaw:
          '760 CMR 71.02 \u2014 ADUs must be allowed on any lot in a single-family residential zoning district, regardless of existing use. EOHLC FAQ confirms this interpretation.',
        localBylaw:
          'ADUs limited to lots with single-family homes only.',
        impact:
          'This restriction is preempted by state law. ADUs are allowed on any lot in a district where single-family homes are permitted.',
        citations: [
          { label: '760 CMR 71.02', url: SOURCES.cmr71 },
          { label: 'EOHLC FAQ', url: SOURCES.eohlc_faq },
          { label: 'Revere ADU Info', url: SOURCES.revere_adu },
        ],
      },
      {
        id: 'rev-03',
        provision: 'No Enlarging Principal Dwelling',
        category: 'Use & Occupancy',
        status: 'inconsistent',
        stateLaw:
          'MGL c.40A \u00a73 \u2014 ADUs may be within, attached to, or detached from the principal dwelling. Attached ADUs necessarily involve enlarging the structure.',
        localBylaw:
          'ADU construction cannot enlarge the principal dwelling.',
        impact:
          'This effectively prohibits attached ADUs, which state law explicitly allows. Preempted by G.L. c. 40A §3.',
        citations: [
          { label: 'MGL c.40A \u00a73', url: SOURCES.mgl40a_s3 },
          { label: 'Revere ADU Info', url: SOURCES.revere_adu },
        ],
      },
      {
        id: 'rev-04',
        provision: '600 SF Max / 1-Bedroom Limit',
        category: 'Dimensional & Parking',
        status: 'inconsistent',
        stateLaw:
          'MGL c.40A \u00a77 \u2014 State law sets the maximum at 900 sqft. G.L. c. 40A \u00a73 prohibits regulating interior area of single-family residential buildings (Leicester AG Decision, 5/27/2025).',
        localBylaw:
          'ADUs capped at 600 sqft and limited to 1 bedroom.',
        impact:
          'Both the 600 SF cap and the 1-bedroom limit are more restrictive than state law allows and are preempted by state law. The AG struck down similar bedroom caps in Leicester.',
        citations: [
          { label: 'MGL c.40A \u00a77', url: SOURCES.mgl40a_s3 },
          { label: 'AG Leicester Decision', url: SOURCES.ag_leicester },
          { label: 'Revere ADU Info', url: SOURCES.revere_adu },
        ],
      },
    ],
  },
  // ── SOUTHBOROUGH ────────────────────────────────────────────────────────
  {
    slug: 'southborough',
    name: 'Southborough',
    county: 'Worcester',
    population: 10450,
    lastReviewed: '2026-02-17',
    bylawLastUpdated: '2025 (AG partial disapproval February 2026)',
    bylawSource: 'Southborough Zoning Bylaw, ADU provisions (AG Decision, February 17, 2026)',
    agDisapprovals: 1,
    permits: { submitted: 2, approved: 0, denied: 0, pending: 0, approvalRate: 0 },
    agDecisionDate: '2026-02-17',
    agDecisionUrl: SOURCES.southborough_ag,
    bylawRetrievedAt: '2026-02-19',
    bylawSourceTitle: 'Zoning Bylaw',
    bottomLine: 'Southborough tried to ban mobile homes from being used as ADUs, but the AG struck down the restriction because the town\u2019s broad definition of \u201cmobile home\u201d included manufactured homes protected under state law. The travel trailer ban was upheld. The Planning Board is already working on revisions for April Town Meeting. This decision sets a precedent: towns cannot use overbroad definitions to exclude modular or manufactured ADUs. (My Southborough, February 2026)',
    provisions: [
      {
        id: 'sou-01',
        provision: 'ADU Structure Type Restrictions',
        category: 'Building & Safety',
        status: 'inconsistent',
        stateLaw:
          '760 CMR 71.03(3)(b)(7) provides that any requirement prohibiting a Modular Dwelling Unit from being used as a Protected Use ADU that is more restrictive than Building Code is unreasonable.',
        localBylaw:
          'ADUs shall not be located in a travel trailer or mobile home.',
        impact:
          'The town\u2019s definition of \u201cmobile home\u201d was broad enough to include manufactured homes that qualify as Modular Dwelling Units under state regulations. The AG struck the words \u201cor mobile home\u201d from the bylaw \u2014 the travel trailer ban remains.',
        agDecision:
          'AG partial disapproval February 17, 2026 (AAG Nicole B. Caprioli): Disapproved ban on mobile homes as ADUs because town definition encompasses protected Modular Dwelling Units.',
        citations: [
          { label: '760 CMR 71.03(3)(b)(7)', url: SOURCES.cmr71 },
          { label: 'MGL c.40A \u00a73', url: SOURCES.mgl40a_s3 },
          { label: 'My Southborough', url: SOURCES.southborough_ag },
        ],
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// DERIVED EXPORTS
// ---------------------------------------------------------------------------

/** Towns only (AG-reviewed bylaws) */
export const townEntries: TownComplianceProfile[] = towns.filter(
  (t) => (t.municipalityType ?? 'town') === 'town',
);

/** Cities only (independently analyzed ordinances) */
export const cities: TownComplianceProfile[] = towns.filter(
  (t) => t.municipalityType === 'city',
);

/** All communities with provision data (towns + cities) */
export const allEntries: TownComplianceProfile[] = towns;

// ---------------------------------------------------------------------------
// NARRATIVE SPECIAL CASES (no provision data)
// ---------------------------------------------------------------------------

export const narrativeCities: NarrativeCityProfile[] = [
  {
    slug: 'fall-river',
    name: 'Fall River',
    county: 'Bristol',
    population: 94000,
    municipalityType: 'city',
    lastReviewed: '2026-02-15',
    permits: { submitted: 25, approved: 13, denied: 0, pending: 0, approvalRate: 52 },
    tag: 'administrative-friction',
    title: 'Fall River: Administrative Friction',
    summary: 'Mayor publicly opposed ADU law (CommonWealth Beacon, Feb 2025). ZBA has attached \u201cno ADU\u201d conditions to unrelated permits.',
    body: 'Fall River illustrates how local administrative practices can create friction for ADU applicants even when state law is clear. The mayor has publicly opposed the legislation (CommonWealth Beacon, February 2025), and the city\u2019s Zoning Board of Appeals has been attaching \u201cno ADU\u201d conditions to variance and special permit approvals (Fall River Reporter, August 2025) \u2014 an unusual practice that attempts to restrict homeowners from exercising their state-law right to build an ADU.\n\nThis approach raises legal questions. Since February 2, 2025, the right to build a first ADU is protected by state law and cannot be conditioned away by local boards. A \u201cno ADU\u201d condition attached to an unrelated permit likely has no legal force under G.L. c. 40A \u00a73.\n\nDespite these challenges, Fall River has processed 25 ADU applications with 13 approved (52% rate). The below-average approval rate may reflect administrative hurdles rather than legitimate permitting concerns.\n\nADU Pulse is monitoring Fall River for further developments. Homeowners who have been denied or discouraged from building an ADU may have legal recourse under G.L. c. 40A \u00a73.',
  },
  {
    slug: 'lowell',
    name: 'Lowell',
    county: 'Middlesex',
    population: 115554,
    municipalityType: 'city',
    lastReviewed: '2026-02-15',
    permits: { submitted: 26, approved: 26, denied: 0, pending: 0, approvalRate: 100 },
    tag: 'no-ordinance',
    title: 'Lowell: No Local Ordinance',
    summary: 'Council defeated ADU ordinance 7-4, but city is 4th in state for ADU permits (26).',
    body: 'Lowell\u2019s City Council defeated a proposed ADU ordinance by a 7-4 vote in October 2023 (Lowell Sun, October 2023) \u2014 before the state ADU law took effect. The council chose not to create local ADU regulations, leaving state law as the sole framework governing ADU construction in the city.\n\nThe result is striking: Lowell is the 4th highest municipality in Massachusetts for ADU permits, with 26 submitted and all 26 approved (100% rate). This makes Lowell a powerful case study demonstrating that state law alone is sufficient to enable ADU construction \u2014 local ordinances are not required.\n\nBy not passing a local ordinance, Lowell inadvertently created one of the most permissive ADU environments in the state. There are no local restrictions layered on top of state law, no additional review hurdles, and no provisions that might conflict with G.L. c. 40A \u00a73.\n\nLowell\u2019s experience suggests that the simplest path to ADU-friendly policy may be no local policy at all.',
  },
  {
    slug: 'medford',
    name: 'Medford',
    county: 'Middlesex',
    population: 59659,
    municipalityType: 'city',
    lastReviewed: '2026-02-15',
    permits: { submitted: 22, approved: 19, denied: 0, pending: 0, approvalRate: 86 },
    tag: 'stalled',
    title: 'Medford: Stalled',
    summary: 'Council withdrew ADU proposal Dec 16, 2025. Old ordinance predates state law.',
    body: 'Medford\u2019s City Council withdrew its ADU ordinance proposal on December 16, 2025 (City of Medford, December 2025), leaving the city without updated ADU regulations. The existing ordinance (Section 94-8.2) predates the state ADU law and has not been reconciled with G.L. c. 40A \u00a73 or 760 CMR 71.00.\n\nThe risk: local permitting staff may still be applying outdated rules from the old ordinance in practice, even though any provisions inconsistent with state law are preempted by state law. Without an updated ordinance, there\u2019s no clear local framework that reflects the current legal landscape.\n\nDespite the regulatory uncertainty, Medford has processed 22 ADU applications with 19 approved (86% rate), suggesting that the building department is largely processing applications under state law regardless of the stalled local ordinance.\n\nADU Pulse is monitoring Medford for any renewed effort to update the ordinance. Homeowners should be aware that state law governs their ADU rights regardless of local ordinance status.',
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

export function getStatewideStats(all: TownComplianceProfile[]) {
  const totalInconsistent = all.reduce(
    (sum, t) => sum + t.provisions.filter((p) => p.status === 'inconsistent').length,
    0,
  );
  const totalAgDisapprovals = all.reduce(
    (sum, t) => sum + t.agDisapprovals,
    0,
  );
  const communitiesWithInconsistencies = all.filter((t) =>
    t.provisions.some((p) => p.status === 'inconsistent'),
  ).length;
  const tEntries = all.filter((t) => (t.municipalityType ?? 'town') === 'town');
  const cEntries = all.filter((t) => t.municipalityType === 'city');

  return {
    totalInconsistent,
    totalAgDisapprovals,
    townsWithInconsistencies: communitiesWithInconsistencies,
    townsTracked: tEntries.length,
    citiesTracked: cEntries.length,
    communitiesTracked: all.length,
  };
}

export function generateBottomLine(town: TownComplianceProfile): string {
  const counts = getStatusCounts(town.provisions);
  const hasAg = town.agDisapprovals > 0;
  const ruleWord = town.municipalityType === 'city' ? 'ordinance' : 'bylaw';

  if (counts.inconsistent === 0 && counts.review === 0) {
    return `${town.name}'s ADU ${ruleWord} appears fully consistent with Chapter 150 and 760 CMR 71.00. No inconsistencies identified.`;
  }

  const parts: string[] = [];

  if (counts.inconsistent > 0) {
    parts.push(
      `${town.name} has ${counts.inconsistent} provision${counts.inconsistent > 1 ? 's' : ''} that appear${counts.inconsistent === 1 ? 's' : ''} inconsistent with G.L. c. 40A §3 and ${counts.inconsistent === 1 ? 'is' : 'are'} subject to statutory override under Chapter 150`,
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
  // Active resistance badge (gray)
  if (town.resistanceTag === 'legislative-challenge') {
    return { label: 'LEGISLATIVE CHALLENGE', color: 'text-gray-300', bg: 'bg-gray-600/30' };
  }
  // AG disapproval badge (red) — only towns get AG review
  if (town.agDisapprovals > 0) {
    return {
      label: `${town.agDisapprovals} AG DISAPPROVAL${town.agDisapprovals > 1 ? 'S' : ''}`,
      color: 'text-red-400',
      bg: 'bg-red-400/10',
    };
  }
  // City with independent analysis (amber)
  if (town.municipalityType === 'city') {
    const counts = getStatusCounts(town.provisions);
    if (counts.inconsistent > 0) {
      return { label: 'ADU PULSE IDENTIFIED', color: 'text-amber-400', bg: 'bg-amber-400/10' };
    }
    return { label: 'CONSISTENT', color: 'text-emerald-400', bg: 'bg-emerald-400/10' };
  }
  // Standard town logic
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
