/**
 * Verifica di leggibilità: ogni coppia testo/sfondo usata nell'app deve superare WCAG AA.
 * Legge i token da src/styles/globals.css e i colori generati per ogni preset del locale
 * (più alcuni colori "difficili" che un titolare potrebbe scegliere).
 * Uso: npm run check:contrast
 */
import { readFileSync } from "node:fs"
import { interpolate, wcagContrast } from "culori"

import { generateTheme, THEME_PRESETS } from "../src/lib/themes.ts"

const cssText = readFileSync(new URL("../src/styles/globals.css", import.meta.url), "utf8")
function block(selector: string) {
  const start = cssText.indexOf(selector + " {")
  const body = cssText.slice(start, cssText.indexOf("\n}", start))
  return Object.fromEntries([...body.matchAll(/--([\w-]+):\s*([^;]+);/g)].map((m) => [m[1], m[2].replace(/\/\*.*?\*\//g, "").trim()]))
}
const LIGHT = block(":root")
const DARK = { ...LIGHT, ...block(".dark") }

/** Colore con opacità sopra uno sfondo (es. text-foreground/70). */
const over = (fg: string, bg: string, alpha: number) => interpolate([bg, fg], "rgb")(alpha)

// [testo, sfondo, soglia, opacità del testo]
const PAIRS: [string, string, number?, number?][] = [
  ["foreground", "background"], ["foreground", "surface"], ["card-foreground", "card"],
  ["muted-foreground", "background"], ["muted-foreground", "card"], ["muted-foreground", "surface"], ["muted-foreground", "muted"],
  ["secondary-foreground", "secondary"], ["popover-foreground", "popover"],
  ["primary-foreground", "primary"], ["primary", "background"], ["primary", "card"], ["primary", "surface"], ["primary", "muted"],
  ["primary-soft-foreground", "primary-soft"],
  ["brand-foreground", "brand"], ["highlight", "brand"], ["brand-foreground", "brand", 4.5, 0.75],
  ["highlight-foreground", "highlight"], ["highlight", "inverted"], ["highlight", "sidebar"],
  ["inverted-foreground", "inverted"], ["inverted-muted", "inverted"],
  ["sidebar-foreground", "sidebar"], ["sidebar-muted", "sidebar"], ["sidebar-primary-foreground", "sidebar-primary"], ["sidebar-foreground", "sidebar-accent"],
  ["success", "success-soft"], ["success", "card"], ["warning", "warning-soft"],
  ["destructive", "card"], ["destructive", "background"], ["destructive", "destructive-soft"],
  ["background", "destructive"], // voce di menu "Esci" evidenziata
  ["muted-foreground", "secondary"], ["foreground", "card"], ["foreground", "muted"],
  // brand Fidelia: Verde Tonale (voci attive) e testo attenuato su verde (caption, firma "powered by")
  ["brand-foreground", "brand-tonal"], ["brand-muted", "brand"], ["brand-muted", "brand-tonal"], ["sidebar-muted", "sidebar-accent"],
]

const EXTRA = [
  { id: "custom-giallo", name: "Personalizzato giallo", brand: "#ffd400", highlight: "#ffffff" },
  { id: "custom-azzurro", name: "Personalizzato azzurro", brand: "#7dd3fc", highlight: "#f59e0b" },
  { id: "custom-rosa", name: "Personalizzato rosa", brand: "#ff4fa3", highlight: "#facc15" },
]

let fails = 0
for (const preset of [...THEME_PRESETS, ...EXTRA])
  for (const [mode, base] of [["chiaro", LIGHT], ["scuro", DARK]] as const) {
    const vars = { ...base }
    for (const [k, v] of Object.entries(generateTheme(preset.brand, preset.highlight, mode === "scuro"))) vars[k.slice(2)] = v
    for (const [fg, bg, min = 4.5, alpha = 1] of PAIRS) {
      if (min === 0) continue
      const resolve = (t: string): string => {
        const v = vars[t]
        return v?.startsWith("var(--") ? resolve(v.slice(6, -1)) : v
      }
      const f = resolve(fg), b = resolve(bg)
      if (!f || !b) {
        fails++
        console.log(`✗ ${preset.name.padEnd(24)} ${mode.padEnd(6)} variabile mancante: ${!f ? fg : bg}`)
        continue
      }
      const ratio = wcagContrast(alpha < 1 ? over(f, b, alpha) : f, b)
      if (ratio < min) {
        fails++
        console.log(`✗ ${preset.name.padEnd(24)} ${mode.padEnd(6)} ${fg}${alpha < 1 ? "/" + alpha * 100 : ""} su ${bg}: ${ratio.toFixed(2)} (min ${min})`)
      }
    }
  }
console.log(fails ? `\n${fails} coppie sotto soglia` : "✓ Tutte le coppie testo/sfondo superano WCAG AA in tema chiaro e scuro, per ogni colore del locale.")
process.exit(fails ? 1 : 0)
