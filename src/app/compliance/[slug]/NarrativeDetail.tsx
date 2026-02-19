'use client';

import { narrativeCities } from '../compliance-data';
import { formatReviewDate } from '@/lib/dates';

const tagConfig: Record<string, { label: string; color: string; bg: string }> = {
  'administrative-friction': { label: 'ADMIN. FRICTION', color: 'text-amber-400', bg: 'bg-amber-400/10' },
  'no-ordinance': { label: 'NO LOCAL ORDINANCE', color: 'text-blue-400', bg: 'bg-blue-400/10' },
  'stalled': { label: 'STALLED', color: 'text-gray-300', bg: 'bg-gray-600/30' },
};

export default function NarrativeDetail({ slug }: { slug: string }) {
  const city = narrativeCities.find((c) => c.slug === slug);
  if (!city) return null;

  const tag = tagConfig[city.tag] ?? tagConfig['stalled'];

  return (
    <div className="max-w-4xl mx-auto">
      {/* ── HEADER ── */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 sm:p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                {city.name}
              </h2>
              <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${tag.color} ${tag.bg}`}>
                {tag.label}
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-1">
              {city.county} County · Pop. {city.population.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 mt-0.5">
              Last reviewed: {formatReviewDate(city.lastReviewed)}
            </p>
          </div>
        </div>

        {/* City disclaimer */}
        <div className="mb-5 border-l-4 border-amber-500/50 bg-amber-900/10 rounded-r-lg p-4">
          <p className="text-sm text-amber-200/90 leading-relaxed">
            <strong>Note:</strong> City ordinances are not reviewed by the Massachusetts Attorney General. This page reflects ADU Pulse&apos;s independent monitoring of {city.name}&apos;s ADU policy environment.
          </p>
        </div>

        {/* Permit bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
              Permit Activity
            </p>
            <p className="text-xs text-gray-400">
              {city.permits.approved} of {city.permits.submitted} approved (
              {city.permits.approvalRate}%)
              <span className="text-gray-600 block text-[10px] mt-0.5">Share of 2025 applications approved in 2025</span>
            </p>
          </div>
          <div className="h-2.5 bg-gray-700 rounded-full overflow-hidden flex">
            <div
              className="bg-emerald-400 rounded-l-full transition-all"
              style={{
                width: `${(city.permits.approved / city.permits.submitted) * 100}%`,
              }}
            />
            {city.permits.denied > 0 && (
              <div
                className="bg-red-400 transition-all"
                style={{
                  width: `${(city.permits.denied / city.permits.submitted) * 100}%`,
                }}
              />
            )}
          </div>
        </div>

        {/* Summary */}
        <p className="text-sm text-gray-300 leading-relaxed">
          {city.summary}
        </p>
      </div>

      {/* ── NARRATIVE BODY ── */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 sm:p-6 mb-6">
        <h3 className="text-lg font-bold text-white mb-4">{city.title}</h3>
        <div className="space-y-4">
          {city.body.split('\n\n').map((paragraph, i) => (
            <p key={i} className="text-sm text-gray-300 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/20 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-2">
          Stay updated on {city.name}
        </h3>
        <p className="text-sm text-gray-400 mb-4">
          ADU Pulse monitors ADU policy changes across Massachusetts. Get notified when {city.name}&apos;s status changes.
        </p>
        <a
          href="/pricing"
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors"
        >
          Subscribe for Updates &rarr;
        </a>
      </div>
    </div>
  );
}
