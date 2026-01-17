import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from .env file
import dotenv from 'dotenv';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables. Required: VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const BASE_URL = 'https://allthingdecode.com'; // Replace with actual domain

const staticRoutes = [
    '',
    '/blog',
    '/admin/login'
];

async function generateSitemap() {
    console.log('Generating sitemap...');

    try {
        // Fetch blog posts
        const { data: posts, error } = await supabase
            .from('blog_posts')
            .select('slug, updated_at')
            .eq('is_published', true);

        if (error) throw error;

        let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

        // Add static routes
        staticRoutes.forEach(route => {
            sitemap += `
    <url>
        <loc>${BASE_URL}${route}</loc>
        <changefreq>weekly</changefreq>
        <priority>${route === '' ? '1.0' : '0.8'}</priority>
    </url>`;
        });

        // Add blog posts
        posts?.forEach(post => {
            sitemap += `
    <url>
        <loc>${BASE_URL}/blog/${post.slug}</loc>
        <lastmod>${new Date(post.updated_at).toISOString()}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
    </url>`;
        });

        sitemap += `
</urlset>`;

        const publicDir = path.resolve(__dirname, '../public');
        fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);

        console.log('Sitemap generated successfully at public/sitemap.xml');
    } catch (error) {
        console.error('Error generating sitemap:', error);
    }
}

generateSitemap();
