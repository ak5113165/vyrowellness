// VYRO sauna catalogue — VYRO's own series names and imagery.
// Product photos are AI-generated VYRO-branded renders (all cabins shown in
// spruce, the standard wood). Replace with real product photography when ready.
// Standard sizes (L × B × H, feet) confirmed by the founder on 11 Nov 2026.
// MRPs confirmed by the founder on 12 Nov 2026 (see "prices" below).

import s01 from "@/assets/products/haven-s01.jpg";
import s02 from "@/assets/products/haven-s02.jpg";
import s03 from "@/assets/products/haven-s03.jpg";
import g01 from "@/assets/products/haven-g01.jpg";
import g02 from "@/assets/products/haven-g02.jpg";
import g03 from "@/assets/products/haven-g03.jpg";
import ir01 from "@/assets/products/haven-ir01.jpg";
import c01 from "@/assets/products/haven-c01.jpg";
import e01 from "@/assets/products/ember-e01.jpg";
import e02 from "@/assets/products/ember-e02.jpg";
import e03 from "@/assets/products/ember-e03.jpg";
import e04 from "@/assets/products/ember-e04.jpg";
import e05 from "@/assets/products/ember-e05.jpg";
import e06 from "@/assets/products/ember-e06.jpg";
import cp01 from "@/assets/products/pulse-cp01.jpg";
import cp02 from "@/assets/products/pulse-cp02.jpg";
import rClassic from "@/assets/products/ritual-classic.jpg";
import rEssential from "@/assets/products/ritual-essential.jpg";
import rSignature from "@/assets/products/ritual-signature.jpg";
import rNoir from "@/assets/products/ritual-noir.jpg";
import hero from "@/assets/products/sauna-hero-spruce.jpg";
import { formatInr } from "@/lib/format-inr";

export const saunaHero = hero;

export const standardWood = "Spruce";

export type RoomType = {
  id: "standard" | "glass-front" | "infrared" | "compact";
  name: string;
  series: string;
  short: string;
  about: string;
  image: string;
};

export const roomTypes: RoomType[] = [
  {
    id: "standard",
    name: "Haven Classic",
    series: "S-Series",
    short: "The traditional Finnish sauna cabin in warm spruce, with tiered benches and a solid timber door.",
    about:
      "Our signature cabin. Clean Nordic lines, spruce inside and out, and a layout that suits private homes and shared sessions alike.",
    image: s02,
  },
  {
    id: "glass-front",
    name: "Haven Glass",
    series: "G-Series",
    short: "A full glass front that opens the room up to light and to your view.",
    about:
      "A contemporary spruce cabin with a full glass façade — an open, airy feel that becomes a design feature of the space it sits in.",
    image: g02,
  },
  {
    id: "infrared",
    name: "Haven Infrared",
    series: "IR-Series",
    short: "Gentle radiant warmth from infrared panels, for easy everyday sessions.",
    about:
      "Infrared panels warm the body with gentle radiant heat at lower air temperatures — a calm, simple option for daily use.",
    image: ir01,
  },
  {
    id: "compact",
    name: "Haven Compact",
    series: "C-Series",
    short: "A slim infrared cabin made for apartments and smaller rooms.",
    about:
      "Designed for urban homes — a compact spruce infrared cabin with a clean glass front. Infrared panels warm you gently, with no heater or stones to fit.",
    image: c01,
  },
];

// Standard cabin sizes, confirmed by the founder (11 Nov 2026), in feet:
// length (front) × breadth (depth) × height. Every cabin is 7 ft tall, and each Haven
// Glass size matches the Haven Classic of the same size.
export type DimsFt = { w: number; d: number; h: number };

export const roomSizes = [
  { name: "Small", people: "1–3 people", dimsFt: { w: 5, d: 4, h: 7 } },
  { name: "Medium", people: "4–6 people", dimsFt: { w: 6, d: 5, h: 7 } },
  { name: "Large", people: "6+ people", dimsFt: { w: 8, d: 6, h: 7 } },
] as const satisfies readonly { name: string; people: string; dimsFt: DimsFt }[];

export type SaunaModel = {
  code: string;
  name: string;
  size: "Small" | "Medium" | "Large";
  /** Only when a model's capacity differs from its size group (taken from its own description). */
  people?: string;
  type: RoomType["id"];
  /** Standard size in feet (L × B × H). */
  dimsFt: DimsFt;
  copy: string;
  image: string;
  /** Cabin MRP in INR (woodwork in spruce; Haven Glass includes the glass work), 18% GST extra. */
  priceInr: number;
  /** Infrared cabins only: the infrared panels that heat them (priced separately). */
  infraredPanels?: { name: string; kw: number; priceInr: number };
};

