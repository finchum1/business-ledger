import { supabase } from './supabase'
import type { DocType, Invoice, InvoiceLineItem, InvoiceStatus } from './types'

export interface LineItemInput {
  description: string
  quantity: number
  rate: number
}

export interface InvoiceFields {
  client_name: string
  client_email: string | null
  client_address: string | null
  issue_date: string
  due_date: string | null
  notes: string | null
}

export async function fetchInvoices(businessId: string): Promise<Invoice[]> {
  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('business_id', businessId)
    .order('issue_date', { ascending: false })
    .order('created_at', { ascending: false })
  if (error) throw error
  return data as Invoice[]
}

/** Every quote/invoice across every business -- for the Home overview, which has no single business in scope. */
export async function fetchAllInvoices(): Promise<Invoice[]> {
  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .order('issue_date', { ascending: false })
  if (error) throw error
  return data as Invoice[]
}

/** Batched line-item totals for a set of invoices (one query, not N+1) -- id -> sum(amount). */
export async function fetchLineItemTotals(invoiceIds: string[]): Promise<Record<string, number>> {
  if (invoiceIds.length === 0) return {}
  const { data, error } = await supabase
    .from('invoice_line_items')
    .select('invoice_id, amount')
    .in('invoice_id', invoiceIds)
  if (error) throw error
  const totals: Record<string, number> = {}
  for (const row of data ?? []) {
    totals[row.invoice_id] = (totals[row.invoice_id] ?? 0) + Number(row.amount)
  }
  return totals
}

export type StatusTone = 'green' | 'amber' | 'gray'

/** Single source of truth for the status word shown on a Sales/Home row or stat tile. Kept in
 * sync BY HAND with lib/pdf/InvoicePDF.tsx's own statusBadge() -- that one can't import this
 * (react-pdf needs real hex colors, not Tailwind tone names), so if this logic ever changes,
 * that file needs the same change made manually. */
export function statusLabel(invoice: Pick<Invoice, 'doc_type' | 'status' | 'sent_at' | 'approved_at'>): {
  label: string
  tone: StatusTone
} {
  if (invoice.doc_type === 'invoice') {
    if (invoice.status === 'paid') return { label: 'Paid', tone: 'green' }
    if (invoice.sent_at) return { label: 'Sent', tone: 'amber' }
    return { label: 'Draft', tone: 'gray' }
  }
  if (invoice.approved_at) return { label: 'Approved', tone: 'green' }
  if (invoice.sent_at) return { label: 'Sent', tone: 'amber' }
  return { label: 'Draft', tone: 'gray' }
}

export async function fetchLineItems(invoiceId: string): Promise<InvoiceLineItem[]> {
  const { data, error } = await supabase
    .from('invoice_line_items')
    .select('*')
    .eq('invoice_id', invoiceId)
    .order('sort_order', { ascending: true })
  if (error) throw error
  return data as InvoiceLineItem[]
}

const NUMBER_PREFIX: Record<DocType, string> = { quote: 'Q', invoice: 'INV' }

/** Next sequential number for this business + doc type, e.g. Q-0001 or INV-0001, each scoped separately. */
export async function nextDocumentNumber(businessId: string, docType: DocType): Promise<string> {
  const { data, error } = await supabase
    .from('invoices')
    .select('invoice_number')
    .eq('business_id', businessId)
    .eq('doc_type', docType)
  if (error) throw error
  let max = 0
  for (const row of data ?? []) {
    const m = /(\d+)$/.exec(row.invoice_number)
    if (m) max = Math.max(max, parseInt(m[1], 10))
  }
  return `${NUMBER_PREFIX[docType]}-${String(max + 1).padStart(4, '0')}`
}

async function replaceLineItems(invoiceId: string, lineItems: LineItemInput[]) {
  const { error: delError } = await supabase
    .from('invoice_line_items')
    .delete()
    .eq('invoice_id', invoiceId)
  if (delError) throw delError
  if (lineItems.length === 0) return
  const { error: insError } = await supabase.from('invoice_line_items').insert(
    lineItems.map((li, i) => ({
      invoice_id: invoiceId,
      description: li.description,
      quantity: li.quantity,
      rate: li.rate,
      sort_order: i,
    })),
  )
  if (insError) throw insError
}

export async function createInvoice(
  businessId: string,
  docType: DocType,
  invoiceNumber: string,
  fields: InvoiceFields,
  lineItems: LineItemInput[],
): Promise<string> {
  const { data, error } = await supabase
    .from('invoices')
    .insert({ business_id: businessId, doc_type: docType, invoice_number: invoiceNumber, ...fields })
    .select('id')
    .single()
  if (error) throw error
  const invoiceId = data.id as string
  await replaceLineItems(invoiceId, lineItems)
  return invoiceId
}

export async function updateInvoice(
  invoiceId: string,
  fields: InvoiceFields,
  lineItems: LineItemInput[],
): Promise<void> {
  const { error } = await supabase.from('invoices').update(fields).eq('id', invoiceId)
  if (error) throw error
  await replaceLineItems(invoiceId, lineItems)
}

export async function deleteInvoice(invoiceId: string): Promise<void> {
  const { error } = await supabase.from('invoices').delete().eq('id', invoiceId)
  if (error) throw error
}

export async function setInvoiceStatus(invoiceId: string, status: InvoiceStatus): Promise<void> {
  const { error } = await supabase.from('invoices').update({ status }).eq('id', invoiceId)
  if (error) throw error
}

export async function setSent(invoiceId: string, sent: boolean): Promise<void> {
  const { error } = await supabase
    .from('invoices')
    .update({ sent_at: sent ? new Date().toISOString() : null })
    .eq('id', invoiceId)
  if (error) throw error
}

export async function setApproved(invoiceId: string, approved: boolean): Promise<void> {
  const { error } = await supabase
    .from('invoices')
    .update({ approved_at: approved ? new Date().toISOString() : null })
    .eq('id', invoiceId)
  if (error) throw error
}

/** Copies a quote's client info + line items into a brand-new invoice, and links the quote to it. */
export async function convertQuoteToInvoice(quote: Invoice): Promise<string> {
  const lineItems = await fetchLineItems(quote.id)
  const invoiceNumber = await nextDocumentNumber(quote.business_id, 'invoice')
  const invoiceId = await createInvoice(
    quote.business_id,
    'invoice',
    invoiceNumber,
    {
      client_name: quote.client_name,
      client_email: quote.client_email,
      client_address: quote.client_address,
      issue_date: new Date().toISOString().slice(0, 10),
      due_date: null,
      notes: quote.notes,
    },
    lineItems.map((li) => ({ description: li.description, quantity: li.quantity, rate: li.rate })),
  )
  const { error } = await supabase
    .from('invoices')
    .update({ converted_to_invoice_id: invoiceId })
    .eq('id', quote.id)
  if (error) throw error
  return invoiceId
}
