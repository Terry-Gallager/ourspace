-- ============================================
-- OurSpace - Phase 1: Gallery + Milestones Tables
-- Run this AFTER supabase-setup.sql
-- ============================================

-- 1. gallery_posts table
CREATE TABLE IF NOT EXISTS gallery_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL DEFAULT '',
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  description TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

GRANT SELECT ON gallery_posts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON gallery_posts TO authenticated;

ALTER TABLE gallery_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view gallery"
  ON gallery_posts FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert gallery"
  ON gallery_posts FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update gallery"
  ON gallery_posts FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete gallery"
  ON gallery_posts FOR DELETE USING (auth.role() = 'authenticated');


-- 2. milestones table
CREATE TABLE IF NOT EXISTS milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  title TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  icon TEXT NOT NULL DEFAULT '💖',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

GRANT SELECT ON milestones TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON milestones TO authenticated;

ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view milestones"
  ON milestones FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert milestones"
  ON milestones FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update milestones"
  ON milestones FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete milestones"
  ON milestones FOR DELETE USING (auth.role() = 'authenticated');


-- 3. Insert default data
INSERT INTO milestones (date, title, description, icon)
VALUES ('2026-02-28', '我们在一起了 💕', '从这一天起，世界变得不一样', '💕')
ON CONFLICT DO NOTHING;

INSERT INTO gallery_posts (image_url, date, description)
VALUES ('/placeholder.svg', '2026-02-28', '在一起的第一天')
ON CONFLICT DO NOTHING;

-- ============================================
-- Migration: Add video support columns
-- Run this if gallery_posts already exists
-- ============================================
ALTER TABLE gallery_posts ADD COLUMN IF NOT EXISTS video_url TEXT;
ALTER TABLE gallery_posts ADD COLUMN IF NOT EXISTS cover_url TEXT;

-- ============================================
-- Phase 5: Gallery Albums (multiple items per entry)
-- ============================================
DROP POLICY IF EXISTS "Anyone can view albums" ON gallery_albums;
DROP POLICY IF EXISTS "Authenticated users can insert albums" ON gallery_albums;
DROP POLICY IF EXISTS "Authenticated users can update albums" ON gallery_albums;
DROP POLICY IF EXISTS "Authenticated users can delete albums" ON gallery_albums;
DROP POLICY IF EXISTS "Anyone can view items" ON gallery_items;
DROP POLICY IF EXISTS "Authenticated users can insert items" ON gallery_items;
DROP POLICY IF EXISTS "Authenticated users can update items" ON gallery_items;
DROP POLICY IF EXISTS "Authenticated users can delete items" ON gallery_items;

CREATE TABLE IF NOT EXISTS gallery_albums (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cover_url TEXT NOT NULL DEFAULT '',
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  description TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

GRANT SELECT ON gallery_albums TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON gallery_albums TO authenticated;

ALTER TABLE gallery_albums ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view albums"
  ON gallery_albums FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert albums"
  ON gallery_albums FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update albums"
  ON gallery_albums FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete albums"
  ON gallery_albums FOR DELETE USING (auth.role() = 'authenticated');

CREATE TABLE IF NOT EXISTS gallery_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  album_id UUID NOT NULL REFERENCES gallery_albums(id) ON DELETE CASCADE,
  sort_order INT NOT NULL DEFAULT 0,
  file_type TEXT NOT NULL CHECK (file_type IN ('image','video')),
  file_url TEXT NOT NULL,
  cover_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

GRANT SELECT ON gallery_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON gallery_items TO authenticated;

ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view items"
  ON gallery_items FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert items"
  ON gallery_items FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update items"
  ON gallery_items FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete items"
  ON gallery_items FOR DELETE USING (auth.role() = 'authenticated');
