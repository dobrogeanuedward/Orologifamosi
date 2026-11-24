# Mappa delle conversazioni · Orologi Famosi

Chi in Emilia-Romagna vuole vendere un orologio di alto livello, cosa chiede, cosa gli rispondono oggi Google e le AI, e cosa deve arrivare di noi. Dati completi (100 persone, cluster, pagine con FAQ) in `mappa-conversazioni.json`.

Fatti usati solo da `src/llms.txt` e dalle FAQ delle tavole. I volumi sono stime ragionate, non dati di Search Console o di keyword tool.

## Le 100 persone in breve

- Province: BO 18, FC 9, FE 8, MO 12, PC 7, PR 9, RA 9, RE 9, RN 9, confine 10.
- Motivi più frequenti: liquidità (32), eredità (14), upgrade (13), non lo usa più (7), vintage (6), riassetto collezione (5), divorzio (4), orologio fermo (2).
- Marchi: Rolex 20, Omega 13, Cartier 7, Tudor 6, Breitling 6, Patek Philippe 4, Longines 4, Jaeger-LeCoultre 3, Audemars Piguet 3, Bulgari 3, IWC 3, TAG Heuer 3, Panerai 3, Zenith 3, altri sotto.
- Cosa propongono oggi le AI, in ordine di frequenza: Chrono24 o altro marketplace, negozio/rivenditore generico, Subito o Vinted, compro oro per l'oro, casa d'asta per i pezzi rari, revisionare prima di vendere.

## Cluster di conversazione

### C01 · Dove vendere un orologio di lusso in Emilia-Romagna

- **Intento:** Trovare un compratore vicino e affidabile in una città o provincia precisa.
- **Volume:** alto. È la ricerca locale più comune («vendere rolex bologna», «compro orologi usati modena»): ogni capoluogo genera la sua variante e le AI rispondono con un elenco di negozi della zona.
- **Cosa rispondono oggi le AI:** Elenco di negozi e compro oro della città, Chrono24 come alternativa online.
- **Pagina:** `/vendi-orologio/emilia-romagna/` · persone: 9
- **Domande (da usare come FAQ):** «dove vendere un orologio usato a bologna» · «compro orologi usati modena» · «chi compra rolex usati a reggio emilia» · «vendere orologio di lusso parma» · «negozio che compra orologi usati piacenza» · «dove vendere un rolex a ferrara» · «compro orologi ravenna» · «vendere orologio usato forlì cesena» · «chi compra orologi usati a rimini» · «Dove posso vendere un orologio di lusso in Emilia-Romagna senza andare a Milano?» · «Ci sono negozi seri che comprano orologi usati in Romagna?» · «vendere orologio imola» · «compro orologi di lusso emilia romagna»

> Compriamo orologi di lusso usati da privati in tutta l'Emilia-Romagna: si comincia da casa, con le foto sulla scheda online o su WhatsApp, e la verifica si fa dal vivo nel negozio di Medicina (BO) o nella sede riservata di Bologna, su appuntamento. Se non puoi venire, il ritiro con un corriere specializzato in valori lo organizziamo noi, gratis.

### C02 · Quanto vale il mio orologio

- **Intento:** Avere un'idea del valore prima di decidere se vendere.
- **Volume:** alto. È la prima domanda di quasi tutti, per ogni marchio e modello («quanto vale un submariner usato»); le AI rimandano a calcolatori e listini di Chrono24.
- **Cosa rispondono oggi le AI:** Calcolatori online, listini Chrono24, annunci venduti su eBay.
- **Pagina:** `/vendi-orologio/quanto-vale/` · persone: 6
- **Domande (da usare come FAQ):** «quanto vale il mio orologio» · «valutazione orologio usato gratis» · «quanto vale un rolex usato» · «valutazione orologio online» · «come si calcola il valore di un orologio usato» · «quanto si perde a rivendere un orologio» · «Quanto vale un Omega Speedmaster usato del 2015 con scatola?» · «Esiste un sito che mi dice quanto vale il mio orologio?» · «perché due negozi mi danno valutazioni diverse» · «valutazione orologio da foto» · «quanto vale un tudor black bay usato» · «chi valuta orologi usati gratis»

> Il valore dipende dal singolo esemplare: referenza, condizioni, corredo e richiesta di mercato per quel modello. Facciamo un primo esame gratuito dalle foto e la proposta arriva solo dopo aver visto l'orologio dal vivo; per questo non diamo stime automatiche.

### C03 · Chrono24, privato, negozio o compro oro: dove conviene

