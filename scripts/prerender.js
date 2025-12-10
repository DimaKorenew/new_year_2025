import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function prerender() {
  // Dynamic import to handle potential errors
  let render;
  try {
    const serverPath = path.resolve(__dirname, '../dist/server/server.js');
    const entryModule = await import('file://' + serverPath);
    render = entryModule.render;
  } catch (error) {
    console.error('❌ Error loading SSR module:', error.message);
    console.error('Make sure to run "npm run build:server" first.');
    process.exit(1);
  }

  const routes = [
    '/',
    '/new-year-2025/',
  ];

  const templatePath = path.resolve(__dirname, '../dist/client/index.html');
  if (!fs.existsSync(templatePath)) {
    console.error('❌ Template not found. Make sure to run "npm run build:client" first.');
    process.exit(1);
  }

  const template = fs.readFileSync(templatePath, 'utf-8');

  for (const route of routes) {
    try {
      const basename = route.startsWith('/new-year-2025') ? '/new-year-2025' : '';
      const { html } = render(route, basename);
      
      const htmlWithContent = template.replace(
        '<div id="root"></div>',
        `<div id="root">${html}</div>`
      );

      // Add SEO meta tags
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

      // Determine output path
      let outputPath;
      if (route === '/') {
        outputPath = path.resolve(__dirname, '../dist/client/index.html');
      } else if (route === '/new-year-2025/') {
        const dir = path.resolve(__dirname, '../dist/client/new-year-2025');
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        outputPath = path.resolve(dir, 'index.html');
      } else {
        continue;
      }

      fs.writeFileSync(outputPath, finalHtml, 'utf-8');
      console.log(`✅ Prerendered: ${route} -> ${outputPath}`);
    } catch (error) {
      console.error(`❌ Error prerendering ${route}:`, error);
    }
  }

  console.log('✨ Prerendering complete!');
}

prerender();


