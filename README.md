# Orologi Famosi · landing di acquisto da privati

Le 4 landing del contratto (generale, Rolex, Omega, Cartier) più "Chi è Salvatore" e la pagina di richiesta, replicate dalle tavole di design dell'artifact "Orologi Famosi — Acquisto da privati".

## Come funziona

- `design/project/*.dc.html` sono le tavole esportate dall'artifact (fonte di verità del design), `design/blobs/` le immagini e i video caricati.
- `scripts/build.mjs` legge le tavole e produce `dist/`: **HTML statico completo** (ottimo per SEO, AEO, GEO) che nel browser si riattiva con la **stessa logica** delle tavole (Preact, `src/dc.js`).
- La pagina di richiesta invia le schede a **Dogo Desk** (`POST /api/intake/of`), con foto su link firmati e codice OF assegnato dal server (`src/client.js`).

```bash
npm install
npm run dev        # build + server su http://localhost:4321/vendi-orologio/
```

Variabili: `SITE_URL` (default https://www.venditaorologiusati.it), `DESK_URL` (default http://localhost:3000), `DESK_ORG` (default of).

## Indirizzi (da confermare con il gestore del sito)

| Pagina | URL |
|---|---|
| Landing generale | `/vendi-orologio/` |
| Rolex | `/vendi-rolex/` |
| Omega | `/vendi-omega/` |
| Cartier | `/vendi-cartier/` |
| Chi è Salvatore | `/vendi-orologio/salvatore-agresta/` |
| Richiesta (noindex) | `/vendi-orologio/richiesta/` |

## SEO · AEO · GEO

- Titoli e descrizioni delle tavole, canonical, Open Graph, `lang="it"`, un solo H1 per pagina.
- Dati strutturati schema.org: `Store`/`LocalBusiness` (indirizzo, telefono, P. IVA, fondatore, zone servite), `Service` per marchio, `FAQPage` con le stesse FAQ visibili in pagina, `BreadcrumbList`, `Person` e `AboutPage` per Salvatore.
- `sitemap-vendi-orologio.xml` e `robots-snippet.txt` da aggiungere al robots del sito principale.
- `llms.txt` per i motori di risposta AI: fatti essenziali, marchi, pagine, come funziona.
- Nessuna recensione, prezzo o orario inventato.

## Pubblicazione

Caricare il contenuto di `dist/` nella radice del sito principale (cartelle dedicate, il resto del sito resta sul suo CMS). Nel Desk aggiungere il dominio a `INTAKE_ALLOWED_ORIGINS` e costruire con `DESK_URL=https://desk.dogostudio.it`.

## Da completare con Orologi Famosi

- Link all'informativa privacy nel modulo (oggi `#`).
- Conferma degli URL con il gestore del sito.
- Analytics (GA4) con banner dei consensi: previsto con la beta 2 del Desk.

## Immagini e video su R2

Immagini e video non stanno sul sito: si servono dal bucket R2 di DOGO (`dogostudio`) sotto un prefisso versionato,
`orologi-famosi/landing-2026-11-v1/` (`img/` per le immagini delle tavole, `media/` per video e locandine).
La build scrive quegli indirizzi; con `ASSETS_CDN=''` li copia invece in `dist/of-assets/` (utile in locale).

Se cambiano le immagini, si carica un nuovo prefisso (es. `landing-2026-12-v2`) e si aggiorna `CDN` in `scripts/build.mjs`.
Il caricamento si fa con lo script di DOGO, dal repository `dogo-studio` (le chiavi restano lì, mai qui):

```sh
node --env-file=.env.local scripts/r2-upload.mjs --source "<landing>/design/blobs" --prefix orologi-famosi/<versione>/img --recursive --cache-control "public, max-age=31536000, immutable"
node --env-file=.env.local scripts/r2-upload.mjs --source "<landing>/design/project/media" --prefix orologi-famosi/<versione>/media --recursive --cache-control "public, max-age=31536000, immutable"
```

Font, CSS e JS restano sul sito (i font da un altro dominio richiederebbero CORS).
