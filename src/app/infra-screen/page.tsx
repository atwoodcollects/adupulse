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
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-6">Infrastructure Screen</h1>
      <form onSubmit={handleSubmit} className="flex gap-3 mb-8 max-w-xl">
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter a Massachusetts address"
          className="flex-1 px-4 py-2 rounded bg-gray-800 border border-gray-700 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-gray-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 rounded bg-gray-700 hover:bg-gray-600 disabled:opacity-50 font-medium"
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
            <p className="text-gray-400 text-sm mb-4">{shortDisplay}</p>
          )}

          <div className="flex items-center gap-3">
            <span className="w-16 text-sm text-gray-400">Sewer</span>
            {result.sewer.hit ? (
              <>
                <span className="px-2 py-0.5 rounded text-xs font-medium bg-emerald-900 text-emerald-300">Served</span>
                <span className="text-sm text-gray-300">
                  {result.sewer.features[0]?.attributes.SYSTNAME}
                  {result.sewer.features[0]?.attributes.TRTMTPLANT && (
                    <> &middot; {result.sewer.features[0].attributes.TRTMTPLANT}</>
                  )}
                </span>
              </>
            ) : (
              <>
                <span className="px-2 py-0.5 rounded text-xs font-medium bg-red-900 text-red-300">Not Served</span>
                {result.sewer.error && <span className="text-sm text-red-400">{result.sewer.error}</span>}
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="w-16 text-sm text-gray-400">Water</span>
            {result.water.hit ? (
              <>
                <span className="px-2 py-0.5 rounded text-xs font-medium bg-emerald-900 text-emerald-300">Served</span>
                <span className="text-sm text-gray-300">
                  {result.water.features[0]?.attributes.PWS_NAME}
                </span>
              </>
            ) : (
              <>
                <span className="px-2 py-0.5 rounded text-xs font-medium bg-red-900 text-red-300">Not Served</span>
                {result.water.error && <span className="text-sm text-red-400">{result.water.error}</span>}
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="w-16 text-sm text-gray-400 leading-tight">MassDEP Wetlands</span>
            {result.wetlands.hit ? (
              <span className="px-2 py-0.5 rounded text-xs font-medium bg-red-900 text-red-300">Wetlands Present</span>
            ) : (
              <>
                <span className="px-2 py-0.5 rounded text-xs font-medium bg-emerald-900 text-emerald-300">No Wetlands Mapped</span>
                {result.wetlands.error && <span className="text-sm text-red-400">{result.wetlands.error}</span>}
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="w-16 text-sm text-gray-400 leading-tight">FEMA Flood Zone</span>
            {result.flood.sfha ? (
              <>
                <span className="px-2 py-0.5 rounded text-xs font-medium bg-red-900 text-red-300">SFHA — High Risk</span>
                {result.flood.zones.length > 0 && (
                  <span className="text-sm text-gray-300">{result.flood.zones.join(', ')}</span>
                )}
              </>
            ) : result.flood.hit ? (
              <>
                <span className="px-2 py-0.5 rounded text-xs font-medium bg-orange-900 text-orange-300">Flood Zone Present</span>
                {result.flood.zones.length > 0 && (
                  <span className="text-sm text-gray-300">{result.flood.zones.join(', ')}</span>
                )}
              </>
            ) : (
              <>
                <span className="px-2 py-0.5 rounded text-xs font-medium bg-emerald-900 text-emerald-300">No Flood Zone</span>
                {result.flood.error && <span className="text-sm text-red-400">{result.flood.error}</span>}
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="w-16 text-sm text-gray-400 leading-tight">MBTA Commuter Rail</span>
            {result.mbta.nearestStation ? (
              <>
                <span className="px-2 py-0.5 rounded text-xs font-medium bg-emerald-900 text-emerald-300">{result.mbta.nearestStation.distanceMiles} mi</span>
                <span className="text-sm text-gray-300">
                  {result.mbta.nearestStation.name} &middot; {result.mbta.nearestStation.line}
                </span>
              </>
            ) : (
              <>
                <span className="px-2 py-0.5 rounded text-xs font-medium bg-yellow-900 text-yellow-300">No Station within 5 mi</span>
                {result.mbta.error && <span className="text-sm text-red-400">{result.mbta.error}</span>}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
