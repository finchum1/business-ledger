---
name: Business Ledger — Landing (Switchboard World)
description: A warm ivory enamel patch-bay panel where every business is a jack on one trunk line.
colors:
  bg-deep: "#f1ead9"
  bg: "#f8f3e6"
  bg-raised: "#fffdf7"
  bg-raised-2: "#fbf6e8"
  brass-dim: "#5c4a28"
  brass: "#8a6a35"
  brass-bright: "#b8935a"
  ink: "#241f16"
  ink-dim: "#6b6252"
  income: "#1c8054"
  income-dim: "#bfe0cf"
  expense: "#c1502a"
  expense-dim: "#f0d2c2"
  amber: "#c98a1f"
  wire: "#d9cdb0"
typography:
  display:
    fontFamily: "'IBM Plex Serif', serif"
    fontSize: "clamp(1.875rem, 4vw, 3rem)"
    fontWeight: 700
    lineHeight: 0.95
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "'IBM Plex Serif', serif"
    fontSize: "1.875rem"
    fontWeight: 700
    lineHeight: 1.1
  title:
    fontFamily: "'IBM Plex Serif', serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.2
  body:
    fontFamily: "'IBM Plex Sans', sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "'IBM Plex Sans', sans-serif"
    fontSize: "11px"
    fontWeight: 500
    letterSpacing: "0.18em"
  mono:
    fontFamily: "'IBM Plex Mono', monospace"
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
    backgroundColor: "{colors.income}"
    textColor: "{colors.bg-raised}"
    rounded: "{rounded.md}"
    padding: "10px 20px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "10px 20px"
  input-field:
    backgroundColor: "{colors.bg-deep}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "10px 12px"
---

# Design System: Business Ledger — Landing (Switchboard World)

## Overview

**Creative North Star: "The Switchboard"**

The landing page is a single warm ivory enamel patch panel, not a page of floating text over a gradient wash. Every surface — hero, feature strip, screenshot mounts, the sign-in card — is a physical insert bolted into the same panel material with real brass screws at its corners. Business identity is expressed as jacks on a trunk line: three businesses patch into one master total, and isolating a single business means literally unplugging the others rather than filtering a list. This is a fixed light world with its own component vocabulary (jacks, cables, lamps, `panelSurface()`); it does not import the app's own light/dark-toggleable Tailwind theme or its component shapes. **The relationship runs the other direction for color**: after this page shipped, the user asked for the app's own colors to match the website, so the app's `slate`/`emerald`/`rose`/`amber` Tailwind tokens (`src/index.css`) were retinted to derive from this page's exact hex values — the landing page's palette is the source of truth for both surfaces' color, even though each surface keeps its own distinct components and layout vocabulary.

This is the shipped result of two build passes, not the first draft. The page originally shipped as a near-black bakelite panel with a condensed cast-metal display face (Big Shoulders) and Space Mono figures. The user asked for the whole page lightened ("a little too dark") and for more business-like typography in the same session; both requests were carried out together as one revision rather than two separate passes, since a lighter ground and a more corporate typeset read as one coherent direction rather than two unrelated tweaks. The physical grammar — jacks, cables, lamps, brass screws, a photographed panel material — is unchanged; vintage switchboards were as often cream/ivory bakelite as black, so the lighter material is period-accurate to the same object, not a different one. Every panel surface still layers a photographed bakelite/gunmetal texture (`panel-texture.jpg`) under a semi-transparent color-tint gradient via a shared `panelSurface()` helper — only the tint pair changed, from near-black stops to warm ivory ones — so the same grain and scratches still show through.

**Key Characteristics:**
- One continuous panel material (photographed texture + tint), never a flat gradient standing in for it.
- Jacks, cables, and lamps as the literal visual grammar for "business" / "connection" / "active state."
- Brass-plate labels sit beside headings, never above them, at every breakpoint.
- Deep emerald reads income/active, rust-red reads expense, amber reads an idle lamp turning on.
- Tabular figures are always IBM Plex Mono; running copy and headlines are never set in it.

## Colors

A warm ivory enamel ground with brass hardware and two signal colors (deep emerald for income/active, rust-red for expense) doing all of the semantic work; amber is reserved for the panel's own idle-to-active lamp state, not for a third semantic meaning. Every signal color was deepened from the original dark-ground palette specifically so it stays legible as text and as button fill against a light ground — the same hue family, tuned for the opposite contrast direction rather than reused unchanged.

### Primary
- **Signal Emerald** (`#1c8054`): the income/active/positive color — patch cables into the trunk, active jacks, the "Sign In" and submit buttons, the combined-total figure. Deep enough to read as text directly on the ivory ground (≈4.8:1) and to carry light button-label text (≈4.9:1) — the original bright mint (`#3ecf8e`) only had to clear the second of those on a dark ground, so it could stay lighter than this.

