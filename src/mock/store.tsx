import * as React from "react"
import { toast } from "sonner"

import { INITIAL_MOVEMENTS, INITIAL_USER } from "@/mock/data"
import type { Movement, Prize } from "@/types"
import { safeStorage, saveStorage } from "@/lib/utils"
import { useSession } from "@/mock/session"
import { useVenue, type VenueState } from "@/mock/venue"

/**
 * Stato del CLIENTE: il suo account, punti, riscatti, prenotazioni, consensi.
 * Nessuna impostazione dell'app: tema, colori e contenuti li decide il locale (src/owner).
 */

type Redemption = { prizeId: string; code: string; expiresAt: number }
type Consents = { marketing: boolean; profiling: boolean; push: boolean }

type CustomerState = {
  user: typeof INITIAL_USER
  movements: Movement[]
  redemption: Redemption | null
  bookings: Record<string, number>
  consents: Consents
  notify: { promo: boolean; events: boolean }
  /** tessera già aggiunta al wallet (in produzione: lo sa il server dal callback di Apple/Google) */
  wallet: { apple: boolean; google: boolean }
}

const INITIAL: CustomerState = {
  user: INITIAL_USER,
  movements: INITIAL_MOVEMENTS,
  redemption: null,
  bookings: {},
  consents: { marketing: true, profiling: false, push: true },
  notify: { promo: false, events: true },
  wallet: { apple: false, google: false },
}

const KEY = "fidelia:cliente:v1"
const uid = () => Math.random().toString(36).slice(2, 9)

function useStoreValue() {
  const [state, setState] = React.useState<CustomerState>(() => safeStorage(KEY, INITIAL))
  React.useEffect(() => void saveStorage(KEY, state), [state])

  const patch = React.useCallback((p: Partial<CustomerState> | ((s: CustomerState) => Partial<CustomerState>)) => {
    setState((s) => ({ ...s, ...(typeof p === "function" ? p(s) : p) }))
  }, [])

  const actions = React.useMemo(
    () => ({
      setBirthday: (birthday: string) => patch((s) => ({ user: { ...s.user, birthday } })),
      setConsent: (k: keyof Consents, v: boolean) => patch((s) => ({ consents: { ...s.consents, [k]: v } })),
      setNotify: (k: "promo" | "events", v: boolean) => patch((s) => ({ notify: { ...s.notify, [k]: v } })),
      /** Demo. In produzione: Apple → scarica il .pkpass firmato dal server; Google → apre il link "Save to Google Wallet" (JWT firmato). */
      addToWallet: (p: "apple" | "google") => patch((s) => ({ wallet: { ...(s.wallet ?? { apple: false, google: false }), [p]: true } })),

      /** Demo: simula la cassa che scansiona la tessera dopo un conto. */
      registerVisit: (amount: number, venue: VenueState) => {
        const isDouble = venue.promos.some((p) => p.active !== false && p.doublePoints && p.days?.includes(new Date().getDay()))
        const base = Math.floor(amount * venue.venue.pointsPerEuro)
        const now = new Date().toISOString().slice(0, 16)
        const entries: Movement[] = [{ id: uid(), label: `Conto · ${amount.toLocaleString("it-IT", { minimumFractionDigits: 2 })} €`, date: now, points: base, kind: "visit" }]
        if (isDouble) entries.unshift({ id: uid(), label: "Bonus promo punti doppi", date: now, points: base, kind: "bonus" })
        const gained = entries.reduce((a, m) => a + m.points, 0)
        patch((s) => ({
          movements: [...entries, ...s.movements],
          user: { ...s.user, points: s.user.points + gained, totalEarned: s.user.totalEarned + gained, visits: s.user.visits + 1 },
        }))
        return gained
      },

      startRedeem: (prizeId: string, minutes: number) => {
        const code = "RSC-" + Math.random().toString(36).slice(2, 6).toUpperCase()
        patch({ redemption: { prizeId, code, expiresAt: Date.now() + minutes * 60_000 } })
      },
      cancelRedeem: () => patch({ redemption: null }),
      /** La cassa ha scansionato il QR monouso: solo ora i punti vengono scalati. */
      confirmRedeem: (prize: Prize) =>
        patch((s) => ({
          redemption: null,
          movements: [{ id: uid(), label: `Premio riscattato · ${prize.name}`, date: new Date().toISOString().slice(0, 16), points: -prize.cost, kind: "redeem" }, ...s.movements],
          user: { ...s.user, points: s.user.points - prize.cost, totalRedeemed: s.user.totalRedeemed + prize.cost },
        })),

      book: (eventId: string, guests: number) => patch((s) => ({ bookings: { ...s.bookings, [eventId]: guests } })),
      cancelBooking: (eventId: string) =>
        patch((s) => {
          const bookings = { ...s.bookings }
          delete bookings[eventId]
          return { bookings }
        }),
    }),
    [patch],
  )

  return { ...state, ...actions }
}

type Store = ReturnType<typeof useStoreValue>
const StoreContext = React.createContext<Store | null>(null)

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const value = useStoreValue()
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

/** Stato del cliente + contenuti del locale in sola lettura. */
export function useStore() {
  const ctx = React.useContext(StoreContext)
  if (!ctx) throw new Error("useStore outside StoreProvider")
  const venue = useVenue()
  const session = useSession()
  return { ...ctx, ...venue, venueState: venue as VenueState, account: session.account, logout: session.signOut }
}

export function nextPrize(prizes: Prize[], points: number) {
  return prizes.find((p) => p.cost > points) ?? null
}

export { toast }
