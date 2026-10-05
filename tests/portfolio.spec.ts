import { expect, test } from "@playwright/test";

const contrastRatio = (foreground: string, background: string) => {
  const parse = (color: string) => color.match(/\d+(?:\.\d+)?/g)!.slice(0, 3).map(Number);
  const luminance = (color: string) => {
    const channels = parse(color).map((channel) => {
      const value = channel / 255;
      return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
  };
  const lighter = Math.max(luminance(foreground), luminance(background));
  const darker = Math.min(luminance(foreground), luminance(background));
  return (lighter + 0.05) / (darker + 0.05);
};

test("renders the research-first hero and research hierarchy", async ({ page }) => {
  await page.goto("/");

  const introduction = page.locator("#about");
  await expect(introduction.getByRole("heading", {
    level: 1,
    name: "Hongchen (Steven) Yang"
  })).toHaveCount(1);
  await expect(introduction.getByText(
    "I study adaptive storage systems and build AI agent workflows.",
    { exact: true }
  )).toBeVisible();
  await expect(introduction.getByText("Hero", { exact: true })).toHaveCount(0);
  await expect(introduction.getByRole("link", { name: "Email", exact: true })).toHaveAttribute("href", /^mailto:/);
  await expect(introduction.getByRole("link", { name: "GitHub", exact: true })).toHaveAttribute(
    "href",
    "https://github.com/steventimes"
  );
  await expect(introduction.getByRole("link", { name: "Résumé", exact: true })).toHaveAttribute("href", "/resume.pdf");
  await expect(introduction.getByText("B.S. Computer Science", { exact: true })).toBeVisible();
  await expect(introduction.getByText("Mathematics minor", { exact: true })).toHaveCount(0);

  await expect(page.getByRole("heading", {
    level: 3,
    name: "FluidLSM and workload-aware RocksDB tuning"
  })).toBeVisible();
  await expect(page.locator(".research-trace")).toHaveCount(0);
  await expect(page.getByRole("heading", {
    level: 3,
    name: "Data fragmentation and text-to-SQL evaluation"
  })).toBeVisible();
});

test("uses the research-first page order and no runtime search hooks", async ({ page }) => {
  await page.goto("/");

  expect(await page.locator("main h2").allTextContents()).toEqual([
    "Research",
    "Publication",
    "Experience",
    "Public Code",
    "Other Work",
    "Technical Profile",
    "Contact"
  ]);

  for (const id of ["about", "research", "publication", "experience", "code", "other-work", "skills", "contact"]) {
    await expect(page.locator(`#${id}`)).toHaveCount(1);
  }

  const missingTargets = await page.locator('a[href^="#"]').evaluateAll((links) => links
    .map((link) => link.getAttribute("href")!)
    .filter((href) => !document.getElementById(href.slice(1))));
  expect(missingTargets).toEqual([]);

  await expect(page.locator("[data-command-palette], [data-command-trigger], [data-repo-cards]")).toHaveCount(0);
  const requestedUrls = await page.evaluate(() => performance
    .getEntriesByType("resource")
    .map((entry) => entry.name));
  expect(requestedUrls.some((url) => url.includes("api.github.com"))).toBe(false);
});

test("serves the résumé, portrait, favicon, and production assets", async ({ page, request }) => {
  const failures: string[] = [];
  page.on("pageerror", (error) => failures.push(error.message));
  page.on("requestfailed", (request) => failures.push(request.url()));
  page.on("response", (response) => {
    if (response.status() >= 400) failures.push(`${response.status()} ${response.url()}`);
  });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);

  const resumePath = await page.locator("#about").getByRole("link", {
    name: "Résumé", exact: true
  }).getAttribute("href");
  const resume = await request.get(resumePath!);
  expect(resume.ok()).toBe(true);
  expect(resume.headers()["content-type"]).toContain("application/pdf");
  expect((await resume.body()).subarray(0, 5).toString()).toBe("%PDF-");

  const portrait = page.getByRole("img", { name: /Hongchen.*portrait/i });
  expect(await portrait.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0))
    .toBe(true);

  const faviconPath = await page.locator('link[rel="icon"]').getAttribute("href");
  const favicon = await request.get(faviconPath!);
  expect(favicon.ok()).toBe(true);
  expect(favicon.headers()["content-type"]).toContain("image/svg+xml");
  expect(failures).toEqual([]);
});

