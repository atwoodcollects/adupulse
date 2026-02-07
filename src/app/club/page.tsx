'use client'

import Link from 'next/link'
import TownNav from '@/components/TownNav'
import { useState } from 'react'

const towns = [
  'Andover', 'Arlington', 'Attleboro', 'Barnstable', 'Beverly', 'Billerica',
  'Boston', 'Brockton', 'Brookline', 'Cambridge', 'Chelmsford', 'Danvers',
  'Dracut', 'Duxbury', 'Everett', 'Fairhaven', 'Fall River', 'Falmouth',
  'Framingham', 'Freetown', 'Gardner', 'Harwich', 'Haverhill', 'Ipswich',
  'Lawrence', 'Lexington', 'Lowell', 'Lynn', 'Malden', 'Marshfield',
  'Medford', 'Methuen', 'Middleborough', 'Milton', 'Nantucket', 'Needham',
  'Newton', 'Northampton', 'Peabody', 'Plymouth', 'Quincy', 'Randolph',
  'Raynham', 'Revere', 'Salem', 'Shrewsbury', 'Somerville', 'Sudbury',
  'Taunton', 'Tisbury', 'Wayland', 'Westport', 'Worcester',
]

// Replace with your Formspree form ID from https://formspree.io
const FORMSPREE_ID = 'mzdabkvb'

export default function ClubPage() {
  const [email, setEmail] = useState('')
  const [town, setTown] = useState('')
  const [interestType, setInterestType] = useState('')
  const [role, setRole] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async () => {
    if (!email || !town || !interestType || !role) return
    setStatus('loading')

    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          town,
          interest_type: interestType,
          role,
          _subject: `ADU Club Signup: ${town}`,
        }),
      })

      if (res.ok) {
        setStatus('success')
      } else {
        throw new Error()
      }
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
            <TownNav current="Club" />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-block bg-emerald-900/30 border border-emerald-500/30 rounded-full px-4 py-1 text-emerald-400 text-sm font-medium mb-4">
            New: Group ADU Buying
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Join Your Town&apos;s ADU Group
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Homeowners building ADUs together get better pricing. Sign up to connect with
            neighbors exploring ADUs in your town and unlock group rates from vetted builders.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Signup Form */}
          <div>
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Sign up for your town</h2>

              {status === 'success' ? (
                <div className="bg-emerald-900/30 border border-emerald-500/30 rounded-lg p-6 text-center">
                  <div className="text-3xl mb-2">&#127881;</div>
                  <p className="text-emerald-400 font-bold text-lg mb-1">You&apos;re in!</p>
                  <p className="text-gray-400">
                    We&apos;ll notify you when more homeowners in {town} sign up or when a builder partnership is available.
                  </p>
                  <p className="text-gray-500 text-sm mt-3">Share this page to grow your town&apos;s group.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Your town</label>
                    <select
                      value={town}
                      onChange={e => setTown(e.target.value)}
                      className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2.5 text-white focus:border-blue-500 focus:outline-none"
                    >
                      <option value="">Select your town...</option>
                      {towns.map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm mb-1">I&apos;m a...</label>
                    <select
                      value={role}
                      onChange={e => setRole(e.target.value)}
                      className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2.5 text-white focus:border-blue-500 focus:outline-none"
                    >
                      <option value="">Select...</option>
                      <option value="homeowner">Homeowner considering an ADU</option>
                      <option value="grandparent">Grandparent / want to be near family</option>
                      <option value="adult_child">Adult child exploring ADU for parents</option>
                      <option value="builder">Builder / contractor</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Type of ADU</label>
                    <select
                      value={interestType}
                      onChange={e => setInterestType(e.target.value)}
                      className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2.5 text-white focus:border-blue-500 focus:outline-none"
                    >
                      <option value="">Select...</option>
                      <option value="detached">Detached (backyard cottage)</option>
                      <option value="conversion">Conversion (basement, garage)</option>
                      <option value="aging_in_place">Aging-in-place suite</option>
                      <option value="not_sure">Not sure yet</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@email.com"
                      className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2.5 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={!email || !town || !interestType || !role || status === 'loading'}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-lg font-medium transition-colors"
                  >
                    {status === 'loading' ? 'Joining...' : 'Join the Group'}
                  </button>

                  {status === 'error' && (
                    <p className="text-red-400 text-sm text-center">Something went wrong. Try again.</p>
                  )}

                  <p className="text-gray-600 text-xs text-center">No spam. We&apos;ll only email when your town group hits critical mass or a builder deal is available.</p>
                </div>
              )}
            </div>
          </div>

          {/* Right column */}
          <div>
            {/* How it works */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">How it works</h2>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">1</div>
                  <div>
                    <p className="text-white font-medium">Sign up for your town</p>
                    <p className="text-gray-400 text-sm">Tell us what kind of ADU you&apos;re considering.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">2</div>
                  <div>
                    <p className="text-white font-medium">Your town group grows</p>
                    <p className="text-gray-400 text-sm">More homeowners = better group rates from builders.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">3</div>
                  <div>
                    <p className="text-white font-medium">Get matched with a builder</p>
                    <p className="text-gray-400 text-sm">When your town hits critical mass, we connect the group with vetted builders offering 15-20% group discounts.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Why it works */}
            <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/20 rounded-xl p-6 mt-6">
              <h3 className="text-white font-bold mb-2">Why group ADU buying works</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                A builder doing 5 ADUs in the same town prices them 15-20% lower than one-offs.
                Shared permitting knowledge, bulk materials, and crew efficiency all drive costs down.
              </p>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-gray-900/50 rounded-lg p-3">
                  <div className="text-xl font-bold text-emerald-400">15-20%</div>
                  <div className="text-gray-500 text-xs">Group savings</div>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-3">
                  <div className="text-xl font-bold text-white">5+</div>
                  <div className="text-gray-500 text-xs">Homes per group</div>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-3">
                  <div className="text-xl font-bold text-white">$30-60K</div>
                  <div className="text-gray-500 text-xs">Avg. saved</div>
                </div>
              </div>
            </div>

            {/* Grandparent angle */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 mt-6">
              <h3 className="text-white font-bold mb-2">Building to be near family?</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-3">
                Many of our signups are grandparents exploring ADUs to live closer to their grandchildren.
                Massachusetts&apos; new by-right law makes this easier than ever.
              </p>
              <Link href="/blog/grandparent-adu-massachusetts" className="text-blue-400 text-sm hover:underline">
                Read: The Grandparent ADU &rarr;
              </Link>
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
              <Link href="/blog" className="hover:text-white">Blog</Link>
              <Link href="/estimate" className="hover:text-white">Estimator</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
