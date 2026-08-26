# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

The primary user is a small-business owner-operator doing their own bookkeeping — anywhere from one
business to several (e.g. a film-services company, a home inspection business, other ventures). A
single-business owner is a full, equally-served user, not an edge case: everything (income/expense
logging, receipts, branded invoices, contractor tracking, P&L) works the moment they add their first
business, and nothing in the product nags them to add a second. Multi-business support is real headroom
this product has that spreadsheets and single-tenant tools don't, not a requirement to use it. The app is
multi-tenant: anyone can sign up from the landing page and gets their own fully private ledger (own
businesses, categories, contractors, customers, transactions, invoices) — there is no shared data between
accounts. The landing page is a real product pitch aimed at those signups, not just a private login
screen, and its messaging must read as true and inviting to a one-business owner first, with room-to-grow
for more as a supporting point — not the other way around.

## Product Purpose

Lets a small-business owner record income and expenses, attach receipts to expenses, bill clients with a
branded invoice, track how much has been paid to each contractor, and generate a Profit & Loss report —
without separate bookkeeping software or a spreadsheet. It scales cleanly from one business to several:
add a second business at any time and every report gains a combined-vs-single-business toggle for free,
with no migration, no new account, and no separate subscription per entity.

## Positioning

Generic accounting software (QuickBooks-style tools) is built around one company/tenant at a time; plain
spreadsheets require manual per-business upkeep and don't roll up cleanly. Sovereign Books treats "which
business" as just a field on every transaction — one login, one ledger, whether that ledger covers one
business today or several later, and a Profit & Loss report that either combines every business or
isolates any single one instantly. Businesses and categories are self-managed lists inside the app
(add/rename/deactivate), not hardcoded or requiring a code change or a separate account per entity. The
pitch to a one-business owner is the everyday bookkeeping itself — clean books, branded invoices,
receipts, a real P&L; the multi-business capability is the thing that's simply still there, unlocked and
free, the day they need it.

## Operating Context

Weekly manual-entry workflow: the owner sits down periodically and logs the week's transactions. Each
transaction is tagged to a business, a type (income/expense), and a category. Receipts (photos or PDFs)
attach to expenses via drag-and-drop for recordkeeping. P&L is pulled for a preset or custom date range,
viewed on screen, or exported as a clean PDF to hand to an accountant or keep for records.

## Capabilities and Constraints

- Public sign-up (Supabase Auth email/password) from the landing page, added when the app went
  multi-tenant. Every table carries an `owner_id` (defaults to `auth.uid()` on insert) and RLS scopes
  every read/write to `auth.uid() = owner_id`, so each account's data is fully isolated — proven by
  simulating a stranger's JWT against the database directly and confirming zero rows are visible across
  every table, alongside the original operator's data being completely unaffected. The landing page nav
  and hero both offer "Sign In" and "Get Started" (sign-up); the sign-in panel toggles between the two
  modes in place rather than being a separate page. If Supabase Auth email confirmation is enabled,
  sign-up shows a "check your email" notice instead of auto-logging in (session comes back null).
- Businesses and categories are both self-managed lists (add/rename/deactivate) inside the app, not
  hardcoded. Categories stay free text even with a managed suggestion list, so a one-off category is
  never blocked.
- Receipts are stored privately (not public) and viewed via short-lived signed URLs; attaching one
  supports drag-and-drop or click-to-browse.
- Reports page (in-app nav label "Reports", not "P&L Reports") holds two report types as tabs: Profit
  & Loss and Contractors. Both share the same combined/single-business scope and date-range presets
  (this month, last month, this quarter, YTD, last year, all time, custom) and both export as a PDF
  that lists which businesses are rolled into a combined report.
