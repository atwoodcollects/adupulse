'use client'

import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import townSEOData from '@/data/town_seo_data'

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-gray-700 last:border-0">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left min-h-[52px]">
        <span className="text-white text-sm font-medium pr-4">{question}</span>
        <span className={`text-gray-500 text-sm shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}>▼</span>
      </button>
      {open && <div className="pb-4 text-gray-400 text-sm leading-relaxed">{answer}</div>}
    </div>
  )
}

const topDemand = townSEOData
  .sort((a, b) => b.submitted - a.submitted)
  .slice(0, 6)

export default function BuildersPage() {
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [regions, setRegions] = useState('')
  const [aduType, setAduType] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [showStickyCTA, setShowStickyCTA] = useState(false)
  const formRef = useRef<HTMLDivElement>(null)

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
        body: JSON.stringify({ name, company, email, phone, regions, aduType, type: 'builder' }),
      })
      setStatus(res.ok ? 'success' : 'error')
    } catch { setStatus('error') }
  }

  const totalApproved = 1224
  const totalTowns = 221

  return (
    <div className="min-h-screen bg-gray-900">
      <NavBar current="For Builders" />

      <main className="max-w-5xl mx-auto px-4 py-8 md:py-12 pb-24 md:pb-12">
        {/* ─── HERO — Lead with the pain ─── */}
        <section className="text-center mb-12 md:mb-16">
          <div className="inline-block bg-blue-900/30 border border-blue-500/30 rounded-full px-4 py-1 text-blue-400 text-sm font-medium mb-4">For ADU Builders</div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Stop marketing to every town.<br className="hidden sm:block" />
            <span className="text-blue-400">Know where demand is.</span>
          </h1>
          <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto mb-8">
            ADU Pulse tracks {totalApproved.toLocaleString()} approved permits across {totalTowns} MA towns. We show you where homeowners are actively seeking builders — and connect you with clustered, pre-qualified groups.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={scrollToForm}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium min-h-[48px]">
              Join Builder Network — Free
            </button>
            <Link href="/map"
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium min-h-[48px] flex items-center justify-center">
              Explore Demand Data →
            </Link>
          </div>
        </section>

        {/* ─── LIVE DEMAND DATA ─── */}
        <section className="mb-12">
          <h2 className="text-lg font-bold text-white mb-1">Live Demand: Where Homeowners Are Filing</h2>
          <p className="text-gray-500 text-sm mb-4">Real permit data, updated from EOHLC and municipal sources.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {topDemand.map(t => {
              const rateColor = t.approvalRate >= 80 ? 'text-emerald-400' : t.approvalRate >= 50 ? 'text-amber-400' : 'text-red-400'
              return (
                <Link key={t.slug} href={`/towns/${t.slug}`}
                  className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 hover:bg-gray-700/30 transition-colors">
                  <div className="text-white font-bold mb-0.5">{t.name}</div>
                  <div className="text-gray-500 text-xs mb-2">{t.county} County</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-emerald-400 font-bold text-lg">{t.submitted}</span>
                    <span className="text-gray-500 text-xs">applications</span>
                  </div>
                  <div className={`text-xs ${rateColor}`}>{t.approvalRate}% approval rate</div>
                </Link>
              )
            })}
          </div>
          <Link href="/map" className="block text-blue-400 text-sm hover:underline mt-3">
            View all {totalTowns} towns with filters →
          </Link>
        </section>

        {/* ─── WHAT YOU GET ─── */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-white mb-6 text-center">What Builder Partners Get</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: '📍', title: 'Clustered Leads by Town', desc: '5+ homeowners in the same town means shared permitting, bulk materials, efficient crew scheduling. No cold calls — these people raised their hand.' },
              { icon: '📊', title: 'Real-Time Demand Data', desc: 'See which towns have active interest, what types of ADUs people want, and where to focus your pipeline. Updated from EOHLC and municipal sources.' },
              { icon: '🔔', title: 'Town Alert System', desc: 'Get notified when a new town hits critical mass (5+ interested homeowners). Be the first builder matched to emerging demand.' },
              { icon: '📋', title: 'Town Scorecards', desc: 'Know which towns have fast approvals vs. slow ones before you bid. Our scorecards separate rules friction from operational friction.' },
            ].map((item, i) => (
              <div key={i} className="bg-gray-800/50 border border-gray-700 rounded-xl p-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-900/50 border border-blue-500/30 rounded-lg flex items-center justify-center text-lg shrink-0">{item.icon}</div>
                  <div>
                    <h3 className="text-white font-bold mb-1">{item.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── THE MATH ─── */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-emerald-900/30 to-blue-900/30 border border-emerald-500/20 rounded-xl p-5 md:p-6">
            <h3 className="text-white font-bold text-lg mb-4">The Math on Clustered Projects</h3>
            <div className="bg-gray-900/70 rounded-lg p-4 border border-gray-700/50 mb-4">
              <div className="text-emerald-400 text-xs uppercase tracking-wider mb-3 font-medium">Example: 5 detached ADUs in Plymouth</div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-400">Typical one-off price</span><span className="text-white">$300K × 5 = $1.5M</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Group price (−15%)</span><span className="text-white">$255K × 5 = $1.275M</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Your overhead savings</span><span className="text-emerald-400">−$150K+</span></div>
                <div className="flex justify-between border-t border-gray-700 pt-2 mt-2">
                  <span className="text-gray-300 font-medium">Net margin improvement</span>
                  <span className="text-emerald-400 font-bold">+$75K+</span>
                </div>
              </div>
              <p className="text-gray-500 text-xs mt-3">Savings from shared permit templates, bulk materials (8-12%), reduced crew travel, and shared design fees.</p>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-gray-900/50 rounded-lg p-3">
                <div className="text-2xl font-bold text-emerald-400">{totalApproved.toLocaleString()}</div>
                <div className="text-gray-500 text-xs">ADUs approved in MA</div>
              </div>
              <div className="bg-gray-900/50 rounded-lg p-3">
                <div className="text-2xl font-bold text-white">{totalTowns}</div>
                <div className="text-gray-500 text-xs">Towns tracked</div>
              </div>
              <div className="bg-gray-900/50 rounded-lg p-3">
                <div className="text-2xl font-bold text-white">$0</div>
                <div className="text-gray-500 text-xs">Cost to join</div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── APPLICATION FORM ─── */}
        <section className="grid md:grid-cols-2 gap-6 mb-12" ref={formRef}>
          <div>
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 sm:p-6">
              <h2 className="text-lg font-bold text-white mb-1">Join the Builder Network</h2>
              <p className="text-gray-500 text-sm mb-4">Free to join. We match you with homeowner groups in your area.</p>

              {status === 'success' ? (
                <div className="bg-emerald-900/30 border border-emerald-500/30 rounded-lg p-5 text-center">
                  <div className="text-emerald-400 font-bold text-lg mb-1">🎉 Application received!</div>
                  <p className="text-gray-400 text-sm">We&apos;ll review your info and reach out within 48 hours to discuss builder opportunities in your region.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block text-gray-400 text-xs mb-1">Your name</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Full name"
                      className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none min-h-[44px]" />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs mb-1">Company</label>
                    <input type="text" value={company} onChange={e => setCompany(e.target.value)} placeholder="Company name"
                      className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none min-h-[44px]" />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs mb-1">Email</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com"
                      className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none min-h-[44px]" />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs mb-1">Phone (optional)</label>
                    <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="(555) 123-4567"
                      className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none min-h-[44px]" />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs mb-1">Regions you serve</label>
                    <input type="text" value={regions} onChange={e => setRegions(e.target.value)} placeholder="e.g. South Shore, Metro Boston"
                      className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none min-h-[44px]" />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs mb-1">ADU types you build</label>
                    <select value={aduType} onChange={e => setAduType(e.target.value)}
                      className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none min-h-[44px]">
                      <option value="">Select...</option>
                      <option value="detached">Detached (backyard cottages)</option>
                      <option value="conversion">Conversions (basement, garage)</option>
                      <option value="modular">Modular / prefab</option>
                      <option value="all">All types</option>
                    </select>
                  </div>
                  <button onClick={handleSubmit} disabled={!name || !company || !email || status === 'loading'}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-lg font-medium transition-colors min-h-[48px]">
                    {status === 'loading' ? 'Joining...' : 'Join Builder Network'}
                  </button>
                  {status === 'error' && <p className="text-red-400 text-sm text-center">Something went wrong. Try again.</p>}
                  <p className="text-gray-600 text-xs text-center">No cost to join. We&apos;ll connect you with homeowner groups as they form.</p>
                </div>
              )}
            </div>
          </div>

          {/* Screening + trust */}
          <div className="space-y-4">
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5">
              <h3 className="text-white font-medium mb-2">Builder screening criteria</h3>
              <p className="text-gray-400 text-sm mb-3">We vet builders before matching with homeowner groups:</p>
              <div className="space-y-2 text-sm">
                {[
                  'Active MA contractor license + current insurance',
                  '3+ completed ADU projects with references',
                  'Transparent, itemized group pricing',
                  'No unresolved BBB complaints or legal disputes',
                ].map((text, i) => (
                  <div key={i} className="flex gap-2.5 items-start min-h-[28px]">
                    <span className="text-emerald-400 mt-0.5 shrink-0">✓</span>
                    <span className="text-gray-400">{text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5">
              <h3 className="text-white font-medium mb-2">How lead matching works</h3>
              <div className="space-y-3">
                {[
                  { n: '1', t: 'Town hits 5+ interested homeowners', d: 'We aggregate demand by town and ADU type.' },
                  { n: '2', t: 'We match 1-2 builders', d: 'Based on your region, ADU types, and capacity.' },
                  { n: '3', t: 'You present to the group', d: 'Transparent proposal. Each homeowner decides individually.' },
                ].map(s => (
                  <div key={s.n} className="flex gap-3">
                    <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs shrink-0">{s.n}</div>
                    <div>
                      <div className="text-white text-sm font-medium">{s.t}</div>
                      <div className="text-gray-500 text-xs">{s.d}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─── FAQ ─── */}
        <section>
          <h2 className="text-lg font-bold text-white mb-3">Builder FAQs</h2>
          <div className="bg-gray-800 border border-gray-700 rounded-xl px-5">
            <FAQItem question="Is there a cost to join?" answer="Joining is free. When a group deal closes, we earn a small referral fee built into the group discount. No upfront fees, no subscriptions." />
            <FAQItem question="How are leads distributed?" answer="When a town reaches 5+ interested homeowners, we match with 1-2 builders who serve that region. We curate matches — no blast emails to every builder." />
            <FAQItem question="What does the homeowner group expect?" answer="A transparent, itemized proposal at a group rate. You present to the group and each homeowner decides individually. You set your own capacity limits." />
            <FAQItem question="What if I only build in specific towns?" answer="You'll only be matched with groups in your service area. We ask for your regions during signup and only send relevant leads." />
            <FAQItem question="Can I see demand data before signing up?" answer="Yes — our Town Explorer shows permit activity by town, approval rates, and scorecards. Visit /map to explore." />
          </div>
        </section>
      </main>

      {/* Mobile sticky CTA */}
      {showStickyCTA && status !== 'success' && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-t border-gray-700 px-4 py-3 z-50">
          <button onClick={scrollToForm} className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium min-h-[48px]">
            Join Builder Network — Free →
          </button>
        </div>
      )}

      <Footer />
    </div>
  )
}
