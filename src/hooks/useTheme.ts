import { useEffect } from 'react'
import { useThemeStore, applyTheme } from '../store/theme'

export function useTheme() {
  const theme = useThemeStore((s) => s.theme)
  const toggle = useThemeStore((s) => s.toggle)
  const setTheme = useThemeStore((s) => s.setTheme)

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  return { theme, toggle, setTheme }
}
