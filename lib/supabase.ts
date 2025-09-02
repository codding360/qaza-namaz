import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  birth_year: number
  gender: 'male' | 'female'
  created_at: string
  updated_at: string
}

export interface PrayerStats {
  id: string
  user_id: string
  prayer_name: string
  skipped_count: number
  created_at: string
  updated_at: string
}