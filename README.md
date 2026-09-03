# PregaLove Website

Public marketing and legal website for **PregaLove**, the pregnancy-support application formerly branded Janani.

The site is intentionally static, mobile-first and fail-closed around features that are not yet production-enabled.

## Public pages

- `/` — Home
- `/features/` — Features
- `/how-it-works/` — How PregaLove works
- `/families/` — Family and partner experience
- `/giving/` — PregaLove Giving transparency page
- `/about/` — About, safety and responsible AI boundaries
- `/privacy/` — Privacy Policy
- `/terms/` — Terms of Service and medical disclaimer
- `/support/` — Support guidance
- `/account-deletion/` — Account deletion instructions

## Configuration

`assets/runtime-config.js` remains the public runtime configuration surface. Its internal object name is intentionally still `JANANI_PUBLIC_CONFIG` for compatibility with existing deployment/config plumbing; changing that technical identifier is not required for the customer-facing PregaLove rename.

Important release defaults remain fail-closed:

- `androidAppUrl` stays empty until the verified store URL is available.
- `siteBaseUrl` stays empty until the final production domain is configured.
- `givingLiveEnabled` stays `false` until the Giving public projection and release flow are security-reviewed and intentionally activated.

## Giving safety

The public Giving client reads only the designated `public_giving_ledger` projection when live Giving is enabled. It must never expose service-role credentials, private banking data, private health data, or unverified donation figures.

## Medical safety

PregaLove is a pregnancy-support product, not a medical device or emergency service. Public content must preserve clear boundaries around diagnosis, treatment, medicines, emergencies and AI-generated guidance.

## Validation

Run the repository validation before release:

```bash
node scripts/validate-site.mjs
```

The validator checks the required pages, metadata, product navigation, PregaLove CTAs, medical-safety language, privacy/AI disclosures and fail-closed Giving configuration.

## Legacy technical names

Some technical destinations can still contain `Janani`/`janani` until their infrastructure is migrated, including the existing GitHub repository, account-deletion host, and the `JANANI_PUBLIC_CONFIG` JavaScript object. These are compatibility identifiers, not public brand copy.
