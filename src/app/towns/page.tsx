import { Metadata } from 'next'
import TownsDirectoryClient from './TownsDirectoryClient'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'

/* ============================================================================
 * /towns — Directory landing. Map + filter bar + sortable list of all 351 MA
 * municipalities. Replaces the gap left by your current setup (you have
 * /towns/[slug] but no parent landing).
 *
 * Pulls from townSEOData + compliance + infrastructure to badge each row.
 * ========================================================================== */

export const metadata: Metadata = {
  title: 'Town Directory — Every Massachusetts ADU Profile | ADU Pulse',
  description:
    'Browse permit data, bylaw status, and septic infrastructure across all 351 Massachusetts municipalities. Sort by approval rate, ADUs per 10k residents, or compliance status.',
  openGraph: {
    title: 'Town Directory — Every Massachusetts ADU Profile | ADU Pulse',
    description: 'Permit data, bylaw status, and septic infrastructure across all 351 MA towns.',
    url: 'https://www.adupulse.com/towns',
    siteName: 'ADU Pulse',
    type: 'website',
  },
  alternates: { canonical: 'https://www.adupulse.com/towns' },
}

export default function TownsDirectoryPage() {
  return (
    <div className="min-h-screen bg-gray-900">
      <NavBar />
      <main className="px-4 py-6 sm:py-10">
        <div className="max-w-6xl mx-auto mb-6">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-2">
            Directory · 351 municipalities
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Every Massachusetts town, one place
          </h1>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed mt-3 max-w-2xl">
            Permit data, bylaw status, and infrastructure capacity for the entire Commonwealth.
            Click any row to open the town profile.
          </p>
        </div>
        <TownsDirectoryClient />
      </main>
      <Footer />
    </div>
  )
}
