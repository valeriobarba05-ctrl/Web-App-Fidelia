import { cn } from "@/lib/utils"

/**
 * Elementi del brand Fidelia (Materiale Grafico v1). Asset in public/brand/.
 * Regole dal brand book: non deformare, ruotare o ricolorare il logo; niente ombre;
 * area di rispetto = ½ lato del simbolo; minimo 16 px. La scritta "fidelia" è sempre minuscola.
 */

type SymbolVariant = "standard" | "su-verde" | "mono-bianco" | "mono-nero"
const SYMBOL: Record<SymbolVariant, string> = {
  standard: "./brand/logo/fidelia-simbolo.svg",
  "su-verde": "./brand/logo/fidelia-simbolo-su-verde.svg",
  "mono-bianco": "./brand/logo/fidelia-simbolo-mono-bianco.svg",
  "mono-nero": "./brand/logo/fidelia-simbolo-mono-nero.svg",
}

/** Simbolo: la "f" Crema con la spunta Oro nel quadrato smussato. Su fondo verde usare `su-verde`. */
export function FideliaSymbol({ variant = "standard", size = 32, className }: { variant?: SymbolVariant; size?: number; className?: string }) {
  return <img src={SYMBOL[variant]} alt="" width={size} height={size} className={cn("shrink-0 select-none", className)} style={{ width: size, height: size }} draggable={false} />
}

/**
 * Logo orizzontale: simbolo + scritta "fidelia" in Bricolage Grotesque ExtraBold, spaziatura -0,035em.
 * Distanza simbolo–scritta = ¼ del lato del simbolo. Su verde: simbolo `su-verde` e scritta Crema.
 */
export function FideliaLogo({ size = 32, onBrand = false, className }: { size?: number; onBrand?: boolean; className?: string }) {
  return (
    <span className={cn("inline-flex items-center", className)} style={{ gap: size / 4 }} aria-label="Fidelia" role="img">
      <FideliaSymbol variant={onBrand ? "su-verde" : "standard"} size={size} />
      <span aria-hidden className={cn("font-heading leading-none font-extrabold tracking-[-0.035em] lowercase", onBrand ? "text-brand-foreground" : "text-[#123C3A]")} style={{ fontSize: size * 0.83 }}>
        fidelia
      </span>
    </span>
  )
}

/**
 * Firma "powered by fidelia": sulla tessera del cliente il protagonista è il locale,
 * Fidelia compare solo in basso, mai più grande del nome dell'attività.
 */
export function PoweredBy({ onBrand = false, className }: { onBrand?: boolean; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <span className={cn("caption", onBrand ? "text-brand-muted" : "text-muted-foreground")}>powered by</span>
      <FideliaSymbol variant={onBrand ? "su-verde" : "standard"} size={16} />
      <span className={cn("font-heading text-sm leading-none font-extrabold tracking-[-0.035em] lowercase", onBrand ? "text-brand-foreground" : "text-[#123C3A]")}>fidelia</span>
    </span>
  )
}

/** Spunta-timbro del brand (la barra della "f" che diventa spunta): "timbro ottenuto", "premio confermato". */
export function Spunta({ className, strokeWidth = 11 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg aria-hidden viewBox="28 38 60 36" className={cn("shrink-0", className)} fill="none">
      <path d="M35 54 H51 L63 66 L80.4 46.7" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

type Motif = "timbri" | "spunte" | "quadrati" | "tessera"
const MOTIF_SIZE: Record<Motif, number> = { timbri: 64, spunte: 60, quadrati: 80, tessera: 128 }

/**
 * Motivo del brand (05 Motivi e texture – DA APPROVARE) come maschera ripetuta:
 * prende il colore del testo (`text-*`), quindi segue i colori del locale.
 * `fade` sfuma il motivo verso un lato per lasciare pulita la zona del testo.
 */
export function BrandMotif({ motif = "timbri", fade, scale = 1, className }: { motif?: Motif; fade?: "left" | "right" | "top" | "bottom"; scale?: number; className?: string }) {
  const tile = `url(./brand/motivi/motivo-${motif}-maschera.svg)`
  const size = `${MOTIF_SIZE[motif] * scale}px`
  const dir = { left: "to left", right: "to right", top: "to top", bottom: "to bottom" }[fade ?? "left"]
  const layers = fade ? `${tile}, linear-gradient(${dir}, #000 15%, transparent 80%)` : tile
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 bg-current", className)}
      style={{
        maskImage: layers,
        WebkitMaskImage: layers,
        maskSize: fade ? `${size} ${size}, 100% 100%` : `${size} ${size}`,
        WebkitMaskSize: fade ? `${size} ${size}, 100% 100%` : `${size} ${size}`,
        maskRepeat: fade ? "repeat, no-repeat" : "repeat",
        WebkitMaskRepeat: fade ? "repeat, no-repeat" : "repeat",
        maskComposite: fade ? "intersect" : undefined,
        WebkitMaskComposite: fade ? "source-in" : undefined,
      }}
    />
  )
}
