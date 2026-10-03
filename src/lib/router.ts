import * as React from "react"

export type Route =
  | "home"
  | "tessera"
  | "movimenti"
  | "premi"
  | "riscatto"
  | "novita"
  | "locale"
  | "profilo"
  | "design-system"
  | "gestione"

const ROUTES: Route[] = ["home", "tessera", "movimenti", "premi", "riscatto", "novita", "locale", "profilo", "design-system", "gestione"]

function parse(): { route: Route; params: URLSearchParams } {
  const [path, query] = location.hash.replace(/^#\/?/, "").split("?")
  const route = (ROUTES as string[]).includes(path) ? (path as Route) : "home"
  return { route, params: new URLSearchParams(query ?? "") }
}

export function navigate(route: Route, params?: Record<string, string>) {
  const q = params ? "?" + new URLSearchParams(params).toString() : ""
  location.hash = `/${route}${q}`
}

export function useRoute() {
  const [state, setState] = React.useState(parse)
  React.useEffect(() => {
    const on = () => {
      setState(parse())
      window.scrollTo({ top: 0 })
    }
    window.addEventListener("hashchange", on)
    return () => window.removeEventListener("hashchange", on)
  }, [])
  return state
}

export function useNow(intervalMs = 1000) {
  const [now, setNow] = React.useState(() => Date.now())
  React.useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs)
    return () => clearInterval(id)
  }, [intervalMs])
  return now
}
