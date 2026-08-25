import { NavLink } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import type { Session } from '@supabase/supabase-js'
import { ThemeToggle } from './ThemeToggle'
import { hasBankingAccess } from '../lib/betaAccess'

const NAV = [
  { to: '/', label: 'Home', end: true },
  { to: '/ledger', label: 'Ledger', end: false },
  { to: '/contractors', label: 'Contractors', end: false },
  { to: '/sales', label: 'Sales', end: false },
  { to: '/customers', label: 'Customers', end: false },
  { to: '/reports', label: 'Reports', end: false },
]

export function Sidebar({ session }: { session: Session }) {
  const nav = hasBankingAccess(session.user.email)
    ? [...NAV.slice(0, 5), { to: '/banking', label: 'Banking', end: false }, ...NAV.slice(5)]
    : NAV

  return (
    <aside className="flex h-screen w-60 shrink-0 sticky top-0 flex-col border-r border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 px-4 py-5">
      <div className="px-1 pb-6">
        <div className="font-semibold text-slate-900 dark:text-slate-100">Business Ledger</div>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {nav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `rounded-lg px-3 py-2 text-sm font-medium transition ${
                isActive
                  ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-slate-200 dark:border-slate-800 pt-4 space-y-2">
        <div className="flex items-center gap-2">
          <NavLink
            to="/settings"
            title="Settings"
            className={({ isActive }) =>
              `flex-1 min-w-0 truncate rounded-lg px-2 py-1.5 text-xs font-medium transition ${
                isActive
                  ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`
            }
          >
            {session.user.email}
          </NavLink>
          <ThemeToggle />
        </div>
        <button
          onClick={() => supabase.auth.signOut()}
          className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-600 dark:text-slate-300 transition hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
        >
          Sign out
        </button>
      </div>
    </aside>
  )
}
