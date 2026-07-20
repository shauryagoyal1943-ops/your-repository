import { useState } from 'react'
import { useCreateBlog } from '../lib/hooks'
import { CloseIcon } from './icons'

const EMOJIS = ['📝', '⚽', '🏏', '🏀', '🏆', '🎯', '📖', '💡', '🌟', '🔥', '🎮', '🎵']
const CATEGORIES = ['General', 'Football', 'Cricket', 'Gaming', 'Tech', 'Lifestyle', 'Opinion', 'Story']

export default function CreateBlogModal({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [category, setCategory] = useState('General')
  const [emoji, setEmoji] = useState('📝')
  const [error, setError] = useState<string | null>(null)
  const create = useCreateBlog()

  async function submit() {
    if (title.trim().length < 3) { setError('Title must be at least 3 characters'); return }
    if (body.trim().length < 20) { setError('Writeup must be at least 20 characters'); return }
    setError(null)
    try {
      await create.mutateAsync({ title: title.trim(), body: body.trim(), category, cover_emoji: emoji })
      onClose()
    } catch (err: any) {
      setError(err.message || 'Could not publish blog')
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-ink-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-white dark:bg-ink-900 rounded-2xl w-full max-w-lg max-h-[88vh] overflow-hidden flex flex-col animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-ink-100 dark:border-ink-800">
          <h3 className="font-display font-bold text-lg">Write a blog</h3>
          <button onClick={onClose} className="icon-btn"><CloseIcon className="h-5 w-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            {EMOJIS.map((e) => (
              <button
                key={e}
                onClick={() => setEmoji(e)}
                className={`h-9 w-9 rounded-lg text-lg grid place-items-center transition ${emoji === e ? 'bg-brand-100 ring-2 ring-brand-500 dark:bg-brand-900/40' : 'bg-ink-100 dark:bg-ink-800 hover:bg-ink-200 dark:hover:bg-ink-700'}`}
              >
                {e}
              </button>
            ))}
          </div>

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Blog title…"
            className="input text-lg font-display font-bold"
            maxLength={120}
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input"
          >
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>

          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write your story here… Use blank lines to separate paragraphs."
            className="input min-h-[200px] resize-y text-sm leading-relaxed"
            maxLength={10000}
          />
          <p className="text-xs text-ink-400 text-right">{body.length} / 10000</p>

          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        <div className="px-5 py-3.5 border-t border-ink-100 dark:border-ink-800 flex items-center justify-end gap-3">
          <button onClick={onClose} className="btn-ghost">Cancel</button>
          <button onClick={submit} className="btn-primary" disabled={create.isPending}>
            {create.isPending ? 'Publishing…' : 'Publish blog'}
          </button>
        </div>
      </div>
    </div>
  )
}
