/** Dati strutturati schema.org per pagina. Solo fatti presenti nelle tavole: niente recensioni, prezzi o orari inventati. */
import { BUSINESS as B, SITE, LINKS } from './site.js';

const ORG_ID = `${SITE}/#orologi-famosi`;
const PERSON_ID = `${SITE}${LINKS.Salvatore}#salvatore-agresta`;

export function business() {
  return {
    '@context': 'https://schema.org',
    '@type': ['Store', 'LocalBusiness'],
    '@id': ORG_ID,
    name: B.name,
    legalName: B.legalName,
    vatID: B.vatID,
    url: SITE + '/',
    telephone: B.telephone,
    email: B.email,
    foundingDate: B.foundingDate,
    founder: { '@id': PERSON_ID },
    address: { '@type': 'PostalAddress', ...B.address },
    hasMap: B.maps,
    sameAs: B.sameAs,
    openingHoursSpecification: B.hours.map((h) => ({ '@type': 'OpeningHoursSpecification', dayOfWeek: h.days, opens: h.opens, closes: h.closes })),
    areaServed: B.areaServed.map((c) => ({ '@type': 'City', name: c })),
    knowsAbout: ['valutazione orologi usati', 'acquisto orologi da privati', ...B.brands],
    paymentAccepted: 'Bonifico bancario',
    description: 'Orologi Famosi valuta e acquista orologi di lusso usati da privati. Primo esame a distanza su foto e dati, verifica e proposta dal vivo nel negozio di Medicina (BO) o nella sede riservata di Bologna, su appuntamento.',
    contactPoint: [{ '@type': 'ContactPoint', telephone: B.telephone, contactType: 'valutazione e acquisto orologi', availableLanguage: 'it', areaServed: 'IT' }],
  };
}

function breadcrumb(page, title) {
  const items = [{ name: 'Vendi il tuo orologio', url: SITE + LINKS.Main }];
  const crumb = page.brand ? `Vendi il tuo ${page.brand} usato` : page.kind === 'about' ? 'Chi è Salvatore Agresta' : page.kind === 'contact' ? 'Contatti' : title.split(/ [·|:] /)[0];
  if (page.route !== LINKS.Main) items.push({ name: crumb, url: SITE + page.route });
  return {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: it.url })),
  };
}

function service(page, description, canonical) {
  const brand = page.brand;
  return {
    '@context': 'https://schema.org', '@type': 'Service',
    '@id': `${canonical}#servizio`,
    name: brand ? `Valutazione e acquisto ${brand} usati da privati` : 'Valutazione e acquisto di orologi usati da privati',
    serviceType: 'Acquisto di orologi usati',
    provider: { '@id': ORG_ID },
    areaServed: [{ '@type': 'City', name: 'Medicina' }, { '@type': 'City', name: 'Bologna' }, { '@type': 'Country', name: 'Italia' }],
    description,
    ...(brand ? { brand: { '@type': 'Brand', name: brand } } : { brand: B.brands.map((b) => ({ '@type': 'Brand', name: b })) }),
    potentialAction: { '@type': 'AskAction', name: 'Richiedi una valutazione', target: SITE + LINKS.Richiesta },
  };
}

/** I 19 marchi della pagina generale: pagina dedicata per Rolex, Omega e Cartier, scheda in pagina per gli altri. */
const slug = (b) => b.toLowerCase().replace(/&/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const OWN = { Rolex: LINKS.Rolex, Omega: LINKS.Omega, Cartier: LINKS.Cartier };
function brandList() {
  return {
    '@context': 'https://schema.org', '@type': 'ItemList',
    name: 'Marchi di orologi usati che Orologi Famosi valuta e acquista',
    itemListElement: B.brands.map((b, i) => ({
      '@type': 'ListItem', position: i + 1,
      item: { '@type': 'Service', name: `Valutazione e acquisto ${b} usati`, brand: { '@type': 'Brand', name: b }, provider: { '@id': ORG_ID }, url: SITE + (OWN[b] || `${LINKS.Main}#${slug(b)}`) },
    })),
  };
}

function faqPage(faqs) {
  return {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
}

function person() {
  return {
    '@context': 'https://schema.org', '@type': 'Person', '@id': PERSON_ID,
    name: B.founder, jobTitle: 'Titolare e valutatore', worksFor: { '@id': ORG_ID },
    workLocation: { '@type': 'Place', name: 'Orologi Famosi, Medicina (BO)', address: { '@type': 'PostalAddress', ...B.address } },
    knowsAbout: ['orologi di lusso', 'valutazione orologi usati', ...B.brands.slice(0, 4)],
  };
}

export function jsonLd(page, { canonical, title, description, ogImage, faqs }) {
  const web = {
    '@context': 'https://schema.org', '@type': page.kind === 'about' ? 'AboutPage' : page.kind === 'contact' ? 'ContactPage' : 'WebPage',
    '@id': canonical, url: canonical, name: title, description, inLanguage: 'it-IT',
    isPartOf: { '@type': 'WebSite', name: B.name, url: SITE + '/' },
    about: page.kind === 'about' ? { '@id': PERSON_ID } : { '@id': ORG_ID },
    ...(ogImage && !ogImage.endsWith('/') ? { primaryImageOfPage: ogImage } : {}),
  };
  const list = [web, business(), breadcrumb(page, title)];
  if (page.kind === 'landing') list.push(service(page, description, canonical));
  if (page.kind === 'landing' && !page.brand) list.push(brandList());
  if (page.kind === 'about') list.push(person());
  if (faqs?.length) list.push(faqPage(faqs));
  return list;
}
