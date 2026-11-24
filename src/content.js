/**
 * Pagine di contenuto costruite sulla tavola Guida (design/project/Guida.dc.html):
 * guide-risposta, pagine marchio e pagina regionale.
 * Origine: mappa delle conversazioni (strategy/mappa-conversazioni.md).
 * Regole: solo fatti veri su Orologi Famosi (nessun prezzo, percentuale, tempo o servizio inventato),
 * prima persona plurale, Salvatore come nome e volto.
 */
import fs from 'node:fs';
import { registerBrandPage } from './seo.js';
const CATALOGO = (() => { try { return JSON.parse(fs.readFileSync(new URL('./catalogo.json', import.meta.url), 'utf8')); } catch { return {}; } })();
const CAT_URL = 'https://www.venditaorologiusati.it/catalogo';

/** FAQ aggiuntive dalla mappa delle conversazioni (100 persone, 18 cluster): si uniscono a quelle scritte qui, senza doppioni. */
const MAPPA = (() => { try { return JSON.parse(fs.readFileSync(new URL('../strategy/mappa-conversazioni.json', import.meta.url), 'utf8')).pages || []; } catch { return []; } })();
const MAP_URL = {
  '/vendi-orologio/emilia-romagna/': '/vendi-orologio/emilia-romagna/',
  '/vendi-orologio/guida/dove-vendere-orologio-usato/': '/vendi-orologio/dove-vendere/',
  '/vendi-orologio/guida/quanto-vale-orologio-usato/': '/vendi-orologio/quanto-vale/',
  '/vendi-orologio/guida/vendere-orologio-ereditato/': '/vendi-orologio/orologio-ereditato/',
  '/vendi-orologio/guida/vendere-orologio-senza-scatola-garanzia/': '/vendi-orologio/senza-scatola-e-documenti/',
  '/vendi-orologio/guida/vendere-orologio-fermo-o-rotto/': '/vendi-orologio/orologio-fermo-o-da-revisionare/',
  '/vendi-orologio/guida/vendere-orologio-in-sicurezza/': '/vendi-orologio/pagamento-e-sicurezza/',
  '/vendi-orologio/guida/orologi-vintage/': '/vendi-orologio/orologi-vintage/',
  '/vendi-orologio/guida/vendere-da-lontano/': '/vendi-orologio/da-lontano/',
};
const words = (q) => new Set(q.toLowerCase().normalize('NFD').replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter((w) => w.length > 3));
const similar = (a, b) => { const A = words(a), B = words(b); let n = 0; for (const w of A) if (B.has(w)) n++; return n / Math.max(1, Math.min(A.size, B.size)) >= 0.6; };
// Frasi della mappa ancora da confermare con Salvatore: non si pubblicano.
const DA_CONFERMARE = /commission|pietre|diamant|proposta.*ritir|ritir.*proposta|rifiut/i;
function withMapFaqs(route, faqs, max = 12) {
  const src = MAPPA.find((p) => p.url === (MAP_URL[route] || route));
  const out = [...faqs];
  for (const f of src?.faqs || []) {
    if (out.length >= max) break;
    if (!f.q || !f.a || !f.q.trim().endsWith('?') || f.a.length < 70 || DA_CONFERMARE.test(f.q + ' ' + f.a)) continue;
    if (out.some((x) => similar(x.q, f.q))) continue;
    out.push({ q: f.q, a: f.a });
  }
  return out;
}

const IMG = {
  banco: '3462b80a02bb0c690611f865bcf09190',     // Salvatore alla prova di marcia, nessun marchio in vista
  tavolo: '50b9506a6dba33845dd4eb44b593e14c',    // Salvatore con un cliente, vassoio di orologi
  scrivania: '4f2c3f4cebf45e40d1f843402dc03637', // Salvatore alla scrivania con cofanetto
  tudor: 'a6d67d267c05974edaece44496807829',     // scatola Tudor
  movimento: '7d71adb8addc7258c551c15f2c3babe0', // movimento sotto la lente
  mano: '483758e92ebe8713bc8cb3a0c55d0fab',      // orologio tra le mani
  velluto: '1066336dcb7da535a943c4cd3be136d1',   // due GMT sul velluto
  libro: '79d6020b97a9514ecb506ef5d618d19a',     // al polso, sul libro
};

/** Descrizioni delle foto (per chi non le vede e per Google Immagini). */
const ALT = {
  [IMG.banco]: 'Salvatore Agresta controlla la marcia di un orologio nel negozio di Orologi Famosi a Medicina (BO)',
  [IMG.tavolo]: 'Salvatore Agresta valuta gli orologi di un cliente al tavolo di Orologi Famosi',
  [IMG.scrivania]: 'Salvatore Agresta esamina un orologio alla sua scrivania, con la scatola originale',
  [IMG.tudor]: 'Salvatore Agresta apre la scatola originale di un Tudor',
  [IMG.movimento]: 'Il movimento di un cronografo d’epoca sotto la lente',
  [IMG.mano]: 'Un orologio subacqueo in acciaio tra le mani durante la valutazione',
  [IMG.velluto]: 'Due orologi GMT su un vassoio di velluto da Orologi Famosi',
  [IMG.libro]: 'Un cronografo in oro al polso, sopra un libro di orologeria',
};
const G = '/vendi-orologio/guida/';
const R = {
  guide: G,
  dove: `${G}dove-vendere-orologio-usato/`,
  valore: `${G}quanto-vale-orologio-usato/`,
  corredo: `${G}vendere-orologio-senza-scatola-garanzia/`,
  eredita: `${G}vendere-orologio-ereditato/`,
  sicuro: `${G}vendere-orologio-in-sicurezza/`,
  foto: `${G}foto-orologio-per-valutazione/`,
  fermo: `${G}vendere-orologio-fermo-o-rotto/`,
  vintage: `${G}orologi-vintage/`,
  regione: '/vendi-orologio/emilia-romagna/',
  marchi: '/vendi-orologio/marchi/',
  rolex: '/vendi-rolex/', omega: '/vendi-omega/', cartier: '/vendi-cartier/',
  salvatore: '/vendi-orologio/salvatore-agresta/', richiesta: '/vendi-orologio/richiesta/',
};

const card = {
  dove: { href: R.dove, t: 'Dove vendere un orologio usato', d: 'Piattaforme, annunci, compro oro, negozio: pro e contro di ogni strada.' },
  valore: { href: R.valore, t: 'Quanto vale il mio orologio', d: 'Da cosa dipende il prezzo e perché le stime online ingannano.' },
  corredo: { href: R.corredo, t: 'Senza scatola o garanzia', d: 'Si vende lo stesso: cosa cambia e cosa preparare.' },
  eredita: { href: R.eredita, t: 'Un orologio ereditato', d: 'Capire cosa hai in mano prima di decidere, anche tra più eredi.' },
  sicuro: { href: R.sicuro, t: 'Vendere senza rischi', d: 'Pagamenti, appuntamenti, truffe: come proteggersi.' },
  foto: { href: R.foto, t: 'Le foto per la valutazione', d: 'Quali scatti servono e come farli con il telefono.' },
  vintage: { href: R.vintage, t: 'Orologi vintage', d: 'Cosa conta in un orologio d’epoca e cosa non toccare.' },
  fermo: { href: R.fermo, t: 'Orologio fermo o da revisionare', d: 'Si può proporre anche se non funziona.' },
  regione: { href: R.regione, t: 'Da tutta l’Emilia-Romagna', d: 'Da Piacenza a Rimini: come si fa, provincia per provincia.' },
  marchi: { href: R.marchi, t: 'Tutti i marchi', d: 'Da Rolex a Patek Philippe: cosa valutiamo e cosa conta.' },
  salvatore: { href: R.salvatore, t: 'Chi è Salvatore Agresta', d: 'Chi guarda il tuo orologio e come lavora.' },
};

const FATTI = 'Orologi Famosi di Salvatore Agresta, negozio a Medicina (BO) e sede riservata a Bologna su appuntamento';

// ------------------------------------------------------------------ guide

