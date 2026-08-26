---
version: 1
slug: "src-pages-landing-tsx"
primary_target: "src/pages/Landing.tsx"
related_targets: ["src/index.css"]
---

## Scope & mode
Full landing page (`src/pages/Landing.tsx`), Persuade mode. Replaces the "industrial switchboard/patch-bay" world entirely (see DESIGN.md history) with a new world, "The House Ledger."

## Audience, job, action, proof, constraints
- Audience: small-business owner-operators doing their own bookkeeping — one business or several, all equally served (see PRODUCT.md Users, updated this session). Practical trades (film-services, home inspection, contracting, boutique retail), not finance professionals or VCs.
- Job: decide this is worth switching to from spreadsheets/QuickBooks/paper, and sign up.
- Action: click "Get Started" (public sign-up, ships this session) or "Sign In".
- Proof/content on hand: 5 real app screenshots (Ledger, P&L Reports + PDF export, Categories, receipt drag-and-drop, branded invoice) with generic placeholder data. No testimonials, press, or case studies — none may be invented.
- Constraint: the hero copy must read as true for a one-business owner first (multi-business is headroom, not a requirement) — this was an explicit correction mid-session; do not regress to "Every business." framing.

## Chosen direction
**The House Ledger.** Bound-ledger-book/bank-statement world: deep bottle-green leather, gold foil tooling, cream ledger-paper insets, letterpress hairline rules, high-contrast serif display type, tabular serif numerals. Palette: `#0f2b21` (deep bottle-green), `#f4ecdb` (cream ledger paper), `#b8914a` (gold foil), `#16140f` (ink), `#6b2a24` (oxblood, sparing accent). Replaces the switchboard/bakelite/brass-jack world entirely — no jacks, cables, lamps, or patch-cable metaphor carry forward.

## Approved comp
Comp A (symmetric): `.impeccable/mocks/comp-a-symmetric.png`, sidecar `.impeccable/mocks/comp-a-symmetric.json` (`approved: true`). Ledger book lies open flat, facing the viewer straight-on, centered and dominant, filling most of the hero's width. Headline above it, subhead below headline, one primary CTA button below that. Nav: wordmark left, ghost "Sign In" + solid gold "Get Started" right.

## Memorable moment
The hero itself reads as an actual page from the product — an opened ledger with real business names and dollar rows climbing to one bold combined total, gold-foil rule beneath it. The book *is* the product's own P&L, not a decorative object next to it.

## Headline
"One ledger — for every business you run." (confirmed by user, replaces "One ledger. Every business.")

## Comp inventory / implementation medium
- Ledger book (cover, gold tooling, open pages, ruled tables, tabular rows, gold rule under total) — **raster**: photographic material (leather, gold foil, paper grain) with lighting/depth per the medium gate; regenerate at asset resolution from the approved comp's prompt, do not crop from the comp itself.
- Nav bar, wordmark, Sign In / Get Started buttons, headline, subhead, body copy — **semantic HTML/CSS**, real live text, IBM-Plex-successor serif/sans pairing to be chosen at build (Bodoni Moda-class high-contrast serif for display, a humanist serif or sans for body — final pick made in DESIGN.md at finish, not before).
- Hairline gold rules, section dividers — **CSS** (border/box-shadow), matching the "letterpress hairline" material language, no photographed asset needed for a 1px rule.
- Screenshot gallery windows (5 real app screenshots) — existing raster assets (`public/landing/screenshot-*.png`), reframed/re-matted into the new world's window/frame treatment (ledger-page mat, not the old brass-screwed panel).
- Sign In / Sign Up card — semantic HTML/CSS, styled as an inset ledger-paper card within the new world (replaces the old bakelite panel card), must preserve the existing Sign In / Sign Up toggle behavior built this session (`SignInPanel` component logic untouched, only visual skin changes).

## Resolved decisions
- App's own in-product Tailwind theme (`src/index.css`) DOES get retinted to match this new palette (user confirmed), same relationship as last time's switchboard retint. Update `@theme` tokens (slate/emerald/rose/amber family) to derive from this world's hex values.

## Unresolved decisions
- Exact typography pick (Didone/high-contrast serif candidate vs. a warmer transitional serif) — decide and record at DESIGN.md finish, not before, per new-work.md's own-world discipline.
- Whether the feature-strip / mechanism-demo section keeps its current "click a jack to isolate a business" interaction (needs a new physical metaphor in the ledger world, e.g. flipping between ledger pages/tabs) or is restructured — decide during build, staying inside the approved world's material language.
