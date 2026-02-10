'use client'

import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'

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
  { name: 'Methodology', href: '/methodology' },
  { name: '— Towns —', href: '', divider: true },
  { name: 'Andover', href: '/andover' },
  { name: 'Boston', href: '/boston' },
  { name: 'Duxbury', href: '/duxbury' },
  { name: 'Falmouth', href: '/falmouth' },
  { name: 'Lexington', href: '/lexington' },
  { name: 'Milton', href: '/milton' },
  { name: 'Needham', href: '/needham' },
  { name: 'Newton', href: '/newton' },
  { name: 'Plymouth', href: '/plymouth' },
  { name: 'Revere', href: '/revere' },
  { name: 'Sudbury', href: '/sudbury' },
]

export default function TownNav({ current }: { current: string }) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open && searchRef.current) {
      searchRef.current.focus()
    }
  }, [open])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
        setSearch('')
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  const filtered = search.trim()
    ? navItems.filter(item =>
        !item.divider && item.name.toLowerCase().includes(search.toLowerCase())
      )
    : navItems

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => { setOpen(!open); setSearch('') }}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded-lg text-sm font-medium"
      >
        {current}
        <span className="text-xs">▼</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 bg-gray-800 border border-gray-700 rounded-lg overflow-hidden z-[9999] min-w-[200px] max-h-[450px] flex flex-col">
          {/* Search input */}
          <div className="p-2 border-b border-gray-700">
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Find a town or page..."
              className="w-full bg-gray-900 border border-gray-600 rounded px-2.5 py-1.5 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Nav items */}
          <div className="overflow-y-auto max-h-[350px]">
            {filtered.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500">
                No matches found
              </div>
            ) : (
              filtered.map((item, i) =>
                item.divider ? (
                  <div key={i} className="px-4 py-1.5 text-xs text-gray-500 bg-gray-900/50 font-medium">
                    {item.name.replace(/—/g, '').trim()}
                  </div>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                    onClick={() => { setOpen(false); setSearch('') }}
                  >
                    {item.name}
                  </Link>
                )
              )
            )}
          </div>

          {/* Intent-based CTAs */}
          {!search && (
            <div className="border-t border-gray-700 p-2 space-y-1">
              <Link
                href="/estimate"
                className="flex items-center gap-2 px-3 py-1.5 text-xs text-blue-400 hover:bg-gray-700 rounded"
                onClick={() => setOpen(false)}
              >
                <span>💰</span> Estimate your ADU cost
              </Link>
              <Link
                href="/quiz"
                className="flex items-center gap-2 px-3 py-1.5 text-xs text-emerald-400 hover:bg-gray-700 rounded"
                onClick={() => setOpen(false)}
              >
                <span>📝</span> Take the ADU quiz
              </Link>
              <Link
                href="/club"
                className="flex items-center gap-2 px-3 py-1.5 text-xs text-purple-400 hover:bg-gray-700 rounded"
                onClick={() => setOpen(false)}
              >
                <span>👥</span> Join your town&apos;s group
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
