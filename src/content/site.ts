// ==========================================================================
// VYRO — single content & configuration file.
//
// Every value marked PLACEHOLDER below is clearly labelled and easy to find:
// search for "PLACEHOLDER" to see everything to replace before launch.
//
// PHOTOGRAPHY: the imagery in src/assets is AI-generated stand-in
// photography. Replace each file with real product photography when
// available (same file names keep everything working).
// ==========================================================================

export const site = {
  name: "VYRO",
  tagline: "Wellness, Reimagined.",
  // Used sparingly (e.g. footer / brand story).
  secondaryLine: "Sehat bhi. Shakti bhi. Sukoon bhi.",
  announcement: "VYRO Glacier cold plunges launch 1 January 2027",
  // Where the announcement bar links to. Leave "" for plain text.
  announcementLink: "/cold-plunge" as const,

  // WhatsApp business number, international format, digits only.
  // Leave "" to hide all WhatsApp buttons.
  whatsappNumber: "919540149445",

  domain: "vyrowellness.in",
  salesEmail: "sales@vyrowellness.in",
  supportEmail: "support@vyrowellness.in",
  // Primary public email (sales enquiries).
  email: "sales@vyrowellness.in",
  phoneDisplay: "+91 95401 49445",
  phoneHref: "tel:+919540149445",
  // Confirmed by the founder (8 Nov 2026): the team replies to every enquiry within 24 hours.
  enquiryResponseTime: "within 24 hours",

  instagramHandle: "vyrowellness.in",
  instagramUrl: "https://www.instagram.com/vyrowellness.in/",
};

// The logo links home, so "Home" is not repeated in the navigation.
export const navLinks = [
  { label: "Saunas", to: "/saunas" },
  { label: "Cold Plunge", to: "/cold-plunge" },
  { label: "Red Light Therapy", to: "/red-light-therapy" },
  { label: "Wellness Spaces", to: "/wellness-spaces" },
  { label: "Commercial Wellness", to: "/commercial-wellness" },
  { label: "Our Philosophy", to: "/philosophy" },
] as const;

export const productInterests = [
  "Sauna",
  "Cold Plunge",
  "Red Light Therapy",
  "Complete Home Wellness",
  "Commercial Wellness",
  "Other",
] as const;

// Indian city names are clearly labelled examples for the enquiry form only —
// they are not a delivery-coverage or installation-availability claim.
export const exampleCities = ["Mumbai", "Delhi NCR", "Bengaluru", "Hyderabad"];

// Cold Plunge launch facts confirmed by the founder (year confirmed 8 Nov 2026).
export const coldPlungeLaunch = {
  day: 1,
  month: 1,
  year: 2027,
  label: "1 January 2027",
  shortLabel: "1 Jan 2027",
  manufacturingLocation: "Delhi",
  serviceLocations: ["Delhi NCR", "Bangalore", "Mumbai", "Goa"],
} as const;

// Glacier line-up confirmed by the founder (8 Nov 2026): only these three
// hero models launch on the coldPlungeLaunch date. Every other Glacier design
// stays "coming soon" and is offered for custom and premium projects.
export const glacierLaunchModels = ["Glacier Barrel", "Glacier Portable", "Glacier Acrylic"] as const;
export const glacierProjectModels = [
  "Glacier Pro",
  "Glacier Steel",
  "Glacier Signature",
  "Glacier Integrated",
] as const;

export type GlacierLaunchModel = (typeof glacierLaunchModels)[number];

// Glacier MRPs confirmed by the founder (8 Nov 2026), in INR. Every launch
// model is sold with the 1HP chiller (mandatory) and installation is included
// in the MRP. Customers can upgrade to the 2HP chiller for faster cooling (see
// externalChillerLaunch.upgradePriceInr). A null priceInr shows "Price on request".
export const glacierLaunchPricing: Record<GlacierLaunchModel, { priceInr: number | null; note: string | null }> = {
  "Glacier Barrel": { priceInr: 218000, note: "Includes 1HP chiller and installation" },
  "Glacier Portable": { priceInr: 325000, note: "Includes 1HP chiller and installation" },
  "Glacier Acrylic": { priceInr: 378000, note: "Includes 1HP chiller and installation" },
};

// Glacier sizes confirmed by the founder (8 Nov 2026).
export const glacierDimensions: Record<GlacierLaunchModel, string> = {
  "Glacier Barrel": "2.5 ft diameter · 30 in deep",
  "Glacier Portable": "5 × 2.5 ft · 30 in deep",
  "Glacier Acrylic": "5 × 2.5 ft · 30 in deep",
};

// Water capacity confirmed as a range across the launch models (not per model).
export const glacierWaterCapacityLitres = { min: 250, max: 350 } as const;

// External chillers: launch with the tubs on coldPlungeLaunch date. MRPs for
// the chiller on its own (INR), confirmed by the founder (8 Nov 2026).
export const externalChillerLaunch = {
  launchesWithTubs: true,
  includedWithLaunchModels: 1,
  upgradeOption: 2,
  // Price to upgrade a launch model from the included 1HP to the 2HP chiller.
  upgradePriceInr: 120000,
  standaloneMrpInr: { 1: 178000, 2: 298000 },
} as const;

// External chilling systems only; do not extend these ratings to built-in cooling.
// Minimum temperature confirmed by the founder as 3°C (8 Nov 2026; previously 5°C).
export const externalChillerSpecs = {
  horsepowerOptions: [1, 2],
  minimumTemperatureC: 3,
  electricalPhase: "Single phase",
  wiringOptionsMm2: [2.5, 4],
  drainPoints: 1,
} as const;

// PLACEHOLDER — capacity, voltage, current draw, filtration, warranty and
// Integrated cooling specifications await manufacturer confirmation.

export const businessTypes = [
  "Gym / Fitness Centre",
  "Hotel / Hospitality",
  "Spa / Wellness Centre",
  "Fitness Studio",
  "Residential Developer",
  "Architect / Interior Designer",
  "Corporate Wellness",
  "Other",
] as const;

// PLACEHOLDER — indicative budget buckets for the optional budget field.
// Adjust or remove to match how your team qualifies enquiries.
export const budgetOptions = [
  "Under ₹1 lakh",
  "₹1–3 lakh",
  "₹3–10 lakh",
  "Above ₹10 lakh",
  "Not sure yet",
] as const;

export function whatsappLink(message: string): string | null {
  if (!site.whatsappNumber) return null;
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
