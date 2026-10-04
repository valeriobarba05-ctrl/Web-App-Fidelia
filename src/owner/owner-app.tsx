import * as React from "react"
import {
  RiAddLine,
  RiArrowDownSLine,
  RiArrowUpSLine,
  RiCalendarEventLine,
  RiCoupon3Line,
  RiDeleteBin6Line,
  RiEyeLine,
  RiLogoutBoxRLine,
  RiPaletteLine,
  RiGift2Line,
  RiPencilLine,
  RiRestartLine,
  RiSettings3Line,
  RiStore2Line,
  RiTimeLine,
} from "@remixicon/react"

import { PageBody, PageHeader } from "@/components/fidelia/page"
import { EventArt } from "@/components/fidelia/event-art"
import { ImageField } from "@/owner/image-field"
import { TicketCard, VenueMark } from "@/components/fidelia/loyalty-card"
import { WalletPassPreview } from "@/components/fidelia/wallet"
import { walletColors } from "@/lib/themes"
import { PrizeArt } from "@/components/fidelia/prize-art"
import { VenueThemePicker } from "@/owner/venue-theme-picker"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { Empty, EmptyDescription, EmptyTitle } from "@/components/ui/empty"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { NativeSelect } from "@/components/ui/native-select"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { eventDate, fmtMinutes } from "@/lib/format"
import type { EventType, FideliaEvent, Prize, Promo, Venue } from "@/types"
import { navigate } from "@/mock/router"
import { toast } from "sonner"

import { useSession } from "@/mock/session"
import { useVenue, useVenueAdmin } from "@/mock/venue"
import { cn, fmtPoints } from "@/lib/utils"

// ——— piccoli mattoni di form ———

function Field({ id, label, hint, error, children, className }: { id: string; label: string; hint?: string; error?: string | null; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-2", className)}>
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error ? (
        <p role="alert" className="text-xs text-destructive">
          {error}
        </p>
      ) : (
        hint && <p className="text-xs text-muted-foreground">{hint}</p>
      )}
    </div>
  )
}

function SwitchRow({ id, title, desc, checked, onChange, disabled }: { id: string; title: string; desc?: string; checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <div className="flex items-start gap-3">
      <Label htmlFor={id} className="flex-1 flex-col items-start gap-1 leading-snug">
        <span>{title}</span>
        {desc && <span className="text-xs font-normal text-muted-foreground">{desc}</span>}
      </Label>
      <Switch id={id} checked={checked} onCheckedChange={onChange} disabled={disabled} />
    </div>
  )
}

const isUrl = (v: string) => !v || /^https:\/\/\S+$/.test(v)

// ——— App del titolare: sessione, accesso e navigazione propri ———

const SECTIONS = [
  { id: "identita", label: "Identità e colori", icon: RiStore2Line, desc: "Nome, immagini e colori del locale. Le modifiche si salvano subito." },
  { id: "premi", label: "Premi", icon: RiGift2Line, desc: "Il catalogo che i clienti riscattano con i punti." },
  { id: "promo", label: "Promo", icon: RiCoupon3Line, desc: "Offerte in evidenza nella Home e in Novità." },
  { id: "eventi", label: "Eventi", icon: RiCalendarEventLine, desc: "Serate con prenotazione e punti bonus." },
  { id: "orari", label: "Orari e contatti", icon: RiTimeLine, desc: "Quando sei aperto e come trovarti." },
  { id: "regole", label: "Regole e funzioni", icon: RiSettings3Line, desc: "Come si guadagnano i punti e quali parti dell'app sono attive." },
] as const

/** Contenuti del locale in lettura + scrittura: esiste solo qui, nell'app del titolare. */
function useOwner() {
  return { ...useVenue(), ...useVenueAdmin() }
}

export function OwnerApp({ section }: { section: string }) {
  const { signOut } = useSession()
  const logout = () => {
    signOut()
    navigate("home")
  }
  const current = SECTIONS.find((s) => s.id === section) ?? SECTIONS[0]
  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[280px_1fr]">
      <OwnerSidebar current={current.id} onLogout={logout} />
      <div className="flex min-w-0 flex-col pb-12">
        <OwnerMobileBar current={current.id} onLogout={logout} />
        <PageHeader title={current.label} description={current.desc} />
        <PageBody>
          {current.id === "identita" && <Identity />}
          {current.id === "premi" && <PrizesAdmin />}
          {current.id === "promo" && <PromosAdmin />}
          {current.id === "eventi" && <EventsAdmin />}
          {current.id === "orari" && <HoursContacts />}
          {current.id === "regole" && <Rules />}
        </PageBody>
      </div>
    </div>
  )
}

const goSection = (id: string) => navigate("titolare", { sezione: id })

/** Account Google con cui il titolare è entrato. */
function OwnerAccount() {
  const { account } = useSession()
  if (!account) return null
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-sidebar-accent p-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-highlight text-sm font-semibold text-highlight-foreground">
        {account.name.split(" ").map((p) => p[0]).join("").slice(0, 2)}
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="truncate text-sm font-medium">{account.name}</span>
        <span className="truncate text-xs text-sidebar-muted">{account.email}</span>
      </span>
    </div>
  )
}

