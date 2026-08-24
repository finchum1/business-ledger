import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { supabase } from '../lib/supabase'
import { useBusinesses } from '../lib/useBusinesses'
import { useCustomers } from '../lib/useCustomers'
import type { Customer } from '../lib/types'

const inputClass =
  'w-full rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-3 py-2 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500'
const labelClass = 'block text-xs text-slate-500 dark:text-slate-400 mb-1'

const emptyDetails = { email: '', phone: '', address: '' }

export function CustomersPage() {
  const { businesses } = useBusinesses()
  const { customers, loading, error: fetchError, refetch } = useCustomers()
  const [businessId, setBusinessId] = useState('')
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')
  const [detailsId, setDetailsId] = useState<string | null>(null)
  const [details, setDetails] = useState(emptyDetails)

  const activeBusinesses = useMemo(() => businesses.filter((b) => b.is_active), [businesses])

  useEffect(() => {
    if (!businessId && businesses.length > 0) {
      setBusinessId((activeBusinesses[0] ?? businesses[0]).id)
    }
  }, [businesses, activeBusinesses, businessId])

  const list = useMemo(
    () => customers.filter((c) => c.business_id === businessId),
    [customers, businessId],
  )

  async function handleAdd(e: FormEvent) {
    e.preventDefault()
    if (!name.trim() || !businessId) return
    setSaving(true)
    setError(null)
    try {
      const { error } = await supabase
        .from('customers')
        .insert({ business_id: businessId, name: name.trim(), sort_order: list.length })
      if (error) throw error
      setName('')
      refetch()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add customer.')
    } finally {
      setSaving(false)
    }
  }

  async function toggleActive(id: string, is_active: boolean) {
    try {
      const { error } = await supabase.from('customers').update({ is_active: !is_active }).eq('id', id)
      if (error) throw error
      refetch()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update customer.')
    }
  }

  function startEdit(id: string, currentName: string) {
    setEditingId(id)
    setEditingName(currentName)
    setDetailsId(null)
  }

  async function saveEdit(id: string) {
    if (!editingName.trim()) return
    try {
      const { error } = await supabase
        .from('customers')
        .update({ name: editingName.trim() })
        .eq('id', id)
      if (error) throw error
      setEditingId(null)
      refetch()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to rename customer.')
    }
  }

  function startDetails(c: Customer) {
    setDetailsId(c.id)
    setEditingId(null)
    setDetails({ email: c.email ?? '', phone: c.phone ?? '', address: c.address ?? '' })
  }

  async function saveDetails(id: string) {
    try {
      const { error } = await supabase
        .from('customers')
        .update({
          email: details.email.trim() || null,
          phone: details.phone.trim() || null,
          address: details.address.trim() || null,
        })
        .eq('id', id)
      if (error) throw error
      setDetailsId(null)
      refetch()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update customer details.')
    }
  }

  async function handleDelete(id: string, customerName: string) {
    if (
      !confirm(
        `Delete "${customerName}"? This is only possible if nothing references it. To keep its history, use "Deactivate" instead.`,
      )
    )
      return
    try {
      const { error } = await supabase.from('customers').delete().eq('id', id)
      if (error) throw error
      refetch()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete customer.')
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <section className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Customers</h2>
          <select
            value={businessId}
            onChange={(e) => setBusinessId(e.target.value)}
            className="rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-3 py-2 text-slate-900 dark:text-slate-100 text-sm"
          >
            {businesses.length === 0 && <option value="">No businesses yet</option>}
            {businesses.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
        <form onSubmit={handleAdd} className="flex gap-2">
          <input
            type="text"
            placeholder="e.g. Meridian Corp"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={!businessId}
            className="flex-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-3 py-2 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={saving || !businessId}
            className="rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white font-medium px-4 py-2 text-sm transition"
          >
            {saving ? 'Adding…' : 'Add'}
          </button>
        </form>
        {businesses.length === 0 && (
          <p className="text-xs text-amber-600 dark:text-amber-400 mt-3">
            Add a business in Settings before adding customers.
          </p>
        )}
        {(error || fetchError) && (
          <p className="text-sm text-rose-600 dark:text-rose-400 mt-3">{error ?? fetchError}</p>
        )}
      </section>

      <section className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
          Customers for this business
        </h2>
        {loading ? (
          <p className="text-slate-500 dark:text-slate-400 text-sm">Loading…</p>
        ) : list.length === 0 ? (
          <p className="text-slate-400 dark:text-slate-500 text-sm">
            No customers yet for this business — add one above.
          </p>
        ) : (
          <ul className="divide-y divide-slate-200 dark:divide-slate-800">
            {list.map((c) => (
              <li key={c.id} className="py-3">
                <div className="flex items-center justify-between gap-3">
                  {editingId === c.id ? (
                    <input
                      autoFocus
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && saveEdit(c.id)}
                      className="flex-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-3 py-1.5 text-slate-900 dark:text-slate-100 text-sm"
                    />
                  ) : (
                    <div className="min-w-0">
                      <span
                        className={`text-sm ${
                          c.is_active
                            ? 'text-slate-800 dark:text-slate-200'
                            : 'text-slate-400 dark:text-slate-500 line-through'
                        }`}
                      >
                        {c.name}
                      </span>
                      {(c.email || c.phone || c.address) && (
                        <p className="text-xs text-slate-400 dark:text-slate-500 truncate">
                          {[c.email, c.phone, c.address].filter(Boolean).join(' · ')}
                        </p>
                      )}
                    </div>
                  )}
                  <div className="flex items-center gap-3 shrink-0">
                    {editingId === c.id ? (
                      <>
                        <button
                          onClick={() => saveEdit(c.id)}
                          className="text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 dark:hover:text-emerald-300"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => (detailsId === c.id ? setDetailsId(null) : startDetails(c))}
                          className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                        >
                          {detailsId === c.id ? 'Close' : 'Edit details'}
                        </button>
                        <button
                          onClick={() => startEdit(c.id, c.name)}
                          className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                        >
                          Rename
                        </button>
                        <button
                          onClick={() => toggleActive(c.id, c.is_active)}
                          className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                        >
                          {c.is_active ? 'Deactivate' : 'Reactivate'}
                        </button>
                        <button
                          onClick={() => handleDelete(c.id, c.name)}
                          className="text-xs text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
                {detailsId === c.id && (
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                      <label className={labelClass}>Email</label>
                      <input
                        type="email"
                        value={details.email}
                        onChange={(e) => setDetails((d) => ({ ...d, email: e.target.value }))}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Phone</label>
                      <input
                        value={details.phone}
                        onChange={(e) => setDetails((d) => ({ ...d, phone: e.target.value }))}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Address</label>
                      <input
                        value={details.address}
                        onChange={(e) => setDetails((d) => ({ ...d, address: e.target.value }))}
                        className={inputClass}
                      />
                    </div>
                    <div className="sm:col-span-3 flex gap-2">
                      <button
                        onClick={() => saveDetails(c.id)}
                        className="rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-3 py-1.5 text-xs transition"
                      >
                        Save details
                      </button>
                      <button
                        onClick={() => setDetailsId(null)}
                        className="rounded-lg border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 px-3 py-1.5 text-xs transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
      <p className="text-xs text-slate-400 dark:text-slate-500">
        Customers belong to the business you have selected above — switch businesses to manage a
        different roster. Deactivated customers stay visible here and keep their history but drop out
        of suggestions elsewhere.
      </p>
    </div>
  )
}
