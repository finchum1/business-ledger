---
name: Sovereign Books — Landing (Played-Straight Fintech World)
description: A near-black graphite fintech surface with one restrained champagne-gold accent and real app screenshots in browser-chrome frames — the category standard (Mercury/Ramp/Brex) executed straight, no governing object metaphor.
colors:
  bg-deep: "#0a0b0d"
  bg: "#0d0f12"
  bg-raised: "#16181c"
  bg-raised-2: "#1d2025"
  ink: "#f4f4f2"
  ink-dim: "#9a9ca3"
  gold: "#cbb078"
  gold-bright: "#ddc48f"
  gold-dim: "#8a7856"
  income: "#34d399"
  income-dim: "#123b2c"
  expense: "#f87171"
  expense-dim: "#3d1e1e"
  border: "rgba(255, 255, 255, 0.08)"
  border-strong: "rgba(255, 255, 255, 0.14)"
typography:
  display:
    fontFamily: "'Hanken Grotesk', system-ui, 'Segoe UI', Roboto, sans-serif"
    fontSize: "clamp(2.25rem, 5.5vw, 3.4rem)"
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "'Hanken Grotesk', sans-serif"
    fontSize: "1.875rem"
    fontWeight: 600
    lineHeight: 1.1
  title:
    fontFamily: "'Hanken Grotesk', sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.15
  body:
    fontFamily: "'Hanken Grotesk', sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "'Hanken Grotesk', sans-serif"
    fontSize: "11px"
    fontWeight: 500
    letterSpacing: "0.12em"
  tabular:
    fontFamily: "'Hanken Grotesk', sans-serif"
    fontVariation: "tabular-nums"
    fontWeight: 500
rounded:
  md: "8px"
  lg: "12px"
  full: "9999px"
spacing:
  xs: "6px"
  sm: "12px"
  md: "20px"
  lg: "32px"
  xl: "48px"
  2xl: "80px"
components:
  button-primary:
    backgroundColor: "{colors.gold}"
    textColor: "{colors.bg-deep}"
    rounded: "{rounded.lg}"
    padding: "10px 20px"
  button-primary-hover:
    backgroundColor: "{colors.gold-bright}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "10px 16px"
  input-field:
    backgroundColor: "{colors.bg-raised-2}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "10px 12px"
---

# Design System: Sovereign Books — Landing (Played-Straight Fintech World)

## Overview

**Creative North Star: "Category Standard, Played Straight"**

This is the third visual world this landing page has shipped, and the first with no governing object or place metaphor. The first world ("Switchboard," a patch-bay panel) and the second ("The House Ledger," a bound accounting ledger) were each retired in full. This time the user was dealt a bespoke-tailoring concept ("Cut to Measure") and chose to skip it, naming Mercury, Ramp, and Brex directly as the craft bar instead: a private fintech product rendered at full craft with no conceit standing between the viewer and the product. The whole page reads as one register — near-black graphite grounds, a single restrained champagne-gold accent, and the real running app mounted in a browser-chrome frame — rather than a material or narrative world. Because no approved comp image was pinned for this canon path, this world is judged against the general register of the named real references, not against a screenshot fixed at build time; a future editor should keep checking new work against how Mercury/Ramp/Brex actually look and behave, not only against this file's prose.

There is no photographed or textured material asset anywhere on this page — a first for this product across all three worlds. Every surface is flat color plus one shared, page-level SVG-noise grain (`.sb-grain`) applied once, not per-card material texture. Typography is a second deliberate departure: one grotesque family (Hanken Grotesk) carries headlines, body copy, and tabular dollar figures alike via CSS `font-variant-numeric: tabular-nums`, replacing both prior worlds' serif/mono splits — because the named references actually set type this way. Geist was the first pick and was swapped mid-build after the project's own mechanical detector flagged it by name as one of a handful of faces so common across AI-generated UIs that it reads as a tell rather than a choice.

