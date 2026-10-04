/**
 * Versioni "collegate" dei componenti del design system: leggono i dati dallo stato demo (src/mock).
 * Lo sviluppatore le riscrive collegandole all'API; i componenti puri restano invariati.
 */
import * as React from "react"

import { RiArrowRightSLine, RiCheckboxCircleFill, RiWallet3Line } from "@remixicon/react"

import { TicketCard, VenueMark } from "@/components/fidelia/loyalty-card"
import { suggestedWallets, WalletButton, WalletPassPreview, type WalletPlatform } from "@/components/fidelia/wallet"
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item"
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { haptic } from "@/lib/utils"
import { nextPrize, toast, useStore } from "@/mock/store"
import { useVenue } from "@/mock/venue"

export function BrandMark({ className }: { className?: string }) {
  const { venue } = useVenue()
  return <VenueMark initials={venue.initials} logo={venue.logo} className={className} />
}

/** La tessera del cliente collegato. */
export function LoyaltyCard({ children, className, cut, stamps }: { children?: React.ReactNode; className?: string; cut?: number; stamps?: boolean }) {
  const { user, visible, venue } = useStore()
  return (
    <TicketCard
      venue={venue}
      member={{ name: `${user.firstName} ${user.lastName}`, code: user.cardCode, points: user.points }}
      next={nextPrize(visible.prizes, user.points)}
      className={className}
      cut={cut}
      stamps={stamps}
    >
      {children}
    </TicketCard>
  )
}

/** Pulsanti wallet del cliente collegato (piattaforma suggerita in base al telefono). */
export function WalletButtons({ className }: { className?: string }) {
  const { wallet, addToWallet } = useStore()
  const add = (p: WalletPlatform) => {
    addToWallet(p)
    haptic()
    toast.success(p === "apple" ? "Tessera aggiunta ad Apple Wallet" : "Tessera aggiunta a Google Wallet", { description: "Il saldo si aggiorna da solo a ogni visita. (demo)" })
  }
  return (
    <div className={className ?? "flex flex-wrap gap-2"}>
      {suggestedWallets().map((p) => (
        <WalletButton key={p} platform={p} added={wallet?.[p]} onClick={() => add(p)} />
      ))}
    </div>
  )
}

/** Riga in Home: invita ad aggiungere la tessera al wallet; apre il foglio con anteprima e pulsanti. */
export function AddToWalletRow() {
  const { user, venue, visible, wallet, venueState } = useStore()
  const [open, setOpen] = React.useState(false)
  const inWallet = wallet?.apple || wallet?.google
  const next = nextPrize(visible.prizes, user.points)
  return (
    <>
      <Item variant="outline" asChild>
        <button onClick={() => setOpen(true)}>
          <ItemMedia variant="icon" className="bg-inverted text-inverted-foreground">
            <RiWallet3Line />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>{inWallet ? "La tessera è nel tuo wallet" : "Aggiungi la tessera al wallet"}</ItemTitle>
            <ItemDescription className="text-xs">{inWallet ? "Si aggiorna da sola a ogni visita" : "Sempre con te, anche senza aprire l'app"}</ItemDescription>
          </ItemContent>
          {inWallet ? <RiCheckboxCircleFill className="size-5 text-success" aria-label="Aggiunta" /> : <RiArrowRightSLine className="size-5 text-muted-foreground" />}
        </button>
      </Item>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>La tua tessera nel wallet</DrawerTitle>
            <DrawerDescription>Mostrala in cassa direttamente dal wallet del telefono. Saldo e premi si aggiornano da soli.</DrawerDescription>
          </DrawerHeader>
          <div className="flex flex-col gap-5 overflow-y-auto overscroll-contain px-5 pb-6">
            <WalletPassPreview
              venue={venue}
              member={{ name: `${user.firstName} ${user.lastName}`, code: user.cardCode, points: user.points }}
              nextPrize={next?.name}
              image={venueState.venue.walletImage}
            />
            <WalletButtons className="flex flex-wrap justify-center gap-2" />
          </div>
        </DrawerContent>
      </Drawer>
    </>
  )
}
