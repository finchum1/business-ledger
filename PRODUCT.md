# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

The primary user is an owner-operator who runs multiple separate businesses (e.g. a film-services
company, a home inspection business, other ventures) and needs one place to record income and expenses
across all of them, rather than juggling separate spreadsheets or separate accounting-software instances
per business. The landing page will also be shown to others (potential partners, an accountant, other
business contacts) — it should read as a real, confident product pitch, not purely a private utility page.

## Product Purpose

Lets someone who runs multiple businesses record income and expenses in one shared ledger, attach
receipts to expenses, bill clients with branded per-business invoices, track how much has been paid to
each contractor, and generate Profit & Loss reports either combined across every business or filtered
to a single one — without separate bookkeeping software or spreadsheets per entity.

## Positioning

Generic accounting software (QuickBooks-style tools) is built around one company/tenant at a time; plain
spreadsheets require manual per-business upkeep and don't roll up cleanly. Business Ledger treats "which
business" as just a field on every transaction — one login, one ledger, and a Profit & Loss report that
either combines every business or isolates any single one instantly. Businesses and categories are
self-managed lists inside the app (add/rename/deactivate), not hardcoded or requiring a code change or a
separate account per entity.

## Operating Context

Weekly manual-entry workflow: the owner sits down periodically and logs the week's transactions. Each
transaction is tagged to a business, a type (income/expense), and a category. Receipts (photos or PDFs)
attach to expenses via drag-and-drop for recordkeeping. P&L is pulled for a preset or custom date range,
viewed on screen, or exported as a clean PDF to hand to an accountant or keep for records.

## Capabilities and Constraints

- Single hand-created login (Supabase Auth → Users → Add user), no public sign-up — this is a private
  tool for one operator, not multi-tenant SaaS. The landing page's call to action is "Sign In," never a
  signup flow.
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
- Built with React + Vite + TypeScript + Tailwind v4 + Supabase (Postgres + Auth + Storage), deployed on
  Vercel.

## Brand Commitments

Name is **Business Ledger** — kept plain and functional rather than given a separate brand name,
confirmed explicitly this session. No existing logo/mark; the landing page may use a simple
wordmark/icon treatment rather than assuming an existing visual identity.

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
