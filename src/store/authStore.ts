import { create } from 'zustand'
import type { User, Session } from '@supabase/supabase-js'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean
  isGuest: boolean
  initialize: () => Promise<void>
  signInWithGoogle: () => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
  continueAsGuest: () => void
}
/**
 * Zustand authentication store managing Supabase auth sessions, OAuth sign-ins, and guest modes.
 * Features:
 * - Supabase getSession & onAuthStateChange event listeners.
 * - Google OAuth provider integration.
 * - Guest mode fallback for local offline experimentation.
 */
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  loading: true,
  isGuest: !isSupabaseConfigured,

  initialize: async () => {
    if (!supabase) {
      set({ loading: false, isGuest: true })
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
        isGuest: !session?.user,
      })

      supabase.auth.onAuthStateChange((_event, newSession) => {
        set({
          session: newSession,
          user: newSession?.user || null,
          isGuest: !newSession?.user,
          loading: false,
        })
      })
    } catch (err) {
      console.warn('Auth initialization fallback:', err)
      set({ loading: false, isGuest: true })
    }
  },

  signInWithGoogle: async () => {
    if (!supabase) {
      return { error: new Error('Supabase is not configured. Using guest mode.') }
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
    set({ user: null, session: null, isGuest: true })
  },

  continueAsGuest: () => {
    set({ isGuest: true, loading: false })
  },
}))
