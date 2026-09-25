import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { siteConfig } from "./site";

/**
 * R6: the phone number must live in exactly one file. This walks the source
 * tree and fails if the raw digits show up anywhere outside site.ts (or this
 * test) — the guard a code review can't reliably catch by eye.
 */
function walk(dir: string, files: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      walk(full, files);
    } else if (/\.(ts|tsx)$/.test(entry)) {
      files.push(full);
    }
  }
  return files;
}

describe("site config", () => {
  it("exposes the confirmed business facts", () => {
    expect(siteConfig.shopName).toBe("Baber Tyres Corporation");
    expect(siteConfig.city).toBe("Karachi");
    expect(siteConfig.hours.closedDay).toBe("Sunday");
    expect(siteConfig.hours.openDays).toHaveLength(6);
  });

  it("is the only file containing the raw phone digits", () => {
    const digits = siteConfig.phoneE164.replace(/[^\d]/g, "");
    const srcDir = path.resolve(__dirname, "..");
    const offenders: string[] = [];

    for (const file of walk(srcDir)) {
      if (file.endsWith(path.join("lib", "site.ts"))) continue;
      if (file.endsWith(path.join("lib", "site.test.ts"))) continue;

      const content = readFileSync(file, "utf-8");
      if (content.includes(digits)) {
        offenders.push(file);
      }
    }

    expect(offenders).toEqual([]);
  });
});
