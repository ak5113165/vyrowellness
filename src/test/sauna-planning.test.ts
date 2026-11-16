import { describe, expect, it } from "vitest";
import { saunaModels } from "@/content/sauna-catalogue";
import {
  saunaAccessDoorFt,
  saunaFromPriceInr,
  saunaIdealFor,
  saunaRequirements,
  saunaTrustStrip,
  saunaTypeComparison,
} from "@/content/sauna-planning";

const allText = JSON.stringify({ saunaTrustStrip, saunaTypeComparison, saunaIdealFor, saunaRequirements });

describe("saunas page planning content", () => {
  it("shows the lowest listed cabin price", () => {
    expect(saunaFromPriceInr).toBe(Math.min(...saunaModels.map((m) => m.priceInr)));
    expect(saunaTrustStrip[0]).toBe("Cabins from ₹1,49,999 + 18% GST");
  });

  it("states 10-year after-sales service without naming the heater", () => {
    expect(saunaTrustStrip).toContain("10-year after-sales service");
    expect(saunaTrustStrip.join(" ")).not.toMatch(/heater/i);
  });

  it("uses the confirmed 2.5 ft access door width", () => {
    expect(saunaAccessDoorFt).toBe(2.5);
    expect(saunaRequirements.find((r) => r.label === "Access door")?.value).toContain("2.5 ft");
  });

  it("never offers a site survey or a showroom (not offered by VYRO)", () => {
    expect(allText).not.toMatch(/survey|showroom/i);
  });

  it("makes no health claims", () => {
    expect(allText).not.toMatch(/detox|cardio|heart|immun|weight loss|burn/i);
  });
});
