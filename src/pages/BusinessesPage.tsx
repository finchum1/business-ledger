import { useState } from 'react'
import type { FormEvent } from 'react'
import { supabase } from '../lib/supabase'
import { useBusinesses } from '../lib/useBusinesses'

export function BusinessesPage() {
  const { businesses, loading, error: fetchError, refetch } = useBusinesses()
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')

  async function handleAdd(e: FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setSaving(true)
    setError(null)
    try {
      const { error } = await supabase
        .from('businesses')
        .insert({ name: name.trim(), sort_order: businesses.length })
      if (error) throw error
      setName('')
      refetch()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add business.')
    } finally {
      setSaving(false)
    }
  }

  async function toggleActive(id: string, is_active: boolean) {
    try {
      const { error } = await supabase.from('businesses').update({ is_active: !is_active }).eq('id', id)
      if (error) throw error
      refetch()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update business.')
    }
  }

  function startEdit(id: string, currentName: string) {
    setEditingId(id)
    setEditingName(currentName)
  }

  async function saveEdit(id: string) {
    if (!editingName.trim()) return
    try {
      const { error } = await supabase
        .from('businesses')
        .update({ name: editingName.trim() })
        .eq('id', id)
      if (error) throw error
      setEditingId(null)
      refetch()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to rename business.')
    }
  }

  async function handleDelete(id: string, name: string) {
    if (
      !confirm(
        `Delete "${name}"? This is only possible if it has no transactions recorded. To keep its history, use "Deactivate" instead so it stops appearing in the entry dropdown but stays in reports.`,
      )
    )
      return
    try {
      const { error } = await supabase.from('businesses').delete().eq('id', id)
      if (error) throw error
      refetch()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete business.')
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-slate-100 mb-4">Add a business</h2>
        <form onSubmit={handleAdd} className="flex gap-2">
          <input
            type="text"
            placeholder="e.g. Thrively Inspections"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white font-medium px-4 py-2 text-sm transition"
          >
            {saving ? 'Adding…' : 'Add'}
          </button>
        </form>
        {(error || fetchError) && <p className="text-sm text-rose-400 mt-3">{error ?? fetchError}</p>}
      </section>

      <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-slate-100 mb-4">Your businesses</h2>
        {loading ? (
          <p className="text-slate-400 text-sm">Loading…</p>
        ) : businesses.length === 0 ? (
          <p className="text-slate-500 text-sm">No businesses yet — add one above.</p>
        ) : (
          <ul className="divide-y divide-slate-800">
            {businesses.map((b) => (
              <li key={b.id} className="py-3 flex items-center justify-between gap-3">
                {editingId === b.id ? (
                  <input
                    autoFocus
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && saveEdit(b.id)}
                    className="flex-1 rounded-lg bg-slate-800 border border-slate-700 px-3 py-1.5 text-slate-100 text-sm"
                  />
                ) : (
                  <span className={`text-sm ${b.is_active ? 'text-slate-200' : 'text-slate-500 line-through'}`}>
                    {b.name}
                  </span>
                )}
                <div className="flex items-center gap-3 shrink-0">
                  {editingId === b.id ? (
                    <>
                      <button
                        onClick={() => saveEdit(b.id)}
                        className="text-xs text-emerald-400 hover:text-emerald-300"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="text-xs text-slate-400 hover:text-slate-200"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEdit(b.id, b.name)}
                        className="text-xs text-slate-400 hover:text-slate-100"
                      >
                        Rename
                      </button>
                      <button
                        onClick={() => toggleActive(b.id, b.is_active)}
                        className="text-xs text-slate-400 hover:text-slate-100"
                      >
                        {b.is_active ? 'Deactivate' : 'Reactivate'}
                      </button>
                      <button
                        onClick={() => handleDelete(b.id, b.name)}
                        className="text-xs text-slate-400 hover:text-rose-400"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
        <p className="text-xs text-slate-500 mt-4">
          Deactivated businesses drop out of the "Add transaction" dropdown but stay visible in P&amp;L
          reports and keep their history.
        </p>
      </section>
    </div>
  )
}
