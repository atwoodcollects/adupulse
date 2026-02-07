'use client'

import Link from 'next/link'
import TownNav from '@/components/TownNav'
import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

const towns = [
  { name: 'Boston', submitted: 69, approved: 44, detached: 11, attached: 58, population: 673458 },
  { name: 'Lawrence', submitted: 44, approved: 32, detached: 18, attached: 26, population: 89332 },
  { name: 'Plymouth', submitted: 42, approved: 34, detached: 18, attached: 24, population: 66663 },
  { name: 'Newton', submitted: 40, approved: 18, detached: 16, attached: 24, population: 90700 },
  { name: 'Somerville', submitted: 40, approved: 24, detached: 34, attached: 6, population: 82149 },
  { name: 'Barnstable', submitted: 31, approved: 6, detached: 13, attached: 18, population: 49831 },
  { name: 'Worcester', submitted: 31, approved: 23, detached: 15, attached: 16, population: 211286 },
  { name: 'Haverhill', submitted: 29, approved: 13, detached: 13, attached: 16, population: 68291 },
  { name: 'Methuen', submitted: 28, approved: 21, detached: 9, attached: 19, population: 53043 },
  { name: 'Nantucket', submitted: 27, approved: 27, detached: 24, attached: 3, population: 14670 },
  { name: 'Lowell', submitted: 26, approved: 26, detached: 9, attached: 17, population: 120418 },
  { name: 'Fall River', submitted: 25, approved: 13, detached: 9, attached: 16, population: 94689 },
  { name: 'Milton', submitted: 25, approved: 24, detached: 1, attached: 24, population: 28811 },
  { name: 'Marshfield', submitted: 24, approved: 11, detached: 18, attached: 6, population: 26043 },
  { name: 'Amherst', submitted: 23, approved: 12, detached: 14, attached: 9, population: 40989 },
  { name: 'Lynn', submitted: 22, approved: 9, detached: 5, attached: 17, population: 103489 },
  { name: 'Medford', submitted: 22, approved: 19, detached: 13, attached: 9, population: 59898 },
  { name: 'Northampton', submitted: 20, approved: 15, detached: 7, attached: 13, population: 31315 },
  { name: 'Billerica', submitted: 18, approved: 13, detached: 6, attached: 12, population: 42978 },
  { name: 'Fairhaven', submitted: 18, approved: 18, detached: 9, attached: 9, population: 16005 },
  { name: 'Middleborough', submitted: 18, approved: 18, detached: 14, attached: 4, population: 24847 },
  { name: 'Raynham', submitted: 18, approved: 18, detached: 1, attached: 17, population: 15861 },
  { name: 'Freetown', submitted: 17, approved: 13, detached: 12, attached: 5, population: 9380 },
  { name: 'Quincy', submitted: 17, approved: 6, detached: 3, attached: 14, population: 103434 },
  { name: 'Revere', submitted: 17, approved: 9, detached: 0, attached: 17, population: 60702 },
  { name: 'Brockton', submitted: 16, approved: 5, detached: 8, attached: 8, population: 105788 },
  { name: 'Shrewsbury', submitted: 16, approved: 9, detached: 3, attached: 13, population: 39620 },
  { name: 'Attleboro', submitted: 15, approved: 10, detached: 3, attached: 12, population: 47085 },
  { name: 'Harwich', submitted: 15, approved: 15, detached: 15, attached: 0, population: 13620 },
  { name: 'Tisbury', submitted: 15, approved: 14, detached: 6, attached: 9, population: 4927 },
  { name: 'Brookline', submitted: 14, approved: 10, detached: 8, attached: 6, population: 63925 },
  { name: 'Taunton', submitted: 14, approved: 7, detached: 11, attached: 3, population: 61936 },
  { name: 'Westport', submitted: 14, approved: 14, detached: 5, attached: 9, population: 16705 },
  { name: 'Beverly', submitted: 12, approved: 12, detached: 10, attached: 2, population: 43223 },
  { name: 'Dracut', submitted: 12, approved: 10, detached: 7, attached: 5, population: 32972 },
  { name: 'Falmouth', submitted: 12, approved: 12, detached: 7, attached: 5, population: 33227 },
  { name: 'Ipswich', submitted: 12, approved: 9, detached: 7, attached: 5, population: 14110 },
  { name: 'Peabody', submitted: 12, approved: 7, detached: 4, attached: 8, population: 55418 },
  { name: 'Randolph', submitted: 12, approved: 5, detached: 5, attached: 7, population: 35114 },
  { name: 'Lexington', submitted: 6, approved: 6, detached: 2, attached: 4, population: 34743 },
  { name: 'Needham', submitted: 4, approved: 4, detached: 1, attached: 3, population: 32931 },
  { name: 'Duxbury', submitted: 3, approved: 2, detached: 3, attached: 0, population: 16377 },
  { name: 'Sudbury', submitted: 3, approved: 3, detached: 2, attached: 1, population: 19805 },
  { name: 'Andover', submitted: 10, approved: 9, detached: 3, attached: 7, population: 36927 },
  { name: 'Arlington', submitted: 7, approved: 6, detached: 3, attached: 4, population: 47112 },
  { name: 'Cambridge', submitted: 8, approved: 6, detached: 4, attached: 4, population: 121186 },
  { name: 'Framingham', submitted: 8, approved: 6, detached: 2, attached: 6, population: 73361 },
  { name: 'Malden', submitted: 8, approved: 5, detached: 3, attached: 5, population: 66693 },
  { name: 'Salem', submitted: 9, approved: 9, detached: 2, attached: 7, population: 45677 },
  { name: 'Chelmsford', submitted: 7, approved: 7, detached: 3, attached: 4, population: 36953 },
  { name: 'Danvers', submitted: 9, approved: 2, detached: 3, attached: 6, population: 28590 },
  { name: 'Gardner', submitted: 7, approved: 0, detached: 2, attached: 5, population: 21381 },
  { name: 'Everett', submitted: 7, approved: 2, detached: 3, attached: 4, population: 51825 },
  { name: 'Wayland', submitted: 7, approved: 2, detached: 6, attached: 1, population: 14054 },
].sort((a, b) => a.name.localeCompare(b.name))

