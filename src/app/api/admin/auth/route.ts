import { NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const password = typeof body.password === 'string' ? body.password.trim() : ''
    const expected = (process.env.ADMIN_PASSWORD || '').trim()

    if (!expected || password !== expected) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const today = new Date().toISOString().slice(0, 10)
    const token = crypto
      .createHmac('sha256', expected)
      .update(today)
      .digest('hex')

    return NextResponse.json({ token })
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  }
}
