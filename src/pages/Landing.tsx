import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { motion, useInView } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { panel } from '../lib/landingTheme'
import {
  GoldCorners,
  giltEdgeShadow,
  LedgerStamp,
  PlateLabel,
  ScreenshotWindow,
  TickerTotal,
  leatherSurface,
  paperSurface,
} from '../components/landing/primitives'
import ledgerBookHeroUrl from '../assets/landing/ledger-book-hero.jpg'

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
    label: 'INVOICING',
    title: 'Bill clients, branded per business',
    body: 'Create an invoice under any business with its own logo and contact details on it, add line items, mark it paid — and send a clean PDF.',
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
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={className}
      style={style}
    >
      {children}
    </motion.section>
  )
}

function Nameplate() {
  return (
    <div className="flex items-center gap-2.5">
      <div
        className="w-7 h-7 rounded flex items-center justify-center shrink-0"
        style={{
          ...paperSurface(160),
          boxShadow: `inset 0 0 0 1px ${panel.hairline}`,
        }}
      >
        <div className="w-2 h-2 rounded-full" style={{ background: panel.brass, boxShadow: `0 0 8px ${panel.brass}` }} />
      </div>
      <span
        className="font-semibold tracking-wide text-lg"
        style={{ color: panel.cream, fontFamily: "'Bodoni Moda', serif" }}
      >
        Business Ledger
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
    <div
      className="relative max-w-md mx-auto rounded-xl p-6 sm:p-8"
      style={{
        ...paperSurface(165),
        boxShadow: `inset 0 0 0 1px ${panel.hairline}, 0 24px 60px rgba(0,0,0,0.45), ${giltEdgeShadow}`,
      }}
    >
      <GoldCorners />
      <div className="flex items-center justify-between gap-3 mb-6">
        <h2
          className="text-3xl font-bold tracking-tight"
          style={{ color: panel.ink, fontFamily: "'Bodoni Moda', serif" }}
        >
          {isSignUp ? 'Create your ledger' : 'Sign in'}
        </h2>
        <div className="flex items-center gap-2 shrink-0">
          <LedgerStamp active size={18} />
          <PlateLabel dark>{isSignUp ? 'New Operator' : 'Operator Access'}</PlateLabel>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <label className="block text-xs mb-1" style={{ color: panel.inkDim, fontFamily: "'Work Sans', sans-serif" }}>
          Email
        </label>
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 rounded-lg px-3 py-2.5 text-sm focus:outline-none"
          style={{
            background: panel.bgRaised2,
            color: panel.ink,
            boxShadow: `inset 0 0 0 1px ${panel.hairline}`,
          }}
        />
        <label className="block text-xs mb-1" style={{ color: panel.inkDim, fontFamily: "'Work Sans', sans-serif" }}>
          Password
        </label>
        <input
          type="password"
          required
          autoComplete={isSignUp ? 'new-password' : 'current-password'}
          minLength={isSignUp ? 8 : undefined}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`w-full rounded-lg px-3 py-2.5 text-sm focus:outline-none ${isSignUp ? 'mb-4' : 'mb-6'}`}
          style={{
            background: panel.bgRaised2,
            color: panel.ink,
            boxShadow: `inset 0 0 0 1px ${panel.hairline}`,
          }}
        />
        {isSignUp && (
          <>
            <label className="block text-xs mb-1" style={{ color: panel.inkDim, fontFamily: "'Work Sans', sans-serif" }}>
              Confirm password
            </label>
            <input
              type="password"
              required
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full mb-6 rounded-lg px-3 py-2.5 text-sm focus:outline-none"
              style={{
                background: panel.bgRaised2,
                color: panel.ink,
                boxShadow: `inset 0 0 0 1px ${panel.hairline}`,
              }}
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
          className="w-full rounded-lg py-2.5 font-medium text-sm transition disabled:opacity-60"
          style={{ background: panel.bgDeep, color: panel.cream, fontFamily: "'Work Sans', sans-serif" }}
        >
          {loading ? (isSignUp ? 'Creating account…' : 'Signing in…') : isSignUp ? 'Create account' : 'Sign in'}
        </button>
      </form>
      <p className="text-xs text-center mt-4" style={{ color: panel.inkDim, fontFamily: "'Work Sans', sans-serif" }}>
        {isSignUp ? (
          <>
            Already have a ledger?{' '}
            <button
              type="button"
              onClick={() => switchMode('signin')}
              className="underline"
              style={{ color: panel.income }}
            >
              Sign in
            </button>
          </>
        ) : (
          <>
            New here?{' '}
            <button
              type="button"
              onClick={() => switchMode('signup')}
              className="underline"
              style={{ color: panel.income }}
            >
              Create your own ledger
            </button>
          </>
        )}
      </p>
    </div>
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
    <div style={{ background: panel.bgDeep, color: panel.cream, fontFamily: "'Spectral', serif" }}>
      {/* Nav */}
      <header
        className="sticky top-0 z-20 backdrop-blur"
        style={{ background: `${panel.bgDeep}e6`, borderBottom: `1px solid ${panel.hairline}` }}
      >
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-4 flex items-center justify-between">
          <Nameplate />
          <div className="flex items-center gap-2">
            <button
              onClick={() => goToAuth('signin')}
              className="text-sm font-medium px-4 py-2 rounded-lg transition"
              style={{ color: panel.cream, boxShadow: `inset 0 0 0 1px ${panel.hairline}`, fontFamily: "'Work Sans', sans-serif" }}
            >
              Sign In
            </button>
            <button
              onClick={() => goToAuth('signup')}
              className="text-sm font-medium px-4 py-2 rounded-lg transition"
              style={{ background: panel.brass, color: panel.bgDeep, fontFamily: "'Work Sans', sans-serif" }}
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero -- the approved comp: a photographed open ledger book, centered
          and dominant, on the same deep-green ground as the nav above it. */}
      <section
        className="relative overflow-hidden flex flex-col items-center px-5 sm:px-8 pt-16 sm:pt-20 pb-12 sm:pb-16"
        style={leatherSurface(150)}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(184,145,74,0.10), transparent)',
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative max-w-2xl w-full text-center mb-10 sm:mb-12"
        >
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.05] mb-5 tracking-tight"
            style={{ color: panel.cream, fontFamily: "'Bodoni Moda', serif" }}
          >
            One ledger — for every business you run.
          </h1>
          <p className="text-base sm:text-lg mb-8 max-w-xl mx-auto" style={{ color: panel.creamDim }}>
            Log income and expenses, bill clients, and pull a clean Profit &amp; Loss — for one
            business today, or every business you add later, all in the same ledger.
          </p>
          <div className="flex items-center justify-center">
            <button
              onClick={() => goToAuth('signup')}
              className="px-5 py-2.5 rounded-lg font-medium text-sm transition active:scale-[0.98]"
              style={{ background: panel.brass, color: panel.bgDeep, fontFamily: "'Work Sans', sans-serif" }}
            >
              Get Started
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-4xl"
          style={{ aspectRatio: '5504 / 3072', containerType: 'inline-size' }}
        >
          <img
            src={ledgerBookHeroUrl}
            alt="An open ledger book with blank ruled pages, real business rows and a combined total set as live text over the left and right page"
            className="absolute inset-0 w-full h-full object-contain rounded-sm"
            style={{ boxShadow: '0 30px 70px rgba(0,0,0,0.5)' }}
          />
          {/* Real live text set over the photographed blank ruled pages --
              never baked into the generated asset, so it stays crisp and
              legible (a raster attempt at this text rendered as garbled
              lettering) and uses the same sample data as the Mechanism
              section below, so the hero reads as the real product rather
              than a decorative object next to it. Positioned in container-
              query percentage units so it stays registered to the ruled
              lines at any width. */}
          {SAMPLE_BUSINESSES.map((b, i) => (
            <div
              key={b.name}
              className="absolute"
              style={{
                left: '23%',
                width: '16.5%',
                top: `${32.6 + i * 11.2}%`,
                fontSize: '1.55cqw',
                color: panel.ink,
                fontFamily: "'Spectral', serif",
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {b.name}
            </div>
          ))}
          {SAMPLE_BUSINESSES.map((b, i) => (
            <div
              key={`${b.name}-amt`}
              className="absolute text-right"
              style={{
                left: '40%',
                width: '7.5%',
                top: `${32.6 + i * 11.2}%`,
                fontSize: '1.6cqw',
                color: panel.income,
                fontFamily: "'Courier Prime', monospace",
              }}
            >
              ${(b.income - b.expenses).toLocaleString()}
            </div>
          ))}
          <div
            className="absolute"
            style={{ left: '51%', width: '23%', top: '46%', fontFamily: "'Work Sans', sans-serif" }}
          >
            <div style={{ fontSize: '1.15cqw', letterSpacing: '0.14em', color: panel.brass, textTransform: 'uppercase' }}>
              Combined total
            </div>
            <div style={{ fontSize: '3.4cqw', color: panel.ink, fontFamily: "'Bodoni Moda', serif", fontWeight: 700, borderBottom: `0.25cqw solid ${panel.brass}`, paddingBottom: '0.4cqw' }}>
              ${SAMPLE_NET.toLocaleString()}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Mechanism -- a real ledger page: click a business row to isolate
          it, click again to return to the combined total. */}
      <Section id="mechanism" className="px-5 sm:px-8 py-20 sm:py-28" style={paperSurface(150)}>
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: panel.ink, fontFamily: "'Bodoni Moda', serif" }}>
            Combine everything, or isolate one.
          </h2>
          <p className="text-base max-w-xl mx-auto" style={{ color: panel.inkDim }}>
            Stamp a business below to isolate it — stamp it again to bring everyone back into the
            combined total.
          </p>
        </div>

        <div
          className="relative max-w-xl mx-auto rounded-lg p-6 sm:p-8"
          style={{ background: panel.bgRaised, boxShadow: `inset 0 0 0 1px ${panel.hairline}, 0 16px 40px rgba(0,0,0,0.12), ${giltEdgeShadow}` }}
        >
          <GoldCorners />
          <PlateLabel dark className="mb-4 block">
            {new Date().getFullYear()} — {isolated === null ? 'Combined' : SAMPLE_BUSINESSES[isolated].name}
          </PlateLabel>
          <div className="space-y-0">
            {SAMPLE_BUSINESSES.map((b, i) => {
              const net = b.income - b.expenses
              const active = isolated === null || isolated === i
              return (
                <button
                  key={b.name}
                  onClick={() => setIsolated(isolated === i ? null : i)}
                  className="w-full flex items-center gap-3 py-3 text-left cursor-pointer"
                  style={{ borderTop: i > 0 ? `1px solid ${panel.hairline}` : undefined }}
                >
                  <LedgerStamp active={isolated === i} size={20} />
                  <span
                    className="text-sm sm:text-base"
                    style={{ color: active ? panel.ink : panel.inkDim, fontFamily: "'Spectral', serif" }}
                  >
                    {b.name}
                  </span>
                  <span className="flex-1 border-b border-dotted mx-2 mb-1" style={{ borderColor: panel.hairline }} />
                  <TickerTotal
                    value={net}
                    active={active}
                    className="text-sm sm:text-base font-medium tabular-nums shrink-0"
                    style={{ color: active ? panel.income : panel.inkDim }}
                    key={`${i}-${active}`}
                  />
                </button>
              )
            })}
          </div>
          <div className="mt-2 pt-4" style={{ borderTop: `2px solid ${panel.brass}` }}>
            <div className="flex items-baseline justify-between">
              <PlateLabel dark>{isolated === null ? 'Grand total' : 'Total, isolated'}</PlateLabel>
              <TickerTotal
                value={isolated === null ? SAMPLE_NET : SAMPLE_BUSINESSES[isolated].income - SAMPLE_BUSINESSES[isolated].expenses}
                className="text-2xl sm:text-3xl font-bold tabular-nums"
                style={{ color: panel.ink }}
                key={isolated ?? 'combined'}
              />
            </div>
          </div>
        </div>
      </Section>

      {/* Features -- one continuous ledger-insert strip, not a grid of
          same-size cards: each feature is a row on a shared page, not its
          own box. */}
      <Section className="px-5 sm:px-8 py-20 sm:py-28" style={leatherSurface(150)}>
        <div className="max-w-4xl mx-auto">
          <div className="max-w-xl mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold" style={{ color: panel.cream, fontFamily: "'Bodoni Moda', serif" }}>
              Five entries. Everything you need weekly.
            </h2>
          </div>
          <div
            className="relative rounded-xl overflow-hidden"
            style={{ ...paperSurface(165), boxShadow: `inset 0 0 0 1px ${panel.hairline}, ${giltEdgeShadow}` }}
          >
            <GoldCorners />
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.label}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6 px-6 py-6 sm:px-8"
                style={i > 0 ? { borderTop: `1px solid ${panel.hairline}` } : undefined}
              >
                {/* Content comes first in DOM order (so the label never sits
                    above the heading, even on mobile where the row stacks);
                    sm:order-first moves the tag back to a left column on
                    wider screens where it sits beside the heading instead. */}
                <div className="flex-1 order-1 sm:order-2">
                  <h3 className="text-lg font-semibold mb-1" style={{ color: panel.ink, fontFamily: "'Bodoni Moda', serif" }}>
                    {f.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: panel.inkDim }}>
                    {f.body}
                  </p>
                </div>
                <div className="flex items-center gap-2 order-2 sm:order-1 sm:w-40 sm:shrink-0">
                  <LedgerStamp active size={16} />
                  <PlateLabel dark>{f.label}</PlateLabel>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Screenshots */}
      <Section className="px-5 sm:px-8 py-20 sm:py-28" style={paperSurface(150)}>
        <div className="max-w-6xl mx-auto">
          <div className="max-w-xl mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold" style={{ color: panel.ink, fontFamily: "'Bodoni Moda', serif" }}>
              This is the real thing, running.
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            <ScreenshotWindow
              src="/landing/screenshot-ledger.png"
              alt="Adding a transaction in Business Ledger, with the receipt drop zone visible"
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
                src="/landing/screenshot-invoice.png"
                alt="A branded invoice for one business, with line items and a paid status"
                label="Invoicing — branded per business"
              />
            </div>
          </div>
        </div>
      </Section>

      {/* Positioning */}
      <Section className="px-5 sm:px-8 py-20 sm:py-28" style={leatherSurface(150)}>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6" style={{ color: panel.cream, fontFamily: "'Bodoni Moda', serif" }}>
            Not daily babysitting. A weekly sit-down.
          </h2>
          <p className="text-base leading-relaxed" style={{ color: panel.creamDim }}>
            Most accounting software assumes one company at a time — separate logins, separate setups,
            separate exports to reconcile by hand. Business Ledger treats "which business" as just a
            field on the transaction. Sit down once a week, log what happened, and pull whatever report
            you need — one click for everything combined, one click for just one, whether that's the
            only business you run or the fifth you've added.
          </p>
        </div>
      </Section>

      {/* Sign in / sign up */}
      <Section id="signin" className="px-5 sm:px-8 py-20 sm:py-28" style={leatherSurface(150)}>
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12" style={{ color: panel.cream, fontFamily: "'Bodoni Moda', serif" }}>
          {authMode === 'signup' ? 'Start your own ledger' : 'Sign in to your ledger'}
        </h2>
        <SignInPanel mode={authMode} onModeChange={setAuthMode} />
      </Section>

      {/* Footer */}
      <footer className="px-5 sm:px-8 py-10" style={{ ...leatherSurface(150), borderTop: `1px solid ${panel.hairline}` }}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Nameplate />
          <p className="text-xs" style={{ color: panel.creamDim, fontFamily: "'Courier Prime', monospace" }}>
            © {new Date().getFullYear()} Business Ledger
          </p>
        </div>
      </footer>
    </div>
  )
}
