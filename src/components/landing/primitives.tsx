import { useEffect, useState } from 'react'
import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { panel } from '../../lib/landingTheme'
import panelTextureUrl from '../../assets/landing/panel-texture.jpg'
import brassScrewUrl from '../../assets/landing/brass-screw.png'
import jackSocketUrl from '../../assets/landing/jack-socket.png'

function hexToRgba(hex: string, alpha: number) {
  const n = parseInt(hex.replace('#', ''), 16)
  const r = (n >> 16) & 255
  const g = (n >> 8) & 255
  const b = n & 255
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

/**
 * Real photographed bakelite/gunmetal texture layered under a color-tint
 * gradient (semi-transparent, so the grain/scratches show through) -- every
 * panel surface on the page uses this instead of a flat CSS gradient.
 */
export function panelSurface(tint: [string, string] = [panel.bgRaised2, panel.bgDeep], angle = 160) {
  return {
    backgroundImage: `linear-gradient(${angle}deg, ${hexToRgba(tint[0], 0.86)}, ${hexToRgba(tint[1], 0.93)}), url(${panelTextureUrl})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }
}

/** An engraved brass-plate label, the panel's caption grammar throughout. */
export function PlateLabel({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={`inline-block font-medium tracking-[0.18em] uppercase text-[11px] ${className}`}
      style={{ color: panel.brass, fontFamily: "'IBM Plex Sans', sans-serif" }}
    >
      {children}
    </span>
  )
}

/** Four real brass screws (photographed macro asset), used on every panel/insert. */
export function BrassScrews() {
  const positions = [
    { top: 6, left: 6 },
    { top: 6, right: 6 },
    { bottom: 6, left: 6 },
    { bottom: 6, right: 6 },
  ]
  return (
    <>
      {positions.map((pos, i) => (
        <img
          key={i}
          src={brassScrewUrl}
          alt=""
          aria-hidden
          className="absolute w-3.5 h-3.5 rounded-full object-cover pointer-events-none select-none"
          style={{ ...pos, boxShadow: '0 1px 2px rgba(0,0,0,0.7)' }}
          draggable={false}
        />
      ))}
    </>
  )
}

/** A round lamp indicator -- dark when idle, warm amber glow when active. */
export function Lamp({ active, color = panel.amber, size = 8 }: { active: boolean; color?: string; size?: number }) {
  return (
    <motion.div
      className="rounded-full"
      style={{ width: size, height: size, background: active ? color : '#3a2f1e' }}
      animate={{
        boxShadow: active ? `0 0 ${size * 1.6}px ${size * 0.5}px ${color}66, 0 0 ${size * 0.5}px ${color}` : '0 0 0px rgba(0,0,0,0)',
      }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    />
  )
}

/** A single jack socket -- the physical object each business plugs into. */
export function Jack({
  label,
  active,
  color = panel.brass,
  size = 30,
}: {
  label?: string
  active: boolean
  color?: string
  size?: number
}) {
  const [justSeated, setJustSeated] = useState(false)
  const wasActive = useRef(active)
  useEffect(() => {
    if (active && !wasActive.current) {
      setJustSeated(true)
      const t = setTimeout(() => setJustSeated(false), 550)
      wasActive.current = true
      return () => clearTimeout(t)
    }
    wasActive.current = active
  }, [active])

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Real photographed jack-socket metal (fixed material, doesn't
            change with state) -- the active-state color lives entirely in
            the glow ring layered on top, matching how a real jack's own
            metal never changes color while a separate lamp signals state. */}
        <img
          src={jackSocketUrl}
          alt=""
          aria-hidden
          draggable={false}
          className="absolute inset-0 w-full h-full rounded-full object-cover pointer-events-none select-none"
          style={{ filter: active ? 'none' : 'brightness(0.6) saturate(0.7)', transition: 'filter 0.45s ease' }}
        />
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            boxShadow: active
              ? `inset 0 0 0 2px ${color}aa, inset 0 0 ${size * 0.3}px ${color}55, 0 0 ${size * 0.45}px ${color}55`
              : 'inset 0 0 0 1px rgba(0,0,0,0.4)',
            transition: 'box-shadow 0.45s ease',
          }}
        />
        {justSeated && (
          <motion.div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{ boxShadow: `0 0 0 2px ${color}` }}
            initial={{ opacity: 0.9, scale: 1 }}
            animate={{ opacity: 0, scale: 1.7 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
          />
        )}
      </div>
      {label && <PlateLabel>{label}</PlateLabel>}
    </div>
  )
}

/**
 * An animated patch cable drawn in percentage-space (0-100 on both axes) so
 * it stays in sync with sibling jacks positioned by percentage in the same
 * box, at any width -- swings in and "clicks" via a spring, per the
 * direction contract's mechanical, damped motion.
 */
export function PatchCable({
  from,
  to,
  color,
  delay = 0,
  active = true,
  sag = 28,
}: {
  from: { x: number; y: number }
  to: { x: number; y: number }
  color: string
  delay?: number
  active?: boolean
  sag?: number
}) {
  const ref = useRef<SVGSVGElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.4 })
  const midY = Math.max(from.y, to.y) + sag
  const path = `M ${from.x} ${from.y} C ${from.x} ${midY}, ${to.x} ${midY}, ${to.x} ${to.y}`

  return (
    <svg
      ref={ref}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="absolute inset-0 w-full h-full overflow-visible pointer-events-none"
    >
      <motion.path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={inView && active ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 90, damping: 15, delay }}
      />
      {/* Plug ferrule -- a filled brass cap right where the cable meets the
          jack, reading as a real connector tip rather than a wire that
          dissolves into the socket. A small ellipse (not a circle) on
          purpose: the SVG's non-uniform preserveAspectRatio="none" scaling
          would distort a true circle anyway, so this matches that stretch
          instead of fighting it, and is sized to stay visible at any
          container aspect ratio. */}
      <motion.ellipse
        cx={to.x}
        cy={Math.max(from.y, to.y) - 16}
        rx={1.8}
        ry={1.8}
        fill={panel.brassBright}
        stroke={panel.ink}
        strokeWidth={1}
        vectorEffect="non-scaling-stroke"
        initial={{ opacity: 0, scale: 0.4 }}
        animate={inView && active ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.4 }}
        transition={{ duration: 0.25, delay: delay + 0.4, ease: 'backOut' }}
        style={{ transformOrigin: `${to.x}px ${to.y}px` }}
      />
    </svg>
  )
}

/**
 * A ticking numeric total -- climbs digit-by-digit like an adding machine
 * rather than a smooth linear count, per the direction contract.
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
    <span className={className} style={{ fontFamily: "'IBM Plex Mono', monospace", ...style }}>
      {prefix}
      {display.toLocaleString()}
    </span>
  )
}

/**
 * A CRT/meter-style readout window mounted into the panel -- houses the real
 * app screenshots so they read as instruments built into the switchboard,
 * not floating browser chrome.
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
        ...panelSurface(),
        boxShadow: '0 12px 30px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.03)',
      }}
    >
      <BrassScrews />
      <div
        className="relative overflow-hidden rounded"
        style={{ boxShadow: 'inset 0 0 0 1px rgba(138,106,53,0.35), inset 0 2px 12px rgba(0,0,0,0.7)' }}
      >
        <img src={src} alt={alt} className="w-full h-auto block" loading="lazy" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.05), transparent 40%)' }}
        />
      </div>
      <div className="mt-2.5 flex items-center gap-2">
        <Lamp active color={panel.income} size={6} />
        <PlateLabel>{label}</PlateLabel>
      </div>
    </motion.div>
  )
}

/** Animated count-up used for small stat readouts (jack counts, etc). */
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
