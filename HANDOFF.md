# Fidelia: consegna design → sviluppo

Questo repository contiene **il design di Fidelia in codice**: design system, componenti e tutte le schermate dell'app cliente e dell'app titolare, già funzionanti e navigabili con dati di esempio.
**Non contiene un backend.** Tutto ciò che salva, autentica o comunica con la cassa è simulato e isolato in `src/mock/`, da sostituire.

```bash
npm install
npm run dev              # app cliente: http://localhost:5173/#/home  ·  app titolare: /#/titolare (PIN demo 1234)
npm run typecheck
npm run check:contrast   # leggibilità WCAG AA di tutti i colori, chiaro e scuro: deve restare verde
npm run tokens           # rigenera design-tokens.json
```

Stack: React 19 · TypeScript · Vite · Tailwind CSS v4 · shadcn/ui (preset `b1LObiUpkf`: stile rhea, base taupe, tema emerald, Montserrat + Figtree, Remix Icon) · Radix UI · vaul · sonner.

---

## 1. Cosa tenere e cosa sostituire

| Cartella / file | Cos'è | Cosa fare |
|---|---|---|
| `src/styles/globals.css` | **Token** del design system (colori OKLCH chiaro/scuro, raggi, font, animazioni) | Tenere. Ogni colore passa da qui. |
| `src/lib/themes.ts` | Generatore dei colori del locale con contrasto garantito | Tenere. Chiamare `applyTheme(brand, punti, scuro)` all'avvio con i colori del locale. |
| `src/components/ui/` | Componenti shadcn in stile rhea (Button, Card, Badge, Input, Switch, Tabs, Drawer, Dialog, …) | Tenere. |
| `src/components/fidelia/` | Pattern Fidelia **puri** (ricevono dati via props): `TicketCard`, `VenueMark`, `PointsOdometer`, `QrCode`, `EventCard`, `EventArt`, `PrizeArt`, `MovementRow`, `PageHeader/PageBody` | Tenere. |
| `src/lib/format.ts`, `utils.ts`, `qr.ts` | Formattazione italiana, orari, utilità, disegno QR | Tenere. |
| `src/types.ts` | **Contratto dati**: forma di Venue, Prize, Promo, Event, Movement, Customer | Allineare all'API. |
| `src/screens/` | Schermate dell'app **cliente** | Tenere il markup; collegare i dati reali. |
| `src/owner/` | App del **titolare** (gestione locale) | Tenere il markup; collegare le scritture all'API. |
| `src/screens/parts.tsx` | Versioni "collegate" di `TicketCard`/`VenueMark` | Riscrivere sull'API. |
| `src/mock/` | **Tutto finto**: dati di esempio, stato in `localStorage`, PIN, router a hash, controlli demo | **Sostituire.** |
| `src/design-system/` | Pagina documentazione viva (`#/design-system`) | Facoltativa in produzione. |
| `design-tokens.json` | Token esportati (OKLCH + HEX) per altri stack | Rigenerare con `npm run tokens`. |

Regola: i file fuori da `src/mock/` non devono sapere da dove arrivano i dati. Oggi le schermate leggono con `useStore()` / `useVenue()`: basta reimplementare questi hook (stessa forma di ritorno) sopra l'API, oppure passare i dati come props.

---

## 2. Due app separate

- **App cliente** (`src/screens`, layout `src/screens/app-shell.tsx`): il cliente **non configura nulla**. Il tema segue il telefono (`prefers-color-scheme`); colori, contenuti e funzioni li decide il locale. Nel profilo ci sono solo i suoi dati: compleanno e consensi privacy (obbligatori per GDPR).
- **App titolare** (`src/owner`): unico punto che scrive la configurazione del locale. In demo è protetta da PIN; **in produzione serve un login vero lato server** e i permessi di scrittura vanno verificati dal backend.

Possono essere due build/deploy distinti: condividono solo `components/`, `lib/`, `styles/`, `types.ts`.

---

## 3. Schermate e dati richiesti

