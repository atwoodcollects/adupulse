import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import { towns, getStatusCounts, getTownStatusLabel } from '../compliance-data'
import TownDetail from './TownDetail'

export function generateStaticParams() {
  return towns.map(t => ({ slug: t.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const town = towns.find(t => t.slug === params.slug)
  if (!town) return { title: 'Town Not Found | ADU Pulse' }

  const counts = getStatusCounts(town.provisions)
  const title = `${town.name} ADU Bylaw Compliance | ADU Pulse`
  const description = `${town.name} has ${counts.inconsistent} provisions inconsistent with MA ADU law and ${counts.compliant} consistent. See the full bylaw analysis.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://www.adupulse.com/compliance/${town.slug}`,
      siteName: 'ADU Pulse',
      type: 'website',
    },
    alternates: {
      canonical: `https://www.adupulse.com/compliance/${town.slug}`,
    },
  }
}

export default function ComplianceTownPage({ params }: { params: { slug: string } }) {
  const town = towns.find(t => t.slug === params.slug)
  if (!town) notFound()

  const counts = getStatusCounts(town.provisions)
  const statusLabel = getTownStatusLabel(town)

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
            Compliance
          </Link>
          <span className="mx-2 text-gray-600">/</span>
          <span className="text-gray-400">{town.name}</span>
        </nav>

        {/* Page header */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              {town.name} Bylaw Analysis
            </h1>
            <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${statusLabel.color} ${statusLabel.bg}`}>
              {statusLabel.label}
            </span>
          </div>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-2xl">
            Provision-by-provision analysis of {town.name}&apos;s ADU bylaw against
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
