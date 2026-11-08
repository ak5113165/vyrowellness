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
  announcement: "Discover a new approach to everyday wellness.",

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

  instagramHandle: "vyrowellness.in",
  instagramUrl: "https://www.instagram.com/vyrowellness.in/",
};

export const navLinks = [
  { label: "Home", to: "/" },
  { label: "Saunas", to: "/saunas" },
  { label: "Cold Plunge", to: "/cold-plunge" },
  { label: "Red Light Therapy", to: "/red-light-therapy" },
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

// Cold Plunge launch facts confirmed by the founder. Year remains unconfirmed.
export const coldPlungeLaunch = {
  day: 1,
  month: 1,
  label: "1 January",
  manufacturingLocation: "Delhi",
  serviceLocations: ["Delhi NCR", "Bangalore", "Mumbai", "Goa"],
} as const;

// External chilling systems only; do not extend these ratings to built-in cooling.
export const externalChillerSpecs = {
  horsepowerOptions: [1, 2],
  minimumTemperatureC: 5,
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
