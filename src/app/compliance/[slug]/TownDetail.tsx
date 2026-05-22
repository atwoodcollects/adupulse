'use client';

/* ============================================================================
 * TownDetail (unified) — drop-in replacement for src/app/compliance/[slug]/TownDetail.tsx
 *
 * Hybrid port (Option C): keeps your existing visual language (gray-800,
 * blue/red/amber/emerald, IBM Plex) but adopts the unified-template structure
 * from the prototype:
 *
 *   • Both bylaw consistency AND septic infrastructure on one page
 *   • 3-column gap table inside each expanded provision (State | Local | Gap)
 *   • Double-Barrier callout when both datasets have friction
 *   • AG-Disapproved filter tab on bylaw section
 *   • "Coming Soon" panel for whichever dataset is missing
 *
 * Imports are unchanged from your existing file — plus infrastructure-data.
 * Freemium gate (ComplianceGate / useSubscription) preserved as-is.
 *
 * To deploy:
 *   1. Replace src/app/compliance/[slug]/TownDetail.tsx with this file.
 *   2. Optional: have src/app/infrastructure/[slug]/page.tsx render this
 *      same component (pass defaultSection="infra") so /infrastructure/<slug>
 *      and /compliance/<slug> both show the unified view.
 * ========================================================================== */

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useSubscription } from '@/lib/subscription';
import {
  allEntries,
  getStatusCounts as getComplianceCounts,
  generateBottomLine,
  getEvidenceBasis,
  evidenceBasisConfig,
  categories,
  isTownOpen,
  type TownComplianceProfile,
  type ComplianceStatus,
  type ComplianceProvision,
  type Citation,
} from '../compliance-data';
import {
  infrastructureTowns,
  getStatusCounts as getInfraCounts,
  statusConfig as infraStatusConfig,
  impactConfig,
  type InfrastructureTown,
  type InfrastructureProvision,
  type InfrastructureStatus,
} from '@/app/infrastructure/infrastructure-data';
import ComplianceGate from '@/components/ComplianceGate';
import { formatReviewDate } from '@/lib/dates';

function trackOutboundClick(href: string) {
  if (typeof window !== 'undefined') {
    window.gtag?.('event', 'outbound_source_click', {
      event_category: 'engagement',
      event_label: href,
    });
  }
}

/* ── CITATION LINKS ───────────────────────────────────────────────────── */
function CitationLinks({ citations }: { citations: Citation[] }) {
  if (!citations || citations.length === 0) return null;
  return (
    <div className="mt-3">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
        Sources
      </p>
      <div className="flex flex-wrap gap-1.5">
        {citations.map((cite, i) => (
          <a
            key={i}
            href={cite.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackOutboundClick(cite.url)}
            className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-400 hover:text-blue-300 bg-blue-400/5 hover:bg-blue-400/10 border border-blue-400/20 hover:border-blue-400/30 px-2 py-1 rounded-md transition-colors"
          >
            <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            {cite.label}
          </a>
        ))}
      </div>
    </div>
  );
}

/* ── GAP TABLE (3-column: State | Local | Gap) ────────────────────────── */
function GapTable({
  stateText,
  localText,
  gapText,
  gapTone = 'rose',
  localLabel = 'Local Bylaw',
  citation,
}: {
  stateText: string;
  localText: string;
  gapText: string;
  gapTone?: 'rose' | 'orange' | 'amber' | 'emerald';
  localLabel?: string;
  citation?: string;
}) {
  const gapColor = {
    rose:    'text-red-400 bg-red-400/[0.04]',
    orange:  'text-orange-400 bg-orange-400/[0.04]',
    amber:   'text-amber-400 bg-amber-400/[0.04]',
    emerald: 'text-emerald-400 bg-emerald-400/[0.04]',
  }[gapTone];
  return (
    <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-px bg-gray-700/40 border border-gray-700/40 rounded-lg overflow-hidden">
      {/* State baseline */}
      <div className="p-3 bg-emerald-400/[0.04]">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400 mb-1.5">State Baseline</p>
        <p className="text-xs text-gray-300 leading-relaxed">{stateText}</p>
        {citation && (
          <p className="mt-2 text-[10px] font-mono text-gray-500 tracking-wide">{citation}</p>
        )}
      </div>
      {/* Local rule */}
      <div className="p-3 bg-gray-900/40">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1.5">{localLabel}</p>
        <p className="text-xs text-gray-300 leading-relaxed">{localText}</p>
      </div>
      {/* Gap / impact */}
      <div className={`p-3 ${gapColor}`}>
        <p className="text-[10px] font-semibold uppercase tracking-wider mb-1.5">Gap / Impact</p>
        <p className="text-xs text-gray-300 leading-relaxed">{gapText}</p>
      </div>
    </div>
  );
}

