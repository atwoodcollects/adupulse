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

  // Prevent body scroll when nav is open on mobile
  useEffect(() => {
    if (open) {
      const isMobile = window.innerWidth < 640
      if (isMobile) {
        document.body.style.overflow = 'hidden'
      }
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
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
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 sm:px-3 sm:py-2 rounded-lg text-sm font-medium min-h-[44px]"
      >
        {current} <span className="text-xs">▼</span>
      </button>

      {open && (
        <>
          {/* Mobile overlay background */}
          <div className="sm:hidden fixed inset-0 bg-black/60 z-[9998]" onClick={() => { setOpen(false); setSearch('') }} />

          {/* Dropdown — full width on mobile, positioned on desktop */}
          <div className="
            fixed sm:absolute
            left-0 sm:left-auto right-0
            bottom-0 sm:bottom-auto top-auto sm:top-full
            sm:mt-1
            bg-gray-800 border-t sm:border border-gray-700
            sm:rounded-lg overflow-hidden
            z-[9999]
            sm:min-w-[220px]
            max-h-[75vh] sm:max-h-[450px]
            flex flex-col
            rounded-t-2xl sm:rounded-t-lg
          ">
            {/* Mobile drag handle */}
            <div className="sm:hidden flex justify-center pt-2 pb-1">
              <div className="w-10 h-1 bg-gray-600 rounded-full" />
            </div>

            {/* Search input */}
            <div className="p-3 sm:p-2 border-b border-gray-700">
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Find a town or page..."
                className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-3 sm:py-1.5 text-base sm:text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none min-h-[48px] sm:min-h-0"
              />
            </div>

            {/* Nav items — larger tap targets on mobile */}
            <div className="overflow-y-auto flex-1">
              {filtered.length === 0 ? (
                <div className="px-4 py-4 sm:py-3 text-sm text-gray-500">
                  No matches found
                </div>
              ) : (
                filtered.map((item, i) =>
                  item.divider ? (
                    <div key={i} className="px-4 py-2 sm:py-1.5 text-xs text-gray-500 bg-gray-900/50 font-medium">
                      {item.name.replace(/—/g, '').trim()}
                    </div>
                  ) : (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block px-4 py-3 sm:py-2 text-base sm:text-sm text-gray-300 hover:bg-gray-700 hover:text-white active:bg-gray-600 min-h-[48px] sm:min-h-0 flex items-center"
                      onClick={() => { setOpen(false); setSearch('') }}
                    >
                      {item.name}
                    </Link>
                  )
                )
              )}
            </div>

            {/* Intent-based CTAs — larger on mobile */}
            {!search && (
              <div className="border-t border-gray-700 p-3 sm:p-2 space-y-1">
                <Link href="/estimate"
                  className="flex items-center gap-2.5 px-3 py-3 sm:py-1.5 text-sm sm:text-xs text-blue-400 hover:bg-gray-700 active:bg-gray-600 rounded-lg sm:rounded min-h-[44px] sm:min-h-0"
                  onClick={() => setOpen(false)}>
                  <span>💰</span> Estimate your ADU cost
                </Link>
                <Link href="/quiz"
                  className="flex items-center gap-2.5 px-3 py-3 sm:py-1.5 text-sm sm:text-xs text-emerald-400 hover:bg-gray-700 active:bg-gray-600 rounded-lg sm:rounded min-h-[44px] sm:min-h-0"
                  onClick={() => setOpen(false)}>
                  <span>📝</span> Take the ADU quiz
                </Link>
                <Link href="/club"
                  className="flex items-center gap-2.5 px-3 py-3 sm:py-1.5 text-sm sm:text-xs text-purple-400 hover:bg-gray-700 active:bg-gray-600 rounded-lg sm:rounded min-h-[44px] sm:min-h-0"
                  onClick={() => setOpen(false)}>
                  <span>👥</span> Join your town&apos;s group
                </Link>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
