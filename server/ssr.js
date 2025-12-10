import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import { createServer as createViteServer } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProduction = process.env.NODE_ENV === 'production';
const port = process.env.PORT || 5174;

// Helper function to detect crawlers
function isCrawler(userAgent) {
  if (!userAgent) return false;
  const crawlerPatterns = [
    /googlebot/i, /yandex/i, /yandexbot/i, /bingbot/i,
    /baiduspider/i, /slurp/i, /duckduckbot/i, /facebookexternalhit/i,
    /twitterbot/i, /linkedinbot/i, /applebot/i,
  ];
  return crawlerPatterns.some(pattern => pattern.test(userAgent));
}

function getUserAgent(headers) {
  const ua = headers['user-agent'] || headers['User-Agent'];
  if (Array.isArray(ua)) return ua[0];
  return ua;
}

async function createServer() {
  const app = express();

  let vite;
  if (!isProduction) {
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });
    // Используем vite middleware для обработки статических файлов
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, '../dist/client'), { index: false }));
  }

  // SSR handler
  app.use('*', async (req, res, next) => {
    const url = req.originalUrl;
    const userAgent = getUserAgent(req.headers);
    const isCrawlerRequest = isCrawler(userAgent);

    try {
      let template;
      let render;

      if (!isProduction) {
        template = fs.readFileSync(
          path.resolve(__dirname, '../index.html'),
          'utf-8'
        );
        template = await vite.transformIndexHtml(url, template);
        // Используем абсолютный путь для ssrLoadModule
        const entryModule = await vite.ssrLoadModule(path.resolve(__dirname, '../src/entry-server.tsx'));
        render = entryModule.render;
      } else {
        template = fs.readFileSync(
          path.resolve(__dirname, '../dist/client/index.html'),
          'utf-8'
        );
        const entryModule = await import('../dist/server/entry-server.js');
        render = entryModule.render;
      }

      const basename = url.startsWith('/new-year-2025') ? '/new-year-2025' : '';

      // Всегда рендерить контент на сервере для SEO - чтобы контент был виден в исходном коде
      // Это обеспечивает одинаковый контент для пользователей и краулеров
      const { html } = render(url, basename);
      const htmlWithContent = template.replace(
        '<div id="root"></div>',
        `<div id="root">${html}</div>`
      );

      const seoMeta = `
        <meta name="robots" content="index, follow">
        <meta property="og:title" content="Новогоднее застолье 2026 - Рецепты и идеи">
        <meta property="og:description" content="Все рецепты, идеи и советы для идеального Нового года 2026 в одном месте">
        <meta property="og:type" content="website">
      `;

      const finalHtml = htmlWithContent.replace('</head>', `${seoMeta}</head>`);
      res.status(200).set({ 'Content-Type': 'text/html' }).end(finalHtml);
    } catch (e) {
      vite?.ssrFixStacktrace(e);
      console.error(e);
      next(e);
    }
  });

  app.listen(port, () => {
    console.log(`🚀 SSR Server running at http://localhost:${port}`);
  });
}

createServer();

