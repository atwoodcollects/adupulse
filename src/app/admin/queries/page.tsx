'use client'

import { useState } from 'react'

interface QueryEntry {
  timestamp: string
  question: string
  towns: string[]
}

export default function AdminQueriesPage() {
  const [password, setPassword] = useState('')
  const [entries, setEntries] = useState<QueryEntry[]>([])
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState('')

  async function fetchLog() {
    setError('')
    try {
      const res = await fetch(`/api/queries?password=${encodeURIComponent(password)}`)
      if (!res.ok) {
        setError('Invalid password')
        return
      }
      const data = await res.json()
      setEntries(data)
      setLoaded(true)
    } catch {
      setError('Failed to load')
    }
  }

  // Compute top towns
  const townCounts: Record<string, number> = {}
  for (const e of entries) {
    for (const t of e.towns) {
      townCounts[t] = (townCounts[t] || 0) + 1
    }
  }
  const topTowns = Object.entries(townCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)

  const reversed = [...entries].reverse()

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Query Log</h1>

      {!loaded ? (
        <form onSubmit={e => { e.preventDefault(); fetchLog() }} className="flex gap-3">
          <input
            type="password"
            placeholder="Admin password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-5 py-2 rounded-lg transition-colors"
          >
            View Log
          </button>
          {error && <p className="text-red-400 text-sm self-center">{error}</p>}
        </form>
      ) : (
        <>
          {/* Stats */}
          <div className="flex gap-6 mb-6">
            <div className="bg-gray-800 border border-gray-700 rounded-lg px-5 py-3">
              <div className="text-2xl font-bold text-emerald-400">{entries.length}</div>
              <div className="text-xs text-gray-500 uppercase">Total Queries</div>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-lg px-5 py-3">
              <div className="text-2xl font-bold text-blue-400">{Object.keys(townCounts).length}</div>
              <div className="text-xs text-gray-500 uppercase">Unique Towns</div>
            </div>
          </div>

          {/* Top towns */}
          {topTowns.length > 0 && (
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-gray-400 uppercase mb-2">Most Asked Towns</h2>
              <div className="flex flex-wrap gap-2">
                {topTowns.map(([town, count]) => (
                  <span key={town} className="bg-gray-800 border border-gray-700 rounded-full px-3 py-1 text-xs text-gray-300">
                    {town} <span className="text-emerald-400 font-bold ml-1">{count}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Log entries */}
          <div className="space-y-2">
            {reversed.map((e, i) => (
              <div key={i} className="bg-gray-800/60 border border-gray-700 rounded-lg px-4 py-3">
                <div className="flex justify-between items-start gap-3">
                  <p className="text-sm text-gray-300 flex-1">{e.question}</p>
                  <span className="text-[10px] text-gray-600 whitespace-nowrap shrink-0">
                    {new Date(e.timestamp).toLocaleString()}
                  </span>
                </div>
                {e.towns.length > 0 && (
                  <div className="flex gap-1.5 mt-1.5">
                    {e.towns.map(t => (
                      <span key={t} className="text-[10px] bg-emerald-400/10 text-emerald-400 px-1.5 py-0.5 rounded">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {entries.length === 0 && (
              <p className="text-gray-500 text-sm text-center py-8">No queries logged yet.</p>
            )}
          </div>
        </>
      )}
    </div>
  )
}
