import * as React from "react"
import {
  RiAddLine,
  RiCalendarCheckLine,
  RiCalendarEventLine,
  RiCoupon3Line,
  RiGroupLine,
  RiNotification3Line,
  RiSparkling2Fill,
  RiSparkling2Line,
  RiSubtractLine,
  RiTicket2Line,
  RiTimeLine,
} from "@remixicon/react"

import { PageBody, PageHeader } from "@/screens/app-shell"
import { EVENT_ICON, EventArt } from "@/components/fidelia/event-art"
import { EventCard } from "@/components/fidelia/event-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { Empty, EmptyDescription, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { eventDate } from "@/lib/format"
import type { EventType, FideliaEvent } from "@/types"
import { navigate } from "@/mock/router"
import { toast, useStore } from "@/mock/store"
import { cn, haptic } from "@/lib/utils"

export function NovitaScreen({ tab, eventId }: { tab: string; eventId: string | null }) {
  const { venue } = useStore()
  const { events: evOn, promos: prOn } = venue.features
  const current = !evOn ? "promo" : !prOn ? "eventi" : tab === "promo" ? "promo" : "eventi"
  const month = new Date().toLocaleDateString("it-IT", { month: "long", year: "numeric" })
  return (
    <>
      <PageHeader title="Novità" description={`${month.charAt(0).toUpperCase() + month.slice(1)} · promo valide mostrando la tessera, eventi con punti extra`} />
      <PageBody>
        <Tabs value={current} onValueChange={(v) => navigate("novita", { tab: v })} className="gap-5">
          {evOn && prOn && (
            <TabsList className="h-11 w-full sm:w-fit">
              <TabsTrigger value="eventi" className="px-5">
                <RiCalendarEventLine /> Eventi
              </TabsTrigger>
              <TabsTrigger value="promo" className="px-5">
                <RiCoupon3Line /> Promo
              </TabsTrigger>
            </TabsList>
          )}
          <TabsContent value="eventi">
            <EventsPanel initial={eventId} />
          </TabsContent>
          <TabsContent value="promo">
            <PromoPanel />
          </TabsContent>
        </Tabs>
      </PageBody>
    </>
  )
}

function NotifyRow({ id, title, desc, checked, onChange }: { id: string; title: string; desc: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <Card size="sm">
      <CardContent className="flex items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary-soft-foreground">
          <RiNotification3Line className="size-5" />
        </span>
        <Label htmlFor={id} className="flex-1 flex-col items-start gap-0.5">
          <span>{title}</span>
          <span className="text-xs font-normal text-muted-foreground">{desc}</span>
        </Label>
        <Switch
          id={id}
          checked={checked}
          onCheckedChange={(v) => {
            onChange(v)
            toast(v ? "Notifiche attivate" : "Notifiche disattivate")
          }}
        />
      </CardContent>
    </Card>
  )
}

function PromoPanel() {
  const { notify, setNotify, visible } = useStore()
  const [hero, ...rest] = visible.promos
  const today = new Date().getDay()
  if (!hero)
    return (
      <Empty>
        <EmptyMedia>
          <RiCoupon3Line />
        </EmptyMedia>
        <EmptyTitle>Nessuna promo attiva</EmptyTitle>
        <EmptyDescription>Attiva le notifiche: ti avvisiamo appena il locale pubblica un'offerta.</EmptyDescription>
      </Empty>
    )
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-start">
      <Card className="gap-0 border-0 bg-brand py-0 text-brand-foreground ring-0 dark:ring-1 dark:ring-white/10">
        <div className="relative isolate flex h-[220px] items-end overflow-hidden p-5">
          <EventArt type="live" image={hero.image} scrim={false} />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,var(--brand),color-mix(in_oklch,var(--brand)_35%,transparent)_60%,transparent)]" />
          <div className="flex flex-wrap gap-1.5">
            {hero.doublePoints && (
              <Badge variant="highlight" size="lg">
                <RiSparkling2Fill /> Punti doppi
              </Badge>
            )}
            {hero.days?.includes(today) && (
              <Badge variant="glass" size="lg">
                Attiva oggi
              </Badge>
            )}
          </div>
        </div>
        <CardContent className="flex flex-col gap-2 py-5">
          <span className="text-xs font-medium opacity-90">{hero.label}</span>
          <h2 className="font-heading text-[26px] leading-tight font-extrabold">{hero.title}</h2>
          <p className="text-sm leading-relaxed">{hero.text}</p>
          <span className="text-xs font-semibold opacity-90">{hero.validity}</span>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3">
        {rest.map((p) => (
          <Card key={p.id} size="sm">
            <CardContent className="flex items-start gap-3.5">
              {p.image ? (
                <img src={p.image} alt="" className="size-16 shrink-0 rounded-2xl object-cover" />
              ) : (
                <span className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-warning-soft text-warning">
                  <RiTicket2Line className="size-6" />
                </span>
              )}
              <div className="flex flex-col gap-1">
                <Badge variant="secondary">{p.label}</Badge>
                <span className="font-heading text-base font-bold">{p.title}</span>
                <span className="text-sm text-muted-foreground">{p.text}</span>
                <span className="text-xs font-semibold text-muted-foreground">{p.validity}</span>
              </div>
            </CardContent>
          </Card>
        ))}
        <NotifyRow id="n-promo" title="Avvisami delle nuove promo" desc="Piatto del giorno, eventi e offerte" checked={notify.promo} onChange={(v) => setNotify("promo", v)} />
      </div>
    </div>
  )
}

