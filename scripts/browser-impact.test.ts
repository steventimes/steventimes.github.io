import { describe, expect, it } from "vitest";
import { requiresBrowser } from "./browser-impact.mjs";

describe("browser impact routing", () => {
  it("leaves documentation and unit-only changes to the build checks", () => {
    expect(
      requiresBrowser([
        "README.md",
        "PLAN.md",
        "docs/history/accepted-local-deliveries.md",
        "output/review.json",
        ".github/readme/banner.svg",
        "src/data/site.test.ts",
        "scripts/browser-impact.test.ts",
        "vitest.config.ts",
        ".gitignore",
      ]),
    ).toBe(false);
  });

  it.each([
    "src/data/site.ts",
    "src/components/Hero.astro",
    "src/styles/global.css",
    "public/resume.pdf",
    "package.json",
    "package-lock.json",
    "astro.config.mjs",
    "tsconfig.json",
    "playwright.config.ts",
    "playwright.built.config.ts",
    "tests/portfolio.spec.ts",
    "tests/preview.mjs",
    "scripts/browser-impact.mjs",
    ".github/workflows/deploy_website.yml",
    ".nvmrc",
    ".npmrc",
    "new-build-input.js",
  ])("keeps UI, dependencies and unknown inputs covered: %s", (path) => {
    expect(requiresBrowser(["README.md", path])).toBe(true);
  });
});
