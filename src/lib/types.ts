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

export interface Transaction {
  id: string
  business_id: string
  date: string // YYYY-MM-DD
  type: TxType
  category: string
  amount: number
  description: string | null
  receipt_path: string | null
  created_at: string
}

export type InvoiceStatus = 'unpaid' | 'paid'

export interface Invoice {
  id: string
  business_id: string
  invoice_number: string
  status: InvoiceStatus
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
