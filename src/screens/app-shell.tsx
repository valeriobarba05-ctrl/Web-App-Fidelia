import * as React from "react"
import {
  RiEyeLine,
  RiCalendarEventFill,
  RiCalendarEventLine,
  RiGift2Fill,
  RiGift2Line,
  RiHistoryLine,
  RiHome5Fill,
  RiHome5Line,
  RiLogoutBoxRLine,
  RiQrCodeLine,
  RiStore2Fill,
  RiStore2Line,
  RiUser3Line,
} from "@remixicon/react"

import { PointsOdometer } from "@/components/fidelia/points-odometer"
import { BrandMark } from "@/screens/parts"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { navigate, type Route } from "@/mock/router"
import { useStore } from "@/mock/store"
import { cn } from "@/lib/utils"

type NavItem = { route: Route; label: string; icon: React.ElementType; activeIcon: React.ElementType; match?: Route[] }

const NAV: NavItem[] = [
  { route: "home", label: "Home", icon: RiHome5Line, activeIcon: RiHome5Fill },
  { route: "premi", label: "Premi", icon: RiGift2Line, activeIcon: RiGift2Fill, match: ["premi", "riscatto"] },
  { route: "tessera", label: "Tessera", icon: RiQrCodeLine, activeIcon: RiQrCodeLine, match: ["tessera", "movimenti"] },
  { route: "novita", label: "Novità", icon: RiCalendarEventLine, activeIcon: RiCalendarEventFill },
  { route: "locale", label: "Locale", icon: RiStore2Line, activeIcon: RiStore2Fill },
]

const isActive = (item: NavItem, route: Route) => (item.match ?? [item.route]).includes(route)

/** Le voci seguono le funzioni attivate dal titolare (es. niente "Novità" se eventi e promo sono spenti). */
function useNav() {
  const { venue } = useStore()
  return NAV.filter((n) => n.route !== "novita" || venue.features.events || venue.features.promos)
}

export function AppShell({ route, preview, children }: { route: Route; preview?: boolean; children: React.ReactNode }) {
  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[272px_1fr]">
      <Sidebar route={route} />
      <div className="flex min-w-0 flex-col pb-[calc(7rem+env(safe-area-inset-bottom))] lg:pb-12">
        {preview && <OwnerPreviewBar />}
        {children}
      </div>
      <BottomNav route={route} />
    </div>
  )
}

/** Il titolare sta guardando l'app come la vede un cliente (dati di esempio). */
function OwnerPreviewBar() {
  return (
    <div className="sticky top-0 z-30 flex items-center gap-3 bg-inverted px-4 pt-[max(0.5rem,env(safe-area-inset-top))] pb-2 text-sm text-inverted-foreground">
      <RiEyeLine className="size-4 shrink-0 text-highlight" />
      <span className="min-w-0 flex-1 truncate">Anteprima: l'app come la vede un cliente</span>
      <Button variant="glass" size="sm" onClick={() => navigate("titolare")}>
        Torna alla gestione
      </Button>
    </div>
  )
}

function Sidebar({ route }: { route: Route }) {
  const { user, venue } = useStore()
  const nav = useNav()
  return (
    <aside className="sticky top-0 hidden h-dvh flex-col gap-6 bg-sidebar p-4 text-sidebar-foreground lg:flex">
      <a href="#/home" className="flex items-center gap-3 rounded-2xl p-2 outline-none focus-visible:ring-3 focus-visible:ring-sidebar-ring/40">
        <BrandMark />
        <span className="flex flex-col">
          <span className="font-heading text-[15px] font-semibold">{venue.name}</span>
          <span className="text-xs text-sidebar-muted">Tessera fedeltà</span>
        </span>
      </a>

      <nav aria-label="Principale" className="flex flex-col gap-1">
        {[
          ...nav,
          { route: "movimenti", label: "Movimenti", icon: RiHistoryLine, activeIcon: RiHistoryLine } as NavItem,
        ].map((item) => {
          const active = item.route === "tessera" ? route === "tessera" : isActive(item, route)
          const Icon = active ? item.activeIcon : item.icon
          return (
            <a
              key={item.route}
              href={`#/${item.route}`}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex h-11 items-center gap-3 rounded-2xl px-3 text-sm font-medium text-sidebar-muted outline-none transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground focus-visible:ring-3 focus-visible:ring-sidebar-ring/40",
                active && "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground",
              )}
            >
              <Icon className="size-5" />
              {item.label}
            </a>
          )
        })}
      </nav>

      <div className="mt-auto flex flex-col gap-3">
        <a
          href="#/tessera"
          className="flex flex-col gap-2 rounded-2xl bg-sidebar-accent p-4 outline-none transition-colors hover:bg-white/10 focus-visible:ring-3 focus-visible:ring-sidebar-ring/40"
        >
          <span className="text-xs text-sidebar-muted">Il tuo saldo</span>
          <PointsOdometer value={user.points} className="text-3xl text-highlight" />
          <span className="flex items-center gap-1.5 text-xs font-medium text-sidebar-muted">
            <RiQrCodeLine className="size-4" /> Mostra la tessera in cassa
          </span>
        </a>
        <UserMenu align="start" side="top" full />
      </div>
    </aside>
  )
}

