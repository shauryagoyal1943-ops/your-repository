import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from './supabase'
import { useAuthStore } from '../store/auth'
import type { Post, Comment, Story, Notification, Message, GameScore, Profile, Blog } from '../types'
import { pickImages } from './api'

const uid = () => useAuthStore.getState().user?.id

/* ---------- Feed ---------- */
export function useFeed(offset = 0) {
  return useQuery({
    queryKey: ['feed', offset],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('feed', { p_limit: 30, p_offset: offset })
      if (error) throw error
      return ((data ?? []) as any[]).map((r) => ({
        id: r.id,
        user_id: r.user_id,
        caption: r.caption,
        media_urls: r.media_urls ?? [],
        media_types: r.media_types ?? [],
        created_at: r.created_at,
        like_count: r.like_count ?? 0,
        comment_count: r.comment_count ?? 0,
        liked_by_me: r.liked_by_me ?? false,
        profile: {
          id: r.profile_id,
          username: r.profile_username,
          full_name: r.profile_full_name,
          avatar_url: r.profile_avatar_url,
          bio: r.profile_bio,
          website: r.profile_website,
        } as Profile,
      })) as (Post & { profile: Profile })[]
    },
  })
}

export function useCreatePost() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (vars: { caption: string; media_urls: string[]; media_types?: string[] }) => {
      const { data, error } = await supabase
        .from('posts')
        .insert({
          caption: vars.caption,
          media_urls: vars.media_urls,
          media_types: vars.media_types ?? vars.media_urls.map(() => 'image'),
          user_id: uid(),
        })
        .select()
        .maybeSingle()
      if (error) throw error
      return data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['feed'] }),
  })
}

/* ---------- Likes ---------- */
export function useLikePost() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ postId, liked }: { postId: string; liked: boolean }) => {
      if (liked) {
        const { error } = await supabase.from('likes').delete().eq('post_id', postId).eq('user_id', uid())
        if (error) throw error
      } else {
        const { error } = await supabase.from('likes').insert({ post_id: postId, user_id: uid() })
        if (error) throw error
        await supabase.from('notifications').insert({
          user_id: (await supabase.from('posts').select('user_id').eq('id', postId).maybeSingle()).data?.user_id,
          actor_id: uid(),
          type: 'like',
          post_id: postId,
        })
      }
    },
    onMutate: async ({ postId, liked }) => {
      await qc.cancelQueries({ queryKey: ['feed'] })
      const prev = qc.getQueriesData<{ id: string; liked_by_me?: boolean; like_count?: number }[]>({ queryKey: ['feed'] })
      qc.setQueriesData<{ id: string; liked_by_me?: boolean; like_count?: number }[]>(
        { queryKey: ['feed'] },
        (old) => old?.map((p) => p.id === postId
          ? { ...p, liked_by_me: !liked, like_count: (p.like_count ?? 0) + (liked ? -1 : 1) }
          : p),
      )
      return { prev }
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.prev) qc.setQueriesData({ queryKey: ['feed'] }, ctx.prev)
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ['feed'] }),
  })
}

/* ---------- Comments ---------- */
export function useComments(postId: string, enabled = true) {
  return useQuery({
    queryKey: ['comments', postId],
    enabled,
    queryFn: async () => {
      const { data } = await supabase
        .from('comments')
        .select('*, profile:profiles!comments_user_id_profiles_fkey(*)')
        .eq('post_id', postId)
        .order('created_at', { ascending: true })
      return (data as any as (Comment & { profile: Profile })[]) ?? []
    },
  })
}

export function useAddComment(postId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (body: string) => {
      const { data, error } = await supabase
        .from('comments')
        .insert({ post_id: postId, body, user_id: uid() })
        .select('*, profile:profiles!comments_user_id_profiles_fkey(*)')
        .maybeSingle()
      if (error) throw error
      const post = (await supabase.from('posts').select('user_id').eq('id', postId).maybeSingle()).data
      if (post && post.user_id !== uid()) {
        await supabase.from('notifications').insert({
          user_id: post.user_id, actor_id: uid(), type: 'comment', post_id: postId,
        })
      }
      return data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['comments', postId] }),
  })
}

