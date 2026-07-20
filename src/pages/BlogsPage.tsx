import { useState } from 'react'
import { useBlogs, useDeleteBlog } from '../lib/hooks'
import { useAuthStore } from '../store/auth'
import { Avatar } from '../components/Avatar'
import { Spinner } from '../components/Loaders'
import CreateBlogModal from '../components/CreateBlogModal'
import type { Blog } from '../types'

export default function BlogsPage() {
  const { data: blogs, isLoading } = useBlogs()
  const [showCreate, setShowCreate] = useState(false)
  const [openId, setOpenId] = useState<string | null>(null)
  const [filter, setFilter] = useState<string>('All')

  const categories = ['All', ...Array.from(new Set((blogs ?? []).map((b) => b.category)))]
  const filtered = filter === 'All' ? (blogs ?? []) : (blogs ?? []).filter((b) => b.category === filter)
  const open = filtered.find((b) => b.id === openId) || null

  return (
    <div className="px-3 md:px-0 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold">Blogs</h1>
          <p className="text-sm text-ink-500 dark:text-ink-400">Stories, writeups & long-form reads</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="btn-primary text-sm">
          <span className="hidden sm:inline">Write a blog</span>
          <span className="sm:hidden">Write</span>
        </button>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`chip whitespace-nowrap transition ${filter === c ? 'bg-brand-600 text-white' : 'bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-300 hover:bg-ink-200 dark:hover:bg-ink-700'}`}
          >
            {c}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="card p-10 flex items-center justify-center"><Spinner className="h-6 w-6" /></div>
      ) : filtered.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="text-ink-500 dark:text-ink-400">No blogs yet. Tap <span className="font-semibold">Write a blog</span> to share your first story.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {filtered.map((b) => (
            <BlogCard key={b.id} blog={b} onOpen={() => setOpenId(b.id)} />
          ))}
        </div>
      )}

      {open && <BlogReader blog={open} onClose={() => setOpenId(null)} />}
      {showCreate && <CreateBlogModal onClose={() => setShowCreate(false)} />}
    </div>
  )
}

function BlogCard({ blog, onOpen }: { blog: Blog & { profile?: any }; onOpen: () => void }) {
  const profile = useAuthStore((s) => s.profile)
  const del = useDeleteBlog()
  const isOwner = blog.user_id && profile?.id === blog.user_id
  const paragraphs = blog.body.split('\n').filter((p) => p.trim())
  const excerpt = paragraphs[0]?.slice(0, 140) + (paragraphs[0]?.length > 140 ? '…' : '')
  const author = blog.author_name || blog.profile?.username || 'Unknown'
  const readTime = Math.max(1, Math.round(blog.body.split(/\s+/).length / 200))

  return (
    <div className="card p-4 hover:shadow-pop transition cursor-pointer group" onClick={onOpen}>
      <div className="flex items-start gap-3">
        <span className="text-3xl shrink-0">{blog.cover_emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="chip bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-300 text-[10px]">{blog.category}</span>
            <span className="text-[11px] text-ink-400">{readTime} min</span>
          </div>
          <h3 className="font-display font-bold text-base leading-snug group-hover:text-brand-600 dark:group-hover:text-brand-400 transition">{blog.title}</h3>
          <p className="text-xs text-ink-500 dark:text-ink-400 mt-1.5 leading-relaxed line-clamp-3">{excerpt}</p>
          <div className="flex items-center gap-2 mt-3">
            {blog.profile?.avatar_url && <Avatar url={blog.profile.avatar_url} username={author} size={18} />}
            <span className="text-[11px] text-ink-500 dark:text-ink-400 font-medium">{author}</span>
            {isOwner && (
              <button
                onClick={(e) => { e.stopPropagation(); if (confirm('Delete this blog?')) del.mutate(blog.id) }}
                className="ml-auto text-[11px] text-red-500 hover:text-red-600 font-medium"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function BlogReader({ blog, onClose }: { blog: Blog & { profile?: any }; onClose: () => void }) {
  const paragraphs = blog.body.split('\n').filter((p) => p.trim())
  const author = blog.author_name || blog.profile?.username || 'Unknown'
  const readTime = Math.max(1, Math.round(blog.body.split(/\s+/).length / 200))

  return (
    <div className="fixed inset-0 z-50 bg-ink-950/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-6 animate-fade-in" onClick={onClose}>
      <div className="card w-full max-w-2xl max-h-[88vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl p-6 animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-start gap-3">
            <span className="text-4xl">{blog.cover_emoji}</span>
            <div>
              <span className="chip bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-300 text-[10px]">{blog.category}</span>
              <h2 className="font-display font-bold text-xl leading-tight mt-1.5">{blog.title}</h2>
              <div className="flex items-center gap-2 mt-1.5">
                {blog.profile?.avatar_url && <Avatar url={blog.profile.avatar_url} username={author} size={18} />}
                <span className="text-xs text-ink-500 dark:text-ink-400 font-medium">{author}</span>
                <span className="text-xs text-ink-400">· {readTime} min read</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="icon-btn shrink-0">✕</button>
        </div>
        <div className="space-y-4">
          {paragraphs.map((p, i) => (
            <p key={i} className="text-sm text-ink-700 dark:text-ink-300 leading-relaxed">{p}</p>
          ))}
        </div>
      </div>
    </div>
  )
}
