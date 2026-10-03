import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const fmtPoints = (n: number) => n.toLocaleString("it-IT")
export const fmtEuro = (n: number) =>
  n.toLocaleString("it-IT", { style: "currency", currency: "EUR" })

export function safeStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? { ...fallback, ...JSON.parse(raw) } : fallback
  } catch {
    return fallback
  }
}

/** Ritorna false se lo spazio è pieno o non disponibile (lo stato resta in memoria). */
export function saveStorage(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

/**
 * Prepara un'immagine caricata dal titolare: ridimensiona (lato lungo max `max` px)
 * e comprime in JPEG/WebP, così sta nello spazio del browser e si carica veloce al telefono.
 */
export async function compressImage(file: File, max = 1200, quality = 0.8): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("Il file non è un'immagine. Usa JPG, PNG o WebP.")
  if (file.size > 20 * 1024 * 1024) throw new Error("Immagine troppo pesante (oltre 20 MB). Scegline una più leggera.")
  if (file.type === "image/svg+xml") {
    return await new Promise((res, rej) => {
      const r = new FileReader()
      r.onload = () => res(String(r.result))
      r.onerror = () => rej(new Error("Impossibile leggere il file."))
      r.readAsDataURL(file)
    })
  }
  const bitmap = await createImageBitmap(file).catch(() => {
    throw new Error("Impossibile leggere l'immagine. Prova con un JPG o PNG.")
  })
  const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement("canvas")
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  const webp = canvas.toDataURL("image/webp", quality)
  return webp.startsWith("data:image/webp") ? webp : canvas.toDataURL("image/jpeg", quality)
}
