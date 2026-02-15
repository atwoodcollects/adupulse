import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "3 Towns the AG Struck Down — What Sudbury, Leicester, and Canton Got Wrong | ADU Pulse",
  description:
    "Sudbury, Leicester, and Canton had 7 ADU bylaw provisions disapproved by the Massachusetts Attorney General. Here's what they tried, why it failed, and what every town should learn.",
};

export default function AGDisapprovals() {
  return (
    <article className="max-w-3xl mx-auto px-4 py-8 md:py-12">
      <a className="text-blue-400 text-sm hover:underline" href="/blog">
        &larr; Back to Blog
      </a>
      <h1 className="text-3xl md:text-4xl font-bold text-white mt-6 mb-4">
        3 Towns the AG Struck Down &mdash; What Sudbury, Leicester, and Canton
        Got Wrong
      </h1>
      <div className="flex items-center gap-4 text-sm text-gray-500 mb-8">
        <span>February 13, 2026</span>
        <span>&bull;</span>
        <span>9 min read</span>
        <span>&bull;</span>
        <span>By Nick Welch</span>
      </div>

      <div className="prose prose-invert prose-lg max-w-none">
        <p className="text-gray-300 text-lg leading-relaxed mb-6">
          Since the ADU law took effect in February 2025, the Massachusetts
          Attorney General&apos;s Office has been reviewing town bylaws &mdash;
          and rejecting the ones that go too far. Three towns have become case
          studies in what happens when local zoning tries to override state law.
        </p>

        <p className="text-gray-300 leading-relaxed mb-8">
          Between them, Sudbury, Leicester, and Canton had{" "}
          <strong className="text-white">7 provisions disapproved</strong> by
          the AG. Here&apos;s what they tried, why it failed, and what every
          other town should learn from it.
        </p>

        {/* ── SUDBURY ── */}
        <h2 className="text-2xl font-bold text-white mt-10 mb-4">
          Sudbury: 3 Disapprovals (October 2025)
        </h2>

        <p className="text-gray-300 leading-relaxed mb-4">
          Sudbury&apos;s Planning Board went to the May 2025 Special Town
          Meeting with an ADU bylaw designed to maximize local control. The AG
          struck down three provisions and partially struck a fourth.
        </p>

        <p className="text-gray-300 leading-relaxed mb-4">
          <strong className="text-white">
            Single-family dwelling restriction &mdash; Disapproved.
          </strong>{" "}
          Sudbury tried to limit ADUs to lots that currently have single-family
          homes on them. The AG said no: ADUs must be allowed on any lot in a
          single-family residential zoning district, regardless of what&apos;s
          already built there. A duplex on a lot zoned single-family? Still
          eligible for an ADU.
        </p>

        <p className="text-gray-300 leading-relaxed mb-4">
          <strong className="text-white">
            Minimum lot size requirements &mdash; Disapproved.
          </strong>{" "}
          The bylaw set minimum lot sizes for ADU construction. The AG deleted
          the provisions entirely. State law and 760 CMR 71.03(4)(a) are clear:
          no minimum lot size for protected use ADUs.
        </p>

        <p className="text-gray-300 leading-relaxed mb-4">
          <strong className="text-white">
            Principal dwelling setback applied to ADUs &mdash; Disapproved.
          </strong>{" "}
          Sudbury applied the same setback requirements to ADUs that apply to
          principal dwellings. The AG ruled that ADUs cannot be subject to
          stricter dimensional requirements than single-family homes under 760
          CMR 71.05.
        </p>

        <p className="text-gray-300 leading-relaxed mb-4">
          <strong className="text-white">
            Parking provisions &mdash; Partially disapproved.
          </strong>{" "}
          Portions of Sudbury&apos;s parking requirements exceeded the state cap
          of one space per ADU. The AG deleted the offending language.
        </p>

        <p className="text-gray-300 leading-relaxed mb-8">
          The result: Sudbury&apos;s bylaw now has visible scars where the
          AG&apos;s red pen hit. The remaining provisions &mdash; including an
          &ldquo;architecturally harmonious&rdquo; design requirement &mdash;
          survived review but still sit in gray-area territory.
        </p>

        {/* ── LEICESTER ── */}
        <h2 className="text-2xl font-bold text-white mt-10 mb-4">
          Leicester: 3 Disapprovals (May 2025)
        </h2>

        <p className="text-gray-300 leading-relaxed mb-4">
          Leicester was one of the earliest AG decisions and set important
          precedents that other towns ignored at their cost.
        </p>

        <p className="text-gray-300 leading-relaxed mb-4">
          <strong className="text-white">
            Bedroom cap &mdash; Disapproved.
          </strong>{" "}
          Leicester tried to limit ADUs to two bedrooms. The AG cited G.L. c.
          40A &sect;3&apos;s prohibition on regulating the interior area of
          single-family residential buildings. You can cap square footage at 900.
          You cannot dictate how that space is divided.
        </p>

        <p className="text-gray-300 leading-relaxed mb-4">
          <strong className="text-white">
            Single-family restriction &mdash; Disapproved.
          </strong>{" "}
          Same issue as Sudbury. Leicester tried to limit ADUs to single-family
          lots only. The AG applied the same reasoning: single-family zoning
          district is what matters, not the current use.
        </p>

        <p className="text-gray-300 leading-relaxed mb-4">
          <strong className="text-white">
            Dimensional noncompliance &mdash; Disapproved.
          </strong>{" "}
          Leicester&apos;s dimensional requirements exceeded what state law
          allows for protected use ADUs.
        </p>

        <p className="text-gray-300 leading-relaxed mb-8">
          The Leicester decision became the reference point the AG cited when
          disapproving similar provisions in other towns. Worcester&apos;s
          current 2-bedroom cap is essentially the same provision Leicester got
          struck down for &mdash; it just hasn&apos;t been challenged yet
          because cities&apos; ordinances aren&apos;t subject to AG review.
        </p>

        {/* ── CANTON ── */}
        <h2 className="text-2xl font-bold text-white mt-10 mb-4">
          Canton: 1 Disapproval (June 2025)
        </h2>

        <p className="text-gray-300 leading-relaxed mb-4">
          Canton&apos;s case was narrower but equally important.
        </p>

        <p className="text-gray-300 leading-relaxed mb-4">
          <strong className="text-white">
            Minimum lot size &mdash; Disapproved.
          </strong>{" "}
          Canton required a minimum lot size for ADU construction. The AG
          disapproved it, reinforcing the principle established in Leicester: the
          state does not allow minimum lot size requirements for protected use
          ADUs.
        </p>

        <p className="text-gray-300 leading-relaxed mb-8">
          Canton&apos;s decision is notable because EOHLC specifically
          references it in their FAQ as guidance for other municipalities. If
          your town&apos;s bylaw has a minimum lot size requirement for ADUs,
          it&apos;s unenforceable &mdash; and the AG has said so explicitly.
        </p>

        {/* ── THE PATTERN ── */}
        <h2 className="text-2xl font-bold text-white mt-10 mb-4">
          The Pattern
        </h2>

        <p className="text-gray-300 leading-relaxed mb-4">
          Across all three towns, the AG&apos;s disapprovals cluster around a
          few themes:
        </p>

        <p className="text-gray-300 leading-relaxed mb-4">
          <strong className="text-white">
            You can&apos;t limit where ADUs go based on existing use.
          </strong>{" "}
          The state law applies to zoning districts, not individual properties.
          If single-family homes are allowed in a district (even by special
          permit), ADUs are allowed there by right.
        </p>

        <p className="text-gray-300 leading-relaxed mb-4">
          <strong className="text-white">
            You can&apos;t impose stricter dimensional rules on ADUs than on
            houses.
          </strong>{" "}
          Setbacks, lot sizes, and other dimensional requirements for ADUs
          cannot exceed those applied to the principal dwelling.
        </p>

        <p className="text-gray-300 leading-relaxed mb-4">
          <strong className="text-white">
            You can&apos;t regulate the interior.
          </strong>{" "}
          Bedroom caps, interior layout requirements, and similar restrictions
          conflict with &sect;3&apos;s prohibition on regulating interior area.
        </p>

        <p className="text-gray-300 leading-relaxed mb-8">
          <strong className="text-white">
            You can&apos;t require more than one parking space.
          </strong>{" "}
          The state caps it. Towns that tried to exceed it got caught.
        </p>

        {/* ── WHO'S NEXT ── */}
        <h2 className="text-2xl font-bold text-white mt-10 mb-4">
          Who&apos;s Next?
        </h2>

        <p className="text-gray-300 leading-relaxed mb-4">
          Several towns currently have provisions on their books that match
          exactly what the AG struck down:
        </p>

        <p className="text-gray-300 leading-relaxed mb-4">
          <strong className="text-white">Needham</strong> has 4 inconsistent
          provisions including owner-occupancy and a special permit requirement
          that&apos;s produced only 12 ADUs in three years.{" "}
          <strong className="text-white">Milton</strong> still has
          owner-occupancy and family-only restrictions in its unreformed bylaw.{" "}
          <strong className="text-white">Plymouth</strong> and{" "}
          <strong className="text-white">Nantucket</strong> have provisions the
          AG hasn&apos;t reviewed yet but that mirror disapproved language from
          other towns.
        </p>

        <p className="text-gray-300 leading-relaxed mb-4">
          These provisions are technically unenforceable regardless of whether
          the AG has formally reviewed them. But having them on the books creates
          confusion for homeowners, delays for builders, and legal risk for towns
          that try to enforce them.
        </p>

        <p className="text-gray-300 leading-relaxed mb-8">
          We track every AG disapproval and every inconsistent provision across
          25 communities in our{" "}
          <a
            className="text-blue-400 hover:underline"
            href="/compliance"
          >
            Bylaw Consistency Tracker
          </a>
          . If you&apos;re a builder, planner, or homeowner trying to understand
          where your town stands, it&apos;s all there.
        </p>
      </div>

      {/* CTA Box */}
      <div className="mt-12 bg-gradient-to-r from-red-900/40 to-amber-900/40 border border-red-500/30 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-2">
          Explore the AG disapprovals
        </h3>
        <p className="text-gray-400 mb-4">
          ADU Pulse tracks permit data, bylaw consistency, and AG disapprovals
          across Massachusetts.
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-medium"
            href="/compliance"
          >
            Bylaw Consistency Tracker &rarr;
          </a>
          <a
            className="inline-flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium"
            href="/compliance/sudbury"
          >
            Sudbury Analysis
          </a>
          <a
            className="inline-flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium"
            href="/compliance/leicester"
          >
            Leicester Analysis
          </a>
        </div>
      </div>

      <p className="text-gray-600 text-sm mt-8 italic">
        ADU Pulse tracks permit data, bylaw consistency, and AG disapprovals
        across Massachusetts. Explore the full{" "}
        <a className="text-blue-400 hover:underline" href="/compliance">
          Bylaw Consistency Tracker
        </a>
        .
      </p>
    </article>
  );
}
