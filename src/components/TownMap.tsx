'use client'

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { Town } from '@/lib/supabase'

const townCoords: Record<string, [number, number]> = {
  'Plymouth': [41.9584, -70.6673],
  'Newton': [42.3370, -71.2092],
  'Cambridge': [42.3736, -71.1097],
  'Somerville': [42.3876, -71.0995],
  'Arlington': [42.4154, -71.1565],
  'Brookline': [42.3318, -71.1212],
  'Lexington': [42.4473, -71.2245],
  'Needham': [42.2804, -71.2372],
  'Wellesley': [42.2968, -71.2924],
  'Natick': [42.2830, -71.3468],
  'Waltham': [42.3765, -71.2356],
  'Watertown': [42.3709, -71.1828],
  'Belmont': [42.3959, -71.1787],
  'Winchester': [42.4523, -71.1370],
  'Concord': [42.4604, -71.3489],
  'Lincoln': [42.4259, -71.3039],
  'Weston': [42.3665, -71.3031],
  'Wayland': [42.3626, -71.3615],
  'Sudbury': [42.3834, -71.4162],
  'Medford': [42.4184, -71.1062],
}

interface TownMapProps {
  towns: Town[]
}

export default function TownMap({ towns }: TownMapProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-full h-[400px] bg-surface rounded-lg flex items-center justify-center">
        <span className="text-text-muted">Loading map...</span>
      </div>
    )
  }

  const maxApproved = Math.max(...towns.map(t => t.total_approved || 1), 1)

  return (
    <MapContainer
      center={[42.3, -71.2]}
      zoom={9}
      style={{ height: '400px', width: '100%', borderRadius: '8px' }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      {towns.map(town => {
        const coords = townCoords[town.name]
        if (!coords || !town.total_approved) return null
        
        const radius = Math.max(8, (town.total_approved / maxApproved) * 30)
        
        return (
          <CircleMarker
            key={town.id}
            center={coords}
            radius={radius}
            fillColor="#3b82f6"
            fillOpacity={0.7}
            color="#60a5fa"
            weight={2}
          >
            <Popup>
              <div className="text-black">
                <strong>{town.name}</strong><br />
                {town.total_approved} approved<br />
                {town.total_applications} applications
              </div>
            </Popup>
          </CircleMarker>
        )
      })}
    </MapContainer>
  )
}
