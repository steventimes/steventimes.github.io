import { expect, test } from "@playwright/test";
import { site } from "../src/data/site";

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
    name: site.name
  })).toHaveCount(1);
  await expect(introduction.getByText(
    site.profile.intro,
    { exact: true }
  )).toBeVisible();
  await expect(introduction.getByRole("link", { name: "Email", exact: true })).toHaveAttribute("href", /^mailto:/);
  await expect(introduction.getByRole("link", { name: "GitHub", exact: true })).toHaveAttribute(
    "href",
    site.profile.githubUrl
  );
  await expect(introduction.getByRole("link", { name: "Résumé", exact: true })).toHaveAttribute("href", site.profile.resumePath);
  await expect(introduction.getByText("B.S. Computer Science", { exact: true })).toBeVisible();

  await expect(page.getByRole("heading", {
    level: 3,
    name: site.research.primary.title
  })).toBeVisible();
  await expect(page.getByRole("heading", {
    level: 3,
    name: site.research.secondary.title
  })).toBeVisible();
});

test("copies a research deep link with keyboard and reports clipboard failure", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: async (text: string) => { (window as any).sharedLink = text; } }, configurable: true
    });
  });
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto("/?source=portfolio#research");
  const research = page.locator("#fluidlsm");
  const link = research.getByRole("link", { name: /Link to FluidLSM/ });
  const button = research.getByRole("button", { name: /Copy link to FluidLSM/ });
  await link.focus();
  await page.keyboard.press("Tab");
  await expect(button).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(research.getByRole("status")).toHaveText("Link copied.");
  expect(await page.evaluate(() => (window as any).sharedLink)).toBe(`${new URL(page.url()).origin}/?source=portfolio#fluidlsm`);
  await expect(button).toBeFocused();
  await page.evaluate(() => Object.defineProperty(navigator, "clipboard", { value: { writeText: () => Promise.reject(new Error("denied")) }, configurable: true }));
  await button.click();
  await expect(research.getByRole("status")).toHaveText("Copy failed. Use the research link to copy it.");
  await expect(button).toBeFocused();
  await page.evaluate(() => Object.defineProperty(navigator, "clipboard", { value: undefined, configurable: true }));
  await button.click();
  await expect(research.getByRole("status")).toHaveText("Copy unavailable. Use the research link to copy it.");
  await expect(link).toHaveAttribute("href", "#fluidlsm");
});

test("research deep links locate their content with JavaScript disabled", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 320, height: 844 }, reducedMotion: "reduce" });
  const page = await context.newPage();
  for (const id of ["fluidlsm", "fragmented-data"]) {
    await page.goto(`/#${id}`);
    const article = page.locator(`#${id}`);
    await expect(article.getByRole("link", { name: /Link to/ })).toHaveAttribute("href", `#${id}`);
    await expect(article.getByRole("button", { name: /Copy link/ })).toHaveCount(0);
    const position = await article.locator("h3").evaluate((heading) => ({
      top: heading.getBoundingClientRect().top,
      header: document.querySelector(".site-header")!.getBoundingClientRect().bottom
    }));
    expect(position.top).toBeGreaterThanOrEqual(position.header);
    expect(position.top).toBeLessThan(844);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
  }
  await context.close();
});

