---
name: Business Ledger — Landing (Switchboard World)
description: A near-black bakelite patch-bay panel where every business is a jack on one trunk line.
colors:
  bg-deep: "#0c0906"
  bg: "#161009"
  bg-raised: "#1f170e"
  bg-raised-2: "#241c11"
  brass-dim: "#6e5936"
  brass: "#b8935a"
  brass-bright: "#e3c383"
  cream: "#ece0c8"
  cream-dim: "#a89878"
  income: "#3ecf8e"
  income-dim: "#1f5e42"
  expense: "#e07348"
  expense-dim: "#6e3521"
  amber: "#f4a623"
  wire: "#332818"
typography:
  display:
    fontFamily: "'Big Shoulders Display', sans-serif"
    fontSize: "clamp(1.875rem, 4vw, 3rem)"
    fontWeight: 700
    lineHeight: 0.95
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "'Big Shoulders Display', sans-serif"
    fontSize: "1.875rem"
    fontWeight: 700
    lineHeight: 1.1
  title:
    fontFamily: "'Big Shoulders Display', sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.2
  body:
    fontFamily: "'Big Shoulders Text', sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "'Big Shoulders Display', sans-serif"
    fontSize: "11px"
    fontWeight: 500
    letterSpacing: "0.18em"
  mono:
    fontFamily: "'Space Mono', monospace"
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
    textColor: "{colors.bg-deep}"
    rounded: "{rounded.md}"
    padding: "10px 20px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.cream}"
    rounded: "{rounded.md}"
    padding: "10px 20px"
  input-field:
    backgroundColor: "{colors.bg-deep}"
    textColor: "{colors.cream}"
    rounded: "{rounded.md}"
    padding: "10px 12px"
---

# Design System: Business Ledger — Landing (Switchboard World)

## Overview

**Creative North Star: "The Switchboard"**

The landing page is a single near-black bakelite patch panel, not a page of floating text over a gradient wash. Every surface — hero, feature strip, screenshot mounts, the sign-in card — is a physical insert bolted into the same panel material with real brass screws at its corners. Business identity is expressed as jacks on a trunk line: three businesses patch into one master total, and isolating a single business means literally unplugging the others rather than filtering a list. This is a fixed dark world; it is not part of the app's own light/dark-toggleable theme and does not inherit or export tokens to it.

This is the shipped result of a rebuild pass, not the first draft. The first attempt centered a floating text stack in the hero (rejected — contradicts the panel-as-hero contract), used a same-size icon+heading+text card grid for the features section (rejected — the world's own line is a continuous trunk, not a card grid), and rendered every panel as a flat CSS gradient (rejected — the world's own material is bakelite/brass, and flat gradient does not read as that material). All three were rebuilt before this record was written: the nameplate is inset lower-left into a full-bleed panel-textured hero; features are one hairline-divided terminal strip; every panel surface layers a photographed bakelite/gunmetal texture (`panel-texture.jpg`) under a semi-transparent color-tint gradient via a shared `panelSurface()` helper, so grain and scratches show through the tint rather than sitting under a flat wash.

**Key Characteristics:**
- One continuous panel material (photographed texture + tint), never a flat gradient standing in for it.
- Jacks, cables, and lamps as the literal visual grammar for "business" / "connection" / "active state."
- Brass-plate labels sit beside headings, never above them, at every breakpoint.
- Emerald reads income/active, rust-red reads expense, amber reads an idle lamp turning on.
- Tabular figures are always Space Mono; running copy and headlines are never set in it.

## Colors

A near-black bakelite ground with brass hardware and two signal colors (emerald for income/active, rust-red for expense) doing all of the semantic work; amber is reserved for the panel's own idle-to-active lamp state, not for a third semantic meaning.

### Primary
- **Signal Emerald** (`#3ecf8e`): the income/active/positive color — patch cables into the trunk, active jacks, the "Sign In" and submit buttons, the combined-total figure.

### Secondary
- **Rust Expense** (`#e07348`): the expense/negative color — reserved for expense figures and form error text. Never used decoratively.

### Tertiary
- **Amber Lamp** (`#f4a623`): the panel's own idle-to-active indicator glow (the `Lamp` primitive), and the nameplate's power dot. Not a general accent; it means "this instrument is live," not "this is important."

### Neutral
- **Bakelite Deep** (`#0c0906`): the page's deepest ground — page background, input field fills.
- **Bakelite** (`#161009`): the alternating section background (features, positioning sections).
- **Bakelite Raised** (`#1f170e`) / **Bakelite Raised 2** (`#241c11`): the two tints used inside `panelSurface()` for insets, cards, and the sign-in panel — always layered over the photographed texture, never used as flat fills on their own.
- **Brass Dim** (`#6e5936`) / **Brass** (`#b8935a`) / **Brass Bright** (`#e3c383`): hardware and label color — plate-label text, jack rims, cable ferrules, hairline dividers (`rgba(184,147,90,0.22)`).
- **Cream** (`#ece0c8`) / **Cream Dim** (`#a89878`): primary and secondary text on the dark ground.

