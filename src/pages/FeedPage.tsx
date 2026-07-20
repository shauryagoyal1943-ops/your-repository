import { useFeed, useStories } from '../lib/hooks'
import PostCard from '../components/PostCard'
import StoriesBar from '../components/StoriesBar'
import BlogSection from '../components/BlogSection'
import { Spinner } from '../components/Loaders'

export default function FeedPage() {
  const { data: posts, isLoading } = useFeed()
  const stories = useStories()

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
      <BlogSection />
    </div>
  )
}
