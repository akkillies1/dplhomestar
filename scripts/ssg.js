import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function build() {
    const root = path.resolve(__dirname, '..');
    const dist = path.resolve(root, 'dist');

    // 1. Create vite server to load the server entry
    const vite = await createServer({
        root,
        server: { middlewareMode: true },
        appType: 'custom'
    });

    try {
        // 2. Load the template
        const template = fs.readFileSync(path.resolve(dist, 'index.html'), 'utf-8');

        // 3. Load the server entry
        const { render } = await vite.ssrLoadModule('/src/entry-server.tsx');

        // 4. Define routes to render
        const routes = ['/', '/blog']; // Add any other public routes here

        for (const url of routes) {
            const helmetContext = {};
            const { html: appHtml } = await render(url, helmetContext);
            const { helmet } = helmetContext;

            // Extract helmet tags
            const headHtml = [
                helmet.title.toString(),
                helmet.priority.toString(),
                helmet.meta.toString(),
                helmet.link.toString(),
                helmet.script.toString()
            ].join('\n');

            // 5. Inject into template
            const html = template
                .replace('<!--app-head-->', headHtml)
                .replace('<!--app-html-->', appHtml);

            // 6. Save target file
            const fileName = url === '/' ? 'index.html' : `${url}/index.html`;
            const filePath = path.resolve(dist, fileName);
            const dirPath = path.dirname(filePath);

            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath, { recursive: true });
            }

            fs.writeFileSync(filePath, html);
            console.log(`Successfully prerendered: ${url}`);
        }

        console.log('SSG complete!');

    } catch (e) {
        console.error('SSG failed:', e);
    } finally {
        await vite.close();
    }
}

build();
