// VYRO Glacier catalogue — product copy and imagery for the Cold Plunge page.
//
// Launch facts (date, cities, chiller ratings) and launch pricing live in
// src/content/site.ts; this file only describes the products and reads those
// values, so the page, tests and structured data never disagree.
//
// Photography: AI-generated stand-in renders (chiller display reads 3°C,
// matching the confirmed minimum). Replace with real photography before launch.

import barrelImg from "@/assets/plunge/glacier-inflatable.jpg";
import portableImg from "@/assets/plunge/glacier-portable.jpg";
import acrylicImg from "@/assets/plunge/glacier-acrylic-1hp.jpg";
import proImg from "@/assets/plunge/glacier-pro.jpg";
import steelImg from "@/assets/plunge/glacier-steel-oval.jpg";
import signatureImg from "@/assets/plunge/glacier-xtreme.jpg";
import integratedImg from "@/assets/plunge/glacier-integrated.jpg";
import chiller1Img from "@/assets/plunge/chiller-1hp.jpg";
import chiller2Img from "@/assets/plunge/chiller-2hp.jpg";

import {
  coldPlungeLaunch,
  externalChillerSpecs,
  glacierLaunchPricing,
  type GlacierLaunchModel,
} from "@/content/site";

const minTemp = `Down to ${externalChillerSpecs.minimumTemperatureC}°C`;
const power = `${externalChillerSpecs.electricalPhase} supply`;
const chillerChoice = externalChillerSpecs.horsepowerOptions.map((hp) => `${hp}HP`).join(" or ");

export type LaunchModel = {
  name: GlacierLaunchModel;
  tag: string;
  positioning: string;
  bestFor: string;
  image: string;
  alt: string;
  keyFacts: string[];
  /** Same labels, same order for every model — rendered as the comparison table. */
  specs: { label: string; value: string }[];
};

export const launchModels: LaunchModel[] = [
  {
    name: "Glacier Barrel",
    tag: "Upright · Compact",
    positioning: "The most compact way into a daily cold plunge — upright immersion in the smallest footprint of the range.",
    bestFor: "Smaller homes and first-time plungers",
    image: barrelImg,
    alt: "VYRO Glacier Barrel: an upright black inflatable cold plunge barrel with insulated lid, beside a VYRO chiller and step",
    keyFacts: ["Upright immersion", "Insulated lid with strap closures", "Pairs with a VYRO chiller and step"],
    specs: [
      { label: "Format", value: "Upright inflatable barrel" },
      { label: "Set-up", value: "Inflatable — set up anywhere" },
      { label: "Cooling", value: `External chiller, ${chillerChoice}` },
      { label: "Lowest water temperature", value: minTemp },
      { label: "Power", value: power },
    ],
  },
  {
    name: "Glacier Portable",
    tag: "Full-length · Packs away",
    positioning: "Full-body, lie-back immersion that packs away when you need the space back.",
    bestFor: "Full-body plunging in flexible spaces",
    image: portableImg,
    alt: "VYRO Glacier Portable: a full-length black inflatable cold plunge tub with insulated lid, beside a VYRO chiller",
    keyFacts: ["Full-length, lie-back immersion", "Insulated lid", "Packs away when not in use"],
    specs: [
      { label: "Format", value: "Full-length inflatable tub" },
      { label: "Set-up", value: "Inflatable — packs away" },
      { label: "Cooling", value: `External chiller, ${chillerChoice}` },
      { label: "Lowest water temperature", value: minTemp },
      { label: "Power", value: power },
    ],
  },
  {
    name: "Glacier Acrylic",
    tag: "Rigid acrylic · 1HP chiller",
    positioning: "A rigid, gloss-white tub paired with the VYRO 1HP chiller — a dedicated cold plunge for your home.",
    bestFor: "A dedicated spot in a home wellness room",
    image: acrylicImg,
    alt: "VYRO Glacier Acrylic: a gloss-white rectangular acrylic cold plunge tub connected to a VYRO 1HP chiller",
    keyFacts: ["Gloss-white acrylic finish", "Paired with the VYRO 1HP chiller", "Rigid tub for a dedicated spot"],
    specs: [
      { label: "Format", value: "Rigid tub, gloss-white acrylic" },
      { label: "Set-up", value: "Rigid tub — dedicated placement" },
      { label: "Cooling", value: "VYRO 1HP external chiller" },
      { label: "Lowest water temperature", value: minTemp },
      { label: "Power", value: power },
    ],
  },
];

export function launchPrice(name: GlacierLaunchModel): { display: string; note: string | null } {
  const { priceInr, note } = glacierLaunchPricing[name];
  if (priceInr === null) return { display: "Price on request", note };
  const display = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(priceInr);
  return { display, note };
}

export const launchLabel = coldPlungeLaunch.label;

export type ProjectModel = { name: string; tag: string; image: string; copy: string };

// Coming soon — offered for custom and premium projects.
export const projectModels: ProjectModel[] = [
  {
    name: "Glacier Pro",
    tag: "One-piece shell",
    image: proImg,
    copy: "A sturdy one-piece shell in matte black, built for a daily cold ritual at home or in the gym.",
  },
  {
    name: "Glacier Steel",
    tag: "Stainless steel",
    image: steelImg,
    copy: "An oval stainless steel plunge with rounded ends and a brushed-metal finish, with no timber cladding.",
  },
  {
    name: "Glacier Signature",
    tag: "Timber-clad",
    image: signatureImg,
    copy: "Timber-clad with a steel rim — a statement piece for villas, wellness suites and hospitality.",
  },
  {
    name: "Glacier Integrated",
    tag: "Built-in cooling",
    image: integratedImg,
    copy: "A white all-in-one plunge with the chilling system housed inside the tub body, without a separate external unit.",
  },
];

export const chillers = [
  {
    name: "Glacier Chiller 1HP",
    hp: 1,
    image: chiller1Img,
    copy: "Our compact chilling system for home plunges and personal use. Paired with Glacier Acrylic; also suits Glacier Barrel and Portable.",
    best: "Home & personal use",
  },
  {
    name: "Glacier Chiller 2HP",
    hp: 2,
    image: chiller2Img,
    copy: "Our more powerful chilling system for larger tubs and busier spaces like gyms and spas.",
    best: "Larger tubs & commercial use",
  },
];

/** External chiller requirements, straight from the confirmed ratings. */
export const chillerRequirements = [
  { label: "Lowest water temperature", value: `${externalChillerSpecs.minimumTemperatureC}°C` },
  { label: "Power supply", value: externalChillerSpecs.electricalPhase },
  { label: "Wiring", value: `${externalChillerSpecs.wiringOptionsMm2.join(" mm² or ")} mm²` },
  {
    label: "Drainage",
    value: `${externalChillerSpecs.drainPoints} drain point, for discharge when needed`,
  },
];
