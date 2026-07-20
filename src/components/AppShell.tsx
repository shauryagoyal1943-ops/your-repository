import { Routes, Route, Navigate, NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuthStore } from '../store/auth'
import { useTheme } from '../hooks/useTheme'
import { supabase } from '../lib/supabase'
import { Avatar } from './Avatar'
import {
  HomeIcon, CompassIcon, MessageIcon, BellIcon, UserIcon,
  PlusIcon, LogoutIcon, GamepadIcon, BookIcon, SunIcon, MoonIcon,
} from './icons'
import CreatePostModal from './CreatePostModal'
import FeedPage from '../pages/FeedPage'
import ExplorePage from '../pages/ExplorePage'
import BlogsPage from '../pages/BlogsPage'
import MessagesPage from '../pages/MessagesPage'
import NotificationsPage from '../pages/NotificationsPage'
import ProfilePage from '../pages/ProfilePage'
import GamesPage from '../pages/GamesPage'

const navItems = [
  { to: '/', label: 'Home', Icon: HomeIcon, end: true },
  { to: '/explore', label: 'Explore', Icon: CompassIcon },
  { to: '/blogs', label: 'Blogs', Icon: BookIcon },
  { to: '/messages', label: 'Messages', Icon: MessageIcon },
  { to: '/notifications', label: 'Notifications', Icon: BellIcon },
  { to: '/games', label: 'Games', Icon: GamepadIcon },
]

export default function AppShell() {
  const profile = useAuthStore((s) => s.profile)
  const [showCreate, setShowCreate] = useState(false)
  const navigate = useNavigate()
  const { theme, toggle: toggleTheme } = useTheme()

  async function signOut() {
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-ink-50 text-ink-900 dark:bg-ink-950 dark:text-ink-50">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex fixed inset-y-0 left-0 w-64 flex-col border-r border-ink-100 bg-white px-4 py-6 z-30 dark:border-ink-800 dark:bg-ink-900">
        <div className="flex items-center gap-2.5 px-2 mb-8">
          <div className="h-9 w-9 rounded-xl bg-brand-600 grid place-items-center text-white font-display font-extrabold">C</div>
          <span className="font-display text-xl font-extrabold tracking-tight">CONNECT</span>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map(({ to, label, Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => `nav-item ${isActive ? 'nav-item-active' : ''}`}
            >
              <Icon className="h-6 w-6" />
              <span>{label}</span>
            </NavLink>
          ))}
          <button onClick={() => setShowCreate(true)} className="nav-item w-full">
            <PlusIcon className="h-6 w-6" />
            <span>Create post</span>
          </button>
          <NavLink to={`/u/${profile?.username}`} className={({ isActive }) => `nav-item ${isActive ? 'nav-item-active' : ''}`}>
            <Avatar url={profile?.avatar_url} username={profile?.username} size={24} />
            <span>Profile</span>
          </NavLink>
        </nav>

        <div className="space-y-1">
          <button onClick={toggleTheme} className="nav-item w-full">
            {theme === 'dark' ? <SunIcon className="h-6 w-6" /> : <MoonIcon className="h-6 w-6" />}
            <span>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
          </button>
          <button onClick={signOut} className="nav-item w-full text-ink-500 hover:text-red-600 dark:text-ink-400 dark:hover:text-red-400">
            <LogoutIcon className="h-6 w-6" />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="md:hidden sticky top-0 z-30 flex items-center justify-between px-4 h-14 bg-white/90 backdrop-blur border-b border-ink-100 dark:bg-ink-900/90 dark:border-ink-800">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-brand-600 grid place-items-center text-white font-display font-extrabold">C</div>
          <span className="font-display text-lg font-extrabold">CONNECT</span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={toggleTheme} className="icon-btn">
            {theme === 'dark' ? <SunIcon className="h-6 w-6" /> : <MoonIcon className="h-6 w-6" />}
          </button>
          <button onClick={() => setShowCreate(true)} className="icon-btn"><PlusIcon className="h-6 w-6" /></button>
        </div>
      </header>

      {/* Main */}
      <main className="md:pl-64 pb-20 md:pb-0">
        <div className="max-w-3xl mx-auto px-0 md:px-6 py-0 md:py-6">
          <Routes>
            <Route path="/" element={<FeedPage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/blogs" element={<BlogsPage />} />
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/games" element={<GamesPage />} />
            <Route path="/u/:username" element={<ProfilePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur border-t border-ink-100 flex items-center justify-around h-16 px-1 dark:bg-ink-900/95 dark:border-ink-800 safe-area-pb">
        {navItems.map(({ to, Icon, end, label }) => (
          <NavLink key={to} to={to} end={end} className={({ isActive }) => `flex flex-col items-center gap-0.5 p-1.5 rounded-xl min-w-0 ${isActive ? 'text-brand-600 dark:text-brand-400' : 'text-ink-500 dark:text-ink-400'}`}>
            <Icon className="h-5 w-5 shrink-0" />
            <span className="text-[9px] font-medium truncate">{label}</span>
          </NavLink>
        ))}
      </nav>

      {showCreate && <CreatePostModal onClose={() => setShowCreate(false)} />}
    </div>
  )
}
