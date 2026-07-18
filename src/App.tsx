import { useAuthBootstrap } from './hooks/useAuthBootstrap'
import { useAuthStore } from './store/auth'
import AuthScreen from './pages/AuthScreen'
import AppShell from './components/AppShell'
import { FullScreenLoader } from './components/Loaders'

export default function App() {
  useAuthBootstrap()
  const loading = useAuthStore((s) => s.loading)
  const session = useAuthStore((s) => s.session)
  const profile = useAuthStore((s) => s.profile)

  if (loading) return <FullScreenLoader label="Connecting to CONNECT…" />
  if (!session || !profile) return <AuthScreen />
  return <AppShell />
}
