'use client'

import Link from 'next/link'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'

export default function MethodologyPage() {
  return (
    <div className="min-h-screen bg-gray-900">
      <NavBar current="Methodology" />

      <main className="max-w-3xl mx-auto px-4 py-8 md:py-12">
        <Link href="/" className="text-blue-400 text-sm mb-4 inline-block">← Back to dashboard</Link>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Methodology &amp; Data Sources</h1>
        <p className="text-gray-400 text-lg mb-6">
          How we collect, classify, and present ADU permit data across Massachusetts.
        </p>

        {/* Disclaimer */}
        <div className="mb-10 border-l-4 border-amber-500/50 bg-amber-900/10 rounded-r-lg p-4">
          <p className="text-sm text-amber-200/90 leading-relaxed">
            <strong>Disclaimer:</strong> This platform provides structured statutory comparison and public-record analysis. It does not render legal opinions or determine enforceability in specific cases. Consult a zoning attorney for project-specific guidance.
          </p>
        </div>

        {/* Data Sources */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-blue-400">📊</span> Data Sources
          </h2>
          <div className="bg-gray-800/50 border border-border rounded-lg p-5 space-y-4">
            <div>
              <h3 className="text-white font-medium mb-1">Town Permit Portals (Primary)</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Our primary data comes from direct scraping of municipal permit portals. We currently scrape active portals for Milton, Plymouth, Duxbury, Newton, Needham, Boston, Andover, Sudbury, Lexington, Falmouth, and Revere. These towns provide permit-level detail including addresses, costs, square footage, and permit status.
              </p>
            </div>
            <div>
              <h3 className="text-white font-medium mb-1">EOHLC ADU Survey (Feb 2026)</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                The Executive Office of Housing and Livable Communities conducted a statewide survey of all 351 Massachusetts municipalities in February 2026. This provides aggregate counts of ADU applications submitted, approved, and denied across 217 responding towns. It does not include permit-level detail (addresses, costs, etc.).
              </p>
            </div>
            <div>
              <h3 className="text-white font-medium mb-1">Census ACS &amp; Market Data</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Population and housing data uses 2024 American Community Survey estimates. Rent market data is sourced from aggregated listing platforms. Assisted living costs reference the Massachusetts state average of $6,000/month (Genworth Cost of Care Survey).
              </p>
            </div>
          </div>
        </section>

        {/* What "Tracked" Means */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-blue-400">🔍</span> What &ldquo;Tracked&rdquo; Means
          </h2>
          <div className="bg-gray-800/50 border border-border rounded-lg p-5 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-blue-900/20 border border-blue-500/20 rounded-lg p-4">
                <div className="text-blue-400 font-medium text-sm mb-1">🟦 Portal-Scraped Towns</div>
                <p className="text-gray-400 text-sm">Full permit-level data: addresses, costs, sqft, type, status, notes. Updated weekly. Currently 11 towns.</p>
              </div>
              <div className="bg-gray-700/30 border border-gray-600/30 rounded-lg p-4">
                <div className="text-gray-300 font-medium text-sm mb-1">⬜ Survey-Reported Towns</div>
                <p className="text-gray-400 text-sm">Aggregate counts only (submitted, approved, denied). From EOHLC Feb 2026 survey. 217 towns total.</p>
              </div>
            </div>
            <p className="text-gray-500 text-sm">
              On the dashboard map, blue towns have portal-level detail. All other towns show survey-reported aggregate data only.
            </p>
          </div>
        </section>

        {/* Definitions */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-blue-400">📋</span> Definitions
          </h2>
          <div className="bg-gray-800/50 border border-border rounded-lg divide-y divide-border">
            {[
              { term: 'Submitted', def: 'An ADU application has been filed with the municipality. This includes applications at any stage of review.' },
              { term: 'Approved / Issued', def: 'The municipality has granted a building permit for the ADU. Construction may or may not have started.' },
              { term: 'Pending', def: 'Application is under review. May be awaiting zoning board, building inspector, or additional documentation.' },
              { term: 'Denied', def: 'Application was rejected. Common reasons include setback violations, lot coverage limits, or incomplete submissions.' },
              { term: 'Approval Rate', def: 'The share of applications submitted in 2025 that received approval in 2025. Pending applications are not counted as denials. This is sometimes called the same-year approval rate.' },
              { term: 'Detached', def: 'A standalone structure separate from the primary dwelling (backyard cottage, carriage house, etc.).' },
              { term: 'Attached', def: 'An addition connected to the existing home (bump-out, second story, wing addition).' },
              { term: 'Conversion', def: 'Repurposing existing space within or attached to the home (basement, garage, attic).' },
              { term: 'By-Right', def: 'Under Massachusetts\' 2024 ADU law, single-family homeowners can build one ADU without special permits in most cases.' },
              { term: 'Cost per Square Foot ($/sf)', def: 'Total reported project cost divided by finished square footage. Excludes land, financing, and soft costs unless reported.' },
              { term: 'Confidence Level', def: 'On the Cost Estimator: High = 5+ comparable permits in our data, Medium = 2-4, Limited = 0-1. More data = tighter estimate range.' },
            ].map((item, i) => (
              <div key={i} className="p-4">
                <div className="text-white font-medium text-sm">{item.term}</div>
                <div className="text-gray-400 text-sm mt-1">{item.def}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Bylaw & Ordinance Analysis */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-blue-400">⚖️</span> Bylaw &amp; Ordinance Consistency Analysis
          </h2>
          <div className="bg-gray-800/50 border border-border rounded-lg p-5 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-red-900/10 border border-red-500/20 rounded-lg p-4">
                <div className="text-red-400 font-medium text-sm mb-1">Town Analysis (AG Reviewed)</div>
                <p className="text-gray-400 text-sm">Town bylaws are subject to review by the Massachusetts Attorney General. Our analysis incorporates published AG disapproval decisions alongside our own provision-by-provision review against Chapter 150 and 760 CMR 71.00.</p>
              </div>
              <div className="bg-amber-900/10 border border-amber-500/20 rounded-lg p-4">
                <div className="text-amber-400 font-medium text-sm mb-1">City Analysis (Independent)</div>
                <p className="text-gray-400 text-sm">City ordinances are not subject to AG review. Inconsistencies identified on city pages are based entirely on ADU Pulse&apos;s independent analysis of the ordinance text against the same state law standards. These findings are informational, not legally authoritative.</p>
              </div>
            </div>
            <p className="text-gray-500 text-sm">
              Both town and city analyses use the same methodology: we read the full local ADU bylaw or ordinance, compare each provision against state law, and classify it as Inconsistent, Needs Review, or Consistent. The key difference is the source of authority — AG decisions for towns, our independent analysis for cities.
            </p>
          </div>
        </section>

        {/* Infrastructure Tracker Methodology */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-blue-400">🔧</span> Infrastructure Tracker Methodology
          </h2>
          <div className="bg-gray-800/50 border border-border rounded-lg p-5 space-y-4">
            <p className="text-gray-400 text-sm leading-relaxed">
              The Infrastructure Tracker analyzes local Board of Health septic regulations against the Title 5 state baseline (310 CMR 15.000). Local Boards of Health are authorized under M.G.L. c. 111, § 31 to adopt regulations stricter than Title 5. Exceeding the state baseline is not a legal deficiency — it is an exercise of granted local authority. The tracker documents where local rules create additional constraints for ADU construction.
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-orange-400 font-semibold text-sm shrink-0 w-40">Exceeds Baseline</span>
                <p className="text-gray-400 text-sm">The local Board of Health rule is stricter than the Title 5 minimum. Legally authorized under M.G.L. c. 111, § 31 — not a deficiency, but a real constraint for ADU design and siting.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-red-400 font-semibold text-sm shrink-0 w-40">Barrier</span>
                <p className="text-gray-400 text-sm">A structural obstacle that cannot be addressed through standard design adjustments — for example, a prohibition on variance relief for ADU projects, or a mandatory system type that cannot be substituted.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-amber-400 font-semibold text-sm shrink-0 w-40">Needs Review</span>
                <p className="text-gray-400 text-sm">The provision is ambiguous, unconfirmed, or dependent on local BoH practice that has not been publicly documented. Direct inquiry to the Board of Health is recommended before relying on any assumption.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-emerald-400 font-semibold text-sm shrink-0 w-40">Consistent</span>
                <p className="text-gray-400 text-sm">The local rule matches or is less strict than the Title 5 baseline. No additional constraint identified for ADU projects.</p>
              </div>
            </div>
            <div className="border-t border-border pt-4 space-y-2">
              <p className="text-gray-400 text-sm leading-relaxed">
                <span className="text-white font-medium">Source methodology:</span> Each town entry is based on primary source documents — the Board of Health's published regulations, not secondary summaries. Documents are retrieved directly from town websites or municipal code aggregators (e.g., ecode360.com) and dated at retrieval. Where regulations reference maps or plans incorporated by reference, those dependencies are noted in the provision detail.
              </p>
              <p className="text-gray-400 text-sm leading-relaxed">
                <span className="text-white font-medium">Attorney review:</span> Provisions flagged for legal review are noted with a sourcing note in each town profile. This analysis does not constitute a legal opinion.
              </p>
              <p className="text-gray-400 text-sm leading-relaxed">
                <span className="text-white font-medium">Not engineering advice:</span> This analysis documents regulatory requirements. It does not constitute a site evaluation, septic system design, or engineering opinion. Consult a licensed engineer and the local Board of Health before relying on this analysis for a specific project.
              </p>
            </div>
          </div>
        </section>

        {/* Confidence Tiers */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-blue-400">🏷️</span> Confidence Tiers
          </h2>
          <div className="bg-gray-800/50 border border-border rounded-lg p-5 space-y-4">
            <p className="text-gray-400 text-sm leading-relaxed">
              Each provision in our Consistency Tracker is classified into one of four confidence tiers based on available evidence:
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-red-400 font-semibold text-sm shrink-0 w-40">AG Disapproved</span>
                <p className="text-gray-400 text-sm">The Massachusetts Attorney General has formally disapproved this provision as inconsistent with state law. This is the highest confidence level — backed by an official government determination.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-orange-400 font-semibold text-sm shrink-0 w-40">Appears Inconsistent</span>
                <p className="text-gray-400 text-sm">ADU Pulse&apos;s analysis identifies this provision as appearing to conflict with G.L. c. 40A &sect;3 or 760 CMR 71.00, but it has not been the subject of an AG decision. These findings are based on statutory comparison, not official adjudication.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-amber-400 font-semibold text-sm shrink-0 w-40">Needs Review</span>
                <p className="text-gray-400 text-sm">The provision is in a gray area — it may be within the municipality&apos;s authority or may face future challenges. Further legal evaluation is recommended.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-emerald-400 font-semibold text-sm shrink-0 w-40">Consistent</span>
                <p className="text-gray-400 text-sm">The provision appears consistent with state law. No issues expected during permitting.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Cost Estimator Methodology */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-blue-400">💰</span> Cost Estimator Methodology
          </h2>
          <div className="bg-gray-800/50 border border-border rounded-lg p-5 space-y-3 text-sm text-gray-400 leading-relaxed">
            <p>
              The Cost Estimator uses per-square-foot ranges derived from actual permit data. We segment by ADU type (detached, attached, conversion) and builder type (DIY/homeowner vs. contractor).
            </p>
            <p>
              Town multipliers adjust for local cost-of-living differences. These are calibrated against actual permit costs where available (e.g., Newton permits typically run 15% above the statewide median, Plymouth 5% below).
            </p>
            <p>
              The cost breakdown (Building/Labor 65%, Electrical 10%, Plumbing 12%, HVAC 8%, Permits/Other 5%) represents a typical split based on industry benchmarks for residential construction in Massachusetts. Individual projects may vary significantly.
            </p>
            <p>
              The ROI calculator uses conservative assumptions: rental income at 85% of market rate (accounting for vacancies and below-market ADU pricing), property value uplift percentages derived from appraiser estimates for the local market, and assisted living costs at the Massachusetts state average of $6,000/month.
            </p>
          </div>
        </section>

        {/* Limitations */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-blue-400">⚠️</span> Known Limitations
          </h2>
          <div className="bg-gray-800/50 border border-border rounded-lg p-5 space-y-3 text-sm text-gray-400 leading-relaxed">
            <p>
              <span className="text-white font-medium">Incomplete cost data:</span> Not all permits include cost information. Some towns report estimated costs, others report actual construction costs, and some omit costs entirely. Where cost is reported as $0 or missing, we exclude it from averages.
            </p>
            <p>
              <span className="text-white font-medium">Self-reported survey data:</span> The EOHLC survey relies on municipalities self-reporting their ADU activity. Some towns may undercount (especially smaller communities with manual permitting systems) or misclassify permits.
            </p>
            <p>
              <span className="text-white font-medium">Portal coverage gaps:</span> We currently scrape 11 town portals. The remaining 340+ towns only have survey-level data. We are actively adding new portal integrations.
            </p>
            <p>
              <span className="text-white font-medium">Permit ≠ Construction:</span> An approved permit does not guarantee the ADU was built. Some permits expire unused. Our data tracks permitting activity, not construction completions.
            </p>
            <p>
              <span className="text-white font-medium">Market estimates are illustrative:</span> The ROI calculator, rent projections, and property uplift figures are estimates based on market averages. They are not financial advice. Consult a financial advisor and local real estate professional before making investment decisions.
            </p>
          </div>
        </section>

        {/* Contact */}
        <section className="mb-10">
          <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/30 rounded-lg p-5 text-center">
            <h3 className="text-white font-bold mb-2">Questions about our data?</h3>
            <p className="text-gray-400 text-sm mb-3">
              We&apos;re committed to transparency. If you spot an error or have questions about how we handle data for your town, let us know.
            </p>
            <Link href="/club" className="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium">
              Get in touch
            </Link>
          </div>
        </section>
        {/* Copyright */}
        <section className="mb-10">
          <div className="text-xs text-gray-500 leading-relaxed">
            <p>&copy; 2025&ndash;2026 ADU Pulse. Data sources include EOHLC, U.S. Census Bureau, Attorney General decisions, and municipal bylaws.</p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
