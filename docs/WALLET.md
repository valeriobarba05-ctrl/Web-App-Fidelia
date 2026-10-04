# Tessera nel wallet: specifica di design

La tessera Fidelia si può aggiungere ad **Apple Wallet** (iPhone) e **Google Wallet** (Android).
Il design è già nel codice: `src/components/fidelia/wallet.tsx` (`WalletPassPreview`, `WalletButton`), con anteprima nell'app cliente (Home → "Aggiungi la tessera al wallet", Tessera → "Tessera nel wallet") e nella gestione (Identità e colori → "Tessera nel wallet").
Questo documento dice al programmatore **come tradurre quel design nei due formati**.

## 1. Pulsanti
- Mostrare il pulsante della piattaforma del telefono (`suggestedWallets()`): iPhone → Apple, Android → Google, computer → entrambi.
- `WalletButton` è un **segnaposto**: sostituirlo con i badge ufficiali in italiano, obbligatori per le linee guida:
  - Apple: badge "Aggiungi a Apple Wallet" (Apple Wallet Identity Guidelines, sezione Add to Apple Wallet).
  - Google: pulsante "Aggiungi a Google Wallet" (Google Wallet brand guidelines).
- Area minima 44 px di altezza, come nel segnaposto. Dopo l'aggiunta il pulsante diventa "Aperta in …" (prop `added`).

## 2. Colori
Generati dagli stessi token dell'app con `walletColors(brandColor, highlightColor)` in `src/lib/themes.ts`, quindi coerenti e leggibili (contrasto verificato da `npm run check:contrast`):

| Ruolo | Token | Apple `pass.json` | Google `loyaltyClass` |
|---|---|---|---|
| Sfondo | `--brand` | `backgroundColor` (rgb) | `hexBackgroundColor` |
| Testo dei valori | `--brand-foreground` | `foregroundColor` (rgb) | automatico (Google sceglie il contrasto) |
| Etichette | `--highlight` | `labelColor` (rgb) | — |

Quando il titolare cambia i colori del locale, il server rigenera i pass (Apple: push di aggiornamento; Google: PATCH della classe).

## 3. Contenuto (stesso ordine dell'anteprima)

| Zona dell'anteprima | Dato | Apple (`storeCard`) | Google (`loyaltyObject` / `loyaltyClass`) |
|---|---|---|---|
| Logo + nome | `venue.logo`, `venue.name` | `logo.png` + `logoText` | `programLogo` + `programName` / `issuerName` |
| In alto a destra "PUNTI" | `customer.points` | `headerFields[0]` (label "PUNTI") | `loyaltyPoints.balance` (label "Punti") |
| Immagine orizzontale | `venue.walletImage` (facoltativa) | `strip.png` | `heroImage` |
| "SALDO" grande | `customer.points` | `primaryFields[0]` | (già in `loyaltyPoints`) |
| "TITOLARE" | nome cliente | `secondaryFields[0]` | `accountName` |
| "PROSSIMO PREMIO" | primo premio con costo > saldo | `secondaryFields[1]` | `secondaryLoyaltyPoints` o `textModulesData` |
| QR + codice | **token della tessera firmato dal server** | `barcodes[0]` (`PKBarcodeFormatQR`, `altText` = codice) | `barcode` (`QR_CODE`, `alternateText`) |
| Retro / dettagli | orari, indirizzo, link | `backFields` | `textModulesData`, `linksModuleData` |

Testi delle etichette in maiuscolo come nell'anteprima: PUNTI, SALDO, TITOLARE, PROSSIMO PREMIO.

## 4. Immagini da preparare (dal logo e dall'immagine caricati dal titolare)
- Apple: `icon.png` 29×29 (+ @2x 58, @3x 87), `logo.png` max 160×50 (+ @2x, @3x), `strip.png` 375×123 (+ @2x 750×246, @3x 1125×369).
- Google: `programLogo` quadrato ≥ 660×660; `heroImage` 1032×336.
- Il campo "Immagine della tessera" nella gestione chiede un formato 3:1 (es. 1125×375): il server la ritaglia per Apple e Google.
- Senza immagine: Apple mostra lo sfondo pieno, Google la sola classe. L'anteprima in quel caso mostra una trama a righe, che **non** va riprodotta nel pass.

## 5. Flusso
1. Il cliente tocca il pulsante.
2. Apple: l'app scarica `GET /api/wallet/apple` → file `.pkpass` firmato. Google: l'app apre `https://pay.google.com/gp/v/save/<JWT firmato dal server>`.
3. A ogni visita o riscatto il server aggiorna il pass (punti, prossimo premio); niente da fare lato app.
4. Lo stato "già nel wallet" (`wallet.apple` / `wallet.google` nello store demo) va letto dal server.
