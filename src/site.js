/** Configurazione del sito: indirizzi, pagine, dati dell'attività (fonte: tavole di design). */

export const SITE = (process.env.SITE_URL || 'https://www.venditaorologiusati.it').replace(/\/$/, '');

/**
 * URL proposti nel contratto (allegato 02), da confermare con il gestore del sito.
 * La pagina della richiesta e quella su Salvatore sono di supporto alle 4 landing.
 */
export const LINKS = {
  Main: '/vendi-orologio/',
  Mobile: '/vendi-orologio/',
  Rolex: '/vendi-rolex/',
  RolexMobile: '/vendi-rolex/',
  Omega: '/vendi-omega/',
  Cartier: '/vendi-cartier/',
  Richiesta: '/vendi-orologio/richiesta/',
  RichiestaMobile: '/vendi-orologio/richiesta/',
  Salvatore: '/vendi-orologio/salvatore-agresta/',
  SalvatoreMobile: '/vendi-orologio/salvatore-agresta/',
  Contatti: '/vendi-orologio/contatti/',
  ContattiMobile: '/vendi-orologio/contatti/',
};

export const PAGES = [
  { id: 'generale', file: 'Main.dc.html', route: LINKS.Main, name: 'Landing generale', landing: true, kind: 'landing', brand: null, priority: 1.0 },
  { id: 'rolex', file: 'Rolex.dc.html', route: LINKS.Rolex, name: 'Landing Rolex', landing: true, kind: 'landing', brand: 'Rolex', priority: 0.9 },
  { id: 'omega', file: 'Omega.dc.html', route: LINKS.Omega, name: 'Landing Omega', landing: true, kind: 'landing', brand: 'Omega', priority: 0.9, ogImage: 'media/omega-seamaster-poster.jpg' },
  { id: 'cartier', file: 'Cartier.dc.html', route: LINKS.Cartier, name: 'Landing Cartier', landing: true, kind: 'landing', brand: 'Cartier', priority: 0.9, ogImage: 'media/cartier-film-poster.jpg' },
  { id: 'salvatore', file: 'Salvatore.dc.html', route: LINKS.Salvatore, name: 'Chi è Salvatore', kind: 'about', description: 'Salvatore Agresta guida Orologi Famosi a Medicina (BO): una famiglia di gioiellieri, trent’anni di esperienza e ogni orologio valutato di persona.', ogType: 'profile', priority: 0.6 },
  { id: 'contatti', file: 'Contatti.dc.html', route: LINKS.Contatti, name: 'Contatti', kind: 'contact', title: 'Contatti · Orologi Famosi, Medicina (BO) e Bologna', description: 'Contatti di Orologi Famosi: WhatsApp e telefono 379 154 9804, email info@venditaorologiusati.it, negozio a Medicina (BO) in Via Licurgo Fava 421 e sede riservata a Bologna su appuntamento.', priority: 0.7 },
  // Pagina di servizio: la richiesta non va nei risultati di ricerca, ma i link si seguono.
  { id: 'richiesta', file: 'Richiesta.dc.html', route: LINKS.Richiesta, name: 'Richiesta di valutazione', kind: 'form', description: 'Richiedi la valutazione del tuo orologio a Orologi Famosi: scheda guidata, solo foto o contatto diretto. Risponde Salvatore Agresta, senza impegno.', index: false },
];

/** Dati dell'attività come compaiono nelle tavole (piè di pagina, contatti, Chi è Salvatore). */
export const BUSINESS = {
  name: 'Orologi Famosi',
  legalName: 'Orologi Famosi di Salvatore Agresta',
  vatID: 'IT03955231208',
  founder: 'Salvatore Agresta',
  foundingDate: '2018',
  telephone: '+39 379 154 9804',
  email: 'info@venditaorologiusati.it',
  whatsapp: 'https://wa.me/393791549804',
  catalog: 'https://www.venditaorologiusati.it/',
  address: { streetAddress: 'Via Fava 421/14, Centro Commerciale Medici', postalCode: '40059', addressLocality: 'Medicina', addressRegion: 'BO', addressCountry: 'IT' },
  maps: 'https://www.google.com/maps/search/?api=1&query=Orologi+Famosi+Via+Licurgo+Fava+421+Medicina',
  brands: ['Rolex', 'Omega', 'Cartier', 'Tudor', 'TAG Heuer', 'Breitling', 'IWC', 'Jaeger-LeCoultre', 'Zenith', 'Longines', 'Bulgari', 'Franck Muller', 'Baume & Mercier', 'Oris', 'Hamilton', 'Seiko', 'Mido', 'Eberhard', 'Maurice Lacroix'],
  // Medicina è la sede reale; Bologna e i comuni limitrofi sono bacini di provenienza (allegato 02).
  areaServed: ['Medicina', 'Bologna', 'Imola', 'Castel San Pietro Terme', 'Castel Guelfo di Bologna', 'Dozza', 'Mordano', 'Ozzano dell\'Emilia', 'San Lazzaro di Savena', 'Budrio', 'Castenaso', 'Granarolo dell\'Emilia', 'Lugo', 'Massa Lombarda', 'Conselice', 'Castel Bolognese', 'Bagnara di Romagna'],
};
