import { preview } from "astro";

// Keep the server in the foreground so Playwright manages its lifetime.
await preview({
  server: { host: "127.0.0.1", port: 4322 }
});
