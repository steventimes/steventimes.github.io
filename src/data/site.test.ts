import { describe, expect, it } from "vitest";
import { site } from "./site";

describe("portfolio content boundaries", () => {
  it("links the introduction to the authored GitHub profile", () => {
    expect(site.profile.githubUrl).toBe("https://github.com/steventimes");
  });

  it("publishes only the maintained public code in the authored order", () => {
    expect(site.publicCode.map((project) => project.name)).toEqual([
      "fpstreams",
      "dependency-checker"
    ]);
  });

  it("links the package and preserves the script example entry point", () => {
    const fpstreams = site.publicCode.find((project) => project.name === "fpstreams");
    expect(fpstreams?.packageUrl).toBe("https://pypi.org/project/fpstreams/");
    expect(fpstreams?.homepage).toBe("https://steventimes.github.io/fpstreams/");
    expect(fpstreams?.corpusUrl).toBe("https://hub.xerj.org/contributors/steventimes");
    expect(fpstreams?.preview.kind).toBe("code");
    if (fpstreams?.preview.kind === "code") {
      expect(fpstreams.preview.content).toContain("from fpstreams import flow");
      expect(fpstreams.preview.content).toContain("print(");
    }
  });

  it("keeps the reimbursement repository with the featured internship", () => {
    expect(site.featuredExperience.time).toBe("Jun 2026 to Aug 2026");
    expect(site.featuredExperience.link).toEqual({
      label: "View reimbursement workflow code",
      href: "https://github.com/steventimes/Email-project-yudao"
    });
  });

  it("marks the completed 2026 Brandeis roles with their end dates", () => {
    expect(site.research.secondary.time).toBe("Jan 2026 to May 2026");
    expect(site.supportingExperience.find((item) => item.title.startsWith("Teaching Assistant"))?.time)
      .toBe("Jan 2026 to May 2026");
  });

  it("links the published paper by DOI and states the contribution boundary", () => {
    expect(site.publication.url).toBe("https://doi.org/10.1007/978-3-032-23708-8_8");
    expect(site.publication.role).toBe("Third author. Contributed in a supporting role.");
  });

  it("publishes the selected other work and its public destinations", () => {
    expect(site.otherWork.map((item) => item.id)).toEqual(["blacklight", "notebook-git-marks"]);
    const notebook = site.otherWork.find((item) => item.id === "notebook-git-marks");
    expect(notebook?.links.map((link) => link.href)).toEqual([
      "https://marketplace.visualstudio.com/items?itemName=StevenYang0316-5274.notebook-git-gutter",
      "https://github.com/steventimes/git-for-jupyterNotebook"
    ]);
  });
});
