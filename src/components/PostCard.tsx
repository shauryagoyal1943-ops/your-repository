import { useState } from 'react'
import type { Post, Profile } from '../types'
import { Avatar } from './Avatar'
import {
  HeartIcon, HeartFilledIcon, CommentIcon, ShareIcon, BookmarkIcon,
  ChevronLeftIcon, ChevronRightIcon,
} from './icons'
import { timeAgo } from '../lib/api'
import { useLikePost, useComments, useAddComment } from '../lib/hooks'
import { useAuthStore } from '../store/auth'

export default function PostCard({ post }: { post: Post & { profile: Profile } }) {
  const me = useAuthStore((s) => s.user?.id)
  const [idx, setIdx] = useState(0)
  const [showComments, setShowComments] = useState(false)
  const [draft, setDraft] = useState('')
  const like = useLikePost()
  const comments = useComments(post.id)
  const addComment = useAddComment(post.id)

  const liked = post.liked_by_me ?? false
  const likeCount = post.like_count ?? 0
  const commentCount = comments.data?.length ?? post.comment_count ?? 0

  function mediaType(i: number): 'image' | 'video' {
    return (post.media_types?.[i] ?? 'image') === 'video' ? 'video' : 'image'
  }

  function onLike() {
    like.mutate({ postId: post.id, liked })
  }

  function submitComment(e: React.FormEvent) {
    e.preventDefault()
    if (!draft.trim()) return
    addComment.mutate(draft.trim())
    setDraft('')
  }

  return (
    <article className="card overflow-hidden animate-fade-in">
      <div className="flex items-center gap-3 px-4 py-3">
        <Avatar url={post.profile.avatar_url} username={post.profile.username} full_name={post.profile.full_name} size={40} ring />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm truncate">{post.profile.username}</p>
          <p className="text-xs text-ink-500 dark:text-ink-400">{timeAgo(post.created_at)}</p>
        </div>
        <button className="icon-btn"><ShareIcon className="h-5 w-5" /></button>
      </div>

      {post.media_urls && post.media_urls.length > 0 && (
        <div className="relative bg-ink-900 aspect-square sm:aspect-[4/5] max-h-[640px]">
          {mediaType(idx) === 'video' ? (
            <video src={post.media_urls[idx]} controls loop playsInline className="w-full h-full object-cover" />
          ) : (
            <img src={post.media_urls[idx]} alt="" className="w-full h-full object-cover" />
          )}
          {post.media_urls.length > 1 && (
            <>
              {idx > 0 && (
                <button onClick={() => setIdx(idx - 1)} className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/80 grid place-items-center text-ink-800 hover:bg-white">
                  <ChevronLeftIcon className="h-5 w-5" />
                </button>
              )}
              {idx < post.media_urls.length - 1 && (
                <button onClick={() => setIdx(idx + 1)} className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/80 grid place-items-center text-ink-800 hover:bg-white">
                  <ChevronRightIcon className="h-5 w-5" />
                </button>
              )}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {post.media_urls.map((_, i) => (
                  <span key={i} className={`h-1.5 w-1.5 rounded-full transition ${i === idx ? 'bg-white' : 'bg-white/50'}`} />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      <div className="flex items-center gap-1 px-3 pt-3">
        <button onClick={onLike} className={`icon-btn ${liked ? 'text-red-500' : ''}`}>
          {liked ? <HeartFilledIcon className="h-6 w-6" /> : <HeartIcon className="h-6 w-6" />}
        </button>
        <button onClick={() => setShowComments((v) => !v)} className="icon-btn"><CommentIcon className="h-6 w-6" /></button>
        <button className="icon-btn"><ShareIcon className="h-6 w-6" /></button>
        <div className="flex-1" />
        <button className="icon-btn"><BookmarkIcon className="h-6 w-6" /></button>
      </div>

      <div className="px-4 pb-3">
        {likeCount > 0 && <p className="text-sm font-semibold mb-1">{likeCount} {likeCount === 1 ? 'like' : 'likes'}</p>}
        {post.caption && (
          <p className="text-sm text-ink-800 dark:text-ink-100">
            <span className="font-semibold mr-1.5">{post.profile.username}</span>
            {post.caption}
          </p>
        )}
        {commentCount > 0 && (
          <button onClick={() => setShowComments((v) => !v)} className="text-sm text-ink-500 dark:text-ink-400 mt-1">
            View all {commentCount} comments
          </button>
        )}
      </div>

      {showComments && (
        <div className="border-t border-ink-100 dark:border-ink-800 px-4 py-3 space-y-3 animate-fade-in">
          {comments.data?.map((c) => (
            <div key={c.id} className="flex items-start gap-2.5">
              <Avatar url={c.profile?.avatar_url} username={c.profile?.username} size={28} />
              <div className="flex-1 min-w-0">
                <p className="text-sm">
                  <span className="font-semibold mr-1.5">{c.profile?.username}</span>
                  {c.body}
                </p>
                <p className="text-xs text-ink-400 dark:text-ink-500 mt-0.5">{timeAgo(c.created_at)}</p>
              </div>
            </div>
          ))}
          <form onSubmit={submitComment} className="flex items-center gap-2 pt-1">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Add a comment…"
              className="input flex-1"
            />
            <button type="submit" className="btn-primary px-3.5" disabled={!draft.trim() || addComment.isPending}>
              Post
            </button>
          </form>
        </div>
      )}
    </article>
  )
}
