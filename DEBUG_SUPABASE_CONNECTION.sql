-- ============================================
-- Debug Supabase Database Connection
-- ============================================
-- Run this in Supabase SQL Editor to check database status
-- ============================================

-- Check if auth schema exists and is accessible
SELECT schema_name
FROM information_schema.schemata
WHERE schema_name = 'auth';

-- Check if auth.users table exists
SELECT table_schema, table_name
FROM information_schema.tables
WHERE table_schema = 'auth' AND table_name = 'users';

-- Check if we can query the users table
SELECT COUNT(*) as user_count FROM auth.users;

-- Check current user and permissions
SELECT current_user, session_user;

-- Check if RLS is enabled on auth.users (it should be)
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'auth' AND tablename = 'users';

-- Test basic auth functionality
SELECT id, email, created_at
FROM auth.users
WHERE email = 'dcodeakhil@gmail.com';

-- ============================================
-- If the above queries work, try running the schema setup
-- ============================================

-- First, check if our custom tables exist
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('gallery_images', 'testimonials', 'blog_posts', 'leads');

-- If tables don't exist, run the schema setup from supabase_complete_schema.sql
