import { describe, expect, it } from "vitest";
import { site } from "./site";

describe("portfolio content boundaries", () => {
  it("publishes only the maintained public code in the authored order", () => {
    expect(site.publicCode.map((project) => project.name)).toEqual([
      "fpstreams",
      "dependency-checker"
    ]);
  });

  it("links the published fpstreams package", () => {
    const fpstreams = site.publicCode.find((project) => project.name === "fpstreams");
    expect(fpstreams?.packageUrl).toBe("https://pypi.org/project/fpstreams/");
  });

  it("keeps the reimbursement repository with the featured internship", () => {
    expect(site.featuredExperience.link).toEqual({
      label: "View reimbursement workflow code",
      href: "https://github.com/steventimes/Email-project-yudao"
    });
  });

  it("marks the completed 2026 Brandeis roles with their end dates", () => {
    expect(site.research.secondary.time).toBe("Jan 2026 – May 2026");
    expect(site.supportingExperience.find((item) => item.title.startsWith("Teaching Assistant"))?.time)
      .toBe("Jan 2026 – May 2026");
  });

  it("links the published paper by DOI and states the contribution boundary", () => {
    expect(site.publication.url).toBe("https://doi.org/10.1007/978-3-032-23708-8_8");
    expect(site.publication.role).toBe("Third author; contributed in a supporting role.");
  });

  it("publishes only the Software Systems Atlas deployment", () => {
    const atlas = site.otherWork.find((item) => item.id === "software-systems-atlas");
    expect(atlas?.link.href).toBe("https://software-systems-atlas.pages.dev");
    expect(atlas?.link.href).not.toContain("github.com");
  });
});