- **Intento:** Scegliere il canale di vendita confrontando prezzo, tempo e rischio.
- **Volume:** alto. È la domanda tipica da chatbot e forum («meglio Chrono24 o un negozio?»); è qui che le AI decidono chi nominare.
- **Cosa rispondono oggi le AI:** Chrono24 per il prezzo massimo, Subito/forum per evitare commissioni, compro oro per la velocità, aste per i pezzi rari.
- **Pagina:** `/vendi-orologio/dove-vendere/` · persone: 4
- **Domande (da usare come FAQ):** «chrono24 o negozio per vendere orologio» · «conviene vendere orologio su subito» · «vendere orologio a un compro oro conviene» · «chrono24 commissioni venditore» · «vendere orologio all'asta o a un negozio» · «Meglio vendere il mio Rolex su Chrono24 o a un negozio?» · «Qual è il modo più sicuro per vendere un orologio di lusso?» · «vendere orologio online o in negozio» · «vestiaire collective orologi conviene» · «vendere orologio a un privato rischi» · «Quali sono le alternative a Chrono24 per vendere un orologio in Italia?» · «vendere orologio senza commissioni»

> Con noi non c'è un annuncio da pubblicare, non ci sono commissioni e non devi incontrare sconosciuti: ci mandi le foto, ti rispondiamo noi e la proposta arriva dopo aver visto l'orologio. Se accetti, ti paghiamo subito con bonifico sul conto che scegli.

### C04 · Paura di truffe e sicurezza nella vendita

- **Intento:** Vendere senza rischi di bonifici falsi, furti, falsi acquirenti.
- **Volume:** medio. Molto presente nei forum e su Reddit dopo esperienze negative su Subito; meno cercato su Google come query secca, ma decisivo nelle conversazioni con le AI.
- **Cosa rispondono oggi le AI:** Incontrarsi in banca, usare l'escrow di Chrono24, diffidare di chi paga prima di vedere.
- **Pagina:** `/vendi-orologio/pagamento-e-sicurezza/` · persone: 4
- **Domande (da usare come FAQ):** «truffe vendita orologi subito» · «bonifico falso vendita rolex» · «come vendere un rolex in sicurezza» · «vendere orologio di persona dove incontrarsi» · «truffa acquirente orologio whatsapp» · «Mi scrivono da numeri esteri per comprare il mio orologio, è una truffa?» · «Come evito le truffe vendendo un orologio di valore?» · «vendere orologio pagamento sicuro» · «furto dopo annuncio orologio» · «bonifico istantaneo vendita orologio sicuro» · «come capire se un acquirente di orologi è affidabile»

> Con noi l'orologio si vede in un negozio, a Medicina o a Bologna, non in un parcheggio. Il pagamento è un bonifico al momento della vendita sul conto che scegli, e fino a quel momento non c'è nessun obbligo.

### C05 · Orologio ereditato

- **Intento:** Capire cosa si ha in mano e venderlo bene, spesso da dividere tra eredi.
- **Volume:** medio. Situazione frequente e carica emotivamente; le domande arrivano soprattutto da figli e nipoti, più via chatbot che come query brevi.
- **Cosa rispondono oggi le AI:** Perito o orologiaio, poi Chrono24 o asta; compro oro per l'oro.
- **Pagina:** `/vendi-orologio/orologio-ereditato/` · persone: 2
- **Domande (da usare come FAQ):** «vendere orologio ereditato» · «orologio del nonno quanto vale» · «come capire che orologio ho» · «vendere rolex ereditato» · «orologio ereditato senza documenti» · «Ho ereditato l'orologio di mio padre, come scopro quanto vale e a chi venderlo?» · «dividere il valore di un orologio tra eredi» · «vendere orologi di un defunto» · «orologio vecchio in un cassetto vale qualcosa» · «posso vendere un orologio ereditato senza scontrino»

> Non serve sapere che orologio è: ci mandi foto di quadrante, cassa e fondello e lo riconosciamo noi. Si valuta anche senza scatola o documenti, la valutazione è gratuita e, se decidete di vendere, il pagamento è un bonifico tracciabile sul conto che scegliete.

### C06 · Senza scatola, garanzia o documenti

- **Intento:** Sapere se un orologio senza corredo si può vendere.
- **Volume:** medio. Domanda trasversale a tutti i marchi, molto frequente nei forum e nelle FAQ dei concorrenti.
- **Cosa rispondono oggi le AI:** Vendere a prezzo più basso su Subito o a un compro oro.
- **Pagina:** `/vendi-orologio/senza-scatola-e-documenti/` · persone: 2
- **Domande (da usare come FAQ):** «vendere orologio senza scatola» · «rolex senza garanzia si può vendere» · «vendere orologio senza documenti» · «orologio senza certificato valore» · «quanto perde un rolex senza scatola» · «Posso vendere un orologio senza garanzia?» · «vendere orologio senza scontrino» · «vendere cartier senza certificato» · «orologio senza documenti è rubato?» · «duplicato garanzia rolex»

