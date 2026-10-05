import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Signature move: il saldo punti scorre come un contatore meccanico
 * quando cambia (visita registrata, premio riscattato).
 */
function useReducedMotion() {
  const [reduced, setReduced] = React.useState(() => typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches)
  React.useEffect(() => {
    const mq = matchMedia("(prefers-reduced-motion: reduce)")
    const on = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener("change", on)
    return () => mq.removeEventListener("change", on)
  }, [])
  return reduced
}

export function PointsOdometer({ value, className, label = "punti" }: { value: number; className?: string; label?: string }) {
  const reduced = useReducedMotion()
  const chars = value.toLocaleString("it-IT").split("")
  // Riduci movimento: niente rullo, il nuovo saldo compare con una dissolvenza.
  if (reduced)
    return (
      <span className={cn("inline-flex items-baseline font-heading font-extrabold tabular leading-none tracking-[-0.03em]", className)}>
        <span key={value} data-motion="fade" aria-live="polite">
          {value.toLocaleString("it-IT")}
          <span className="sr-only"> {label}</span>
        </span>
      </span>
    )
  return (
    <span className={cn("inline-flex items-baseline font-heading font-extrabold tabular leading-none tracking-[-0.03em]", className)}>
      <span className="sr-only">
        {value.toLocaleString("it-IT")} {label}
      </span>
      <span aria-hidden className="inline-flex overflow-hidden" style={{ height: "1em" }}>
        {chars.map((ch, i) => {
          const key = chars.length - i // keyed from the right so columns persist
          if (!/\d/.test(ch)) return <span key={`s${key}`}>{ch}</span>
          const d = Number(ch)
          return (
            <span key={key} className="relative inline-block w-[0.62em] text-center">
              <span
                className="absolute inset-x-0 top-0 flex flex-col transition-transform duration-[900ms] ease-(--ease-out-expo)"
                style={{ transform: `translateY(-${d * 10}%)` }}
              >
                {Array.from({ length: 10 }, (_, n) => (
                  <span key={n} className="block h-[1em] leading-none">
                    {n}
                  </span>
                ))}
              </span>
              <span className="invisible">0</span>
            </span>
          )
        })}
      </span>
    </span>
  )
}
