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

import { PageBody } from "@/screens/app-shell"
import { BrandMark as VenueMark } from "@/screens/parts"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { fmtMinutes, openState } from "@/lib/format"
import { useNow } from "@/mock/router"
import { useStore } from "@/mock/store"
import { cn } from "@/lib/utils"

function Placeholder({ label, className }: { label: string; className?: string }) {
  return (
    <div className={cn("flex items-center justify-center bg-[repeating-linear-gradient(135deg,var(--muted)_0_12px,var(--surface)_12px_24px)] text-xs font-semibold tracking-[0.08em] text-muted-foreground", className)}>
      {label}
    </div>
  )
}

export function LocaleScreen() {
  useNow(60_000)
  const { venue } = useStore()
  const state = openState(venue.hours)
  const today = new Date().getDay()
  const week = [1, 2, 3, 4, 5, 6, 0]
  const tel = venue.phone.replace(/[^\d+]/g, "")

  const actions = [
    { label: "Chiama", icon: RiPhoneLine, href: tel ? `tel:${tel}` : "", primary: true },
    { label: "Indicazioni", icon: RiMapPin2Line, href: venue.links.maps },
    { label: "Menù", icon: RiBookOpenLine, href: venue.links.menu },
    { label: "Recensisci", icon: RiStarSmileLine, href: venue.features.reviews ? venue.links.review : "" },
  ].filter((a) => a.href)

  const socials = [
    { label: "Instagram", icon: RiInstagramLine, href: venue.links.instagram },
    { label: "Facebook", icon: RiFacebookCircleLine, href: venue.links.facebook },
    { label: "TikTok", icon: RiTiktokLine, href: venue.links.tiktok },
    { label: "WhatsApp", icon: RiWhatsappLine, href: venue.links.whatsapp },
  ].filter((s) => s.href)

  return (
    <>
      <div className="mx-auto w-full max-w-6xl overflow-hidden lg:mt-10 lg:rounded-4xl">
        {venue.cover ? (
          <img src={venue.cover} alt={`Foto del locale ${venue.name}`} className="h-[220px] w-full object-cover lg:h-[300px]" />
        ) : (
          <Placeholder label="[FOTO COPERTINA DEL LOCALE]" className="h-[200px] lg:h-[260px]" />
        )}
      </div>
      <PageBody className="relative z-10 -mt-12 lg:grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-start lg:gap-8">
        <div className="flex flex-col gap-4">
          <Card className="shadow-float">
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-center gap-3.5">
                <VenueMark className="size-14 text-lg" />
                <div className="flex flex-col gap-1.5">
                  <h1 className="font-heading text-[24px] leading-tight font-semibold">{venue.name}</h1>
                  <Badge variant={state.open ? "success" : "secondary"} size="lg">
                    <span className={cn("size-1.5 rounded-full", state.open ? "bg-success" : "bg-muted-foreground")} />
                    {state.label}
                  </Badge>
                </div>
              </div>
              {actions.length > 0 && (
                <div className="grid auto-cols-fr grid-flow-col gap-2">
                  {actions.map(({ label, icon: Icon, href, primary }) => (
                    <Button key={label} asChild variant={primary ? "default" : "secondary"} className="h-[68px] flex-col gap-1.5 text-xs">
                      <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
                        <Icon className="size-5" />
                        {label}
                      </a>
                    </Button>
                  ))}
                </div>
              )}
              {venue.phone && <p className="text-sm text-muted-foreground">Telefono: <span className="font-medium text-foreground select-all">{venue.phone}</span></p>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Orari</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="flex flex-col">
                {week.map((d) => {
                  const h = venue.hours[d]
                  const isToday = d === today
                  return (
                    <div key={d} className={cn("flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm", isToday && "bg-primary-soft font-semibold text-primary-soft-foreground")}>
                      <dt className="flex items-center gap-2">
                        {h.day}
                        {isToday && <Badge>Oggi</Badge>}
                      </dt>
                      <dd className={cn("text-right tabular", h.slots.length === 0 && !isToday && "text-muted-foreground")}>
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
            {venue.mapImage ? (
              <img src={venue.mapImage} alt={`Mappa: ${venue.address}`} className="h-[170px] w-full object-cover" />
            ) : (
              <Placeholder label="[MAPPA DEL LOCALE]" className="h-[150px]" />
            )}
            <CardContent className="flex items-center gap-3 py-4">
              <RiMapPin2Line className="size-5 shrink-0 text-primary" />
              <span className="flex-1 text-sm select-all">{venue.address}</span>
              {venue.links.maps && (
                <Button asChild variant="outline" size="lg">
                  <a href={venue.links.maps} target="_blank" rel="noopener noreferrer">
                    Apri <RiExternalLinkLine />
                  </a>
                </Button>
              )}
            </CardContent>
          </Card>

          {venue.features.reviews && venue.links.review && (
            <Card className="border-0 bg-inverted text-inverted-foreground ring-0 dark:ring-1 dark:ring-white/10">
              <CardContent className="flex flex-col gap-3">
                <span className="flex size-11 items-center justify-center rounded-2xl bg-highlight text-highlight-foreground">
                  <RiStarSmileLine className="size-6" />
                </span>
                <h2 className="font-heading text-xl font-semibold">Ti è piaciuto? Raccontalo in pochi secondi</h2>
                <p className="text-sm text-inverted-muted">Una recensione su Google aiuta un locale indipendente più di qualsiasi pubblicità.</p>
                <Button asChild variant="highlight" size="xl" className="w-fit">
                  <a href={venue.links.review} target="_blank" rel="noopener noreferrer">
                    Lascia una recensione su Google
                  </a>
                </Button>
              </CardContent>
            </Card>
          )}

          {socials.length > 0 && (
            <Card size="sm">
              <CardHeader>
                <CardTitle className="font-semibold">Seguici</CardTitle>
              </CardHeader>
              <CardContent className="grid auto-cols-fr grid-flow-col gap-2">
                {socials.map(({ label, icon: Icon, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-14 flex-col items-center justify-center gap-1 rounded-2xl bg-muted text-xs font-medium outline-none transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:ring-3 focus-visible:ring-ring/30"
                  >
                    <Icon className="size-5" />
                    {label}
                  </a>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </PageBody>
    </>
  )
}
