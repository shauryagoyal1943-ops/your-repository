export type Profile = {
  id: string
  username: string
  full_name: string | null
  avatar_url: string | null
  bio: string | null
  website: string | null
  created_at: string
  updated_at: string
}

export type Post = {
  id: string
  user_id: string
  caption: string | null
  media_urls: string[]
  media_types: string[]
  created_at: string
  profile?: Profile
  like_count?: number
  comment_count?: number
  liked_by_me?: boolean
}

export type Comment = {
  id: string
  user_id: string
  post_id: string
  body: string
  created_at: string
  profile?: Profile
}

export type Story = {
  id: string
  user_id: string
  media_url: string
  created_at: string
  profile?: Profile
}

export type Notification = {
  id: string
  user_id: string
  actor_id: string
  type: string
  post_id: string | null
  read: boolean
  created_at: string
  actor?: Profile
}

export type Message = {
  id: string
  sender_id: string
  receiver_id: string
  body: string
  created_at: string
}

export type GameScore = {
  id: string
  user_id: string
  game: string
  score: number
  created_at: string
  profile?: Profile
}

export type Blog = {
  id: string
  title: string
  body: string
  category: string
  author_name: string | null
  cover_emoji: string
  user_id: string | null
  created_at: string
  profile?: Profile
}
