import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { getQueryLog } from '@/lib/query-log'

function isValidToken(token: string): boolean {
  if (!process.env.ADMIN_PASSWORD) return false
  const today = new Date().toISOString().slice(0, 10)
  const expected = crypto
    .createHmac('sha256', process.env.ADMIN_PASSWORD)
    .update(today)
    .digest('hex')
  return token === expected
}

export async function GET(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  if (!token || !isValidToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const log = await getQueryLog()
  return NextResponse.json(log)
}