/* ---------- Stories ---------- */
export function useStories() {
  return useQuery({
    queryKey: ['stories'],
    queryFn: async () => {
      const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      const { data } = await supabase
        .from('stories')
        .select('*, profile:profiles!stories_user_id_profiles_fkey(*)')
        .gte('created_at', since)
        .order('created_at', { ascending: false })
      return (data as any as (Story & { profile: Profile })[]) ?? []
    },
  })
}

export function useCreateStory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (media_url: string) => {
      const { error } = await supabase.from('stories').insert({ media_url, user_id: uid() })
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['stories'] }),
  })
}

/* ---------- Profiles ---------- */
export function useProfile(username: string) {
  return useQuery({
    queryKey: ['profile', username],
    queryFn: async () => {
      const { data } = await supabase.from('profiles').select('*').eq('username', username).maybeSingle()
      return data as Profile | null
    },
    enabled: !!username,
  })
}

export function useUserPosts(userId: string) {
  return useQuery({
    queryKey: ['userPosts', userId],
    queryFn: async () => {
      const { data } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      return (data as Post[]) ?? []
    },
    enabled: !!userId,
  })
}

export function useUpdateProfile() {
  const qc = useQueryClient()
  const setProfile = useAuthStore((s) => s.setProfile)
  return useMutation({
    mutationFn: async (vars: Partial<Profile>) => {
      const { data, error } = await supabase.from('profiles').update(vars).eq('id', uid()).select().maybeSingle()
      if (error) throw error
      return data as Profile
    },
    onSuccess: (p) => {
      setProfile(p)
      qc.invalidateQueries({ queryKey: ['profile'] })
    },
  })
}

export function useFollowCounts(userId: string) {
  return useQuery({
    queryKey: ['followCounts', userId],
    queryFn: async () => {
      const [f, fl] = await Promise.all([
        supabase.from('follows').select('follower_id', { count: 'exact', head: true }).eq('followee_id', userId),
        supabase.from('follows').select('followee_id', { count: 'exact', head: true }).eq('follower_id', userId),
      ])
      return { followers: f.count ?? 0, following: fl.count ?? 0 }
    },
    enabled: !!userId,
  })
}

export function useFollow() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ followeeId, following }: { followeeId: string; following: boolean }) => {
      if (following) {
        await supabase.from('follows').delete().eq('follower_id', uid()).eq('followee_id', followeeId)
      } else {
        await supabase.from('follows').insert({ follower_id: uid(), followee_id: followeeId })
        await supabase.from('notifications').insert({ user_id: followeeId, actor_id: uid(), type: 'follow' })
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['followCounts'] }),
  })
}

export function useIsFollowing(followeeId: string) {
  return useQuery({
    queryKey: ['isFollowing', followeeId],
    queryFn: async () => {
      const { data } = await supabase
        .from('follows')
        .select('follower_id')
        .eq('follower_id', uid())
        .eq('followee_id', followeeId)
        .maybeSingle()
      return !!data
    },
    enabled: !!followeeId,
  })
}

/* ---------- Notifications ---------- */
export function useNotifications() {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const { data } = await supabase
        .from('notifications')
        .select('*, actor:profiles!notifications_actor_id_profiles_fkey(*)')
        .order('created_at', { ascending: false })
        .limit(50)
      return (data as any as (Notification & { actor: Profile })[]) ?? []
    },
  })
}

export function useMarkNotificationsRead() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      await supabase.from('notifications').update({ read: true }).eq('read', false).eq('user_id', uid())
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  })
}

