# Fidelia Design System

Fonte unica: `src/styles/globals.css` (token) + `src/components/ui` (componenti shadcn) + `src/components/fidelia` (pattern).
Documentazione viva: apri l'app su `#/design-system`.

## Base: preset shadcn `b1LObiUpkf`
| Asse | Valore |
|---|---|
| Stile | **rhea** — controlli e badge `rounded-2xl`, card `rounded-[min(radius-4xl,24px)]` con `ring-1 ring-foreground/5` e `shadow-sm`, input riempiti `bg-input/50` senza bordo |
| Colore base | **taupe** (neutri caldi, OKLCH dal registry shadcn) |
| Tema | **emerald** — `--primary: oklch(0.508 0.118 165.612)` |
| Font | **Montserrat** (testo) · **Figtree** (titoli e numeri) |
| Icone | **Remix Icon** (`@remixicon/react`): Line, Fill solo per la nav attiva |
| Raggio | **medium** `0.625rem`, scala `sm → 4xl` |
| Menu | **inverted + bold**: menu e toast scuri (`--popover` = taupe 900), voce evidenziata piena col primario |
| Grafici | **lime** `--chart-1…5` |

## Livello Fidelia (aggiunte minime)
- `--highlight` oro: tutto ciò che riguarda i **punti** (saldo, CTA tessera, bonus). Mai per decorare.
- `--success / --success-soft`, `--warning / --warning-soft`: disponibile / in attesa di scansione.
- `--surface`: fondo dell'app (taupe 50 caldo) sotto le card bianche.
- `--inverted`: superfici scure (barra di navigazione, promo).
- `--brand`: superficie di marca sempre scura (tessera). `--primary-soft`: fondo tenue del primario per icone e righe evidenziate.
- Varianti bottone `highlight`, `glass`; taglia `xl` (48px) e `icon-xl` (44px) per le CTA al telefono.
- Badge `highlight`, `success`, `warning`, `glass`; taglia `lg`.

## Colori del locale (li sceglie solo il titolare)
`src/lib/themes.ts` → `generateTheme(brand, punti, scuro)`. Il titolare sceglie due colori (o un abbinamento: Emerald, Verde porto, Bordeaux, Blu notte, Antracite);
da questi vengono generati `--primary`, `--primary-soft`, `--brand` (superficie scura della tessera), `--highlight` e i rispettivi testi,
alzando o abbassando la luminosità finché ogni coppia supera **WCAG AA 4,5:1** in chiaro e in scuro.

## Leggibilità
- Tema scuro: sfondo **nero puro** (`#000`), card grafite `oklch(0.17)`, bordi al 14%. Nel tema scuro il primario diventa chiaro con testo scuro.
- Tessera, saldo e pannello di accesso usano `--brand`, sempre scuro con testo chiaro e numeri oro, in entrambi i temi.
- Testo su foto caricate: sempre sopra un velo scuro o di marca.
- `npm run check:contrast` verifica tutte le coppie testo/sfondo per ogni preset (più colori "difficili") in entrambi i temi; deve passare prima di ogni rilascio.
- Niente testo con opacità sotto l'85% su superfici colorate; i secondari usano token dedicati (`--muted-foreground`, `--inverted-muted`, `--sidebar-muted`).

## Firma
1. **Tessera‑biglietto** (`LoyaltyCard`): due tacche laterali (utility `ticket-notch`) e una perforazione: sopra chi sei e il saldo, sotto cosa fare adesso.
2. **Contatore a rullo** (`PointsOdometer`): il saldo scorre come un contatore meccanico quando cambia (900 ms, ease-out-expo). Unico movimento "firmato".

## Layout
- Telefono: contenuto a colonna, barra di navigazione flottante invertita con la Tessera al centro (oro, 56px).
- Desktop ≥1024px: sidebar scura 272px (nav con accento pieno + mini-saldo + menu utente), contenuto `max-w-6xl` a due colonne.
- Dettagli in **Drawer** dal basso; conferme distruttive in **Dialog**; feedback in **toast** invertiti.

## Regole
- Niente card dentro card: le liste usano `Item` dentro una `Card`.
- Testo secondario su superfici colorate: opacità del foreground, mai grigio.
- Ogni stato ha la sua resa: vuoto (`Empty`), scaduto, in attesa, prenotato, disabilitato con motivo.
- `prefers-reduced-motion`: animazioni azzerate.
