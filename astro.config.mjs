import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";

const SITE = "https://steventimes.github.io";
const BASE = "/";

export default defineConfig({
  site: SITE + BASE,
  base: BASE === "/" ? undefined : BASE,
  integrations: [tailwind()]
});
