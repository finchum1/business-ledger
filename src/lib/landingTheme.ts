// Palette for the marketing landing page's "House Ledger" world -- a bound
// accounting ledger book: deep bottle-green leather, gold foil tooling,
// cream ledger-paper insets. Replaces the earlier switchboard/patch-bay
// world entirely (see DESIGN.md history) at the user's explicit request
// ("too industrial... premium / elegant finance").
//
// Deliberately separate from the app's own theme.ts (light/dark toggle) --
// the landing page is a fixed light-on-dark visual world, not
// user-toggleable. The app's own Tailwind tokens (src/index.css) were
// retinted to derive from these same hex values, at the user's explicit
// request, matching how the switchboard world's palette was carried into
// the app last time.
export const panel = {
  // Deep bottle-green leather -- the dominant ground.
  bgDeep: '#0f2b21',
  bg: '#0c231b',
  bgRaised: '#f4ecdb',
  bgRaised2: '#efe3cc',
  // Gold foil -- the metal/foil family (renamed from brass* to gold* since
  // the material itself changed; kept the same three-step naming shape the
  // old world used, dim/base/bright, so every callsite still reads).
  brassDim: '#8a6a2e',
  brass: '#b8914a',
  brassBright: '#d9b876',
  // Ink reads dark-on-cream inside paper insets; cream reads light-on-green
  // everywhere else -- both live under `ink`/`inkDim` per the old world's
  // naming, resolved per-surface at each call site the same way the old
  // world did.
  ink: '#16140f',
  inkDim: '#5a5142',
  // On the dark green ground, text needs the light neutral instead --
  // components on `bgDeep`/`bg` use `cream`/`creamDim`, mirroring how the
  // pre-lightening switchboard revision handled its own dark ground.
  cream: '#f4ecdb',
  creamDim: '#b9ad93',
  income: '#1c7a4d',
  incomeDim: '#c8e3d3',
  expense: '#6b2a24',
  expenseDim: '#e3c9c3',
  amber: '#b8914a',
  wire: '#3c5346',
  hairline: 'rgba(184, 145, 74, 0.32)',
} as const
