'use client'

import { useState } from 'react'

interface InfraResult {
  geo: { lat: number; lng: number; display: string }
  sewer: {
    hit: boolean
    features: { attributes: Record<string, string> }[]
    error: string | null
  }
  water: {
    hit: boolean
    features: { attributes: Record<string, string> }[]
    error: string | null
  }
  wetlands: {
    hit: boolean
    features: { attributes: Record<string, string> }[]
    error: string | null
  }
  flood: {
    hit: boolean
    sfha: boolean
    zones: string[]
    error: string | null
  }
  mbta: {
    nearestStation: { name: string; line: string; distanceMiles: number } | null
    error: string | null
  }
  error?: string
}

export default function InfraScreenPage() {
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<InfraResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!address.trim()) return
    setLoading(true)
    setResult(null)
    setError(null)
    try {
      const res = await fetch(`/api/infra-screen?address=${encodeURIComponent(address)}`)
      const data = await res.json()
      if (data.error) {
        setError(data.error)
      } else {
        setResult(data)
      }
    } catch (err: any) {
      setError(err.message || 'Request failed')
    } finally {
      setLoading(false)
    }
  }

  const shortDisplay = result?.geo.display
    ? result.geo.display.split(',').slice(0, 3).join(',')
    : null

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 px-4 py-6 sm:px-8 sm:py-10">
      <h1 className="text-2xl font-bold mb-6">Infrastructure Screen</h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 mb-8 max-w-xl">
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter a Massachusetts address"
          className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-700 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-gray-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto px-6 py-2 rounded bg-gray-700 hover:bg-gray-600 disabled:opacity-50 font-medium"
        >
          {loading ? 'Screening...' : 'Screen'}
        </button>
      </form>

      {error && (
        <div className="text-red-400 mb-6">{error}</div>
      )}

      {result && (
        <div className="max-w-xl space-y-4">
          {shortDisplay && (
            <p className="text-gray-400 text-sm mb-4 truncate">{shortDisplay}</p>
          )}

          <div>
            <span className="text-xs uppercase tracking-wide text-gray-500">Sewer</span>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              {result.sewer.hit ? (
                <>
                  <span className="shrink-0 px-2 py-0.5 rounded text-xs font-medium bg-emerald-900 text-emerald-300">Served</span>
                  <span className="text-sm text-gray-300">
                    {result.sewer.features[0]?.attributes.SYSTNAME}
                    {result.sewer.features[0]?.attributes.TRTMTPLANT && (
                      <> &middot; {result.sewer.features[0].attributes.TRTMTPLANT}</>
                    )}
                  </span>
                </>
              ) : (
                <>
                  <span className="shrink-0 px-2 py-0.5 rounded text-xs font-medium bg-red-900 text-red-300">Not Served</span>
                  {result.sewer.error && <span className="text-sm text-red-400">{result.sewer.error}</span>}
                </>
              )}
            </div>
          </div>

          <div>
            <span className="text-xs uppercase tracking-wide text-gray-500">Water</span>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              {result.water.hit ? (
                <>
                  <span className="shrink-0 px-2 py-0.5 rounded text-xs font-medium bg-emerald-900 text-emerald-300">Served</span>
                  <span className="text-sm text-gray-300">
                    {result.water.features[0]?.attributes.PWS_NAME}
                  </span>
                </>
              ) : (
                <>
                  <span className="shrink-0 px-2 py-0.5 rounded text-xs font-medium bg-red-900 text-red-300">Not Served</span>
                  {result.water.error && <span className="text-sm text-red-400">{result.water.error}</span>}
                </>
              )}
            </div>
          </div>

          <div>
            <span className="text-xs uppercase tracking-wide text-gray-500">MassDEP Wetlands</span>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              {result.wetlands.hit ? (
                <span className="shrink-0 px-2 py-0.5 rounded text-xs font-medium bg-red-900 text-red-300">Wetlands Present</span>
              ) : (
                <>
                  <span className="shrink-0 px-2 py-0.5 rounded text-xs font-medium bg-emerald-900 text-emerald-300">No Wetlands Mapped</span>
                  {result.wetlands.error && <span className="text-sm text-red-400">{result.wetlands.error}</span>}
                </>
              )}
            </div>
          </div>

          <div>
            <span className="text-xs uppercase tracking-wide text-gray-500">FEMA Flood Zone</span>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              {(() => {
                const sfhaZones = ['A','AE','AH','AO','AR','A99','V','VE']
                const hasSfha = result.flood.zones.some(z => sfhaZones.includes(z))
                if (hasSfha) return (
                  <>
                    <span className="shrink-0 px-2 py-0.5 rounded text-xs font-medium bg-red-900 text-red-300">High Risk — SFHA</span>
                    <span className="text-sm text-gray-300">{result.flood.zones.join(', ')}</span>
                  </>
                )
                if (result.flood.hit) return (
                  <>
                    <span className="shrink-0 px-2 py-0.5 rounded text-xs font-medium bg-emerald-900 text-emerald-300">Low Risk — Zone X</span>
                    <span className="text-sm text-gray-300">{result.flood.zones.join(', ')}</span>
                  </>
                )
                return (
                  <>
                    <span className="shrink-0 px-2 py-0.5 rounded text-xs font-medium bg-emerald-900 text-emerald-300">No Flood Zone</span>
                    {result.flood.error && <span className="text-sm text-red-400">{result.flood.error}</span>}
                  </>
                )
              })()}
            </div>
          </div>

          <div>
            <span className="text-xs uppercase tracking-wide text-gray-500">MBTA Commuter Rail</span>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              {result.mbta.nearestStation ? (
                <>
                  <span className="shrink-0 px-2 py-0.5 rounded text-xs font-medium bg-emerald-900 text-emerald-300">{result.mbta.nearestStation.distanceMiles} mi</span>
                  <span className="text-sm text-gray-300">
                    {result.mbta.nearestStation.name} &middot; {result.mbta.nearestStation.line}
                  </span>
                </>
              ) : (
                <>
                  <span className="shrink-0 px-2 py-0.5 rounded text-xs font-medium bg-yellow-900 text-yellow-300">No Station within 5 mi</span>
                  {result.mbta.error && <span className="text-sm text-red-400">{result.mbta.error}</span>}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
