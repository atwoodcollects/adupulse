import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import townSEOData, { getTownBySlug, getAllTownSlugs } from '@/data/town_seo_data'
import { approvalsPerTenThousandResidents, computeStatewidePerCapitaAverage } from '@/lib/townAnalytics'
import TownSEOPageClient from './TownSEOPageClient'

export function generateStaticParams() {
  return getAllTownSlugs().map(slug => ({ slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const town = getTownBySlug(params.slug)
  if (!town) return { title: 'Town Not Found | ADU Pulse' }

  const title = `${town.name} ADU Permits & Data | ADU Pulse`
  const description = `${town.name}, MA has ${town.approved} approved ADU permits with a ${town.approvalRate}% approval rate. See local ADU data, costs, and how to get started.`
  const ogImageUrl = `https://www.adupulse.com/api/og?town=${town.slug}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://www.adupulse.com/towns/${town.slug}`,
      siteName: 'ADU Pulse',
      type: 'website',
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: `${town.name} ADU Permit Data` }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
    alternates: {
      canonical: `https://www.adupulse.com/towns/${town.slug}`,
    },
  }
}

export default function TownSEOPage({ params }: { params: { slug: string } }) {
  const town = getTownBySlug(params.slug)
  if (!town) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: `${town.name} ADU Permit Data`,
    description: `Accessory Dwelling Unit (ADU) permit data for ${town.name}, Massachusetts. Includes applications submitted, approved, denied, and approval rates.`,
    url: `https://www.adupulse.com/towns/${town.slug}`,
    creator: { '@type': 'Organization', name: 'ADU Pulse', url: 'https://www.adupulse.com' },
    temporalCoverage: '2024/2026',
    spatialCoverage: { '@type': 'Place', name: `${town.name}, Massachusetts` },
    variableMeasured: [
      { '@type': 'PropertyValue', name: 'ADU Applications Submitted', value: town.submitted },
      { '@type': 'PropertyValue', name: 'ADU Applications Approved', value: town.approved },
      { '@type': 'PropertyValue', name: 'ADU Approval Rate', value: `${town.approvalRate}%` },
    ],
  }

  const nearbyTowns = townSEOData
    .filter(t => t.slug !== town.slug && t.county === town.county)
    .slice(0, 4)

  const statewidePerCapita = computeStatewidePerCapitaAverage(townSEOData)
  const townPerCapita = approvalsPerTenThousandResidents(town)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <TownSEOPageClient town={town} nearbyTowns={nearbyTowns} statewidePerCapita={statewidePerCapita} townPerCapita={townPerCapita} />
    </>
  )
}
