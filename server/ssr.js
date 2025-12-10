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
        <!-- Open Graph / Facebook -->
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.edimdoma.ru/new-year-2025/" />
        <meta property="og:title" content="Что приготовить на Новый год 2026 – лучшие новогодние блюда и рецепты с фото для праздничного стола" />
        <meta property="og:description" content="Меню на Новый год 2026 с пошаговыми фото блюд. Что готовить на новогодний стол дома. Простые рецепты для праздничного ужина. Сервировка стола и вкусная еда. Лучшие идеи новогодних блюд для всей семьи" />
        <meta property="og:image" content="https://chat-aiacademy.storage.yandexcloud.net/uploads/fileupload/file/358486/generated_00.png" />
        <meta property="og:site_name" content="ЕдимДома" />
        <meta property="og:locale" content="ru_RU" />
        <!-- Twitter -->
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://www.edimdoma.ru/new-year-2025/" />
        <meta name="twitter:title" content="Что приготовить на Новый год 2026 – лучшие новогодние блюда и рецепты с фото для праздничного стола" />
        <meta name="twitter:description" content="Меню на Новый год 2026 с пошаговыми фото блюд. Что готовить на новогодний стол дома. Простые рецепты для праздничного ужина. Сервировка стола и вкусная еда. Лучшие идеи новогодних блюд для всей семьи" />
        <meta name="twitter:image" content="https://chat-aiacademy.storage.yandexcloud.net/uploads/fileupload/file/358486/generated_00.png" />
        <!-- Schema.org JSON-LD -->
        <script type="application/ld+json">
        {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "ЕдимДома",
          "url": "https://www.edimdoma.ru",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://www.edimdoma.ru/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        }
        </script>
        <script type="application/ld+json">
        {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Что приготовить на Новый год 2026 – лучшие новогодние блюда и рецепты с фото для праздничного стола",
          "description": "Меню на Новый год 2026 с пошаговыми фото блюд. Что готовить на новогодний стол дома. Простые рецепты для праздничного ужина. Сервировка стола и вкусная еда. Лучшие идеи новогодних блюд для всей семьи",
          "url": "https://www.edimdoma.ru/new-year-2025/",
          "inLanguage": "ru-RU",
          "isPartOf": {
            "@type": "WebSite",
            "name": "ЕдимДома",
            "url": "https://www.edimdoma.ru"
          },
          "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "ЕдимДома",
                "item": "https://www.edimdoma.ru"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Новости",
                "item": "https://www.edimdoma.ru/news/posts"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": "Статьи",
                "item": "https://www.edimdoma.ru/jivem_doma/posts"
              }
            ]
          },
          "image": {
            "@type": "ImageObject",
            "url": "https://chat-aiacademy.storage.yandexcloud.net/uploads/fileupload/file/358486/generated_00.png",
            "width": 1200,
            "height": 630
          }
        }
        </script>
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