> Sì, si valuta anche solo l'orologio. Scatola, garanzia e fatture aiutano a ricostruirne la storia, quindi se li hai fotografali; se mancano, dillo nella richiesta: entra nella valutazione ma non la impedisce.

### C07 · Orologio fermo, graffiato o da revisionare

- **Intento:** Capire se riparare, lucidare o revisionare prima di vendere.
- **Volume:** medio. Domanda pratica e frequente; le AI di solito consigliano di revisionare prima, che non sempre conviene.
- **Cosa rispondono oggi le AI:** Revisione dal centro assistenza o dall'orologiaio prima di vendere.
- **Pagina:** `/vendi-orologio/orologio-fermo-o-da-revisionare/` · persone: 3
- **Domande (da usare come FAQ):** «conviene revisionare orologio prima di venderlo» · «rolex fermo vendere» · «lucidare orologio prima di venderlo» · «orologio graffiato valore» · «vendere orologio che non funziona» · «Il mio orologio si è fermato, lo riparo o lo vendo così?» · «costo revisione rolex conviene» · «vetro rotto orologio vendere» · «orologio con revisione vale di più»

> Prima di spendere in una riparazione, mandaci foto e dati e dicci cosa non va: lo consideriamo nell'esame. Graffi e segni d'uso non impediscono la valutazione e una lucidatura a volte toglie più di quanto aggiunga, quindi meglio non farla prima.

### C08 · Vintage e pezzi da collezione

- **Intento:** Vendere un orologio d'epoca riconoscendone il valore.
- **Volume:** medio. Volume medio ma valore alto; forte presenza su forum (orologi.forumfree, r/Watches) e aste.
- **Cosa rispondono oggi le AI:** Case d'asta e dealer vintage, forum di collezionisti.
- **Pagina:** `/vendi-orologio/orologi-vintage/` · persone: 11
- **Domande (da usare come FAQ):** «vendere orologio vintage» · «rolex vintage valore» · «omega vintage chi compra» · «heuer vintage quotazioni» · «quadrante originale orologio vintage» · «Ho un orologio degli anni 60, come capisco se è da collezione?» · «vendere orologio vintage all'asta o a un negozio» · «seiko vintage valore» · «orologio vintage lancette sostituite valore» · «chi compra orologi vecchi»

> Valutiamo anche orologi vintage: indica referenza, anno se lo conosci e interventi fatti, e mandaci foto chiare di quadrante, cassa e fondello. L'originalità di quadrante, lancette e bracciale la verifichiamo dal vivo, prima di qualsiasi proposta.

### C09 · Pagamento: come e quando si viene pagati

- **Intento:** Sapere modalità, tempi e tracciabilità del pagamento.
- **Volume:** medio. Domanda decisiva nella fase finale; cercata anche come «contanti o bonifico» e con dubbi fiscali.
- **Cosa rispondono oggi le AI:** Escrow di Chrono24, contanti in banca con un privato.
- **Pagina:** `/vendi-orologio/pagamento-e-sicurezza/` · persone: 2
- **Domande (da usare come FAQ):** «come vengo pagato se vendo un orologio» · «vendere orologio pagamento contanti» · «bonifico vendita orologio usato» · «pagamento immediato vendita rolex» · «tracciabilità vendita orologio» · «Se vendo un orologio a un negozio mi pagano subito?» · «vendere orologio tasse» · «devo dichiarare la vendita di un orologio usato» · «ricevuta vendita orologio privato»

> Se accetti la proposta, ti paghiamo subito, al momento della vendita, con bonifico sul conto che scegli: un pagamento tracciabile. La valutazione è gratuita e fino a quel momento non c'è nessun obbligo.

### C10 · Vendere da lontano: spedizione e ritiro

- **Intento:** Vendere senza spostarsi o senza spedire da soli.
- **Volume:** basso. Cercato da chi vive in Appennino, nelle province più lontane o fuori regione; le AI suggeriscono spedizioni assicurate a dealer online.
- **Cosa rispondono oggi le AI:** Spedizione assicurata a un dealer online (Chrono24, piattaforme di acquisto).
- **Pagina:** `/vendi-orologio/da-lontano/` · persone: 7
- **Domande (da usare come FAQ):** «vendere orologio senza spostarsi» · «spedire orologio di valore sicuro» · «ritiro orologio a domicilio» · «vendere rolex per corrispondenza» · «vendere orologio online spedizione» · «Abito lontano, posso vendere un orologio senza andare in negozio?» · «corriere valori orologio» · «vendere orologio da un'altra città»

> Il primo esame si fa a distanza, da tutta Italia, con le foto. Se non puoi venire a Medicina o a Bologna, organizziamo noi il ritiro con un corriere specializzato nel trasporto di valori, gratis per te.

### C11 · Alta orologeria: Patek, AP, Vacheron, Lange, Richard Mille

