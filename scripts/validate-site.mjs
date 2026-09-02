import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const required = [
  'index.html',
  'privacy/index.html',
  'terms/index.html',
  'giving/index.html',
  'support/index.html',
  'account-deletion/index.html',
  'assets/styles.css',
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

const runtimeConfig = fs.readFileSync(path.join(root, 'assets/runtime-config.js'), 'utf8');
if (!/givingLiveEnabled:\s*false/.test(runtimeConfig)) throw new Error('Giving must remain fail-closed until the production public projection is security-reviewed.');
if (/service_role|service-role|SUPABASE_SERVICE_ROLE/i.test(runtimeConfig)) throw new Error('Service-role credentials must never be present in public runtime config.');

const givingPage = fs.readFileSync(path.join(root, 'giving/index.html'), 'utf8');
for (const phrase of ['Janani has not yet published a verified donation', 'A Care+ purchase is not a charitable donation']) {
  if (!givingPage.includes(phrase)) throw new Error(`Giving page missing required transparency language: ${phrase}`);
}
const givingClient = fs.readFileSync(path.join(root, 'assets/giving.js'), 'utf8');
if (!givingClient.includes('public_giving_ledger')) throw new Error('Giving client must use only the designated public projection.');

const privacy = fs.readFileSync(path.join(root, 'privacy/index.html'), 'utf8');
if (!privacy.includes('Care+ AI')) throw new Error('Privacy Policy must disclose Care+ AI processing.');
if (!privacy.includes('Supabase')) throw new Error('Privacy Policy must disclose Supabase service usage.');

const terms = fs.readFileSync(path.join(root, 'terms/index.html'), 'utf8');
if (!terms.includes('Janani is not a medical device')) throw new Error('Terms must retain medical-device disclaimer.');
if (!terms.includes('Billing and subscriptions')) throw new Error('Terms must include subscription terms.');

console.log(`Validated ${pages.length} Janani website pages and public Giving security defaults.`);