The product itself was renamed from "Business Ledger" to "Sovereign Books" in this same session (see PRODUCT.md for the shortlist). The GitHub repo and Vercel project rename to match is still pending on the user's end — no `gh` CLI or Vercel rename tool was available in this environment — so the working folder name (`business-ledger`) and the shipped product name currently differ; that is expected, not a defect.

**Key Characteristics:**
- Near-black graphite grounds (`#0a0b0d` / `#0d0f12`) with a single champagne-gold accent (`#cbb078`) used sparingly — button fills, small marks, focus rings — never a wash.
- One type family (Hanken Grotesk) for everything, including dollar figures set with tabular numerals rather than a separate mono face.
- No photographed material anywhere; a single shared, faint page-level SVG grain overlay (`.sb-grain`, ~3.5% opacity, overlay blend) is the only depth-suggesting texture.
- The signature device is `BrowserFrame` — a traffic-light-dot, hairline-bordered browser chrome wrapping a real app screenshot — used for both the hero image and the "real thing, running" screenshot gallery.
- Real dollar totals climb digit-by-digit on activation (`TickerTotal`, 700ms cubic ease-out) rather than snapping or counting linearly.

## Colors

A near-black graphite palette with one warm gold accent and two semantic signal colors; deliberately unsaturated compared to both prior worlds, matching how the named references treat color as accent rather than atmosphere.

### Primary
- **Graphite Ground** (`#0a0b0d` deepest / `#0d0f12` base): the page background and every section's flat ground — nav, hero, alternating section backgrounds. Always flat color, never a gradient or textured fill.

### Secondary
- **Champagne Gold** (`#cbb078` base / `#ddc48f` bright / `#8a7856` dim): the one accent — primary button fill and its hover state, the wordmark mark, `RowDot`'s active fill, link text, focus-ring glow, `::selection` tint, and input caret color. Ties back to "Sovereign" without reaching for the literal brass/gold-foil material language of the retired ledger world.

### Tertiary
- **Income Green** (`#34d399`) / **Expense Red** (`#f87171`): transaction-sign colors — positive totals, active `TickerTotal` figures, status/success text (green) and error text (red). Reserved for figures and status, never decorative.

### Neutral
- **Raised Panel** (`#16181c` / `#1d2025`): card and input backgrounds — `Card`, `BrowserFrame`, `sb-input` fields — layered flat over the graphite ground with no material texture.
- **Ink** (`#f4f4f2`) / **Ink Dim** (`#9a9ca3`): primary and secondary text on dark ground throughout.
- **Border** (`rgba(255,255,255,0.08)`) / **Border Strong** (`rgba(255,255,255,0.14)`): the single plain 8%-white hairline used for every card outline, divider, and section rule — a departure from both prior worlds' colored (brass/gold-tinted) hairlines.

### Named Rules
**The One Accent Rule.** Gold appears only on interactive/emphasis elements (buttons, links, active selection state, focus rings, caret, selection highlight) — never as a section wash, card fill, or decorative surface. Everything else is graphite, ink, or the plain white-alpha border.

## Typography

**Display Font:** Hanken Grotesk (with system-ui, Segoe UI, Roboto fallback)
**Body Font:** Hanken Grotesk (same family, no split)
**Label/Mono Font:** none — labels are small tracked Hanken Grotesk; dollar figures are Hanken Grotesk with `font-variant-numeric: tabular-nums`, not a separate mono face

**Character:** One confident grotesque voice carries the entire page — headline, body, caption, and tabular dollar figure — in place of either prior world's display/body/mono split. This is a direct match to how Mercury, Ramp, and Brex actually set type: a single sans doing all the work, with numeral alignment handled by a CSS feature rather than a costume change.