const guide = [
  {
    slug: 'dove', route: R.dove, link: 'GuidaDove', hero: IMG.tavolo,
    title: 'Dove vendere un orologio di lusso usato: le strade a confronto | Orologi Famosi',
    description: 'Chrono24, annunci tra privati, compro oro, boutique o un negozio specializzato: come funziona ogni strada, quanto ci vuole, quali rischi. Con il parere di chi compra orologi ogni giorno.',
    crumb: 'Dove vendere un orologio usato', about: ['vendita orologi usati', 'Chrono24', 'compro oro', 'orologi di lusso'],
    data: {
      kicker: 'Guida', kickerSub: 'dove vendere un orologio usato',
      h1: 'Dove vendere un orologio di lusso usato',
      lead: 'Le strade sono cinque e nessuna è giusta per tutti. Le mettiamo una accanto all’altra, con quello che ci raccontano ogni settimana le persone che arrivano da noi dopo averle provate.',
      brief: 'Se vuoi il prezzo più alto e hai tempo e pazienza, puoi vendere da solo su una piattaforma o con un annuncio. Se vuoi sapere quanto vale davvero, essere pagato subito e non trattare con sconosciuti, conviene un negozio specializzato che guarda l’orologio di persona.',
      points: [
        'Piattaforme come Chrono24: buona visibilità, ma commissioni, spedizione e attesa sono a carico tuo.',
        'Annunci tra privati: nessuna commissione, ma il rischio di truffe è reale.',
        'Compro oro e boutique raramente sono la strada giusta per un orologio da collezione.',
        'Da noi: valutazione gratuita, proposta dopo averlo visto dal vivo, pagamento immediato con bonifico.',
      ],
      sections: [
        { id: 'confronto', nav: 'Le cinque strade', h: 'Le cinque strade, una accanto all’altra',
          p: ['Il confronto vale per un orologio di fascia alta, dai Rolex e Omega in su. Per un orologio d’acciaio di largo consumo i conti cambiano, ma la logica resta la stessa.'],
          table: { head: ['Strada', 'Chi stabilisce il prezzo', 'Quando incassi', 'A cosa fare attenzione'], rows: [
            { k: 'Piattaforma online (es. Chrono24)', v: ['Tu, confrontandoti con gli annunci', 'Quando qualcuno compra: a volte giorni, spesso settimane', 'Commissioni sul venduto, spedizione assicurata, foto e descrizione a tuo carico'] },
            { k: 'Annuncio tra privati (Subito, forum, social)', v: ['Tu, trattando con chi risponde', 'All’incontro, se va a buon fine', 'Bonifici falsi, assegni scoperti, appuntamenti con sconosciuti, molte perdite di tempo'] },
            { k: 'Compro oro', v: ['Chi compra, spesso a peso del metallo', 'Subito', 'Un orologio d’acciaio o da collezione vale per quello che è, non per il metallo'] },
            { k: 'Boutique o concessionario del marchio', v: ['Il negozio, solo come permuta', 'Non incassi: scali dal prezzo di un nuovo', 'Di norma le boutique ufficiali non comprano l’usato dai privati'] },
            { cls: 'us', k: 'Negozio specializzato (come Orologi Famosi)', v: ['Un esperto che vede l’orologio dal vivo', 'Subito, al momento della vendita, con bonifico', 'Il negozio deve rivedere e rivendere: la proposta tiene conto di questo'] },
          ] },
          note: 'Le condizioni delle piattaforme cambiano: verifica commissioni e tempi sul loro sito prima di decidere.' },
        { id: 'piattaforme', nav: 'Chrono24 e piattaforme', h: 'Chrono24 e le piattaforme online',
          p: ['Sono il posto dove si incontrano più compratori, e per questo i prezzi esposti sembrano alti. Ma quelli sono prezzi richiesti, spesso da commercianti, non prezzi incassati da un privato.',
            'Da privato devi fotografare bene l’orologio, scrivere una scheda corretta, rispondere alle domande, spedire con un’assicurazione adeguata e aspettare. Paghi una commissione sul venduto. Se l’orologio torna indietro perché il compratore contesta qualcosa, il tempo si allunga ancora.',
            'Ha senso se conosci bene il tuo orologio, hai pazienza e non hai fretta di incassare.'] },
        { id: 'privati', nav: 'Annunci tra privati', h: 'Vendere a un privato con un annuncio',
          p: ['È la strada che sulla carta lascia più margine, perché non c’è nessuno in mezzo. In pratica è quella che ci preoccupa di più: chi chiede di vedere un orologio da migliaia di euro sa che hai in mano qualcosa di prezioso, e tu non sai chi è.',
            'Le truffe più comuni sono le ricevute di bonifico false, gli assegni circolari contraffatti e le persone che vogliono provarlo al polso “solo un attimo”. Se scegli questa strada, incontrati in banca e consegna solo a soldi accreditati. Ne parliamo meglio nella guida su come vendere senza rischi.'] },
        { id: 'compro-oro', nav: 'Compro oro e boutique', h: 'Compro oro e boutique: perché di solito non convengono',
          p: ['Molti compro oro guardano soprattutto il metallo. Per un orologio in oro può sembrare un buon prezzo, ma un Rolex, un Patek Philippe o un Cartier valgono molto più del loro peso, per marchio, modello, storia e richiesta.',
            'Le boutique ufficiali di norma non comprano orologi usati dai privati. Alcuni rivenditori accettano una permuta, ma solo se compri un nuovo orologio da loro: non incassi niente e il valore dell’usato lo decidono loro.'] },
        { id: 'negozio', nav: 'Il negozio specializzato', h: 'Il negozio specializzato: come lavoriamo noi',
          p: ['Un negozio che compra orologi ogni giorno ti dà due cose che le altre strade non danno: qualcuno che sa riconoscere quello che hai in mano, e un pagamento immediato senza rischi.',
            'Da Orologi Famosi si comincia da casa: ci mandi qualche foto e i dati con la scheda o su WhatsApp, facciamo un primo esame a distanza e ti rispondiamo. Se l’orologio ci interessa ti diamo appuntamento nel negozio di Medicina (BO) o nella sede riservata di Bologna. Lì Salvatore lo vede dal vivo e ti fa la proposta. Se accetti, ti paghiamo subito con bonifico sul conto che scegli. Se non accetti, te ne vai con il tuo orologio e senza aver speso nulla.',
            'Siamo onesti su un punto: la nostra proposta non sarà mai il prezzo che vedi esposto in vetrina o negli annunci dei commercianti, perché quell’orologio dobbiamo controllarlo, a volte revisionarlo, garantirlo e rivenderlo. In cambio non devi cercare un compratore, non aspetti e non corri rischi.'],
          list: [
            { b: 'Valutazione', t: 'Gratuita e senza impegno, fatta di persona da Salvatore.' },
            { b: 'Primo esame', t: 'A distanza, su foto e dati, da tutta Italia.' },
            { b: 'Proposta', t: 'Solo dopo aver visto l’orologio dal vivo, a Medicina (BO) o a Bologna.' },
            { b: 'Pagamento', t: 'Immediato, con bonifico tracciabile sul tuo conto.' },
            { b: 'Se sei lontano', t: 'Il ritiro lo organizziamo noi con un corriere specializzato nel trasporto di valori, gratis per te.' },
          ] },
        { id: 'scegliere', nav: 'Come scegliere', h: 'Come scegliere in base alla tua situazione',
          list: [
            { b: 'Hai fretta di incassare', t: 'Negozio specializzato: proposta e pagamento nello stesso incontro.' },
            { b: 'Non sai bene cosa hai', t: 'Prima fallo vedere a un esperto. Anche se poi decidi di venderlo altrove, saprai quanto vale.' },
            { b: 'Vuoi il massimo e hai tempo', t: 'Piattaforma online, mettendo in conto commissioni, spedizione e attesa.' },
            { b: 'Non vuoi incontrare sconosciuti', t: 'Evita gli annunci tra privati.' },
            { b: 'È un orologio ereditato o di famiglia', t: 'Una valutazione di persona evita di svenderlo o di sopravvalutarlo.' },
          ] },
      ],
      faqs: [
        { q: 'Conviene vendere un orologio su Chrono24 o a un negozio?', a: 'Dipende da cosa conta di più per te. Su Chrono24 puoi chiedere di più, ma paghi una commissione, gestisci foto, spedizione e trattative e aspetti un compratore. In un negozio specializzato come il nostro la proposta tiene conto della rivendita, ma incassi subito con bonifico e senza rischi. Molti fanno valutare l’orologio da noi prima di decidere: la valutazione è gratuita.' },
        { q: 'Dove vendere un Rolex usato in Emilia-Romagna?', a: 'Puoi proporlo a Orologi Famosi, con il negozio a Medicina (BO) e una sede riservata a Bologna. Si comincia online con le foto; la verifica e la proposta si fanno dal vivo. Da più lontano, il ritiro con corriere specializzato è gratuito.' },
        { q: 'I compro oro pagano bene gli orologi?', a: 'Per un orologio di marca di solito no, perché molti guardano soprattutto il metallo. Un Rolex, un Omega o un Cartier valgono per modello, condizioni e richiesta di mercato, non per il peso. Prima di venderlo a peso, fallo valutare da chi tratta orologi.' },
        { q: 'Le boutique Rolex comprano orologi usati?', a: 'Di norma le boutique ufficiali non comprano orologi usati dai privati. Alcuni rivenditori accettano una permuta sull’acquisto di un nuovo, ma non ti pagano: scalano il valore dal prezzo. Per vendere e incassare serve un negozio che compra usato.' },
        { q: 'Quanto ci vuole per vendere un orologio a un negozio?', a: 'Da noi il primo esame si fa a distanza appena ci mandi foto e dati. Se l’orologio ci interessa fissiamo un appuntamento a Medicina (BO) o a Bologna: la proposta arriva in quell’incontro e, se accetti, ti paghiamo subito.' },
        { q: 'È sicuro vendere un orologio a un privato?', a: 'Si può fare, ma con molte precauzioni: incontro in banca, consegna solo a pagamento accreditato, mai fidarsi di una ricevuta di bonifico mostrata sul telefono. Le truffe sugli orologi sono frequenti proprio perché il valore è alto e l’oggetto è piccolo.' },
      ],
      related: [card.valore, card.sicuro, card.corredo, card.regione],
      ctaH: 'Prima di decidere, fallo vedere a noi',
      ctaP: 'La valutazione è gratuita e non ti obbliga a niente. Mandaci qualche foto: ti rispondiamo noi, poi decidi tu dove venderlo.',
    },
  },
  {
    slug: 'valore', route: R.valore, link: 'GuidaValore', hero: IMG.banco,
    title: 'Quanto vale il mio orologio usato? Da cosa dipende il prezzo | Orologi Famosi',
    description: 'Referenza, condizioni, corredo, revisioni, mercato: cosa decide il valore di un orologio usato e perché le quotazioni online non bastano. Valutazione gratuita a Medicina (BO) e Bologna.',
    crumb: 'Quanto vale il mio orologio', about: ['valutazione orologi usati', 'quotazioni orologi', 'prezzo orologio usato'],
    data: {
      kicker: 'Guida', kickerSub: 'quanto vale un orologio usato',
      h1: 'Quanto vale il mio orologio usato?',
      lead: 'È la prima domanda che ci fanno tutti. La risposta onesta è: dipende da cose che si vedono solo guardandolo. Ecco quali, così sai cosa aspettarti.',
      brief: 'Il valore di un orologio usato dipende soprattutto da referenza e anno, condizioni di cassa, quadrante e movimento, originalità dei pezzi, corredo e richiesta del mercato per quel modello. Due orologi con lo stesso nome possono valere in modo molto diverso: per questo la cifra seria arriva solo dopo averlo visto dal vivo.',
      points: ['Le quotazioni online sono prezzi richiesti, non prezzi incassati.', 'Scatola e garanzia aiutano, ma non sono indispensabili.', 'Non far lucidare né revisionare l’orologio prima della valutazione.'],
      sections: [
        { id: 'fattori', nav: 'Cosa decide il valore', h: 'Cosa decide il valore',
          list: [
            { b: 'Referenza e anno', t: 'Lo stesso modello cambia di generazione in generazione: materiali, calibro, dettagli del quadrante. La referenza è il punto di partenza di ogni valutazione.' },
            { b: 'Condizioni della cassa', t: 'Graffi e segni d’uso si mettono in conto. Conta di più quanto la cassa è stata lucidata: una lucidatura pesante cambia le linee e toglie valore.' },
            { b: 'Quadrante e lancette', t: 'Originali, coerenti con l’anno, senza restauri: sui vintage fanno gran parte della differenza.' },
            { b: 'Movimento e revisioni', t: 'Un orologio che funziona bene e una revisione documentata sono elementi a favore.' },
            { b: 'Originalità dei pezzi', t: 'Corona, vetro, lunetta, bracciale: pezzi sostituiti con ricambi non originali pesano.' },
            { b: 'Corredo', t: 'Scatola, garanzia, fatture, maglie del bracciale. Aiutano a ricostruire la storia dell’orologio.' },
            { b: 'Mercato', t: 'Alcuni modelli sono molto richiesti, altri meno. La domanda cambia nel tempo e la proposta tiene conto di quella di oggi.' },
          ] },
        { id: 'quotazioni', nav: 'Le quotazioni online', h: 'Perché le quotazioni online ingannano',
          p: ['Su internet trovi listini e annunci con cifre precise. Sono quasi sempre prezzi richiesti da commercianti, che includono revisione, garanzia e margine. Non sono quello che un privato incassa.',
            'Le stime automatiche, poi, non vedono l’orologio: non sanno se la cassa è stata lucidata, se il quadrante è originale, se il bracciale è allungato o se il movimento ha bisogno di una revisione. Per questo sul nostro sito non trovi un calcolatore: preferiamo dirti una cifra vera dopo averlo visto, piuttosto che una cifra bella che poi non regge.'] },
        { id: 'come', nav: 'Come lo valutiamo', h: 'Come lo valutiamo noi',
          p: ['Si comincia a distanza: ci mandi marca, modello, se la conosci la referenza, qualche foto e quello che hai del corredo. Salvatore fa un primo esame e ti risponde, anche solo per dirti se l’orologio ci interessa.',
            'La proposta arriva dopo la verifica dal vivo, nel negozio di Medicina (BO) o nella sede riservata di Bologna. Guardiamo cassa, quadrante, movimento e documenti davanti a te e ti spieghiamo da cosa dipende la cifra. Puoi accettare, pensarci o rinunciare.'] },
        { id: 'preparare', nav: 'Cosa preparare', h: 'Cosa preparare prima della valutazione',
          list: [
            { b: 'Foto', t: 'Quadrante dritto, cassa di lato, fondello, bracciale e chiusura, corredo. Nella guida sulle foto trovi come farle.' },
            { b: 'Documenti', t: 'Garanzia, fattura d’acquisto, ricevute delle revisioni, se li hai.' },
            { b: 'Pezzi', t: 'Maglie del bracciale tolte, cinturini originali, scatole.' },
            { b: 'Storia', t: 'Quando e dove è stato comprato, se è stato revisionato o riparato.' },
            { b: 'Cosa non fare', t: 'Non lucidarlo, non aprirlo, non farlo revisionare apposta: è meglio vederlo com’è.' },
          ] },
      ],
      faqs: [
        { q: 'Posso sapere quanto vale il mio orologio online?', a: 'Puoi avere un primo parere a distanza: ci mandi foto e dati e ti rispondiamo. La cifra vera arriva solo dopo averlo visto dal vivo, perché condizioni e originalità dei pezzi non si giudicano bene da una foto.' },
        { q: 'La valutazione di un orologio si paga?', a: 'Da noi no: la valutazione è gratuita e non ti obbliga a vendere, né a distanza né dal vivo.' },
        { q: 'Quanto perde di valore un orologio usato?', a: 'Dipende molto da marchio e modello. Alcuni orologi tengono bene il valore o lo aumentano, altri perdono parecchio appena usciti dal negozio. Contano anche condizioni e corredo. Non diamo percentuali generiche: guardiamo il tuo.' },
        { q: 'Un orologio con la scatola vale di più?', a: 'Di solito sì: scatola, garanzia e fatture aiutano a provare la storia dell’orologio e lo rendono più facile da rivendere. Ma si vende anche senza: lo diciamo nella valutazione.' },
        { q: 'Conviene revisionare l’orologio prima di venderlo?', a: 'In genere no. Una revisione costa e non sempre la ritrovi nel prezzo. Fallo vedere com’è: se serve una revisione lo mettiamo in conto noi.' },
        { q: 'Quanto vale un Rolex usato?', a: 'Dipende da referenza, anno, condizioni e corredo: due Submariner possono valere in modo molto diverso. Con le foto facciamo un primo confronto; la proposta definitiva arriva dopo averlo visto dal vivo.' },
      ],
      related: [card.foto, card.corredo, card.dove, card.marchi],
      ctaH: 'Vuoi sapere quanto vale il tuo?',
      ctaP: 'Mandaci qualche foto con la scheda o su WhatsApp. Facciamo un primo esame a distanza e ti rispondiamo noi, senza impegno.',
    },
  },
  {
    slug: 'corredo', route: R.corredo, link: 'GuidaCorredo', hero: IMG.tudor,
    title: 'Vendere un orologio senza scatola o garanzia: si può? | Orologi Famosi',
    description: 'Sì, un orologio si vende anche senza scatola, garanzia o fattura. Cosa cambia nella valutazione, quali documenti aiutano e come dimostrarne la provenienza.',
    crumb: 'Senza scatola o garanzia', about: ['orologio senza garanzia', 'orologio senza scatola', 'documenti orologio'],
    data: {
      kicker: 'Guida', kickerSub: 'orologi senza scatola o documenti',
      h1: 'Vendere un orologio senza scatola o garanzia',
      lead: 'Le scatole si perdono nei traslochi, le garanzie finiscono in un cassetto che nessuno ritrova. Succede spesso, e non impedisce di vendere.',
      brief: 'Sì, si può vendere un orologio senza scatola, garanzia o fattura: si valuta anche solo l’orologio. Il corredo mancante entra nella valutazione, ma non la esclude. Dillo subito nella richiesta e porta quello che hai: ricevute di revisione, vecchie fatture, foto di quando lo indossavi.',
      points: ['La garanzia aiuta a provare la storia, ma l’orologio si verifica dal vivo.', 'Ogni documento conta, anche una ricevuta di revisione.', 'Vale anche per i vintage, che spesso il corredo non l’hanno più.'],
      sections: [
        { id: 'cosa-cambia', nav: 'Cosa cambia', h: 'Cosa cambia senza corredo',
          p: ['Scatola e garanzia rendono l’orologio più facile da rivendere, perché chi lo compra dopo vuole sapere da dove viene. Per questo, a parità di tutto il resto, un orologio completo vale di più.',
            'Quanto pesa la differenza dipende dal modello. Su un orologio moderno molto richiesto il corredo conta parecchio; su un vintage di cinquant’anni fa è normale che non ci sia, e contano di più originalità e condizioni.'] },
        { id: 'aiuta', nav: 'Cosa aiuta', h: 'Cosa aiuta al posto della garanzia',
          list: [
            { b: 'Fattura o scontrino', t: 'Anche vecchi o intestati a un familiare.' },
            { b: 'Ricevute di revisione', t: 'Di un centro assistenza o di un orologiaio, con la data.' },
            { b: 'Estratti d’archivio', t: 'Alcuni marchi li rilasciano su richiesta: utili per i pezzi importanti.' },
            { b: 'Foto e ricordi', t: 'Anche una foto di famiglia con l’orologio al polso racconta qualcosa.' },
            { b: 'Pezzi originali', t: 'Maglie del bracciale, cinturini, scatola esterna anche rovinata.' },
          ] },
        { id: 'provenienza', nav: 'La provenienza', h: 'La provenienza e la verifica',
          p: ['Chi compra un orologio deve essere sicuro che sia autentico e di provenienza lecita. Noi lo verifichiamo dal vivo, guardando l’orologio e parlando con te, e al momento dell’acquisto ti chiediamo un documento d’identità, come fa ogni operatore serio.',
            'Se l’orologio è di famiglia o ereditato va benissimo: raccontacelo nella richiesta.'] },
      ],
      faqs: [
        { q: 'Posso vendere un Rolex senza garanzia?', a: 'Sì. Si valuta anche solo l’orologio: l’assenza della garanzia entra nella valutazione ma non la esclude. Se hai fatture o ricevute di revisione, fotografale.' },
        { q: 'Quanto vale di meno un orologio senza scatola?', a: 'Dipende dal modello: su un orologio moderno molto richiesto la differenza si sente di più, su un vintage meno. Non diamo percentuali generiche: lo vediamo sul tuo.' },
        { q: 'Ho perso la garanzia, posso chiederne un duplicato?', a: 'Di norma i marchi non rilasciano duplicati della garanzia originale. Alcuni offrono estratti d’archivio o certificati a pagamento. Per vendere non è necessario: si valuta anche senza.' },
        { q: 'Comprate orologi senza documenti?', a: 'Sì, valutiamo anche orologi senza documenti. Al momento della vendita ti chiediamo un documento d’identità, e la verifica dell’orologio si fa dal vivo.' },
        { q: 'Un orologio ereditato senza documenti si può vendere?', a: 'Sì, è un caso frequente. Raccontaci la sua storia nella richiesta e porta quello che hai trovato insieme all’orologio.' },
      ],
      related: [card.eredita, card.valore, card.foto, card.sicuro],
    },
  },
  {
    slug: 'eredita', route: R.eredita, link: 'GuidaEredita', hero: IMG.libro,
    title: 'Vendere un orologio ereditato: cosa sapere prima di decidere | Orologi Famosi',
    description: 'Hai ereditato un orologio e non sai cosa valga? Come capirlo, cosa fare tra più eredi, come venderlo senza svenderlo. Valutazione gratuita di persona a Medicina (BO) e Bologna.',
    crumb: 'Un orologio ereditato', about: ['orologio ereditato', 'eredità', 'valutazione orologio'],
    data: {
      kicker: 'Guida', kickerSub: 'orologi ereditati e di famiglia',
      h1: 'Vendere un orologio ereditato',
      lead: 'Spesso arriva in una scatola insieme ad altri ricordi, e nessuno in famiglia sa bene cosa sia. Prima di decidere qualsiasi cosa, vale la pena capirlo.',
      brief: 'Se hai ereditato un orologio, il primo passo è farlo vedere a un esperto: un orologio di famiglia può valere molto più o molto meno di quanto si pensa. La valutazione da noi è gratuita e non ti obbliga a vendere, quindi può servire anche solo per dividere l’eredità o decidere se tenerlo.',
      points: ['Non farlo lucidare né riparare prima di farlo vedere.', 'Porta tutto quello che c’era con l’orologio: scatole, carte, ricevute.', 'Se gli eredi sono più di uno, una cifra sentita da un esperto aiuta a mettersi d’accordo.'],
      sections: [
        { id: 'capire', nav: 'Capire cosa hai', h: 'Capire cosa hai in mano',
          p: ['Il nome sul quadrante dice molto ma non tutto. Un orologio degli anni Sessanta o Settanta può essere un pezzo cercato dai collezionisti, oppure un modello comune; la differenza la fanno referenza, originalità e condizioni.',
            'Mandaci qualche foto: quadrante, cassa, fondello, eventuali carte. Ti diciamo che orologio è e se vale la pena vederlo dal vivo. Molte persone arrivano da noi convinte di avere un orologio senza valore, e scoprono il contrario; capita anche l’opposto.'] },
        { id: 'eredi', nav: 'Più eredi', h: 'Se gli eredi sono più di uno',
          p: ['Una valutazione fatta da chi compra orologi ogni giorno dà a tutti una cifra di riferimento. Potete venire insieme all’appuntamento, a Medicina (BO) o a Bologna, oppure delegare uno di voi.',
            'Se decidete di vendere, il pagamento è immediato con bonifico tracciabile, sul conto che indicate. Per le questioni ereditarie, come la dichiarazione di successione, fate riferimento al vostro notaio o commercialista.'] },
        { id: 'non-fare', nav: 'Cosa non fare', h: 'Cosa non fare prima della valutazione',
          list: [
            { b: 'Lucidarlo', t: 'Una lucidatura toglie materiale e può ridurre il valore, soprattutto su un vintage.' },
            { b: 'Aprirlo', t: 'Meglio lasciare il fondello chiuso: lo apriamo noi se serve.' },
            { b: 'Venderlo a peso', t: 'Un orologio di marca quasi sempre vale più del suo metallo.' },
            { b: 'Fidarsi di una stima online', t: 'Senza vederlo nessuno può dirti quanto vale davvero.' },
          ] },
      ],
      faqs: [
        { q: 'Ho ereditato un orologio, come faccio a sapere quanto vale?', a: 'Mandaci qualche foto e i dati che leggi sul quadrante e sul fondello: facciamo un primo esame a distanza e ti diciamo che orologio è. La cifra vera arriva dopo averlo visto dal vivo, a Medicina (BO) o a Bologna. È gratuito e senza impegno.' },
        { q: 'Un orologio vecchio del nonno può valere molto?', a: 'Può succedere, soprattutto con alcuni modelli di Rolex, Omega, Heuer, Patek Philippe e altri marchi di quegli anni. Ma non è la regola: dipende da modello, originalità e condizioni. Conviene farlo vedere prima di decidere.' },
        { q: 'Posso vendere un orologio ereditato senza documenti?', a: 'Sì. È normale che un orologio di famiglia non abbia più scatola o garanzia. Raccontaci la sua storia e porta quello che hai trovato con lui.' },
        { q: 'Posso far valutare un orologio solo per sapere quanto vale?', a: 'Sì, la valutazione è gratuita e non ti obbliga a vendere. Può servire per dividere un’eredità, per un’assicurazione o semplicemente per sapere cosa tieni nel cassetto.' },
        { q: 'Siamo più eredi, possiamo venire insieme?', a: 'Certo. All’appuntamento possono venire tutti, oppure uno di voi con il consenso degli altri.' },
      ],
      related: [card.valore, card.corredo, card.fermo, card.salvatore],
    },
  },
  {
    slug: 'sicuro', route: R.sicuro, link: 'GuidaSicuro', hero: IMG.scrivania,
    title: 'Vendere un orologio di valore senza rischi: truffe e pagamenti | Orologi Famosi',
    description: 'Bonifici falsi, assegni contraffatti, appuntamenti con sconosciuti: le truffe più comuni nella vendita di orologi e come evitarle. Con noi pagamento immediato con bonifico tracciabile.',
    crumb: 'Vendere senza rischi', about: ['truffe orologi', 'vendita sicura', 'pagamento orologio'],
    data: {
      kicker: 'Guida', kickerSub: 'vendere in sicurezza',
      h1: 'Vendere un orologio di valore senza rischi',
      lead: 'Un orologio vale molto, sta in una tasca e si rivende in fretta. Per questo attira chi vuole approfittarne. Ecco cosa ci raccontano le persone che arrivano da noi dopo una brutta esperienza.',
      brief: 'Il rischio più grande nella vendita di un orologio è tra privati: ricevute di bonifico false, assegni contraffatti, incontri con sconosciuti. Consegna l’orologio solo quando i soldi sono sul tuo conto, incontrati in un luogo sicuro e diffida di chi ha fretta. Con un negozio che ha una sede, una storia e un pagamento tracciabile il problema non si pone.',
      points: ['Mai consegnare su una ricevuta mostrata al telefono.', 'Assegni circolari: si verificano in banca prima di consegnare.', 'Da noi paghiamo subito con bonifico, nel negozio o nella sede di Bologna.'],
      sections: [
        { id: 'truffe', nav: 'Le truffe più comuni', h: 'Le truffe più comuni',
          list: [
            { b: 'Bonifico falso', t: 'Ti mostrano una ricevuta sul telefono o te la mandano via email. Il bonifico non è mai partito, o viene annullato.' },
            { b: 'Assegno contraffatto', t: 'Gli assegni circolari falsi sono fatti bene. Si scopre giorni dopo, quando l’orologio è sparito.' },
            { b: 'Prova al polso', t: 'Chiedono di provarlo “un attimo”, poi scappano.' },
            { b: 'Pagamento in eccesso', t: 'Pagano più del dovuto e chiedono la differenza indietro. Il primo pagamento poi sparisce.' },
            { b: 'Finto corriere', t: 'Chiedono di spedire prima di pagare, o mandano un corriere a ritirare prima del pagamento.' },
          ] },
        { id: 'regole', nav: 'Le regole da seguire', h: 'Le regole da seguire se vendi da solo',
          list: [
            { b: 'Dove', t: 'In banca o in un luogo con telecamere, mai a casa tua.' },
            { b: 'Quando consegnare', t: 'Solo a soldi accreditati e verificati nella tua app della banca.' },
            { b: 'Con chi', t: 'Chiedi un documento d’identità e confrontalo con chi paga.' },
            { b: 'Fretta', t: 'Chi ha troppa fretta o paga troppo senza trattare va guardato con attenzione.' },
          ] },
        { id: 'noi', nav: 'Come facciamo noi', h: 'Come funziona il pagamento da noi',
          p: ['Da Orologi Famosi la vendita si conclude nel negozio di Medicina (BO) o nella sede riservata di Bologna, dopo che Salvatore ha visto l’orologio. Se accetti la proposta ti paghiamo subito, con bonifico sul conto che scegli: un pagamento tracciabile, con documenti in regola per entrambi.',
            'Se sei lontano e non puoi venire, organizziamo il ritiro con un corriere specializzato nel trasporto di valori, gratis per te.'] },
      ],
      faqs: [
        { q: 'Come vengo pagato se vendo un orologio a Orologi Famosi?', a: 'Subito, al momento della vendita, con bonifico sul conto che scegli. È un pagamento tracciabile.' },
        { q: 'Come evitare truffe vendendo un Rolex?', a: 'Se vendi a un privato, incontrati in banca, consegna solo a soldi accreditati e non fidarti di ricevute mostrate sul telefono o di assegni non verificati. Oppure vendi a un negozio con una sede e un pagamento tracciabile.' },
        { q: 'È sicuro spedire un orologio per la valutazione?', a: 'Con noi non serve spedirlo per la valutazione: il primo esame si fa sulle foto. Se poi sei lontano, il ritiro lo organizziamo noi con un corriere specializzato nel trasporto di valori, gratis per te.' },
        { q: 'Posso fidarmi di un compratore che paga con assegno circolare?', a: 'Solo dopo averlo verificato con la tua banca. Gli assegni circolari contraffatti esistono e sono difficili da riconoscere a occhio.' },
      ],
      related: [card.dove, card.valore, card.regione, card.salvatore],
    },
  },
  {
    slug: 'foto', route: R.foto, link: 'GuidaFoto', hero: IMG.mano,
    title: 'Come fotografare un orologio per una valutazione a distanza | Orologi Famosi',
    description: 'Quali foto servono per valutare un orologio a distanza e come farle con il telefono: quadrante, cassa, fondello, bracciale, corredo. Poi mandacele con la scheda o su WhatsApp.',
    crumb: 'Le foto per la valutazione', about: ['foto orologio', 'valutazione a distanza'],
    data: {
      kicker: 'Guida', kickerSub: 'le foto per la valutazione',
      h1: 'Le foto giuste per far valutare un orologio',
      lead: 'Basta il telefono e una finestra. Con sei foto fatte bene possiamo dirti già molto, prima ancora di vederci.',
      brief: 'Per una valutazione a distanza servono sei foto: quadrante dritto, cassa di lato con la corona, fondello, bracciale con la chiusura, eventuali segni o difetti, e il corredo che hai. Luce naturale, niente flash, orologio pulito con un panno morbido ma non lucidato.',
      points: ['Luce di una finestra, mai il flash diretto.', 'Inquadra dritto, a fuoco, senza zoom digitale.', 'Fotografa i difetti: ci aiutano a darti una risposta onesta.'],
      sections: [
        { id: 'scatti', nav: 'Le sei foto', h: 'Le sei foto che servono',
          list: [
            { b: '1. Quadrante', t: 'Dritto, dall’alto, con le lancette ferme e leggibili.' },
            { b: '2. Cassa di lato', t: 'Il lato con la corona: si vede quanto è stata lucidata.' },
            { b: '3. Fondello', t: 'Con le incisioni leggibili; se è trasparente, il movimento.' },
            { b: '4. Bracciale e chiusura', t: 'Con il logo della chiusura e le maglie.' },
            { b: '5. Difetti', t: 'Graffi, ammaccature, vetro scheggiato: meglio saperlo subito.' },
            { b: '6. Corredo', t: 'Scatola, garanzia, fatture, maglie tolte, cinturini.' },
          ] },
        { id: 'come', nav: 'Come farle', h: 'Come farle bene con il telefono',
          p: ['Mettiti vicino a una finestra, di giorno, e appoggia l’orologio su un panno scuro e opaco. Spegni il flash: crea riflessi sul vetro che nascondono il quadrante. Avvicinati fisicamente invece di usare lo zoom, e tocca lo schermo sul quadrante per mettere a fuoco.',
            'Se non trovi la referenza, non togliere il bracciale per cercarla: la riconosciamo noi dalle foto.'] },
        { id: 'invio', nav: 'Come mandarle', h: 'Come mandarcele',
          p: ['Puoi caricarle nella scheda di richiesta, che ti guida passo per passo, oppure mandarle su WhatsApp al 379 154 9804. Salvatore le guarda e ti risponde nel canale che preferisci.'] },
      ],
      faqs: [
        { q: 'Si può valutare un orologio da una foto?', a: 'Si può fare un primo esame: capire che orologio è, se ci interessa e cosa guardare. La proposta definitiva arriva dopo averlo visto dal vivo, perché condizioni e originalità si giudicano bene solo in mano.' },
        { q: 'Quante foto servono per valutare un orologio?', a: 'Ne bastano sei: quadrante, cassa di lato, fondello, bracciale con la chiusura, difetti e corredo.' },
        { q: 'Posso mandare le foto su WhatsApp?', a: 'Sì, al 379 154 9804. Oppure caricale nella scheda online.' },
        { q: 'Devo pulire l’orologio prima delle foto?', a: 'Basta un panno morbido asciutto. Non lucidarlo e non usare prodotti: a volte la lucidatura toglie più di quanto aggiunga.' },
      ],
      related: [card.valore, card.corredo, card.dove, card.marchi],
      ctaH: 'Hai fatto le foto?',
      ctaP: 'Caricale nella scheda o mandale su WhatsApp. Le guarda Salvatore e ti rispondiamo noi.',
    },
  },
  {
    slug: 'vintage', route: R.vintage, link: 'GuidaVintage', hero: IMG.movimento,
    title: 'Vendere un orologio vintage: cosa conta davvero | Orologi Famosi',
    description: 'Rolex, Omega, Heuer, Longines, Universal e altri orologi d’epoca: cosa decide il valore di un vintage, cosa non fare prima di venderlo e come lo valutiamo dal vivo.',
    crumb: 'Orologi vintage', about: ['orologi vintage', 'orologi d’epoca', 'valutazione vintage'],
    data: {
      kicker: 'Guida', kickerSub: 'orologi vintage e d’epoca',
      h1: 'Vendere un orologio vintage',
      lead: 'Su un orologio di cinquant’anni fa due esemplari dello stesso modello possono valere cifre lontanissime. Quasi sempre la differenza sta nei dettagli che il tempo e le riparazioni hanno cambiato.',
      brief: 'Un orologio vintage vale soprattutto per l’originalità: quadrante, lancette, lunetta, corona e bracciale coerenti con l’anno, cassa non rovinata da lucidature. Il corredo spesso manca, ed è normale. Non farlo restaurare né lucidare prima della valutazione: lo guardiamo com’è, di persona.',
      points: ['Un quadrante originale con la patina vale più di uno rifatto.', 'Una lucidatura pesante cambia le linee della cassa e toglie valore.', 'I ricambi recenti montati in revisione vanno segnalati: non sono un problema da nascondere.'],
      sections: [
        { id: 'originalita', nav: 'L’originalità', h: 'L’originalità prima di tutto',
          p: ['I collezionisti cercano orologi rimasti il più possibile come sono usciti dalla fabbrica. Negli anni, però, molti vintage sono passati da revisioni in cui si sostituivano quadranti, lancette, vetri e corone con pezzi nuovi, che allora sembravano un miglioramento.',
            'Per questo la valutazione di un vintage parte da una domanda semplice: quali pezzi sono quelli di allora? Lo si capisce guardando l’orologio da vicino, il fondello aperto e, se ci sono, le ricevute delle revisioni.'] },
        { id: 'cosa-conta', nav: 'Cosa guardiamo', h: 'Cosa guardiamo in un vintage',
          list: [
            { b: 'Quadrante', t: 'Originale o rifatto, stato della patina, luminescenza coerente con le lancette.' },
            { b: 'Cassa', t: 'Spigoli e smussi: si vede subito se è stata lucidata molte volte.' },
            { b: 'Lunetta e vetro', t: 'Inserti e vetri d’epoca o di ricambio.' },
            { b: 'Movimento', t: 'Calibro corretto per la referenza, condizioni, revisioni.' },
            { b: 'Bracciale', t: 'Originale, con le maglie e la chiusura dell’epoca, oppure sostituito.' },
            { b: 'Storia', t: 'Primo proprietario, ricevute, foto di famiglia: tutto aiuta.' },
          ] },
        { id: 'marchi', nav: 'I marchi', h: 'I vintage che vediamo più spesso',
          p: ['Rolex (Submariner, GMT-Master, Datejust, Day-Date, Oyster Perpetual), Omega (Speedmaster, Seamaster, Constellation), Heuer (Carrera, Autavia, Monaco), Tudor (Submariner, Oyster Prince), Longines, Universal Genève, Zenith, Eberhard, Jaeger-LeCoultre, Seiko e gli orologi in oro degli anni Cinquanta e Sessanta.',
            'Se il tuo vintage è di un altro marchio, proponilo lo stesso: lo guarda Salvatore.'] },
      ],
      faqs: [
        { q: 'Comprate orologi vintage?', a: 'Sì, valutiamo e acquistiamo anche orologi vintage. Si comincia con le foto; originalità e condizioni si verificano dal vivo, a Medicina (BO) o a Bologna.' },
        { q: 'Un orologio vintage restaurato vale meno?', a: 'Spesso sì, se il restauro ha sostituito quadrante, lancette o altri pezzi originali, o se la cassa è stata lucidata molto. Una revisione del movimento fatta bene, invece, non è un problema.' },
        { q: 'Devo far revisionare il vintage prima di venderlo?', a: 'No. Faccelo vedere com’è: una revisione fatta in fretta o con ricambi non adatti può togliere valore.' },
      ],
      related: [card.eredita, card.valore, card.fermo, card.marchi],
    },
  },
  {
    slug: 'fermo', route: R.fermo, link: 'GuidaFermo', hero: IMG.movimento,
    title: 'Vendere un orologio fermo, rotto o da revisionare | Orologi Famosi',
    description: 'Un orologio fermo o con un difetto si può vendere? Sì: cosa controllare prima, perché non conviene ripararlo apposta e come lo valutiamo a Medicina (BO) e Bologna.',
    crumb: 'Orologio fermo o da revisionare', about: ['orologio fermo', 'orologio rotto', 'revisione orologio'],
    data: {
      kicker: 'Guida', kickerSub: 'orologi fermi o da revisionare',
      h1: 'Vendere un orologio fermo o da revisionare',
      lead: 'Un orologio rimasto anni in un cassetto spesso è solo scarico. Altre volte ha bisogno di una revisione. In entrambi i casi si può proporre.',
      brief: 'Sì, puoi proporci anche un orologio fermo, che va avanti o indietro o ha un difetto: indicalo nella richiesta. Non conviene ripararlo prima di venderlo, perché la revisione costa e non sempre si ritrova nel prezzo. Lo valutiamo com’è e mettiamo in conto noi quello che serve.',
      points: ['Un automatico fermo spesso va solo caricato.', 'Un orologio al quarzo fermo di solito ha la pila scarica.', 'Non aprirlo e non farlo riparare prima di farlo vedere.'],
      sections: [
        { id: 'controlli', nav: 'Prima di tutto', h: 'Prima di tutto, due controlli',
          list: [
            { b: 'Automatico', t: 'Gira la corona in senso orario una ventina di volte, oppure muovilo al polso per qualche minuto. Se riparte, era solo scarico.' },
            { b: 'Carica manuale', t: 'Gira la corona finché senti resistenza, senza forzare.' },
            { b: 'Quarzo', t: 'Se è fermo, quasi sempre è la pila. Non serve cambiarla per la valutazione.' },
          ] },
        { id: 'perche', nav: 'Perché non ripararlo', h: 'Perché non conviene ripararlo prima',
          p: ['Una revisione completa su un orologio di fascia alta può costare parecchio, e chi compra mette comunque in conto i controlli che deve fare. Spesso spenderesti più di quanto ritroveresti nel prezzo.',
            'In più, un intervento fatto in fretta o con ricambi non originali può togliere valore. Meglio farcelo vedere com’è: ti diciamo noi cosa serve e ne teniamo conto nella proposta.'] },
      ],
      faqs: [
        { q: 'Comprate orologi che non funzionano?', a: 'Puoi proporci anche un orologio fermo o con un difetto: indicalo nella richiesta. Lo valutiamo com’è, mettendo in conto quello che serve per rimetterlo a posto.' },
        { q: 'Devo far revisionare l’orologio prima di venderlo?', a: 'In genere no. La revisione costa e non sempre si ritrova nel prezzo. Faccelo vedere com’è.' },
        { q: 'Il mio orologio automatico si è fermato, è rotto?', a: 'Non necessariamente: se non lo indossi da giorni si scarica. Caricalo girando la corona o muovendolo al polso. Se non riparte o si ferma subito, può avere bisogno di una revisione.' },
        { q: 'Un orologio con il vetro rotto si può vendere?', a: 'Sì, fotografa bene il danno e indicalo nella richiesta. Non far cambiare il vetro prima di farlo vedere.' },
      ],
      related: [card.valore, card.eredita, card.foto, card.dove],
    },
  },
];

