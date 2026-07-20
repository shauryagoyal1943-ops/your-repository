/*
# Create blogs table

1. New Tables
- `blogs`
  - `id` (uuid, primary key)
  - `title` (text, not null) — blog title
  - `body` (text, not null) — full article body (plain text with paragraph breaks)
  - `category` (text, default 'General') — e.g. Football Legend, Cricket Legend
  - `author_name` (text, nullable) — display name for seeded/Wikipedia articles that have no user account
  - `cover_emoji` (text, default '📝') — emoji used as a visual cover
  - `user_id` (uuid, nullable, defaults to auth.uid()) — owner; null for system-seeded content
  - `created_at` (timestamptz, default now())
2. Security
- Enable RLS on `blogs`.
- SELECT: all authenticated users can read every blog (social platform — blogs are shared).
- INSERT: authenticated users can create blogs they own (user_id defaults to auth.uid()).
- UPDATE: owner only.
- DELETE: owner only.
3. Indexes
- Index on created_at for chronological ordering.
*/

CREATE TABLE IF NOT EXISTS blogs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  body text NOT NULL,
  category text NOT NULL DEFAULT 'General',
  author_name text,
  cover_emoji text NOT NULL DEFAULT '📝',
  user_id uuid DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_all_blogs" ON blogs;
CREATE POLICY "select_all_blogs" ON blogs FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "insert_own_blogs" ON blogs;
CREATE POLICY "insert_own_blogs" ON blogs FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_blogs" ON blogs;
CREATE POLICY "update_own_blogs" ON blogs FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_blogs" ON blogs;
CREATE POLICY "delete_own_blogs" ON blogs FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_blogs_created_at ON blogs (created_at DESC);
