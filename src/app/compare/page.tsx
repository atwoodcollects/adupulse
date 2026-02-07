'use client'

import Link from 'next/link'
import TownNav from '@/components/TownNav'
import { useState } from 'react'

const towns = [
  { name: 'Boston', submitted: 69, approved: 44, detached: 11, attached: 58, population: 675647 },
  { name: 'Lawrence', submitted: 44, approved: 32, detached: 18, attached: 26, population: 89143 },
  { name: 'Plymouth', submitted: 42, approved: 34, detached: 18, attached: 24, population: 61217 },
  { name: 'Newton', submitted: 40, approved: 18, detached: 16, attached: 24, population: 88923 },
  { name: 'Somerville', submitted: 40, approved: 24, detached: 34, attached: 6, population: 81045 },
  { name: 'Barnstable', submitted: 31, approved: 6, detached: 13, attached: 18, population: 48237 },
  { name: 'Worcester', submitted: 31, approved: 23, detached: 15, attached: 16, population: 206518 },
  { name: 'Haverhill', submitted: 29, approved: 13, detached: 13, attached: 16, population: 67787 },
  { name: 'Methuen', submitted: 28, approved: 21, detached: 9, attached: 19, population: 50706 },
  { name: 'Nantucket', submitted: 27, approved: 27, detached: 24, attached: 3, population: 14255 },
  { name: 'Lowell', submitted: 26, approved: 26, detached: 9, attached: 17, population: 115554 },
  { name: 'Fall River', submitted: 25, approved: 13, detached: 9, attached: 16, population: 94000 },
  { name: 'Milton', submitted: 25, approved: 24, detached: 1, attached: 24, population: 27620 },
  { name: 'Marshfield', submitted: 24, approved: 11, detached: 18, attached: 6, population: 26100 },
  { name: 'Amherst', submitted: 23, approved: 12, detached: 14, attached: 9, population: 40096 },
  { name: 'Lynn', submitted: 22, approved: 9, detached: 5, attached: 17, population: 101253 },
  { name: 'Medford', submitted: 22, approved: 19, detached: 13, attached: 9, population: 59659 },
  { name: 'Northampton', submitted: 20, approved: 15, detached: 7, attached: 13, population: 29571 },
  { name: 'Billerica', submitted: 18, approved: 13, detached: 6, attached: 12, population: 43799 },
  { name: 'Fairhaven', submitted: 18, approved: 18, detached: 9, attached: 9, population: 16441 },
  { name: 'Middleborough', submitted: 18, approved: 18, detached: 14, attached: 4, population: 25726 },
  { name: 'Raynham', submitted: 18, approved: 18, detached: 1, attached: 17, population: 14921 },
  { name: 'Freetown', submitted: 17, approved: 13, detached: 12, attached: 5, population: 9513 },
  { name: 'Quincy', submitted: 17, approved: 6, detached: 3, attached: 14, population: 101636 },
  { name: 'Revere', submitted: 17, approved: 9, detached: 0, attached: 17, population: 62186 },
  { name: 'Brockton', submitted: 16, approved: 5, detached: 8, attached: 8, population: 105643 },
  { name: 'Shrewsbury', submitted: 16, approved: 9, detached: 3, attached: 13, population: 38526 },
  { name: 'Attleboro', submitted: 15, approved: 10, detached: 3, attached: 12, population: 46036 },
  { name: 'Harwich', submitted: 15, approved: 15, detached: 15, attached: 0, population: 13336 },
  { name: 'Tisbury', submitted: 15, approved: 14, detached: 6, attached: 9, population: 4815 },
  { name: 'Brookline', submitted: 14, approved: 10, detached: 8, attached: 6, population: 63191 },
  { name: 'Taunton', submitted: 14, approved: 7, detached: 11, attached: 3, population: 60897 },
  { name: 'Westport', submitted: 14, approved: 14, detached: 5, attached: 9, population: 16118 },
  { name: 'Beverly', submitted: 12, approved: 12, detached: 10, attached: 2, population: 42670 },
  { name: 'Dracut', submitted: 12, approved: 10, detached: 7, attached: 5, population: 32377 },
  { name: 'Falmouth', submitted: 12, approved: 12, detached: 7, attached: 5, population: 33696 },
  { name: 'Ipswich', submitted: 12, approved: 9, detached: 7, attached: 5, population: 14150 },
  { name: 'Peabody', submitted: 12, approved: 7, detached: 4, attached: 8, population: 54458 },
  { name: 'Randolph', submitted: 12, approved: 5, detached: 5, attached: 7, population: 34984 },
  { name: 'Lexington', submitted: 6, approved: 6, detached: 2, attached: 4, population: 34454 },
  { name: 'Needham', submitted: 4, approved: 4, detached: 1, attached: 3, population: 31388 },
  { name: 'Duxbury', submitted: 3, approved: 2, detached: 3, attached: 0, population: 16090 },
  { name: 'Sudbury', submitted: 3, approved: 3, detached: 2, attached: 1, population: 19655 },
  { name: 'Andover', submitted: 10, approved: 9, detached: 3, attached: 7, population: 36480 },
].sort((a, b) => a.name.localeCompare(b.name))