// ------------------------------------------------------------------ marchi

const brands = [
  { brand: 'Tudor', slug: 'tudor', hero: IMG.tudor,
    title: 'Vendere un Tudor usato: Black Bay, Pelagos, vintage | Orologi Famosi',
    description: 'Compriamo Tudor usati da privati: Black Bay 58, Black Bay GMT e Chrono, Pelagos, Royal, Tudor Submariner vintage. Valutazione gratuita a Medicina (BO) e Bologna, pagamento immediato.',
    lead: 'Da quando Tudor ha ritrovato la sua strada con il Black Bay, è uno dei marchi che ci propongono più spesso. E i Tudor vintage, figli diretti di Rolex, sono un capitolo a parte.',
    brief: 'Valutiamo e acquistiamo Tudor usati da privati: Black Bay in tutte le versioni, Pelagos, Royal, Ranger e i Tudor Submariner e Oyster Prince vintage. Contano referenza, condizioni di cassa e bracciale, corredo con la garanzia e, sui vintage, l’originalità dei pezzi.',
    collections: [
      { b: 'Black Bay', t: '58, 54, 41, GMT, Chrono, Pro, Fifty-Eight 925 e Bronze. È la famiglia più richiesta.' },
      { b: 'Pelagos', t: 'Pelagos 42, 39 e FXD, in titanio: contano bracciale e cinturini originali.' },
      { b: 'Royal e 1926', t: 'Gli orologi più classici della casa, anche con quadranti gioiello.' },
      { b: 'Ranger e Heritage', t: 'Orologi da campo e riedizioni di modelli storici.' },
      { b: 'Vintage', t: 'Tudor Submariner (7922, 7928, 79090 e altri), Oyster Prince, Monte Carlo, Prince Date: spesso con cassa e corona Rolex.' },
    ],
    matters: ['Referenza e anno: la stessa linea Black Bay ha avuto molte versioni.', 'Garanzia con la data di vendita: sui moderni aiuta molto.', 'Bracciale con tutte le maglie, o il cinturino originale.', 'Sui vintage: originalità di quadrante, lancette e lunetta, e coerenza dei pezzi Rolex.'],
    faqs: [
      { q: 'Comprate Tudor usati?', a: 'Sì, valutiamo e acquistiamo Tudor usati da privati, moderni e vintage. Si comincia con foto e dati, la proposta arriva dopo averlo visto dal vivo a Medicina (BO) o a Bologna.' },
      { q: 'Quanto vale un Tudor Black Bay usato?', a: 'Dipende da versione e referenza, condizioni, bracciale o cinturino e corredo. Un Black Bay 58 completo e ben tenuto è diverso da uno senza garanzia o con la cassa molto segnata. Con le foto facciamo un primo esame; la cifra arriva dopo averlo visto.' },
      { q: 'Un Tudor Submariner vintage vale molto?', a: 'Alcune referenze sono molto cercate dai collezionisti, ma il valore dipende da originalità e condizioni: quadrante, lancette, lunetta e pezzi Rolex coerenti. Va visto dal vivo.' },
      { q: 'Posso vendere un Tudor senza garanzia?', a: 'Sì, si valuta anche senza. Dillo nella richiesta e porta quello che hai, come fatture o ricevute di revisione.' },
    ] },
  { brand: 'Patek Philippe', slug: 'patek-philippe', hero: IMG.scrivania,
    title: 'Vendere un Patek Philippe usato: Nautilus, Calatrava | Orologi Famosi',
    description: 'Valutiamo Patek Philippe usati da privati: Nautilus, Aquanaut, Calatrava, complicazioni. Valutazione riservata e gratuita di Salvatore Agresta a Medicina (BO) e Bologna, pagamento con bonifico.',
    lead: 'Un Patek Philippe raramente si vende a cuor leggero. Spesso è un regalo importante o un orologio passato di generazione in generazione. Merita una valutazione fatta con calma, di persona.',
    brief: 'Valutiamo Patek Philippe usati da privati: Nautilus, Aquanaut, Calatrava, Gondolo, Twenty~4 e le complicazioni. Per un orologio di questo livello contano referenza, condizioni, originalità, documenti e storia di assistenza. La valutazione è riservata, gratuita e si conclude dal vivo, nella sede riservata di Bologna o nel negozio di Medicina (BO).',
    collections: [
      { b: 'Nautilus', t: 'Le referenze in acciaio e in oro, solo tempo e con complicazioni.' },
      { b: 'Aquanaut', t: 'Con il cinturino “tropical” e il quadrante a scacchiera.' },
      { b: 'Calatrava', t: 'Il classico della casa, dai modelli vintage a quelli di oggi.' },
      { b: 'Complicazioni', t: 'Calendario annuale, ora universale, cronografi, calendario perpetuo.' },
      { b: 'Gondolo, Golden Ellipse, Twenty~4', t: 'Le forme e gli orologi da donna.' },
    ],
    matters: ['Referenza esatta e anno.', 'Certificato d’origine o estratto d’archivio, se c’è.', 'Revisioni fatte presso Patek Philippe, con le ricevute.', 'Condizioni della cassa: su un Nautilus le superfici satinate e lucide contano molto.'],
    faqs: [
      { q: 'Comprate Patek Philippe usati?', a: 'Sì, puoi proporci un Patek Philippe: lo valutiamo di persona, con riservatezza, nella sede di Bologna o nel negozio di Medicina (BO). Si comincia con qualche foto e i dati.' },
      { q: 'Dove vendere un Patek Philippe a Bologna?', a: 'Da Orologi Famosi, con una sede riservata a Bologna su appuntamento e il negozio di Medicina (BO). Il primo esame si fa a distanza, la proposta dopo aver visto l’orologio.' },
      { q: 'Quanto vale un Patek Philippe Nautilus usato?', a: 'Dipende da referenza, materiale, condizioni, documenti e mercato del momento. Su un Nautilus anche lo stato del bracciale e delle superfici della cassa pesa molto. Va visto dal vivo per una cifra seria.' },
      { q: 'Posso vendere un Patek senza certificato?', a: 'Sì, si valuta anche senza. Patek Philippe rilascia estratti d’archivio su richiesta, utili per i pezzi più importanti: ne parliamo insieme se serve.' },
    ] },
  { brand: 'Audemars Piguet', slug: 'audemars-piguet', hero: IMG.tavolo,
    title: 'Vendere un Audemars Piguet usato: Royal Oak | Orologi Famosi',
    description: 'Valutiamo Audemars Piguet usati da privati: Royal Oak, Royal Oak Offshore, Code 11.59, vintage. Valutazione riservata e gratuita a Medicina (BO) e Bologna, pagamento immediato con bonifico.',
    lead: 'Il Royal Oak ha cambiato l’orologeria di lusso e continua a essere uno degli orologi più cercati. Proprio per questo, venderlo bene richiede un occhio esperto.',
    brief: 'Valutiamo Audemars Piguet usati da privati: Royal Oak, Royal Oak Offshore, Royal Oak Concept, Code 11.59 e i modelli vintage. Su questi orologi conta moltissimo lo stato delle superfici di cassa e bracciale integrato, oltre a referenza, documenti e revisioni.',
    collections: [
      { b: 'Royal Oak', t: 'Solo tempo, Jumbo extra-piatto, cronografo, Selfwinding, anche in oro e da donna.' },
      { b: 'Royal Oak Offshore', t: 'I cronografi sportivi, in acciaio, ceramica, carbonio e oro.' },
      { b: 'Code 11.59', t: 'La collezione più recente della casa.' },
      { b: 'Vintage e altri', t: 'Millenary, Jules Audemars, orologi classici e da tasca.' },
    ],
    matters: ['Satinature e smussi di cassa e bracciale: una lucidatura sbagliata li rovina.', 'Bracciale integrato con tutte le maglie.', 'Garanzia, certificato o estratto d’archivio.', 'Revisioni presso la casa.'],
    faqs: [
      { q: 'Comprate Audemars Piguet Royal Oak usati?', a: 'Sì, puoi proporci un Royal Oak o un altro Audemars Piguet: lo valutiamo di persona, con riservatezza, a Bologna o a Medicina (BO). Si comincia con foto e dati.' },
      { q: 'Quanto vale un Royal Oak usato?', a: 'Dipende da referenza, materiale, condizioni di cassa e bracciale, corredo e mercato. Su un Royal Oak la qualità delle superfici satinate e lucide pesa molto. La proposta arriva dopo averlo visto.' },
      { q: 'Un Royal Oak lucidato vale meno?', a: 'Spesso sì, se la lucidatura ha arrotondato gli spigoli o cancellato la satinatura. Non farlo lucidare prima della valutazione.' },
    ] },
  { brand: 'Panerai', slug: 'panerai', hero: IMG.banco,
    title: 'Vendere un Panerai usato: Luminor, Radiomir | Orologi Famosi',
    description: 'Compriamo Panerai usati da privati: Luminor, Luminor Marina, Luminor Due, Radiomir, Submersible. Valutazione gratuita a Medicina (BO) e Bologna, pagamento immediato con bonifico.',
    lead: 'Nati per i sommozzatori della Marina italiana, i Panerai hanno appassionati fedelissimi. Ogni referenza ha il suo numero PAM, e da lì si parte.',
    brief: 'Puoi proporci il tuo Panerai: valutiamo Panerai usati da privati, Luminor, Luminor Marina, Luminor Due, Luminor GMT, Radiomir e Submersible. Contano il numero PAM, la serie, le condizioni della cassa e del ponte proteggi-corona, i cinturini originali e il corredo.',
    collections: [
      { b: 'Luminor e Luminor Marina', t: 'Con il ponte proteggi-corona, la linea più diffusa.' },
      { b: 'Luminor Due', t: 'La versione più sottile.' },
      { b: 'Radiomir', t: 'La cassa a cuscino con le anse a filo.' },
      { b: 'Submersible', t: 'I subacquei con la lunetta girevole, anche in bronzo e materiali tecnici.' },
    ],
    matters: ['Numero PAM e lettera della serie.', 'Cinturini originali e fibbia.', 'Garanzia e scatola, spesso con accessori.', 'Condizioni di cassa e quadrante.'],
    faqs: [
      { q: 'Comprate Panerai usati?', a: 'Puoi proporcelo: valutiamo Panerai usati da privati, di persona. Mandaci foto e numero PAM se lo conosci; la proposta arriva dopo averlo visto dal vivo.' },
      { q: 'Dove trovo il numero PAM del mio Panerai?', a: 'Sulla garanzia e di solito sul fondello. Se non lo trovi, lo riconosciamo noi dalle foto.' },
      { q: 'Quanto vale un Panerai Luminor usato?', a: 'Dipende da referenza, serie, condizioni e corredo. Con le foto facciamo un primo esame, la cifra dopo averlo visto.' },
    ] },
  { brand: 'IWC', slug: 'iwc', hero: IMG.banco,
    title: 'Vendere un IWC usato: Portoghese, Pilot | Orologi Famosi',
    description: 'Compriamo IWC usati da privati: Portoghese, Pilot’s Watch, Big Pilot, Portofino, Ingenieur, Aquatimer. Valutazione gratuita a Medicina (BO) e Bologna, pagamento immediato con bonifico.',
    lead: 'IWC è la casa di Sciaffusa che piace a chi ama la tecnica senza ostentazione. Portoghese e Pilot sono gli IWC che ci propongono più spesso.',
    brief: 'Valutiamo e acquistiamo IWC usati da privati: Portoghese (cronografo, 7 giorni, calendario annuale), Pilot’s Watch e Big Pilot, Portofino, Ingenieur, Aquatimer e Da Vinci. Contano referenza, calibro, condizioni, corredo e revisioni.',
    collections: [
      { b: 'Portoghese', t: 'Cronografo, Automatic 7 giorni, Calendario annuale.' },
      { b: 'Pilot’s Watch', t: 'Mark XVIII e successivi, Spitfire, Top Gun, Big Pilot.' },
      { b: 'Portofino e Da Vinci', t: 'Gli IWC più eleganti.' },
      { b: 'Ingenieur e Aquatimer', t: 'Sportivi, dal design di Genta ai subacquei.' },
    ],
    matters: ['Referenza e calibro (manifattura o base).', 'Cinturino o bracciale originali.', 'Garanzia e revisioni.', 'Condizioni di cassa e vetro.'],
    faqs: [
      { q: 'Comprate IWC usati?', a: 'Sì, valutiamo e acquistiamo IWC usati da privati. Si comincia con foto e dati, la proposta dopo averlo visto dal vivo a Medicina (BO) o a Bologna.' },
      { q: 'Quanto vale un IWC Portoghese usato?', a: 'Dipende da versione, referenza, condizioni e corredo. Il primo esame lo facciamo sulle foto, la cifra dopo averlo visto.' },
    ] },
  { brand: 'Jaeger-LeCoultre', slug: 'jaeger-lecoultre', hero: IMG.banco,
    title: 'Vendere un Jaeger-LeCoultre usato: Reverso, Master | Orologi Famosi',
    description: 'Compriamo Jaeger-LeCoultre usati da privati: Reverso, Master Control, Master Ultra Thin, Polaris, Memovox vintage. Valutazione gratuita a Medicina (BO) e Bologna, pagamento immediato.',
    lead: 'La “manifattura delle manifatture” ha prodotto movimenti per mezzo mondo dell’orologeria. Il Reverso, nato per i giocatori di polo, è il suo orologio più famoso.',
    brief: 'Valutiamo e acquistiamo Jaeger-LeCoultre usati da privati: Reverso in tutte le versioni, Master Control e Master Ultra Thin, Polaris, Rendez-Vous e i vintage come Memovox e Futurematic. Contano referenza, calibro, condizioni e corredo.',
    collections: [
      { b: 'Reverso', t: 'Classic, Tribute, Duoface, da uomo e da donna.' },
      { b: 'Master', t: 'Master Control, Master Ultra Thin, cronografi e calendari.' },
      { b: 'Polaris', t: 'Lo sportivo della casa, anche Memovox.' },
      { b: 'Rendez-Vous e vintage', t: 'Gli orologi da donna e i classici degli anni Cinquanta e Sessanta.' },
    ],
    matters: ['Referenza e calibro.', 'Condizioni della cassa reversibile, sul Reverso.', 'Garanzia e revisioni.', 'Cinturini originali e fibbia.'],
    faqs: [
      { q: 'Comprate Jaeger-LeCoultre Reverso usati?', a: 'Sì, valutiamo e acquistiamo Reverso e altri Jaeger-LeCoultre usati da privati. Mandaci foto e dati; la proposta arriva dopo averlo visto.' },
      { q: 'Un Memovox vintage si può vendere?', a: 'Sì, i Jaeger-LeCoultre vintage si valutano: contano originalità del quadrante e funzionamento della sveglia. Va visto dal vivo.' },
    ] },
  { brand: 'Breitling', slug: 'breitling', hero: IMG.banco,
    title: 'Vendere un Breitling usato: Navitimer, Chronomat | Orologi Famosi',
    description: 'Compriamo Breitling usati da privati: Navitimer, Chronomat, Superocean, Avenger, Premier, Emergency, vintage. Valutazione gratuita a Medicina (BO) e Bologna, pagamento immediato con bonifico.',
    lead: 'Il Navitimer con il regolo calcolatore è uno dei cronografi più riconoscibili mai fatti. Breitling ne ha fatti molti altri, dai Chronomat agli Emergency.',
    brief: 'Valutiamo e acquistiamo Breitling usati da privati: Navitimer, Chronomat, Superocean e Superocean Heritage, Avenger, Premier, Top Time, Emergency e i Breitling vintage. Contano referenza, calibro (manifattura B01 o base), condizioni e corredo.',
    collections: [
      { b: 'Navitimer', t: 'B01, automatici, GMT e i Navitimer vintage.' },
      { b: 'Chronomat', t: 'Dagli anni Ottanta a oggi, con il bracciale Rouleaux.' },
      { b: 'Superocean e Avenger', t: 'Subacquei e sportivi.' },
      { b: 'Premier, Top Time, Emergency', t: 'Riedizioni, classici e lo strumento con la radiobalisa.' },
    ],
    matters: ['Referenza e calibro.', 'Bracciale o cinturino originali.', 'Garanzia e revisioni.', 'Sull’Emergency: stato della trasmittente.'],
    faqs: [
      { q: 'Comprate Breitling usati?', a: 'Sì, valutiamo e acquistiamo Breitling usati da privati, moderni e vintage. Si comincia con foto e dati.' },
      { q: 'Quanto vale un Breitling Navitimer usato?', a: 'Dipende da versione, calibro, condizioni e corredo: un B01 recente e un Navitimer vintage sono orologi molto diversi. Prima esame sulle foto, cifra dopo averlo visto.' },
    ] },
  { brand: 'TAG Heuer', slug: 'tag-heuer', hero: IMG.banco,
    title: 'Vendere un TAG Heuer usato: Carrera, Monaco, Heuer | Orologi Famosi',
    description: 'Compriamo TAG Heuer usati da privati: Carrera, Monaco, Aquaracer, Autavia e Heuer vintage. Valutazione gratuita a Medicina (BO) e Bologna, pagamento immediato con bonifico.',
    lead: 'Carrera e Monaco sono legati alle corse e al cinema. E i vecchi Heuer, prima della fusione con TAG, sono tra i cronografi vintage più cercati.',
    brief: 'Valutiamo e acquistiamo TAG Heuer usati da privati: Carrera, Monaco, Aquaracer, Formula 1, Autavia e i cronografi Heuer vintage. Sui moderni contano calibro, condizioni e corredo; sui vintage l’originalità di quadrante e lancette.',
    collections: [
      { b: 'Carrera', t: 'Cronografi e solo tempo, anche Heuer 02 e riedizioni.' },
      { b: 'Monaco', t: 'La cassa quadrata, dai calibri 11 e 12 alle versioni moderne.' },
      { b: 'Aquaracer e Formula 1', t: 'Gli sportivi di tutti i giorni.' },
      { b: 'Heuer vintage', t: 'Carrera, Autavia, Monaco, Camaro, Silverstone degli anni Sessanta e Settanta.' },
    ],
    matters: ['Referenza e calibro.', 'Sui vintage: quadrante, lancette e lunetta originali.', 'Garanzia e revisioni.', 'Bracciale o cinturino originali.'],
    faqs: [
      { q: 'Comprate TAG Heuer usati?', a: 'Sì, valutiamo e acquistiamo TAG Heuer usati da privati, moderni e vintage.' },
      { q: 'Un cronografo Heuer vintage vale molto?', a: 'Alcune referenze sono molto ricercate, ma il valore dipende da originalità e condizioni. Mandaci le foto: ti diciamo se vale la pena vederlo.' },
    ] },
  { brand: 'Hublot', slug: 'hublot', hero: IMG.banco,
    title: 'Vendere un Hublot usato: Big Bang, Classic Fusion | Orologi Famosi',
    description: 'Compriamo Hublot usati da privati: Big Bang, Classic Fusion, Spirit of Big Bang, Square Bang. Valutazione gratuita a Medicina (BO) e Bologna, pagamento immediato con bonifico.',
    lead: 'Hublot ha portato la gomma accanto all’oro e alla ceramica. È un orologio che si nota, e che si valuta guardando bene materiali e cinturini.',
    brief: 'Puoi proporci il tuo Hublot: valutiamo Hublot usati da privati, Big Bang e Big Bang Unico, Classic Fusion, Spirit of Big Bang, Square Bang e le edizioni limitate. Contano referenza, materiale della cassa, cinturini originali, condizioni e corredo.',
    collections: [
      { b: 'Big Bang', t: 'Il cronografo della casa, anche Unico e in edizioni limitate.' },
      { b: 'Classic Fusion', t: 'Più sobrio, solo tempo e cronografo.' },
      { b: 'Spirit of Big Bang e Square Bang', t: 'Le casse a botte e quadrate.' },
    ],
    matters: ['Materiale: acciaio, titanio, ceramica, oro King Gold, carbonio.', 'Cinturini originali e chiusura deployante.', 'Garanzia e scatola.', 'Condizioni della lunetta e delle viti ad H.'],
    faqs: [
      { q: 'Comprate Hublot usati?', a: 'Puoi proporcelo: valutiamo Hublot usati da privati, di persona. Si comincia con foto e dati.' },
      { q: 'Quanto vale un Hublot Big Bang usato?', a: 'Dipende da referenza, materiale, condizioni, cinturini e corredo. Primo esame sulle foto, cifra dopo averlo visto.' },
    ] },
  { brand: 'Vacheron Constantin', slug: 'vacheron-constantin', hero: IMG.scrivania,
    title: 'Vendere un Vacheron Constantin usato: Overseas | Orologi Famosi',
    description: 'Valutiamo Vacheron Constantin usati da privati: Overseas, Patrimony, Traditionnelle, Fiftysix, Historiques. Valutazione riservata e gratuita a Medicina (BO) e Bologna, pagamento con bonifico.',
    lead: 'La manifattura ginevrina in attività ininterrotta dal 1755. Un Vacheron Constantin si valuta con la stessa cura con cui è stato costruito.',
    brief: 'Valutiamo Vacheron Constantin usati da privati: Overseas, Patrimony, Traditionnelle, Fiftysix, Historiques e i modelli vintage. Contano referenza, calibro, condizioni, documenti e revisioni presso la casa.',
    collections: [
      { b: 'Overseas', t: 'Lo sportivo con il bracciale integrato e i cinturini intercambiabili.' },
      { b: 'Patrimony e Traditionnelle', t: 'Gli orologi classici, anche con complicazioni.' },
      { b: 'Fiftysix e Historiques', t: 'Ispirazioni dagli archivi della casa.' },
      { b: 'Vintage', t: 'Orologi classici in oro dagli anni Quaranta in poi.' },
    ],
    matters: ['Referenza e calibro.', 'Punzone di Ginevra, dove previsto.', 'Bracciale e cinturini originali, sull’Overseas.', 'Certificato, garanzia o estratto d’archivio.'],
    faqs: [
      { q: 'Comprate Vacheron Constantin usati?', a: 'Sì, puoi proporci un Vacheron Constantin: lo valutiamo di persona, con riservatezza, a Bologna o a Medicina (BO).' },
      { q: 'Quanto vale un Vacheron Constantin Overseas usato?', a: 'Dipende da referenza, condizioni, bracciale e cinturini, documenti e mercato. Lo vediamo dal vivo per una cifra seria.' },
    ] },
];

