/**
 * DATI DI ESEMPIO (mock). In produzione arrivano dall'API.
 * Servono solo a far vedere le schermate con contenuti realistici.
 */
import type { Customer, FideliaEvent, Movement, Prize, Promo, Venue } from "@/types"

export const DEFAULT_VENUE: Venue = {
  name: "Osteria del Porto",
  logo: "",
  cover: "",
  mapImage: "",
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
  ],
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

export const INITIAL_USER: Customer = {
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