### Hierarchy
- **Display** (600, `clamp(2.25rem, 5.5vw, 3.4rem)`, 1.05 line-height, -0.01em tracking): hero `h1` only.
- **Headline** (600, 1.875rem–2.25rem, 1.1 line-height): section `h2`s (Mechanism, Features, Screenshots, Positioning, Sign-in).
- **Title** (600, 1.5rem, sign-in card heading): also used for the Features row `h3`s at a smaller size (1.125rem).
- **Body** (400, 0.9375rem–1.125rem, 1.6 line-height): running copy in `ink-dim`, capped by `max-w-xl`/`max-w-2xl` containers.
- **Label** (500, 11px, 0.12em tracking, uppercase): the `Tag` primitive — a plain quiet caption, `ink-dim`, used for feature row labels, screenshot captions, sign-in mode badge, and the Mechanism card's business-name/total-row headers. Never a decorative plate or foil mark, unlike either prior world's label device.
- **Tabular** (500, `font-variant-numeric: tabular-nums`): every dollar figure — `TickerTotal` throughout the Mechanism card, footer copyright year. Set in the same Hanken Grotesk face as everything else, distinguished only by the numeral feature.

### Named Rules
**The One-Voice Rule.** Hanken Grotesk is the only typeface on the page — headlines, body, labels, and dollar figures alike. Numeral alignment for money is achieved with `font-variant-numeric: tabular-nums`, never by switching to a mono face. A number set in a different family is not a system figure.

## Layout

A single-column, centered content spine (`max-w-xl` to `max-w-6xl` depending on section) with vertical rhythm of `py-20` (80px) on mobile stepping to `py-28` (112px) at `sm`; horizontal page padding fixed at `px-5` (20px) / `sm:px-8` (32px). Sections alternate between the deepest graphite (`bgDeep`, nav/hero) and a slightly lifted graphite (`bg`, Mechanism/Screenshots/Sign-in) with unbanded sections (Features, Positioning) sitting on `bgDeep` again — a two-tone alternation, plainer than either prior world's strict cover/page or leather/paper banding. The hero's `BrowserFrame` screenshot sits inside a `max-w-4xl` container beneath the centered headline/CTA block — the load-bearing composition of the whole hero, and the template for the Screenshots section's `sm:grid-cols-2` gallery of the same frame repeated five times (the last spanning both columns).

## Elevation & Depth

Flat by design, not layered or lifted: every card and frame is a flat-colored panel bounded by a 1px inset white-alpha hairline (`boxShadow: 0 0 0 1px {border}`) rather than a drawn border, with a soft ambient drop shadow (`0 30–80px, -20px offset, rgba(0,0,0,0.6)`) reserved for the hero `BrowserFrame` and the sign-in card — the two elements meant to visually lift off the page. No card carries a photographed or textured surface; the only depth cue applied page-wide is the single fixed, page-level `.sb-grain` SVG-noise overlay (3.5% opacity, `mix-blend-mode: overlay`) sitting over the whole graphite ground, matching how Mercury and Brex grain their dark fields rather than using a flat, dead black.

### Shadow Vocabulary
- **Card-hairline** (`0 0 0 1px rgba(255,255,255,0.08)`): the standard treatment for every `Card` and `BrowserFrame` — no ambient shadow, edge only.
- **Lifted-panel** (`0 0 0 1px {border}, 0 30–40px / 60–80px -20px rgba(0,0,0,0.6)`): the hero `BrowserFrame` and sign-in `Card` — the two elements given an ambient shadow in addition to the hairline.
- **Focus-glow** (`inset 0 0 0 1px rgba(255,255,255,0.08), 0 0 0 3px rgba(203,176,120,0.35)`): the `.sb-input:focus` ring, gold-tinted, replacing the browser default outline.

### Named Rules
**The Flat-Ground Rule.** No section, card, or frame in this world uses a photographed texture or a decorative gradient standing in for material. Depth comes only from the hairline border, the sparing ambient shadow on the two lifted elements, and the single shared page-level grain.

## Shapes

