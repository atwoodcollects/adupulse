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
        <p className="text-gray-400 text-lg mb-10">
          How we collect, classify, and present ADU permit data across Massachusetts.
        </p>

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

        {/* Update Frequency */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-blue-400">🔄</span> Update Frequency
          </h2>
          <div className="bg-gray-800/50 border border-border rounded-lg p-5">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Portal-scraped towns</span>
                <span className="text-white font-medium">Weekly</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Statewide survey data</span>
                <span className="text-white font-medium">As released by EOHLC (latest: Feb 2026)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Cost estimator ranges</span>
                <span className="text-white font-medium">Monthly review based on new permits</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Rent / market data</span>
                <span className="text-white font-medium">Quarterly</span>
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
      </main>
      <Footer />
    </div>
  )
}