const TYPES: { value: "tutti" | EventType; label: string }[] = [
  { value: "tutti", label: "Tutti" },
  { value: "karaoke", label: "Karaoke" },
  { value: "live", label: "Musica live" },
  { value: "degustazione", label: "Degustazioni" },
  { value: "natale", label: "Feste" },
]

function EventsPanel({ initial }: { initial: string | null }) {
  const { bookings, notify, setNotify, visible } = useStore()
  const EVENTS = visible.events
  const [type, setType] = React.useState<"tutti" | EventType>("tutti")
  const [openId, setOpenId] = React.useState<string | null>(initial)
  const list = EVENTS.filter((e) => type === "tutti" || e.type === type)
  const [hero, ...rest] = list
  const open = EVENTS.find((e) => e.id === openId) ?? null

  return (
    <div className="flex flex-col gap-4">
      <ToggleGroup type="single" value={type} onValueChange={(v) => v && setType(v as typeof type)} aria-label="Filtra eventi" className="-mx-4 overflow-x-auto px-4 no-scrollbar sm:mx-0 sm:px-0">
        {TYPES.map((t) => (
          <ToggleGroupItem key={t.value} value={t.value}>
            {t.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      {!hero ? (
        <Empty>
          <EmptyMedia>
            <RiCalendarEventLine />
          </EmptyMedia>
          <EmptyTitle>Nessun evento di questo tipo</EmptyTitle>
          <EmptyDescription>Attiva le notifiche: ti scriviamo quando apriamo le prenotazioni.</EmptyDescription>
        </Empty>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-start">
          <EventCard event={hero} tall booked={bookings[hero.id]} onOpen={() => setOpenId(hero.id)} />
          <div className="flex flex-col gap-2.5">
            {rest.length > 0 && <h2 className="px-1 font-heading text-lg font-bold">In programma</h2>}
            {rest.map((e) => {
              const d = eventDate(e.date)
              const Icon = EVENT_ICON[e.type]
              return (
                <button
                  key={e.id}
                  onClick={() => setOpenId(e.id)}
                  className="group/event flex items-center gap-3.5 rounded-3xl bg-card p-3 text-left shadow-sm ring-1 ring-foreground/5 outline-none transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/30 dark:ring-foreground/10"
                >
                  <div className="relative isolate flex size-[72px] shrink-0 flex-col items-center justify-center overflow-hidden rounded-2xl text-white">
                    <EventArt type={e.type} image={e.image} />
                    <span className="font-heading text-[22px] leading-none font-bold tabular">{d.day}</span>
                    <span className="text-xs font-semibold uppercase">{d.month}</span>
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Icon className="size-3.5" /> {e.typeLabel}
                    </span>
                    <span className="truncate font-heading text-base font-bold">{e.title}</span>
                    <span className="flex flex-wrap items-center gap-x-3 text-xs text-muted-foreground">
                      <span>
                        {d.weekday} · {e.time}
                      </span>
                      <span className="font-semibold text-warning">+{e.bonusPoints} punti</span>
                    </span>
                  </div>
                  {bookings[e.id] && (
                    <Badge variant="success">
                      <RiCalendarCheckLine /> {bookings[e.id]}
                    </Badge>
                  )}
                </button>
              )
            })}
            <NotifyRow id="n-eventi" title="Avvisami dei nuovi eventi" desc="Ti scriviamo quando apriamo le prenotazioni" checked={notify.events} onChange={(v) => setNotify("events", v)} />
          </div>
        </div>
      )}

      <Drawer open={!!open} onOpenChange={(o) => !o && setOpenId(null)}>
        <DrawerContent>{open && <BookingSheet event={open} onDone={() => setOpenId(null)} />}</DrawerContent>
      </Drawer>
    </div>
  )
}

function BookingSheet({ event, onDone }: { event: FideliaEvent; onDone: () => void }) {
  const { bookings, book, cancelBooking, venue } = useStore()
  const booked = bookings[event.id]
  const [guests, setGuests] = React.useState(booked ?? 2)
  const d = eventDate(event.date)
  const max = Math.min(8, event.seatsLeft)
  const taken = event.seats - event.seatsLeft

  return (
    <>
      <div className="relative isolate mx-4 mt-3 flex h-36 items-end overflow-hidden rounded-3xl p-4 text-white">
        <EventArt type={event.type} image={event.image} />
        <Badge variant="glass" size="lg">
          {d.weekday} {d.day} {d.month} · {event.time}
        </Badge>
      </div>
      <DrawerHeader>
        <DrawerTitle>{event.title}</DrawerTitle>
        <DrawerDescription>{event.description}</DrawerDescription>
      </DrawerHeader>
      <div className="flex flex-col gap-4 px-5 py-2">
        <div className="grid grid-cols-3 gap-2 text-center">
          {[
            { icon: RiTicket2Line, k: "Ingresso", v: event.price },
            { icon: RiSparkling2Line, k: "Bonus", v: `+${event.bonusPoints} punti` },
            { icon: RiTimeLine, k: "Orario", v: event.time },
          ].map(({ icon: Icon, k, v }) => (
            <div key={k} className="flex flex-col items-center gap-1 rounded-2xl bg-muted p-3">
              <Icon className="size-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{k}</span>
              <span className="text-[13px] font-semibold">{v}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Posti prenotati</span>
            <span className={cn("font-semibold", event.seatsLeft <= 6 && "text-destructive")}>{event.seatsLeft <= 6 ? `Ultimi ${event.seatsLeft} posti` : `${event.seatsLeft} liberi`}</span>
          </div>
          <Progress value={(taken / event.seats) * 100} aria-label="Posti occupati" indicatorClassName={cn(event.seatsLeft <= 6 && "bg-destructive")} />
        </div>
        {!booked && venue.features.booking && (
          <div className="flex items-center justify-between rounded-2xl border p-2 pl-4">
            <span className="flex items-center gap-2 text-sm font-medium">
              <RiGroupLine className="size-4" /> Persone
            </span>
            <div className="flex items-center gap-1">
              <Button variant="secondary" size="icon-xl" aria-label="Una persona in meno" disabled={guests <= 1} onClick={() => setGuests((g) => g - 1)}>
                <RiSubtractLine />
              </Button>
              <output aria-live="polite" className="w-10 text-center font-heading text-xl font-bold tabular">
                {guests}
              </output>
              <Button variant="secondary" size="icon-xl" aria-label="Una persona in più" disabled={guests >= max} onClick={() => setGuests((g) => g + 1)}>
                <RiAddLine />
              </Button>
            </div>
          </div>
        )}
      </div>
      <DrawerFooter>
        {booked ? (
          <>
            <div className="flex items-center gap-2 rounded-2xl bg-success-soft p-3 text-sm font-medium text-success">
              <RiCalendarCheckLine className="size-5" /> Prenotato per {booked} {booked === 1 ? "persona" : "persone"}. Ti aspettiamo!
            </div>
            <Button
              variant="destructive"
              size="xl"
              onClick={() => {
                cancelBooking(event.id)
                toast("Prenotazione annullata")
                onDone()
              }}
            >
              Annulla prenotazione
            </Button>
          </>
        ) : !venue.features.booking ? (
          <p className="rounded-2xl bg-muted p-3 text-sm">Per partecipare chiama il locale{venue.phone ? `: ${venue.phone}` : ""}.</p>
        ) : (
          <Button
            size="xl"
            onClick={() => {
              book(event.id, guests)
              haptic()
              toast.success("Prenotazione confermata", { description: `${event.title} · ${guests} ${guests === 1 ? "persona" : "persone"}. Riceverai +${event.bonusPoints} punti alla serata.` })
              onDone()
            }}
          >
            <RiCalendarCheckLine /> Prenota per {guests} {guests === 1 ? "persona" : "persone"}
          </Button>
        )}
      </DrawerFooter>
    </>
  )
}
