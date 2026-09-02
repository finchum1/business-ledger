import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { supabase } from '../lib/supabase'
import { useBusinesses } from '../lib/useBusinesses'
import { useBankConnections } from '../lib/useBankConnections'
import { useBankAccounts } from '../lib/useBankAccounts'
import { useCategories } from '../lib/useCategories'
import { useContractors } from '../lib/useContractors'
import { connectBank, syncBankConnection } from '../lib/bankSync'
import { Combobox } from '../components/Combobox'
import type { BankTransaction } from '../lib/types'

const inputClass =
  'w-full rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-3 py-2 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500'
const labelClass = 'block text-xs text-slate-500 dark:text-slate-400 mb-1'

function fmt(n: number) {
  return Math.abs(n).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function fmtDate(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString()
}

/** One pending bank transaction, with its own category/contractor picker
 * and Import/Ignore actions. Kept as its own component so each row carries
 * independent local form state without one giant object in the parent. */
function ReviewRow({
  tx,
  accountName,
  businessId,
  categoryOptions,
  contractorOptions,
  onResolved,
  setError,
}: {
  tx: BankTransaction
  accountName: string
  businessId: string
  categoryOptions: string[]
  contractorOptions: string[]
  onResolved: () => void
  setError: (msg: string | null) => void
}) {
  const [category, setCategory] = useState('')
  const [contractor, setContractor] = useState('')
  const [busy, setBusy] = useState(false)
  const isIncome = tx.amount >= 0

  async function handleImport() {
    if (!category.trim()) {
      setError('Pick or type a category before importing.')
      return
    }
    setBusy(true)
    setError(null)
    try {
      const { data: inserted, error: insErr } = await supabase
        .from('transactions')
        .insert({
          business_id: businessId,
          date: tx.posted_date ?? new Date().toISOString().slice(0, 10),
          type: isIncome ? 'income' : 'expense',
          category: category.trim(),
          amount: Math.abs(tx.amount),
          description: tx.description,
          contractor: !isIncome ? contractor.trim() || null : null,
        })
        .select('id')
        .single()
      if (insErr) throw insErr
      const { error: updErr } = await supabase
        .from('bank_transactions')
        .update({ status: 'imported', transaction_id: inserted!.id })
        .eq('id', tx.id)
      if (updErr) throw updErr
      onResolved()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import this transaction.')
    } finally {
      setBusy(false)
    }
  }

  async function handleIgnore() {
    setBusy(true)
    setError(null)
    try {
      const { error } = await supabase.from('bank_transactions').update({ status: 'ignored' }).eq('id', tx.id)
      if (error) throw error
      onResolved()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to ignore this transaction.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <li className="py-3">
      <div className="flex flex-wrap items-center gap-3 mb-2">
        <span className="text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap">
          {fmtDate(tx.posted_date)}
        </span>
        <span className="text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">{accountName}</span>
        <span className="text-sm text-slate-700 dark:text-slate-200 flex-1 min-w-[8rem]">
          {tx.description || '—'}
        </span>
        <span
          className={`text-sm font-medium whitespace-nowrap ${
            isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
          }`}
        >
          {isIncome ? '+' : '−'}${fmt(tx.amount)}
        </span>
      </div>
      <div className="flex flex-wrap items-end gap-2">
        <div className="w-48">
          <label className={labelClass}>Category</label>
          <Combobox
            placeholder="e.g. Materials & Supplies"
            value={category}
            onChange={setCategory}
            options={categoryOptions}
          />
        </div>
        {!isIncome && (
          <div className="w-48">
            <label className={labelClass}>Contractor (optional)</label>
            <Combobox
              placeholder="e.g. Bob's Plumbing"
              value={contractor}
              onChange={setContractor}
              options={contractorOptions}
            />
          </div>
        )}
        <button
          type="button"
          onClick={handleImport}
          disabled={busy}
          className="rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white font-medium px-4 py-2 text-sm transition"
        >
          Import
        </button>
        <button
          type="button"
          onClick={handleIgnore}
          disabled={busy}
          className="rounded-lg border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 text-slate-600 dark:text-slate-300 px-4 py-2 text-sm transition disabled:opacity-60"
        >
          Ignore
        </button>
      </div>
    </li>
  )
}

export function BankingPage() {
  const { businesses } = useBusinesses()
  const { connections, loading: connectionsLoading, error: connError, refetch: refetchConnections } =
    useBankConnections()
  const { accounts, loading: accountsLoading, refetch: refetchAccounts } = useBankAccounts()
  const { categories } = useCategories()
  const { contractors } = useContractors()

  const [businessId, setBusinessId] = useState('')
  const [setupToken, setSetupToken] = useState('')
  const [connecting, setConnecting] = useState(false)
  const [syncingId, setSyncingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  const [pending, setPending] = useState<BankTransaction[]>([])
  const [pendingLoading, setPendingLoading] = useState(true)

  const activeBusinesses = useMemo(() => businesses.filter((b) => b.is_active), [businesses])

  useEffect(() => {
    if (!businessId && businesses.length > 0) {
      setBusinessId((activeBusinesses[0] ?? businesses[0]).id)
    }
  }, [businesses, activeBusinesses, businessId])

  async function loadPending() {
    if (!businessId) {
      setPending([])
      setPendingLoading(false)
      return
    }
    setPendingLoading(true)
    try {
      const { data, error } = await supabase
        .from('bank_transactions')
        .select('*')
        .eq('business_id', businessId)
        .eq('status', 'pending_review')
        .order('posted_date', { ascending: false })
      if (error) throw error
      setPending(data as BankTransaction[])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load pending bank transactions.')
    } finally {
      setPendingLoading(false)
    }
  }

  useEffect(() => {
    loadPending()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessId])

  const businessConnections = useMemo(
    () => connections.filter((c) => c.business_id === businessId),
    [connections, businessId],
  )
  const accountsByConnection = useMemo(() => {
    const map = new Map<string, typeof accounts>()
    for (const a of accounts) {
      const list = map.get(a.connection_id) ?? []
      list.push(a)
      map.set(a.connection_id, list)
    }
    return map
  }, [accounts])
  const accountName = (id: string) => accounts.find((a) => a.id === id)?.name ?? 'Account'

  const categoryOptions = useMemo(
    () => categories.filter((c) => c.is_active).map((c) => c.name),
    [categories],
  )
  const contractorOptions = useMemo(
    () => contractors.filter((c) => c.is_active && c.business_id === businessId).map((c) => c.name),
    [contractors, businessId],
  )

  async function handleConnect(e: FormEvent) {
    e.preventDefault()
    if (!setupToken.trim() || !businessId) return
    setConnecting(true)
    setError(null)
    setNotice(null)
    try {
      const result = await connectBank(businessId, setupToken.trim())
      setSetupToken('')
      setNotice(
        `Connected — pulled ${result.accountsSynced} account${result.accountsSynced === 1 ? '' : 's'} and ${result.transactionsNew} transaction${result.transactionsNew === 1 ? '' : 's'} to review.`,
      )
      await Promise.all([refetchConnections(), refetchAccounts()])
      await loadPending()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect that bank.')
    } finally {
      setConnecting(false)
    }
  }

  async function handleSync(connectionId: string) {
    setSyncingId(connectionId)
    setError(null)
    setNotice(null)
    try {
      const result = await syncBankConnection(connectionId)
      setNotice(
        `Synced — ${result.accountsSynced} account${result.accountsSynced === 1 ? '' : 's'}, ${result.transactionsNew} new transaction${result.transactionsNew === 1 ? '' : 's'} to review.`,
      )
      await Promise.all([refetchConnections(), refetchAccounts()])
      await loadPending()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sync failed.')
    } finally {
      setSyncingId(null)
    }
  }

  async function handleDisconnect(connectionId: string) {
    if (!confirm('Disconnect this bank? Its accounts and any unreviewed transactions go with it.')) return
    setError(null)
    try {
      const { error } = await supabase.from('bank_connections').delete().eq('id', connectionId)
      if (error) throw error
      await Promise.all([refetchConnections(), refetchAccounts()])
      await loadPending()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to disconnect.')
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <section className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Banking</h2>
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

        <form onSubmit={handleConnect} className="flex flex-wrap gap-2 items-end">
          <div className="flex-1 min-w-[16rem]">
            <label className={labelClass}>Connect a bank</label>
            <input
              type="text"
              placeholder="Paste a SimpleFIN setup token"
              value={setupToken}
              onChange={(e) => setSetupToken(e.target.value)}
              disabled={!businessId}
              className={`${inputClass} disabled:opacity-60`}
            />
          </div>
          <button
            type="submit"
            disabled={connecting || !businessId || !setupToken.trim()}
            className="rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white font-medium px-4 py-2 text-sm transition"
          >
            {connecting ? 'Connecting…' : 'Connect'}
          </button>
        </form>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
          Get a one-time setup token from{' '}
          <a
            href="https://bridge.simplefin.org/simplefin/create"
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 dark:hover:text-emerald-300"
          >
            bridge.simplefin.org
          </a>{' '}
          — it links your own bank login there, never here, and the token can only be used once.
        </p>
        {businesses.length === 0 && (
          <p className="text-xs text-amber-600 dark:text-amber-400 mt-3">
            Add a business in Settings before connecting a bank.
          </p>
        )}
        {notice && <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-3">{notice}</p>}
        {(error || connError) && (
          <p className="text-sm text-rose-600 dark:text-rose-400 mt-3" role="alert">
            {error ?? connError}
          </p>
        )}
      </section>

      <section className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
          Connected accounts
        </h2>
        {connectionsLoading || accountsLoading ? (
          <p className="text-slate-500 dark:text-slate-400 text-sm">Loading…</p>
        ) : businessConnections.length === 0 ? (
          <p className="text-slate-400 dark:text-slate-500 text-sm">
            No banks connected for this business yet.
          </p>
        ) : (
          <ul className="divide-y divide-slate-200 dark:divide-slate-800">
            {businessConnections.map((conn) => (
              <li key={conn.id} className="py-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-block w-2 h-2 rounded-full ${
                          conn.status === 'active'
                            ? 'bg-emerald-500'
                            : conn.status === 'error'
                              ? 'bg-rose-500'
                              : 'bg-slate-400'
                        }`}
                      />
                      <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                        {(accountsByConnection.get(conn.id) ?? []).map((a) => a.org_name || a.name).join(', ') ||
                          'Connection'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                      Last synced {conn.last_synced_at ? fmtDate(conn.last_synced_at) : 'never'}
                      {conn.status === 'error' && conn.last_error ? ` — ${conn.last_error}` : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      onClick={() => handleSync(conn.id)}
                      disabled={syncingId === conn.id}
                      className="text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 dark:hover:text-emerald-300 disabled:opacity-60"
                    >
                      {syncingId === conn.id ? 'Syncing…' : 'Sync now'}
                    </button>
                    <button
                      onClick={() => handleDisconnect(conn.id)}
                      className="text-xs text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400"
                    >
                      Disconnect
                    </button>
                  </div>
                </div>
                {(accountsByConnection.get(conn.id) ?? []).length > 0 && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm mt-3">
                      <tbody>
                        {(accountsByConnection.get(conn.id) ?? []).map((a) => (
                          <tr key={a.id} className="border-t border-slate-200/70 dark:border-slate-800/60">
                            <td className="py-1.5 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                              {a.name}
                            </td>
                            <td className="py-1.5 text-right text-slate-700 dark:text-slate-200 font-medium whitespace-nowrap">
                              {a.currency ?? '$'} {a.current_balance != null ? fmt(a.current_balance) : '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">Pending review</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">
          Synced transactions land here first — nothing reaches the Ledger until you import it.
        </p>
        {pendingLoading ? (
          <p className="text-slate-500 dark:text-slate-400 text-sm">Loading…</p>
        ) : pending.length === 0 ? (
          <p className="text-slate-400 dark:text-slate-500 text-sm">Nothing to review right now.</p>
        ) : (
          <ul className="divide-y divide-slate-200 dark:divide-slate-800">
            {pending.map((tx) => (
              <ReviewRow
                key={tx.id}
                tx={tx}
                accountName={accountName(tx.bank_account_id)}
                businessId={businessId}
                categoryOptions={categoryOptions}
                contractorOptions={contractorOptions}
                onResolved={loadPending}
                setError={setError}
              />
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
