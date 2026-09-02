# Janani Website

Public marketing, trust and transparency website for the Janani pregnancy-support app. The website is intentionally separate from the mobile app so Janani's private pregnancy experience and public brand site can be deployed independently.

## Six primary pages

- `/` — Home
- `/features/` — Features
- `/how-it-works/` — How Janani Works
- `/families/` — For Families / partner experience
- `/giving/` — Janani Giving mission and fail-closed transparency ledger
- `/about/` — About & Safety, product principles, AI boundaries and medical safety

Supporting trust pages remain available at `/privacy/`, `/terms/`, `/support/` and `/account-deletion/`.

## Design direction

The site uses a mobile-first maternal-wellness design system with warm off-white surfaces, restrained rose/peach/lavender accents, serif-led display typography, generous spacing and subtle motion. App imagery on the marketing pages is intentionally illustrative UI rather than fabricated screenshots.

## Public configuration

`assets/runtime-config.js` contains explicit deployment hooks:

- `siteBaseUrl` — keep empty until the final Janani website domain is verified; `assets/site.js` then injects canonical/OG URLs.
- `androidAppUrl` — keep empty until the official Android store URL is verified; all `Get Janani` CTAs then update automatically.
- `supabaseUrl` / `supabasePublishableKey` — public credentials only, and only after the sanitized Giving projection is ready.
- `givingLiveEnabled` — must remain `false` until the production public Giving projection is implemented and security-reviewed.

The website must never receive a Supabase service-role key or direct access to Janani health, pregnancy, family, Care+, subscription or internal finance tables.

See `docs/SUPABASE_GIVING_BACKEND.md` for the public Giving backend contract.

## Deployment

The site has no runtime framework dependency and can be hosted as static files on Cloudflare Pages, Cloudflare Workers static assets, GitHub Pages, Netlify or another static host. A final sitemap should be generated only after `siteBaseUrl` is configured so Janani does not publish an invented canonical domain.

## Validation

GitHub Actions runs:

```bash
node scripts/validate-site.mjs
```

The validation gate checks the six primary pages, legal disclosures, medical safety wording, explicit app/domain placeholders and fail-closed Giving defaults.
