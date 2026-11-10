// VYRO sauna catalogue — VYRO's own series names and imagery.
// Product photos are AI-generated VYRO-branded renders (all cabins shown in
// spruce, the standard wood). Replace with real product photography when ready.
// Sizes are indicative ranges; confirm final dimensions per project.

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
    short: "A slim cabin made for apartments and smaller rooms.",
    about:
      "Designed for urban homes — a compact spruce cabin with a clean front and the heater tucked out of sight.",
    image: c01,
  },
];

// minWidthM / maxWidthM are the same indicative ranges as `spec`, as numbers
// for the "which cabin fits" helper (a test keeps them in step).
export const roomSizes = [
  { name: "Small", spec: "Approx. 1.2m–1.5m wide", people: "1–3 people", minWidthM: 1.2, maxWidthM: 1.5 },
  { name: "Medium", spec: "Approx. 1.4m–1.9m wide", people: "4–6 people", minWidthM: 1.4, maxWidthM: 1.9 },
  { name: "Large", spec: "Approx. 1.9m–2.2m wide", people: "6+ people", minWidthM: 1.9, maxWidthM: 2.2 },
] as const;

export type SaunaModel = {
  code: string;
  name: string;
  size: "Small" | "Medium" | "Large";
  /** Only when a model's capacity differs from its size group (taken from its own description). */
  people?: string;
  type: RoomType["id"];
  copy: string;
  image: string;
};

export const saunaModels: SaunaModel[] = [
  { code: "S-01", name: "Haven Classic", size: "Small", type: "standard", image: s01, copy: "A compact traditional cabin for 1–3 people — perfect for private sessions and smaller spaces." },
  { code: "S-02", name: "Haven Classic", size: "Medium", type: "standard", image: s02, copy: "A versatile cabin for 4–6 people, ideal for families and shared sessions." },
  { code: "S-03", name: "Haven Classic", size: "Large", type: "standard", image: s03, copy: "A generous room for 6 or more — for larger homes, clubs and wellness spaces." },
  { code: "G-01", name: "Haven Glass", size: "Small", type: "glass-front", image: g01, copy: "A 1–3 person cabin with a full glass front that brings in light." },
  { code: "G-02", name: "Haven Glass", size: "Medium", type: "glass-front", image: g02, copy: "For 4–6 people — spacious comfort behind a clean glass façade." },
  { code: "G-03", name: "Haven Glass", size: "Large", type: "glass-front", image: g03, copy: "A 6+ person statement sauna with a wide, striking glass front." },
  { code: "IR-01", name: "Haven Infrared", size: "Small", type: "infrared", image: ir01, people: "1–2 people", copy: "A compact infrared cabin for 1–2 people with gentle radiant warmth." },
  { code: "C-01", name: "Haven Compact", size: "Small", type: "compact", image: c01, copy: "A slim, space-saving cabin made for apartments and smaller rooms." },
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

export const heaters = [
  { name: "Ember E-01", kind: "Floor Heater", image: e01, copy: "A stainless floor-standing heater with an open stone basket for rich, even heat." },
  { name: "Ember E-02", kind: "Tower Heater", image: e02, copy: "A tall cylindrical tower holding a large stone mass for a soft, steamy atmosphere." },
  { name: "Ember E-03", kind: "Floor Heater", image: e03, copy: "A matte black heater with a deep separate stone compartment." },
  { name: "Ember E-04", kind: "Wall-Mounted Heater", image: e04, copy: "A space-saving stainless wall heater with a wide stone tray." },
  { name: "Ember E-05", kind: "Tower Heater", image: e05, copy: "A slim black tower that suits modern interiors and corner placement." },
  { name: "Ember E-06", kind: "Wall-Mounted Heater", image: e06, copy: "A classic wall heater with simple built-in knobs — traditional and easy to use." },
];

export const controlPanels = [
  { name: "Pulse CP-01", kind: "Button Control", image: cp01, copy: "A simple wall-mounted panel with two buttons and a clear display." },
  { name: "Pulse CP-02", kind: "Touch Control", image: cp02, copy: "A sleek black-glass touch panel with a single glowing dial." },
];

export const accessorySets = [
  { name: "Ritual Classic", finish: "Spruce", image: rClassic, copy: "The essentials — bucket, ladle, climate gauge and towel." },
  { name: "Ritual Essential", finish: "Spruce", image: rEssential, copy: "A fuller set with backrest, headrest, sand timer and towels." },
  { name: "Ritual Signature", finish: "Black & Spruce", image: rSignature, copy: "Matte black pieces with spruce handles, for a refined ritual." },
  { name: "Ritual Noir", finish: "Black", image: rNoir, copy: "A bold all-black geometric set with waffle towel and headrest." },
];

// ---------------------------------------------------------------- sizes ----
// Sizes are shown in feet first (how most Indian buyers measure rooms), with
// metres in brackets. Per-cabin dimensions aren't confirmed yet, so each cabin
// shows its size group's indicative width range.

const M_TO_FT = 3.28084;

export type RoomSize = (typeof roomSizes)[number];

/** Metres to feet, one decimal place (1.2 → 3.9). */
export function metresToFeet(m: number): number {
  return Math.round(m * M_TO_FT * 10) / 10;
}

/** "approx. 3.9–4.9 ft wide" */
export function widthFeet(size: RoomSize): string {
  return `approx. ${metresToFeet(size.minWidthM)}–${metresToFeet(size.maxWidthM)} ft wide`;
}

/** "Approx. 3.9–4.9 ft wide (1.2–1.5 m)" */
export function widthLabel(size: RoomSize): string {
  const ft = widthFeet(size);
  return `${ft.charAt(0).toUpperCase()}${ft.slice(1)} (${size.minWidthM}–${size.maxWidthM} m)`;
}

/** Size line for one cabin: width range of its group + its capacity. */
export function modelSize(model: SaunaModel): { width: string; widthShort: string; people: string } {
  const group = roomSizes.find((r) => r.name === model.size) ?? roomSizes[0];
  return {
    width: widthLabel(group),
    widthShort: widthFeet(group),
    people: model.people ?? group.people,
  };
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

