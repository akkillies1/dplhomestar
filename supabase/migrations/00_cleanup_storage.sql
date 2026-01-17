-- Cleanup storage policies - Run this FIRST before the storage migration

-- Drop existing storage policies for gallery-images
DROP POLICY IF EXISTS "Public can view gallery images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload gallery images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update gallery images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete gallery images" ON storage.objects;

-- Drop existing storage policies for testimonial-photos
DROP POLICY IF EXISTS "Public can view testimonial photos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload testimonial photos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update testimonial photos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete testimonial photos" ON storage.objects;

-- Drop existing storage policies for blog-images
DROP POLICY IF EXISTS "Public can view blog images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload blog images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update blog images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete blog images" ON storage.objects;

-- Delete existing buckets (this will delete all files in them!)
DELETE FROM storage.buckets WHERE id IN ('gallery-images', 'testimonial-photos', 'blog-images');

-- Now you can run the storage migration
