import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { motion, useInView } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { panel } from '../lib/landingTheme'
import { BrowserFrame, Card, RowDot, ScreenshotWindow, Tag, TickerTotal } from '../components/landing/primitives'
import { BrandMark } from '../components/BrandMark'

const SAMPLE_BUSINESSES = [
  { name: 'Riverside Landscaping', income: 6400, expenses: 2150 },
  { name: 'Northgate Consulting', income: 8900, expenses: 1600 },
  { name: 'Blue Harbor Coffee Co.', income: 4300, expenses: 3120 },
]
const SAMPLE_NET = SAMPLE_BUSINESSES.reduce((s, b) => s + (b.income - b.expenses), 0)

const FEATURES = [
  {
    label: 'GROWS WITH YOU',
    title: 'Add businesses as you grow',
    body: 'Start with one. Add a second, a fifth, a tenth whenever you need to — no separate account, no code change, no per-entity setup. Every transaction just gets tagged to one.',
  },
  {
    label: 'CATEGORIES',
    title: 'A managed list, never a wall',
    body: "Pick from your own category list for consistency, or type a one-off category on the spot. It's a suggestion list, not a schema you're locked into.",
  },
  {
    label: 'RECEIPTS',
    title: 'Drag a receipt, done',
    body: 'Drop a photo or PDF straight onto an expense. Stored privately, opened later through a short-lived link — never a public file.',
  },
  {
    label: 'CONTRACTOR & CLIENT REPORTS',
    title: 'See where the money came from — and went',
    body: 'Tag an expense with a contractor or income with a client right on the ledger, then pull a report totaling exactly what you paid each contractor or received from each client.',
  },
  {
    label: 'P&L EXPORT',
    title: 'A clean PDF, either scope',
    body: 'Export the Profit & Loss combined across every business or scoped to one — the PDF lists exactly which businesses are rolled into the number.',
  },
]

function Section({
  children,
  className = '',
  id,
  style,
}: {
  children: React.ReactNode
  className?: string
  id?: string
  style?: React.CSSProperties
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.2 })
  return (
    <motion.section
      ref={ref}
      id={id}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={className}
      style={style}
    >
      {children}
    </motion.section>
  )
}

function Wordmark() {
  return (
    <div className="flex items-center gap-2">
      <BrandMark color={panel.gold} size={26} />
      <span className="font-semibold tracking-tight text-[15px]" style={{ color: panel.ink }}>
        Sovereign Books
      </span>
    </div>
  )
}

type AuthMode = 'signin' | 'signup'