function StatCompare({ 
  label, 
  valueA, 
  valueB, 
  format = 'number',
  higherWins = true 
}: { 
  label: string
  valueA: number
  valueB: number
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

  return (
    <div className="grid grid-cols-3 items-center py-3 border-b border-gray-700/50">
      <div className={`text-right text-lg font-bold ${aWins ? 'text-emerald-400' : tie ? 'text-white' : 'text-gray-400'}`}>
        {formatValue(valueA)} {aWins && '✓'}
      </div>
      <div className="text-center text-gray-500 text-sm">{label}</div>
      <div className={`text-left text-lg font-bold ${bWins ? 'text-emerald-400' : tie ? 'text-white' : 'text-gray-400'}`}>
        {bWins && '✓'} {formatValue(valueB)}
      </div>
    </div>
  )
}

export default function ComparePage() {
  const [townA, setTownA] = useState('Newton')
  const [townB, setTownB] = useState('Lexington')

  const dataA = towns.find(t => t.name === townA)
  const dataB = towns.find(t => t.name === townB)

  if (!dataA || !dataB) return null

  const rateA = dataA.submitted > 0 ? dataA.approved / dataA.submitted : 0
  const rateB = dataB.submitted > 0 ? dataB.approved / dataB.submitted : 0
  
  const perCapitaA = (dataA.approved / dataA.population) * 10000
  const perCapitaB = (dataB.approved / dataB.population) * 10000

  // Count wins
  let winsA = 0
  let winsB = 0
  
  if (dataA.approved > dataB.approved) winsA++; else if (dataB.approved > dataA.approved) winsB++;
  if (rateA > rateB) winsA++; else if (rateB > rateA) winsB++;
  if (perCapitaA > perCapitaB) winsA++; else if (perCapitaB > perCapitaA) winsB++;
  if (dataA.submitted > dataB.submitted) winsA++; else if (dataB.submitted > dataA.submitted) winsB++;

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
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

        {/* Town Selectors */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <select
            value={townA}
            onChange={(e) => setTownA(e.target.value)}
            className="bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 text-lg font-medium focus:outline-none focus:border-blue-500"
          >
            {towns.map(t => (
              <option key={t.name} value={t.name}>{t.name}</option>
            ))}
          </select>
          <select
            value={townB}
            onChange={(e) => setTownB(e.target.value)}
            className="bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 text-lg font-medium focus:outline-none focus:border-blue-500"
          >
            {towns.map(t => (
              <option key={t.name} value={t.name}>{t.name}</option>
            ))}
          </select>
        </div>

        {/* Score Banner */}
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

        {/* Stats Comparison */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 md:p-6">
          <StatCompare 
            label="Approved" 
            valueA={dataA.approved} 
            valueB={dataB.approved} 
          />
          <StatCompare 
            label="Approval Rate" 
            valueA={rateA} 
            valueB={rateB} 
            format="percent"
          />
          <StatCompare 
            label="Per 10k Residents" 
            valueA={perCapitaA} 
            valueB={perCapitaB} 
            format="perCapita"
          />
          <StatCompare 
            label="Submitted" 
            valueA={dataA.submitted} 
            valueB={dataB.submitted} 
          />
          <StatCompare 
            label="Detached" 
            valueA={dataA.detached} 
            valueB={dataB.detached} 
          />
          <StatCompare 
            label="Attached" 
            valueA={dataA.attached} 
            valueB={dataB.attached} 
          />
        </div>

        {/* Share CTA */}
        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm mb-3">Share this matchup</p>
          <div className="flex justify-center gap-3">
            <a 
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`${townA} vs ${townB} in the ADU race:\n\n${townA}: ${dataA.approved} approved (${Math.round(rateA * 100)}%)\n${townB}: ${dataB.approved} approved (${Math.round(rateB * 100)}%)\n\nWho's winning in your town?`)}&url=${encodeURIComponent('https://adupulse.com/compare')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium"
            >
              Share on X
            </a>
            <button
              onClick={() => {
                navigator.clipboard.writeText(`${townA} vs ${townB} ADU comparison: adupulse.com/compare`)
              }}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium"
            >
              Copy Link
            </button>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-12">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 text-xs text-gray-500">
            <div>Data: EOHLC Survey Feb 2026</div>
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
