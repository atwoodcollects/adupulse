'use client'

import Link from 'next/link'
import TownNav from '@/components/TownNav'
import { useState, useEffect, useRef } from 'react'
import { useTown } from '@/contexts/TownContext'

const towns = [
  'Andover', 'Arlington', 'Attleboro', 'Barnstable', 'Beverly', 'Billerica', 'Boston',
  'Brockton', 'Brookline', 'Cambridge', 'Chelmsford', 'Danvers', 'Dracut', 'Duxbury',
  'Everett', 'Fairhaven', 'Fall River', 'Falmouth', 'Framingham', 'Freetown', 'Gardner',
  'Harwich', 'Haverhill', 'Ipswich', 'Lawrence', 'Lexington', 'Lowell', 'Lynn', 'Malden',
  'Marshfield', 'Medford', 'Methuen', 'Middleborough', 'Milton', 'Nantucket', 'Needham',
  'Newton', 'Northampton', 'Peabody', 'Plymouth', 'Quincy', 'Randolph', 'Raynham',
  'Revere', 'Salem', 'Shrewsbury', 'Somerville', 'Sudbury', 'Taunton', 'Tisbury',
  'Wayland', 'Westport', 'Worcester',
]

// Simulated town interest data (will be replaced with real backend data)
const townInterest: Record<string, { count: number; threshold: number; recentActivity: string }> = {
  Plymouth: { count: 8, threshold: 10, recentActivity: '2 joined this week' },
  Milton: { count: 6, threshold: 10, recentActivity: '1 joined today' },
  Newton: { count: 11, threshold: 10, recentActivity: 'Builder outreach in progress' },
  Boston: { count: 14, threshold: 10, recentActivity: '3 joined this week' },
  Cambridge: { count: 4, threshold: 10, recentActivity: '1 joined this week' },
  Somerville: { count: 7, threshold: 10, recentActivity: '2 joined this week' },
  Brookline: { count: 3, threshold: 10, recentActivity: 'New group started' },
  Duxbury: { count: 2, threshold: 10, recentActivity: '1 joined recently' },
  Needham: { count: 5, threshold: 10, recentActivity: '1 joined this week' },
  Worcester: { count: 3, threshold: 10, recentActivity: 'New group started' },
  Quincy: { count: 4, threshold: 10, recentActivity: '1 joined recently' },
  Medford: { count: 6, threshold: 10, recentActivity: '1 joined today' },
}

const FORMSPREE_ID = 'mzdabkvb'

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-gray-700 last:border-0">
      <button onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center py-4 min-h-[48px] text-left">
        <span className="text-white text-sm font-medium pr-4">{question}</span>
        <span className="text-gray-500 text-lg shrink-0 w-8 h-8 flex items-center justify-center">{open ? '−' : '+'}</span>
      </button>
      {open && <div className="pb-4 text-gray-400 text-sm leading-relaxed">{answer}</div>}
    </div>
  )
}

function ProgressRing({ current, total, size = 80 }: { current: number; total: number; size?: number }) {
  const pct = Math.min((current / total) * 100, 100)
  const r = (size - 8) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#374151" strokeWidth="6" />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={pct >= 100 ? '#34d399' : '#3b82f6'} strokeWidth="6"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          className="transition-all duration-1000 ease-out" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-white font-bold text-lg">{current}</span>
      </div>
    </div>
  )
}

