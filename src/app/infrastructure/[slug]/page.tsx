import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import { infrastructureTowns, getStatusCounts, getTownStatusLabel } from '../infrastructure-data'
import InfraDetail from './InfraDetail'

export function generateStaticParams() {
  return infrastructureTowns.map(t => ({ slug: t.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const town = infrastructureTowns.find(t => t.slug === params.slug)
  if (!town) return { title: 'Community Not Found | ADU Pulse' }

  const counts = getStatusCounts(town.provisions)
  const title = `${town.name} ADU Septic Analysis — Title 5 vs. Local Board of Health Rules | ADU Pulse`
  const description = `${town.name}'s Board of Health rules exceed Title 5 minimums in ${counts.exceeds} area${counts.exceeds !== 1 ? 's' : ''}. ${counts.barrier > 0 ? `${counts.barrier} structural barrier${counts.barrier !== 1 ? 's' : ''} identified. ` : ''}${town.provisions.length} provisions analyzed.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://www.adupulse.com/infrastructure/${town.slug}`,
      siteName: 'ADU Pulse',
      type: 'website',
    },
    alternates: { canonical: `https://www.adupulse.com/infrastructure/${town.slug}` },
  }
}

export default function InfrastructureTownPage({ params }: { params: { slug: string } }) {
  const town = infrastructureTowns.find(t => t.slug === params.slug)
  if (!town) notFound()

  const counts = getStatusCounts(town.provisions)
  const statusLabel = getTownStatusLabel(town)

  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: `${town.name} ADU Septic Regulation Analysis`,
        url: `https://www.adupulse.com/infrastructure/${town.slug}`,
        description: `Analysis of ${town.name}'s Board of Health septic regulations against the Title 5 baseline (310 CMR 15.000).`,
        isPartOf: { '@type': 'WebSite', name: 'ADU Pulse', url: 'https://www.adupulse.com' },
        dateModified: town.lastReviewed,
      },
      {
        '@type': 'Dataset',
        name: `${town.name} Septic Regulation Gap Analysis`,
        description: `${counts.exceeds} provisions exceeding Title 5 baseline, ${counts.barrier} barriers, and ${counts.consistent} consistent provisions identified.`,
        url: `https://www.adupulse.com/infrastructure/${town.slug}`,
        creator: { '@type': 'Organization', name: 'ADU Pulse', url: 'https://www.adupulse.com' },
        spatialCoverage: { '@type': 'Place', name: `${town.name}, Massachusetts` },
        variableMeasured: [
          { '@type': 'PropertyValue', name: 'Exceeds Baseline', value: counts.exceeds },
          { '@type': 'PropertyValue', name: 'Barriers', value: counts.barrier },
          { '@type': 'PropertyValue', name: 'Needs Review', value: counts.review },
          { '@type': 'PropertyValue', name: 'Consistent', value: counts.consistent },
          { '@type': 'PropertyValue', name: 'Total Provisions', value: town.provisions.length },
        ],
      },
    ],
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <NavBar current="Infrastructure" />
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
            href="/infrastructure"
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            Infrastructure Tracker
          </Link>
          <span className="mx-2 text-gray-600">/</span>
          <span className="text-gray-400">{town.name}</span>
        </nav>

        {/* Page header */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              {town.name} Septic Analysis
            </h1>
            <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${statusLabel.color} ${statusLabel.bg}`}>
              {statusLabel.label}
            </span>
          </div>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-2xl">
            Gap analysis of {town.name}&apos;s Board of Health septic regulations against
            the Title 5 baseline (310 CMR 15.000).
            {counts.exceeds > 0 && (
              <> <span className="text-orange-400 font-medium">{counts.exceeds} provision{counts.exceeds > 1 ? 's' : ''}</span> exceeding state baseline.</>
            )}
            {counts.barrier > 0 && (
              <> <span className="text-red-400 font-medium">{counts.barrier} barrier{counts.barrier > 1 ? 's' : ''}</span> identified.</>
            )}
          </p>
        </div>

        <InfraDetail slug={params.slug} />
      </main>
      <Footer />
    </div>
  )
}
