# Fidelia — prodotto

> Ricavato dalla web app Fidelia esistente (artifact "Fidelia App", 10 schermate) e dalla richiesta di redesign del 3 ottobre 2026.

## Cos'è
Una tessera fedeltà digitale per locali indipendenti (ristoranti, osterie, bar). Vive nel browser come PWA installabile: niente app store.
Locale di esempio: **Osteria del Porto**.

## Per chi
- **Cliente del locale** (utente principale): al telefono, in sala o in cassa, spesso con poca luce e poca pazienza. Deve mostrare il QR in due tocchi e capire subito quanti punti ha.
- **Titolare**: entra con il PIN del locale ("Sei il titolare?" nella schermata di accesso) e gestisce tutto da **Gestione locale**:
  identità (nome, sigla, frase, logo, copertina, mappa), colori, premi, promo, eventi (con immagini), orari, contatti e link,
  regole dei punti (punti per euro, benvenuto, durata QR), funzioni attive (eventi, prenotazioni, promo, recensioni, compleanno) e PIN.
  Il cliente non vede nessuna di queste impostazioni.

## Funzioni (da mantenere)
1. Installazione e accesso (Google o email, registrazione con 50 punti di benvenuto, istruzioni iPhone/Android)
2. Home: saldo, prossimo premio, azioni rapide, ultimi movimenti, promo, prossimo evento
3. Tessera con QR dinamico (si rinnova ogni 30 s), luminosità massima
4. Saldo e movimenti, filtrabili
5. Catalogo premi con progresso verso ogni premio
6. Riscatto con QR monouso valido 10 minuti; i punti si scalano solo dopo la scansione
7. Promo del mese (punti doppi il martedì)
8. Eventi con prenotazione e punti bonus
9. Info del locale: orari, apertura calcolata, chiama/indicazioni/menù, recensione, social
10. Profilo: compleanno, consensi separati (GDPR), colori del locale, tema

## Regole
- 1 € speso = 1 punto. Il QR della tessera ruota per impedire gli screenshot.
- Ogni consenso marketing è separato e revocabile; il servizio tessera è l'unico necessario.
- Mode di superficie: **Operate** (l'utente completa un compito), lingua italiana.
