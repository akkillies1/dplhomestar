-- Cleanup script - Run this FIRST to remove any partially created objects
-- This is safe to run even if nothing exists

-- Drop existing policies
DROP POLICY IF EXISTS "Public can view published gallery images" ON gallery_images;
DROP POLICY IF EXISTS "Authenticated users can manage gallery images" ON gallery_images;
DROP POLICY IF EXISTS "Public can view published testimonials" ON testimonials;
DROP POLICY IF EXISTS "Authenticated users can manage testimonials" ON testimonials;
DROP POLICY IF EXISTS "Public can view published blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Authenticated users can manage blog posts" ON blog_posts;

-- Drop existing triggers
DROP TRIGGER IF EXISTS update_gallery_images_updated_at ON gallery_images;
DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON blog_posts;

-- Drop existing function
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Drop existing tables (this will also drop all data - be careful!)
DROP TABLE IF EXISTS gallery_images;
DROP TABLE IF EXISTS testimonials;
DROP TABLE IF EXISTS blog_posts;

-- Now you can run the main migration script without errors
