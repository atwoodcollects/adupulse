import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import {
  allEntries,
  getEvidenceBasis,
  evidenceBasisConfig,
  isTownOpen,
  type EvidenceBasis,
  type ComplianceProvision,
  type Citation,
} from '../../compliance-data'
import ProvisionCTA from './ProvisionCTA'
import ComplianceGate from '@/components/ComplianceGate'

// ── STATIC PARAMS ───────────────────────────────────────────────────────
export function generateStaticParams() {
  const params: { slug: string; provisionId: string }[] = []
  for (const town of allEntries) {
    for (const p of town.provisions) {
      params.push({ slug: town.slug, provisionId: p.id })
    }
  }
  return params
}

// ── METADATA ────────────────────────────────────────────────────────────
export function generateMetadata({
  params,
}: {
  params: { slug: string; provisionId: string }
}): Metadata {
  const town = allEntries.find((t) => t.slug === params.slug)
  if (!town) return { title: 'Not Found | ADU Pulse' }
  const provision = town.provisions.find((p) => p.id === params.provisionId)
  if (!provision) return { title: 'Not Found | ADU Pulse' }

  const title = `${provision.provision} — ADU Rules in ${town.name} | ADU Pulse`
  const description = `What ${town.name}'s ${provision.provision.toLowerCase()} means for your ADU project. How it compares to Massachusetts state law and what builders and homeowners should expect.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://www.adupulse.com/compliance/${town.slug}/${provision.id}`,
      siteName: 'ADU Pulse',
      type: 'website',
    },
    alternates: {
      canonical: `https://www.adupulse.com/compliance/${town.slug}/${provision.id}`,
    },
  }
}

// ── HERO TEXT LOGIC ─────────────────────────────────────────────────────
function getHeroText(
  basis: EvidenceBasis,
  townName: string,
): string {
  if (basis === 'ag_disapproved') {
    return `The Attorney General has disapproved this provision as inconsistent with G.L. c. 40A §3. It is preempted by state law, though it may still appear in ${townName}'s local code. Builders should cite the AG decision if this comes up during permitting.`
  }
  if (basis === 'statutory_conflict') {
    return `This provision appears inconsistent with G.L. c. 40A §3 and is subject to statutory override. However, it may still appear in ${townName}'s local code and could create confusion during the permitting process. Builders should be prepared to cite state law if this comes up.`
  }
  if (basis === 'ambiguous') {
    return `This provision is in a gray area — it may be within the town's authority, but could add time or uncertainty to your ADU project depending on how ${townName} interprets it.`
  }
  return 'This provision is consistent with Massachusetts state law. No issues expected during permitting.'
}

// ── CITATION LINKS ──────────────────────────────────────────────────────
function CitationLinks({ citations }: { citations: Citation[] }) {
  if (!citations || citations.length === 0) return null
  return (
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
  )
}

