export interface NavItem {
  to: string
  label: string
  end: boolean
}

export const BASE_NAV: NavItem[] = [
  { to: '/', label: 'Home', end: true },
  { to: '/ledger', label: 'Ledger', end: false },
  { to: '/contractors', label: 'Contractors', end: false },
  { to: '/clients', label: 'Clients', end: false },
  { to: '/reports', label: 'Reports', end: false },
]

/** Splices Banking in after Clients, only for accounts with beta access. */
export function navFor(hasBanking: boolean): NavItem[] {
  if (!hasBanking) return BASE_NAV
  return [...BASE_NAV.slice(0, 4), { to: '/banking', label: 'Banking', end: false }, ...BASE_NAV.slice(4)]
}
