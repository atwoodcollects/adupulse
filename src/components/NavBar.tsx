'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

const mainNav = [
  { name: 'Towns', href: '/map' },
  { name: 'Compliance', href: '/compliance' },
  { name: 'For Builders', href: '/builders' },
  { name: 'Blog', href: '/blog' },
  { name: 'Pricing', href: '/pricing' },
]

const mobileNav = [
  { name: 'Towns', href: '/map' },
  { name: 'Compliance', href: '/compliance' },
  { name: 'For Builders', href: '/builders' },
  { name: 'Blog', href: '/blog' },
  { name: 'Pricing', href: '/pricing' },
]

export default function NavBar({ current }: { current?: string }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <>
      <header className="border-b border-gray-800 sticky top-0 bg-gray-900/95 backdrop-blur-sm z-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-14 md:h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
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

            {/* Mobile hamburger */}
            <button onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden flex flex-col justify-center gap-1.5 w-10 h-10 items-center"
              aria-label="Menu">
              <span className={`block w-5 h-0.5 bg-gray-300 transition-transform ${mobileOpen ? 'rotate-45 translate-y-1' : ''}`} />
              <span className={`block w-5 h-0.5 bg-gray-300 transition-opacity ${mobileOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-5 h-0.5 bg-gray-300 transition-transform ${mobileOpen ? '-rotate-45 -translate-y-1' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 bg-black/60 z-[998]" onClick={() => setMobileOpen(false)} />
          <div className="fixed inset-y-0 right-0 w-72 bg-gray-900 border-l border-gray-800 z-[999] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <span className="text-white font-bold">Menu</span>
              <button onClick={() => setMobileOpen(false)} className="text-gray-400 hover:text-white w-10 h-10 flex items-center justify-center text-lg">✕</button>
            </div>
            <nav className="p-2">
              {mobileNav.map(item => (
                <Link key={item.href} href={item.href}
                  className={`flex items-center px-4 py-3.5 text-sm rounded-lg min-h-[48px] transition-colors ${
                    current === item.name ? 'text-white bg-gray-800' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                  onClick={() => setMobileOpen(false)}>
                  {item.name}
                </Link>
              ))}
            </nav>
            {/* Mobile CTA */}
            <div className="p-4 border-t border-gray-800">
              <Link href="/pricing" onClick={() => setMobileOpen(false)}
                className="block w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-center rounded-lg font-medium text-sm min-h-[48px] flex items-center justify-center">
                Go Pro — $49/mo
              </Link>
            </div>
          </div>
        </>
      )}
    </>
  )
}