- Contractors and Customers each have their own top-level nav item (not tucked under Settings) and are
  both **per-business rosters** — every contractor/customer belongs to exactly one business (a required
  business assignment on the record itself), and each page has a business selector to switch which
  roster you're viewing/editing. An expense's free-text "who this was paid to" field still stays free
  text with suggestions (matching categories), but those suggestions are scoped to the transaction's
  own business — Contractor Report totals still aggregate by name text, so the same name used across
  two businesses' rosters is treated as the same contractor in a combined-scope report. Customers carry
  optional email/phone/address and are wired into the Sales/quote/invoice creation form: the Client
  name field is a Combobox suggesting that business's saved customers, and picking one autofills client
  email/address from the customer record (still free text otherwise, so a one-off client is never
  blocked) — no `customer_id` is persisted on the invoice/quote itself, this is autofill-on-select, not
  a hard link.
- Invoicing: each business carries its own profile (logo, contact info) that prints onto that
  business's invoices, so a client sees the right branding regardless of which of the owner's
  businesses billed them. Invoices have line items, a due date, and an unpaid/paid status, and export
  as a clean PDF.
- Banking: bank accounts connect per business via SimpleFIN (simplefin.org) — the operator gets a
  one-time setup token from SimpleFIN's own site (their bank login never touches this app) and pastes
  it in to connect. A Supabase Edge Function (`bank-sync`) holds the resulting access credential
  server-side and does the actual SimpleFIN calls; the client never reads it back. Synced transactions
  land in a **review queue**, not straight in the Ledger — each one needs a category (and optional
  contractor) picked before "Import" turns it into a real transaction, so nothing duplicates or
  misfires. "Sync now" is manual, matching SimpleFIN's own ≤24-requests/day guidance and this app's
  weekly-sit-down operating rhythm rather than real-time polling. Banking is held back from new public
  signups for now (an email allowlist in `src/lib/betaAccess.ts`, checked in both the sidebar nav and
  the `/banking` route) — a deliberate, temporary decision made when the app went multi-tenant, not a
  technical limitation; the plan is to open it up once it's been live and solid for a while.
- Built with React + Vite + TypeScript + Tailwind v4 + Supabase (Postgres + Auth + Storage + one Deno
  Edge Function for the SimpleFIN bank sync), deployed on Vercel.

## Brand Commitments

Name is **Sovereign Books** — renamed from the original plain/functional "Business Ledger" (which
shared its literal name with an unrelated well-known crypto hardware wallet brand) to something with
real brand character, aimed at a "quietly wealthy, established, trustworthy" register rather than a
generic small-business-SaaS one. Chosen from a brainstormed shortlist alongside Folio, Gilt Books,
Bespoke Books, Cavendish Books, Crest Books, Meridian Books, Aurum Books, Keystone Books, and Bellwether
Books — "Sovereign" for its direct tie to sovereign wealth/independence/authority, "Books" to sit
plainly in the same naming convention as its real competitors (QuickBooks, FreshBooks) rather than
around it. No existing logo/mark carries forward; the landing page's visual identity is being rebuilt
around this name as a "luxury finance SaaS" direction (see DESIGN.md).

**Standing visual preference, confirmed explicitly this session**: when offered a bespoke-tailoring
concept direction ("Cut to Measure") for the third landing-page world in one day, the user said "play it
straight" — the category-standard premium-fintech look, executed at full craft, no governing metaphor.
Craft bar named explicitly: **Mercury, Ramp, Brex** (dark, precise, restrained SaaS polish — not a
literal object/place metaphor like the two prior worlds). Future landing-page work should default to
this canon register rather than proposing another concept-driven world, unless the user asks otherwise.

## Evidence on Hand

Real screenshots of the live app are captured for this landing page (Ledger entry page, P&L Reports
page including the PDF export, Categories management, receipt drag-and-drop, a branded invoice) —
populated with generic placeholder business names and round-number amounts, not the owner's real
financial data. No existing customer testimonials, press mentions, or case studies exist and none
should be fabricated.

## Product Principles

1. One login, every business — no per-entity account setup or context-switching.
2. Reports roll up or drill down instantly — combined P&L and single-business P&L are the same click.
3. Free text where it matters — categories and business names are typed, not locked to a fixed schema.
4. Private by default — single-user auth, private receipt storage, no public data exposure.
5. Built for a weekly ritual, not daily babysitting — designed around periodic batch entry, not
   obsessive real-time tracking.
