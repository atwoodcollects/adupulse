'use client'

import Link from 'next/link'
import TownNav from '@/components/TownNav'
import { useTown } from '@/contexts/TownContext'

const steps = [
  {
    id: 'feasibility',
    icon: '✅',
    title: 'Check feasibility',
    desc: 'Can I build an ADU on my property?',
    action: '/quiz',
    actionLabel: 'Take the ADU Quiz',
    time: '2 min',
    details: [
      'Your lot size & zoning',
      'By-right eligibility',
      'ADU type recommendations',
    ],
  },
  {
    id: 'cost',
    icon: '💰',
    title: 'Estimate cost & ROI',
    desc: 'What will it cost and is it worth it?',
    action: '/estimate',
    actionLabel: 'Open Cost Estimator',
    time: '3 min',
    details: [
      'Construction cost range',
      'Rental income projections',
      'Payback timeline',
    ],
  },
  {
    id: 'compare',
    icon: '📊',
    title: 'Compare my town',
    desc: 'How does my town stack up?',
    action: '/leaderboard',
    actionLabel: 'View Leaderboard',
    time: '1 min',
    details: [
      'Approval rates vs. neighbors',
      'Permit volume trends',
      'Town scorecards',
    ],
  },
  {
    id: 'builder',
    icon: '🏗️',
    title: 'Find a builder',
    desc: 'Connect with vetted ADU builders',
    action: '/club',
    actionLabel: 'Join Your Town Group',
    time: '1 min',
    details: [
      'Group pricing (15-20% savings)',
      'Vetted, licensed builders',
      'No obligation to proceed',
    ],
  },
]

export default function NextStepsPage() {
  const { selectedTown } = useTown()

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-lg md:text-xl font-bold text-white tracking-tight">ADU Pulse</span>
            </Link>
            <TownNav current="Next Steps" />
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 md:py-10">
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            {selectedTown ? `Your ADU Journey in ${selectedTown}` : 'What are you trying to do?'}
          </h1>
          <p className="text-gray-400">
            {selectedTown
              ? 'Here\'s your personalized next step based on where you are.'
              : 'Pick your starting point — we\'ll guide you from there.'}
          </p>
        </div>

        <div className="space-y-3">
          {steps.map((step, i) => (
            <Link
              key={step.id}
              href={step.action}
              className="block bg-gray-800 border border-gray-700 rounded-xl p-4 sm:p-5 hover:bg-gray-750 hover:border-gray-600 active:bg-gray-700 transition-all group"
            >
              <div className="flex items-start gap-4">
                {/* Step number + icon */}
                <div className="flex flex-col items-center shrink-0">
                  <div className="w-10 h-10 bg-blue-600/20 border border-blue-500/30 rounded-full flex items-center justify-center text-xl">
                    {step.icon}
                  </div>
                  {i < steps.length - 1 && (
                    <div className="w-px h-6 bg-gray-700 mt-2 hidden sm:block" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h2 className="text-white font-semibold">{step.title}</h2>
                    <span className="text-gray-500 text-xs shrink-0">{step.time}</span>
                  </div>
                  <p className="text-gray-400 text-sm mb-3">{step.desc}</p>

                  {/* What you'll learn */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {step.details.map((d, j) => (
                      <span key={j} className="bg-gray-700/50 text-gray-400 text-xs px-2 py-1 rounded">
                        {d}
                      </span>
                    ))}
                  </div>

                  {/* CTA */}
                  <div className="flex items-center gap-2 text-blue-400 text-sm font-medium group-hover:text-blue-300">
                    {step.actionLabel}
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Already started? */}
        {selectedTown && (
          <div className="mt-8 bg-emerald-900/20 border border-emerald-500/20 rounded-xl p-4 text-center">
            <p className="text-emerald-400 text-sm font-medium mb-1">You&apos;re exploring ADUs in {selectedTown}</p>
            <p className="text-gray-400 text-xs">Your progress is saved. Pick up where you left off anytime.</p>
          </div>
        )}
      </main>
    </div>
  )
}