export const saunaModels: SaunaModel[] = [
  { code: "S-01", name: "Haven Classic", size: "Small", type: "standard", dimsFt: { w: 5, d: 4, h: 7 }, image: s01, priceInr: 186999, copy: "A compact traditional cabin for 1–3 people — perfect for private sessions and smaller spaces." },
  { code: "S-02", name: "Haven Classic", size: "Medium", type: "standard", dimsFt: { w: 6, d: 5, h: 7 }, image: s02, priceInr: 237999, copy: "A versatile cabin for 4–6 people, ideal for families and shared sessions." },
  { code: "S-03", name: "Haven Classic", size: "Large", type: "standard", dimsFt: { w: 8, d: 6, h: 7 }, image: s03, priceInr: 297499, copy: "A generous room for 6 or more — for larger homes, clubs and wellness spaces." },
  { code: "G-01", name: "Haven Glass", size: "Small", type: "glass-front", dimsFt: { w: 5, d: 4, h: 7 }, image: g01, priceInr: 217999, copy: "A 1–3 person cabin with a full glass front that brings in light." },
  { code: "G-02", name: "Haven Glass", size: "Medium", type: "glass-front", dimsFt: { w: 6, d: 5, h: 7 }, image: g02, priceInr: 256999, copy: "For 4–6 people — spacious comfort behind a clean glass façade." },
  { code: "G-03", name: "Haven Glass", size: "Large", type: "glass-front", dimsFt: { w: 8, d: 6, h: 7 }, image: g03, priceInr: 341999, copy: "A 6+ person statement sauna with a wide, striking glass front." },
  { code: "IR-01", name: "Haven Infrared", size: "Small", type: "infrared", dimsFt: { w: 4, d: 4, h: 7 }, image: ir01, people: "1–2 people", priceInr: 169999, infraredPanels: { name: "Infrared panels, 3 kW", kw: 3, priceInr: 89999 }, copy: "A compact infrared cabin for 1–2 people with gentle radiant warmth." },
  { code: "C-01", name: "Haven Compact", size: "Small", type: "compact", dimsFt: { w: 3, d: 3, h: 7 }, image: c01, people: "1 person", priceInr: 149999, infraredPanels: { name: "Infrared panels, 2 kW", kw: 2, priceInr: 69999 }, copy: "A slim, space-saving infrared cabin for one person, made for apartments and smaller rooms." },
];

export type Wood = { name: string; note: string; standard?: boolean };

export const woods: Wood[] = [
  { name: "Spruce", note: "Pale, light and clean-grained — fitted as standard on every Haven cabin.", standard: true },
  { name: "Thermo Pine", note: "Heat-treated pine with a deep caramel-brown tone." },
  { name: "Hemlock", note: "Even, straight grain in a soft light-honey colour." },
  { name: "Cedar", note: "Warm golden-brown tones with its familiar aroma." },
  { name: "Red Cedar", note: "Rich reddish-brown wood with strong natural character." },
  { name: "Aspen", note: "Very pale, smooth and nearly knot-free." },
  { name: "Eucalyptus", note: "Warm reddish tones with a fine, dense grain." },
];

// finish: the heater body as shown in its product render (used by the 3D preview).
// options: the power ratings on sale, each with its MRP. Out-of-stock heaters
// show only a "from" price and can't be chosen in the builder.
export type Heater = {
  name: string;
  finish: "stainless" | "black";
  kind: string;
  image: string;
  copy: string;
  inStock: boolean;
  options?: { kw: number; priceInr: number }[];
  fromPriceInr?: number;
};