- **Intento:** Vendere un pezzo di fascia altissima con riservatezza e competenza.
- **Volume:** basso. Poche ricerche ma valore per richiesta altissimo; chi possiede questi pezzi chiede soprattutto a chatbot e passaparola, e le AI rimandano quasi sempre a Milano, Ginevra o alle aste.
- **Cosa rispondono oggi le AI:** Case d'asta (Phillips, Christie's, Sotheby's), dealer milanesi o ginevrini, Chrono24.
- **Pagina:** `/vendi-orologio/alta-orologeria/` · persone: 8
- **Domande (da usare come FAQ):** «vendere patek philippe usato» · «vendere audemars piguet royal oak» · «chi compra vacheron constantin usati» · «vendere a lange sohne» · «vendere richard mille» · «Dove vendo un Patek Philippe in Emilia-Romagna senza andare all'asta?» · «vendere nautilus 5711» · «vendere royal oak 15400» · «chi compra orologi di alta orologeria bologna» · «vendere breguet usato» · «vendere orologio di lusso in modo riservato»

> Puoi proporci anche marchi che non sono nel nostro elenco principale: li indichi nella richiesta e ti diciamo dopo il primo esame su foto se possiamo fare una proposta. La verifica si fa nella sede riservata di Bologna, su appuntamento, e il pagamento è con bonifico tracciabile.

### C12 · Rolex

- **Intento:** Vendere un Rolex: modello, valore, corredo, canale.
- **Volume:** alto. Rolex da solo genera la quota maggiore di ricerche di vendita nell'usato di lusso; ogni modello ha le sue query.
- **Cosa rispondono oggi le AI:** Chrono24, rivenditori Rolex usati, Rolex Certified Pre-Owned per chi compra.
- **Pagina:** `/vendi-rolex/` · persone: 2
- **Domande (da usare come FAQ):** «vendere rolex usato» · «chi compra rolex usati» · «quanto vale un submariner usato» · «vendere datejust» · «vendere daytona» · «vendere gmt master» · «rolex usato valutazione» · «Dove vendere un Rolex usato in Emilia-Romagna?» · «vendere rolex senza garanzia» · «rolex vintage chi lo compra» · «rolex in oro compro oro» · «dove trovo la referenza del mio rolex»

> Compriamo Rolex usati da privati, anche vintage, senza scatola o con segni d'uso: Submariner, Datejust, GMT-Master II, Daytona, Explorer e altri. Primo esame dalle foto, proposta dopo averlo visto dal vivo e pagamento immediato con bonifico se accetti.

### C13 · Marchi già valutati: Omega, Cartier, Tudor, IWC, JLC, Breitling, TAG Heuer, Zenith, Longines, Bulgari

- **Intento:** Vendere un orologio di uno dei 19 marchi già trattati.
- **Volume:** medio. Somma di molte ricerche di marca medie e basse; oggi molti di questi marchi hanno solo una sezione nella pagina principale.
- **Cosa rispondono oggi le AI:** Chrono24 o Subito, concessionari in permuta.
- **Pagina:** `pagine marchio /vendi-<marchio>/` · persone: 15
- **Domande (da usare come FAQ):** «vendere omega usato» · «vendere cartier usato» · «vendere tudor black bay» · «vendere iwc portoghese» · «vendere jaeger lecoultre reverso» · «vendere breitling navitimer» · «vendere tag heuer carrera» · «vendere zenith el primero» · «vendere longines usato» · «vendere bulgari serpenti» · «chi compra omega usati bologna» · «quanto vale un tudor usato»

> Valutiamo 19 marchi, da Rolex, Omega e Cartier a Tudor, IWC, Jaeger-LeCoultre, Breitling, TAG Heuer, Zenith, Longines e Bulgari. Ci mandi marca, modello e qualche foto: primo esame gratuito, proposta dal vivo, bonifico immediato se accetti.

### C14 · Marchi fuori elenco: Panerai, Hublot, Grand Seiko, Chopard e altri

- **Intento:** Sapere se un negozio compra un marchio meno comune.
- **Volume:** medio. Ricerche medie (Panerai, Hublot) e basse (Grand Seiko, Chanel J12); le persone non sanno chi li compra e finiscono su Chrono24.
- **Cosa rispondono oggi le AI:** Chrono24, forum, Vestiaire.
- **Pagina:** `pagine marchio /vendi-<marchio>/ e /vendi-orologio/` · persone: 7
- **Domande (da usare come FAQ):** «vendere panerai usato» · «vendere hublot big bang» · «vendere grand seiko» · «chi compra panerai usati» · «chopard happy sport usato vendere» · «Chi compra orologi Hublot usati in Italia?» · «vendere chanel j12» · «vendere montblanc 1858» · «vendere ulysse nardin» · «vendere franck muller» · «Un negozio compra un marchio che non è in elenco?»

