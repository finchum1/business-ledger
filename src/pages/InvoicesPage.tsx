import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { useBusinesses } from '../lib/useBusinesses'
import { getLogoUrl } from '../lib/logos'
import {
  createInvoice,
  deleteInvoice,
  fetchInvoices,
  fetchLineItems,
  nextInvoiceNumber,
  setInvoiceStatus,
  updateInvoice,
  type LineItemInput,
} from '../lib/invoices'
import type { Invoice, InvoiceStatus } from '../lib/types'

function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

const emptyLineItem: LineItemInput = { description: '', quantity: 1, rate: 0 }

const inputClass =
  'w-full rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-3 py-2 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500'
const labelClass = 'block text-xs text-slate-500 dark:text-slate-400 mb-1'

function fmt(n: number) {
  return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export function InvoicesPage() {
  const { businesses } = useBusinesses()
  const [businessId, setBusinessId] = useState('')
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [pdfBusy, setPdfBusy] = useState<string | null>(null)

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [invoiceNumber, setInvoiceNumber] = useState('')
  const [clientName, setClientName] = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [clientAddress, setClientAddress] = useState('')
  const [issueDate, setIssueDate] = useState(todayStr())
  const [dueDate, setDueDate] = useState('')
  const [notes, setNotes] = useState('')
  const [lineItems, setLineItems] = useState<LineItemInput[]>([{ ...emptyLineItem }])

  const activeBusinesses = useMemo(() => businesses.filter((b) => b.is_active), [businesses])

  useEffect(() => {
    if (!businessId && businesses.length > 0) {
      setBusinessId((activeBusinesses[0] ?? businesses[0]).id)
    }
  }, [businesses, activeBusinesses, businessId])

  const business = businesses.find((b) => b.id === businessId) ?? null

  async function loadInvoices() {
    if (!businessId) {
      setInvoices([])
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const data = await fetchInvoices(businessId)
      setInvoices(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load invoices.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadInvoices()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessId])

  const total = lineItems.reduce((s, li) => s + li.quantity * li.rate, 0)

  function resetForm() {
    setEditingId(null)
    setClientName('')
    setClientEmail('')
    setClientAddress('')
    setIssueDate(todayStr())
    setDueDate('')
    setNotes('')
    setLineItems([{ ...emptyLineItem }])
  }

  async function openCreateForm() {
    setError(null)
    resetForm()
    try {
      setInvoiceNumber(await nextInvoiceNumber(businessId))
      setShowForm(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate an invoice number.')
    }
  }

  async function openEditForm(invoice: Invoice) {
    setError(null)
    try {
      const items = await fetchLineItems(invoice.id)
      setEditingId(invoice.id)
      setInvoiceNumber(invoice.invoice_number)
      setClientName(invoice.client_name)
      setClientEmail(invoice.client_email ?? '')
      setClientAddress(invoice.client_address ?? '')
      setIssueDate(invoice.issue_date)
      setDueDate(invoice.due_date ?? '')
      setNotes(invoice.notes ?? '')
      setLineItems(
        items.length > 0
          ? items.map((li) => ({ description: li.description, quantity: li.quantity, rate: li.rate }))
          : [{ ...emptyLineItem }],
      )
      setShowForm(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load invoice.')
    }
  }

  function closeForm() {
    setShowForm(false)
    resetForm()
  }

  function updateLineItem(index: number, patch: Partial<LineItemInput>) {
    setLineItems((items) => items.map((li, i) => (i === index ? { ...li, ...patch } : li)))
  }

  function addLineItem() {
    setLineItems((items) => [...items, { ...emptyLineItem }])
  }

  function removeLineItem(index: number) {
    setLineItems((items) => (items.length > 1 ? items.filter((_, i) => i !== index) : items))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    const cleanedItems = lineItems
      .map((li) => ({ ...li, description: li.description.trim() }))
      .filter((li) => li.description)
    if (!clientName.trim()) {
      setError('Client name is required.')
      return
    }
    if (cleanedItems.length === 0) {
      setError('Add at least one line item.')
      return
    }
    setSaving(true)
    try {
      const fields = {
        client_name: clientName.trim(),
        client_email: clientEmail.trim() || null,
        client_address: clientAddress.trim() || null,
        issue_date: issueDate,
        due_date: dueDate || null,
        notes: notes.trim() || null,
      }
      if (editingId) {
        await updateInvoice(editingId, fields, cleanedItems)
      } else {
        await createInvoice(businessId, invoiceNumber, fields, cleanedItems)
      }
      closeForm()
      loadInvoices()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save invoice.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this invoice? This cannot be undone.')) return
    try {
      await deleteInvoice(id)
      loadInvoices()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete invoice.')
    }
  }

  async function handleToggleStatus(invoice: Invoice) {
    const next: InvoiceStatus = invoice.status === 'paid' ? 'unpaid' : 'paid'
    try {
      await setInvoiceStatus(invoice.id, next)
      loadInvoices()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update invoice status.')
    }
  }

  async function handleViewPdf(invoice: Invoice) {
    if (!business) return
    const newTab = window.open('', '_blank', 'noopener,noreferrer')
    setPdfBusy(invoice.id)
    setError(null)
    try {
      const [{ pdf }, { InvoicePDF }, items] = await Promise.all([
        import('@react-pdf/renderer'),
        import('../lib/pdf/InvoicePDF'),
        fetchLineItems(invoice.id),
      ])
      const invoiceTotal = items.reduce((s, li) => s + li.amount, 0)
      const blob = await pdf(
        <InvoicePDF
          logoUrl={business.logo_path ? getLogoUrl(business.logo_path) : null}
          businessName={business.name}
          businessContactName={business.contact_name}
          businessAddress={business.address}
          businessPhone={business.phone}
          businessEmail={business.email}
          businessWebsite={business.website}
          paymentInstructions={business.payment_instructions}
          invoiceNumber={invoice.invoice_number}
          status={invoice.status}
          issueDate={invoice.issue_date}
          dueDate={invoice.due_date}
          clientName={invoice.client_name}
          clientEmail={invoice.client_email}
          clientAddress={invoice.client_address}
          lineItems={items}
          notes={invoice.notes}
          total={invoiceTotal}
        />,
      ).toBlob()
      const url = URL.createObjectURL(blob)
      if (newTab) {
        newTab.location.href = url
      } else {
        const a = document.createElement('a')
        a.href = url
        a.download = `${invoice.invoice_number}.pdf`
        document.body.appendChild(a)
        a.click()
        a.remove()
      }
    } catch (err) {
      newTab?.close()
      setError(err instanceof Error ? err.message : 'Failed to generate invoice PDF.')
    } finally {
      setPdfBusy(null)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <section className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Invoices</h2>
          <div className="flex items-center gap-2">
            <select
              value={businessId}
              onChange={(e) => {
                setBusinessId(e.target.value)
                closeForm()
              }}
              className="rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-3 py-2 text-slate-900 dark:text-slate-100 text-sm"
            >
              {businesses.length === 0 && <option value="">No businesses yet</option>}
              {businesses.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={showForm ? closeForm : openCreateForm}
              disabled={!businessId}
              className="rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white font-medium px-4 py-2 text-sm transition"
            >
              {showForm ? 'Cancel' : 'New Invoice'}
            </button>
          </div>
        </div>
        {businesses.length === 0 && (
          <p className="text-xs text-amber-600 dark:text-amber-400">
            Add a business in Settings before creating invoices.
          </p>
        )}
        {!business?.address && !business?.email && !business?.phone && business && (
          <p className="text-xs text-amber-600 dark:text-amber-400">
            This business has no contact info yet — add a logo, address, and contact details on the
            Settings page so invoices look complete.
          </p>
        )}
      </section>

      {showForm && (
        <section className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
            {editingId ? `Edit ${invoiceNumber}` : `New invoice — ${invoiceNumber}`}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className={labelClass}>Client name</label>
                <input
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Client email</label>
                <input
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Client address</label>
                <input
                  value={clientAddress}
                  onChange={(e) => setClientAddress(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Issue date</label>
                <input
                  type="date"
                  required
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Due date (optional)</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Line items</label>
              <div className="space-y-2">
                {lineItems.map((li, i) => (
                  <div key={i} className="flex flex-wrap sm:flex-nowrap items-center gap-2">
                    <input
                      placeholder="Description"
                      value={li.description}
                      onChange={(e) => updateLineItem(i, { description: e.target.value })}
                      className={`${inputClass} flex-1 min-w-[10rem]`}
                    />
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="Qty"
                      value={li.quantity}
                      onChange={(e) => updateLineItem(i, { quantity: parseFloat(e.target.value) || 0 })}
                      className={`${inputClass} w-20`}
                    />
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="Rate"
                      value={li.rate}
                      onChange={(e) => updateLineItem(i, { rate: parseFloat(e.target.value) || 0 })}
                      className={`${inputClass} w-24`}
                    />
                    <span className="text-sm text-slate-600 dark:text-slate-300 w-20 text-right">
                      ${fmt(li.quantity * li.rate)}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeLineItem(i)}
                      className="text-slate-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 text-sm px-1"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addLineItem}
                className="mt-2 text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 dark:hover:text-emerald-300"
              >
                + Add line item
              </button>
            </div>

            <div>
              <label className={labelClass}>Notes (optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Shown at the bottom of the invoice"
                className={inputClass}
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
              <span className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Total: ${fmt(total)}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white font-medium px-4 py-2 text-sm transition"
                >
                  {saving ? 'Saving…' : editingId ? 'Save changes' : 'Create invoice'}
                </button>
                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-lg border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 text-slate-600 dark:text-slate-300 px-4 py-2 text-sm transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </section>
      )}

      {error && (
        <p className="text-sm text-rose-600 dark:text-rose-400" role="alert">
          {error}
        </p>
      )}

      <section className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
        {loading ? (
          <p className="text-slate-500 dark:text-slate-400 text-sm">Loading…</p>
        ) : invoices.length === 0 ? (
          <p className="text-slate-400 dark:text-slate-500 text-sm">No invoices yet for this business.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                  <th className="py-2 pr-3 font-medium">Number</th>
                  <th className="py-2 pr-3 font-medium">Client</th>
                  <th className="py-2 pr-3 font-medium">Issued</th>
                  <th className="py-2 pr-3 font-medium">Status</th>
                  <th className="py-2 pr-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr
                    key={inv.id}
                    className="border-b border-slate-200/70 dark:border-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800/30"
                  >
                    <td className="py-2 pr-3 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                      {inv.invoice_number}
                    </td>
                    <td className="py-2 pr-3 text-slate-600 dark:text-slate-300">{inv.client_name}</td>
                    <td className="py-2 pr-3 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                      {inv.issue_date}
                    </td>
                    <td className="py-2 pr-3">
                      <button
                        onClick={() => handleToggleStatus(inv)}
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          inv.status === 'paid'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400'
                        }`}
                        title="Click to toggle paid/unpaid"
                      >
                        {inv.status === 'paid' ? 'Paid' : 'Unpaid'}
                      </button>
                    </td>
                    <td className="py-2 pr-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleViewPdf(inv)}
                        disabled={pdfBusy === inv.id}
                        className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 dark:hover:text-emerald-300 text-xs mr-3"
                      >
                        {pdfBusy === inv.id ? 'Generating…' : 'PDF'}
                      </button>
                      {inv.status !== 'paid' && (
                        <button
                          onClick={() => openEditForm(inv)}
                          className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 text-xs mr-3"
                        >
                          Edit
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(inv.id)}
                        className="text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 text-xs"
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
