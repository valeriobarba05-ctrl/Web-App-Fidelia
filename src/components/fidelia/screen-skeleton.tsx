import { Skeleton } from "@/components/ui/skeleton"

/**
 * Stato di caricamento di una schermata: titolo, blocco principale, righe.
 * Usato mentre si scarica il codice della schermata; lo sviluppatore può riusarlo mentre arrivano i dati dall'API.
 */
export function ScreenSkeleton() {
  return (
    <div role="status" aria-label="Caricamento" className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 pt-[max(1.5rem,env(safe-area-inset-top))] sm:px-6 lg:px-10 lg:pt-10">
      <Skeleton className="h-9 w-2/3 max-w-xs" />
      <Skeleton className="h-44 w-full rounded-[24px]" />
      <div className="flex flex-col gap-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="size-11 rounded-xl" />
            <div className="flex flex-1 flex-col gap-2">
              <Skeleton className="h-3.5 w-3/5" />
              <Skeleton className="h-3 w-2/5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
