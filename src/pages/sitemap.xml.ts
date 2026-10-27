import type { APIRoute } from "astro";
import { landings } from "../data/landings";
export const GET: APIRoute = ({ site }) =>
  new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${site && import.meta.env.PUBLIC_INDEXABLE === "true" ? landings.map((p) => `<url><loc>${new URL("/" + p.slug + "/", site)}</loc></url>`).join("") : ""}</urlset>`,
    { headers: { "Content-Type": "application/xml; charset=utf-8" } },
  );
