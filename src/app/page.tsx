'use client'

import Link from 'next/link'
import { useState, useMemo, useRef, useEffect, useCallback } from 'react'
import { useTown } from '@/contexts/TownContext'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import townSEOData from '@/data/town_seo_data'
import { approvalsPerTenThousandResidents } from '@/lib/townAnalytics'

// Build towns array with per-capita from real data
const allTowns = townSEOData
  .filter(t => t.approved > 0)
  .map(t => ({
    slug: t.slug,
    name: t.name,
    county: t.county,
    permits: t.approved,
    approvalRate: t.approvalRate,
    pop: t.population,
    per10k: approvalsPerTenThousandResidents(t),
  }))

// Statewide stats from EOHLC survey
const totalApproved = 1224
const totalTowns = 293
const overallRate = 68

type SortKey = 'permits' | 'percapita' | 'approval'

const SUGGESTED_QUERIES = [
  'Can I build an ADU in Duxbury?',
  'What did the AG strike down in Canton?',
  'Does Plymouth require owner-occupancy?',
  'How many ADU permits has Scituate approved?',
  "What's the ADU situation in Andover?",
  'How are ADUs impacting housing production?',
]

const STORAGE_KEY = 'adupulse_chat_usage'
const FREE_LIMIT = 5

function stripMarkdown(text: string): string {
  return text
    .replace(/^#{1,6}\s+/gm, '')      // headers
    .replace(/\*\*(.+?)\*\*/g, '$1')  // bold
    .replace(/\*(.+?)\*/g, '$1')      // italic
    .replace(/^\d+\.\s+/gm, '')       // numbered lists
    .replace(/`(.+?)`/g, '$1')        // inline code
}

function renderResponse(text: string) {
  const cleaned = stripMarkdown(text)
  const paragraphs = cleaned.split(/\n\n+/).filter(p => p.trim())
  return paragraphs.map((para, i) => {
    const lines = para.split('\n')
    // Check if this block is list-like: most lines start with - or are short phrases
    const listLines = lines.filter(l => l.trim()).map(l => {
      const stripped = l.replace(/^[-*]\s+/, '')
      const isListItem = l.trimStart().startsWith('- ') || l.trimStart().startsWith('* ')
      return { text: isListItem ? stripped : l, isListItem }
    })
    const listItemCount = listLines.filter(l => l.isListItem).length
    const isListBlock = listItemCount >= 2

    if (isListBlock) {
      return (
        <div key={i} className="mb-3 last:mb-0 space-y-1.5">
          {listLines.map((l, j) =>
            l.isListItem ? (
              <div key={j} className="flex gap-2 pl-1 border-l-2 border-emerald-500/30 ml-1">
                <span className="pl-2">{renderInline(l.text)}</span>
              </div>
            ) : (
              <p key={j}>{renderInline(l.text)}</p>
            )
          )}
        </div>
      )
    }

    return (
      <p key={i} className="mb-3 last:mb-0">
        {lines.map((line, j) => (
          <span key={j}>
            {j > 0 && <br />}
            {renderInline(line)}
          </span>
        ))}
      </p>
    )
  })
}

function renderInline(text: string) {
  // First, normalize any full URLs to relative paths
  const cleaned = text.replace(/https?:\/\/(?:www\.)?adupulse\.com(\/[^\s]*)/g, '$1')

  const parts: (string | JSX.Element)[] = []
  // Match markdown links [text](url) OR relative paths /towns/... /compliance/... /housing-production/... /pricing
  const regex = /(\[([^\]]+)\]\(([^)]+)\))|(\/(?:towns|compliance|housing-production|pricing|blog)(?:\/[a-z0-9-]+)*)/g
  let lastIndex = 0
  let match
  let key = 0
  while ((match = regex.exec(cleaned)) !== null) {
    if (match.index > lastIndex) {
      parts.push(cleaned.slice(lastIndex, match.index))
    }
    if (match[2] && match[3]) {
      // Markdown link — normalize href too
      const href = match[3].replace(/https?:\/\/(?:www\.)?adupulse\.com(\/[^\s]*)/, '$1')
      parts.push(
        <a key={key++} href={href} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 no-underline hover:underline">
          {match[2]}
        </a>
      )
    } else if (match[4]) {
      const path = match[4]
      const segments = path.split('/').filter(Boolean)
      const lastSegment = segments[segments.length - 1] || ''
      let display: string
      if (path === '/compliance') display = 'Policy Tracker'
      else if (path === '/housing-production') display = 'Housing Production'
      else if (path === '/pricing') display = 'Pricing'
      else if (path === '/blog') display = 'Blog'
      else display = lastSegment.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
      parts.push(
        <a key={key++} href={path} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 no-underline hover:underline">
          {display}
        </a>
      )
    }
    lastIndex = match.index + match[0].length
  }
  if (lastIndex < cleaned.length) {
    parts.push(cleaned.slice(lastIndex))
  }
  return <>{parts}</>
}

