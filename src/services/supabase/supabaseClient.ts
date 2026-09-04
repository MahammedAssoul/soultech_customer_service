import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

/** Thrown when the Supabase environment variables are missing. */
export class SupabaseNotConfiguredError extends Error {
  constructor() {
    super(
      'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.',
    )
    this.name = 'SupabaseNotConfiguredError'
  }
}

let client: SupabaseClient | null = null

/**
 * Returns the Supabase client. Throws a descriptive error when the
 * environment variables are missing so pages can show a friendly state
 * instead of crashing.
 */
export function getSupabase(): SupabaseClient {
  if (!isSupabaseConfigured) {
    throw new SupabaseNotConfiguredError()
  }
  if (!client) {
    client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  }
  return client
}