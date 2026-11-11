// "Before you buy" answers — the practical questions buyers ask before a
// ₹2–5 lakh purchase. Every answer is built from confirmed values in
// site.ts / the catalogues, so a change there flows through here.
//
// Not answered yet (awaiting confirmed terms — do not add until provided):
// cold plunge / red light warranty, cancellation/refund terms, EMI/financing.
// Sauna heater and woodwork warranty + AMC are confirmed (afterSales in site.ts).

import {
  afterSales,
  coldPlungeLaunch,
  externalChillerLaunch,
  externalChillerSpecs,
  glacierDimensions,
  glacierWaterCapacityLitres,
  saunaInstallation,
  site,
} from "@/content/site";
import { formatInr, fromPrice, launchLabel } from "@/content/glacier-catalogue";
import { dimsFtLabel, roomSizes, saunaModels } from "@/content/sauna-catalogue";

const byCode = (code: string) => dimsFtLabel(saunaModels.find((m) => m.code === code)!.dimsFt);
const saunaSizes = `${roomSizes.map((r) => `${r.name} ${dimsFtLabel(r.dimsFt)}`).join(", ")} for Haven Classic and Haven Glass; ${byCode("IR-01")} for Haven Infrared and ${byCode("C-01")} for Haven Compact`;

const cities = coldPlungeLaunch.serviceLocations.join(", ").replace(/, ([^,]*)$/, " and $1");
const wiring = `${externalChillerSpecs.wiringOptionsMm2.join(" mm² or ")} mm²`;

/** Shared by the homepage and Saunas page FAQs. */
export const saunaWarrantyFaq = {
  q: "What warranty and after-sales support do you offer?",
  a: `Every VYRO sauna heater comes with ${afterSales.heaterServiceYears} years of after-sales service: a ${afterSales.heaterComprehensiveWarrantyYears}-year comprehensive warranty, then ${afterSales.heaterSupportYears} years of service support and spare parts (${afterSales.heaterSupportCharges}). Sauna woodwork has a ${afterSales.woodworkWorkmanshipMonths}-month warranty against workmanship defects, subject to warranty conditions. Annual maintenance contracts (AMC) are available for every VYRO product.`,
};

export const beforeYouBuyFaqs = [
  {
    q: "Where do you deliver and install?",
    a: `We install VYRO saunas ${saunaInstallation.label}. Glacier cold plunges launch on ${launchLabel} and are installed first in ${cities}.`,
  },
  {
    q: "Is installation included in the price?",
    a: `For the Glacier launch range, yes — the MRP${fromPrice ? ` (from ${fromPrice})` : ""} includes the 1HP chiller and installation. Sauna pricing depends on the cabin and options you choose; our team handles delivery, installation and commissioning, and your quote sets out exactly what's included.`,
  },
  {
    q: "What does a cold plunge need at my home?",
    a: `A Glacier chiller needs a ${externalChillerSpecs.electricalPhase.toLowerCase()} supply with ${wiring} wiring. You'll also need ${externalChillerSpecs.waterInletPoints} water inlet point and ${externalChillerSpecs.drainPoints} drain point for discharge when needed. We confirm the details for your space before installation.`,
  },
  {
    q: "What do you need to plan a sauna?",
    a: "Your floor plan, and details of the room's electrical layout and ventilation. We review these in a space assessment, then specify dimensions, timber and finishes for your space.",
  },
  {
    q: "How much space does each product take?",
    a: `Haven sauna cabins come in standard sizes (length × breadth × height): ${saunaSizes}. Glacier Barrel is ${glacierDimensions["Glacier Barrel"].replace(" · ", ", ")}; Glacier Portable and Acrylic are ${glacierDimensions["Glacier Acrylic"].replace(" · ", ", ")}, holding ${glacierWaterCapacityLitres.min}–${glacierWaterCapacityLitres.max} litres across the range.`,
  },
  {
    q: "Can I upgrade the chiller?",
    a: `Yes. Every Glacier launch model comes with the 1HP chiller; you can upgrade to the 2HP for faster cooling for ${formatInr(externalChillerLaunch.upgradePriceInr)} more.`,
  },
  saunaWarrantyFaq,
  {
    q: "What about care and upkeep?",
    a: "Our team walks you through everyday use and care at installation, and supports you afterwards. Annual maintenance contracts (AMC) are available for every VYRO product.",
  },
  {
    q: "How quickly will you reply?",
    a: `Our team replies to every enquiry ${site.enquiryResponseTime}. You can also reach us on WhatsApp or by phone on ${site.phoneDisplay}.`,
  },
];
