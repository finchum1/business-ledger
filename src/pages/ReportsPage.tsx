import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useBusinesses } from '../lib/useBusinesses'
import type { Transaction } from '../lib/types'
import { PRESET_LABELS, rangeForPreset, type PresetKey } from '../lib/dateRanges'

function fmt(n: number) {
  return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function groupByCategory(txs: Transaction[]) {
  const map = new Map<string, number>()
  for (const t of txs) {
    map.set(t.category, (map.get(t.category) ?? 0) + Number(t.amount))
  }
  return [...map.entries()].sort((a, b) => b[1] - a[1])
}

export function ReportsPage() {
  const { businesses } = useBusinesses()
  const [businessId, setBusinessId] = useState('all')
  const [preset, setPreset] = useState<PresetKey>('this_month')
  const [customFrom, setCustomFrom] = useState('')
  const [customTo, setCustomTo] = useState('')
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [generatingPdf, setGeneratingPdf] = useState(false)

  const range = useMemo(() => {
    if (preset === 'custom') return { from: customFrom || null, to: customTo || null }
    return rangeForPreset(preset)
  }, [preset, customFrom, customTo])

  useEffect(() => {
    async function run() {
      setLoading(true)
      try {
        let query = supabase.from('transactions').select('*')
        if (businessId !== 'all') query = query.eq('business_id', businessId)
        if (range.from) query = query.gte('date', range.from)
        if (range.to) query = query.lte('date', range.to)
        const { data, error } = await query
        if (error) throw error
        setTransactions(data as Transaction[])
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load report data.')
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [businessId, range.from, range.to])

  const income = transactions.filter((t) => t.type === 'income')
  const expenses = transactions.filter((t) => t.type === 'expense')
  const totalIncome = income.reduce((s, t) => s + Number(t.amount), 0)
  const totalExpenses = expenses.reduce((s, t) => s + Number(t.amount), 0)
  const net = totalIncome - totalExpenses

  const incomeByCategory = groupByCategory(income)
  const expensesByCategory = groupByCategory(expenses)

  const businessName = (id: string) => businesses.find((b) => b.id === id)?.name ?? 'Unknown'

  const perBusiness = useMemo(() => {
    if (businessId !== 'all') return []
    const ids = [...new Set(transactions.map((t) => t.business_id))]
    return ids
      .map((id) => {
        const rows = transactions.filter((t) => t.business_id === id)
        const inc = rows.filter((t) => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0)
        const exp = rows.filter((t) => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0)
        return { id, name: businessName(id), income: inc, expenses: exp, net: inc - exp }
      })
      .sort((a, b) => b.net - a.net)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactions, businessId])

  const scopeLabel = businessId === 'all' ? 'All Businesses (Combined)' : businessName(businessId)
  const periodLabel =
    range.from || range.to ? `${range.from ?? '…'} through ${range.to ?? '…'}` : 'All time'

  async function handleViewPdf() {
    // Open the tab synchronously, before any `await` -- Safari (unlike Chrome) drops the
    // "this came from a real click" flag across an async gap and silently blocks a
    // window.open() called after one, even from a genuine click handler. Opening a blank
    // tab immediately and navigating it once the PDF is ready sidesteps that everywhere.
    const newTab = window.open('', '_blank', 'noopener,noreferrer')
    setGeneratingPdf(true)
    setError(null)
    try {
      const [{ pdf }, { ReportPDF }] = await Promise.all([
        import('@react-pdf/renderer'),
        import('../lib/pdf/ReportPDF'),
      ])
      const blob = await pdf(
        <ReportPDF
          scopeLabel={scopeLabel}
          periodLabel={periodLabel}
          incomeByCategory={incomeByCategory}
          expensesByCategory={expensesByCategory}
          totalIncome={totalIncome}
          totalExpenses={totalExpenses}
          net={net}
          perBusiness={businessId === 'all' ? perBusiness : []}
        />,
      ).toBlob()
      const url = URL.createObjectURL(blob)
      if (newTab) {
        newTab.location.href = url
      } else {
        // Pop-up blocked -- fall back to a direct file download so "save" still works
        // even when "view in a new tab" doesn't.
        const scopeSlug = (businessId === 'all' ? 'all-businesses' : scopeLabel)
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '')
        const a = document.createElement('a')
        a.href = url
        a.download = `profit-loss-${scopeSlug}-${preset}.pdf`
        document.body.appendChild(a)
        a.click()
        a.remove()
      }
    } catch (err) {
      newTab?.close()
      setError(err instanceof Error ? err.message : 'Failed to generate PDF.')
    } finally {
      setGeneratingPdf(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <section className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Profit &amp; Loss</h2>
          <button
            type="button"
            onClick={handleViewPdf}
            disabled={generatingPdf || loading}
            className="rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white font-medium px-4 py-2 text-sm transition"
          >
            {generatingPdf ? 'Generating PDF…' : 'View / Save PDF'}
          </button>
        </div>
        <div className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Business</label>
            <select
              value={businessId}
              onChange={(e) => setBusinessId(e.target.value)}
              className="rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-3 py-2 text-slate-900 dark:text-slate-100 text-sm"
            >
              <option value="all">All businesses (combined)</option>
              {businesses.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Period</label>
            <select
              value={preset}
              onChange={(e) => setPreset(e.target.value as PresetKey)}
              className="rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-3 py-2 text-slate-900 dark:text-slate-100 text-sm"
            >
              {Object.entries(PRESET_LABELS).map(([k, label]) => (
                <option key={k} value={k}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          {preset === 'custom' && (
            <>
              <div>
                <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">From</label>
                <input
                  type="date"
                  value={customFrom}
                  onChange={(e) => setCustomFrom(e.target.value)}
                  className="rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-3 py-2 text-slate-900 dark:text-slate-100 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">To</label>
                <input
                  type="date"
                  value={customTo}
                  onChange={(e) => setCustomTo(e.target.value)}
                  className="rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-3 py-2 text-slate-900 dark:text-slate-100 text-sm"
                />
              </div>
            </>
          )}
        </div>
        {range.from || range.to ? (
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-3">
            {range.from ?? '…'} through {range.to ?? '…'}
          </p>
        ) : (
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-3">All time</p>
        )}
        {error && <p className="text-sm text-rose-600 dark:text-rose-400 mt-3">{error}</p>}
      </section>

      {loading ? (
        <p className="text-slate-500 dark:text-slate-400 text-sm px-1">Loading…</p>
      ) : (
        <>
          <section className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">
              Income
            </h3>
            {incomeByCategory.length === 0 ? (
              <p className="text-slate-400 dark:text-slate-500 text-sm">No income recorded.</p>
            ) : (
              <table className="w-full text-sm mb-2">
                <tbody>
                  {incomeByCategory.map(([cat, amt]) => (
                    <tr key={cat} className="border-b border-slate-200/70 dark:border-slate-800/60">
                      <td className="py-1.5 text-slate-600 dark:text-slate-300">{cat}</td>
                      <td className="py-1.5 text-right text-emerald-600 dark:text-emerald-400">
                        ${fmt(amt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <div className="flex justify-between pt-2 font-semibold text-slate-900 dark:text-slate-100">
              <span>Total Income</span>
              <span className="text-emerald-600 dark:text-emerald-400">${fmt(totalIncome)}</span>
            </div>
          </section>

          <section className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">
              Expenses
            </h3>
            {expensesByCategory.length === 0 ? (
              <p className="text-slate-400 dark:text-slate-500 text-sm">No expenses recorded.</p>
            ) : (
              <table className="w-full text-sm mb-2">
                <tbody>
                  {expensesByCategory.map(([cat, amt]) => (
                    <tr key={cat} className="border-b border-slate-200/70 dark:border-slate-800/60">
                      <td className="py-1.5 text-slate-600 dark:text-slate-300">{cat}</td>
                      <td className="py-1.5 text-right text-rose-600 dark:text-rose-400">
                        ${fmt(amt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <div className="flex justify-between pt-2 font-semibold text-slate-900 dark:text-slate-100">
              <span>Total Expenses</span>
              <span className="text-rose-600 dark:text-rose-400">${fmt(totalExpenses)}</span>
            </div>
          </section>

          <section className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Net Profit
              </span>
              <span
                className={`text-2xl font-bold ${
                  net >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                }`}
              >
                {net >= 0 ? '' : '−'}${fmt(Math.abs(net))}
              </span>
            </div>
          </section>

          {businessId === 'all' && perBusiness.length > 0 && (
            <section className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">
                By business
              </h3>
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
                      <td className="py-2 text-slate-600 dark:text-slate-300">{row.name}</td>
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
            </section>
          )}
        </>
      )}
    </div>
  )
}
