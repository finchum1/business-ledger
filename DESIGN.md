---
name: Business Ledger — Landing (House Ledger World)
description: A bound accounting ledger book — deep bottle-green leather, gold foil tooling, cream ledger-paper insets — replacing the earlier Switchboard world entirely.
colors:
  bg-deep: "#0f2b21"
  bg: "#0c231b"
  bg-raised: "#f4ecdb"
  bg-raised-2: "#efe3cc"
  brass-dim: "#8a6a2e"
  brass: "#b8914a"
  brass-bright: "#d9b876"
  ink: "#16140f"
  ink-dim: "#5a5142"
  cream: "#f4ecdb"
  cream-dim: "#b9ad93"
  income: "#1c7a4d"
  income-dim: "#c8e3d3"
  expense: "#6b2a24"
  expense-dim: "#e3c9c3"
  amber: "#b8914a"
  wire: "#3c5346"
  hairline: "rgba(184, 145, 74, 0.32)"
typography:
  display:
    fontFamily: "'Bodoni Moda', serif"
    fontSize: "clamp(2.25rem, 5.5vw, 3.75rem)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "'Bodoni Moda', serif"
    fontSize: "1.875rem"
    fontWeight: 700
    lineHeight: 1.1
  title:
    fontFamily: "'Bodoni Moda', serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.2
  body:
    fontFamily: "'Spectral', serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "'Work Sans', sans-serif"
    fontSize: "11px"
    fontWeight: 500
    letterSpacing: "0.16em"
  mono:
    fontFamily: "'Courier Prime', monospace"
    fontWeight: 400
rounded:
  sm: "4px"
  md: "8px"
  lg: "12px"
  full: "9999px"
spacing:
  xs: "6px"
  sm: "10px"
  md: "16px"
  lg: "24px"
  xl: "40px"
  2xl: "80px"
components:
  button-primary:
    backgroundColor: "{colors.brass}"
    textColor: "{colors.bg-deep}"
    rounded: "{rounded.md}"
    padding: "10px 20px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.cream}"
    rounded: "{rounded.md}"
    padding: "10px 20px"
  input-field:
    backgroundColor: "{colors.bg-raised-2}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "10px 12px"
---

# Design System: Business Ledger — Landing (House Ledger World)

## Overview

**Creative North Star: "The House Ledger"**

The landing page is a bound accounting ledger, not an industrial panel and not a generic dark-fintech gradient. The product's own real output — a business's running total, a tabular P&L — becomes the entire visual system: a photographed open ledger book anchors the hero with live HTML business names and dollar figures set directly over its blank ruled pages, and every section down the page alternates between deep bottle-green leather grounds and cream ledger-paper insets, the way a physical ledger alternates a leather cover and its paper interior. Gold foil corner-tooling brackets (`GoldCorners`) mark every card's corners in place of the old world's brass screws, and a hand-drawn ink/gold stamp (`LedgerStamp`) is the page's one interactive diagram element, replacing the previous world's jack-and-patch-cable metaphor outright.

This is the second visual world this page has shipped. The prior "Switchboard" world (warm ivory patch-bay panel, jacks/cables/lamps, IBM Plex family) was retired in full at the user's explicit request — "too industrial... premium / elegant finance" — not revised in place. Nothing from that world's component vocabulary (jacks, cables, lamps, `panelSurface()`) carries forward; this file replaces that system's DESIGN.md rather than amending it. As before, the app's own in-product Tailwind tokens (`slate`/`emerald`/`rose`/`amber` in `src/index.css`) were retinted to derive from this page's palette at the user's explicit request, so the landing page's colors remain the source of truth for both surfaces even though each keeps its own distinct component vocabulary and layout.

**Key Characteristics:**
- A real photographed ledger book as the hero's own image, with live text (not baked into the raster) overlaid in container-query percentage units so it stays crisp and registered to the ruled lines.
- Section grounds alternate `leatherSurface()` (deep green) and `paperSurface()` (cream) down the page, mirroring a ledger's cover-to-page structure.
- Gold foil corner brackets (authored SVG) mark every card/panel's four corners; a gold/ink stamp seal is the one interactive selector device, reused as the Features-strip bullet icon.
- Every dollar figure is set in Courier Prime; display headlines are Bodoni Moda; body copy (including the live text over the hero photo) is Spectral.
- Real dollar figures inside a card use a dotted CSS leader line between name and amount — classic ledger dot-leader typography — never a plain flex-justify gap.

