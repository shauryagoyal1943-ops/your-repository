import { useEffect, useRef, useState } from 'react'
import { useReels } from '../lib/hooks'
import { Avatar } from '../components/Avatar'
import { PlayIcon, MuteIcon, VolumeIcon, HeartIcon, CommentIcon, ShareIcon } from '../components/icons'
import { Spinner } from '../components/Loaders'

export default function ReelsPage() {
  const { data, isLoading } = useReels()
  const [active, setActive] = useState(0)
  const [muted, setMuted] = useState(true)
  const refs = useRef<(HTMLVideoElement | null)[]>([])

  useEffect(() => {
    refs.current.forEach((v, i) => {
      if (!v) return
      if (i === active) v.play().catch(() => {})
      else v.pause()
    })
  }, [active, data])

  if (isLoading) return <div className="h-[80vh] grid place-items-center"><Spinner className="h-8 w-8" /></div>
  if (!data || data.length === 0) {
    return <div className="card p-10 text-center text-ink-500">No reels yet.</div>
  }

  return (
    <div className="h-[calc(100vh-3.5rem)] md:h-[calc(100vh-3rem)] overflow-y-auto snap-y snap-mandatory no-scrollbar">
      {data.map((r, i) => (
        <div key={r.id} className="snap-start h-full relative flex items-center justify-center bg-ink-950">
          <video
            ref={(el) => { refs.current[i] = el }}
            src={r.video_url}
            loop
            muted={muted}
            playsInline
            onClick={() => { const v = refs.current[i]; if (!v) return; if (v.paused) v.play(); else v.pause() }}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-transparent to-transparent pointer-events-none" />

          <button
            onClick={() => setMuted((m) => !m)}
            className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/20 backdrop-blur grid place-items-center text-white"
          >
            {muted ? <MuteIcon className="h-5 w-5" /> : <VolumeIcon className="h-5 w-5" />}
          </button>

          {/* Right action rail */}
          <div className="absolute right-3 bottom-24 flex flex-col items-center gap-5 text-white">
            <RailButton Icon={HeartIcon} label="0" />
            <RailButton Icon={CommentIcon} label="0" />
            <RailButton Icon={ShareIcon} label="Share" />
          </div>

          {/* Caption */}
          <div className="absolute left-4 bottom-24 right-20 text-white">
            <div className="flex items-center gap-2.5 mb-2">
              <Avatar url={r.profile.avatar_url} username={r.profile.username} size={36} ring />
              <span className="font-semibold text-sm">{r.profile.username}</span>
              <button className="ml-1 text-xs font-semibold border border-white/60 rounded-full px-3 py-1 hover:bg-white/10">Follow</button>
            </div>
            {r.caption && <p className="text-sm text-white/90 line-clamp-2">{r.caption}</p>}
          </div>
        </div>
      ))}
    </div>
  )
}

function RailButton({ Icon, label }: { Icon: (p: any) => JSX.Element; label: string }) {
  return (
    <button className="flex flex-col items-center gap-1 active:scale-90 transition">
      <Icon className="h-7 w-7" />
      <span className="text-xs font-medium">{label}</span>
    </button>
  )
}
