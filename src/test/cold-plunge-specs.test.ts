import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  coldPlungeLaunch,
  externalChillerSpecs,
  externalChillerLaunch,
  glacierDimensions,
  glacierLaunchModels,
  glacierLaunchPricing,
  glacierProjectModels,
  glacierWaterCapacityLitres,
} from "@/content/site";
import {
  chillerRequirements,
  chillers,
  fromPrice,
  launchModels,
  launchPrice,
  projectModels,
  upgradePrice,
  waterCapacity,
} from "@/content/glacier-catalogue";

describe("Confirmed Cold Plunge launch and installation facts", () => {
  it("launches on 1 January 2027", () => {
    expect([coldPlungeLaunch.day, coldPlungeLaunch.month, coldPlungeLaunch.year]).toEqual([1, 1, 2027]);
    expect(coldPlungeLaunch.label).toBe("1 January 2027");
  });
  it("is manufactured in Delhi", () => {
    expect(coldPlungeLaunch.manufacturingLocation).toBe("Delhi");
  });
  it("initially serves only the four supplied locations", () => {
    expect(coldPlungeLaunch.serviceLocations).toEqual(["Delhi NCR", "Bangalore", "Mumbai", "Goa"]);
  });
  it("offers 1HP and 2HP external systems", () => {
    expect(externalChillerSpecs.horsepowerOptions).toEqual([1, 2]);
  });
  it("specifies cooling down to 3 degrees Celsius", () => {
    expect(externalChillerSpecs.minimumTemperatureC).toBe(3);
  });
  it("requires one water inlet point", () => {
    expect(externalChillerSpecs.waterInletPoints).toBe(1);
  });
  it("requires a single-phase supply", () => {
    expect(externalChillerSpecs.electricalPhase).toBe("Single phase");
  });
  it("lists 2.5 or 4 square millimetre wiring", () => {
    expect(externalChillerSpecs.wiringOptionsMm2).toEqual([2.5, 4]);
  });
  it("requires one drain point for discharge when needed", () => {
    expect(externalChillerSpecs.drainPoints).toBe(1);
  });
});

describe("Glacier launch line-up", () => {
  it("launches only Barrel, Portable and Acrylic", () => {
    expect(glacierLaunchModels).toEqual(["Glacier Barrel", "Glacier Portable", "Glacier Acrylic"]);
    expect(launchModels.map((m) => m.name)).toEqual([...glacierLaunchModels]);
  });
  it("keeps every other design as a coming-soon project model", () => {
    expect(projectModels.map((m) => m.name)).toEqual([...glacierProjectModels]);
    for (const name of glacierProjectModels) {
      expect(glacierLaunchModels as readonly string[]).not.toContain(name);
    }
  });
  it("uses the same comparison rows for every launch model", () => {
    const labels = launchModels.map((m) => m.specs.map((s) => s.label).join("|"));
    expect(new Set(labels).size).toBe(1);
  });
  it("only states the confirmed minimum temperature", () => {
    for (const m of launchModels) {
      expect(m.specs.find((s) => s.label === "Lowest water temperature")?.value).toBe(
        `Down to ${externalChillerSpecs.minimumTemperatureC}°C`,
      );
    }
  });
  it("has a pricing slot for each launch model", () => {
    expect(Object.keys(glacierLaunchPricing).sort()).toEqual([...glacierLaunchModels].sort());
  });
});

describe("Confirmed Glacier pricing and sizes", () => {
  it("uses the confirmed MRPs, each with the 1HP chiller", () => {
    expect(glacierLaunchPricing["Glacier Barrel"].priceInr).toBe(217999);
    expect(glacierLaunchPricing["Glacier Portable"].priceInr).toBe(324999);
    expect(glacierLaunchPricing["Glacier Acrylic"].priceInr).toBe(377999);
    expect(externalChillerLaunch.includedWithLaunchModels).toBe(1);
    expect(externalChillerLaunch.upgradeOption).toBe(2);
  });
  it("includes the 1HP chiller and installation in every MRP", () => {
    for (const name of glacierLaunchModels) {
      expect(glacierLaunchPricing[name].note).toBe("Includes 1HP chiller and installation · 18% GST extra");
    }
  });
  it("prices the 2HP upgrade at ₹1,19,999", () => {
    expect(externalChillerLaunch.upgradePriceInr).toBe(119999);
    expect(upgradePrice).toBe("+₹1,19,999");
  });
  it("states water capacity as a 250–350 L range", () => {
    expect(glacierWaterCapacityLitres).toEqual({ min: 250, max: 350 });
    expect(waterCapacity).toBe("250–350 L");
  });
  it("formats prices in Indian notation", () => {
    expect(launchPrice("Glacier Barrel").display).toBe("₹2,17,999");
    expect(fromPrice).toBe("₹2,17,999");
  });
  it("uses the confirmed chiller-only MRPs and launches chillers with the tubs", () => {
    expect(externalChillerLaunch.standaloneMrpInr).toEqual({ 1: 177999, 2: 297999 });
    expect(chillers.map((c) => c.mrpInr)).toEqual([177999, 297999]);
    expect(externalChillerLaunch.launchesWithTubs).toBe(true);
  });
  it("uses the confirmed sizes", () => {
    expect(glacierDimensions["Glacier Barrel"]).toBe("2.5 ft diameter · 30 in deep");
    expect(glacierDimensions["Glacier Portable"]).toBe("5 × 2.5 ft · 30 in deep");
    expect(glacierDimensions["Glacier Acrylic"]).toBe("5 × 2.5 ft · 30 in deep");
    for (const m of launchModels) {
      expect(m.specs.find((s) => s.label === "Size")?.value).toBe(glacierDimensions[m.name]);
    }
  });
});

describe("Origin wording", () => {
  it('says "Made in India" on the site, never the manufacturing city', () => {
    expect(coldPlungeLaunch.madeIn).toBe("India");
    const dirs = ["src/routes", "src/components", "src/content"];
    for (const dir of dirs) {
      for (const file of readdirSync(dir).filter((f) => /\.tsx?$/.test(f))) {
        const text = readFileSync(join(dir, file), "utf8");
        if (file !== "site.ts") expect(text, file).not.toContain("manufacturingLocation");
        expect(text, file).not.toMatch(/made in delhi/i);
      }
    }
  });
});

describe("Cold plunge installation requirements", () => {
  it("lists power, wiring, water inlet and drainage", () => {
    expect(chillerRequirements.map((r) => r.label)).toEqual([
      "Lowest water temperature",
      "Power supply",
      "Wiring",
      "Water supply",
      "Drainage",
    ]);
    expect(chillerRequirements.find((r) => r.label === "Water supply")?.value).toBe("1 water inlet point");
  });
});


describe("GST", () => {
  it("shows every MRP as exclusive of 18% GST", async () => {
    const { pricesExcludeGst, glacierLaunchPricing } = await import("@/content/site");
    expect(pricesExcludeGst).toBe(true);
    for (const p of Object.values(glacierLaunchPricing)) expect(p.note).toContain("18% GST extra");
  });
});
