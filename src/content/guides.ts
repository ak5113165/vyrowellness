// Buying guides: /guides/<slug>.
//
// Written from confirmed facts in site.ts and the catalogues. No health or
// medical claims, no invented specifications (heater power, room volumes,
// electrical ratings for saunas, delivery times). General background (what a
// sauna or steam room is) is stated in general terms.

import {
  afterSales,
  coldPlungeLaunch,
  externalChillerLaunch,
  externalChillerSpecs,
  glacierWaterCapacityLitres,
  saunaInstallation,
  site,
} from "@/content/site";
import { formatInr, launchLabel, launchModels, launchPrice, upgradePrice } from "@/content/glacier-catalogue";
import { heaters, modelSize, roomTypes, saunaModels, standardWood, woods } from "@/content/sauna-catalogue";
import saunaInterior from "@/assets/sauna.jpg";
import stillLife from "@/assets/still-life.jpg";
import plungeHero from "@/assets/plunge/glacier-hero.jpg";

export type GuideBlock =
  | { type: "h2"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "table"; head: string[]; rows: string[][] }
  | { type: "cta"; text: string; to: "/saunas" | "/cold-plunge" | "/contact"; label: string };

export type Guide = {
  slug: string;
  title: string;
  /** Meta description and card summary. */
  summary: string;
  topic: "Saunas" | "Cold Plunge";
  readMinutes: number;
  image: string;
  imageAlt: string;
  published: string; // ISO date
  blocks: GuideBlock[];
};

const upgrades = woods.filter((w) => w.name !== standardWood).map((w) => w.name);
const kinds = [...new Set(heaters.map((h) => h.kind))];
const cities = coldPlungeLaunch.serviceLocations;
const cityList = `${cities.slice(0, -1).join(", ")} and ${cities.slice(-1)[0]}`;

const chooseSauna: Guide = {
  slug: "how-to-choose-a-home-sauna-in-india",
  title: "How to Choose a Home Sauna in India",
  summary:
    "Cabin type, size, wood, heater and where it goes — a clear, practical guide to choosing the right home sauna for an Indian home.",
  topic: "Saunas",
  readMinutes: 6,
  image: saunaInterior,
  imageAlt: "Inside a warm timber sauna with tiered benches and soft LED light",
  published: "2026-11-11",
  blocks: [
    {
      type: "p",
      text: "A home sauna is a long-term addition to your home, so it's worth getting the choice right. This guide walks through the decisions in the order our consultants take them: the type of cabin, the size, the wood, the heater and the space it will go in.",
    },
    { type: "h2", text: "1. Choose the type of cabin" },
    {
      type: "p",
      text: "Haven saunas come in four series. The right one depends on the experience you want and the room you have.",
    },
    {
      type: "ul",
      items: roomTypes.map((t) => `${t.name} (${t.series}) — ${t.short}`),
    },
    {
      type: "p",
      text: "A traditional sauna is heated by a sauna heater and stones. An infrared sauna uses infrared panels instead of a heater and stones, and warms you at lower air temperatures. If you're unsure, start with how you picture using it — a social, classic sauna for the family, or a quiet personal session.",
    },
    { type: "h2", text: "2. Choose the size" },
    {
      type: "p",
      text: "Think about how many people will usually use it together, and how much floor space the room can give up. These are our standard sizes, as length × breadth × height; every cabin is 7 ft tall, so check your ceiling height too.",
    },
    {
      type: "table",
      head: ["Cabin", "Size (L × B × H)", "Seats"],
      rows: saunaModels.map((m) => [`${m.name} ${m.code}`, modelSize(m).dimsShort, modelSize(m).people]),
    },
    {
      type: "p",
      text: "For apartments and smaller rooms, Haven Compact C-01 is made to save space, and Haven Infrared IR-01 seats 1–2 people. For families and shared sessions, the Medium cabins seat 4–6. The Large cabins seat 6 or more, for bigger homes, clubs and wellness spaces.",
    },
    { type: "h2", text: "3. Choose the wood" },
    {
      type: "p",
      text: `Every Haven cabin is crafted in ${standardWood.toLowerCase()} as standard — pale, light and clean-grained. You can upgrade to ${upgrades.slice(0, -1).join(", ")} or ${upgrades.slice(-1)[0]}. The wood changes the colour, grain and character of the room, so it's worth seeing samples with your consultant before you decide.`,
    },
    { type: "h2", text: "4. Choose the heater and controls" },
    {
      type: "p",
      text: `Our Ember heaters come in ${kinds.length} styles — ${kinds.map((k) => k.toLowerCase()).join(", ")} — in stainless steel or matte black. Your consultant matches the heater to your cabin and room. Pulse control panels come with simple buttons or a black-glass touch dial.`,
    },
    {
      type: "p",
      text: `Every VYRO sauna heater comes with ${afterSales.heaterServiceYears} years of after-sales service: a ${afterSales.heaterComprehensiveWarrantyYears}-year comprehensive warranty, then ${afterSales.heaterSupportYears} years of service support and spare parts (${afterSales.heaterSupportCharges}).`,
    },
    { type: "h2", text: "5. Plan the space" },
    {
      type: "ul",
      items: [
        "Room: a home gym, a spare room, a basement or a dedicated wellness room all work, as long as the cabin fits with space around it.",
        "Power: a sauna heater needs a suitable electrical supply. Your consultant checks your supply as part of the space assessment.",
        "Ventilation: the room should be ventilated. This is reviewed during the assessment too.",
        "Apartments: check room size and any building rules early — your consultant can help you plan.",
      ],
    },
    { type: "h2", text: "6. Installation and care" },
    {
      type: "p",
      text: `Haven saunas are installed by our own team ${saunaInstallation.label}. Sauna woodwork carries a ${afterSales.woodworkWorkmanshipMonths}-month warranty against workmanship defects, subject to warranty conditions, and annual maintenance contracts (AMC) are available for every VYRO product.`,
    },
    { type: "h2", text: "Questions to ask before you buy" },
    {
      type: "ul",
      items: [
        "How many people will use it at once, and how often?",
        "Which room will it go in, and what are its exact dimensions?",
        "Is the electrical supply in that room suitable?",
        "Do I want a traditional sauna with a heater and stones, or infrared?",
        "Which wood suits the rest of the room?",
      ],
    },
    {
      type: "cta",
      text: `Not sure yet? Build your sauna online, or talk to a VYRO wellness consultant — we reply ${site.enquiryResponseTime}.`,
      to: "/saunas",
      label: "Build Your Sauna",
    },
  ],
};

