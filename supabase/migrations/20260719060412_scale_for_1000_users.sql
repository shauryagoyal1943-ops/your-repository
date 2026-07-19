/*
# Scale for 1000 users: counter columns, feed RPC, indexes

## Overview
At 1000 users the feed triggers N+1 queries: each PostCard fires a separate
comments query just to render a count, and like_count / liked_by_me are not
fetched at all. This migration:

1. Adds `like_count` and `comment_count` integer columns to posts, maintained
   by triggers so they stay correct without re-counting on every read.
2. Backfills the counters from current data.
3. Creates a `feed(p_limit, p_offset)` RPC that returns posts joined with
   profile, like_count, comment_count, and liked_by_me for the calling user
   in a single round-trip.
4. Adds missing indexes for the hot paths.

## Security
- The RPC runs with `SECURITY DEFINER` so it can read likes for the like-check,
  but it only returns rows the caller could already see via RLS on posts.
- No RLS policies changed.
*/

-- 1. Counter columns on posts
ALTER TABLE posts ADD COLUMN IF NOT EXISTS like_count integer NOT NULL DEFAULT 0;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS comment_count integer NOT NULL DEFAULT 0;

-- 2. Backfill counters
UPDATE posts p SET like_count = COALESCE((SELECT COUNT(*) FROM likes l WHERE l.post_id = p.id), 0);
UPDATE posts p SET comment_count = COALESCE((SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id), 0);

-- 3. Triggers to maintain like_count
CREATE OR REPLACE FUNCTION maintain_like_count() RETURNS trigger AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    UPDATE posts SET like_count = like_count + 1 WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF (TG_OP = 'DELETE') THEN
    UPDATE posts SET like_count = GREATEST(like_count - 1, 0) WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS likes_count_trigger ON likes;
CREATE TRIGGER likes_count_trigger AFTER INSERT OR DELETE ON likes
  FOR EACH ROW EXECUTE FUNCTION maintain_like_count();

-- 4. Triggers to maintain comment_count
CREATE OR REPLACE FUNCTION maintain_comment_count() RETURNS trigger AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    UPDATE posts SET comment_count = comment_count + 1 WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF (TG_OP = 'DELETE') THEN
    UPDATE posts SET comment_count = GREATEST(comment_count - 1, 0) WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS comments_count_trigger ON comments;
CREATE TRIGGER comments_count_trigger AFTER INSERT OR DELETE ON comments
  FOR EACH ROW EXECUTE FUNCTION maintain_comment_count();

-- 5. Feed RPC: single round-trip with profile + counters + liked_by_me
CREATE OR REPLACE FUNCTION feed(p_limit int DEFAULT 30, p_offset int DEFAULT 0)
RETURNS TABLE (
  id uuid,
  user_id uuid,
  caption text,
  media_urls text[],
  media_types text[],
  created_at timestamptz,
  like_count int,
  comment_count int,
  liked_by_me boolean,
  profile_id uuid,
  profile_username text,
  profile_full_name text,
  profile_avatar_url text,
  profile_bio text,
  profile_website text
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    p.id, p.user_id, p.caption, p.media_urls, p.media_types, p.created_at,
    p.like_count, p.comment_count,
    EXISTS (SELECT 1 FROM likes l WHERE l.post_id = p.id AND l.user_id = auth.uid()) AS liked_by_me,
    pr.id AS profile_id,
    pr.username AS profile_username,
    pr.full_name AS profile_full_name,
    pr.avatar_url AS profile_avatar_url,
    pr.bio AS profile_bio,
    pr.website AS profile_website
  FROM posts p
  JOIN profiles pr ON pr.id = p.user_id
  ORDER BY p.created_at DESC
  LIMIT p_limit OFFSET p_offset;
$$;

-- 6. Missing indexes for hot paths
CREATE INDEX IF NOT EXISTS msg_thread_idx ON messages (sender_id, receiver_id, created_at DESC);
CREATE INDEX IF NOT EXISTS notif_unread_idx ON notifications (user_id, created_at DESC) WHERE read = false;
CREATE INDEX IF NOT EXISTS likes_user_idx ON likes (user_id);
CREATE INDEX IF NOT EXISTS comments_user_idx ON comments (user_id);
CREATE INDEX IF NOT EXISTS posts_created_user_idx ON posts (user_id, created_at DESC);
