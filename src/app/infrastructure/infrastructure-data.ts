// infrastructure-data.ts
// Board of Health Septic Regulation Analysis — local rules measured against Title 5 baseline (310 CMR 15.000)
// Local Boards of Health are authorized under M.G.L. c. 111, § 31 to adopt regulations stricter than Title 5.
// Exceeding the state baseline is not a legal deficiency — it is an exercise of granted local authority.

export type InfrastructureStatus =
  | 'exceeds_baseline'  // Local rule stricter than Title 5
  | 'barrier'           // Structural block (e.g., no variance relief for ADUs)
  | 'needs_review'      // Ambiguous or unconfirmed
  | 'consistent';       // Matches or is less strict than Title 5

export type ImpactLevel = 'critical' | 'high' | 'moderate' | 'neutral';

export const statusConfig: Record<
  InfrastructureStatus,
  { label: string; color: string; bg: string; border: string; dot: string }
> = {
  exceeds_baseline: {
    label: 'Exceeds Baseline',
    color: 'text-orange-400',
    bg: 'bg-orange-400/10',
    border: 'border-orange-400/30',
    dot: 'bg-orange-400',
  },
  barrier: {
    label: 'Barrier',
    color: 'text-red-400',
    bg: 'bg-red-400/10',
    border: 'border-red-400/30',
    dot: 'bg-red-400',
  },
  needs_review: {
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

export const impactConfig: Record<
  ImpactLevel,
  { label: string; color: string; bg: string }
> = {
  critical: { label: 'Critical Impact', color: 'text-red-400', bg: 'bg-red-400/10' },
  high: { label: 'High Impact', color: 'text-orange-400', bg: 'bg-orange-400/10' },
  moderate: { label: 'Moderate Impact', color: 'text-amber-400', bg: 'bg-amber-400/10' },
  neutral: { label: 'Neutral', color: 'text-gray-400', bg: 'bg-gray-700/30' },
};

export interface InfrastructureProvision {
  id: string;
  title: string;
  status: InfrastructureStatus;
  impact: ImpactLevel;
  localRule: string;
  stateBaseline: string;
  gap: string;
  localRegulation: string;
  stateCitation: string;
  details: string;
  sourcingNote?: string;
}

export interface InfrastructureTown {
  slug: string;
  name: string;
  county: string;
  regulatoryLayer: string;
  stateBaseline: string;
  localAuthority: string;
  lastReviewed: string;
  bottomLine: string;
  provisions: InfrastructureProvision[];
  sources: {
    label: string;
    url: string;
  }[];
}

export function getStatusCounts(provisions: InfrastructureProvision[]) {
  return {
    exceeds: provisions.filter(p => p.status === 'exceeds_baseline').length,
    barrier: provisions.filter(p => p.status === 'barrier').length,
    review: provisions.filter(p => p.status === 'needs_review').length,
    consistent: provisions.filter(p => p.status === 'consistent').length,
  };
}

export function getTownStatusLabel(town: InfrastructureTown) {
  const counts = getStatusCounts(town.provisions);
  if (counts.barrier > 0) return statusConfig.barrier;
  if (counts.exceeds > 0) return statusConfig.exceeds_baseline;
  if (counts.review > 0) return statusConfig.needs_review;
  return statusConfig.consistent;
}

export const infrastructureTowns: InfrastructureTown[] = [
  {
    slug: 'duxbury',
    name: 'Duxbury',
    county: 'Plymouth County',
    regulatoryLayer: 'Board of Health Supplementary Rules & Regulations to Title 5',
    stateBaseline: '310 CMR 15.000 (Title 5 of the State Environmental Code)',
    localAuthority: 'M.G.L. c. 111, § 31',
    lastReviewed: '2026-03-03',
    bottomLine: "Massachusetts law (M.G.L. c. 111, § 31) authorizes local Boards of Health to adopt septic regulations stricter than the state Title 5 baseline. Duxbury has exercised that authority \u2014 its supplementary rules exceed Title 5 minimums in at least four areas relevant to ADU construction: groundwater separation, wetland setbacks, private well setbacks, and irrigation well setbacks. These stricter standards are legally authorized and reflect local environmental and public health priorities. However, because ADUs are treated as new construction, variance relief is not available \u2014 unlike virtually every other septic project that comes before the Board. A homeowner may have the right to build an ADU under state zoning law, but their lot may not support a septic system under the town\u2019s Board of Health rules.",
    provisions: [
      {
        id: 'DUX-T5-01',
        title: 'Groundwater Separation',
        status: 'exceeds_baseline',
        impact: 'high',
        localRule: '6 ft above max high groundwater in fast-perc soils (\u22642 min/inch)',
        stateBaseline: '5 ft above high groundwater in fast-perc soils; 4 ft in slower soils',
        gap: '+1 foot above state minimum',
        localRegulation: 'Section 1.11.1B',
        stateCitation: '310 CMR 15.212(1)(b)',
        details: "Duxbury requires an additional foot of vertical separation between the soil absorption system and high groundwater in fast-percolating soils. BoH meeting minutes show variance requests for this provision are routine \u2014 December 2024 alone included multiple properties requesting 6\u21925 ft relief. However, ADUs as new construction cannot receive variance relief per town counsel guidance (March 2025 BoH meeting).",
      },
      {
        id: 'DUX-T5-02',
        title: 'Wetland Setback',
        status: 'exceeds_baseline',
        impact: 'critical',
        localRule: '150 ft from bordering vegetated wetlands',
        stateBaseline: '50 ft from bordering vegetated wetlands',
        gap: '3\u00d7 the state minimum (+100 ft)',
        localRegulation: 'Section 1.101A',
        stateCitation: '310 CMR 15.211',
        details: "Duxbury\u2019s 150-foot wetland buffer consumes a significant portion of buildable area on many lots. December 2025 BoH meeting minutes record a variance granted reducing the wetland setback from 150 ft to 54 ft \u2014 nearly back to the state floor \u2014 because there was no feasible alternative location. This type of relief is not available for ADU projects.",
      },
      {
        id: 'DUX-T5-03',
        title: 'Private Well Setback',
        status: 'exceeds_baseline',
        impact: 'high',
        localRule: '150 ft from private drinking water wells',
        stateBaseline: '100 ft (reducible to 50 ft with water quality testing)',
        gap: '+50 ft above state minimum',
        localRegulation: 'Section 2.0',
        stateCitation: '310 CMR 15.211',
        details: "Duxbury has a significant number of homes on private wells. The 150-ft well setback radius, combined with the 150-ft wetland buffer, can leave zero viable area for a new septic system on smaller lots. Title 5 allows further reduction to 50 ft with water quality testing; Duxbury\u2019s regulations do not provide the same flexibility.",
      },
      {
        id: 'DUX-T5-04',
        title: 'Irrigation Well Setback',
        status: 'exceeds_baseline',
        impact: 'moderate',
        localRule: '100 ft from irrigation wells',
        stateBaseline: '25 ft from irrigation wells',
        gap: '4\u00d7 the state minimum (+75 ft)',
        localRegulation: 'Section 2.06.3G',
        stateCitation: '310 CMR 15.211',
        details: "Where irrigation wells exist on a property, the 100-ft radius reduces the area available for a new septic leaching field. August 2025 BoH meeting minutes include discussion in which a board member acknowledged the 100-ft requirement may have been set without strong technical justification.",
      },
      {
        id: 'DUX-T5-05',
        title: 'No Variance Relief for ADUs',
        status: 'barrier',
        impact: 'critical',
        localRule: 'ADUs = new construction; must meet all local standards without variances',
        stateBaseline: 'No specific ADU septic provision in Title 5',
        gap: 'Variance pathway unavailable for ADU projects',
        localRegulation: 'Town Counsel Guidance (March 2025)',
        stateCitation: '310 CMR 15.000',
        details: "Town counsel confirmed that Duxbury\u2019s supplementary rules apply to ADUs and that because ADUs are new construction, they must meet all local standards without variances. Existing homeowners routinely receive variance approvals for setback and groundwater provisions. ADU projects cannot access the same relief pathway.",
        sourcingNote: "This guidance comes from town counsel\u2019s statements during the March 20, 2025 BoH meeting as recorded in meeting minutes, not from a codified regulation. The Board of Health could potentially evaluate ADU variance requests on a case-by-case basis.",
      },
      {
        id: 'DUX-T5-06',
        title: 'Bedroom Definition',
        status: 'consistent',
        impact: 'neutral',
        localRule: 'Any room providing privacy with at least one window = bedroom for flow calculation',
        stateBaseline: 'Room providing privacy, intended primarily for sleeping',
        gap: 'None identified',
        localRegulation: 'Septic System Requirements',
        stateCitation: '310 CMR 15.002',
        details: "Duxbury\u2019s bedroom definition appears consistent with the Title 5 definition. A 1-bedroom ADU = 110 gpd design flow. If an ADU contains a room qualifying as a second bedroom, design flow increases accordingly.",
      },
    ],
    sources: [
      { label: 'Duxbury BoH \u2014 Septic System Requirements', url: 'https://www.town.duxbury.ma.us/board-health/pages/septic-system-requirements' },
      { label: 'Duxbury BoH \u2014 Private Wells', url: 'https://www.town.duxbury.ma.us/board-health/pages/private-wells' },
      { label: 'Duxbury BoH \u2014 Local & State Regulations', url: 'https://www.town.duxbury.ma.us/board-health/pages/local-state-regulations' },
      { label: 'Duxbury BoH \u2014 Title 5 vs. Duxbury Rules FAQ', url: 'https://www.town.duxbury.ma.us/board-health/faq/what-difference-between-title-5-and-duxbury-rules-regulations' },
      { label: 'BoH Meeting Minutes, March 20, 2025', url: 'https://duxbury.substack.com/p/duxbury-board-of-health-march-20' },
      { label: 'BoH Meeting Minutes, August 14, 2025', url: 'https://duxbury.substack.com/p/duxbury-board-of-health-august-14' },
      { label: 'BoH Meeting Minutes, December 4, 2024', url: 'https://duxbury.substack.com/p/duxbury-board-of-health-december' },
      { label: 'BoH Meeting Minutes, December 18, 2025', url: 'https://duxbury.substack.com/p/duxbury-board-of-health-december-d8c' },
      { label: '310 CMR 15.211 \u2014 Minimum Setback Distances', url: 'https://www.law.cornell.edu/regulations/massachusetts/310-CMR-15-211' },
      { label: '310 CMR 15.212 \u2014 Depth to Groundwater', url: 'https://www.law.cornell.edu/regulations/massachusetts/310-CMR-15-212' },
    ],
  },
];
