import { business, brands } from "./business";
import { areas } from "./coverage";
import { steps } from "./process";
import type { Landing } from "./landings";

/**
 * Dati strutturati delle landing (SEO, AEO, GEO).
 * Regole: solo fatti presenti nella pagina o verificati sul sito originale,
 * nessuna recensione, rating, prezzo, orario o sede inventati.
 * L'entità Orologi Famosi resta una sola, con @id sul sito originale.
 */

const orgId = business.original + "#organization";
const founderId = business.original + "#salvatore-agresta";

export function organization() {
  return {
    "@type": "Store",
    "@id": orgId,
    name: business.name,
    legalName: business.legalName,
    url: business.original,
    logo: business.original + "immagini/orologi-famosi-vendita-rolex-usati-bologna.png",
    telephone: business.phone,
    email: business.email,
    taxID: business.vat,
    vatID: "IT" + business.vat,
    foundingDate: business.foundingDate,
    founder: { "@id": founderId },
    sameAs: business.sameAs,
    address: {
      "@type": "PostalAddress",
      streetAddress: business.street,
      addressLocality: business.locality,
      addressRegion: business.region,
      postalCode: business.postcode,
      addressCountry: "IT",
    },
    description:
      "Orologi Famosi di Salvatore Agresta: vendita di orologi di lusso usati e acquisto da privati. Si riceve su appuntamento a Medicina (BO).",
  };
}

export function founder() {
  return {
    "@type": "Person",
    "@id": founderId,
    name: business.owner,
    jobTitle: "Titolare",
    worksFor: { "@id": orgId },
    knowsAbout: ["Valutazione orologi usati", "Alta orologeria", ...brands.slice(0, 4)],
  };
}

export function website(site: URL) {
  return {
    "@type": "WebSite",
    "@id": new URL("/#website", site).href,
    url: new URL("/vendi-orologio/", site).href,
    name: "Orologi Famosi · Acquisto da privati",
    inLanguage: "it-IT",
    publisher: { "@id": orgId },
  };
}

export function pageGraph(
  page: Landing,
  faqs: { q: string; a: string }[],
  site: URL | undefined,
) {
  const subject = page.brand || "orologio di lusso";
  const towns = areas.flatMap((a) => a.towns);
  const service = {
    "@type": "Service",
    name: page.brand
      ? `Valutazione e acquisto ${page.brand} usati da privati`
      : "Valutazione e acquisto di orologi di lusso usati da privati",
    serviceType: "Acquisto di orologi usati da privati",
    description: page.answer,
    provider: { "@id": orgId },
    audience: { "@type": "Audience", audienceType: "Privati che vogliono vendere un orologio" },
    areaServed: [
      { "@type": "Country", name: "Italia" },
      { "@type": "City", name: "Medicina" },
      { "@type": "City", name: "Bologna" },
      ...towns.map((name) => ({ "@type": "City", name })),
    ],
    availableChannel: [
      {
        "@type": "ServiceChannel",
        name: "Richiesta a distanza su WhatsApp",
        servicePhone: { "@type": "ContactPoint", telephone: business.phone },
      },
      {
        "@type": "ServiceChannel",
        name: "Verifica su appuntamento",
        serviceLocation: { "@id": orgId },
      },
    ],
    ...(page.brand ? { brand: { "@type": "Brand", name: page.brand } } : {}),
  };
  if (!site) return [organization(), founder(), service];

  const url = new URL("/" + page.slug + "/", site).href;
  const image = new URL("/images/" + page.image, site).href;
  const crumbs = [
    { name: "Vendi un orologio", item: new URL("/vendi-orologio/", site).href },
    ...(page.brand ? [{ name: `Vendi ${page.brand}`, item: url }] : []),
  ];
  return [
    organization(),
    founder(),
    website(site),
    {
      "@type": "WebPage",
      "@id": url + "#webpage",
      url,
      name: page.title,
      description: page.description,
      inLanguage: "it-IT",
      isPartOf: { "@id": new URL("/#website", site).href },
      about: [{ "@id": orgId }, { "@id": url + "#service" }],
      primaryImageOfPage: { "@type": "ImageObject", url: image },
      breadcrumb: { "@id": url + "#breadcrumb" },
      speakable: { "@type": "SpeakableSpecification", cssSelector: [".answer-first p"] },
    },
    { ...service, "@id": url + "#service", url },
    {
      "@type": "BreadcrumbList",
      "@id": url + "#breadcrumb",
      itemListElement: crumbs.map((c, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: c.name,
        item: c.item,
      })),
    },
    {
      "@type": "HowTo",
      "@id": url + "#howto",
      name: `Come vendere il tuo ${subject} a Orologi Famosi`,
      description: page.answer,
      step: steps.map((s, i) => ({
        "@type": "HowToStep",
        position: i + 1,
        name: s.title,
        text: s.text,
        url: url + "#come-funziona",
      })),
    },
    {
      "@type": "FAQPage",
      "@id": url + "#faq",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];
}
