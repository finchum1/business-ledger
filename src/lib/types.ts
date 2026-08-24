export type TxType = 'income' | 'expense'

export interface Business {
  id: string
  name: string
  is_active: boolean
  sort_order: number
  created_at: string
  logo_path: string | null
  contact_name: string | null
  email: string | null
  phone: string | null
  website: string | null
  address: string | null
  payment_instructions: string | null
}

export interface Category {
  id: string
  name: string
  type: TxType
  is_active: boolean
  sort_order: number
  created_at: string
}

export interface Contractor {
  id: string
  business_id: string
  name: string
  is_active: boolean
  sort_order: number
  created_at: string
}

export interface Customer {
  id: string
  business_id: string
  name: string
  email: string | null
  phone: string | null
  address: string | null
  is_active: boolean
  sort_order: number
  created_at: string
}

export interface Transaction {
  id: string
  business_id: string
  date: string // YYYY-MM-DD
  type: TxType
  category: string
  amount: number
  description: string | null
  receipt_path: string | null
  contractor: string | null
  created_at: string
}

export type InvoiceStatus = 'unpaid' | 'paid'
export type DocType = 'quote' | 'invoice'

export interface Invoice {
  id: string
  business_id: string
  doc_type: DocType
  invoice_number: string
  status: InvoiceStatus
  sent_at: string | null
  approved_at: string | null
  converted_to_invoice_id: string | null
  client_name: string
  client_email: string | null
  client_address: string | null
  issue_date: string
  due_date: string | null
  notes: string | null
  created_at: string
}

export interface InvoiceLineItem {
  id: string
  invoice_id: string
  description: string
  quantity: number
  rate: number
  amount: number
  sort_order: number
}

export type BankConnectionStatus = 'active' | 'error' | 'disabled'

/** Deliberately excludes `access_url` -- listing queries select an explicit
 * column list without it, so the SimpleFIN credential never has to be read
 * back into client state. See lib/useBankConnections.ts. */
export interface BankConnection {
  id: string
  business_id: string
  status: BankConnectionStatus
  last_error: string | null
  last_synced_at: string | null
  created_at: string
}

export interface BankAccount {
  id: string
  connection_id: string
  business_id: string
  external_account_id: string
  name: string
  org_name: string | null
  currency: string | null
  current_balance: number | null
  available_balance: number | null
  balance_date: string | null
  is_active: boolean
  created_at: string
}

export type BankTransactionStatus = 'pending_review' | 'imported' | 'ignored'

export interface BankTransaction {
  id: string
  bank_account_id: string
  business_id: string
  external_transaction_id: string
  posted_date: string | null
  amount: number
  description: string | null
  pending: boolean
  status: BankTransactionStatus
  transaction_id: string | null
  created_at: string
}
