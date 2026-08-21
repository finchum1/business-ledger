import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { motion, useInView } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { panel } from '../lib/landingTheme'
import {
  BrassScrews,
  Jack,
  Lamp,
  PatchCable,
  PlateLabel,
  ScreenshotWindow,
  TickerTotal,
  panelSurface,
} from '../components/landing/primitives'

function ChevronDown({ color }: { color: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
    </svg>
  )
}

const SAMPLE_BUSINESSES = [
  { name: 'Riverside Landscaping', income: 6400, expenses: 2150 },
  { name: 'Northgate Consulting', income: 8900, expenses: 1600 },
  { name: 'Blue Harbor Coffee Co.', income: 4300, expenses: 3120 },
]
const SAMPLE_NET = SAMPLE_BUSINESSES.reduce((s, b) => s + (b.income - b.expenses), 0)

const FEATURES = [
  {
    label: 'MULTI-BUSINESS',
    title: 'Every business, one ledger',
    body: 'Add, rename, or deactivate a business right from the app — no separate account, no code change, no per-entity setup. Every transaction just gets tagged to one.',
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
          ...panelSurface([panel.bgRaised2, panel.bgDeep], 160),
          boxShadow: 'inset 0 0 0 1px rgba(184,147,90,0.45)',
        }}
      >
        <div className="w-2 h-2 rounded-full" style={{ background: panel.amber, boxShadow: `0 0 8px ${panel.amber}` }} />
      </div>
      <span
        className="font-semibold tracking-wide text-lg"
        style={{ color: panel.cream, fontFamily: "'Big Shoulders Display', sans-serif" }}
      >
        Business Ledger
      </span>
    </div>
  )
}

