# Richiesta fotografica e passaggio a WhatsApp

## Comportamento reale

Il nuovo componente accompagna la persona in quattro passaggi: orologio, condizioni/corredo, foto, controllo e invio. La scheda laterale si aggiorna con i dati scelti e la prima foto effettiva. Il codice OF è un riferimento della bozza, non un lead registrato o un’offerta commerciale.

Le foto vengono selezionate e preparate nel browser, senza upload a un server. Non si usa localStorage né un archivio remoto. Il ricaricamento della pagina perde la bozza; un ritorno da un'altra app può conservarla se il browser mantiene la pagina in memoria, senza garanzia contro chiusure del sistema.

- Nessun tetto numerico alle immagini; limite di peso 20 MiB per originale e 40 MiB complessivi, per contenere l’uso della memoria sul dispositivo. Queste soglie sono scelte applicative, non limiti dichiarati da WhatsApp.
- JPEG, PNG, WebP e HEIC/HEIF solo se decodificabili dal browser.
- Controllo di formato e firma dei byte: un SVG rinominato non viene caricato come fotografia.
- Preparazione sequenziale locale in JPEG, lato lungo massimo 2600 px, qualità 0.9. I metadati dell’originale non vengono copiati.
- Anteprima, ingrandimento in dialog accessibile, rimozione e download esplicito delle versioni preparate.
- Gli originali non vengono modificati o cancellati. I file temporanei condivisi usano un nome generato con il riferimento della bozza.

## Due modalità, senza false promesse

1. **Chat diretta**: `https://wa.me/393791549804?text=...` apre la chat di Salvatore con il solo testo precompilato. Non allega le immagini del sito. La persona deve premere invia e aggiungere le foto in WhatsApp, oppure condividerle separatamente.
2. **Condivisione con file**: se `navigator.canShare({ files })` e `navigator.share` sono disponibili, il sito propone file JPEG e testo al pannello di condivisione del dispositivo. La persona sceglie l’app e il destinatario. Non si può forzare WhatsApp, preselezionare Salvatore o verificare la consegna. Alcune destinazioni possono ignorare il testo insieme ai file: restano il messaggio pronto nella chat diretta e il pulsante esplicito di copia.

Non si tenta di inserire i file nel parametro `text`, di usare percorsi locali non accessibili a WhatsApp o di trattare il completamento della Web Share API come conferma di ricezione. Annullamenti ed errori conservano la bozza e le foto. Il pulsante di copia usa la clipboard solo dopo il clic della persona.

## Tracciamento e limiti

Gli hook `orologi:action` restano azioni dell’interfaccia, con il solo nome dell’evento e la pagina. `request_share_handoff` indica la risoluzione della Web Share API, che non equivale né a consegna né a messaggio ricevuto. Nessun contenuto, riferimento, nome di file o dato del modulo entra nel payload analytics. Non sono collegati GA4 o servizi esterni.

Per un percorso diverso con foto archiviate e un link privato nel messaggio servono backend, conservazione, protezione degli accessi e configurazione del servizio. Quella soluzione non è implementata né simulata in questa versione; non sono stati attivati storage, account o costi esterni.

## Fonti primarie consultate il 27 ottobre 2026

- WhatsApp, click to chat: https://faq.whatsapp.com/5913398998672934
- WhatsApp, collegamento da altre app: https://faq.whatsapp.com/425247423114725/
- W3C Web Share API: https://www.w3.org/TR/web-share/
- MDN `Navigator.share`: https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share
- MDN `Navigator.canShare`: https://developer.mozilla.org/en-US/docs/Web/API/Navigator/canShare

## Verifica

Test unitari su formati, firme, limiti, codifica del testo e rilevamento della condivisione. Browser Chromium sulle quattro landing a 390, 768 e 1440 px: flussi vuoti/foto, modifica, rimozione, dialog ingrandimento, selezione di 12 foto e controllo sul peso complessivo, rifiuto di file non fotografici e firma SVG mascherata. Condivisione file/testo verificata tramite un mock della API, compresi annullamento, errore e funzionalità non disponibile. Nessun messaggio inviato e nessuna prova di consegna effettuata nell’app WhatsApp reale. La verifica nativa iPhone/Android resta una prova di collaudo distinta: la disponibilità dell’app e il comportamento del pannello non sono riproducibili da un browser headless.
