import { useCallback, useEffect, useState } from 'react'
import { supabase } from './supabase'
import type { BankAccount } from './types'

export function useBankAccounts() {
  const [accounts, setAccounts] = useState<BankAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('bank_accounts')
        .select('*')
        .order('name', { ascending: true })
      if (error) throw error
      setAccounts(data as BankAccount[])
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load bank accounts.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { accounts, loading, error, refetch }
}
