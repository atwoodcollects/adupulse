'use client'

import Link from 'next/link'
import TownNav from '@/components/TownNav'
import { useState, useEffect, useRef } from 'react'

const FORMSPREE_ID = 'mzdabkvb'

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-gray-700 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center py-4 min-h-[48px] text-left"
      >
        <span className="text-white text-sm font-medium pr-4">{question}</span>
        <span className="text-gray-500 text-lg shrink-0 w-8 h-8 flex items-center justify-center">{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div className="pb-4 text-gray-400 text-sm leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  )
}

export default function BuildersPage() {
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [email, setEmail] = useState('')
  const [regions, setRegions] = useState('')
  const [aduTypes, setAduTypes] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [showStickyCTA, setShowStickyCTA] = useState(false)
  const formRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setShowStickyCTA(!entry.isIntersecting && status !== 'success'),
      { threshold: 0.1 }
    )
    if (formRef.current) observer.observe(formRef.current)
    return () => observer.disconnect()
  }, [status])

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

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
          name, company, email, regions, adu_types: aduTypes,
        }),
      })
      if (res.ok) setStatus('success')
      else throw new Error()
    } catch { setStatus('error') }
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

      <main className="max-w-4xl mx-auto px-4 py-6 md:py-12 pb-24 md:pb-12">
        <div className="text-center mb-6 md:mb-10">
          <div className="inline-block bg-blue-900/30 border border-blue-500/30 rounded-full px-4 py-1 text-blue-400 text-sm font-medium mb-3 md:mb-4">
            For Builders &amp; Contractors
          </div>
          <h1 className="text-2xl md:text-4xl font-bold text-white mb-2 md:mb-3">
            Get Clustered ADU Leads By Town
          </h1>
          <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto">
            We group homeowners exploring ADUs by town. You get pre-qualified, geographically clustered leads &mdash; not scattered one-offs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {/* Form first on mobile */}
          <div className="order-1 md:order-2" ref={formRef}>
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 sm:p-6">
              <h2 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4">Join the builder network</h2>

              {status === 'success' ? (
                <div className="bg-emerald-900/30 border border-emerald-500/30 rounded-lg p-5 sm:p-6 text-center">
                  <div className="text-3xl mb-2">&#127881;</div>
                  <p className="text-emerald-400 font-bold text-lg mb-1">You&apos;re in!</p>
                  <p className="text-gray-400">We&apos;ll reach out when homeowner groups form in your service areas.</p>
                  <div className="mt-4 bg-gray-900/50 rounded-lg p-3 text-sm text-gray-400">
                    <p className="font-medium text-white mb-1">What happens next:</p>
                    <p>Within 48 hours, we&apos;ll email you a brief questionnaire about your ADU experience, pricing structure, and capacity. Once verified, you&apos;ll be matched with homeowner groups in your region.</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-1.5">Your name</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="John Smith" className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-3 sm:py-2.5 text-white text-base sm:text-sm placeholder-gray-500 focus:border-blue-500 focus:outline-none min-h-[48px]" />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1.5">Company</label>
                    <input type="text" value={company} onChange={e => setCompany(e.target.value)} placeholder="ABC Builders" className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-3 sm:py-2.5 text-white text-base sm:text-sm placeholder-gray-500 focus:border-blue-500 focus:outline-none min-h-[48px]" />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1.5">Email</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-3 sm:py-2.5 text-white text-base sm:text-sm placeholder-gray-500 focus:border-blue-500 focus:outline-none min-h-[48px]" />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1.5">Regions you serve</label>
                    <select value={regions} onChange={e => setRegions(e.target.value)} className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-3 sm:py-2.5 text-white text-base sm:text-sm focus:border-blue-500 focus:outline-none min-h-[48px]">
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
                    <label className="block text-gray-400 text-sm mb-1.5">ADU types you build</label>
                    <select value={aduTypes} onChange={e => setAduTypes(e.target.value)} className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-3 sm:py-2.5 text-white text-base sm:text-sm focus:border-blue-500 focus:outline-none min-h-[48px]">
                      <option value="">Select...</option>
                      <option value="detached">Detached (backyard cottages)</option>
                      <option value="conversion">Conversions (basement, garage)</option>
                      <option value="modular">Modular / prefab</option>
                      <option value="all">All types</option>
                    </select>
                  </div>
                  <button onClick={handleSubmit} disabled={!name || !company || !email || status === 'loading'} className="w-full py-3.5 sm:py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-lg font-medium transition-colors text-base sm:text-sm min-h-[48px]">
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

          {/* Value props — second on mobile */}
          <div className="order-2 md:order-1">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
              <h2 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4">Why builders partner with us</h2>
              <div className="space-y-4">
                {[
                  { icon: '📍', title: 'Clustered by town', desc: '5+ homeowners in the same town means shared permitting, bulk materials, efficient crew scheduling.' },
                  { icon: '💰', title: 'Better margins on volume', desc: 'Price 15-20% lower per unit while making more per project cycle. Group deals beat one-offs.' },
                  { icon: '📊', title: 'Real demand data', desc: 'See which towns have active interest, what types of ADUs people want, and where to focus your pipeline.' },
                  { icon: '🏗️', title: 'Pre-qualified leads', desc: "Every signup includes town, ADU type preference, and role. No cold calls — these people raised their hand." },
                ].map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-10 h-10 bg-emerald-900/50 border border-emerald-500/30 rounded-lg flex items-center justify-center text-lg shrink-0">{item.icon}</div>
                    <div>
                      <p className="text-white font-medium">{item.title}</p>
                      <p className="text-gray-400 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Outcome math */}
            <div className="bg-gradient-to-r from-emerald-900/30 to-blue-900/30 border border-emerald-500/20 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
              <h3 className="text-white font-bold mb-3">The math on clustered leads</h3>
              <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4">
                <div className="bg-gray-900/50 rounded-lg p-2.5 sm:p-3 text-center">
                  <div className="text-xl sm:text-2xl font-bold text-emerald-400">1,224</div>
                  <div className="text-gray-500 text-[10px] sm:text-xs">ADUs approved in MA</div>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-2.5 sm:p-3 text-center">
                  <div className="text-xl sm:text-2xl font-bold text-white">217</div>
                  <div className="text-gray-500 text-[10px] sm:text-xs">Towns tracked</div>
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-4">Massachusetts&apos; by-right ADU law is driving permit volume across the state. Homeowners are ready &mdash; they just need a builder they trust at a price that works.</p>

              <div className="bg-gray-900/70 rounded-lg p-3 sm:p-4 border border-gray-700/50">
                <div className="text-emerald-400 text-xs uppercase tracking-wider mb-2 font-medium">Example: 5 detached ADUs in one town</div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between gap-2">
                    <span className="text-gray-400">Typical one-off price</span>
                    <span className="text-white text-right">$300K × 5 = $1.5M</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-gray-400">Group price (−15%)</span>
                    <span className="text-white text-right">$255K × 5 = $1.275M</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-gray-400">Your cost savings</span>
                    <span className="text-emerald-400 text-right">−$150K+ overhead</span>
                  </div>
                  <div className="flex justify-between gap-2 border-t border-gray-700 pt-2 mt-2">
                    <span className="text-gray-300 font-medium">Net margin improvement</span>
                    <span className="text-emerald-400 font-bold text-right">+$75K+</span>
                  </div>
                </div>
                <p className="text-gray-500 text-xs mt-3">
                  Savings from: shared permit template (~$5K), bulk materials (~8-12%), reduced crew travel (~$15K/project), shared design fees.
                </p>
              </div>
            </div>

            {/* Screening criteria */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 sm:p-5">
              <h3 className="text-white font-medium text-sm mb-2">Our builder screening criteria</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-3">
                We vet builders before connecting them with homeowner groups:
              </p>
              <div className="space-y-2 text-sm">
                {[
                  "Active MA contractor's license + current insurance",
                  '3+ completed ADU projects with verifiable references',
                  'Willingness to provide itemized, transparent group pricing',
                  'No unresolved BBB complaints or active legal disputes',
                ].map((text, i) => (
                  <div key={i} className="flex gap-2.5 items-start min-h-[32px]">
                    <span className="text-emerald-400 mt-0.5">✓</span>
                    <span className="text-gray-400">{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-8 md:mt-10">
          <h2 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4">Builder FAQs</h2>
          <div className="bg-gray-800 border border-gray-700 rounded-xl px-4 sm:px-6">
            <FAQItem question="Is there a cost to join the builder network?" answer="Joining the network is free. When a group deal closes, we earn a small referral fee — typically built into the group discount so homeowners still save 15-20%. No upfront fees, no monthly subscriptions." />
            <FAQItem question="How are leads distributed?" answer="When a town reaches 5+ interested homeowners, we match the group with 1-2 builders who serve that region and build the requested ADU types. We don't blast leads to every builder — we curate matches so you get relevant, high-intent groups." />
            <FAQItem question="What does the homeowner group expect?" answer="Groups expect a transparent, itemized proposal for their ADU projects at a group rate. You present to the group (virtually or in person), and each homeowner decides individually. There's no pressure to accept all projects in a group — you can set your own capacity limits." />
            <FAQItem question="How does pricing work for group deals?" answer="You set your own pricing. We recommend 15-20% below your standard one-off rate, which is typically achievable through shared permits, bulk materials, and crew efficiency. Homeowners understand they're getting a volume discount, not a cut-rate job." />
            <FAQItem question="What if I only build in specific towns?" answer="That's fine — you'll only be matched with groups in your service area. We ask for your regions during signup and only send relevant leads." />
            <FAQItem question="Can I see demand data before signing up?" answer="Yes — our dashboard (adupulse.com) shows permit activity by town, and our leaderboard ranks towns by ADU volume. This gives you a sense of where demand is strongest before you commit." />
            <FAQItem question="Is there a conflict of interest?" answer="We earn a small referral fee when a group deal closes — it's built into the group discount so homeowners still save 15-20%. That means our incentive is aligned: we only succeed when homeowners get matched with quality builders at fair prices. If homeowners have bad experiences, they stop using the platform — so vetting builders carefully is in everyone's interest." />
          </div>
        </div>
      </main>

      {/* Sticky bottom CTA — mobile only */}
      {showStickyCTA && status !== 'success' && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-t border-gray-700 px-4 py-3 z-50">
          <button
            onClick={scrollToForm}
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium text-base min-h-[48px] shadow-lg shadow-emerald-600/20"
          >
            Join Builder Network →
          </button>
        </div>
      )}

      <footer className="border-t border-gray-800 mt-12">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 text-xs text-gray-500">
            <div>&copy; 2026 ADU Pulse</div>
            <div className="flex gap-4">
              <Link href="/" className="hover:text-white min-h-[44px] flex items-center">Home</Link>
              <Link href="/club" className="hover:text-white min-h-[44px] flex items-center">Join Club</Link>
              <Link href="/blog" className="hover:text-white min-h-[44px] flex items-center">Blog</Link>
              <Link href="/estimate" className="hover:text-white min-h-[44px] flex items-center">Estimator</Link>
              <Link href="/methodology" className="hover:text-white min-h-[44px] flex items-center">Methodology</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