### App cliente
| Schermata | File | Dati | Azioni da collegare | Stati già disegnati |
|---|---|---|---|---|
| Accesso | `screens/accesso.tsx` | `Venue` (nome, sigla, logo, copertina, frase, punti benvenuto) | login Google, login/registrazione email | errori campo, istruzioni installazione iOS/Android |
| Home | `screens/home.tsx` | `Customer`, ultimi `Movement`, `Prize[]`, `Promo[]`, `FideliaEvent[]`, riscatto in corso | — | promo di oggi, riscatto in corso, nessuna promo/evento |
| Tessera | `screens/tessera.tsx` | `Customer`, **token QR della tessera** | — | conto alla rovescia rinnovo, luminosità massima |
| Movimenti | `screens/movimenti.tsx` | `Customer` (totali), `Movement[]` | — | filtri, vuoto |
| Premi | `screens/premi.tsx` | `Prize[]` attivi, saldo | `startRedeem(prizeId)` → **API crea codice monouso** | bloccato/disponibile, vuoto, riscatto già in corso |
| Riscatto | `screens/riscatto.tsx` | riscatto `{prizeId, code, expiresAt}` | annulla; **conferma arriva dalla cassa** (push/polling) | in attesa, scaduto, completato, nessun riscatto |
| Novità | `screens/novita.tsx` | `Promo[]`, `FideliaEvent[]`, prenotazioni del cliente | prenota/annulla, preferenze notifiche | filtri per tipo, posti esauriti/ultimi posti, prenotazioni disattivate |
| Locale | `screens/locale.tsx` | `Venue` (orari, contatti, link, immagini) | — | aperto/chiuso calcolato, pulsanti nascosti se il link manca |
| Profilo | `screens/profilo.tsx` | `Customer`, consensi | salva compleanno, aggiorna consensi | consenso necessario non disattivabile |

### App titolare (`src/owner/owner-app.tsx`)
Sezioni: Identità e colori · Premi · Promo · Eventi · Orari e contatti · Regole e funzioni.
Tutte le scritture passano da `useVenueAdmin()` (`updateVenue`, `upsert`, `remove`, `move`, `resetVenue`): sono gli endpoint da implementare.

---

## 4. Cosa è simulato e come va fatto davvero

| Demo | Produzione |
|---|---|
| Stato in `localStorage` (`src/mock/store.tsx`, `venue.tsx`) | API + database. La configurazione del locale è unica per tutti i clienti. |
| PIN `1234` per il titolare | Login con account e ruoli verificati dal server. |
| QR della tessera = `FIDELIA:<codice>:<ciclo>` generato nel browser | **Token firmato dal server** che ruota ogni `qrRefreshSeconds` (tipo TOTP); la cassa lo valida. Il componente `QrCode` disegna qualsiasi stringa. |
| Codice di riscatto generato nel browser | Creato dal server, monouso, con scadenza `redeemValidityMinutes`. I punti si scalano **solo** quando la cassa lo valida. |
| Pulsanti "Simula" (Tessera) e "Scansiona" (Riscatto) | Non esistono: li nasconde la build con `VITE_DEMO=false` (`src/mock/demo.ts`). |
| Immagini salvate come data URL | Upload su storage (S3/R2/…) e salvataggio dell'URL. `compressImage()` in `lib/utils.ts` può restare come ridimensionamento prima dell'upload. |
| Aggiornamento tra schede via evento `storage` | Polling o realtime (websocket/SSE) se serve. |
| Router a hash (`src/mock/router.ts`) | Qualsiasi router (es. React Router); le rotte sono elencate in `Route`. |

---

## 5. Regole del design system da rispettare

1. **Mai colori scritti a mano** nei componenti: solo classi dei token (`bg-primary`, `text-muted-foreground`, `bg-brand`, …). Il titolare cambia i colori e tutto deve seguirli.
2. **Leggibilità:** `npm run check:contrast` deve passare. Se si aggiunge una nuova coppia testo/sfondo, aggiungerla in `scripts/check-contrast.ts`.
3. **Tema scuro:** sfondo nero puro; la classe `dark` su `<html>` la gestisce `applyTheme()`. Nell'app cliente segue sempre il sistema.
4. **Testo sopra le foto caricate:** sempre su velo (`EventArt` con `scrim`, gradienti già presenti). Non togliere i veli.
5. **Touch target** ≥ 44px per le azioni principali al telefono (taglie `xl` e `icon-xl` del Button).
6. **Movimento:** un solo momento firmato (il rullo dei punti, `PointsOdometer`). `prefers-reduced-motion` è rispettato globalmente.
7. Dettagli in **Drawer** dal basso, conferme distruttive in **Dialog**, feedback in **toast**.

Riferimenti: `DESIGN.md` (decisioni visive), `PRODUCT.md` (prodotto e funzioni), `#/design-system` (catalogo vivo).
