import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "What 1,224 ADU Permits Taught Me About Massachusetts Housing | ADU Pulse",
  description:
    "One year into MA's ADU law: what's working, what's not, and what the permit data reveals about housing in the state.",
};

export default function MassachusettsADUYearOne() {
  return (
    <article className="max-w-3xl mx-auto px-4 py-8 md:py-12">
      <a className="text-blue-400 text-sm hover:underline" href="/blog">
        ← Back to Blog
      </a>
      <h1 className="text-3xl md:text-4xl font-bold text-white mt-6 mb-4">
        What 1,224 ADU Permits Taught Me About Massachusetts Housing
      </h1>
      <div className="flex items-center gap-4 text-sm text-gray-500 mb-8">
        <span>February 6, 2026</span>
        <span>•</span>
        <span>6 min read</span>
        <span>•</span>
        <span>By ADU Pulse Team</span>
      </div>

      <div className="prose prose-invert prose-lg max-w-none">
        <p className="text-gray-300 text-lg leading-relaxed mb-6">
          One year ago, Massachusetts passed one of the strongest ADU laws in the
          country. Accessory dwelling units—granny flats, in-law apartments,
          backyard cottages—can now be built by right in single-family zones
          statewide.
        </p>

        <p className="text-gray-300 leading-relaxed mb-6">
          I&apos;ve spent the past few months tracking what&apos;s actually
          happening on the ground. Not press releases. Not projections. Real
          permit data, scraped directly from town portals and cross-referenced
          with state survey data.
        </p>

        <p className="text-gray-300 leading-relaxed mb-8">
          Here&apos;s what I found.
        </p>

        <h2 className="text-2xl font-bold text-white mt-10 mb-4">
          The headline number is good
        </h2>

        <p className="text-gray-300 leading-relaxed mb-4">
          <strong className="text-white">
            1,224 ADUs approved across 221 towns in year one.
          </strong>
        </p>

        <p className="text-gray-300 leading-relaxed mb-6">
          That&apos;s a 75% approval rate on 1,639 applications. For context,
          Massachusetts is outpacing California&apos;s per-capita rate from their
          first year of ADU reform by 1.27x.
        </p>

        <p className="text-gray-300 leading-relaxed mb-8">
          The law is working. But not evenly.
        </p>

        {/* NEW SECTION: State tracker confirmation */}
        <h2 className="text-2xl font-bold text-white mt-10 mb-4">
          The state just confirmed the numbers
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
          </a>
          , citing the same 1,224 approved ADUs. It&apos;s built on the same
          EOHLC survey data that powers this site — which means the numbers
          you&apos;ve been reading here are the same numbers the Governor&apos;s
          office is using.
        </p>

        <p className="text-gray-300 leading-relaxed mb-4">
          The state tracker is a good step. But if you&apos;ve tried to use it,
          you&apos;ve probably noticed the gaps: no searchable table, no
          town-level approval rates, no per-capita normalization, and a map with
          some display quirks. That&apos;s part of why ADU Pulse exists — to turn
          the raw data into something you can actually use.
        </p>

        <p className="text-gray-300 leading-relaxed mb-8">
          For a deeper look at how the state&apos;s tracker compares to national
          data and where Massachusetts ranks nationally, see our{" "}
          <a
            className="text-blue-400 hover:underline"
            href="/blog/massachusetts-adu-national-comparison"
          >
            full national comparison
          </a>
          .
        </p>

        <h2 className="text-2xl font-bold text-white mt-10 mb-4">
          Some towns rubber-stamp. Others stall.
        </h2>

        <p className="text-gray-300 leading-relaxed mb-4">
          <strong className="text-emerald-400">100% approval rate:</strong>{" "}
          Nantucket (27), Lowell (26), Fairhaven (18), Harwich (15)
        </p>

        <p className="text-gray-300 leading-relaxed mb-6">
          <strong className="text-red-400">Under 25% approval rate:</strong>{" "}
          Gardner (0%), Barnstable (19%), Danvers (22%)
        </p>

        <p className="text-gray-300 leading-relaxed mb-4">
          Barnstable is the outlier that should concern policymakers. They
          received 31 applications—real demand—but only approved 6. That&apos;s
          not a lack of interest. That&apos;s friction.
        </p>

        <p className="text-gray-300 leading-relaxed mb-4">
          Meanwhile, Gardner has approved zero out of seven applications. The law
          says ADUs are allowed by right. Someone should ask Gardner what&apos;s
          happening.
        </p>

        {/* UPDATED: Lowell/Belvidere detail */}
        <p className="text-gray-300 leading-relaxed mb-8">
          Lowell may be the most interesting story in the data. A significant
          share of its 26 permits came from the Belvidere neighborhood — the same
          area where residents vocally opposed the city&apos;s ADU ordinance in
          2023. Two years later, those same neighborhoods are among the most
          active ADU builders in the state. When the economics work, initial
          skepticism often gives way to practical engagement.
        </p>

        <h2 className="text-2xl font-bold text-white mt-10 mb-4">
          Urban and suburban ADUs look completely different
        </h2>

        <p className="text-gray-300 leading-relaxed mb-4">
          In dense cities, ADUs mean basement conversions:
        </p>

        <ul className="text-gray-300 mb-6 space-y-1">
          <li>
            <a className="text-blue-400 hover:underline" href="/revere">
              Revere
            </a>
            : 100% attached
          </li>
          <li>
            <a className="text-blue-400 hover:underline" href="/boston">
              Boston
            </a>
            : 84% attached
          </li>
          <li>
            <a className="text-blue-400 hover:underline" href="/milton">
              Milton
            </a>
            : 96% attached
          </li>
        </ul>

        <p className="text-gray-300 leading-relaxed mb-4">
          In suburban and Cape towns, ADUs mean backyard cottages:
        </p>

        <ul className="text-gray-300 mb-6 space-y-1">
          <li>Harwich: 100% detached</li>
          <li>Nantucket: 89% detached</li>
          <li>Edgartown: 100% detached</li>
        </ul>

        <p className="text-gray-300 leading-relaxed mb-8">
          This matters for cost estimates. A basement conversion might run $50K.
          A detached new build can exceed $500K. Same law, completely different
          projects.
        </p>

        <h2 className="text-2xl font-bold text-white mt-10 mb-4">
          The Revere story no one&apos;s talking about
        </h2>

        <p className="text-gray-300 leading-relaxed mb-4">
          When I scraped{" "}
          <a className="text-blue-400 hover:underline" href="/revere">
            Revere&apos;s permit portal
          </a>
          , I found 33 ADU permits—nearly double what the state survey reported
          (17).
        </p>

        <p className="text-gray-300 leading-relaxed mb-4">
          But here&apos;s the interesting part: at least 4 of those permits
          explicitly mention &quot;legalizing work done without permits&quot; or
          &quot;correcting violations.&quot;
        </p>

        <p className="text-gray-300 leading-relaxed mb-4">
          Revere&apos;s ADU wave isn&apos;t just new construction. It&apos;s a{" "}
          <strong className="text-white">legalization wave</strong>. Homeowners
          who built unpermitted units years ago are now coming into compliance.
        </p>

        <p className="text-gray-300 leading-relaxed mb-8">
          This is the law working exactly as intended—bringing shadow housing
          into the light.
        </p>

        <h2 className="text-2xl font-bold text-white mt-10 mb-4">
          Cost variance is massive
        </h2>

        <p className="text-gray-300 leading-relaxed mb-4">
          Looking at{" "}
          <a className="text-blue-400 hover:underline" href="/lexington">
            Lexington
          </a>{" "}
          permits with cost data:
        </p>

        <ul className="text-gray-300 mb-6 space-y-1">
          <li>Low end: ~$4/sq ft (minimal basement work)</li>
          <li>High end: ~$635/sq ft (full detached new construction)</li>
        </ul>

        <p className="text-gray-300 leading-relaxed mb-8">
          That&apos;s not a typo. The range is 150x. Homeowners planning budgets
          based on &quot;average ADU cost&quot; articles are in for a surprise.
          The type of ADU—not the town—is the biggest cost driver.
        </p>

        <h2 className="text-2xl font-bold text-white mt-10 mb-4">
          Wealthy suburbs tell different stories
        </h2>

        <p className="text-gray-300 leading-relaxed mb-4">
          Both Lexington and Newton are affluent suburbs with strong ADU demand.
        </p>

        <ul className="text-gray-300 mb-6 space-y-1">
          <li>
            <strong className="text-white">Lexington:</strong> 6 submitted, 6
            approved (100%)
          </li>
          <li>
            <strong className="text-white">Newton:</strong> 40 submitted, 18
            approved (45%)
          </li>
        </ul>

        <p className="text-gray-300 leading-relaxed mb-8">
          Same demographics. Same housing pressure. Very different outcomes.{" "}
          <a className="text-blue-400 hover:underline" href="/newton">
            Newton&apos;s
          </a>{" "}
          approval rate suggests something in their process is creating friction
          that Lexington has avoided.
        </p>

        <h2 className="text-2xl font-bold text-white mt-10 mb-4">
          What I&apos;m still trying to figure out
        </h2>

        <p className="text-gray-300 leading-relaxed mb-4">
          The data shows <em>what</em> is happening. It doesn&apos;t always show{" "}
          <em>why</em>.
        </p>

        <ul className="text-gray-300 mb-6 space-y-1">
          <li>
            Why is Barnstable at 19% approval when neighboring Cape towns are
            much higher?
          </li>
          <li>What&apos;s causing Newton&apos;s backlog?</li>
          <li>
            Which builders are doing the most ADU work, and where?
          </li>
          <li>
            How long does it actually take from application to approval?
          </li>
        </ul>

        <p className="text-gray-300 leading-relaxed mb-8">
          I&apos;m adding more towns every week. If you&apos;re a homeowner,
          builder, policymaker, or just curious about housing in Massachusetts,
          I&apos;d love to hear what data would be most useful to you.
        </p>

        <h2 className="text-2xl font-bold text-white mt-10 mb-4">
          The bottom line
        </h2>

        <p className="text-gray-300 leading-relaxed mb-4">
          Massachusetts bet that simplifying ADU rules would increase housing
          production. One year in, that bet is paying off—1,224 new homes
          approved that wouldn&apos;t have existed under the old rules.
        </p>

        <p className="text-gray-300 leading-relaxed mb-8">
          But the data also shows that implementation varies wildly by town. Some
          places have embraced the law. Others appear to be finding ways to slow
          it down.
        </p>

        <p className="text-gray-300 leading-relaxed mb-4">
          Transparency helps. That&apos;s why I built this.
        </p>

        <p className="text-gray-300 leading-relaxed mb-8">
          We&apos;ve since gone deeper on the <em>why</em> behind these
          numbers.{" "}
          <a
            className="text-blue-400 hover:underline"
            href="/blog/massachusetts-adu-compliance-gap"
          >
            Read our consistency gap analysis &rarr;
          </a>
        </p>

        {/* NEW SECTION: National context teaser */}
        <h2 className="text-2xl font-bold text-white mt-10 mb-4">
          Where Massachusetts fits nationally
        </h2>

        <p className="text-gray-300 leading-relaxed mb-4">
          One more data point worth noting: ADUs now account for roughly{" "}
          <strong className="text-white">
            27% of new single-family residential construction
          </strong>{" "}
          in Massachusetts, ranking the state 11th nationally. That&apos;s about
          1 in 4 new housing permits.
        </p>

        <p className="text-gray-300 leading-relaxed mb-8">
          We dug deeper into how Massachusetts compares to California, the
          national leaders, and why the state&apos;s new tracker only tells part
          of the story.{" "}
          <a
            className="text-blue-400 hover:underline"
            href="/blog/massachusetts-adu-national-comparison"
          >
            Read the full analysis →
          </a>
        </p>
      </div>

      {/* CTA Box */}
      <div className="mt-12 bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-blue-500/30 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-2">Explore the data</h3>
        <p className="text-gray-400 mb-4">
          See ADU permits, costs, and approval rates for your town.
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
            href="/estimate"
          >
            Cost Estimator
          </a>
        </div>
      </div>

      <p className="text-gray-600 text-sm mt-8 italic">
        ADU Pulse tracks ADU permits across Massachusetts using statewide EOHLC
        survey data and detailed permit information from 10+ town portals.
      </p>
    </article>
  );
}
