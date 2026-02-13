import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Boston Is the Only MA Town Exempt from the State ADU Law. Here's What That Means. | ADU Pulse",
  description:
    "Boston doesn't operate under G.L. c. 40A, making it the only municipality in Massachusetts where the statewide ADU by-right law doesn't apply. Here's what that means for homeowners and builders.",
};

export default function BostonADUExemption() {
  return (
    <article className="max-w-3xl mx-auto px-4 py-8 md:py-12">
      <a className="text-blue-400 text-sm hover:underline" href="/blog">
        &larr; Back to Blog
      </a>
      <h1 className="text-3xl md:text-4xl font-bold text-white mt-6 mb-4">
        Boston Is the Only MA Town Exempt from the State ADU Law. Here&apos;s
        What That Means.
      </h1>
      <div className="flex items-center gap-4 text-sm text-gray-500 mb-8">
        <span>February 13, 2026</span>
        <span>&bull;</span>
        <span>8 min read</span>
        <span>&bull;</span>
        <span>By Nick Welch</span>
      </div>

      <div className="prose prose-invert prose-lg max-w-none">
        <p className="text-gray-300 text-lg leading-relaxed mb-6">
          When Massachusetts legalized accessory dwelling units by right in
          February 2025, it was supposed to apply everywhere. Every city. Every
          town. One simple rule: homeowners can build an ADU up to 900 square
          feet without a special permit.
        </p>

        <p className="text-gray-300 leading-relaxed mb-6">
          But there&apos;s an asterisk. And it&apos;s a big one.
        </p>

        <p className="text-gray-300 leading-relaxed mb-6">
          <strong className="text-white">Boston is exempt.</strong>
        </p>

        <p className="text-gray-300 leading-relaxed mb-8">
          The Affordable Homes Act amended G.L. c. 40A &mdash; the state Zoning
          Act. But Boston doesn&apos;t operate under c. 40A. It never has. Boston
          has its own zoning code, its own process, and its own rules. That means
          the 350 other municipalities in Massachusetts got a streamlined path to
          ADU construction. Boston homeowners got... a workshop.
        </p>

        <h2 className="text-2xl font-bold text-white mt-10 mb-4">
          What Boston&apos;s ADU Program Actually Requires
        </h2>

        <p className="text-gray-300 leading-relaxed mb-4">
          Here&apos;s what building an ADU in Boston looks like compared to the
          rest of the state:
        </p>

        <p className="text-gray-300 leading-relaxed mb-4">
          <strong className="text-white">Owner-occupancy required.</strong> In
          every other town, the state prohibits requiring owners to live on the
          property. In Boston, you must be an owner-occupant. Want to build an
          ADU on a rental property? Not happening.
        </p>

        <p className="text-gray-300 leading-relaxed mb-4">
          <strong className="text-white">
            Internal units only (for now).
          </strong>{" "}
          The current program limits ADUs to conversions within the existing
          footprint of the home &mdash; basements, attics, unused space.
          Detached backyard cottages and additions aren&apos;t yet allowed by
          right. The BPDA is working on zoning updates to change this, but as of
          early 2026 the rules haven&apos;t caught up.
        </p>

        <p className="text-gray-300 leading-relaxed mb-4">
          <strong className="text-white">
            Workshop attendance mandatory.
          </strong>{" "}
          Before your plans are even reviewed, you need to attend a city-run ADU
          workshop. It&apos;s educational, sure. But it&apos;s also a gate that
          doesn&apos;t exist anywhere else in Massachusetts.
        </p>

        <p className="text-gray-300 leading-relaxed mb-8">
          <strong className="text-white">ZBA relief still common.</strong> Even
          with the ADU program, many projects require relief from the Zoning
          Board of Appeal. The city&apos;s own ADU Guidebook acknowledges that
          its designs &ldquo;require permits, and may still need relief granted
          by the Zoning Board of Appeal.&rdquo; That&apos;s the kind of
          discretionary review the state law was designed to eliminate.
        </p>

        <h2 className="text-2xl font-bold text-white mt-10 mb-4">
          The Numbers Tell the Story
        </h2>

        <p className="text-gray-300 leading-relaxed mb-4">
          Boston reported 69 ADU applications in the EOHLC survey &mdash; the
          highest raw number of any municipality. But context matters. Boston has
          roughly 300,000 housing units. Towns a fraction of its size are
          producing ADU applications at far higher per-capita rates because the
          state law made it simple.
        </p>

        <p className="text-gray-300 leading-relaxed mb-8">
          The irony is hard to miss: the city with the most severe housing
          crisis in the state is the one place where the housing law doesn&apos;t
          apply.
        </p>

        <h2 className="text-2xl font-bold text-white mt-10 mb-4">
          What&apos;s Coming
        </h2>

        <p className="text-gray-300 leading-relaxed mb-4">
          The BPDA launched an ADU Guidebook in late 2024 with
          neighborhood-specific designs, and a companion zoning initiative called
          &ldquo;Neighborhood Housing&rdquo; aims to make external ADUs possible
          without zoning relief. Mayor Wu has publicly committed to removing
          barriers.
        </p>

        <p className="text-gray-300 leading-relaxed mb-8">
          But commitments aren&apos;t code. Until Boston&apos;s zoning actually
          changes, homeowners there face a fundamentally different &mdash; and
          more restrictive &mdash; ADU landscape than homeowners in every other
          Massachusetts municipality.
        </p>

        <h2 className="text-2xl font-bold text-white mt-10 mb-4">
          Why This Matters for ADU Builders and Investors
        </h2>

        <p className="text-gray-300 leading-relaxed mb-4">
          If you&apos;re a builder marketing ADU construction services, Boston
          requires a different playbook. Your clients can&apos;t just file for a
          building permit the way they can in Newton or Worcester. The workshop
          requirement, owner-occupancy rule, and potential ZBA involvement all
          add time and cost.
        </p>

        <p className="text-gray-300 leading-relaxed mb-4">
          If you&apos;re a homeowner in Boston considering an ADU, the
          city&apos;s loan program (zero-interest up to $30,000) is a genuine
          advantage that doesn&apos;t exist elsewhere. But go in with realistic
          expectations about the process.
        </p>

        <p className="text-gray-300 leading-relaxed mb-8">
          We track Boston&apos;s bylaw provisions alongside every other
          municipality in our{" "}
          <a
            className="text-blue-400 hover:underline"
            href="/compliance/boston"
          >
            Bylaw Consistency Tracker
          </a>
          . It&apos;s the only town in the tracker where &ldquo;inconsistent
          with state law&rdquo; means something different &mdash; because the
          state law doesn&apos;t apply.
        </p>
      </div>

      {/* CTA Box */}
      <div className="mt-12 bg-gradient-to-r from-red-900/40 to-purple-900/40 border border-red-500/30 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-2">
          See Boston&apos;s full bylaw analysis
        </h3>
        <p className="text-gray-400 mb-4">
          ADU Pulse tracks permit data, bylaw compliance, and AG disapprovals
          across Massachusetts.
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-medium"
            href="/compliance/boston"
          >
            Boston Bylaw Analysis &rarr;
          </a>
          <a
            className="inline-flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium"
            href="/compliance"
          >
            Full Compliance Tracker
          </a>
        </div>
      </div>

      <p className="text-gray-600 text-sm mt-8 italic">
        ADU Pulse tracks permit data, bylaw compliance, and AG disapprovals
        across Massachusetts. Explore the full{" "}
        <a className="text-blue-400 hover:underline" href="/compliance">
          Bylaw Consistency Tracker
        </a>
        .
      </p>
    </article>
  );
}
