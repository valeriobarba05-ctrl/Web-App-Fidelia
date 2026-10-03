/** "Colori del locale": each venue overrides primary/ring/highlight on top of the preset. */
export type VenueTheme = {
  id: string
  name: string
  swatch: string
  light: { primary: string; primaryForeground: string; highlight: string }
  dark: { primary: string; primaryForeground: string; highlight: string }
}

export const VENUE_THEMES: VenueTheme[] = [
  {
    id: "emerald",
    name: "Emerald",
    swatch: "oklch(0.508 0.118 165.612)",
    light: { primary: "oklch(0.508 0.118 165.612)", primaryForeground: "oklch(0.979 0.021 166.113)", highlight: "oklch(0.8 0.15 78)" },
    dark: { primary: "oklch(0.596 0.145 163.225)", primaryForeground: "oklch(0.979 0.021 166.113)", highlight: "oklch(0.82 0.15 80)" },
  },
  {
    id: "porto",
    name: "Verde porto",
    swatch: "#123C3A",
    light: { primary: "oklch(0.33 0.05 185)", primaryForeground: "oklch(0.985 0.01 180)", highlight: "oklch(0.76 0.14 72)" },
    dark: { primary: "oklch(0.55 0.08 185)", primaryForeground: "oklch(0.985 0.01 180)", highlight: "oklch(0.8 0.14 74)" },
  },
  {
    id: "bordeaux",
    name: "Bordeaux",
    swatch: "#7A1F2B",
    light: { primary: "oklch(0.41 0.13 18)", primaryForeground: "oklch(0.98 0.01 20)", highlight: "oklch(0.8 0.13 80)" },
    dark: { primary: "oklch(0.55 0.16 18)", primaryForeground: "oklch(0.98 0.01 20)", highlight: "oklch(0.82 0.13 82)" },
  },
  {
    id: "notte",
    name: "Blu notte",
    swatch: "#1E3A8A",
    light: { primary: "oklch(0.38 0.14 265)", primaryForeground: "oklch(0.98 0.01 265)", highlight: "oklch(0.82 0.15 80)" },
    dark: { primary: "oklch(0.55 0.17 265)", primaryForeground: "oklch(0.98 0.01 265)", highlight: "oklch(0.84 0.15 82)" },
  },
  {
    id: "antracite",
    name: "Antracite",
    swatch: "#1F1F1F",
    light: { primary: "oklch(0.214 0.009 43.1)", primaryForeground: "oklch(0.986 0.002 67.8)", highlight: "oklch(0.76 0.12 78)" },
    dark: { primary: "oklch(0.922 0.005 34.3)", primaryForeground: "oklch(0.214 0.009 43.1)", highlight: "oklch(0.8 0.12 80)" },
  },
]

export function applyVenueTheme(id: string, dark: boolean) {
  const theme = VENUE_THEMES.find((t) => t.id === id) ?? VENUE_THEMES[0]
  const v = dark ? theme.dark : theme.light
  const root = document.documentElement
  root.classList.toggle("dark", dark)
  root.style.setProperty("--primary", v.primary)
  root.style.setProperty("--primary-foreground", v.primaryForeground)
  root.style.setProperty("--ring", v.primary)
  root.style.setProperty("--sidebar-primary", v.primary)
  root.style.setProperty("--highlight", v.highlight)
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", dark ? "#0c0a09" : "#1c1917")
}