export default function ClubPage() {
  const { selectedTown, setSelectedTown } = useTown()
  const [email, setEmail] = useState('')
  const [town, setTown] = useState(selectedTown || '')
  const [interestType, setInterestType] = useState('')
  const [role, setRole] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [showStickyCTA, setShowStickyCTA] = useState(false)
  const formRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (selectedTown && !town) setTown(selectedTown)
  }, [selectedTown, town])

  const townData = town ? townInterest[town] || { count: 1, threshold: 10, recentActivity: 'New group' } : null
  const isFormComplete = email && town && interestType && role
  const remaining = townData ? Math.max(0, townData.threshold - townData.count) : null
  const isUnlocked = townData ? townData.count >= townData.threshold : false

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
    if (!isFormComplete) return
    setStatus('loading')
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email, town, interest_type: interestType, role,
          _subject: `ADU Club Signup: ${town}`,
        }),
      })
      if (res.ok) {
        setStatus('success')
        setSelectedTown(town)
      } else throw new Error()
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
            <TownNav current="Club" />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 md:py-12 pb-24 md:pb-12">
        {/* Hero */}
        <div className="text-center mb-6 md:mb-8">
          <div className="inline-block bg-emerald-900/30 border border-emerald-500/30 rounded-full px-4 py-1 text-emerald-400 text-sm font-medium mb-3">
            Group ADU Buying
          </div>
          <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">
            Join Your Town&apos;s ADU Group
          </h1>
          <p className="text-gray-400 text-base max-w-xl mx-auto">
            When enough homeowners sign up, we connect the group with vetted builders at 15-20% group rates.
          </p>
        </div>

        {/* Town Status — the "waiting room" experience */}
        {town && townData && status !== 'success' && (
          <div className={`rounded-xl p-5 sm:p-6 mb-6 border ${
            isUnlocked ? 'bg-emerald-900/20 border-emerald-500/30' : 'bg-blue-900/20 border-blue-500/30'
          }`}>
            <div className="flex items-center gap-5">
              <ProgressRing current={townData.count} total={townData.threshold} />
              <div className="flex-1">
                <h2 className="text-white font-bold text-lg">{town}</h2>
                {isUnlocked ? (
                  <>
                    <p className="text-emerald-400 font-medium">🎉 Group unlocked! Builder outreach in progress.</p>
                    <p className="text-gray-400 text-sm mt-1">
                      {townData.count} homeowners have joined. A vetted builder will present a group proposal soon.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-blue-400 text-sm font-medium">
                      {remaining} more homeowner{remaining !== 1 ? 's' : ''} needed to unlock group pricing
                    </p>
                    <p className="text-gray-500 text-xs mt-1">{townData.recentActivity}</p>
                  </>
                )}
              </div>
            </div>
            {/* Progress milestones */}
            {!isUnlocked && (
              <div className="mt-4 flex items-center gap-1">
                {Array.from({ length: townData.threshold }, (_, i) => (
                  <div key={i} className={`h-2 flex-1 rounded-full transition-all ${
                    i < townData.count ? 'bg-blue-500' : 'bg-gray-700'
                  }`} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Active town groups - social proof */}
        {status !== 'success' && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
            {Object.entries(townInterest)
              .sort(([,a], [,b]) => b.count - a.count)
              .slice(0, 4)
              .map(([name, data]) => (
                <button
                  key={name}
                  onClick={() => setTown(name)}
                  className={`text-left rounded-lg p-3 border transition-all min-h-[64px] ${
                    town === name
                      ? 'bg-blue-600/20 border-blue-500/50'
                      : 'bg-gray-800/50 border-gray-700 hover:bg-gray-700/50'
                  }`}
                >
                  <div className="text-white font-medium text-sm">{name}</div>
                  <div className="text-blue-400 text-xs font-medium">{data.count} interested</div>
                  <div className="text-gray-500 text-[10px]">{data.recentActivity}</div>
                </button>
              ))}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {/* Signup Form */}
          <div className="order-1" ref={formRef}>
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 sm:p-6">
              <h2 className="text-lg font-bold text-white mb-3">
                {status === 'success' ? '🎉 You\'re in!' : 'Join the group'}
              </h2>

              {status === 'success' ? (
                <div>
                  <div className="bg-emerald-900/30 border border-emerald-500/30 rounded-lg p-5 text-center mb-4">
                    <p className="text-emerald-400 font-bold text-lg mb-1">Welcome to the {town} group!</p>
                    {townData && (
                      <p className="text-gray-400 text-sm">
                        You&apos;re #{townData.count + 1} in {town}.
                        {remaining && remaining > 0
                          ? ` ${remaining - 1} more needed to unlock group pricing.`
                          : ' Builder outreach is in progress!'}
                      </p>
                    )}
                  </div>
                  {/* Post-signup status */}
                  <div className="space-y-2">
                    <div className="flex gap-2.5 items-center bg-gray-900/50 rounded-lg p-3 min-h-[44px]">
                      <span className="text-emerald-400">✓</span>
                      <span className="text-gray-300 text-sm">Confirmation email on its way</span>
                    </div>
                    <div className="flex gap-2.5 items-center bg-gray-900/50 rounded-lg p-3 min-h-[44px]">
                      <span className="text-gray-500">○</span>
                      <span className="text-gray-400 text-sm">Monthly group size updates</span>
                    </div>
                    <div className="flex gap-2.5 items-center bg-gray-900/50 rounded-lg p-3 min-h-[44px]">
                      <span className="text-gray-500">○</span>
                      <span className="text-gray-400 text-sm">Builder proposal when group fills</span>
                    </div>
                  </div>
                  {/* Share CTA */}
                  <div className="mt-4 bg-blue-900/20 border border-blue-500/20 rounded-lg p-4 text-center">
                    <p className="text-white text-sm font-medium mb-2">Help your group fill faster</p>
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => {
                          const text = `I just joined the ${town} ADU group on ADU Pulse. ${remaining && remaining > 0 ? `${remaining - 1} more needed!` : 'Group is almost full!'}`
                          if (navigator.share) {
                            navigator.share({ title: `${town} ADU Group`, text, url: 'https://www.adupulse.com/club' })
                          } else {
                            navigator.clipboard.writeText(text + ' https://www.adupulse.com/club')
                          }
                        }}
                        className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-lg font-medium min-h-[44px]"
                      >
                        📤 Share with neighbors
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block text-gray-400 text-sm mb-1.5">Your town</label>
                    <select value={town} onChange={e => setTown(e.target.value)}
                      className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-3 sm:py-2.5 text-white text-base sm:text-sm focus:border-blue-500 focus:outline-none min-h-[48px]">
                      <option value="">Select your town...</option>
                      {towns.map(t => (<option key={t} value={t}>{t}</option>))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1.5">I&apos;m a...</label>
                    <select value={role} onChange={e => setRole(e.target.value)}
                      className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-3 sm:py-2.5 text-white text-base sm:text-sm focus:border-blue-500 focus:outline-none min-h-[48px]">
                      <option value="">Select...</option>
                      <option value="homeowner">Homeowner considering an ADU</option>
                      <option value="grandparent">Grandparent / want to be near family</option>
                      <option value="adult_child">Adult child exploring ADU for parents</option>
                      <option value="builder">Builder / contractor</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1.5">Type of ADU</label>
                    <select value={interestType} onChange={e => setInterestType(e.target.value)}
                      className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-3 sm:py-2.5 text-white text-base sm:text-sm focus:border-blue-500 focus:outline-none min-h-[48px]">
                      <option value="">Select...</option>
                      <option value="detached">Detached (backyard cottage)</option>
                      <option value="conversion">Conversion (basement, garage)</option>
                      <option value="aging_in_place">Aging-in-place suite</option>
                      <option value="not_sure">Not sure yet</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1.5">Email</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com"
                      className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-3 sm:py-2.5 text-white text-base sm:text-sm placeholder-gray-500 focus:border-blue-500 focus:outline-none min-h-[48px]" />
                  </div>
                  <button onClick={handleSubmit} disabled={!isFormComplete || status === 'loading'}
                    className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-lg font-medium transition-colors text-base min-h-[48px]">
                    {status === 'loading' ? 'Joining...' : town && townData ? `Join ${town} Group (${townData.count} members)` : 'Join the Group'}
                  </button>
                  {status === 'error' && <p className="text-red-400 text-sm text-center">Something went wrong. Try again.</p>}
                  <p className="text-gray-600 text-xs text-center">No spam. We only email when your group grows or a builder deal is available.</p>
                </div>
              )}
            </div>
          </div>

          {/* Right column */}
          <div className="order-2">
            {/* How it works */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 sm:p-6">
              <h2 className="text-lg font-bold text-white mb-4">How it works</h2>
              <div className="space-y-4">
                {[
                  { num: '1', title: 'Join your town', desc: 'Pick your town and tell us about your ADU interest.', active: true },
                  { num: '2', title: 'Watch your group grow', desc: 'See real-time progress toward the threshold. Share to grow faster.', active: false },
                  { num: '3', title: 'Unlock group pricing', desc: 'At 10+ homeowners, we connect the group with vetted builders offering 15-20% discounts.', active: false },
                ].map(step => (
                  <div key={step.num} className="flex gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 ${step.active ? 'bg-blue-600' : 'bg-gray-700'}`}>{step.num}</div>
                    <div>
                      <p className="text-white font-medium">{step.title}</p>
                      <p className="text-gray-400 text-sm">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Why it works stats */}
            <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/20 rounded-xl p-4 sm:p-6 mt-4">
              <h3 className="text-white font-bold mb-2">Why group buying works</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                Builders doing 5+ ADUs in the same town price them 15-20% lower. Shared permits, bulk materials, and crew efficiency drive savings.
              </p>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-gray-900/50 rounded-lg p-2.5">
                  <div className="text-lg font-bold text-emerald-400">15-20%</div>
                  <div className="text-gray-500 text-[10px]">Group savings</div>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-2.5">
                  <div className="text-lg font-bold text-white">10+</div>
                  <div className="text-gray-500 text-[10px]">Homes to unlock</div>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-2.5">
                  <div className="text-lg font-bold text-white">$30-60K</div>
                  <div className="text-gray-500 text-[10px]">Avg. saved</div>
                </div>
              </div>
            </div>

            {/* Vetted builder */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 mt-4">
              <h3 className="text-white font-medium text-sm mb-2">What does &ldquo;vetted builder&rdquo; mean?</h3>
              <div className="space-y-2 text-sm">
                {[
                  'Licensed and insured in Massachusetts',
                  '3+ completed ADU projects with references',
                  'Transparent, itemized group pricing',
                  'No unresolved BBB complaints',
                ].map((text, i) => (
                  <div key={i} className="flex gap-2.5 items-start min-h-[32px]">
                    <span className="text-emerald-400 mt-0.5">✓</span>
                    <span className="text-gray-400">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Grandparent angle */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 mt-4">
              <h3 className="text-white font-bold mb-2">Building to be near family?</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-3">
                Many members are grandparents exploring ADUs to live closer to grandchildren. MA&apos;s by-right law makes this easier than ever.
              </p>
              <Link href="/blog/grandparent-adu-massachusetts" className="text-blue-400 text-sm hover:underline inline-flex items-center min-h-[44px]">
                Read: The Grandparent ADU →
              </Link>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-8">
          <h2 className="text-lg font-bold text-white mb-3">Frequently Asked Questions</h2>
          <div className="bg-gray-800 border border-gray-700 rounded-xl px-4 sm:px-6">
            <FAQItem question="Is there a cost to join?" answer="No. Signing up is completely free. There's no obligation to proceed with any builder, and you can unsubscribe at any time." />
            <FAQItem question="How many homeowners are needed?" answer="We look for 10+ interested homeowners in the same town before connecting the group with a builder. The progress bar shows how close your town is." />
            <FAQItem question="What's the typical timeline?" answer="Some towns reach the threshold within 2-3 months, others take longer. Share the page with neighbors to speed it up! Once formed, the builder presents a proposal within 2-4 weeks." />
            <FAQItem question="Am I committed to building if I sign up?" answer="Absolutely not. Signing up just means you're interested. When a builder presents a proposal, each homeowner decides individually." />
            <FAQItem question="Can I see my town's progress?" answer="Yes! After signing up, the progress bar shows how many homeowners are in your group and how many more are needed to unlock builder pricing." />
            <FAQItem question="Do builders pay ADU Pulse?" answer="No. Builders don't pay for leads. We aggregate demand so builders can offer volume pricing. Homeowner access will always be free." />
            <FAQItem question="What if my town isn't listed?" answer="Select the closest town — we're constantly adding new ones. Or use the estimator page to request your town be added." />
          </div>
        </div>
      </main>

      {/* Sticky bottom CTA — mobile only */}
      {showStickyCTA && status !== 'success' && (
        <div className="md:hidden fixed bottom-16 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-t border-gray-700 px-4 py-3 z-50">
          <button onClick={scrollToForm}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium text-base min-h-[48px] shadow-lg shadow-blue-600/20">
            {town && townData ? `Join ${town} (${townData.count} members) →` : 'Join Your Town\'s Group →'}
          </button>
        </div>
      )}

      <footer className="border-t border-gray-800 mt-12">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 text-xs text-gray-500">
            <div>&copy; 2026 ADU Pulse</div>
            <div className="flex gap-4">
              <Link href="/" className="hover:text-white min-h-[44px] flex items-center">Home</Link>
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
