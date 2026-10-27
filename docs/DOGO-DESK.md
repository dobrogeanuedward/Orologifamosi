# DOGO DESK — contratto dei dati e prossima integrazione

Stato: architettura predisposta, applicazione autenticata da integrare dopo disponibilità account. Non è una dashboard operativa. Nessun dataset demo viene presentato come reale.

## Accesso

Due utenti distinti (DOGO e Salvatore) con autenticazione server e autorizzazione esplicita. Segreti e token solo lato server. Nessuna chiave GA4, CMS o Search Console nel bundle statico. Il percorso di accesso dipenderà dall’ambiente autorizzato; non creare una pagina statica che simuli un’area riservata.

## Indicatori

| Indicatore                    | Fonte                                                           | Significato                                              |
| ----------------------------- | --------------------------------------------------------------- | -------------------------------------------------------- |
| Visite                        | GA4, se configurato e nel rispetto delle preferenze applicabili | Sessioni delle sole quattro landing                      |
| Provenienza                   | GA4                                                             | Canale disponibile, con eventuali limiti di attribuzione |
| Clic WhatsApp                 | Evento del sito                                                 | Apertura del link; non prova invio o ricezione           |
| Richieste ricevute            | Canale e registrazione concordati                               | Solo messaggi effettivamente ricevuti e registrati       |
| Appuntamenti / acquisti       | Registrazione Salvatore o dati CMS autorizzati                  | Esiti associabili mediante riferimento comune            |
| Clic e impressioni di ricerca | Search Console                                                  | Proprietà del dominio dedicato                           |

I dati non disponibili sono `null` e mostrano «Fonte non collegata»; zero significa misura disponibile senza eventi. I periodi non confrontabili non generano percentuali. Nessun funnel può equiparare un clic WhatsApp a una richiesta.

## Hook presente

Il modulo emette `orologi:action` con `{ name: 'whatsapp_open', page: pathname }` al passaggio verso WhatsApp. Il payload non contiene dati personali né contenuto del modulo. L’hook non raccoglie o invia nulla. Chiamata telefonica, link diretti WhatsApp e appuntamento andranno distinti quando si collegherà la misurazione autorizzata. GA4 va attivato con la configurazione privacy approvata.

## Modello minimo lead, da implementare nel backend

`id`, `received_at`, `source_page` nullable, `brand`, `reference` nullable, `status` (`received`, `contacted`, `appointment`, `purchased`, `closed`), `attribution_reference` nullable. Contatti personali separati dai dati aggregati e accessibili solo ai due utenti autorizzati. Conservazione e cancellazione secondo accordo privacy.

## CMS

Verificare API o export documentati, campi disponibili, autenticazione, limiti, frequenza e chiave comune per gli esiti. In assenza di canale compatibile, riportare il limite: l’accesso al pannello non garantisce integrazione automatica. Nuove API restano fuori perimetro.

I link diretti emettono anche `phone_click` e `whatsapp_direct_open`, con la sola pagina di provenienza. Non distinguono la ricezione di una chiamata o di un messaggio. Nessun listener invia dati a servizi esterni nella versione corrente.

Il percorso fotografico prepara le immagini solo nel browser. `request_share_handoff` segnala il passaggio alla condivisione nativa; non misura il destinatario, la ricezione o l’esito commerciale. Il riferimento OF della bozza non è un lead conservato. Modalità e limiti in [PHOTO-HANDOFF.md](PHOTO-HANDOFF.md).
