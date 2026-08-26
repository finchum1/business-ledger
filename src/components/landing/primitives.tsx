import { useEffect, useState } from 'react'
import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { panel } from '../../lib/landingTheme'
import leatherTextureUrl from '../../assets/landing/leather-texture.jpg'
import ledgerPaperTextureUrl from '../../assets/landing/ledger-paper-texture.jpg'

function hexToRgba(hex: string, alpha: number) {
  const n = parseInt(hex.replace('#', ''), 16)
  const r = (n >> 16) & 255
  const g = (n >> 8) & 255
  const b = n & 255
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

/**
 * Real photographed deep bottle-green leather, layered under a color-tint
 * gradient -- every dark ground on the page (nav, hero, section backgrounds)
 * uses this instead of a flat CSS gradient.
 */
export function leatherSurface(angle = 160) {
  return {
    backgroundImage: `linear-gradient(${angle}deg, ${hexToRgba(panel.bg, 0.75)}, ${hexToRgba(panel.bgDeep, 0.88)}), url(${leatherTextureUrl})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }
}

/**
 * Real photographed cream ledger-paper grain, layered under a color-tint
 * gradient -- every light inset (sign-in card, feature strip, screenshot
 * mats) uses this instead of a flat CSS fill.
 */
export function paperSurface(angle = 160) {
  return {
    backgroundImage: `linear-gradient(${angle}deg, ${hexToRgba(panel.bgRaised, 0.9)}, ${hexToRgba(panel.bgRaised2, 0.94)}), url(${ledgerPaperTextureUrl})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }
}

/**
 * A small tracked uppercase utility label -- the panel's caption grammar
 * throughout. A faint two-tone text-shadow on the gold `dark` variant
 * suggests a foil-stamped impression (a lifted highlight above, a pressed
 * shadow below) rather than flat printed color.
 */
export function PlateLabel({ children, className = '', dark = false }: { children: React.ReactNode; className?: string; dark?: boolean }) {
  return (
    <span
      className={`inline-block font-medium tracking-[0.16em] uppercase text-[11px] ${className}`}
      style={{
        color: dark ? panel.brass : panel.inkDim,
        fontFamily: "'Work Sans', sans-serif",
        textShadow: dark ? `0 1px 0 ${hexToRgba(panel.bgRaised, 0.5)}, 0 -0.5px 0 rgba(0,0,0,0.2)` : undefined,
      }}
    >
      {children}
    </span>
  )
}

/**
 * A single corner's gold-foil tooling bracket -- two ruled lines meeting at
 * a small scrollwork curl, drawn as authored SVG (a flat, countable
 * ornament, not a photographed object) rather than a raster asset, so it
 * stays crisp at any size instead of a shrunk photo reading as a dot.
 */
function CornerGlyph() {
  return (
    <svg viewBox="0 0 32 32" width={22} height={22} fill="none">
      <path d="M5 17 V8.5 Q5 5 8.5 5 H17" stroke={panel.brass} strokeWidth={1.1} strokeLinecap="round" />
      <path d="M9 21 V12.5 Q9 9 12.5 9 H21" stroke={panel.brass} strokeWidth={0.7} strokeLinecap="round" opacity={0.75} />
      <circle cx={5} cy={5} r={1.6} fill={panel.brass} />
    </svg>
  )
}

/** Four gold-foil corner tooling brackets, used on every card/panel. */
export function GoldCorners() {
  const corners = [
    { style: { top: 6, left: 6 } },
    { style: { top: 6, right: 6, transform: 'scaleX(-1)' } },
    { style: { bottom: 6, left: 6, transform: 'scaleY(-1)' } },
    { style: { bottom: 6, right: 6, transform: 'scale(-1,-1)' } },
  ]
  return (
    <>
      {corners.map((c, i) => (
        <div key={i} className="absolute pointer-events-none select-none opacity-80" style={c.style}>
          <CornerGlyph />
        </div>
      ))}
    </>
  )
}

/**
 * A slim gilt page-edge -- a thin gold-to-transparent gradient sliver along
 * a card's right edge, standing in for the gilded edge of a stack of ledger
 * pages seen side-on. Composed into a card's own boxShadow chain.
 */
export const giltEdgeShadow = `inset -3px 0 0 ${hexToRgba(panel.brass, 0.55)}, inset -5px 0 0 ${hexToRgba(panel.brass, 0.22)}`

/**
 * A ledger ink/gold stamp -- the mark a business row gets when selected,
 * standing in for the old world's jack socket. Drawn as authored SVG (a
 * flat, countable seal shape, not a photographed material) rather than a
 * new photographed asset, since this is a diagram element, not an object
 * with lighting and depth.
 */
export function LedgerStamp({ active, size = 22 }: { active: boolean; size?: number }) {
  const [justStamped, setJustStamped] = useState(false)
  const wasActive = useRef(active)
  useEffect(() => {
    if (active && !wasActive.current) {
      setJustStamped(true)
      const t = setTimeout(() => setJustStamped(false), 500)
      wasActive.current = true
      return () => clearTimeout(t)
    }
    wasActive.current = active
  }, [active])

  const ticks = Array.from({ length: 16 }, (_, i) => (i / 16) * Math.PI * 2)

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <motion.svg
        viewBox="0 0 40 40"
        className="absolute inset-0 w-full h-full"
        animate={{ scale: active ? 1 : 0.94 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        {ticks.map((a, i) => (
          <line
            key={i}
            x1={20 + Math.cos(a) * 15}
            y1={20 + Math.sin(a) * 15}
            x2={20 + Math.cos(a) * 18}
            y2={20 + Math.sin(a) * 18}
            stroke={active ? panel.brass : panel.hairline}
            strokeWidth={1.4}
          />
        ))}
        <circle
          cx={20}
          cy={20}
          r={12.5}
          fill={active ? panel.brass : 'transparent'}
          stroke={active ? panel.brassBright : panel.hairline}
          strokeWidth={1.5}
          style={{ transition: 'fill 0.35s ease, stroke 0.35s ease' }}
        />
        {active && (
          <path
            d="M14 20l4 4 8-9"
            fill="none"
            stroke={panel.bgDeep}
            strokeWidth={2.4}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </motion.svg>
      {justStamped && (
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{ boxShadow: `0 0 0 2px ${panel.brass}` }}
          initial={{ opacity: 0.9, scale: 1 }}
          animate={{ opacity: 0, scale: 1.6 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      )}
    </div>
  )
}

/**
 * A ticking numeric total, set in tabular typewriter figures -- climbs
 * digit-by-digit like an adding machine rather than a smooth linear count.
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
    const duration = 900
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
    <span className={className} style={{ fontFamily: "'Courier Prime', monospace", ...style }}>
      {prefix}
      {display.toLocaleString()}
    </span>
  )
}

/**
 * A ledger-page mat housing a real app screenshot -- reads as a page bound
 * into the ledger, not floating browser chrome.
 */
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
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative rounded-lg p-2.5"
      style={{
        ...paperSurface(),
        boxShadow: `0 12px 30px rgba(0,0,0,0.35), inset 0 0 0 1px rgba(184,145,74,0.25), ${giltEdgeShadow}`,
      }}
    >
      <GoldCorners />
      <div
        className="relative overflow-hidden rounded"
        style={{ boxShadow: `inset 0 0 0 1px ${panel.hairline}, inset 0 2px 12px rgba(0,0,0,0.25)` }}
      >
        <img src={src} alt={alt} className="w-full h-auto block" loading="lazy" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.06), transparent 40%)' }}
        />
      </div>
      <div className="mt-2.5 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: panel.income }} />
        <PlateLabel>{label}</PlateLabel>
      </div>
    </motion.div>
  )
}

/** Animated count-up used for small stat readouts. */
export function useCountUp(target: number, inView: boolean) {
  const mv = useMotionValue(0)
  const spring = useSpring(mv, { stiffness: 60, damping: 20 })
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    if (inView) mv.set(target)
  }, [inView, target, mv])
  useEffect(() => {
    const unsub = spring.on('change', (v) => setDisplay(Math.round(v)))
    return unsub
  }, [spring])
  return display
}

export { useTransform }
