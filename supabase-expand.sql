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
