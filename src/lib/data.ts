/** Contenuti del locale. In produzione arrivano dal pannello del ristoratore. */

export type Prize = { id: string; name: string; cost: number; note: string; category: "bar" | "cucina" | "esperienza"; image?: string; active?: boolean }
export type Promo = { id: string; label: string; title: string; text: string; validity: string; doublePoints?: boolean; days?: number[]; image?: string; active?: boolean }
export type EventType = "karaoke" | "natale" | "live" | "degustazione"
export type FideliaEvent = {
  id: string
  type: EventType
  typeLabel: string
  title: string
  date: string // ISO
  time: string
  description: string
  price: string
  bonusPoints: number
  seats: number
  seatsLeft: number
  image?: string
}
export type Movement = { id: string; label: string; date: string; points: number; kind: "visit" | "bonus" | "redeem" | "gift" }

export const DEFAULT_VENUE = {
  name: "Osteria del Porto",
  logo: "" as string,
  cover: "" as string,
  mapImage: "" as string,
  initials: "OP",
  tagline: "La tua tessera fedeltà: punti a ogni visita, premi quando vuoi tu.",
  pointsPerEuro: 1,
  welcomePoints: 50,
  brandColor: "#007a55",
  highlightColor: "#f2b036",
  ownerPin: "1234",
  features: { events: true, promos: true, reviews: true, birthday: true, booking: true },
  qrRefreshSeconds: 30,
  redeemValidityMinutes: 10,
  address: "[Via e numero civico], [Città]",
  phone: "",
  links: {
    menu: "",
    maps: "https://www.google.com/maps/search/Osteria+del+Porto",
    review: "https://www.google.com/search?q=Osteria+del+Porto+recensioni",
    instagram: "https://www.instagram.com/",
    facebook: "",
    tiktok: "",
    whatsapp: "",
    privacy: "",
  },
  // 0 = domenica … 6 = sabato; ogni fascia [apertura, chiusura] in minuti
  hours: [
    { day: "Domenica", slots: [[750, 930]] },
    { day: "Lunedì", slots: [] },
    { day: "Martedì", slots: [[1140, 1410]] },
    { day: "Mercoledì", slots: [[1140, 1410]] },
    { day: "Giovedì", slots: [[1140, 1410]] },
    { day: "Venerdì", slots: [[750, 900], [1140, 1440]] },
    { day: "Sabato", slots: [[750, 900], [1140, 1440]] },
  ] as { day: string; slots: [number, number][] }[],
}

export const DEFAULT_PRIZES: Prize[] = [
  { id: "caffe", name: "Caffè o amaro", cost: 100, note: "A fine pasto, al banco o al tavolo", category: "bar" },
  { id: "vino", name: "Calice di vino", cost: 300, note: "Rosso o bianco della casa", category: "bar" },
  { id: "dolce", name: "Dolce della casa", cost: 400, note: "Tiramisù, cannolo o semifreddo", category: "cucina" },
  { id: "antipasto", name: "Antipasto misto", cost: 600, note: "Per due persone, dal menù del giorno", category: "cucina" },
  { id: "cena", name: "Cena per due", cost: 1500, note: "Menù degustazione, bevande escluse", category: "esperienza" },
]

export const DEFAULT_PROMOS: Promo[] = [
  {
    id: "pizza",
    label: "Promo del mese",
    title: "Martedì pizza + birra a 12 €",
    text: "Ogni martedì sera pizza a scelta e birra media. Mostra la tessera e accumuli il doppio dei punti.",
    validity: "Valida fino al 31 ottobre",
    doublePoints: true,
    days: [2],
  },
  { id: "dolce", label: "Solo per iscritti", title: "Dolce omaggio con 2 secondi", text: "Ordina due secondi piatti: il dolce lo offriamo noi.", validity: "Lun–gio · fino al 31/10" },
  { id: "bday", label: "Compleanno", title: "Calice di bollicine in regalo", text: "Festeggia da noi: un calice di bollicine per te, nella settimana del tuo compleanno.", validity: "Nella settimana del tuo compleanno" },
]

