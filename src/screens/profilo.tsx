import * as React from "react"
import { RiCake3Line, RiExternalLinkLine, RiLogoutBoxRLine, RiMoonLine, RiPaletteLine, RiShieldCheckLine } from "@remixicon/react"

import { PageBody, PageHeader } from "@/components/fidelia/app-shell"
import { VenueThemePicker } from "@/components/fidelia/venue-theme-picker"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { VENUE } from "@/lib/data"
import { navigate } from "@/lib/router"
import { toast, useStore } from "@/lib/store"

const CONSENTS = [
  { key: null, title: "Servizio tessera (necessario)", desc: "Gestione di punti, premi e account. Senza questo la tessera non funziona." },
  { key: "marketing", title: "Promozioni e offerte", desc: "WhatsApp ed email con promo, eventi e auguri di compleanno." },
  { key: "profiling", title: "Offerte personalizzate", desc: "Uso dei tuoi acquisti per proporti premi e promo su misura." },
  { key: "push", title: "Notifiche sul telefono", desc: "Avvisi quando ricevi punti o sblocchi un premio." },
] as const

export function ProfiloScreen() {
  const { user, consents, setConsent, setBirthday, dark, setDark, logout } = useStore()
  const [bday, setBday] = React.useState(user.birthday)
  const dirty = bday !== user.birthday

  return (
    <>
      <PageHeader title="Il tuo profilo" back="home" />
      <PageBody className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start lg:gap-8">
        <div className="flex flex-col gap-4">
          <Card>
            <CardContent className="flex items-center gap-4">
              <Avatar size="xl">
                <AvatarFallback className="bg-primary text-xl text-primary-foreground">
                  {user.firstName[0]}
                  {user.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex min-w-0 flex-col gap-0.5">
                <span className="font-heading text-xl font-semibold">
                  {user.firstName} {user.lastName}
                </span>
                <span className="truncate text-sm text-muted-foreground">{user.email}</span>
                <span className="text-xs text-muted-foreground">
                  Tessera {user.cardCode} · dal {user.memberSince}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-semibold">
                <RiCake3Line className="size-5 text-warning" /> Data di compleanno
              </CardTitle>
              <CardDescription>Ti faremo un regalo nella settimana del tuo compleanno.</CardDescription>
            </CardHeader>
            <CardContent>
              <form
                className="flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault()
                  setBirthday(bday)
                  toast.success("Compleanno salvato")
                }}
              >
                <Label htmlFor="bday" className="sr-only">
                  Data di compleanno
                </Label>
                <Input id="bday" type="date" value={bday} max={new Date().toISOString().slice(0, 10)} onChange={(e) => setBday(e.target.value)} className="flex-1" />
                <Button type="submit" size="lg" className="h-10" disabled={!dirty}>
                  Salva
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-semibold">
                <RiPaletteLine className="size-5" /> Aspetto
              </CardTitle>
              <CardDescription>Colori del locale e tema dell'app.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <VenueThemePicker />
              <Separator />
              <div className="flex items-center gap-3">
                <RiMoonLine className="size-5 text-muted-foreground" />
                <Label htmlFor="dark" className="flex-1">
                  Tema scuro
                </Label>
                <Switch id="dark" checked={dark} onCheckedChange={setDark} />
              </div>
              <Button variant="outline" size="lg" className="w-fit" onClick={() => navigate("design-system")}>
                Apri il design system <RiExternalLinkLine />
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-semibold">
                <RiShieldCheckLine className="size-5 text-success" /> Privacy e consensi
              </CardTitle>
              <CardDescription>Ogni consenso è separato e puoi cambiarlo quando vuoi.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col">
              {CONSENTS.map((c, i) => (
                <React.Fragment key={c.title}>
                  {i > 0 && <Separator className="my-3" />}
                  <div className="flex items-start gap-3">
                    <Label htmlFor={`c-${i}`} className="flex-1 flex-col items-start gap-1 leading-snug">
                      <span>{c.title}</span>
                      <span className="text-xs font-normal text-muted-foreground">{c.desc}</span>
                    </Label>
                    <Switch
                      id={`c-${i}`}
                      checked={c.key ? consents[c.key] : true}
                      disabled={!c.key}
                      onCheckedChange={(v) => {
                        if (!c.key) return
                        setConsent(c.key, v)
                        toast(v ? "Consenso attivato" : "Consenso revocato", { description: c.title })
                      }}
                    />
                  </div>
                </React.Fragment>
              ))}
            </CardContent>
          </Card>

          <Button asChild variant="link" className="w-fit px-1">
            <a href={VENUE.links.privacy}>Leggi l'informativa privacy</a>
          </Button>

          <Button variant="destructive" size="xl" onClick={logout}>
            <RiLogoutBoxRLine /> Esci
          </Button>
        </div>
      </PageBody>
    </>
  )
}
