import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";

const SITE = "https://steventimes.github.io";
const BASE = "/personal-website"; // if deploying to username.github.io root repo, set BASE = "/"

export default defineConfig({
  site: SITE + BASE,
  base: BASE === "/" ? undefined : BASE,
  integrations: [tailwind()]
});
