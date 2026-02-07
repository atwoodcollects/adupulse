'use client'

import { useState } from 'react'
import Link from 'next/link'

const towns: { name: string; x: number; y: number; approved: number; submitted: number; hasDetail?: boolean }[] = [
  { name: 'Boston', x: 310, y: 235, approved: 44, submitted: 69, hasDetail: true },
  { name: 'Worcester', x: 185, y: 245, approved: 23, submitted: 31 },
  { name: 'Plymouth', x: 320, y: 320, approved: 34, submitted: 42, hasDetail: true },
  { name: 'Newton', x: 280, y: 230, approved: 18, submitted: 40, hasDetail: true },
  { name: 'Somerville', x: 300, y: 220, approved: 24, submitted: 40 },
  { name: 'Cambridge', x: 295, y: 225, approved: 6, submitted: 8 },
  { name: 'Lawrence', x: 290, y: 150, approved: 32, submitted: 44 },
  { name: 'Lowell', x: 265, y: 165, approved: 26, submitted: 26 },
  { name: 'Barnstable', x: 355, y: 390, approved: 6, submitted: 31 },
  { name: 'Nantucket', x: 390, y: 450, approved: 27, submitted: 27 },
  { name: 'Fall River', x: 295, y: 355, approved: 13, submitted: 25 },
  { name: 'Milton', x: 305, y: 250, approved: 24, submitted: 25, hasDetail: true },
  { name: 'Brookline', x: 290, y: 238, approved: 10, submitted: 14 },
  { name: 'Quincy', x: 315, y: 255, approved: 6, submitted: 17 },
  { name: 'Revere', x: 320, y: 215, approved: 9, submitted: 17, hasDetail: true },
  { name: 'Lynn', x: 330, y: 200, approved: 9, submitted: 22 },
  { name: 'Medford', x: 298, y: 215, approved: 19, submitted: 22 },
  { name: 'Haverhill', x: 280, y: 135, approved: 13, submitted: 29 },
  { name: 'Methuen', x: 275, y: 145, approved: 21, submitted: 28 },
  { name: 'Lexington', x: 275, y: 210, approved: 6, submitted: 6, hasDetail: true },
  { name: 'Arlington', x: 285, y: 215, approved: 6, submitted: 7 },
  { name: 'Framingham', x: 250, y: 250, approved: 6, submitted: 8 },
  { name: 'Brockton', x: 290, y: 295, approved: 5, submitted: 16 },
  { name: 'Marshfield', x: 330, y: 305, approved: 11, submitted: 24 },
  { name: 'Falmouth', x: 335, y: 410, approved: 12, submitted: 12, hasDetail: true },
  { name: 'Harwich', x: 370, y: 395, approved: 15, submitted: 15 },
  { name: 'Amherst', x: 115, y: 195, approved: 12, submitted: 23 },
  { name: 'Northampton', x: 100, y: 210, approved: 15, submitted: 20 },
  { name: 'Fairhaven', x: 310, y: 365, approved: 18, submitted: 18 },
  { name: 'Raynham', x: 280, y: 310, approved: 18, submitted: 18 },
  { name: 'Middleborough', x: 295, y: 330, approved: 18, submitted: 18 },
  { name: 'Beverly', x: 340, y: 185, approved: 12, submitted: 12 },
  { name: 'Salem', x: 335, y: 190, approved: 9, submitted: 9 },
  { name: 'Peabody', x: 330, y: 195, approved: 7, submitted: 12 },
  { name: 'Danvers', x: 325, y: 180, approved: 2, submitted: 9 },
  { name: 'Andover', x: 270, y: 165, approved: 9, submitted: 10, hasDetail: true },
  { name: 'Billerica', x: 265, y: 185, approved: 13, submitted: 18 },
  { name: 'Chelmsford', x: 255, y: 175, approved: 7, submitted: 7 },
  { name: 'Dracut', x: 260, y: 160, approved: 10, submitted: 12 },
  { name: 'Taunton', x: 275, y: 330, approved: 7, submitted: 14 },
  { name: 'Attleboro', x: 265, y: 345, approved: 10, submitted: 15 },
  { name: 'Freetown', x: 285, y: 350, approved: 13, submitted: 17 },
  { name: 'Westport', x: 280, y: 375, approved: 14, submitted: 14 },
  { name: 'Tisbury', x: 350, y: 435, approved: 14, submitted: 15 },
  { name: 'Duxbury', x: 325, y: 310, approved: 2, submitted: 3, hasDetail: true },
  { name: 'Needham', x: 270, y: 245, approved: 4, submitted: 4, hasDetail: true },
  { name: 'Sudbury', x: 250, y: 220, approved: 3, submitted: 3, hasDetail: true },
  { name: 'Shrewsbury', x: 200, y: 240, approved: 9, submitted: 16 },
  { name: 'Ipswich', x: 345, y: 165, approved: 9, submitted: 12 },
  { name: 'Randolph', x: 295, y: 270, approved: 5, submitted: 12 },
  { name: 'Malden', x: 305, y: 218, approved: 5, submitted: 8 },
  { name: 'Everett', x: 308, y: 215, approved: 2, submitted: 7 },
  { name: 'Gardner', x: 165, y: 165, approved: 0, submitted: 7 },
  { name: 'Wayland', x: 255, y: 230, approved: 2, submitted: 7 },
]