export const heaters: Heater[] = [
  {
    name: "Ember E-01", finish: "stainless", kind: "Floor Heater", image: e01, inStock: true,
    copy: "A stainless floor-standing heater with an open stone basket for rich, even heat.",
    options: [
      { kw: 4, priceInr: 104999 },
      { kw: 6, priceInr: 114999 },
      { kw: 9, priceInr: 124999 },
      { kw: 12, priceInr: 134999 },
      { kw: 18, priceInr: 149999 },
    ],
  },
  { name: "Ember E-02", finish: "stainless", kind: "Tower Heater", image: e02, inStock: false, fromPriceInr: 119999, copy: "A tall cylindrical tower holding a large stone mass for a soft, steamy atmosphere." },
  {
    name: "Ember E-03", finish: "black", kind: "Floor Heater", image: e03, inStock: true,
    copy: "A matte black heater with a deep separate stone compartment.",
    options: [
      { kw: 4, priceInr: 124999 },
      { kw: 6, priceInr: 134999 },
      { kw: 9, priceInr: 144999 },
      { kw: 12, priceInr: 154999 },
      { kw: 18, priceInr: 169999 },
    ],
  },
  { name: "Ember E-04", finish: "stainless", kind: "Wall-Mounted Heater", image: e04, inStock: false, fromPriceInr: 79999, copy: "A space-saving stainless wall heater with a wide stone tray." },
  { name: "Ember E-05", finish: "black", kind: "Tower Heater", image: e05, inStock: false, fromPriceInr: 149999, copy: "A slim black tower that suits modern interiors and corner placement." },
  { name: "Ember E-06", finish: "stainless", kind: "Wall-Mounted Heater", image: e06, inStock: false, fromPriceInr: 79999, copy: "A classic wall heater with simple built-in knobs — traditional and easy to use." },
];

export const controlPanels = [
  { name: "Pulse CP-01", kind: "Button Control", image: cp01, inStock: true, priceInr: 15999, copy: "A simple wall-mounted panel with two buttons and a clear display." },
  { name: "Pulse CP-02", kind: "Touch Control", image: cp02, inStock: false, priceInr: 26999, copy: "A sleek black-glass touch panel with a single glowing dial." },
];

export const accessorySets = [
  { name: "Ritual Classic", finish: "Spruce", image: rClassic, priceInr: 34999, copy: "The essentials — bucket, ladle, climate gauge and towel." },
  { name: "Ritual Essential", finish: "Spruce", image: rEssential, priceInr: 41999, copy: "A fuller set with backrest, headrest, sand timer and towels." },
  { name: "Ritual Signature", finish: "Black & Spruce", image: rSignature, priceInr: 49999, copy: "Matte black pieces with spruce handles, for a refined ritual." },
  { name: "Ritual Noir", finish: "Black", image: rNoir, priceInr: 54999, copy: "A bold all-black geometric set with waffle towel and headrest." },
];

// Haven Glass: the customer chooses the glass frame finish. The cabin price
// includes the glass work; the price may vary by finish, so it's quoted.
export const glassFrameFinishes = [
  { id: "matte-black", name: "Matte black" },
  { id: "glossy-black", name: "Glossy black" },
  { id: "stainless", name: "Stainless steel" },
] as const;
export type GlassFrameFinish = (typeof glassFrameFinishes)[number]["id"];

// ---------------------------------------------------------------- sizes ----
// Sizes are shown in feet first (how most Indian buyers measure rooms), with
// metres where helpful.

export type RoomSize = (typeof roomSizes)[number];

const FT_TO_M = 0.3048;

/** Feet to metres, two decimals without trailing zeros (5 → 1.52, 7 → 2.13). */
export function feetToMetres(ft: number): number {
  return Math.round(ft * FT_TO_M * 100) / 100;
}

/** "5 × 4 × 7 ft" */
export function dimsFtLabel(d: DimsFt): string {
  return `${d.w} × ${d.d} × ${d.h} ft`;
}

/** "1.52 × 1.22 × 2.13 m" */
export function dimsMetricLabel(d: DimsFt): string {
  return `${feetToMetres(d.w)} × ${feetToMetres(d.d)} × ${feetToMetres(d.h)} m`;
}

/** "5 × 4 × 7 ft (L × B × H)" for a size group (Classic and Glass). */
export function sizeLabel(size: RoomSize): string {
  return `${dimsFtLabel(size.dimsFt)} (L × B × H)`;
}

/** Size line for one cabin: its standard dimensions and capacity. */
export function modelSize(model: SaunaModel): { dims: string; dimsShort: string; dimsMetric: string; people: string } {
  const group = roomSizes.find((r) => r.name === model.size) ?? roomSizes[0];
  return {
    dims: `${dimsFtLabel(model.dimsFt)} (L × B × H)`,
    dimsShort: dimsFtLabel(model.dimsFt),
    dimsMetric: dimsMetricLabel(model.dimsFt),
    people: model.people ?? group.people,
  };
}

/** Does a cabin's footprint fit a floor area (either way round)? Feet. */
export function fitsFloor(model: SaunaModel, roomWidthFt: number, roomLengthFt: number): boolean {
  const { w, d } = model.dimsFt;
  return (w <= roomWidthFt && d <= roomLengthFt) || (w <= roomLengthFt && d <= roomWidthFt);
}