### Secondary
- **Rust Expense** (`#c1502a`): the expense/negative color — reserved for expense figures and form error text. Never used decoratively.

### Tertiary
- **Amber Lamp** (`#c98a1f`): the panel's own idle-to-active indicator glow (the `Lamp` primitive), and the nameplate's power dot. Not a general accent; it means "this instrument is live," not "this is important."

### Neutral
- **Ivory Deep** (`#f1ead9`): the page's most sunken tone — page background, input field fills. The relative relationship from the original palette is preserved (this is still the tone raised panels lift away from), just inverted in absolute brightness: raised panels are now lighter/whiter than the page rather than the page being the near-black floor.
- **Ivory** (`#f8f3e6`): the alternating section background (features, positioning sections).
- **Ivory Raised** (`#fffdf7`) / **Ivory Raised 2** (`#fbf6e8`): the two tints used inside `panelSurface()` for insets, cards, and the sign-in panel — always layered over the photographed texture, never used as flat fills on their own.
- **Brass Dim** (`#5c4a28`) / **Brass** (`#8a6a35`) / **Brass Bright** (`#b8935a`): hardware and label color — plate-label text, jack rims, cable ferrules, hairline dividers (`rgba(138,107,58,0.28)`). Deepened a step from the original dark-ground brass values so `brass` still clears small-text contrast (≈4:1) as `PlateLabel`'s color against the ivory cards.
- **Ink** (`#241f16`) / **Ink Dim** (`#6b6252`): primary and secondary text on the light ground — a warm near-black and a warm mid-brown-gray, tinted from the same brass/bakelite hue family rather than a neutral gray, per the craft floor's "tint secondary text from the surface hue" rule. These replace the original `cream`/`cream-dim` tokens, which held light colors for a dark ground; the token names changed because their values inverted, not just shifted.

### Named Rules
**The Two-Signal Rule.** Only emerald and rust-red carry semantic meaning (positive/negative, active/isolated). Amber is reserved exclusively for the lamp's own idle→active transition and never doubles as a third semantic color.

## Typography

**Display Font:** IBM Plex Serif (with serif fallback)
**Body Font:** IBM Plex Sans (with sans-serif fallback)
**Label/Mono Font:** IBM Plex Mono for figures; IBM Plex Sans for the `PlateLabel` caption grammar

**Character:** A corporate serif for anything that reads as a heading — the ledger-report, financial-statement register the user asked for in place of the original condensed cast-metal display face — paired with IBM Plex Sans for running copy and micro-labels, and IBM Plex Mono strictly for numbers, so a dollar figure still reads like a mechanical counter rather than body prose. All three are members of the same IBM Plex superfamily, designed as a coordinated serif/sans/mono trio, which is why they harmonize as a set rather than reading as three unrelated choices. IBM Plex was picked over the reflexive "business font" default (Inter) specifically because Inter is on the mechanical detector's overused-font list; IBM Plex Serif/Sans/Mono are not, and IBM Plex carries its own real-world enterprise/corporate association that argues for "business-like" more directly than a startup-default grotesque would.

### Hierarchy
- **Display** (700, `clamp(1.875rem, 4vw, 3rem)`, 0.95 line-height): hero headline only, set in IBM Plex Serif, tracked tight (`tracking-tight`).
- **Headline** (700, 1.875rem–2.25rem, 1.1 line-height): section headings (`h2`), IBM Plex Serif.
- **Title** (600, 1.125rem, 1.2 line-height): feature-row headings (`h3`) and the sign-in card heading, IBM Plex Serif.
- **Body** (400, 0.875–1rem, 1.6 line-height): running copy in IBM Plex Sans, always in `ink-dim` against the light ground, capped near 60ch by its container `max-w-xl`/`max-w-2xl`.
- **Label** (500, 11px, 0.18em tracking, uppercase): the `PlateLabel` primitive — engraved brass-plate captions beside jacks, lamps, and feature tags. Set in IBM Plex Sans, not the serif — a tracked uppercase micro-label reads cleaner in a sans at 11px than in a serif, which is why this is the one place the hierarchy departs from the serif/sans split by role. Always in `brass`.
- **Mono/Tabular** (400/700, IBM Plex Mono): every dollar figure and ledger number, including the `TickerTotal` primitive and business-name captions under jacks. Never used for headlines or body prose.

### Named Rules
**The Mono-Is-For-Numbers Rule.** IBM Plex Mono renders only figures and short data captions (dollar totals, business-name tags under jacks). It never sets a headline, a body paragraph, or a label — monospace here means "measurement," not "technical" costume.

