import * as React from "react"
import { RiCheckLine, RiGift2Fill } from "@remixicon/react"

import { PointsOdometer } from "@/components/fidelia/points-odometer"
import { cn, fmtPoints } from "@/lib/utils"
import type { Prize } from "@/types"

/** Marchio del locale: il logo se c'è, altrimenti la sigla su fondo "punti". */
export function VenueMark({ initials, logo, className }: { initials: string; logo?: string; className?: string }) {
  if (logo) return <img src={logo} alt="" className={cn("size-10 shrink-0 rounded-2xl bg-white object-cover", className)} />
  return (
    <span
      aria-hidden
      className={cn("flex size-10 shrink-0 items-center justify-center rounded-2xl bg-highlight font-heading text-sm font-bold text-highlight-foreground", className)}
    >
      {initials}
    </span>
  )
}

/**
 * Trama guilloché (come banconote e biglietti): curve epitrocoidi sovrapposte,
 * calcolate una volta sola. Dà alla tessera l'aria di un documento "vero" senza immagini.
 */
const GUILLOCHE = (() => {
  const curve = (R: number, r: number, d: number, turns: number, steps: number, cx: number, cy: number) => {
    let p = ""
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * Math.PI * 2 * turns
      const x = cx + (R + r) * Math.cos(t) - d * Math.cos(((R + r) / r) * t)
      const y = cy + (R + r) * Math.sin(t) - d * Math.sin(((R + r) / r) * t)
      p += (i ? "L" : "M") + x.toFixed(1) + " " + y.toFixed(1)
    }
    return p
  }
  return [curve(84, 12, 38, 6, 900, 160, 160), curve(66, 9, 46, 9, 900, 160, 160), curve(102, 17, 30, 17, 1400, 160, 160)]
})()

function Guilloche({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 320 320" className={cn("pointer-events-none absolute", className)} fill="none" stroke="currentColor" strokeWidth="0.6">
      {GUILLOCHE.map((d, i) => (
        <path key={i} d={d} opacity={0.9 - i * 0.2} />
      ))}
    </svg>
  )
}

/** Timbri verso il prossimo premio: 10 caselle, l'ultima è il premio. */
function Stamps({ points, next }: { points: number; next: Prize }) {
  const total = 10
  const filled = Math.min(total - 1, Math.floor((points / next.cost) * total))
  return (
    <div className="flex flex-col gap-2.5">
      <ol aria-label={`${filled} timbri su ${total}`} className="flex items-center justify-between gap-1">
        {Array.from({ length: total }, (_, i) => {
          const last = i === total - 1
          const on = i < filled
          return (
            <li
              key={i}
              aria-hidden
              className={cn(
                "flex aspect-square w-full max-w-7 items-center justify-center rounded-full transition-[background-color,transform] duration-500 ease-(--ease-out-expo)",
                on ? "bg-highlight text-highlight-foreground" : "border-[1.5px] border-dashed border-current/35",
                last && "max-w-8 border-solid border-highlight bg-white/10 text-highlight",
              )}
              style={{ transitionDelay: `${i * 40}ms` }}
            >
              {last ? <RiGift2Fill className="size-[55%]" /> : on && <RiCheckLine className="size-[60%]" />}
            </li>
          )
        })}
      </ol>
      <p className="text-xs opacity-90">
        Ancora <strong className="font-semibold">{fmtPoints(next.cost - points)} punti</strong> per {next.name}
      </p>
    </div>
  )
}

type Member = { name: string; code: string; points: number }
export type TicketVenue = { name: string; initials: string; logo?: string }

/**
 * La tessera: un biglietto con due tacche laterali e una perforazione.
 * Sopra il taglio l'identità e il saldo, sotto il taglio cosa fare adesso.
 * - `stamps` (default true): fila di timbri verso il prossimo premio, sopra ai `children`.
 * - Riflesso che segue dito/mouse (disattivato con "riduci movimento").
 * Componente puro: riceve locale, cliente e prossimo premio come props.
 */