/** Orologi veri passati da Orologi Famosi, con il link alla scheda originale del catalogo. */
function shelfFor(b) {
  const c = CATALOGO[b.slug];
  if (!c?.items?.length) return null;
  const sold = c.items.filter((i) => i.sold).length;
  return {
    nav: 'Passati dal nostro tavolo',
    h: `${b.brand} passati dal nostro tavolo`,
    p: `Alcuni ${b.brand} che abbiamo valutato, comprato e rivenduto${sold ? ': quelli segnati «Venduto» hanno già un nuovo proprietario' : ''}. Ogni foto porta alla scheda originale nel catalogo di Orologi Famosi.`,
    items: c.items,
    all: c.catalog, allLabel: `Tutti i ${b.brand} del catalogo, per chi vuole comprare →`,
  };
}

function brandPage(b) {
  const route = `/vendi-${b.slug}/`;
  registerBrandPage(b.brand, route);
  return {
    id: `marchio-${b.slug}`, file: 'Guida.dc.html', route, link: `Vendi${b.slug.replace(/(^|-)(\w)/g, (_, __, c) => c.toUpperCase())}`,
    name: `Landing ${b.brand}`, landing: true, kind: 'landing', brand: b.brand, priority: 0.8,
    title: b.title, description: b.description, crumb: `Vendi il tuo ${b.brand} usato`, parent: { name: 'Tutti i marchi', route: R.marchi },
    data: {
      kicker: `Vendi il tuo ${b.brand}`, kickerSub: 'valutazione gratuita a Medicina (BO) e Bologna', crumb: b.brand, parentName: 'Tutti i marchi', parentHref: R.marchi,
      h1: `Vendi il tuo ${b.brand} usato`, lead: b.lead, brief: b.brief, brand: b.brand, hero: b.hero,
      points: ['Valutazione gratuita e senza impegno, fatta di persona da Salvatore.', 'Primo esame a distanza su foto, da tutta Italia.', 'Proposta dopo averlo visto dal vivo, pagamento immediato con bonifico.'],
      sections: [
        { id: 'collezioni', nav: 'Le collezioni', h: `I ${b.brand} che valutiamo`, list: b.collections, note: `Il tuo ${b.brand} non è in elenco? Proponilo lo stesso nella richiesta. Questa pagina è per chi vende: se cerchi un orologio da comprare, il catalogo è su venditaorologiusati.it.` },
        { id: 'valutazione', nav: 'Cosa conta', h: `Cosa conta nella valutazione di un ${b.brand}`, p: ['Ogni orologio si valuta singolarmente, ma su questo marchio guardiamo con particolare attenzione:'], bullets: b.matters },
        { id: 'come', nav: 'Come funziona', h: 'Come funziona',
          list: [
            { b: '1. Ci scrivi', t: `Con la scheda online o su WhatsApp: modello, condizioni, corredo e qualche foto del tuo ${b.brand}.` },
            { b: '2. Primo esame', t: 'Salvatore guarda foto e dati e ti risponde nel canale che preferisci.' },
            { b: '3. Lo vediamo insieme', t: 'Nel negozio di Medicina (BO) o nella sede riservata di Bologna, su appuntamento. La proposta arriva lì, e decidi tu.' },
            { b: '4. Pagamento', t: 'Se accetti, ti paghiamo subito con bonifico sul conto che scegli.' },
          ], note: 'Se sei lontano e non puoi venire, organizziamo noi il ritiro con un corriere specializzato nel trasporto di valori, gratis per te.' },
      ],
      faqs: withMapFaqs(route, [...b.faqs,
        { q: `Dove vendere un ${b.brand} usato in Emilia-Romagna?`, a: `Puoi proporlo a ${FATTI}. Si comincia online con le foto, la verifica e la proposta si fanno dal vivo. Da tutta la regione, e da tutta Italia, il ritiro con corriere specializzato è gratuito se non puoi venire.` },
        { q: 'La valutazione mi obbliga a vendere?', a: 'No. La valutazione è gratuita, a distanza e dal vivo. Dopo aver ascoltato la proposta decidi tu, con calma.' },
      ]),
      shelf: shelfFor(b),
      related: [card.valore, card.dove, card.marchi, card.regione],
      ctaH: `Raccontaci il tuo ${b.brand}`,
      ctaP: 'Mandaci qualche foto con la scheda o su WhatsApp. Facciamo un primo esame a distanza e ti rispondiamo noi, senza impegno.',
    },
  };
}

