import { useState } from 'react'
import { useStories, useCreateStory } from '../lib/hooks'
import { useAuthStore } from '../store/auth'
import { Avatar } from './Avatar'
import { PlusIcon } from './icons'
import { pickImages } from '../lib/api'
import type { Story, Profile } from '../types'

export default function StoriesBar() {
  const { data } = useStories()
  const create = useCreateStory()
  const me = useAuthStore((s) => s.profile)
  const [viewer, setViewer] = useState<number | null>(null)

  const grouped = new Map<string, { profile: Profile; items: Story[] }>()
  for (const s of data ?? []) {
    const key = s.user_id
    if (!grouped.has(key)) grouped.set(key, { profile: s.profile, items: [] })
    grouped.get(key)!.items.push(s)
  }
  const list = Array.from(grouped.values())

  async function addStory() {
    const url = pickImages(1)[0]
    await create.mutateAsync(url)
  }

  return (
    <>
      <div className="md:card md:p-3 flex items-center gap-4 overflow-x-auto no-scrollbar px-3 md:px-0 py-3">
        <button onClick={addStory} className="flex-shrink-0 flex flex-col items-center gap-1.5 group">
          <div className="relative">
            <Avatar url={me?.avatar_url} username={me?.username} size={60} />
            <span className="absolute -bottom-0.5 -right-0.5 h-5 w-5 rounded-full bg-brand-600 grid place-items-center text-white border-2 border-white dark:border-ink-900">
              <PlusIcon className="h-3.5 w-3.5" />
            </span>
          </div>
          <span className="text-xs font-medium text-ink-600 dark:text-ink-300 max-w-[64px] truncate">Your story</span>
        </button>

        {list.map((g, i) => (
          <button key={g.profile.id} onClick={() => setViewer(i)} className="flex-shrink-0 flex flex-col items-center gap-1.5 group">
            <div className="rounded-full p-[2px] bg-gradient-to-tr from-accent-500 via-brand-500 to-brand-700">
              <div className="rounded-full p-[2px] bg-white dark:bg-ink-900">
                <Avatar url={g.profile.avatar_url} username={g.profile.username} size={56} />
              </div>
            </div>
            <span className="text-xs font-medium text-ink-600 dark:text-ink-300 max-w-[64px] truncate">{g.profile.username}</span>
          </button>
        ))}
      </div>

      {viewer !== null && list[viewer] && (
        <StoryViewer
          stories={list[viewer].items}
          profile={list[viewer].profile}
          onClose={() => setViewer(null)}
          onNext={() => setViewer((v) => (v !== null && v < list.length - 1 ? v + 1 : null))}
          onPrev={() => setViewer((v) => (v !== null && v > 0 ? v - 1 : null))}
        />
      )}
    </>
  )
}

function StoryViewer({ stories, profile, onClose, onNext, onPrev }: { stories: Story[]; profile: Profile; onClose: () => void; onNext: () => void; onPrev: () => void }) {
  const [idx, setIdx] = useState(0)
  const s = stories[idx]

  function next() {
    if (idx < stories.length - 1) setIdx(idx + 1)
    else onNext()
  }
  function prev() {
    if (idx > 0) setIdx(idx - 1)
    else onPrev()
  }

  return (
    <div className="fixed inset-0 z-50 bg-ink-950/90 backdrop-blur-sm flex items-center justify-center animate-fade-in" onClick={onClose}>
      <button onClick={(e) => { e.stopPropagation(); onClose() }} className="absolute top-4 right-4 text-white/80 hover:text-white p-2">✕</button>
      <button onClick={(e) => { e.stopPropagation(); prev() }} className="absolute left-4 text-white/80 hover:text-white p-2">‹</button>
      <div className="relative max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        <div className="flex gap-1 mb-2 px-2">
          {stories.map((_, i) => (
            <div key={i} className={`h-1 flex-1 rounded-full ${i <= idx ? 'bg-white' : 'bg-white/30'}`} />
          ))}
        </div>
        <div className="relative aspect-[9/16] max-h-[80vh] rounded-2xl overflow-hidden bg-ink-900">
          <img src={s.media_url} alt="" className="w-full h-full object-cover" />
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <Avatar url={profile.avatar_url} username={profile.username} size={32} />
            <span className="text-white text-sm font-semibold">{profile.username}</span>
          </div>
        </div>
      </div>
      <button onClick={(e) => { e.stopPropagation(); next() }} className="absolute right-4 text-white/80 hover:text-white p-2">›</button>
    </div>
  )
}
