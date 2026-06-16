import Link from 'next/link'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'

const TRACKERS = [
  {
    title: 'Consistency tracker',
    meta: '28 communities',
    description: 'Local ADU bylaws and ordinances analyzed against M.G.L. c. 40A §3 and 760 CMR 71.00, incorporating Attorney General review outcomes.',
    stats: '62 inconsistent provisions · 26 AG disapprovals',
    href: '/compliance',
  },
  {
    title: 'Infrastructure tracker',
    meta: '15 communities',
    description: 'Where local Board of Health septic rules exceed the state Title 5 baseline, and how those provisions affect ADU feasibility.',
    stats: '10 exceed baseline · 2 designated barrier',
    href: '/infrastructure',
  },
  {
    title: 'Housing production',
    meta: 'Statewide',
    description: 'ADU permit activity since the February 2025 effective date, with per-capita comparisons across all 351 Massachusetts municipalities.',
    stats: 'EOHLC survey data · Updated quarterly',
    href: '/housing-production',
  },
  {
    title: 'Municipal responsiveness',
    meta: 'NEW',
    description: 'Non-emergency service request data from participating Commonwealth Connect municipalities, offering context on municipal capacity.',
    stats: '14 communities · 311 data layer',
    href: '/responsiveness',
    isNew: true,
  },
]

const FOOTER_LINKS = [
  { label: 'Methodology', href: '/methodology' },
  { label: 'About', href: '/blog' },
  { label: 'All 351 municipalities', href: '/housing-production' },
  { label: 'Contact', href: 'mailto:nick@adupulse.com' },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900">
      <NavBar current="Home" />

      <main className="px-4 sm:px-6 pt-12 sm:pt-16 pb-10">
        <div className="max-w-[620px] mx-auto">
          {/* Eyebrow */}
          <p className="font-mono text-[11px] sm:text-xs text-gray-500 uppercase tracking-[0.15em] mb-3">
            ADU Pulse · Massachusetts
          </p>

          {/* Headline */}
          <h1
            className="text-[28px] sm:text-[32px] font-medium text-white leading-[1.2] tracking-tight mb-4"
            style={{ maxWidth: 620 }}
          >
            Independent research on Massachusetts ADU policy.
          </h1>

          {/* Subhead */}
          <p
            className="text-[15px] sm:text-base text-gray-400 leading-[1.6] mb-10 sm:mb-12"
            style={{ maxWidth: 620 }}
          >
            ADU Pulse tracks how Massachusetts municipalities are implementing the state&apos;s
            2024 accessory dwelling unit law. We analyze local bylaws, infrastructure constraints,
            permit activity, and municipal service data — one community at a time.
          </p>

          {/* Tracker cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {TRACKERS.map(t => (
              <Link
                key={t.href}
                href={t.href}
                className="relative block p-4 sm:py-5 sm:px-6 border border-gray-800 rounded-[10px] no-underline cursor-pointer transition-[border-color,background-color] duration-150 ease-out hover:border-gray-700 hover:bg-gray-800/40 active:border-gray-700 active:bg-gray-800/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400 [-webkit-tap-highlight-color:transparent]"
              >
                {t.isNew && (
                  <span className="absolute top-3 right-3 sm:top-4 sm:right-4 font-mono text-[10px] text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded">
                    NEW
                  </span>
                )}
                <p className="font-mono text-[11px] text-gray-500 uppercase tracking-wider mb-1.5">
                  {t.meta}
                </p>
                <h2 className={`text-[15px] font-medium text-white mb-2 leading-snug ${t.isNew ? 'pr-12' : ''}`}>
                  {t.title}
                </h2>
                <p className="text-sm text-gray-400 leading-relaxed mb-3">
                  {t.description}
                </p>
                <p className="font-mono text-[11px] text-gray-600 leading-snug">
                  {t.stats}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Footer strip */}
        <div className="max-w-[620px] mx-auto mt-14 pt-5 border-t border-gray-800">
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {FOOTER_LINKS.map(l => (
              <Link
                key={l.href}
                href={l.href}
                className="text-xs text-gray-500 no-underline hover:text-gray-400 transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