export default function Home() {
  const { setSelectedTown } = useTown()
  const [query, setQuery] = useState('')
  const [askedQuestion, setAskedQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [questionsUsed, setQuestionsUsed] = useState(0)
  const [hydrated, setHydrated] = useState(false)
  const [bypassLimit, setBypassLimit] = useState(false)
  const [sortBy, setSortBy] = useState<SortKey>('permits')
  const inputRef = useRef<HTMLInputElement>(null)
  const answerRef = useRef<HTMLDivElement>(null)

  // Load usage from localStorage + check for admin bypass
  useEffect(() => {
    // Skip quota in development
    const isDev = process.env.NODE_ENV === 'development'
    const hasAdminParam = new URLSearchParams(window.location.search).get('admin') === 'true'
    const hasAdminKey = localStorage.getItem('adupulse_admin') === 'true'

    // Persist admin if set via URL param
    if (hasAdminParam) localStorage.setItem('adupulse_admin', 'true')

    if (isDev || hasAdminParam || hasAdminKey) {
      setBypassLimit(true)
    } else {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          const { count, month } = JSON.parse(stored)
          const currentMonth = new Date().toISOString().slice(0, 7)
          if (month === currentMonth) {
            setQuestionsUsed(count)
          } else {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ count: 0, month: currentMonth }))
          }
        }
      } catch { /* ignore */ }
    }
    setHydrated(true)
  }, [])

  const atLimit = !bypassLimit && questionsUsed >= FREE_LIMIT
  const remaining = FREE_LIMIT - questionsUsed

  const sendQuestion = useCallback(async (text: string) => {
    if (!text.trim() || isLoading || atLimit) return

    setAskedQuestion(text)
    setIsLoading(true)
    setAnswer('')
    setError('')
    setQuery('')

    // Increment usage (skip if bypassing)
    if (!bypassLimit) {
      const currentMonth = new Date().toISOString().slice(0, 7)
      const newCount = questionsUsed + 1
      setQuestionsUsed(newCount)
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ count: newCount, month: currentMonth }))
    }

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      })
      if (!res.ok) throw new Error('Failed')

      const reader = res.body!.getReader()
      const decoder = new TextDecoder()
      let accumulated = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        accumulated += decoder.decode(value, { stream: true })
        setAnswer(accumulated)
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [isLoading, atLimit, bypassLimit, questionsUsed])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendQuestion(query)
  }

  const clearAnswer = () => {
    setAskedQuestion('')
    setAnswer('')
    setError('')
    inputRef.current?.focus()
  }

  const topTowns = useMemo(() => {
    const sorted = [...allTowns]
    if (sortBy === 'permits') sorted.sort((a, b) => b.permits - a.permits)
    else if (sortBy === 'percapita') sorted.sort((a, b) => b.per10k - a.per10k)
    else sorted.sort((a, b) => b.approvalRate - a.approvalRate)
    return sorted.slice(0, 8)
  }, [sortBy])

  return (
    <div className="min-h-screen bg-gray-900">
      <NavBar current="Home" />

      <main>
        {/* ===== HERO + CHAT INPUT ===== */}
        <div className="px-5 pt-10 pb-9">
          <div className="max-w-[560px] mx-auto text-center">
            <h1 className="font-bold text-white tracking-tight leading-[1.15] mb-3" style={{ fontSize: 'clamp(26px, 5.5vw, 36px)', letterSpacing: -0.8 }}>
              Massachusetts legalized ADUs.
              <br />
              <span className="text-emerald-400">Ask us anything.</span>
            </h1>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-6 max-w-[480px] mx-auto">
              Instant answers on permits, local bylaws, and consistency with state law — powered by real data from 293 towns.
            </p>

            {/* Chat input */}
            <form onSubmit={handleSubmit} className="relative max-w-[440px] mx-auto">
              <div
                className={`flex items-center rounded-xl px-4 transition-all duration-200 bg-gray-800 border-2 ${
                  atLimit ? 'border-gray-700 opacity-60' :
                  'border-gray-600 focus-within:border-emerald-500 focus-within:shadow-[0_0_0_4px_rgba(16,185,129,0.1)]'
                }`}
              >
                <span className="text-lg mr-2.5 text-gray-500 select-none">&#x2315;</span>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder={atLimit ? 'Free question limit reached' : "Ask about any MA town's ADU policy..."}
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  disabled={atLimit || isLoading}
                  className="flex-1 py-3.5 border-none outline-none text-base bg-transparent text-white placeholder-gray-500 disabled:cursor-not-allowed"
                />
                {query && !isLoading && (
                  <button
                    type="submit"
                    className="text-emerald-400 hover:text-emerald-300 cursor-pointer p-1 bg-transparent border-none"
                    aria-label="Send"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                )}
                {isLoading && (
                  <div className="flex gap-1 p-1">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0ms]" />
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:150ms]" />
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:300ms]" />
                  </div>
                )}
              </div>
            </form>

            {/* Suggested queries */}
            {!askedQuestion && !isLoading && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 mt-4 max-w-[480px] mx-auto">
                {SUGGESTED_QUERIES.map(q => (
                  <button
                    key={q}
                    onClick={() => sendQuestion(q)}
                    disabled={atLimit}
                    className="px-2.5 py-1.5 text-[11px] leading-tight text-gray-400 bg-gray-800/60 border border-gray-700 rounded-lg hover:text-white hover:border-gray-600 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-left"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Question counter / limit message */}
            {hydrated && !bypassLimit && (
              <div className="mt-3 text-center">
                {atLimit ? (
                  <p className="text-xs text-gray-500">
                    You&apos;ve used your {FREE_LIMIT} free questions this month.{' '}
                    <Link href="/pricing" className="text-blue-400 hover:text-blue-300 underline">
                      See pricing
                    </Link>
                  </p>
                ) : questionsUsed > 0 ? (
                  <p className="text-xs text-gray-500">
                    {remaining} of {FREE_LIMIT} free questions remaining
                  </p>
                ) : null}
              </div>
            )}
          </div>

          {/* ===== ANSWER CARD ===== */}
          {(askedQuestion || isLoading) && (
            <div ref={answerRef} className="max-w-[560px] mx-auto mt-6">
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
                {/* User question */}
                <div className="text-xs text-gray-500 mb-3">
                  <span className="text-gray-600">Q:</span> {askedQuestion}
                </div>

                {/* AI response */}
                {error ? (
                  <p className="text-red-400 text-sm">{error}</p>
                ) : answer ? (
                  <div className="text-gray-300 text-sm leading-relaxed">
                    {renderResponse(answer)}
                  </div>
                ) : isLoading ? (
                  <div className="flex gap-1.5 py-2">
                    <span className="w-2 h-2 bg-gray-600 rounded-full animate-bounce [animation-delay:0ms]" />
                    <span className="w-2 h-2 bg-gray-600 rounded-full animate-bounce [animation-delay:150ms]" />
                    <span className="w-2 h-2 bg-gray-600 rounded-full animate-bounce [animation-delay:300ms]" />
                  </div>
                ) : null}

                {/* Clear / ask another */}
                {!isLoading && (answer || error) && (
                  <button
                    onClick={clearAnswer}
                    className="mt-4 text-xs text-blue-400 hover:text-blue-300 cursor-pointer bg-transparent border-none p-0"
                  >
                    Ask another question
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Stats row */}
          <div className="flex justify-center mt-7" style={{ gap: 'clamp(20px, 6vw, 48px)' }}>
            {[
              { val: totalApproved.toLocaleString(), label: 'ADUs Approved' },
              { val: String(totalTowns), label: 'Towns Tracked' },
              { val: `${overallRate}%`, label: 'Approval Rate', tip: 'Share of 2025 applications approved in 2025' },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="font-bold text-emerald-400 tracking-tight" style={{ fontSize: 'clamp(20px, 5vw, 28px)', letterSpacing: -0.5 }}>{s.val}</div>
                <div className="font-mono text-[10px] text-gray-500 uppercase tracking-wider mt-0.5 inline-flex items-center gap-1">
                  {s.label}
                  {s.tip && (
                    <span className="relative group cursor-help">
                      <span className="text-gray-600 hover:text-gray-400 transition-colors">&#9432;</span>
                      <span className="absolute top-full sm:bottom-full sm:top-auto right-0 mt-1.5 sm:mt-0 sm:mb-1.5 px-2.5 py-1.5 text-[10px] normal-case tracking-normal text-gray-300 bg-gray-800 border border-gray-700 rounded-lg shadow-xl max-w-[min(12rem,calc(100vw-2rem))] w-max text-left opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-10">
                        {s.tip}
                      </span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===== AUDIENCE PATHWAYS ===== */}
        <div className="px-5 py-6 max-w-[600px] mx-auto">
          <div className="grid sm:grid-cols-3 gap-2.5">
            <Link href="/club" className="block p-4 bg-gray-800/60 border border-gray-700 rounded-lg no-underline hover:border-gray-600 transition-colors text-center">
              <div className="text-2xl mb-1.5">🏠</div>
              <div className="text-sm font-semibold text-white mb-1">Homeowners</div>
              <div className="text-xs text-gray-400 leading-snug">See what&apos;s allowed in your town and explore your options.</div>
            </Link>
            <Link href="/compliance" className="block p-4 bg-gray-800/60 border border-gray-700 rounded-lg no-underline hover:border-gray-600 transition-colors text-center">
              <div className="text-2xl mb-1.5">⚖️</div>
              <div className="text-sm font-semibold text-white mb-1">Policy &amp; Legal</div>
              <div className="text-xs text-gray-400 leading-snug">Bylaw analysis, AG decisions, and consistency with state law.</div>
            </Link>
            <Link href="/housing-production" className="block p-4 bg-gray-800/60 border border-gray-700 rounded-lg no-underline hover:border-gray-600 transition-colors text-center">
              <div className="text-2xl mb-1.5">📊</div>
              <div className="text-sm font-semibold text-white mb-1">Housing Data</div>
              <div className="text-xs text-gray-400 leading-snug">ADU permits in context — how they fit into overall housing production.</div>
            </Link>
          </div>
        </div>

        {/* ===== TOP TOWNS ===== */}
        <div className="px-5 pb-8 max-w-[600px] mx-auto">
          <div className="flex items-baseline justify-between mb-3.5 flex-wrap gap-2">
            <h2 className="text-xl font-bold text-white m-0">Top Towns</h2>
            <div className="flex gap-1 bg-gray-800 rounded-lg p-0.5">
              {([
                { id: 'permits' as SortKey, label: 'Total Permits' },
                { id: 'percapita' as SortKey, label: 'Per Capita' },
                { id: 'approval' as SortKey, label: 'Approval %' },
              ]).map(s => (
                <button
                  key={s.id}
                  onClick={() => setSortBy(s.id)}
                  className={`px-2.5 py-[5px] border-none rounded-md cursor-pointer font-mono text-[10px] transition-all duration-150 ${
                    sortBy === s.id
                      ? 'bg-gray-700 shadow-sm font-semibold text-white'
                      : 'bg-transparent font-normal text-gray-500'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            {topTowns.map((t, i) => (
              <Link
                key={t.slug}
                href={`/towns/${t.slug}`}
                className="block py-3 px-3.5 bg-gray-800/60 border border-gray-700 rounded-lg no-underline hover:border-gray-600 transition-colors"
                onClick={() => setSelectedTown(t.name)}
              >
                {/* Top line: rank + town info (mobile), rank + town + stats inline (desktop) */}
                <div className="flex items-center gap-2.5">
                  {/* Rank */}
                  <div className={`font-mono text-xs font-semibold w-5 text-center shrink-0 ${i < 3 ? 'text-emerald-400' : 'text-gray-600'}`}>
                    {i + 1}
                  </div>

                  {/* Town info */}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-white truncate">{t.name}</div>
                    <div className="text-[11px] text-gray-500">{t.county} · {t.pop.toLocaleString()}</div>
                  </div>

                  {/* Stats — desktop only (inline) */}
                  <div className="hidden sm:flex gap-3 items-center shrink-0">
                    <div className="text-center min-w-[36px]">
                      <div className={`text-sm font-bold ${sortBy === 'permits' ? 'text-emerald-400' : 'text-gray-400'}`}>{t.permits}</div>
                      <div className="font-mono text-[8px] text-gray-600 uppercase">permits</div>
                    </div>
                    <div className="text-center min-w-[36px]">
                      <div className={`text-sm font-bold ${sortBy === 'percapita' ? 'text-blue-400' : 'text-gray-400'}`}>{t.per10k}</div>
                      <div className="font-mono text-[8px] text-gray-600 uppercase">per 10k</div>
                    </div>
                    <div className="text-center min-w-[36px]">
                      <div className={`text-sm font-bold ${
                        sortBy === 'approval'
                          ? (t.approvalRate >= 70 ? 'text-emerald-400' : t.approvalRate >= 50 ? 'text-amber-400' : 'text-red-400')
                          : 'text-gray-400'
                      }`}>{t.approvalRate}%</div>
                      <div className="font-mono text-[8px] text-gray-600 uppercase">approval</div>
                    </div>
                  </div>
                </div>

                {/* Stats — mobile only (second line, indented past rank) */}
                <div className="flex sm:hidden gap-4 mt-2 ml-[30px]">
                  <div className="text-center flex-1">
                    <div className={`text-sm font-bold ${sortBy === 'permits' ? 'text-emerald-400' : 'text-gray-400'}`}>{t.permits}</div>
                    <div className="font-mono text-[8px] text-gray-600 uppercase">permits</div>
                  </div>
                  <div className="text-center flex-1">
                    <div className={`text-sm font-bold ${sortBy === 'percapita' ? 'text-blue-400' : 'text-gray-400'}`}>{t.per10k}</div>
                    <div className="font-mono text-[8px] text-gray-600 uppercase">per 10k</div>
                  </div>
                  <div className="text-center flex-1">
                    <div className={`text-sm font-bold ${
                      sortBy === 'approval'
                        ? (t.approvalRate >= 70 ? 'text-emerald-400' : t.approvalRate >= 50 ? 'text-amber-400' : 'text-red-400')
                        : 'text-gray-400'
                    }`}>{t.approvalRate}%</div>
                    <div className="font-mono text-[8px] text-gray-600 uppercase">approval</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-3 text-center">
            <Link href="/compliance" className="font-mono text-xs text-blue-400 no-underline font-medium hover:text-blue-300 transition-colors">
              View all {totalTowns} towns →
            </Link>
          </div>
        </div>

        {/* ===== CREDIBILITY ===== */}
        <div className="px-5 py-6 max-w-[600px] mx-auto border-t border-gray-800">
          <div className="text-center space-y-2">
            <p className="font-mono text-[10px] text-gray-500 uppercase tracking-wider">Trusted by</p>
            <p className="text-sm text-gray-400 leading-relaxed">
              Homeowners, builders, and policy analysts across Massachusetts use ADU Pulse
              to navigate the post-Chapter 150 landscape. Our data powers research by housing
              advocates and is referenced in municipal planning discussions.
            </p>
            <div className="flex justify-center gap-6 pt-2">
              <div className="text-center">
                <div className="text-lg font-bold text-white">293</div>
                <div className="font-mono text-[9px] text-gray-600 uppercase">Towns Covered</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-white">28</div>
                <div className="font-mono text-[9px] text-gray-600 uppercase">Bylaws Analyzed</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-white">10</div>
                <div className="font-mono text-[9px] text-gray-600 uppercase">AG Decisions Tracked</div>
              </div>
            </div>
          </div>
        </div>

        {/* ===== BLOG PREVIEW ===== */}
        <div className="px-5 pt-5 pb-8 max-w-[600px] mx-auto border-t border-gray-800">
          <Link
            href="/blog/massachusetts-adu-year-one"
            className="block py-[18px] px-5 bg-gray-800/60 border border-gray-700 rounded-lg no-underline hover:border-gray-600 transition-colors"
          >
            <div className="font-mono text-[10px] text-gray-500 uppercase tracking-wider mb-1.5">
              Latest Analysis
            </div>
            <div className="text-base font-bold text-white leading-[1.3] mb-1.5">
              What 1,224 ADU Permits Taught Me About Massachusetts Housing
            </div>
            <div className="text-xs text-gray-400 leading-[1.5]">
              One year in: which towns are succeeding, which are stalling, and why the numbers tell a more complicated story.
            </div>
          </Link>
        </div>

        {/* Data attribution */}
        <div className="px-5 pb-6 max-w-[600px] mx-auto border-t border-gray-800 pt-5">
          <div className="text-[11px] text-gray-500 leading-relaxed">
            Data: EOHLC ADU Survey Feb 2026 (293 of 351 MA municipalities).
            Population: Census ACS 2024.
            Approval rate = share of 2025 applications approved in 2025.
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
