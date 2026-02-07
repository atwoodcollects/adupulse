import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { email, town, interest_type, role } = await req.json()

    if (!email || !town || !interest_type || !role) {
      return NextResponse.json({ error: 'All fields required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('club_interest')
      .insert({ email, town, interest_type, role })

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: 'You already signed up for this town' }, { status: 409 })
      }
      return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('club_interest')
      .select('town')

    if (error) {
      return NextResponse.json({ counts: {} })
    }

    const counts: Record<string, number> = {}
    for (const row of data || []) {
      counts[row.town] = (counts[row.town] || 0) + 1
    }

    const total = data?.length || 0

    return NextResponse.json({ counts, total })
  } catch {
    return NextResponse.json({ counts: {}, total: 0 })
  }
}
