/**
 * Esporta i token del design system in design-tokens.json (OKLCH + HEX),
 * per chi implementa Fidelia con un altro stack (app nativa, email, Figma variables…).
 * Uso: npm run tokens
 */
import { readFileSync, writeFileSync } from "node:fs"
import { formatHex, parse } from "culori"

import { generateTheme, THEME_PRESETS } from "../src/lib/themes.ts"

const css = readFileSync(new URL("../src/styles/globals.css", import.meta.url), "utf8")
function block(selector: string) {
  const start = css.indexOf(selector + " {")
  const body = css.slice(start, css.indexOf("\n}", start))
  return Object.fromEntries([...body.matchAll(/--([\w-]+):\s*([^;]+);/g)].map((m) => [m[1], m[2].replace(/\/\*.*?\*\//g, "").trim()]))
}
const withHex = (vars: Record<string, string>) =>
  Object.fromEntries(
    Object.entries(vars)
      .filter(([, v]) => !v.startsWith("var("))
      .flatMap(([k, v]) => {
        const c = parse(v)
        return c ? [[k, { value: v, hex: formatHex(c) }]] : []
      }),
  )
const strip = (vars: Record<string, string>) => Object.fromEntries(Object.entries(vars).map(([k, v]) => [k.replace(/^--/, ""), v]))

const tokens = {
  $description: "Fidelia Design System · shadcn preset b1LObiUpjd (rhea · taupe · emerald · Montserrat/Figtree · Remix Icon · radius small 0.45rem)",
  font: { sans: "Montserrat", heading: "Figtree", icons: "Remix Icon (Line; Fill per voce attiva)" },
  radius: { base: "0.45rem (small)", control: "0.81rem (rounded-2xl)", card: "1.17rem (rounded-4xl)" },
  motion: { easeOutExpo: "cubic-bezier(0.16, 1, 0.3, 1)", fast: "150-200ms", medium: "500-700ms", odometer: "900ms" },
  color: { light: withHex(block(":root")), dark: withHex(block(".dark")) },
  venueThemes: Object.fromEntries(
    THEME_PRESETS.map((p) => [
      p.id,
      { name: p.name, input: { brand: p.brand, highlight: p.highlight }, light: withHex(strip(generateTheme(p.brand, p.highlight, false))), dark: withHex(strip(generateTheme(p.brand, p.highlight, true))) },
    ]),
  ),
}
writeFileSync(new URL("../design-tokens.json", import.meta.url), JSON.stringify(tokens, null, 2) + "\n")
console.log("✓ design-tokens.json aggiornato")
