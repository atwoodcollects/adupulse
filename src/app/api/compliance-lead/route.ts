import { NextResponse } from 'next/server'
import { getRedis } from '@/lib/redis'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, role, town, interestedTown } = body

    if (!name || !email || !role) {
      return NextResponse.json(
        { error: 'Name, email, and role are required' },
        { status: 400 },
      )
    }

    const redis = getRedis()
    if (!redis) {
      // Redis unavailable — accept the submission silently
      console.error('Redis not configured for compliance-lead')
      return NextResponse.json({ success: true })
    }

    // Rate limit: max 5 submissions per email per hour
    const rateLimitKey = `ratelimit:lead:${email}`
    const count = await redis.incr(rateLimitKey)
    if (count === 1) {
      await redis.expire(rateLimitKey, 3600)
    }
    if (count > 5) {
      return NextResponse.json(
        { error: 'Too many submissions. Please try again later.' },
        { status: 429 },
      )
    }

    const timestamp = Date.now()
    const leadData = {
      name,
      email,
      role,
      town: town || null,
      interestedTown: interestedTown || null,
      submittedAt: new Date().toISOString(),
      source: 'compliance-gate',
    }

    await redis.set(`lead:${timestamp}:${email}`, JSON.stringify(leadData))
    await redis.sadd('lead-emails', email)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('compliance-lead error:', err)
    return NextResponse.json({ success: true })
  }
}
