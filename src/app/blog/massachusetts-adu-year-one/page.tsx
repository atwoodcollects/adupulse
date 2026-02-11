'use client'

import Link from 'next/link'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'

export default function MassachusettsADUYearOne() {
  return (
    <div className="min-h-screen bg-gray-900">
      <NavBar current="Blog" />

      <article className="max-w-3xl mx-auto px-4 py-8 md:py-12">
        <Link href="/blog" className="text-blue-400 text-sm hover:underline">← Back to Blog</Link>
        
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
            One year ago, Massachusetts passed one of the strongest ADU laws in the country. Accessory dwelling units—granny flats, in-law apartments, backyard cottages—can now be built by right in single-family zones statewide.
          </p>
          
          <p className="text-gray-300 leading-relaxed mb-6">
            I've spent the past few months tracking what's actually happening on the ground. Not press releases. Not projections. Real permit data, scraped directly from town portals and cross-referenced with state survey data.
          </p>
          
          <p className="text-gray-300 leading-relaxed mb-8">Here's what I found.</p>

          <h2 className="text-2xl font-bold text-white mt-10 mb-4">The headline number is good</h2>
          
          <p className="text-gray-300 leading-relaxed mb-4">
            <strong className="text-white">1,224 ADUs approved across 217 towns in year one.</strong>
          </p>
          
          <p className="text-gray-300 leading-relaxed mb-6">
            That's a 75% approval rate on 1,639 applications. For context, Massachusetts is outpacing California's per-capita rate from their first year of ADU reform by 1.27x.
          </p>
          
          <p className="text-gray-300 leading-relaxed mb-8">The law is working. But not evenly.</p>

          <h2 className="text-2xl font-bold text-white mt-10 mb-4">Some towns rubber-stamp. Others stall.</h2>
          
          <p className="text-gray-300 leading-relaxed mb-4">
            <strong className="text-emerald-400">100% approval rate:</strong> Nantucket (27), Lowell (26), Fairhaven (18), Harwich (15)
          </p>
          
          <p className="text-gray-300 leading-relaxed mb-6">
            <strong className="text-red-400">Under 25% approval rate:</strong> Gardner (0%), Barnstable (19%), Danvers (22%)
          </p>
          
          <p className="text-gray-300 leading-relaxed mb-4">
            Barnstable is the outlier that should concern policymakers. They received 31 applications—real demand—but only approved 6. That's not a lack of interest. That's friction.
          </p>
          
          <p className="text-gray-300 leading-relaxed mb-8">
            Meanwhile, Gardner has approved zero out of seven applications. The law says ADUs are allowed by right. Someone should ask Gardner what's happening.
          </p>

          <h2 className="text-2xl font-bold text-white mt-10 mb-4">Urban and suburban ADUs look completely different</h2>
          
          <p className="text-gray-300 leading-relaxed mb-4">In dense cities, ADUs mean basement conversions:</p>
          
          <ul className="text-gray-300 mb-6 space-y-1">
            <li><Link href="/revere" className="text-blue-400 hover:underline">Revere</Link>: 100% attached</li>
            <li><Link href="/boston" className="text-blue-400 hover:underline">Boston</Link>: 84% attached</li>
            <li><Link href="/milton" className="text-blue-400 hover:underline">Milton</Link>: 96% attached</li>
          </ul>
          
          <p className="text-gray-300 leading-relaxed mb-4">In suburban and Cape towns, ADUs mean backyard cottages:</p>
          
          <ul className="text-gray-300 mb-6 space-y-1">
            <li>Harwich: 100% detached</li>
            <li>Nantucket: 89% detached</li>
            <li>Edgartown: 100% detached</li>
          </ul>
          
          <p className="text-gray-300 leading-relaxed mb-8">
            This matters for cost estimates. A basement conversion might run $50K. A detached new build can exceed $500K. Same law, completely different projects.
          </p>

          <h2 className="text-2xl font-bold text-white mt-10 mb-4">The Revere story no one's talking about</h2>
          
          <p className="text-gray-300 leading-relaxed mb-4">
            When I scraped <Link href="/revere" className="text-blue-400 hover:underline">Revere's permit portal</Link>, I found 33 ADU permits—nearly double what the state survey reported (17).
          </p>
          
          <p className="text-gray-300 leading-relaxed mb-4">
            But here's the interesting part: at least 4 of those permits explicitly mention "legalizing work done without permits" or "correcting violations."
          </p>
          
          <p className="text-gray-300 leading-relaxed mb-4">
            Revere's ADU wave isn't just new construction. It's a <strong className="text-white">legalization wave</strong>. Homeowners who built unpermitted units years ago are now coming into compliance.
          </p>
          
          <p className="text-gray-300 leading-relaxed mb-8">
            This is the law working exactly as intended—bringing shadow housing into the light.
          </p>

          <h2 className="text-2xl font-bold text-white mt-10 mb-4">Cost variance is massive</h2>
          
          <p className="text-gray-300 leading-relaxed mb-4">
            Looking at <Link href="/lexington" className="text-blue-400 hover:underline">Lexington</Link> permits with cost data:
          </p>
          
          <ul className="text-gray-300 mb-6 space-y-1">
            <li>Low end: ~$4/sq ft (minimal basement work)</li>
            <li>High end: ~$635/sq ft (full detached new construction)</li>
          </ul>
          
          <p className="text-gray-300 leading-relaxed mb-8">
            That's not a typo. The range is 150x. Homeowners planning budgets based on "average ADU cost" articles are in for a surprise. The type of ADU—not the town—is the biggest cost driver.
          </p>

          <h2 className="text-2xl font-bold text-white mt-10 mb-4">Wealthy suburbs tell different stories</h2>
          
          <p className="text-gray-300 leading-relaxed mb-4">
            Both Lexington and Newton are affluent suburbs with strong ADU demand.
          </p>
          
          <ul className="text-gray-300 mb-6 space-y-1">
            <li><strong className="text-white">Lexington:</strong> 6 submitted, 6 approved (100%)</li>
            <li><strong className="text-white">Newton:</strong> 40 submitted, 18 approved (45%)</li>
          </ul>
          
          <p className="text-gray-300 leading-relaxed mb-8">
            Same demographics. Same housing pressure. Very different outcomes. <Link href="/newton" className="text-blue-400 hover:underline">Newton's</Link> approval rate suggests something in their process is creating friction that Lexington has avoided.
          </p>

          <h2 className="text-2xl font-bold text-white mt-10 mb-4">What I'm still trying to figure out</h2>
          
          <p className="text-gray-300 leading-relaxed mb-4">
            The data shows <em>what</em> is happening. It doesn't always show <em>why</em>.
          </p>
          
          <ul className="text-gray-300 mb-6 space-y-1">
            <li>Why is Barnstable at 19% approval when neighboring Cape towns are much higher?</li>
            <li>What's causing Newton's backlog?</li>
            <li>Which builders are doing the most ADU work, and where?</li>
            <li>How long does it actually take from application to approval?</li>
          </ul>
          
          <p className="text-gray-300 leading-relaxed mb-8">
            I'm adding more towns every week. If you're a homeowner, builder, policymaker, or just curious about housing in Massachusetts, I'd love to hear what data would be most useful to you.
          </p>

          <h2 className="text-2xl font-bold text-white mt-10 mb-4">The bottom line</h2>
          
          <p className="text-gray-300 leading-relaxed mb-4">
            Massachusetts bet that simplifying ADU rules would increase housing production. One year in, that bet is paying off—1,224 new homes approved that wouldn't have existed under the old rules.
          </p>
          
          <p className="text-gray-300 leading-relaxed mb-8">
            But the data also shows that implementation varies wildly by town. Some places have embraced the law. Others appear to be finding ways to slow it down.
          </p>
          
          <p className="text-gray-300 leading-relaxed mb-8">Transparency helps. That's why I built this.</p>
        </div>

        <div className="mt-12 bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-blue-500/30 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-2">Explore the data</h3>
          <p className="text-gray-400 mb-4">See ADU permits, costs, and approval rates for your town.</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/" className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium">
              View All Towns →
            </Link>
            <Link href="/estimate" className="inline-flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium">
              Cost Estimator
            </Link>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800">
          <p className="text-gray-400 text-sm">
            <strong className="text-white">ADU Pulse</strong> tracks ADU permits across Massachusetts using statewide EOHLC survey data and detailed permit information from 10+ town portals.
          </p>
        </div>
      </article>
      <Footer />
    </div>
  )
}
