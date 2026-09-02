# Janani Giving — Supabase backend contract

Janani Website uses the **same Supabase project as the Janani mobile app**, but the public website must have a much smaller data-access surface.

## Security boundary

The browser may use only the Supabase project URL and a **publishable client key**. A service-role key must never be shipped in website JavaScript, source control, HTML, Cloudflare Pages variables exposed to the browser, or any downloadable asset.

The website must never directly read Janani app tables containing users, profiles, pregnancies, family relationships, health data, reminders, journals, Care+ conversations, entitlement details, private accounting records, bank data, NGO verification documents, or internal audit notes.

## Giving data model

The future Janani production migration should keep internal finance and verification data private and expose a deliberately narrow public projection named:

`public_giving_ledger`

The website currently expects these public fields only:

- `organisation_name` — public display name of the verified organisation
- `cause` — short public purpose/category
- `amount_inr` — completed donated amount in INR
- `transferred_at` — completed bank-transfer date
- `verification_status` — the website publishes rows only when this equals `verified`
- `public_reference` — redacted receipt, report or public reconciliation reference

No bank account number, tax identifier, contact person, private receipt URL, internal transaction ID, user information or confidential NGO document belongs in this public projection.

## Recommended internal architecture

Keep internal tables/RPCs private, for example:

1. NGO registry and due-diligence records.
2. Accounting-period calculations.
3. Donation proposals and approval workflow.
4. Transfer/reconciliation records.
5. Evidence/receipt metadata in a private storage bucket.
6. An immutable audit trail for status changes.
7. A public projection/view or tightly controlled public RPC containing only reconciled records approved for publication.

RLS and grants should deny anonymous/authenticated direct CRUD on the internal tables. The public website should receive read access only to the public projection/RPC.

## Publication lifecycle

A donation should become visible on the website only after:

`calculated → reviewed → approved → transferred → reconciled → evidence verified → published`

Proposed, pending, failed, reversed or unreconciled transfers must not be counted in the public total.

## Website runtime configuration

`assets/runtime-config.js` intentionally ships with Giving disabled and no Supabase values. At deployment time, the public website configuration can be generated with:

```js
window.JANANI_PUBLIC_CONFIG = {
  supabaseUrl: "https://<janani-project-ref>.supabase.co",
  supabasePublishableKey: "<publishable-client-key>",
  givingLiveEnabled: true
};
```

The publishable key is not a secret, but security must still come from RLS/grants and the narrow public projection.

## Current status

The website integration is implemented fail-closed. Because the Supabase management connector was unavailable while this website milestone was built, **no production database schema or policy was changed**. `givingLiveEnabled` remains `false` until the Janani production database is inspected and the public projection is implemented and security-reviewed.
