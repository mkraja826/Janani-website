# PregaLove Giving backend notes

This document describes the website-facing Giving integration for **PregaLove**. The underlying Supabase schema, migration identifiers and public projection names remain unchanged because the customer-facing brand rename does not require database renaming.

## Safety state

PregaLove Giving remains fail-closed until the production public projection and release flow are explicitly security-reviewed and activated.

The public website must:

- read only the designated `public_giving_ledger` projection;
- use only the public Supabase URL and publishable key;
- never include service-role credentials;
- never expose bank account details, private receipts, private health information or internal review records;
- show only completed, verified and reconciled contributions;
- never fabricate totals, beneficiary counts or estimated transfers;
- retain `givingLiveEnabled: false` until the release gate is intentionally opened.

## Existing technical identifiers

The current database and migration identifiers may still contain `janani` because they are internal compatibility identifiers. They should not be renamed as part of a website branding change without a separate migration plan.

The public runtime configuration object is also intentionally still named `JANANI_PUBLIC_CONFIG` until infrastructure configuration is migrated separately.

## Public projection

The website client expects the public projection:

`public_giving_ledger`

with the fields used by `assets/giving.js`:

- `organisation_name`
- `cause`
- `amount_inr`
- `transferred_at`
- `verification_status`
- `public_reference`

Only entries with `verification_status === 'verified'` are rendered as published contributions.

## Activation checklist

Before enabling live Giving:

1. Reconcile the live Supabase migration history against the repository.
2. Replay the reconciled migration set in staging.
3. Verify the public projection exposes only approved public fields.
4. Verify RLS and grants do not permit access to private Giving records.
5. Confirm the website uses only the publishable key.
6. Add a verified test record in staging and confirm totals/rows render correctly.
7. Confirm zero/unavailable states remain truthful and do not estimate figures.
8. Complete the production security review.
9. Configure the production public Supabase values.
10. Only then set `givingLiveEnabled` to `true` in the intended release.

Until those steps are complete, the website must continue to display the prepared-but-not-live PregaLove Giving state.
