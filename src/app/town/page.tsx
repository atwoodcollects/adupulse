'use client'

import Link from 'next/link'
import TownNav from '@/components/TownNav'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

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

export default function TownSelectPage() {
  const router = useRouter()
  const [selected, setSelected] = useState('')

  const handleGo = () => {
    if (selected) {
      router.push(`/town/${encodeURIComponent(selected)}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-lg md:text-xl font-bold text-white tracking-tight">ADU Pulse</span>
            </Link>
            <TownNav current="My Town" />
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-12">
        <h1 className="text-2xl md:text-3xl font-bold text-white text-center mb-2">Find Your Town</h1>
        <p className="text-gray-400 text-center mb-8">See ADU stats, rankings, and challenges for your town</p>

        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <select
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            className="w-full bg-gray-900 border border-gray-600 text-white rounded-lg px-4 py-3 text-lg focus:outline-none focus:border-blue-500 mb-4"
          >
            <option value="">Select your town...</option>
            {towns.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          <button
            onClick={handleGo}
            disabled={!selected}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-lg font-medium text-lg transition-colors"
          >
            View Town →
          </button>
        </div>

        <p className="text-gray-500 text-sm text-center mt-6">
          54 towns tracked · More coming soon
        </p>
      </main>
    </div>
  )
}
