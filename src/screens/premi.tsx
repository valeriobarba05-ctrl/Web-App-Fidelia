import * as React from "react"
import { RiArrowRightSLine, RiGift2Line, RiLockLine, RiQrCodeLine, RiShieldCheckLine } from "@remixicon/react"

import { PageBody, PageHeader } from "@/screens/app-shell"
import { PointsOdometer } from "@/components/fidelia/points-odometer"
import { PrizeArt } from "@/components/fidelia/prize-art"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { Empty, EmptyDescription, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Progress } from "@/components/ui/progress"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { pointsRule } from "@/lib/format"
import type { Prize } from "@/types"
import { navigate } from "@/mock/router"
import { useStore } from "@/mock/store"
import { cn, fmtPoints } from "@/lib/utils"

type Filter = "tutti" | "disponibili" | "bloccati"

export function PremiScreen({ initial }: { initial?: string | null }) {
  const { user, redemption, startRedeem, visible, venue, prizes: allPrizes } = useStore()
  const PRIZES = visible.prizes
  const [filter, setFilter] = React.useState<Filter>("tutti")
  const [openId, setOpenId] = React.useState<string | null>(initial ?? null)
  const open = PRIZES.find((p) => p.id === openId) ?? null
  const available = PRIZES.filter((p) => p.cost <= user.points).length
  const list = PRIZES.filter((p) => (filter === "disponibili" ? p.cost <= user.points : filter === "bloccati" ? p.cost > user.points : true))

  return (
    <>
      <PageHeader title="Premi" description="Si riscattano in cassa con un QR monouso. I punti vengono scalati solo dopo la scansione." />
      <PageBody>
        <div className="flex flex-col gap-4 rounded-[24px] bg-inverted p-5 text-inverted-foreground ring-white/10 sm:flex-row dark:ring-1 sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-highlight text-highlight-foreground">
              <RiGift2Line className="size-6" />
            </span>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-inverted-muted">Hai a disposizione</span>
              <PointsOdometer value={user.points} className="text-[34px] text-highlight" />
            </div>
          </div>
          <Badge variant="success" size="lg" className="self-start sm:self-auto">
            {available} {available === 1 ? "premio sbloccato" : "premi sbloccati"}
          </Badge>
        </div>

        {redemption && (
          <button
            onClick={() => navigate("riscatto")}
            className="flex items-center gap-3 rounded-2xl bg-warning-soft p-4 text-left text-warning outline-none focus-visible:ring-3 focus-visible:ring-ring/30"
          >
            <RiQrCodeLine className="size-5" />
            <span className="flex-1 text-sm font-medium">Riscatto in corso: {allPrizes.find((p) => p.id === redemption.prizeId)?.name}</span>
            <RiArrowRightSLine className="size-5" />
          </button>
        )}

        <ToggleGroup type="single" value={filter} onValueChange={(v) => v && setFilter(v as Filter)} aria-label="Filtra premi" className="-mx-4 overflow-x-auto px-4 no-scrollbar sm:mx-0 sm:px-0">
          <ToggleGroupItem value="tutti">Tutti · {PRIZES.length}</ToggleGroupItem>
          <ToggleGroupItem value="disponibili">Disponibili · {available}</ToggleGroupItem>
          <ToggleGroupItem value="bloccati">Da sbloccare · {PRIZES.length - available}</ToggleGroupItem>
        </ToggleGroup>

        {list.length === 0 ? (
          <Empty>
            <EmptyMedia>
              <RiGift2Line />
            </EmptyMedia>
            <EmptyTitle>{filter === "disponibili" ? "Ancora nessun premio disponibile" : "Hai sbloccato tutto"}</EmptyTitle>
            <EmptyDescription>
              {filter === "disponibili" ? PRIZES.length ? `Ti servono ${fmtPoints(PRIZES[0].cost - user.points)} punti per il primo premio. ${pointsRule(venue)}.` : "Il catalogo premi è in preparazione." : "Ogni premio del catalogo è alla tua portata. Scegline uno!"}
            </EmptyDescription>
          </Empty>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {list.map((p) => (
              <li key={p.id}>
                <PrizeCard prize={p} points={user.points} onOpen={() => setOpenId(p.id)} />
              </li>
            ))}
          </ul>
        )}
      </PageBody>

      <Drawer open={!!open} onOpenChange={(o) => !o && setOpenId(null)}>
        <DrawerContent>
          {open && (
            <PrizeDetail
              prize={open}
              points={user.points}
              busy={!!redemption}
              onRedeem={() => {
                startRedeem(open.id, venue.redeemValidityMinutes)
                setOpenId(null)
                navigate("riscatto")
              }}
            />
          )}
        </DrawerContent>
      </Drawer>
    </>
  )
}

