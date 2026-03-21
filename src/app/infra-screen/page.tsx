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
  sewerCapacity?: {
    permitId: string
    facilityName: string | null
    actualFlowMGD: number | null
    permitStatus: string | null
    npdesId: string | null
  } | null
  error?: string
}

interface ScreenResult {
  address: string
  display: string
  sewer: { hit: boolean; name: string | null }
  water: { hit: boolean; name: string | null }
  wetlands: { hit: boolean }
  flood: { sfha: boolean; zones: string[] }
  mbta: { station: string | null; line: string | null; distanceMiles: number | null }
  error: string | null
}

function parseScreenResult(address: string, data: InfraResult): ScreenResult {
  return {
    address,
    display: data.geo.display.split(',').slice(0, 3).join(','),
    sewer: { hit: data.sewer.hit, name: data.sewer.features[0]?.attributes?.SYSTNAME ?? null },
    water: { hit: data.water.hit, name: data.water.features[0]?.attributes?.PWS_NAME ?? null },
    wetlands: { hit: data.wetlands.hit },
    flood: { sfha: data.flood.sfha, zones: data.flood.zones },
    mbta: {
      station: data.mbta.nearestStation?.name ?? null,
      line: data.mbta.nearestStation?.line ?? null,
      distanceMiles: data.mbta.nearestStation?.distanceMiles ?? null,
    },
    error: null,
  }
}

function generateCSV(results: ScreenResult[]): string {
  const headers = [
    'Input Address', 'Geocoded Address', 'Sewer Served', 'Sewer System',
    'Water Served', 'Water System', 'Wetlands Present', 'Flood Zone', 'SFHA',
    'Nearest MBTA Station', 'MBTA Line', 'MBTA Distance (mi)',
  ]
  const escape = (v: string) => `"${v.replace(/"/g, '""')}"`
  const rows = results.map(r => [
    escape(r.address),
    escape(r.display),
    r.sewer.hit ? 'Yes' : 'No',
    escape(r.sewer.name ?? ''),
    r.water.hit ? 'Yes' : 'No',
    escape(r.water.name ?? ''),
    r.wetlands.hit ? 'Yes' : 'No',
    escape(r.flood.zones.join(', ')),
    r.flood.sfha ? 'Yes' : 'No',
    escape(r.mbta.station ?? ''),
    escape(r.mbta.line ?? ''),
    r.mbta.distanceMiles?.toString() ?? '',
  ].join(','))
  return [headers.join(','), ...rows].join('\n')
}

function Dot({ color }: { color: 'green' | 'red' | 'yellow' | 'gray' }) {
  const cls = {
    green: 'bg-emerald-400',
    red: 'bg-red-400',
    yellow: 'bg-yellow-400',
    gray: 'bg-gray-600',
  }[color]
  return <span className={`inline-block w-3 h-3 rounded-full ${cls}`} />
}

