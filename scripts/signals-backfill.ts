// Server-side only — requires SUPABASE_SERVICE_ROLE_KEY. Never run client-side.
import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Place URL mapping from Phase 1 verification
const PLACE_URLS: Record<string, { placeUrl: string; orgMatch: string }> = {
  'quincy':     { placeUrl: 'quincy',       orgMatch: 'Quincy' },
  'somerville': { placeUrl: 'somerville_2',  orgMatch: 'Somerville' },
  'newton':     { placeUrl: 'newton',        orgMatch: 'Newton' },
  'worcester':  { placeUrl: 'worcester',     orgMatch: 'Worcester' },
  'lowell':     { placeUrl: 'lowell',        orgMatch: 'Lowell' },
  'fall-river': { placeUrl: 'fall-river',    orgMatch: 'Fall River' },
}

const API_BASE = 'https://seeclickfix.com/api/v2/issues'
const PER_PAGE = 100
const PAGE_DELAY_MS = 250
const RETRY_DELAY_MS = 2000

function sleep(ms: number) {
  return new Promise(r => setTimeout(r, ms))
}

interface SCFIssue {
  id: number
  status: string
  summary: string
  description: string | null
  lat: number | null
  lng: number | null
  address: string | null
  created_at: string
  acknowledged_at: string | null
  closed_at: string | null
  request_type?: {
    title?: string
    organization?: string
  }
}

async function fetchPage(placeUrl: string, afterDate: string, beforeDate: string, page: number): Promise<{ issues: SCFIssue[]; totalPages: number; totalEntries: number }> {
  const params = new URLSearchParams({
    place_url: placeUrl,
    per_page: String(PER_PAGE),
    page: String(page),
    sort: 'created_at',
    sort_direction: 'ASC',
    after: afterDate,
    before: beforeDate,
  })
  const url = `${API_BASE}?${params}`

  let res = await fetch(url)
  if (!res.ok) {
    console.log(`  [retry] HTTP ${res.status}, waiting ${RETRY_DELAY_MS}ms...`)
    await sleep(RETRY_DELAY_MS)
    res = await fetch(url)
    if (!res.ok) {
      throw new Error(`API returned ${res.status} after retry: ${await res.text().then(t => t.slice(0, 200))}`)
    }
  }

  const data = await res.json()
  return {
    issues: data.issues ?? [],
    totalPages: data.metadata?.pagination?.pages ?? 0,
    totalEntries: data.metadata?.pagination?.entries ?? 0,
  }
}

async function backfillTown(supabase: SupabaseClient, townSlug: string) {
  const config = PLACE_URLS[townSlug]
  if (!config) {
    console.error(`Unknown town slug: ${townSlug}. Valid: ${Object.keys(PLACE_URLS).join(', ')}`)
    process.exit(1)
  }

  const now = new Date()
  const oneYearAgo = new Date(now)
  oneYearAgo.setDate(oneYearAgo.getDate() - 365)

  const afterDate = oneYearAgo.toISOString()
  const beforeDate = now.toISOString()

  console.log(`\n[${townSlug}] Starting backfill`)
  console.log(`[${townSlug}] Date range: ${afterDate.slice(0, 10)} to ${beforeDate.slice(0, 10)}`)
  console.log(`[${townSlug}] Place URL: ${config.placeUrl}, org match: "${config.orgMatch}"`)

  const startTime = Date.now()
  let totalFetched = 0
  let totalInserted = 0
  let totalSkippedBoundary = 0
  let totalSkippedError = 0
  let page = 1
  let estimatedPages = '?'

  while (true) {
    let pageData
    try {
      pageData = await fetchPage(config.placeUrl, afterDate, beforeDate, page)
    } catch (e: any) {
      console.error(`[${townSlug}] Fatal error on page ${page}: ${e.message}`)
      break
    }

    if (page === 1) {
      estimatedPages = String(pageData.totalPages)
      console.log(`[${townSlug}] API reports ${pageData.totalEntries} total entries, ~${estimatedPages} pages`)
    }

    if (pageData.issues.length === 0) {
      if (page <= parseInt(estimatedPages)) {
        console.log(`[${townSlug}] Page ${page} returned 0 records (gap?), continuing...`)
      }
      break
    }

    totalFetched += pageData.issues.length

    // Filter by organization
    const matched: SCFIssue[] = []
    for (const issue of pageData.issues) {
      const org = issue.request_type?.organization ?? ''
      if (org.toLowerCase().includes(config.orgMatch.toLowerCase())) {
        matched.push(issue)
      } else {
        totalSkippedBoundary++
      }
    }

    // Upsert matched records
    if (matched.length > 0) {
      const rows = matched.map(issue => ({
        town_slug: townSlug,
        external_id: issue.id,
        created_at_src: issue.created_at,
        acknowledged_at_src: issue.acknowledged_at || null,
        closed_at_src: issue.closed_at || null,
        category_raw: issue.request_type?.title || null,
        organization: issue.request_type?.organization || null,
        summary: issue.summary || null,
        description: issue.description || null,
        status: issue.status || null,
        lat: issue.lat || null,
        lng: issue.lng || null,
        address: issue.address || null,
        fetched_at: new Date().toISOString(),
      }))

      const { error } = await (supabase as any)
        .from('signals_raw')
        .upsert(rows, { onConflict: 'town_slug,external_id' })

      if (error) {
        console.error(`[${townSlug}] DB error on page ${page}: ${error.message}`)
        totalSkippedError += matched.length
      } else {
        totalInserted += matched.length
      }
    }

    console.log(`[${townSlug}] page ${page} of ~${estimatedPages}, ${totalInserted} inserted, ${totalSkippedBoundary} skipped (boundary)`)

    if (pageData.issues.length < PER_PAGE) break
    page++
    await sleep(PAGE_DELAY_MS)
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1)

  return {
    townSlug,
    totalFetched,
    totalInserted,
    totalSkippedBoundary,
    totalSkippedError,
    elapsed,
  }
}