export default function TownMap() {
  const [hovered, setHovered] = useState<string | null>(null)

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
    if (approved >= 30) return 12
    if (approved >= 20) return 10
    if (approved >= 10) return 8
    if (approved >= 5) return 6
    return 5
  }

  const hoveredTown = towns.find(t => t.name === hovered)

  return (
    <div className="relative bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
      <div className="absolute top-2 left-2 bg-gray-900/90 rounded-lg p-2 text-xs z-10">
        <div className="text-gray-400 mb-1">Approval Rate</div>
        <div className="flex items-center gap-1 mb-0.5"><div className="w-3 h-3 rounded-full bg-emerald-500"></div><span className="text-gray-300">90%+</span></div>
        <div className="flex items-center gap-1 mb-0.5"><div className="w-3 h-3 rounded-full bg-emerald-400"></div><span className="text-gray-300">70-89%</span></div>
        <div className="flex items-center gap-1 mb-0.5"><div className="w-3 h-3 rounded-full bg-yellow-400"></div><span className="text-gray-300">50-69%</span></div>
        <div className="flex items-center gap-1 mb-0.5"><div className="w-3 h-3 rounded-full bg-orange-500"></div><span className="text-gray-300">30-49%</span></div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-red-500"></div><span className="text-gray-300">&lt;30%</span></div>
      </div>

      {hoveredTown && (
        <div className="absolute top-2 right-2 bg-gray-900/90 rounded-lg p-3 text-sm z-10 min-w-[140px]">
          <div className="text-white font-medium">{hoveredTown.name}</div>
          <div className="text-gray-400 text-xs mt-1">{hoveredTown.approved} / {hoveredTown.submitted}</div>
          <div className="text-emerald-400 text-xs">{Math.round((hoveredTown.approved / hoveredTown.submitted) * 100)}% rate</div>
        </div>
      )}

      <svg viewBox="0 0 400 500" className="w-full h-[500px]">
        <path d="M50,180 L80,150 L150,130 L200,120 L250,130 L290,120 L330,140 L360,170 L370,200 L360,220 L370,250 L350,280 L360,320 L340,360 L380,380 L390,420 L360,450 L320,440 L300,400 L280,380 L250,370 L220,350 L200,320 L180,300 L150,280 L100,260 L60,240 L40,210 Z" fill="#1f2937" stroke="#374151" strokeWidth="2"/>
        <path d="M300,400 L320,380 L350,375 L380,380 L390,400 L380,420 L350,430 L320,420 L300,400" fill="#1f2937" stroke="#374151" strokeWidth="2"/>
        {towns.map(town => (
          <Link key={town.name} href={town.hasDetail ? `/${town.name.toLowerCase()}` : `/town/${encodeURIComponent(town.name)}`}>
            <circle
              cx={town.x}
              cy={town.y}
              r={getSize(town.approved)}
              fill={getColor(town.approved, town.submitted)}
              stroke={hovered === town.name ? '#fff' : 'transparent'}
              strokeWidth="2"
              className="cursor-pointer transition-all hover:opacity-80"
              onMouseEnter={() => setHovered(town.name)}
              onMouseLeave={() => setHovered(null)}
            />
          </Link>
        ))}
      </svg>
    </div>
  )
}
