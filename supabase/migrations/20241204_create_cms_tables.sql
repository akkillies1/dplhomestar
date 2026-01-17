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

-- Create indexes for gallery_images
CREATE INDEX IF NOT EXISTS idx_gallery_tags ON gallery_images USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_gallery_featured ON gallery_images(is_featured, display_order);
CREATE INDEX IF NOT EXISTS idx_gallery_published ON gallery_images(is_published, display_order);

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

-- Create indexes for testimonials
CREATE INDEX IF NOT EXISTS idx_testimonials_published ON testimonials(is_published, display_order);

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

-- Create indexes for blog_posts
CREATE INDEX IF NOT EXISTS idx_blog_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_published ON blog_posts(is_published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_tags ON blog_posts USING GIN(tags);

-- Enable Row Level Security
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

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

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_gallery_images_updated_at
  BEFORE UPDATE ON gallery_images
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
