import { NextRequest, NextResponse } from 'next/server'
import { getQueryLog } from '@/lib/query-log'

export async function GET(req: NextRequest) {
  const password = req.nextUrl.searchParams.get('password')
  if (!process.env.ADMIN_PASSWORD || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const log = getQueryLog()
  return NextResponse.json(log)
}
