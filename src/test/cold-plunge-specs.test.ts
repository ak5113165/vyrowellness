import { describe, expect, it } from "vitest";
import {
  coldPlungeLaunch,
  externalChillerSpecs,
  glacierLaunchModels,
  glacierLaunchPricing,
  glacierProjectModels,
} from "@/content/site";
import { launchModels, projectModels } from "@/content/glacier-catalogue";

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
