import { useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { ThemeToggle } from '../components/ThemeToggle'
import { BusinessesPage } from './BusinessesPage'
import { CategoriesPage } from './CategoriesPage'

type Tab = 'businesses' | 'categories' | 'account'

const TABS: { key: Tab; label: string }[] = [
  { key: 'businesses', label: 'Businesses' },
  { key: 'categories', label: 'Categories' },
  { key: 'account', label: 'Account' },
]

export function SettingsPage({ session }: { session: Session }) {
  const [tab, setTab] = useState<Tab>('businesses')

  return (
    <div>
      <div className="max-w-2xl mx-auto px-4 pt-8">
        <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">Settings</h1>
        <div className="flex gap-1 border-b border-slate-200 dark:border-slate-800 mb-6 overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition whitespace-nowrap ${
                tab === t.key
                  ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {tab === 'businesses' ? (
        <BusinessesPage />
      ) : tab === 'categories' ? (
        <CategoriesPage />
      ) : (
        <div className="max-w-2xl mx-auto px-4 pb-8 space-y-6">
          <section className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">Account</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{session.user.email}</p>

            <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-4 mb-4">
              <span className="text-sm text-slate-600 dark:text-slate-300">Theme</span>
              <ThemeToggle />
            </div>

            <button
              onClick={() => supabase.auth.signOut()}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 transition hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Sign out
            </button>
          </section>
        </div>
      )}
    </div>
  )
}
