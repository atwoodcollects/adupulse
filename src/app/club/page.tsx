'use client'

import Link from 'next/link'
import { useState, useRef, useEffect, useMemo } from 'react'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import townSEOData from '@/data/town_seo_data'

const townNames = townSEOData.map(t => t.name).sort()

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-gray-700 last:border-0">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-4 text-left min-h-[52px]">
        <span className="text-white text-sm font-medium pr-4">{question}</span>
        <span className={`text-gray-500 text-sm shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}>▼</span>
      </button>
      {open && <div className="pb-4 text-gray-400 text-sm leading-relaxed">{answer}</div>}
    </div>
  )
}

export default function ClubPage() {
  const [selectedTown, setSelectedTown] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [showStickyCTA, setShowStickyCTA] = useState(false)
  const formRef = useRef<HTMLDivElement>(null)

  const isFormComplete = selectedTown && email && role

  const townData = useMemo(() => {
    if (!selectedTown) return null
    return townSEOData.find(t => t.name === selectedTown) ?? null
  }, [selectedTown])

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setShowStickyCTA(!entry.isIntersecting), { threshold: 0.1 })
    if (formRef.current) observer.observe(formRef.current)
    return () => observer.disconnect()
  }, [])

  const scrollToForm = () => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })

  const handleSubmit = async () => {
    setStatus('loading')
    try {
      const res = await fetch('/api/club', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ town: selectedTown, email, role, type: 'homeowner' }),
      })
      setStatus(res.ok ? 'success' : 'error')
    } catch { setStatus('error') }
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <NavBar current="Club" />

      <main className="max-w-3xl mx-auto px-4 py-6 md:py-12 pb-24 md:pb-12">
        {/* ─── HERO ─── */}
        <section className="text-center mb-8 md:mb-10">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 leading-tight">
            Your ADU Starts Here
          </h1>
          <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto mb-6">
            Find out what&apos;s allowed in your town, understand the rules, and take the next step — whether you&apos;re building for family, rental income, or flexibility.
          </p>
        </section>

        {/* ─── TOWN LOOKUP ─── */}
        <section className="mb-10">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 sm:p-6">
            <h2 className="text-lg font-bold text-white mb-3">Check Your Town</h2>
            <select
              value={selectedTown}
              onChange={e => setSelectedTown(e.target.value)}
              className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none min-h-[48px]"
            >
              <option value="">Select your town...</option>
              {townNames.map(t => <option key={t} value={t}>{t}</option>)}
            </select>

            {townData && (
              <div className="mt-4 bg-gray-900/50 border border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-white font-semibold">{townData.name}</h3>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded ${townData.byRight ? 'text-emerald-400 bg-emerald-400/10' : 'text-amber-400 bg-amber-400/10'}`}>
                    {townData.byRight ? 'By-Right' : 'Check Local Rules'}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3 mb-3">
                  <div className="text-center">
                    <div className="text-lg font-bold text-white">{townData.submitted}</div>
                    <div className="font-mono text-[9px] text-gray-500 uppercase">Submitted</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-emerald-400">{townData.approved}</div>
                    <div className="font-mono text-[9px] text-gray-500 uppercase">Approved</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-white">{townData.approvalRate}%</div>
                    <div className="font-mono text-[9px] text-gray-500 uppercase">Rate</div>
                  </div>
                </div>
                <Link href={`/towns/${townData.slug}`} className="text-blue-400 text-sm hover:text-blue-300 hover:underline">
                  See full details for {townData.name} →
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* ─── HOW IT WORKS ─── */}
        <section className="mb-10">
          <h2 className="text-lg font-bold text-white mb-4 text-center">How It Works</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { n: '1', title: 'Check your town', desc: 'See permit activity, approval rates, and any local restrictions for your municipality.', href: '/towns' },
              { n: '2', title: 'Understand the rules', desc: 'State law gives you the right to build. See how your town\u2019s bylaw aligns with Chapter 150.', href: '/compliance' },
              { n: '3', title: 'Get started', desc: 'Connect with resources, get updates, and explore your options \u2014 from cost estimates to local permit data.', href: '#updates' },
            ].map(step => (
              <Link key={step.n} href={step.href} className="block bg-gray-800/50 border border-gray-700 rounded-xl p-5 text-center no-underline hover:border-gray-600 transition-colors">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-xs">{step.n}</div>
                  <h3 className="text-white font-bold">{step.title}</h3>
                </div>
                <p className="text-gray-400 text-sm">{step.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* ─── FORM + SIDEBAR ─── */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-10" id="updates">
          {/* Form */}
          <div ref={formRef}>
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 sm:p-6">
              <h2 className="text-lg font-bold text-white mb-1">{status === 'success' ? "You're signed up!" : 'Stay Updated'}</h2>
              {status === 'success' ? (
                <div>
                  <div className="bg-emerald-900/30 border border-emerald-500/30 rounded-lg p-5 text-center mb-4">
                    <p className="text-emerald-400 font-bold text-lg mb-1">Signed up for {selectedTown}!</p>
                    <p className="text-gray-400 text-sm">We&apos;ll send you updates when there&apos;s news relevant to {selectedTown} — new permit data, bylaw changes, or resources.</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex gap-2.5 items-center bg-gray-900/50 rounded-lg p-3 min-h-[44px]"><span className="text-emerald-400">✓</span><span className="text-gray-300 text-sm">Confirmation email on its way</span></div>
                    <div className="flex gap-2.5 items-center bg-gray-900/50 rounded-lg p-3 min-h-[44px]"><span className="text-gray-500">○</span><span className="text-gray-400 text-sm">Updates when there&apos;s news for your town</span></div>
                  </div>
                  <div className="mt-4 bg-blue-900/20 border border-blue-500/20 rounded-lg p-4 text-center">
                    <p className="text-white text-sm font-medium mb-2">Know someone else considering an ADU?</p>
                    <button onClick={() => {
                      const text = `I'm using ADU Pulse to research ADUs in ${selectedTown}. Worth checking out!`
                      if (typeof navigator !== 'undefined' && navigator.share) {
                        navigator.share({ title: `ADU info for ${selectedTown}`, text, url: 'https://www.adupulse.com/club' })
                      } else if (typeof navigator !== 'undefined') {
                        navigator.clipboard.writeText(text + ' https://www.adupulse.com/club')
                      }
                    }} className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-lg font-medium min-h-[44px]">
                      Share with a neighbor
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-gray-400 text-sm">Get notified when there&apos;s news for your town — permit data updates, bylaw changes, or new resources.</p>
                  <div>
                    <label className="block text-gray-400 text-xs mb-1">Your town</label>
                    <select value={selectedTown} onChange={e => setSelectedTown(e.target.value)}
                      className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none min-h-[48px]">
                      <option value="">Select your town...</option>
                      {townNames.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs mb-1">I&apos;m a...</label>
                    <select value={role} onChange={e => setRole(e.target.value)}
                      className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none min-h-[48px]">
                      <option value="">Select...</option>
                      <option value="homeowner">Homeowner considering an ADU</option>
                      <option value="grandparent">Grandparent / want to be near family</option>
                      <option value="adult_child">Adult child exploring ADU for parents</option>
                      <option value="builder">Builder / contractor</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs mb-1">Email</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com"
                      className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none min-h-[48px]" />
                  </div>
                  <button onClick={handleSubmit} disabled={!isFormComplete || status === 'loading'}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-lg font-medium transition-colors min-h-[48px]">
                    {status === 'loading' ? 'Submitting...' : 'Get Updates — Free'}
                  </button>
                  {status === 'error' && <p className="text-red-400 text-sm text-center">Something went wrong. Try again.</p>}
                  <p className="text-gray-600 text-xs text-center">No spam. We only email when there&apos;s a real update for your town.</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* What you get */}
            <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/20 rounded-xl p-5">
              <h3 className="text-white font-bold mb-3">What You Get</h3>
              <div className="space-y-2.5 text-sm">
                {[
                  'Permit data for your town — updated regularly',
                  'Alerts when local bylaws change or AG acts',
                  'Cost estimates based on real permit data',
                  'Guidance on state law and your rights',
                ].map((text, i) => (
                  <div key={i} className="flex gap-2.5 items-start min-h-[28px]">
                    <span className="text-emerald-400 mt-0.5">✓</span>
                    <span className="text-gray-400">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Family angle */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
              <h3 className="text-white font-bold mb-2">Building to be near family?</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-3">
                Many people exploring ADUs are grandparents looking to live closer to grandchildren. MA&apos;s by-right law makes this easier than ever.
              </p>
              <Link href="/blog/grandparent-adu-massachusetts" className="text-blue-400 text-sm hover:underline">
                Read: The Grandparent ADU →
              </Link>
            </div>
          </div>
        </div>

        {/* ─── FAQ ─── */}
        <section>
          <h2 className="text-lg font-bold text-white mb-3">Frequently Asked Questions</h2>
          <div className="bg-gray-800 border border-gray-700 rounded-xl px-5">
            <FAQItem question="Is there a cost to sign up?" answer="No. Signing up for updates is completely free. There's no obligation, and you can unsubscribe at any time." />
            <FAQItem question="What kind of updates will I get?" answer="We'll notify you when there's new permit data, bylaw changes, AG decisions, or other developments relevant to your town. We don't send marketing emails or share your information." />
            <FAQItem question="Do I need to be a homeowner?" answer="Anyone can sign up — homeowners, family members exploring options for aging parents, builders, or anyone interested in ADU policy in Massachusetts." />
            <FAQItem question="Can I build an ADU by right?" answer="Under Chapter 150 of the Acts of 2024, single-family homeowners in Massachusetts can build one ADU by right — meaning no special permit is required. Some towns have additional local provisions, which you can check on our Policy Tracker." />
            <FAQItem question="What if my town isn't listed?" answer="We track 293 towns. If yours isn't in the dropdown, select the closest one — we're expanding coverage regularly." />
          </div>
        </section>
      </main>

      {/* Mobile sticky CTA */}
      {showStickyCTA && status !== 'success' && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-t border-gray-700 px-4 py-3 z-40">
          <button onClick={scrollToForm}
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium min-h-[48px] shadow-lg shadow-emerald-600/20">
            Get Updates — Free →
          </button>
        </div>
      )}

      <Footer />
    </div>
  )
}
