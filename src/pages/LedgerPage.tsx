import { useEffect, useMemo, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { supabase } from '../lib/supabase'
import { useBusinesses } from '../lib/useBusinesses'
import { useCategories } from '../lib/useCategories'
import { deleteReceipt, getReceiptUrl, uploadReceipt } from '../lib/receipts'
import type { Transaction, TxType } from '../lib/types'

function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

const emptyForm = {
  id: null as string | null,
  date: todayStr(),
  business_id: '',
  type: 'expense' as TxType,
  category: '',
  amount: '',
  description: '',
  receipt_path: null as string | null,
}

export function LedgerPage() {
  const { businesses, loading: businessesLoading } = useBusinesses()
  const { categories } = useCategories()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [receiptFile, setReceiptFile] = useState<File | null>(null)
  const [removingReceipt, setRemovingReceipt] = useState(false)
  const [receiptBusy, setReceiptBusy] = useState<string | null>(null) // transaction id currently opening a receipt

  const [form, setForm] = useState(emptyForm)

  // filters
  const [filterBusiness, setFilterBusiness] = useState('all')
  const [filterType, setFilterType] = useState<'all' | TxType>('all')

  const activeBusinesses = useMemo(() => businesses.filter((b) => b.is_active), [businesses])

  useEffect(() => {
    if (!form.business_id && activeBusinesses.length > 0) {
      setForm((f) => ({ ...f, business_id: activeBusinesses[0].id }))
    }
  }, [activeBusinesses, form.business_id])

  async function fetchTransactions() {
    setLoading(true)
    try {
      let query = supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(200)
      if (filterBusiness !== 'all') query = query.eq('business_id', filterBusiness)
      if (filterType !== 'all') query = query.eq('type', filterType)
      const { data, error } = await query
      if (error) throw error
      setTransactions(data as Transaction[])
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load transactions.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTransactions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterBusiness, filterType])

  const businessName = (id: string) => businesses.find((b) => b.id === id)?.name ?? '—'

  const categoryOptions = useMemo(
    () => categories.filter((c) => c.type === form.type && c.is_active).map((c) => c.name),
    [categories, form.type],
  )

  function startEdit(tx: Transaction) {
    setForm({
      id: tx.id,
      date: tx.date,
      business_id: tx.business_id,
      type: tx.type,
      category: tx.category,
      amount: String(tx.amount),
      description: tx.description ?? '',
      receipt_path: tx.receipt_path,
    })
    setReceiptFile(null)
    setRemovingReceipt(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function cancelEdit() {
    setForm({ ...emptyForm, business_id: activeBusinesses[0]?.id ?? '' })
    setReceiptFile(null)
    setRemovingReceipt(false)
  }

  function handleReceiptChange(e: ChangeEvent<HTMLInputElement>) {
    setReceiptFile(e.target.files?.[0] ?? null)
    setRemovingReceipt(false)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    const amount = parseFloat(form.amount)
    if (!form.business_id || !form.category.trim() || !amount || amount <= 0) {
      setError('Please fill in business, category, and a positive amount.')
      return
    }
    setSaving(true)
    try {
      let receiptPath = removingReceipt ? null : form.receipt_path
      if (receiptFile) {
        receiptPath = await uploadReceipt(receiptFile)
      }
      // Clean up the old file once the new one is safely uploaded/removed.
      if (form.receipt_path && form.receipt_path !== receiptPath) {
        await deleteReceipt(form.receipt_path)
      }

      const payload = {
        business_id: form.business_id,
        date: form.date,
        type: form.type,
        category: form.category.trim(),
        amount,
        description: form.description.trim() || null,
        receipt_path: receiptPath,
      }
      const { error } = form.id
        ? await supabase.from('transactions').update(payload).eq('id', form.id)
        : await supabase.from('transactions').insert(payload)
      if (error) throw error
      cancelEdit()
      fetchTransactions()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save transaction.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string, receiptPath: string | null) {
    if (!confirm('Delete this transaction? This cannot be undone.')) return
    try {
      const { error } = await supabase.from('transactions').delete().eq('id', id)
      if (error) throw error
      if (receiptPath) await deleteReceipt(receiptPath)
      fetchTransactions()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete transaction.')
    }
  }

  async function viewReceipt(id: string, path: string) {
    setReceiptBusy(id)
    try {
      const url = await getReceiptUrl(path)
      window.open(url, '_blank', 'noopener,noreferrer')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to open receipt.')
    } finally {
      setReceiptBusy(null)
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-slate-100 mb-4">
          {form.id ? 'Edit transaction' : 'Add transaction'}
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="lg:col-span-1">
            <label className="block text-xs text-slate-400 mb-1">Date</label>
            <input
              type="date"
              required
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="lg:col-span-2">
            <label className="block text-xs text-slate-400 mb-1">Business</label>
            <select
              required
              value={form.business_id}
              onChange={(e) => setForm((f) => ({ ...f, business_id: e.target.value }))}
              className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {activeBusinesses.length === 0 && <option value="">No businesses yet</option>}
              {activeBusinesses.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Type</label>
            <div className="flex rounded-lg border border-slate-700 overflow-hidden text-sm">
              {(['income', 'expense'] as TxType[]).map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setForm((f) => ({ ...f, type: t, category: '' }))}
                  className={`flex-1 py-2 font-medium transition ${
                    form.type === t
                      ? t === 'income'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-rose-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {t === 'income' ? 'Income' : 'Expense'}
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <label className="block text-xs text-slate-400 mb-1">Category</label>
            <input
              list="category-options"
              required
              placeholder="e.g. Materials & Supplies"
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <datalist id="category-options">
              {categoryOptions.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
            <p className="text-xs text-slate-500 mt-1">
              Don't see it? Type any category, or manage the list on the Categories page.
            </p>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Amount</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              required
              placeholder="0.00"
              value={form.amount}
              onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
              className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="sm:col-span-2 lg:col-span-4">
            <label className="block text-xs text-slate-400 mb-1">Description (optional)</label>
            <input
              type="text"
              placeholder="Notes, vendor, invoice #, etc."
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {form.type === 'expense' && (
            <div className="sm:col-span-2 lg:col-span-6">
              <label className="block text-xs text-slate-400 mb-1">Receipt (optional)</label>
              {form.receipt_path && !removingReceipt && !receiptFile ? (
                <div className="flex items-center gap-3 text-sm">
                  <button
                    type="button"
                    onClick={() => viewReceipt('editing', form.receipt_path!)}
                    disabled={receiptBusy === 'editing'}
                    className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2"
                  >
                    {receiptBusy === 'editing' ? 'Opening…' : 'View current receipt'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setRemovingReceipt(true)}
                    className="text-slate-400 hover:text-rose-400"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleReceiptChange}
                  className="w-full text-sm text-slate-300 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-800 file:px-3 file:py-2 file:text-sm file:text-slate-200 hover:file:bg-slate-700"
                />
              )}
              {removingReceipt && (
                <p className="text-xs text-amber-400 mt-1">Receipt will be removed when you save.</p>
              )}
            </div>
          )}

          <div className="flex items-end gap-2 lg:col-span-2">
            <button
              type="submit"
              disabled={saving || activeBusinesses.length === 0}
              className="flex-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white font-medium py-2 text-sm transition"
            >
              {saving ? 'Saving…' : form.id ? 'Save changes' : 'Add'}
            </button>
            {form.id && (
              <button
                type="button"
                onClick={cancelEdit}
                className="rounded-lg border border-slate-700 hover:border-slate-500 text-slate-300 px-4 py-2 text-sm transition"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
        {error && (
          <p className="text-sm text-rose-400 mt-3" role="alert">
            {error}
          </p>
        )}
        {!businessesLoading && activeBusinesses.length === 0 && (
          <p className="text-sm text-amber-400 mt-3">
            Add a business on the Businesses page before recording transactions.
          </p>
        )}
      </section>

      <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h2 className="text-lg font-semibold text-slate-100">Recent transactions</h2>
          <div className="flex items-center gap-2">
            <select
              value={filterBusiness}
              onChange={(e) => setFilterBusiness(e.target.value)}
              className="rounded-lg bg-slate-800 border border-slate-700 px-3 py-1.5 text-slate-100 text-sm"
            >
              <option value="all">All businesses</option>
              {businesses.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as 'all' | TxType)}
              className="rounded-lg bg-slate-800 border border-slate-700 px-3 py-1.5 text-slate-100 text-sm"
            >
              <option value="all">All types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
        </div>

        {loading ? (
          <p className="text-slate-400 text-sm">Loading…</p>
        ) : transactions.length === 0 ? (
          <p className="text-slate-400 text-sm">No transactions yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-400 border-b border-slate-800">
                  <th className="py-2 pr-3 font-medium">Date</th>
                  <th className="py-2 pr-3 font-medium">Business</th>
                  <th className="py-2 pr-3 font-medium">Category</th>
                  <th className="py-2 pr-3 font-medium">Description</th>
                  <th className="py-2 pr-3 font-medium text-right">Amount</th>
                  <th className="py-2 pr-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-slate-800/60 hover:bg-slate-800/30">
                    <td className="py-2 pr-3 text-slate-300 whitespace-nowrap">{tx.date}</td>
                    <td className="py-2 pr-3 text-slate-300 whitespace-nowrap">
                      {businessName(tx.business_id)}
                    </td>
                    <td className="py-2 pr-3 text-slate-300">
                      {tx.category}
                      {tx.receipt_path && (
                        <button
                          onClick={() => viewReceipt(tx.id, tx.receipt_path!)}
                          disabled={receiptBusy === tx.id}
                          title="View receipt"
                          className="ml-2 align-middle text-xs text-emerald-400 hover:text-emerald-300"
                        >
                          {receiptBusy === tx.id ? '…' : '📎'}
                        </button>
                      )}
                    </td>
                    <td className="py-2 pr-3 text-slate-500">{tx.description}</td>
                    <td
                      className={`py-2 pr-3 text-right font-medium whitespace-nowrap ${
                        tx.type === 'income' ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {tx.type === 'income' ? '+' : '−'}$
                      {tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2 pr-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => startEdit(tx)}
                        className="text-slate-400 hover:text-slate-100 text-xs mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(tx.id, tx.receipt_path)}
                        className="text-slate-400 hover:text-rose-400 text-xs"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
