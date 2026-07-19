import { supabase } from './supabase'
import type { Profile } from '../types'

export async function ensureProfile(uid: string, email: string, username: string): Promise<Profile> {
  const { data: existing } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', uid)
    .maybeSingle()
  if (existing) return existing as Profile

  const { data, error } = await supabase
    .from('profiles')
    .insert({ id: uid, username, full_name: username, avatar_url: null })
    .select()
    .maybeSingle()
  if (error) throw error
  return data as Profile
}

export type UploadedMedia = { url: string; type: 'image' | 'video' }

export async function uploadMedia(file: File, kind: 'post' | 'reel' | 'story' = 'post'): Promise<UploadedMedia> {
  const uid = (await supabase.auth.getUser()).data.user?.id
  if (!uid) throw new Error('Not signed in')
  const ext = file.name.split('.').pop()?.toLowerCase() || 'bin'
  const isVideo = file.type.startsWith('video')
  const path = `${uid}/${kind}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
  const { error } = await supabase.storage.from('media').upload(path, file, { upsert: false })
  if (error) throw error
  const { data: pub } = supabase.storage.from('media').getPublicUrl(path)
  return { url: pub.publicUrl, type: isVideo ? 'video' : 'image' }
}

export function avatarFor(p?: { avatar_url?: string | null; username?: string | null; full_name?: string | null } | null) {
  if (p?.avatar_url) return p.avatar_url
  const name = encodeURIComponent(p?.username || p?.full_name || 'user')
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`
}

export function timeAgo(date: string | Date) {
  const d = new Date(date)
  const diff = Date.now() - d.getTime()
  const s = Math.floor(diff / 1000)
  if (s < 60) return 'just now'
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h`
  const days = Math.floor(h / 24)
  if (days < 7) return `${days}d`
  const w = Math.floor(days / 7)
  if (w < 5) return `${w}w`
  return d.toLocaleDateString()
}

export const STOCK_IMAGES = [
  'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=900',
  'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=900',
  'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=900',
  'https://images.pexels.com/photos/3184309/pexels-photo-3184309.jpeg?auto=compress&cs=tinysrgb&w=900',
  'https://images.pexels.com/photos/3184325/pexels-photo-3184325.jpeg?auto=compress&cs=tinysrgb&w=900',
  'https://images.pexels.com/photos/3184405/pexels-photo-3184405.jpeg?auto=compress&cs=tinysrgb&w=900',
  'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=900',
  'https://images.pexels.com/photos/3184435/pexels-photo-3184435.jpeg?auto=compress&cs=tinysrgb&w=900',
  'https://images.pexels.com/photos/3184460/pexels-photo-3184460.jpeg?auto=compress&cs=tinysrgb&w=900',
  'https://images.pexels.com/photos/3184461/pexels-photo-3184461.jpeg?auto=compress&cs=tinysrgb&w=900',
  'https://images.pexels.com/photos/3184469/pexels-photo-3184469.jpeg?auto=compress&cs=tinysrgb&w=900',
  'https://images.pexels.com/photos/3184471/pexels-photo-3184471.jpeg?auto=compress&cs=tinysrgb&w=900',
]

export const STOCK_VIDEOS = [
  'https://videos.pexels.com/video-files/3209828/3209828-uhd_3840_2160_24fps.mp4',
  'https://videos.pexels.com/video-files/3209828/3209828-hd_1920_1080_24fps.mp4',
]

export function randomStockImage() {
  return STOCK_IMAGES[Math.floor(Math.random() * STOCK_IMAGES.length)]
}

export function pickImages(n: number) {
  const shuffled = [...STOCK_IMAGES].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, n)
}
