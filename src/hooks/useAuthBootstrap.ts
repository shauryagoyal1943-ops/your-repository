import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/auth'
import { ensureProfile } from '../lib/api'
import type { Profile } from '../types'

export function useAuthBootstrap() {
  const setSession = useAuthStore((s) => s.setSession)
  const setProfile = useAuthStore((s) => s.setProfile)
  const setLoading = useAuthStore((s) => s.setLoading)
  const qc = useQueryClient()

  useEffect(() => {
    let mounted = true

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return
      setSession(data.session)
      if (data.session) loadProfile(data.session.user)
      else setLoading(false)
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      (async () => {
        setSession(session)
        if (session) await loadProfile(session.user)
        else setProfile(null)
        qc.clear()
      })()
    })

    async function loadProfile(user: { id: string; email?: string; user_metadata?: any }) {
      const { data: existing } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle()
      let profile = existing as Profile | null
      if (!profile) {
        const baseName = user.user_metadata?.full_name || user.user_metadata?.name || user.user_metadata?.user_name || user.email?.split('@')[0] || `user_${user.id.slice(0, 6)}`
        const username = (baseName as string).toLowerCase().replace(/[^a-z0-9_]/g, '').slice(0, 18) || `user_${user.id.slice(0, 6)}`
        const avatarUrl = user.user_metadata?.avatar_url ?? user.user_metadata?.picture ?? null
        try {
          profile = await ensureProfile(user.id, user.email ?? '', username)
          if (avatarUrl && profile) {
            const { data: updated } = await supabase.from('profiles').update({ avatar_url: avatarUrl }).eq('id', user.id).select().maybeSingle()
            if (updated) profile = updated as Profile
          }
        } catch {
          // profile insert may race on concurrent OAuth logins; refetch
          const { data: refetch } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle()
          profile = refetch as Profile | null
        }
      }
      if (mounted) {
        setProfile(profile)
        setLoading(false)
      }
    }

    return () => {
      mounted = false
      sub.subscription.unsubscribe()
    }
  }, [setSession, setProfile, setLoading, qc])
}
