'use client';

import { useState, useMemo } from 'react';
import { useSubscription } from '@/lib/subscription';
import {
  towns,
  getStatusCounts,
  generateBottomLine,
  categories,
  type TownComplianceProfile,
  type ComplianceStatus,
  type ComplianceProvision,
  type Citation,
} from '../compliance-data';

// ── STATUS CONFIG ───────────────────────────────────────────────────────
const statusConfig: Record<
  ComplianceStatus,
  { label: string; color: string; bg: string; border: string; dot: string }
> = {
  inconsistent: {
    label: 'Inconsistent with State Law',
    color: 'text-red-400',
    bg: 'bg-red-400/10',
    border: 'border-red-400/30',
    dot: 'bg-red-400',
  },
  review: {
    label: 'Needs Review',
    color: 'text-amber-400',
    bg: 'bg-amber-400/10',
    border: 'border-amber-400/30',
    dot: 'bg-amber-400',
  },
  compliant: {
    label: 'Consistent',
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
    border: 'border-emerald-400/30',
    dot: 'bg-emerald-400',
  },
};

// ── CITATION LINKS ──────────────────────────────────────────────────────
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
            className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-400 hover:text-blue-300 bg-blue-400/5 hover:bg-blue-400/10 border border-blue-400/20 hover:border-blue-400/30 px-2 py-1 rounded-md transition-colors"
          >
            <svg
              className="w-3 h-3 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
            {cite.label}
          </a>
        ))}
      </div>
    </div>
  );
}

