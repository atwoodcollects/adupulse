'use client'

import Link from 'next/link'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import { useTown } from '@/contexts/TownContext'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const popularTowns = [
  { name: 'Boston', approved: 44, submitted: 69, region: 'Metro Boston' },
  { name: 'Plymouth', approved: 34, submitted: 42, region: 'South Shore' },
  { name: 'Lawrence', approved: 32, submitted: 44, region: 'Merrimack Valley' },
  { name: 'Nantucket', approved: 27, submitted: 27, region: 'Islands' },
  { name: 'Lowell', approved: 26, submitted: 26, region: 'Merrimack Valley' },
  { name: 'Milton', approved: 24, submitted: 25, region: 'Metro Boston' },
  { name: 'Somerville', approved: 24, submitted: 40, region: 'Metro Boston' },
  { name: 'Worcester', approved: 23, submitted: 31, region: 'Central MA' },
  { name: 'Methuen', approved: 21, submitted: 28, region: 'Merrimack Valley' },
  { name: 'Medford', approved: 19, submitted: 22, region: 'Metro Boston' },
  { name: 'Newton', approved: 18, submitted: 40, region: 'Metro Boston' },
  { name: 'Fairhaven', approved: 18, submitted: 18, region: 'South Coast' },
]

const allTowns = [
  'Andover', 'Arlington', 'Attleboro', 'Barnstable', 'Beverly', 'Billerica', 'Boston',
  'Brockton', 'Brookline', 'Cambridge', 'Chelmsford', 'Danvers', 'Dracut', 'Duxbury',
  'Everett', 'Fairhaven', 'Fall River', 'Falmouth', 'Framingham', 'Freetown', 'Gardner',
  'Harwich', 'Haverhill', 'Ipswich', 'Lawrence', 'Lexington', 'Lowell', 'Lynn', 'Malden',
  'Marshfield', 'Medford', 'Methuen', 'Middleborough', 'Milton', 'Nantucket', 'Needham',
  'Newton', 'Northampton', 'Peabody', 'Plymouth', 'Quincy', 'Randolph', 'Raynham',
  'Revere', 'Salem', 'Shrewsbury', 'Somerville', 'Sudbury', 'Taunton', 'Tisbury',
  'Wayland', 'Westport', 'Worcester',
]

export default function MyTownPage() {
  const { selectedTown, setSelectedTown } = useTown()
  const router = useRouter()
  const [search, setSearch] = useState('')

  const handleSelect = (town: string) => {
    setSelectedTown(town)
    const slug = town.toLowerCase().replace(/\s+/g, '-')
    // Route to town detail if SEO page exists, otherwise town generic page
    router.push(`/towns/${slug}`)
  }

  const filtered = search.trim()
    ? allTowns.filter(t => t.toLowerCase().includes(search.toLowerCase()))
    : []

  return (
    <div className="min-h-screen bg-gray-900">
      <NavBar current="My Town" />

      <main className="max-w-2xl mx-auto px-4 py-6 md:py-10">
        {selectedTown ? (
          /* Already selected — show quick stats + actions */
          <div>
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">📍</div>
              <h1 className="text-2xl font-bold text-white mb-1">Your Town: {selectedTown}</h1>
              <button
                onClick={() => { setSelectedTown(''); setSearch('') }}
                className="text-gray-500 text-sm hover:text-gray-300"
              >
                Change town
              </button>
            </div>

            {/* Quick actions */}
            <div className="space-y-3">
              <Link href={`/towns/${selectedTown.toLowerCase().replace(/\s+/g, '-')}`}
                className="block bg-gray-800 border border-gray-700 rounded-xl p-4 hover:bg-gray-750 active:bg-gray-700 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-xl">📊</span>
                  <div>
                    <div className="text-white font-medium">View {selectedTown} ADU Data</div>
                    <div className="text-gray-400 text-sm">Permits, approval rates, and trends</div>
                  </div>
                  <span className="text-gray-500 ml-auto">→</span>
                </div>
              </Link>
              <Link href="/estimate"
                className="block bg-gray-800 border border-gray-700 rounded-xl p-4 hover:bg-gray-750 active:bg-gray-700 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-xl">💰</span>
                  <div>
                    <div className="text-white font-medium">Estimate ADU Cost in {selectedTown}</div>
                    <div className="text-gray-400 text-sm">Based on real permit data</div>
                  </div>
                  <span className="text-gray-500 ml-auto">→</span>
                </div>
              </Link>
              <Link href="/club"
                className="block bg-gray-800 border border-gray-700 rounded-xl p-4 hover:bg-gray-750 active:bg-gray-700 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-xl">👥</span>
                  <div>
                    <div className="text-white font-medium">Join {selectedTown} ADU Group</div>
                    <div className="text-gray-400 text-sm">Get group rates from vetted builders</div>
                  </div>
                  <span className="text-gray-500 ml-auto">→</span>
                </div>
              </Link>
              <Link href="/quiz"
                className="block bg-gray-800 border border-gray-700 rounded-xl p-4 hover:bg-gray-750 active:bg-gray-700 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-xl">✅</span>
                  <div>
                    <div className="text-white font-medium">Take the ADU Feasibility Quiz</div>
                    <div className="text-gray-400 text-sm">2 minutes to check eligibility</div>
                  </div>
                  <span className="text-gray-500 ml-auto">→</span>
                </div>
              </Link>
            </div>
          </div>
        ) : (
          /* No town selected — picker */
          <div>
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">📍</div>
              <h1 className="text-2xl font-bold text-white mb-2">Find Your Town</h1>
              <p className="text-gray-400">Select your town to get personalized ADU data and recommendations.</p>
            </div>

            {/* Search */}
            <div className="mb-6">
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search for your town..."
                className="w-full bg-gray-800 border border-gray-600 rounded-xl px-4 py-4 sm:py-3 text-white text-base placeholder-gray-500 focus:border-blue-500 focus:outline-none min-h-[48px]"
                autoFocus
              />
              {/* Search results */}
              {search.trim() && (
                <div className="mt-2 bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
                  {filtered.length === 0 ? (
                    <div className="p-4 text-gray-500 text-sm text-center">No towns found matching &ldquo;{search}&rdquo;</div>
                  ) : (
                    filtered.slice(0, 8).map(town => (
                      <button
                        key={town}
                        onClick={() => handleSelect(town)}
                        className="w-full text-left px-4 py-3 text-white hover:bg-gray-700 active:bg-gray-600 border-b border-gray-700/50 last:border-0 min-h-[48px] text-base"
                      >
                        {town}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Popular towns */}
            {!search.trim() && (
              <div>
                <h2 className="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider">Most Active Towns</h2>
                <div className="grid grid-cols-1 gap-2">
                  {popularTowns.map(town => {
                    const rate = Math.round((town.approved / town.submitted) * 100)
                    return (
                      <button
                        key={town.name}
                        onClick={() => handleSelect(town.name)}
                        className="flex items-center justify-between bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 hover:bg-gray-750 active:bg-gray-700 transition-colors min-h-[52px] text-left"
                      >
                        <div>
                          <span className="text-white font-medium">{town.name}</span>
                          <span className="text-gray-500 text-xs ml-2">{town.region}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-emerald-400 font-bold text-sm">{town.approved} approved</span>
                          <span className="text-gray-500 text-xs">{rate}%</span>
                        </div>
                      </button>
                    )
                  })}
                </div>
                <div className="text-center mt-4">
                  <Link href="/" className="text-blue-400 text-sm hover:underline">See all 217 towns →</Link>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
