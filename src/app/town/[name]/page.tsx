import Link from 'next/link'
import TownNav from '@/components/TownNav'
import { notFound } from 'next/navigation'

const townData: Record<string, { approved: number; submitted: number; population: number; region: string; detached: number; attached: number }> = {
  'Amherst': { approved: 12, submitted: 23, population: 40989, region: 'Pioneer Valley', detached: 14, attached: 9 },
  'Andover': { approved: 9, submitted: 10, population: 36927, region: 'Merrimack Valley', detached: 3, attached: 7 },
  'Arlington': { approved: 6, submitted: 7, population: 47112, region: 'Metro Boston', detached: 3, attached: 4 },
  'Attleboro': { approved: 10, submitted: 15, population: 47085, region: 'South Coast', detached: 3, attached: 12 },
  'Barnstable': { approved: 6, submitted: 31, population: 49831, region: 'Cape Cod', detached: 13, attached: 18 },
  'Beverly': { approved: 12, submitted: 12, population: 43223, region: 'North Shore', detached: 10, attached: 2 },
  'Billerica': { approved: 13, submitted: 18, population: 42978, region: 'Merrimack Valley', detached: 6, attached: 12 },
  'Boston': { approved: 44, submitted: 69, population: 673458, region: 'Metro Boston', detached: 11, attached: 58 },
  'Brockton': { approved: 5, submitted: 16, population: 105788, region: 'South Shore', detached: 8, attached: 8 },
  'Brookline': { approved: 10, submitted: 14, population: 63925, region: 'Metro Boston', detached: 8, attached: 6 },
  'Cambridge': { approved: 6, submitted: 8, population: 121186, region: 'Metro Boston', detached: 4, attached: 4 },
  'Chelmsford': { approved: 7, submitted: 7, population: 36953, region: 'Merrimack Valley', detached: 3, attached: 4 },
  'Danvers': { approved: 2, submitted: 9, population: 28590, region: 'North Shore', detached: 3, attached: 6 },
  'Dracut': { approved: 10, submitted: 12, population: 32972, region: 'Merrimack Valley', detached: 7, attached: 5 },
  'Duxbury': { approved: 2, submitted: 3, population: 16377, region: 'South Shore', detached: 3, attached: 0 },
  'Everett': { approved: 2, submitted: 7, population: 51825, region: 'Metro Boston', detached: 3, attached: 4 },
  'Fairhaven': { approved: 18, submitted: 18, population: 16005, region: 'South Coast', detached: 9, attached: 9 },
  'Fall River': { approved: 13, submitted: 25, population: 94689, region: 'South Coast', detached: 9, attached: 16 },
  'Falmouth': { approved: 12, submitted: 12, population: 33227, region: 'Cape Cod', detached: 7, attached: 5 },
  'Framingham': { approved: 6, submitted: 8, population: 73361, region: 'Metro Boston', detached: 2, attached: 6 },
  'Freetown': { approved: 13, submitted: 17, population: 9380, region: 'South Coast', detached: 12, attached: 5 },
  'Gardner': { approved: 0, submitted: 7, population: 21381, region: 'Central MA', detached: 2, attached: 5 },
  'Harwich': { approved: 15, submitted: 15, population: 13620, region: 'Cape Cod', detached: 15, attached: 0 },
  'Haverhill': { approved: 13, submitted: 29, population: 68291, region: 'Merrimack Valley', detached: 13, attached: 16 },
  'Ipswich': { approved: 9, submitted: 12, population: 14110, region: 'North Shore', detached: 7, attached: 5 },
  'Lawrence': { approved: 32, submitted: 44, population: 89332, region: 'Merrimack Valley', detached: 18, attached: 26 },
  'Lexington': { approved: 6, submitted: 6, population: 34743, region: 'Metro Boston', detached: 2, attached: 4 },
  'Lowell': { approved: 26, submitted: 26, population: 120418, region: 'Merrimack Valley', detached: 9, attached: 17 },
  'Lynn': { approved: 9, submitted: 22, population: 103489, region: 'North Shore', detached: 5, attached: 17 },
  'Malden': { approved: 5, submitted: 8, population: 66693, region: 'Metro Boston', detached: 3, attached: 5 },
  'Marshfield': { approved: 11, submitted: 24, population: 26043, region: 'South Shore', detached: 18, attached: 6 },
  'Medford': { approved: 19, submitted: 22, population: 59898, region: 'Metro Boston', detached: 13, attached: 9 },
  'Methuen': { approved: 21, submitted: 28, population: 53043, region: 'Merrimack Valley', detached: 9, attached: 19 },
  'Middleborough': { approved: 18, submitted: 18, population: 24847, region: 'South Shore', detached: 14, attached: 4 },
  'Milton': { approved: 24, submitted: 25, population: 28811, region: 'Metro Boston', detached: 1, attached: 24 },
  'Nantucket': { approved: 27, submitted: 27, population: 14670, region: 'Islands', detached: 24, attached: 3 },
  'Needham': { approved: 4, submitted: 4, population: 32931, region: 'Metro Boston', detached: 1, attached: 3 },
  'Newton': { approved: 18, submitted: 40, population: 90700, region: 'Metro Boston', detached: 16, attached: 24 },
  'Northampton': { approved: 15, submitted: 20, population: 31315, region: 'Pioneer Valley', detached: 7, attached: 13 },
  'Peabody': { approved: 7, submitted: 12, population: 55418, region: 'North Shore', detached: 4, attached: 8 },
  'Plymouth': { approved: 34, submitted: 42, population: 66663, region: 'South Shore', detached: 18, attached: 24 },
  'Quincy': { approved: 6, submitted: 17, population: 103434, region: 'Metro Boston', detached: 3, attached: 14 },
  'Randolph': { approved: 5, submitted: 12, population: 35114, region: 'Metro Boston', detached: 5, attached: 7 },
  'Raynham': { approved: 18, submitted: 18, population: 15861, region: 'South Shore', detached: 1, attached: 17 },
  'Revere': { approved: 9, submitted: 17, population: 60702, region: 'Metro Boston', detached: 0, attached: 17 },
  'Salem': { approved: 9, submitted: 9, population: 45677, region: 'North Shore', detached: 2, attached: 7 },
  'Shrewsbury': { approved: 9, submitted: 16, population: 39620, region: 'Central MA', detached: 3, attached: 13 },
  'Somerville': { approved: 24, submitted: 40, population: 82149, region: 'Metro Boston', detached: 34, attached: 6 },
  'Sudbury': { approved: 3, submitted: 3, population: 19805, region: 'Metro Boston', detached: 2, attached: 1 },
  'Taunton': { approved: 7, submitted: 14, population: 61936, region: 'South Coast', detached: 11, attached: 3 },
  'Tisbury': { approved: 14, submitted: 15, population: 4927, region: 'Islands', detached: 6, attached: 9 },
  'Wayland': { approved: 2, submitted: 7, population: 14054, region: 'Metro Boston', detached: 6, attached: 1 },
  'Westport': { approved: 14, submitted: 14, population: 16705, region: 'South Coast', detached: 5, attached: 9 },
  'Worcester': { approved: 23, submitted: 31, population: 211286, region: 'Central MA', detached: 15, attached: 16 },
}