test("keeps section order, unique anchors and valid fragment destinations", async ({ page }) => {
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

test("renders the authored publication and internship in context", async ({ page }) => {
  await page.goto("/");
  const publication = page.locator("#publication");
  await expect(publication.getByRole("heading", { level: 3, name: site.publication.title })).toBeVisible();
  await expect(publication.getByRole("link", { name: /View paper/ })).toHaveAttribute("href", site.publication.url);
  await expect(publication.getByText(site.publication.role, { exact: true })).toBeVisible();

  const internship = page.locator(".experience-feature");
  await expect(internship.getByRole("heading", { name: site.featuredExperience.title })).toBeVisible();
  await expect(internship.getByText(site.featuredExperience.organization, { exact: true })).toBeVisible();
  await expect(internship.getByText(site.featuredExperience.time, { exact: true })).toBeVisible();
  await expect(internship.getByRole("link", { name: site.featuredExperience.link.label }))
    .toHaveAttribute("href", site.featuredExperience.link.href);
  await expect(internship.locator(".experience-feature__work > li"))
    .toHaveText(site.featuredExperience.contributions);
  for (const item of site.supportingExperience) {
    const article = page.locator(".experience-list article").filter({
      has: page.getByRole("heading", { name: item.title })
    });
    await expect(article.getByText(item.time, { exact: true })).toBeVisible();
  }
});

test("renders the curated public projects and their destinations", async ({ page }) => {
  await page.goto("/");
  const projects = page.locator("#code .project-row");
  await expect(projects).toHaveCount(site.publicCode.length);
  for (const [index, project] of site.publicCode.entries()) {
    const row = projects.nth(index);
    await expect(row.getByRole("heading", { name: project.name })).toBeVisible();
    await expect(row.getByText(project.description, { exact: true })).toBeVisible();
    for (const [label, href] of [["PyPI", project.packageUrl], ["Docs", project.homepage], ["GitHub", project.url], ["XERJ Hub", project.corpusUrl]] as const) {
      if (href) {
        const name = label === "Docs" ? `${project.name} Docs` : `${project.name} on ${label}`;
        await expect(row.getByRole("link", { name, exact: true })).toHaveAttribute("href", href);
      }
    }
    if (project.preview.kind === "evidence") {
      await expect(row.locator(".project-evidence dt")).toHaveText(project.preview.items.map((item) => item.source));
      await expect(row.locator(".project-evidence dd")).toHaveText(project.preview.items.map((item) => item.purpose));
    }
  }
  await expect(page.locator("#other-work article")).toHaveCount(site.otherWork.length);
  for (const item of site.otherWork) {
    const article = page.locator(`#${item.id}`);
    await expect(article.getByRole("heading", { name: item.title })).toBeVisible();
    for (const link of item.links) {
      await expect(article.getByRole("link", { name: link.label })).toHaveAttribute("href", link.href);
    }
  }
});

test("copies the complete example by click and keyboard without moving focus", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: async (text: string) => { (window as any).copiedText = text; } }
    });
  });
  await page.goto("/");
  const button = page.getByRole("button", { name: "Copy code" });
  const status = page.locator(".project-example__status");
  const preview = site.publicCode.find((project) => project.preview.kind === "code")!.preview;
  if (preview.kind !== "code") throw new Error("Missing code example");
  const expected = preview.content;
  await page.getByRole("link", { name: /View reimbursement workflow code/ }).focus();
  await page.keyboard.press("Tab");
  await expect(page.locator("#fpstreams").getByRole("link", { name: "fpstreams", exact: true })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(button).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(status).toHaveText("Code copied.");
  expect(await page.evaluate(() => (window as any).copiedText)).toBe(expected);
  await expect(button).toBeFocused();
  await page.evaluate(() => { (window as any).copiedText = null; });
  await button.click();
  await expect(status).toHaveText("Code copied.");
  expect(await page.evaluate(() => (window as any).copiedText)).toBe(expected);
  await expect(button).toBeFocused();
});

test("copy controls replace old results while pending and block duplicate writes", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: {
      writeText: () => { (window as any).writes++; return (window as any).delayCopy
        ? new Promise<void>((resolve, reject) => { (window as any).finishCopy = resolve; (window as any).failCopy = reject; })
        : Promise.resolve(); }
    } });
    (window as any).writes = 0;
  });
  await page.goto("/");
  for (const [container, success] of [["#fpstreams .project-example", "Code copied."], ["#fluidlsm .research-share", "Link copied."]]) {
    const region = page.locator(container);
    const button = region.getByRole("button");
    const status = region.getByRole("status");
    await button.focus();
    await page.keyboard.press("Enter");
    await expect(status).toHaveText(success);
    await page.evaluate(() => { (window as any).delayCopy = true; (window as any).writes = 0; });
    await button.click();
    await expect(status).toHaveText("Copying…");
    await expect(button).toHaveAttribute("aria-disabled", "true");
    await expect(button).toHaveAttribute("aria-busy", "true");
    await button.evaluate((element: HTMLButtonElement) => element.click());
    expect(await page.evaluate(() => (window as any).writes)).toBe(1);
    await page.evaluate(() => (window as any).failCopy(new Error("denied")));
    await expect(status).toContainText("Copy failed.");
    await expect(button).not.toHaveAttribute("aria-disabled");
    await expect(button).not.toHaveAttribute("aria-busy");
    await page.evaluate(() => { (window as any).delayCopy = false; });
    await button.focus();
    await page.keyboard.press("Space");
    await expect(status).toHaveText(success);
    await expect(button).toBeFocused();
  }
});

