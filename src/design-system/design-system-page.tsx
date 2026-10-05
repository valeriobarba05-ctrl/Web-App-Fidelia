import * as React from "react"
import {
  RiHome5Line,
  RiCalendarEventLine,
  RiStore2Line,
  RiSparkling2Line,
  RiCoupon3Line,
  RiTicket2Line,
  RiStarSmileLine,
  RiNotification3Line,
  RiPhoneLine,
  RiMapPin2Line,
  RiBookOpenLine,
  RiCake3Line,
  RiCupLine,
  RiGoblet2Line,
  RiRestaurantLine,
  RiMicLine,
  RiMusic2Line,
  RiShieldCheckLine,
  RiHourglassLine,
  RiFlashlightLine,
  RiAddLine,
  RiArrowLeftLine,
  RiArrowRightLine,
  RiGift2Line,
  RiHistoryLine,
  RiLogoutBoxRLine,
  RiMoonLine,
  RiQrCodeLine,
  RiSparkling2Fill,
  RiSubtractLine,
  RiUser3Line,
} from "@remixicon/react"

import { BrandMotif, FideliaLogo, FideliaSymbol, PoweredBy, Spunta } from "@/components/fidelia/brand"
import { EventCard } from "@/components/fidelia/event-card"
import { TicketCard } from "@/components/fidelia/loyalty-card"
import { WalletButton, WalletPassPreview } from "@/components/fidelia/wallet"
import { MovementRow } from "@/components/fidelia/movement-row"
import { PointsOdometer } from "@/components/fidelia/points-odometer"
import { PrizeArt } from "@/components/fidelia/prize-art"
import { QrCode } from "@/components/fidelia/qr-code"
import { VenueThemePicker } from "@/owner/venue-theme-picker"
import { useVenue, useVenueAdmin } from "@/mock/venue"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Empty, EmptyDescription, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Input } from "@/components/ui/input"
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from "@/components/ui/item"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { DEFAULT_EVENTS as EVENTS, DEFAULT_PRIZES as PRIZES, INITIAL_MOVEMENTS } from "@/mock/data"
import { navigate } from "@/mock/router"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const SECTIONS = [
  ["brand", "Brand"],
  ["fondamenta", "Preset"],
  ["colori", "Colori"],
  ["leggibilita", "Leggibilità"],
  ["tipografia", "Tipografia"],
  ["forma", "Forma ed elevazione"],
  ["icone", "Icone"],
  ["movimento", "Movimento"],
  ["azioni", "Bottoni e badge"],
  ["form", "Form e controlli"],
  ["contenitori", "Card e liste"],
  ["overlay", "Overlay e feedback"],
  ["pattern", "Pattern Fidelia"],
] as const