function getSuggestedRivals(townName: string) {
  const town = towns.find(t => t.name === townName)
  if (!town) return []
  
  return towns
    .filter(t => t.name !== townName)
    .sort((a, b) => Math.abs(a.population - town.population) - Math.abs(b.population - town.population))
    .slice(0, 3)
}

function StatCompare({ 
  label, 
  valueA, 
  valueB, 
  maxValue,
  format = 'number',
  higherWins = true 
}: { 
  label: string
  valueA: number
  valueB: number
  maxValue: number
  format?: 'number' | 'percent' | 'perCapita'
  higherWins?: boolean
}) {
  const aWins = higherWins ? valueA > valueB : valueA < valueB
  const bWins = higherWins ? valueB > valueA : valueA > valueB
  const tie = valueA === valueB

  const formatValue = (val: number) => {
    if (format === 'percent') return Math.min(Math.round(val * 100), 100) + '%'
    if (format === 'perCapita') return val.toFixed(1)
    return val.toLocaleString()
  }

  const getBarWidth = (val: number) => {
    if (format === 'percent') return Math.min(val * 100, 100)
    return maxValue > 0 ? (val / maxValue) * 100 : 0
  }

  return (
    <div className="py-4 border-b border-gray-700/50">
      <div className="text-center text-gray-400 text-sm mb-3">{label}</div>
      <div className="grid grid-cols-2 gap-4">
        <div className="text-right">
          <div className={`text-lg font-bold mb-1 ${aWins ? 'text-emerald-400' : tie ? 'text-white' : 'text-gray-400'}`}>
            {formatValue(valueA)} {aWins && '✓'}
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden flex justify-end">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${aWins ? 'bg-emerald-500' : 'bg-gray-500'}`}
              style={{ width: `${getBarWidth(valueA)}%` }}
            />
          </div>
        </div>
        <div className="text-left">
          <div className={`text-lg font-bold mb-1 ${bWins ? 'text-emerald-400' : tie ? 'text-white' : 'text-gray-400'}`}>
            {bWins && '✓'} {formatValue(valueB)}
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${bWins ? 'bg-emerald-500' : 'bg-gray-500'}`}
              style={{ width: `${getBarWidth(valueB)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ComparePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const [townA, setTownA] = useState('Newton')
  const [townB, setTownB] = useState('Lexington')

  useEffect(() => {
    const a = searchParams.get('a')
    const b = searchParams.get('b')
    if (a && towns.find(t => t.name === a)) setTownA(a)
    if (b && towns.find(t => t.name === b)) setTownB(b)
  }, [searchParams])

  const updateUrl = (a: string, b: string) => {
    router.push(`/compare?a=${encodeURIComponent(a)}&b=${encodeURIComponent(b)}`, { scroll: false })
  }

  const handleTownAChange = (name: string) => {
    setTownA(name)
    updateUrl(name, townB)
  }

  const handleTownBChange = (name: string) => {
    setTownB(name)
    updateUrl(townA, name)
  }

  const swapTowns = () => {
    setTownA(townB)
    setTownB(townA)
    updateUrl(townB, townA)
  }

  const dataA = towns.find(t => t.name === townA)
  const dataB = towns.find(t => t.name === townB)

  if (!dataA || !dataB) return null

  const rateA = dataA.submitted > 0 ? dataA.approved / dataA.submitted : 0
  const rateB = dataB.submitted > 0 ? dataB.approved / dataB.submitted : 0
  
  const perCapitaA = (dataA.approved / dataA.population) * 10000
  const perCapitaB = (dataB.approved / dataB.population) * 10000

  const maxApproved = Math.max(dataA.approved, dataB.approved, 1)
  const maxSubmitted = Math.max(dataA.submitted, dataB.submitted, 1)
  const maxPerCapita = Math.max(perCapitaA, perCapitaB, 1)
  const maxDetached = Math.max(dataA.detached, dataB.detached, 1)
  const maxAttached = Math.max(dataA.attached, dataB.attached, 1)

  let winsA = 0
  let winsB = 0
  
  if (dataA.approved > dataB.approved) winsA++; else if (dataB.approved > dataA.approved) winsB++;
  if (rateA > rateB) winsA++; else if (rateB > rateA) winsB++;
  if (perCapitaA > perCapitaB) winsA++; else if (perCapitaB > perCapitaA) winsB++;
  if (dataA.submitted > dataB.submitted) winsA++; else if (dataB.submitted > dataA.submitted) winsB++;

  const suggestedRivals = getSuggestedRivals(townA)
  const shareUrl = `https://adupulse.com/compare?a=${encodeURIComponent(townA)}&b=${encodeURIComponent(townB)}`

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-lg md:text-xl font-bold text-white tracking-tight">ADU Pulse</span>
            </Link>
            <TownNav current="Compare" />
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white text-center mb-2">Town vs Town</h1>
        <p className="text-gray-400 text-center mb-8">Compare ADU progress between Massachusetts towns</p>

        <div className="flex items-center gap-2 mb-8">
          <select
            value={townA}
            onChange={(e) => handleTownAChange(e.target.value)}
            className="flex-1 bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 text-lg font-medium focus:outline-none focus:border-blue-500"
          >
            {towns.map(t => (
              <option key={t.name} value={t.name}>{t.name}</option>
            ))}
          </select>
          
          <button
            onClick={swapTowns}
            className="p-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors"
            title="Swap towns"
          >
            ⇄
          </button>
          
          <select
            value={townB}
            onChange={(e) => handleTownBChange(e.target.value)}
            className="flex-1 bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 text-lg font-medium focus:outline-none focus:border-blue-500"
          >
            {towns.map(t => (
              <option key={t.name} value={t.name}>{t.name}</option>
            ))}
          </select>
        </div>

        <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-blue-500/30 rounded-xl p-6 mb-6">
          <div className="grid grid-cols-3 items-center">
            <div className="text-center">
              <div className={`text-4xl font-bold ${winsA > winsB ? 'text-emerald-400' : 'text-white'}`}>{winsA}</div>
              <div className="text-gray-400 text-sm mt-1">{townA}</div>
            </div>
            <div className="text-center text-gray-500 text-2xl">vs</div>
            <div className="text-center">
              <div className={`text-4xl font-bold ${winsB > winsA ? 'text-emerald-400' : 'text-white'}`}>{winsB}</div>
              <div className="text-gray-400 text-sm mt-1">{townB}</div>
            </div>
          </div>
          {winsA !== winsB && (
            <div className="text-center mt-4 text-emerald-400 font-medium">
              🏆 {winsA > winsB ? townA : townB} leads
            </div>
          )}
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 md:p-6">
          <StatCompare 
            label="Approved" 
            valueA={dataA.approved} 
            valueB={dataB.approved}
            maxValue={maxApproved}
          />
          <StatCompare 
            label="Approval Rate" 
            valueA={rateA} 
            valueB={rateB}
            maxValue={1}
            format="percent"
          />
          <StatCompare 
            label="Per 10k Residents" 
            valueA={perCapitaA} 
            valueB={perCapitaB}
            maxValue={maxPerCapita}
            format="perCapita"
          />
          <StatCompare 
            label="Submitted" 
            valueA={dataA.submitted} 
            valueB={dataB.submitted}
            maxValue={maxSubmitted}
          />
          <StatCompare 
            label="Detached" 
            valueA={dataA.detached} 
            valueB={dataB.detached}
            maxValue={maxDetached}
          />
          <StatCompare 
            label="Attached" 
            valueA={dataA.attached} 
            valueB={dataB.attached}
            maxValue={maxAttached}
          />
        </div>

        <div className="mt-6">
          <p className="text-gray-400 text-sm mb-3">Challenge {townA} against:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedRivals.map(rival => (
              <button
                key={rival.name}
                onClick={() => handleTownBChange(rival.name)}
                className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 rounded-full text-sm transition-colors"
              >
                {rival.name}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm mb-3">Share this matchup</p>
          <div className="flex justify-center gap-3">
            <a 
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`${townA} vs ${townB} in the MA ADU race:\n\n${townA}: ${dataA.approved} approved (${Math.round(rateA * 100)}%)\n${townB}: ${dataB.approved} approved (${Math.round(rateB * 100)}%)\n\nHow's your town doing?`)}&url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium"
            >
              Share on X
            </a>
            <button
              onClick={() => {
                navigator.clipboard.writeText(shareUrl)
              }}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium"
            >
              Copy Link
            </button>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/leaderboard" className="text-blue-400 hover:underline text-sm">
            View full leaderboard →
          </Link>
        </div>
      </main>

      <footer className="border-t border-gray-800 mt-12">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 text-xs text-gray-500">
            <div>Data: EOHLC Survey Feb 2026 · Population: Census 2024</div>
            <div className="flex gap-4">
              <Link href="/" className="hover:text-white">Home</Link>
              <Link href="/blog" className="hover:text-white">Blog</Link>
              <Link href="/estimate" className="hover:text-white">Estimator</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
