# Fidelia — prodotto

> Ricavato dalla web app Fidelia esistente (artifact "Fidelia App", 10 schermate) e dalla richiesta di redesign del 3 ottobre 2026.

## Cos'è
Una tessera fedeltà digitale per locali indipendenti (ristoranti, osterie, bar). Vive nel browser come PWA installabile: niente app store.
Locale di esempio: **Osteria del Porto**.

## Per chi
- **Cliente del locale** (utente principale): al telefono, in sala o in cassa, spesso con poca luce e poca pazienza. Deve mostrare il QR in due tocchi e capire subito quanti punti ha.
- **Titolare**: entra dalla stessa web app con il **suo account Google**; l'app riconosce l'account e apre la gestione, da cui configura:
  identità (nome, sigla, frase, logo, copertina, mappa), colori, premi, promo, eventi (con immagini), orari, contatti e link,
  regole dei punti (punti per euro, benvenuto, durata QR), funzioni attive (eventi, prenotazioni, promo, recensioni, compleanno), immagine della tessera nel wallet e account Google abilitati alla gestione.
  Il cliente non ha nessuna impostazione dell'app (né tema né colori: il tema segue il telefono) e non vede alcun accesso alla gestione.
  Il suo profilo contiene solo i suoi dati: compleanno e consensi privacy.

## Funzioni (da mantenere)
1. Installazione e accesso (Google o email, registrazione con 50 punti di benvenuto, istruzioni iPhone/Android)
2. Home: saldo, prossimo premio, azioni rapide, ultimi movimenti, promo, prossimo evento
3. Tessera con QR dinamico (si rinnova ogni 30 s), luminosità massima, **aggiunta ad Apple Wallet / Google Wallet**
4. Saldo e movimenti, filtrabili
5. Catalogo premi con progresso verso ogni premio
6. Riscatto con QR monouso valido 10 minuti; i punti si scalano solo dopo la scansione
7. Promo del mese (punti doppi il martedì)
8. Eventi con prenotazione e punti bonus
9. Info del locale: orari, apertura calcolata, chiama/indicazioni/menù, recensione, social
10. Profilo: compleanno e consensi separati (GDPR)

## Regole
- 1 € speso = 1 punto. Il QR della tessera ruota per impedire gli screenshot.
- Ogni consenso marketing è separato e revocabile; il servizio tessera è l'unico necessario.
- Mode di superficie: **Operate** (l'utente completa un compito), lingua italiana.
