# Prima implementazione — verifica del 27 ottobre 2026

## Implementato

Quattro landing Astro, logo e fotografie originali, contenuti distinti per marchio e per intento acquisto da privati, 19 marchi nella generale, processo di valutazione, domande e risposte, sede reale e contatti, richiesta guidata WhatsApp con riepilogo modificabile. Font locali, WebP, caricamento differito delle immagini secondarie, HTML leggibile senza JavaScript, preferenza movimento ridotto.

## Verifica tecnica

- `astro check` e build statica: 0 errori, 0 warning.
- Test del messaggio WhatsApp: 2 superati, compresi caratteri speciali e lunghezza delle note.
- Browser Chromium: tutte e quattro le pagine a 390, 768 e 1440 px, nessun overflow orizzontale, immagine rotta o errore JavaScript. Ulteriore prova a 320 px sulla generale.
- Quattro percorsi di richiesta: validazione dei campi, marchio preselezionato, riepilogo sicuro come testo, ritorno ai dettagli, URL WhatsApp col numero corretto e messaggio codificato. URL intercettato nei test: nessun messaggio inviato.
- Menu mobile, chiusura con Escape, disclosure dei 19 marchi, FAQ, link interni, alternativa WhatsApp senza JavaScript verificati nel browser.
- Axe WCAG 2 A/AA e 2.1 AA: nessuna violazione automatica nelle quattro pagine, viewport mobile. Questo controllo non equivale a certificazione di accessibilità.
- Preferenza `prefers-reduced-motion` verificata nel browser.
- Configurazione produzione provata con dominio riservato `example.org`: quattro canonical distinti, quattro URL in sitemap, robots coerente. Ripristinata build di lavoro noindex/disallow, nessun dominio provvisorio inserito in produzione.
- JSON-LD parsabile: stessa Organization del sito principale, Service specifico per landing; nessuna recensione, rating o sede inventata.

## Limiti della prima implementazione

Nessuna pubblicazione o modifica al CMS originale. Nessun invio reale a Salvatore per il collaudo di ricezione. DOGO DESK è descritto in specifica, non operativo: autenticazione, fonti e backend dipendono dagli accessi e dall’ambiente concordato. GA4 e Search Console non sono collegati; gli hook di azione non raccolgono dati.

## Revisione Taste

Upstream consultato: https://github.com/Leonxlnx/taste-skill, `design-taste-frontend`.
Direzione estratta: **The object, large**, seed **1734601049**. Applicata come revisione della prima composizione, mantenendo logo, fotografie e palette del cliente. Le fotografie reali del tavolo di Salvatore diventano la scena di ingresso al confronto personale. Il dispositivo interattivo è il messaggio di valutazione costruito con le scelte del visitatore, senza stima inventata.

La composizione delle sezioni è stata adattata ai contenuti reali: quattro landing di servizio e nessun prezzo prodotto, filmato originale o foto esterna della sede. Non sono stati usati i contenuti fotografici generici proposti dall’estrazione, né inventati orari o disponibilità.

- Lint Taste sulle sorgenti: **0 FAIL, 0 WARN**; unica eccezione dichiarata nel CSS per la velatura neutra che rende leggibile la didascalia sulla foto, ammessa dalla skill.
- Inspector sul build finale a 1440, 768 e 390 px: **0 FAIL** con `--allow eyebrow`. L’eccezione corregge un falso positivo del rilevatore: un marchio nel disclosure dei 19 marchi veniva interpretato come un’etichetta sopra il titolo della sezione successiva. Le etichette decorative sopra i titoli sono state rimosse dall’interfaccia.
- Warning residui: scala tipografica articolata per componenti e breakpoint, nessun video originale disponibile, movimento contenuto (11 elementi rilevati), un rilevamento mobile di font misto e testo piccolo. Le immagini finali sono state controllate: il titolo ha una sola famiglia e colore; il dato piccolo è subordinato ai controlli. Non si nascondono contenuti per superare il controllo.
- Verificati i fold e tutti i fogli desktop, tablet e mobile prodotti dall’inspector. Le catture restano materiale interno di collaudo.

ROUND 3
Seen in one second: fotografia del confronto personale e azione «Vendi il tuo orologio».
Idea (one sentence): il tavolo reale di Salvatore introduce la valutazione del singolo esemplare.
Live thing: richiesta WhatsApp composta dal visitatore, con riepilogo modificabile.
Layout words by section: hero=split fotografico / marchi=sequenza asimmetrica / processo=campo scuro / persona=ritratto / valore=lista / richiesta=modulo / FAQ=domande rientrate / contatto=campo chiaro.
Scores: design 7.5 · usability 8 · creativity 7 · content 8 → overall 7.6 (autovalutazione interna, non riconoscimento esterno).
Caps applied: nessun FAIL attivo; creatività limitata a 7 perché il principio del confronto personale è condivisibile con altri operatori.
Top three problems (most visible first), each with the screenshot it shows in and the fix:

