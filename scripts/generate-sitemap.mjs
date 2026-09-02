import fs from 'node:fs';

const rawBase = process.env.JANANI_SITE_URL || '';
if (!/^https:\/\/[^/]+/i.test(rawBase)) {
  throw new Error('Set JANANI_SITE_URL to the verified HTTPS Janani website origin before generating sitemap.xml.');
}

const base = rawBase.replace(/\/$/, '');
const paths = ['/', '/features/', '/how-it-works/', '/families/', '/giving/', '/about/', '/privacy/', '/terms/', '/support/', '/account-deletion/'];
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths.map((pathname) => `  <url><loc>${base}${pathname}</loc></url>`).join('\n')}\n</urlset>\n`;
fs.writeFileSync('sitemap.xml', xml);
console.log(`Generated sitemap.xml for ${base}`);