test("shows the published paper with a DOI link and bounded role", async ({ page }) => {
  await page.goto("/");

  const publication = page.locator("#publication");
  await expect(publication.getByRole("heading", {
    level: 3,
    name: "From Single-View to Multi-view: Learning Informative Graphs for Robust Subspace Segmentation"
  })).toBeVisible();
  await expect(publication.getByRole("link", { name: /View paper/ })).toHaveAttribute(
    "href",
    "https://doi.org/10.1007/978-3-032-23708-8_8"
  );
  await expect(publication.getByText("Third author; contributed in a supporting role.", { exact: true }))
    .toBeVisible();
});

test("features the latest internship and keeps its code link in context", async ({ page }) => {
  await page.goto("/");

  const internship = page.locator(".experience-feature");
  await expect(internship.getByRole("heading", { name: "AI Development Intern" })).toBeVisible();
  await expect(internship.getByText("Hefei City Cloud Data Center Co., Ltd.", { exact: true })).toBeVisible();
  await expect(internship.getByText("Jun 2026 – Aug 2026", { exact: true })).toBeVisible();
  await expect(internship.getByRole("link", {
    name: /View reimbursement workflow code/
  })).toHaveAttribute("href", "https://github.com/steventimes/Email-project-yudao");
  await expect(internship.locator(".experience-feature__work > li")).toHaveCount(3);
  await expect(page.locator(".experience-list > li")).toHaveCount(2);
  await expect(page.locator("#code").getByText("Email-project-yudao", { exact: true })).toHaveCount(0);
});

test("renders curated public code and deployment-only other work", async ({ page }) => {
  await page.goto("/");

  const projects = page.locator("#code .project-row");
  await expect(projects).toHaveCount(2);
  await expect(page.locator("#code").getByText("Maintained public projects.", { exact: true })).toBeVisible();
  await expect(projects.nth(0).getByRole("heading", { name: "fpstreams" })).toBeVisible();
  await expect(projects.nth(0).getByRole("link", { name: /PyPI/ })).toHaveAttribute(
    "href",
    "https://pypi.org/project/fpstreams/"
  );
  await expect(projects.nth(0).getByRole("link", { name: /Docs/ })).toHaveAttribute(
    "href",
    "https://steventimes.github.io/fpstreams/"
  );
  await expect(projects.nth(1).getByRole("heading", { name: "dependency-checker" })).toBeVisible();
  await expect(projects.nth(1)).toContainText("coding-agent skill");
  await expect(page.locator("#code").getByText(/soccer-analytics|Prompt-Testing-Framework|high-ed-data-generator/)).toHaveCount(0);

  await expect(page.getByRole("link", { name: /Open Software Systems Atlas/ })).toHaveAttribute(
    "href",
    "https://software-systems-atlas.pages.dev"
  );
  await expect(page.locator('a[href*="github.com/steventimes/software-system-atlas"]')).toHaveCount(0);
});

test("stacks the related study after the primary research narrative", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");

  const primary = await page.locator(".research-primary").boundingBox();
  const secondary = await page.locator(".research-secondary").boundingBox();
  expect(primary).not.toBeNull();
  expect(secondary).not.toBeNull();
  expect(secondary!.y).toBeGreaterThanOrEqual(primary!.y + primary!.height);
});

test("uses comfortable contrast for secondary text and structural rules", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");

  const colors = await page.locator(".research-summary").first().evaluate((element) => ({
    text: getComputedStyle(element).color,
    page: getComputedStyle(document.body).backgroundColor,
    rule: getComputedStyle(document.querySelector(".project-list")!).borderTopColor
  }));
  expect(contrastRatio(colors.text, colors.page)).toBeGreaterThanOrEqual(7);
  expect(contrastRatio(colors.rule, colors.page)).toBeGreaterThanOrEqual(1.5);

  const portrait = await page.getByRole("img", { name: /Hongchen.*portrait/i }).boundingBox();
  expect(portrait).not.toBeNull();
  expect(portrait!.width).toBeGreaterThan(220);
  expect(portrait!.width).toBeLessThan(420);
});

