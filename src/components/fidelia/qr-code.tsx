import * as React from "react"

import { qrPath } from "@/lib/qr"
import { cn } from "@/lib/utils"

export function QrCode({ value, label, className }: { value: string; label: string; className?: string }) {
  const { d, size } = React.useMemo(() => qrPath(value), [value])
  return (
    <svg
      role="img"
      aria-label={label}
      viewBox={`-2 -2 ${size + 4} ${size + 4}`}
      shapeRendering="crispEdges"
      className={cn("size-full rounded-2xl bg-white text-stone-950", className)}
    >
      <path key={value} d={d} fill="currentColor" className="animate-[qr-in_0.6s_var(--ease-out-expo)_both]" />
      <style>{`@keyframes qr-in{from{opacity:.15;filter:blur(3px)}to{opacity:1;filter:none}}`}</style>
    </svg>
  )
}
