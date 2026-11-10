import { describe, expect, it } from "vitest";
import { boxFaces, buildSauna, visibleBoxes, woodColours } from "@/lib/sauna-3d";
import { saunaConfigFromSelection } from "@/lib/sauna-3d-config";
import { heaters, saunaModels, woods } from "@/content/sauna-catalogue";

const select = (room: string, extra: Partial<Parameters<typeof saunaConfigFromSelection>[0]> = {}) =>
  saunaConfigFromSelection({ room, wood: "Spruce", heater: null, panel: null, accessories: [], ...extra });

describe("3D sauna preview", () => {
  it("has a colour for every wood in the builder", () => {
    for (const w of woods) expect(woodColours[w.name]).toMatch(/^#[0-9a-f]{6}$/);
  });

  it("builds every cabin in the catalogue", () => {
    for (const m of saunaModels) {
      const cfg = select(m.code);
      expect(cfg).not.toBeNull();
      const boxes = buildSauna(cfg!);
      expect(boxes.length).toBeGreaterThan(8);
      for (const b of boxes) expect(Math.min(b.w, b.h, b.d)).toBeGreaterThan(0);
    }
  });

  it("maps every heater and shows it (except in the infrared cabin)", () => {
    for (const h of heaters) {
      const cfg = select("S-02", { heater: h.name })!;
      expect(cfg.heater?.finish).toBe(h.finish);
      expect(buildSauna(cfg).some((b) => b.id === "heater")).toBe(true);
    }
    expect(buildSauna(select("IR-01", { heater: "Ember E-01" })!).some((b) => b.id === "heater")).toBe(false);
  });

  it("returns nothing until a cabin is chosen", () => {
    expect(saunaConfigFromSelection({ room: null, wood: "Spruce", heater: null, panel: null, accessories: [] })).toBeNull();
  });

  it("'See Inside' removes the front and the roof", () => {
    const boxes = buildSauna(select("S-02")!);
    const inside = visibleBoxes(boxes, true);
    expect(inside.some((b) => b.part === "front" || b.part === "roof")).toBe(false);
    expect(inside.some((b) => b.id.startsWith("bench"))).toBe(true);
  });

  it("draws six faces per box", () => {
    const [plinth] = buildSauna(select("G-02")!);
    expect(boxFaces(plinth!, 1)).toHaveLength(6);
  });
});
