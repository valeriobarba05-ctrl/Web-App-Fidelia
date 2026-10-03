import * as React from "react"
import { RiAddBoxLine, RiAndroidFill, RiAppleFill, RiEyeLine, RiEyeOffLine, RiGift2Line, RiMore2Fill, RiQrCodeLine, RiShare2Line, RiSparkling2Line } from "@remixicon/react"

import { VenueMark } from "@/components/fidelia/loyalty-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { VENUE } from "@/lib/data"
import { navigate } from "@/lib/router"
import { toast, useStore } from "@/lib/store"

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="size-5">
      <path fill="#4285F4" d="M22.5 12.27c0-.79-.07-1.54-.2-2.27H12v4.3h5.9a5 5 0 0 1-2.2 3.3v2.7h3.5c2.1-1.9 3.3-4.8 3.3-8.03Z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.55-2.76c-.98.66-2.24 1.05-3.73 1.05-2.87 0-5.3-1.94-6.17-4.54H2.17v2.85A11 11 0 0 0 12 23Z" />
      <path fill="#FBBC05" d="M5.83 14.09a6.6 6.6 0 0 1 0-4.18V7.06H2.17a11 11 0 0 0 0 9.88l3.66-2.85Z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15A11 11 0 0 0 2.17 7.06l3.66 2.85C6.7 7.31 9.13 5.38 12 5.38Z" />
    </svg>
  )
}

