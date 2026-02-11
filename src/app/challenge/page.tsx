'use client'

import Link from 'next/link'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

const townData: Record<string, { approved: number; submitted: number; population: number }> = {
  'Amherst': { approved: 12, submitted: 23, population: 40989 },
  'Andover': { approved: 9, submitted: 10, population: 36927 },
  'Arlington': { approved: 6, submitted: 7, population: 47112 },
  'Attleboro': { approved: 10, submitted: 15, population: 47085 },
  'Barnstable': { approved: 6, submitted: 31, population: 49831 },
  'Beverly': { approved: 12, submitted: 12, population: 43223 },
  'Billerica': { approved: 13, submitted: 18, population: 42978 },
  'Boston': { approved: 44, submitted: 69, population: 673458 },
  'Brockton': { approved: 5, submitted: 16, population: 105788 },
  'Brookline': { approved: 10, submitted: 14, population: 63925 },
  'Cambridge': { approved: 6, submitted: 8, population: 121186 },
  'Chelmsford': { approved: 7, submitted: 7, population: 36953 },
  'Danvers': { approved: 2, submitted: 9, population: 28590 },
  'Dracut': { approved: 10, submitted: 12, population: 32972 },
  'Duxbury': { approved: 2, submitted: 3, population: 16377 },
  'Everett': { approved: 2, submitted: 7, population: 51825 },
  'Fairhaven': { approved: 18, submitted: 18, population: 16005 },
  'Fall River': { approved: 13, submitted: 25, population: 94689 },
  'Falmouth': { approved: 12, submitted: 12, population: 33227 },
  'Framingham': { approved: 6, submitted: 8, population: 73361 },
  'Freetown': { approved: 13, submitted: 17, population: 9380 },
  'Gardner': { approved: 0, submitted: 7, population: 21381 },
  'Harwich': { approved: 15, submitted: 15, population: 13620 },
  'Haverhill': { approved: 13, submitted: 29, population: 68291 },
  'Ipswich': { approved: 9, submitted: 12, population: 14110 },
  'Lawrence': { approved: 32, submitted: 44, population: 89332 },
  'Lexington': { approved: 6, submitted: 6, population: 34743 },
  'Lowell': { approved: 26, submitted: 26, population: 120418 },
  'Lynn': { approved: 9, submitted: 22, population: 103489 },
  'Malden': { approved: 5, submitted: 8, population: 66693 },
  'Marshfield': { approved: 11, submitted: 24, population: 26043 },
  'Medford': { approved: 19, submitted: 22, population: 59898 },
  'Methuen': { approved: 21, submitted: 28, population: 53043 },
  'Middleborough': { approved: 18, submitted: 18, population: 24847 },
  'Milton': { approved: 24, submitted: 25, population: 28811 },
  'Nantucket': { approved: 27, submitted: 27, population: 14670 },
  'Needham': { approved: 4, submitted: 4, population: 32931 },
  'Newton': { approved: 18, submitted: 40, population: 90700 },
  'Northampton': { approved: 15, submitted: 20, population: 31315 },
  'Peabody': { approved: 7, submitted: 12, population: 55418 },
  'Plymouth': { approved: 34, submitted: 42, population: 66663 },
  'Quincy': { approved: 6, submitted: 17, population: 103434 },
  'Randolph': { approved: 5, submitted: 12, population: 35114 },
  'Raynham': { approved: 18, submitted: 18, population: 15861 },
  'Revere': { approved: 9, submitted: 17, population: 60702 },
  'Salem': { approved: 9, submitted: 9, population: 45677 },
  'Shrewsbury': { approved: 9, submitted: 16, population: 39620 },
  'Somerville': { approved: 24, submitted: 40, population: 82149 },
  'Sudbury': { approved: 3, submitted: 3, population: 19805 },
  'Taunton': { approved: 7, submitted: 14, population: 61936 },
  'Tisbury': { approved: 14, submitted: 15, population: 4927 },
  'Wayland': { approved: 2, submitted: 7, population: 14054 },
  'Westport': { approved: 14, submitted: 14, population: 16705 },
  'Worcester': { approved: 23, submitted: 31, population: 211286 },
}

