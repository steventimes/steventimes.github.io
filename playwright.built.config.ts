import { defineConfig } from "@playwright/test";
import config, { previewServer } from "./playwright.config";

export default defineConfig({
  ...config,
  webServer: { ...previewServer, command: "node tests/preview.mjs" }
});
