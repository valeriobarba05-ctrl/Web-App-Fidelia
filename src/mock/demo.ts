/**
 * Controlli che esistono SOLO per la demo (es. "Simula" la cassa, "Scansiona" il QR).
 * In produzione la scansione avviene dal dispositivo della cassa: build con VITE_DEMO=false per nasconderli.
 */
export const DEMO = import.meta.env.VITE_DEMO !== "false"
