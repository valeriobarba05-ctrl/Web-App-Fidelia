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
- `--inverted`: superfici scure (barra di navigazione, promo, menu).
- Varianti bottone `highlight`, `glass`; taglia `xl` (48px) e `icon-xl` (44px) per le CTA al telefono.
- Badge `highlight`, `success`, `warning`, `glass`; taglia `lg`.

## Colori del locale
`src/lib/themes.ts`: ogni locale sovrascrive solo `--primary`, `--primary-foreground`, `--ring`, `--highlight` (chiaro e scuro).
Preset: Emerald (default del preset), Verde porto, Bordeaux, Blu notte, Antracite.

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
