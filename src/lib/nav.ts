export interface NavItem {
  to: string
  label: string
  end: boolean
}

export const NAV: NavItem[] = [
  { to: '/', label: 'Home', end: true },
  { to: '/ledger', label: 'Ledger', end: false },
  { to: '/contractors', label: 'Contractors', end: false },
  { to: '/clients', label: 'Clients', end: false },
  { to: '/reports', label: 'Reports', end: false },
]
