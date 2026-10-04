# Fidelia · Web app tessera fedeltà

> **Per lo sviluppatore: leggi [HANDOFF.md](HANDOFF.md).** Qui c'è il design in codice; il backend è da realizzare.

Redesign della web app Fidelia su **shadcn/ui** (preset `b1LObiUpkf`: rhea · taupe · emerald · Montserrat/Figtree · Remix Icon), con design system integrato.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
```

- App: `#/home` (al primo avvio mostra Accesso: qualsiasi email valida + password ≥ 8 caratteri, o "Continua con Google")
- Accesso unico: **Continua con Google** → nella demo scegli *Giulia* (cliente) o *Marco* (titolare, apre la gestione). Gli account titolare si gestiscono in Gestione → Regole e funzioni.
- Tessera nel wallet (Apple/Google): design e specifica in `docs/WALLET.md`.
- Design system vivo: `#/design-system`
- Controllo leggibilità: `npm run check:contrast`
- Demo interattive: *Simula* nella Tessera (accredita punti da un conto), *Scansiona* nel Riscatto (scala i punti), prenotazione eventi, consensi, colori del locale, tema scuro. Lo stato si salva in `localStorage` (le immagini vengono ridimensionate e compresse prima del salvataggio). In produzione la configurazione del locale andrebbe su un server.

Struttura e cosa sostituire: vedi `HANDOFF.md`. Decisioni visive: `DESIGN.md`. Prodotto: `PRODUCT.md`.
