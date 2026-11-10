import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { launchModelBySlug, launchModels } from "@/content/glacier-catalogue";
import { modelsInSeries, roomTypes, saunaModels, seriesBySlug, seriesOfModel, seriesSlug } from "@/content/sauna-catalogue";

const sitemap = readFileSync("public/sitemap.xml", "utf8");

describe("Glacier model pages", () => {
  it("has a page for each launch model", () => {
    expect(launchModels.map((m) => m.slug)).toEqual(["glacier-barrel", "glacier-portable", "glacier-acrylic"]);
    for (const m of launchModels) {
      expect(launchModelBySlug(m.slug)?.name).toBe(m.name);
      expect(sitemap).toContain(`https://vyrowellness.in/cold-plunge/${m.slug}<`);
    }
    expect(launchModelBySlug("glacier-steel")).toBeUndefined();
  });
});

describe("Haven series pages", () => {
  it("has a page for each series, listing its cabins", () => {
    expect(roomTypes.map(seriesSlug)).toEqual(["haven-classic", "haven-glass", "haven-infrared", "haven-compact"]);
    for (const t of roomTypes) {
      expect(seriesBySlug(seriesSlug(t))?.id).toBe(t.id);
      expect(modelsInSeries(t).length).toBeGreaterThan(0);
      expect(sitemap).toContain(`https://vyrowellness.in/saunas/${seriesSlug(t)}<`);
    }
  });
  it("puts every cabin in exactly one series", () => {
    const listed = roomTypes.flatMap((t) => modelsInSeries(t).map((m) => m.code)).sort();
    expect(listed).toEqual(saunaModels.map((m) => m.code).sort());
    for (const m of saunaModels) expect(seriesOfModel(m.code)?.name).toBe(m.name);
  });
});
