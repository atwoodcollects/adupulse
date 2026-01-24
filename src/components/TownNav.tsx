'use client'
import Link from 'next/link'
import { useState } from 'react'

const towns = [
  { name: 'All Towns', href: '/' },
  { name: 'Boston', href: '/boston' },
  { name: 'Lexington', href: '/lexington' },
  { name: 'Andover', href: '/andover' },
    { name: 'Falmouth', href: '/falmouth' },
]

export default function TownNav({ current }: { current: string }) {
  const [open, setOpen] = useState(false)
  
  return (
    <div className="relative">
      <button 
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm"
      >
        {current} <span className="text-xs">▼</span>
      </button>
      {open && (
        <div className="absolute top-full mt-1 bg-gray-800 border border-gray-700 rounded-lg overflow-hidden z-50 min-w-[140px]">
          {towns.map(town => (
            <Link 
              key={town.href}
              href={town.href}
              className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
              onClick={() => setOpen(false)}
            >
              {town.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
