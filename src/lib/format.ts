/** Formattazione e calcoli di presentazione (italiano). Nessuna dipendenza dai dati demo. */
import type { Hours, Venue } from "@/types"

const MONTHS = ["gen", "feb", "mar", "apr", "mag", "giu", "lug", "ago", "set", "ott", "nov", "dic"]
const WEEKDAYS = ["Domenica", "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato"]
export function eventDate(iso: string) {
  const d = new Date(iso + "T12:00")
  return { day: String(d.getDate()), month: MONTHS[d.getMonth()], weekday: WEEKDAYS[d.getDay()] }
}

export const fmtMinutes = (m: number) =>
  `${String(Math.floor(m / 60) % 24).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`

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
