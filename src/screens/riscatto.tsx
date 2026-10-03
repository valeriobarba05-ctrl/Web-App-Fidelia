import * as React from "react"
import { RiCheckboxCircleFill, RiErrorWarningLine, RiGift2Line, RiHourglassLine, RiStore2Line } from "@remixicon/react"

import { PageBody, PageHeader } from "@/components/fidelia/app-shell"
import { PointsOdometer } from "@/components/fidelia/points-odometer"
import { PrizeArt } from "@/components/fidelia/prize-art"
import { QrCode } from "@/components/fidelia/qr-code"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Empty, EmptyDescription, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { PRIZES, VENUE } from "@/lib/data"
import { navigate, useNow } from "@/lib/router"
import { toast, useStore } from "@/lib/store"
import { cn } from "@/lib/utils"

export function RiscattoScreen() {
  const { user, redemption, cancelRedeem, confirmRedeem, startRedeem } = useStore()
  const [done, setDone] = React.useState<string | null>(null)
  const now = useNow(500)

  if (done)
    return (
      <>
        <PageHeader title="Premio riscattato" back="premi" />
        <PageBody className="max-w-xl">
          <Card className="items-center gap-4 text-center">
            <CardContent className="flex flex-col items-center gap-4 py-4">
              <RiCheckboxCircleFill className="size-16 animate-pop text-success" />
              <h2 className="font-heading text-2xl font-semibold">Buon appetito!</h2>
              <p className="max-w-xs text-sm text-muted-foreground">
                <strong className="text-foreground">{done}</strong> è stato registrato in cassa. Ecco il tuo nuovo saldo:
              </p>
              <PointsOdometer value={user.points} className="text-5xl text-primary" />
              <div className="flex w-full flex-col gap-2 sm:flex-row">
                <Button size="xl" className="flex-1" onClick={() => navigate("premi")}>
                  Torna ai premi
                </Button>
                <Button size="xl" variant="secondary" className="flex-1" onClick={() => navigate("movimenti")}>
                  Vedi movimenti
                </Button>
              </div>
            </CardContent>
          </Card>
        </PageBody>
      </>
    )

  if (!redemption)
    return (
      <>
        <PageHeader title="Riscatta premio" back="premi" />
        <PageBody className="max-w-xl">
          <Empty>
            <EmptyMedia>
              <RiGift2Line />
            </EmptyMedia>
            <EmptyTitle>Nessun riscatto in corso</EmptyTitle>
            <EmptyDescription>Scegli un premio dal catalogo per generare il QR monouso da mostrare in cassa.</EmptyDescription>
            <Button size="lg" onClick={() => navigate("premi")}>
              Vai ai premi
            </Button>
          </Empty>
        </PageBody>
      </>
    )

  const prize = PRIZES.find((p) => p.id === redemption.prizeId)!
  const leftMs = Math.max(0, redemption.expiresAt - now)
  const expired = leftMs === 0
  const mm = String(Math.floor(leftMs / 60000)).padStart(2, "0")
  const ss = String(Math.floor((leftMs % 60000) / 1000)).padStart(2, "0")
  const ratio = leftMs / (VENUE.redeemValidityMinutes * 60000)

  return (
    <>
      <PageHeader title="Riscatta premio" back="premi" />
      <PageBody className="lg:grid lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:items-start lg:gap-8">
        <Card className="items-stretch gap-5 rounded-[28px]">
          <CardContent className="flex flex-col items-center gap-5">
            <div className="flex w-full items-center gap-3">
              <PrizeArt id={prize.id} className="size-[52px]" />
              <div className="flex flex-1 flex-col">
                <span className="font-heading text-[17px] font-semibold">{prize.name}</span>
                <span className="text-[13px] text-muted-foreground">−{prize.cost} punti dopo la scansione</span>
              </div>
            </div>

            {expired ? (
              <Badge variant="destructive" size="lg">
                <RiErrorWarningLine /> Codice scaduto
              </Badge>
            ) : (
              <Badge variant="warning" size="lg">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-highlight opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-highlight" />
                </span>
                In attesa di scansione
              </Badge>
            )}

            <div className={cn("relative w-full max-w-[250px] rounded-[22px] border-2 border-dashed p-3 transition-[filter,opacity] duration-500", expired && "opacity-40 blur-[3px]")}>
              <QrCode value={`FIDELIA-RISCATTO:${redemption.code}`} label="QR monouso per il riscatto del premio" />
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="font-heading text-xl font-semibold tracking-[0.18em] tabular">{redemption.code}</span>
              <span className="text-xs text-muted-foreground">QR monouso · valido una sola volta</span>
            </div>

            <div className="flex w-full flex-col gap-2 rounded-2xl bg-muted p-3.5">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <RiHourglassLine className="size-4" /> Scade tra
                </span>
                <span className="font-heading text-lg font-semibold tabular">
                  {mm}:{ss}
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-background">
                <div className="h-full origin-left rounded-full bg-primary transition-transform duration-500 ease-linear" style={{ transform: `scaleX(${ratio})` }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-3">
          {expired ? (
            <Button size="xl" onClick={() => startRedeem(prize.id)}>
              Genera un nuovo codice
            </Button>
          ) : (
            <Card size="sm" className="border border-dashed bg-transparent shadow-none ring-0">
              <CardContent className="flex items-center gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted">
                  <RiStore2Line className="size-5" />
                </span>
                <div className="flex flex-1 flex-col gap-0.5">
                  <span className="text-sm font-medium">Demo cassa</span>
                  <span className="text-xs text-muted-foreground">Simula la scansione del QR monouso</span>
                </div>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    const name = prize.name
                    confirmRedeem()
                    setDone(name)
                    toast.success(`Premio riscattato · −${prize.cost} punti`)
                  }}
                >
                  Scansiona
                </Button>
              </CardContent>
            </Card>
          )}

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive" size="xl">
                Annulla riscatto
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Annullare il riscatto?</DialogTitle>
                <DialogDescription>Il QR smette di funzionare. I tuoi {user.points} punti restano intatti e puoi riscattare quando vuoi.</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="secondary" size="lg">
                    Tieni il codice
                  </Button>
                </DialogClose>
                <Button
                  variant="destructive"
                  size="lg"
                  onClick={() => {
                    cancelRedeem()
                    navigate("premi")
                    toast("Riscatto annullato", { description: "Nessun punto è stato scalato." })
                  }}
                >
                  Annulla riscatto
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <p className="px-1 text-sm text-muted-foreground">I punti vengono scalati solo dopo la scansione in cassa. Se chiudi l'app, ritrovi il codice nella Home finché è valido.</p>
        </div>
      </PageBody>
    </>
  )
}
