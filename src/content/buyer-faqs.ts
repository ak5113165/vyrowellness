// "Before you buy" answers — the practical questions buyers ask before a
// ₹2–5 lakh purchase. Every answer is built from confirmed values in
// site.ts / the catalogues, so a change there flows through here.
//
// Not answered yet (awaiting confirmed terms — do not add until provided):
// warranty period, cancellation/refund terms, EMI/financing.

import {
  coldPlungeLaunch,
  externalChillerLaunch,
  externalChillerSpecs,
  glacierDimensions,
  glacierWaterCapacityLitres,
  saunaInstallation,
  site,
} from "@/content/site";
import { formatInr, fromPrice, launchLabel } from "@/content/glacier-catalogue";

const cities = coldPlungeLaunch.serviceLocations.join(", ").replace(/, ([^,]*)$/, " and $1");
const wiring = `${externalChillerSpecs.wiringOptionsMm2.join(" mm² or ")} mm²`;

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
    q: "What electrical work does a cold plunge need?",
    a: `A Glacier chiller needs a ${externalChillerSpecs.electricalPhase.toLowerCase()} supply with ${wiring} wiring, plus ${externalChillerSpecs.drainPoints} drain point for discharge when needed. We confirm the details for your space before installation.`,
  },
  {
    q: "What do you need to plan a sauna?",
    a: "Your floor plan, and details of the room's electrical layout and ventilation. We review these in a space assessment, then specify dimensions, timber and finishes for your space.",
  },
  {
    q: "How much space does each product take?",
    a: `Haven sauna cabins are approx. 1.2m to 2.2m wide depending on size. Glacier Barrel is ${glacierDimensions["Glacier Barrel"].replace(" · ", ", ")}; Glacier Portable and Acrylic are ${glacierDimensions["Glacier Acrylic"].replace(" · ", ", ")}, holding ${glacierWaterCapacityLitres.min}–${glacierWaterCapacityLitres.max} litres across the range.`,
  },
  {
    q: "Can I upgrade the chiller?",
    a: `Yes. Every Glacier launch model comes with the 1HP chiller; you can upgrade to the 2HP for faster cooling for ${formatInr(externalChillerLaunch.upgradePriceInr)} more.`,
  },
  {
    q: "What about care and upkeep?",
    a: "Our team walks you through everyday use and care at installation, and supports you afterwards.",
  },
  {
    q: "How quickly will you reply?",
    a: `Our team replies to every enquiry ${site.enquiryResponseTime}. You can also reach us on WhatsApp or by phone on ${site.phoneDisplay}.`,
  },
];
