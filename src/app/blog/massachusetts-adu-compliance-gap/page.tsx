import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Why Permit Numbers Don't Tell the Full Story: Inside Massachusetts' ADU Consistency Gap | ADU Pulse",
  description:
    "Permit counts measure activity, not access. A provision-by-provision analysis of 28 Massachusetts towns reveals how local bylaws still conflict with state ADU law — even in towns issuing permits.",
};

export default function MassachusettsADUComplianceGap() {
  return (
    <article className="max-w-3xl mx-auto px-4 py-8 md:py-12">
      <a className="text-blue-400 text-sm hover:underline" href="/blog">
        &larr; Back to Blog
      </a>
      <h1 className="text-3xl md:text-4xl font-bold text-white mt-6 mb-4">
        Why Permit Numbers Don&apos;t Tell the Full Story: Inside
        Massachusetts&apos; ADU Consistency Gap
      </h1>
      <div className="flex items-center gap-4 text-sm text-gray-500 mb-8">
        <span>February 22, 2026</span>
        <span>&bull;</span>
        <span>8 min read</span>
        <span>&bull;</span>
        <span>By ADU Pulse Team</span>
      </div>

      <div className="prose prose-invert prose-lg max-w-none">
        <p className="text-gray-300 text-lg leading-relaxed mb-6">
          In January, I published an analysis of what{" "}
          <a
            className="text-blue-400 hover:underline"
            href="/blog/massachusetts-adu-year-one"
          >
            1,224 ADU permits revealed about Massachusetts housing
          </a>
          . The data told a clear story: some towns are embracing the new law,
          others appear to be dragging their feet.
        </p>

        <p className="text-gray-300 leading-relaxed mb-6">
          But permit numbers only tell you <em>what</em> happened. They
          don&apos;t tell you <em>why</em>.
        </p>

        <p className="text-gray-300 leading-relaxed mb-6">
          Over the past several months, I&apos;ve been reading local bylaws
          &mdash; line by line &mdash; and comparing them to what Chapter 150 and
          760 CMR 71.00 actually require. I&apos;ve reviewed every publicly
          available Attorney General decision on ADU bylaws issued since the law
          took effect. And I&apos;ve built a structured consistency tracker that
          maps specific provisions in 28 towns against state law.
        </p>

        <p className="text-gray-300 leading-relaxed mb-8">
          What I found is that the gap between state law and local
          implementation is wider than the permit numbers suggest &mdash; and
          more patterned than most people realize.
        </p>

        {/* ── The permit data has a blind spot ── */}
        <h2 className="text-2xl font-bold text-white mt-10 mb-4">
          The permit data has a blind spot
        </h2>

        <p className="text-gray-300 leading-relaxed mb-6">
          When the state reports that a town approved 18 ADUs, that sounds like
          the system is working. And for that town, it might be. But the number
          doesn&apos;t tell you whether the town&apos;s bylaw also requires a
          minimum lot size that the state says is prohibited. It doesn&apos;t
          tell you whether the town restricts ADUs to single-family lots when
          the state allows them on any lot with a principal dwelling. And it
          doesn&apos;t tell you whether a builder trying to put up a detached
          modular ADU would hit a provision that appears to conflict with state
          law.
        </p>

        <p className="text-gray-300 leading-relaxed mb-6">
          <strong className="text-white">
            Permit counts measure activity. They don&apos;t measure access.
          </strong>
        </p>

        <p className="text-gray-300 leading-relaxed mb-8">
          A town can issue permits <em>and</em> have bylaw provisions that
          discourage or block categories of projects that should be allowed.
          These aren&apos;t hypotheticals &mdash; the Attorney General&apos;s
          office has now issued rulings on ADU bylaws in towns including Canton,
          Leicester, East Bridgewater, Hanson, Wilbraham, Upton, and most
          recently Southborough, and in every case, provisions were disapproved
          because they conflicted with state law.
        </p>

        {/* ── A pattern is emerging in AG decisions ── */}
        <h2 className="text-2xl font-bold text-white mt-10 mb-4">
          A pattern is emerging in AG decisions
        </h2>

        <p className="text-gray-300 leading-relaxed mb-6">
          When you read the AG decisions as a collection rather than
          individually, the same types of provisions get struck down again and
          again. Here&apos;s what keeps appearing:
        </p>

        <p className="text-gray-300 leading-relaxed mb-4">
          <strong className="text-white">
            Minimum lot size requirements.
          </strong>{" "}
          Chapter 150 and the implementing regulations do not allow towns to
          require a minimum lot size for a protected use ADU. Canton&apos;s
          bylaw included such a requirement. The AG disapproved it in June
          2025. EOHLC now specifically references the Canton decision in its FAQ
          as guidance for other towns.
        </p>

        <p className="text-gray-300 leading-relaxed mb-4">
          <strong className="text-white">
            Single-family-only restrictions.
          </strong>{" "}
          Several towns attempted to limit ADUs to lots containing only
          single-family dwellings. State law allows protected use ADUs on any
          lot with a principal dwelling &mdash; including two-family and
          multi-family properties. The AG has disapproved single-family-only
          language in multiple decisions, including East Bridgewater (April
          2025) and Wilbraham (December 2025, Case #11778).
        </p>

        <p className="text-gray-300 leading-relaxed mb-4">
          <strong className="text-white">Bedroom limitations.</strong>{" "}
          Leicester&apos;s bylaw capped ADUs at two bedrooms. The AG
          disapproved this provision in May 2025, citing G.L. c. 40A &sect;
          3&apos;s prohibition on regulating the interior area of a
          single-family residential building. Bedroom caps also function as
          occupancy restrictions under 760 CMR 71.00.
        </p>

        <p className="text-gray-300 leading-relaxed mb-4">
          <strong className="text-white">
            Special permit requirements.
          </strong>{" "}
          The state law is clear that protected use ADUs are allowed by right,
          not by special permit. Yet several towns adopted bylaws that routed
          ADU applications through discretionary special permit processes.
          Hanson&apos;s bylaw, for example, included special permit language
          that the AG disapproved because it conflicted with the by-right
          standard.
        </p>

        <p className="text-gray-300 leading-relaxed mb-4">
          <strong className="text-white">
            Parking mandates beyond half-mile.
          </strong>{" "}
          State regulations prohibit requiring parking for ADUs located within
          half a mile of a public transit station. Wilbraham&apos;s bylaw
          required one parking space for all ADUs regardless of location
          &mdash; the AG disapproved the provision as written.
        </p>

        <p className="text-gray-300 leading-relaxed mb-8">
          <strong className="text-white">Restrictions on ADU type.</strong> The
          most recent AG decision, issued February 17, 2026, addressed
          Southborough&apos;s ban on using modular homes as ADUs. The AG struck
          the provision, finding that the town&apos;s pre-existing definition
          of &ldquo;mobile homes&rdquo; was broad enough to disqualify
          manufactured housing types that are protected under state law. This
          is significant &mdash; it&apos;s the first AG decision that directly
          addresses construction method restrictions, and it signals that towns
          cannot use definitional games to narrow what types of structures
          qualify as ADUs.
        </p>

        {/* ── What this means in practice ── */}
        <h2 className="text-2xl font-bold text-white mt-10 mb-4">
          What this means in practice
        </h2>

        <p className="text-gray-300 leading-relaxed mb-6">
          Here&apos;s where it gets concrete. Say you&apos;re a builder looking
          at a town with an approval rate above 75%. Looks good on paper. But
          if that town&apos;s bylaw still includes a minimum lot size
          requirement or limits ADUs to single-family lots, you could win
          approval for a basement conversion and get blocked on the detached
          backyard cottage that&apos;s actually your client&apos;s project.
        </p>

        <p className="text-gray-300 leading-relaxed mb-6">
          The Pioneer Institute&apos;s November 2025 report,{" "}
          <em>&ldquo;Beyond Legalization,&rdquo;</em> documented this dynamic
          well. Its author noted that local zoning and permitting practices
          continue to discourage ADU development even after statewide
          legalization, and that per-capita production in Massachusetts remains
          a fraction of California&apos;s rate. One of the builders quoted in
          the report noted that setback and septic rules are eliminating
          potential projects, and that permits remain difficult to obtain in
          some communities.
        </p>

        <p className="text-gray-300 leading-relaxed mb-8">
          This matches what I&apos;m seeing in the bylaw data. The friction
          isn&apos;t always visible in the permit numbers because it operates
          at the <em>discouragement</em> stage &mdash; before an application is
          ever filed. Homeowners who read their town&apos;s bylaw, see a
          provision that appears to restrict their project, and never apply.
          Builders who know from experience which towns will make the process
          difficult. These suppressed projects don&apos;t show up in any
          dataset.
        </p>

        {/* ── The compliance gap is measurable ── */}
        <h2 className="text-2xl font-bold text-white mt-10 mb-4">
          The consistency gap is measurable
        </h2>

        <p className="text-gray-300 leading-relaxed mb-6">
          Across the 28 towns ADU Pulse has profiled so far, I&apos;ve
          identified specific provisions and assigned each a confidence tier
          based on the strength of evidence:
        </p>

        <div className="space-y-3 mb-6">
          <div className="flex items-start gap-3 rounded-lg border border-red-400/30 bg-red-400/5 px-4 py-3">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
            <div>
              <p className="text-red-400 font-semibold text-sm">AG Disapproved</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                The Attorney General has formally ruled that the provision
                conflicts with state law. This is the highest confidence tier.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-lg border border-orange-400/30 bg-orange-400/5 px-4 py-3">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-400 mt-1.5 shrink-0" />
            <div>
              <p className="text-orange-400 font-semibold text-sm">Appears Inconsistent</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                The provision contains language that conflicts with Chapter 150
                or 760 CMR 71.00, but no AG ruling has been issued. This is
                based on statutory analysis, often supported by AG precedent in
                other towns.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-lg border border-amber-400/30 bg-amber-400/5 px-4 py-3">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
            <div>
              <p className="text-amber-400 font-semibold text-sm">Needs Review</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                The provision contains ambiguous language that may or may not
                conflict depending on interpretation.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-lg border border-emerald-400/30 bg-emerald-400/5 px-4 py-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
            <div>
              <p className="text-emerald-400 font-semibold text-sm">Consistent</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                The provision aligns with state law.
              </p>
            </div>
          </div>
        </div>

        <p className="text-gray-300 leading-relaxed mb-6">
          This isn&apos;t a score or a ranking. It&apos;s a
          provision-by-provision mapping with citations, evidence basis, and
          links to source bylaws. Every finding is anchored to specific
          statutory language, not editorial opinion.
        </p>

        <p className="text-gray-300 leading-relaxed mb-8">
          What the data shows is that most towns have at least some provisions
          that warrant scrutiny. Very few are fully consistent with state law
          across every dimension &mdash; lot requirements, ADU types, site plan
          review scope, dimensional standards, parking. The towns that have
          updated their bylaws since the law took effect are generally in
          better shape, but even some of those updates have been partially
          disapproved by the AG.
        </p>

        {/* ── Why this matters now ── */}
        <h2 className="text-2xl font-bold text-white mt-10 mb-4">
          Why this matters now
        </h2>

        <p className="text-gray-300 leading-relaxed mb-6">
          We&apos;re entering year two of statewide ADU legalization. The first
          wave of AG decisions has established clear precedent on several
          provision types. Towns that passed ADU bylaws in 2025 and
          haven&apos;t yet updated them may have provisions on their books that
          have already been disapproved in other communities.
        </p>

        <p className="text-gray-300 leading-relaxed mb-6">
          <strong className="text-white">For homeowners,</strong> this means
          your local bylaw may not be the final word on what you can build. The
          state law overrides provisions that appear inconsistent, whether or
          not the town has formally updated its code.
        </p>

        <p className="text-gray-300 leading-relaxed mb-6">
          <strong className="text-white">For builders,</strong> the consistency
          picture is a market intelligence question. Understanding which towns
          have clean bylaws versus which have provisions that are likely to be
          preempted by state law helps you advise clients, allocate resources,
          and avoid surprises mid-project.
        </p>

        <p className="text-gray-300 leading-relaxed mb-6">
          <strong className="text-white">For policymakers,</strong> the pattern
          in AG decisions is a signal. The same types of provisions keep getting
          struck down. Towns that haven&apos;t yet updated their bylaws can use
          this data to get ahead of the AG review process rather than waiting
          for a formal disapproval.
        </p>

        <p className="text-gray-300 leading-relaxed mb-8">
          And for anyone tracking Massachusetts housing production, the
          takeaway is this: the 1,224 ADUs approved in year one are a
          meaningful start, but the consistency gap suggests the actual
          addressable market for ADU development is significantly larger than
          current production levels indicate. Cleaning up bylaw inconsistencies
          won&apos;t just be a legal exercise &mdash; it should unlock projects
          that are currently being suppressed.
        </p>

        {/* ── What we're building ── */}
        <h2 className="text-2xl font-bold text-white mt-10 mb-4">
          What we&apos;re building
        </h2>

        <p className="text-gray-300 leading-relaxed mb-6">
          ADU Pulse&apos;s consistency tracker now covers 28 Massachusetts towns
          with structured, provision-by-provision analysis. Each profile
          includes the specific bylaw language, the relevant state statute or
          regulation, our confidence assessment, the evidence basis, and source
          links.
        </p>

        <p className="text-gray-300 leading-relaxed mb-6">
          We track AG decisions as they&apos;re issued and update affected town
          profiles. We&apos;re adding new towns based on user demand &mdash;
          Salem, Northampton, Canton, Amherst, and Whitman are next in the
          queue.
        </p>

        <p className="text-gray-300 leading-relaxed mb-8">
          If you&apos;re a builder, lender, or housing policy professional who
          would benefit from structured consistency data, I&apos;d like to hear
          from you. This is the kind of analysis that doesn&apos;t exist
          anywhere else, and I&apos;m building it based on what the market
          actually needs.
        </p>
      </div>

      {/* CTA Box */}
      <div className="mt-12 bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-blue-500/30 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-2">
          Explore the Policy Tracker
        </h3>
        <p className="text-gray-400 mb-4">
          See provision-by-provision consistency analysis for 28 Massachusetts
          towns.
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            className="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium"
            href="/compliance"
          >
            Explore the Policy Tracker &rarr;
          </a>
          <a
            className="inline-flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium"
            href="/blog/massachusetts-adu-year-one"
          >
            Read: What 1,224 ADU Permits Taught Me &rarr;
          </a>
        </div>
      </div>

      <div className="text-gray-600 text-sm mt-8 italic space-y-3">
        <p>
          ADU Pulse tracks ADU permits and analyzes local bylaw consistency
          with state law across Massachusetts. Our consistency analysis is
          provided for informational purposes and does not constitute legal
          advice. For specific legal questions about your town&apos;s bylaws,
          consult a qualified attorney.
        </p>
        <p>
          Data sources: Attorney General bylaw decisions (mass.gov), EOHLC ADU
          Survey Feb 2026, individual town bylaws, 760 CMR 71.00, Chapter 150
          of the Acts of 2024.
        </p>
      </div>
    </article>
  );
}
