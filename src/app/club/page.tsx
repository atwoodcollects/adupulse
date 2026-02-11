'use client'

import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'

const towns = [
  'Acton','Andover','Arlington','Barnstable','Bedford','Beverly','Boston','Braintree',
  'Brookline','Burlington','Cambridge','Canton','Chelmsford','Cohasset','Concord',
  'Danvers','Dedham','Duxbury','Everett','Falmouth','Framingham','Gardner','Hingham',
  'Lexington','Malden','Marshfield','Medford','Melrose','Milton','Natick','Needham',
  'Newton','Norwell','Norwood','Peabody','Plymouth','Quincy','Revere','Salem',
  'Scituate','Sharon','Somerville','Stoneham','Sudbury','Swampscott','Wakefield',
  'Waltham','Watertown','Wayland','Wellesley','Weymouth','Winchester','Woburn'
]

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
  const [town, setTown] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('')
  const [interestType, setInterestType] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [showStickyCTA, setShowStickyCTA] = useState(false)
  const formRef = useRef<HTMLDivElement>(null)

  const isFormComplete = town && email && role

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
        body: JSON.stringify({ town, email, role, interestType, type: 'homeowner' }),
      })
      setStatus(res.ok ? 'success' : 'error')
    } catch { setStatus('error') }
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <NavBar current="Club" />

      <main className="max-w-5xl mx-auto px-4 py-6 md:py-12 pb-24 md:pb-12">
        {/* ─── HERO ─── */}
        <section className="text-center mb-8 md:mb-12">
          <div className="inline-block bg-emerald-900/30 border border-emerald-500/30 rounded-full px-4 py-1 text-emerald-400 text-sm font-medium mb-4">ADU Buyers Club</div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 leading-tight">
            Build Your ADU for<br className="hidden sm:block" />
            <span className="text-emerald-400">15-20% Less</span>
          </h1>
          <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto mb-6">
            When enough homeowners in the same town want ADUs, builders offer group pricing. Same quality, lower cost — because clustered projects are more efficient.
          </p>
          <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto mb-6">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-3 text-center">
              <div className="text-xl font-bold text-emerald-400">15-20%</div>
              <div className="text-gray-500 text-[10px]">Savings</div>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-3 text-center">
              <div className="text-xl font-bold text-white">$30-60K</div>
              <div className="text-gray-500 text-[10px]">Typical</div>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-3 text-center">
              <div className="text-xl font-bold text-white">$0</div>
              <div className="text-gray-500 text-[10px]">Cost to join</div>
            </div>
          </div>
          <button onClick={scrollToForm}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium min-h-[48px]">
            Express Interest — It&apos;s Free
          </button>
        </section>

        {/* ─── HOW IT WORKS ─── */}
        <section className="mb-10">
          <h2 className="text-lg font-bold text-white mb-4 text-center">How It Works</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { n: '1', icon: '✋', title: 'Express interest', desc: 'Pick your town and tell us what kind of ADU you want. No commitment, no cost.' },
              { n: '2', icon: '📊', title: 'We aggregate demand', desc: 'When 5+ homeowners in a town are interested, we reach out to vetted builders for group pricing.' },
              { n: '3', icon: '💰', title: 'Get group rates', desc: 'Builders offer 15-20% discounts for clustered projects. You decide if the proposal works for you.' },
            ].map(step => (
              <div key={step.n} className="bg-gray-800/50 border border-gray-700 rounded-xl p-5 text-center">
                <div className="text-3xl mb-2">{step.icon}</div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-xs">{step.n}</div>
                  <h3 className="text-white font-bold">{step.title}</h3>
                </div>
                <p className="text-gray-400 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── FORM + SIDEBAR ─── */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-10">
          {/* Form */}
          <div ref={formRef}>
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 sm:p-6">
              <h2 className="text-lg font-bold text-white mb-1">{status === 'success' ? "🎉 You're in!" : 'Express Interest'}</h2>
              {status === 'success' ? (
                <div>
                  <div className="bg-emerald-900/30 border border-emerald-500/30 rounded-lg p-5 text-center mb-4">
                    <p className="text-emerald-400 font-bold text-lg mb-1">Added to the {town} list!</p>
                    <p className="text-gray-400 text-sm">We&apos;ll reach out when there&apos;s enough interest in {town} to connect your group with a builder.</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex gap-2.5 items-center bg-gray-900/50 rounded-lg p-3 min-h-[44px]"><span className="text-emerald-400">✓</span><span className="text-gray-300 text-sm">Confirmation email on its way</span></div>
                    <div className="flex gap-2.5 items-center bg-gray-900/50 rounded-lg p-3 min-h-[44px]"><span className="text-gray-500">○</span><span className="text-gray-400 text-sm">We&apos;ll notify you as interest grows</span></div>
                    <div className="flex gap-2.5 items-center bg-gray-900/50 rounded-lg p-3 min-h-[44px]"><span className="text-gray-500">○</span><span className="text-gray-400 text-sm">Builder intro when group is ready</span></div>
                  </div>
                  <div className="mt-4 bg-blue-900/20 border border-blue-500/20 rounded-lg p-4 text-center">
                    <p className="text-white text-sm font-medium mb-2">Know someone else considering an ADU?</p>
                    <button onClick={() => {
                      const text = `I just signed up for group ADU pricing in ${town} through ADU Pulse. Worth checking out!`
                      if (typeof navigator !== 'undefined' && navigator.share) {
                        navigator.share({ title: `${town} ADU Group`, text, url: 'https://www.adupulse.com/club' })
                      } else if (typeof navigator !== 'undefined') {
                        navigator.clipboard.writeText(text + ' https://www.adupulse.com/club')
                      }
                    }} className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-lg font-medium min-h-[44px]">
                      📤 Share with a neighbor
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-gray-400 text-sm">No commitment — just let us know you&apos;re interested. We only email when there&apos;s a real update for your town.</p>
                  <div>
                    <label className="block text-gray-400 text-xs mb-1">Your town</label>
                    <select value={town} onChange={e => setTown(e.target.value)}
                      className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none min-h-[48px]">
                      <option value="">Select your town...</option>
                      {towns.map(t => <option key={t} value={t}>{t}</option>)}
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
                    <label className="block text-gray-400 text-xs mb-1">Type of ADU</label>
                    <select value={interestType} onChange={e => setInterestType(e.target.value)}
                      className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none min-h-[48px]">
                      <option value="">Select...</option>
                      <option value="detached">Detached (backyard cottage)</option>
                      <option value="conversion">Conversion (basement, garage)</option>
                      <option value="aging_in_place">Aging-in-place suite</option>
                      <option value="not_sure">Not sure yet</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs mb-1">Email</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com"
                      className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none min-h-[48px]" />
                  </div>
                  <button onClick={handleSubmit} disabled={!isFormComplete || status === 'loading'}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-lg font-medium transition-colors min-h-[48px]">
                    {status === 'loading' ? 'Submitting...' : 'Express Interest — Free'}
                  </button>
                  {status === 'error' && <p className="text-red-400 text-sm text-center">Something went wrong. Try again.</p>}
                  <p className="text-gray-600 text-xs text-center">No spam. We only email when there&apos;s a real update for your town.</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Why it works */}
            <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/20 rounded-xl p-5">
              <h3 className="text-white font-bold mb-3">Why Group Buying Works</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                Builders doing multiple ADUs in the same town price them 15-20% lower. Shared permits, bulk materials, and crew efficiency drive real savings — not corner-cutting.
              </p>
              <div className="space-y-2.5 text-sm">
                {[
                  { label: 'Shared permit templates', save: '~$5K' },
                  { label: 'Bulk materials', save: '8-12%' },
                  { label: 'Reduced crew travel', save: '~$15K/project' },
                  { label: 'Shared design fees', save: 'Split across group' },
                ].map((s, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <span className="text-gray-400">{s.label}</span>
                    <span className="text-emerald-400 font-medium">{s.save}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Vetted builders */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5">
              <h3 className="text-white font-medium mb-2">What does &ldquo;vetted builder&rdquo; mean?</h3>
              <div className="space-y-2 text-sm">
                {[
                  'Licensed and insured in Massachusetts',
                  '3+ completed ADU projects with references',
                  'Transparent, itemized group pricing',
                  'No unresolved BBB complaints',
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
              <h3 className="text-white font-bold mb-2">🏡 Building to be near family?</h3>
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
            <FAQItem question="Is there a cost to join?" answer="No. Expressing interest is completely free. There's no obligation to proceed with any builder, and you can unsubscribe at any time." />
            <FAQItem question="How many homeowners are needed for a group?" answer="It depends on the town and builder, but typically 5-10+ interested homeowners in the same area make group pricing viable. We'll let you know when your town reaches that point." />
            <FAQItem question="What's the typical timeline?" answer="It varies by town. Once there's enough interest, we connect the group with a builder who presents a proposal within 2-4 weeks. You then decide individually whether to proceed." />
            <FAQItem question="Am I committed to building if I sign up?" answer="Absolutely not. Expressing interest just means you'd like to hear about group pricing when it becomes available. Each homeowner decides individually." />
            <FAQItem question="Do builders pay ADU Pulse?" answer="Homeowners never pay. When a group deal closes, we earn a small referral fee from the builder — which is already built into the group discount. You still save 15-20% compared to going solo." />
            <FAQItem question="What if my town isn't listed?" answer="Select the closest town — we're constantly adding new ones. Or email nick@adupulse.com and we'll add your town to the list." />
          </div>
        </section>
      </main>

      {/* Mobile sticky CTA */}
      {showStickyCTA && status !== 'success' && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-t border-gray-700 px-4 py-3 z-40">
          <button onClick={scrollToForm}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium min-h-[48px] shadow-lg shadow-blue-600/20">
            Express Interest — It&apos;s Free →
          </button>
        </div>
      )}

      <Footer />
    </div>
  )
}
