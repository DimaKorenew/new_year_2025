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
        <meta property="og:title" content="Новогоднее застолье 2026 - Рецепты и идеи">
        <meta property="og:description" content="Все рецепты, идеи и советы для идеального Нового года 2026 в одном месте">
        <meta property="og:type" content="website">
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

