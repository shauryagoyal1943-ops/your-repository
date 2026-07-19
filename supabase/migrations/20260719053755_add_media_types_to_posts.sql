/*
# Add media_types column to posts

## Overview
Posts currently store only `media_urls` (text[]). To support mixed image/video
posts in the feed, we add a parallel `media_types` array (text[]) that records
the MIME type or a simple 'image'/'video' tag for each URL at the same index.

## Changes
1. Add `media_types text[] DEFAULT '{}'` to `posts`.
2. Backfill existing rows with 'image' for every existing media_url.

## Security
No RLS changes. Existing policies cover the new column automatically.
*/

ALTER TABLE posts ADD COLUMN IF NOT EXISTS media_types text[] DEFAULT '{}';

UPDATE posts
SET media_types = ARRAY(SELECT 'image' FROM unnest(media_urls))
WHERE media_urls IS NOT NULL AND array_length(media_urls, 1) > 0 AND array_length(media_types, 1) IS NULL;