function SignInPanel({ mode, onModeChange }: { mode: AuthMode; onModeChange: (m: AuthMode) => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const isSignUp = mode === 'signup'

  function switchMode(next: AuthMode) {
    setError(null)
    setNotice(null)
    setConfirmPassword('')
    onModeChange(next)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setNotice(null)

    if (isSignUp && password !== confirmPassword) {
      setError("Passwords don't match.")
      return
    }

    setLoading(true)
    if (isSignUp) {
      const { data, error } = await supabase.auth.signUp({ email, password })
      setLoading(false)
      if (error) {
        setError(error.message)
      } else if (!data.session) {
        // Email confirmation is on for this project -- no session yet.
        setNotice('Check your email to confirm your account, then sign in.')
      }
      // If a session came back immediately, the app-level auth listener
      // picks it up and routes straight into the app -- nothing else to do.
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      setLoading(false)
      if (error) setError(error.message)
    }
  }

  return (
    <Card className="relative max-w-md mx-auto p-6 sm:p-8" style={{ boxShadow: `0 0 0 1px ${panel.border}, 0 30px 60px -20px rgba(0,0,0,0.6)` }}>
      <div className="flex items-center justify-between gap-3 mb-6">
        <h2 className="text-2xl font-semibold tracking-tight" style={{ color: panel.ink }}>
          {isSignUp ? 'Create your account' : 'Sign in'}
        </h2>
        <Tag>{isSignUp ? 'New account' : 'Welcome back'}</Tag>
      </div>
      <form onSubmit={handleSubmit}>
        <label className="block text-xs mb-1.5" style={{ color: panel.inkDim }}>
          Email
        </label>
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="sb-input w-full mb-4 rounded-lg px-3 py-2.5 text-sm focus:outline-none"
          style={{ background: panel.bgRaised2, color: panel.ink, caretColor: panel.gold }}
        />
        <label className="block text-xs mb-1.5" style={{ color: panel.inkDim }}>
          Password
        </label>
        <input
          type="password"
          required
          autoComplete={isSignUp ? 'new-password' : 'current-password'}
          minLength={isSignUp ? 8 : undefined}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`sb-input w-full rounded-lg px-3 py-2.5 text-sm focus:outline-none ${isSignUp ? 'mb-4' : 'mb-6'}`}
          style={{ background: panel.bgRaised2, color: panel.ink, caretColor: panel.gold }}
        />
        {isSignUp && (
          <>
            <label className="block text-xs mb-1.5" style={{ color: panel.inkDim }}>
              Confirm password
            </label>
            <input
              type="password"
              required
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="sb-input w-full mb-6 rounded-lg px-3 py-2.5 text-sm focus:outline-none"
              style={{ background: panel.bgRaised2, color: panel.ink, caretColor: panel.gold }}
            />
          </>
        )}
        {error && (
          <p className="text-sm mb-4" style={{ color: panel.expense }} role="alert">
            {error}
          </p>
        )}
        {notice && (
          <p className="text-sm mb-4" style={{ color: panel.income }} role="status">
            {notice}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg py-2.5 font-medium text-sm transition hover:brightness-110 active:scale-[0.98] disabled:opacity-60 disabled:hover:brightness-100"
          style={{ background: panel.gold, color: panel.bgDeep }}
        >
          {loading ? (isSignUp ? 'Creating account…' : 'Signing in…') : isSignUp ? 'Create account' : 'Sign in'}
        </button>
      </form>
      <p className="text-xs text-center mt-4" style={{ color: panel.inkDim }}>
        {isSignUp ? (
          <>
            Already have an account?{' '}
            <button type="button" onClick={() => switchMode('signin')} className="underline transition hover:opacity-75" style={{ color: panel.gold }}>
              Sign in
            </button>
          </>
        ) : (
          <>
            New here?{' '}
            <button type="button" onClick={() => switchMode('signup')} className="underline transition hover:opacity-75" style={{ color: panel.gold }}>
              Create an account
            </button>
          </>
        )}
      </p>
    </Card>
  )
}

export function Landing() {
  const [isolated, setIsolated] = useState<number | null>(null)
  const [authMode, setAuthMode] = useState<AuthMode>('signup')

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function goToAuth(mode: AuthMode) {
    setAuthMode(mode)
    scrollTo('signin')
  }

  return (
    <div className="relative" style={{ background: panel.bgDeep, color: panel.ink, fontFamily: "'Hanken Grotesk', sans-serif" }}>
      <div className="sb-grain" aria-hidden />
      {/* Nav */}
      <header className="sticky top-0 z-20 backdrop-blur" style={{ background: `${panel.bgDeep}e6`, borderBottom: `1px solid ${panel.border}` }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-4 flex items-center justify-between">
          <Wordmark />
          <div className="flex items-center gap-2">
            <button
              onClick={() => goToAuth('signin')}
              className="text-sm font-medium px-4 py-2 rounded-lg transition hover:bg-white/5 active:scale-[0.98]"
              style={{ color: panel.ink }}
            >
              Sign In
            </button>
            <button
              onClick={() => goToAuth('signup')}
              className="text-sm font-medium px-4 py-2 rounded-lg transition hover:brightness-110 active:scale-[0.98]"
              style={{ background: panel.gold, color: panel.bgDeep }}
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden px-5 sm:px-8 pt-16 sm:pt-24 pb-16 sm:pb-24">
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 55% 40% at 50% 0%, rgba(203,176,120,0.08), transparent)' }}
        />
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative max-w-2xl mx-auto text-center mb-12 sm:mb-16"
        >
          <h1 className="text-4xl sm:text-5xl md:text-[3.4rem] font-semibold leading-[1.05] mb-5 tracking-tight" style={{ color: panel.ink }}>
            One ledger — for every business you run.
          </h1>
          <p className="text-base sm:text-lg mb-8 max-w-xl mx-auto" style={{ color: panel.inkDim }}>
            Log income and expenses, track who paid you and who got paid, and pull a clean Profit
            &amp; Loss — for one business today, or every business you add later, all in the same
            ledger.
          </p>
          <button
            onClick={() => goToAuth('signup')}
            className="px-5 py-2.5 rounded-lg font-medium text-sm transition hover:brightness-110 active:scale-[0.98]"
            style={{ background: panel.gold, color: panel.bgDeep }}
          >
            Get Started
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="relative max-w-4xl mx-auto"
        >
          <BrowserFrame>
            <img
              src="/landing/screenshot-ledger.png"
              alt="The Sovereign Books ledger, showing recent transactions across several businesses"
              className="w-full h-auto block"
            />
          </BrowserFrame>
        </motion.div>
      </section>

      {/* Mechanism */}
      <Section id="mechanism" className="px-5 sm:px-8 py-20 sm:py-28" style={{ background: panel.bg }}>
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-semibold mb-4 tracking-tight" style={{ color: panel.ink }}>
            Combine everything, or isolate one.
          </h2>
          <p className="text-base max-w-lg mx-auto" style={{ color: panel.inkDim }}>
            Select a business below to isolate it — select it again to bring everyone back into the
            combined total.
          </p>
        </div>

        <Card className="relative max-w-xl mx-auto p-6 sm:p-8">
          <Tag className="mb-4 block">{isolated === null ? 'All businesses' : SAMPLE_BUSINESSES[isolated].name}</Tag>
          <div>
            {SAMPLE_BUSINESSES.map((b, i) => {
              const net = b.income - b.expenses
              const active = isolated === null || isolated === i
              return (
                <button
                  key={b.name}
                  onClick={() => setIsolated(isolated === i ? null : i)}
                  className="w-full flex items-center gap-3 py-3.5 text-left cursor-pointer transition hover:bg-white/[0.04]"
                  style={{ borderTop: i > 0 ? `1px solid ${panel.border}` : undefined }}
                >
                  <RowDot active={isolated === i} />
                  <span className="flex-1 text-sm sm:text-base" style={{ color: active ? panel.ink : panel.inkDim }}>
                    {b.name}
                  </span>
                  <TickerTotal
                    value={net}
                    active={active}
                    className="text-sm sm:text-base font-medium shrink-0"
                    style={{ color: active ? panel.income : panel.inkDim }}
                    key={`${i}-${active}`}
                  />
                </button>
              )
            })}
          </div>
          <div className="mt-2 pt-4" style={{ borderTop: `1px solid ${panel.border}` }}>
            <div className="flex items-baseline justify-between">
              <Tag>{isolated === null ? 'Combined total' : 'Isolated total'}</Tag>
              <TickerTotal
                value={isolated === null ? SAMPLE_NET : SAMPLE_BUSINESSES[isolated].income - SAMPLE_BUSINESSES[isolated].expenses}
                className="text-2xl sm:text-3xl font-semibold"
                style={{ color: panel.ink }}
                key={isolated ?? 'combined'}
              />
            </div>
          </div>
        </Card>
      </Section>

      {/* Features */}
      <Section className="px-5 sm:px-8 py-20 sm:py-28">
        <div className="max-w-4xl mx-auto">
          <div className="max-w-xl mb-10">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight" style={{ color: panel.ink }}>
              Everything you need weekly.
            </h2>
          </div>
          <Card className="overflow-hidden">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.label}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6 px-6 py-6 sm:px-8"
                style={i > 0 ? { borderTop: `1px solid ${panel.border}` } : undefined}
              >
                <div className="flex-1 order-1 sm:order-2">
                  <h3 className="text-lg font-semibold mb-1 tracking-tight" style={{ color: panel.ink }}>
                    {f.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: panel.inkDim }}>
                    {f.body}
                  </p>
                </div>
                <div className="order-2 sm:order-1 sm:w-40 sm:shrink-0">
                  <Tag>{f.label}</Tag>
                </div>
              </motion.div>
            ))}
          </Card>
        </div>
      </Section>

      {/* Screenshots */}
      <Section className="px-5 sm:px-8 py-20 sm:py-28" style={{ background: panel.bg }}>
        <div className="max-w-6xl mx-auto">
          <div className="max-w-xl mb-14">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight" style={{ color: panel.ink }}>
              This is the real thing, running.
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            <ScreenshotWindow
              src="/landing/screenshot-ledger.png"
              alt="Adding a transaction in Sovereign Books, with the receipt drop zone visible"
              label="Ledger — add transaction"
            />
            <ScreenshotWindow
              src="/landing/screenshot-reports.png"
              alt="A combined Profit and Loss report across all businesses"
              label="P&L Reports — combined"
            />
            <ScreenshotWindow
              src="/landing/screenshot-categories.png"
              alt="Managing income and expense categories"
              label="Categories — managed list"
            />
            <ScreenshotWindow
              src="/landing/screenshot-receipt.png"
              alt="Dragging a receipt onto an expense to attach it"
              label="Receipts — drag to attach"
            />
            <div className="sm:col-span-2">
              <ScreenshotWindow
                src="/landing/screenshot-client-report.png"
                alt="A Client Report showing payments received grouped by client, with totals"
                label="Client Report — money in by client"
              />
            </div>
          </div>
        </div>
      </Section>

      {/* Positioning */}
      <Section className="px-5 sm:px-8 py-20 sm:py-28">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-semibold mb-6 tracking-tight" style={{ color: panel.ink }}>
            Not daily babysitting. A weekly sit-down.
          </h2>
          <p className="text-base leading-relaxed" style={{ color: panel.inkDim }}>
            Most accounting software assumes one company at a time — separate logins, separate setups,
            separate exports to reconcile by hand. Sovereign Books treats "which business" as just a
            field on the transaction. Sit down once a week, log what happened, and pull whatever report
            you need — one click for everything combined, one click for just one, whether that's the
            only business you run or the fifth you've added.
          </p>
        </div>
      </Section>

      {/* Sign in / sign up */}
      <Section id="signin" className="px-5 sm:px-8 py-20 sm:py-28" style={{ background: panel.bg }}>
        <h2 className="text-3xl sm:text-4xl font-semibold text-center mb-12 tracking-tight" style={{ color: panel.ink }}>
          {authMode === 'signup' ? 'Get started' : 'Welcome back'}
        </h2>
        <SignInPanel mode={authMode} onModeChange={setAuthMode} />
      </Section>

      {/* Footer */}
      <footer className="px-5 sm:px-8 py-10" style={{ borderTop: `1px solid ${panel.border}` }}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Wordmark />
          <p className="text-xs" style={{ color: panel.inkDim }}>
            © {new Date().getFullYear()} Sovereign Books
          </p>
        </div>
      </footer>
    </div>
  )
}
