// City landing pages: /locations/<slug>.
//
// Facts only from site.ts: saunas are installed by our team across India;
// Glacier cold plunges launch 1 January 2027 with installation first in
// Delhi NCR, Bangalore, Mumbai and Goa. The local context below describes the
// kinds of homes and spaces in each city — no addresses, showrooms, project
// counts or delivery times, because none are confirmed.

import { coldPlungeLaunch } from "@/content/site";
import saunaHero from "@/assets/products/sauna-hero-spruce.jpg";
import saunaInterior from "@/assets/sauna.jpg";
import hospitality from "@/assets/hospitality.jpg";
import studio from "@/assets/wellness-studio.jpg";

export type CityPick =
  | { kind: "sauna"; code: string; why: string }
  | { kind: "plunge"; slug: string; why: string };

export type CityPage = {
  slug: string;
  city: string;
  /** Areas named in the copy, as people search for them. */
  areas: string[];
  image: string;
  imageAlt: string;
  intro: string;
  homes: string;
  picks: CityPick[];
  planning: string[];
};

export const cityPages: CityPage[] = [
  {
    slug: "delhi-ncr",
    city: "Delhi NCR",
    areas: ["Delhi", "Gurugram", "Noida", "Faridabad", "Ghaziabad"],
    image: saunaHero,
    imageAlt: "A VYRO spruce sauna at night with warm bench lighting and a tower heater",
    intro:
      "Haven saunas and Glacier cold plunges for homes and businesses across Delhi, Gurugram, Noida, Faridabad and Ghaziabad — planned with a VYRO wellness consultant and installed by our team.",
    homes:
      "From independent houses and farmhouses to high-rise apartments and penthouses, NCR homes range widely in space. A sauna for chilly winter evenings and a cold plunge for long summers make a natural pair here.",
    picks: [
      { kind: "sauna", code: "G-02", why: "A glass-front sauna for 4–6 people — a design feature in a home gym or wellness room." },
      { kind: "sauna", code: "S-02", why: "A versatile traditional cabin for 4–6 people, ideal for families and shared sessions." },
      { kind: "plunge", slug: "glacier-acrylic", why: "A rigid, gloss-white tub for a dedicated cold plunge spot." },
    ],
    planning: [
      "Independent houses and farmhouses often have room for a sauna and a cold plunge side by side — plan them together with one assessment.",
      "In apartments, your consultant checks space, power and ventilation before recommending a cabin size.",
      "Every Glacier plunge needs a single-phase power supply, one water inlet point and one drain point nearby.",
    ],
  },
  {
    slug: "bangalore",
    city: "Bangalore",
    areas: ["Whitefield", "Sarjapur Road", "Hebbal", "Indiranagar", "Koramangala"],
    image: studio,
    imageAlt: "A calm wellness room with warm timber and soft light",
    intro:
      "Haven saunas and Glacier cold plunges for Bangalore homes, villas and fitness spaces — planned with a VYRO wellness consultant and installed by our team.",
    homes:
      "Gated villa communities, apartments and home gyms across the city make room for a daily wellness ritual. Bangalore's mild weather means a sauna and cold plunge can be part of your routine year-round.",
    picks: [
      { kind: "sauna", code: "S-01", why: "A compact traditional cabin for 1–3 people and smaller rooms." },
      { kind: "sauna", code: "IR-01", why: "An infrared cabin for 1–2 people — gentle warmth for everyday use." },
      { kind: "plunge", slug: "glacier-portable", why: "A full-length plunge that packs away when you need the space." },
    ],
    planning: [
      "Villa communities often have space for a dedicated wellness room — ask about a complete space with sauna, cold plunge and red light.",
      "For apartments, the Infrared and Compact cabins suit smaller rooms.",
      "Every Glacier plunge needs a single-phase power supply, one water inlet point and one drain point nearby.",
    ],
  },
  {
    slug: "mumbai",
    city: "Mumbai",
    areas: ["Bandra", "Juhu", "Worli", "Powai", "Navi Mumbai", "Thane"],
    image: saunaInterior,
    imageAlt: "Inside a warm timber sauna with tiered benches and soft LED light",
    intro:
      "Space-smart Haven saunas and Glacier cold plunges for Mumbai apartments, penthouses and fitness studios — planned with a VYRO wellness consultant and installed by our team.",
    homes:
      "In a city where space is precious, the right cabin size matters. Haven Compact is made for apartments and smaller rooms, the Glacier Barrel has the smallest footprint in the range, and the Glacier Portable packs away when you need the space.",
    picks: [
      { kind: "sauna", code: "C-01", why: "A slim, space-saving infrared cabin made for apartments and smaller rooms." },
      { kind: "sauna", code: "IR-01", why: "An infrared cabin for 1–2 people with a small footprint." },
      { kind: "plunge", slug: "glacier-barrel", why: "Upright immersion in the smallest footprint of the Glacier range." },
    ],
    planning: [
      "Apartments: your consultant checks room size, power and ventilation before recommending a cabin.",
      "Larger apartments and penthouses can make a glass-front cabin the design feature of a room.",
      "Every Glacier plunge needs a single-phase power supply, one water inlet point and one drain point nearby.",
    ],
  },
  {
    slug: "goa",
    city: "Goa",
    areas: ["North Goa", "South Goa", "Panjim", "Assagao", "Candolim"],
    image: hospitality,
    imageAlt: "A calm hospitality wellness corridor with arched openings and warm light",
    intro:
      "Haven saunas and Glacier cold plunges for Goa villas, homestays and boutique hotels — planned with a VYRO wellness consultant and installed by our team.",
    homes:
      "Holiday villas, homestays and boutique hotels across Goa are adding wellness to the guest experience. A glass-front sauna and a cold plunge make a memorable pair in a villa wellness room or hotel spa.",
    picks: [
      { kind: "sauna", code: "G-03", why: "A large glass-front sauna for 6 or more — a centrepiece for villas and hotels." },
      { kind: "sauna", code: "S-03", why: "A large traditional cabin for shared sessions." },
      { kind: "plunge", slug: "glacier-acrylic", why: "A rigid, gloss-white tub for a dedicated plunge spot." },
    ],
    planning: [
      "For villas and hotels, plan heat and cold together as one wellness space, with one assessment and one team.",
      "Coming soon for premium projects: the Glacier Project Collection, including the timber-clad Glacier Signature.",
      "Every Glacier plunge needs a single-phase power supply, one water inlet point and one drain point nearby.",
    ],
  },
];

export function cityBySlug(slug: string): CityPage | undefined {
  return cityPages.find((c) => c.slug === slug);
}

/** True for cities where Glacier cold plunge installation is offered first. */
export function coldPlungeServed(city: CityPage): boolean {
  return (coldPlungeLaunch.serviceLocations as readonly string[]).includes(city.city);
}
