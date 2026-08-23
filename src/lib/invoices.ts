import { supabase } from './supabase'
import type { Invoice, InvoiceLineItem, InvoiceStatus } from './types'

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

export async function fetchLineItems(invoiceId: string): Promise<InvoiceLineItem[]> {
  const { data, error } = await supabase
    .from('invoice_line_items')
    .select('*')
    .eq('invoice_id', invoiceId)
    .order('sort_order', { ascending: true })
  if (error) throw error
  return data as InvoiceLineItem[]
}

/** Next sequential number for this business, e.g. INV-0001 -> INV-0002. Scoped per business. */
export async function nextInvoiceNumber(businessId: string): Promise<string> {
  const { data, error } = await supabase
    .from('invoices')
    .select('invoice_number')
    .eq('business_id', businessId)
  if (error) throw error
  let max = 0
  for (const row of data ?? []) {
    const m = /(\d+)$/.exec(row.invoice_number)
    if (m) max = Math.max(max, parseInt(m[1], 10))
  }
  return `INV-${String(max + 1).padStart(4, '0')}`
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
  invoiceNumber: string,
  fields: InvoiceFields,
  lineItems: LineItemInput[],
): Promise<string> {
  const { data, error } = await supabase
    .from('invoices')
    .insert({ business_id: businessId, invoice_number: invoiceNumber, ...fields })
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
