/*
# Create media storage bucket and policies

## Overview
Creates a public storage bucket `media` for user-uploaded images and videos
(used by posts and reels). Adds RLS policies so any authenticated user can
upload, and anyone (including anon) can read — media is public content.

## Changes
1. New storage bucket `media` (public = true).
2. SELECT policy: anyone can read objects (public media).
3. INSERT policy: authenticated users can upload to a path under their own uid.
4. UPDATE/DELETE policies: owners can modify/delete their own objects.

## Security
- Public read is intentional — feed/reel media must be viewable by all users.
- Writes are restricted to authenticated owners (path must start with their uid).
*/

INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "media_public_read" ON storage.objects;
CREATE POLICY "media_public_read" ON storage.objects FOR SELECT
  TO anon, authenticated USING (bucket_id = 'media');

DROP POLICY IF EXISTS "media_insert_own" ON storage.objects;
CREATE POLICY "media_insert_own" ON storage.objects FOR INSERT
  TO authenticated WITH CHECK (bucket_id = 'media' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "media_update_own" ON storage.objects;
CREATE POLICY "media_update_own" ON storage.objects FOR UPDATE
  TO authenticated USING (bucket_id = 'media' AND (storage.foldername(name))[1] = auth.uid()::text)
  WITH CHECK (bucket_id = 'media' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "media_delete_own" ON storage.objects;
CREATE POLICY "media_delete_own" ON storage.objects FOR DELETE
  TO authenticated USING (bucket_id = 'media' AND (storage.foldername(name))[1] = auth.uid()::text);
