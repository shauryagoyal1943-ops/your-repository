import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { ensureProfile } from '../lib/api'
import { useAuthStore } from '../store/auth'

export default function AuthScreen() {
  const setProfile = useAuthStore((s) => s.setProfile)
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
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
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-sm animate-slide-up">
          <div className="lg:hidden flex items-center gap-2.5 mb-8 justify-center">
            <Logo className="h-8 w-8 text-brand-600" />
            <span className="font-display text-xl font-extrabold text-ink-900 dark:text-ink-50">CONNECT</span>
          </div>

          <h2 className="font-display text-2xl font-bold text-ink-900 dark:text-ink-50">
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </h2>
          <p className="text-ink-500 dark:text-ink-400 text-sm mt-1 mb-6">
            {mode === 'login' ? 'Sign in to continue to CONNECT.' : 'Join the CONNECT community today.'}
          </p>

          <form onSubmit={submit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="text-xs font-semibold text-ink-600 mb-1.5 block">Username</label>
                <input className="input" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="your_handle" autoComplete="username" />
              </div>
            )}
            <div>
              <label className="text-xs font-semibold text-ink-600 mb-1.5 block">Email</label>
              <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" required />
            </div>
            <div>
              <label className="text-xs font-semibold text-ink-600 mb-1.5 block">Password</label>
              <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} required minLength={6} />
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 animate-fade-in">
                {error}
              </div>
            )}

            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-ink-500 dark:text-ink-400">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(null) }}
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
