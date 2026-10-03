import {
  RiBookOpenLine,
  RiExternalLinkLine,
  RiFacebookCircleLine,
  RiInstagramLine,
  RiMapPin2Line,
  RiPhoneLine,
  RiStarSmileLine,
  RiTiktokLine,
  RiWhatsappLine,
} from "@remixicon/react"

import { PageBody } from "@/components/fidelia/app-shell"
import { VenueMark } from "@/components/fidelia/loyalty-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { VENUE, fmtMinutes, openState } from "@/lib/data"
import { useNow } from "@/lib/router"
import { cn } from "@/lib/utils"

export function LocaleScreen() {
  useNow(60_000)
  const state = openState()
  const today = new Date().getDay()
  const week = [1, 2, 3, 4, 5, 6, 0]

  return (
    <>
      <div className="relative mx-auto flex h-[200px] w-full max-w-6xl items-center justify-center overflow-hidden bg-[repeating-linear-gradient(135deg,var(--muted)_0_12px,var(--surface)_12px_24px)] text-xs font-semibold tracking-[0.08em] text-muted-foreground lg:mt-10 lg:h-[260px] lg:rounded-[28px]">
        [FOTO COPERTINA DEL LOCALE]
      </div>
      <PageBody className="relative z-10 -mt-12 lg:grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-start lg:gap-8">
        <div className="flex flex-col gap-4">
          <Card className="shadow-[0_14px_34px_-16px_rgb(12_10_9/0.25)]">
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-center gap-3.5">
                <VenueMark className="size-14 text-lg" />
                <div className="flex flex-col gap-1.5">
                  <h1 className="font-heading text-[24px] leading-tight font-semibold">{VENUE.name}</h1>
                  <Badge variant={state.open ? "success" : "secondary"} size="lg">
                    <span className={cn("size-1.5 rounded-full", state.open ? "bg-success" : "bg-muted-foreground")} />
                    {state.label}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: "Chiama", icon: RiPhoneLine, href: `tel:${VENUE.phone}`, primary: true },
                  { label: "Indicazioni", icon: RiMapPin2Line, href: VENUE.links.maps },
                  { label: "Menù", icon: RiBookOpenLine, href: VENUE.links.menu },
                  { label: "Recensisci", icon: RiStarSmileLine, href: VENUE.links.review },
                ].map(({ label, icon: Icon, href, primary }) => (
                  <Button key={label} asChild variant={primary ? "default" : "secondary"} className="h-[68px] flex-col gap-1.5 text-xs">
                    <a href={href}>
                      <Icon className="size-5" />
                      {label}
                    </a>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Orari</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="flex flex-col">
                {week.map((d) => {
                  const h = VENUE.hours[d]
                  const isToday = d === today
                  return (
                    <div key={d} className={cn("flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm", isToday && "bg-primary/10 font-semibold dark:bg-primary/25")}>
                      <dt className="flex items-center gap-2">
                        {h.day}
                        {isToday && <Badge>Oggi</Badge>}
                      </dt>
                      <dd className={cn("text-right tabular", h.slots.length === 0 && "text-muted-foreground")}>
                        {h.slots.length === 0 ? "Chiuso" : h.slots.map(([a, b]) => `${fmtMinutes(a)}–${fmtMinutes(b)}`).join(" · ")}
                      </dd>
                    </div>
                  )
                })}
              </dl>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <Card className="gap-0 py-0">
            <div className="flex h-[150px] items-center justify-center bg-[repeating-linear-gradient(135deg,var(--muted)_0_12px,var(--surface)_12px_24px)] text-xs font-semibold tracking-[0.08em] text-muted-foreground">
              [MAPPA GOOGLE]
            </div>
            <CardContent className="flex items-center gap-3 py-4">
              <RiMapPin2Line className="size-5 shrink-0 text-primary" />
              <span className="flex-1 text-sm">{VENUE.address}</span>
              <Button asChild variant="outline" size="lg">
                <a href={VENUE.links.maps}>
                  Apri <RiExternalLinkLine />
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 bg-inverted text-inverted-foreground ring-0">
            <CardContent className="flex flex-col gap-3">
              <span className="flex size-11 items-center justify-center rounded-2xl bg-highlight text-highlight-foreground">
                <RiStarSmileLine className="size-6" />
              </span>
              <h2 className="font-heading text-xl font-semibold">Ti è piaciuto? Raccontalo in pochi secondi</h2>
              <p className="text-sm opacity-75">Una recensione su Google aiuta un locale indipendente più di qualsiasi pubblicità.</p>
              <Button asChild variant="highlight" size="xl" className="w-fit">
                <a href={VENUE.links.review}>Lascia una recensione su Google</a>
              </Button>
            </CardContent>
          </Card>

          <Card size="sm">
            <CardHeader>
              <CardTitle className="font-semibold">Seguici</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-4 gap-2">
              {[
                { label: "Instagram", icon: RiInstagramLine, href: VENUE.links.instagram },
                { label: "Facebook", icon: RiFacebookCircleLine, href: VENUE.links.facebook },
                { label: "TikTok", icon: RiTiktokLine, href: VENUE.links.tiktok },
                { label: "WhatsApp", icon: RiWhatsappLine, href: VENUE.links.whatsapp },
              ].map(({ label, icon: Icon, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-14 flex-col items-center justify-center gap-1 rounded-2xl bg-muted text-[11px] font-medium outline-none transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:ring-3 focus-visible:ring-ring/30"
                >
                  <Icon className="size-5" />
                  {label}
                </a>
              ))}
            </CardContent>
          </Card>
        </div>
      </PageBody>
    </>
  )
}
