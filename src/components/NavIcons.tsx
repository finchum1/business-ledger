import type { ReactElement } from 'react'

/**
 * One small stroke icon per top-level nav destination, keyed by route path
 * so Sidebar/MobileNav (or anything else iterating lib/nav.ts's NAV array)
 * can look one up by `item.to`. Hand-authored SVG (matches ThemeToggle's
 * sun/moon icons and BrandMark -- no icon library dependency), stroke-only
 * so `currentColor` picks up the active/inactive nav tint for free.
 */
const ICON_PROPS = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

const ICONS: Record<string, (props: { size: number }) => ReactElement> = {
  '/': ({ size }) => (
    <svg width={size} height={size} {...ICON_PROPS}>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5" />
    </svg>
  ),
  '/ledger': ({ size }) => (
    <svg width={size} height={size} {...ICON_PROPS}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <path d="M14 2v6h6" />
      <path d="M8 13h8M8 17h8M8 9h2" />
    </svg>
  ),
  '/contractors': ({ size }) => (
    <svg width={size} height={size} {...ICON_PROPS}>
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94Z" />
    </svg>
  ),
  '/clients': ({ size }) => (
    <svg width={size} height={size} {...ICON_PROPS}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  '/reports': ({ size }) => (
    <svg width={size} height={size} {...ICON_PROPS}>
      <path d="M18 20V10M12 20V4M6 20v-6" />
    </svg>
  ),
}

export function NavIcon({ to, size = 20 }: { to: string; size?: number }) {
  const Icon = ICONS[to]
  return Icon ? <Icon size={size} /> : null
}
