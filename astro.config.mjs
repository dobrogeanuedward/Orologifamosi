import { defineConfig } from "astro/config";
const site = process.env.SITE_URL;
if (site && !/^https:\/\/[^/]+\/?$/.test(site))
  throw new Error("SITE_URL deve essere un’origine HTTPS senza percorso.");
export default defineConfig({
  site,
  output: "static",
  trailingSlash: "always",
});
