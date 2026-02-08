'use client'

import Link from 'next/link'
import TownNav from '@/components/TownNav'
import { useState } from 'react'

const FORMSPREE_ID = 'mzdabkvb'

export default function BuildersPage() {
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [email, setEmail] = useState('')
  const [regions, setRegions] = useState('')
  const [aduTypes, setAduTypes] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async () => {
    if (!name || !company || !email) return
    setStatus('loading')
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          _subject: `Builder Signup: ${company}`,
          form_type: 'builder',
          name,
          company,
          email,
          regions,
          adu_types: aduTypes,
        }),
      })
      if (res.ok) setStatus('success')
      else throw new Error()
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-lg md:text-xl font-bold text-white tracking-tight">ADU Pulse</span>
            </Link>
            <TownNav current="Builders" />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-10">
          <div className="inline-block bg-blue-900/30 border border-blue-500/30 rounded-full px-4 py-1 text-blue-400 text-sm font-medium mb-4">
            For Builders &amp; Contractors
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Get Clustered ADU Leads By Town
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            We group homeowners exploring ADUs by town. You get pre-qualified, geographically clustered
            leads &mdash; not scattered one-offs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Value props */}
          <div>
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 mb-6">
              <h2 className="text-xl font-bold text-white mb-4">Why builders partner with us</h2>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-emerald-900/50 border border-emerald-500/30 rounded-lg flex items-center justify-center text-lg shrink-0">📍</div>
                  <div>
                    <p className="text-white font-medium">Clustered by town</p>
                    <p className="text-gray-400 text-sm">5+ homeowners in the same town means shared permitting, bulk materials, efficient crew scheduling.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-emerald-900/50 border border-emerald-500/30 rounded-lg flex items-center justify-center text-lg shrink-0">💰</div>
                  <div>
                    <p className="text-white font-medium">Better margins on volume</p>
                    <p className="text-gray-400 text-sm">Price 15-20% lower per unit while making more per project cycle. Group deals beat one-offs.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-emerald-900/50 border border-emerald-500/30 rounded-lg flex items-center justify-center text-lg shrink-0">📊</div>
                  <div>
                    <p className="text-white font-medium">Real demand data</p>
                    <p className="text-gray-400 text-sm">See which towns have active interest, what types of ADUs people want, and where to focus your pipeline.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-emerald-900/50 border border-emerald-500/30 rounded-lg flex items-center justify-center text-lg shrink-0">🏗️</div>
                  <div>
                    <p className="text-white font-medium">Pre-qualified leads</p>
                    <p className="text-gray-400 text-sm">Every signup includes town, ADU type preference, and role. No cold calls &mdash; these people raised their hand.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-emerald-900/30 to-blue-900/30 border border-emerald-500/20 rounded-xl p-6">
              <h3 className="text-white font-bold mb-2">The numbers</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-900/50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-emerald-400">1,224</div>
                  <div className="text-gray-500 text-xs">ADUs approved in MA</div>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-white">217</div>
                  <div className="text-gray-500 text-xs">Towns tracked</div>
                </div>
              </div>
              <p className="text-gray-400 text-sm">Massachusetts&apos; by-right ADU law is driving permit volume across the state. Homeowners are ready &mdash; they just need a builder they trust at a price that works.</p>
            </div>
          </div>

          {/* Signup form */}
          <div>
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Join the builder network</h2>

              {status === 'success' ? (
                <div className="bg-emerald-900/30 border border-emerald-500/30 rounded-lg p-6 text-center">
                  <div className="text-3xl mb-2">&#127881;</div>
                  <p className="text-emerald-400 font-bold text-lg mb-1">You&apos;re in!</p>
                  <p className="text-gray-400">We&apos;ll reach out when homeowner groups form in your service areas.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Your name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="John Smith"
                      className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2.5 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Company</label>
                    <input
                      type="text"
                      value={company}
                      onChange={e => setCompany(e.target.value)}
                      placeholder="ABC Builders"
                      className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2.5 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2.5 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Regions you serve</label>
                    <select
                      value={regions}
                      onChange={e => setRegions(e.target.value)}
                      className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2.5 text-white focus:border-blue-500 focus:outline-none"
                    >
                      <option value="">Select...</option>
                      <option value="metro_boston">Metro Boston</option>
                      <option value="north_shore">North Shore</option>
                      <option value="south_shore">South Shore</option>
                      <option value="merrimack_valley">Merrimack Valley</option>
                      <option value="cape_cod">Cape Cod &amp; Islands</option>
                      <option value="central_ma">Central MA</option>
                      <option value="pioneer_valley">Pioneer Valley</option>
                      <option value="south_coast">South Coast</option>
                      <option value="statewide">Statewide</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm mb-1">ADU types you build</label>
                    <select
                      value={aduTypes}
                      onChange={e => setAduTypes(e.target.value)}
                      className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2.5 text-white focus:border-blue-500 focus:outline-none"
                    >
                      <option value="">Select...</option>
                      <option value="detached">Detached (backyard cottages)</option>
                      <option value="conversion">Conversions (basement, garage)</option>
                      <option value="modular">Modular / prefab</option>
                      <option value="all">All types</option>
                    </select>
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={!name || !company || !email || status === 'loading'}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-lg font-medium transition-colors"
                  >
                    {status === 'loading' ? 'Joining...' : 'Join Builder Network'}
                  </button>

                  {status === 'error' && (
                    <p className="text-red-400 text-sm text-center">Something went wrong. Try again.</p>
                  )}

                  <p className="text-gray-600 text-xs text-center">No cost to join. We&apos;ll connect you with homeowner groups as they form in your area.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-800 mt-12">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 text-xs text-gray-500">
            <div>&copy; 2026 ADU Pulse</div>
            <div className="flex gap-4">
              <Link href="/" className="hover:text-white">Home</Link>
              <Link href="/club" className="hover:text-white">Join Club</Link>
              <Link href="/blog" className="hover:text-white">Blog</Link>
              <Link href="/estimate" className="hover:text-white">Estimator</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
