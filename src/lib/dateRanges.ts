function toStr(d: Date) {
  return d.toISOString().slice(0, 10)
}

export type PresetKey =
  | 'this_month'
  | 'last_month'
  | 'this_quarter'
  | 'ytd'
  | 'last_year'
  | 'all_time'
  | 'custom'

export const PRESET_LABELS: Record<PresetKey, string> = {
  this_month: 'This month',
  last_month: 'Last month',
  this_quarter: 'This quarter',
  ytd: 'Year to date',
  last_year: 'Last year',
  all_time: 'All time',
  custom: 'Custom range',
}

export function rangeForPreset(preset: PresetKey): { from: string | null; to: string | null } {
  const now = new Date()
  const y = now.getFullYear()
  const m = now.getMonth()

  switch (preset) {
    case 'this_month':
      return { from: toStr(new Date(y, m, 1)), to: toStr(new Date(y, m + 1, 0)) }
    case 'last_month':
      return { from: toStr(new Date(y, m - 1, 1)), to: toStr(new Date(y, m, 0)) }
    case 'this_quarter': {
      const qStart = Math.floor(m / 3) * 3
      return { from: toStr(new Date(y, qStart, 1)), to: toStr(new Date(y, qStart + 3, 0)) }
    }
    case 'ytd':
      return { from: toStr(new Date(y, 0, 1)), to: toStr(now) }
    case 'last_year':
      return { from: toStr(new Date(y - 1, 0, 1)), to: toStr(new Date(y - 1, 11, 31)) }
    case 'all_time':
      return { from: null, to: null }
    case 'custom':
    default:
      return { from: toStr(new Date(y, m, 1)), to: toStr(now) }
  }
}
