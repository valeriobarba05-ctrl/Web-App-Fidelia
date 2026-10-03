import { clampChroma, converter, formatCss, parse, wcagContrast, type Oklch } from "culori"

/**
 * Colori del locale.
 * Il titolare sceglie DUE colori (brand + punti). Da questi generiamo tutti i token
 * che dipendono dal locale, alzando o abbassando la luminosità finché ogni coppia
 * testo/sfondo supera la soglia WCAG AA (4.5:1). Qualsiasi colore scelga, resta leggibile.
 */

export type ThemePreset = { id: string; name: string; brand: string; highlight: string }

export const THEME_PRESETS: ThemePreset[] = [
  { id: "emerald", name: "Emerald", brand: "#007a55", highlight: "#f2b036" },
  { id: "porto", name: "Verde porto", brand: "#123c3a", highlight: "#e2a43a" },
  { id: "bordeaux", name: "Bordeaux", brand: "#7a1f2b", highlight: "#e8b04b" },
  { id: "notte", name: "Blu notte", brand: "#1e3a8a", highlight: "#f2b33d" },
  { id: "antracite", name: "Antracite", brand: "#1f1f1f", highlight: "#d9a441" },
]

/**
 * Modalità tema dell'app. "light" = sempre chiaro (scelta attuale).
 * "system" = segue il telefono: i token scuri sono già pronti e verificati in globals.css.
 */
export const THEME_MODE: "light" | "system" = "light"

const toOklch = converter("oklch")
const AA = 4.5

const mk = (l: number, c: number, h: number): Oklch => clampChroma({ mode: "oklch", l: Math.min(1, Math.max(0, l)), c, h }, "oklch") as Oklch
const css = (c: Oklch) => formatCss({ ...c, l: +c.l.toFixed(4), c: +(c.c ?? 0).toFixed(4), h: +(c.h ?? 0).toFixed(2) })
const cr = (a: Oklch | string, b: Oklch | string) => wcagContrast(a, b)

/** Sposta la luminosità a passi fissi finché `ok` è vera. */
function fit(l: number, c: number, h: number, step: number, ok: (col: Oklch) => boolean) {
  let col = mk(l, c, h)
  for (let i = 0; i < 100 && !ok(col); i++) col = mk((l += step), c, h)
  return col
}

// Superfici fisse del sistema (devono coincidere con globals.css)
export const SURFACES = {
  light: { background: "oklch(1 0 0)", surface: "oklch(0.975 0.003 60)", muted: "oklch(0.955 0.003 40)", card: "oklch(1 0 0)" },
  dark: { background: "oklch(0 0 0)", surface: "oklch(0 0 0)", muted: "oklch(0.25 0.006 45)", card: "oklch(0.17 0.004 49)" },
}

export type ThemeVars = Record<string, string>

export function generateTheme(brandColor: string, highlightColor: string, dark: boolean): ThemeVars {
  const base = toOklch(parse(brandColor) ?? parse("#007a55")!)!
  const h = base.h ?? 0
  const c = base.c ?? 0
  const S = dark ? SURFACES.dark : SURFACES.light
  const white = mk(0.99, Math.min(c, 0.02), h)
  const ink = mk(0.16, Math.min(c, 0.02), h)

  // Punti (oro): deve reggere testo scuro sopra di sé.
  const hl0 = toOklch(parse(highlightColor) ?? parse("#f2b036")!)!
  const highlight = fit(Math.max(hl0.l, 0.72), hl0.c ?? 0.15, hl0.h ?? 78, 0.01, (x) => cr(ink, x) >= 7)

  // Superficie di marca (tessera, card saldo, pannello accesso): sempre scura, con testo chiaro e numeri oro.
  const brand = fit(Math.min(base.l, dark ? 0.4 : 0.42), Math.min(c, 0.14), h, -0.01, (x) => cr(x, highlight) >= AA && cr(x, white) >= 7)

  let primary: Oklch, primaryFg: Oklch, soft: Oklch, softFg: Oklch
  if (!dark) {
    // Bottoni pieni con testo chiaro + testo/icone primarie su bianco, surface e muted.
    primary = fit(Math.min(base.l, 0.56), c, h, -0.01, (x) => cr(x, white) >= AA + 0.2 && cr(x, S.muted) >= AA && cr(x, S.surface) >= AA)
    primaryFg = white
    soft = mk(0.95, Math.min(c, 0.045), h)
    softFg = fit(primary.l, c, h, -0.01, (x) => cr(x, soft) >= 5)
  } else {
    // Nel tema scuro il primario diventa chiaro e porta testo scuro: contrasto alto su nero.
    primary = fit(Math.max(base.l, 0.72), Math.max(c, 0.02), h, 0.01, (x) => cr(x, ink) >= 6 && cr(x, S.card) >= 6 && cr(x, S.muted) >= AA)
    primaryFg = ink
    soft = mk(0.26, Math.min(c, 0.06), h)
    softFg = fit(0.82, Math.min(c, 0.12), h, 0.01, (x) => cr(x, soft) >= 6)
  }

  return {
    "--primary": css(primary),
    "--primary-foreground": css(primaryFg),
    "--primary-soft": css(soft),
    "--primary-soft-foreground": css(softFg),
    "--ring": css(primary),
    "--brand": css(brand),
    "--brand-foreground": css(white),
    "--highlight": css(highlight),
    "--highlight-foreground": css(ink),
    "--sidebar-primary": css(primary),
    "--sidebar-primary-foreground": css(primaryFg),
  }
}

export function applyTheme(brandColor: string, highlightColor: string, dark: boolean) {
  const root = document.documentElement
  root.classList.add("theme-switching")
  root.classList.toggle("dark", dark)
  for (const [k, v] of Object.entries(generateTheme(brandColor, highlightColor, dark))) root.style.setProperty(k, v)
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", dark ? "#000000" : "#1c1917")
  window.setTimeout(() => root.classList.remove("theme-switching"), 320)
}

export const contrast = cr
