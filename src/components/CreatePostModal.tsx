import { useState } from 'react'
import { useCreatePost } from '../lib/hooks'
import { STOCK_IMAGES } from '../lib/api'
import { CloseIcon } from './icons'

export default function CreatePostModal({ onClose }: { onClose: () => void }) {
  const [caption, setCaption] = useState('')
  const [selected, setSelected] = useState<string[]>([])
  const create = useCreatePost()

  function toggle(url: string) {
    setSelected((s) => (s.includes(url) ? s.filter((u) => u !== url) : [...s, url]))
  }

  async function submit() {
    if (selected.length === 0) return
    await create.mutateAsync({ caption: caption.trim(), media_urls: selected })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 bg-ink-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-white dark:bg-ink-900 rounded-2xl w-full max-w-lg max-h-[88vh] overflow-hidden flex flex-col animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-ink-100 dark:border-ink-800">
          <h3 className="font-display font-bold text-lg">Create post</h3>
          <button onClick={onClose} className="icon-btn"><CloseIcon className="h-5 w-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Write a caption…"
            className="input min-h-[80px] resize-none mb-4"
          />
          <p className="text-xs font-semibold text-ink-600 dark:text-ink-300 mb-2">Choose media (stock)</p>
          <div className="grid grid-cols-3 gap-2">
            {STOCK_IMAGES.map((url) => (
              <button
                key={url}
                onClick={() => toggle(url)}
                className={`relative aspect-square rounded-xl overflow-hidden border-2 transition ${selected.includes(url) ? 'border-brand-600 ring-2 ring-brand-500/30' : 'border-transparent'}`}
              >
                <img src={url} alt="" className="w-full h-full object-cover" />
                {selected.includes(url) && (
                  <span className="absolute top-1 right-1 h-5 w-5 rounded-full bg-brand-600 text-white text-xs grid place-items-center font-bold">
                    {selected.indexOf(url) + 1}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="px-4 py-3 border-t border-ink-100 dark:border-ink-800 flex items-center justify-between">
          <span className="text-sm text-ink-500 dark:text-ink-400">{selected.length} selected</span>
          <button onClick={submit} className="btn-primary" disabled={selected.length === 0 || create.isPending}>
            {create.isPending ? 'Posting…' : 'Share post'}
          </button>
        </div>
      </div>
    </div>
  )
}
