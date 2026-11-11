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
import {
  accessorySets,
  controlPanels,
  heaters,
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
  asOf: new Date().toISOString().slice(0, 10),
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
    models: saunaModels.map((m) => ({ ...m, ...modelSize(m) })),
    woods,
    heaters,
    controlPanels,
    accessorySets,
    steps: consultationSteps,
  },
};

console.log(JSON.stringify(data, null, 2));
