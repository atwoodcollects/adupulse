import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface Town {
  id: string
  name: string
  county: string | null
  total_applications: number
  total_approved: number
  total_denied: number
  avg_days_to_approve: number | null
}

export interface Permit {
  id: string
  town_id: string
  address: string | null
  status: 'applied' | 'approved' | 'denied' | 'withdrawn' | 'completed'
  adu_type: 'attached' | 'detached' | 'internal' | 'unknown' | null
  sqft: number | null
  approved_date: string | null
  days_to_decision: number | null
  town?: Town
}

export async function getTowns(): Promise<Town[]> {
  const { data, error } = await supabase
    .from('towns')
    .select('*')
    .order('total_approved', { ascending: false })
  if (error) throw error
  return data || []
}

export async function getStats() {
  const { data: towns } = await supabase
    .from('towns')
    .select('total_applications, total_approved, total_denied, avg_days_to_approve')
  if (!towns) return { totalApplications: 0, totalApproved: 0, totalDenied: 0, avgDays: 0, townsWithData: 0 }
  return {
    totalApplications: towns.reduce((sum, t) => sum + (t.total_applications || 0), 0),
    totalApproved: towns.reduce((sum, t) => sum + (t.total_approved || 0), 0),
    totalDenied: towns.reduce((sum, t) => sum + (t.total_denied || 0), 0),
    avgDays: 0,
    townsWithData: towns.filter(t => t.total_applications > 0).length
  }
}

export async function getRecentPermits(limit = 10): Promise<Permit[]> {
  const { data, error } = await supabase
    .from('permits')
    .select('*, town:towns(*)')
    .eq('status', 'approved')
    .order('approved_date', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data || []
}
