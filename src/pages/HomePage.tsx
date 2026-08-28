import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useBusinesses } from '../lib/useBusinesses'
import { StatCard } from '../components/StatCard'
import type { Transaction } from '../lib/types'

function fmt(n: number) {
  return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function startOfYear() {
  return `${new Date().getFullYear()}-01-01`
}

export function HomePage() {
  const { businesses } = useBusinesses()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const { data, error } = await supabase.from('transactions').select('*').gte('date', startOfYear())
        if (error) throw error
        setTransactions((data ?? []) as Transaction[])
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load overview.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const businessName = (id: string) => businesses.find((b) => b.id === id)?.name ?? 'Unknown'

  const perBusiness = useMemo(() => {
    return businesses
      .map((b) => {
        const rows = transactions.filter((t) => t.business_id === b.id)
        const income = rows.filter((t) => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0)
        const expenses = rows.filter((t) => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0)
        return { id: b.id, name: b.name, income, expenses, net: income - expenses }
      })
      .filter((row) => row.income > 0 || row.expenses > 0 || businesses.length <= 8)
  }, [businesses, transactions])

  const combinedIncome = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0)
  const combinedExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((s, t) => s + Number(t.amount), 0)
  const combinedNet = combinedIncome - combinedExpenses

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Home</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Year-to-date across every business, as of today.
        </p>
      </div>

      {error && (
        <p className="text-sm text-rose-600 dark:text-rose-400" role="alert">
          {error}
        </p>
      )}

      {loading ? (
        <p className="text-slate-500 dark:text-slate-400 text-sm">Loading…</p>
      ) : (
        <section>
          <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">
            YTD Profit &amp; Loss
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <StatCard label="YTD Income" value={`$${fmt(combinedIncome)}`} tone="green" />
            <StatCard label="YTD Expenses" value={`$${fmt(combinedExpenses)}`} tone="rose" />
            <StatCard
              label="YTD Net Profit"
              value={`${combinedNet >= 0 ? '' : '−'}$${fmt(Math.abs(combinedNet))}`}
              tone={combinedNet >= 0 ? 'green' : 'rose'}
            />
          </div>

          {perBusiness.length > 0 && (
            <div className="space-y-3">
              {perBusiness.map((row) => (
                <div
                  key={row.id}
                  className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-4"
                >
                  <div className="font-medium text-slate-900 dark:text-slate-100 mb-2">
                    {businessName(row.id)}
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Income</span>
                      <span className="text-emerald-600 dark:text-emerald-400">${fmt(row.income)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Expenses</span>
                      <span className="text-rose-600 dark:text-rose-400">${fmt(row.expenses)}</span>
                    </div>
                    <div className="flex items-center justify-between pt-1 mt-1 border-t border-slate-200 dark:border-slate-800 font-medium">
                      <span className="text-slate-700 dark:text-slate-300">Net</span>
                      <span
                        className={
                          row.net >= 0
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-rose-600 dark:text-rose-400'
                        }
                      >
                        ${fmt(row.net)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  )
}
