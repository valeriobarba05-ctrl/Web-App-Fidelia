import * as React from "react"
import { toast } from "sonner"

import { INITIAL_MOVEMENTS, INITIAL_USER, PRIZES, PROMOS, VENUE, type Movement } from "@/lib/data"
import { applyVenueTheme } from "@/lib/themes"
import { safeStorage, saveStorage } from "@/lib/utils"

type Redemption = { prizeId: string; code: string; expiresAt: number }
type Consents = { marketing: boolean; profiling: boolean; push: boolean }

type State = {
  authed: boolean
  user: typeof INITIAL_USER
  movements: Movement[]
  redemption: Redemption | null
  bookings: Record<string, number>
  consents: Consents
  notify: { promo: boolean; events: boolean }
  venueTheme: string
  dark: boolean
  installed: boolean
}

const INITIAL: State = {
  authed: false,
  user: INITIAL_USER,
  movements: INITIAL_MOVEMENTS,
  redemption: null,
  bookings: {},
  consents: { marketing: true, profiling: false, push: true },
  notify: { promo: false, events: true },
  venueTheme: "emerald",
  dark: false,
  installed: false,
}

const KEY = "fidelia:v1"

function useStoreValue() {
  const [state, setState] = React.useState<State>(() => safeStorage(KEY, INITIAL))

  React.useEffect(() => saveStorage(KEY, state), [state])
  React.useEffect(() => applyVenueTheme(state.venueTheme, state.dark), [state.venueTheme, state.dark])

  const patch = React.useCallback((p: Partial<State> | ((s: State) => Partial<State>)) => {
    setState((s) => ({ ...s, ...(typeof p === "function" ? p(s) : p) }))
  }, [])

  const actions = React.useMemo(
    () => ({
      login: () => patch({ authed: true }),
      logout: () => patch({ authed: false }),
      reset: () => setState({ ...INITIAL, authed: true }),
      setVenueTheme: (venueTheme: string) => patch({ venueTheme }),
      setDark: (dark: boolean) => patch({ dark }),
      setInstalled: (installed: boolean) => patch({ installed }),
      setBirthday: (birthday: string) => patch((s) => ({ user: { ...s.user, birthday } })),
      setConsent: (k: keyof Consents, v: boolean) => patch((s) => ({ consents: { ...s.consents, [k]: v } })),
      setNotify: (k: "promo" | "events", v: boolean) => patch((s) => ({ notify: { ...s.notify, [k]: v } })),

      /** Simula la cassa che scansiona la tessera dopo un conto. */
      registerVisit: (amount: number) => {
        const isDouble = PROMOS.some((p) => p.doublePoints && p.days?.includes(new Date().getDay()))
        const base = Math.floor(amount)
        const now = new Date().toISOString().slice(0, 16)
        const entries: Movement[] = [
          { id: crypto.randomUUID(), label: `Conto · ${amount.toLocaleString("it-IT", { minimumFractionDigits: 2 })} €`, date: now, points: base, kind: "visit" },
        ]
        if (isDouble) entries.unshift({ id: crypto.randomUUID(), label: "Bonus promo punti doppi", date: now, points: base, kind: "bonus" })
        const gained = entries.reduce((a, m) => a + m.points, 0)
        patch((s) => ({
          movements: [...entries, ...s.movements],
          user: { ...s.user, points: s.user.points + gained, totalEarned: s.user.totalEarned + gained, visits: s.user.visits + 1 },
        }))
        return gained
      },

      startRedeem: (prizeId: string) => {
        const code = "RSC-" + Math.random().toString(36).slice(2, 6).toUpperCase()
        patch({ redemption: { prizeId, code, expiresAt: Date.now() + VENUE.redeemValidityMinutes * 60_000 } })
      },
      cancelRedeem: () => patch({ redemption: null }),
      /** La cassa ha scansionato il QR monouso: solo ora i punti vengono scalati. */
      confirmRedeem: () => {
        let prizeName = ""
        patch((s) => {
          const prize = PRIZES.find((p) => p.id === s.redemption?.prizeId)
          if (!prize) return {}
          prizeName = prize.name
          return {
            redemption: null,
            movements: [
              { id: crypto.randomUUID(), label: `Premio riscattato · ${prize.name}`, date: new Date().toISOString().slice(0, 16), points: -prize.cost, kind: "redeem" },
              ...s.movements,
            ],
            user: { ...s.user, points: s.user.points - prize.cost, totalRedeemed: s.user.totalRedeemed + prize.cost },
          }
        })
        return prizeName
      },

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

export function useStore() {
  const ctx = React.useContext(StoreContext)
  if (!ctx) throw new Error("useStore outside StoreProvider")
  return ctx
}

export function nextPrize(points: number) {
  return PRIZES.find((p) => p.cost > points) ?? null
}

export { toast }
