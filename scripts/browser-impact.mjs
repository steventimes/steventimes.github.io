import { appendFileSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

export function requiresBrowser(paths) {
  return paths.some((path) => !(
    ["README.md", "PLAN.md", ".gitignore", "vitest.config.ts"].includes(path) ||
    path.startsWith("docs/") || path.startsWith("output/") ||
    path.startsWith(".github/readme/") ||
    (path.startsWith("src/") && path.endsWith(".test.ts")) ||
    (path.startsWith("scripts/") && path.endsWith(".test.ts"))
  ));
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  let browser = true;
  if (process.env.GITHUB_EVENT_NAME === "push") {
    const event = JSON.parse(readFileSync(process.env.GITHUB_EVENT_PATH, "utf8"));
    const before = event.before;
    if (typeof before === "string" && /^[a-f0-9]{40}$/.test(before) && !/^0+$/.test(before)) {
      const base = spawnSync("git", ["cat-file", "-e", `${before}^{commit}`]);
      if (base.status === 0) {
        const diff = spawnSync("git", ["diff", "--name-only", "--no-renames", "-z", before, "HEAD"], { encoding: "utf8" });
        if (diff.status !== 0) throw new Error(`Cannot read push diff: ${diff.stderr}`);
        browser = requiresBrowser(diff.stdout.split("\0").filter(Boolean));
      }
    }
  }
  appendFileSync(process.env.GITHUB_OUTPUT, `browser=${browser}\n`);
}
