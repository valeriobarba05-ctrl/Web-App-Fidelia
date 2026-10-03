# Fidelia · Web app tessera fedeltà

Redesign della web app Fidelia su **shadcn/ui** (preset `b1LObiUpkf`: rhea · taupe · emerald · Montserrat/Figtree · Remix Icon), con design system integrato.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
```

- App: `#/home` (al primo avvio mostra Accesso: qualsiasi email valida + password ≥ 8 caratteri, o "Continua con Google")
- Gestione del titolare: nella schermata di accesso tocca **“Sei il titolare?”** e inserisci il PIN **1234** (si cambia in Gestione → Regole e funzioni)
- Design system vivo: `#/design-system`
- Controllo leggibilità: `npm run check:contrast`
- Demo interattive: *Simula* nella Tessera (accredita punti da un conto), *Scansiona* nel Riscatto (scala i punti), prenotazione eventi, consensi, colori del locale, tema scuro. Lo stato si salva in `localStorage` (le immagini vengono ridimensionate e compresse prima del salvataggio). In produzione la configurazione del locale andrebbe su un server.

Struttura: `src/styles/globals.css` (token) · `src/components/ui` (shadcn rhea) · `src/components/fidelia` (pattern) · `src/screens` (schermate) · `src/lib` (dati, store, router, temi, QR).
Vedi `DESIGN.md` e `PRODUCT.md`.