1. Primo fold mobile troppo testuale: risolto anticipando la fotografia e semplificando il titolo.
2. Controlli piccoli e gerarchia debole: aumentati corpo e dimensioni, rimossi ornamenti e titoletti ridondanti.
3. Foto del catalogo di qualità non uniforme: conservate perché reali; un set fotografico dedicato potrebbe migliorare la prossima revisione.

## Revisione marchi e continuità con il sito principale

- Riletto l’allegato contrattuale: quattro landing, altri 16 marchi nella generale; nessuna nuova pagina marchio o migrazione catalogo.
- Sostituito il disclosure con 16 riquadri fotografici sempre presenti nell’HTML, senza link né azioni. Quattro colonne desktop, due mobile. Nomi testuali e alt descrittivi, nessuna disponibilità o promessa d’acquisto aggiunta.
- Fotografie originali selezionate dalle categorie del catalogo: provenienza in `brand-images.json`, visualizzate in un foglio di controllo prima dell’uso.
- Ripristinati Open Sans locale, oro originale #9a7221, pulsanti arrotondati e tono bianco/nero/beige. Riempimento pulsanti #946d1f per mantenere il contrasto AA del testo bianco. Il riferimento è il CSS del sito originale, verificato il 27 ottobre 2026.
- Collegamento «Acquista un orologio» al catalogo principale, mantenendo qui l’intento di valutazione/acquisto da privati.
- Feedback dei pulsanti, indicatori delle FAQ, avanzamento di lettura e ingressi fotografici; movimento ridotto rispettato.
- Build e typecheck senza errori; quattro flussi WhatsApp e tre viewport verificati; griglia con 16 elementi non cliccabili. Axe automatico sulle quattro pagine e controllo reduced motion superati.

## Revisione icone e movimento

- Sostituite tutte le frecce Unicode con un componente SVG condiviso (`Arrow.astro`), senza caratteri che iOS possa rappresentare come emoji.
- Transizioni di ingresso, uscita e rientro per fotografie, titoli, testi e passaggi del processo. Contenuti visibili senza JavaScript; preferenza reduced motion gestita anche se cambia durante la visita; focus da tastiera rende visibile il blocco raggiunto.
- Compattate le distanze della sezione processo su mobile, conservando il corpo leggibile.
- Browser: verificati SVG, ingresso/uscita/rientro, disattivazione runtime del movimento e leggibilità senza script. Ripassati i quattro flussi WhatsApp, tre larghezze, assenza overflow e controllo automatico Axe. Nessun messaggio inviato nei test.

## Evoluzione dei componenti e oro animato

- Ripristinato Cormorant Garamond per i titoli; Open Sans originale per lettura, controlli ed eyebrow. Titoli prevalentemente neri sui fondi chiari, bianchi nelle sezioni scure, oro limitato a poche sezioni e azioni.
- Metallo spazzolato procedurale SVG/CSS, con riflesso animato a trasformazioni sui pulsanti. Texture dei titoli oro con riflesso lento; animazioni disattivate con reduced motion. Nessun asset fotografico alterato o sostituito.
- `Process.astro`: percorso fotografico a tre tab con pannelli animati in uscita e ingresso, comandi da tastiera (frecce, Home, End), stati ARIA. Senza script mostra tutti i passaggi e nasconde i comandi inattivi.
- Modulo con intestazione dedicata, avanzamento a segmenti, controlli rifiniti e focus del nuovo passaggio; FAQ con superfici di apertura; scheda contatti e riquadri marchio specifici.
- Browser: tutti i pannelli e tastiera verificati, tre viewport e quattro flussi WhatsApp superati; nessun errore JavaScript. Controlli automatici Axe senza violazioni rilevate; prova reduced motion e fallback senza script superata. Esaminate schermate mobile e desktop del percorso e hero mobile.

## Footer, navigazione e copertura del perimetro