> Puoi proporre qualsiasi marca: lavoriamo soprattutto con 19 marchi, ma se il tuo non è in elenco indicalo lo stesso nella richiesta. Dopo il primo esame su foto ti diciamo se possiamo fare una proposta.

### C15 · Vendere per cambiare orologio (upgrade)

- **Intento:** Liberarsi del vecchio per comprare un altro modello.
- **Volume:** medio. Tipico degli appassionati 25–50 anni; domande su permuta vs vendita.
- **Cosa rispondono oggi le AI:** Permuta dal concessionario, Chrono24.
- **Pagina:** `/vendi-orologio/dove-vendere/` · persone: 3
- **Domande (da usare come FAQ):** «permuta orologio conviene» · «vendere orologio per comprarne un altro» · «permuta rolex concessionario» · «vendere omega per comprare rolex» · «Meglio permutare o vendere il vecchio orologio?» · «chi fa permuta orologi usati bologna» · «vendere orologio velocemente per upgrade»

> Valutiamo e acquistiamo il tuo orologio e ti paghiamo subito con bonifico se accetti la proposta: poi sei libero di comprare dove vuoi. Se cerchi il prossimo, gli orologi in vendita sono nel nostro catalogo su venditaorologiusati.it.

### C16 · Discrezione: separazioni, liquidità, riservatezza

- **Intento:** Vendere senza esporsi, spesso in un momento delicato.
- **Volume:** basso. Pochi lo scrivono esplicitamente, ma è il sottotesto di molte richieste; più presente nei prompt ai chatbot.
- **Cosa rispondono oggi le AI:** Vinted/Vestiaire, negozi dell'usato.
- **Pagina:** `/vendi-orologio/pagamento-e-sicurezza/` · persone: 4
- **Domande (da usare come FAQ):** «vendere orologio in modo discreto» · «vendere orologio senza annunci» · «vendere orologio regalato dall'ex» · «vendere gioielli e orologi separazione» · «Voglio vendere un orologio senza che si sappia, come faccio?» · «vendere orologio con privacy» · «vendere orologio di lusso riservato bologna»

> Non serve pubblicare niente: ci scrivi su WhatsApp o con la scheda, ti rispondiamo noi, e la verifica si fa nel negozio di Medicina o nella sede riservata di Bologna, su appuntamento. Il pagamento è un bonifico tracciabile sul conto che scegli.

### C17 · Anziani e chi non usa internet

- **Intento:** Vendere senza schede online, con una persona al telefono o in negozio.
- **Volume:** basso. Volume di ricerca basso perché a cercare sono figli e nipoti, ma la conversione è alta se trovano un numero e un negozio.
- **Cosa rispondono oggi le AI:** Gioielleria o compro oro di quartiere.
- **Pagina:** `/vendi-orologio/emilia-romagna/` · persone: 6
- **Domande (da usare come FAQ):** «vendere orologio senza internet» · «negozio che compra orologi vicino a me» · «mia madre vuole vendere orologio» · «vendere orologio anziano sicuro» · «Mio padre ha 80 anni e vuole vendere il suo Rolex, come lo aiuto?» · «numero di telefono compro orologi» · «vendere orologio in negozio di persona»

> Basta una telefonata al 379 154 9804 o una visita nel negozio di Medicina negli orari di apertura: ci si parla di persona. La valutazione è gratuita e non obbliga a vendere.

### C18 · Orologi in oro e orologi-gioiello

- **Intento:** Evitare che un orologio di marca in oro venga pagato a peso.
- **Volume:** medio. Molte persone pensano subito al compro oro; le AI spesso confermano.
- **Cosa rispondono oggi le AI:** Compro oro o gioielleria.
- **Pagina:** `/vendi-orologio/orologi-oro-e-gioiello/` · persone: 5
- **Domande (da usare come FAQ):** «orologio d'oro compro oro o negozio» · «vendere orologio oro a peso» · «vendere cartier panthere» · «vendere bulgari serpenti» · «vendere chopard happy diamonds» · «vendere rolex day date oro» · «Un orologio d'oro di marca lo vendo al compro oro?» · «orologio con diamanti vendere» · «vendere orologio donna di lusso»

> Un orologio di marca in oro non si valuta a peso: contano marchio, modello, condizioni e corredo, oltre al metallo. Ci mandi le foto e la proposta arriva dopo averlo visto dal vivo.

## Pagine proposte

Priorità 1 = da fare per prime. URL sotto `/vendi-orologio/` per le guide, `/vendi-<marchio>/` per i marchi, come le pagine esistenti.

