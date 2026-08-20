import { NavLink } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import type { Session } from '@supabase/supabase-js'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `px-3 py-1.5 rounded-lg text-sm font-medium transition ${
    isActive ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
  }`

export function Header({ session }: { session: Session }) {
  return (
    <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <span className="font-semibold text-slate-100">Business Ledger</span>
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
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-400 hidden sm:inline">{session.user.email}</span>
          <button
            onClick={() => supabase.auth.signOut()}
            className="text-sm text-slate-300 hover:text-white border border-slate-700 hover:border-slate-500 rounded-lg px-3 py-1.5 transition"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  )
}
