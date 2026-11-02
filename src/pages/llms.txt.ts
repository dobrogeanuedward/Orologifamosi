import type { APIRoute } from "astro";
import { landings } from "../data/landings";
import { business, brands } from "../data/business";
import { areas } from "../data/coverage";

// Sintesi per assistenti AI (GEO): solo fatti presenti sulle landing.
export const GET: APIRoute = ({ site }) => {
  const abs = (path: string) => (site ? new URL(path, site).href : path);
  const lines = [
    "# Orologi Famosi · Acquisto da privati",
    "",
    `> Servizio di valutazione e acquisto di orologi di lusso usati da privati di ${business.legalName}. Sede unica a ${business.locality} (BO), ${business.street}, su appuntamento. Richieste a distanza da tutta Italia, anche su WhatsApp. Nessuna stima automatica: la proposta d’acquisto segue la verifica dell’orologio.`,
    "",
    "## Pagine",
    ...landings.map((p) => `- [${p.title}](${abs("/" + p.slug + "/")}): ${p.answer}`),
    "",
    "## Fatti",
    `- Titolare: ${business.owner}. Attività fondata nel ${business.foundingDate}.`,
    `- Indirizzo: Centro Commerciali Medici, ${business.street}, ${business.postcode} ${business.locality} (BO), Italia.`,
    `- Telefono e WhatsApp: ${business.phone}. Email: ${business.email}. P. IVA ${business.vat}.`,
    `- Marchi esaminati: ${brands.join(", ")}. L’interesse all’acquisto si valuta sul singolo esemplare.`,
    `- Bacino territoriale, comuni da cui si può iniziare a distanza (non sono sedi): Bologna, ${areas.flatMap((a) => a.towns).join(", ")}.`,
    `- Catalogo di orologi in vendita: ${business.original}`,
    "",
  ];
  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
