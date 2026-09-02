import { create } from 'zustand'
import type { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean
  initialize: () => Promise<void>
  signInWithGoogle: () => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
}
/**
 * Zustand authentication store managing Supabase auth sessions and OAuth sign-ins.
 * Features:
 * - Supabase getSession & onAuthStateChange event listeners.
 * - Google OAuth provider integration.
 */
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  loading: true,

  initialize: async () => {
    if (!supabase) {
      set({ loading: false })
      return
    }

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      set({
        session,
        user: session?.user || null,
        loading: false,
      })

      supabase.auth.onAuthStateChange((_event, newSession) => {
        set({
          session: newSession,
          user: newSession?.user || null,
          loading: false,
        })
      })
    } catch (err) {
      console.warn('Auth initialization fallback:', err)
      set({ loading: false })
    }
  },

  signInWithGoogle: async () => {
    if (!supabase) {
      return { error: new Error('Supabase is not configured.') }
    }
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/dashboard',
      },
    })
    return { error }
  },

  signOut: async () => {
    if (supabase) {
      await supabase.auth.signOut()
    }
    set({ user: null, session: null })
  },
}))