export function AccessoScreen() {
  const { login } = useStore()
  const [mode, setMode] = React.useState<"accedi" | "registrati">("registrati")
  const [show, setShow] = React.useState(false)
  const [email, setEmail] = React.useState("")
  const [pwd, setPwd] = React.useState("")
  const [name, setName] = React.useState("")
  const [submitted, setSubmitted] = React.useState(false)

  const emailErr = !/^\S+@\S+\.\S+$/.test(email) ? "Inserisci un'email valida, es. nome@email.it" : null
  const pwdErr = pwd.length < 8 ? "La password deve avere almeno 8 caratteri" : null
  const nameErr = mode === "registrati" && name.trim().length < 2 ? "Scrivi il tuo nome" : null
  const hasErr = !!(emailErr || pwdErr || nameErr)

  const enter = (welcome: boolean) => {
    login()
    navigate("home")
    toast.success(welcome ? "Benvenuto! +50 punti di benvenuto" : "Bentornato!", { description: VENUE.name })
  }

  return (
    <div className="grid min-h-dvh lg:grid-cols-[minmax(0,1fr)_minmax(0,560px)]">
      {/* Brand panel */}
      <section className="relative isolate flex flex-col justify-between gap-10 overflow-hidden bg-primary px-6 pt-10 pb-24 text-primary-foreground sm:px-10 lg:p-14">
        <span aria-hidden className="pointer-events-none absolute -right-10 -bottom-16 -z-10 font-heading text-[340px] leading-none font-black tracking-[-0.06em] opacity-[0.07] select-none">
          {VENUE.initials}
        </span>
        <div className="flex items-center gap-3">
          <VenueMark className="size-12 text-base" />
          <span className="font-heading text-lg font-semibold">{VENUE.name}</span>
        </div>
        <div className="flex max-w-lg flex-col gap-5">
          <h1 className="font-heading text-[40px] leading-[1.05] font-semibold tracking-[-0.03em] sm:text-[52px]">{VENUE.tagline}</h1>
          <ul className="flex flex-col gap-3 text-[15px]">
            {[
              { icon: RiQrCodeLine, t: `${VENUE.pointsRule}, con un QR dal telefono` },
              { icon: RiGift2Line, t: "Premi veri: caffè, calici, dolci, cene" },
              { icon: RiSparkling2Line, t: "50 punti di benvenuto appena ti iscrivi" },
            ].map(({ icon: Icon, t }) => (
              <li key={t} className="flex items-center gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/12">
                  <Icon className="size-5" />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>
        <p className="hidden text-xs opacity-70 lg:block">Fidelia · la tessera fedeltà che vive nel telefono, senza app da scaricare.</p>
      </section>

      {/* Form */}
      <section className="-mt-14 flex flex-col gap-4 px-4 pb-10 sm:px-10 lg:mt-0 lg:justify-center lg:py-14">
        <Card className="shadow-[0_20px_50px_-20px_rgb(12_10_9/0.35)] lg:shadow-sm">
          <CardContent className="flex flex-col gap-5">
            <Tabs value={mode} onValueChange={(v) => { setMode(v as typeof mode); setSubmitted(false) }}>
              <TabsList className="h-10 w-full">
                <TabsTrigger value="registrati">Crea la tessera</TabsTrigger>
                <TabsTrigger value="accedi">Accedi</TabsTrigger>
              </TabsList>
              <TabsContent value={mode} className="pt-4">
                <Button variant="outline" size="xl" className="w-full" onClick={() => enter(mode === "registrati")}>
                  <GoogleMark /> Continua con Google
                </Button>
                <div className="my-4 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="h-px flex-1 bg-border" /> oppure con email <span className="h-px flex-1 bg-border" />
                </div>
                <form
                  noValidate
                  className="flex flex-col gap-4"
                  onSubmit={(e) => {
                    e.preventDefault()
                    setSubmitted(true)
                    if (!hasErr) enter(mode === "registrati")
                  }}
                >
                  {mode === "registrati" && (
                    <Field id="name" label="Nome" error={submitted ? nameErr : null}>
                      <Input id="name" autoComplete="given-name" placeholder="Giulia" value={name} onChange={(e) => setName(e.target.value)} aria-invalid={submitted && !!nameErr} />
                    </Field>
                  )}
                  <Field id="email" label="Email" error={submitted ? emailErr : null}>
                    <Input id="email" type="email" autoComplete="email" placeholder="nome@email.it" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={submitted && !!emailErr} />
                  </Field>
                  <Field id="pwd" label="Password" error={submitted ? pwdErr : null}>
                    <div className="relative">
                      <Input
                        id="pwd"
                        type={show ? "text" : "password"}
                        autoComplete={mode === "registrati" ? "new-password" : "current-password"}
                        placeholder="Almeno 8 caratteri"
                        value={pwd}
                        onChange={(e) => setPwd(e.target.value)}
                        aria-invalid={submitted && !!pwdErr}
                        className="pr-11"
                      />
                      <Button type="button" variant="ghost" size="icon" className="absolute top-1 right-1" aria-label={show ? "Nascondi password" : "Mostra password"} onClick={() => setShow((s) => !s)}>
                        {show ? <RiEyeOffLine /> : <RiEyeLine />}
                      </Button>
                    </div>
                  </Field>
                  <Button type="submit" size="xl" className="w-full">
                    {mode === "registrati" ? "Crea la mia tessera" : "Accedi con email e password"}
                  </Button>
                  {mode === "registrati" && (
                    <p className="text-center text-xs text-muted-foreground">
                      Continuando accetti l'
                      <a href={VENUE.links.privacy} className="font-medium text-foreground underline">
                        informativa privacy
                      </a>
                      . I consensi marketing li scegli dopo, uno per uno.
                    </p>
                  )}
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <InstallHint />
      </section>
    </div>
  )
}

function Field({ id, label, error, children }: { id: string; label: string; error: string | null; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error && (
        <p role="alert" className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}

function InstallHint() {
  const [os, setOs] = React.useState<"ios" | "android">(/android/i.test(navigator.userAgent) ? "android" : "ios")
  return (
    <Card size="sm" className="bg-transparent shadow-none ring-0 border border-dashed">
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <span className="font-heading text-[15px] font-semibold">Installa l'app sul telefono</span>
          <Tabs value={os} onValueChange={(v) => setOs(v as typeof os)}>
            <TabsList className="h-8">
              <TabsTrigger value="ios" aria-label="iPhone" className="px-2.5">
                <RiAppleFill />
              </TabsTrigger>
              <TabsTrigger value="android" aria-label="Android" className="px-2.5">
                <RiAndroidFill />
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <p className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
          {os === "ios" ? (
            <>
              In Safari tocca <RiShare2Line className="size-4 text-foreground" /> <strong className="text-foreground">Condividi</strong>, poi
              <RiAddBoxLine className="size-4 text-foreground" /> <strong className="text-foreground">Aggiungi alla schermata Home</strong>.
            </>
          ) : (
            <>
              In Chrome tocca <RiMore2Fill className="size-4 text-foreground" /> <strong className="text-foreground">Menu</strong>, poi <strong className="text-foreground">Installa app</strong>.
            </>
          )}
        </p>
      </CardContent>
    </Card>
  )
}
