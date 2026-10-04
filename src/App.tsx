import * as React from "react";

import { ScreenSkeleton } from "@/components/fidelia/screen-skeleton";
import { AppShell } from "@/screens/app-shell";
import { Toaster } from "@/components/ui/sonner";
import { useRoute } from "@/mock/router";
import { StoreProvider, useStore } from "@/mock/store";
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
// Due app separate che condividono solo i contenuti del locale (in sola lettura per il cliente).
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
      <Router />
      <Toaster />
    </VenueProvider>
  );
}

function Router() {
  const { route, params } = useRoute();
  const { setPreviewDark } = useVenueAdmin();
  const ownerSide = route === "titolare" || route === "design-system";

  // Fuori dalla gestione il tema torna sempre quello del dispositivo.
  React.useEffect(() => {
    if (!ownerSide) setPreviewDark(null);
  }, [ownerSide, setPreviewDark]);

  if (route === "titolare")
    return (
      <React.Suspense fallback={null}>
        <OwnerApp section={params.get("sezione") ?? "identita"} />
      </React.Suspense>
    );
  if (route === "design-system")
    return (
      <React.Suspense fallback={null}>
        <StoreProvider>
          <DesignSystemPage />
        </StoreProvider>
      </React.Suspense>
    );
  return (
    <StoreProvider>
      <CustomerApp route={route} params={params} />
    </StoreProvider>
  );
}

function CustomerApp({ route, params }: ReturnType<typeof useRoute>) {
  const { authed } = useStore();
  if (!authed) return <AccessoScreen />;
  return (
    <AppShell route={route}>
      <React.Suspense fallback={<ScreenSkeleton />}>
        {route === "home" && <HomeScreen />}
        {route === "tessera" && <TesseraScreen />}
        {route === "movimenti" && <MovimentiScreen />}
        {route === "premi" && (
          <PremiScreen
            key={params.get("premio") ?? ""}
            initial={params.get("premio")}
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
