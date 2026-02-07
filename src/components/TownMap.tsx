'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

const towns: { name: string; lat: number; lng: number; approved: number; submitted: number; hasDetail?: boolean }[] = [
  { name: 'Boston', lat: 42.3601, lng: -71.0589, approved: 44, submitted: 69, hasDetail: true },
  { name: 'Worcester', lat: 42.2626, lng: -71.8023, approved: 23, submitted: 31 },
  { name: 'Plymouth', lat: 41.9584, lng: -70.6673, approved: 34, submitted: 42, hasDetail: true },
  { name: 'Newton', lat: 42.3370, lng: -71.2092, approved: 18, submitted: 40, hasDetail: true },
  { name: 'Somerville', lat: 42.3876, lng: -71.0995, approved: 24, submitted: 40 },
  { name: 'Cambridge', lat: 42.3736, lng: -71.1097, approved: 6, submitted: 8 },
  { name: 'Lawrence', lat: 42.7070, lng: -71.1631, approved: 32, submitted: 44 },
  { name: 'Lowell', lat: 42.6334, lng: -71.3162, approved: 26, submitted: 26 },
  { name: 'Barnstable', lat: 41.7003, lng: -70.3002, approved: 6, submitted: 31 },
  { name: 'Nantucket', lat: 41.2835, lng: -70.0995, approved: 27, submitted: 27 },
  { name: 'Fall River', lat: 41.7015, lng: -71.1550, approved: 13, submitted: 25 },
  { name: 'Milton', lat: 42.2498, lng: -71.0662, approved: 24, submitted: 25, hasDetail: true },
  { name: 'Brookline', lat: 42.3318, lng: -71.1212, approved: 10, submitted: 14 },
  { name: 'Quincy', lat: 42.2529, lng: -71.0023, approved: 6, submitted: 17 },
  { name: 'Revere', lat: 42.4084, lng: -71.0120, approved: 9, submitted: 17, hasDetail: true },
  { name: 'Lynn', lat: 42.4668, lng: -70.9495, approved: 9, submitted: 22 },
  { name: 'Medford', lat: 42.4184, lng: -71.1062, approved: 19, submitted: 22 },
  { name: 'Haverhill', lat: 42.7762, lng: -71.0773, approved: 13, submitted: 29 },
  { name: 'Methuen', lat: 42.7262, lng: -71.1909, approved: 21, submitted: 28 },
  { name: 'Lexington', lat: 42.4473, lng: -71.2245, approved: 6, submitted: 6, hasDetail: true },
  { name: 'Arlington', lat: 42.4153, lng: -71.1565, approved: 6, submitted: 7 },
  { name: 'Framingham', lat: 42.2793, lng: -71.4162, approved: 6, submitted: 8 },
  { name: 'Brockton', lat: 42.0834, lng: -71.0184, approved: 5, submitted: 16 },
  { name: 'Marshfield', lat: 42.0918, lng: -70.7056, approved: 11, submitted: 24 },
  { name: 'Falmouth', lat: 41.5515, lng: -70.6148, approved: 12, submitted: 12, hasDetail: true },
  { name: 'Harwich', lat: 41.6862, lng: -70.0726, approved: 15, submitted: 15 },
  { name: 'Amherst', lat: 42.3732, lng: -72.5199, approved: 12, submitted: 23 },
  { name: 'Northampton', lat: 42.3251, lng: -72.6412, approved: 15, submitted: 20 },
  { name: 'Fairhaven', lat: 41.6376, lng: -70.9037, approved: 18, submitted: 18 },
  { name: 'Raynham', lat: 41.9487, lng: -71.0701, approved: 18, submitted: 18 },
  { name: 'Middleborough', lat: 41.8932, lng: -70.9112, approved: 18, submitted: 18 },
  { name: 'Beverly', lat: 42.5584, lng: -70.8800, approved: 12, submitted: 12 },
  { name: 'Salem', lat: 42.5195, lng: -70.8967, approved: 9, submitted: 9 },
  { name: 'Peabody', lat: 42.5279, lng: -70.9287, approved: 7, submitted: 12 },
  { name: 'Danvers', lat: 42.5751, lng: -70.9545, approved: 2, submitted: 9 },
  { name: 'Andover', lat: 42.6583, lng: -71.1368, approved: 9, submitted: 10, hasDetail: true },
  { name: 'Billerica', lat: 42.5584, lng: -71.2689, approved: 13, submitted: 18 },
  { name: 'Chelmsford', lat: 42.5998, lng: -71.3673, approved: 7, submitted: 7 },
  { name: 'Dracut', lat: 42.6709, lng: -71.3020, approved: 10, submitted: 12 },
  { name: 'Taunton', lat: 41.9001, lng: -71.0898, approved: 7, submitted: 14 },
  { name: 'Attleboro', lat: 41.9445, lng: -71.2856, approved: 10, submitted: 15 },
  { name: 'Freetown', lat: 41.7668, lng: -71.0334, approved: 13, submitted: 17 },
  { name: 'Westport', lat: 41.5885, lng: -71.0784, approved: 14, submitted: 14 },
  { name: 'Tisbury', lat: 41.4561, lng: -70.6037, approved: 14, submitted: 15 },
  { name: 'Duxbury', lat: 42.0418, lng: -70.6723, approved: 2, submitted: 3, hasDetail: true },
  { name: 'Needham', lat: 42.2793, lng: -71.2376, approved: 4, submitted: 4, hasDetail: true },
  { name: 'Sudbury', lat: 42.3834, lng: -71.4162, approved: 3, submitted: 3, hasDetail: true },
  { name: 'Shrewsbury', lat: 42.2959, lng: -71.7126, approved: 9, submitted: 16 },
  { name: 'Ipswich', lat: 42.6792, lng: -70.8412, approved: 9, submitted: 12 },
  { name: 'Randolph', lat: 42.1626, lng: -71.0418, approved: 5, submitted: 12 },
  { name: 'Malden', lat: 42.4251, lng: -71.0662, approved: 5, submitted: 8 },
  { name: 'Everett', lat: 42.4084, lng: -71.0537, approved: 2, submitted: 7 },
  { name: 'Gardner', lat: 42.5751, lng: -71.9981, approved: 0, submitted: 7 },
  { name: 'Wayland', lat: 42.3626, lng: -71.3612, approved: 2, submitted: 7 },
]