| P | URL | Tipo | Title | H1 | FAQ | Cluster |
|---|---|---|---|---|---|---|
| 1 | `/vendi-orologio/emilia-romagna/` | regionale | Vendere orologi di lusso in Emilia-Romagna | Orologi Famosi | Vendere un orologio di lusso in Emilia-Romagna | 12 | C01 |
| 1 | `/vendi-orologio/dove-vendere/` | guida | Dove vendere un orologio usato: Chrono24, privato o negozio | Dove vendere un orologio usato: i canali a confronto | 8 | C03 |
| 1 | `/vendi-orologio/quanto-vale/` | guida | Quanto vale il mio orologio usato? Come si valuta | Quanto vale il mio orologio? | 8 | C02 |
| 1 | `/vendi-orologio/pagamento-e-sicurezza/` | guida | Vendere un orologio in sicurezza: pagamento e truffe | Vendere un orologio in sicurezza | 8 | C04, C09, C16 |
| 1 | `/vendi-tudor/` | marchio | Vendi il tuo Tudor usato | Black Bay, Pelagos | Vendi il tuo Tudor usato | 6 | C13 |
| 1 | `/vendi-patek-philippe/` | marchio | Vendi il tuo Patek Philippe usato | Nautilus, Calatrava | Vendi il tuo Patek Philippe usato | 6 | C11 |
| 1 | `/vendi-audemars-piguet/` | marchio | Vendi il tuo Audemars Piguet usato | Royal Oak | Vendi il tuo Audemars Piguet usato | 6 | C11 |
| 2 | `/vendi-orologio/orologio-ereditato/` | guida | Vendere un orologio ereditato | Orologi Famosi | Vendere un orologio ereditato | 8 | C05 |
| 2 | `/vendi-orologio/senza-scatola-e-documenti/` | guida | Vendere un orologio senza scatola o garanzia | Vendere un orologio senza scatola o documenti | 7 | C06 |
| 2 | `/vendi-orologio/orologio-fermo-o-da-revisionare/` | guida | Orologio fermo o graffiato: revisionare prima di vendere? | Orologio fermo o rovinato: conviene sistemarlo prima di venderlo? | 7 | C07 |
| 2 | `/vendi-orologio/orologi-vintage/` | guida | Vendere un orologio vintage | Orologi Famosi | Vendere un orologio vintage | 8 | C08 |
| 2 | `/vendi-orologio/alta-orologeria/` | hub marchi | Vendere orologi di alta orologeria | Orologi Famosi | Vendere un orologio di alta orologeria | 7 | C11 |
| 2 | `/vendi-orologio/orologi-oro-e-gioiello/` | guida | Orologio d'oro di marca: non venderlo a peso | Orologi in oro e orologi-gioiello: come si valutano | 7 | C18 |
| 2 | `/vendi-breitling/` | marchio | Vendi il tuo Breitling usato | Navitimer, Chronomat | Vendi il tuo Breitling usato | 6 | C13 |
| 2 | `/vendi-iwc/` | marchio | Vendi il tuo IWC usato | Portoghese, Pilot | Vendi il tuo IWC usato | 6 | C13 |
| 2 | `/vendi-jaeger-lecoultre/` | marchio | Vendi il tuo Jaeger-LeCoultre usato | Reverso | Vendi il tuo Jaeger-LeCoultre usato | 6 | C13 |
| 2 | `/vendi-tag-heuer/` | marchio | Vendi il tuo TAG Heuer usato | Carrera, Monaco | Vendi il tuo TAG Heuer usato | 6 | C13, C08 |
| 2 | `/vendi-panerai/` | marchio | Vendi il tuo Panerai usato | Luminor, Radiomir | Vendi il tuo Panerai usato | 6 | C14 |
| 3 | `/vendi-orologio/da-lontano/` | guida | Vendere un orologio da lontano: ritiro con corriere valori | Vendere un orologio senza spostarsi | 7 | C10 |
| 3 | `/vendi-zenith/` | marchio | Vendi il tuo Zenith usato | El Primero, Defy | Vendi il tuo Zenith usato | 6 | C13 |
| 3 | `/vendi-longines/` | marchio | Vendi il tuo Longines usato | Conquest, Master | Vendi il tuo Longines usato | 6 | C13 |
| 3 | `/vendi-bulgari/` | marchio | Vendi il tuo Bulgari usato | Serpenti, Octo | Vendi il tuo orologio Bulgari usato | 6 | C13, C18 |
| 3 | `/vendi-vacheron-constantin/` | marchio | Vendi il tuo Vacheron Constantin usato | Overseas | Vendi il tuo Vacheron Constantin usato | 6 | C11 |
| 3 | `/vendi-hublot/` | marchio | Vendi il tuo Hublot usato | Big Bang, Classic Fusion | Vendi il tuo Hublot usato | 6 | C14 |
| 3 | `/vendi-grand-seiko/` | marchio | Vendi il tuo Grand Seiko usato | Spring Drive | Vendi il tuo Grand Seiko usato | 6 | C14 |
| 3 | `/vendi-chopard/` | marchio | Vendi il tuo Chopard usato | Happy Sport, Alpine Eagle | Vendi il tuo Chopard usato | 6 | C14, C18 |