// ── PROVISION ROW ───────────────────────────────────────────────────────
function ProvisionRow({ provision, isPro }: { provision: ComplianceProvision; isPro: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = statusConfig[provision.status];

  return (
    <div
      className={`border ${cfg.border} rounded-lg overflow-hidden transition-colors`}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-800/50 transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${cfg.dot}`} />
          <span className="text-sm text-white font-medium truncate">
            {provision.provision}
          </span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 ml-3">
          {provision.agDecision && (
            <span className="text-[10px] font-semibold uppercase tracking-wider text-red-400 bg-red-400/10 px-1.5 py-0.5 rounded">
              AG
            </span>
          )}
          <span className={`text-xs font-medium ${cfg.color}`}>
            {cfg.label}
          </span>
          <svg
            className={`w-4 h-4 text-gray-500 transition-transform ${expanded ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>

      {expanded && (!isPro ? (
        <div className="px-4 pb-4 border-t border-gray-700/50">
          <a href="/pricing" className="block mt-3 p-3 rounded-lg border border-amber-500/30 bg-amber-500/5 text-center">
            <span className="text-amber-500 text-sm font-medium">Unlock detailed compliance analysis with Pro</span>
            <span className="block text-gray-500 text-xs mt-0.5">See state law vs. local bylaw comparisons, AG decisions, and impact analysis</span>
          </a>
        </div>
      ) : (
        <div className="px-4 pb-4 border-t border-gray-700/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-1">
                State Law
              </p>
              <p className="text-sm text-gray-300 leading-relaxed">
                {provision.stateLaw}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-1">
                Local Bylaw
              </p>
              <p className="text-sm text-gray-300 leading-relaxed">
                {provision.localBylaw}
              </p>
            </div>
          </div>

          <div className="mt-3">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-1">
              Impact
            </p>
            <p className="text-sm text-gray-400 leading-relaxed">
              {provision.impact}
            </p>
          </div>

          {provision.agDecision && (
            <div className="mt-3 p-3 bg-red-400/5 border border-red-400/20 rounded-lg">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-red-400 mb-1">
                AG Decision
              </p>
              <p className="text-sm text-red-300 leading-relaxed">
                {provision.agDecision}
              </p>
            </div>
          )}

          <CitationLinks citations={provision.citations} />
        </div>
      ))}
    </div>
  );
}

// ── MAIN COMPONENT ──────────────────────────────────────────────────────
export default function TownDetail({ slug }: { slug: string }) {
  const { isPro } = useSubscription();
  const [statusFilter, setStatusFilter] = useState<ComplianceStatus | 'all'>('all');

  const town = useMemo(
    () => towns.find((t) => t.slug === slug) ?? towns[0],
    [slug],
  );
  const counts = useMemo(() => getStatusCounts(town.provisions), [town]);
  const bottomLine = useMemo(() => generateBottomLine(town), [town]);

  const filteredProvisions = useMemo(() => {
    const filtered =
      statusFilter === 'all'
        ? town.provisions
        : town.provisions.filter((p) => p.status === statusFilter);

    const grouped: Record<string, ComplianceProvision[]> = {};
    for (const cat of categories) {
      const items = filtered.filter((p) => p.category === cat);
      if (items.length > 0) grouped[cat] = items;
    }
    return grouped;
  }, [town, statusFilter]);

  return (
    <div className="max-w-4xl mx-auto">
      {/* ── TOWN HEADER ── */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 sm:p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              {town.name} Bylaw Consistency
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              {town.bylawSource} · Last updated {town.bylawLastUpdated}
            </p>
          </div>
          {town.agDisapprovals > 0 && (
            <span className="self-start text-xs font-semibold text-red-400 bg-red-400/10 border border-red-400/20 px-2.5 py-1 rounded-lg">
              {town.agDisapprovals} AG Disapproval{town.agDisapprovals > 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Permit bar */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
              Permit Activity
            </p>
            <p className="text-xs text-gray-400">
              {town.permits.approved} of {town.permits.submitted} approved (
              {town.permits.approvalRate}%)
            </p>
          </div>
          <div className="h-2.5 bg-gray-700 rounded-full overflow-hidden flex">
            <div
              className="bg-emerald-400 rounded-l-full transition-all"
              style={{
                width: `${(town.permits.approved / town.permits.submitted) * 100}%`,
              }}
            />
            {town.permits.denied > 0 && (
              <div
                className="bg-red-400 transition-all"
                style={{
                  width: `${(town.permits.denied / town.permits.submitted) * 100}%`,
                }}
              />
            )}
            {town.permits.pending > 0 && (
              <div
                className="bg-amber-400 transition-all"
                style={{
                  width: `${(town.permits.pending / town.permits.submitted) * 100}%`,
                }}
              />
            )}
          </div>
          <div className="flex gap-4 mt-1.5 text-[11px] text-gray-500">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Approved (
              {town.permits.approved})
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400" /> Denied (
              {town.permits.denied})
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Pending (
              {town.permits.pending})
            </span>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2 mb-5">
          {(
            [
              { key: 'all' as const, label: 'All Provisions', count: town.provisions.length },
              { key: 'inconsistent' as const, label: 'Inconsistent', count: counts.inconsistent },
              { key: 'review' as const, label: 'Needs Review', count: counts.review },
              { key: 'compliant' as const, label: 'Consistent', count: counts.compliant },
            ] as const
          ).map(({ key, label, count }) => {
            const isActive = statusFilter === key;
            const colorMap: Record<string, string> = {
              all: isActive ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : '',
              inconsistent: isActive
                ? 'bg-red-400/20 text-red-400 border-red-400/30'
                : '',
              review: isActive
                ? 'bg-amber-400/20 text-amber-400 border-amber-400/30'
                : '',
              compliant: isActive
                ? 'bg-emerald-400/20 text-emerald-400 border-emerald-400/30'
                : '',
            };
            return (
              <button
                key={key}
                onClick={() => setStatusFilter(key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                  isActive
                    ? colorMap[key]
                    : 'text-gray-400 border-gray-700 hover:text-white hover:border-gray-600'
                }`}
              >
                {label}
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded ${
                    isActive ? 'bg-white/10' : 'bg-gray-700 text-gray-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
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
                  <ProvisionRow key={p.id} provision={p} isPro={isPro} />
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
          <p className="text-sm text-gray-300 leading-relaxed">
            {bottomLine}
          </p>
        </div>
      </div>

      {/* ── METHODOLOGY NOTE ── */}
      <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 text-xs text-gray-500 leading-relaxed">
        <p className="font-semibold text-gray-400 mb-1">Methodology</p>
        <p>
          This analysis compares each town&apos;s published ADU zoning bylaw or
          ordinance against Massachusetts{' '}
          <a
            href="https://malegislature.gov/Laws/SessionLaws/Acts/2024/Chapter150"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 underline underline-offset-2"
          >
            Chapter 150 (2024)
          </a>
          ,{' '}
          <a
            href="https://malegislature.gov/Laws/GeneralLaws/PartI/TitleVII/Chapter40A/Section3"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 underline underline-offset-2"
          >
            MGL c.40A §3
          </a>
          , and{' '}
          <a
            href="https://www.mass.gov/doc/760-cmr-7100-protected-use-adus-final-version/download"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 underline underline-offset-2"
          >
            760 CMR 71.00
          </a>
          . Per{' '}
          <a
            href="https://www.mass.gov/info-details/accessory-dwelling-units"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 underline underline-offset-2"
          >
            EOHLC guidance
          </a>
          , towns are not &ldquo;out of compliance&rdquo; if their local zoning has not
          been updated — however, any local provisions inconsistent with the ADU statute
          are unenforceable as of February 2, 2025. Local permitting decisions should not
          take into account zoning rules that conflict with state law. Attorney General
          disapproval data sourced from published{' '}
          <a
            href="https://massago.onbaseonline.com/Massago/1700PublicAccess/MLU.htm"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 underline underline-offset-2"
          >
            AG Municipal Law Unit decisions
          </a>
          . This is not legal advice — consult a zoning attorney for project-specific
          guidance.
        </p>
      </div>
    </div>
  );
}
