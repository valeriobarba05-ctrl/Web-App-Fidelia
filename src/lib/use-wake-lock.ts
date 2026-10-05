import * as React from "react"

/**
 * Tiene lo schermo acceso mentre il QR è visibile (Tessera, Riscatto):
 * in cassa il telefono non deve spegnersi mentre si aspetta la scansione.
 * Se il browser non lo supporta o rifiuta, non succede nulla.
 */
export function useWakeLock(active = true) {
  React.useEffect(() => {
    if (!active || !("wakeLock" in navigator)) return
    let lock: WakeLockSentinel | null = null
    let cancelled = false
    const request = async () => {
      try {
        lock = await navigator.wakeLock.request("screen")
        if (cancelled) lock.release()
      } catch {
        /* rifiutato (es. batteria scarica): pazienza */
      }
    }
    const onVisible = () => document.visibilityState === "visible" && request()
    request()
    document.addEventListener("visibilitychange", onVisible)
    return () => {
      cancelled = true
      document.removeEventListener("visibilitychange", onVisible)
      lock?.release().catch(() => {})
    }
  }, [active])
}