// ------------------------------------------------------------------ tutti i marchi

const ALTRI = [
  { b: 'A. Lange & Söhne', t: 'Lange 1, Saxonia, Datograph, Zeitwerk, Odysseus.' },
  { b: 'Breguet', t: 'Classique, Marine, Type XX, Tradition, Reine de Naples.' },
  { b: 'Blancpain', t: 'Fifty Fathoms, Villeret, Léman.' },
  { b: 'Chopard', t: 'Happy Sport, Alpine Eagle, L.U.C, Mille Miglia.' },
  { b: 'Grand Seiko', t: 'Spring Drive, Hi-Beat, i quadranti Snowflake e le serie stagionali.' },
  { b: 'Ulysse Nardin', t: 'Marine, Diver, Freak.' },
  { b: 'Girard-Perregaux', t: 'Laureato, 1966, Tre Ponti.' },
  { b: 'Piaget', t: 'Polo, Altiplano, Possession.' },
  { b: 'Montblanc', t: '1858, Heritage, Star Legacy.' },
  { b: 'Hermès e Chanel', t: 'Arceau, H08, Cape Cod; J12, Première, Boy·Friend.' },
  { b: 'Richard Mille', t: 'Le referenze RM sportive e da donna.' },
];

const marchiHub = {
  id: 'marchi', file: 'Guida.dc.html', route: R.marchi, link: 'TuttiMarchi', name: 'Tutti i marchi', kind: 'hub', priority: 0.8,
  title: 'Quali orologi usati compriamo: tutti i marchi | Orologi Famosi',
  description: 'Rolex, Patek Philippe, Audemars Piguet, Omega, Cartier, Tudor, Panerai, IWC, Jaeger-LeCoultre, Vacheron Constantin e tutti gli orologi di alta gamma: valutazione gratuita a Medicina (BO) e Bologna.',
  crumb: 'Tutti i marchi',
  data: {
    kicker: 'Tutti i marchi', kickerSub: 'gli orologi che valutiamo', crumb: 'Tutti i marchi', hero: IMG.velluto,
    h1: 'Gli orologi che valutiamo e compriamo',
    lead: 'Lavoriamo ogni giorno con i grandi nomi dell’orologeria, dai Rolex d’acciaio alle complicazioni ginevrine. Qui trovi i marchi che vediamo più spesso e cosa conta per ognuno.',
    brief: 'Valutiamo e compriamo da privati orologi di alta gamma di tutti i principali marchi: Rolex, Patek Philippe, Audemars Piguet, Vacheron Constantin, Omega, Cartier, Tudor, Panerai, IWC, Jaeger-LeCoultre, Breitling, TAG Heuer, Hublot e molti altri. Se il tuo marchio non è in elenco, proponilo lo stesso: lo guarda Salvatore.',
    points: ['Per ogni marchio contano referenza, condizioni, originalità e corredo.', 'La valutazione è gratuita, a distanza e dal vivo.', 'Pagamento immediato con bonifico, se accetti la proposta.'],
    sections: [
      { id: 'pagine', nav: 'I marchi principali', h: 'I marchi con una pagina dedicata', p: ['Per questi marchi abbiamo scritto cosa guardiamo, collezione per collezione.'],
        list: [
          { b: 'Rolex', href: R.rolex, t: 'Submariner, Datejust, GMT-Master II, Daytona, Explorer, anche vintage.' },
          { b: 'Omega', href: R.omega, t: 'Speedmaster, Seamaster, Constellation, De Ville.' },
          { b: 'Cartier', href: R.cartier, t: 'Santos, Tank, Panthère, Ballon Bleu, anche al quarzo.' },
          ...brands.map((b) => ({ b: b.brand, href: `/vendi-${b.slug}/`, t: `${b.collections.map((c) => c.b).join(', ')}.` })),
        ] },
      { id: 'altri19', nav: 'Altri marchi frequenti', h: 'Altri marchi che vediamo spesso',
        list: [
          { b: 'Zenith', t: 'El Primero, Chronomaster, Defy.' },
          { b: 'Longines', t: 'Conquest, Flagship Heritage, HydroConquest, Master Collection.' },
          { b: 'Bulgari', t: 'Bulgari Bulgari, Diagono, Octo, Serpenti.' },
          { b: 'Franck Muller', t: 'Casablanca, Cintrée Curvex.' },
          { b: 'Baume & Mercier', t: 'Classima, Clifton, Riviera, Hampton.' },
          { b: 'Oris', t: 'Divers Sixty-Five, Aquis, Big Crown.' },
          { b: 'Hamilton, Seiko, Mido, Eberhard, Maurice Lacroix', t: 'Khaki, Jazzmaster; Prospex, Presage; Ocean Star; Extra-Fort, Chrono 4; Aikon, Pontos.' },
        ] },
      { id: 'alta', nav: 'Alta orologeria', h: 'Alta orologeria: proponi anche questi', p: ['Sono orologi che vediamo meno spesso ma che valutiamo con la stessa cura, di persona e con riservatezza.'], list: ALTRI },
    ],
    faqs: [
      { q: 'Comprate orologi usati di qualsiasi marca?', a: 'Puoi proporre qualsiasi marca di fascia alta. Lavoriamo ogni giorno con Rolex, Omega, Cartier, Tudor e i grandi marchi svizzeri; se il tuo non è in elenco, indicalo lo stesso nella richiesta.' },
      { q: 'Comprate orologi Patek Philippe e Audemars Piguet?', a: 'Sì, puoi proporceli: li valutiamo di persona, con riservatezza, nella sede di Bologna o nel negozio di Medicina (BO).' },
      { q: 'Comprate orologi da donna?', a: 'Sì: Cartier, Rolex, Chopard, Bulgari, Jaeger-LeCoultre e altri. Valgono le stesse regole: foto, primo esame, proposta dopo averlo visto.' },
      { q: 'Comprate orologi d’epoca?', a: 'Sì, anche i vintage. Contano originalità di quadrante e lancette e le condizioni: si verificano dal vivo.' },
    ],
    related: [card.valore, card.dove, card.regione, card.eredita],
  },
};