export default function TownMap() {
  const [Map, setMap] = useState<any>(null)

  useEffect(() => {
    // Dynamic import to avoid SSR issues
    import('react-leaflet').then((mod) => {
      import('leaflet').then((L) => {
        // Fix default marker icons
        delete (L.Icon.Default.prototype as any)._getIconUrl
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        })
        setMap(mod)
      })
    })
  }, [])

  const getColor = (approved: number, submitted: number) => {
    if (submitted === 0) return '#374151'
    const rate = approved / submitted
    if (rate >= 0.9) return '#10b981'
    if (rate >= 0.7) return '#34d399'
    if (rate >= 0.5) return '#fbbf24'
    if (rate >= 0.3) return '#f97316'
    return '#ef4444'
  }

  const getSize = (approved: number) => {
    if (approved >= 30) return 14
    if (approved >= 20) return 12
    if (approved >= 10) return 10
    if (approved >= 5) return 8
    return 6
  }

  if (!Map) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-xl h-[500px] flex items-center justify-center">
        <div className="text-gray-400">Loading map...</div>
      </div>
    )
  }

  const { MapContainer, TileLayer, CircleMarker, Tooltip } = Map

  return (
    <div className="relative">
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css"
      />
      
      {/* Legend */}
      <div className="absolute top-2 left-2 bg-gray-900/90 rounded-lg p-2 text-xs z-[1000]">
        <div className="text-gray-400 mb-1">Approval Rate</div>
        <div className="flex items-center gap-1 mb-0.5"><div className="w-3 h-3 rounded-full bg-emerald-500"></div><span className="text-gray-300">90%+</span></div>
        <div className="flex items-center gap-1 mb-0.5"><div className="w-3 h-3 rounded-full bg-emerald-400"></div><span className="text-gray-300">70-89%</span></div>
        <div className="flex items-center gap-1 mb-0.5"><div className="w-3 h-3 rounded-full bg-yellow-400"></div><span className="text-gray-300">50-69%</span></div>
        <div className="flex items-center gap-1 mb-0.5"><div className="w-3 h-3 rounded-full bg-orange-500"></div><span className="text-gray-300">30-49%</span></div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-red-500"></div><span className="text-gray-300">&lt;30%</span></div>
      </div>

      <MapContainer
        center={[42.1, -71.5]}
        zoom={8}
        className="h-[500px] w-full rounded-xl"
        style={{ background: '#1f2937' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        {towns.map(town => (
          <CircleMarker
            key={town.name}
            center={[town.lat, town.lng]}
            radius={getSize(town.approved)}
            fillColor={getColor(town.approved, town.submitted)}
            fillOpacity={0.8}
            stroke={true}
            color="#fff"
            weight={1}
            opacity={0.5}
            eventHandlers={{
              click: () => {
                const url = town.hasDetail ? `/${town.name.toLowerCase()}` : `/town/${encodeURIComponent(town.name)}`
                window.location.href = url
              }
            }}
          >
            <Tooltip>
              <div className="text-sm">
                <div className="font-bold">{town.name}</div>
                <div>{town.approved} / {town.submitted} ({Math.round((town.approved / town.submitted) * 100)}%)</div>
              </div>
            </Tooltip>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  )
}
