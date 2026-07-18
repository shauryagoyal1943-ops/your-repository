import { create } from 'zustand'

type Theme = 'light' | 'dark'
type ThemeState = {
  theme: Theme
  setTheme: (t: Theme) => void
  toggle: () => void
}

function getInitial(): Theme {
  if (typeof window === 'undefined') return 'light'
  const saved = localStorage.getItem('connect-theme') as Theme | null
  if (saved === 'light' || saved === 'dark') return saved
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function applyTheme(theme: Theme) {
  const root = document.documentElement
  root.classList.toggle('dark', theme === 'dark')
  root.style.colorScheme = theme
  localStorage.setItem('connect-theme', theme)
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: getInitial(),
  setTheme: (t) => set({ theme: t }),
  toggle: () => set({ theme: get().theme === 'dark' ? 'light' : 'dark' }),
}))

// Apply on module load so the class is set before first paint
if (typeof window !== 'undefined') {
  applyTheme(useThemeStore.getState().theme)
}
