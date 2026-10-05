/**
 * Tipi del dominio Fidelia: sono il "contratto" fra il design e il backend.
 * Le schermate si aspettano dati con questa forma; l'API deve restituirli così (o va adattata qui).
 */

export type Prize = {
  id: string
  name: string
  /** costo in punti */
  cost: number
  note: string
  category: "bar" | "cucina" | "esperienza"
  /** URL immagine (quadrata). Se assente si usa l'icona della categoria. */
  image?: string
  /** false = nascosto ai clienti */
  active?: boolean
}

export type Promo = {
  id: string
  label: string
  title: string
  text: string
  validity: string
  doublePoints?: boolean
  /** giorni attivi: 0 = domenica … 6 = sabato */
  days?: number[]
  /** URL immagine 16:9 */
  image?: string
  active?: boolean
}

export type EventType = "karaoke" | "natale" | "live" | "degustazione"

export type FideliaEvent = {
  id: string
  type: EventType
  typeLabel: string
  title: string
  /** YYYY-MM-DD */
  date: string
  /** HH:MM */
  time: string
  description: string
  price: string
  bonusPoints: number
  seats: number
  seatsLeft: number
  /** URL immagine 16:9. Se assente si usa l'illustrazione del tipo. */
  image?: string
}

export type Movement = {
  id: string
  label: string
  /** ISO datetime */
  date: string
  /** positivo = accredito, negativo = riscatto */
  points: number
  kind: "visit" | "bonus" | "redeem" | "gift"
}

/** Fasce orarie: [apertura, chiusura] in minuti dalla mezzanotte (chiusura può superare 1440). Indice 0 = domenica. */
export type Hours = { day: string; slots: [number, number][] }[]

export type Venue = {
  name: string
  initials: string
  tagline: string
  logo: string
  cover: string
  mapImage: string
  /** due colori scelti dal titolare: da questi src/lib/themes.ts genera tutti i token */
  brandColor: string
  highlightColor: string
  pointsPerEuro: number
  welcomePoints: number
  qrRefreshSeconds: number
  redeemValidityMinutes: number
  features: { events: boolean; promos: boolean; reviews: boolean; birthday: boolean; booking: boolean }
  address: string
  phone: string
  links: { menu: string; maps: string; review: string; instagram: string; facebook: string; tiktok: string; whatsapp: string; privacy: string }
  hours: Hours
  /** Immagine orizzontale della tessera nel wallet (Apple "strip", Google "hero"). Facoltativa. */
  walletImage: string
  /**
   * Account Google che entrano come TITOLARE (gestione del locale).
   * Chiunque altro accede come cliente. In produzione il ruolo lo decide il server dopo il login Google.
   */
  ownerEmails: string[]
}

export type Role = "cliente" | "titolare"

/** Account con cui si è entrati (Google o email). */
export type Account = { name: string; email: string; avatar?: string; provider: "google" | "email" }

export type Customer = {
  firstName: string
  lastName: string
  email: string
  cardCode: string
  memberSince: string
  /** YYYY-MM-DD */
  birthday: string
  points: number
  totalEarned: number
  totalRedeemed: number
  visits: number
}