export function TicketCard({
  venue,
  member: user,
  next,
  stamps = true,
  children,
  className,
  cut = 172,
}: {
  venue: TicketVenue
  member: Member
  next: Prize | null
  stamps?: boolean
  children?: React.ReactNode
  className?: string
  cut?: number
}) {
  const ref = React.useRef<HTMLDivElement>(null)
  const reduced = React.useRef(false)
  React.useEffect(() => {
    const mq = matchMedia("(prefers-reduced-motion: reduce)")
    reduced.current = mq.matches
    const on = (e: MediaQueryListEvent) => (reduced.current = e.matches)
    mq.addEventListener("change", on)
    return () => mq.removeEventListener("change", on)
  }, [])
  const move = (e: React.PointerEvent) => {
    const el = ref.current
    if (!el || reduced.current) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width
    const y = (e.clientY - r.top) / r.height
    el.style.setProperty("--mx", `${x * 100}%`)
    el.style.setProperty("--my", `${y * 100}%`)
    el.style.setProperty("--rx", `${(0.5 - y) * 5}deg`)
    el.style.setProperty("--ry", `${(x - 0.5) * 7}deg`)
    el.style.setProperty("--sheen", "1")
  }
  const leave = () => {
    const el = ref.current
    if (!el) return
    el.style.setProperty("--rx", "0deg")
    el.style.setProperty("--ry", "0deg")
    el.style.setProperty("--sheen", "0")
  }

  return (
    <div className={cn("[perspective:1200px]", className)}>
      <div
        ref={ref}
        onPointerMove={move}
        onPointerLeave={leave}
        onPointerUp={leave}
        onPointerCancel={leave}
        onLostPointerCapture={leave}
        className="ticket-notch relative isolate overflow-hidden rounded-[24px] bg-brand text-brand-foreground shadow-ticket transition-transform duration-300 ease-(--ease-out-expo) [transform:rotateX(var(--rx,0deg))_rotateY(var(--ry,0deg))] [transform-style:preserve-3d]"
        style={{ ["--ticket-cut" as string]: `${cut}px` }}
      >
        {/* trama di sicurezza */}
        <Guilloche className="-top-24 -right-28 -z-10 size-[340px] text-brand-foreground opacity-[0.11]" />
        {/* riflesso che segue il dito */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 opacity-[calc(var(--sheen,0)*0.55)] transition-opacity duration-300 [background:radial-gradient(circle_at_var(--mx,30%)_var(--my,0%),color-mix(in_oklch,var(--brand-foreground)_24%,transparent),transparent_45%)]"
        />

        <div className="flex flex-col justify-between gap-4 px-5 pt-5 pb-4" style={{ height: cut }}>
          <div className="flex items-center gap-3">
            <VenueMark initials={venue.initials} logo={venue.logo} />
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="truncate font-heading text-[15px] font-semibold">{venue.name}</span>
              <span className="truncate text-xs opacity-90">{user.name}</span>
            </div>
            <span className="shrink-0 rounded-lg border border-current/25 px-2 py-1 font-heading text-[11px] font-semibold tracking-[0.14em] tabular opacity-95">{user.code}</span>
          </div>
          <div className="flex items-end justify-between gap-3">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium tracking-[0.08em] uppercase opacity-90">Saldo punti</span>
              <PointsOdometer value={user.points} className="text-[56px] text-highlight" />
            </div>
            {next && !stamps && (
              <div className="mb-1 flex max-w-[48%] flex-col items-end gap-1 text-right">
                <span className="text-xs opacity-90">
                  Ti mancano <strong className="font-semibold">{fmtPoints(next.cost - user.points)}</strong> per
                </span>
                <span className="truncate text-sm font-semibold">{next.name}</span>
              </div>
            )}
          </div>
        </div>

        {/* perforazione */}
        <div aria-hidden className="mx-5 border-t-2 border-dashed border-current opacity-30" />

        <div className="flex flex-col gap-4 px-5 pt-4 pb-5">
          {stamps && (next ? <Stamps points={user.points} next={next} /> : <p className="text-sm font-medium">Hai sbloccato tutti i premi del catalogo.</p>)}
          {children}
        </div>
      </div>
    </div>
  )
}