Corners are moderate and consistent: `rounded-lg` (8px) for buttons and inputs, `rounded-xl` (12px) for every card and frame (`Card`, `BrowserFrame`, sign-in card). There is no per-card ornamental hardware silhouette in this world — no corner brackets, no repeated stamp on every panel — a deliberate departure from both prior worlds' authored-SVG ornament devices. The one recurring drawn mark inside cards is `RowDot`, a plain filled circle with an inset ring and a checkmark glyph on activation, functioning as the SaaS equivalent of a checkbox rather than a diagram element. The brand itself does carry one authored-SVG mark — see `BrandMark` below — but it appears only in the nav/footer wordmark and the app sidebar, never repeated as card decoration.

### BrandMark (signet seal, added after initial ship)
`src/components/BrandMark.tsx` — concentric double rings (`stroke-width` 2.2 / 1.3) around a geometric `S` built from two cubic-bezier hooks, all in the gold accent. Authored SVG, no raster asset, so it scales cleanly from the 22px sidebar mark up to the favicon. Takes a `color` prop (`currentColor` by default) specifically so the same component works both on the landing page's fixed dark world (passed `panel.gold` explicitly) and inside the app's own light/dark-toggling Sidebar (passed `var(--color-amber-400)`, the app's retinted gold token, which is the same hex in both themes by design — this is the one accent color that does not flip with the theme). Also used, flattened onto a `bgDeep` rounded-square backdrop, as `public/favicon.svg` — which replaces a leftover unrelated purple abstract mark from the original Vite scaffold that had never been swapped out. The S's curve direction was verified by rendering candidate paths next to a reference system-font "S" and comparing by eye before committing to the final path — worth doing again if this mark is ever redrawn, since a mirrored/backward S is very easy to end up with from three-control-point bezier reasoning alone.

## Components

### Buttons
- **Shape:** `rounded-lg` (8px).
- **Primary:** `gold` (#cbb078) background, `bgDeep` (#0a0b0d) text, `px-5 py-2.5` padding, medium weight, `hover:brightness-110`, `active:scale-[0.98]`. Used for nav "Get Started," hero "Get Started," and the sign-in submit button.
- **Ghost:** transparent background, `ink` text, no border or ring at rest, `hover:bg-white/5` (nav "Sign In") — the one hover state visually confirmed by screenshot in this build.
- **Hover coverage note:** hover-state code (`hover:brightness-110`, `hover:bg-white/[0.04]`, `hover:bg-white/5`, `hover:opacity-75`) is present on every interactive element — nav buttons, hero CTA, Mechanism row buttons, sign-in submit, and the sign-in/sign-up toggle links — but only the hero/nav "Get Started" button's hover was actually captured and confirmed rendering in a screenshot during finish review. Treat the rest as implemented-but-unverified-by-screenshot, not confirmed.

### Cards / Containers
- **Corner Style:** `rounded-xl` (12px) uniformly — the Mechanism card, Features card, sign-in card, and every `BrowserFrame`.
- **Background:** flat `bgRaised` (#16181c) fill, no texture.
- **Shadow Strategy:** Card-hairline vocabulary by default; Lifted-panel vocabulary for the hero frame and sign-in card only (see Elevation & Depth).
- **Border:** none as a drawn border; the 1px inset white-alpha hairline box-shadow stands in for one, uniformly.
- **Internal Padding:** `p-6` (24px) mobile stepping to `p-8` (32px) at `sm`.

### Inputs / Fields
- **Style:** `bgRaised2` (#1d2025) fill, `ink` text, `rounded-lg`, base state carries a 1px inset white-alpha hairline via the `.sb-input` class (moved out of inline style specifically so the focus rule can override it).
- **Focus:** `.sb-input:focus` adds a 3px gold-tinted glow ring (`rgba(203,176,120,0.35)`) outside the hairline — a real custom focus treatment, unlike the retired ledger world's unstyled `outline:none` gap.
- **Caret / Selection:** `caretColor: panel.gold` is set inline on all three auth inputs, and a page-wide `::selection { background: rgba(203,176,120,0.35) }` rule themes text selection gold. Both are present in code but neither was demonstrated in a screenshot — a static capture cannot show an active selection or a blinking caret. Record as present-in-code, visually unverified, not as a confirmed visual device.
- **Error:** inline text below the form in `expense` (#f87171), `role="alert"`.

### Navigation
- Sticky header on the deepest graphite ground (`bgDeep` at ~90% opacity via `e6` hex alpha) with `backdrop-blur` and a 1px plain white-alpha hairline bottom border. Left: `Wordmark` (the `BrandMark` signet seal at 26px, plus "Sovereign Books" in Hanken Grotesk semibold). Right: ghost "Sign In" then primary "Get Started," both scrolling to the same in-page sign-in card and toggling its mode — no separate nav link list, single-scroll page, unchanged in structure from both prior worlds.

### BrowserFrame (signature component)
The page's one signature device, replacing both the switchboard world's jack/cable vocabulary and the ledger world's photographed ledger book / gold-corner ornament entirely. A flat `rounded-xl` panel with a hairline-bordered top strip holding three plain filled traffic-light dots (`borderStrong` color, no red/yellow/green tinting), wrapping a real app screenshot below. Used identically for the hero's own screenshot and for all five images in the "real thing, running" gallery via `ScreenshotWindow` (which adds a small caption row below: an income-green dot plus a `Tag` label). No decorative panel or object stands in for the product anywhere on this page — every instance of `BrowserFrame` frames a real, freshly recaptured screenshot of the running app, never a mockup or illustration.

### RowDot / TickerTotal (Mechanism device)
The Mechanism section's selector/total mechanic, reinvented a third time. `RowDot` is a plain 18px circle with an inset ring (`border` at rest, `gold` fill when active) and an animated checkmark SVG on activation — the flat SaaS-checkbox equivalent, replacing the switchboard world's `Jack` and the ledger world's `LedgerStamp`. `TickerTotal` climbs digit-by-digit to its value over 700ms with cubic ease-out — the mechanic is unchanged across all three worlds, but it now renders in tabular Hanken Grotesk rather than a mono face, consistent with this world's One-Voice typography rule.

## Do's and Don'ts

### Do:
- **Do** set every dollar figure in Hanken Grotesk with `font-variant-numeric: tabular-nums` — never introduce a separate mono face for numbers on this page.
- **Do** wrap every app screenshot in `BrowserFrame` (hairline top strip, three plain traffic-light dots, no color-coding) rather than a decorative panel, mat, or illustrated mockup.
- **Do** keep the gold accent confined to interactive/emphasis elements (buttons, active state, links, focus ring, caret, selection) — never a section wash or card fill.
- **Do** use the single shared page-level `.sb-grain` overlay for depth on flat graphite grounds; don't introduce a second, per-card texture.
- **Do** move any state style that must win over an inline `style` prop (like the input focus ring) into a CSS class (`.sb-input`) rather than fighting inline-style specificity from React.

### Don't:
- **Don't** reintroduce either retired world's material vocabulary — the switchboard's jacks/cables/lamps/IBM Plex, or the ledger's photographed leather/paper textures, gold-foil corner brackets, or Bodoni Moda/Spectral/Courier Prime type split. Both worlds were replaced in full, not layered under this one.
- **Don't** treat the `::selection` gold tint or the auth-input `caretColor` as a confirmed visual device to extend elsewhere. Both are present in code and reviewed as intentional, but neither was ever demonstrated in a screenshot (a static capture cannot show them); describe them as present-in-code, visually unverified.
- **Don't** treat hover states beyond the hero/nav "Get Started" button as confirmed. The Tailwind hover utilities exist on every interactive element, but only that one button's hover was actually screenshotted; the rest are implemented-but-unverified.
- **Don't** revert to a governing object/place metaphor for this canon path. The user explicitly chose to play the category standard straight against Mercury/Ramp/Brex; a future editor introducing a new controlling metaphor is reopening a decision that was deliberately closed.
- **Don't** use a hard-offset, zero-blur shadow anywhere in this system; every recorded shadow carries real blur, and most surfaces use no shadow at all (hairline only).
