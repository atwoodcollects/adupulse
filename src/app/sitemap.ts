import type { MetadataRoute } from 'next'
import townSEOData from '@/data/town_seo_data'

const BASE_URL = 'https://www.adupulse.com'

// Compliance slugs — keep in sync with allEntries + narrativeCities in compliance-data.ts
const complianceSlugs = [
  'plymouth', 'nantucket', 'leicester', 'brookline', 'canton', 'hanson',
  'new-bedford', 'newton', 'andover', 'milton', 'duxbury', 'barnstable',
  'falmouth', 'sudbury', 'needham', 'boston', 'somerville', 'worcester',
  'east-bridgewater', 'weston', 'upton', 'wilbraham', 'quincy', 'salem',
  'revere', 'southborough',
  // narrative cities
  'fall-river', 'lowell', 'medford',
]

const blogSlugs = [
  'massachusetts-adu-year-one',
  'grandparent-adu-massachusetts',
  'boston-adu-exemption',
  'massachusetts-adu-national-comparison',
  'ag-disapprovals-sudbury-leicester-canton',
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages: MetadataRoute.Sitemap = []

  // Homepage
  pages.push({ url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 })

  // Static pages
  const staticPaths = [
    '/compliance', '/housing-production', '/pricing', '/methodology',
    '/map', '/estimate', '/club', '/builders', '/rankings', '/blog', '/compare',
  ]
  for (const path of staticPaths) {
    pages.push({ url: `${BASE_URL}${path}`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 })
  }

  // Blog posts
  for (const slug of blogSlugs) {
    pages.push({ url: `${BASE_URL}/blog/${slug}`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 })
  }

  // Compliance profiles
  for (const slug of complianceSlugs) {
    pages.push({ url: `${BASE_URL}/compliance/${slug}`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 })
  }

  // Town pages
  for (const town of townSEOData) {
    pages.push({ url: `${BASE_URL}/towns/${town.slug}`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 })
  }

  return pages
}