/* ── COMPLIANCE PROVISION ROW ─────────────────────────────────────────── */
function ComplianceProvisionRow({
  provision,
  isPro,
  slug,
  isCity,
}: {
  provision: ComplianceProvision;
  isPro: boolean;
  slug: string;
  isCity?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const cfg = evidenceBasisConfig[getEvidenceBasis(provision)];
  const gapTone =
    provision.status === 'inconsistent' ? 'rose'
      : provision.status === 'review' ? 'amber'
      : 'emerald';

  return (
    <div className={`border ${cfg.border} rounded-lg overflow-hidden transition-colors`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-800/50 transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${cfg.dot}`} />
          <Link
            href={`/compliance/${slug}/${provision.id}`}
            onClick={(e) => e.stopPropagation()}
            className="text-sm text-white font-medium truncate hover:text-blue-400 transition-colors"
          >
            {provision.provision}
          </Link>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 ml-3">
          <span className={`text-xs font-medium ${cfg.color}`}>{cfg.label}</span>
          <svg
            className={`w-4 h-4 text-gray-500 transition-transform ${expanded ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {expanded && (!isPro ? (
        <div className="px-4 pb-4 border-t border-gray-700/50">
          <a href="/pricing" className="block mt-3 p-3 rounded-lg border border-amber-500/30 bg-amber-500/5 text-center">
            <span className="text-amber-500 text-sm font-medium">Unlock detailed consistency analysis with Pro</span>
            <span className="block text-gray-500 text-xs mt-0.5">See state law vs. local bylaw comparisons, AG decisions, and impact analysis</span>
          </a>
        </div>
      ) : (
        <div className="px-4 pb-4 border-t border-gray-700/50">
          {provision.agDecision && (
            <div className="mt-3 p-3 bg-red-400/5 border border-red-400/20 rounded-lg">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-red-400 mb-1">
                AG Decision
              </p>
              <p className="text-sm text-red-300 leading-relaxed">{provision.agDecision}</p>
            </div>
          )}

          {/* NEW: 3-column gap table replaces side-by-side State/Local + separate Impact block */}
          <GapTable
            stateText={provision.stateLaw}
            localText={provision.localBylaw}
            gapText={provision.impact}
            gapTone={gapTone}
            localLabel={isCity ? 'Local Ordinance' : 'Local Bylaw'}
          />

          <CitationLinks citations={provision.citations} />
        </div>
      ))}
    </div>
  );
}

/* ── INFRASTRUCTURE PROVISION ROW ─────────────────────────────────────── */
function InfraProvisionRow({ provision }: { provision: InfrastructureProvision }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = infraStatusConfig[provision.status];
  const impactCfg = impactConfig[provision.impact];
  const gapTone =
    provision.status === 'barrier' ? 'rose'
      : provision.status === 'exceeds_baseline' ? 'orange'
      : provision.status === 'needs_review' ? 'amber'
      : 'emerald';

  return (
    <div className={`border ${cfg.border} rounded-lg overflow-hidden transition-colors`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-800/50 transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${cfg.dot}`} />
          <span className="text-sm text-white font-medium truncate">{provision.title}</span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 ml-3">
          {provision.impact !== 'neutral' && (
            <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${impactCfg.color} ${impactCfg.bg}`}>
              {impactCfg.label.replace(' Impact', '')}
            </span>
          )}
          <span className={`text-xs font-medium ${cfg.color}`}>{cfg.label}</span>
          <svg
            className={`w-4 h-4 text-gray-500 transition-transform ${expanded ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-700/50">
          <GapTable
            stateText={provision.stateBaseline}
            localText={provision.localRule}
            gapText={provision.gap}
            gapTone={gapTone}
            localLabel="Local BoH Rule"
            citation={`${provision.localRegulation} · ${provision.stateCitation}`}
          />

          {provision.details && (
            <div className="mt-3 p-3 bg-gray-900/40 border border-gray-700/40 rounded-lg">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Details</p>
              <p className="text-sm text-gray-300 leading-relaxed">{provision.details}</p>
            </div>
          )}

          {provision.sourcingNote && (
            <div className="mt-3 p-3 bg-amber-400/5 border border-amber-400/20 rounded-lg">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-400 mb-1">
                Sourcing note
              </p>
              <p className="text-sm text-amber-200/90 leading-relaxed">{provision.sourcingNote}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── COMING SOON (missing dataset) ────────────────────────────────────── */
function ComingSoon({
  kind, townName,
}: { kind: 'compliance' | 'infrastructure'; townName: string }) {
  const meta = kind === 'compliance'
    ? {
        emoji: '⚖',
        title: 'Bylaw consistency analysis coming soon',
        body: `We haven't published a provision-by-provision compliance review for ${townName} yet. Chapter 150 governs by default — local provisions inconsistent with it are preempted as of Feb 2, 2025.`,
        link: '/compliance',
        linkLabel: 'See towns we cover',
      }
    : {
        emoji: '💧',
        title: 'Septic infrastructure analysis coming soon',
        body: `We haven't profiled ${townName}'s Board of Health septic regulations against Title 5 yet. Title 5 (310 CMR 15.000) applies as the state baseline until we do.`,
        link: '/infrastructure',
        linkLabel: 'See towns we cover',
      };
  return (
    <div className="border border-dashed border-gray-700 rounded-xl p-5 sm:p-6 bg-gray-900/30 mt-6">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-lg bg-blue-400/10 border border-blue-400/20 grid place-items-center text-lg shrink-0">
          {meta.emoji}
        </div>
        <div className="flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-1">
            {kind === 'compliance' ? 'Bylaw Consistency' : 'Septic Infrastructure'}
          </p>
          <h3 className="text-base font-bold text-white mb-1">{meta.title}</h3>
          <p className="text-sm text-gray-400 leading-relaxed max-w-xl">{meta.body}</p>
          <div className="flex flex-wrap gap-2 mt-3">
            <Link
              href={meta.link}
              className="inline-flex items-center gap-1 text-xs font-medium text-blue-400 hover:text-blue-300 bg-blue-400/5 hover:bg-blue-400/10 border border-blue-400/20 px-3 py-1.5 rounded-md transition-colors"
            >
              {meta.linkLabel} →
            </Link>
            <a
              href={`mailto:nick@adupulse.com?subject=${encodeURIComponent(`Request ${kind === 'compliance' ? 'bylaw' : 'septic'} review: ${townName}`)}`}
              className="inline-flex items-center gap-1 text-xs font-medium text-gray-400 hover:text-white border border-gray-700 hover:border-gray-600 px-3 py-1.5 rounded-md transition-colors"
            >
              Request review
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── DOUBLE-BARRIER CALLOUT ──────────────────────────────────────────── */
function DoubleBarrierCallout({
  town, infra,
}: { town: TownComplianceProfile; infra: InfrastructureTown }) {
  const cCounts = getComplianceCounts(town.provisions);
  const iCounts = getInfraCounts(infra.provisions);
  const hasComplianceTrouble = town.agDisapprovals > 0 || cCounts.inconsistent > 0;
  const hasInfraTrouble = iCounts.barrier > 0 || iCounts.exceeds >= 3;
  if (!(hasComplianceTrouble && hasInfraTrouble)) return null;

  return (
    <div className="mt-4 p-4 rounded-lg border border-red-400/30 bg-gradient-to-br from-red-400/[0.08] to-transparent">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-red-400/15 border border-red-400/30 grid place-items-center shrink-0">
          <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h4l2-6 4 12 2-6h6" />
          </svg>
        </div>
        <div className="flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-red-400 mb-1">Double Barrier</p>
          <p className="text-sm text-gray-300 leading-relaxed">
            <span className="font-semibold text-white">{town.name}</span> has friction in <strong>both</strong> its ADU bylaw and its septic regulations.
            Zoning may permit an ADU on paper, but{' '}
            {iCounts.barrier > 0
              ? 'BoH variance pathways are unavailable for new construction'
              : `${iCounts.exceeds} local supplements above Title 5 may make many lots infeasible`}.
            Read both sections before quoting a project.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── INFRA SECTION ────────────────────────────────────────────────────── */
function InfraSection({ infra }: { infra: InfrastructureTown }) {
  const [filter, setFilter] = useState<InfrastructureStatus | 'all'>('all');
  const counts = useMemo(() => getInfraCounts(infra.provisions), [infra]);
  const filtered = useMemo(
    () => infra.provisions.filter((p) => filter === 'all' || p.status === filter),
    [infra.provisions, filter],
  );

  return (
    <section id="septic" className="bg-gray-800 border border-gray-700 rounded-xl p-4 sm:p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-base">💧</span>
        <h2 className="text-xl sm:text-2xl font-bold text-white">
          {infra.name} Septic Infrastructure
        </h2>
      </div>
      <p className="text-sm text-gray-400 mb-1">
        {infra.regulatoryLayer}
      </p>
      <p className="text-sm text-gray-500 mb-5">
        Last reviewed: {formatReviewDate(infra.lastReviewed)}
      </p>

      {/* Bottom-line */}
      {infra.bottomLine && (
        <div className="mb-5 border-l-4 border-blue-500/50 bg-blue-900/10 rounded-r-lg p-4">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-base">📋</span>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-blue-400">
              What This Means
            </p>
          </div>
          <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">{infra.bottomLine}</p>
        </div>
      )}

      {/* Counts strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
        <CountTile n={counts.barrier} label="Barriers" tone="rose" />
        <CountTile n={counts.exceeds} label="Exceeds Title 5" tone="orange" />
        <CountTile n={counts.review}  label="Needs Review"   tone="amber" />
        <CountTile n={counts.consistent} label="Consistent"  tone="emerald" />
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {([
          { key: 'all',              label: 'All',           count: infra.provisions.length, tone: 'blue' as const },
          { key: 'barrier',          label: 'Barriers',      count: counts.barrier,    tone: 'rose' as const },
          { key: 'exceeds_baseline', label: 'Exceeds',       count: counts.exceeds,    tone: 'orange' as const },
          { key: 'needs_review',     label: 'Watch',         count: counts.review,     tone: 'amber' as const },
          { key: 'consistent',       label: 'Consistent',    count: counts.consistent, tone: 'emerald' as const },
        ] as const).map(({ key, label, count, tone }) => (
          <FilterTab
            key={key}
            isActive={filter === key}
            tone={tone}
            label={label}
            count={count}
            onClick={() => setFilter(key as InfrastructureStatus | 'all')}
          />
        ))}
      </div>

      {/* Provisions */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <p className="text-center text-gray-500 py-8 text-sm">
            No regulations match the current filter.
          </p>
        ) : (
          filtered.map((p) => <InfraProvisionRow key={p.id} provision={p} />)
        )}
      </div>

      {/* Sources block */}
      {infra.sources && infra.sources.length > 0 && (
        <div className="mt-5 px-4 py-3 bg-gray-900/30 border border-gray-700/30 rounded-lg">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-600 mb-2">
            BoH / Title 5 Sources
          </p>
          <div className="flex flex-wrap gap-1.5">
            {infra.sources.map((s, i) => (
              <a
                key={i}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackOutboundClick(s.url)}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-400 hover:text-blue-300 bg-blue-400/5 hover:bg-blue-400/10 border border-blue-400/20 px-2 py-1 rounded-md transition-colors"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

/* ── FILTER TAB (shared) ──────────────────────────────────────────────── */
function FilterTab({
  isActive, tone, label, count, onClick,
}: {
  isActive: boolean;
  tone: 'blue' | 'rose' | 'amber' | 'emerald' | 'orange';
  label: string;
  count: number;
  onClick: () => void;
}) {
  const toneClasses: Record<string, string> = {
    blue:    'bg-blue-500/20 text-blue-400 border-blue-500/30',
    rose:    'bg-red-400/20 text-red-400 border-red-400/30',
    amber:   'bg-amber-400/20 text-amber-400 border-amber-400/30',
    emerald: 'bg-emerald-400/20 text-emerald-400 border-emerald-400/30',
    orange:  'bg-orange-400/20 text-orange-400 border-orange-400/30',
  };
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
        isActive
          ? toneClasses[tone]
          : 'text-gray-400 border-gray-700 hover:text-white hover:border-gray-600'
      }`}
    >
      {label}
      <span className={`text-[10px] px-1.5 py-0.5 rounded ${isActive ? 'bg-white/10' : 'bg-gray-700 text-gray-500'}`}>
        {count}
      </span>
    </button>
  );
}

/* ── COUNT TILE ────────────────────────────────────────────────────────  */
function CountTile({
  n, label, tone,
}: {
  n: number;
  label: string;
  tone: 'rose' | 'amber' | 'emerald' | 'orange' | 'blue';
}) {
  const colorMap: Record<string, string> = {
    rose:    'text-red-400 border-red-400/20 bg-red-400/[0.04]',
    amber:   'text-amber-400 border-amber-400/20 bg-amber-400/[0.04]',
    emerald: 'text-emerald-400 border-emerald-400/20 bg-emerald-400/[0.04]',
    orange:  'text-orange-400 border-orange-400/20 bg-orange-400/[0.04]',
    blue:    'text-blue-400 border-blue-400/20 bg-blue-400/[0.04]',
  };
  return (
    <div className={`px-3 py-2.5 rounded-lg border ${n > 0 ? colorMap[tone] : 'text-gray-500 border-gray-700 bg-gray-900/30'}`}>
      <div className="text-2xl font-bold leading-none">{n}</div>
      <div className="text-[10px] font-semibold uppercase tracking-wider mt-1.5">{label}</div>
    </div>
  );
}

/* ====================================================================== */
/*                          MAIN COMPONENT                                  */
/* ====================================================================== */

export default function TownDetail({
  slug,
  defaultSection = 'policy',
}: {
  slug: string;
  defaultSection?: 'policy' | 'septic';
}) {
  const { isPro } = useSubscription();
  const [statusFilter, setStatusFilter] = useState<ComplianceStatus | 'all' | 'ag'>('all');

  const town = useMemo(() => allEntries.find((t) => t.slug === slug), [slug]);
  const infra = useMemo(() => infrastructureTowns.find((t) => t.slug === slug), [slug]);

  // If we have neither, fall back to the first compliance entry (preserves old behavior)
  const effectiveTown = town ?? allEntries[0];
  const isCity = effectiveTown.municipalityType === 'city';
  const ruleWord = isCity ? 'Ordinance' : 'Bylaw';
  const counts = useMemo(() => getComplianceCounts(effectiveTown.provisions), [effectiveTown]);
  const bottomLine = useMemo(() => generateBottomLine(effectiveTown), [effectiveTown]);

  const filteredProvisions = useMemo(() => {
    let pool = effectiveTown.provisions;
    if (statusFilter === 'ag') {
      pool = pool.filter((p) => !!p.agDecision);
    } else if (statusFilter !== 'all') {
      pool = pool.filter((p) => p.status === statusFilter);
    }
    const grouped: Record<string, ComplianceProvision[]> = {};
    for (const cat of categories) {
      const items = pool.filter((p) => p.category === cat);
      if (items.length > 0) grouped[cat] = items;
    }
    return grouped;
  }, [effectiveTown, statusFilter]);

  /* Order sections based on defaultSection prop (so /infrastructure/<slug> can
     render the septic section first). */
  const sectionOrder: ('policy' | 'septic')[] =
    defaultSection === 'septic' ? ['septic', 'policy'] : ['policy', 'septic'];

  /* ── COMPLIANCE SECTION ── */
  const complianceSection = town ? (
    <section id="policy" className="bg-gray-800 border border-gray-700 rounded-xl p-4 sm:p-6 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-base">⚖</span>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              {town.name} {ruleWord} Consistency
            </h2>
          </div>
          <p className="text-sm text-gray-400 mt-1">
            {town.bylawSource} · Last updated {town.bylawLastUpdated}
          </p>
          <p className="text-sm text-gray-500 mt-0.5">
            Last reviewed: {formatReviewDate(town.lastReviewed)}
          </p>
        </div>
        {town.agDisapprovals > 0 && (
          <span className="self-start text-xs font-semibold text-red-400 bg-red-400/10 border border-red-400/20 px-2.5 py-1 rounded-lg">
            {town.agDisapprovals} AG Disapproval{town.agDisapprovals > 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Disclaimers */}
      {isCity && !town.isExempt && (
        <div className="mb-5 border-l-4 border-amber-500/50 bg-amber-900/10 rounded-r-lg p-4">
          <p className="text-sm text-amber-200/90 leading-relaxed">
            <strong>Important:</strong> Unlike town bylaws, city ordinances are not reviewed by the Massachusetts Attorney General.
            These potential inconsistencies were identified through ADU Pulse&apos;s independent analysis of {town.name}&apos;s ADU ordinance against G.L. c. 40A &sect;3 and 760 CMR 71.00.
          </p>
        </div>
      )}
      {town.isExempt && (
        <div className="mb-5 border-l-4 border-blue-500/50 bg-blue-900/10 rounded-r-lg p-4">
          <p className="text-sm text-blue-200/90 leading-relaxed">
            <strong>Note:</strong> Boston is the only municipality in Massachusetts exempt from G.L. c. 40A.
            The statewide ADU by-right law does not apply here.
          </p>
        </div>
      )}

      {/* What This Means */}
      {town.bottomLine && (
        <div className="mb-5 border-l-4 border-blue-500/50 bg-blue-900/10 rounded-r-lg p-4">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-base">📋</span>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-blue-400">
              What This Means
            </p>
          </div>
          <p className="text-sm text-gray-300 leading-relaxed">{town.bottomLine}</p>
        </div>
      )}

      {/* Permit bar */}
      {town.permits.submitted > 0 && (
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">Permit Activity</p>
            <p className="text-xs text-gray-400">
              {town.permits.approved} of {town.permits.submitted} approved ({town.permits.approvalRate}%)
            </p>
          </div>
          <div className="h-2.5 bg-gray-700 rounded-full overflow-hidden flex">
            <div className="bg-emerald-400 rounded-l-full transition-all"
              style={{ width: `${(town.permits.approved / town.permits.submitted) * 100}%` }} />
            {town.permits.denied > 0 && (
              <div className="bg-red-400 transition-all"
                style={{ width: `${(town.permits.denied / town.permits.submitted) * 100}%` }} />
            )}
            {town.permits.pending > 0 && (
              <div className="bg-amber-400 transition-all"
                style={{ width: `${(town.permits.pending / town.permits.submitted) * 100}%` }} />
            )}
          </div>
          <div className="flex gap-4 mt-1.5 text-[11px] text-gray-500">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Approved ({town.permits.approved})
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400" /> Denied ({town.permits.denied})
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Pending ({town.permits.pending})
            </span>
          </div>
        </div>
      )}

      {/* Counts strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
        <CountTile n={counts.inconsistent} label="Inconsistent"  tone="rose" />
        <CountTile n={counts.review}        label="Needs Review"  tone="amber" />
        <CountTile n={counts.compliant}     label="Consistent"    tone="emerald" />
        <CountTile n={town.agDisapprovals}  label="AG Disapproved" tone="rose" />
      </div>

      {/* Provenance */}
      <div className="mt-4 mb-5 px-4 py-3 bg-gray-900/30 border border-gray-700/30 rounded-lg">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-600 mb-2">Data Provenance</p>
        <div className="space-y-1 text-xs text-gray-500">
          <p>
            <span className="text-gray-400">Reviewed:</span> {formatReviewDate(town.lastReviewed)}
          </p>
          <p>
            <span className="text-gray-400">AG action:</span>{' '}
            {town.agDecisionDate ? (
              <>
                {formatReviewDate(town.agDecisionDate)}
                {town.agDecisionUrl && (
                  <>
                    {' '}
                    <a href={town.agDecisionUrl} target="_blank" rel="noopener noreferrer"
                      onClick={() => trackOutboundClick(town.agDecisionUrl!)}
                      className="text-blue-400/70 hover:text-blue-300 underline underline-offset-2"
                    >source</a>
                  </>
                )}
              </>
            ) : 'None'}
          </p>
          <p>
            <span className="text-gray-400">{ruleWord} source:</span>{' '}
            {town.bylawSourceUrl ? (
              <a href={town.bylawSourceUrl} target="_blank" rel="noopener noreferrer"
                onClick={() => trackOutboundClick(town.bylawSourceUrl!)}
                className="text-blue-400/70 hover:text-blue-300 underline underline-offset-2"
              >{town.bylawSourceTitle || ruleWord}</a>
            ) : (town.bylawSourceTitle || town.bylawSource)}
            {town.bylawRetrievedAt && (
              <span className="text-gray-600"> · retrieved {formatReviewDate(town.bylawRetrievedAt)}</span>
            )}
          </p>
        </div>
      </div>

      {/* Gate vs open */}
      {!isTownOpen(town) ? (
        <>
          <p className="text-sm text-gray-400">
            {town.provisions.length} provisions analyzed against Chapter 150
          </p>
          <div className="mt-4">
            <ComplianceGate
              townName={town.name}
              townSlug={town.slug}
              provisionCount={town.provisions.length}
            />
          </div>
        </>
      ) : (
        <>
          {/* Filter tabs */}
          <div className="flex flex-wrap gap-2 mb-5">
            {([
              { key: 'all' as const,          label: 'All Provisions', count: town.provisions.length,  tone: 'blue' as const },
              { key: 'inconsistent' as const, label: 'Inconsistent',   count: counts.inconsistent,     tone: 'rose' as const },
              { key: 'review' as const,       label: 'Needs Review',   count: counts.review,           tone: 'amber' as const },
              { key: 'compliant' as const,    label: 'Consistent',     count: counts.compliant,        tone: 'emerald' as const },
              ...(town.agDisapprovals > 0 ? [{ key: 'ag' as const, label: 'AG Disapproved', count: town.agDisapprovals, tone: 'rose' as const }] : []),
            ] as const).map(({ key, label, count, tone }) => (
              <FilterTab
                key={key}
                isActive={statusFilter === key}
                tone={tone}
                label={label}
                count={count}
                onClick={() => setStatusFilter(key)}
              />
            ))}
          </div>

          {/* Provisions grouped by category */}
          <div className="space-y-5">
            {Object.entries(filteredProvisions).map(([category, provisions]) => (
              <div key={category}>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-2">
                  {category}
                </p>
                <div className="space-y-2">
                  {provisions.map((p) => (
                    <ComplianceProvisionRow key={p.id} provision={p} isPro={isPro} slug={slug} isCity={isCity} />
                  ))}
                </div>
              </div>
            ))}
            {Object.keys(filteredProvisions).length === 0 && (
              <p className="text-center text-gray-500 py-8 text-sm">
                No provisions match the current filter.
              </p>
            )}
          </div>

          {/* Bottom line */}
          <div className="mt-6 p-4 bg-gray-900/50 border border-gray-700/50 rounded-lg">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-1">
              Bottom Line
            </p>
            <p className="text-sm text-gray-300 leading-relaxed">{bottomLine}</p>
          </div>
        </>
      )}
    </section>
  ) : null;

  /* ── SEPTIC SECTION ── */
  const septicSection = infra ? <InfraSection infra={infra} /> : null;

  /* ── PAGE BODY ── */
  return (
    <div className="max-w-4xl mx-auto">
      {/* Double-Barrier callout (only when both datasets present + both have friction) */}
      {town && infra && <DoubleBarrierCallout town={town} infra={infra} />}

      {sectionOrder.map((section, idx) => (
        <div key={section}>
          {section === 'policy' && (complianceSection ?? (infra && idx === 0 && (
            <ComingSoon kind="compliance" townName={infra.name} />
          )))}
          {section === 'septic' && (septicSection ?? (town && (
            <ComingSoon kind="infrastructure" townName={town.name} />
          )))}
        </div>
      ))}

      {/* Methodology + Subscribe — preserved from your existing TownDetail */}
      {town && isTownOpen(town) && (
        <>
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 text-xs text-gray-500 leading-relaxed">
            <p className="font-semibold text-gray-400 mb-1">Methodology</p>
            <p>
              This analysis compares each town&apos;s published ADU zoning bylaw or ordinance against
              Massachusetts{' '}
              <a href="https://malegislature.gov/Laws/SessionLaws/Acts/2024/Chapter150" target="_blank" rel="noopener noreferrer"
                onClick={() => trackOutboundClick('https://malegislature.gov/Laws/SessionLaws/Acts/2024/Chapter150')}
                className="text-blue-400 hover:text-blue-300 underline underline-offset-2">Chapter 150 (2024)</a>,{' '}
              <a href="https://malegislature.gov/Laws/GeneralLaws/PartI/TitleVII/Chapter40A/Section3" target="_blank" rel="noopener noreferrer"
                onClick={() => trackOutboundClick('https://malegislature.gov/Laws/GeneralLaws/PartI/TitleVII/Chapter40A/Section3')}
                className="text-blue-400 hover:text-blue-300 underline underline-offset-2">MGL c.40A §3</a>, and{' '}
              <a href="https://www.mass.gov/doc/760-cmr-7100-protected-use-adus-final-version/download" target="_blank" rel="noopener noreferrer"
                onClick={() => trackOutboundClick('https://www.mass.gov/doc/760-cmr-7100-protected-use-adus-final-version/download')}
                className="text-blue-400 hover:text-blue-300 underline underline-offset-2">760 CMR 71.00</a>.
              Septic regulations compared against Title 5 (310 CMR 15.000) baseline.
              This is not legal advice — consult a zoning attorney for project-specific guidance.
            </p>
          </div>

          <div className="mt-6 bg-gray-800 border border-gray-700 rounded-xl p-4 sm:p-6">
            <h3 className="text-white font-bold mb-1">Stay Updated on {town.name} ADU Rules</h3>
            <p className="text-gray-400 text-sm mb-4">
              Get notified when this town updates its bylaw, the AG issues a decision, BoH revises septic rules, or enforcement practices change.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const email = (form.elements.namedItem('email') as HTMLInputElement).value;
                window.location.href = `mailto:nick@adupulse.com?subject=${encodeURIComponent(`Alert signup: ${town.name}`)}&body=${encodeURIComponent(`Please add me to ${town.name} update alerts.\n\nEmail: ${email}`)}`;
              }}
              className="flex gap-2 flex-col sm:flex-row"
            >
              <input
                type="email" name="email" required placeholder="you@email.com"
                className="flex-1 px-4 py-2.5 bg-gray-900 border border-gray-600 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
              <button type="submit"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium shrink-0">
                Subscribe
              </button>
            </form>
            <p className="text-gray-600 text-xs mt-2">Free alerts. No spam. Unsubscribe anytime.</p>
          </div>
        </>
      )}
    </div>
  );
}