const saunaVsSteam: Guide = {
  slug: "sauna-vs-steam-room",
  title: "Sauna vs Steam Room: What's the Difference?",
  summary:
    "Dry heat or wet steam? How a sauna and a steam room differ in heat, humidity, materials and feel — and which suits your home.",
  topic: "Saunas",
  readMinutes: 4,
  image: stillLife,
  imageAlt: "Stacked stones on warm timber with soft steam rising",
  published: "2026-11-11",
  blocks: [
    {
      type: "p",
      text: "Saunas and steam rooms are often mentioned together, but they feel very different. Here's how they compare, so you can choose the experience you'll actually enjoy.",
    },
    { type: "h2", text: "The short answer" },
    {
      type: "p",
      text: "A sauna is a timber room with hot, relatively dry air. A steam room is a sealed, tiled room filled with steam, where the air is cooler but almost fully humid. In a traditional sauna you can add a little steam by pouring water over the hot stones — a moment of löyly, as the Finns call it.",
    },
    {
      type: "table",
      head: ["", "Sauna", "Steam room"],
      rows: [
        ["Heat", "Hot, mostly dry air", "Warm, very humid air"],
        ["Humidity", "Low — you can add bursts of steam with water on the stones", "Close to saturated"],
        ["Built from", "Timber", "Tile, glass or stone, fully sealed"],
        ["Heat source", "Sauna heater and stones, or infrared panels", "Steam generator"],
        ["Feel", "A dry, enveloping warmth", "A warm, misty cloud"],
      ],
    },
    { type: "h2", text: "What it means for your home" },
    {
      type: "ul",
      items: [
        "A sauna is a free-standing timber cabin, so it can go into an existing room such as a home gym or spare room.",
        "A steam room is usually built into the bathroom or spa as a sealed, waterproofed room, which typically makes it a construction project.",
        "Timber saunas have a warm, natural look; steam rooms are usually tiled or stone.",
      ],
    },
    { type: "h2", text: "What about infrared?" },
    {
      type: "p",
      text: "An infrared sauna is a third option. It uses infrared panels instead of a heater and stones, and warms you at lower air temperatures — a gentler experience that some people prefer for everyday use. Our Haven Infrared IR-01 is a compact infrared cabin for 1–2 people.",
    },
    { type: "h2", text: "Which should you choose?" },
    {
      type: "p",
      text: "If you like dry heat, the ritual of stones and steam, and the look of timber, choose a sauna. If you prefer a humid, misty experience and are already planning a bathroom or spa renovation, a steam room may suit you. VYRO specialises in saunas — traditional, glass-front, infrared and compact — and our consultants can help you decide.",
    },
    {
      type: "cta",
      text: "Explore the Haven range, or talk to a consultant about your space.",
      to: "/saunas",
      label: "Explore Haven Saunas",
    },
  ],
};

