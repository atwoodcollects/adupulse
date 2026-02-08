'use client'

import Link from 'next/link'
import { useState } from 'react'

const navItems = [
  { name: 'All Towns', href: '/' },
  { name: '— Pages —', href: '', divider: true },
  { name: 'ADU Quiz', href: '/quiz' },
  { name: 'ADU Club', href: '/club' },
  { name: 'For Builders', href: '/builders' },
  { name: 'Scorecards', href: '/scorecards' },
  { name: 'Blog', href: '/blog' },
  { name: 'Cost Estimator', href: '/estimate' },
  { name: 'Leaderboard', href: '/leaderboard' },
  { name: '— Towns —', href: '', divider: true },
  { name: 'Boston', href: '/boston' },
  { name: 'Lexington', href: '/lexington' },
  { name: 'Andover', href: '/andover' },
  { name: 'Falmouth', href: '/falmouth' },
  { name: 'Newton', href: '/newton' },
  { name: 'Sudbury', href: '/sudbury' },
  { name: 'Needham', href: '/needham' },
  { name: 'Duxbury', href: '/duxbury' },
  { name: 'Plymouth', href: '/plymouth' },
  { name: 'Milton', href: '/milton' },
  { name: 'Revere', href: '/revere' },
]

export default function TownNav({ current }: { current: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded-lg text-sm font-medium"
      >
        {current} <span className="text-xs">▼</span>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 bg-gray-800 border border-gray-700 rounded-lg overflow-hidden z-[9999] min-w-[160px] max-h-[400px] overflow-y-auto">
          {navItems.map((item, i) =>
            item.divider ? (
              <div key={i} className="px-4 py-1.5 text-xs text-gray-500 bg-gray-900/50 font-medium">
                {item.name.replace(/—/g, '').trim()}
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                onClick={() => setOpen(false)}
              >
                {item.name}
              </Link>
            )
          )}
        </div>
      )}
    </div>
  )
}
