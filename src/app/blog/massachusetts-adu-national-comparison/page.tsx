import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How Massachusetts Stacks Up in America's ADU Boom | ADU Pulse",
  description:
    "Massachusetts ranks 11th nationally in ADU-to-construction ratio at 27%. How the state's first-year numbers compare to California and the national ADU surge.",
};

export default function MassachusettsADUNationalComparison() {
  return (
    <article className="max-w-3xl mx-auto px-4 py-8 md:py-12">
      <a className="text-blue-400 text-sm hover:underline" href="/blog">
        ← Back to Blog
      </a>
      <h1 className="text-3xl md:text-4xl font-bold text-white mt-6 mb-4">
        How Massachusetts Stacks Up in America&apos;s ADU Boom
      </h1>
      <div className="flex items-center gap-4 text-sm text-gray-500 mb-8">
        <span>February 11, 2026</span>
        <span>•</span>
        <span>7 min read</span>
        <span>•</span>
        <span>By ADU Pulse Team</span>
      </div>

      <div className="prose prose-invert prose-lg max-w-none">
        <p className="text-gray-300 text-lg leading-relaxed mb-6">
          Last week, a national permit data company published an analysis of 2.8
          million ADU permits across the United States. California dominates with
          over 400,000 permits — roughly a third of the national total — driven
          by a decade of legislative reforms that turned Los Angeles County alone
          into a 126,000-unit ADU machine.
        </p>

        <p className="text-gray-300 leading-relaxed mb-6">
          Massachusetts, by comparison, has 1,224 approved ADUs in its first year
          under the Affordable Homes Act.
        </p>

        <p className="text-gray-300 leading-relaxed mb-8">
          That sounds like a rounding error. It&apos;s not.
        </p>

        <h2 className="text-2xl font-bold text-white mt-10 mb-4">
          The number that matters isn&apos;t total permits
        </h2>

        <p className="text-gray-300 leading-relaxed mb-4">
          The more telling metric is ADU permits as a share of new single-family
          residential construction. By that measure, Massachusetts ranks{" "}
          <strong className="text-white">11th nationally at 27%</strong> —
          roughly 1 in 4 new housing permits in the state is an ADU.
        </p>

        <p className="text-gray-300 leading-relaxed mb-4">
          California sits at the top of that list with years of compounding
          growth. But Massachusetts is outpacing most states that passed ADU
          reforms before it did. We&apos;re one year in with a ratio that took
          other states three or four years to reach.
        </p>

        <p className="text-gray-300 leading-relaxed mb-8">
          The Affordable Homes Act didn&apos;t just allow ADUs. It made them
          by-right in every single-family zone statewide, backed by $10 million
          in MHP funding and $20 million in MassHousing lending programs. That
          combination — legal clarity plus financing — is why the first-year
          numbers look the way they do.
        </p>

        <h2 className="text-2xl font-bold text-white mt-10 mb-4">
          National data vs. state data: they&apos;re measuring different things
        </h2>

        <p className="text-gray-300 leading-relaxed mb-4">
          The national dataset estimates{" "}
          <strong className="text-white">9,941 ADU permits</strong> in
          Massachusetts, which would rank the state 21st. That number is based on
          AI-classified building permits going back to 2018, using a broad
          definition of what counts as an ADU.
        </p>

        <p className="text-gray-300 leading-relaxed mb-4">
          The EOHLC survey data we use at ADU Pulse shows{" "}
          <strong className="text-white">1,224 approved ADUs</strong> —
          specifically tracking permits issued under the post-Affordable Homes
          Act framework during 2025. These are different measurements answering
          different questions.
        </p>

        <p className="text-gray-300 leading-relaxed mb-8">
          The national number captures everything that looks like an ADU over
          seven years. The state number captures what&apos;s happening right now
          under the new law. Both are useful. Neither is wrong. But if you&apos;re
          a builder evaluating the Massachusetts market, a homeowner planning a
          project, or a policymaker measuring the law&apos;s impact, the
          state-level data is what you need — and it needs to be granular enough
          to act on.
        </p>

        <h2 className="text-2xl font-bold text-white mt-10 mb-4">
          The state just launched a tracker. Here&apos;s what it does and
          doesn&apos;t do.
        </h2>

        <p className="text-gray-300 leading-relaxed mb-4">
          On February 4th, Massachusetts launched its own{" "}
          <a
            className="text-blue-400 hover:underline"
            href="https://www.mass.gov/info-details/accessory-dwelling-unit-tracker"
            target="_blank"
            rel="noopener noreferrer"
          >
            ADU tracker
          </a>{" "}
          at mass.gov, citing the 1,224 approved units. It&apos;s a positive step
          toward transparency, and it confirms that the state is using the same
          underlying EOHLC survey dataset that powers ADU Pulse.
        </p>

        <p className="text-gray-300 leading-relaxed mb-4">
          The state tracker provides a map view and makes the raw CSV available
          for download. What it doesn&apos;t yet offer:
        </p>

        <ul className="text-gray-300 mb-6 space-y-2">
          <li>
            <strong className="text-white">Town-level approval rates.</strong>{" "}
            The statewide 75% approval rate is helpful context, but it masks
            towns at 100% and towns below 20%. Builders and homeowners need to
            know the difference.
          </li>
          <li>
            <strong className="text-white">Per-capita normalization.</strong>{" "}
            Plymouth leads the state with 34 approved ADUs, but Plymouth has
            63,000 residents. Nantucket approved 27 with a year-round population
            under 15,000. Per capita, Nantucket&apos;s ADU activity is roughly 5x
            higher. Without normalization, the raw counts are misleading.
          </li>
          <li>
            <strong className="text-white">Searchable town-level data.</strong>{" "}
            The tracker provides a map but no sortable table. If you want to
            compare your town to neighboring communities, you&apos;re downloading
            a CSV and doing the analysis yourself.
          </li>
          <li>
            <strong className="text-white">ADU type breakdowns.</strong>{" "}
            Statewide, 48% of ADUs are detached — but that varies enormously by
            region. Cape and island towns are almost entirely detached builds.
            Urban communities are predominantly attached conversions. The cost and
            timeline implications are significant.
          </li>
          <li>
            <strong className="text-white">
              Timeline or process metrics.
            </strong>{" "}
            How long does it take from application to approval? From approval to
            certificate of occupancy? The survey doesn&apos;t capture this yet,
            and it&apos;s arguably the most important metric for anyone planning a
            project.
          </li>
        </ul>

        <p className="text-gray-300 leading-relaxed mb-8">
          None of this is a criticism of the state&apos;s effort — it&apos;s a
          first release built on a survey that&apos;s still being refined. But
          it&apos;s exactly the gap that motivated us to build ADU Pulse.
        </p>

        <h2 className="text-2xl font-bold text-white mt-10 mb-4">
          What California&apos;s trajectory tells us about what&apos;s coming
        </h2>

        <p className="text-gray-300 leading-relaxed mb-4">
          California&apos;s ADU story is instructive. In 2016, the state passed
          SB 1069, loosening ADU restrictions. Permit volume increased, but
          modestly. Then came AB 68, AB 881, and SB 13 in 2019 — a second wave
          of reforms that eliminated fees, reduced setbacks, and streamlined
          approvals. That&apos;s when the curve went exponential.
        </p>

        <p className="text-gray-300 leading-relaxed mb-4">
          LA County went from a few thousand ADU permits per year to over 20,000.
          The state as a whole now processes more ADU permits than any other
          housing type in many jurisdictions.
        </p>

        <p className="text-gray-300 leading-relaxed mb-8">
          Massachusetts isn&apos;t California. The climate is different, lot sizes
          vary, and the cost structure for new construction in New England is its
          own challenge. But the policy trajectory rhymes. The Affordable Homes
          Act is Massachusetts&apos; SB 1069 moment — the legal foundation. The
          question is whether the state follows through with the iterative
          refinements that turned California&apos;s modest early numbers into a
          housing production engine. Early signs are encouraging: the 75%
          approval rate suggests most towns are processing applications without
          major friction, the 48% detached rate suggests homeowners are building
          real housing units, and the geographic spread — 221 towns with at least
          one application — suggests demand isn&apos;t concentrated in a handful
          of progressive municipalities.
        </p>

        <h2 className="text-2xl font-bold text-white mt-10 mb-4">
          Where ADU Pulse fits
        </h2>

        <p className="text-gray-300 leading-relaxed mb-4">
          National datasets are valuable for benchmarking and trend analysis. The
          state tracker is valuable for transparency and accountability. ADU
          Pulse exists to fill the space between them —{" "}
          <strong className="text-white">
            town-level, decision-grade analytics for the people actually
            building, permitting, and financing ADUs in Massachusetts.
          </strong>
        </p>

        <p className="text-gray-300 leading-relaxed mb-4">
          Every one of the 351 municipalities in the state has a profile on ADU
          Pulse with permit data, approval rates, ADU type breakdowns, and
          scorecards. We normalize by population so towns can be compared fairly.
          We&apos;re building tools for builders to identify high-activity markets
          and for municipalities to benchmark their approval processes against
          peer communities.
        </p>

        <p className="text-gray-300 leading-relaxed mb-8">
          The national boom is real. Massachusetts is part of it. But the
          decisions that matter — where to build, what to expect, how long it
          takes — are local. That&apos;s where we live.
        </p>
      </div>

      {/* CTA Box */}
      <div className="mt-12 bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-blue-500/30 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-2">Explore the data</h3>
        <p className="text-gray-400 mb-4">
          See ADU permits, approval rates, and scorecards for all 351
          Massachusetts towns.
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium"
            href="/"
          >
            View All Towns →
          </a>
          <a
            className="inline-flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium"
            href="/scorecards"
          >
            Town Scorecards
          </a>
          <a
            className="inline-flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium"
            href="/blog/massachusetts-adu-year-one"
          >
            Year One Analysis →
          </a>
        </div>
      </div>

      <p className="text-gray-600 text-sm mt-8 italic">
        ADU Pulse covers all 351 Massachusetts municipalities using official
        EOHLC ADU Survey 2025 data. For questions, partnerships, or data
        inquiries, reach out through our site.
      </p>
    </article>
  );
}
