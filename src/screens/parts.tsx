/**
 * Versioni "collegate" dei componenti del design system: leggono i dati dallo stato demo (src/mock).
 * Lo sviluppatore le riscrive collegandole all'API; i componenti puri restano invariati.
 */
import * as React from "react"

import { TicketCard, VenueMark } from "@/components/fidelia/loyalty-card"
import { nextPrize, useStore } from "@/mock/store"
import { useVenue } from "@/mock/venue"

export function BrandMark({ className }: { className?: string }) {
  const { venue } = useVenue()
  return <VenueMark initials={venue.initials} logo={venue.logo} className={className} />
}

/** La tessera del cliente collegato. */
export function LoyaltyCard({ children, className, cut }: { children?: React.ReactNode; className?: string; cut?: number }) {
  const { user, visible, venue } = useStore()
  return (
    <TicketCard
      venue={venue}
      member={{ name: `${user.firstName} ${user.lastName}`, code: user.cardCode, points: user.points }}
      next={nextPrize(visible.prizes, user.points)}
      className={className}
      cut={cut}
    >
      {children}
    </TicketCard>
  )
}
