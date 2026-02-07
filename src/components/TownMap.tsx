'use client'

import { useState } from 'react'
import Link from 'next/link'

const towns: { name: string; x: number; y: number; approved: number; submitted: number; hasDetail?: boolean }[] = [
  { name: 'Boston', x: 230, y: 138, approved: 44, submitted: 69, hasDetail: true },
  { name: 'Worcester', x: 155, y: 148, approved: 23, submitted: 31 },
  { name: 'Plymouth', x: 248, y: 175, approved: 34, submitted: 42, hasDetail: true },
  { name: 'Newton', x: 212, y: 138, approved: 18, submitted: 40, hasDetail: true },
  { name: 'Somerville', x: 222, y: 132, approved: 24, submitted: 40 },
  { name: 'Cambridge', x: 218, y: 134, approved: 6, submitted: 8 },
  { name: 'Lawrence', x: 208, y: 98, approved: 32, submitted: 44 },
  { name: 'Lowell', x: 195, y: 105, approved: 26, submitted: 26 },
  { name: 'Barnstable', x: 295, y: 195, approved: 6, submitted: 31 },
  { name: 'Nantucket', x: 320, y: 235, approved: 27, submitted: 27 },
  { name: 'Fall River', x: 228, y: 195, approved: 13, submitted: 25 },
  { name: 'Milton', x: 225, y: 150, approved: 24, submitted: 25, hasDetail: true },
  { name: 'Brookline', x: 218, y: 142, approved: 10, submitted: 14 },
  { name: 'Quincy', x: 232, y: 152, approved: 6, submitted: 17 },
  { name: 'Revere', x: 235, y: 128, approved: 9, submitted: 17, hasDetail: true },
  { name: 'Lynn', x: 240, y: 122, approved: 9, submitted: 22 },
  { name: 'Medford', x: 220, y: 128, approved: 19, submitted: 22 },
  { name: 'Haverhill', x: 205, y: 90, approved: 13, submitted: 29 },
  { name: 'Methuen', x: 200, y: 95, approved: 21, submitted: 28 },
  { name: 'Lexington', x: 205, y: 125, approved: 6, submitted: 6, hasDetail: true },
  { name: 'Arlington', x: 215, y: 128, approved: 6, submitted: 7 },
  { name: 'Framingham', x: 185, y: 148, approved: 6, submitted: 8 },
  { name: 'Brockton', x: 225, y: 168, approved: 5, submitted: 16 },
  { name: 'Marshfield', x: 255, y: 170, approved: 11, submitted: 24 },
  { name: 'Falmouth', x: 280, y: 210, approved: 12, submitted: 12, hasDetail: true },
  { name: 'Harwich', x: 305, y: 200, approved: 15, submitted: 15 },
  { name: 'Amherst', x: 82, y: 130, approved: 12, submitted: 23 },
  { name: 'Northampton', x: 72, y: 138, approved: 15, submitted: 20 },
  { name: 'Fairhaven', x: 248, y: 198, approved: 18, submitted: 18 },
  { name: 'Raynham', x: 218, y: 178, approved: 18, submitted: 18 },
  { name: 'Middleborough', x: 235, y: 182, approved: 18, submitted: 18 },
  { name: 'Beverly', x: 248, y: 115, approved: 12, submitted: 12 },
  { name: 'Salem', x: 245, y: 118, approved: 9, submitted: 9 },
  { name: 'Peabody', x: 238, y: 118, approved: 7, submitted: 12 },
  { name: 'Danvers', x: 242, y: 112, approved: 2, submitted: 9 },
  { name: 'Andover', x: 195, y: 105, approved: 9, submitted: 10, hasDetail: true },
  { name: 'Billerica', x: 195, y: 115, approved: 13, submitted: 18 },
  { name: 'Chelmsford', x: 185, y: 110, approved: 7, submitted: 7 },
  { name: 'Dracut', x: 190, y: 100, approved: 10, submitted: 12 },
  { name: 'Taunton', x: 212, y: 185, approved: 7, submitted: 14 },
  { name: 'Attleboro', x: 198, y: 195, approved: 10, submitted: 15 },
  { name: 'Freetown', x: 225, y: 192, approved: 13, submitted: 17 },
  { name: 'Westport', x: 225, y: 205, approved: 14, submitted: 14 },
  { name: 'Tisbury', x: 290, y: 222, approved: 14, submitted: 15 },
  { name: 'Duxbury', x: 252, y: 175, approved: 2, submitted: 3, hasDetail: true },
  { name: 'Needham', x: 200, y: 148, approved: 4, submitted: 4, hasDetail: true },
  { name: 'Sudbury', x: 185, y: 130, approved: 3, submitted: 3, hasDetail: true },
  { name: 'Shrewsbury', x: 165, y: 145, approved: 9, submitted: 16 },
  { name: 'Ipswich', x: 255, y: 105, approved: 9, submitted: 12 },
  { name: 'Randolph', x: 222, y: 158, approved: 5, submitted: 12 },
  { name: 'Malden', x: 225, y: 130, approved: 5, submitted: 8 },
  { name: 'Everett', x: 228, y: 128, approved: 2, submitted: 7 },
  { name: 'Gardner', x: 120, y: 105, approved: 0, submitted: 7 },
  { name: 'Wayland', x: 190, y: 138, approved: 2, submitted: 7 },
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
    if (approved >= 30) return 10
    if (approved >= 20) return 8
    if (approved >= 10) return 6
    if (approved >= 5) return 5
    return 4
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

      <svg viewBox="0 0 380 280" className="w-full h-[500px]">
        {/* Real MA outline */}
        <path 
          d="M1,142 L7,140 L12,130 L18,128 L22,118 L30,115 L38,108 L42,102 L52,98 L58,95 L68,92 L78,88 L88,85 L95,82 L105,80 L115,82 L125,85 L135,82 L142,78 L148,75 L155,78 L162,82 L168,88 L175,92 L182,88 L188,85 L195,88 L202,92 L208,88 L215,85 L222,82 L228,78 L235,75 L242,78 L248,82 L255,88 L262,95 L268,102 L272,108 L275,115 L278,122 L282,128 L288,132 L295,128 L302,125 L308,128 L312,135 L318,142 L325,148 L332,155 L338,162 L342,168 L348,175 L352,182 L358,188 L362,195 L365,202 L368,208 L370,215 L365,218 L358,222 L352,225 L345,228 L338,232 L332,235 L325,238 L318,242 L308,245 L298,248 L288,252 L278,255 L268,252 L258,248 L248,245 L238,242 L228,238 L218,235 L208,232 L198,228 L188,225 L178,222 L168,218 L158,215 L148,212 L138,208 L128,205 L118,202 L108,198 L98,195 L88,192 L78,188 L68,185 L58,182 L48,178 L38,175 L28,172 L18,168 L8,165 L1,158 Z"
          fill="#1e293b"
          stroke="#64748b"
          strokeWidth="2"
        />
        {/* Cape Cod */}
        <path 
          d="M268,175 L278,172 L288,175 L298,178 L308,182 L318,188 L325,195 L332,202 L335,210 L332,218 L325,222 L318,225 L308,228 L298,230 L288,228 L280,222 L275,215 L272,208 L270,200 L268,192 L268,182 Z"
          fill="#1e293b"
          stroke="#64748b"
          strokeWidth="2"
        />
        {/* Martha's Vineyard */}
        <path
          d="M275,225 L295,222 L305,228 L295,235 L280,235 L275,230 Z"
          fill="#1e293b"
          stroke="#64748b"
          strokeWidth="2"
        />
        {/* Nantucket */}
        <path
          d="M310,235 L335,232 L340,238 L335,245 L315,245 L310,240 Z"
          fill="#1e293b"
          stroke="#64748b"
          strokeWidth="2"
        />
        
        {/* Town dots */}
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
