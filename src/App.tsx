import { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import type { Session } from '@supabase/supabase-js'
import { supabase } from './lib/supabase'
import { Login } from './components/Login'
import { Header } from './components/Header'
import { LedgerPage } from './pages/LedgerPage'
import { ReportsPage } from './pages/ReportsPage'
import { BusinessesPage } from './pages/BusinessesPage'
import { CategoriesPage } from './pages/CategoriesPage'

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
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0f1117] text-slate-500 dark:text-slate-400 text-sm">
        Loading…
      </div>
    )
  }

  if (!session) {
    return <Login />
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f1117]">
      <Header session={session} />
      <Routes>
        <Route path="/" element={<LedgerPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/businesses" element={<BusinessesPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App
