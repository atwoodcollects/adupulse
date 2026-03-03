'use client';

import { useState, useMemo } from 'react';
import {
  infrastructureTowns,
  statusConfig,
  impactConfig,
  getStatusCounts,
  type InfrastructureTown,
  type InfrastructureStatus,
  type InfrastructureProvision,
} from '../infrastructure-data';
import { formatReviewDate } from '@/lib/dates';

// ── PROVISION ROW ───────────────────────────────────────────────────────
function ProvisionRow({ provision }: { provision: InfrastructureProvision }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = statusConfig[provision.status];
  const impact = impactConfig[provision.impact];

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
            {provision.title}
          </span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 ml-3">
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

      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-700/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-1">
                State Baseline (Title 5)
              </p>
              <p className="text-sm text-gray-300 leading-relaxed">
                {provision.stateBaseline}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-1">
                Local Rule
              </p>
              <p className="text-sm text-gray-300 leading-relaxed">
                {provision.localRule}
              </p>
            </div>
          </div>

          {/* Gap */}
          <div className="mt-3">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-1">
              Gap
            </p>
            <p className="text-sm text-white font-medium">
              {provision.gap}
            </p>
          </div>

          {/* Impact badge */}
          <div className="mt-3">
            <span className={`inline-flex items-center text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${impact.color} ${impact.bg}`}>
              {impact.label}
            </span>
          </div>

          {/* Details */}
          <div className="mt-3">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-1">
              Evidence
            </p>
            <p className="text-sm text-gray-400 leading-relaxed">
              {provision.details}
            </p>
          </div>

          {/* Sourcing note */}
          {provision.sourcingNote && (
            <div className="mt-3 border-l-4 border-amber-500/50 bg-amber-900/10 rounded-r-lg p-3">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-400 mb-1">
                Sourcing Note
              </p>
              <p className="text-sm text-amber-200/80 leading-relaxed italic">
                {provision.sourcingNote}
              </p>
            </div>
          )}

          {/* Regulation citations */}
          <div className="mt-3 flex flex-wrap gap-3 text-xs text-gray-500">
            <span>
              <span className="text-gray-400">Local:</span> {provision.localRegulation}
            </span>
            <span>
              <span className="text-gray-400">State:</span> {provision.stateCitation}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// ── MAIN COMPONENT ──────────────────────────────────────────────────────
export default function InfraDetail({ slug }: { slug: string }) {
  const [statusFilter, setStatusFilter] = useState<InfrastructureStatus | 'all'>('all');

  const town = useMemo(
    () => infrastructureTowns.find((t) => t.slug === slug) ?? infrastructureTowns[0],
    [slug],
  );
  const counts = useMemo(() => getStatusCounts(town.provisions), [town]);

  const filteredProvisions = useMemo(() => {
    if (statusFilter === 'all') return town.provisions;
    return town.provisions.filter((p) => p.status === statusFilter);
  }, [town, statusFilter]);

  return (
    <div className="max-w-4xl mx-auto">
      {/* ── TOWN HEADER ── */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 sm:p-6 mb-6">
        <div className="mb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            {town.name} Septic Regulation Analysis
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            {town.regulatoryLayer}
          </p>
          <p className="text-sm text-gray-500 mt-0.5">
            Last reviewed: {formatReviewDate(town.lastReviewed)}
          </p>
        </div>

        {/* Bottom Line */}
        <div className="mb-5 border-l-4 border-blue-500/50 bg-blue-900/10 rounded-r-lg p-4">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-base">&#x1F4CB;</span>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-blue-400">
              What This Means
            </p>
          </div>
          <p className="text-sm text-gray-300 leading-relaxed">
            {town.bottomLine}
          </p>
        </div>

        {/* ── COMPARISON TABLE ── */}
        <div className="mb-5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-3">
            Gap Comparison
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left text-gray-400 font-medium py-2 pr-3">Provision</th>
                  <th className="text-left text-gray-400 font-medium py-2 pr-3">Title 5</th>
                  <th className="text-left text-gray-400 font-medium py-2 pr-3">Local Rule</th>
                  <th className="text-left text-gray-400 font-medium py-2">Gap</th>
                </tr>
              </thead>
              <tbody>
                {town.provisions.map((p) => {
                  const cfg = statusConfig[p.status];
                  return (
                    <tr key={p.id} className="border-b border-gray-700/50">
                      <td className="py-2 pr-3">
                        <div className="flex items-center gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
                          <span className="text-gray-300">{p.title}</span>
                        </div>
                      </td>
                      <td className="py-2 pr-3 text-gray-500 text-xs">{p.stateBaseline}</td>
                      <td className="py-2 pr-3 text-gray-300 text-xs">{p.localRule}</td>
                      <td className="py-2">
                        <span className={`text-xs font-medium ${cfg.color}`}>{p.gap}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── PROVENANCE ── */}
        <div className="mt-4 px-4 py-3 bg-gray-900/30 border border-gray-700/30 rounded-lg">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-600 mb-2">
            Data Provenance
          </p>
          <div className="space-y-1 text-xs text-gray-500">
            <p>
              <span className="text-gray-400">Regulatory layer:</span>{' '}
              {town.regulatoryLayer}
            </p>
            <p>
              <span className="text-gray-400">State baseline:</span>{' '}
              {town.stateBaseline}
            </p>
            <p>
              <span className="text-gray-400">Local authority:</span>{' '}
              {town.localAuthority}
            </p>
            <p>
              <span className="text-gray-400">Reviewed:</span>{' '}
              {formatReviewDate(town.lastReviewed)}
            </p>
          </div>
          {town.sources.length > 0 && (
            <div className="mt-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-600 mb-1.5">
                Sources
              </p>
              <div className="flex flex-wrap gap-1.5">
                {town.sources.map((source, i) => (
                  <a
                    key={i}
                    href={source.url}
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
                    {source.label}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── FILTER TABS + PROVISIONS ── */}
        <div className="flex flex-wrap gap-2 mt-5 mb-5">
          {([
            { key: 'all' as const, label: 'All Provisions', count: town.provisions.length },
            { key: 'exceeds_baseline' as const, label: 'Exceeds Baseline', count: counts.exceeds },
            { key: 'barrier' as const, label: 'Barrier', count: counts.barrier },
            { key: 'needs_review' as const, label: 'Needs Review', count: counts.review },
            { key: 'consistent' as const, label: 'Consistent', count: counts.consistent },
          ]).map(({ key, label, count }) => {
            const isActive = statusFilter === key;
            const colorMap: Record<string, string> = {
              all: isActive ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : '',
              exceeds_baseline: isActive ? 'bg-orange-400/20 text-orange-400 border-orange-400/30' : '',
              barrier: isActive ? 'bg-red-400/20 text-red-400 border-red-400/30' : '',
              needs_review: isActive ? 'bg-amber-400/20 text-amber-400 border-amber-400/30' : '',
              consistent: isActive ? 'bg-emerald-400/20 text-emerald-400 border-emerald-400/30' : '',
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

        <div className="space-y-2">
          {filteredProvisions.map((p) => (
            <ProvisionRow key={p.id} provision={p} />
          ))}
          {filteredProvisions.length === 0 && (
            <p className="text-center text-gray-500 py-8 text-sm">
              No provisions match the current filter.
            </p>
          )}
        </div>
      </div>

      {/* ── METHODOLOGY NOTE ── */}
      <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 text-xs text-gray-500 leading-relaxed">
        <p className="font-semibold text-gray-400 mb-1">Methodology</p>
        <p>
          This analysis compares local Board of Health supplementary rules against the state
          Title 5 baseline (
          <a
            href="https://www.law.cornell.edu/regulations/massachusetts/310-CMR-15-211"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 underline underline-offset-2"
          >
            310 CMR 15.000
          </a>
          ). Unlike zoning &mdash; where Chapter 150 preempts certain local restrictions &mdash; local
          Boards of Health are explicitly authorized under{' '}
          <a
            href="https://malegislature.gov/Laws/GeneralLaws/PartI/TitleXVI/Chapter111/Section31"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 underline underline-offset-2"
          >
            M.G.L. c. 111, &sect; 31
          </a>
          {' '}to adopt standards stricter than Title 5. Exceeding the state baseline is not a legal
          deficiency. This analysis measures the gap between local and state requirements and assesses
          practical impact on ADU feasibility. It does not constitute legal advice.
        </p>
      </div>
    </div>
  );
}
