import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  ''

/**
 * Whether valid Supabase credentials (URL and publishable/anon key) are provided in environment variables.
 */
export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseKey && 
  !supabaseUrl.includes('placeholder') && 
  !supabaseUrl.includes('your_supabase')
)

/**
 * Singleton Supabase JS client instance configured with project URL and public key.
 * Null if credentials are not configured or placeholder values are present.
 */
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseKey)
  : null

