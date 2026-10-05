import { RiCake3Line, RiCupLine, RiGoblet2Line, RiRestaurant2Line, RiRestaurantLine } from "@remixicon/react"

import { cn } from "@/lib/utils"

const MAP = {
  caffe: { Icon: RiCupLine, tint: "oklch(0.93 0.04 70)" },
  vino: { Icon: RiGoblet2Line, tint: "oklch(0.91 0.04 10)" },
  dolce: { Icon: RiCake3Line, tint: "oklch(0.93 0.045 55)" },
  antipasto: { Icon: RiRestaurant2Line, tint: "oklch(0.92 0.04 150)" },
  cena: { Icon: RiRestaurantLine, tint: "oklch(0.91 0.03 250)" },
} as const

const FALLBACK = { bar: MAP.vino, cucina: MAP.antipasto, esperienza: MAP.cena } as const

export function PrizeArt({ id, image, category, className, locked }: { id: string; image?: string; category?: keyof typeof FALLBACK; className?: string; locked?: boolean }) {
  if (image)
    return <img src={image} alt="" loading="lazy" decoding="async" className={cn("size-14 shrink-0 rounded-2xl object-cover transition-[filter]", locked && "grayscale-[0.6]", className)} />
  const { Icon, tint } = MAP[id as keyof typeof MAP] ?? FALLBACK[category ?? "bar"]
  return (
    <div
      aria-hidden
      className={cn("flex size-14 shrink-0 items-center justify-center rounded-2xl text-stone-800 transition-[filter] dark:brightness-90", locked && "grayscale-[0.6]", className)}
      style={{ background: tint }}
    >
      <Icon className="size-[45%]" />
    </div>
  )
}