test("work titles provide stable deep links without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 320, height: 800 }, reducedMotion: "reduce" });
  const page = await context.newPage();
  for (const id of ["fpstreams", "dependency-checker", "blacklight", "notebook-git-marks"]) {
    await page.goto(`/#${id}`);
    await page.evaluate(() => document.fonts.ready);
    const heading = page.locator(`#${id} h3`);
    await expect(heading.getByRole("link")).toHaveAttribute("href", `#${id}`);
    const position = await heading.evaluate((element) => ({
      top: element.getBoundingClientRect().top,
      header: document.querySelector(".site-header")!.getBoundingClientRect().bottom
    }));
    expect(position.top).toBeGreaterThanOrEqual(position.header);
    expect(position.top).toBeLessThan(800);
    await heading.getByRole("link").focus();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(new RegExp(`#${id}$`));
  }
  await context.close();
});

test("explains rejected and unavailable clipboard access", async ({ browser }) => {
  for (const mode of ["rejected", "unavailable"] as const) {
    const page = await browser.newPage();
    await page.addInitScript((mode) => {
      Object.defineProperty(navigator, "clipboard", {
        value: mode === "rejected" ? { writeText: () => Promise.reject(new Error("denied")) } : undefined
      });
    }, mode);
    await page.goto("/");
    const button = page.getByRole("button", { name: "Copy code" });
    await button.focus();
    await page.keyboard.press("Space");
    await expect(page.locator(".project-example__status")).toHaveText(
      mode === "rejected" ? "Copy failed. Select the code to copy it." : "Copy unavailable. Select the code to copy it."
    );
    await expect(button).toBeFocused();
    await page.close();
  }
});

test("keeps code selectable without a nonfunctional copy button when JavaScript is disabled", async ({ browser }) => {
  const preview = site.publicCode.find((project) => project.preview.kind === "code")!.preview;
  if (preview.kind !== "code") throw new Error("Missing code example");
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.getByRole("button", { name: "Copy code" })).toHaveCount(0);
  await expect(page.locator(".project-example pre code")).toBeVisible();
  await expect(page.locator(".project-example pre code")).toHaveText(preview.content);
  expect(await page.locator(".project-example pre code").evaluate((element) => getComputedStyle(element).userSelect)).not.toBe("none");
  await context.close();
});

test("keeps primary research prominent on desktop and first on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");

  const primary = await page.locator(".research-primary").boundingBox();
  const secondary = await page.locator(".research-secondary").boundingBox();
  expect(primary).not.toBeNull();
  expect(secondary).not.toBeNull();
  expect(primary!.width).toBeGreaterThan(secondary!.width);
  expect(Math.abs(primary!.y - secondary!.y)).toBeLessThan(2);
  expect(secondary!.x).toBeGreaterThanOrEqual(primary!.x + primary!.width);

  const title = page.getByRole("heading", {
    level: 3,
    name: site.research.primary.title
  });
  const box = await title.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.y).toBeLessThan(890);

  await page.setViewportSize({ width: 390, height: 844 });
  const mobilePrimary = await page.locator(".research-primary").boundingBox();
  const mobileSecondary = await page.locator(".research-secondary").boundingBox();
  expect(mobileSecondary!.y).toBeGreaterThanOrEqual(mobilePrimary!.y + mobilePrimary!.height);
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

  for (const [selector, surface] of [
    [".site-header__name", ".site-header"],
    [".hero__role", ".hero"],
    [".hero__directory-text > span", ".hero"],
    [".project-row__body > p", "#code"],
    [".project-evidence dd", "#code"],
    [".project-example pre", ".project-example pre"],
    [".project-example__copy", ".project-example__copy"],
    [".contact-block__email", "#contact"]
  ]) {
    const colors = await page.locator(selector).first().evaluate((element, surface) => ({
      text: getComputedStyle(element).color,
      background: getComputedStyle(document.querySelector(surface)!).backgroundColor
    }), surface);
    expect(contrastRatio(colors.text, colors.background), selector).toBeGreaterThanOrEqual(4.5);
  }

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
    [".research-details p", 16],
    [".research-meta", 14],
    [".experience-meta", 14],
    [".experience-list__time", 14],
    [".publication-entry__role", 14],
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

