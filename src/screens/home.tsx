import {
  RiArrowRightLine,
  RiArrowRightSLine,
  RiCalendarEventLine,
  RiGift2Line,
  RiHistoryLine,
  RiNotification3Line,
  RiQrCodeLine,
  RiSparkling2Fill,
  RiStarSmileLine,
} from "@remixicon/react"

import { PageBody, SectionTitle, UserMenu } from "@/components/fidelia/app-shell"
import { EventCard } from "@/components/fidelia/event-card"
import { LoyaltyCard } from "@/components/fidelia/loyalty-card"
import { MovementRow } from "@/components/fidelia/movement-row"
import { PrizeArt } from "@/components/fidelia/prize-art"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ItemGroup } from "@/components/ui/item"
import { Progress } from "@/components/ui/progress"
import { navigate } from "@/lib/router"
import { nextPrize, useStore } from "@/lib/store"
import { fmtPoints } from "@/lib/utils"

function greeting() {
  const h = new Date().getHours()
  return h < 12 ? "Buongiorno" : h < 18 ? "Buon pomeriggio" : "Buonasera"
}

export function HomeScreen() {
  const { user, movements, bookings, redemption, venue, visible } = useStore()
  const PRIZES = visible.prizes
  const next = nextPrize(PRIZES, user.points)
  const unlocked = PRIZES.filter((p) => p.cost <= user.points)
  const promoToday = visible.promos.find((p) => p.days?.includes(new Date().getDay()))
  const promo = promoToday ?? visible.promos[0]
  const event = visible.events.find((e) => e.date >= new Date().toISOString().slice(0, 10)) ?? visible.events[0]

  return (
    <>
      <header className="mx-auto flex w-full max-w-6xl items-center gap-3 px-4 pt-6 pb-5 sm:px-6 lg:px-10 lg:pt-10">
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="text-sm text-muted-foreground">{venue.name}</span>
          <h1 className="font-heading text-[28px] leading-tight font-semibold tracking-[-0.02em] lg:text-[34px]">
            {greeting()}, {user.firstName}
          </h1>
        </div>
        <Button variant="secondary" size="icon-xl" className="rounded-full" aria-label="Notifiche" onClick={() => navigate("novita")}>
          <RiNotification3Line />
        </Button>
        <div className="lg:hidden">
          <UserMenu />
        </div>
      </header>

      <PageBody className="lg:grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-start lg:gap-8">
        <div className="flex flex-col gap-5">
          <LoyaltyCard>
            <div className="flex flex-col gap-3">
              {next ? (
                <Progress value={(user.points / next.cost) * 100} aria-label={`Progresso verso ${next.name}`} className="h-2 bg-white/20" indicatorClassName="bg-highlight" />
              ) : (
                <span className="text-sm">Hai sbloccato tutti i premi del catalogo.</span>
              )}
              <div className="flex gap-2">
                <Button variant="highlight" size="xl" className="flex-1" onClick={() => navigate("tessera")}>
                  <RiQrCodeLine /> Mostra tessera
                </Button>
                <Button variant="glass" size="icon-xl" className="size-12" aria-label="Movimenti" onClick={() => navigate("movimenti")}>
                  <RiHistoryLine />
                </Button>
              </div>
            </div>
          </LoyaltyCard>

          {redemption && (
            <button
              onClick={() => navigate("riscatto")}
              className="flex items-center gap-3 rounded-2xl bg-warning-soft p-4 text-left text-warning outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/30"
            >
              <span className="relative flex size-2.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-highlight opacity-75" />
                <span className="relative inline-flex size-2.5 rounded-full bg-highlight" />
              </span>
              <span className="flex-1 text-sm font-medium">Hai un riscatto in corso: mostra il QR in cassa</span>
              <RiArrowRightSLine className="size-5" />
            </button>
          )}

          <nav aria-label="Azioni rapide" className="grid auto-cols-fr grid-flow-col gap-2">
            {[
              { label: "Premi", icon: RiGift2Line, to: () => navigate("premi"), on: true },
              { label: "Eventi", icon: RiCalendarEventLine, to: () => navigate("novita", { tab: "eventi" }), on: venue.features.events },
              { label: "Movimenti", icon: RiHistoryLine, to: () => navigate("movimenti"), on: true },
              { label: "Recensisci", icon: RiStarSmileLine, to: () => window.open(venue.links.review, "_blank", "noopener"), on: venue.features.reviews && !!venue.links.review },
            ].filter((a) => a.on).map(({ label, icon: Icon, to }) => (
              <button
                key={label}
                onClick={to}
                className="flex flex-col items-center gap-2 rounded-2xl bg-card py-3.5 text-xs font-medium shadow-sm ring-1 ring-foreground/5 outline-none transition-[background-color,transform] hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/30 active:scale-[0.97] dark:ring-foreground/10"
              >
                <span className="flex size-10 items-center justify-center rounded-xl bg-primary-soft text-primary-soft-foreground">
                  <Icon className="size-5" />
                </span>
                {label}
              </button>
            ))}
          </nav>

          <section aria-labelledby="ultimi" className="flex flex-col gap-2.5">
            <SectionTitle
              id="ultimi"
              action={
                <Button variant="link" size="sm" className="px-0" onClick={() => navigate("movimenti")}>
                  Vedi tutto
                </Button>
              }
            >
              Ultimi movimenti
            </SectionTitle>
            <Card className="py-1.5" size="sm">
              <ItemGroup className="px-1.5">
                {movements.slice(0, 3).map((m) => (
                  <MovementRow key={m.id} m={m} />
                ))}
              </ItemGroup>
            </Card>
          </section>
        </div>

        <div className="flex flex-col gap-5">
          {promo && (
          <section aria-labelledby="promo-home" className="flex flex-col gap-2.5">
            <SectionTitle id="promo-home">{promoToday ? "Promo di oggi" : "Promo del mese"}</SectionTitle>
            <Card className="gap-0 border-0 bg-inverted py-0 text-inverted-foreground ring-0 dark:ring-1 dark:ring-white/10">
              {promo.image && <img src={promo.image} alt="" className="h-40 w-full object-cover" />}
              <CardContent className="flex flex-col gap-3 py-5">
                <div className="flex flex-wrap gap-1.5">
                  {promo.doublePoints && (
                    <Badge variant="highlight" size="lg">
                      <RiSparkling2Fill /> Punti doppi
                    </Badge>
                  )}
                  {promoToday && (
                    <Badge size="lg" className="bg-white/12 text-current">
                      Attiva stasera
                    </Badge>
                  )}
                </div>
                <h3 className="font-heading text-[22px] leading-tight font-semibold">{promo.title}</h3>
                <p className="text-sm leading-relaxed text-inverted-muted">{promo.text}</p>
                <Button variant="glass" size="lg" className="w-fit" onClick={() => navigate("novita", { tab: "promo" })}>
                  Tutte le promo <RiArrowRightLine />
                </Button>
              </CardContent>
            </Card>
          </section>
          )}

          {event && (
          <section aria-labelledby="evento-home" className="flex flex-col gap-2.5">
            <SectionTitle
              id="evento-home"
              action={
                <Button variant="link" size="sm" className="px-0" onClick={() => navigate("novita", { tab: "eventi" })}>
                  Tutti gli eventi
                </Button>
              }
            >
              Prossimo evento
            </SectionTitle>
            <EventCard event={event} booked={bookings[event.id]} onOpen={() => navigate("novita", { tab: "eventi", evento: event.id })} />
          </section>
          )}

          <section aria-labelledby="premi-home" className="flex flex-col gap-2.5">
            <SectionTitle
              id="premi-home"
              action={
                unlocked.length > 0 && (
                  <Badge variant="success" size="lg">
                    {unlocked.length} sbloccati
                  </Badge>
                )
              }
            >
              I tuoi premi
            </SectionTitle>
            <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1 no-scrollbar sm:mx-0 sm:px-0">
              {PRIZES.map((p) => {
                const ok = p.cost <= user.points
                return (
                  <button
                    key={p.id}
                    onClick={() => navigate("premi", { premio: p.id })}
                    className="flex w-[156px] shrink-0 snap-start flex-col gap-3 rounded-[20px] bg-card p-3.5 text-left shadow-sm ring-1 ring-foreground/5 outline-none transition-[background-color,transform] hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/30 active:scale-[0.98] dark:ring-foreground/10"
                  >
                    <PrizeArt id={p.id} image={p.image} category={p.category} locked={!ok} className="size-12" />
                    <span className="line-clamp-1 text-sm font-medium">{p.name}</span>
                    <span className={ok ? "text-xs font-semibold text-success" : "text-xs text-muted-foreground"}>
                      {ok ? "Disponibile" : `${fmtPoints(p.cost)} punti`}
                    </span>
                  </button>
                )
              })}
            </div>
          </section>
        </div>
      </PageBody>
    </>
  )
}