const plungeChecklist: Guide = {
  slug: "cold-plunge-installation-checklist",
  title: "Before You Install a Cold Plunge: Space, Power, Water and Drainage",
  summary:
    "Everything to check before a cold plunge arrives — space, power supply, water inlet, drainage and choosing the right chiller.",
  topic: "Cold Plunge",
  readMinutes: 5,
  image: plungeHero,
  imageAlt: "A man relaxing in a VYRO Glacier Acrylic cold plunge beside its VYRO chiller",
  published: "2026-11-11",
  blocks: [
    {
      type: "p",
      text: `A cold plunge is simple to live with once it's in, but a little planning makes installation smooth. Glacier cold plunges launch on ${launchLabel}, installed first in ${cityList}. Here's what to check before yours arrives.`,
    },
    { type: "h2", text: "1. Choose the plunge and the space" },
    {
      type: "table",
      head: ["Model", "Size", "Set-up", "MRP (+ GST)"],
      rows: launchModels.map((m) => [
        m.name,
        m.size,
        m.specs.find((s) => s.label === "Set-up")?.value ?? "—",
        launchPrice(m.name).display,
      ]),
    },
    {
      type: "p",
      text: `Every MRP includes the ${externalChillerLaunch.includedWithLaunchModels}HP chiller and installation; GST is extra. Plunges hold ${glacierWaterCapacityLitres.min}–${glacierWaterCapacityLitres.max} litres of water across the range. Leave room for the chiller unit beside the tub, and for getting in and out comfortably.`,
    },
    { type: "h2", text: "2. Power" },
    {
      type: "ul",
      items: [
        `${externalChillerSpecs.electricalPhase} power supply near the plunge.`,
        `Wiring of ${externalChillerSpecs.wiringOptionsMm2.join(" mm² or ")} mm², as confirmed for your installation.`,
        "Your consultant confirms the supply during the site check.",
      ],
    },
    { type: "h2", text: "3. Water and drainage" },
    {
      type: "ul",
      items: [
        `${externalChillerSpecs.waterInletPoints} water inlet point to fill the plunge.`,
        `${externalChillerSpecs.drainPoints} drain point nearby, for draining and cleaning.`,
      ],
    },
    { type: "h2", text: "4. Choose the chiller" },
    {
      type: "p",
      text: `Every Glacier chiller cools the water down to ${externalChillerSpecs.minimumTemperatureC}°C. The 1HP chiller is included with every launch model and suits home plunges and personal use. The 2HP is the upgrade for faster cooling — ${upgradePrice} over the included 1HP — and is the more powerful option for larger tubs and busier spaces like gyms and spas. Bought on their own, the chillers' MRPs are ${formatInr(externalChillerLaunch.standaloneMrpInr[1])} (1HP) and ${formatInr(externalChillerLaunch.standaloneMrpInr[2])} (2HP).`,
    },
    { type: "h2", text: "5. Your pre-installation checklist" },
    {
      type: "ul",
      items: [
        "A level spot with room for the tub and the chiller",
        `${externalChillerSpecs.electricalPhase} power supply`,
        "One water inlet point",
        "One drain point",
        `An address in ${cityList} (first installation cities)`,
      ],
    },
    {
      type: "cta",
      text: `Ready to plan yours? A VYRO consultant will reply ${site.enquiryResponseTime}.`,
      to: "/cold-plunge",
      label: "Explore Glacier",
    },
  ],
};

export const guides: Guide[] = [chooseSauna, saunaVsSteam, plungeChecklist];

export function guideBySlug(slug: string): Guide | undefined {
  return guides.find((g) => g.slug === slug);
}
