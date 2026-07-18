import { useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  useProfile, useUserPosts, useUpdateProfile, useFollowCounts, useFollow, useIsFollowing,
} from '../lib/hooks'
import { useAuthStore } from '../store/auth'
import { Avatar } from '../components/Avatar'
import { Spinner } from '../components/Loaders'
import { SettingsIcon } from '../components/icons'
import { STOCK_IMAGES } from '../lib/api'

export default function ProfilePage() {
  const { username } = useParams()
  const { data: profile, isLoading } = useProfile(username || '')
  const me = useAuthStore((s) => s.profile)
  const isMe = profile?.id === me?.id

  if (isLoading) return <div className="p-10 flex justify-center"><Spinner /></div>
  if (!profile) return <div className="card p-10 text-center text-ink-500 dark:text-ink-400">User not found.</div>

  return (
    <div className="px-4 md:px-0 py-4 md:py-0">
      <ProfileHeader profile={profile} isMe={!!isMe} />
      <ProfileGrid userId={profile.id} />
    </div>
  )
}

function ProfileHeader({ profile, isMe }: { profile: any; isMe: boolean }) {
  const { data: counts } = useFollowCounts(profile.id)
  const { data: posts } = useUserPosts(profile.id)
  const { data: following } = useIsFollowing(profile.id)
  const follow = useFollow()
  const update = useUpdateProfile()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ full_name: profile.full_name || '', bio: profile.bio || '', avatar_url: profile.avatar_url || '' })

  async function save() {
    await update.mutateAsync(form)
    setEditing(false)
  }

  return (
    <div className="card p-5 mb-4">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
        <Avatar url={profile.avatar_url} username={profile.username} size={96} ring />
        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <h1 className="font-display font-extrabold text-xl">{profile.username}</h1>
            {isMe ? (
              <button onClick={() => setEditing((v) => !v)} className="btn-ghost text-xs px-3 py-1.5">
                <SettingsIcon className="h-4 w-4" /> Edit profile
              </button>
            ) : (
              <button
                onClick={() => follow.mutate({ followeeId: profile.id, following: !!following })}
                className={`btn text-xs px-4 py-1.5 ${following ? 'btn-ghost' : 'btn-primary'}`}
              >
                {following ? 'Following' : 'Follow'}
              </button>
            )}
          </div>
          <div className="flex justify-center sm:justify-start gap-6 mt-3 text-sm">
            <span><b className="font-semibold">{posts?.length ?? 0}</b> posts</span>
            <span><b className="font-semibold">{counts?.followers ?? 0}</b> followers</span>
            <span><b className="font-semibold">{counts?.following ?? 0}</b> following</span>
          </div>
          <p className="text-sm text-ink-700 dark:text-ink-200 mt-3">{profile.full_name}</p>
          {profile.bio && <p className="text-sm text-ink-500 dark:text-ink-400 mt-1">{profile.bio}</p>}
        </div>
      </div>

      {editing && (
        <div className="mt-5 border-t border-ink-100 dark:border-ink-800 pt-4 space-y-3 animate-slide-up">
          <div>
            <label className="text-xs font-semibold text-ink-600 dark:text-ink-300 block mb-1">Name</label>
            <input className="input" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
          </div>
          <div>
            <label className="text-xs font-semibold text-ink-600 dark:text-ink-300 block mb-1">Bio</label>
            <textarea className="input min-h-[70px] resize-none" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
          </div>
          <div>
            <label className="text-xs font-semibold text-ink-600 dark:text-ink-300 block mb-1.5">Avatar (pick a stock image)</label>
            <div className="grid grid-cols-6 gap-2">
              {STOCK_IMAGES.slice(0, 6).map((url) => (
                <button
                  key={url}
                  onClick={() => setForm({ ...form, avatar_url: url })}
                  className={`aspect-square rounded-lg overflow-hidden border-2 ${form.avatar_url === url ? 'border-brand-600' : 'border-transparent'}`}
                >
                  <img src={url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={save} className="btn-primary" disabled={update.isPending}>Save</button>
            <button onClick={() => setEditing(false)} className="btn-ghost">Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}

function ProfileGrid({ userId }: { userId: string }) {
  const { data: posts } = useUserPosts(userId)
  if (!posts || posts.length === 0) {
    return <p className="text-center text-ink-500 dark:text-ink-400 text-sm py-10">No posts yet.</p>
  }
  return (
    <div className="grid grid-cols-3 gap-1 sm:gap-2">
      {posts.map((p) => (
        <div key={p.id} className="aspect-square rounded-lg overflow-hidden bg-ink-100 dark:bg-ink-800">
          {p.media_urls[0] && <img src={p.media_urls[0]} alt="" className="w-full h-full object-cover" />}
        </div>
      ))}
    </div>
  )
}