// ------------------------------------------------------------------ Emilia-Romagna

const PROVINCE = [
  { id: 'bologna', nav: 'Bologna', h: 'Bologna e provincia', p: ['Siamo a casa: il negozio è a Medicina, in Via Licurgo Fava 421 presso il Centro Commerciale Medici, e a Bologna abbiamo una sede riservata dove riceviamo su appuntamento. Da San Lazzaro, Casalecchio, Budrio, Castenaso, Ozzano, Castel San Pietro e dal resto della provincia si comincia con la scheda o su WhatsApp e si sceglie la sede più comoda.'] },
  { id: 'imola', nav: 'Imola', h: 'Imola e il circondario', p: ['Medicina è tra Bologna e Imola: da Imola, Castel Guelfo, Dozza, Mordano, Casalfiumanese e Borgo Tossignano il negozio è vicino. Fissiamo l’appuntamento dopo il primo esame delle foto.'] },
  { id: 'ferrara', nav: 'Ferrara', h: 'Ferrara e provincia', p: ['Da Ferrara, Cento, Argenta, Comacchio e dalla Bassa si comincia da casa con le foto. Poi scegli tu: vieni a Medicina (BO) o a Bologna, oppure, se non puoi spostarti, organizziamo noi il ritiro con un corriere specializzato nel trasporto di valori, gratis per te.'] },
  { id: 'ravenna', nav: 'Ravenna', h: 'Ravenna e la Romagna bassa', p: ['Da Ravenna, Lugo, Faenza, Massa Lombarda, Conselice, Bagnacavallo e Cervia il primo esame si fa a distanza. Per la verifica dal vivo il negozio di Medicina (BO) è la sede più vicina; in alternativa c’è il ritiro con corriere specializzato, gratuito.'] },
  { id: 'forli-cesena', nav: 'Forlì-Cesena', h: 'Forlì e Cesena', p: ['Da Forlì, Cesena, Cesenatico e dal resto della provincia si comincia con le foto. Se l’orologio ci interessa, ci vediamo a Medicina (BO) o a Bologna su appuntamento, oppure lo ritiriamo noi con un corriere specializzato.'] },
  { id: 'rimini', nav: 'Rimini', h: 'Rimini e la riviera', p: ['Da Rimini, Riccione, Cattolica, Santarcangelo e dalla Valmarecchia vale lo stesso percorso: primo esame a distanza, poi verifica dal vivo a Medicina (BO) o a Bologna, oppure ritiro con corriere specializzato nel trasporto di valori, gratis per te.'] },
  { id: 'modena', nav: 'Modena', h: 'Modena e provincia', p: ['Da Modena, Carpi, Sassuolo, Vignola, Mirandola e Formigine si comincia con la scheda o su WhatsApp. La sede riservata di Bologna è la più comoda per chi arriva da ovest; se preferisci non spostarti, il ritiro lo organizziamo noi.'] },
  { id: 'reggio-emilia', nav: 'Reggio Emilia', h: 'Reggio Emilia e provincia', p: ['Da Reggio Emilia, Scandiano, Correggio, Guastalla e dall’Appennino reggiano il primo esame si fa sulle foto. Poi appuntamento a Bologna o a Medicina (BO), oppure ritiro con corriere specializzato, gratuito.'] },
  { id: 'parma', nav: 'Parma', h: 'Parma e provincia', p: ['Da Parma, Fidenza, Salsomaggiore e dalla provincia si comincia online. Se non vuoi fare la strada fino a Bologna, organizziamo noi il ritiro con un corriere specializzato nel trasporto di valori, gratis per te; la proposta arriva dopo che Salvatore ha visto l’orologio.'] },
  { id: 'piacenza', nav: 'Piacenza', h: 'Piacenza e provincia', p: ['Anche da Piacenza, Castel San Giovanni e Fiorenzuola il percorso è lo stesso: foto e dati a distanza, poi verifica dal vivo a Bologna o a Medicina (BO), oppure ritiro con corriere specializzato, gratis per te.'] },
];

