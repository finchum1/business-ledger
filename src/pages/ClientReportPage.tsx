import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useBusinesses } from '../lib/useBusinesses'
import { getLogoUrl } from '../lib/logos'
import type { Transaction } from '../lib/types'
import { PRESET_LABELS, rangeForPreset, type PresetKey } from '../lib/dateRanges'

function fmt(n: number) {
  return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function groupByClient(txs: Transaction[]) {
  const map = new Map<string, { total: number; count: number }>()
  for (const t of txs) {
    const name = t.client?.trim()
    if (!name) continue
    const entry = map.get(name) ?? { total: 0, count: 0 }
    entry.total += Number(t.amount)
    entry.count += 1
    map.set(name, entry)
  }
  return [...map.entries()]
    .map(([name, { total, count }]) => ({ name, total, count }))
    .sort((a, b) => b.total - a.total)
}

export function ClientReportPage() {
  const { businesses } = useBusinesses()
  const [businessId, setBusinessId] = useState('all')
  const [preset, setPreset] = useState<PresetKey>('ytd')
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
        let query = supabase.from('transactions').select('*').eq('type', 'income')
        if (businessId !== 'all') query = query.eq('business_id', businessId)
        if (range.from) query = query.gte('date', range.from)
        if (range.to) query = query.lte('date', range.to)
        const { data, error } = await query
        if (error) throw error
        setTransactions(data as Transaction[])
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load client payments.')
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [businessId, range.from, range.to])

  const rows = useMemo(() => groupByClient(transactions), [transactions])
  const totalReceived = rows.reduce((s, r) => s + r.total, 0)

  const businessName = (id: string) => businesses.find((b) => b.id === id)?.name ?? 'Unknown'
  const scopeLabel = businessId === 'all' ? 'All Businesses (Combined)' : businessName(businessId)
  const periodLabel =
    range.from || range.to ? `${range.from ?? '…'} through ${range.to ?? '…'}` : 'All time'
  const scopedBusiness = businessId === 'all' ? null : businesses.find((b) => b.id === businessId)
  const logoUrl = scopedBusiness?.logo_path ? getLogoUrl(scopedBusiness.logo_path) : null
  const logoUrls =
    businessId === 'all'
      ? businesses.filter((b) => b.logo_path).map((b) => getLogoUrl(b.logo_path!))
      : []

  async function handleViewPdf() {
    const newTab = window.open('', '_blank', 'noopener,noreferrer')
    setGeneratingPdf(true)
    setError(null)
    try {
      const [{ pdf }, { ClientReportPDF }] = await Promise.all([
        import('@react-pdf/renderer'),
        import('../lib/pdf/ClientReportPDF'),
      ])
      const blob = await pdf(
        <ClientReportPDF
          scopeLabel={scopeLabel}
          periodLabel={periodLabel}
          rows={rows}
          totalReceived={totalReceived}
          businessNames={businessId === 'all' ? businesses.map((b) => b.name) : []}
          logoUrl={logoUrl}
          logoUrls={logoUrls}
        />,
      ).toBlob()
      const url = URL.createObjectURL(blob)
      if (newTab) {
        newTab.location.href = url
      } else {
        const scopeSlug = (businessId === 'all' ? 'all-businesses' : scopeLabel)
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '')
        const a = document.createElement('a')
        a.href = url
        a.download = `client-report-${scopeSlug}-${preset}.pdf`
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
      <section className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Client Report</h2>
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
        <section className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">
            Received by client
          </h3>
          {rows.length === 0 ? (
            <p className="text-slate-400 dark:text-slate-500 text-sm">
              No client-tagged income recorded for this period. Tag income with a client on the Ledger
              page to see it here.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm mb-2">
                <thead>
                  <tr className="text-left text-slate-400 dark:text-slate-500 border-b border-slate-200 dark:border-slate-800">
                    <th className="py-2 font-medium">Client</th>
                    <th className="py-2 font-medium text-right">Payments</th>
                    <th className="py-2 font-medium text-right">Total received</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.name} className="border-b border-slate-200/70 dark:border-slate-800/60">
                      <td className="py-2 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                        {row.name}
                      </td>
                      <td className="py-2 text-right text-slate-500 dark:text-slate-400 whitespace-nowrap">
                        {row.count}
                      </td>
                      <td className="py-2 text-right text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                        ${fmt(row.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="flex justify-between pt-2 font-semibold text-slate-900 dark:text-slate-100">
            <span>Total received from clients</span>
            <span className="text-emerald-600 dark:text-emerald-400">${fmt(totalReceived)}</span>
          </div>
        </section>
      )}
    </div>
  )
}
