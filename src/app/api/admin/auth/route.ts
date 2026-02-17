import { NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const password = typeof body.password === 'string' ? body.password : ''
    const envPassword = process.env.ADMIN_PASSWORD || ''

    // Trim both to handle newlines/whitespace from env vars
    const submitted = password.trim()
    const expected = envPassword.trim()

    // Temporary debug info (remove after fixing)
    const debug = {
      submittedLength: submitted.length,
      expectedLength: expected.length,
      match: submitted === expected,
      submittedCharCodes: submitted.slice(0, 3).split('').map(c => c.charCodeAt(0)),
      expectedCharCodes: expected.slice(0, 3).split('').map(c => c.charCodeAt(0)),
    }

    if (!expected || submitted !== expected) {
      return NextResponse.json({ error: 'Unauthorized', debug }, { status: 401 })
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