const regione = {
  id: 'emilia-romagna', file: 'Guida.dc.html', route: R.regione, link: 'EmiliaRomagna', name: 'Emilia-Romagna', kind: 'guide', priority: 0.8,
  title: 'Vendere un orologio usato in Emilia-Romagna | Orologi Famosi',
  description: 'Da Piacenza a Rimini: vendi il tuo orologio di lusso usato a Orologi Famosi. Primo esame a distanza, verifica a Medicina (BO) o Bologna, ritiro gratuito con corriere specializzato.',
  crumb: 'Emilia-Romagna', about: ['Emilia-Romagna', 'vendere orologio Bologna', 'compro orologi Emilia-Romagna'],
  data: {
    kicker: 'Emilia-Romagna', kickerSub: 'da Piacenza a Rimini', crumb: 'Emilia-Romagna', hero: IMG.scrivania,
    h1: 'Vendere un orologio usato in Emilia-Romagna',
    lead: 'Il negozio è a Medicina, in provincia di Bologna, e a Bologna riceviamo su appuntamento. Ma ci scrivono da tutta la regione: ecco come funziona, provincia per provincia.',
    brief: 'Da qualsiasi provincia dell’Emilia-Romagna puoi vendere il tuo orologio a Orologi Famosi: ci mandi foto e dati con la scheda o su WhatsApp, facciamo un primo esame a distanza e, se l’orologio ci interessa, lo vediamo dal vivo a Medicina (BO) o a Bologna. Se non puoi venire, organizziamo il ritiro con un corriere specializzato nel trasporto di valori, gratis per te.',
    points: ['Negozio: Via Licurgo Fava 421, Medicina (BO), presso il Centro Commerciale Medici.', 'Bologna: sede riservata, solo su appuntamento.', 'Orari del negozio: lunedì 15–19, da martedì a sabato 9:30–13 e 15:30–19.'],
    sections: [
      { id: 'come', nav: 'Come funziona', h: 'Come funziona, da qualsiasi città',
        list: [
          { b: '1. Da casa', t: 'Scheda online o WhatsApp al 379 154 9804: marca, modello, foto, corredo.' },
          { b: '2. Primo esame', t: 'Salvatore guarda foto e dati e ti risponde nel canale che preferisci.' },
          { b: '3. Dal vivo', t: 'A Medicina (BO) o a Bologna su appuntamento. Oppure ritiro con corriere specializzato, gratuito.' },
          { b: '4. Proposta e pagamento', t: 'La proposta arriva dopo la verifica. Se accetti, bonifico immediato.' },
        ] },
      ...PROVINCE,
    ],
    faqs: [
      { q: 'Dove vendere un orologio usato in Emilia-Romagna?', a: `Puoi proporlo a ${FATTI}. Si comincia online da qualsiasi provincia; la verifica si fa dal vivo oppure con il ritiro gratuito tramite corriere specializzato.` },
      { q: 'Chi compra Rolex usati a Modena, Parma o Reggio Emilia?', a: 'Orologi Famosi valuta e compra Rolex e altri orologi di alta gamma anche da chi vive nell’Emilia occidentale: il primo esame si fa sulle foto, poi ci vediamo a Bologna o organizziamo noi il ritiro con un corriere specializzato, gratis per te.' },
      { q: 'Vendere un orologio a Rimini o Riccione: come si fa?', a: 'Ci mandi foto e dati con la scheda o su WhatsApp. Se l’orologio ci interessa, scegli se venire a Medicina (BO) o a Bologna, oppure lo ritiriamo noi con un corriere specializzato nel trasporto di valori.' },
      { q: 'Devo per forza venire a Bologna?', a: 'No. Se non puoi venire, organizziamo noi il ritiro con un corriere specializzato nel trasporto di valori, gratis per te. La proposta arriva dopo che Salvatore ha visto l’orologio.' },
      { q: 'Il ritiro con corriere è assicurato?', a: 'Usiamo un corriere specializzato nel trasporto di valori, e il ritiro è gratuito per te. I dettagli te li diamo quando organizziamo la spedizione.' },
      { q: 'Si può vendere da fuori regione?', a: 'Sì, da tutta Italia: il primo esame è a distanza e il ritiro con corriere specializzato è gratuito se non puoi venire.' },
    ],
    related: [card.dove, card.valore, card.marchi, card.sicuro],
  },
};

