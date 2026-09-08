# Personal Website

Hongchen (Steven) Yang's technical portfolio presents database systems research, engineering work, experience, public code, and contact details.

`src/data/site.ts` is the source for visible portfolio facts. Astro components render that content into a static page.

## Development

Use Node 22.12 or newer.

```sh
npm ci
npm run dev
```

## Verification

```sh
npx playwright install chromium
npm run verify:all
```

`npm run verify` runs type checks, unit tests, and the production build. The full check also runs browser tests for page content, responsive layout, contrast, and navigation without JavaScript.

## Site behavior

The Public Code section renders the curated projects from `src/data/site.ts` as static HTML.

Mobile navigation uses native `details` markup, so section and résumé links remain available without JavaScript.

## Deployment

The GitHub Actions workflow runs the full check, including browser tests, before deploying `dist/` to GitHub Pages.
