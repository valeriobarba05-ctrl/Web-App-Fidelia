import * as React from "react"
import { toast } from "sonner"

import {
  DEFAULT_EVENTS,
  DEFAULT_PRIZES,
  DEFAULT_PROMOS,
  DEFAULT_VENUE,
  INITIAL_MOVEMENTS,
  INITIAL_USER,
  type FideliaEvent,
  type Movement,
  type Prize,
  type Promo,
  type Venue,
} from "@/lib/data"
import { applyTheme } from "@/lib/themes"
import { safeStorage, saveStorage } from "@/lib/utils"

type Redemption = { prizeId: string; code: string; expiresAt: number }
type Consents = { marketing: boolean; profiling: boolean; push: boolean }
export type Role = "cliente" | "titolare"

/** Stato del cliente (in produzione: account del cliente). */
type CustomerState = {
  authed: boolean
  role: Role
  user: typeof INITIAL_USER
  movements: Movement[]
  redemption: Redemption | null
  bookings: Record<string, number>
  consents: Consents
  notify: { promo: boolean; events: boolean }
  dark: boolean
}

/** Configurazione del locale (in produzione: pannello del titolare, lato server). */
export type VenueState = { venue: Venue; prizes: Prize[]; promos: Promo[]; events: FideliaEvent[] }

const INITIAL: CustomerState = {
  authed: false,
  role: "cliente",
  user: INITIAL_USER,
  movements: INITIAL_MOVEMENTS,
  redemption: null,
  bookings: {},
  consents: { marketing: true, profiling: false, push: true },
  notify: { promo: false, events: true },
  dark: false,
}

export const DEFAULT_VENUE_STATE: VenueState = { venue: DEFAULT_VENUE, prizes: DEFAULT_PRIZES, promos: DEFAULT_PROMOS, events: DEFAULT_EVENTS }

const KEY = "fidelia:v2"
const VENUE_KEY = "fidelia:venue:v2"

const uid = () => Math.random().toString(36).slice(2, 9)

function loadVenue(): VenueState {
  const v = safeStorage(VENUE_KEY, DEFAULT_VENUE_STATE)
  return { ...v, venue: { ...DEFAULT_VENUE, ...v.venue, features: { ...DEFAULT_VENUE.features, ...v.venue?.features }, links: { ...DEFAULT_VENUE.links, ...v.venue?.links } } }
}

function useStoreValue() {
  const [state, setState] = React.useState<CustomerState>(() => safeStorage(KEY, INITIAL))
  const [venueState, setVenueState] = React.useState<VenueState>(loadVenue)
  const warned = React.useRef(false)

  React.useEffect(() => void saveStorage(KEY, state), [state])
  React.useEffect(() => {
    if (!saveStorage(VENUE_KEY, venueState) && !warned.current) {
      warned.current = true
      toast.error("Spazio di salvataggio pieno", { description: "Le ultime modifiche restano finché non ricarichi. Usa immagini più leggere o rimuovine qualcuna." })
    } else warned.current = false
  }, [venueState])
  React.useEffect(
    () => applyTheme(venueState.venue.brandColor, venueState.venue.highlightColor, state.dark),
    [venueState.venue.brandColor, venueState.venue.highlightColor, state.dark],
  )

  const patch = React.useCallback((p: Partial<CustomerState> | ((s: CustomerState) => Partial<CustomerState>)) => {
    setState((s) => ({ ...s, ...(typeof p === "function" ? p(s) : p) }))
  }, [])

  const actions = React.useMemo(
    () => ({
      login: () => patch({ authed: true, role: "cliente" }),
      loginOwner: () => patch({ authed: true, role: "titolare" }),
      leaveOwner: () => patch({ role: "cliente" }),
      logout: () => patch({ authed: false, role: "cliente" }),
      setDark: (dark: boolean) => patch({ dark }),
      setBirthday: (birthday: string) => patch((s) => ({ user: { ...s.user, birthday } })),
      setConsent: (k: keyof Consents, v: boolean) => patch((s) => ({ consents: { ...s.consents, [k]: v } })),
      setNotify: (k: "promo" | "events", v: boolean) => patch((s) => ({ notify: { ...s.notify, [k]: v } })),

      /** Simula la cassa che scansiona la tessera dopo un conto. */
      registerVisit: (amount: number, venue: VenueState) => {
        const isDouble = venue.promos.some((p) => p.active !== false && p.doublePoints && p.days?.includes(new Date().getDay()))
        const base = Math.floor(amount * venue.venue.pointsPerEuro)
        const now = new Date().toISOString().slice(0, 16)
        const entries: Movement[] = [
          { id: uid(), label: `Conto · ${amount.toLocaleString("it-IT", { minimumFractionDigits: 2 })} €`, date: now, points: base, kind: "visit" },
        ]
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

      // ——— Titolare ———
      updateVenue: (p: Partial<Venue>) => setVenueState((v) => ({ ...v, venue: { ...v.venue, ...p } })),
      upsert: <K extends "prizes" | "promos" | "events">(key: K, item: VenueState[K][number]) =>
        setVenueState((v) => {
          const list = v[key] as { id: string }[]
          const exists = list.some((x) => x.id === item.id)
          return { ...v, [key]: exists ? list.map((x) => (x.id === item.id ? item : x)) : [...list, item] }
        }),
      remove: (key: "prizes" | "promos" | "events", id: string) => setVenueState((v) => ({ ...v, [key]: (v[key] as { id: string }[]).filter((x) => x.id !== id) })),
      move: (key: "prizes" | "promos" | "events", id: string, dir: -1 | 1) =>
        setVenueState((v) => {
          const list = [...(v[key] as { id: string }[])]
          const i = list.findIndex((x) => x.id === id)
          const j = i + dir
          if (i < 0 || j < 0 || j >= list.length) return v
          ;[list[i], list[j]] = [list[j], list[i]]
          return { ...v, [key]: list }
        }),
      resetVenue: () => setVenueState(DEFAULT_VENUE_STATE),
      newId: uid,
    }),
    [patch],
  )

  // Il cliente vede solo i contenuti attivi; il titolare li gestisce tutti.
  const visible = React.useMemo(
    () => ({
      prizes: venueState.prizes.filter((p) => p.active !== false).sort((a, b) => a.cost - b.cost),
      promos: venueState.venue.features.promos ? venueState.promos.filter((p) => p.active !== false) : [],
      events: venueState.venue.features.events ? [...venueState.events].sort((a, b) => a.date.localeCompare(b.date)) : [],
    }),
    [venueState],
  )

  return { ...state, ...actions, ...venueState, visible, venueState }
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

export function nextPrize(prizes: Prize[], points: number) {
  return prizes.find((p) => p.cost > points) ?? null
}

export { toast }