export const DEFAULT_EVENTS: FideliaEvent[] = [
  { id: "karaoke", type: "karaoke", typeLabel: "Karaoke", title: "Karaoke Night", date: "2026-10-17", time: "21:30", description: "Microfono aperto per tutti, playlist a richiesta e premio alla voce della serata.", price: "Ingresso libero", bonusPoints: 50, seats: 60, seatsLeft: 14 },
  { id: "live", type: "live", typeLabel: "Musica live", title: "Live acustico sotto le stelle", date: "2026-10-24", time: "21:00", description: "Chitarra e voce dal vivo con cena alla carta.", price: "Ingresso libero", bonusPoints: 30, seats: 50, seatsLeft: 22 },
  { id: "vini", type: "degustazione", typeLabel: "Degustazione", title: "Serata vini dell'Etna", date: "2026-10-30", time: "20:00", description: "Quattro calici guidati dal sommelier con taglieri del territorio.", price: "35 € a persona", bonusPoints: 70, seats: 24, seatsLeft: 6 },
  { id: "natale", type: "natale", typeLabel: "Natale", title: "Cena della Vigilia", date: "2026-12-24", time: "20:30", description: "Menù di pesce della tradizione. Posti limitati.", price: "55 € a persona", bonusPoints: 100, seats: 40, seatsLeft: 3 },
]

export const INITIAL_USER = {
  firstName: "Giulia",
  lastName: "Russo",
  email: "giulia@email.it",
  cardCode: "FDL-4821",
  memberSince: "14 settembre 2026",
  birthday: "1994-05-12",
  points: 340,
  totalEarned: 1240,
  totalRedeemed: 900,
  visits: 27,
}

export const INITIAL_MOVEMENTS: Movement[] = [
  { id: "m1", label: "Cena · 42,00 €", date: "2026-10-02T21:14", points: 42, kind: "visit" },
  { id: "m2", label: "Bonus promo punti doppi", date: "2026-10-01T20:30", points: 28, kind: "bonus" },
  { id: "m3", label: "Pranzo · 28,00 €", date: "2026-10-01T13:05", points: 28, kind: "visit" },
  { id: "m4", label: "Premio riscattato · Caffè", date: "2026-09-28T13:40", points: -100, kind: "redeem" },
  { id: "m5", label: "Cena · 64,50 €", date: "2026-09-21T21:50", points: 64, kind: "visit" },
  { id: "m6", label: "Regalo di benvenuto", date: "2026-09-14T19:02", points: 50, kind: "gift" },
]

export const EVENT_ART: Record<EventType, string> = {
  karaoke: "./events/karaoke.svg",
  natale: "./events/natale.svg",
  live: "./events/live.svg",
  degustazione: "./events/degustazione.svg",
}

const MONTHS = ["gen", "feb", "mar", "apr", "mag", "giu", "lug", "ago", "set", "ott", "nov", "dic"]
const WEEKDAYS = ["Domenica", "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato"]
export function eventDate(iso: string) {
  const d = new Date(iso + "T12:00")
  return { day: String(d.getDate()), month: MONTHS[d.getMonth()], weekday: WEEKDAYS[d.getDay()] }
}

export const fmtMinutes = (m: number) =>
  `${String(Math.floor(m / 60) % 24).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`

export type Venue = typeof DEFAULT_VENUE
export type Hours = Venue["hours"]

export const pointsRule = (v: Venue) => (v.pointsPerEuro === 1 ? "1 € speso = 1 punto" : `1 € speso = ${v.pointsPerEuro.toLocaleString("it-IT")} punti`)

/** Stato apertura calcolato dagli orari reali, non una stringa fissa. */
export function openState(hours: Hours, now = new Date()) {
  const day = now.getDay()
  const mins = now.getHours() * 60 + now.getMinutes()
  const slot = hours[day].slots.find(([a, b]) => mins >= a && mins < b)
  if (slot) return { open: true, label: `Aperto ora · chiude alle ${fmtMinutes(slot[1])}` }
  for (let i = 0; i < 7; i++) {
    const d = (day + i) % 7
    const next = hours[d].slots.find(([a]) => i > 0 || a > mins)
    if (next) {
      const when = i === 0 ? "oggi" : i === 1 ? "domani" : hours[d].day.toLowerCase()
      return { open: false, label: `Chiuso · apre ${when} alle ${fmtMinutes(next[0])}` }
    }
  }
  return { open: false, label: "Chiuso" }
}

export function fmtMovementDate(iso: string) {
  const d = new Date(iso)
  return `${d.getDate()} ${MONTHS[d.getMonth()]}, ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`
}
export function monthKey(iso: string) {
  const d = new Date(iso)
  const m = d.toLocaleDateString("it-IT", { month: "long", year: "numeric" })
  return m.charAt(0).toUpperCase() + m.slice(1)
}