- Footer dedicato con logo originale, chiusura tipografica, contatti, indirizzo e percorsi di acquisto/vendita distinti.
- Dropdown fotografico del menu: panoramica e tre landing marchio, apertura nativa da tastiera/touch, chiusura esterna ed Escape, layout mobile scrollabile. Select del modulo conserva il controllo nativo accessibile con stile coerente.
- Scheda valore `Factors.astro`: foto reale e tre approfondimenti apribili, in luogo della lunga lista; nessun importo o certificato di valutazione simulato.
- Esaminate le pagine 7–17 dell’allegato operativo. Estratte **446 query uniche**, assegnate alle quattro landing e alle sezioni pertinenti in `docs/query-coverage.csv`. `scripts/map-query-coverage.py` permette di rigenerare il riscontro dal testo dell’allegato.
- La copertura è semantica: una sezione può rispondere a più varianti. Non sono 446 pagine né 446 corrispondenze esatte obbligatorie, non si attestano ranking o citazioni AI. L’esistenza delle 446 destinazioni è stata verificata nell’HTML della build.
- Completati gli intenti nazionali/online, fotografie, assenza e presenza del corredo, valutazione e contatto locale; esplicitati GMT-Master II e Cartier Panthère tra gli esemplari da sottoporre per un esame, senza impegno all’acquisto.
- Territorio: 28 comuni del perimetro raggruppati in quattro aree sulle landing. La sede è sempre Medicina; Bologna e gli altri comuni indicano da dove può partire la richiesta, non sedi aggiuntive. Italia e contatto a distanza trattati nelle FAQ.
- Typecheck e build superati. Browser a 390, 768, 1024 e 1440: nessun overflow, menu e scheda apribili, logo footer caricato. Quattro flussi WhatsApp e controllo automatico Axe superati, reduced motion e fallback senza script conservati. Nessun messaggio inviato.
- Indicizzazione e fonti di misurazione restano dipendenti dalla configurazione dominio/ambiente e dagli accessi concordati: nessun risultato di ricerca viene inventato.

## Scheda fotografica e contatto dedicato

- Richiesta trasformata in una scheda dinamica a quattro passaggi: marchio/modello, condizioni e corredo a scelta visiva, fotografie, riepilogo e passaggio all’app. Anteprima della scheda e riferimento locale di bozza, senza simulare una valutazione o un lead ricevuto.
- Foto locali senza tetto numerico, entro il limite complessivo di peso: preparazione JPEG nel browser, anteprime, rimozione, ingrandimento con dialog e comandi da tastiera, salvataggio esplicito. Supporto fotocamera sui dispositivi touch e selezione/trascinamento. Limiti e feedback per file vuoti, troppo grandi, non supportati o con firma non fotografica.
- Condivisione file proposta solo quando rilevata dal browser. La Web Share API passa file e testo a un pannello scelto dal dispositivo; WhatsApp e destinatario devono essere scelti dalla persona. Il link alla chat di Salvatore rimane separato e non può allegare automaticamente le immagini. Nessuna conferma fittizia di ricezione.
- Annullamenti, errori e supporto assente conservano dati e anteprime. Copia di messaggio e numero solo con azione esplicita. Nessun server/storage attivato, nessun costo esterno e nessuna persistenza della bozza dopo ricaricamento.
- Contatti trasformati in un componente con scelta «A distanza» / «A Medicina», telefonata diretta, percorso di valutazione, richiesta di appuntamento e indicazioni. Nessuna prenotazione automatica inventata.
- Build e typecheck: zero errori e warning. Sei test unitari passati. Browser Chromium su quattro landing e tre larghezze: campi obbligatori, marchio preselezionato, modifica dei dati, testo codificato e apertura WhatsApp intercettata senza invio di messaggi.
- Test foto: JPEG preparati, rimozione, selezione di dodici foto oltre la vecchia soglia di sei, PDF respinto, SVG rinominato respinto prima della decodifica; mock di file sharing con testo/file, annullamento, errore e capacità assente. Verificati anche il fallback clipboard negata, la scelta fotocamera su superficie touch e assenza di upload/POST o richieste esterne nella preparazione.
- Controllo automatico Axe in 18 stati (primo passaggio, dettagli, foto, dialog, riepilogo, appuntamento) alle larghezze 390/768/1440: nessuna violazione rilevata. Movimento ridotto e funzionamento senza script verificati. Ulteriore controllo a 320 px senza overflow. Catture di mobile e desktop esaminate.
- Le 446 destinazioni della mappa query restano presenti nell’HTML delle quattro landing. Nessuna pagina fuori perimetro aggiunta.
- Limite del collaudo: browser headless e mock API non verificano il pannello nativo iOS/Android o la ricezione in WhatsApp. Dettagli in `PHOTO-HANDOFF.md`; nessun messaggio reale inviato nei test.
