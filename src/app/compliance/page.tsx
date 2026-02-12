'use client'

import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import ComplianceTracker from './ComplianceTracker'

export default function CompliancePage() {
  return (
    <>
      <NavBar />
      <main className="min-h-screen px-4 py-6 sm:py-10">
        {/* Breadcrumbs */}
        <nav className="max-w-4xl mx-auto mb-6 text-sm text-gray-400">
          <a href="/" className="text-blue-400 hover:text-blue-300 transition-colors">
            Dashboard
          </a>
          <span className="mx-2 text-gray-600">/</span>
          <span className="text-gray-400">Compliance</span>
        </nav>

        {/* Page header */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Bylaw Compliance Tracker
            </h1>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded">
              New
            </span>
          </div>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-2xl">
            How do local ADU bylaws stack up against Massachusetts Chapter 150 and 760 CMR 71.00?
            We read the bylaws so you don&apos;t have to.
          </p>
        </div>

        <ComplianceTracker />
      </main>
      <Footer />
    </>
  )
}
