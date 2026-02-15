'use client'

import Link from 'next/link'
import { useState, useEffect, useMemo, useRef } from 'react'
import { Search, X } from 'lucide-react'
import townSEOData from '@/data/town_seo_data'
import { useTown } from '@/contexts/TownContext'

const mainNav = [
  { name: 'Towns', href: '/map' },
  { name: 'Bylaw Tracker', href: '/compliance' },
  { name: 'For Builders', href: '/builders' },
  { name: 'Blog', href: '/blog' },
  { name: 'Pricing', href: '/pricing' },
]

const mobileGroups = [
  {
    label: 'Explore',
    links: [
      { name: 'All Towns', href: '/map' },
      { name: 'Bylaw Tracker', href: '/compliance' },
      { name: 'Town Rankings', href: '/rankings' },
    ],
  },
  {
    label: 'Tools',
    links: [
      { name: 'Cost Estimator', href: '/estimate' },
      { name: 'ADU Quiz', href: '/quiz' },
      { name: 'Compare Towns', href: '/compare' },
    ],
  },
  {
    label: 'For You',
    links: [
      { name: 'ADU Club', href: '/club' },
      { name: 'Builder Network', href: '/builders' },
      { name: 'Blog', href: '/blog' },
    ],
  },
]

export default function NavBar({ current }: { current?: string }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [search, setSearch] = useState('')
  const searchInputRef = useRef<HTMLInputElement>(null)
  const { setSelectedTown } = useTown()

  const searchResults = useMemo(() => {
    if (!search.trim()) return []
    const q = search.toLowerCase()
    return townSEOData.filter(t => t.name.toLowerCase().includes(q)).slice(0, 6)
  }, [search])

  // Lock body scroll when either overlay is open
  useEffect(() => {
    document.body.style.overflow = (menuOpen || searchOpen) ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen, searchOpen])

  // Focus search input when search modal opens
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50)
    } else {
      setSearch('')
    }
  }, [searchOpen])

  const closeAll = () => { setMenuOpen(false); setSearchOpen(false); setSearch('') }

  return (
    <>
      <header className="border-b border-gray-800 sticky top-0 bg-gray-900/95 backdrop-blur-sm z-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-14 md:h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0" onClick={closeAll}>
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-lg md:text-xl font-bold text-white tracking-tight">ADU Pulse</span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {mainNav.map(item => (
                <Link key={item.href} href={item.href}
                  className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                    current === item.name ? 'text-white bg-gray-800' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                  }`}>
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Mobile: Hamburger */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => { setMenuOpen(!menuOpen); setSearchOpen(false) }}
                className="flex flex-col justify-center gap-1.5 w-10 h-10 items-center"
                aria-label="Menu"
              >
                <span className={`block w-5 h-0.5 bg-gray-300 transition-all duration-200 ${menuOpen ? 'rotate-45 translate-y-1' : ''}`} />
                <span className={`block w-5 h-0.5 bg-gray-300 transition-all duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
                <span className={`block w-5 h-0.5 bg-gray-300 transition-all duration-200 ${menuOpen ? '-rotate-45 -translate-y-1' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── SEARCH MODAL (mobile) ── */}
      {searchOpen && (
        <div className="fixed inset-0 z-[999] md:hidden">
          <div className="absolute inset-0 bg-gray-900/98" onClick={closeAll} />
          <div className="relative flex flex-col h-full">
            {/* Search header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-800">
              <Search className="w-5 h-5 text-gray-500 shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search your town..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="flex-1 bg-transparent text-white text-base placeholder-gray-500 focus:outline-none"
              />
              <button onClick={closeAll} className="text-gray-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Results */}
            <div className="flex-1 overflow-y-auto">
              {search && searchResults.length > 0 && (
                <div className="py-2">
                  {searchResults.map(t => (
                    <Link
                      key={t.slug}
                      href={`/towns/${t.slug}`}
                      className="flex items-center justify-between px-4 py-3.5 hover:bg-gray-800/50 transition-colors"
                      onClick={() => { setSelectedTown(t.name); closeAll() }}
                    >
                      <div>
                        <span className="text-white font-medium">{t.name}</span>
                        <span className="text-gray-500 text-xs ml-2">{t.county} County</span>
                      </div>
                      <div className="text-right">
                        <span className="text-emerald-400 font-bold text-sm">{t.approved}</span>
                        <span className="text-gray-500 text-xs ml-1.5">{t.approvalRate}%</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
              {search && searchResults.length === 0 && (
                <div className="px-4 py-8 text-center">
                  <p className="text-gray-400 text-sm">No towns found for &ldquo;{search}&rdquo;</p>
                  <p className="text-gray-500 text-xs mt-1">We track 293 towns with EOHLC survey data.</p>
                </div>
              )}
              {!search && (
                <div className="px-4 py-8 text-center">
                  <p className="text-gray-500 text-sm">Type a town name to see permits, bylaws, and costs</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── FULL-SCREEN MENU (mobile) ── */}
      <div className={`fixed inset-0 top-14 z-[998] md:hidden transition-opacity duration-200 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-gray-900" onClick={closeAll} />
        <div className={`relative flex flex-col h-full bg-gray-900 transition-transform duration-200 ${menuOpen ? 'translate-y-0' : '-translate-y-4'}`}>

          {/* Grouped links */}
          <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
            {mobileGroups.map(group => (
              <div key={group.label}>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-2 px-1">
                  {group.label}
                </div>
                <div className="space-y-0.5">
                  {group.links.map(item => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block px-3 py-3 text-sm text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors"
                      onClick={closeAll}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            {/* Pricing standalone */}
            <Link
              href="/pricing"
              className="block px-3 py-3 text-sm text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors"
              onClick={closeAll}
            >
              Pricing
            </Link>
          </nav>

          {/* Bottom CTA */}
          <div className="px-4 py-4 border-t border-gray-800">
            <Link
              href="/pricing"
              onClick={closeAll}
              className="block w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-center rounded-lg font-medium text-sm"
            >
              Explore Pricing
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
