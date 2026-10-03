import * as React from "react"
import { RiDeleteBin6Line, RiImageAddLine, RiLink, RiLoader4Line } from "@remixicon/react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { cn, compressImage } from "@/lib/utils"

/**
 * Campo immagine del titolare: carica dal telefono/computer (ridimensionata e compressa),
 * trascina un file, oppure incolla un link. Mostra subito l'anteprima nel formato in cui apparirà.
 */
export function ImageField({
  id,
  label,
  hint,
  value,
  onChange,
  aspect = "aspect-[16/9]",
  max = 1200,
  className,
}: {
  id: string
  label: string
  hint?: string
  value?: string
  onChange: (v: string) => void
  aspect?: string
  max?: number
  className?: string
}) {
  const fileRef = React.useRef<HTMLInputElement>(null)
  const [busy, setBusy] = React.useState(false)
  const [over, setOver] = React.useState(false)
  const [showUrl, setShowUrl] = React.useState(false)

  const take = async (file?: File | null) => {
    if (!file) return
    setBusy(true)
    try {
      onChange(await compressImage(file, max))
      toast.success("Immagine aggiornata")
    } catch (e) {
      toast.error("Immagine non caricata", { description: (e as Error).message })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Label htmlFor={id}>{label}</Label>
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setOver(true)
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setOver(false)
          take(e.dataTransfer.files[0])
        }}
        className={cn(
          "relative flex w-full max-w-full items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed bg-muted/60 transition-colors",
          aspect,
          over && "border-primary bg-primary-soft",
          value && "border-solid border-transparent",
        )}
      >
        {value ? (
          <img src={value} alt={`Anteprima: ${label}`} className="absolute inset-0 size-full object-cover" />
        ) : (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex flex-col items-center gap-1.5 p-4 text-center text-sm text-muted-foreground outline-none focus-visible:text-foreground"
          >
            <RiImageAddLine className="size-7" />
            <span className="font-medium text-foreground">Carica o trascina un'immagine</span>
            <span className="text-xs">JPG, PNG o WebP · la ridimensioniamo noi</span>
          </button>
        )}
        {busy && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            <RiLoader4Line className="size-6 animate-spin" />
          </div>
        )}
      </div>
      <input ref={fileRef} id={id} type="file" accept="image/*" className="sr-only" onChange={(e) => (take(e.target.files?.[0]), (e.target.value = ""))} />
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="secondary" size="sm" onClick={() => fileRef.current?.click()} disabled={busy}>
          <RiImageAddLine /> {value ? "Sostituisci" : "Carica"}
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => setShowUrl((s) => !s)} aria-expanded={showUrl}>
          <RiLink /> Da link
        </Button>
        {value && (
          <Button type="button" variant="destructive" size="sm" onClick={() => onChange("")}>
            <RiDeleteBin6Line /> Rimuovi
          </Button>
        )}
      </div>
      {showUrl && (
        <Input
          aria-label={`Link dell'immagine: ${label}`}
          placeholder="https://… (link diretto a un'immagine)"
          defaultValue={value?.startsWith("http") ? value : ""}
          onBlur={(e) => {
            const v = e.target.value.trim()
            if (v && !/^https:\/\/\S+$/.test(v)) return toast.error("Link non valido", { description: "Usa un link che inizia con https://" })
            if (v) onChange(v)
          }}
        />
      )}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}
