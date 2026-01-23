'use client'

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { Town } from '@/lib/supabase'

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
  'Malden': [42.4251, -71.0662],
  'Melrose': [42.4584, -71.0662],
  'Everett': [42.4084, -71.0534],
  'Revere': [42.4084, -71.0120],
  'Milton': [42.2498, -71.0662],
  'Quincy': [42.2529, -71.0023],
  'Braintree': [42.2038, -70.9995],
  'Weymouth': [42.2209, -70.9395],
  'Norwood': [42.1945, -71.1995],
  'Westwood': [42.2168, -71.2245],
  'Needham': [42.2804, -71.2372],
  'Wellesley': [42.2968, -71.2924],
  'Natick': [42.2830, -71.3468],
  'Framingham': [42.2793, -71.4162],
  'Wayland': [42.3626, -71.3615],
  'Sudbury': [42.3834, -71.4162],
  'Concord': [42.4604, -71.3489],
  'Lincoln': [42.4259, -71.3039],
  'Weston': [42.3665, -71.3031],
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
  'Rockport': [42.6584, -70.6162],
  'Ipswich': [42.6793, -70.8412],
  'Hamilton': [42.6176, -70.8590],
  'Wenham': [42.6043, -70.8829],
  'Newburyport': [42.8126, -70.8773],
  'West Newbury': [42.8018, -70.9612],
  'Groveland': [42.7584, -71.0329],
  'Haverhill': [42.7762, -71.0773],
  'Lawrence': [42.7070, -71.1631],
  'Methuen': [42.7262, -71.1909],
  'Andover': [42.6584, -71.1373],
  'North Andover': [42.6984, -71.1329],
  'Lowell': [42.6334, -71.3162],
  'Dracut': [42.6709, -71.3020],
  'Billerica': [42.5584, -71.2689],
  'Chelmsford': [42.5998, -71.3673],
  'Westford': [42.5793, -71.4412],
  'Tyngsborough': [42.6668, -71.4245],
  'Pepperell': [42.6659, -71.5884],
  'Townsend': [42.6668, -71.7076],
  'Groton': [42.6118, -71.5745],
  'Ayer': [42.5601, -71.5895],
  'Worcester': [42.2626, -71.8023],
  'Shrewsbury': [42.2959, -71.7126],
  'Westborough': [42.2668, -71.6162],
  'Northborough': [42.3168, -71.6412],
  'Grafton': [42.2084, -71.6856],
  'Millbury': [42.1940, -71.7601],
  'Upton': [42.1751, -71.6023],
  'Hopkinton': [42.2293, -71.5223],
  'Ashland': [42.2584, -71.4634],
  'Holliston': [42.2001, -71.4245],
  'Medfield': [42.1876, -71.3062],
  'Hudson': [42.3918, -71.5662],
  'Bolton': [42.4334, -71.6078],
  'Harvard': [42.5001, -71.5829],
  'Leominster': [42.5251, -71.7595],
  'Westminster': [42.5459, -71.9078],
  'Athol': [42.5959, -72.2267],
  'Plymouth': [41.9584, -70.6673],
  'Middleborough': [41.8932, -70.9112],
  'Pembroke': [42.0651, -70.8012],
  'Duxbury': [42.0418, -70.6726],
  'Hingham': [42.2418, -70.8898],
  'Hull': [42.3018, -70.9076],
  'Norwell': [42.1618, -70.7934],
  'Hanover': [42.1134, -70.8118],
  'Hanson': [42.0751, -70.8801],
  'Rockland': [42.1301, -70.9076],
  'Abington': [42.1048, -70.9451],
  'East Bridgewater': [42.0334, -70.9590],
  'Bridgewater': [41.9901, -70.9751],
  'Brockton': [42.0834, -71.0184],
  'Holbrook': [42.1543, -71.0084],
  'Lakeville': [41.8468, -70.9526],
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
  'New Bedford': [41.6362, -70.9342],
  'Somerset': [41.7665, -71.1537],
  'Swansea': [41.7482, -71.1898],
  'Freetown': [41.7668, -71.0334],
  'Berkley': [41.8418, -71.0829],
  'Taunton': [41.9001, -71.0898],
  'Raynham': [41.9487, -71.0437],
  'Attleboro': [41.9445, -71.2856],
  'Plainville': [42.0043, -71.3329],
  'Wrentham': [42.0668, -71.3329],
  'Franklin': [42.0834, -71.3967],
  'Bellingham': [42.0868, -71.4745],
  'Foxborough': [42.0651, -71.2479],
  'Mansfield': [42.0334, -71.2195],
  'Seekonk': [41.8084, -71.3329],
  'Springfield': [42.1015, -72.5898],
  'Northampton': [42.3251, -72.6412],
  'Easthampton': [42.2668, -72.6745],
  'Amherst': [42.3732, -72.5199],
  'Hadley': [42.3584, -72.5876],
  'South Hadley': [42.2584, -72.5743],
  'Granby': [42.2584, -72.5162],
  'Palmer': [42.1584, -72.3245],
  'Wilbraham': [42.1251, -72.4329],
  'Longmeadow': [42.0501, -72.5829],
  'West Springfield': [42.1076, -72.6412],
  'Westfield': [42.1251, -72.7495],
  'Huntington': [42.2376, -72.8829],
  'Deerfield': [42.5418, -72.6078],
  'Montague': [42.5584, -72.5245],
  'Sunderland': [42.4584, -72.5662],
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
      center={[42.2, -71.5]}
      zoom={8}
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
