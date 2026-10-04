import {
  RiArrowRightLine,
  RiArrowRightSLine,
  RiGift2Line,
  RiHistoryLine,
  RiNotification3Line,
  RiQrCodeLine,
  RiSparkling2Fill,
} from "@remixicon/react"

import { PageBody, SectionTitle, UserMenu } from "@/screens/app-shell"
import { EventCard } from "@/components/fidelia/event-card"
import { AddToWalletRow, LoyaltyCard } from "@/screens/parts"
import { MovementRow } from "@/components/fidelia/movement-row"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Item, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from "@/components/ui/item"
import { Card, CardContent } from "@/components/ui/card"
import { navigate } from "@/mock/router"
import { useStore } from "@/mock/store"

function greeting() {
  const h = new Date().getHours()
  return h < 12 ? "Buongiorno" : h < 18 ? "Buon pomeriggio" : "Buonasera"
}

export function HomeScreen() {
  const { user, movements, bookings, redemption, venue, visible } = useStore()
  const PRIZES = visible.prizes
  const unlocked = PRIZES.filter((p) => p.cost <= user.points)
  const promoToday = visible.promos.find((p) => p.days?.includes(new Date().getDay()))
  const promo = promoToday ?? visible.promos[0]
  const event = visible.events.find((e) => e.date >= new Date().toISOString().slice(0, 10)) ?? visible.events[0]

  return (
    <>
      <header className="mx-auto flex w-full max-w-6xl items-center gap-3 px-4 pt-[max(1.5rem,env(safe-area-inset-top))] pb-5 sm:px-6 lg:px-10 lg:pt-10">
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
            <Alert variant="warning">
              <RiQrCodeLine />
              <AlertTitle>Riscatto in corso</AlertTitle>
              <AlertDescription>Mostra il QR monouso in cassa.</AlertDescription>
              <AlertAction>
                <Button size="sm" variant="outline" className="border-current/30 bg-transparent text-current hover:bg-white/40 hover:text-current" onClick={() => navigate("riscatto")}>
                  Apri
                </Button>
              </AlertAction>
            </Alert>
          )}

          <AddToWalletRow />

          {unlocked.length > 0 && (
            <Item variant="outline" asChild>
              <button onClick={() => navigate("premi", { filtro: "disponibili" })}>
                <ItemMedia variant="icon" className="bg-success-soft text-success">
                  <RiGift2Line />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>
                    {unlocked.length === 1 ? "1 premio pronto da riscattare" : `${unlocked.length} premi pronti da riscattare`}
                  </ItemTitle>
                  <ItemDescription className="text-xs">{unlocked.map((p) => p.name).join(" · ")}</ItemDescription>
                </ItemContent>
                <RiArrowRightSLine className="size-5 text-muted-foreground" />
              </button>
            </Item>
          )}

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

        </div>
      </PageBody>
    </>
  )
}
