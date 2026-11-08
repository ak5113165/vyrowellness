import { describe, expect, it } from "vitest";
import { coldPlungeLaunch, externalChillerSpecs } from "@/content/site";

describe("Confirmed Cold Plunge launch and installation facts", () => {
  it("launches on 1 January without assuming a year", () => {
    expect([coldPlungeLaunch.day, coldPlungeLaunch.month]).toEqual([1, 1]);
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
  it("specifies cooling down to 5 degrees Celsius", () => {
    expect(externalChillerSpecs.minimumTemperatureC).toBe(5);
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