// ------------------------------------------------------------- series ----
// Each Haven series has its own page at /saunas/<slug> (e.g. haven-classic).

export function seriesSlug(type: RoomType): string {
  return type.name.toLowerCase().replace(/\s+/g, "-");
}

export function seriesBySlug(slug: string): RoomType | undefined {
  return roomTypes.find((t) => seriesSlug(t) === slug);
}

export function modelsInSeries(type: RoomType): SaunaModel[] {
  return saunaModels.filter((m) => m.name === type.name);
}

export function seriesOfModel(code: string): RoomType | undefined {
  const model = saunaModels.find((m) => m.code === code);
  return model ? roomTypes.find((t) => t.name === model.name) : undefined;
}


// ------------------------------------------------------------- prices ----
// MRPs confirmed by the founder (12 Nov 2026), 18% GST extra, shown in the x99
// format (₹1,50,000 is shown as ₹1,49,999). Wood upgrades, the Haven Glass
// frame finish and installation & commissioning are quoted by a consultant,
// so they are not priced on the site.

/** Infrared cabins (Haven Infrared and Haven Compact) have no heater, stones or accessory set. */
export function isInfraredCabin(model: Pick<SaunaModel, "type">): boolean {
  return model.type === "infrared" || model.type === "compact";
}

/** Lowest price for a heater: its smallest rating, or its "from" price. */
export function heaterFromPrice(h: Heater): number | undefined {
  return h.options?.length ? Math.min(...h.options.map((o) => o.priceInr)) : h.fromPriceInr;
}

/** Lowest cabin MRP in a series. */
export function seriesFromPrice(type: RoomType): number | undefined {
  const prices = modelsInSeries(type).map((m) => m.priceInr);
  return prices.length ? Math.min(...prices) : undefined;
}

export type SaunaSelection = {
  room: string | null;
  heater: string | null;
  heaterKw: number | null;
  panel: string | null;
  accessories: string[];
};

export type EstimateLine = { label: string; priceInr: number };

/**
 * Running MRP (18% GST extra) for a Build Your Sauna selection. Out-of-stock items
 * and items that don't apply to the cabin (heaters and accessories in an
 * infrared cabin) are left out.
 */
export function saunaEstimate(sel: SaunaSelection): { lines: EstimateLine[]; totalInr: number } {
  const lines: EstimateLine[] = [];
  const model = saunaModels.find((m) => m.code === sel.room);
  if (model) {
    lines.push({ label: `${model.name} ${model.code} cabin (${standardWood.toLowerCase()})`, priceInr: model.priceInr });
    if (model.infraredPanels) lines.push({ label: model.infraredPanels.name, priceInr: model.infraredPanels.priceInr });
  }
  const infrared = model ? isInfraredCabin(model) : false;
  const heater = heaters.find((h) => h.name === sel.heater && h.inStock);
  const option = heater?.options?.find((o) => o.kw === sel.heaterKw);
  if (!infrared && heater && option) lines.push({ label: `${heater.name}, ${option.kw} kW`, priceInr: option.priceInr });
  const panel = controlPanels.find((p) => p.name === sel.panel && p.inStock);
  if (panel) lines.push({ label: panel.name, priceInr: panel.priceInr });
  if (!infrared) {
    for (const a of accessorySets) if (sel.accessories.includes(a.name)) lines.push({ label: a.name, priceInr: a.priceInr });
  }
  return { lines, totalInr: lines.reduce((t, l) => t + l.priceInr, 0) };
}

/** "₹1,86,999 + 18% GST", or for infrared cabins "₹1,69,999 + 3 kW infrared panels ₹89,999 · 18% GST extra". */
export function cabinPriceLabel(model: SaunaModel): string {
  return model.infraredPanels
    ? `${formatInr(model.priceInr)} + ${model.infraredPanels.kw} kW infrared panels ${formatInr(model.infraredPanels.priceInr)} · 18% GST extra`
    : `${formatInr(model.priceInr)} + 18% GST`;
}

/** Price line for a heater card: "4–18 kW · from ₹1,04,999" or "Out of stock · from ₹79,999". */
export function heaterPriceLabel(h: Heater): string {
  const from = heaterFromPrice(h);
  const fromText = from ? `from ${formatInr(from)}` : "";
  if (!h.inStock) return `Out of stock${fromText ? ` · ${fromText}` : ""}`;
  const kws = (h.options ?? []).map((o) => o.kw);
  const range = kws.length ? `${Math.min(...kws)}–${Math.max(...kws)} kW` : "";
  return [range, fromText].filter(Boolean).join(" · ");
}
