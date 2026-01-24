'use client'

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { HLCTown } from '@/lib/hlcData'

const townCoords: Record<string, [number, number]> = {
  'Boston': [42.3601, -71.0589],
  'Cambridge': [42.3736, -71.1097],
  'Somerville': [42.3876, -71.0995],
  'Newton': [42.3370, -71.2092],
  'Brookline': [42.3318, -71.1212],
  'Arlington': [42.4154, -71.1565],
  'Belmont': [42.3959, -71.1787],
  'Lexington': [42.4473, -71.2245],
  'Waltham': [42.3765, -71.2356],
  'Watertown': [42.3709, -71.1828],
  'Medford': [42.4184, -71.1062],
  'Revere': [42.4084, -71.0120],
  'Milton': [42.2498, -71.0662],
  'Quincy': [42.2529, -71.0023],
  'Weymouth': [42.2209, -70.9395],
  'Norwood': [42.1945, -71.1995],
  'Needham': [42.2804, -71.2372],
  'Wellesley': [42.2968, -71.2924],
  'Natick': [42.2830, -71.3468],
  'Framingham': [42.2793, -71.4162],
  'Wayland': [42.3626, -71.3615],
  'Sudbury': [42.3834, -71.4162],
  'Concord': [42.4604, -71.3489],
  'Winchester': [42.4523, -71.1370],
  'Burlington': [42.5043, -71.1951],
  'Bedford': [42.4918, -71.2762],
  'Reading': [42.5251, -71.0951],
  'Lynnfield': [42.5320, -71.0481],
  'Salem': [42.5195, -70.8967],
  'Beverly': [42.5584, -70.8800],
  'Peabody': [42.5279, -70.9287],
  'Danvers': [42.5751, -70.9329],
  'Gloucester': [42.6159, -70.6620],
  'Ipswich': [42.6793, -70.8412],
  'Hamilton': [42.6176, -70.8590],
  'Newburyport': [42.8126, -70.8773],
  'West Newbury': [42.8018, -70.9612],
  'Haverhill': [42.7762, -71.0773],
  'Lawrence': [42.7070, -71.1631],
  'Methuen': [42.7262, -71.1909],
  'Andover': [42.6584, -71.1373],
  'Lowell': [42.6334, -71.3162],
  'Dracut': [42.6709, -71.3020],
  'Billerica': [42.5584, -71.2689],
  'Chelmsford': [42.5998, -71.3673],
  'Pepperell': [42.6659, -71.5884],
  'Townsend': [42.6668, -71.7076],
  'Groton': [42.6118, -71.5745],
  'Worcester': [42.2626, -71.8023],
  'Shrewsbury': [42.2959, -71.7126],
  'Millbury': [42.1940, -71.7601],
  'Hopkinton': [42.2293, -71.5223],
  'Hudson': [42.3918, -71.5662],
  'Plymouth': [41.9584, -70.6673],
  'Middleborough': [41.8932, -70.9112],
  'Pembroke': [42.0651, -70.8012],
  'Duxbury': [42.0418, -70.6726],
  'Hingham': [42.2418, -70.8898],
  'Hull': [42.3018, -70.9076],
  'Norwell': [42.1618, -70.7934],
  'Hanson': [42.0751, -70.8801],
  'Rockland': [42.1301, -70.9076],
  'Abington': [42.1048, -70.9451],
  'East Bridgewater': [42.0334, -70.9590],
  'Rochester': [41.7584, -70.8201],
  'Marion': [41.7018, -70.7626],
  'Wareham': [41.7618, -70.7195],
  'Barnstable': [41.7003, -70.3002],
  'Sandwich': [41.7590, -70.4940],
  'Falmouth': [41.5515, -70.6146],
  'Yarmouth': [41.7059, -70.2286],
  'Harwich': [41.6862, -70.0756],
  'Orleans': [41.7898, -69.9900],
  'Nantucket': [41.2835, -70.0995],
  'Tisbury': [41.4568, -70.6043],
  'Oak Bluffs': [41.4543, -70.5620],
  'Edgartown': [41.3884, -70.5134],
  'West Tisbury': [41.3818, -70.6743],
  'Chilmark': [41.3584, -70.7487],
  'Fairhaven': [41.6376, -70.9034],
  'Acushnet': [41.6851, -70.9076],
  'Somerset': [41.7665, -71.1537],
  'Swansea': [41.7482, -71.1898],
  'Freetown': [41.7668, -71.0334],
  'Taunton': [41.9001, -71.0898],
  'Raynham': [41.9487, -71.0437],
  'Attleboro': [41.9445, -71.2856],
  'Franklin': [42.0834, -71.3967],
  'Northampton': [42.3251, -72.6412],
  'Amherst': [42.3732, -72.5199],
  'Hadley': [42.3584, -72.5876],
  'South Hadley': [42.2584, -72.5743],
}

function getActivityColor(approved: number): { fill: string; stroke: string } {
  if (approved >= 10) return { fill: '#22c55e', stroke: '#4ade80' }
  if (approved >= 4) return { fill: '#f59e0b', stroke: '#fbbf24' }
  return { fill: '#71717a', stroke: '#a1a1aa' }
}

interface TownMapProps {
  towns: HLCTown[]
}

export default function TownMap({ towns }: TownMapProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-full h-[250px] md:h-[400px] bg-surface rounded-lg flex items-center justify-center">
        <span className="text-text-muted">Loading map...</span>
      </div>
    )
  }

  const maxApproved = Math.max(...towns.map(t => t.approved || 1), 1)

  return (
    <MapContainer
      center={[42.1, -71.5]}
      zoom={7}
      style={{ height: '250px', width: '100%', borderRadius: '8px' }}
      className="md:!h-[400px]"
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; CARTO'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      {towns.map(town => {
        const coords = town.lat && town.lng ? [town.lat, town.lng] as [number, number] : townCoords[town.name]
        if (!coords || !town.approved) return null
        const radius = Math.max(5, Math.min((town.approved / maxApproved) * 20, 20))
        const colors = getActivityColor(town.approved)
        return (
          <CircleMarker
            key={town.name}
            center={coords}
            radius={radius}
            fillColor={colors.fill}
            fillOpacity={0.7}
            color={colors.stroke}
            weight={2}
          >
            <Popup>
              <div className="text-black text-sm">
                <strong>{town.name}</strong><br/>
                {town.approved} approved<br/>
                {town.applications} applications
              </div>
            </Popup>
          </CircleMarker>
        )
      })}
    </MapContainer>
  )
}
