import * as React from "react";

import { ScreenSkeleton } from "@/components/fidelia/screen-skeleton";
import { AppShell } from "@/screens/app-shell";
import { Toaster } from "@/components/ui/sonner";
import { useRoute } from "@/mock/router";
import { StoreProvider } from "@/mock/store";
import { SessionProvider, useSession } from "@/mock/session";
import { useVenueAdmin, VenueProvider } from "@/mock/venue";
import { AccessoScreen } from "@/screens/accesso";
import { HomeScreen } from "@/screens/home";

const LocaleScreen = React.lazy(() =>
  import("@/screens/locale").then((m) => ({ default: m.LocaleScreen })),
);
const MovimentiScreen = React.lazy(() =>
  import("@/screens/movimenti").then((m) => ({ default: m.MovimentiScreen })),
);
const NovitaScreen = React.lazy(() =>
  import("@/screens/novita").then((m) => ({ default: m.NovitaScreen })),
);
const PremiScreen = React.lazy(() =>
  import("@/screens/premi").then((m) => ({ default: m.PremiScreen })),
);
const ProfiloScreen = React.lazy(() =>
  import("@/screens/profilo").then((m) => ({ default: m.ProfiloScreen })),
);
const RiscattoScreen = React.lazy(() =>
  import("@/screens/riscatto").then((m) => ({ default: m.RiscattoScreen })),
);
const TesseraScreen = React.lazy(() =>
  import("@/screens/tessera").then((m) => ({ default: m.TesseraScreen })),
);
// Un solo accesso, due rami: cliente (app tessera) e titolare (gestione). Condividono solo i contenuti del locale.
const OwnerApp = React.lazy(() =>
  import("@/owner/owner-app").then((m) => ({ default: m.OwnerApp })),
);
const DesignSystemPage = React.lazy(() =>
  import("@/design-system/design-system-page").then((m) => ({
    default: m.DesignSystemPage,
  })),
);

export function App() {
  return (
    <VenueProvider>
      <SessionProvider>
        <StoreProvider>
          <Router />
        </StoreProvider>
        <Toaster />
      </SessionProvider>
    </VenueProvider>
  );
}

function Router() {
  const { route, params } = useRoute();
  const { setPreviewDark } = useVenueAdmin();
  const { account, role } = useSession();
  const ownerSide = route === "titolare" || route === "design-system";

  // Fuori dalla gestione il tema torna sempre quello del dispositivo.
  React.useEffect(() => {
    if (!ownerSide) setPreviewDark(null);
  }, [ownerSide, setPreviewDark]);

  if (route === "design-system")
    return (
      <React.Suspense fallback={null}>
        <DesignSystemPage />
      </React.Suspense>
    );

  // Nessun account: la stessa schermata di accesso per cliente e titolare.
  if (!account)
    return (
      <AccessoScreen />
    );

  // Ramo titolare: la gestione. Un cliente che apre #/titolare torna alla sua app.
  if (route === "titolare" && role === "titolare")
    return (
      <React.Suspense fallback={null}>
        <OwnerApp section={params.get("sezione") ?? "identita"} />
      </React.Suspense>
    );
  return (
    <CustomerApp route={route === "titolare" ? "home" : route} params={params} preview={role === "titolare"} />
  );
}

function CustomerApp({ route, params, preview }: ReturnType<typeof useRoute> & { preview: boolean }) {
  return (
    <AppShell route={route} preview={preview}>
      <React.Suspense fallback={<ScreenSkeleton />}>
        {route === "home" && <HomeScreen />}
        {route === "tessera" && <TesseraScreen />}
        {route === "movimenti" && <MovimentiScreen />}
        {route === "premi" && (
          <PremiScreen
            key={params.get("premio") ?? ""}
            initial={params.get("premio")}
            initialFilter={params.get("filtro")}
          />
        )}
        {route === "riscatto" && <RiscattoScreen />}
        {route === "novita" && (
          <NovitaScreen
            tab={params.get("tab") ?? "eventi"}
            eventId={params.get("evento")}
          />
        )}
        {route === "locale" && <LocaleScreen />}
        {route === "profilo" && <ProfiloScreen />}
      </React.Suspense>
    </AppShell>
  );
}
