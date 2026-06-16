import { Metadata } from 'next'
import RegulationsExplorerClient from './RegulationsExplorerClient'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'

/* ============================================================================
 * /regulations — Rule-first comparator. Pick a rule, see every tracked town's
 * treatment vs. state-law baseline. Complements /compliance (which is
 * town-first) by inverting the axis.
 *
 * Static metadata + client-side filtering for fast UX.
 * ========================================================================== */

export const metadata: Metadata = {
  title: 'Regulations Explorer — Every ADU Rule × Every Town | ADU Pulse',
  description:
    'Pick a Massachusetts ADU regulation — max size, parking, owner-occupancy, special permit — and see how every tracked town treats it against state law. Color-coded by AG action and statutory consistency.',
  openGraph: {
    title: 'Regulations Explorer — Every ADU Rule × Every Town | ADU Pulse',
    description: 'Side-by-side comparison of how every tracked MA town applies each ADU regulation.',
    url: 'https://www.adupulse.com/regulations',
    siteName: 'ADU Pulse',
    type: 'website',
  },
  alternates: { canonical: 'https://www.adupulse.com/regulations' },
}

export default function RegulationsExplorerPage() {
  return (
    <div className="min-h-screen bg-gray-900">
      <NavBar current="Policy Tracker" />
      <main className="px-4 py-6 sm:py-10">
        <div className="max-w-6xl mx-auto mb-6">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-2">
            Tools · Comparator
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Every Rule, Every Town
          </h1>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed mt-3 max-w-2xl">
            Pick a regulation, pick towns, see exactly how each treatment compares to Chapter 150 and 760 CMR 71.00.
            Cells are color-coded by AG action or our independent compliance review.
          </p>
        </div>
        <RegulationsExplorerClient />
      </main>
      <Footer />
    </div>
  )
}
