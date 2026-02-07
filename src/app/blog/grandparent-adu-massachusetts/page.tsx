'use client'

import Link from 'next/link'
import TownNav from '@/components/TownNav'

export default function GrandparentADUMassachusetts() {
  return (
    <div className="min-h-screen bg-gray-900">
      <header className="border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-lg md:text-xl font-bold text-white tracking-tight">ADU Pulse</span>
            </Link>
            <TownNav current="Blog" />
          </div>
        </div>
      </header>

      <article className="max-w-3xl mx-auto px-4 py-8 md:py-12">
        <Link href="/blog" className="text-blue-400 text-sm hover:underline">← Back to Blog</Link>

        <h1 className="text-3xl md:text-4xl font-bold text-white mt-6 mb-4">
          The Grandparent ADU: Why Massachusetts Boomers Are Building to Be Closer to Family
        </h1>

        <div className="flex items-center gap-4 text-sm text-gray-500 mb-8">
          <span>February 7, 2026</span>
          <span>•</span>
          <span>7 min read</span>
          <span>•</span>
          <span>By Nick Welch</span>
        </div>

        <div className="prose prose-invert prose-lg max-w-none">
          <p className="text-gray-300 text-lg leading-relaxed mb-6 italic">
            Baby boomers control $19 trillion in housing wealth. A growing number are using it to build ADUs — and it's changing the housing conversation in Massachusetts.
          </p>

          <p className="text-gray-300 leading-relaxed mb-6">
            It usually starts with a conversation at the kitchen table. Maybe it's after a holiday visit that felt too short, or after a grandchild's first birthday when the drive home took three hours. A parent turns to their adult child and says: <em>What if we were just… closer?</em>
          </p>

          <p className="text-gray-300 leading-relaxed mb-6">
            In Massachusetts, that conversation is turning into construction permits.
          </p>

          <p className="text-gray-300 leading-relaxed mb-8">
            Since the Affordable Homes Act went into effect in February 2025, homeowners across the state can build an accessory dwelling unit — an ADU — by right on single-family lots. No special permits, no zoning variances. And while the law was designed to address the state's housing crisis broadly, one group is uniquely positioned to act on it: grandparents.
          </p>

          <h2 className="text-2xl font-bold text-white mt-10 mb-4">The numbers tell the story</h2>

          <p className="text-gray-300 leading-relaxed mb-6">
            Baby boomers — Americans born between 1946 and 1964 — hold an estimated <strong className="text-white">$19 trillion in real estate wealth</strong>, roughly 40% of all housing assets in the U.S. They control about half of the nation's $34.5 trillion in home equity. And with over $85 trillion in total assets, they represent the wealthiest generation in American history.
          </p>

          <p className="text-gray-300 leading-relaxed mb-6">
            Most of that wealth is locked in their homes. But unlike previous generations of retirees, today's boomers aren't rushing to sell. They're staying put. Nearly 12,000 Americans turn 65 every day, and the so-called "silver tsunami" of home sales has been more of a slow drip. Boomers aren't looking to downsize into a condo in Florida. They're looking for ways to stay connected to family — on their own terms.
          </p>

          <p className="text-gray-300 leading-relaxed mb-8">
            An ADU gives them exactly that.
          </p>

          <h2 className="text-2xl font-bold text-white mt-10 mb-4">What a "grandparent ADU" actually looks like</h2>

          <p className="text-gray-300 leading-relaxed mb-6">
            The concept is simple. A grandparent builds (or funds) an ADU on their own property or their adult child's property. The result: independent living, a few steps from the people they love most.
          </p>

          <p className="text-gray-300 leading-relaxed mb-6">
            In Massachusetts, ADUs under 900 square feet can now be built by right in any single-family zoning district. That means a converted garage, a finished basement apartment, or a new backyard cottage. No special permit required.
          </p>

          <p className="text-gray-300 leading-relaxed mb-4">Here's what this looks like in practice:</p>

          <p className="text-gray-300 leading-relaxed mb-4">
            <strong className="text-emerald-400">Scenario 1: Grandparents build on their own lot.</strong> They stay in their home and rent or offer the ADU to a family member — or move into the ADU themselves and let their adult child's family use the main house. Either way, the grandkids are steps away.
          </p>

          <p className="text-gray-300 leading-relaxed mb-4">
            <strong className="text-emerald-400">Scenario 2: Grandparents fund an ADU on their child's property.</strong> The adult child may not have the cash or equity to build. But their parents do. A boomer grandparent with $300,000+ in home equity can tap a HELOC to fund a $150,000–$250,000 ADU build on their child's lot. The grandparent gets a place to stay when visiting — or eventually, a place to live.
          </p>

          <p className="text-gray-300 leading-relaxed mb-8">
            <strong className="text-emerald-400">Scenario 3: Aging in place, with backup.</strong> A grandparent builds an ADU as a future caregiver suite. When the time comes, a family member or aide can live on-site. This avoids or delays assisted living, which in Massachusetts averages over $6,000 per month.
          </p>

          <h2 className="text-2xl font-bold text-white mt-10 mb-4">Massachusetts is making it easier</h2>

          <p className="text-gray-300 leading-relaxed mb-6">
            The state isn't just allowing ADUs — it's actively encouraging them. Governor Healey's administration has specifically highlighted the aging-in-place benefits of the new law.
          </p>

          <p className="text-gray-300 leading-relaxed mb-4">
            <strong className="text-white">By-right permitting</strong> means no special permit hearings, no zoning board approval, and no neighbor veto for ADUs under 900 square feet. The state estimates 8,000 to 10,000 ADUs will be built over the next five years as a result.
          </p>

          <p className="text-gray-300 leading-relaxed mb-4">
            <strong className="text-white">No-interest financing</strong> is available through state programs for residents building an ADU for people with disabilities or those over 60. That's a direct incentive for the grandparent use case.
          </p>

          <p className="text-gray-300 leading-relaxed mb-6">
            <strong className="text-white">The ADU Incentive Program</strong>, run through the Massachusetts Housing Partnership, is providing outreach, technical assistance, and financial support to homeowners looking to build.
          </p>

          <p className="text-gray-300 leading-relaxed mb-8">
            And the data is already showing momentum. According to the EOHLC's February 2026 survey, <Link href="/" className="text-blue-400 hover:underline">1,224 ADU permits have been approved across 217 Massachusetts towns</Link> since the law took effect — with an overall approval rate of 68%.
          </p>

          <h2 className="text-2xl font-bold text-white mt-10 mb-4">Why this matters for your family</h2>

          <p className="text-gray-300 leading-relaxed mb-6">
            If you're an adult child in Massachusetts wondering whether your parents would ever consider this — they probably already are. A Freddie Mac survey found that three-quarters of boomer homeowners plan to pass their housing wealth to their children. But only 9% plan to use their home equity to fund retirement. That means there's a massive pool of capital sitting in boomer-owned homes, waiting for a purpose.
          </p>

          <p className="text-gray-300 leading-relaxed mb-6">
            An ADU gives that capital a purpose that benefits everyone: the grandparent gets proximity to family, the adult child gets help with childcare (or eventually, a way to care for aging parents), and the grandchildren get something no amount of money can buy — time with their grandparents.
          </p>

          <p className="text-gray-300 leading-relaxed mb-8">
            And if you're a grandparent reading this? You already know. The holidays aren't long enough. The FaceTime calls aren't the same. And your equity isn't doing anything sitting in your walls.
          </p>

          <h2 className="text-2xl font-bold text-white mt-10 mb-4">Where to start</h2>

          <p className="text-gray-300 leading-relaxed mb-4">
            <strong className="text-white">Check your town's ADU status.</strong> Not all 217 towns are moving at the same speed. Some have detailed permit processes in place; others are still figuring it out. Use <Link href="/" className="text-blue-400 hover:underline">ADU Pulse's town tracker</Link> to see how your town — or your child's town — is handling permits, what the approval rate looks like, and how it compares to neighbors.
          </p>

          <p className="text-gray-300 leading-relaxed mb-4">
            <strong className="text-white">Talk to your family first.</strong> The best ADU projects start with a kitchen table conversation, not a contractor bid. Figure out whose lot makes more sense, who's funding it, and what the living arrangement looks like.
          </p>

          <p className="text-gray-300 leading-relaxed mb-4">
            <strong className="text-white">Understand the costs.</strong> Detached ADUs in Massachusetts typically range from $150,000 to $400,000. Attached conversions (basement, garage) can come in between $80,000 and $200,000. ADU Pulse's <Link href="/estimate" className="text-blue-400 hover:underline">cost estimator</Link> can give you a rough sense based on real permit data.
          </p>

          <p className="text-gray-300 leading-relaxed mb-8">
            <strong className="text-white">Explore financing options.</strong> HELOCs, FHA 203(k) renovation loans, and the state's no-interest financing program for homeowners over 60 are all worth investigating. Boston's ADU Pilot Program also offers up to $50,000 in grants for income-qualified homeowners.
          </p>

          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 mb-8">
            <p className="text-gray-300 leading-relaxed">
              Massachusetts is tracking 1,224 approved ADU permits across 217 towns. See how your town is doing at <Link href="/" className="text-blue-400 hover:underline">adupulse.com</Link>.
            </p>
          </div>
        </div>

        <div className="mt-12 bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-blue-500/30 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-2">Explore the data</h3>
          <p className="text-gray-400 mb-4">See ADU permits, costs, and approval rates for your town.</p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium"
            >
              View All Towns →
            </Link>
            <Link
              href="/estimate"
              className="inline-flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium"
            >
              Cost Estimator
            </Link>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800">
          <p className="text-gray-400 text-sm">
            <strong className="text-white">Nick Welch</strong> is tracking ADU permits across Massachusetts at ADU Pulse.
            The site includes statewide EOHLC survey data and detailed permit information scraped directly from 10+ town portals.
          </p>
        </div>
      </article>

      <footer className="border-t border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 text-xs text-gray-500">
            <div>© 2026 ADU Pulse</div>
            <div className="flex gap-4">
              <Link href="/" className="hover:text-white">Home</Link>
              <Link href="/blog" className="hover:text-white">Blog</Link>
              <Link href="/estimate" className="hover:text-white">Estimator</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