const allTowns = Object.entries(townData).map(([name, data]) => ({
  name,
  ...data,
  rate: data.submitted > 0 ? data.approved / data.submitted : 0,
  perCapita: (data.approved / data.population) * 10000
}))

const rankByApproved = [...allTowns].sort((a, b) => b.approved - a.approved)
const rankByRate = [...allTowns].sort((a, b) => b.rate - a.rate)
const rankByPerCapita = [...allTowns].sort((a, b) => b.perCapita - a.perCapita)

function getSimilarTowns(townName: string) {
  const town = townData[townName]
  if (!town) return []
  return allTowns
    .filter(t => t.name !== townName)
    .sort((a, b) => Math.abs(a.population - town.population) - Math.abs(b.population - town.population))
    .slice(0, 4)
}

function getRegionRivals(townName: string) {
  const town = townData[townName]
  if (!town) return []
  return allTowns
    .filter(t => t.name !== townName && t.region === town.region)
    .sort((a, b) => b.approved - a.approved)
    .slice(0, 4)
}

// Towns with dedicated detail pages
const detailPages = ['andover', 'boston', 'duxbury', 'falmouth', 'lexington', 'milton', 'needham', 'newton', 'plymouth', 'revere', 'sudbury']

export default async function TownPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params
  const townName = decodeURIComponent(name)
  const town = townData[townName]

  if (!town) {
    notFound()
  }

  const rate = town.submitted > 0 ? town.approved / town.submitted : 0
  const perCapita = (town.approved / town.population) * 10000

  const approvedRank = rankByApproved.findIndex(t => t.name === townName) + 1
  const rateRank = rankByRate.findIndex(t => t.name === townName) + 1
  const perCapitaRank = rankByPerCapita.findIndex(t => t.name === townName) + 1

  const similarTowns = getSimilarTowns(townName)
  const regionRivals = getRegionRivals(townName)

  const hasDetailPage = detailPages.includes(townName.toLowerCase())

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-lg md:text-xl font-bold text-white tracking-tight">ADU Pulse</span>
            </Link>
            <TownNav current={townName} />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/town" className="text-blue-400 text-sm hover:underline">← Find your town</Link>
          <h1 className="text-3xl md:text-4xl font-bold text-white mt-2">{townName}</h1>
          <p className="text-gray-400">{town.region} · Pop. {town.population.toLocaleString()}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
            <div className="text-3xl font-bold text-emerald-400">{town.approved}</div>
            <div className="text-gray-400 text-sm">Approved</div>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
            <div className="text-3xl font-bold text-white">{town.submitted}</div>
            <div className="text-gray-400 text-sm">Submitted</div>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
            <div className="text-3xl font-bold text-white">{Math.round(rate * 100)}%</div>
            <div className="text-gray-400 text-sm">Approval Rate</div>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
            <div className="text-3xl font-bold text-white">{perCapita.toFixed(1)}</div>
            <div className="text-gray-400 text-sm">Per 10k Residents</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
            <div className="text-2xl font-bold text-white">{town.detached}</div>
            <div className="text-gray-400 text-sm">Detached ADUs</div>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
            <div className="text-2xl font-bold text-white">{town.attached}</div>
            <div className="text-gray-400 text-sm">Attached ADUs</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-blue-500/30 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-bold text-white mb-4">Statewide Rankings</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-emerald-400">#{approvedRank}</div>
              <div className="text-gray-400 text-sm">by volume</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-400">#{rateRank}</div>
              <div className="text-gray-400 text-sm">by approval rate</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-400">#{perCapitaRank}</div>
              <div className="text-gray-400 text-sm">per capita</div>
            </div>
          </div>
          <div className="text-center mt-4 pt-4 border-t border-gray-700">
            <Link href="/leaderboard" className="text-blue-400 text-sm hover:underline">
              View full leaderboard →
            </Link>
          </div>
        </div>

        {hasDetailPage && (
          <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-xl p-4 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white font-medium">Detailed permit data available</div>
                <div className="text-gray-400 text-sm">See individual permits, addresses, and timeline</div>
              </div>
              <Link 
                href={`/${townName.toLowerCase()}`}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium"
              >
                View Details →
              </Link>
            </div>
          </div>
        )}

        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-bold text-white mb-2">🏆 Challenge a Rival</h2>
          <p className="text-gray-400 text-sm mb-4">
            Issue an ADU challenge to a neighboring town and track who approves more.
          </p>
          <Link 
            href={`/challenge/new?from=${encodeURIComponent(townName)}`}
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium"
          >
            Create Challenge →
          </Link>
        </div>

        {regionRivals.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-white mb-4">{town.region} Rivals</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {regionRivals.map(rival => (
                <Link
                  key={rival.name}
                  href={`/compare?a=${encodeURIComponent(townName)}&b=${encodeURIComponent(rival.name)}`}
                  className="bg-gray-800 border border-gray-700 hover:border-gray-600 rounded-lg p-3 transition-colors"
                >
                  <div className="text-white font-medium">{rival.name}</div>
                  <div className="text-gray-400 text-sm">{rival.approved} approved</div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-lg font-bold text-white mb-4">Similar Size Towns</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {similarTowns.map(similar => (
              <Link
                key={similar.name}
                href={`/compare?a=${encodeURIComponent(townName)}&b=${encodeURIComponent(similar.name)}`}
                className="bg-gray-800 border border-gray-700 hover:border-gray-600 rounded-lg p-3 transition-colors"
              >
                <div className="text-white font-medium">{similar.name}</div>
                <div className="text-gray-400 text-sm">{similar.approved} approved</div>
              </Link>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link 
            href={`/compare?a=${encodeURIComponent(townName)}&b=Boston`}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm"
          >
            Compare to Boston
          </Link>
          <Link 
            href="/estimate"
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm"
          >
            Cost Estimator
          </Link>
          <Link 
            href="/blog/massachusetts-adu-year-one"
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm"
          >
            Read: Year One Analysis
          </Link>
        </div>
      </main>

      <footer className="border-t border-gray-800 mt-12">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 text-xs text-gray-500">
            <div>Data: EOHLC Survey Feb 2026 · Population: Census 2024</div>
            <div className="flex gap-4">
              <Link href="/" className="hover:text-white">Home</Link>
              <Link href="/leaderboard" className="hover:text-white">Leaderboard</Link>
              <Link href="/blog" className="hover:text-white">Blog</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
