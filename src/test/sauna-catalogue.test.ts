import { describe, expect, it } from "vitest";
import { metresToFeet, modelSize, roomSizes, saunaModels, widthLabel } from "@/content/sauna-catalogue";

describe("Haven size ranges", () => {
  it("keeps numeric widths in step with the published size text", () => {
    for (const s of roomSizes) {
      expect(s.spec).toBe(`Approx. ${s.minWidthM}m–${s.maxWidthM}m wide`);
      expect(s.minWidthM).toBeLessThan(s.maxWidthM);
    }
  });
  it("has at least one model for every size", () => {
    for (const s of roomSizes) {
      expect(saunaModels.some((m) => m.size === s.name)).toBe(true);
    }
  });
});

describe("Sizes in feet", () => {
  it("converts the indicative widths to feet", () => {
    expect(roomSizes.map((r) => widthLabel(r))).toEqual([
      "Approx. 3.9–4.9 ft wide (1.2–1.5 m)",
      "Approx. 4.6–6.2 ft wide (1.4–1.9 m)",
      "Approx. 6.2–7.2 ft wide (1.9–2.2 m)",
    ]);
    expect(metresToFeet(2.2)).toBe(7.2);
  });
  it("gives every listed cabin a size in feet", () => {
    for (const m of saunaModels) expect(modelSize(m).width).toMatch(/ft wide/);
  });
  it("uses a cabin's own capacity when its description states one", () => {
    const ir01 = saunaModels.find((m) => m.code === "IR-01");
    expect(ir01 && modelSize(ir01).people).toBe("1–2 people");
  });
});

