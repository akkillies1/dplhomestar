# Database Setup Instructions

## Running Migrations

You have two options to apply these migrations to your Supabase project:

### Option 1: Supabase Dashboard (Recommended for now)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of each migration file:
   - `supabase/migrations/20241204_create_cms_tables.sql`
   - `supabase/migrations/20241204_create_storage_buckets.sql`
4. Run each migration

### Option 2: Supabase CLI (For production)

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Run migrations
supabase db push
```

## What Was Created

### Tables
- **gallery_images**: Store gallery photos with tags, descriptions, and social media links
- **testimonials**: Store client reviews and ratings
- **blog_posts**: Store blog content with SEO metadata

### Storage Buckets
- **gallery-images**: Public bucket for gallery photos
- **testimonial-photos**: Public bucket for client photos
- **blog-images**: Public bucket for blog post images

### Security
- Row Level Security (RLS) enabled on all tables
- Public can read published content
- Only authenticated users can create/update/delete content

## Next Steps

After running the migrations:
1. Create an admin user in Supabase Auth
2. Test the RLS policies
3. Start building the frontend components
