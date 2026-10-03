import * as React from "react"
import { RiFlashlightLine, RiHistoryLine, RiRefreshLine, RiStore2Line } from "@remixicon/react"

import { PageBody, PageHeader } from "@/screens/app-shell"
import { LoyaltyCard } from "@/screens/parts"
import { QrCode } from "@/components/fidelia/qr-code"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { pointsRule } from "@/lib/format"
import { navigate, useNow } from "@/mock/router"
import { DEMO } from "@/mock/demo"
import { toast, useStore } from "@/mock/store"
import { cn } from "@/lib/utils"

/** QR dinamico: si rigenera ogni N secondi, così uno screenshot non vale. */
export function useRotatingCode(seconds: number) {
  const now = useNow(250)
  const cycle = Math.floor(now / (seconds * 1000))
  const left = seconds - ((now / 1000) % seconds)
  return { cycle, left, ratio: left / seconds }
}

export function TesseraScreen() {
  const { user, venue } = useStore()
  const { cycle, left, ratio } = useRotatingCode(venue.qrRefreshSeconds)
  const [bright, setBright] = React.useState(false)

  return (
    <div className={cn("transition-colors duration-500", bright && "min-h-dvh bg-white text-stone-950 [&_[data-slot=card]]:bg-white [&_[data-slot=card]]:text-stone-950 [&_[data-slot=card-description]]:text-stone-600 [&_p]:text-stone-700")}>
      <PageHeader
        title="La tua tessera"
        description="Mostrala in cassa: il codice cambia da solo per sicurezza."
        actions={
          <Button variant="secondary" size="lg" onClick={() => navigate("movimenti")} className="hidden sm:inline-flex">
            <RiHistoryLine /> Movimenti
          </Button>
        }
      />
      <PageBody className="lg:grid lg:grid-cols-[minmax(0,440px)_minmax(0,1fr)] lg:items-start lg:gap-8">
        <LoyaltyCard cut={172} className="mx-auto w-full max-w-[440px]">
          <div className="flex flex-col items-center gap-4 pt-1">
            <div className={cn("w-full rounded-[20px] bg-white p-3 transition-[max-width] duration-500 ease-(--ease-out-expo)", bright ? "max-w-[340px]" : "max-w-[260px]")}>
              <QrCode value={`FIDELIA:${user.cardCode}:${cycle}`} label={`QR della tessera ${user.cardCode}`} />
            </div>
            <div className="flex w-full max-w-[260px] flex-col gap-2">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 opacity-90">
                  <RiRefreshLine className="size-3.5" /> Il codice si rinnova tra
                </span>
                <span className="font-semibold tabular">{Math.ceil(left)}s</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-white/20">
                <div className="h-full origin-left rounded-full bg-highlight transition-transform duration-300 ease-linear" style={{ transform: `scaleX(${ratio})` }} />
              </div>
            </div>
            <span className="font-heading text-lg font-semibold tracking-[0.18em] tabular">{user.cardCode}</span>
          </div>
        </LoyaltyCard>

        <div className="flex flex-col gap-4">
          <Card size="sm">
            <CardContent className="flex items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-warning-soft text-warning">
                <RiFlashlightLine className="size-5" />
              </span>
              <Label htmlFor="bright" className="flex-1 flex-col items-start gap-0.5">
                <span>Luminosità massima</span>
                <span className="text-xs font-normal text-muted-foreground">Sfondo bianco e QR più grande, per lo scanner</span>
              </Label>
              <Switch id="bright" checked={bright} onCheckedChange={setBright} />
            </CardContent>
          </Card>

          <Card size="sm">
            <CardHeader>
              <CardTitle>Come funziona</CardTitle>
              <CardDescription>{pointsRule(venue)}. I punti arrivano appena il personale scansiona il QR.</CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="flex flex-col gap-3 text-sm">
                {["Apri la tessera prima di pagare", "Il personale scansiona il QR", "Vedi i punti aggiornarsi qui, subito"].map((s, i) => (
                  <li key={s} className="flex items-center gap-3">
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted font-heading text-xs font-semibold">{i + 1}</span>
                    {s}
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          {DEMO && <SimulateVisit />}
        </div>
      </PageBody>
    </div>
  )
}

function SimulateVisit() {
  const { registerVisit, venueState } = useStore()
  const [open, setOpen] = React.useState(false)
  const [amount, setAmount] = React.useState("42,00")
  const value = Number(amount.replace(/\./g, "").replace(",", "."))
  const invalid = !Number.isFinite(value) || value <= 0 || value > 2000

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Card size="sm" className="border border-dashed bg-transparent shadow-none ring-0">
        <CardContent className="flex items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted">
            <RiStore2Line className="size-5" />
          </span>
          <div className="flex flex-1 flex-col gap-0.5">
            <span className="text-sm font-medium">Prova la scansione in cassa</span>
            <span className="text-xs text-muted-foreground">Demo: simula un conto e guarda il saldo aggiornarsi</span>
          </div>
          <DialogTrigger asChild>
            <Button variant="outline" size="lg">
              Simula
            </Button>
          </DialogTrigger>
        </CardContent>
      </Card>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Simula una visita</DialogTitle>
          <DialogDescription>Inserisci l'importo del conto, come farebbe la cassa dopo aver letto il QR.</DialogDescription>
        </DialogHeader>
        <form
          id="visit"
          className="flex flex-col gap-2"
          onSubmit={(e) => {
            e.preventDefault()
            if (invalid) return
            const gained = registerVisit(value, venueState)
            setOpen(false)
            toast.success(`+${gained} punti accreditati`, { description: `Conto da ${value.toLocaleString("it-IT", { minimumFractionDigits: 2 })} €` })
          }}
        >
          <Label htmlFor="amount">Importo del conto (€)</Label>
          <Input id="amount" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} aria-invalid={invalid} autoFocus />
          {invalid && <p className="text-xs text-destructive">Inserisci un importo tra 0,01 € e 2.000 €.</p>}
        </form>
        <DialogFooter>
          <Button type="submit" form="visit" size="lg" disabled={invalid}>
            Accredita punti
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
