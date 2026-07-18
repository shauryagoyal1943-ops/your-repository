import { useState } from 'react'
import { useExplore } from '../lib/hooks'
import { SearchIcon } from '../components/icons'
import { Avatar } from '../components/Avatar'
import { Link } from 'react-router-dom'
import { Spinner } from '../components/Loaders'
import WorldCupSection from '../components/WorldCupSection'
import TrendingImages from '../components/TrendingImages'
import LearnSection from '../components/LearnSection'

export default function ExplorePage() {
  const [q, setQ] = useState('')
  const { data, isLoading } = useExplore(q)

  return (
    <div className="px-4 md:px-0 py-4 md:py-0 space-y-6">
      <div className="relative">
        <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-ink-400" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search people or posts"
          className="input pl-11"
        />
      </div>

      <WorldCupSection />
      <TrendingImages />
      <LearnSection />

      {isLoading && <div className="card p-10 flex justify-center"><Spinner /></div>}

      {!isLoading && q.trim() && data && data.users.length > 0 && (
        <div className="card p-4 space-y-2">
          <p className="text-xs font-semibold text-ink-500 dark:text-ink-400 uppercase tracking-wide">People</p>
          {data.users.map((u) => (
            <Link key={u.id} to={`/u/${u.username}`} className="flex items-center gap-3 p-2 rounded-xl hover:bg-ink-50 dark:hover:bg-ink-800">
              <Avatar url={u.avatar_url} username={u.username} size={40} />
              <div>
                <p className="font-semibold text-sm">{u.username}</p>
                <p className="text-xs text-ink-500 dark:text-ink-400">{u.full_name || u.bio || 'CONNECT member'}</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div>
        <p className="text-xs font-semibold text-ink-500 dark:text-ink-400 uppercase tracking-wide mb-3 px-1">
          {q.trim() ? 'Posts' : 'Explore grid'}
        </p>
        {data && data.posts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {data.posts.map((p) => (
              <Link to={`/u/${p.profile.username}`} key={p.id} className="group relative aspect-square rounded-xl overflow-hidden bg-ink-100 dark:bg-ink-800">
                {p.media_urls[0] && <img src={p.media_urls[0]} alt="" className="w-full h-full object-cover group-hover:scale-105 transition" />}
                <div className="absolute inset-0 bg-gradient-to-t from-ink-900/60 to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-3">
                  <span className="text-white text-xs font-medium truncate">@{p.profile.username}</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          !isLoading && <p className="text-ink-500 dark:text-ink-400 text-sm px-1">No results.</p>
        )}
      </div>
    </div>
  )
}
