// Palette for the marketing landing page's third world: "played straight"
// premium fintech SaaS -- the category standard (Mercury, Ramp, Brex named
// explicitly as the craft bar), executed at full fidelity rather than a
// governing object/place metaphor. Replaces "The House Ledger" (bound
// ledger book, deep green/gold) entirely, which itself replaced the
// original "Switchboard" world -- see DESIGN.md for the full lineage.
//
// Deliberately separate from the app's own theme.ts (light/dark toggle) --
// the landing page is a fixed dark visual world, not user-toggleable. The
// app's own Tailwind tokens (src/index.css) were retinted to derive from
// these same hex values, per explicit user confirmation, same relationship
// as both prior worlds.
export const panel = {
  // Near-black graphite ground -- restrained, not drenched: a neutral field
  // the one gold accent sits on, matching how Mercury/Ramp/Brex actually
  // use color (an accent, never a saturated wash).
  bgDeep: '#0a0b0d',
  bg: '#0d0f12',
  bgRaised: '#16181c',
  bgRaised2: '#1d2025',
  ink: '#f4f4f2',
  inkDim: '#9a9ca3',
  // Champagne gold -- the one accent, ties back to "Sovereign" without
  // reaching for the literal brass/gold-foil material language of the
  // prior ledger-book world. Used sparingly: primary button, small marks,
  // never a wash.
  gold: '#cbb078',
  goldBright: '#ddc48f',
  goldDim: '#8a7856',
  income: '#34d399',
  incomeDim: '#123b2c',
  expense: '#f87171',
  expenseDim: '#3d1e1e',
  border: 'rgba(255, 255, 255, 0.08)',
  borderStrong: 'rgba(255, 255, 255, 0.14)',
} as const
