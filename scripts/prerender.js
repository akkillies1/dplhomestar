
import puppeteer from 'puppeteer';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = 4173;
const BASE_URL = `http://localhost:${PORT}`;
const ROUTES = ['/', '/blog']; // Add your routes here

async function prerender() {
    // 1. Start the server
    console.log('Starting preview server...');
    const server = spawn('pnpm', ['run', 'preview', '--', '--port', PORT.toString(), '--strictPort'], {
        stdio: 'inherit',
        shell: true
    });

    // Give the server some time to start
    await new Promise(resolve => setTimeout(resolve, 3000));

    try {
        // 2. Launch Puppeteer
        console.log('Launching Puppeteer...');
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        for (const route of ROUTES) {
            const page = await browser.newPage();

            // Capture logs and errors
            page.on('console', msg => console.log('PAGE LOG:', msg.text()));
            page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
            page.on('requestfailed', request => console.log('REQ FAILED:', request.failure().errorText, request.url()));

            const url = `${BASE_URL}${route}`;
            console.log(`Rendering ${url}...`);

            await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });

            // Wait a bit more for any client-side hydration or animations
            await new Promise(resolve => setTimeout(resolve, 2000));

            const html = await page.content();

            // 3. Save to file
            const filePath = path.join(__dirname, '../dist', route === '/' ? 'index.html' : `${route}/index.html`);
            const dirPath = path.dirname(filePath);

            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath, { recursive: true });
            }

            fs.writeFileSync(filePath, html);
            console.log(`Saved to ${filePath}`);

            await page.close();
        }

        await browser.close();
        console.log('Prerendering complete!');

    } catch (error) {
        console.error('Prerendering failed:', error);
        process.exit(1); // Exit with error code so CI fails
    } finally {
        // 4. Kill the server
        console.log('Stopping server...');
        // Setup for Windows/Linux kill compatibility
        if (process.platform === 'win32') {
            spawn('taskkill', ['/pid', server.pid, '/f', '/t']);
        } else {
            server.kill();
        }
    }
}

prerender();
