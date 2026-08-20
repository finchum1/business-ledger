import { useState } from 'react'
import type { FormEvent } from 'react'
import { supabase } from '../lib/supabase'
import { useCategories } from '../lib/useCategories'
import type { Category, TxType } from '../lib/types'

function CategoryList({
  title,
  type,
  categories,
  onChanged,
  setError,
}: {
  title: string
  type: TxType
  categories: Category[]
  onChanged: () => void
  setError: (msg: string | null) => void
}) {
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')

  const list = categories.filter((c) => c.type === type)

  async function handleAdd(e: FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setSaving(true)
    setError(null)
    try {
      const { error } = await supabase
        .from('categories')
        .insert({ name: name.trim(), type, sort_order: list.length })
      if (error) throw error
      setName('')
      onChanged()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add category.')
    } finally {
      setSaving(false)
    }
  }

  async function toggleActive(id: string, is_active: boolean) {
    try {
      const { error } = await supabase.from('categories').update({ is_active: !is_active }).eq('id', id)
      if (error) throw error
      onChanged()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update category.')
    }
  }

  async function saveEdit(id: string) {
    if (!editingName.trim()) return
    try {
      const { error } = await supabase
        .from('categories')
        .update({ name: editingName.trim() })
        .eq('id', id)
      if (error) throw error
      setEditingId(null)
      onChanged()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to rename category.')
    }
  }

  async function handleDelete(id: string, categoryName: string) {
    if (
      !confirm(
        `Delete "${categoryName}"? This is only possible if no transactions use it. To keep history, use "Deactivate" instead.`,
      )
    )
      return
    try {
      const { error } = await supabase.from('categories').delete().eq('id', id)
      if (error) throw error
      onChanged()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete category.')
    }
  }

  return (
    <section className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">{title}</h2>
      <form onSubmit={handleAdd} className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder={type === 'income' ? 'e.g. Consulting Revenue' : 'e.g. Storage Unit'}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-3 py-2 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white font-medium px-4 py-2 text-sm transition"
        >
          {saving ? 'Adding…' : 'Add'}
        </button>
      </form>

      {list.length === 0 ? (
        <p className="text-slate-400 dark:text-slate-500 text-sm">No categories yet — add one above.</p>
      ) : (
        <ul className="divide-y divide-slate-200 dark:divide-slate-800">
          {list.map((c) => (
            <li key={c.id} className="py-2.5 flex items-center justify-between gap-3">
              {editingId === c.id ? (
                <input
                  autoFocus
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && saveEdit(c.id)}
                  className="flex-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-3 py-1.5 text-slate-900 dark:text-slate-100 text-sm"
                />
              ) : (
                <span
                  className={`text-sm ${
                    c.is_active
                      ? 'text-slate-800 dark:text-slate-200'
                      : 'text-slate-400 dark:text-slate-500 line-through'
                  }`}
                >
                  {c.name}
                </span>
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
                      onClick={() => {
                        setEditingId(c.id)
                        setEditingName(c.name)
                      }}
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
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export function CategoriesPage() {
  const { categories, loading, error: fetchError, refetch } = useCategories()
  const [error, setError] = useState<string | null>(null)

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      {(error || fetchError) && (
        <p className="text-sm text-rose-600 dark:text-rose-400" role="alert">
          {error ?? fetchError}
        </p>
      )}
      {loading ? (
        <p className="text-slate-500 dark:text-slate-400 text-sm">Loading…</p>
      ) : (
        <>
          <CategoryList
            title="Income categories"
            type="income"
            categories={categories}
            onChanged={refetch}
            setError={setError}
          />
          <CategoryList
            title="Expense categories"
            type="expense"
            categories={categories}
            onChanged={refetch}
            setError={setError}
          />
        </>
      )}
      <p className="text-xs text-slate-400 dark:text-slate-500">
        Deactivated categories drop out of the "Add transaction" suggestions but stay visible in P&amp;L
        reports and keep their history. You can still type any category by hand when adding a
        transaction — this list just drives the suggestions and keeps naming consistent.
      </p>
    </div>
  )
}
