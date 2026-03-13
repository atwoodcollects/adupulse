import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Your ADU Is Legal. Your Septic System Might Not Be. | ADU Pulse",
  description:
    "Massachusetts legalized ADUs statewide. What didn't change is what's underground. We analyzed Board of Health septic regulations across five towns — here's what we found.",
};

export default function MassachusettsADUSepticConstraints() {
  return (
    <article className="max-w-3xl mx-auto px-4 py-8 md:py-12">
      <a className="text-blue-400 text-sm hover:underline" href="/blog">
        ← Back to Blog
      </a>
      <h1 className="text-3xl md:text-4xl font-bold text-white mt-6 mb-4">
        Your ADU Is Legal. Your Septic System Might Not Be.
      </h1>
      <div className="flex items-center gap-4 text-sm text-gray-500 mb-8">
        <span>March 7, 2026</span>
        <span>•</span>
        <span>5 min read</span>
        <span>•</span>
        <span>By ADU Pulse Team</span>
      </div>

      <div className="prose prose-invert prose-lg max-w-none">
        <p className="text-gray-300 text-lg leading-relaxed mb-6">
          Massachusetts legalized ADUs statewide in February 2024. What the law
          didn&apos;t change is what&apos;s underground.
        </p>

        <p className="text-gray-300 leading-relaxed mb-6">
          For the roughly 1.3 million Massachusetts households on private septic
          systems, the question of whether you can build an ADU isn&apos;t just a
          zoning question. It&apos;s a soil question. A groundwater question. A
          Board of Health question — and that answer varies dramatically
          depending on which town you&apos;re in.
        </p>

        <p className="text-gray-300 leading-relaxed mb-8">
          We spent the past several weeks pulling Board of Health regulations for
          five Massachusetts towns and comparing them against the Title 5 state
          baseline. What we found illustrates why &quot;ADUs are now legal in
          Massachusetts&quot; is only half the story.
        </p>

        <h2 className="text-2xl font-bold text-white mt-10 mb-4">
          The Same State Law, Five Very Different Realities
        </h2>

        <p className="text-gray-300 leading-relaxed mb-6">
          Under M.G.L. c. 111, § 31, local Boards of Health are authorized to
          adopt septic regulations stricter than the state&apos;s Title 5
          baseline. Most do. Some exercise that authority aggressively. The
          result is a patchwork of local rules that can make or break an ADU
          project before a shovel hits the ground.
        </p>

        {/* Comparison Table */}
        <div className="overflow-x-auto mb-6">
          <div className="min-w-[600px] border border-gray-700 rounded-lg overflow-hidden">
            <div className="grid grid-cols-4 bg-gray-800 text-sm font-semibold text-gray-300">
              <div className="px-4 py-3">Town</div>
              <div className="px-4 py-3">Wetland Setback</div>
              <div className="px-4 py-3">I/A Required?</div>
              <div className="px-4 py-3">Key Constraint</div>
            </div>
            <div className="grid grid-cols-4 text-sm text-gray-300 border-t border-gray-700">
              <div className="px-4 py-3 font-medium text-white">
                <a className="text-blue-400 hover:underline" href="/infrastructure/nantucket">Nantucket</a>
              </div>
              <div className="px-4 py-3">300 ft</div>
              <div className="px-4 py-3">Yes (all NSA new construction + repairs)</div>
              <div className="px-4 py-3">6× state minimum; mandatory advanced treatment</div>
            </div>
            <div className="grid grid-cols-4 text-sm text-gray-300 border-t border-gray-700 bg-gray-800/50">
              <div className="px-4 py-3 font-medium text-white">
                <a className="text-blue-400 hover:underline" href="/infrastructure/falmouth">Falmouth</a>
              </div>
              <div className="px-4 py-3">100 ft</div>
              <div className="px-4 py-3">Yes (16 of 19 watersheds)</div>
              <div className="px-4 py-3">Doubled setback + mandatory I/A for ~86% of residential land</div>
            </div>
            <div className="grid grid-cols-4 text-sm text-gray-300 border-t border-gray-700">
              <div className="px-4 py-3 font-medium text-white">
                <a className="text-blue-400 hover:underline" href="/infrastructure/duxbury">Duxbury</a>
              </div>
              <div className="px-4 py-3">150 ft</div>
              <div className="px-4 py-3">No</div>
              <div className="px-4 py-3">3× state minimum; no variance relief for ADUs</div>
            </div>
            <div className="grid grid-cols-4 text-sm text-gray-300 border-t border-gray-700 bg-gray-800/50">
              <div className="px-4 py-3 font-medium text-white">
                <a className="text-blue-400 hover:underline" href="/infrastructure/upton">Upton</a>
              </div>
              <div className="px-4 py-3">100 ft</div>
              <div className="px-4 py-3">No</div>
              <div className="px-4 py-3">Doubled setback; new construction banned in slow-perc soils</div>
            </div>
            <div className="grid grid-cols-4 text-sm text-gray-300 border-t border-gray-700">
              <div className="px-4 py-3 font-medium text-white">
                <a className="text-blue-400 hover:underline" href="/infrastructure/east-bridgewater">East Bridgewater</a>
              </div>
              <div className="px-4 py-3">50 ft</div>
              <div className="px-4 py-3">No</div>
              <div className="px-4 py-3">Title 5 baseline; no local modifications</div>
            </div>
          </div>
        </div>

        <p className="text-gray-300 leading-relaxed mb-8">
          The state Title 5 baseline wetland setback is 50 feet. Nantucket&apos;s
          is 300 feet — six times higher. East Bridgewater follows the state
          baseline exactly and has explicitly said so in its regulations. These
          towns are 60 miles apart.
        </p>

        <h2 className="text-2xl font-bold text-white mt-10 mb-4">
          What This Means for an ADU Project
        </h2>

        <p className="text-gray-300 leading-relaxed mb-6">
          An ADU is treated as new construction under Title 5 and under most
          local Board of Health regulations. That matters for two reasons.
        </p>

        <p className="text-gray-300 leading-relaxed mb-6">
          First, new construction typically cannot access the variance and repair
          pathways that exist for upgrading existing systems. In Duxbury, town
          counsel confirmed in March 2025 that ADU projects must meet all local
          standards without variances — the same relief that homeowners routinely
          receive for setback and groundwater provisions is unavailable for ADU
          construction.
        </p>

        <p className="text-gray-300 leading-relaxed mb-8">
          Second, local rules that exceed the state baseline apply in full. A
          150-foot wetland buffer in Duxbury isn&apos;t a suggestion — it&apos;s
          the law, and it can eliminate a significant portion of buildable area on
          a lot before the zoning question even comes up.
        </p>

        <h2 className="text-2xl font-bold text-white mt-10 mb-4">
          The Falmouth Case: A Hidden Opportunity
        </h2>

        <p className="text-gray-300 leading-relaxed mb-6">
          One finding is counterintuitive enough to be worth highlighting
          directly.
        </p>

        <p className="text-gray-300 leading-relaxed mb-6">
          Falmouth requires Best Available Nitrogen Reducing Technology — an
          innovative/alternative septic system achieving ≤10 mg/L total
          nitrogen — for all new construction in Nitrogen Sensitive Areas. That
          covers approximately 86% of the town&apos;s developed residential land.
          These systems cost $20,000–$40,000 above a conventional system.
        </p>

        <p className="text-gray-300 leading-relaxed mb-6">
          That sounds like a pure cost burden. But Falmouth is also working
          through a DEP watershed permitting process that, if watershed permits
          are not obtained, will require all homes in affected watersheds to
          upgrade to the same standard by approximately 2030 — regardless of
          whether they&apos;re adding an ADU.
        </p>

        <p className="text-gray-300 leading-relaxed mb-8">
          A homeowner who builds an ADU today and installs the required I/A
          system locks in a 15–20 year sewer deferral credit under Falmouth&apos;s
          regulations. They also avoid doing the upgrade twice. In a town where
          this cost is coming for most properties anyway, adding an ADU is a way
          to get ahead of it on a tenant&apos;s timeline — rather than as a
          standalone expense.
        </p>

        <h2 className="text-2xl font-bold text-white mt-10 mb-4">
          The Question Nobody Is Asking
        </h2>

        <p className="text-gray-300 leading-relaxed mb-6">
          There&apos;s an emerging practice in Massachusetts called bedroom
          reallocation: reducing the main house bedroom count to allocate septic
          capacity to the ADU, rather than expanding the system. A four-bedroom
          house adds a one-bedroom ADU, converts a den back to open space, and
          ties the ADU into the existing system within its permitted capacity.
        </p>

        <p className="text-gray-300 leading-relaxed mb-6">
          Builders working in Sharon, Mansfield, and other towns report this is
          accepted practice. But the policy is inconsistent across towns, and in
          many cases it isn&apos;t written down anywhere. Whether a given Board of
          Health treats this as a septic modification requiring BoH review, or
          simply a building code change handled by the building inspector,
          varies — and it can be the difference between an ADU that pencils out
          and one that doesn&apos;t.
        </p>

        <p className="text-gray-300 leading-relaxed mb-8">
          We&apos;re tracking this across every town we analyze. Whether local
          Boards of Health have clear policies for ADU septic feasibility
          varies widely — and that&apos;s a gap worth closing, either through
          EOHLC guidance or through explicit BoH policy adoption.
        </p>

        <h2 className="text-2xl font-bold text-white mt-10 mb-4">
          What We&apos;re Building
        </h2>

        <p className="text-gray-300 leading-relaxed mb-6">
          ADU Pulse&apos;s Infrastructure Tracker documents how local Board of
          Health septic regulations compare to the Title 5 state baseline,
          provision by provision, for towns across Massachusetts. We&apos;re
          starting with the towns where the constraints are most acute and
          expanding from there.
        </p>

        <p className="text-gray-300 leading-relaxed mb-8">
          If you&apos;re a builder, engineer, or lender working on ADU projects
          in Massachusetts — or a policy researcher trying to understand why ADU
          production rates vary so dramatically town to town — this is the
          analysis that&apos;s been missing.
        </p>

        <p className="text-gray-300 leading-relaxed mb-8">
          <a
            className="text-blue-400 hover:underline"
            href="/infrastructure"
          >
            Explore the Infrastructure Tracker →
          </a>
        </p>
      </div>

      {/* CTA Box */}
      <div className="mt-12 bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-blue-500/30 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-2">Explore the data</h3>
        <p className="text-gray-400 mb-4">
          See septic constraints and ADU feasibility analysis for your town.
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium"
            href="/infrastructure"
          >
            Infrastructure Tracker →
          </a>
          <a
            className="inline-flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium"
            href="/compliance"
          >
            Policy Tracker →
          </a>
        </div>
      </div>

      <p className="text-gray-600 text-sm mt-8 italic">
        ADU Pulse tracks ADU permit data and bylaw consistency with state law
        across 350+ Massachusetts municipalities. Septic analysis reflects Board
        of Health regulations as of the dates noted in each town profile. This is
        not legal advice. Consult a licensed engineer and attorney before relying
        on this analysis for a specific project.
      </p>
    </article>
  );
}