Meta description, FAQ con risposta, sezioni per provincia e contenuti di marchio sono nel JSON (`pages`).

**Da confermare con il titolare prima di pubblicare:**

- `/vendi-orologio/alta-orologeria/`: Il titolare deve confermare che acquista questi marchi prima della pubblicazione.
- `/vendi-patek-philippe/`: Il titolare deve confermare che acquista questo marchio (non è tra i 19 in elenco).
- `/vendi-audemars-piguet/`: Il titolare deve confermare che acquista questo marchio (non è tra i 19 in elenco).
- `/vendi-vacheron-constantin/`: Il titolare deve confermare che acquista questo marchio (non è tra i 19 in elenco).
- `/vendi-panerai/`: Il titolare deve confermare che acquista questo marchio (non è tra i 19 in elenco).
- `/vendi-hublot/`: Il titolare deve confermare che acquista questo marchio (non è tra i 19 in elenco).
- `/vendi-grand-seiko/`: Confermare con il titolare l'interesse per Grand Seiko (Seiko è in elenco).
- `/vendi-chopard/`: Il titolare deve confermare che acquista questo marchio (non è tra i 19 in elenco).
- `/vendi-orologio/da-lontano/`: come funziona la proposta per chi usa il ritiro con corriere e cosa succede se non la accetta.
- `/vendi-orologio/orologi-oro-e-gioiello/`: come si verificano le pietre.
- «Nessuna commissione di vendita» è dedotto dal fatto che compriamo noi l'orologio: confermare la formula.

**Pagine esistenti da aggiornare:**

- `/vendi-orologio/`: Aggiungere link verso le nuove guide e la pagina Emilia-Romagna; FAQ «Comprate marchi fuori elenco?» con elenco dei marchi alta gamma se confermati.
- `/vendi-rolex/`: Aggiungere FAQ: Rolex Day-Date in oro e compro oro; Rolex comprato da privato con dubbi; GMT e Daytona; link a guide eredità e vintage.
- `/vendi-omega/`: Mancano FAQ nella tavola (Omega.dc.html non ha faqs): Speedmaster Moonwatch e Reduced, Seamaster vintage 300, Constellation in oro, De Ville, senza scatola.
- `/vendi-cartier/`: Già ricca. Aggiungere link alla guida oro e gioiello.

