import { RiWallet3Fill } from "@remixicon/react"

import { QrCode } from "@/components/fidelia/qr-code"
import { VenueMark } from "@/components/fidelia/loyalty-card"
import { cn, fmtPoints } from "@/lib/utils"

export type WalletPlatform = "apple" | "google"

/** Piattaforma suggerita in base al telefono: iPhone → Apple, Android → Google, altro → entrambe. */
export function suggestedWallets(ua = typeof navigator === "undefined" ? "" : navigator.userAgent): WalletPlatform[] {
  if (/iPhone|iPad|iPod/i.test(ua)) return ["apple"]
  if (/Android/i.test(ua)) return ["google"]
  return ["apple", "google"]
}

/**
 * Pulsante "Aggiungi al wallet".
 * ⚠️ SEGNAPOSTO DI DESIGN: prima della pubblicazione va sostituito con i badge ufficiali
 * (Apple: "Add to Apple Wallet" badge, versione italiana; Google: "Add to Google Wallet" button),
 * che le linee guida delle due piattaforme rendono obbligatori. Dimensioni e posizione restano queste.
 */
export function WalletButton({ platform, added, className, ...props }: React.ComponentProps<"button"> & { platform: WalletPlatform; added?: boolean }) {
  const name = platform === "apple" ? "Apple Wallet" : "Google Wallet"
  return (
    <button
      type="button"
      data-slot="button"
      className={cn(
        "inline-flex h-12 min-w-[176px] items-center justify-center gap-2.5 rounded-xl bg-black px-4 text-left text-white outline-none transition-[transform,opacity] duration-150 select-none focus-visible:ring-3 focus-visible:ring-ring/50 active:scale-[0.98] disabled:opacity-60",
        className,
      )}
      {...props}
    >
      <RiWallet3Fill aria-hidden className="size-6 shrink-0" />
      <span className="flex flex-col leading-tight">
        <span className="text-[11px] font-medium opacity-90">{added ? "Aperta in" : "Aggiungi a"}</span>
        <span className="text-[15px] font-semibold">{name}</span>
      </span>
    </button>
  )
}

/**
 * Anteprima della tessera come appare nel wallet del telefono (layout "store card" / "loyalty").
 * Stessi colori dell'app: sfondo `--brand`, testi `--brand-foreground`, etichette `--highlight`.
 * Specifica dei campi per il programmatore: docs/WALLET.md.
 */
export function WalletPassPreview({
  venue,
  member,
  nextPrize,
  image,
  className,
}: {
  venue: { name: string; initials: string; logo?: string }
  member: { name: string; code: string; points: number }
  nextPrize?: string
  image?: string
  className?: string
}) {
  return (
    <figure
      aria-label={`Anteprima della tessera nel wallet: ${venue.name}, ${fmtPoints(member.points)} punti`}
      className={cn("mx-auto flex w-full max-w-[320px] flex-col overflow-hidden rounded-[14px] bg-brand text-brand-foreground shadow-overlay", className)}
    >
      {/* intestazione: logo + nome (logoText) · campo header: punti */}
      <div className="flex items-center gap-2.5 px-3.5 pt-3 pb-2.5">
        <VenueMark initials={venue.initials} logo={venue.logo} className="size-8 rounded-lg text-[11px]" />
        <span className="min-w-0 flex-1 truncate text-[15px] font-semibold">{venue.name}</span>
        <span className="flex flex-col items-end">
          <span className="text-[11px] font-semibold tracking-[0.08em] text-highlight uppercase">Punti</span>
          <span className="font-heading text-lg leading-none font-bold tabular">{fmtPoints(member.points)}</span>
        </span>
      </div>
      {/* strip / hero image con il campo principale */}
      <div className="relative isolate flex h-[104px] items-end overflow-hidden px-3.5 pb-2.5">
        {image ? (
          <>
            <img src={image} alt="" className="absolute inset-0 -z-10 size-full object-cover" />
            <div className="absolute inset-0 -z-10 scrim-strip" />
          </>
        ) : (
          <div aria-hidden className="absolute inset-0 -z-10 bg-[repeating-linear-gradient(115deg,color-mix(in_oklch,var(--highlight)_22%,transparent)_0_2px,transparent_2px_14px)]" />
        )}
        <span className="flex flex-col">
          <span className="text-[11px] font-semibold tracking-[0.08em] text-highlight uppercase">Saldo</span>
          <span className="font-heading text-[30px] leading-none font-extrabold text-highlight tabular">{fmtPoints(member.points)}</span>
        </span>
      </div>
      {/* campi secondari */}
      <div className="grid grid-cols-2 gap-3 px-3.5 pt-3">
        <span className="flex min-w-0 flex-col">
          <span className="text-[11px] font-semibold tracking-[0.08em] text-highlight uppercase">Titolare</span>
          <span className="truncate text-[13px] font-medium">{member.name}</span>
        </span>
        {nextPrize && (
          <span className="flex min-w-0 flex-col items-end text-right">
            <span className="text-[11px] font-semibold tracking-[0.08em] text-highlight uppercase">Prossimo premio</span>
            <span className="max-w-full truncate text-[13px] font-medium">{nextPrize}</span>
          </span>
        )}
      </div>
      {/* codice a barre */}
      <div className="flex flex-col items-center gap-1.5 px-3.5 pt-4 pb-4">
        <div className="size-[118px] rounded-lg bg-white p-1.5">
          <QrCode value={`FIDELIA:${member.code}`} label={`QR della tessera ${member.code}`} className="rounded-md" />
        </div>
        <span className="text-[11px] font-medium tracking-[0.18em] tabular opacity-90">{member.code}</span>
      </div>
    </figure>
  )
}