function OwnerSidebar({ current, onLogout }: { current: string; onLogout: () => void }) {
  const { venue } = useVenue()
  return (
    <aside className="sticky top-0 hidden h-dvh flex-col gap-6 overflow-y-auto bg-sidebar p-4 text-sidebar-foreground lg:flex">
      <div className="flex items-center gap-3 p-2">
        <VenueMark initials={venue.initials} logo={venue.logo} />
        <span className="flex min-w-0 flex-col">
          <span className="truncate font-heading text-[15px] font-semibold">{venue.name}</span>
          <span className="text-xs text-sidebar-muted">Gestione del locale</span>
        </span>
      </div>
      <nav aria-label="Gestione" className="flex flex-col gap-1">
        {SECTIONS.map(({ id, label, icon: Icon }) => (
          <a
            key={id}
            href={`#/titolare?sezione=${id}`}
            aria-current={current === id ? "page" : undefined}
            className={cn(
              "flex h-11 items-center gap-3 rounded-2xl px-3 text-sm font-medium text-sidebar-muted outline-none transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground focus-visible:ring-3 focus-visible:ring-sidebar-ring/40",
              current === id && "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground",
            )}
          >
            <Icon className="size-5" />
            {label}
          </a>
        ))}
      </nav>
      <div className="mt-auto flex flex-col gap-3">
        <a href="#/home" target="_blank" rel="noopener" className="flex h-10 items-center gap-2.5 rounded-2xl px-3 text-sm font-medium text-sidebar-muted outline-none hover:bg-sidebar-accent hover:text-sidebar-foreground focus-visible:ring-3 focus-visible:ring-sidebar-ring/40">
          <RiEyeLine className="size-4" /> Apri l'app clienti
        </a>
        <a href="#/design-system" className="flex h-10 items-center gap-2.5 rounded-2xl px-3 text-sm font-medium text-sidebar-muted outline-none hover:bg-sidebar-accent hover:text-sidebar-foreground focus-visible:ring-3 focus-visible:ring-sidebar-ring/40">
          <RiPaletteLine className="size-4" /> Design system
        </a>
        <OwnerAccount />
        <button onClick={onLogout} className="flex h-10 items-center gap-2.5 rounded-2xl px-3 text-left text-sm font-medium text-sidebar-muted outline-none hover:bg-sidebar-accent hover:text-sidebar-foreground focus-visible:ring-3 focus-visible:ring-sidebar-ring/40">
          <RiLogoutBoxRLine className="size-4" /> Esci dalla gestione
        </button>
      </div>
    </aside>
  )
}

function OwnerMobileBar({ current, onLogout }: { current: string; onLogout: () => void }) {
  const { venue } = useVenue()
  return (
    <div className="sticky top-0 z-30 flex flex-col gap-2 bg-sidebar px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-2 text-sidebar-foreground lg:hidden">
      <div className="flex items-center gap-3">
        <VenueMark initials={venue.initials} logo={venue.logo} className="size-8 rounded-xl text-xs" />
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-sm font-semibold">{venue.name}</span>
          <span className="text-xs text-sidebar-muted">Gestione del locale</span>
        </span>
        <Button asChild variant="glass" size="sm">
          <a href="#/home" target="_blank" rel="noopener">
            <RiEyeLine /> App clienti
          </a>
        </Button>
        <Button variant="ghost" size="icon-lg" aria-label="Esci dalla gestione" className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground" onClick={onLogout}>
          <RiLogoutBoxRLine />
        </Button>
      </div>
      <nav aria-label="Gestione" className="-mx-4 flex gap-1.5 overflow-x-auto px-4 pb-1 no-scrollbar">
        {SECTIONS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => goSection(id)}
            aria-current={current === id ? "page" : undefined}
            className={cn(
              "touch-target flex h-9 shrink-0 items-center gap-1.5 rounded-2xl px-3 text-[13px] font-medium text-sidebar-muted outline-none focus-visible:ring-3 focus-visible:ring-sidebar-ring/40",
              current === id && "bg-sidebar-primary text-sidebar-primary-foreground",
            )}
          >
            <Icon className="size-4" />
            {label}
          </button>
        ))}
      </nav>
    </div>
  )
}

// ——— Identità: nome, immagini, colori, con anteprima della tessera ———