## Layout

A single-column, centered content spine (`max-w-xl` to `max-w-6xl` depending on section) inside a full-bleed light page background, alternating between `bg-deep` and `bg` per section to separate the trunk-line demos from the flatter reading sections. Section vertical rhythm is generous and consistent: `py-20` (80px) on mobile stepping to `py-28` (112px) at `sm`, with horizontal page padding fixed at `px-5` (20px) / `sm:px-8` (32px) throughout. The hero is a centered, full-viewport (`min-h-[85vh]`) nameplate card rather than an inset lower-left card — a later revision in the same build, made so the headline is the first and only thing in the initial viewport instead of sharing it with a demo that duplicates the one in the Mechanism section below. Interactive demo boxes (mechanism demo) are drawn in percentage-space inside a fixed `aspect-ratio` box so jacks and cables stay registered together at any width. The feature terminal strip is a single bordered panel with internal rows separated by 1px hairlines (`border-top`), not a card grid with independent boxes and gutters.

## Elevation & Depth

Hybrid: panels sit on soft, deep ambient shadows (`0 12–20px 30–50px rgba(0,0,0,0.5–0.55)`) that read as physical insets mounted into the wall panel, plus a thin inset brass-tinted ring (`inset 0 0 0 1px rgba(138,107,58,0.35–0.45)`) standing in for a beveled metal edge. There is no hard-offset/zero-blur shadow anywhere in this system — every shadow carries real blur. Depth also comes from material, not just shadow: the photographed texture under every panel and the separate glow-ring layered over the (visually fixed-material) jack photo both read as physical depth cues that a flat gradient could not supply. The ambient shadow rgba values stayed dark (not lightened) even though the ground did — a shadow is still a shadow regardless of what it's cast onto, so only the ring and gradient tints moved to the light palette.

### Shadow Vocabulary
- **Panel-mount** (`inset 0 0 0 1px rgba(138,107,58,0.35–0.45), 0 12px–20px 30px–50px rgba(0,0,0,0.5–0.55)`): the standard treatment for every raised insert — hero card, sign-in card, screenshot windows, mechanism readout.
- **Lamp glow** (`0 0 Npx N*0.5px {color}66, 0 0 N*0.5px {color}`): ambient, state-driven only — appears when a `Lamp` goes active, absent at rest.
- **Jack seat-flash** (`0 0 0 2px {color}` animating to `scale: 1.7, opacity: 0`): a one-shot ring pulse fired for 550ms when a jack transitions to active, verified against the component's real timer rather than assumed from the code.

### Named Rules
**The Material-Before-Gradient Rule.** No panel surface is a flat CSS gradient. Every panel, card, and inset layers a photographed texture (bakelite grain or brass screw/jack photography) under a semi-transparent color tint via `panelSurface()`; the tint sets mood, the photograph supplies material.

## Shapes

Corners are moderate and consistent: `rounded` (4px) for small chips and screw caps, `rounded-lg` (8px) for buttons, inputs, and inset panels, `rounded-xl` (12px) for the largest containers (feature strip, sign-in card outer edge), `rounded-full` for lamps, jacks, and the nameplate's power dot. Four brass screws (`BrassScrews`, a photographed macro asset) mark the corners of every mounted panel — hero card, sign-in card, screenshot windows, feature strip, mechanism readout — as the system's one consistent hardware silhouette. Patch cables are drawn as SVG cubic-bezier paths with a sagging catenary curve (`sag` prop, 22–28 units in a 0–100 viewBox), never straight lines, with a small brass ferrule ellipse at the jack end standing in for a connector tip.

## Components