export function DesignSystemPage() {
  const { dark } = useVenue()
  const { setPreviewDark } = useVenueAdmin()
  const [active, setActive] = React.useState<string>("brand")

  React.useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-20% 0px -70% 0px" },
    )
    SECTIONS.forEach(([id]) => {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [])

  return (
    <div className="min-h-dvh bg-background">
      <header className="sticky top-0 z-30 border-b bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3 sm:px-8">
          <Button variant="ghost" size="lg" onClick={() => navigate("titolare")}>
            <RiArrowLeftLine /> Torna alla gestione
          </Button>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="flex items-center gap-2 font-heading text-lg font-extrabold"><FideliaSymbol size={22} /> Design system</span>
            <span className="text-xs text-muted-foreground">Brand Fidelia v1 · shadcn/ui preset b1LObiUpjd (rhea, Remix Icon)</span>
          </div>
          <div className="flex items-center gap-2">
            <RiMoonLine className="size-4 text-muted-foreground" />
            <Label htmlFor="ds-dark" className="text-sm">
              Token scuri (non attivi nell'app)
            </Label>
            <Switch id="ds-dark" checked={dark} onCheckedChange={setPreviewDark} />
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-8 lg:grid-cols-[200px_minmax(0,1fr)]">
        <nav aria-label="Sezioni" className="hidden lg:block">
          <ul className="sticky top-24 flex flex-col gap-0.5">
            {SECTIONS.map(([id, label]) => (
              <li key={id}>
                <a
                  href={`#/design-system`}
                  onClick={(e) => {
                    e.preventDefault()
                    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
                  }}
                  className={cn(
                    "block rounded-xl px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                    active === id && "bg-inverted font-medium text-inverted-foreground hover:bg-inverted hover:text-inverted-foreground",
                  )}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <main className="flex min-w-0 flex-col gap-20">
          <Brand />
          <Intro />
          <Colors />
          <Legibility />
          <Typography />
          <Shape />
          <IconsSection />
          <Motion />
          <Actions />
          <Forms />
          <Containers />
          <Overlays />
          <Patterns />
        </main>
      </div>
    </div>
  )
}

function Section({ id, title, lead, children }: { id: string; title: string; lead?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-t`} className="flex scroll-mt-24 flex-col gap-6">
      <div className="flex max-w-2xl flex-col gap-2">
        <h2 id={`${id}-t`} className="font-heading text-[28px] leading-tight font-extrabold tracking-[-0.02em]">
          {title}
        </h2>
        {lead && <p className="text-[15px] leading-relaxed text-muted-foreground">{lead}</p>}
      </div>
      {children}
    </section>
  )
}

function Specimen({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <div className={cn("flex flex-wrap items-center gap-3 rounded-3xl border bg-surface p-5", className)}>{children}</div>
    </div>
  )
}

const BRAND_PALETTE: [string, string, string][] = [
  ["Verde Petrolio", "#123C3A", "colore primario · 30%"],
  ["Verde Tonale", "#2A5552", "voce attiva su verde"],
  ["Crema", "#F5F1EA", "sfondo · testo su verde · 60%"],
  ["Sabbia", "#EFE9DF", "superfici secondarie"],
  ["Oro", "#FFD36E", "solo premi, traguardi, riscatto · 10%"],
  ["Oro Testo", "#7A5200", "testo dorato su chiaro"],
  ["Nero", "#16181B", "testo"],
  ["Grigio Testo", "#5B5F66", "testo secondario"],
]

function Brand() {
  return (
    <Section
      id="brand"
      title="Brand Fidelia"
      lead="Dal Materiale Grafico v1 (asset in public/brand/). Proporzioni 60% Crema/Sabbia, 30% Verde, 10% Oro. Niente ombre forti: le superfici si separano col colore. Sulla tessera del cliente il protagonista è il locale; Fidelia firma in basso."
    >
      <div className="grid gap-3 lg:grid-cols-2">
        <Specimen label="Logo orizzontale · su chiaro">
          <FideliaLogo size={40} />
          <FideliaSymbol size={40} />
          <FideliaSymbol variant="mono-nero" size={40} />
        </Specimen>
        <Specimen label="Logo orizzontale · su verde (simbolo su-verde, scritta Crema)" className="bg-brand text-brand-foreground">
          <FideliaLogo size={40} onBrand />
          <FideliaSymbol variant="mono-bianco" size={40} />
        </Specimen>
        <Specimen label="Firma powered by · sotto la tessera, mai più grande del nome del locale">
          <PoweredBy />
        </Specimen>
        <Specimen label="Spunta-timbro e bollino premio" className="bg-brand text-brand-foreground">
          <span className="flex size-8 items-center justify-center rounded-full bg-brand-foreground text-brand"><Spunta className="w-[64%]" strokeWidth={9} /></span>
          <span className="size-8 rounded-full border-[1.5px] border-dashed border-current/40" />
          <img src="./brand/elementi/bollino-premio.svg" alt="" className="size-12" />
        </Specimen>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {BRAND_PALETTE.map(([name, hex, use]) => (
          <div key={hex} className="flex flex-col overflow-hidden rounded-3xl border">
            <div className="h-16" style={{ background: hex }} />
            <div className="flex flex-col gap-0.5 p-3">
              <span className="text-sm font-semibold">{name}</span>
              <code className="text-xs">{hex}</code>
              <span className="text-xs text-muted-foreground">{use}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-muted-foreground">Motivi (da approvare) · componente BrandMotif: maschera ripetuta che prende il colore del locale</span>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {(["timbri", "spunte", "quadrati", "tessera"] as const).map((m) => (
            <div key={m} className="relative isolate flex h-28 items-end overflow-hidden rounded-3xl bg-brand p-3 text-brand-foreground">
              <BrandMotif motif={m} className="-z-10 opacity-20" />
              <span className="caption">{m}</span>
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
}

function Intro() {
  const rows = [
    ["Stile", "rhea", "controlli rounded-2xl, card rounded-4xl con ring sottile"],
    ["Colore base", "taupe", "neutri caldi per sfondi, testi e bordi"],
    ["Tema", "Fidelia", "Verde Petrolio + Oro; sovrascrivibile dai “Colori del locale”"],
    ["Font", "Manrope", "testo, etichette, controlli (dal brand)"],
    ["Titoli", "Bricolage Grotesque", "titoli, numeri del saldo e logo (dal brand)"],
    ["Icone", "Remix Icon", "Line di default, Fill per lo stato attivo"],
    ["Raggio", "small · 0.45rem", "scala sm → 4xl derivata"],
    ["Menu", "inverted · bold", "menu e toast scuri, voce attiva piena"],
    ["Grafici", "lime", "chart-1 … chart-5"],
  ]
  return (
    <Section
      id="fondamenta"
      title="Il preset, tradotto per Fidelia"
      lead="Ogni componente parte dal preset shadcn indicato. Sopra c'è un livello Fidelia ridotto all'osso: un colore per i punti (highlight), stati di successo e attesa, e la tessera come elemento firma."
    >
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {rows.map(([k, v, d]) => (
          <div key={k} className="flex flex-col gap-1 rounded-3xl border p-4">
            <span className="text-xs text-muted-foreground">{k}</span>
            <span className="font-heading text-lg font-bold">{v}</span>
            <span className="text-sm text-muted-foreground">{d}</span>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-3 rounded-3xl bg-muted p-5">
        <span className="text-sm font-medium">Colori del locale (li sceglie il titolare): prova a cambiarli, tutta la pagina segue.</span>
        <VenueThemePicker />
      </div>
    </Section>
  )
}

const COLOR_GROUPS: { name: string; tokens: [string, string?][] }[] = [
  { name: "Superfici", tokens: [["background", "foreground"], ["surface", "foreground"], ["card", "card-foreground"], ["muted", "muted-foreground"], ["secondary", "secondary-foreground"], ["inverted", "inverted-foreground"]] },
  { name: "Locale e punti (generati, sempre AA)", tokens: [["primary", "primary-foreground"], ["primary-soft", "primary-soft-foreground"], ["brand", "brand-foreground"], ["brand", "highlight"], ["highlight", "highlight-foreground"], ["ring"]] },
  { name: "Stati", tokens: [["success-soft", "success"], ["warning-soft", "warning"], ["destructive-soft", "destructive"], ["border"], ["input"]] },
  { name: "Grafici (lime)", tokens: [["chart-1"], ["chart-2"], ["chart-3"], ["chart-4"], ["chart-5"]] },
]

function Colors() {
  return (
    <Section id="colori" title="Colori" lead="I token vivono in src/styles/globals.css come variabili OKLCH. Le coppie superficie / testo sono pensate insieme: usa sempre il foreground abbinato.">
      {COLOR_GROUPS.map((g) => (
        <div key={g.name} className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold">{g.name}</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
            {g.tokens.map(([bg, fg]) => (
              <div key={bg} className="flex flex-col overflow-hidden rounded-3xl border">
                <div className="flex h-20 items-end p-3 text-sm font-semibold" style={{ background: `var(--${bg})`, color: fg ? `var(--${fg})` : undefined }}>
                  {fg ? "Aa 340" : ""}
                </div>
                <div className="flex flex-col gap-0.5 p-3">
                  <code className="text-xs font-semibold">--{bg}</code>
                  {fg && <code className="text-[11px] text-muted-foreground">su: --{fg}</code>}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </Section>
  )
}

function Legibility() {
  return (
    <Section
      id="leggibilita"
      title="Leggibilità garantita"
      lead="Il titolare sceglie due colori; i token del locale vengono generati regolando la luminosità finché ogni testo supera WCAG AA (4,5:1) sia in chiaro sia in scuro. Il tema scuro usa sfondo nero puro e card grafite."
    >
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Sfondo scuro", "Nero puro #000, card grafite separate da un bordo al 14%."],
          ["Testi secondari", "Mai sotto 4,5:1, anche su card e sfondi grigi."],
          ["Testo su foto", "Velo scuro o di marca sotto ogni testo che sta su un'immagine caricata."],
          ["Controllo automatico", "npm run check:contrast verifica tutte le coppie, per ogni colore e in entrambi i temi."],
        ].map(([k, v]) => (
          <div key={k} className="flex flex-col gap-1 rounded-3xl border p-4">
            <span className="font-heading text-base font-bold">{k}</span>
            <span className="text-sm text-muted-foreground">{v}</span>
          </div>
        ))}
      </div>
    </Section>
  )
}

function Typography() {
  const scale = [
    ["Display · Bricolage 56/1 · 800", "text-[56px] leading-none tracking-[-0.03em] font-heading font-extrabold", "340 punti"],
    ["H1 · Bricolage 34/1.1 · 800", "text-[34px] leading-[1.1] tracking-[-0.02em] font-heading font-extrabold", "Saldo e movimenti"],
    ["H2 · Bricolage 28/1.15 · 800", "text-[28px] leading-[1.15] font-heading font-extrabold", "Premi"],
    ["H3 · Bricolage 22/1.2 · 700", "text-[22px] leading-[1.2] font-heading font-bold", "Martedì pizza + birra a 12 €"],
    ["Body-lg · Manrope 17/26 · 500", "text-[17px] leading-[26px] font-medium", "Ogni visita vale punti: mostra la tessera in cassa."],
    ["Body · Manrope 15/22 · 400", "text-[15px] leading-[22px]", "Ogni martedì sera pizza a scelta e birra media. Mostra la tessera e accumuli il doppio dei punti."],
    ["Small · Manrope 13/18 · 500", "text-[13px] leading-[18px] font-medium", "Il codice si rinnova tra 24s"],
    ["Caption · Manrope 11/14 · 700 · maiuscolo", "caption text-muted-foreground", "Saldo punti"],
  ]
  return (
    <Section id="tipografia" title="Tipografia" lead="Bricolage Grotesque dà voce a titoli, numeri e logo; Manrope regge testo e controlli. La caption (classe caption) è l'unico stile in maiuscolo. I numeri del saldo usano cifre tabellari, così non “ballano” quando cambiano.">
      <div className="flex flex-col divide-y rounded-3xl border">
        {scale.map(([meta, cls, sample]) => (
          <div key={meta} className="grid gap-2 p-5 md:grid-cols-[220px_1fr] md:items-baseline">
            <span className="text-xs text-muted-foreground">{meta}</span>
            <span className={cls}>{sample}</span>
          </div>
        ))}
      </div>
    </Section>
  )
}

function Shape() {
  return (
    <Section id="forma" title="Forma ed elevazione" lead="Raggio base small (0.45rem). Rhea porta controlli e badge a rounded-2xl e le card a rounded-4xl. L'elevazione è morbida e con offset; la tessera ha un'ombra tinta del primario.">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-7">
        {["sm", "md", "lg", "xl", "2xl", "3xl", "4xl"].map((r) => (
          <div key={r} className="flex flex-col gap-2">
            <div className="h-20 border-2 border-foreground/80 bg-muted" style={{ borderRadius: `var(--radius-${r})` }} />
            <code className="text-xs">radius-{r}</code>
          </div>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          ["Ring · card", "shadow-sm ring-1 ring-foreground/5"],
          ["Sollevato · overlay", "shadow-xl ring-1 ring-foreground/5"],
          ["Tessera · tinta", "shadow-[0_18px_40px_-18px_color-mix(in_oklch,var(--primary)_70%,black)] bg-primary"],
        ].map(([k, c]) => (
          <div key={k} className="flex flex-col gap-2">
            <div className={cn("h-24 rounded-4xl bg-card", c)} />
            <span className="text-xs text-muted-foreground">{k}</span>
          </div>
        ))}
      </div>
    </Section>
  )
}

const ICONS = { RiHome5Line, RiGift2Line, RiQrCodeLine, RiCalendarEventLine, RiStore2Line, RiHistoryLine, RiSparkling2Line, RiCoupon3Line, RiTicket2Line, RiStarSmileLine, RiNotification3Line, RiUser3Line, RiPhoneLine, RiMapPin2Line, RiBookOpenLine, RiCake3Line, RiCupLine, RiGoblet2Line, RiRestaurantLine, RiMicLine, RiMusic2Line, RiShieldCheckLine, RiHourglassLine, RiFlashlightLine } as const

function IconsSection() {
  return (
    <Section id="icone" title="Icone" lead="Remix Icon, come da preset. Variante Line ovunque; Fill solo per la voce di navigazione attiva. Dimensioni: 16 nei controlli, 20 nelle liste, 24 nelle azioni principali.">
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 xl:grid-cols-8">
        {Object.entries(ICONS).map(([n, Icon]) => {
          return (
            <div key={n} className="flex flex-col items-center gap-2 rounded-2xl border p-3 text-center">
              <Icon className="size-6" />
              <span className="w-full truncate text-[10px] text-muted-foreground">{n.replace(/^Ri|Line$/g, "")}</span>
            </div>
          )
        })}
      </div>
    </Section>
  )
}

function Motion() {
  const [n, setN] = React.useState(340)
  return (
    <Section
      id="movimento"
      title="Movimento"
      lead="Un solo momento firmato: il contatore dei punti che scorre come un rullo meccanico quando il saldo cambia. Il resto si muove poco e sempre con ease-out esponenziale (cubic-bezier(0.16, 1, 0.3, 1)). Con “riduci movimento” attivo, tutto diventa istantaneo."
    >
      <div className="flex flex-wrap items-center gap-6 rounded-4xl bg-inverted p-6 text-inverted-foreground">
        <PointsOdometer value={n} className="text-[64px] text-highlight" />
        <div className="flex gap-2">
          <Button variant="glass" size="xl" onClick={() => setN((v) => Math.max(0, v - 100))}>
            <RiSubtractLine /> Riscatta 100
          </Button>
          <Button variant="highlight" size="xl" onClick={() => setN((v) => v + Math.ceil(Math.random() * 80) + 20)}>
            <RiAddLine /> Visita
          </Button>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          ["Rapido · 150–200ms", "hover, focus, colore dei controlli"],
          ["Medio · 500–700ms", "progress, comparsa liste (rise), QR che si rigenera"],
          ["Firma · 900ms", "rullo dei punti"],
        ].map(([k, v]) => (
          <div key={k} className="rounded-3xl border p-4">
            <div className="text-sm font-semibold">{k}</div>
            <div className="text-sm text-muted-foreground">{v}</div>
          </div>
        ))}
      </div>
    </Section>
  )
}

function Actions() {
  return (
    <Section id="azioni" title="Bottoni e badge" lead="Varianti shadcn più due aggiunte Fidelia: highlight (azioni che fanno guadagnare o spendere punti) e glass (azioni sopra superfici colorate). La taglia xl (48px) è per le CTA al telefono.">
      <Specimen label="Varianti">
        <Button>Default</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="link">Link</Button>
        <Button variant="highlight">
          <RiSparkling2Fill /> Highlight
        </Button>
        <div className="rounded-2xl bg-primary p-2 text-primary-foreground">
          <Button variant="glass">Glass</Button>
        </div>
      </Specimen>
      <Specimen label="Taglie">
        <Button size="xs">xs</Button>
        <Button size="sm">sm</Button>
        <Button>default</Button>
        <Button size="lg">lg</Button>
        <Button size="xl">
          <RiQrCodeLine /> xl · Mostra tessera
        </Button>
        <Button size="icon-xl" variant="secondary" aria-label="Movimenti">
          <RiHistoryLine />
        </Button>
        <Button disabled>Disabilitato</Button>
      </Specimen>
      <Specimen label="Badge">
        <Badge>Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="outline">Outline</Badge>
        <Badge variant="highlight">
          <RiSparkling2Fill /> Punti doppi
        </Badge>
        <Badge variant="success">Disponibile</Badge>
        <Badge variant="warning">In attesa di scansione</Badge>
        <Badge variant="destructive">Codice scaduto</Badge>
        <Badge size="lg" variant="success">
          3 premi sbloccati
        </Badge>
      </Specimen>
    </Section>
  )
}

function Forms() {
  const [v, setV] = React.useState("tutti")
  const [on, setOn] = React.useState(true)
  return (
    <Section id="form" title="Form e controlli" lead="Input riempiti (bg-input/50) senza bordo, che si accendono al focus con un anello del primario. Gli errori dicono cosa sistemare.">
      <div className="grid gap-4 lg:grid-cols-2">
        <Specimen label="Input" className="flex-col items-stretch">
          <div className="flex flex-col gap-2">
            <Label htmlFor="ds-email">Email</Label>
            <Input id="ds-email" placeholder="nome@email.it" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="ds-err">Password</Label>
            <Input id="ds-err" type="password" defaultValue="1234" aria-invalid />
            <p className="text-xs text-destructive">La password deve avere almeno 8 caratteri</p>
          </div>
          <Input disabled placeholder="Disabilitato" />
        </Specimen>
        <div className="flex flex-col gap-4">
          <Specimen label="Switch">
            <Switch id="ds-sw" checked={on} onCheckedChange={setOn} />
            <Label htmlFor="ds-sw">Notifiche sul telefono</Label>
            <Switch checked disabled aria-label="Necessario" />
          </Specimen>
          <Specimen label="Tabs">
            <Tabs defaultValue="tutti">
              <TabsList>
                <TabsTrigger value="tutti">Tutti</TabsTrigger>
                <TabsTrigger value="plus">Accumulati</TabsTrigger>
                <TabsTrigger value="minus">Riscattati</TabsTrigger>
              </TabsList>
              <TabsContent value="tutti" />
            </Tabs>
          </Specimen>
          <Specimen label="Toggle group · filtri (selezione invertita, bold)">
            <ToggleGroup type="single" value={v} onValueChange={(x) => x && setV(x)}>
              <ToggleGroupItem value="tutti">Tutti</ToggleGroupItem>
              <ToggleGroupItem value="disp">Disponibili</ToggleGroupItem>
              <ToggleGroupItem value="lock">Da sbloccare</ToggleGroupItem>
            </ToggleGroup>
          </Specimen>
          <Specimen label="Progress" className="flex-col items-stretch">
            <Progress value={68} aria-label="Esempio" />
            <Progress value={100} aria-label="Completo" indicatorClassName="bg-success" />
          </Specimen>
        </div>
      </div>
    </Section>
  )
}

function Containers() {
  return (
    <Section id="contenitori" title="Card e liste" lead="Card rhea: raggio rounded-4xl (≈19px), ring al 5%, spaziatura interna 20px (16px nella taglia sm). Le liste usano Item dentro una card, mai card dentro card.">
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-semibold">Card con azione</CardTitle>
            <CardDescription>Header, contenuto e footer seguono la stessa spaziatura.</CardDescription>
            <CardAction>
              <Badge variant="success">Nuovo</Badge>
            </CardAction>
          </CardHeader>
          <CardContent>
            <p className="text-sm">Contenuto della card. Gli elementi interni respirano a 20px dai bordi.</p>
          </CardContent>
          <CardFooter className="gap-2 border-t">
            <Button size="lg">Conferma</Button>
            <Button size="lg" variant="ghost">
              Annulla
            </Button>
          </CardFooter>
        </Card>
        <Card size="sm" className="py-1.5">
          <ItemGroup className="px-1.5">
            {INITIAL_MOVEMENTS.slice(0, 3).map((m) => (
              <MovementRow key={m.id} m={m} />
            ))}
          </ItemGroup>
        </Card>
        <ItemGroup className="gap-2">
          <Item variant="outline">
            <ItemMedia variant="icon">
              <RiGift2Line />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Item · outline</ItemTitle>
              <ItemDescription>Riga con media, testo e azione.</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button size="sm" variant="outline">
                Apri
              </Button>
            </ItemActions>
          </Item>
          <Item variant="muted">
            <Avatar>
              <AvatarFallback>GR</AvatarFallback>
            </Avatar>
            <ItemContent>
              <ItemTitle>Item · muted</ItemTitle>
              <ItemDescription>Con avatar.</ItemDescription>
            </ItemContent>
          </Item>
        </ItemGroup>
        <div className="flex flex-col gap-3">
          <Empty>
            <EmptyMedia>
              <RiHistoryLine />
            </EmptyMedia>
            <EmptyTitle>Stato vuoto</EmptyTitle>
            <EmptyDescription>Spiega perché è vuoto e cosa fare dopo.</EmptyDescription>
          </Empty>
          <div className="flex items-center gap-3 rounded-3xl border p-4">
            <Skeleton className="size-10 rounded-xl" />
            <div className="flex flex-1 flex-col gap-2">
              <Skeleton className="h-3.5 w-2/3" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}

function Overlays() {
  return (
    <Section id="overlay" title="Overlay e feedback" lead="Al telefono i dettagli si aprono in un drawer dal basso; le conferme distruttive in un dialog. Menu e toast seguono il preset: invertiti, con voce attiva piena.">
      <Specimen label="Prova">
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="outline" size="lg">
              Drawer
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Calice di vino</DrawerTitle>
              <DrawerDescription>Rosso o bianco della casa · 300 punti</DrawerDescription>
            </DrawerHeader>
            <DrawerFooter>
              <Button size="xl">Genera QR di riscatto</Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="lg">
              Dialog
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Annullare il riscatto?</DialogTitle>
              <DialogDescription>Il QR smette di funzionare. I punti restano intatti.</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="secondary" size="lg">
                  Tieni il codice
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <Button variant="destructive" size="lg">
                  Annulla riscatto
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="lg">
              Menu
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>FDL-4821</DropdownMenuLabel>
            <DropdownMenuItem>
              <RiUser3Line /> Profilo e consensi
            </DropdownMenuItem>
            <DropdownMenuItem>
              <RiHistoryLine /> Movimenti
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">
              <RiLogoutBoxRLine /> Esci
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="outline" size="lg" onClick={() => toast.success("+42 punti accreditati", { description: "Conto da 42,00 €" })}>
          Toast
        </Button>
      </Specimen>
      <Separator />
    </Section>
  )
}

function Patterns() {
  const [seed, setSeed] = React.useState(0)
  return (
    <Section id="pattern" title="Pattern Fidelia" lead="Gli elementi che rendono Fidelia riconoscibile. La tessera è un biglietto: due tacche laterali e una perforazione separano chi sei (sopra) da cosa fai adesso (sotto).">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium text-muted-foreground">TicketCard · tessera-biglietto con motivo "timbri" del brand, timbri con la spunta, firma "powered by fidelia" e riflesso al tocco</span>
          <TicketCard venue={{ name: "Osteria del Porto", initials: "OP" }} member={{ name: "Giulia Russo", code: "FDL-4821", points: 340 }} next={PRIZES[3]} />
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium text-muted-foreground">QrCode · reale e scansionabile, rigenerato a ogni ciclo</span>
          <div className="flex items-center gap-4 rounded-3xl border p-5">
            <div className="size-40 rounded-3xl border p-2">
              <QrCode value={`FIDELIA:FDL-4821:${seed}`} label="QR di esempio" />
            </div>
            <Button variant="outline" size="lg" onClick={() => setSeed((s) => s + 1)}>
              Rigenera <RiArrowRightLine />
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium text-muted-foreground">WalletPassPreview · la tessera nel wallet (colori derivati dai token)</span>
          <div className="flex flex-col items-center gap-4 rounded-3xl border p-5">
            <WalletPassPreview venue={{ name: "Osteria del Porto", initials: "OP" }} member={{ name: "Giulia Russo", code: "FDL-4821", points: 340 }} nextPrize="Dolce della casa" />
            <div className="flex flex-wrap justify-center gap-2">
              <WalletButton platform="apple" />
              <WalletButton platform="google" />
            </div>
            <p className="max-w-sm text-center text-xs text-muted-foreground">I pulsanti sono segnaposto: in produzione vanno usati i badge ufficiali Apple e Google (vedi docs/WALLET.md).</p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium text-muted-foreground">EventCard</span>
          <EventCard event={EVENTS[2]} />
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium text-muted-foreground">PrizeArt · tinte per categoria, desaturate se bloccate</span>
          <div className="flex flex-wrap gap-3 rounded-3xl border p-5">
            {PRIZES.map((p, i) => (
              <PrizeArt key={p.id} id={p.id} category={p.category} locked={i > 1} />
            ))}
          </div>
        </div>
      </div>
    </Section>
  )
}
