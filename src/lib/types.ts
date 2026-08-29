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

export interface Client {
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
  client: string | null
  created_at: string
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
