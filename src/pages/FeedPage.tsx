import { useFeed, useStories, useBlogs } from '../lib/hooks'
import PostCard from '../components/PostCard'
import StoriesBar from '../components/StoriesBar'
import { Spinner } from '../components/Loaders'
import { useNavigate } from 'react-router-dom'
import type { Blog } from '../types'

export default function FeedPage() {
  const { data: posts, isLoading } = useFeed()
  const stories = useStories()
  const { data: blogs } = useBlogs()
  const navigate = useNavigate()
  const topBlogs = (blogs ?? []).slice(0, 4)

  return (
    <div className="px-3 md:px-0 space-y-6">
      <StoriesBar />
      <div className="space-y-5">
        {isLoading ? (
          <div className="card p-10 flex items-center justify-center"><Spinner className="h-6 w-6" /></div>
        ) : posts && posts.length > 0 ? (
          posts.map((p) => <PostCard key={p.id} post={p} />)
        ) : (
          <div className="card p-10 text-center">
            <p className="text-ink-500 dark:text-ink-400">No posts yet. Tap <span className="font-semibold">Create</span> to share your first post.</p>
          </div>
        )}
      </div>

      {topBlogs.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">📖</span>
              <h3 className="font-display font-bold text-base">Stories & Reads</h3>
            </div>
            <button onClick={() => navigate('/blogs')} className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700">
              View all
            </button>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {topBlogs.map((b) => (
              <button
                key={b.id}
                onClick={() => navigate('/blogs')}
                className="card p-4 text-left hover:shadow-pop transition group"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl shrink-0">{b.cover_emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="chip bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-300 text-[10px]">{b.category}</span>
                    </div>
                    <h4 className="font-display font-bold text-sm leading-snug group-hover:text-brand-600 dark:group-hover:text-brand-400 transition">{b.title}</h4>
                    <p className="text-xs text-ink-500 dark:text-ink-400 mt-1.5 leading-relaxed line-clamp-2">
                      {b.body.split('\n').filter((p) => p.trim())[0]?.slice(0, 120)}…
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