function PrizeCard({ prize, points, onOpen }: { prize: Prize; points: number; onOpen: () => void }) {
  const ok = points >= prize.cost
  return (
    <Card size="sm" className="h-full">
      <button onClick={onOpen} className="flex h-full flex-col gap-4 px-4 text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/30">
        <div className="flex items-start gap-3.5">
          <PrizeArt id={prize.id} image={prize.image} category={prize.category} locked={!ok} />
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <span className="font-heading text-base font-semibold">{prize.name}</span>
            <span className="text-xs text-muted-foreground">{prize.note}</span>
          </div>
          {ok ? <Badge variant="success">Disponibile</Badge> : <RiLockLine className="size-4 text-muted-foreground" aria-label="Bloccato" />}
        </div>
        <div className="mt-auto flex flex-col gap-2">
          <div className="flex items-baseline justify-between text-sm">
            <span className="font-heading text-lg font-semibold tabular">
              {fmtPoints(prize.cost)} <span className="text-xs font-medium text-muted-foreground">punti</span>
            </span>
            {!ok && <span className="text-xs text-muted-foreground">mancano {fmtPoints(prize.cost - points)}</span>}
          </div>
          <Progress value={(points / prize.cost) * 100} aria-label={`Progresso verso ${prize.name}`} indicatorClassName={cn(ok && "bg-success")} />
        </div>
      </button>
    </Card>
  )
}

function PrizeDetail({ prize, points, busy, onRedeem }: { prize: Prize; points: number; busy: boolean; onRedeem: () => void }) {
  const { venue } = useStore()
  const ok = points >= prize.cost
  return (
    <>
      <DrawerHeader className="items-center text-center">
        <PrizeArt id={prize.id} image={prize.image} category={prize.category} className="mb-2 size-24" locked={!ok} />
        <DrawerTitle>{prize.name}</DrawerTitle>
        <DrawerDescription>{prize.note}</DrawerDescription>
      </DrawerHeader>
      <div className="flex flex-col gap-3 px-5 py-2">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col gap-0.5 rounded-2xl bg-muted p-3">
            <span className="text-xs text-muted-foreground">Costo</span>
            <span className="font-heading text-lg font-semibold tabular">{fmtPoints(prize.cost)} punti</span>
          </div>
          <div className="flex flex-col gap-0.5 rounded-2xl bg-muted p-3">
            <span className="text-xs text-muted-foreground">Dopo il riscatto</span>
            <span className={cn("font-heading text-lg font-semibold tabular", !ok && "text-muted-foreground")}>{ok ? `${fmtPoints(points - prize.cost)} punti` : "—"}</span>
          </div>
        </div>
        <p className="flex gap-2.5 rounded-2xl bg-success-soft p-3 text-[13px] text-success">
          <RiShieldCheckLine className="size-5 shrink-0" />
          Generi un QR monouso valido {venue.redeemValidityMinutes} minuti. Se non lo usi, i punti restano tuoi.
        </p>
      </div>
      <DrawerFooter>
        {ok ? (
          <Button size="xl" onClick={onRedeem} disabled={busy}>
            <RiQrCodeLine /> {busy ? "Completa prima il riscatto in corso" : "Genera QR di riscatto"}
          </Button>
        ) : (
          <Button size="xl" variant="secondary" disabled>
            <RiLockLine /> Ti mancano {fmtPoints(prize.cost - points)} punti
          </Button>
        )}
      </DrawerFooter>
    </>
  )
}
