# Orologi Famosi — acquisto da privati

Quattro landing in **Astro 7**, TypeScript e CSS, senza React. Contenuti originali, fotografie dell’attività e richiesta guidata su WhatsApp. Repository del servizio dedicato, distinto dal catalogo originale.

```sh
npm ci
npm run dev
npm run build
npm test
npm run preview
```

Richiede Node 22.12+ (o Node 24). L’output statico è in `dist/`.

## Configurazione produzione

Copia `.env.example` in `.env`. Imposta `SITE_URL` solo sul dominio approvato e `PUBLIC_INDEXABLE=true` solo in produzione. In assenza di questa configurazione tutte le pagine restano noindex, robots disallow e la sitemap è vuota. Gli URL canonici delle quattro pagine sono autonomi: non puntano alla home del catalogo originale.

Su hosting statico configurare `/` come redirect **301** a `/vendi-orologio/` e la risposta 404 con `404.html`. La pagina root generata da Astro fornisce comunque il rinvio HTML. Nessun dominio è stato registrato o collegato.

Il modulo prepara una scheda fotografica e un messaggio. Non impone un numero massimo di immagini: controlla il peso dei file e li prepara localmente. Dove supportato, la Web Share API passa file e testo al pannello di condivisione del dispositivo: la persona sceglie WhatsApp e il destinatario. Il link diretto alla chat di Salvatore prepara soltanto il testo, senza allegati automatici. Nessun upload a server, archivio di richieste o cookie analytics. Dettagli e limiti in [docs/PHOTO-HANDOFF.md](docs/PHOTO-HANDOFF.md).

Fonti, perimetro e dipendenze per la consegna completa sono in [docs/PROJECT.md](docs/PROJECT.md). Specifica dati DOGO DESK in [docs/DOGO-DESK.md](docs/DOGO-DESK.md).
