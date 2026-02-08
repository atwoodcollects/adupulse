'use client'

import { useState } from 'react'
import Link from 'next/link'
import TownNav from '@/components/TownNav'

const towns = [
  'Andover', 'Boston', 'Duxbury', 'Falmouth', 'Lexington', 'Lowell', 'Milton',
  'Nantucket', 'Needham', 'Newton', 'Plymouth', 'Revere', 'Somerville', 'Sudbury',
  'Other'
]

type Answers = {
  role: string
  homeowner: string
  town: string
  aduType: string
  goal: string
  timeline: string
  budget: string
}

const defaultAnswers: Answers = {
  role: '',
  homeowner: '',
  town: '',
  aduType: '',
  goal: '',
  timeline: '',
  budget: '',
}

export default function QuizPage() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Answers>(defaultAnswers)
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const setAnswer = (key: keyof Answers, value: string) => {
    setAnswers(prev => ({ ...prev, [key]: value }))
    setTimeout(() => setStep(s => s + 1), 300)
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await fetch('https://formspree.io/f/xzdvvzyr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          source: 'quiz',
          ...answers,
        })
      })
      setSubmitted(true)
    } catch {
      setSubmitted(true)
    }
    setSubmitting(false)
  }

  const totalSteps = 7

  const getCostRange = () => {
    if (answers.aduType === 'Detached cottage') return { min: 150000, max: 400000, avg: 275000 }
    if (answers.aduType === 'Attached addition') return { min: 100000, max: 300000, avg: 200000 }
    if (answers.aduType === 'Basement/garage conversion') return { min: 80000, max: 200000, avg: 140000 }
    return { min: 80000, max: 400000, avg: 200000 }
  }

  const getScenario = () => {
    if (answers.role === 'Grandparent / parent' && answers.goal === 'Be closer to family') {
      return {
        title: 'The Grandparent ADU',
        description: 'You want to be closer to the people you love. An ADU lets you live independently — steps from your grandkids, not a three-hour drive away.',
        icon: '🏡',
        tips: [
          'Build on your lot and let family use the main house — or build on their lot and have your own space when visiting.',
          'Massachusetts offers no-interest financing for homeowners over 60 building an ADU.',
          'An ADU avoids assisted living ($72K/year in MA) and keeps you connected to family.',
        ],
      }
    }
    if (answers.goal === 'Aging in place / caregiver suite') {
      return {
        title: 'The Caregiver Suite',
        description: 'An ADU gives you a private, on-site space for a family caregiver or aide — delaying or avoiding assisted living entirely.',
        icon: '🏥',
        tips: [
          'Assisted living in MA averages $6,000/month ($72,000/year). An ADU pays for itself in 2–4 years.',
          'Design with accessibility in mind: single-floor layout, wide doorways, walk-in shower.',
          'The state offers no-interest financing specifically for ADUs serving people with disabilities or those over 60.',
        ],
      }
    }
    if (answers.goal === 'Rental income') {
      return {
        title: 'The Income ADU',
        description: 'An ADU on your property can generate $1,500–$3,000/month in rental income, helping offset your mortgage or fund retirement.',
        icon: '💰',
        tips: [
          'A detached cottage commands the highest rents. Basement conversions have the fastest payback period.',
          "Check your town's ADU rules — some require owner-occupancy in one of the units.",
          'Even modest ADUs in Greater Boston rent for $1,800+/month.',
        ],
      }
    }
    if (answers.goal === 'Housing for adult child') {
      return {
        title: 'The Family Housing ADU',
        description: "Your adult child needs affordable housing — and you have the lot. An ADU keeps family close while giving everyone their own space.",
        icon: '👨‍👩‍👧',
        tips: [
          'This is the most common ADU use case in Massachusetts right now.',
          'A parent can fund the build using home equity (HELOC) while the adult child lives there.',
          'ADUs under 900 sq ft are by-right — no special permit needed.',
        ],
      }
    }
    return {
      title: 'Your ADU Path',
      description: "Based on your answers, here's what an ADU project could look like for you.",
      icon: '🏠',
      tips: [
        'ADUs under 900 sq ft can be built by right in any Massachusetts single-family zone.',
        'The state estimates 8,000–10,000 ADUs will be built over the next five years.',
        'Group buying through the ADU Club can save 15–20% on construction costs.',
      ],
    }
  }

  const getTownSlug = () => {
    const slug = answers.town.toLowerCase().replace(/\s+/g, '-')
    const validTowns = ['andover', 'boston', 'duxbury', 'falmouth', 'lexington', 'milton', 'needham', 'newton', 'plymouth', 'revere', 'sudbury']
    return validTowns.includes(slug) ? `/${slug}` : '/'
  }

  const questions = [
    {
      key: 'role' as keyof Answers,
      question: 'Which best describes you?',
      subtitle: 'This helps us tailor the results to your situation.',
      options: [
        { label: 'Grandparent / parent', icon: '👴' },
        { label: 'Adult child', icon: '👨‍👩‍👧' },
        { label: 'Homeowner exploring options', icon: '🏠' },
        { label: 'Builder / contractor', icon: '🔨' },
      ],
    },
    {
      key: 'homeowner' as keyof Answers,
      question: 'Do you currently own a home in Massachusetts?',
      subtitle: 'ADUs can be built on owner-occupied single-family lots.',
      options: [
        { label: 'Yes, I own', icon: '✅' },
        { label: 'No, but my parent/child does', icon: '👪' },
        { label: 'No — just exploring', icon: '🔍' },
      ],
    },
    {
      key: 'town' as keyof Answers,
      question: 'Which town are you considering?',
      subtitle: 'We track permits and approval rates for 217 MA towns.',
      options: [],
      isTownPicker: true,
    },
    {
      key: 'aduType' as keyof Answers,
      question: 'What type of ADU are you thinking about?',
      subtitle: "Not sure yet? That's fine — pick what sounds most appealing.",
      options: [
        { label: 'Detached cottage', icon: '🏡' },
        { label: 'Attached addition', icon: '🏗️' },
        { label: 'Basement/garage conversion', icon: '🔧' },
        { label: 'Not sure yet', icon: '🤷' },
      ],
    },
    {
      key: 'goal' as keyof Answers,
      question: "What's the main goal?",
      subtitle: 'Pick the one that resonates most.',
      options: [
        { label: 'Be closer to family', icon: '❤️' },
        { label: 'Aging in place / caregiver suite', icon: '🏥' },
        { label: 'Rental income', icon: '💰' },
        { label: 'Housing for adult child', icon: '🏠' },
      ],
    },
    {
      key: 'timeline' as keyof Answers,
      question: 'When are you thinking of building?',
      subtitle: 'Even early-stage exploring is valuable.',
      options: [
        { label: 'As soon as possible', icon: '🚀' },
        { label: 'Within 6 months', icon: '📅' },
        { label: 'Within a year', icon: '📆' },
        { label: 'Just exploring for now', icon: '💡' },
      ],
    },
    {
      key: 'budget' as keyof Answers,
      question: "What's your rough budget range?",
      subtitle: 'This helps us point you to the right resources. Costs vary widely by type and town.',
      options: [
        { label: 'Under $150K', icon: '💵' },
        { label: '$150K – $250K', icon: '💵' },
        { label: '$250K – $400K', icon: '💵' },
        { label: 'Not sure yet', icon: '🤷' },
      ],
    },
  ]

  const renderQuestion = () => {
    if (step >= totalSteps) return null
    const q = questions[step]

    if (q.isTownPicker) {
      return (
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{q.question}</h2>
          <p className="text-gray-400 mb-8">{q.subtitle}</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {towns.map(town => (
              <button
                key={town}
                onClick={() => setAnswer('town', town)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  answers.town === town
                    ? 'border-emerald-400 bg-emerald-400/10 text-white'
                    : 'border-gray-700 bg-gray-800/50 text-gray-300 hover:border-gray-500 hover:bg-gray-800'
                }`}
              >
                <span className="text-sm font-medium">{town}</span>
              </button>
            ))}
          </div>
        </div>
      )
    }

    return (
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{q.question}</h2>
        <p className="text-gray-400 mb-8">{q.subtitle}</p>
        <div className="space-y-3">
          {q.options.map(opt => (
            <button
              key={opt.label}
              onClick={() => setAnswer(q.key, opt.label)}
              className={`w-full p-4 rounded-xl border text-left transition-all flex items-center gap-4 ${
                answers[q.key] === opt.label
                  ? 'border-emerald-400 bg-emerald-400/10 text-white'
                  : 'border-gray-700 bg-gray-800/50 text-gray-300 hover:border-gray-500 hover:bg-gray-800'
              }`}
            >
              <span className="text-2xl">{opt.icon}</span>
              <span className="text-base font-medium">{opt.label}</span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  const renderResults = () => {
    const scenario = getScenario()
    const costs = getCostRange()
    const assistedLivingAnnual = 72000
    const savings5yr = (assistedLivingAnnual * 5) - costs.avg
    const townLink = getTownSlug()

    return (
      <div>
        <div className="text-center mb-8">
          <span className="text-5xl mb-4 block">{scenario.icon}</span>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">{scenario.title}</h2>
          <p className="text-gray-300 text-lg max-w-xl mx-auto">{scenario.description}</p>
        </div>

        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 mb-6">
          <h3 className="text-lg font-bold text-white mb-4">Your estimated cost range</h3>
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-400">{answers.aduType || 'ADU'}</span>
            <span className="text-white font-bold text-lg">
              ${costs.min.toLocaleString()} – ${costs.max.toLocaleString()}
            </span>
          </div>
          {(answers.goal === 'Be closer to family' || answers.goal === 'Aging in place / caregiver suite') && (
            <div className="mt-4 pt-4 border-t border-gray-700">
              <div className="flex items-center justify-between mb-1">
                <span className="text-gray-400">vs. 5 years of assisted living</span>
                <span className="text-red-400 font-bold">${(assistedLivingAnnual * 5).toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Potential 5-year savings</span>
                <span className="text-emerald-400 font-bold text-lg">${savings5yr > 0 ? savings5yr.toLocaleString() : '—'}</span>
              </div>
              <p className="text-gray-500 text-xs mt-2">Based on MA average assisted living cost of $6,000/month.</p>
            </div>
          )}
        </div>

        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 mb-6">
          <h3 className="text-lg font-bold text-white mb-4">What to know</h3>
          <div className="space-y-3">
            {scenario.tips.map((tip, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-400/20 text-emerald-400 flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">
                  {i + 1}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-blue-500/30 rounded-xl p-6 mb-6">
          <h3 className="text-lg font-bold text-white mb-4">Your next steps</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Link href={townLink} className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-gray-500 transition-colors">
              <span className="text-lg">📊</span>
              <div>
                <div className="text-white text-sm font-medium">Check {answers.town || 'your town'}</div>
                <div className="text-gray-500 text-xs">See permits & approval rates</div>
              </div>
            </Link>
            <Link href="/estimate" className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-gray-500 transition-colors">
              <span className="text-lg">🧮</span>
              <div>
                <div className="text-white text-sm font-medium">Cost estimator</div>
                <div className="text-gray-500 text-xs">Get a detailed breakdown</div>
              </div>
            </Link>
            <Link href="/club" className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-gray-500 transition-colors">
              <span className="text-lg">🤝</span>
              <div>
                <div className="text-white text-sm font-medium">Join ADU Club</div>
                <div className="text-gray-500 text-xs">Save 15–20% with group rates</div>
              </div>
            </Link>
            <Link href="/blog/grandparent-adu-massachusetts" className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-gray-500 transition-colors">
              <span className="text-lg">📖</span>
              <div>
                <div className="text-white text-sm font-medium">Read the guide</div>
                <div className="text-gray-500 text-xs">The Grandparent ADU</div>
              </div>
            </Link>
          </div>
        </div>

        {!submitted ? (
          <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-2">Get your personalized results</h3>
            <p className="text-gray-400 text-sm mb-4">
              We&apos;ll send your ADU plan summary and notify you when builders are available in {answers.town || 'your town'}.
            </p>
            <form onSubmit={handleEmailSubmit} className="flex gap-3">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@email.com"
                required
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:border-emerald-400"
              />
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium disabled:opacity-50 whitespace-nowrap"
              >
                {submitting ? 'Sending...' : 'Send my plan'}
              </button>
            </form>
            <p className="text-gray-600 text-xs mt-2">No spam. We only reach out when there&apos;s something relevant to share.</p>
          </div>
        ) : (
          <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-xl p-6 text-center">
            <span className="text-3xl mb-2 block">✅</span>
            <p className="text-white font-medium">You&apos;re in! We&apos;ll be in touch when builders are available in {answers.town || 'your area'}.</p>
          </div>
        )}

        <div className="text-center mt-8">
          <button
            onClick={() => { setStep(0); setAnswers(defaultAnswers); setSubmitted(false); setEmail('') }}
            className="text-gray-500 hover:text-white text-sm underline"
          >
            Start over
          </button>
        </div>
      </div>
    )
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
            <TownNav current="Quiz" />
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 md:py-12">
        {step < totalSteps && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 text-sm">Question {step + 1} of {totalSteps}</span>
              {step > 0 && (
                <button
                  onClick={() => setStep(s => s - 1)}
                  className="text-gray-500 hover:text-white text-sm"
                >
                  ← Back
                </button>
              )}
            </div>
            <div className="w-full bg-gray-800 rounded-full h-1.5">
              <div
                className="bg-emerald-400 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        )}

        {step < totalSteps ? renderQuestion() : renderResults()}
      </main>

      <footer className="border-t border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 text-xs text-gray-500">
            <div>© 2026 ADU Pulse</div>
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