### Buttons
- **Shape:** `rounded-lg` (8px).
- **Primary:** `income` (#1c8054) background, `bg-raised` (#fffdf7, near-white) text, `px-5 py-2.5` (20px/10px) padding, medium weight, `active:scale-[0.98]` on press. Used for every primary action (nav Sign In, hero Sign In, sign-in form submit). The button label token changed from `bg-deep` to `bg-raised` in this revision: the original dark-ground button used its darkest neutral as dark-on-light-green text, but `income` is now itself a fairly dark green, so the label needs the palette's lightest neutral, not its most sunken one, to stay readable.
- **Ghost:** transparent background, `ink` text, a 1px inset hairline ring (`inset 0 0 0 1px rgba(138,107,58,0.22)`) standing in for a border. Used for the hero's secondary "See it work" action, paired with a drawn chevron-down SVG (never a Unicode/emoji glyph).

### Cards / Containers
- **Corner Style:** `rounded-lg` (8px) for insets and the screenshot window, `rounded-xl` (12px) for the sign-in card and feature strip.
- **Background:** always `panelSurface()` — a texture-under-tint composite, never a flat fill.
- **Shadow Strategy:** Panel-mount shadow vocabulary (see Elevation & Depth).
- **Border:** none as a drawn border; the beveled edge is simulated with the inset brass hairline box-shadow instead.
- **Internal Padding:** `p-6` (24px) mobile stepping to `p-8` (32px) at `sm` for card interiors; `px-6 py-6`/`px-8` for feature-strip rows.

### Inputs / Fields
- **Style:** `bg-deep` fill, `ink` text, `rounded-lg`, 1px inset hairline ring in place of a drawn border, `px-3 py-2.5`.
- **Focus:** currently relies on the browser default focus outline (`focus:outline-none` is set on the input but no custom focus treatment replaces it) — still recorded as a gap, not a rule, carried over unchanged from the prior revision; a future pass should theme focus-visible from the palette per the craft floor's browser-surfaces check.
- **Error:** inline text below the field in `expense` (#c1502a) color, `role="alert"`.

### Navigation
- Sticky header, `bg-deep` at 87% opacity with `backdrop-blur`, 1px brass hairline bottom border. Left: the `Nameplate` (a small panel-textured square housing an amber power dot, plus the wordmark in IBM Plex Serif). Right: a single primary button ("Sign In") — no nav link list, because the page is single-scroll with in-page anchors.

### Jack / Cable / Lamp (signature components)
The page's one true signature system, unchanged in mechanics by this revision. A `Jack` is a photographed brass socket (`jack-socket.png`) whose own metal never changes color — active/inactive state lives entirely in a separate glow-ring layered on top (`inset`/outer box-shadow in the signal color) plus a `brightness/saturate` filter dim when inactive, so the physical object and its electrical state stay visually separate, the way a real jack's socket and its indicator lamp are separate parts. A `PatchCable` is an SVG cubic-bezier with a sagging catenary and a brass ferrule at the termination (fill `brass-bright`, stroke `ink` — both retinted from hardcoded dark-ground hex values to palette tokens in this revision), animated in with a spring (`stiffness: 90, damping: 15`) rather than a linear tween. A `Lamp` is a small filled circle, dark at rest, glowing in the signal color on activation via a 0.5s ease-out shadow transition. `TickerTotal` climbs to its value over 900ms with cubic ease-out, rendered in IBM Plex Mono — an adding-machine climb, not a linear count or a spring overshoot.

## Do's and Don'ts

### Do:
- **Do** build every panel surface with `panelSurface()` (photographed texture + tint gradient) — never a flat CSS gradient standing in for bakelite or brass.
- **Do** keep plate labels (`PlateLabel`) positioned beside their heading or content, using DOM order plus responsive `order` classes so the label never sits above the heading at any breakpoint, including mobile stack.
- **Do** reserve IBM Plex Mono strictly for figures and short data captions; set headlines in IBM Plex Serif and body copy/labels in IBM Plex Sans.
- **Do** give every shadow real offset and blur (see the Panel-mount vocabulary); depth communicates through blur and material layering, not flat halos.
- **Do** draw icons as authored SVG (e.g. the chevron) in a single consistent stroke weight — never a Unicode glyph or emoji.
- **Do** tint secondary/dim text from the palette's own brass/bakelite hue (`ink-dim`) rather than a neutral gray, on both the light ground and inside colored surfaces.

### Don't:
- **Don't** use a same-size icon+heading+text card grid for feature sections. This world's features are one continuous hairline-divided terminal strip off a shared trunk, not independent cards — the original build did this and was rebuilt.
- **Don't** place a kicker/eyebrow label directly above a heading at any breakpoint. Plate labels sit beside content via flex-order, never stacked above it — two instances of the banned pattern were found and repositioned during finish review.
- **Don't** render a panel, card, or inset as a flat CSS gradient with no photographed material underneath. Three surfaces shipped this way originally (hero, panels, jack sockets) and were rebuilt with real texture/photo assets.
- **Don't** bake active-state color into a jack's own socket material. State lives in the separate glow-ring layered on top of a fixed-material photograph, matching how a real jack's metal doesn't change color while its indicator lamp does.
- **Don't** use a hard-offset, zero-blur shadow anywhere in this system. It was never adopted and does not belong to this material world.
- **Don't** reuse a signal color's dark-ground hex value unchanged after a light-ground revision (or vice versa). `income`, `expense`, `amber`, `brass`, and the hairline rgb all shifted a step darker in this revision specifically so they still clear text/small-element contrast against the new ivory ground; carrying the old values forward onto a new ground was the single biggest risk in this pass, not a rule that was tempting to break for effect.
