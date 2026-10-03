import * as React from "react"

import { AppShell } from "@/components/fidelia/app-shell"
import { Toaster } from "@/components/ui/sonner"
import { useRoute } from "@/lib/router"
import { StoreProvider, useStore } from "@/lib/store"
import { useVenueAdmin, VenueProvider } from "@/lib/venue"
import { AccessoScreen } from "@/screens/accesso"
import { HomeScreen } from "@/screens/home"
import { LocaleScreen } from "@/screens/locale"
import { MovimentiScreen } from "@/screens/movimenti"
import { NovitaScreen } from "@/screens/novita"
import { PremiScreen } from "@/screens/premi"
import { ProfiloScreen } from "@/screens/profilo"
import { RiscattoScreen } from "@/screens/riscatto"
import { TesseraScreen } from "@/screens/tessera"

// Due app separate che condividono solo i contenuti del locale (in sola lettura per il cliente).
const OwnerApp = React.lazy(() => import("@/owner/owner-app").then((m) => ({ default: m.OwnerApp })))
const DesignSystemPage = React.lazy(() => import("@/design-system/design-system-page").then((m) => ({ default: m.DesignSystemPage })))

export function App() {
  return (
    <VenueProvider>
      <Router />
      <Toaster />
    </VenueProvider>
  )
}

function Router() {
  const { route, params } = useRoute()
  const { setPreviewDark } = useVenueAdmin()
  const ownerSide = route === "titolare" || route === "design-system"

  // Fuori dalla gestione il tema torna sempre quello del dispositivo.
  React.useEffect(() => {
    if (!ownerSide) setPreviewDark(null)
  }, [ownerSide, setPreviewDark])

  if (route === "titolare")
    return (
      <React.Suspense fallback={null}>
        <OwnerApp section={params.get("sezione") ?? "identita"} />
      </React.Suspense>
    )
  if (route === "design-system")
    return (
      <React.Suspense fallback={null}>
        <StoreProvider>
          <DesignSystemPage />
        </StoreProvider>
      </React.Suspense>
    )
  return (
    <StoreProvider>
      <CustomerApp route={route} params={params} />
    </StoreProvider>
  )
}

function CustomerApp({ route, params }: ReturnType<typeof useRoute>) {
  const { authed } = useStore()
  if (!authed) return <AccessoScreen />
  return (
    <AppShell route={route}>
      {route === "home" && <HomeScreen />}
      {route === "tessera" && <TesseraScreen />}
      {route === "movimenti" && <MovimentiScreen />}
      {route === "premi" && <PremiScreen key={params.get("premio") ?? ""} initial={params.get("premio")} />}
      {route === "riscatto" && <RiscattoScreen />}
      {route === "novita" && <NovitaScreen tab={params.get("tab") ?? "eventi"} eventId={params.get("evento")} />}
      {route === "locale" && <LocaleScreen />}
      {route === "profilo" && <ProfiloScreen />}
    </AppShell>
  )
}
