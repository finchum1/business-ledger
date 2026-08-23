import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useBusinesses } from '../lib/useBusinesses'
import { StatCard } from '../components/StatCard'
import { fetchAllInvoices, fetchLineItemTotals, statusLabel } from '../lib/invoices'
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
  const [invoices, setInvoices] = useState<Awaited<ReturnType<typeof fetchAllInvoices>>>([])
  const [totals, setTotals] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const [{ data: txns, error: txnError }, invoiceRows] = await Promise.all([
          supabase.from('transactions').select('*').gte('date', startOfYear()),
          fetchAllInvoices(),
        ])
        if (txnError) throw txnError
        setTransactions((txns ?? []) as Transaction[])
        setInvoices(invoiceRows)
        setTotals(await fetchLineItemTotals(invoiceRows.map((i) => i.id)))
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

  const quoteTracking = useMemo(() => {
    const quotes = invoices.filter((i) => i.doc_type === 'quote')
    return {
      draft: quotes.filter((q) => statusLabel(q).label === 'Draft').length,
      sent: quotes.filter((q) => statusLabel(q).label === 'Sent').length,
      approved: quotes.filter((q) => statusLabel(q).label === 'Approved').length,
      openValue: quotes
        .filter((q) => !q.converted_to_invoice_id)
        .reduce((s, q) => s + (totals[q.id] ?? 0), 0),
    }
  }, [invoices, totals])

  const salesTracking = useMemo(() => {
    const sales = invoices.filter((i) => i.doc_type === 'invoice')
    return {
      draft: sales.filter((s) => statusLabel(s).label === 'Draft').length,
      sent: sales.filter((s) => statusLabel(s).label === 'Sent').length,
      paid: sales.filter((s) => s.status === 'paid').length,
      outstanding: sales.filter((s) => s.status !== 'paid').reduce((sum, s) => sum + (totals[s.id] ?? 0), 0),
    }
  }, [invoices, totals])

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
        <>
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
              <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-slate-400 dark:text-slate-500 border-b border-slate-200 dark:border-slate-800">
                      <th className="py-2 font-medium">Business</th>
                      <th className="py-2 font-medium text-right">Income</th>
                      <th className="py-2 font-medium text-right">Expenses</th>
                      <th className="py-2 font-medium text-right">Net</th>
                    </tr>
                  </thead>
                  <tbody>
                    {perBusiness.map((row) => (
                      <tr key={row.id} className="border-b border-slate-200/70 dark:border-slate-800/60">
                        <td className="py-2 text-slate-600 dark:text-slate-300">{businessName(row.id)}</td>
                        <td className="py-2 text-right text-emerald-600 dark:text-emerald-400">
                          ${fmt(row.income)}
                        </td>
                        <td className="py-2 text-right text-rose-600 dark:text-rose-400">
                          ${fmt(row.expenses)}
                        </td>
                        <td
                          className={`py-2 text-right font-medium ${
                            row.net >= 0
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-rose-600 dark:text-rose-400'
                          }`}
                        >
                          ${fmt(row.net)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                Quotes
              </h2>
              <Link
                to="/sales"
                className="text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 dark:hover:text-emerald-300"
              >
                View Sales →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <StatCard label="Draft" value={String(quoteTracking.draft)} />
              <StatCard label="Sent" value={String(quoteTracking.sent)} tone="amber" />
              <StatCard label="Approved" value={String(quoteTracking.approved)} tone="green" />
              <StatCard label="Open quote value" value={`$${fmt(quoteTracking.openValue)}`} />
            </div>
          </section>

          <section>
            <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">
              Invoices
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <StatCard label="Draft" value={String(salesTracking.draft)} />
              <StatCard label="Sent" value={String(salesTracking.sent)} tone="amber" />
              <StatCard label="Paid" value={String(salesTracking.paid)} tone="green" />
              <StatCard label="Outstanding" value={`$${fmt(salesTracking.outstanding)}`} tone="rose" />
            </div>
          </section>
        </>
      )}
    </div>
  )
}
