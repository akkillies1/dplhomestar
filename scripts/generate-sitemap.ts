import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const BASE_URL = 'https://www.dplhomestar.com';

const staticRoutes = [
    '/',
    '/blog',
];

async function generateSitemap() {
    console.log('Generating sitemap...');

    try {
        // Fetch blog posts
        const { data: posts, error } = await supabase
            .from('blog_posts')
            .select('slug, updated_at')
            .eq('is_published', true);

        if (error) console.error('Error fetching posts:', error);

        let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

        // Add static routes
        staticRoutes.forEach(route => {
            sitemap += `
    <url>
        <loc>${BASE_URL}${route === '/' ? '' : route}</loc>
        <changefreq>weekly</changefreq>
        <priority>${route === '/' ? '1.0' : '0.8'}</priority>
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
        const distDir = path.resolve(__dirname, '../dist');

        // Write to both public (for next build) and dist (for current deploy)
        fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
        if (fs.existsSync(distDir)) {
            fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemap);
        }

        console.log('Sitemap generated successfully!');
    } catch (error) {
        console.error('Error generating sitemap:', error);
    }
}

generateSitemap();
