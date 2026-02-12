'use client';

import { useState, useMemo } from 'react';
import {
  towns,
  getStatusCounts,
  getStatewideStats,
  generateBottomLine,
  categories,
  type TownComplianceProfile,
  type ComplianceStatus,
  type ComplianceProvision,
} from './compliance-data';

// ── STATUS CONFIG ───────────────────────────────────────────────────────
const statusConfig: Record<
  ComplianceStatus,
  { label: string; color: string; bg: string; border: string; dot: string }
> = {
  conflict: {
    label: 'Conflicts with State Law',
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
    label: 'Compliant',
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
    border: 'border-emerald-400/30',
    dot: 'bg-emerald-400',
  },
};

// ── TOWN STATUS LABEL ───────────────────────────────────────────────────
function getTownStatusLabel(town: TownComplianceProfile): {
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
  if (counts.conflicts > 0) {
    return { label: 'NOT UPDATED', color: 'text-amber-400', bg: 'bg-amber-400/10' };
  }
  return { label: 'UPDATED', color: 'text-emerald-400', bg: 'bg-emerald-400/10' };
}

// ── PROVISION ROW ───────────────────────────────────────────────────────
function ProvisionRow({ provision }: { provision: ComplianceProvision }) {
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {expanded && (
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
        </div>
      )}
    </div>
  );
}

// ── MAIN COMPONENT ──────────────────────────────────────────────────────
export default function ComplianceTracker() {
  const [selectedTown, setSelectedTown] = useState<string>(towns[0].slug);
  const [statusFilter, setStatusFilter] = useState<ComplianceStatus | 'all'>('all');

  const town = useMemo(
    () => towns.find((t) => t.slug === selectedTown) ?? towns[0],
    [selectedTown],
  );

  const counts = useMemo(() => getStatusCounts(town.provisions), [town]);
  const statewide = useMemo(() => getStatewideStats(towns), []);
  const bottomLine = useMemo(() => generateBottomLine(town), [town]);

  const filteredProvisions = useMemo(() => {
    const filtered =
      statusFilter === 'all'
        ? town.provisions
        : town.provisions.filter((p) => p.status === statusFilter);

    // Group by category
    const grouped: Record<string, ComplianceProvision[]> = {};
    for (const cat of categories) {
      const items = filtered.filter((p) => p.category === cat);
      if (items.length > 0) grouped[cat] = items;
    }
    return grouped;
  }, [town, statusFilter]);

  return (
    <div className="max-w-4xl mx-auto">
      {/* ── STATEWIDE SNAPSHOT ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { value: statewide.totalConflicts, label: 'Total Conflicts', color: 'text-red-400' },
          { value: statewide.totalAgDisapprovals, label: 'AG Disapprovals', color: 'text-red-400' },
          { value: statewide.townsNotUpdated, label: 'Towns w/ Conflicts', color: 'text-amber-400' },
          { value: statewide.townsTracked, label: 'Towns Tracked', color: 'text-emerald-400' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-gray-800 border border-gray-700 rounded-xl p-3 sm:p-4 text-center"
          >
            <p className={`text-2xl sm:text-3xl font-bold ${stat.color}`}>
              {stat.value}
            </p>
            <p className="text-xs text-gray-400 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* ── TOWN SELECTOR ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
        {towns.map((t) => {
          const label = getTownStatusLabel(t);
          const tc = getStatusCounts(t.provisions);
          const isSelected = t.slug === selectedTown;

          return (
            <button
              key={t.slug}
              onClick={() => {
                setSelectedTown(t.slug);
                setStatusFilter('all');
              }}
              className={`text-left p-3 sm:p-4 rounded-xl border transition-all ${
                isSelected
                  ? 'bg-gray-800 border-blue-500 ring-1 ring-blue-500/30'
                  : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
              }`}
            >
              <p className="text-white font-semibold text-sm">{t.name}</p>
              <p className="text-gray-500 text-xs mt-0.5">{t.county} County</p>
              <div className="flex items-center gap-2 mt-2">
                <span className={`text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded ${label.color} ${label.bg}`}>
                  {label.label}
                </span>
              </div>
              <div className="flex gap-3 mt-2 text-xs text-gray-500">
                <span>
                  <span className="text-red-400 font-medium">{tc.conflicts}</span> conflict{tc.conflicts !== 1 ? 's' : ''}
                </span>
                <span>
                  <span className="text-amber-400 font-medium">{tc.review}</span> review
                </span>
                <span>
                  <span className="text-emerald-400 font-medium">{tc.compliant}</span> ok
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* ── TOWN DETAIL ── */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 sm:p-6 mb-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              {town.name} Bylaw Compliance
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
              {town.permits.approved} of {town.permits.submitted} approved ({town.permits.approvalRate}%)
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
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Approved ({town.permits.approved})
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
              Denied ({town.permits.denied})
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              Pending ({town.permits.pending})
            </span>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2 mb-5">
          {(
            [
              { key: 'all' as const, label: 'All Provisions', count: town.provisions.length },
              { key: 'conflict' as const, label: 'Conflicts', count: counts.conflicts },
              { key: 'review' as const, label: 'Needs Review', count: counts.review },
              { key: 'compliant' as const, label: 'Compliant', count: counts.compliant },
            ] as const
          ).map(({ key, label, count }) => {
            const isActive = statusFilter === key;
            const colorMap: Record<string, string> = {
              all: isActive ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : '',
              conflict: isActive ? 'bg-red-400/20 text-red-400 border-red-400/30' : '',
              review: isActive ? 'bg-amber-400/20 text-amber-400 border-amber-400/30' : '',
              compliant: isActive ? 'bg-emerald-400/20 text-emerald-400 border-emerald-400/30' : '',
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
                  <ProvisionRow key={p.id} provision={p} />
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
          Compliance analysis is based on ADU Pulse&apos;s reading of each town&apos;s published
          zoning bylaw or ordinance compared against Massachusetts Chapter 150 (2024), MGL
          c.40A §3, and 760 CMR 71.00. Attorney General disapproval data sourced from published
          AG Municipal Law Unit decisions. This is not legal advice — consult a zoning attorney
          for project-specific guidance.
        </p>
      </div>
    </div>
  );
}
