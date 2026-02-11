'use client'

import Link from 'next/link'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

const towns = [
  'Amherst', 'Andover', 'Arlington', 'Attleboro', 'Barnstable', 'Beverly', 'Billerica',
  'Boston', 'Brockton', 'Brookline', 'Cambridge', 'Chelmsford', 'Danvers', 'Dracut',
  'Duxbury', 'Everett', 'Fairhaven', 'Fall River', 'Falmouth', 'Framingham', 'Freetown',
  'Gardner', 'Harwich', 'Haverhill', 'Ipswich', 'Lawrence', 'Lexington', 'Lowell',
  'Lynn', 'Malden', 'Marshfield', 'Medford', 'Methuen', 'Middleborough', 'Milton',
  'Nantucket', 'Needham', 'Newton', 'Northampton', 'Peabody', 'Plymouth', 'Quincy',
  'Randolph', 'Raynham', 'Revere', 'Salem', 'Shrewsbury', 'Somerville', 'Sudbury',
  'Taunton', 'Tisbury', 'Wayland', 'Westport', 'Worcester'
].sort()

const presetPeriods = [
  { label: 'Spring 2026 (Mar–May)', start: '2026-03-01', end: '2026-05-31' },
  { label: 'Summer 2026 (Jun–Aug)', start: '2026-06-01', end: '2026-08-31' },
  { label: 'Fall 2026 (Sep–Nov)', start: '2026-09-01', end: '2026-11-30' },
  { label: 'Full Year 2026', start: '2026-01-01', end: '2026-12-31' },
]

function NewChallengeForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [townA, setTownA] = useState('')
  const [townB, setTownB] = useState('')
  const [period, setPeriod] = useState(presetPeriods[0])
  const [customStart, setCustomStart] = useState('')
  const [customEnd, setCustomEnd] = useState('')
  const [useCustom, setUseCustom] = useState(false)
  const [issuedBy, setIssuedBy] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const from = searchParams.get('from')
    if (from && towns.includes(from)) {
      setTownA(from)
    }
  }, [searchParams])

  const handleCreate = () => {
    if (!townA || !townB) {
      setError('Please select both towns')
      return
    }
    if (townA === townB) {
      setError('Please select two different towns')
      return
    }

    const start = useCustom ? customStart : period.start
    const end = useCustom ? customEnd : period.end

    if (!start || !end) {
      setError('Please select a challenge period')
      return
    }

    const params = new URLSearchParams({
      a: townA,
      b: townB,
      start,
      end,
    })
    if (issuedBy.trim()) {
      params.set('by', issuedBy.trim())
    }

    router.push(`/challenge?${params.toString()}`)
  }

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 space-y-6">
      <div>
        <label className="block text-gray-400 text-sm mb-2">Your Town</label>
        <select
          value={townA}
          onChange={(e) => setTownA(e.target.value)}
          className="w-full bg-gray-900 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
        >
          <option value="">Select a town...</option>
          {towns.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-gray-400 text-sm mb-2">Challenge</label>
        <select
          value={townB}
          onChange={(e) => setTownB(e.target.value)}
          className="w-full bg-gray-900 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
        >
          <option value="">Select a rival town...</option>
          {towns.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-gray-400 text-sm mb-2">Challenge Period</label>
        <div className="space-y-2">
          {presetPeriods.map((p) => (
            <label key={p.label} className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="period"
                checked={!useCustom && period.label === p.label}
                onChange={() => {
                  setUseCustom(false)
                  setPeriod(p)
                }}
                className="w-4 h-4 text-blue-500"
              />
              <span className="text-white">{p.label}</span>
            </label>
          ))}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="period"
              checked={useCustom}
              onChange={() => setUseCustom(true)}
              className="w-4 h-4 text-blue-500"
            />
            <span className="text-white">Custom dates</span>
          </label>
        </div>

        {useCustom && (
          <div className="mt-3 flex gap-3">
            <input
              type="date"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
              className="flex-1 bg-gray-900 border border-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
            />
            <span className="text-gray-500 self-center">to</span>
            <input
              type="date"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
              className="flex-1 bg-gray-900 border border-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
            />
          </div>
        )}
      </div>

      <div>
        <label className="block text-gray-400 text-sm mb-2">Your Name (optional)</label>
        <input
          type="text"
          value={issuedBy}
          onChange={(e) => setIssuedBy(e.target.value)}
          placeholder="e.g., Bill W."
          className="w-full bg-gray-900 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
        />
      </div>

      {error && (
        <div className="text-red-400 text-sm">{error}</div>
      )}

      <button
        onClick={handleCreate}
        className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium text-lg transition-colors"
      >
        Create Challenge →
      </button>
    </div>
  )
}

export default function NewChallengePage() {
  return (
    <div className="min-h-screen bg-gray-900">
      <NavBar current="Challenge" />

      <main className="max-w-lg mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white text-center mb-2">🏆 Issue a Challenge</h1>
        <p className="text-gray-400 text-center mb-8">Challenge a rival town to an ADU race</p>

        <Suspense fallback={<div className="text-gray-400 text-center">Loading...</div>}>
          <NewChallengeForm />
        </Suspense>

        <p className="text-gray-500 text-sm text-center mt-6">
          Challenges track which town approves more ADUs during the period.
        </p>
      </main>
      <Footer />
    </div>
  )
}