async function main() {
  const townArg = process.argv.find(a => a.startsWith('--town='))?.split('=')[1]
  const allFlag = process.argv.includes('--all')

  if (!townArg && !allFlag) {
    console.error('Usage: npx tsx scripts/signals-backfill.ts --town=somerville')
    console.error('       npx tsx scripts/signals-backfill.ts --all')
    console.error(`Valid towns: ${Object.keys(PLACE_URLS).join(', ')}`)
    process.exit(1)
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL in environment')
    process.exit(1)
  }
  if (!supabaseKey) {
    console.error('Missing SUPABASE_SERVICE_ROLE_KEY in environment. The anon key is read-only; this script needs the service role key to insert rows.')
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  const towns = allFlag
    ? ['somerville', 'newton', 'quincy', 'worcester', 'lowell', 'fall-river']
    : [townArg!]

  const results = []
  for (const town of towns) {
    const result = await backfillTown(supabase, town)
    results.push(result)
  }

  // Summary table
  console.log('\n' + '='.repeat(90))
  console.log('BACKFILL SUMMARY')
  console.log('='.repeat(90))
  console.log(
    'Town'.padEnd(15) +
    'Fetched'.padStart(10) +
    'Inserted'.padStart(10) +
    'Boundary'.padStart(10) +
    'Errors'.padStart(10) +
    'Time (s)'.padStart(10)
  )
  console.log('-'.repeat(90))
  for (const r of results) {
    console.log(
      r.townSlug.padEnd(15) +
      String(r.totalFetched).padStart(10) +
      String(r.totalInserted).padStart(10) +
      String(r.totalSkippedBoundary).padStart(10) +
      String(r.totalSkippedError).padStart(10) +
      r.elapsed.padStart(10)
    )
  }
  console.log('-'.repeat(90))
  const totals = results.reduce((acc, r) => ({
    fetched: acc.fetched + r.totalFetched,
    inserted: acc.inserted + r.totalInserted,
    boundary: acc.boundary + r.totalSkippedBoundary,
    errors: acc.errors + r.totalSkippedError,
  }), { fetched: 0, inserted: 0, boundary: 0, errors: 0 })
  console.log(
    'TOTAL'.padEnd(15) +
    String(totals.fetched).padStart(10) +
    String(totals.inserted).padStart(10) +
    String(totals.boundary).padStart(10) +
    String(totals.errors).padStart(10)
  )
  console.log('='.repeat(90))
}

main().catch(e => {
  console.error('Fatal:', e)
  process.exit(1)
})