test("keeps supporting text at readable sizes", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");

  const minimumSizes: Array<[string, number]> = [
    [".site-header__links a", 13],
    [".hero__role", 12],
    [".research-details dd", 16],
    [".method-line", 13],
    [".experience-list article > p:last-child", 15],
    [".project-row__body > p", 16],
    [".project-row__links a", 14],
    [".technology-matrix dd", 14]
  ];

  for (const [selector, minimum] of minimumSizes) {
    const size = await page.locator(selector).first().evaluate((element) =>
      Number.parseFloat(getComputedStyle(element).fontSize)
    );
    expect(size, selector).toBeGreaterThanOrEqual(minimum);
  }
});

test("brings primary research into the first desktop viewport", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");

  const title = page.getByRole("heading", {
    level: 3,
    name: "FluidLSM and workload-aware RocksDB tuning"
  });
  const box = await title.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.y).toBeLessThan(890);
  expect(await page.evaluate(() => document.documentElement.scrollHeight)).toBeLessThan(4700);
});

test("keeps labels readable to assistive technology", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator(".research-primary .method-line")).toContainText("Methods RocksDB");
  await expect(page.locator(".experience-feature .method-line")).toContainText("Built with Java");
});

test("keeps the larger mobile layout compact", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  expect(await page.evaluate(() => document.documentElement.scrollHeight)).toBeLessThan(7300);
});

for (const viewport of [
  { width: 1440, height: 1000 },
  { width: 861, height: 1000 },
  { width: 768, height: 1024 },
  { width: 620, height: 900 },
  { width: 390, height: 844 },
  { width: 360, height: 800 },
  { width: 320, height: 800 }
]) {
  test(`has no horizontal overflow at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/");
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });
}

test("keeps mobile contact links above the portrait", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);

  const actions = await page.locator(".hero__actions").boundingBox();
  const portrait = await page.locator(".hero__portrait-frame").boundingBox();
  expect(actions).not.toBeNull();
  expect(portrait).not.toBeNull();
  expect(actions!.y + actions!.height).toBeLessThanOrEqual(portrait!.y);
  await expect(page.locator("#about").getByRole("link", { name: "Email", exact: true }))
    .toBeInViewport();
});

test("mobile menu supports dismissal and section navigation", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  const menu = page.locator(".site-header__menu");
  const toggle = menu.locator("summary");
  await toggle.click();
  await expect(menu).toHaveAttribute("open", "");
  await page.keyboard.press("Escape");
  await expect(menu).not.toHaveAttribute("open");
  await expect(toggle).toBeFocused();

  await page.keyboard.press("Enter");
  await expect(menu).toHaveAttribute("open", "");
  await page.keyboard.press("Tab");
  await expect(menu.getByRole("link", { name: "Research", exact: true })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#research$/);
  await expect(menu).not.toHaveAttribute("open");
  await expect(page.locator("#research h2")).toBeInViewport();

  await toggle.click();
  await page.locator(".site-header__name").click();
  await expect(menu).not.toHaveAttribute("open");
});

test("keyboard users can skip navigation with reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skipLink = page.getByRole("link", { name: "Skip to content" });
  await expect(skipLink).toBeFocused();
  await skipLink.hover();
  const colors = await skipLink.evaluate((element) => ({
    text: getComputedStyle(element).color,
    background: getComputedStyle(element).backgroundColor
  }));
  expect(contrastRatio(colors.text, colors.background)).toBeGreaterThanOrEqual(4.5);
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#main-content$/);
  await page.keyboard.press("Tab");
  await expect(page.locator("#about").getByRole("link", { name: "Email", exact: true }))
    .toBeFocused();
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior))
    .toBe("auto");
});

test("JavaScript-disabled mobile navigation keeps section links available", async ({ browser }) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 }
  });
  const page = await context.newPage();

  try {
    await page.goto("/");
    await page.getByText("Menu", { exact: true }).click();
    await page.getByRole("link", { name: "Experience", exact: true }).click();
    expect(await page.evaluate(() => location.hash)).toBe("#experience");
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
  } finally {
    await context.close();
  }
});
