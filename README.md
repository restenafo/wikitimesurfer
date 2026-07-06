# WikiTimeSurfer ⏳

Web-app per navigare nella cronologia delle modifiche delle voci di Wikipedia: scorri tutte le
versioni di una voce con le differenze evidenziate (verde = aggiunte, rosso = rimozioni), vedi
autore, data/ora e oggetto di ogni modifica, filtra per singolo utente e salta nel tempo con la
timeline delle modifiche per mese.

**Solo frontend**: il browser dialoga direttamente con le API pubbliche di MediaWiki
(`origin=*`, CORS anonimo). Nessun backend, nessun cookie, nessun dato personale trattato.

## Funzionalità

- Ricerca di una voce in 14 edizioni linguistiche di Wikipedia (selettore in home).
- Navigazione tra tutte le versioni: pulsanti ⇤ ← → ⇥, cursore, tastiera
  (`←`/`→` versione precedente/successiva, `Home`/`End` prima/ultima).
- Diff sul testo renderizzato: la voce appare formattata come su Wikipedia, con `<ins>`/`<del>`
  calcolati client-side ([node-htmldiff](https://www.npmjs.com/package/node-htmldiff)) tra la
  revisione corrente e la precedente, sanitizzati con DOMPurify.
- Click sull'autore → si naviga solo tra le sue modifiche (il diff resta calcolato rispetto
  alla revisione immediatamente precedente nella cronologia completa).
- Timeline scorribile con istogramma delle modifiche per mese; in modalità filtro le barre
  distinguono le modifiche dell'utente dalle altre.
- Link condivisibili: la revisione corrente è nella URL (`?rev=<id>`).
- Cronologia caricata progressivamente (500 revisioni per richiesta API, con pausa di
  cortesia); l'HTML delle revisioni adiacenti è precaricato per una navigazione fluida.
- Pagina Privacy & Cookie (nessun banner necessario: niente cookie, solo `localStorage`
  tecnico per l'edizione preferita).

## Sviluppo

```bash
npm install
npm start          # http://localhost:4200
npm run build      # produzione → dist/wikitimesurfer/browser
```

## Deploy (hosting statico)

Il sito è statico: basta pubblicare `dist/wikitimesurfer/browser`. Il file `public/_redirects`
(già incluso nella build) configura il fallback SPA su Cloudflare Pages e Netlify.

- **Cloudflare Pages** (consigliato, gratuito): build command `npm run build`, output
  directory `dist/wikitimesurfer/browser`.
- **Netlify**: stessa configurazione.
- **Server proprio (nginx)**: servire la cartella con `try_files $uri $uri/ /index.html;`.

Per le statistiche di visita, se serviranno: Cloudflare Web Analytics o Plausible
(cookieless, nessun banner di consenso richiesto).

## Licenze e attribuzione

- I contenuti delle voci provengono da Wikipedia e sono disponibili con licenza
  [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/deed.it); ogni pagina
  dell'app linka la voce originale e la sua cronologia (autori).
- WikiTimeSurfer non è affiliato a Wikimedia Foundation. «Wikipedia» è un marchio registrato
  di Wikimedia Foundation, Inc. — per questo non compare nel nome del servizio.
- Le richieste alle API includono l'header identificativo `Api-User-Agent`, come richiesto
  dall'etiquette Wikimedia (aggiorna il contatto in `src/app/core/wikipedia-api.service.ts`
  quando pubblichi il dominio definitivo).
