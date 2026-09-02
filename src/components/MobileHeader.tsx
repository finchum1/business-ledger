import { NavLink } from 'react-router-dom'
import { BrandMark } from './BrandMark'
import { ThemeToggle } from './ThemeToggle'

/**
 * Top bar shown only below the md breakpoint, replacing the sidebar's brand
 * mark + settings/account access (the sidebar itself is hidden on mobile --
 * see Sidebar.tsx / App.tsx). Sticky so it stays reachable while scrolling a
 * long page.
 */
export function MobileHeader() {
  return (
    <header className="md:hidden sticky top-0 z-20 flex items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 bg-slate-50/95 dark:bg-slate-900/95 backdrop-blur px-4 py-3">
      <div className="flex items-center gap-2 min-w-0">
        <BrandMark color="var(--color-amber-400)" size={20} />
        <span className="font-semibold text-slate-900 dark:text-slate-100 truncate">Sovereign Books</span>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <ThemeToggle />
        <NavLink
          to="/settings"
          aria-label="Settings"
          className={({ isActive }) =>
            `rounded-lg p-2 transition ${
              isActive
                ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
            }`
          }
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
            />
          </svg>
        </NavLink>
      </div>
    </header>
  )
}
