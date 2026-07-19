import { useState, useRef } from 'react'
import { useCreatePost } from '../lib/hooks'
import { STOCK_IMAGES } from '../lib/api'
import { uploadMedia, type UploadedMedia } from '../lib/api'
import { CloseIcon, ImageIcon } from './icons'

export default function CreatePostModal({ onClose }: { onClose: () => void }) {
  const [caption, setCaption] = useState('')
  const [selected, setSelected] = useState<string[]>([])
  const [uploaded, setUploaded] = useState<UploadedMedia[]>([])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const create = useCreatePost()

  function toggleStock(url: string) {
    setSelected((s) => (s.includes(url) ? s.filter((u) => u !== url) : [...s, url]))
  }

  async function onFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (files.length === 0) return
    setUploading(true)
    setError(null)
    try {
      const results = await Promise.all(files.map((f) => uploadMedia(f, 'post')))
      setUploaded((u) => [...u, ...results])
    } catch (err: any) {
      setError(err.message || 'Upload failed')
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  function removeUploaded(i: number) {
    setUploaded((u) => u.filter((_, idx) => idx !== i))
  }

  async function submit() {
    const urls = [...uploaded.map((u) => u.url), ...selected]
    const types = [...uploaded.map((u) => u.type), ...selected.map(() => 'image')]
    if (urls.length === 0) return
    try {
      await create.mutateAsync({ caption: caption.trim(), media_urls: urls, media_types: types })
      onClose()
    } catch (err: any) {
      setError(err.message || 'Could not create post')
    }
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

          {/* Upload area */}
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="w-full border-2 border-dashed border-ink-200 dark:border-ink-700 rounded-xl p-5 flex flex-col items-center gap-2 text-ink-500 dark:text-ink-400 hover:border-brand-400 hover:text-brand-600 transition mb-3 disabled:opacity-50"
          >
            <ImageIcon className="h-7 w-7" />
            <span className="text-sm font-medium">{uploading ? 'Uploading…' : 'Upload photos or videos'}</span>
            <span className="text-xs text-ink-400">Tap to select from your device</span>
          </button>
          <input ref={fileRef} type="file" accept="image/*,video/*" multiple onChange={onFiles} className="hidden" />

          {error && <p className="text-sm text-red-600 mb-3">{error}</p>}

          {/* Uploaded previews */}
          {uploaded.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mb-4">
              {uploaded.map((m, i) => (
                <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-ink-100 dark:bg-ink-800">
                  {m.type === 'video' ? (
                    <video src={m.url} className="w-full h-full object-cover" muted />
                  ) : (
                    <img src={m.url} alt="" className="w-full h-full object-cover" />
                  )}
                  <span className="absolute top-1 left-1 chip bg-ink-900/70 text-white text-[10px] px-2 py-0.5">
                    {m.type === 'video' ? 'VIDEO' : 'PHOTO'}
                  </span>
                  <button onClick={() => removeUploaded(i)} className="absolute top-1 right-1 h-5 w-5 rounded-full bg-ink-900/70 text-white grid place-items-center text-xs">✕</button>
                </div>
              ))}
            </div>
          )}

          <p className="text-xs font-semibold text-ink-600 dark:text-ink-300 mb-2">Or pick stock photos</p>
          <div className="grid grid-cols-3 gap-2">
            {STOCK_IMAGES.map((url) => (
              <button
                key={url}
                onClick={() => toggleStock(url)}
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
          <span className="text-sm text-ink-500 dark:text-ink-400">{uploaded.length + selected.length} selected</span>
          <button onClick={submit} className="btn-primary" disabled={uploaded.length + selected.length === 0 || create.isPending || uploading}>
            {create.isPending ? 'Posting…' : 'Share post'}
          </button>
        </div>
      </div>
    </div>
  )
}
