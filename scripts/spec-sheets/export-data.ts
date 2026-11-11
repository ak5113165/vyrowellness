// Exports the website's product content as JSON for the PDF spec sheets, so
// the PDFs always match the site. Image imports resolve to file paths under Bun.
//
// Run from the project root:  bun scripts/spec-sheets/export-data.ts > /tmp/vyro-spec-data.json
// then:                       python3 scripts/spec-sheets/build.py /tmp/vyro-spec-data.json

import {
  coldPlungeLaunch,
  externalChillerLaunch,
  glacierWaterCapacityLitres,
  saunaInstallation,
  site,
} from "@/content/site";
import {
  chillerRequirements,
  chillers,
  formatInr,
  fromPrice,
  launchLabel,
  launchModels,
  launchPrice,
  projectModels,
  upgradePrice,
} from "@/content/glacier-catalogue";
import { formatInr } from "@/lib/format-inr";
import {
  accessorySets,
  cabinPriceLabel,
  controlPanels,
  heaterPriceLabel,
  heaters,
  isInfraredCabin,
  modelSize,
  roomSizes,
  roomTypes,
  saunaModels,
  standardWood,
  sizeLabel,
  woods,
} from "@/content/sauna-catalogue";
import { consultationSteps } from "@/content/process";

const data = {
  // India date (UTC + 5:30), so a late-evening build is dated correctly.
  asOf: new Date(Date.now() + 5.5 * 3600_000).toISOString().slice(0, 10),
  contact: {
    domain: site.domain,
    phone: site.phoneDisplay,
    salesEmail: site.salesEmail,
    supportEmail: site.supportEmail,
    whatsapp: site.whatsappNumber ? `+${site.whatsappNumber}` : null,
    responseTime: site.enquiryResponseTime,
  },
  glacier: {
    launchLabel,
    madeIn: coldPlungeLaunch.madeIn,
    cities: coldPlungeLaunch.serviceLocations,
    fromPrice,
    upgradePrice,
    waterCapacity: `${glacierWaterCapacityLitres.min}–${glacierWaterCapacityLitres.max} L`,
    included: `${externalChillerLaunch.includedWithLaunchModels}HP chiller and installation`,
    models: launchModels.map((m) => ({ ...m, price: launchPrice(m.name) })),
    chillers: chillers.map((c) => ({ ...c, mrp: formatInr(c.mrpInr) })),
    requirements: chillerRequirements,
    projectModels,
  },
  haven: {
    installation: saunaInstallation.label,
    standardWood,
    roomTypes,
    roomSizes: roomSizes.map((s) => ({ ...s, dims: sizeLabel(s) })),
    models: saunaModels.map((m) => ({
      ...m,
      ...modelSize(m),
      infrared: isInfraredCabin(m),
      priceLabel: formatInr(m.priceInr),
      cabinPriceLabel: cabinPriceLabel(m),
      panelsLabel: m.infraredPanels ? `${m.infraredPanels.kw} kW · ${formatInr(m.infraredPanels.priceInr)}` : null,
    })),
    woods,
    heaters: heaters.map((h) => ({
      ...h,
      priceLabel: heaterPriceLabel(h),
      optionsLabel: (h.options ?? []).map((o) => `${o.kw} kW ${formatInr(o.priceInr)}`).join("  ·  "),
    })),
    controlPanels: controlPanels.map((p) => ({ ...p, priceLabel: `${p.inStock ? "" : "Out of stock · "}${formatInr(p.priceInr)}` })),
    accessorySets: accessorySets.map((a) => ({ ...a, priceLabel: formatInr(a.priceInr) })),
    pricesNote: "Prices are MRP in INR, GST extra. Wood upgrades, the Haven Glass frame finish and installation & commissioning are quoted for your space.",
    steps: consultationSteps,
  },
};

console.log(JSON.stringify(data, null, 2));
