/**
 * The Sovereign Books signet mark -- concentric rings around a geometric S,
 * like a wax seal or signet ring. Authored SVG (not a raster asset), so it
 * stays crisp at any size and matches the landing page's "no photographed
 * material" design rule. Shared between the landing page (fixed dark
 * world, passes an explicit hex) and the app's own Sidebar (passes
 * `currentColor` so it follows the app's own light/dark theme).
 */
export function BrandMark({ color = 'currentColor', size = 28 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 72 72" aria-hidden>
      <circle cx="36" cy="36" r="33" fill="none" stroke={color} strokeWidth={2.2} />
      <circle cx="36" cy="36" r="26" fill="none" stroke={color} strokeWidth={1.3} />
      <path
        d="M 46.2 25.8 C 46.2 20.7 41.1 19 36 19 C 29.2 19 25.8 22.4 25.8 27.5 C 25.8 36 46.2 32.6 46.2 41.1 C 46.2 46.2 41.1 49.6 34.3 49.6 C 29.2 49.6 24.1 47.9 24.1 42.8"
        fill="none"
        stroke={color}
        strokeWidth={5.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
