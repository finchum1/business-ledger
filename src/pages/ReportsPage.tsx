import { useState } from 'react'
import { PLReportPage } from './PLReportPage'
import { ContractorReportPage } from './ContractorReportPage'
import { ClientReportPage } from './ClientReportPage'

type Tab = 'pl' | 'contractors' | 'clients'

const TABS: { key: Tab; label: string }[] = [
  { key: 'pl', label: 'Profit & Loss' },
  { key: 'contractors', label: 'Contractors' },
  { key: 'clients', label: 'Clients' },
]

export function ReportsPage() {
  const [tab, setTab] = useState<Tab>('pl')

  return (
    <div>
      <div className="max-w-5xl mx-auto px-4 pt-8">
        <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">Reports</h1>
        <div className="flex gap-1 border-b border-slate-200 dark:border-slate-800 mb-6">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition ${
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

      {tab === 'pl' ? (
        <PLReportPage />
      ) : tab === 'contractors' ? (
        <ContractorReportPage />
      ) : (
        <ClientReportPage />
      )}
    </div>
  )
}