test("keeps labels readable to assistive technology", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator(".research-primary .method-line")).toContainText("RocksDB · LSM trees");
  await expect(page.locator(".experience-feature .method-line")).toContainText("Built with Java");
});

test("keeps the complete order example in a mobile scroll area", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const example = page.locator("#fpstreams pre");
  const preview = site.publicCode[0].preview;
  if (preview.kind !== "code") throw new Error("Missing code example");
  await expect(example.locator("code")).toHaveText(preview.content);
  const box = await example.boundingBox();
  expect(box!.x).toBeGreaterThanOrEqual(0);
  expect(box!.x + box!.width).toBeLessThanOrEqual(390);
  await expect(example).toHaveCSS("overflow-x", "auto");
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

  await toggle.focus();
  await page.keyboard.press("Enter");
  for (let i = 0; i < 7; i++) await page.keyboard.press("Tab");
  const email = page.locator("#about").getByRole("link", { name: "Email", exact: true });
  await expect(email).toBeFocused();
  await expect(menu).not.toHaveAttribute("open");
  await page.keyboard.press("Escape");
  await expect(email).toBeFocused();

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
    await page.getByRole("navigation", { name: "Explore my work" })
      .getByRole("link", { name: "Public code", exact: true }).click();
    await expect(page.locator("#code h2")).toBeInViewport();
    expect(await page.evaluate(() => location.hash)).toBe("#code");
    await page.locator(".site-header__name").click();
    await page.getByText("Menu", { exact: true }).click();
    await page.locator(".site-header__menu").getByRole("link", { name: "Experience", exact: true }).click();
    expect(await page.evaluate(() => location.hash)).toBe("#experience");
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
  } finally {
    await context.close();
  }
});


test("keeps section text within mobile pages at doubled browser text size", async ({ page }) => {
  const session = await page.context().newCDPSession(page);
  await session.send("Page.setFontSizes", { fontSizes: { standard: 32 } });
  for (const width of [320, 390, 860, 861]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator("html")).toHaveCSS("font-size", "32px");
    const name = await page.locator(".site-header__name").boundingBox();
    const menu = await page.locator("summary").boundingBox();
    const separated = name!.x + name!.width <= menu!.x + 1 || name!.y + name!.height <= menu!.y + 1;
    expect(separated).toBe(true);
    expect(name!.height).toBeLessThan(180);
    if (width >= 860) {
      const heading = await page.locator(".hero h1").evaluate((element) => ({
        height: element.getBoundingClientRect().height,
        lineHeight: parseFloat(getComputedStyle(element).lineHeight)
      }));
      expect(heading.height).toBeLessThanOrEqual(heading.lineHeight * 3 + 1);
    }
    await page.locator("summary").click();
    const panel = page.locator(".site-header__menu > div");
    const bounds = await panel.boundingBox();
    expect(bounds!.x).toBeGreaterThanOrEqual(0);
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width);
    const clipped = await panel.locator("a").evaluateAll((links) => links.filter((link) => {
      const range = document.createRange(); range.selectNodeContents(link);
      const outer = link.getBoundingClientRect();
      return [...range.getClientRects()].some((rect) => rect.left < outer.left - 1 || rect.right > outer.right + 1);
    }).map((link) => link.textContent));
    expect(clipped).toEqual([]);
    await page.keyboard.press("Escape");
    await expect(page.locator("summary")).toBeFocused();


    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
    for (const selector of [".hero h1", "#publication h2", "#experience h2", ".project-evidence dt", ".project-evidence dd", ".site-footer a"]) {
      const rightEdges = await page.locator(selector).evaluateAll((elements) => elements.map((element) => {
        const range = document.createRange();
        range.selectNodeContents(element);
        return range.getBoundingClientRect().right;
      }));
      for (const right of rightEdges) expect(right, selector).toBeLessThanOrEqual(width);
    }
  }
});
