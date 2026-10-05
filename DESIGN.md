# Fidelia Design System

Fonte unica: `src/styles/globals.css` (token) + `src/components/ui` (componenti shadcn) + `src/components/fidelia` (pattern).
Documentazione viva: apri l'app su `#/design-system`.

## Brand Fidelia (Materiale Grafico v1)
Gli asset originali sono in `public/brand/` (logo, elementi, motivi) e sono usati dai componenti di `src/components/fidelia/brand.tsx`.

| Elemento | Regola | Nel codice |
|---|---|---|
| Palette | Verde Petrolio `#123C3A`, Verde Tonale `#2A5552`, Crema `#F5F1EA`, Sabbia `#EFE9DF`, Oro `#FFD36E` (testo dorato `#7A5200`), Nero `#16181B`, Grigio Testo `#5B5F66`, Bordo `#E6E0D6`, Successo `#1F7A4D`, Errore `#B3261E`. Ambra `#E2A43A` solo decorativa | token in `globals.css`; preset "Fidelia" in `themes.ts` (predefinito) |
| Proporzioni | 60% Crema/Sabbia · 30% Verde · 10% Oro. L'Oro solo per premi, traguardi e riscatto | `--highlight` = Oro |
| Tipografia | **Bricolage Grotesque** (titoli, numeri, logo: 800, h3 700) · **Manrope** (testo) | `--font-heading`, `--font-sans`; scala nella pagina `#/design-system` |
| Caption | 11/14 · 700 · maiuscolo · +0,06em, l'unico stile in maiuscolo | utility `caption` |
| Logo | simbolo + "fidelia" minuscolo, Bricolage 800, -0,035em. Su verde: simbolo `su-verde` e scritta Crema. Minimo 16 px, niente ombre, mai deformato | `FideliaLogo`, `FideliaSymbol` |
| Firma | "powered by fidelia" in fondo alla tessera e all'accesso, mai più grande del nome del locale | `PoweredBy` |
| Timbri | pieno = Crema con la spunta del simbolo, vuoto = tratteggiato, ultimo = Oro | `TicketCard` + `Spunta` |
| Premio | bollino oro con anello tratteggiato; coriandoli solo a premio ottenuto | `riscatto.tsx` |
| Ombre | niente ombre forti: le superfici si separano col colore | `--shadow-*` ammorbiditi |
| Motivi | timbri, spunte, quadrati, tessera (**da approvare** nel brand book) | `BrandMotif`: maschera ripetuta che segue il colore del locale (tessera e accesso) |
| Tono | si dà del "tu"; al cliente non si dice "wallet", "programma fedeltà", "CRM"; niente emoji | "Salva la tessera nel telefono". Restano i nomi ufficiali "Apple Wallet" / "Google Wallet" sui badge |

Scelte da confermare col brand:
- **Icone:** il brand chiede icone a tratto arrotondato (stile Lucide); qui restano **Remix Icon** perché fanno parte del preset shadcn scelto. Il cambio è meccanico (un import per icona).
- **Raggi:** il brand book non dà valori numerici; resta il raggio del preset (small 0,45rem).
- Il logo usa i colori fissi del brand: è l'unica eccezione alla regola "mai colori scritti a mano".

## Base: preset shadcn `b1LObiUpjd`
| Asse | Valore |
|---|---|
| Stile | **rhea** — controlli e badge `rounded-2xl`, card `rounded-4xl` con `ring-1 ring-foreground/5` e `shadow-sm`, input riempiti `bg-input/50` senza bordo |
| Colore base | **taupe** (neutri caldi, OKLCH dal registry shadcn) |
| Tema | emerald nel preset, **sostituito dalla palette Fidelia** (Verde Petrolio + Oro) |
| Font | Montserrat/Figtree nel preset, **sostituiti dai font del brand**: Manrope (testo) · Bricolage Grotesque (titoli e numeri) |
| Icone | **Remix Icon** (`@remixicon/react`): Line, Fill solo per la nav attiva |
| Raggio | **small** `0.45rem`, scala `sm → 4xl` (controlli `rounded-2xl` ≈ 13px, card `rounded-4xl` ≈ 19px). Nessun raggio in px nei componenti: cambiando `--radius` cambia tutto in proporzione |
| Menu | **inverted + bold**: menu e toast sul verde del brand (`--popover` = `--brand`), voce evidenziata in Verde Tonale |
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
`src/lib/themes.ts` → `generateTheme(brand, punti, scuro)`. Il titolare sceglie due colori (o un abbinamento: Fidelia, Emerald, Bordeaux, Blu notte, Antracite);
da questi vengono generati `--primary`, `--primary-soft`, `--brand` (superficie scura della tessera), `--highlight` e i rispettivi testi,
alzando o abbassando la luminosità finché ogni coppia supera **WCAG AA 4,5:1** in chiaro e in scuro. Il testo su colore del locale è Crema; `--brand-tonal` (voce attiva) e `--brand-muted` (testo secondario su verde) sono generati con la stessa garanzia.

## Leggibilità
- L'app usa **solo il tema chiaro** (`THEME_MODE = "light"`). Token scuri pronti ma non attivi: sfondo **nero puro** (`#000`), card grafite `oklch(0.17)`, bordi al 14%. Nel tema scuro il primario diventa chiaro con testo scuro.
- Tessera, saldo e pannello di accesso usano `--brand`, sempre scuro con testo chiaro e numeri oro, in entrambi i temi.
- Testo su foto caricate: sempre sopra un velo scuro o di marca.
- `npm run check:contrast` verifica tutte le coppie testo/sfondo per ogni preset (più colori "difficili") in entrambi i temi; deve passare prima di ogni rilascio.
- Niente testo con opacità sotto l'85% su superfici colorate; i secondari usano token dedicati (`--muted-foreground`, `--inverted-muted`, `--sidebar-muted`).

## Elevazione e veli
- Ombre solo da token: `shadow-float` (card sopra contenuti/foto), `shadow-overlay` (barra in basso, pannelli, anteprima wallet), `shadow-ticket` (tessera, tinta del brand), `shadow-points` (pulsante Tessera, tinta oro).
- Testo sopra foto caricate: `scrim-photo` (eventi), `scrim-strip` (wallet), `text-on-photo`.

## Movimento ridotto
Con "riduci movimento" spariscono spostamenti, ingrandimenti e rotazioni (rullo dei punti, inclinazione della tessera); restano dissolvenze e cambi di colore da 160 ms. Il saldo che cambia compare con una dissolvenza (`data-motion="fade"`).

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
