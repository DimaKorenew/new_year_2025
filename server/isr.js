import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * ISR (Incremental Static Regeneration) middleware
 * Кэширует страницы и обновляет их периодически
 */
export function createISRMiddleware(options = {}) {
  const {
    revalidate = 3600, // 1 hour default
    cacheDir = path.resolve(__dirname, '../.isr-cache'),
  } = options;

  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
  }

  return async (req, res, next) => {
    const url = req.originalUrl;
    const isDynamicRoute = url.startsWith('/s/');

    if (!isDynamicRoute) {
      return next();
    }

    const cacheKey = url.replace(/[^a-zA-Z0-9]/g, '_');
    const cacheFile = path.join(cacheDir, `${cacheKey}.json`);

    try {
      if (fs.existsSync(cacheFile)) {
        const cacheData = JSON.parse(fs.readFileSync(cacheFile, 'utf-8'));
        const now = Date.now();
        const age = now - cacheData.timestamp;

        if (age < revalidate * 1000) {
          console.log(`📦 ISR: Serving cached version of ${url} (age: ${Math.floor(age / 1000)}s)`);
          return res.send(cacheData.html);
        }

        // Serve stale content while regenerating
        console.log(`🔄 ISR: Serving stale cache for ${url}, regenerating in background`);
        res.send(cacheData.html);
        
        setImmediate(() => regenerateCache(url, cacheFile));
        return;
      }

      next();
    } catch (error) {
      console.error('ISR error:', error);
      next();
    }
  };
}

async function regenerateCache(url, cacheFile) {
  try {
    const { render } = await import('../dist/server/entry-server.js');
    const basename = url.startsWith('/new-year-2025') ? '/new-year-2025' : '';
    const { html } = render(url, basename);

    const template = fs.readFileSync(
      path.resolve(__dirname, '../dist/client/index.html'),
      'utf-8'
    );

    const htmlWithContent = template.replace(
      '<div id="root"></div>',
      `<div id="root">${html}</div>`
    );

    const cacheData = {
      html: htmlWithContent,
      timestamp: Date.now(),
    };

    fs.writeFileSync(cacheFile, JSON.stringify(cacheData), 'utf-8');
    console.log(`✅ ISR: Regenerated cache for ${url}`);
  } catch (error) {
    console.error(`❌ ISR: Error regenerating cache for ${url}:`, error);
  }
}

