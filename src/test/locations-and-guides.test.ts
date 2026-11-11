import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { cityPages, coldPlungeServed } from "@/content/locations";
import { guides } from "@/content/guides";
import { coldPlungeLaunch } from "@/content/site";
import { saunaModels } from "@/content/sauna-catalogue";
import { launchModelBySlug } from "@/content/glacier-catalogue";

const sitemap = readFileSync("public/sitemap.xml", "utf8");
const textOf = (v: unknown) => JSON.stringify(v).toLowerCase();

describe("city pages", () => {
  it("has a page for every cold plunge installation city", () => {
    for (const city of coldPlungeLaunch.serviceLocations) {
      const page = cityPages.find((c) => c.city === city);
      expect(page, city).toBeDefined();
      expect(coldPlungeServed(page!)).toBe(true);
    }
  });

  it("only recommends products that exist", () => {
    for (const c of cityPages)
      for (const p of c.picks) {
        if (p.kind === "sauna") expect(saunaModels.some((m) => m.code === p.code), p.code).toBe(true);
        else expect(launchModelBySlug(p.slug), p.slug).toBeDefined();
      }
  });

  it("never names the manufacturing city or makes delivery-time promises", () => {
    for (const c of cityPages) {
      expect(textOf(c)).not.toMatch(/made in delhi|manufactured in|within \d+ (days|weeks)/);
    }
  });

  it("is in the sitemap", () => {
    expect(sitemap).toContain("https://vyrowellness.in/locations</loc>");
    for (const c of cityPages) expect(sitemap).toContain(`/locations/${c.slug}</loc>`);
  });
});

describe("buying guides", () => {
  it("have unique slugs and are in the sitemap", () => {
    expect(new Set(guides.map((g) => g.slug)).size).toBe(guides.length);
    for (const g of guides) expect(sitemap).toContain(`/guides/${g.slug}</loc>`);
  });

  it("make no health or medical claims", () => {
    const banned = /\b(cure|cures|detox|immunity|immune|weight loss|burn calories|treat(s|ment)? |medical|disease|heal(s|ing)?|clinically|proven)\b/;
    for (const g of guides) expect(textOf(g), g.slug).not.toMatch(banned);
  });

  it("states the confirmed cold plunge requirements", () => {
    const g = textOf(guides.find((x) => x.slug === "cold-plunge-installation-checklist"));
    expect(g).toContain("3°c");
    expect(g).toContain("single phase");
    expect(g).toContain("1 water inlet point");
    expect(g).toContain("1 drain point");
  });
});
