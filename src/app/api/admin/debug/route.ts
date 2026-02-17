import { NextResponse } from 'next/server'

export async function GET() {
  const val = process.env.ADMIN_PASSWORD
  return NextResponse.json({
    isSet: !!val,
    length: val ? val.length : 0,
  })
}