## Colors

A deep bottle-green leather ground with gold foil hardware and two signal colors (income green, expense oxblood) carrying all semantic weight; the palette is a straight material re-skin of the previous ivory/brass Switchboard palette onto a dark leather ground, not a new hue family.

### Primary
- **Bottle-Green Leather** (`#0f2b21` deep / `#0c231b` base): the dominant ground — nav, hero, and every alternating "dark" section (Features, Positioning, Sign-in, footer). Always applied through `leatherSurface()`, a photographed leather-texture image layered under a color-tint gradient, never a flat fill.

### Secondary
- **Gold Foil** (`#b8914a` base / `#8a6a2e` dim / `#d9b876` bright): the metal/foil family — corner tooling brackets, hairline dividers (`rgba(184,145,74,0.32)`), the primary button fill, plate-label text on cream surfaces, the `LedgerStamp` seal.

### Tertiary
- **Income Green** (`#1c7a4d`) / **Expense Oxblood** (`#6b2a24`): the transaction-sign colors — positive/active totals and negative/error text respectively. Used only for figures and status text, never decoratively.

### Neutral
- **Ledger Paper Cream** (`#f4ecdb` / `#efe3cc`): the two cream tints composed inside `paperSurface()` for every light inset — Mechanism card, Features-strip inset panel, screenshot mats, sign-in card, input fills. Always layered over the photographed paper-grain texture, never a flat fill on its own.
- **Ink** (`#16140f`) / **Ink Dim** (`#5a5142`): primary and secondary text set inside cream/paper insets.
- **Cream** (`#f4ecdb`) / **Cream Dim** (`#b9ad93`): primary and secondary text set directly on the green leather ground (nav wordmark, hero body copy, footer copyright).

### Named Rules
**The Two-Ground Rule.** Every section is either a `leatherSurface()` (deep green) or `paperSurface()` (cream) ground — there is no third page background. Text color follows the ground: `cream`/`cream-dim` on leather, `ink`/`ink-dim` on paper.

## Typography

**Display Font:** Bodoni Moda (with serif fallback)
**Body Font:** Spectral (with serif fallback)
**Label/Mono Font:** Work Sans for tracked utility labels; Courier Prime for every dollar figure

**Character:** A high-contrast Didone display face (Bodoni Moda) whose hairline/thick stroke contrast echoes engraved gold tooling and letterpress ledger printing, paired with Spectral for body copy (including the live business-name/dollar text set directly over the hero photograph) and Courier Prime strictly for tabular dollar figures, so every number reads with typewritten ledger-entry character rather than a "technical" mono costume. Work Sans is reserved for small tracked-uppercase utility labels (`PlateLabel`, nav, buttons) — the one grotesque in an otherwise serif-dominant system, used narrowly enough that it reads as a caption grammar, not a competing voice.

### Hierarchy
- **Display** (700, `clamp(2.25rem, 5.5vw, 3.75rem)`, 1.05 line-height): hero headline only, Bodoni Moda, tight tracking.
- **Headline** (700, 1.875rem–2.25rem, 1.1 line-height): section headings (`h2`), Bodoni Moda.
- **Title** (600–700, 1.125rem–1.875rem): sign-in card heading and feature-row `h3`s, Bodoni Moda.
- **Body** (400, 0.9375rem–1.125rem, 1.6 line-height): running copy in Spectral, `ink-dim`/`cream-dim` depending on ground, capped by `max-w-xl`/`max-w-2xl` containers.
- **Label** (500, 11px, 0.16em tracking, uppercase): the `PlateLabel` primitive — Work Sans, `brass` on cream or `ink-dim` on leather depending on the `dark` prop.
- **Mono/Tabular** (400–700, Courier Prime): every dollar figure — `TickerTotal`, hero overlay amounts, footer copyright date. Never used for headlines or body prose.

### Named Rules
**The Mono-Is-For-Money Rule.** Courier Prime renders only dollar figures and the running total ticker — never a headline, a label, or body prose. A number set in any other face is not a system figure.

## Layout

