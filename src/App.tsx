import { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import type { Session } from '@supabase/supabase-js'
import { supabase } from './lib/supabase'
import { Landing } from './pages/Landing'
import { Sidebar } from './components/Sidebar'
import { HomePage } from './pages/HomePage'
import { LedgerPage } from './pages/LedgerPage'
import { ReportsPage } from './pages/ReportsPage'
import { SettingsPage } from './pages/SettingsPage'
import { SalesPage } from './pages/SalesPage'
import { ContractorsPage } from './pages/ContractorsPage'
import { CustomersPage } from './pages/CustomersPage'
import { BankingPage } from './pages/BankingPage'
import { hasBankingAccess } from './lib/betaAccess'

function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setChecked(true)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  if (!checked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 text-sm">
        Loading…
      </div>
    )
  }

  if (!session) {
    return <Landing />
  }

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar session={session} />
      <main className="min-w-0 flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/ledger" element={<LedgerPage />} />
          <Route path="/contractors" element={<ContractorsPage />} />
          <Route path="/sales" element={<SalesPage />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route
            path="/banking"
            element={hasBankingAccess(session.user.email) ? <BankingPage /> : <Navigate to="/" replace />}
          />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/invoices" element={<Navigate to="/sales" replace />} />
          <Route path="/businesses" element={<Navigate to="/settings" replace />} />
          <Route path="/categories" element={<Navigate to="/settings" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
