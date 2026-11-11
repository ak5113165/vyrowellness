import { describe, expect, it } from "vitest";
import {
  accessorySets,
  cabinPriceLabel,
  controlPanels,
  heaterFromPrice,
  heaterPriceLabel,
  heaters,
  isInfraredCabin,
  roomTypes,
  saunaEstimate,
  saunaModels,
  seriesFromPrice,
} from "@/content/sauna-catalogue";
import { externalChillerLaunch, glacierLaunchPricing } from "@/content/site";
import { buildSauna } from "@/lib/sauna-3d";
import { saunaConfigFromSelection } from "@/lib/sauna-3d-config";

const model = (code: string) => saunaModels.find((m) => m.code === code)!;
const heater = (name: string) => heaters.find((h) => h.name === name)!;
const none = { room: null, heater: null, heaterKw: null, panel: null, accessories: [] };

describe("sauna prices (founder, 12 Nov 2026)", () => {
  it("prices every cabin in spruce", () => {
    expect(Object.fromEntries(saunaModels.map((m) => [m.code, m.priceInr]))).toEqual({
      "S-01": 186999,
      "S-02": 237999,
      "S-03": 297499,
      "G-01": 217999,
      "G-02": 256999,
      "G-03": 341999,
      "IR-01": 169999,
      "C-01": 149999,
    });
  });

  it("treats IR-01 and C-01 as infrared cabins with their own panels", () => {
    expect(model("IR-01").infraredPanels).toMatchObject({ kw: 3, priceInr: 89999 });
    expect(model("C-01").infraredPanels).toMatchObject({ kw: 2, priceInr: 69999 });
    expect(saunaModels.filter(isInfraredCabin).map((m) => m.code)).toEqual(["IR-01", "C-01"]);
  });

  it("offers E-01 and E-03 in five ratings and marks the rest out of stock", () => {
    expect(heater("Ember E-01").options).toEqual([
      { kw: 4, priceInr: 104999 },
      { kw: 6, priceInr: 114999 },
      { kw: 9, priceInr: 124999 },
      { kw: 12, priceInr: 134999 },
      { kw: 18, priceInr: 149999 },
    ]);
    expect(heater("Ember E-03").options?.map((o) => o.priceInr)).toEqual([124999, 134999, 144999, 154999, 169999]);
    expect(heaters.filter((h) => !h.inStock).map((h) => [h.name, h.fromPriceInr])).toEqual([
      ["Ember E-02", 119999],
      ["Ember E-04", 79999],
      ["Ember E-05", 149999],
      ["Ember E-06", 79999],
    ]);
    expect(heaterPriceLabel(heater("Ember E-01"))).toBe("4–18 kW · from ₹1,04,999");
    expect(heaterPriceLabel(heater("Ember E-04"))).toBe("Out of stock · from ₹79,999");
  });

  it("prices control panels and accessory sets", () => {
    expect(controlPanels.map((c) => [c.name, c.priceInr, c.inStock])).toEqual([
      ["Pulse CP-01", 15999, true],
      ["Pulse CP-02", 26999, false],
    ]);
    expect(accessorySets.map((a) => a.priceInr)).toEqual([34999, 41999, 49999, 54999]);
  });

  it("shows every price in the x99 format", () => {
    const all = [
      ...saunaModels.flatMap((m) => [m.priceInr, m.infraredPanels?.priceInr ?? 99]),
      ...heaters.flatMap((h) => [...(h.options ?? []).map((o) => o.priceInr), h.fromPriceInr ?? 99]),
      ...controlPanels.map((c) => c.priceInr),
      ...accessorySets.map((a) => a.priceInr),
      ...Object.values(glacierLaunchPricing).map((p) => p.priceInr ?? 99),
      externalChillerLaunch.upgradePriceInr,
      ...Object.values(externalChillerLaunch.standaloneMrpInr),
    ];
    for (const p of all) expect(p % 100).toBe(99);
  });

  it("labels cabin prices with GST extra", () => {
    expect(cabinPriceLabel(model("S-01"))).toBe("₹1,86,999 + GST");
    expect(cabinPriceLabel(model("C-01"))).toBe("₹1,49,999 + 2 kW infrared panels ₹69,999 · GST extra");
    expect(seriesFromPrice(roomTypes.find((t) => t.id === "glass-front")!)).toBe(217999);
  });

  it("lowest heater price is its smallest rating", () => {
    expect(heaterFromPrice(heater("Ember E-03"))).toBe(124999);
  });
});

describe("Build Your Sauna estimate", () => {
  it("is empty until a cabin is chosen", () => {
    expect(saunaEstimate(none)).toEqual({ lines: [], totalInr: 0 });
  });

  it("adds up a traditional sauna", () => {
    const e = saunaEstimate({ room: "S-02", heater: "Ember E-01", heaterKw: 6, panel: "Pulse CP-01", accessories: ["Ritual Classic"] });
    expect(e.lines.map((l) => l.priceInr)).toEqual([237999, 114999, 15999, 34999]);
    expect(e.totalInr).toBe(237999 + 114999 + 15999 + 34999);
  });

  it("an infrared cabin includes its panels and ignores heaters and accessories", () => {
    const e = saunaEstimate({ room: "IR-01", heater: "Ember E-01", heaterKw: 4, panel: "Pulse CP-01", accessories: ["Ritual Noir"] });
    expect(e.lines.map((l) => l.label)).toEqual(["Haven Infrared IR-01 cabin (spruce)", "Infrared panels, 3 kW", "Pulse CP-01"]);
    expect(e.totalInr).toBe(169999 + 89999 + 15999);
  });

  it("leaves out-of-stock items out", () => {
    const e = saunaEstimate({ room: "G-01", heater: "Ember E-05", heaterKw: null, panel: "Pulse CP-02", accessories: [] });
    expect(e.totalInr).toBe(217999);
  });
});

describe("3D preview pricing-related changes", () => {
  it("draws Haven Compact with infrared panels and no heater", () => {
    const boxes = buildSauna(
      saunaConfigFromSelection({ room: "C-01", wood: "Spruce", heater: "Ember E-01", panel: null, accessories: ["Ritual Classic"] })!,
    );
    expect(boxes.some((b) => b.light === "infrared")).toBe(true);
    expect(boxes.some((b) => b.id === "heater" || b.id === "bucket")).toBe(false);
  });

  it("paints the Haven Glass frame in the chosen finish", () => {
    const frame = (glassFrame: "matte-black" | "stainless") =>
      buildSauna(saunaConfigFromSelection({ room: "G-02", wood: "Spruce", heater: null, panel: null, accessories: [], glassFrame })!)
        .find((b) => b.id === "frame-top")!.color;
    expect(frame("stainless")).not.toBe(frame("matte-black"));
  });
});