function Identity() {
  const { venue, updateVenue, visible } = useOwner()
  const wc = walletColors(venue.brandColor, venue.highlightColor)
  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_400px] lg:items-start">
      <div className="flex flex-col gap-5">
        <Card>
          <CardHeader>
            <CardTitle className="font-semibold">Nome e presentazione</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-[1fr_120px]">
            <Field id="v-name" label="Nome del locale" error={venue.name.trim() ? null : "Il nome non può essere vuoto"}>
              <Input id="v-name" value={venue.name} onChange={(e) => updateVenue({ name: e.target.value })} maxLength={40} />
            </Field>
            <Field id="v-ini" label="Sigla" hint="Se non c'è il logo">
              <Input id="v-ini" value={venue.initials} onChange={(e) => updateVenue({ initials: e.target.value.toUpperCase().slice(0, 3) })} />
            </Field>
            <Field id="v-tag" label="Frase di benvenuto" hint="Appare nella schermata di accesso" className="sm:col-span-2">
              <Textarea id="v-tag" value={venue.tagline} onChange={(e) => updateVenue({ tagline: e.target.value })} maxLength={120} />
            </Field>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-semibold">Immagini del locale</CardTitle>
            <CardDescription>Le immagini vengono ridimensionate e compresse per caricarsi in fretta al telefono.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5 sm:grid-cols-[160px_1fr]">
            <ImageField id="v-logo" label="Logo" aspect="aspect-square" max={400} value={venue.logo} onChange={(logo) => updateVenue({ logo })} hint="Quadrato, sfondo pieno" />
            <ImageField id="v-cover" label="Foto di copertina" value={venue.cover} onChange={(cover) => updateVenue({ cover })} hint="Pagina del locale e schermata di accesso" />
            <ImageField id="v-map" label="Immagine della mappa" value={venue.mapImage} onChange={(mapImage) => updateVenue({ mapImage })} hint="Uno screenshot della mappa o della facciata" className="sm:col-span-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-semibold">Colori</CardTitle>
            <CardDescription>Scegli un abbinamento o i tuoi due colori. Tema chiaro e scuro si adattano da soli.</CardDescription>
          </CardHeader>
          <CardContent>
            <VenueThemePicker />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-semibold">Tessera nel wallet</CardTitle>
            <CardDescription>I clienti possono aggiungere la tessera ad Apple Wallet e Google Wallet. Colori e logo arrivano da qui; puoi aggiungere un'immagine orizzontale.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_280px] sm:items-start">
            <div className="flex flex-col gap-4">
              <ImageField
                id="v-wallet"
                label="Immagine della tessera (facoltativa)"
                aspect="aspect-[3/1]"
                max={1125}
                value={venue.walletImage}
                onChange={(walletImage) => updateVenue({ walletImage })}
                hint="Orizzontale 3:1, per esempio 1125 × 375 px. Il saldo ci va sopra: meglio una foto senza testo."
              />
              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium">Colori del pass</span>
                <div className="flex flex-wrap gap-2 text-xs">
                  {(
                    [
                      ["Sfondo", wc.background],
                      ["Testo", wc.foreground],
                      ["Etichette", wc.label],
                    ] as const
                  ).map(([k, v]) => (
                    <span key={k} className="flex items-center gap-2 rounded-xl border px-2.5 py-1.5">
                      <span className="size-4 rounded-md ring-1 ring-foreground/10" style={{ background: v }} />
                      {k} <code className="font-mono text-muted-foreground uppercase">{v}</code>
                    </span>
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">Calcolati dai colori del locale, con contrasto garantito.</span>
              </div>
            </div>
            <WalletPassPreview venue={venue} member={{ name: "Cliente di esempio", code: "FDL-0000", points: 340 }} nextPrize={visible.prizes.find((p) => p.cost > 340)?.name} image={venue.walletImage} />
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-3 lg:sticky lg:top-10">
        <span className="px-1 text-sm font-semibold">Anteprima della tessera</span>
        <TicketCard venue={venue} member={{ name: "Cliente di esempio", code: "FDL-0000", points: 340 }} next={visible.prizes.find((p) => p.cost > 340) ?? null} />
        <p className="px-1 text-xs text-muted-foreground">Così la vedono i clienti.</p>
      </div>
    </div>
  )
}

// ——— Liste gestibili (premi, promo, eventi) ———

function AdminList<T extends { id: string }>({
  items,
  kind,
  render,
  onEdit,
  onAdd,
  addLabel,
  emptyText,
}: {
  items: T[]
  kind: "prizes" | "promos" | "events"
  render: (item: T) => { media: React.ReactNode; title: string; meta: React.ReactNode; active?: boolean }
  onEdit: (item: T) => void
  onAdd: () => void
  addLabel: string
  emptyText: string
}) {
  const { move, remove, upsert } = useOwner()
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm text-muted-foreground">{items.length} in elenco · l'ordine è quello che vedono i clienti</span>
        <Button size="lg" onClick={onAdd}>
          <RiAddLine /> {addLabel}
        </Button>
      </div>
      {items.length === 0 ? (
        <Empty>
          <EmptyTitle>Ancora niente qui</EmptyTitle>
          <EmptyDescription>{emptyText}</EmptyDescription>
        </Empty>
      ) : (
        <ul className="flex flex-col gap-2">
          {items.map((item, i) => {
            const r = render(item)
            return (
              <li key={item.id} className={cn("flex flex-wrap items-center gap-3 rounded-3xl bg-card p-3 shadow-sm ring-1 ring-foreground/5 dark:ring-foreground/10", r.active === false && "bg-muted/60")}>
                {r.media}
                <button type="button" onClick={() => onEdit(item)} className="flex min-w-0 flex-1 basis-[11rem] flex-col gap-1 text-left outline-none focus-visible:underline">
                  <span className="flex items-center gap-2 font-heading text-base font-semibold">
                    <span className="truncate">{r.title || "Senza titolo"}</span>
                    {r.active === false && <Badge variant="secondary">Nascosto</Badge>}
                  </span>
                  <span className="line-clamp-2 text-xs text-muted-foreground">{r.meta}</span>
                </button>
                <div className="ml-auto flex items-center gap-1">
                  {r.active !== undefined && (
                    <Switch
                      aria-label={r.active ? "Nascondi ai clienti" : "Mostra ai clienti"}
                      checked={r.active}
                      onCheckedChange={(v) => {
                        upsert(kind, { ...item, active: v } as never)
                        toast(v ? "Visibile ai clienti" : "Nascosto ai clienti", { description: r.title })
                      }}
                      className="mr-1"
                    />
                  )}
                  <Button variant="ghost" size="icon-lg" aria-label="Sposta su" disabled={i === 0} onClick={() => move(kind, item.id, -1)}>
                    <RiArrowUpSLine />
                  </Button>
                  <Button variant="ghost" size="icon-lg" aria-label="Sposta giù" disabled={i === items.length - 1} onClick={() => move(kind, item.id, 1)}>
                    <RiArrowDownSLine />
                  </Button>
                  <Button variant="secondary" size="icon-lg" aria-label={`Modifica ${r.title}`} onClick={() => onEdit(item)}>
                    <RiPencilLine />
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="destructive" size="icon-lg" aria-label={`Elimina ${r.title}`}>
                        <RiDeleteBin6Line />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Eliminare “{r.title}”?</DialogTitle>
                        <DialogDescription>Sparisce subito dall'app dei clienti. Se vuoi solo toglierlo per un po', usa l'interruttore per nasconderlo.</DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="secondary" size="lg">
                            Annulla
                          </Button>
                        </DialogClose>
                        <DialogClose asChild>
                          <Button
                            variant="destructive"
                            size="lg"
                            onClick={() => {
                              remove(kind, item.id)
                              toast("Eliminato", { description: r.title })
                            }}
                          >
                            Elimina
                          </Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

function EditorDrawer({ open, onClose, title, description, onSave, children }: { open: boolean; onClose: () => void; title: string; description: string; onSave: () => void; children: React.ReactNode }) {
  return (
    <Drawer open={open} onOpenChange={(o) => !o && onClose()} repositionInputs={false}>
      <DrawerContent className="max-w-2xl">
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>
        <form
          id="editor"
          className="flex min-h-0 flex-col gap-4 overflow-y-auto overscroll-contain px-5 py-2"
          onSubmit={(e) => {
            e.preventDefault()
            onSave()
          }}
        >
          {children}
        </form>
        <DrawerFooter className="flex-row border-t pt-4">
          <Button type="button" variant="secondary" size="xl" className="flex-1" onClick={onClose}>
            Annulla
          </Button>
          <Button type="submit" form="editor" size="xl" className="flex-1">
            Salva
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

// Premi

function PrizesAdmin() {
  const { prizes, upsert, newId } = useOwner()
  const [draft, setDraft] = React.useState<Prize | null>(null)
  const [tried, setTried] = React.useState(false)
  const err = draft && { name: draft.name.trim() ? null : "Scrivi il nome del premio", cost: draft.cost >= 1 ? null : "Il costo deve essere almeno 1 punto" }
  const edit = (p: Prize | null) => {
    setTried(false)
    setDraft(p)
  }
  return (
    <>
      <AdminList
        items={prizes}
        kind="prizes"
        addLabel="Nuovo premio"
        emptyText="Aggiungi il primo premio: un caffè a 100 punti è un buon inizio."
        onAdd={() => edit({ id: newId(), name: "", note: "", cost: 100, category: "bar", active: true })}
        onEdit={edit}
        render={(p) => ({ media: <PrizeArt id={p.id} image={p.image} category={p.category} className="size-12" />, title: p.name, meta: `${fmtPoints(p.cost)} punti · ${p.note || "nessuna descrizione"}`, active: p.active !== false })}
      />
      <EditorDrawer
        open={!!draft}
        onClose={() => edit(null)}
        title={draft && prizes.some((p) => p.id === draft.id) ? "Modifica premio" : "Nuovo premio"}
        description="I clienti lo vedono nel catalogo, ordinato per punti."
        onSave={() => {
          setTried(true)
          if (!draft || err?.name || err?.cost) return
          upsert("prizes", { ...draft, name: draft.name.trim() })
          toast.success("Premio salvato", { description: draft.name })
          edit(null)
        }}
      >
        {draft && (
          <div className="grid gap-4 sm:grid-cols-[180px_1fr]">
            <ImageField id="p-img" label="Foto del premio" aspect="aspect-square" max={700} value={draft.image} onChange={(image) => setDraft({ ...draft, image })} hint="Senza foto usiamo un'icona" />
            <div className="flex flex-col gap-4">
              <Field id="p-name" label="Nome" error={tried ? err?.name : null}>
                <Input id="p-name" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="Calice di vino" maxLength={40} aria-invalid={tried && !!err?.name} />
              </Field>
              <Field id="p-note" label="Descrizione breve">
                <Input id="p-note" value={draft.note} onChange={(e) => setDraft({ ...draft, note: e.target.value })} placeholder="Rosso o bianco della casa" maxLength={70} />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field id="p-cost" label="Costo in punti" error={tried ? err?.cost : null}>
                  <Input id="p-cost" type="number" inputMode="numeric" min={1} value={draft.cost} onChange={(e) => setDraft({ ...draft, cost: Math.round(Number(e.target.value)) })} aria-invalid={tried && !!err?.cost} />
                </Field>
                <Field id="p-cat" label="Categoria">
                  <NativeSelect id="p-cat" value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value as Prize["category"] })}>
                    <option value="bar">Bar</option>
                    <option value="cucina">Cucina</option>
                    <option value="esperienza">Esperienza</option>
                  </NativeSelect>
                </Field>
              </div>
              <SwitchRow id="p-on" title="Visibile ai clienti" checked={draft.active !== false} onChange={(active) => setDraft({ ...draft, active })} />
            </div>
          </div>
        )}
      </EditorDrawer>
    </>
  )
}

// Promo

const DAYS = [
  [1, "Lun"],
  [2, "Mar"],
  [3, "Mer"],
  [4, "Gio"],
  [5, "Ven"],
  [6, "Sab"],
  [0, "Dom"],
] as const

function PromosAdmin() {
  const { promos, upsert, newId, venue } = useOwner()
  const [draft, setDraft] = React.useState<Promo | null>(null)
  const [tried, setTried] = React.useState(false)
  const titleErr = draft && !draft.title.trim() ? "Scrivi il titolo della promo" : null
  const edit = (p: Promo | null) => {
    setTried(false)
    setDraft(p)
  }
  return (
    <>
      {!venue.features.promos && <FeatureOff label="Le promo sono spente in Regole e funzioni: i clienti non le vedono." />}
      <AdminList
        items={promos}
        kind="promos"
        addLabel="Nuova promo"
        emptyText="Pubblica un'offerta: i clienti la trovano in Home e in Novità."
        onAdd={() => edit({ id: newId(), label: "Promo del mese", title: "", text: "", validity: "", active: true, days: [] })}
        onEdit={edit}
        render={(p) => ({
          media: p.image ? <img src={p.image} alt="" className="size-12 rounded-2xl object-cover" /> : <span className="flex size-12 items-center justify-center rounded-2xl bg-warning-soft text-warning"><RiCoupon3Line className="size-5" /></span>,
          title: p.title,
          meta: [p.label, p.doublePoints && "punti doppi", p.validity].filter(Boolean).join(" · "),
          active: p.active !== false,
        })}
      />
      <EditorDrawer
        open={!!draft}
        onClose={() => edit(null)}
        title={draft && promos.some((p) => p.id === draft.id) ? "Modifica promo" : "Nuova promo"}
        description="La prima promo attiva è quella in evidenza."
        onSave={() => {
          setTried(true)
          if (!draft || titleErr) return
          upsert("promos", draft)
          toast.success("Promo salvata", { description: draft.title })
          edit(null)
        }}
      >
        {draft && (
          <div className="flex flex-col gap-4">
            <ImageField id="pr-img" label="Immagine" value={draft.image} onChange={(image) => setDraft({ ...draft, image })} hint="Il testo in evidenza resta leggibile: aggiungiamo un velo con il colore del locale." />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="pr-label" label="Etichetta">
                <Input id="pr-label" value={draft.label} onChange={(e) => setDraft({ ...draft, label: e.target.value })} placeholder="Solo per iscritti" maxLength={30} />
              </Field>
              <Field id="pr-val" label="Validità">
                <Input id="pr-val" value={draft.validity} onChange={(e) => setDraft({ ...draft, validity: e.target.value })} placeholder="Valida fino al 31 ottobre" maxLength={50} />
              </Field>
            </div>
            <Field id="pr-title" label="Titolo" error={tried ? titleErr : null}>
              <Input id="pr-title" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="Martedì pizza + birra a 12 €" maxLength={60} aria-invalid={tried && !!titleErr} />
            </Field>
            <Field id="pr-text" label="Descrizione">
              <Textarea id="pr-text" value={draft.text} onChange={(e) => setDraft({ ...draft, text: e.target.value })} maxLength={240} />
            </Field>
            <Separator />
            <SwitchRow id="pr-double" title="Punti doppi" desc="Nei giorni scelti ogni conto vale il doppio dei punti." checked={!!draft.doublePoints} onChange={(doublePoints) => setDraft({ ...draft, doublePoints })} />
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium">Giorni attivi</span>
              <ToggleGroup type="multiple" value={(draft.days ?? []).map(String)} onValueChange={(v) => setDraft({ ...draft, days: v.map(Number) })} className="flex-wrap">
                {DAYS.map(([d, l]) => (
                  <ToggleGroupItem key={d} value={String(d)} className="w-12 px-0">
                    {l}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
              <span className="text-xs text-muted-foreground">Nei giorni scelti la promo appare come “Attiva oggi”.</span>
            </div>
            <SwitchRow id="pr-on" title="Visibile ai clienti" checked={draft.active !== false} onChange={(active) => setDraft({ ...draft, active })} />
          </div>
        )}
      </EditorDrawer>
    </>
  )
}

// Eventi

const EVENT_TYPES: [EventType, string][] = [
  ["karaoke", "Karaoke"],
  ["live", "Musica live"],
  ["degustazione", "Degustazione"],
  ["natale", "Festa"],
]

function EventsAdmin() {
  const { events, upsert, newId, venue } = useOwner()
  const [draft, setDraft] = React.useState<FideliaEvent | null>(null)
  const [tried, setTried] = React.useState(false)
  const err = draft && {
    title: draft.title.trim() ? null : "Scrivi il nome dell'evento",
    date: draft.date ? null : "Scegli la data",
    seats: draft.seatsLeft <= draft.seats && draft.seatsLeft >= 0 ? null : "I posti liberi non possono superare quelli totali",
  }
  const edit = (e: FideliaEvent | null) => {
    setTried(false)
    setDraft(e)
  }
  return (
    <>
      {!venue.features.events && <FeatureOff label="Gli eventi sono spenti in Regole e funzioni: i clienti non li vedono." />}
      <AdminList
        items={events}
        kind="events"
        addLabel="Nuovo evento"
        emptyText="Crea una serata: i clienti potranno prenotare e guadagnare punti bonus."
        onAdd={() =>
          edit({ id: newId(), type: "live", typeLabel: "Musica live", title: "", date: new Date(Date.now() + 7 * 864e5).toISOString().slice(0, 10), time: "21:00", description: "", price: "Ingresso libero", bonusPoints: 30, seats: 40, seatsLeft: 40 })
        }
        onEdit={edit}
        render={(e) => {
          const d = eventDate(e.date)
          return {
            media: (
              <div className="relative isolate flex size-12 flex-col items-center justify-center overflow-hidden rounded-2xl text-white">
                <EventArt type={e.type} image={e.image} />
                <span className="font-heading text-base leading-none font-bold">{d.day}</span>
                <span className="text-[11px] font-semibold uppercase">{d.month}</span>
              </div>
            ),
            title: e.title,
            meta: `${e.typeLabel} · ${d.weekday} ${e.time} · ${e.seatsLeft}/${e.seats} posti · +${e.bonusPoints} punti`,
          }
        }}
      />
      <EditorDrawer
        open={!!draft}
        onClose={() => edit(null)}
        title={draft && events.some((x) => x.id === draft.id) ? "Modifica evento" : "Nuovo evento"}
        description="Gli eventi appaiono in ordine di data."
        onSave={() => {
          setTried(true)
          if (!draft || err?.title || err?.date || err?.seats) return
          upsert("events", draft)
          toast.success("Evento salvato", { description: draft.title })
          edit(null)
        }}
      >
        {draft && (
          <div className="flex flex-col gap-4">
            <ImageField id="ev-img" label="Locandina o foto" value={draft.image} onChange={(image) => setDraft({ ...draft, image })} hint="Senza immagine usiamo l'illustrazione del tipo di evento. Il titolo sta sempre su un velo scuro." />
            <Field id="ev-title" label="Nome dell'evento" error={tried ? err?.title : null}>
              <Input id="ev-title" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="Live acustico" maxLength={50} aria-invalid={tried && !!err?.title} />
            </Field>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <Field id="ev-type" label="Tipo">
                <NativeSelect
                  id="ev-type"
                  value={draft.type}
                  onChange={(e) => {
                    const type = e.target.value as EventType
                    setDraft({ ...draft, type, typeLabel: EVENT_TYPES.find(([t]) => t === type)![1] })
                  }}
                >
                  {EVENT_TYPES.map(([t, l]) => (
                    <option key={t} value={t}>
                      {l}
                    </option>
                  ))}
                </NativeSelect>
              </Field>
              <Field id="ev-date" label="Data" error={tried ? err?.date : null}>
                <Input id="ev-date" type="date" value={draft.date} onChange={(e) => setDraft({ ...draft, date: e.target.value })} />
              </Field>
              <Field id="ev-time" label="Ora">
                <Input id="ev-time" type="time" value={draft.time} onChange={(e) => setDraft({ ...draft, time: e.target.value })} />
              </Field>
            </div>
            <Field id="ev-desc" label="Descrizione">
              <Textarea id="ev-desc" value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} maxLength={240} />
            </Field>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Field id="ev-price" label="Prezzo" className="col-span-2 sm:col-span-1">
                <Input id="ev-price" value={draft.price} onChange={(e) => setDraft({ ...draft, price: e.target.value })} placeholder="35 € a persona" />
              </Field>
              <Field id="ev-bonus" label="Punti bonus">
                <Input id="ev-bonus" type="number" min={0} value={draft.bonusPoints} onChange={(e) => setDraft({ ...draft, bonusPoints: Math.max(0, Math.round(Number(e.target.value))) })} />
              </Field>
              <Field id="ev-seats" label="Posti totali">
                <Input id="ev-seats" type="number" min={1} value={draft.seats} onChange={(e) => setDraft({ ...draft, seats: Math.max(1, Math.round(Number(e.target.value))) })} />
              </Field>
              <Field id="ev-left" label="Posti liberi" error={tried ? err?.seats : null}>
                <Input id="ev-left" type="number" min={0} value={draft.seatsLeft} onChange={(e) => setDraft({ ...draft, seatsLeft: Math.max(0, Math.round(Number(e.target.value))) })} aria-invalid={tried && !!err?.seats} />
              </Field>
            </div>
          </div>
        )}
      </EditorDrawer>
    </>
  )
}

function FeatureOff({ label }: { label: string }) {
  return (
    <div className="mb-3 flex flex-wrap items-center gap-3 rounded-2xl bg-warning-soft p-3.5 text-sm text-warning">
      <span className="flex-1 font-medium">{label}</span>
      <Button variant="outline" size="sm" onClick={() => goSection("regole")}>
        Apri Regole e funzioni
      </Button>
    </div>
  )
}

// ——— Orari e contatti ———

const toHHMM = (m: number) => fmtMinutes(m)
const fromHHMM = (v: string) => {
  const [h, m] = v.split(":").map(Number)
  return (h || 0) * 60 + (m || 0)
}

function HoursContacts() {
  const { venue, updateVenue } = useOwner()
  const setDay = (d: number, slots: [number, number][]) => updateVenue({ hours: venue.hours.map((x, i) => (i === d ? { ...x, slots } : x)) })
  const setLink = (k: keyof Venue["links"], v: string) => updateVenue({ links: { ...venue.links, [k]: v } })
  const LINKS: [keyof Venue["links"], string, string][] = [
    ["maps", "Google Maps", "https://maps.app.goo.gl/…"],
    ["menu", "Menù online", "https://…"],
    ["review", "Recensioni Google", "https://g.page/r/…/review"],
    ["instagram", "Instagram", "https://instagram.com/…"],
    ["facebook", "Facebook", "https://facebook.com/…"],
    ["tiktok", "TikTok", "https://tiktok.com/@…"],
    ["whatsapp", "WhatsApp", "https://wa.me/39…"],
    ["privacy", "Informativa privacy", "https://…"],
  ]
  return (
    <div className="grid gap-5 lg:grid-cols-2 lg:items-start">
      <Card>
        <CardHeader>
          <CardTitle className="font-semibold">Orari di apertura</CardTitle>
          <CardDescription>Fino a due fasce al giorno. “Aperto ora” si calcola da qui. Una chiusura dopo mezzanotte va bene.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-1">
          {[1, 2, 3, 4, 5, 6, 0].map((d) => {
            const day = venue.hours[d]
            const open = day.slots.length > 0
            return (
              <div key={d} className="flex flex-col gap-2 border-b py-3 last:border-0">
                <div className="flex items-center gap-3">
                  <span className="flex-1 text-sm font-medium">{day.day}</span>
                  <Label htmlFor={`h-${d}`} className="text-xs font-normal text-muted-foreground">
                    {open ? "Aperto" : "Chiuso"}
                  </Label>
                  <Switch id={`h-${d}`} checked={open} onCheckedChange={(v) => setDay(d, v ? [[1140, 1410]] : [])} />
                </div>
                {day.slots.map(([a, b], i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Input className="min-w-0 flex-1" aria-label={`${day.day}, fascia ${i + 1}, apertura`} type="time" value={toHHMM(a)} onChange={(e) => setDay(d, day.slots.map((s, j) => (j === i ? [fromHHMM(e.target.value), s[1]] : s)))} />
                    <span aria-hidden className="text-muted-foreground">–</span>
                    <Input
                      className="min-w-0 flex-1"
                      aria-label={`${day.day}, fascia ${i + 1}, chiusura`}
                      type="time"
                      value={toHHMM(b)}
                      onChange={(e) => {
                        let close = fromHHMM(e.target.value)
                        if (close <= a) close += 1440
                        setDay(d, day.slots.map((s, j) => (j === i ? [s[0], close] : s)))
                      }}
                    />
                    {i === 1 ? (
                      <Button variant="ghost" size="icon-lg" aria-label="Rimuovi fascia" onClick={() => setDay(d, [day.slots[0]])}>
                        <RiDeleteBin6Line />
                      </Button>
                    ) : day.slots.length === 1 ? (
                      <Button variant="ghost" size="icon-lg" aria-label="Aggiungi seconda fascia" onClick={() => setDay(d, [[720, 900], ...day.slots].sort((x, y) => x[0] - y[0]) as [number, number][])}>
                        <RiAddLine />
                      </Button>
                    ) : (
                      <span className="size-9 shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            )
          })}
        </CardContent>
      </Card>

      <div className="flex flex-col gap-5">
        <Card>
          <CardHeader>
            <CardTitle className="font-semibold">Contatti</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Field id="c-addr" label="Indirizzo">
              <Input id="c-addr" value={venue.address} onChange={(e) => updateVenue({ address: e.target.value })} placeholder="Via e numero civico, città" autoComplete="street-address" />
            </Field>
            <Field id="c-tel" label="Telefono" hint="Il pulsante Chiama appare solo se c'è un numero">
              <Input id="c-tel" type="tel" value={venue.phone} onChange={(e) => updateVenue({ phone: e.target.value })} placeholder="+39 …" />
            </Field>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-semibold">Link</CardTitle>
            <CardDescription>Lascia vuoto ciò che non usi: il pulsante non comparirà.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            {LINKS.map(([k, l, ph]) => (
              <Field key={k} id={`l-${k}`} label={l} error={isUrl(venue.links[k]) ? null : "Il link deve iniziare con https://"}>
                <Input id={`l-${k}`} type="url" inputMode="url" value={venue.links[k]} onChange={(e) => setLink(k, e.target.value.trim())} placeholder={ph} aria-invalid={!isUrl(venue.links[k])} />
              </Field>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// ——— Accesso alla gestione: account Google del titolare (e dei gestori) ———

function OwnerAccounts() {
  const { venue, updateVenue } = useOwner()
  const { account } = useSession()
  const [email, setEmail] = React.useState("")
  const valid = /^\S+@\S+\.\S+$/.test(email)
  const exists = venue.ownerEmails.some((e) => e.toLowerCase() === email.trim().toLowerCase())
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-semibold">Accesso alla gestione</CardTitle>
        <CardDescription>Chi entra nell'app con uno di questi account Google vede la gestione; tutti gli altri vedono l'app cliente.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <ul className="flex flex-col gap-2">
          {venue.ownerEmails.map((e) => {
            const me = account?.email.toLowerCase() === e.toLowerCase()
            return (
              <li key={e} className="flex items-center gap-3 rounded-2xl bg-muted p-3">
                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="text-sm font-medium break-all">{e}</span>
                  {me && <span className="text-xs text-muted-foreground">È l'account con cui sei entrato: per toglierlo entra con un altro account abilitato.</span>}
                </span>
                {me ? (
                  <Badge variant="success">Sei tu</Badge>
                ) : (
                  <Button
                    variant="ghost"
                    size="icon-lg"
                    aria-label={`Rimuovi ${e}`}
                    onClick={() => {
                      updateVenue({ ownerEmails: venue.ownerEmails.filter((x) => x !== e) })
                      toast("Accesso rimosso", { description: e })
                    }}
                  >
                    <RiDeleteBin6Line />
                  </Button>
                )}
              </li>
            )
          })}
        </ul>
        <form
          className="flex gap-2"
          onSubmit={(ev) => {
            ev.preventDefault()
            if (!valid || exists) return
            updateVenue({ ownerEmails: [...venue.ownerEmails, email.trim()] })
            toast.success("Accesso aggiunto", { description: email.trim() })
            setEmail("")
          }}
        >
          <Label htmlFor="r-owner" className="sr-only">
            Aggiungi un account Google
          </Label>
          <Input id="r-owner" type="email" inputMode="email" placeholder="email@gmail.com" value={email} onChange={(ev) => setEmail(ev.target.value)} aria-invalid={exists} />
          <Button type="submit" size="lg" className="h-10" disabled={!valid || exists}>
            <RiAddLine /> Aggiungi
          </Button>
        </form>
        {exists && <p className="text-xs text-destructive">Questo account ha già accesso.</p>}
      </CardContent>
    </Card>
  )
}

// ——— Regole e funzioni ———

function Rules() {
  const { venue, updateVenue, resetVenue } = useOwner()
  const setFeature = (k: keyof Venue["features"], v: boolean) => updateVenue({ features: { ...venue.features, [k]: v } })
  const num = (v: string, min: number, max: number) => Math.min(max, Math.max(min, Number(v) || min))
  return (
    <div className="grid gap-5 lg:grid-cols-2 lg:items-start">
      <Card>
        <CardHeader>
          <CardTitle className="font-semibold">Regole dei punti</CardTitle>
          <CardDescription>Valgono dalla prossima visita registrata.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Field id="r-ppe" label="Punti per ogni euro" hint={`Esempio: un conto da 40 € vale ${Math.floor(40 * venue.pointsPerEuro)} punti`}>
            <Input id="r-ppe" type="number" step={0.5} min={0.5} max={10} value={venue.pointsPerEuro} onChange={(e) => updateVenue({ pointsPerEuro: num(e.target.value, 0.5, 10) })} />
          </Field>
          <Field id="r-wel" label="Punti di benvenuto" hint="0 per non regalarne">
            <Input id="r-wel" type="number" min={0} max={1000} value={venue.welcomePoints} onChange={(e) => updateVenue({ welcomePoints: num(e.target.value, 0, 1000) })} />
          </Field>
          <Field id="r-red" label="Validità QR di riscatto" hint="Minuti prima che il codice scada">
            <NativeSelect id="r-red" value={venue.redeemValidityMinutes} onChange={(e) => updateVenue({ redeemValidityMinutes: Number(e.target.value) })}>
              {[5, 10, 15, 30].map((m) => (
                <option key={m} value={m}>
                  {m} minuti
                </option>
              ))}
            </NativeSelect>
          </Field>
          <Field id="r-qr" label="Rinnovo QR della tessera" hint="Più è breve, più è difficile copiarlo">
            <NativeSelect id="r-qr" value={venue.qrRefreshSeconds} onChange={(e) => updateVenue({ qrRefreshSeconds: Number(e.target.value) })}>
              {[15, 30, 60].map((s) => (
                <option key={s} value={s}>
                  ogni {s} secondi
                </option>
              ))}
            </NativeSelect>
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-semibold">Funzioni dell'app</CardTitle>
          <CardDescription>Spegni ciò che il tuo locale non usa: sparisce anche dalla navigazione.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <SwitchRow id="f-ev" title="Eventi" desc="Calendario delle serate con punti bonus" checked={venue.features.events} onChange={(v) => setFeature("events", v)} />
          <SwitchRow id="f-book" title="Prenotazioni dall'app" desc="Se spento, l'evento invita a chiamare il locale" checked={venue.features.booking} onChange={(v) => setFeature("booking", v)} disabled={!venue.features.events} />
          <SwitchRow id="f-pr" title="Promo" desc="Offerte in Home e in Novità" checked={venue.features.promos} onChange={(v) => setFeature("promos", v)} />
          <SwitchRow id="f-rev" title="Richiesta di recensione" desc="Pulsante Recensisci e invito su Google" checked={venue.features.reviews} onChange={(v) => setFeature("reviews", v)} />
          <SwitchRow id="f-bd" title="Regalo di compleanno" desc="Chiede la data di nascita nel profilo" checked={venue.features.birthday} onChange={(v) => setFeature("birthday", v)} />
        </CardContent>
      </Card>

      <OwnerAccounts />

      <Card className="ring-destructive/30">
        <CardHeader>
          <CardTitle className="font-semibold">Ripristina</CardTitle>
          <CardDescription>Riporta nome, immagini, colori, premi, promo ed eventi ai contenuti di esempio.</CardDescription>
        </CardHeader>
        <CardContent>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive" size="lg">
                <RiRestartLine /> Ripristina contenuti di esempio
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ripristinare tutto?</DialogTitle>
                <DialogDescription>Perdi immagini, testi e regole che hai inserito. Non si può annullare.</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="secondary" size="lg">
                    Annulla
                  </Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button
                    variant="destructive"
                    size="lg"
                    onClick={() => {
                      resetVenue()
                      toast("Contenuti di esempio ripristinati")
                    }}
                  >
                    Ripristina
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  )
}