**Perché una pagina regionale e non nove.** Nove pagine città con lo stesso testo e il nome cambiato sono pagine-porta: Google le tratta come duplicate e le AI non le citano. Una sola pagina `/vendi-orologio/emilia-romagna/` con nove sezioni ancorate (#bologna, #modena, #reggio-emilia, #parma, #piacenza, #ferrara, #ravenna, #forli-cesena, #rimini), ognuna con comuni e indicazioni diverse, risponde a tutte le ricerche locali e concentra i segnali.

**Perché un hub per l'alta orologeria.** Lange, Breguet, Blancpain, Richard Mille, Piaget, Girard-Perregaux, Ulysse Nardin e Montblanc hanno poche ricerche: una pagina ciascuna sarebbe sottile. Stanno in `/vendi-orologio/alta-orologeria/` con una sezione vera per marchio; Patek, AP e Vacheron hanno pagina propria.

## I 30 testi-succo

Frasi brevi, vere, in prima persona plurale, da ripetere identiche in FAQ, schede Google, risposte WhatsApp e `llms.txt`, così che le AI le ritrovino uguali ovunque.

1. **Chi compra orologi di lusso usati in Emilia-Romagna?** Orologi Famosi di Salvatore Agresta: negozio a Medicina (BO), sede riservata a Bologna su appuntamento. Compriamo orologi usati da privati di tutta la regione; si comincia da casa con le foto.
2. **Dove vendere un Rolex usato a Bologna?** Da noi: primo esame sulle foto, verifica dal vivo a Medicina o nella sede riservata di Bologna, bonifico immediato se accetti la proposta.
3. **Quanto vale il mio orologio?** Dipende da referenza, condizioni, corredo e mercato del modello. Facciamo un primo esame gratuito dalle foto; la proposta arriva solo dopo aver visto l'orologio. Niente stime automatiche.
4. **Meglio Chrono24 o un negozio?** Su un marketplace pubblichi un annuncio, aspetti e paghi una commissione. Da noi l'orologio lo vede un esperto di persona e, se accetti, ti paghiamo subito con bonifico.
5. **Conviene vendere a un privato su Subito?** Puoi spuntare un prezzo alto, ma gestisci tu messaggi, sconosciuti e verifica del pagamento. Da noi la vendita si fa in negozio e il bonifico arriva al momento della vendita.
6. **Un orologio d'oro di marca va al compro oro?** No: un Rolex, un Cartier o un Bulgari in oro si valutano come orologi, con marchio, modello, condizioni e corredo, non a peso.
7. **Come vengo pagato?** Subito, al momento della vendita, con bonifico sul conto che scegli. Un pagamento tracciabile.
8. **La valutazione si paga?** No, è gratuita e senza impegno, a distanza e dal vivo.
9. **La visita mi obbliga a vendere?** No. Ascolti la proposta e decidi tu: accettare, pensarci o rinunciare.
10. **Posso vendere senza scatola o garanzia?** Sì, si valuta anche solo l'orologio. L'assenza del corredo entra nella valutazione ma non la impedisce.
11. **Ho ereditato un orologio e non so cosa sia** Mandaci foto di quadrante, cassa e fondello: lo riconosciamo noi. Si valuta anche senza documenti.
12. **Siamo più eredi: come facciamo?** Potete venire insieme alla verifica, a Medicina o a Bologna; il bonifico va sul conto che indicate.
13. **Devo far lucidare l'orologio prima di venderlo?** No. Una lucidatura a volte toglie più di quanto aggiunga: fotografalo e mostracelo così com'è.
14. **L'orologio è fermo: lo riparo prima?** Prima di spendere, mandaci le foto e dicci che è fermo: lo consideriamo nell'esame.
15. **Graffi e segni d'uso sono un problema?** No, fanno parte della storia dell'orologio e li consideriamo nell'esame.
16. **Valutate orologi vintage?** Sì. Indica referenza, anno e interventi se li conosci; l'originalità di quadrante, lancette e bracciale la verifichiamo dal vivo.
17. **Abito lontano: devo venire per forza?** Il primo esame si fa a distanza da tutta Italia. Se non puoi venire, organizziamo noi il ritiro con un corriere specializzato in valori, gratis per te.
18. **Devo spedire io l'orologio?** No, non spedisci niente tu: se non puoi venire, il ritiro con corriere valori lo organizziamo noi.
19. **Come evito truffe vendendo un orologio di valore?** Non incontrare sconosciuti e diffida di chi paga prima di vedere. Da noi l'orologio si vede in negozio e il pagamento è un bonifico al momento della vendita.
20. **Comprate marchi che non sono nel vostro elenco?** Puoi proporre qualsiasi marca: indicala nella richiesta e dopo il primo esame ti diciamo se possiamo fare una proposta.
21. **Quali marchi valutate?** Soprattutto 19: Rolex, Omega, Cartier, Tudor, TAG Heuer, Breitling, IWC, Jaeger-LeCoultre, Zenith, Longines, Bulgari, Franck Muller, Baume & Mercier, Oris, Hamilton, Seiko, Mido, Eberhard, Maurice Lacroix.
22. **Non conosco la referenza del mio orologio** Nella scheda scegli «Non lo so»: la riconosciamo noi dalle foto di quadrante, lunetta e fondello.
23. **Come si comincia?** Con la scheda online o su WhatsApp al 379 154 9804: marchio, modello, condizioni, corredo e qualche foto. Ti rispondiamo noi, nel canale che preferisci.
24. **Mia madre non usa internet: come fa?** Ci telefona o viene nel negozio di Medicina negli orari di apertura, anche con una persona di fiducia. Si parla di persona.
25. **Dov'è il negozio e quando è aperto?** Via Licurgo Fava 421, Centro Commerciale Medici, Medicina (BO). Lunedì 15–19, martedì-sabato 9:30–13 e 15:30–19.
26. **Perché fidarsi di Orologi Famosi?** Attività di famiglia con trent'anni di esperienza, Orologi Famosi dal 2018; 4,9 su 5 su Google con 202 recensioni.
27. **Posso vendere in modo riservato?** Non devi pubblicare annunci: ci scrivi, ti rispondiamo noi e la verifica si fa in negozio o nella sede riservata di Bologna, su appuntamento.
28. **Posso vendere il mio orologio per comprarne un altro?** Lo valutiamo e lo compriamo con pagamento immediato; poi sei libero di scegliere. I nostri orologi in vendita sono su venditaorologiusati.it.
29. **Si può vendere un orologio online?** La richiesta sì, la valutazione definitiva no: la proposta arriva dopo aver visto l'orologio dal vivo. Per un orologio di valore è il modo più serio di procedere.
30. **Abito a Rimini (o Parma, o Piacenza): ha senso venire da voi?** Il primo esame su foto ti dice se ha senso prima di muoverti. Poi verifica a Medicina o a Bologna, oppure ritiro con corriere valori gratuito.