function BottomNav({ route }: { route: Route }) {
  const nav = useNav()
  return (
    <nav
      aria-label="Principale"
      className="fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-40 mx-auto flex max-w-md items-center justify-between rounded-[24px] bg-inverted p-1.5 text-inverted-foreground shadow-[0_16px_40px_-12px_rgb(0_0_0/0.45)] ring-1 ring-white/10 lg:hidden"
    >
      {nav.map((item) => {
        const active = isActive(item, route)
        const Icon = active ? item.activeIcon : item.icon
        if (item.route === "tessera")
          return (
            <a
              key={item.route}
              href="#/tessera"
              aria-current={active ? "page" : undefined}
              aria-label="Tessera"
              className="-my-4 flex size-14 shrink-0 items-center justify-center rounded-[20px] bg-highlight text-highlight-foreground shadow-[0_10px_24px_-8px_color-mix(in_oklch,var(--highlight)_80%,black)] outline-none transition-transform active:scale-95 focus-visible:ring-3 focus-visible:ring-highlight/50"
            >
              <RiQrCodeLine className="size-6" />
            </a>
          )
        return (
          <a
            key={item.route}
            href={`#/${item.route}`}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex h-14 min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-[18px] text-xs font-medium text-inverted-muted outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/40",
              active && "bg-white/12 text-inverted-foreground",
            )}
          >
            <Icon className={cn("size-[22px]", active && "text-highlight")} />
            {item.label}
          </a>
        )
      })}
    </nav>
  )
}

export function UserMenu({ align = "end", side = "bottom", full }: { align?: "start" | "end"; side?: "top" | "bottom"; full?: boolean }) {
  const { user, logout } = useStore()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {full ? (
          <button className="flex items-center gap-3 rounded-2xl p-2 text-left outline-none transition-colors hover:bg-sidebar-accent focus-visible:ring-3 focus-visible:ring-sidebar-ring/40">
            <Avatar size="lg">
              <AvatarFallback className="bg-sidebar-accent text-sidebar-foreground">
                {user.firstName[0]}
                {user.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <span className="flex min-w-0 flex-col">
              <span className="truncate text-sm font-medium">
                {user.firstName} {user.lastName}
              </span>
              <span className="truncate text-xs text-sidebar-muted">{user.email}</span>
            </span>
          </button>
        ) : (
          <Button variant="ghost" size="icon-xl" className="rounded-full p-0" aria-label="Menu profilo">
            <Avatar size="lg">
              <AvatarFallback className="bg-primary text-primary-foreground">
                {user.firstName[0]}
                {user.lastName[0]}
              </AvatarFallback>
            </Avatar>
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} side={side} className="w-60">
        <DropdownMenuLabel>{user.cardCode}</DropdownMenuLabel>
        <DropdownMenuItem onSelect={() => navigate("profilo")}>
          <RiUser3Line /> Profilo e consensi
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => navigate("movimenti")}>
          <RiHistoryLine /> Movimenti
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onSelect={logout}>
          <RiLogoutBoxRLine /> Esci
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}


export { PageBody, PageHeader, SectionTitle } from "@/components/fidelia/page"
