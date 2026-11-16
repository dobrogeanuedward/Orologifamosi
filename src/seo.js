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
    areaServed: B.areaServed.map((c) => ({ '@type': 'City', name: c })),
    knowsAbout: ['valutazione orologi usati', 'acquisto orologi da privati', ...B.brands],
    description: 'Orologi Famosi valuta e acquista orologi di lusso usati da privati. Primo esame a distanza su foto e dati, verifica e proposta dal vivo a Medicina (BO), su appuntamento.',
    contactPoint: [{ '@type': 'ContactPoint', telephone: B.telephone, contactType: 'valutazione e acquisto orologi', availableLanguage: 'it', areaServed: 'IT' }],
  };
}

function breadcrumb(page, title) {
  const items = [{ name: 'Vendi il tuo orologio', url: SITE + LINKS.Main }];
  if (page.route !== LINKS.Main) items.push({ name: title.split(' · ')[0], url: SITE + page.route });
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
  if (page.kind === 'about') list.push(person());
  if (faqs?.length) list.push(faqPage(faqs));
  return list;
}
