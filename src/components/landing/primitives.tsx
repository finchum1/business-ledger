import { useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { panel } from '../../lib/landingTheme'

/**
 * A small tracked uppercase utility label -- kept quiet and small, matching
 * how Mercury/Ramp/Brex use micro-labels (a plain caption, never a
 * decorative plate or foil-stamped mark, unlike the two prior worlds).
 */
export function Tag({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-block font-medium tracking-[0.12em] uppercase text-[11px] ${className}`} style={{ color: panel.inkDim }}>
      {children}
    </span>
  )
}

/**
 * A realistic browser-window frame around a real app screenshot -- the
 * signature device of this canon (Ramp, Mercury, Brex all show the actual
 * product in a browser chrome mockup, not a decorative panel/mat). Traffic-
 * light dots and a thin address-bar strip, nothing else drawn.
 */
export function BrowserFrame({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={`overflow-hidden rounded-xl ${className}`}
      style={{ background: panel.bgRaised, boxShadow: `0 0 0 1px ${panel.border}, 0 40px 80px -20px rgba(0,0,0,0.6)` }}
    >
      <div className="flex items-center gap-1.5 px-4 py-3" style={{ borderBottom: `1px solid ${panel.border}` }}>
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: panel.borderStrong }} />
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: panel.borderStrong }} />
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: panel.borderStrong }} />
      </div>
      {children}
    </div>
  )
}

/** A plain bordered card -- the one container shape in this world, no material texture, no ornament. */
export function Card({
  children,
  className = '',
  style,
}: {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <div
      className={`rounded-xl ${className}`}
      style={{ background: panel.bgRaised, boxShadow: `0 0 0 1px ${panel.border}`, ...style }}
    >
      {children}
    </div>
  )
}

/**
 * A small filled/outline dot marking a row's selected state -- the plain
 * SaaS equivalent of a checkbox, standing in for the prior worlds' jack and
 * ink-stamp devices.
 */
export function RowDot({ active }: { active: boolean }) {
  return (
    <motion.span
      className="inline-flex items-center justify-center rounded-full shrink-0"
      style={{ width: 18, height: 18, boxShadow: `inset 0 0 0 1.5px ${active ? panel.gold : panel.border}` }}
      animate={{ background: active ? panel.gold : 'transparent' }}
      transition={{ duration: 0.2 }}
    >
      {active && (
        <motion.svg width="10" height="10" viewBox="0 0 16 16" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }}>
          <path d="M3 8l3.5 3.5L13 4.5" fill="none" stroke={panel.bgDeep} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
        </motion.svg>
      )}
    </motion.span>
  )
}

/**
 * A ticking numeric total, digit-climbing rather than a linear count --
 * set in the page's own sans (tabular figures via CSS), not a separate
 * mono costume, matching how this canon shows numbers in one type voice.
 */
export function TickerTotal({
  value,
  prefix = '$',
  className = '',
  active = true,
  style,
}: {
  value: number
  prefix?: string
  className?: string
  active?: boolean
  style?: React.CSSProperties
}) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!active) {
      setDisplay(0)
      return
    }
    let raf: number
    const start = performance.now()
    const duration = 700
    function tick(now: number) {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setDisplay(Math.round(eased * value))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [value, active])

  return (
    <span className={className} style={{ fontVariantNumeric: 'tabular-nums', ...style }}>
      {prefix}
      {display.toLocaleString()}
    </span>
  )
}

/** A real app screenshot mounted in a BrowserFrame, with a small caption below. */
export function ScreenshotWindow({
  src,
  alt,
  label,
}: {
  src: string
  alt: string
  label: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <BrowserFrame>
        <img src={src} alt={alt} className="w-full h-auto block" loading="lazy" />
      </BrowserFrame>
      <div className="mt-3 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: panel.income }} />
        <Tag>{label}</Tag>
      </div>
    </motion.div>
  )
}
