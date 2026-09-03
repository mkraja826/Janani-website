import fs from 'node:fs';

const routes = [
  '/',
  '/features/',
  '/how-it-works/',
  '/families/',
  '/giving/',
  '/about/',
  '/privacy/',
  '/terms/',
  '/support/',
  '/account-deletion/'
];

const runtime = fs.readFileSync('assets/runtime-config.js', 'utf8');
const match = runtime.match(/siteBaseUrl:\s*"([^"]*)"/);
const base = match?.[1]?.replace(/\/$/, '');

if (!base) {
  console.log('PregaLove sitemap skipped: siteBaseUrl is not configured yet.');
  process.exit(0);
}

const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.map((route) => `  <url><loc>${base}${route}</loc></url>`).join('\n')}\n</urlset>\n`;
fs.writeFileSync('sitemap.xml', body);
console.log(`Generated PregaLove sitemap for ${routes.length} routes.`);
