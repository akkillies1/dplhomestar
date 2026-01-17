-- Create storage buckets for images
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('gallery-images', 'gallery-images', true),
  ('testimonial-photos', 'testimonial-photos', true),
  ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO NOTHING;

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
