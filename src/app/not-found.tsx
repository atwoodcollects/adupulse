'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

export default function NotFound() {
  const pathname = usePathname()

  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', '404_error', { page_path: pathname })
    }
  }, [pathname])

  return (
    <div className="min-h-screen bg-gray-900">
      <NavBar />
      <main className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-6xl font-bold text-gray-700 mb-4">404</p>
        <h1 className="text-2xl font-bold text-white mb-3">Page not found</h1>
        <p className="text-gray-400 mb-8">
          The page <span className="text-gray-300 font-mono text-sm">{pathname}</span> doesn&apos;t exist or has moved.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Go to Dashboard
          </Link>
          <Link
            href="/compliance"
            className="px-5 py-2.5 bg-gray-800 border border-gray-700 hover:border-gray-600 text-gray-300 rounded-lg text-sm font-medium transition-colors"
          >
            Consistency Tracker
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}
