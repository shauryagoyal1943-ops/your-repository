import { useState, useRef } from 'react'
import { useCreateReel } from '../lib/hooks'
import { uploadMedia } from '../lib/api'
import { CloseIcon } from './icons'

export default function CreateReelModal({ onClose }: { onClose: () => void }) {
  const [caption, setCaption] = useState('')
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const create = useCreateReel()

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('video')) {
      setError('Please select a video file')
      return
    }
    setUploading(true)
    setError(null)
    try {
      const { url } = await uploadMedia(file, 'reel')
      setVideoUrl(url)
    } catch (err: any) {
      setError(err.message || 'Upload failed')
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  async function submit() {
    if (!videoUrl) return
    try {
      await create.mutateAsync({ caption: caption.trim(), video_url: videoUrl })
      onClose()
    } catch (err: any) {
      setError(err.message || 'Could not create reel')
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-ink-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-white dark:bg-ink-900 rounded-2xl w-full max-w-md max-h-[88vh] overflow-hidden flex flex-col animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-ink-100 dark:border-ink-800">
          <h3 className="font-display font-bold text-lg">Create reel</h3>
          <button onClick={onClose} className="icon-btn"><CloseIcon className="h-5 w-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {!videoUrl ? (
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="w-full border-2 border-dashed border-ink-200 dark:border-ink-700 rounded-xl p-8 flex flex-col items-center gap-3 text-ink-500 dark:text-ink-400 hover:border-brand-400 hover:text-brand-600 transition disabled:opacity-50"
            >
              <svg viewBox="0 0 24 24" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth={2}><rect x="2" y="6" width="20" height="12" rx="4" /><path d="M10 9l5 3-5 3z" fill="currentColor" stroke="none" /></svg>
              <span className="text-sm font-medium">{uploading ? 'Uploading…' : 'Upload a short video'}</span>
              <span className="text-xs text-ink-400">MP4, MOV, or WebM</span>
            </button>
          ) : (
            <div className="relative aspect-[9/16] max-h-[50vh] mx-auto rounded-xl overflow-hidden bg-ink-900">
              <video src={videoUrl} className="w-full h-full object-cover" controls loop muted />
              <button onClick={() => setVideoUrl(null)} className="absolute top-2 right-2 h-7 w-7 rounded-full bg-ink-900/70 text-white grid place-items-center">✕</button>
            </div>
          )}
          <input ref={fileRef} type="file" accept="video/*" onChange={onFile} className="hidden" />

          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Write a caption…"
            className="input min-h-[72px] resize-none"
          />

          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        <div className="px-4 py-3 border-t border-ink-100 dark:border-ink-800 flex items-center justify-end gap-3">
          <button onClick={onClose} className="btn-ghost">Cancel</button>
          <button onClick={submit} className="btn-primary" disabled={!videoUrl || create.isPending || uploading}>
            {create.isPending ? 'Publishing…' : 'Publish reel'}
          </button>
        </div>
      </div>
    </div>
  )
}