/* ---------- Messages ---------- */
export function useConversations() {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      const me = uid()
      const { data } = await supabase
        .from('messages')
        .select('*, sender:profiles!messages_sender_id_profiles_fkey(*), receiver:profiles!messages_receiver_id_profiles_fkey(*)')
        .or(`sender_id.eq.${me},receiver_id.eq.${me}`)
        .order('created_at', { ascending: false })
      const map = new Map<string, { partner: Profile; last: Message }>()
      for (const m of (data as any as (Message & { sender: Profile; receiver: Profile })[]) ?? []) {
        const partner = m.sender_id === me ? m.receiver : m.sender
        const key = partner.id
        if (!map.has(key)) map.set(key, { partner, last: m })
      }
      return Array.from(map.values())
    },
  })
}

export function useThread(partnerId: string) {
  return useQuery({
    queryKey: ['thread', partnerId],
    queryFn: async () => {
      const me = uid()
      const { data } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${me},receiver_id.eq.${partnerId}),and(sender_id.eq.${partnerId},receiver_id.eq.${me}))`)
        .order('created_at', { ascending: true })
      return (data as Message[]) ?? []
    },
    enabled: !!partnerId,
  })
}

export function useSendMessage(receiverId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (body: string) => {
      const { data, error } = await supabase
        .from('messages')
        .insert({ sender_id: uid(), receiver_id: receiverId, body })
        .select()
        .maybeSingle()
      if (error) throw error
      return data as Message
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['thread', receiverId] })
      qc.invalidateQueries({ queryKey: ['conversations'] })
    },
  })
}

/* ---------- Explore ---------- */
export function useExplore(query: string) {
  return useQuery({
    queryKey: ['explore', query],
    queryFn: async () => {
      if (query.trim()) {
        const { data: users } = await supabase
          .from('profiles')
          .select('*')
          .ilike('username', `%${query}%`)
          .limit(10)
        const { data: posts } = await supabase
          .from('posts')
          .select('*, profile:profiles!posts_user_id_profiles_fkey(*)')
          .ilike('caption', `%${query}%`)
          .limit(20)
        return { users: (users as Profile[]) ?? [], posts: (posts as any as (Post & { profile: Profile })[]) ?? [] }
      }
      const { data: posts } = await supabase
        .from('posts')
        .select('*, profile:profiles!posts_user_id_profiles_fkey(*)')
        .order('created_at', { ascending: false })
        .limit(30)
      return { users: [] as Profile[], posts: (posts as any as (Post & { profile: Profile })[]) ?? [] }
    },
  })
}

/* ---------- Games ---------- */
export function useLeaderboard(game: string) {
  return useQuery({
    queryKey: ['leaderboard', game],
    queryFn: async () => {
      const { data } = await supabase
        .from('game_scores')
        .select('*, profile:profiles!game_scores_user_id_profiles_fkey(*)')
        .eq('game', game)
        .order('score', { ascending: false })
        .limit(10)
      return (data as any as (GameScore & { profile: Profile })[]) ?? []
    },
  })
}

export function useSubmitScore() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (vars: { game: string; score: number }) => {
      const { error } = await supabase.from('game_scores').insert({ ...vars, user_id: uid() })
      if (error) throw error
    },
    onSuccess: (_d, vars) => qc.invalidateQueries({ queryKey: ['leaderboard', vars.game] }),
  })
}

/* ---------- Blogs ---------- */
export function useBlogs() {
  return useQuery({
    queryKey: ['blogs'],
    queryFn: async () => {
      const { data } = await supabase
        .from('blogs')
        .select('*, profile:profiles!blogs_user_id_profiles_fkey(*)')
        .order('created_at', { ascending: false })
      return (data as any as (Blog & { profile: Profile })[]) ?? []
    },
  })
}

export function useCreateBlog() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (vars: { title: string; body: string; category: string; cover_emoji: string }) => {
      const { error } = await supabase.from('blogs').insert({ ...vars, user_id: uid() })
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['blogs'] }),
  })
}

export function useDeleteBlog() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('blogs').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['blogs'] }),
  })
}
