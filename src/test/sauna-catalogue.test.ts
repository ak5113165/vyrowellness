import { describe, expect, it } from "vitest";
import { roomSizes, saunaModels } from "@/content/sauna-catalogue";

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