// ── PAGE ─────────────────────────────────────────────────────────────────
export default function ProvisionPage({
  params,
}: {
  params: { slug: string; provisionId: string }
}) {
  const town = allEntries.find((t) => t.slug === params.slug)
  if (!town) notFound()
  const provisionIndex = town.provisions.findIndex(
    (p) => p.id === params.provisionId,
  )
  if (provisionIndex === -1) notFound()
  const provision = town.provisions[provisionIndex]
  const basis = getEvidenceBasis(provision)
  const cfg = evidenceBasisConfig[basis]
  const isCity = town.municipalityType === 'city'
  const ruleWord = isCity ? 'Ordinance' : 'Bylaw'

  // Gate provision detail for non-open towns
  if (!isTownOpen(town)) {
    return (
      <div className="min-h-screen bg-gray-900">
        <NavBar />
        <main className="px-4 py-6 sm:py-10">
          <nav className="max-w-4xl mx-auto mb-6 text-sm text-gray-400">
            <Link
              href="/"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Dashboard
            </Link>
            <span className="mx-2 text-gray-600">/</span>
            <Link
              href="/compliance"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Policy Tracker
            </Link>
            <span className="mx-2 text-gray-600">/</span>
            <Link
              href={`/compliance/${town.slug}`}
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              {town.name}
            </Link>
            <span className="mx-2 text-gray-600">/</span>
            <span className="text-gray-400 truncate">{provision.provision}</span>
          </nav>
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                  {provision.provision}
                </h1>
                <span
                  className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${cfg.color} ${cfg.bg}`}
                >
                  {cfg.label}
                </span>
              </div>
              <p className="text-gray-400 text-sm">
                {town.name}, {town.county} County
              </p>
              <span className="inline-block mt-1.5 text-[10px] font-medium text-gray-500 bg-gray-800 px-2 py-0.5 rounded">
                {provision.category}
              </span>
            </div>
            <ComplianceGate
              townName={town.name}
              townSlug={town.slug}
              provisionCount={town.provisions.length}
              isProvisionPage
            />
            <div className="mt-6 text-sm">
              <Link
                href={`/compliance/${town.slug}`}
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                &larr; Back to {town.name} Analysis
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // Prev/next within same town
  const prev =
    provisionIndex > 0 ? town.provisions[provisionIndex - 1] : null
  const next =
    provisionIndex < town.provisions.length - 1
      ? town.provisions[provisionIndex + 1]
      : null

  // Related provisions from other towns in the same category (up to 5)
  const related: { town: string; slug: string; provision: ComplianceProvision }[] = []
  for (const t of allEntries) {
    if (t.slug === town.slug) continue
    for (const p of t.provisions) {
      if (p.category === provision.category && related.length < 5) {
        related.push({ town: t.name, slug: t.slug, provision: p })
      }
    }
    if (related.length >= 5) break
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <NavBar />
      <main className="px-4 py-6 sm:py-10">
        {/* Breadcrumbs */}
        <nav className="max-w-4xl mx-auto mb-6 text-sm text-gray-400">
          <Link
            href="/"
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            Dashboard
          </Link>
          <span className="mx-2 text-gray-600">/</span>
          <Link
            href="/compliance"
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            Policy Tracker
          </Link>
          <span className="mx-2 text-gray-600">/</span>
          <Link
            href={`/compliance/${town.slug}`}
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            {town.name}
          </Link>
          <span className="mx-2 text-gray-600">/</span>
          <span className="text-gray-400 truncate">{provision.provision}</span>
        </nav>

        <div className="max-w-4xl mx-auto">
          {/* ── HEADER ── */}
          <div className="mb-6">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                {provision.provision}
              </h1>
              <span
                className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${cfg.color} ${cfg.bg}`}
              >
                {cfg.label}
              </span>
            </div>
            <p className="text-gray-400 text-sm">
              {town.name}, {town.county} County
            </p>
            <span className="inline-block mt-1.5 text-[10px] font-medium text-gray-500 bg-gray-800 px-2 py-0.5 rounded">
              {provision.category}
            </span>
          </div>

          {/* ── WHAT THIS MEANS FOR YOUR PROJECT ── */}
          <div className="mb-6 border-l-4 border-blue-500/50 bg-blue-900/10 rounded-r-lg p-4">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-base">📋</span>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-blue-400">
                What This Means for Your Project
              </p>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">
              {getHeroText(basis, town.name)}
            </p>
          </div>

          {/* ── SIDE-BY-SIDE COMPARISON ── */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 sm:p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  Local {ruleWord}
                </p>
                <p className="text-sm text-gray-300 leading-relaxed">
                  {provision.localBylaw}
                </p>
              </div>
            </div>
          </div>

          {/* ── IMPACT ON YOUR PROJECT ── */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 sm:p-6 mb-6">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-1">
              Impact on Your Project
            </p>
            <p className="text-sm text-gray-300 leading-relaxed">
              {provision.impact}
            </p>
          </div>

          {/* ── AG DECISION ── */}
          {provision.agDecision && (
            <div className="bg-red-400/5 border border-red-400/20 rounded-xl p-4 sm:p-6 mb-6">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-red-400 mb-1">
                AG Decision
              </p>
              <p className="text-sm text-red-300 leading-relaxed">
                {provision.agDecision}
              </p>
            </div>
          )}

          {/* ── SOURCES ── */}
          {provision.citations.length > 0 && (
            <div className="mb-6">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-2">
                Sources
              </p>
              <CitationLinks citations={provision.citations} />
            </div>
          )}

          {/* ── RELATED PROVISIONS ── */}
          {related.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-bold text-white mb-3">
                How Other Towns Handle {provision.category}
              </h2>
              <div className="space-y-2">
                {related.map((r) => {
                  const rc = evidenceBasisConfig[getEvidenceBasis(r.provision)]
                  return (
                    <Link
                      key={`${r.slug}-${r.provision.id}`}
                      href={`/compliance/${r.slug}/${r.provision.id}`}
                      className="flex items-center gap-3 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 hover:border-gray-600 transition-colors group"
                    >
                      <span
                        className={`w-2 h-2 rounded-full flex-shrink-0 ${rc.dot}`}
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-sm text-white font-medium group-hover:text-blue-400 transition-colors truncate block">
                          {r.provision.provision}
                        </span>
                        <span className="text-xs text-gray-500">
                          {r.town}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded shrink-0 ${rc.color} ${rc.bg}`}
                      >
                        {rc.label}
                      </span>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}

          {/* ── NAVIGATION ── */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 text-sm">
            <Link
              href={`/compliance/${town.slug}`}
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              &larr; Back to {town.name} Analysis
            </Link>
            <div className="flex gap-4">
              {prev && (
                <Link
                  href={`/compliance/${town.slug}/${prev.id}`}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  &larr; {prev.provision}
                </Link>
              )}
              {next && (
                <Link
                  href={`/compliance/${town.slug}/${next.id}`}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {next.provision} &rarr;
                </Link>
              )}
            </div>
          </div>

          {/* ── BUILDER CTA ── */}
          <ProvisionCTA townName={town.name} />
        </div>
      </main>
      <Footer />
    </div>
  )
}