// ------------------------------------------------------------------ indice delle guide

const hub = {
  id: 'guide', file: 'Guida.dc.html', route: R.guide, link: 'Guide', name: 'Guide', kind: 'hub', priority: 0.7,
  title: 'Guide per vendere un orologio usato | Orologi Famosi',
  description: 'Dove vendere, quanto vale, senza scatola, ereditato, fermo, in sicurezza: le risposte alle domande che ci fanno tutti prima di vendere un orologio di lusso.',
  crumb: 'Guide',
  data: {
    kicker: 'Guide', kickerSub: 'le domande che ci fanno tutti', crumb: 'Guide', hero: IMG.movimento,
    h1: 'Prima di vendere un orologio',
    lead: 'Sono le domande che ci fanno ogni settimana, al telefono, su WhatsApp e al banco. Le risposte sono quelle che diamo a voce, scritte con calma.',
    brief: 'Qui trovi le risposte alle domande più comuni di chi vuole vendere un orologio di lusso usato: dove venderlo, quanto vale, cosa fare se manca la scatola o se è fermo, come gestire un orologio ereditato e come vendere senza rischi.',
    points: [],
    sections: [
      { id: 'elenco', nav: 'Tutte le guide', h: 'Tutte le guide', list: [...guide.map((g) => ({ b: g.data.h1, href: g.route, t: `${g.description.split(/[.?] /)[0]}.` })), { b: 'Vendere in Emilia-Romagna', href: R.regione, t: 'Da Piacenza a Rimini, provincia per provincia.' }, { b: 'Tutti i marchi', href: R.marchi, t: 'Cosa valutiamo, marchio per marchio.' }] },
    ],
    faqs: [],
    related: [card.dove, card.valore, card.corredo, card.eredita, card.vintage, card.sicuro, card.foto, card.fermo, card.regione, card.marchi],
  },
};

function guidePage(g) {
  return {
    id: `guida-${g.slug}`, file: 'Guida.dc.html', route: g.route, link: g.link, name: g.data.h1, kind: 'guide', priority: 0.7,
    title: g.title, description: g.description, crumb: g.crumb, parent: { name: 'Guide', route: R.guide }, about: g.about,
    data: { ...g.data, crumb: g.crumb, parentName: 'Guide', parentHref: R.guide, hero: g.hero, faqs: withMapFaqs(g.route, g.data.faqs || []) },
  };
}

regione.data.faqs = withMapFaqs(R.regione, regione.data.faqs);

export const CONTENT_PAGES = [
  hub, ...guide.map(guidePage), regione, marchiHub, ...brands.map(brandPage),
];
export const CONTENT_ROUTES = R;

export const HERO_ALT = ALT;

/** Testo semplice di tutte le pagine di contenuto, per llms-full.txt. */
export function llmsFull(site) {
  const out = ['# Orologi Famosi · testo completo delle guide e delle pagine marchio', ''];
  for (const p of CONTENT_PAGES) {
    const d = p.data;
    out.push(`## ${d.h1}`, `${site}${p.route}`, '', d.lead, '', d.brief, '');
    for (const pt of d.points || []) out.push(`- ${pt}`);
    for (const sec of d.sections || []) {
      out.push('', `### ${sec.h}`);
      for (const para of sec.p || []) out.push(para);
      for (const li of sec.list || []) out.push(`- ${li.b}: ${li.t}`);
      for (const b of sec.bullets || []) out.push(`- ${b}`);
      for (const r of sec.table?.rows || []) out.push(`- ${r.k}: ${r.v.join(' · ')}`);
      if (sec.note) out.push(sec.note);
    }
    if (d.shelf?.items?.length) { out.push('', `### ${d.shelf.h}`); for (const w of d.shelf.items) out.push(`- ${w.t}${w.sold ? ' (venduto)' : ''}: ${w.href}`); }
    if (d.faqs?.length) { out.push('', '### Domande frequenti'); for (const f of d.faqs) out.push(`- ${f.q} ${f.a}`); }
    out.push('', '');
  }
  return out.join('\n');
}