export default function InfraScreenPage() {
  const [mode, setMode] = useState<'single' | 'batch'>('single')

  // Single mode state
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<InfraResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Batch mode state
  const [batchText, setBatchText] = useState('')
  const [batchLoading, setBatchLoading] = useState(false)
  const [batchProgress, setBatchProgress] = useState({ current: 0, total: 0 })
  const [batchResults, setBatchResults] = useState<ScreenResult[]>([])

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

  async function handleBatchSubmit(e: React.FormEvent) {
    e.preventDefault()
    const addresses = batchText.split('\n').map(l => l.trim()).filter(Boolean)
    if (!addresses.length) return
    setBatchLoading(true)
    setBatchResults([])
    setBatchProgress({ current: 0, total: addresses.length })

    const results: ScreenResult[] = []
    for (let i = 0; i < addresses.length; i++) {
      setBatchProgress({ current: i + 1, total: addresses.length })
      try {
        const res = await fetch(`/api/infra-screen?address=${encodeURIComponent(addresses[i])}`)
        const data = await res.json()
        if (data.error) {
          results.push({
            address: addresses[i], display: '', sewer: { hit: false, name: null },
            water: { hit: false, name: null }, wetlands: { hit: false },
            flood: { sfha: false, zones: [] },
            mbta: { station: null, line: null, distanceMiles: null },
            error: data.error,
          })
        } else {
          results.push(parseScreenResult(addresses[i], data))
        }
      } catch (err: any) {
        results.push({
          address: addresses[i], display: '', sewer: { hit: false, name: null },
          water: { hit: false, name: null }, wetlands: { hit: false },
          flood: { sfha: false, zones: [] },
          mbta: { station: null, line: null, distanceMiles: null },
          error: err.message || 'Request failed',
        })
      }
    }
    setBatchResults(results)
    setBatchLoading(false)
  }

  function downloadCSV() {
    const csv = generateCSV(batchResults)
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'infra-screen-results.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const shortDisplay = result?.geo.display
    ? result.geo.display.split(',').slice(0, 3).join(',')
    : null

  const sfhaZones = ['A', 'AE', 'AH', 'AO', 'AR', 'A99', 'V', 'VE']

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 px-4 py-6 sm:px-8 sm:py-10">
      <h1 className="text-2xl font-bold mb-6">Infrastructure Screen</h1>

      <div className="flex gap-1 mb-6">
        <button
          onClick={() => setMode('single')}
          className={`px-4 py-1.5 rounded text-sm font-medium ${mode === 'single' ? 'bg-gray-700 text-gray-100' : 'bg-gray-800 text-gray-400 hover:text-gray-300'}`}
        >
          Single
        </button>
        <button
          onClick={() => setMode('batch')}
          className={`px-4 py-1.5 rounded text-sm font-medium ${mode === 'batch' ? 'bg-gray-700 text-gray-100' : 'bg-gray-800 text-gray-400 hover:text-gray-300'}`}
        >
          Batch
        </button>
      </div>

      {mode === 'single' && (
        <>
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
                {result.sewerCapacity && (
                  <p className="text-xs text-gray-500 mt-1">
                    {result.sewerCapacity.actualFlowMGD != null
                      ? `Actual flow: ${result.sewerCapacity.actualFlowMGD} MGD · ${result.sewerCapacity.permitStatus}`
                      : result.sewerCapacity.npdesId ? `NPDES Permit: ${result.sewerCapacity.npdesId}` : null}
                  </p>
                )}
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
        </>
      )}

      {mode === 'batch' && (
        <>
          <form onSubmit={handleBatchSubmit} className="mb-8 max-w-xl">
            <textarea
              value={batchText}
              onChange={(e) => setBatchText(e.target.value)}
              placeholder={'Paste addresses, one per line\n123 Main St, Quincy, MA\n456 High St, Beverly, MA'}
              className="w-full h-40 px-4 py-3 rounded bg-gray-800 border border-gray-700 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-gray-500 resize-y"
            />
            <button
              type="submit"
              disabled={batchLoading}
              className="mt-3 w-full sm:w-auto px-6 py-2 rounded bg-gray-700 hover:bg-gray-600 disabled:opacity-50 font-medium"
            >
              {batchLoading ? `Screening ${batchProgress.current} of ${batchProgress.total}...` : 'Screen All'}
            </button>
          </form>

          {batchResults.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="text-xs uppercase tracking-wide text-gray-500 border-b border-gray-700">
                    <th className="text-left py-2 pr-4">Address</th>
                    <th className="py-2 px-2">Sewer</th>
                    <th className="py-2 px-2">Water</th>
                    <th className="py-2 px-2">Wetlands</th>
                    <th className="py-2 px-2">Flood Zone</th>
                    <th className="py-2 px-2">MBTA</th>
                  </tr>
                </thead>
                <tbody>
                  {batchResults.map((r, i) => (
                    <tr key={i} className="border-b border-gray-800">
                      <td className="py-2 pr-4 max-w-[200px] truncate" title={r.display || r.address}>
                        {r.error ? (
                          <span className="text-red-400">{r.address} — {r.error}</span>
                        ) : (
                          r.display || r.address
                        )}
                      </td>
                      {r.error ? (
                        <>
                          <td className="py-2 px-2 text-center text-gray-500">—</td>
                          <td className="py-2 px-2 text-center text-gray-500">—</td>
                          <td className="py-2 px-2 text-center text-gray-500">—</td>
                          <td className="py-2 px-2 text-center text-gray-500">—</td>
                          <td className="py-2 px-2 text-center text-gray-500">—</td>
                        </>
                      ) : (
                        <>
                          <td className="py-2 px-2 text-center" title={r.sewer.name ?? undefined}>
                            <Dot color={r.sewer.hit ? 'green' : 'red'} />
                          </td>
                          <td className="py-2 px-2 text-center" title={r.water.name ?? undefined}>
                            <Dot color={r.water.hit ? 'green' : 'red'} />
                          </td>
                          <td className="py-2 px-2 text-center">
                            <Dot color={r.wetlands.hit ? 'red' : 'green'} />
                          </td>
                          <td className="py-2 px-2 text-center">
                            <Dot color={r.flood.sfha ? 'red' : 'green'} />
                          </td>
                          <td className="py-2 px-2 text-center whitespace-nowrap">
                            {r.mbta.distanceMiles != null ? (
                              <span className="text-sm text-gray-300" title={`${r.mbta.station} · ${r.mbta.line}`}>
                                {r.mbta.distanceMiles} mi
                              </span>
                            ) : (
                              <span className="text-gray-600">—</span>
                            )}
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>

              <button
                onClick={downloadCSV}
                className="mt-4 px-6 py-2 rounded bg-gray-700 hover:bg-gray-600 font-medium text-sm"
              >
                Download CSV
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
