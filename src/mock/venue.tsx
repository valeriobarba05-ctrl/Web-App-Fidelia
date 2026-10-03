import * as React from "react"
import { toast } from "sonner"

import { DEFAULT_EVENTS, DEFAULT_PRIZES, DEFAULT_PROMOS, DEFAULT_VENUE } from "@/mock/data"
import type { FideliaEvent, Prize, Promo, Venue } from "@/types"
import { applyTheme } from "@/lib/themes"
import { safeStorage, saveStorage } from "@/lib/utils"

/**
 * Configurazione del locale: la scrive SOLO l'app del titolare (useVenueAdmin),
 * l'app del cliente la legge soltanto (useVenue). Qui simula il server:
 * in produzione è un'API, con scrittura permessa solo all'account titolare.
 */

export type VenueState = { venue: Venue; prizes: Prize[]; promos: Promo[]; events: FideliaEvent[] }
type ListKey = "prizes" | "promos" | "events"

export const DEFAULT_VENUE_STATE: VenueState = { venue: DEFAULT_VENUE, prizes: DEFAULT_PRIZES, promos: DEFAULT_PROMOS, events: DEFAULT_EVENTS }
const VENUE_KEY = "fidelia:venue:v2"

function loadVenue(): VenueState {
  const v = safeStorage(VENUE_KEY, DEFAULT_VENUE_STATE)
  return { ...v, venue: { ...DEFAULT_VENUE, ...v.venue, features: { ...DEFAULT_VENUE.features, ...v.venue?.features }, links: { ...DEFAULT_VENUE.links, ...v.venue?.links } } }
}

const uid = () => Math.random().toString(36).slice(2, 9)

function useSystemDark() {
  const query = "(prefers-color-scheme: dark)"
  const [dark, setDark] = React.useState(() => window.matchMedia?.(query).matches ?? false)
  React.useEffect(() => {
    const mq = window.matchMedia?.(query)
    if (!mq) return
    const on = (e: MediaQueryListEvent) => setDark(e.matches)
    mq.addEventListener("change", on)
    return () => mq.removeEventListener("change", on)
  }, [])
  return dark
}

function useVenueValue() {
  const [state, setState] = React.useState<VenueState>(loadVenue)
  const fromStorage = React.useRef(false)
  const warned = React.useRef(false)

  // Salva (solo se la modifica nasce qui) e avvisa se lo spazio è finito.
  React.useEffect(() => {
    if (fromStorage.current) return void (fromStorage.current = false)
    if (!saveStorage(VENUE_KEY, state)) {
      if (!warned.current) toast.error("Spazio di salvataggio pieno", { description: "Usa immagini più leggere o rimuovine qualcuna." })
      warned.current = true
    } else warned.current = false
  }, [state])

  // Le modifiche del titolare arrivano alle app clienti aperte (altre schede) senza ricaricare.
  React.useEffect(() => {
    const on = (e: StorageEvent) => {
      if (e.key !== VENUE_KEY) return
      fromStorage.current = true
      setState(loadVenue())
    }
    window.addEventListener("storage", on)
    return () => window.removeEventListener("storage", on)
  }, [])

  // Tema: segue il sistema del dispositivo. Solo l'app titolare può forzare un'anteprima.
  const systemDark = useSystemDark()
  const [previewDark, setPreviewDark] = React.useState<boolean | null>(null)
  const dark = previewDark ?? systemDark
  React.useEffect(() => applyTheme(state.venue.brandColor, state.venue.highlightColor, dark), [state.venue.brandColor, state.venue.highlightColor, dark])

  const visible = React.useMemo(
    () => ({
      prizes: state.prizes.filter((p) => p.active !== false).sort((a, b) => a.cost - b.cost),
      promos: state.venue.features.promos ? state.promos.filter((p) => p.active !== false) : [],
      events: state.venue.features.events ? [...state.events].sort((a, b) => a.date.localeCompare(b.date)) : [],
    }),
    [state],
  )

  const admin = React.useMemo(
    () => ({
      updateVenue: (p: Partial<Venue>) => setState((v) => ({ ...v, venue: { ...v.venue, ...p } })),
      upsert: <K extends ListKey>(key: K, item: VenueState[K][number]) =>
        setState((v) => {
          const list = v[key] as { id: string }[]
          return { ...v, [key]: list.some((x) => x.id === item.id) ? list.map((x) => (x.id === item.id ? item : x)) : [...list, item] }
        }),
      remove: (key: ListKey, id: string) => setState((v) => ({ ...v, [key]: (v[key] as { id: string }[]).filter((x) => x.id !== id) })),
      move: (key: ListKey, id: string, dir: -1 | 1) =>
        setState((v) => {
          const list = [...(v[key] as { id: string }[])]
          const i = list.findIndex((x) => x.id === id)
          const j = i + dir
          if (i < 0 || j < 0 || j >= list.length) return v
          ;[list[i], list[j]] = [list[j], list[i]]
          return { ...v, [key]: list }
        }),
      resetVenue: () => setState(DEFAULT_VENUE_STATE),
      newId: uid,
      setPreviewDark,
    }),
    [],
  )

  return { read: { ...state, visible, dark }, admin: { ...admin, previewDark } }
}

type Ctx = ReturnType<typeof useVenueValue>
const VenueContext = React.createContext<Ctx | null>(null)

export function VenueProvider({ children }: { children: React.ReactNode }) {
  const value = useVenueValue()
  return <VenueContext.Provider value={value}>{children}</VenueContext.Provider>
}

function useCtx() {
  const ctx = React.useContext(VenueContext)
  if (!ctx) throw new Error("useVenue outside VenueProvider")
  return ctx
}

/** Lettura dei contenuti del locale (app cliente e titolare). */
export const useVenue = () => useCtx().read

/** Scrittura: da usare SOLO dentro src/owner (app del titolare). */
export const useVenueAdmin = () => useCtx().admin