### Named Rules
**The Two-Signal Rule.** Only emerald and rust-red carry semantic meaning (positive/negative, active/isolated). Amber is reserved exclusively for the lamp's own idle→active transition and never doubles as a third semantic color.

## Typography

**Display Font:** Big Shoulders Display (with sans-serif fallback)
**Body Font:** Big Shoulders Text (with sans-serif fallback)
**Label/Mono Font:** Space Mono (with monospace fallback)

**Character:** A condensed, cast-metal display face for anything engraved into the panel (headlines, plate labels, nav wordmark) paired with its own upright text sibling for running copy, and a fixed-width mono strictly for numbers — so a dollar figure reads like a mechanical counter, never like body prose. Space Grotesk was tried first and dropped mid-build after the mechanical-pattern detector flagged it as an overused default; Big Shoulders was chosen specifically for its condensed, engraved-plate character and stayed clean through both review rounds.

### Hierarchy
- **Display** (700, `clamp(1.875rem, 4vw, 3rem)`, 0.95 line-height): hero headline only, set in Big Shoulders Display, tracked tight (`tracking-tight`).
- **Headline** (700, 1.875rem–2.25rem, 1.1 line-height): section headings (`h2`), Big Shoulders Display.
- **Title** (600, 1.125rem, 1.2 line-height): feature-row headings (`h3`) and the sign-in card heading, Big Shoulders Display.
- **Body** (400, 0.875–1rem, 1.6 line-height): running copy in Big Shoulders Text, always in `cream-dim` against the dark ground, capped near 60ch by its container `max-w-xl`/`max-w-2xl`.
- **Label** (500, 11px, 0.18em tracking, uppercase): the `PlateLabel` primitive — engraved brass-plate captions beside jacks, lamps, and feature tags. Always Big Shoulders Display in `brass`.
- **Mono/Tabular** (400/700, Space Mono): every dollar figure and ledger number, including the `TickerTotal` primitive and business-name captions under jacks. Never used for headlines or body prose.

### Named Rules
**The Mono-Is-For-Numbers Rule.** Space Mono renders only figures and short data captions (dollar totals, business-name tags under jacks). It never sets a headline, a body paragraph, or a label — monospace here means "measurement," not "technical" costume.

## Layout

A single-column, centered content spine (`max-w-xl` to `max-w-6xl` depending on section) inside a full-bleed dark page background, alternating between `bg-deep` and `bg` per section to separate the trunk-line demos from the flatter reading sections. Section vertical rhythm is generous and consistent: `py-20` (80px) on mobile stepping to `py-28` (112px) at `sm`, with horizontal page padding fixed at `px-5` (20px) / `sm:px-8` (32px) throughout. Interactive demo boxes (hero patch panel, mechanism demo) are drawn in percentage-space inside a fixed `aspect-ratio` box so jacks and cables stay registered together at any width — this is why those two boxes hold fixed aspect ratios rather than flexible heights. The feature terminal strip is a single bordered panel with internal rows separated by 1px hairlines (`border-top`), not a card grid with independent boxes and gutters.

## Elevation & Depth

Hybrid: panels sit on soft, deep ambient shadows (`0 12–20px 30–50px rgba(0,0,0,0.5–0.55)`) that read as physical insets mounted into the wall panel, plus a thin inset brass-tinted ring (`inset 0 0 0 1px rgba(184,147,90,0.35–0.45)`) standing in for a beveled metal edge. There is no hard-offset/zero-blur shadow anywhere in this system — every shadow carries real blur. Depth also comes from material, not just shadow: the photographed texture under every panel and the separate glow-ring layered over the (visually fixed-material) jack photo both read as physical depth cues that a flat gradient could not supply.

### Shadow Vocabulary
- **Panel-mount** (`inset 0 0 0 1px rgba(184,147,90,0.35–0.45), 0 12px–20px 30px–50px rgba(0,0,0,0.5–0.55)`): the standard treatment for every raised insert — hero card, sign-in card, screenshot windows, mechanism readout.
- **Lamp glow** (`0 0 Npx N*0.5px {color}66, 0 0 N*0.5px {color}`): ambient, state-driven only — appears when a `Lamp` goes active, absent at rest.
- **Jack seat-flash** (`0 0 0 2px {color}` animating to `scale: 1.7, opacity: 0`): a one-shot ring pulse fired for 550ms when a jack transitions to active, verified against the component's real timer rather than assumed from the code.

### Named Rules
**The Material-Before-Gradient Rule.** No panel surface is a flat CSS gradient. Every panel, card, and inset layers a photographed texture (bakelite grain or brass screw/jack photography) under a semi-transparent color tint via `panelSurface()`; the tint sets mood, the photograph supplies material.

## Shapes

