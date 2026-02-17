'use client'

import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-gray-800 mt-12">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-8">
          {/* About */}
          <div>
            <h4 className="text-white font-medium text-sm mb-3">ADU Pulse</h4>
            <p className="text-gray-500 text-xs leading-relaxed mb-3">
              Real permit data from 293 Massachusetts towns. Helping homeowners, builders, and lenders make smarter ADU decisions.
            </p>
          </div>

          {/* Tools & Data */}
          <div>
            <h4 className="text-white font-medium text-sm mb-3">Tools &amp; Data</h4>
            <div className="space-y-1">
              {[
                { name: 'Town Explorer', href: '/map' },
                { name: 'Cost Estimator', href: '/estimate' },
                { name: 'ADU Quiz', href: '/quiz' },
                { name: 'Compare Towns', href: '/compare' },
                { name: 'Housing Production', href: '/housing-production' },
                { name: 'Town Rankings', href: '/rankings' },
              ].map(l => (
                <Link key={l.href} href={l.href} className="block text-gray-400 text-xs hover:text-white transition-colors py-1">{l.name}</Link>
              ))}
            </div>
          </div>

          {/* For Homeowners */}
          <div>
            <h4 className="text-white font-medium text-sm mb-3">For Homeowners</h4>
            <div className="space-y-1">
              {[
                { name: 'ADU Club', href: '/club' },
                { name: 'Blog', href: '/blog' },
                { name: 'Find Your Town', href: '/map' },
                { name: 'Methodology', href: '/methodology' },
              ].map(l => (
                <Link key={l.href} href={l.href} className="block text-gray-400 text-xs hover:text-white transition-colors py-1">{l.name}</Link>
              ))}
            </div>
          </div>

          {/* For Builders */}
          <div>
            <h4 className="text-white font-medium text-sm mb-3">For Builders</h4>
            <div className="space-y-1">
              {[
                { name: 'Builder Network', href: '/builders' },
                { name: 'Demand Data', href: '/map' },
                { name: 'Town Rankings', href: '/rankings' },
              ].map(l => (
                <Link key={l.href} href={l.href} className="block text-gray-400 text-xs hover:text-white transition-colors py-1">{l.name}</Link>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 text-xs text-gray-500">
          <div>
            <p>Data: <a href="https://www.mass.gov/orgs/executive-office-of-housing-and-livable-communities" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">EOHLC</a> Survey Feb 2026 · Population: Census ACS 2024</p>
            <p className="mt-0.5">&copy; 2026 ADU Pulse · Contact: <a href="mailto:nick@adupulse.com" className="text-blue-400 hover:underline">nick@adupulse.com</a></p>
          </div>
          <div className="flex gap-3">
            <span className="text-gray-600">📊 Real data. No guesswork.</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
