-- ============================================
-- Complete Supabase Schema for The DCode Website
-- ============================================
-- This file contains the complete database schema
-- Copy and paste this entire file into Supabase SQL Editor
-- ============================================

-- ============================================
-- 1. CREATE TABLES
-- ============================================

-- Create gallery_images table
CREATE TABLE IF NOT EXISTS gallery_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  tags TEXT[] DEFAULT '{}',
  social_media_source TEXT CHECK (social_media_source IN ('instagram', 'facebook', NULL)),
  social_media_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_name TEXT NOT NULL,
  client_photo_url TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT NOT NULL,
  project_type TEXT,
  location TEXT,
  is_published BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image_url TEXT,
  author TEXT DEFAULT 'The DCode',
  tags TEXT[] DEFAULT '{}',
  meta_title TEXT,
  meta_description TEXT,
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create leads table to track contact form enquiries
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Contact Information
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  location TEXT NOT NULL,
  message TEXT NOT NULL,
  
  -- Lead Management
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'proposal_sent', 'won', 'lost')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  
  -- Metadata
  source TEXT DEFAULT 'website_contact_form',
  
  -- Admin Notes
  notes TEXT,
  last_contacted_at TIMESTAMP WITH TIME ZONE,
  next_follow_up_date DATE
);

-- ============================================
-- 2. CREATE INDEXES
-- ============================================

-- Indexes for gallery_images
CREATE INDEX IF NOT EXISTS idx_gallery_tags ON gallery_images USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_gallery_featured ON gallery_images(is_featured, display_order);
CREATE INDEX IF NOT EXISTS idx_gallery_published ON gallery_images(is_published, display_order);

-- Indexes for testimonials
CREATE INDEX IF NOT EXISTS idx_testimonials_published ON testimonials(is_published, display_order);

-- Indexes for blog_posts
CREATE INDEX IF NOT EXISTS idx_blog_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_published ON blog_posts(is_published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_tags ON blog_posts USING GIN(tags);

-- Indexes for leads
CREATE INDEX IF NOT EXISTS leads_created_at_idx ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS leads_status_idx ON leads(status);
CREATE INDEX IF NOT EXISTS leads_email_idx ON leads(email);

-- ============================================
-- 3. ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 4. CREATE RLS POLICIES
-- ============================================

-- RLS Policies for gallery_images
-- Allow public read access to published images
CREATE POLICY "Public can view published gallery images"
  ON gallery_images FOR SELECT
  USING (is_published = true);

-- Allow authenticated users to do everything (admin access)
CREATE POLICY "Authenticated users can manage gallery images"
  ON gallery_images FOR ALL
  USING (auth.role() = 'authenticated');

-- RLS Policies for testimonials
-- Allow public read access to published testimonials
CREATE POLICY "Public can view published testimonials"
  ON testimonials FOR SELECT
  USING (is_published = true);

-- Allow authenticated users to do everything (admin access)
CREATE POLICY "Authenticated users can manage testimonials"
  ON testimonials FOR ALL
  USING (auth.role() = 'authenticated');

-- RLS Policies for blog_posts
-- Allow public read access to published blog posts
CREATE POLICY "Public can view published blog posts"
  ON blog_posts FOR SELECT
  USING (is_published = true);

-- Allow authenticated users to do everything (admin access)
CREATE POLICY "Authenticated users can manage blog posts"
  ON blog_posts FOR ALL
  USING (auth.role() = 'authenticated');

-- RLS Policies for leads
-- Allow authenticated users to view and manage leads
CREATE POLICY "Authenticated users can manage leads"
  ON leads
  FOR ALL
  USING (auth.role() = 'authenticated');

-- Allow public (anonymous) users to insert into leads table
CREATE POLICY "Public users can insert leads"
  ON leads
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- ============================================
-- 5. CREATE FUNCTIONS
-- ============================================

-- Function to update updated_at column automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to submit leads (bypasses RLS for public inserts)
CREATE OR REPLACE FUNCTION submit_lead(
  p_name text,
  p_email text,
  p_phone text,
  p_location text,
  p_message text
) RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_lead_id uuid;
  result json;
BEGIN
  INSERT INTO leads (name, email, phone, location, message, status, source)
  VALUES (p_name, p_email, p_phone, p_location, p_message, 'new', 'website_contact_form')
  RETURNING id INTO new_lead_id;

  result := json_build_object('id', new_lead_id);
  RETURN result;
END;
$$;

-- Grant execute permission to public (anonymous) users
GRANT EXECUTE ON FUNCTION submit_lead TO anon;

-- ============================================
-- 6. CREATE TRIGGERS
-- ============================================

-- Trigger to auto-update updated_at for gallery_images
CREATE TRIGGER update_gallery_images_updated_at
  BEFORE UPDATE ON gallery_images
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger to auto-update updated_at for blog_posts
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 7. CREATE STORAGE BUCKETS
-- ============================================

-- Create storage buckets for images
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('gallery-images', 'gallery-images', true),
  ('testimonial-photos', 'testimonial-photos', true),
  ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 8. CREATE STORAGE POLICIES
-- ============================================

-- Storage policies for gallery-images bucket
-- Allow public to read
CREATE POLICY "Public can view gallery images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'gallery-images');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload gallery images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'gallery-images' AND auth.role() = 'authenticated');

-- Allow authenticated users to update
CREATE POLICY "Authenticated users can update gallery images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'gallery-images' AND auth.role() = 'authenticated');

-- Allow authenticated users to delete
CREATE POLICY "Authenticated users can delete gallery images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'gallery-images' AND auth.role() = 'authenticated');

-- Storage policies for testimonial-photos bucket
CREATE POLICY "Public can view testimonial photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'testimonial-photos');

CREATE POLICY "Authenticated users can upload testimonial photos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'testimonial-photos' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update testimonial photos"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'testimonial-photos' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete testimonial photos"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'testimonial-photos' AND auth.role() = 'authenticated');

-- Storage policies for blog-images bucket
CREATE POLICY "Public can view blog images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'blog-images');

CREATE POLICY "Authenticated users can upload blog images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'blog-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update blog images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'blog-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete blog images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'blog-images' AND auth.role() = 'authenticated');

-- ============================================
-- 9. GRANT PERMISSIONS
-- ============================================

-- Grant permissions for leads table
GRANT ALL ON leads TO authenticated;
GRANT ALL ON leads TO service_role;

-- ============================================
-- SCHEMA SETUP COMPLETE!
-- ============================================
-- 
-- Next Steps:
-- 1. Create an admin user in Supabase Auth
-- 2. Test the RLS policies
-- 3. Upload images to the storage buckets
-- 4. (Optional) Run the sample data script below
-- ============================================

