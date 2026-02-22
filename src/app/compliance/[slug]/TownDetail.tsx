'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useSubscription } from '@/lib/subscription';
import {
  allEntries,
  getStatusCounts,
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
import ComplianceGate from '@/components/ComplianceGate';
import { formatReviewDate } from '@/lib/dates';

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
function ProvisionRow({ provision, isPro, slug, isCity }: { provision: ComplianceProvision; isPro: boolean; slug: string; isCity?: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = evidenceBasisConfig[getEvidenceBasis(provision)];

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
          <Link
            href={`/compliance/${slug}/${provision.id}`}
            onClick={(e) => e.stopPropagation()}
            className="text-sm text-white font-medium truncate hover:text-blue-400 transition-colors"
          >
            {provision.provision}
          </Link>
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

      {expanded && (!isPro ? (
        <div className="px-4 pb-4 border-t border-gray-700/50">
          <a href="/pricing" className="block mt-3 p-3 rounded-lg border border-amber-500/30 bg-amber-500/5 text-center">
            <span className="text-amber-500 text-sm font-medium">Unlock detailed consistency analysis with Pro</span>
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
                {isCity ? 'Local Ordinance' : 'Local Bylaw'}
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
    () => allEntries.find((t) => t.slug === slug) ?? allEntries[0],
    [slug],
  );
  const isCity = town.municipalityType === 'city';
  const ruleWord = isCity ? 'Ordinance' : 'Bylaw';
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
              {town.name} {ruleWord} Consistency
            </h2>
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

        {/* City disclaimer */}
        {isCity && !town.isExempt && (
          <div className="mb-5 border-l-4 border-amber-500/50 bg-amber-900/10 rounded-r-lg p-4">
            <p className="text-sm text-amber-200/90 leading-relaxed">
              <strong>Important:</strong> Unlike town bylaws, city ordinances are not reviewed by the Massachusetts Attorney General. These potential inconsistencies were identified through ADU Pulse&apos;s independent analysis of {town.name}&apos;s ADU ordinance against G.L. c. 40A &sect;3 and 760 CMR 71.00.
            </p>
          </div>
        )}

        {/* Boston exempt note */}
        {town.isExempt && (
          <div className="mb-5 border-l-4 border-blue-500/50 bg-blue-900/10 rounded-r-lg p-4">
            <p className="text-sm text-blue-200/90 leading-relaxed">
              <strong>Note:</strong> Boston is the only municipality in Massachusetts exempt from G.L. c. 40A. The statewide ADU by-right law does not apply here. Boston has its own ADU programs including a $7,500 design grant and 0% loans up to $50K.
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
            <p className="text-sm text-gray-300 leading-relaxed">
              {town.bottomLine}
            </p>
          </div>
        )}

        {/* Permit bar */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
              Permit Activity
            </p>
            <p className="text-xs text-gray-400">
              {town.permits.approved} of {town.permits.submitted} approved (
              {town.permits.approvalRate}%)
              <span className="text-gray-600 block text-[10px] mt-0.5">Share of 2025 applications approved in 2025</span>
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
          <p className="mt-2 text-xs text-gray-500">
            <Link href={`/towns/${town.slug}`} className="text-blue-400/70 hover:text-blue-300 transition-colors">
              View {town.name} ADU permit data &rarr;
            </Link>
          </p>
        </div>

        {/* ── PROVENANCE (shown for all towns) ── */}
        <div className="mt-4 px-4 py-3 bg-gray-900/30 border border-gray-700/30 rounded-lg">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-600 mb-2">
            Data Provenance
          </p>
          <div className="space-y-1 text-xs text-gray-500">
            <p>
              <span className="text-gray-400">Reviewed:</span>{' '}
              {formatReviewDate(town.lastReviewed)}
            </p>
            <p>
              <span className="text-gray-400">AG action:</span>{' '}
              {town.agDecisionDate ? (
                <>
                  {formatReviewDate(town.agDecisionDate)}
                  {town.agDecisionUrl && (
                    <>
                      {' '}
                      <a
                        href={town.agDecisionUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400/70 hover:text-blue-300 underline underline-offset-2"
                      >
                        source
                      </a>
                    </>
                  )}
                </>
              ) : (
                'None'
              )}
            </p>
            <p>
              <span className="text-gray-400">{ruleWord} source:</span>{' '}
              {town.bylawSourceUrl ? (
                <a
                  href={town.bylawSourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400/70 hover:text-blue-300 underline underline-offset-2"
                >
                  {town.bylawSourceTitle || ruleWord}
                </a>
              ) : (
                town.bylawSourceTitle || town.bylawSource
              )}
              {town.bylawRetrievedAt && (
                <span className="text-gray-600">
                  {' '}&middot; retrieved {formatReviewDate(town.bylawRetrievedAt)}
                </span>
              )}
            </p>
            {town.bylawVersionDate ? (
              <p>
                <span className="text-gray-400">{ruleWord} version:</span>{' '}
                {formatReviewDate(town.bylawVersionDate)}
              </p>
            ) : (
              <p className="text-gray-600 italic">
                Version date not published; analysis based on publicly available text
                {town.bylawRetrievedAt && (
                  <> retrieved {formatReviewDate(town.bylawRetrievedAt)}</>
                )}
              </p>
            )}
          </div>
        </div>

        {/* ── GATED vs OPEN SPLIT ── */}
        {!isTownOpen(town) ? (
          <>
            <p className="mt-5 text-sm text-gray-400">
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
            <div className="flex flex-wrap gap-2 mt-5 mb-5">
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
                      <ProvisionRow key={p.id} provision={p} isPro={isPro} slug={slug} isCity={isCity} />
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
          </>
        )}
      </div>

      {isTownOpen(town) && (
        <>
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
              , towns are not &ldquo;inconsistent&rdquo; simply because their local zoning has not
              been updated — however, any local provisions inconsistent with the ADU statute
              are preempted by state law as of February 2, 2025. Local permitting decisions should not
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

          {/* ── SUBSCRIBE CTA ── */}
          <div className="mt-6 bg-gray-800 border border-gray-700 rounded-xl p-4 sm:p-6">
            <h3 className="text-white font-bold mb-1">
              Stay Updated on {town.name} ADU Bylaws
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              Get notified when this town updates its bylaw, the AG issues a decision, or enforcement practices change.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const email = (form.elements.namedItem('email') as HTMLInputElement).value;
                window.location.href = `mailto:nick@adupulse.com?subject=${encodeURIComponent(`Bylaw alert signup: ${town.name}`)}&body=${encodeURIComponent(`Please add me to ${town.name} bylaw update alerts.\n\nEmail: ${email}`)}`;
              }}
              className="flex gap-2 flex-col sm:flex-row"
            >
              <input
                type="email"
                name="email"
                required
                placeholder="you@email.com"
                className="flex-1 px-4 py-2.5 bg-gray-900 border border-gray-600 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium shrink-0"
              >
                Subscribe
              </button>
            </form>
            <p className="text-gray-600 text-xs mt-2">
              Free alerts. No spam. Unsubscribe anytime.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
