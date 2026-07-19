/*
# Add direct foreign keys to profiles for PostgREST joins

## Overview
The frontend queries use `select=*,profile:profiles!<fkey>(*)` to join user-owned
tables to the profiles table. However, the existing user_id foreign keys point to
`auth.users(id)`, not `profiles(id)`. PostgREST cannot resolve the implied
relationship through auth.users, so it throws PGRST200 ("no relationship found").

## Changes
Adds a redundant FK constraint from the `user_id` column of each user-owned table
directly to `profiles(id)`. Since `profiles.id` itself references `auth.users(id)`
1:1, these constraints are semantically equivalent to the existing auth.users FKs
but give PostgREST a direct path for the join.

## Tables modified
1. posts.user_id -> profiles(id) ON DELETE CASCADE
2. stories.user_id -> profiles(id) ON DELETE CASCADE
3. reels.user_id -> profiles(id) ON DELETE CASCADE
4. comments.user_id -> profiles(id) ON DELETE CASCADE
5. likes.user_id -> profiles(id) ON DELETE CASCADE
6. game_scores.user_id -> profiles(id) ON DELETE CASCADE
7. notifications.actor_id -> profiles(id) ON DELETE CASCADE
8. messages.sender_id -> profiles(id) ON DELETE CASCADE
9. messages.receiver_id -> profiles(id) ON DELETE CASCADE

## Security
No RLS changes. Existing policies remain intact.

## Notes
- These are ADDITIVE constraints; no data is lost.
- A column can have multiple FK constraints in Postgres.
- IF NOT EXISTS guard via DO block makes this idempotent.
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'posts_user_id_profiles_fkey' AND conrelid = 'posts'::regclass
  ) THEN
    ALTER TABLE posts ADD CONSTRAINT posts_user_id_profiles_fkey
      FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'stories_user_id_profiles_fkey' AND conrelid = 'stories'::regclass
  ) THEN
    ALTER TABLE stories ADD CONSTRAINT stories_user_id_profiles_fkey
      FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'reels_user_id_profiles_fkey' AND conrelid = 'reels'::regclass
  ) THEN
    ALTER TABLE reels ADD CONSTRAINT reels_user_id_profiles_fkey
      FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'comments_user_id_profiles_fkey' AND conrelid = 'comments'::regclass
  ) THEN
    ALTER TABLE comments ADD CONSTRAINT comments_user_id_profiles_fkey
      FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'likes_user_id_profiles_fkey' AND conrelid = 'likes'::regclass
  ) THEN
    ALTER TABLE likes ADD CONSTRAINT likes_user_id_profiles_fkey
      FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'game_scores_user_id_profiles_fkey' AND conrelid = 'game_scores'::regclass
  ) THEN
    ALTER TABLE game_scores ADD CONSTRAINT game_scores_user_id_profiles_fkey
      FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'notifications_actor_id_profiles_fkey' AND conrelid = 'notifications'::regclass
  ) THEN
    ALTER TABLE notifications ADD CONSTRAINT notifications_actor_id_profiles_fkey
      FOREIGN KEY (actor_id) REFERENCES profiles(id) ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'messages_sender_id_profiles_fkey' AND conrelid = 'messages'::regclass
  ) THEN
    ALTER TABLE messages ADD CONSTRAINT messages_sender_id_profiles_fkey
      FOREIGN KEY (sender_id) REFERENCES profiles(id) ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'messages_receiver_id_profiles_fkey' AND conrelid = 'messages'::regclass
  ) THEN
    ALTER TABLE messages ADD CONSTRAINT messages_receiver_id_profiles_fkey
      FOREIGN KEY (receiver_id) REFERENCES profiles(id) ON DELETE CASCADE;
  END IF;
END $$;
