import { NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(req: Request) {
  try {
    const { password } = await req.json()

    if (!process.env.ADMIN_PASSWORD || password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Generate a simple session token (hash of password + date, valid for 24h)
    const today = new Date().toISOString().slice(0, 10)
    const token = crypto
      .createHmac('sha256', process.env.ADMIN_PASSWORD)
      .update(today)
      .digest('hex')

    return NextResponse.json({ token })
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  }
}
