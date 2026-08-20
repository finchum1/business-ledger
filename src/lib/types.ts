export type TxType = 'income' | 'expense'

export interface Business {
  id: string
  name: string
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
  created_at: string
}

export const DEFAULT_INCOME_CATEGORIES = [
  'Service Revenue',
  'Product Sales',
  'Reimbursement',
  'Interest Income',
  'Other Income',
]

export const DEFAULT_EXPENSE_CATEGORIES = [
  'Materials & Supplies',
  'Subcontractors / Labor',
  'Equipment',
  'Software & Subscriptions',
  'Insurance',
  'Marketing & Advertising',
  'Fees & Dues',
  'Travel',
  'Meals',
  'Vehicle / Mileage',
  'Utilities',
  'Rent',
  'Office Supplies',
  'Professional Services',
  'Taxes & Licenses',
  'Other Expense',
]
