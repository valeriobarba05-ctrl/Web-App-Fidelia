import * as React from "react"

import { safeStorage, saveStorage } from "@/lib/utils"
import { useVenue } from "@/mock/venue"
import type { Account, Role } from "@/types"

/**
 * SESSIONE (mock). Un solo ingresso per tutti: "Continua con Google" (o email per i clienti).
 * Dopo l'accesso l'app si ramifica:
 *   - l'email è tra `venue.ownerEmails`  → ruolo "titolare" → gestione del locale
 *   - qualsiasi altro account            → ruolo "cliente"  → app della tessera
 * In produzione: Google Identity Services lato client, verifica del token e ruolo decisi dal server.
 */

/** Account di esempio per la demo del selettore Google. */
export const DEMO_ACCOUNTS: Account[] = [
  { name: "Giulia Russo", email: "giulia@email.it", provider: "google" },
  { name: "Marco Bianchi", email: "titolare.osteriadelporto@gmail.com", provider: "google" },
]

const KEY = "fidelia:sessione:v1"

/** Account che nella demo hanno già una tessera (gli altri, all'accesso, ne ricevono una nuova). */
export const KNOWN_EMAILS = ["giulia@email.it"]

/** Il titolare entra SOLO con il suo account Google; l'accesso via email porta sempre all'app cliente. */
export function roleFor(account: Account, ownerEmails: string[]): Role {
  const owner = account.provider === "google" && ownerEmails.some((e) => e.trim().toLowerCase() === account.email.trim().toLowerCase())
  return owner ? "titolare" : "cliente"
}

function useSessionValue() {
  const { venue } = useVenue()
  const [account, setAccount] = React.useState<Account | null>(() => safeStorage<{ account: Account | null }>(KEY, { account: null }).account)
  React.useEffect(() => void saveStorage(KEY, { account }), [account])

  const role: Role | null = account ? roleFor(account, venue.ownerEmails) : null

  const signIn = React.useCallback((a: Account) => setAccount(a), [])
  const signOut = React.useCallback(() => setAccount(null), [])
  return { account, role, signIn, signOut }
}

type Session = ReturnType<typeof useSessionValue>
const SessionContext = React.createContext<Session | null>(null)

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const value = useSessionValue()
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}

export function useSession() {
  const ctx = React.useContext(SessionContext)
  if (!ctx) throw new Error("useSession outside SessionProvider")
  return ctx
}
