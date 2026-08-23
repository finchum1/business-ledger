import { NavLink } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import type { Session } from '@supabase/supabase-js'
import { ThemeToggle } from './ThemeToggle'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `px-3 py-1.5 rounded-lg text-sm font-medium transition ${
    isActive
      ? 'bg-emerald-600 text-white'
      : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
  }`

export function Header({ session }: { session: Session }) {
  return (
    <header className="border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <span className="font-semibold text-slate-900 dark:text-slate-100">Business Ledger</span>
          <nav className="flex items-center gap-1">
            <NavLink to="/" end className={navLinkClass}>
              Ledger
            </NavLink>
            <NavLink to="/reports" className={navLinkClass}>
              P&amp;L Reports
            </NavLink>
            <NavLink to="/businesses" className={navLinkClass}>
              Businesses
            </NavLink>
            <NavLink to="/categories" className={navLinkClass}>
              Categories
            </NavLink>
            <NavLink to="/invoices" className={navLinkClass}>
              Invoices
            </NavLink>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-500 dark:text-slate-400 hidden sm:inline">
            {session.user.email}
          </span>
          <ThemeToggle />
          <button
            onClick={() => supabase.auth.signOut()}
            className="text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 rounded-lg px-3 py-1.5 transition"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  )
}
