// VYRO Glacier catalogue — product copy and imagery for the Cold Plunge page.
//
// Launch facts (date, cities, chiller ratings) and launch pricing live in
// src/content/site.ts; this file only describes the products and reads those
// values, so the page, tests and structured data never disagree.
//
// Photography: AI-generated stand-in renders. Backgrounds were recoloured from
// pure white to the sauna renders' warm cream so both ranges match; the chiller
// display reads 3°C, matching the confirmed minimum. Replace with real
// photography before launch (see the photography brief).

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
  externalChillerLaunch,
  externalChillerSpecs,
  glacierDimensions,
  glacierLaunchPricing,
  glacierWaterCapacityLitres,
  type GlacierLaunchModel,
} from "@/content/site";

const minTemp = `Down to ${externalChillerSpecs.minimumTemperatureC}°C`;
const power = `${externalChillerSpecs.electricalPhase} supply`;
const cooling = `${externalChillerLaunch.includedWithLaunchModels}HP chiller included · ${externalChillerLaunch.upgradeOption}HP upgrade`;

export function formatInr(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export type LaunchModel = {
  name: GlacierLaunchModel;
  /** URL segment of the model page: /cold-plunge/<slug> */
  slug: string;
  size: string;
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
    slug: "glacier-barrel",
    size: glacierDimensions["Glacier Barrel"],
    tag: "Upright · Compact",
    positioning: "The most compact way into a daily cold plunge — upright immersion in the smallest footprint of the range.",
    bestFor: "Smaller homes and first-time plungers",
    image: barrelImg,
    alt: "VYRO Glacier Barrel: an upright black inflatable cold plunge barrel with insulated lid, beside a VYRO chiller and step",
    keyFacts: ["Upright immersion", "Insulated lid with strap closures", "1HP chiller and installation included"],
    specs: [
      { label: "Format", value: "Upright inflatable barrel" },
      { label: "Size", value: glacierDimensions["Glacier Barrel"] },
      { label: "Set-up", value: "Inflatable — set up anywhere" },
      { label: "Cooling", value: cooling },
      { label: "Lowest water temperature", value: minTemp },
      { label: "Power", value: power },
    ],
  },
  {
    name: "Glacier Portable",
    slug: "glacier-portable",
    size: glacierDimensions["Glacier Portable"],
    tag: "Full-length · Packs away",
    positioning: "Full-body, lie-back immersion that packs away when you need the space back.",
    bestFor: "Full-body plunging in flexible spaces",
    image: portableImg,
    alt: "VYRO Glacier Portable: a full-length black inflatable cold plunge tub with insulated lid, beside a VYRO chiller",
    keyFacts: ["Full-length, lie-back immersion", "Insulated lid · packs away when not in use", "1HP chiller and installation included"],
    specs: [
      { label: "Format", value: "Full-length inflatable tub" },
      { label: "Size", value: glacierDimensions["Glacier Portable"] },
      { label: "Set-up", value: "Inflatable — packs away" },
      { label: "Cooling", value: cooling },
      { label: "Lowest water temperature", value: minTemp },
      { label: "Power", value: power },
    ],
  },
  {
    name: "Glacier Acrylic",
    slug: "glacier-acrylic",
    size: glacierDimensions["Glacier Acrylic"],
    tag: "Rigid acrylic · Gloss white",
    positioning: "A rigid, gloss-white acrylic tub — a dedicated cold plunge for your home.",
    bestFor: "A dedicated spot in a home wellness room",
    image: acrylicImg,
    alt: "VYRO Glacier Acrylic: a gloss-white rectangular acrylic cold plunge tub connected to a VYRO 1HP chiller",
    keyFacts: ["Gloss-white acrylic finish", "Rigid tub for a dedicated spot", "1HP chiller and installation included"],
    specs: [
      { label: "Format", value: "Rigid tub, gloss-white acrylic" },
      { label: "Size", value: glacierDimensions["Glacier Acrylic"] },
      { label: "Set-up", value: "Rigid tub — dedicated placement" },
      { label: "Cooling", value: cooling },
      { label: "Lowest water temperature", value: minTemp },
      { label: "Power", value: power },
    ],
  },
];

export function launchModelBySlug(slug: string): LaunchModel | undefined {
  return launchModels.find((m) => m.slug === slug);
}

export function launchPrice(name: GlacierLaunchModel): { display: string; note: string | null } {
  const { priceInr, note } = glacierLaunchPricing[name];
  if (priceInr === null) return { display: "Price on request", note };
  return { display: formatInr(priceInr), note };
}

export const launchLabel = coldPlungeLaunch.label;

/** "+₹1,20,000" — price to upgrade from the included 1HP to the 2HP chiller. */
export const upgradePrice = `+${formatInr(externalChillerLaunch.upgradePriceInr)}`;

/** "250–350 L" — water capacity across the launch range. */
export const waterCapacity = `${glacierWaterCapacityLitres.min}–${glacierWaterCapacityLitres.max} L`;

/** Lowest confirmed launch MRP, formatted ("₹2,18,000"), or null if none is set. */
export const fromPrice: string | null = (() => {
  const prices = Object.values(glacierLaunchPricing).flatMap((p) => (p.priceInr === null ? [] : [p.priceInr]));
  return prices.length ? formatInr(Math.min(...prices)) : null;
})();

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
    copy: "Included with every Glacier launch model. Our compact chilling system for home plunges and personal use.",
    best: "Home & personal use",
    mrpInr: externalChillerLaunch.standaloneMrpInr[1],
  },
  {
    name: "Glacier Chiller 2HP",
    hp: 2,
    image: chiller2Img,
    copy: `The upgrade for faster cooling (${formatInr(externalChillerLaunch.upgradePriceInr)} over the included 1HP) — and our more powerful system for larger tubs and busier spaces like gyms and spas.`,
    best: "Faster cooling, larger tubs & commercial use",
    mrpInr: externalChillerLaunch.standaloneMrpInr[2],
  },
];

/** Installation requirements for external-chiller plunges, straight from the confirmed ratings. */
export const chillerRequirements = [
  { label: "Lowest water temperature", value: `${externalChillerSpecs.minimumTemperatureC}°C` },
  { label: "Power supply", value: externalChillerSpecs.electricalPhase },
  { label: "Wiring", value: `${externalChillerSpecs.wiringOptionsMm2.join(" mm² or ")} mm²` },
  {
    label: "Water supply",
    value: `${externalChillerSpecs.waterInletPoints} water inlet point`,
  },
  {
    label: "Drainage",
    value: `${externalChillerSpecs.drainPoints} drain point, for discharge when needed`,
  },
];