A single-column, centered content spine (`max-w-xl` to `max-w-6xl` depending on section) with generous, consistent vertical rhythm: `py-20` (80px) on mobile stepping to `py-28` (112px) at `sm`, horizontal page padding fixed at `px-5` (20px) / `sm:px-8` (32px). Sections down the page strictly alternate leather and paper grounds in this order: nav+hero (leather), Mechanism (paper), Features (leather, with a cream inset panel nested inside), Screenshots (paper), Positioning statement (leather), Sign-in (leather, with a cream card nested inside), footer (leather). The hero's photographed ledger book is laid out with `containerType: 'inline-size'` and its overlaid business-name/amount text positioned in container-query percentage units (`cqw`) so live text stays registered to the photograph's ruled lines at any width — this is the load-bearing layout technique of the whole hero and should not be replaced with fixed-pixel positioning on any future asset of this kind. The Screenshots section uses a plain `sm:grid-cols-2` grid, the one section without a shared alternating-ground inset wrapper around its children.

## Elevation & Depth

Hybrid: cards sit on soft, deep ambient shadows (`0 12–30px, 30–70px blur, rgba(0,0,0,0.12–0.5)`) plus a thin inset gold-tinted hairline ring (`inset 0 0 0 1px rgba(184,145,74,0.32)`) standing in for a beveled edge — consistent with the retired Switchboard world's shadow grammar, carried forward material-for-material rather than reinvented. Depth also comes from material: `leatherSurface()` and `paperSurface()` both layer a photographed texture under a color-tint gradient rather than a flat CSS gradient standing in for one.

One material device shipped but reads as too subtle to record as an established rule: `giltEdgeShadow` (a thin gold-to-transparent inset gradient meant to suggest a gilded stack of ledger pages seen side-on) is composed into the `boxShadow` chain of every major card, and `PlateLabel`'s `dark` variant carries a two-line `textShadow` meant to suggest a foil-stamped impression on gold text. Both landed in code and both were reviewed in the build's finish pass, which judged neither clearly perceptible in the rendered screenshots; the user chose to ship as-is rather than fund a further pass. Treat these as a present-but-faint implementation detail, not a legible material language element to imitate or extend on new surfaces.

### Shadow Vocabulary
- **Card-mount** (`inset 0 0 0 1px rgba(184,145,74,0.32), 0 12–30px / 30–70px rgba(0,0,0,0.12–0.5)`): the standard treatment for every raised card — hero photo, sign-in card, Mechanism card, screenshot windows, Features inset panel.
- **Stamp-flash** (`0 0 0 2px {brass}` animating to `scale: 1.6, opacity: 0`): a one-shot ring pulse fired for 500ms when `LedgerStamp` transitions to active.

### Named Rules
**The Material-Before-Gradient Rule.** No section ground or card surface is a flat CSS gradient. Every one layers a photographed texture (leather or ledger-paper grain) under a semi-transparent color-tint gradient via `leatherSurface()`/`paperSurface()`; the tint sets mood, the photograph supplies material.

## Shapes

Corners are moderate: `rounded` (4px) small elements, `rounded-lg` (8px) buttons/inputs/most cards, `rounded-xl` (12px) the largest containers (sign-in card, Features inset panel). Four gold-foil corner-tooling brackets (`GoldCorners`, authored SVG, not a raster asset) mark the corners of every card — sign-in card, Mechanism card, screenshot windows, Features inset panel — as the system's one consistent hardware silhouette, replacing the Switchboard world's photographed brass screws with a flat, crisp-at-any-size drawn ornament. The `LedgerStamp` seal is drawn as authored SVG (radial tick marks plus a fillable circle and checkmark), a flat countable diagram element rather than a photographed object, consistent with how the corner glyph is drawn rather than photographed.

## Components

