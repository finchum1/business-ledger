import { NavLink } from 'react-router-dom'
import type { Session } from '@supabase/supabase-js'
import { hasBankingAccess } from '../lib/betaAccess'
import { navFor } from '../lib/nav'

/**
 * Fixed bottom tab bar shown only below the md breakpoint -- the primary
 * way to navigate on a phone, since the sidebar (App.tsx's other nav
 * surface) is hidden there. Pairs with MobileHeader (brand + settings) and
 * <main>'s bottom padding, which reserves space so page content never sits
 * underneath this bar.
 */
export function MobileNav({ session }: { session: Session }) {
  const nav = navFor(hasBankingAccess(session.user.email))

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-20 flex border-t border-slate-200 dark:border-slate-800 bg-slate-50/95 dark:bg-slate-900/95 backdrop-blur"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {nav.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 text-[11px] font-medium transition ${
              isActive
                ? 'text-emerald-700 dark:text-emerald-400'
                : 'text-slate-500 dark:text-slate-400'
            }`
          }
        >
          <span className="truncate max-w-full px-0.5">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