function ChallengeContent() {
  const searchParams = useSearchParams()
  
  const townA = searchParams.get('a') || ''
  const townB = searchParams.get('b') || ''
  const startDate = searchParams.get('start') || ''
  const endDate = searchParams.get('end') || ''
  const issuedBy = searchParams.get('by') || ''

  const dataA = townData[townA]
  const dataB = townData[townB]

  if (!dataA || !dataB || !startDate || !endDate) {
    return (
      <main className="max-w-lg mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Challenge Not Found</h1>
        <p className="text-gray-400 mb-6">This challenge link is invalid or incomplete.</p>
        <Link href="/challenge/new" className="text-blue-400 hover:underline">
          Create a new challenge →
        </Link>
      </main>
    )
  }

  const now = new Date()
  const start = new Date(startDate)
  const end = new Date(endDate)
  
  const hasStarted = now >= start
  const hasEnded = now > end
  
  const daysRemaining = Math.max(0, Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
  const daysUntilStart = Math.max(0, Math.ceil((start.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))

  const formatDate = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  const aWins = dataA.approved > dataB.approved
  const bWins = dataB.approved > dataA.approved
  const tie = dataA.approved === dataB.approved
  const lead = Math.abs(dataA.approved - dataB.approved)

  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
  const shareText = `🏆 ADU Challenge: ${townA} vs ${townB}\n\n${townA}: ${dataA.approved} approved\n${townB}: ${dataB.approved} approved\n\n${hasEnded ? (tie ? "It's a tie!" : `${aWins ? townA : townB} wins!`) : `${daysRemaining} days remaining`}`

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      {/* Status Banner */}
      {!hasStarted && (
        <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg px-4 py-2 mb-6 text-center">
          <span className="text-yellow-400">⏳ Challenge starts in {daysUntilStart} days</span>
        </div>
      )}
      {hasEnded && (
        <div className="bg-emerald-900/30 border border-emerald-500/30 rounded-lg px-4 py-2 mb-6 text-center">
          <span className="text-emerald-400">🏁 Challenge Complete!</span>
        </div>
      )}

      {/* Title */}
      <h1 className="text-2xl md:text-3xl font-bold text-white text-center mb-2">🏆 ADU Challenge</h1>
      <p className="text-gray-400 text-center mb-8">
        {formatDate(start)} – {formatDate(end)}
      </p>

      {/* Scoreboard */}
      <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-blue-500/30 rounded-xl p-6 md:p-8 mb-6">
        <div className="grid grid-cols-3 items-center gap-4">
          {/* Town A */}
          <div className="text-center">
            <div className={`text-4xl md:text-5xl font-bold ${aWins ? 'text-emerald-400' : 'text-white'}`}>
              {dataA.approved}
            </div>
            <div className="text-lg md:text-xl font-medium text-white mt-2">{townA}</div>
            <div className="text-gray-500 text-sm">approved</div>
          </div>

          {/* VS */}
          <div className="text-center">
            <div className="text-gray-500 text-2xl md:text-3xl font-bold">vs</div>
          </div>

          {/* Town B */}
          <div className="text-center">
            <div className={`text-4xl md:text-5xl font-bold ${bWins ? 'text-emerald-400' : 'text-white'}`}>
              {dataB.approved}
            </div>
            <div className="text-lg md:text-xl font-medium text-white mt-2">{townB}</div>
            <div className="text-gray-500 text-sm">approved</div>
          </div>
        </div>

        {/* Lead indicator */}
        <div className="text-center mt-6 pt-4 border-t border-gray-700">
          {hasEnded ? (
            <div className={`text-lg font-medium ${tie ? 'text-gray-400' : 'text-emerald-400'}`}>
              {tie ? "It's a tie!" : `🏆 ${aWins ? townA : townB} wins by ${lead}!`}
            </div>
          ) : tie ? (
            <div className="text-gray-400">Currently tied</div>
          ) : (
            <div className="text-emerald-400">
              {aWins ? townA : townB} leads by {lead}
            </div>
          )}
        </div>
      </div>

      {/* Countdown */}
      {hasStarted && !hasEnded && (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 mb-6 text-center">
          <div className="text-3xl font-bold text-white">{daysRemaining}</div>
          <div className="text-gray-400">days remaining</div>
        </div>
      )}

      {/* Stats Comparison */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 mb-6">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-white font-bold">{dataA.submitted}</div>
            <div className="text-gray-500 text-xs">submitted</div>
          </div>
          <div className="text-gray-600">|</div>
          <div>
            <div className="text-white font-bold">{dataB.submitted}</div>
            <div className="text-gray-500 text-xs">submitted</div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center mt-3 pt-3 border-t border-gray-700">
          <div>
            <div className="text-white font-bold">{Math.round(dataA.approved / dataA.submitted * 100)}%</div>
            <div className="text-gray-500 text-xs">approval rate</div>
          </div>
          <div className="text-gray-600">|</div>
          <div>
            <div className="text-white font-bold">{Math.round(dataB.approved / dataB.submitted * 100)}%</div>
            <div className="text-gray-500 text-xs">approval rate</div>
          </div>
        </div>
      </div>

      {/* Share */}
      <div className="text-center mb-6">
        <p className="text-gray-400 text-sm mb-3">Share this challenge</p>
        <div className="flex justify-center gap-3">
          <a 
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium"
          >
            Share on X
          </a>
          <button
            onClick={() => navigator.clipboard.writeText(shareUrl)}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium"
          >
            Copy Link
          </button>
        </div>
      </div>

      {/* Issued By */}
      {issuedBy && (
        <p className="text-gray-500 text-sm text-center">
          Challenge issued by {issuedBy}
        </p>
      )}

      {/* Actions */}
      <div className="flex justify-center gap-4 mt-8">
        <Link 
          href="/challenge/new"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium"
        >
          Create Your Own Challenge
        </Link>
        <Link 
          href={`/compare?a=${townA}&b=${townB}`}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium"
        >
          View Full Comparison
        </Link>
      </div>
    </main>
  )
}

export default function ChallengePage() {
  return (
    <div className="min-h-screen bg-gray-900">
      <NavBar current="Challenge" />

      <Suspense fallback={
        <main className="max-w-lg mx-auto px-4 py-8 text-center">
          <div className="text-gray-400">Loading challenge...</div>
        </main>
      }>
        <ChallengeContent />
      </Suspense>
      <Footer />
    </div>
  )
}
