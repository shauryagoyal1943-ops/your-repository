import { useState } from 'react'

type Image = {
  id: number
  url: string
  title: string
  author: string
  likes: number
}

const IMAGES: Image[] = [
  { id: 1, url: 'https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg', title: 'Matchday lights', author: '@lenskid', likes: 1240 },
  { id: 2, url: 'https://images.pexels.com/photos/114296/pexels-photo-114296.jpeg', title: 'Golden hour kick-off', author: '@framez', likes: 980 },
  { id: 3, url: 'https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg', title: 'Crowd roar', author: '@shutterup', likes: 2310 },
  { id: 4, url: 'https://images.pexels.com/photos/248547/pexels-photo-248547.jpeg', title: 'Stadium vibes', author: '@pixelia', likes: 1745 },
  { id: 5, url: 'https://images.pexels.com/photos/1170412/pexels-photo-1170412.jpeg', title: 'Training ground', author: '@bootroom', likes: 620 },
  { id: 6, url: 'https://images.pexels.com/photos/1666816/pexels-photo-1666816.jpeg', title: 'Celebration', author: '@goalgetter', likes: 3120 },
]

export default function TrendingImages() {
  const [liked, setLiked] = useState<Set<number>>(new Set())

  function toggle(id: number) {
    setLiked((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="space-y-3">
      <h3 className="font-display font-bold text-base">Trending Images</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {IMAGES.map((img) => {
          const isLiked = liked.has(img.id)
          return (
            <div key={img.id} className="group relative aspect-square rounded-xl overflow-hidden bg-ink-100 dark:bg-ink-800">
              <img
                src={img.url}
                alt={img.title}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-900/70 via-transparent to-transparent" />
              <div className="absolute bottom-0 inset-x-0 p-2.5">
                <p className="text-white text-xs font-semibold truncate">{img.title}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-white/80 text-[11px]">{img.author}</span>
                  <button
                    onClick={() => toggle(img.id)}
                    className="flex items-center gap-1 text-white text-[11px] font-medium hover:scale-110 transition"
                  >
                    <span className={isLiked ? 'text-red-400' : ''}>{isLiked ? '♥' : '♡'}</span>
                    {(img.likes + (isLiked ? 1 : 0)).toLocaleString()}
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
