import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { ensureProfile } from '../lib/api'
import { useAuthStore } from '../store/auth'

type Provider = 'google' | 'facebook' | 'instagram' | 'github'

const PROVIDERS: { id: Provider; label: string; bg: string }[] = [
  { id: 'google', label: 'Google', bg: 'bg-white text-ink-700 border border-ink-200 hover:bg-ink-50 dark:bg-ink-800 dark:text-ink-100 dark:border-ink-700 dark:hover:bg-ink-700' },
  { id: 'facebook', label: 'Facebook', bg: 'bg-[#1877F2] text-white hover:bg-[#1663d6]' },
  { id: 'instagram', label: 'Instagram', bg: 'bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white hover:opacity-90' },
  { id: 'github', label: 'GitHub', bg: 'bg-ink-900 text-white hover:bg-ink-800 dark:bg-ink-700 dark:hover:bg-ink-600' },
]

function ProviderIcon({ id }: { id: Provider }) {
  if (id === 'google') return (
    <svg viewBox="0 0 24 24" className="h-5 w-5"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"/><path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/></svg>
  )
  if (id === 'facebook') return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.69.24 2.69.24v2.97h-1.52c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z"/></svg>
  )
  if (id === 'instagram') return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zM12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.79.3-1.46.72-2.12 1.38C1.36 2.67.94 3.34.63 4.14c-.3.76-.5 1.64-.56 2.91C.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.3.79.72 1.46 1.38 2.12.66.66 1.33 1.08 2.12 1.38.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56.79-.3 1.46-.72 2.12-1.38.66-.66 1.08-1.33 1.38-2.12.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91-.3-.79-.72-1.46-1.38-2.12C21.33 1.36 20.66.94 19.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0zm0 5.84A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84zM12 16a4 4 0 1 1 4-4 4 4 0 0 1-4 4zm6.41-10.85a1.44 1.44 0 1 0 1.44 1.44 1.44 1.44 0 0 0-1.44-1.44z"/></svg>
  )
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.26.8-.58v-2.17c-3.34.72-4.04-1.6-4.04-1.6-.55-1.4-1.34-1.77-1.34-1.77-1.1-.74.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.84 2.8 1.3 3.49 1 .1-.78.42-1.3.76-1.6-2.66-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.3-1.55 3.3-1.23 3.3-1.23.66 1.66.25 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.62-5.49 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.2.69.82.57A12 12 0 0 0 12 .3z"/></svg>
  )
}

export default function AuthScreen() {
  const setProfile = useAuthStore((s) => s.setProfile)
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setInfo(null)
    setLoading(true)
    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
      } else {
        if (username.trim().length < 3) throw new Error('Username must be at least 3 characters')
        const { data, error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        if (data.user) {
          await ensureProfile(data.user.id, email, username.trim())
        }
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  async function signInWithProvider(provider: Provider) {
    setError(null)
    setInfo(null)
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider as any,
        options: { redirectTo: window.location.origin },
      })
      if (error) throw error
    } catch (err: any) {
      const msg = err?.message || ''
      if (msg.toLowerCase().includes('provider') || msg.toLowerCase().includes('not found') || msg.toLowerCase().includes('disabled')) {
        setInfo(`${provider[0].toUpperCase()}${provider.slice(1)} sign-in is not enabled for this project yet. Use email/password, or ask the project owner to enable it in the Supabase dashboard under Authentication → Providers.`)
      } else {
        setError(msg || `${provider} sign-in failed. Please try again.`)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-stretch bg-white dark:bg-ink-950">
      {/* Left brand panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute -top-20 -left-20 h-96 w-96 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-accent-400/30 blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-3">
            <Logo className="h-10 w-10" />
            <span className="font-display text-2xl font-extrabold tracking-tight">CONNECT</span>
          </div>
          <div className="space-y-5">
            <h1 className="font-display text-4xl font-extrabold leading-tight">
              Where your world<br />comes together.
            </h1>
            <p className="text-brand-100 text-lg max-w-md">
              Share posts, reels, and stories. Chat with friends. Play quick games. All in one place.
            </p>
            <ul className="space-y-2.5 text-brand-50">
              {['Feed, carousels & stories', 'Reels that play instantly', 'Direct messages', 'Mini-games & leaderboards'].map((f) => (
                <li key={f} className="flex items-center gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent-400" /> {f}
                </li>
              ))}
            </ul>
          </div>
          <p className="text-brand-200 text-xs">© {new Date().getFullYear()} CONNECT. Crafted with care.</p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-5 sm:p-10 bg-ink-50 dark:bg-ink-950">
        <div className="w-full max-w-sm animate-slide-up">
          <div className="lg:hidden flex items-center gap-2.5 mb-6 justify-center">
            <Logo className="h-8 w-8 text-brand-600" />
            <span className="font-display text-xl font-extrabold text-ink-900 dark:text-ink-50">CONNECT</span>
          </div>

          <div className="card p-6 sm:p-8 shadow-pop">
            <h2 className="font-display text-2xl font-bold text-ink-900 dark:text-ink-50">
              {mode === 'login' ? 'Welcome back' : 'Create your account'}
            </h2>
            <p className="text-ink-500 dark:text-ink-400 text-sm mt-1 mb-5">
              {mode === 'login' ? 'Sign in to continue to CONNECT.' : 'Join the CONNECT community today.'}
            </p>

            <form onSubmit={submit} className="space-y-3.5">
              {mode === 'signup' && (
                <div>
                  <label className="text-xs font-semibold text-ink-600 dark:text-ink-300 mb-1.5 block">Username</label>
                  <input className="input" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="your_handle" autoComplete="username" />
                </div>
              )}
              <div>
                <label className="text-xs font-semibold text-ink-600 dark:text-ink-300 mb-1.5 block">Email</label>
                <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" required />
              </div>
              <div>
                <label className="text-xs font-semibold text-ink-600 dark:text-ink-300 mb-1.5 block">Password</label>
                <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} required minLength={1} />
                {mode === 'signup' && (
                  <p className="text-[11px] text-ink-400 mt-1">Choose any password you like — no restrictions.</p>
                )}
              </div>

              {error && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 animate-fade-in">
                  {error}
                </div>
              )}
              {info && (
                <div className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 animate-fade-in">
                  {info}
                </div>
              )}

              <button type="submit" className="btn-primary w-full" disabled={loading}>
                {loading ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
              </button>
            </form>

            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-ink-200 dark:bg-ink-800" />
              <span className="text-xs text-ink-400 font-medium">or continue with</span>
              <div className="flex-1 h-px bg-ink-200 dark:bg-ink-800" />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {PROVIDERS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => signInWithProvider(p.id)}
                  disabled={loading}
                  className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition active:scale-[0.98] disabled:opacity-60 ${p.bg}`}
                >
                  <ProviderIcon id={p.id} />
                  <span className="hidden sm:inline">{p.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 text-center text-sm text-ink-500 dark:text-ink-400">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(null); setInfo(null) }}
              className="text-brand-600 dark:text-brand-400 font-semibold hover:text-brand-700 dark:hover:text-brand-300"
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Logo({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} fill="none">
      <rect width="40" height="40" rx="11" fill="currentColor" />
      <circle cx="14" cy="20" r="4" fill="white" />
      <circle cx="26" cy="20" r="4" fill="white" />
      <path d="M18 20h4" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}
