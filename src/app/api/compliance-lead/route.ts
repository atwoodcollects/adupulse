import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { getRedis } from '@/lib/redis'

const resend = new Resend(process.env.RESEND_API_KEY)

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

    // Notify via email — don't block on failure
    try {
      await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: 'nick@adupulse.com',
        subject: `New Lead: ${role} — ${town || 'Unknown'}`,
        text: [
          'New compliance analysis request:',
          '',
          `Name: ${name}`,
          `Email: ${email}`,
          `Role: ${role}`,
          `Viewing: ${town || 'Not specified'}`,
          `Most interested in: ${interestedTown || 'Not specified'}`,
          `Submitted: ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })}`,
          '',
          `Reply directly to ${email} to follow up.`,
        ].join('\n'),
      })
    } catch (emailErr) {
      console.error('Failed to send lead notification email:', emailErr)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('compliance-lead error:', err)
    return NextResponse.json({ success: true })
  }
}
