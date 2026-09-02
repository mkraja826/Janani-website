import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const primaryPages = [
  'index.html',
  'features/index.html',
  'how-it-works/index.html',
  'families/index.html',
  'giving/index.html',
  'about/index.html'
];
const required = [
  ...primaryPages,
  'privacy/index.html',
  'terms/index.html',
  'support/index.html',
  'account-deletion/index.html',
  'assets/styles.css',
  'assets/site.js',
  'assets/runtime-config.js',
  'assets/giving.js',
  'docs/SUPABASE_GIVING_BACKEND.md'
];

for (const file of required) {
  if (!fs.existsSync(path.join(root, file))) throw new Error(`Missing required website file: ${file}`);
}

const pages = required.filter((file) => file.endsWith('.html'));
for (const page of pages) {
  const html = fs.readFileSync(path.join(root, page), 'utf8');
  if (!/<meta name="viewport"/i.test(html)) throw new Error(`${page}: missing viewport metadata`);
  if (!/<meta name="description"/i.test(html)) throw new Error(`${page}: missing description metadata`);
  if (!/<title>[^<]+<\/title>/i.test(html)) throw new Error(`${page}: missing title`);
  if (!/class="site-header"/i.test(html)) throw new Error(`${page}: missing site header`);
  if (!/class="site-footer"/i.test(html)) throw new Error(`${page}: missing site footer`);
  if (/support@janani/i.test(html)) throw new Error(`${page}: contains an unapproved/fabricated support mailbox`);
}

for (const page of primaryPages) {
  const html = fs.readFileSync(path.join(root, page), 'utf8');
  if (!/About & Safety/i.test(html)) throw new Error(`${page}: primary navigation must expose About & Safety`);
  if (!/Get Janani/i.test(html)) throw new Error(`${page}: missing primary Get Janani CTA`);
}

const runtimeConfig = fs.readFileSync(path.join(root, 'assets/runtime-config.js'), 'utf8');
if (!/givingLiveEnabled:\s*false/.test(runtimeConfig)) throw new Error('Giving must remain fail-closed until the production public projection is security-reviewed.');
if (!/androidAppUrl:\s*""/.test(runtimeConfig)) throw new Error('Android app URL must remain an explicit empty placeholder until a verified store URL is configured.');
if (!/siteBaseUrl:\s*""/.test(runtimeConfig)) throw new Error('Site base URL must remain an explicit empty placeholder until the final domain is configured.');
if (/service_role|service-role|SUPABASE_SERVICE_ROLE/i.test(runtimeConfig)) throw new Error('Service-role credentials must never be present in public runtime config.');

const givingPage = fs.readFileSync(path.join(root, 'giving/index.html'), 'utf8');
for (const phrase of ['Janani has not yet published a verified donation', 'A Care+ purchase is not a charitable donation']) {
  if (!givingPage.includes(phrase)) throw new Error(`Giving page missing required transparency language: ${phrase}`);
}
const givingClient = fs.readFileSync(path.join(root, 'assets/giving.js'), 'utf8');
if (!givingClient.includes('public_giving_ledger')) throw new Error('Giving client must use only the designated public projection.');

const about = fs.readFileSync(path.join(root, 'about/index.html'), 'utf8');
for (const phrase of ['does not provide medical diagnosis or emergency medical services', 'qualified healthcare professional', 'local emergency services']) {
  if (!about.includes(phrase)) throw new Error(`About & Safety missing required medical safety language: ${phrase}`);
}

const features = fs.readFileSync(path.join(root, 'features/index.html'), 'utf8');
if (!features.includes('Janani AI')) throw new Error('Features page must explain Janani AI.');
if (!features.includes('does not diagnose disease')) throw new Error('Features page must retain wellness medical boundary language.');

const privacy = fs.readFileSync(path.join(root, 'privacy/index.html'), 'utf8');
if (!privacy.includes('Care+ AI')) throw new Error('Privacy Policy must disclose Care+ AI processing.');
if (!privacy.includes('Supabase')) throw new Error('Privacy Policy must disclose Supabase service usage.');

const terms = fs.readFileSync(path.join(root, 'terms/index.html'), 'utf8');
if (!terms.includes('Janani is not a medical device')) throw new Error('Terms must retain medical-device disclaimer.');
if (!terms.includes('Billing and subscriptions')) throw new Error('Terms must include subscription terms.');

console.log(`Validated ${pages.length} Janani website pages, six-page product navigation, medical safety language and public Giving security defaults.`);
