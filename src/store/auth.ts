import { create } from 'zustand'
import type { Session, User } from '@supabase/supabase-js'
import type { Profile } from '../types'

type AuthState = {
  session: Session | null
  user: User | null
  profile: Profile | null
  loading: boolean
  setSession: (s: Session | null) => void
  setProfile: (p: Profile | null) => void
  setLoading: (b: boolean) => void
  reset: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  user: null,
  profile: null,
  loading: true,
  setSession: (s) =>
    set({ session: s, user: s?.user ?? null, loading: false }),
  setProfile: (p) => set({ profile: p }),
  setLoading: (b) => set({ loading: b }),
  reset: () => set({ session: null, user: null, profile: null, loading: false }),
}))