### Buttons
- **Shape:** `rounded-lg` (8px).
- **Primary:** `brass` (#b8914a) background, `bg-deep` (#0f2b21) text, `px-5 py-2.5` padding, medium weight, `active:scale-[0.98]` on press. Used for nav "Get Started" and hero "Get Started."
- **Ghost:** transparent background, `cream` text, a 1px inset gold hairline ring in place of a border. Used for the nav's "Sign In" button.

### Cards / Containers
- **Corner Style:** `rounded-lg` (8px) for the Mechanism/Screenshot cards, `rounded-xl` (12px) for the sign-in card and Features inset panel.
- **Background:** always `paperSurface()` for light insets or a flat cream fill (`bgRaised`) for the Mechanism card; never a flat gradient standing in for the leather/paper texture.
- **Shadow Strategy:** Card-mount shadow vocabulary (see Elevation & Depth); most cards also carry `GoldCorners` and the (subtle, not strongly legible) `giltEdgeShadow`.
- **Border:** none as a drawn border; a 1px inset gold hairline box-shadow stands in for one.
- **Internal Padding:** `p-6` (24px) mobile stepping to `p-8` (32px) at `sm`.

### Inputs / Fields
- **Style:** `bg-raised-2` (#efe3cc) fill, `ink` text, `rounded-lg`, 1px inset gold hairline ring in place of a border, `px-3 py-2.5`.
- **Focus:** relies on `focus:outline-none` with no custom focus-visible treatment substituted — a recorded gap, not a rule; a future pass should theme focus state from the gold palette.
- **Error:** inline text below the field in `expense` (#6b2a24), `role="alert"`.

### Navigation
- Sticky header on the same `leatherSurface()`-tinted ground as the hero, at ~90% opacity (`e6` hex alpha) with `backdrop-blur`, 1px gold hairline bottom border. Left: `Nameplate` (a small cream-paper square housing a glowing gold dot, plus "Business Ledger" set in Bodoni Moda). Right: ghost "Sign In" then primary "Get Started," both scrolling to the same in-page sign-in card and toggling its mode — no separate nav link list, single-scroll page.

### Ledger Stamp / Ticker Total (signature components)
The page's signature interaction system, replacing the retired Switchboard world's jack/cable/lamp vocabulary entirely. `LedgerStamp` is an authored SVG seal — radial tick marks around a circle that fills gold and draws a checkmark when active, with a one-shot expanding ring pulse (`justStamped`, 500ms) the first time it activates — used as the Mechanism section's row selector and reused unchanged as the Features-strip bullet icon. `TickerTotal` climbs digit-by-digit to its value over 900ms with cubic ease-out, rendered in Courier Prime — an adding-machine climb, not a linear count or spring overshoot. Inside the Mechanism card, a dotted CSS border (`border-b border-dotted`) forms a leader line between a business name and its `TickerTotal` amount — classic ledger dot-leader typography, the one typographic device unique to this world with no equivalent in the retired Switchboard system.

## Do's and Don'ts

### Do:
- **Do** build every section ground and card surface with `leatherSurface()` or `paperSurface()` (photographed texture + tint gradient) — never a flat CSS gradient standing in for leather or ledger paper.
- **Do** alternate leather and paper grounds strictly section-by-section down the page; don't introduce a third page background.
- **Do** reserve Courier Prime strictly for dollar figures and the running-total ticker; set headlines in Bodoni Moda and body copy/labels in Spectral/Work Sans respectively.
- **Do** overlay live HTML text on photographed ledger-page assets in container-query percentage units (`cqw`) rather than baking numbers into a raster image — a raster attempt at this text rendered as garbled lettering during the build.
- **Do** draw signature diagram elements (corner brackets, the stamp seal) as authored SVG, not photographed objects, since they are flat countable ornaments rather than lit physical objects.
- **Do** use a dotted leader line between a label and its trailing figure inside ledger-style rows (Mechanism card) — this is the system's one recurring ledger-typography device.

### Don't:
- **Don't** reintroduce the retired Switchboard world's jack/cable/lamp vocabulary, brass-screw photography, or IBM Plex typeface family on this page. That world was replaced in full, not layered under this one.
- **Don't** render a section ground or card as a flat CSS gradient with no photographed material underneath.
- **Don't** treat the gilt-edge card shadow or the foil-stamp text-shadow on gold `PlateLabel` text as an established, legible material device to extend onto new surfaces. Both shipped and remain in code, but finish review judged them too subtle to read clearly in screenshots, and the user chose to ship rather than fund a fix; describe them as a present-but-faint implementation detail, not a house rule to imitate.
- **Don't** place a kicker/eyebrow label directly above a heading. `PlateLabel` sits beside content (row labels, nav caption) in this build, never stacked above a heading as a standalone eyebrow — no instance of that pattern shipped on this page, and none should be added.
- **Don't** use a hard-offset, zero-blur shadow anywhere in this system; every recorded shadow carries real blur.
