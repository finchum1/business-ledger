// Palette for the marketing landing page's switchboard/patch-bay world.
// Deliberately separate from the app's own theme.ts (light/dark toggle) --
// the landing page is a fixed light visual world, not user-toggleable.
//
// Revised from an original near-black bakelite palette to a warm ivory
// control-panel material at the user's request ("lightened up... a little
// too dark") -- same physical jack/cable/brass hardware grammar, lighter
// enamel instead of black bakelite. bgDeep stays the "sunken" tone (page
// background, input fills) and bgRaised/bgRaised2 stay lighter than it, the
// same relative relationship as the original dark palette, just inverted in
// absolute brightness.
export const panel = {
  bgDeep: '#f1ead9',
  bg: '#f8f3e6',
  bgRaised: '#fffdf7',
  bgRaised2: '#fbf6e8',
  brassDim: '#5c4a28',
  brass: '#8a6a35',
  brassBright: '#b8935a',
  ink: '#241f16',
  inkDim: '#6b6252',
  income: '#1c8054',
  incomeDim: '#bfe0cf',
  expense: '#c1502a',
  expenseDim: '#f0d2c2',
  amber: '#c98a1f',
  wire: '#d9cdb0',
  hairline: 'rgba(138, 107, 58, 0.28)',
} as const
