-- Fix: Grant table-level permissions (in addition to RLS policies)
-- Run this in Supabase SQL Editor

GRANT SELECT ON public.posts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.posts TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Storage permissions
GRANT SELECT ON storage.objects TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON storage.objects TO authenticated;
