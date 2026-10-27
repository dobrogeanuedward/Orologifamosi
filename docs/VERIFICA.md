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