Corners are moderate and consistent: `rounded` (4px) for small chips and screw caps, `rounded-lg` (8px) for buttons, inputs, and inset panels, `rounded-xl` (12px) for the largest containers (feature strip, sign-in card outer edge), `rounded-full` for lamps, jacks, and the nameplate's power dot. Four brass screws (`BrassScrews`, a photographed macro asset) mark the corners of every mounted panel — hero card, sign-in card, screenshot windows, feature strip, mechanism readout — as the system's one consistent hardware silhouette. Patch cables are drawn as SVG cubic-bezier paths with a sagging catenary curve (`sag` prop, 22–28 units in a 0–100 viewBox), never straight lines, with a small brass ferrule ellipse at the jack end standing in for a connector tip.

## Components

### Buttons
- **Shape:** `rounded-lg` (8px).
- **Primary:** `income` (#3ecf8e) background, `bg-deep` (#0c0906) text, `px-5 py-2.5` (20px/10px) padding, medium weight, `active:scale-[0.98]` on press. Used for every primary action (nav Sign In, hero Sign In, sign-in form submit).
- **Ghost:** transparent background, `cream` text, a 1px inset hairline ring (`inset 0 0 0 1px rgba(184,147,90,0.22)`) standing in for a border. Used for the hero's secondary "See it work" action, paired with a drawn chevron-down SVG (never a Unicode/emoji glyph).

### Cards / Containers
- **Corner Style:** `rounded-lg` (8px) for insets and the screenshot window, `rounded-xl` (12px) for the sign-in card and feature strip.
- **Background:** always `panelSurface()` — a texture-under-tint composite, never a flat fill.
- **Shadow Strategy:** Panel-mount shadow vocabulary (see Elevation & Depth).
- **Border:** none as a drawn border; the beveled edge is simulated with the inset brass hairline box-shadow instead.
- **Internal Padding:** `p-6` (24px) mobile stepping to `p-8` (32px) at `sm` for card interiors; `px-6 py-6`/`px-8` for feature-strip rows.

### Inputs / Fields
- **Style:** `bg-deep` fill, `cream` text, `rounded-lg`, 1px inset hairline ring in place of a drawn border, `px-3 py-2.5`.
- **Focus:** currently relies on the browser default focus outline (`focus:outline-none` is set on the input but no custom focus treatment replaces it) — recorded as a gap, not a rule; a future pass should theme focus-visible from the palette per the craft floor's browser-surfaces check.
- **Error:** inline text below the field in `expense` (#e07348) color, `role="alert"`.

### Navigation
- Sticky header, `bg-deep` at 87% opacity with `backdrop-blur`, 1px brass hairline bottom border. Left: the `Nameplate` (a small panel-textured square housing an amber power dot, plus the wordmark in Big Shoulders Display). Right: a single primary button ("Sign In") — no nav link list, because the page is single-scroll with in-page anchors.

### Jack / Cable / Lamp (signature components)
The page's one true signature system. A `Jack` is a photographed brass socket (`jack-socket.png`) whose own metal never changes color — active/inactive state lives entirely in a separate glow-ring layered on top (`inset`/outer box-shadow in the signal color) plus a `brightness/saturate` filter dim when inactive, so the physical object and its electrical state stay visually separate, the way a real jack's socket and its indicator lamp are separate parts. A `PatchCable` is an SVG cubic-bezier with a sagging catenary and a brass ferrule at the termination, animated in with a spring (`stiffness: 90, damping: 15`) rather than a linear tween. A `Lamp` is a small filled circle, dark at rest, glowing in the signal color on activation via a 0.5s ease-out shadow transition. `TickerTotal` climbs to its value over 900ms with cubic ease-out, rendered in Space Mono — an adding-machine climb, not a linear count or a spring overshoot.

## Do's and Don'ts

### Do:
- **Do** build every panel surface with `panelSurface()` (photographed texture + tint gradient) — never a flat CSS gradient standing in for bakelite or brass.
- **Do** keep plate labels (`PlateLabel`) positioned beside their heading or content, using DOM order plus responsive `order` classes so the label never sits above the heading at any breakpoint, including mobile stack.
- **Do** reserve Space Mono strictly for figures and short data captions; set headlines and body copy in Big Shoulders.
- **Do** give every shadow real offset and blur (see the Panel-mount vocabulary); depth communicates through blur and material layering, not flat halos.
- **Do** draw icons as authored SVG (e.g. the chevron) in a single consistent stroke weight — never a Unicode glyph or emoji.

### Don't:
- **Don't** use a same-size icon+heading+text card grid for feature sections. This world's features are one continuous hairline-divided terminal strip off a shared trunk, not independent cards — the original build did this and was rebuilt.
- **Don't** place a kicker/eyebrow label directly above a heading at any breakpoint. Plate labels sit beside content via flex-order, never stacked above it — two instances of the banned pattern were found and repositioned during finish review.
- **Don't** render a panel, card, or inset as a flat CSS gradient with no photographed material underneath. Three surfaces shipped this way originally (hero, panels, jack sockets) and were rebuilt with real texture/photo assets.
- **Don't** bake active-state color into a jack's own socket material. State lives in the separate glow-ring layered on top of a fixed-material photograph, matching how a real jack's metal doesn't change color while its indicator lamp does.
- **Don't** use a hard-offset, zero-blur shadow anywhere in this system. It was never adopted and does not belong to this material world.
