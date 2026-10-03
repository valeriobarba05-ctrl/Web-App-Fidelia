import * as React from "react"

import { AppShell } from "@/components/fidelia/app-shell"
import { Toaster } from "@/components/ui/sonner"
import { useRoute } from "@/lib/router"
import { useStore } from "@/lib/store"
import { AccessoScreen } from "@/screens/accesso"
import { GestioneScreen } from "@/screens/gestione"
import { HomeScreen } from "@/screens/home"
import { LocaleScreen } from "@/screens/locale"
import { MovimentiScreen } from "@/screens/movimenti"
import { NovitaScreen } from "@/screens/novita"
import { PremiScreen } from "@/screens/premi"
import { ProfiloScreen } from "@/screens/profilo"
import { RiscattoScreen } from "@/screens/riscatto"
import { TesseraScreen } from "@/screens/tessera"

const DesignSystemPage = React.lazy(() => import("@/design-system/design-system-page").then((m) => ({ default: m.DesignSystemPage })))

export function App() {
  const { route, params } = useRoute()
  const { authed } = useStore()

  let page: React.ReactNode
  if (route === "design-system") page = (
      <React.Suspense fallback={null}>
        <DesignSystemPage />
      </React.Suspense>
    )
  else if (!authed) page = <AccessoScreen />
  else
    page = (
      <AppShell route={route}>
        {route === "home" && <HomeScreen />}
        {route === "tessera" && <TesseraScreen />}
        {route === "movimenti" && <MovimentiScreen />}
        {route === "premi" && <PremiScreen key={params.get("premio") ?? ""} initial={params.get("premio")} />}
        {route === "riscatto" && <RiscattoScreen />}
        {route === "novita" && <NovitaScreen tab={params.get("tab") ?? "eventi"} eventId={params.get("evento")} />}
        {route === "locale" && <LocaleScreen />}
        {route === "profilo" && <ProfiloScreen />}
        {route === "gestione" && <GestioneScreen tab={params.get("tab") ?? "identita"} />}
      </AppShell>
    )

  return (
    <>
      {page}
      <Toaster />
    </>
  )
}
