-- ============================================
-- OurSpace Supabase Setup SQL
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. Create posts table
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Grant table-level permissions
GRANT SELECT ON public.posts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.posts TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- 3. Enable RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- 3. Everyone can read (browse mode)
CREATE POLICY "Anyone can view posts"
  ON posts FOR SELECT
  USING (true);

-- 4. Only authenticated users can insert/update/delete
CREATE POLICY "Authenticated users can insert"
  ON posts FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update"
  ON posts FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete"
  ON posts FOR DELETE
  USING (auth.role() = 'authenticated');

-- 5. Insert a default row
INSERT INTO posts (image_url, content)
VALUES ('', 'Every moment with you is a treasure I keep in my heart.')
ON CONFLICT DO NOTHING;

-- ============================================
-- Storage Bucket Setup
-- Run this in Supabase SQL Editor as well
-- ============================================

-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public)
VALUES ('ourspace-images', 'ourspace-images', true)
ON CONFLICT (id) DO NOTHING;

-- Grant storage permissions
GRANT SELECT ON storage.objects TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON storage.objects TO authenticated;

-- Allow public to view images
CREATE POLICY "Anyone can view images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'ourspace-images');

-- Allow authenticated users to upload/update/delete
CREATE POLICY "Authenticated users can upload images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'ourspace-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'ourspace-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'ourspace-images' AND auth.role() = 'authenticated');