function SignInPanel() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) setError(error.message)
  }

  return (
    <div
      className="relative max-w-md mx-auto rounded-xl p-6 sm:p-8"
      style={{
        ...panelSurface([panel.bgRaised, panel.bgDeep], 165),
        boxShadow: 'inset 0 0 0 1px rgba(184,147,90,0.35), 0 20px 50px rgba(0,0,0,0.55)',
      }}
    >
      <BrassScrews />
      <div className="flex items-center justify-between gap-3 mb-6">
        <h2
          className="text-3xl font-bold tracking-tight"
          style={{ color: panel.cream, fontFamily: "'Big Shoulders Display', sans-serif" }}
        >
          Sign in
        </h2>
        <div className="flex items-center gap-2 shrink-0">
          <Lamp active color={panel.amber} size={8} />
          <PlateLabel>Operator Access</PlateLabel>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <label className="block text-xs mb-1" style={{ color: panel.creamDim }}>
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
            background: panel.bgDeep,
            color: panel.cream,
            boxShadow: `inset 0 0 0 1px ${panel.hairline}`,
          }}
        />
        <label className="block text-xs mb-1" style={{ color: panel.creamDim }}>
          Password
        </label>
        <input
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 rounded-lg px-3 py-2.5 text-sm focus:outline-none"
          style={{
            background: panel.bgDeep,
            color: panel.cream,
            boxShadow: `inset 0 0 0 1px ${panel.hairline}`,
          }}
        />
        {error && (
          <p className="text-sm mb-4" style={{ color: panel.expense }} role="alert">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg py-2.5 font-medium text-sm transition disabled:opacity-60"
          style={{ background: panel.income, color: panel.bgDeep }}
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}

export function Landing() {
  const [isolated, setIsolated] = useState<number | null>(null)

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div style={{ background: panel.bgDeep, color: panel.cream, fontFamily: "'Big Shoulders Text', sans-serif" }}>
      {/* Nav */}
      <header className="sticky top-0 z-20 backdrop-blur" style={{ background: `${panel.bgDeep}dd`, borderBottom: `1px solid ${panel.hairline}` }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-4 flex items-center justify-between">
          <Nameplate />
          <button
            onClick={() => scrollTo('signin')}
            className="text-sm font-medium px-4 py-2 rounded-lg transition"
            style={{ background: panel.income, color: panel.bgDeep }}
          >
            Sign In
          </button>
        </div>
      </header>

      {/* Hero -- a single centered nameplate is the entire first viewport;
          the switchboard demo lives in the Mechanism section below so the
          two aren't showing the same thing back to back. */}
      <section
        className="relative overflow-hidden flex items-center justify-center px-5 sm:px-8 py-24 sm:py-32 min-h-[85vh]"
        style={panelSurface([panel.bgRaised2, panel.bgDeep], 150)}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 60% 45% at 60% 15%, rgba(184,147,90,0.10), transparent), radial-gradient(ellipse 55% 45% at 25% 90%, rgba(62,207,142,0.07), transparent)',
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative max-w-3xl w-full rounded-lg p-8 sm:p-12 text-center"
          style={{
            ...panelSurface([panel.bgRaised, panel.bgDeep], 165),
            boxShadow: 'inset 0 0 0 1px rgba(184,147,90,0.4), 0 20px 45px rgba(0,0,0,0.55)',
          }}
        >
          <BrassScrews />
          <h1
            className="text-5xl sm:text-6xl md:text-7xl font-bold leading-[0.95] mb-6 tracking-tight"
            style={{ color: panel.cream, fontFamily: "'Big Shoulders Display', sans-serif" }}
          >
            One ledger.
            <br />
            Every business.
          </h1>
          <p className="text-base sm:text-lg mb-8 max-w-xl mx-auto" style={{ color: panel.creamDim }}>
            Log income and expenses for every business you run in one place. Pull a Profit &amp;
            Loss for all of them combined — or isolate any single one instantly.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => scrollTo('signin')}
              className="px-5 py-2.5 rounded-lg font-medium text-sm transition active:scale-[0.98]"
              style={{ background: panel.income, color: panel.bgDeep }}
            >
              Sign In
            </button>
            <button
              onClick={() => scrollTo('mechanism')}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg font-medium text-sm transition"
              style={{ boxShadow: `inset 0 0 0 1px ${panel.hairline}`, color: panel.cream }}
            >
              See it work
              <ChevronDown color={panel.cream} />
            </button>
          </div>
        </motion.div>
      </section>

      {/* Mechanism */}
      <Section id="mechanism" className="px-5 sm:px-8 py-20 sm:py-28" >
        <div className="max-w-4xl mx-auto text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: panel.cream, fontFamily: "'Big Shoulders Display', sans-serif" }}>
            Combine everything, or isolate one.
          </h2>
          <p className="text-base max-w-xl mx-auto" style={{ color: panel.creamDim }}>
            Click a business below. The others unplug, and the panel reads just that one — click it
            again to bring everyone back into the combined total.
          </p>
        </div>

        <div className="relative w-full max-w-xl mx-auto" style={{ aspectRatio: '4 / 2.5' }}>
          {[15, 50, 85].map((x, i) => (
            <PatchCable
              key={i}
              from={{ x, y: 12 }}
              to={{ x: 50, y: 82 }}
              color={isolated === null || isolated === i ? panel.income : panel.wire}
              active={isolated === null || isolated === i}
              sag={22}
              delay={0}
            />
          ))}
          {SAMPLE_BUSINESSES.map((b, i) => (
            <button
              key={i}
              onClick={() => setIsolated(isolated === i ? null : i)}
              className="absolute -translate-x-1/2 cursor-pointer"
              style={{ left: `${[15, 50, 85][i]}%`, top: '2%' }}
            >
              {/* Label sits above the jack via absolute positioning rather
                  than flex order, so the jack itself never moves from the
                  spot the patch cable's "from" coordinate is tuned to. */}
              <div className="relative flex flex-col items-center">
                <span
                  className="absolute bottom-full mb-1.5 text-[9px] sm:text-[10px] whitespace-nowrap"
                  style={{ color: isolated === i ? panel.income : panel.creamDim, fontFamily: "'Space Mono', monospace" }}
                >
                  {b.name.split(' ')[0].toUpperCase()}
                </span>
                <Jack active={isolated === null || isolated === i} color={panel.income} size={26} />
              </div>
            </button>
          ))}
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2"
            style={{ left: '50%', top: '82%' }}
          >
            <Lamp active color={panel.amber} size={10} />
            <div
              className="relative rounded-lg px-4 py-2.5 sm:px-6 sm:py-3 text-center min-w-[140px]"
              style={{
                ...panelSurface([panel.bgRaised2, panel.bgDeep], 160),
                boxShadow: 'inset 0 0 0 1px rgba(184,147,90,0.4), 0 8px 20px rgba(0,0,0,0.5)',
              }}
            >
              <BrassScrews />
              <PlateLabel className="block mb-1">
                {isolated === null ? 'Combined' : SAMPLE_BUSINESSES[isolated].name.split(' ')[0]}
              </PlateLabel>
              <TickerTotal
                value={
                  isolated === null
                    ? SAMPLE_NET
                    : SAMPLE_BUSINESSES[isolated].income - SAMPLE_BUSINESSES[isolated].expenses
                }
                className="text-xl sm:text-2xl font-bold block"
                style={{ color: panel.income }}
                key={isolated ?? 'combined'}
              />
            </div>
          </div>
        </div>
      </Section>

      {/* Features -- one continuous terminal strip, not a grid of same-size
          cards: each feature is a row off a shared trunk, not its own box. */}
      <Section className="px-5 sm:px-8 py-20 sm:py-28" style={{ background: panel.bg }}>
        <div className="max-w-4xl mx-auto">
          <div className="max-w-xl mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold" style={{ color: panel.cream, fontFamily: "'Big Shoulders Display', sans-serif" }}>
              Four circuits. Everything you need weekly.
            </h2>
          </div>
          <div
            className="relative rounded-xl overflow-hidden"
            style={{ ...panelSurface([panel.bgRaised, panel.bgDeep], 165), boxShadow: `inset 0 0 0 1px ${panel.hairline}` }}
          >
            <BrassScrews />
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
                  <h3 className="text-lg font-semibold mb-1" style={{ color: panel.cream, fontFamily: "'Big Shoulders Display', sans-serif" }}>
                    {f.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: panel.creamDim }}>
                    {f.body}
                  </p>
                </div>
                <div className="flex items-center gap-2 order-2 sm:order-1 sm:w-40 sm:shrink-0">
                  <Lamp active color={panel.income} size={7} />
                  <PlateLabel>{f.label}</PlateLabel>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Screenshots */}
      <Section className="px-5 sm:px-8 py-20 sm:py-28">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-xl mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold" style={{ color: panel.cream, fontFamily: "'Big Shoulders Display', sans-serif" }}>
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
          </div>
        </div>
      </Section>

      {/* Positioning */}
      <Section className="px-5 sm:px-8 py-20 sm:py-28" style={{ background: panel.bg }}>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6" style={{ color: panel.cream, fontFamily: "'Big Shoulders Display', sans-serif" }}>
            Not daily babysitting. A weekly sit-down.
          </h2>
          <p className="text-base leading-relaxed" style={{ color: panel.creamDim }}>
            Most accounting software assumes one company at a time — separate logins, separate setups,
            separate exports to reconcile by hand. Business Ledger treats "which business" as just a
            field on the transaction. Sit down once a week, log what happened across every venture, and
            pull whatever report you need — one click for everything combined, one click for just one.
          </p>
        </div>
      </Section>

      {/* Sign in */}
      <Section id="signin" className="px-5 sm:px-8 py-20 sm:py-28">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12" style={{ color: panel.cream, fontFamily: "'Big Shoulders Display', sans-serif" }}>
          Sign in to your ledger
        </h2>
        <SignInPanel />
      </Section>

      {/* Footer */}
      <footer className="px-5 sm:px-8 py-10" style={{ borderTop: `1px solid ${panel.hairline}` }}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Nameplate />
          <p className="text-xs" style={{ color: panel.creamDim, fontFamily: "'Space Mono', monospace" }}>
            © {new Date().getFullYear()} Business Ledger
          </p>
        </div>
      </footer>
    </div>
  )
}
