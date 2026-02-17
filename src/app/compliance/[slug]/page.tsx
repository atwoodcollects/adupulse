import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import { allEntries, narrativeCities, getStatusCounts, getTownStatusLabel } from '../compliance-data'
import TownDetail from './TownDetail'
import NarrativeDetail from './NarrativeDetail'

const allSlugs = [
  ...allEntries.map(t => t.slug),
  ...narrativeCities.map(c => c.slug),
]

export function generateStaticParams() {
  return allSlugs.map(slug => ({ slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const town = allEntries.find(t => t.slug === params.slug)
  if (town) {
    const counts = getStatusCounts(town.provisions)
    const ruleWord = town.municipalityType === 'city' ? 'Ordinance' : 'Bylaw'
    const title = `${town.name} ADU ${ruleWord} Consistency | ADU Pulse`
    const description = `${town.name} has ${counts.inconsistent} provisions inconsistent with MA ADU law and ${counts.compliant} consistent. See the full ${ruleWord.toLowerCase()} analysis.`
    return {
      title,
      description,
      openGraph: { title, description, url: `https://www.adupulse.com/compliance/${town.slug}`, siteName: 'ADU Pulse', type: 'website' },
      alternates: { canonical: `https://www.adupulse.com/compliance/${town.slug}` },
    }
  }

  const narrative = narrativeCities.find(c => c.slug === params.slug)
  if (narrative) {
    return {
      title: `${narrative.name} ADU Analysis | ADU Pulse`,
      description: narrative.summary,
      openGraph: { title: `${narrative.name} ADU Analysis | ADU Pulse`, description: narrative.summary, url: `https://www.adupulse.com/compliance/${narrative.slug}`, siteName: 'ADU Pulse', type: 'website' },
      alternates: { canonical: `https://www.adupulse.com/compliance/${narrative.slug}` },
    }
  }

  return { title: 'Community Not Found | ADU Pulse' }
}

export default function ComplianceTownPage({ params }: { params: { slug: string } }) {
  // Check for narrative city first
  const narrative = narrativeCities.find(c => c.slug === params.slug)
  if (narrative) {
    return (
      <div className="min-h-screen bg-gray-900">
        <NavBar />
        <main className="px-4 py-6 sm:py-10">
          <nav className="max-w-4xl mx-auto mb-6 text-sm text-gray-400">
            <Link href="/" className="text-blue-400 hover:text-blue-300 transition-colors">Dashboard</Link>
            <span className="mx-2 text-gray-600">/</span>
            <Link href="/compliance" className="text-blue-400 hover:text-blue-300 transition-colors">Policy Tracker</Link>
            <span className="mx-2 text-gray-600">/</span>
            <span className="text-gray-400">{narrative.name}</span>
          </nav>
          <NarrativeDetail slug={params.slug} />
        </main>
        <Footer />
      </div>
    )
  }

  // Standard provision-based page
  const town = allEntries.find(t => t.slug === params.slug)
  if (!town) notFound()

  const counts = getStatusCounts(town.provisions)
  const statusLabel = getTownStatusLabel(town)
  const ruleWord = town.municipalityType === 'city' ? 'Ordinance' : 'Bylaw'

  return (
    <div className="min-h-screen bg-gray-900">
      <NavBar />
      <main className="px-4 py-6 sm:py-10">
        {/* Breadcrumbs */}
        <nav className="max-w-4xl mx-auto mb-6 text-sm text-gray-400">
          <Link
            href="/"
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            Dashboard
          </Link>
          <span className="mx-2 text-gray-600">/</span>
          <Link
            href="/compliance"
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            Policy Tracker
          </Link>
          <span className="mx-2 text-gray-600">/</span>
          <span className="text-gray-400">{town.name}</span>
        </nav>

        {/* Page header */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              {town.name} {ruleWord} Analysis
            </h1>
            <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${statusLabel.color} ${statusLabel.bg}`}>
              {statusLabel.label}
            </span>
          </div>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-2xl">
            Provision-by-provision analysis of {town.name}&apos;s ADU {ruleWord.toLowerCase()} against
            Massachusetts Chapter 150 and 760 CMR 71.00.
            {counts.inconsistent > 0 && (
              <> <span className="text-red-400 font-medium">{counts.inconsistent} inconsistent</span> provision{counts.inconsistent > 1 ? 's' : ''} identified.</>
            )}
          </p>
        </div>

        <TownDetail slug={params.slug} />
      </main>
      <Footer />
    </div>
  )
}
