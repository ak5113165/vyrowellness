import { describe, expect, it } from "vitest";
import { dimsFtLabel, feetToMetres, fitsFloor, modelSize, roomSizes, saunaModels, sizeLabel } from "@/content/sauna-catalogue";

const byCode = (code: string) => saunaModels.find((m) => m.code === code)!;

// Standard sizes confirmed by the founder on 11 Nov 2026 (L × B × H, feet).
describe("Haven standard sizes", () => {
  it("matches the confirmed sizes for every cabin", () => {
    const expected: Record<string, string> = {
      "S-01": "5 × 4 × 7 ft",
      "S-02": "6 × 5 × 7 ft",
      "S-03": "8 × 6 × 7 ft",
      "G-01": "5 × 4 × 7 ft",
      "G-02": "6 × 5 × 7 ft",
      "G-03": "8 × 6 × 7 ft",
      "IR-01": "4 × 4 × 7 ft",
      "C-01": "3 × 3 × 7 ft",
    };
    for (const m of saunaModels) expect(modelSize(m).dimsShort, m.code).toBe(expected[m.code]);
  });

  it("is 7 ft tall for every cabin", () => {
    for (const m of saunaModels) expect(m.dimsFt.h).toBe(7);
  });

  it("keeps size groups in step with their Classic and Glass cabins", () => {
    for (const s of roomSizes) {
      for (const m of saunaModels.filter((x) => x.size === s.name && (x.type === "standard" || x.type === "glass-front"))) {
        expect(m.dimsFt).toEqual(s.dimsFt);
      }
    }
    expect(sizeLabel(roomSizes[0])).toBe("5 × 4 × 7 ft (L × B × H)");
  });

  it("converts to metres for reference", () => {
    expect(feetToMetres(7)).toBe(2.13);
    expect(dimsFtLabel(byCode("C-01").dimsFt)).toBe("3 × 3 × 7 ft");
  });

  it("uses a cabin's own capacity when its description states one", () => {
    expect(modelSize(byCode("IR-01")).people).toBe("1–2 people");
  });
});

describe("Which cabin fits", () => {
  it("checks the floor either way round", () => {
    expect(fitsFloor(byCode("S-02"), 6, 5)).toBe(true);
    expect(fitsFloor(byCode("S-02"), 5, 6)).toBe(true);
    expect(fitsFloor(byCode("S-02"), 5.9, 5)).toBe(false);
    expect(fitsFloor(byCode("C-01"), 3, 3)).toBe(true);
  });
});
