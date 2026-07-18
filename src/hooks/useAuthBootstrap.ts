import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/auth'
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
      if (data.session) loadProfile(data.session.user.id)
      else setLoading(false)
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      (async () => {
        setSession(session)
        if (session) await loadProfile(session.user.id)
        else setProfile(null)
        qc.clear()
      })()
    })

    async function loadProfile(uid: string) {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', uid)
        .maybeSingle()
      if (mounted) {
        setProfile(data as Profile | null)
        setLoading(false)
      }
    }

    return () => {
      mounted = false
      sub.subscription.unsubscribe()
    }
  }, [setSession, setProfile, setLoading, qc])
}
