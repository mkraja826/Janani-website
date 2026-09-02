# Janani Website

Public website for the Janani pregnancy-support app.

This repository is intentionally separate from the mobile app so the website can be deployed independently and attached to a custom domain when ready.

## Current public pages

- `/` — Janani product overview
- `/giving/` — Janani Giving policy and transparency ledger
- `/privacy/` — Privacy Policy aligned with the mobile app
- `/terms/` — Terms of Service, medical disclaimer and subscription terms
- `/support/` — privacy-safe support guidance
- `/account-deletion/` — public account-deletion instructions

## Backend

The website is designed to use the **same Janani Supabase project** as the mobile app. Public browser access is deliberately restricted to publishable client credentials and a future sanitized `public_giving_ledger` projection. The website must never receive a Supabase service-role key or direct access to Janani health, pregnancy, family, Care+, subscription or internal finance tables.

See `docs/SUPABASE_GIVING_BACKEND.md` for the public Giving backend contract.

## Deployment

The site has no runtime framework dependency and can be hosted as static files on Cloudflare Pages, Cloudflare Workers static assets, GitHub Pages, Netlify or another static host. A custom domain will be attached after the final Janani domain is purchased.

`assets/runtime-config.js` currently keeps live Giving disabled. Production deployment should populate the Janani Supabase project URL and publishable key only after the public Giving projection has been implemented and security-reviewed.

## Validation

GitHub Actions runs:

```bash
node scripts/validate-site.mjs
```

The validation gate checks required pages, legal disclosures and fail-closed Giving defaults.
