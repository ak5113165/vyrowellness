// Exports the website's product content as JSON for the PDF product
// catalogue, so the catalogue always matches the site.
//
//   bun scripts/catalogue/export-data.ts > /tmp/vyro-catalogue-data.json
//   python3 scripts/catalogue/build.py /tmp/vyro-catalogue-data.json

import {
  afterSales,
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
  saunaHero,
  saunaModels,
  standardWood,
  widthLabel,
  woods,
} from "@/content/sauna-catalogue";
import { woodColours } from "@/lib/sauna-3d";
import { consultationSteps } from "@/content/process";
import { vyroDifferencePoints } from "@/content/vyro-difference";
import launchRange from "@/assets/plunge/glacier-launch-range.jpg";
import saunaInterior from "@/assets/sauna.jpg";
import hospitality from "@/assets/hospitality.jpg";
import studio from "@/assets/wellness-studio.jpg";
import redLight from "@/assets/red-light.jpg";
import stillLife from "@/assets/still-life.jpg";

const data = {
  asOf: new Date().toISOString().slice(0, 10),
  photos: { saunaHero, saunaInterior, hospitality, studio, redLight, stillLife, launchRange },
  contact: {
    domain: site.domain,
    phone: site.phoneDisplay,
    infoEmail: site.infoEmail,
    salesEmail: site.salesEmail,
    supportEmail: site.supportEmail,
    whatsapp: site.whatsappNumber ? `+${site.whatsappNumber}` : null,
    instagram: site.instagramHandle ? `@${site.instagramHandle}` : null,
    responseTime: site.enquiryResponseTime,
  },
  difference: vyroDifferencePoints,
  afterSales,
  glacier: {
    launchLabel,
    madeIn: coldPlungeLaunch.madeIn,
    cities: coldPlungeLaunch.serviceLocations,
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
    roomSizes: roomSizes.map((s) => ({ ...s, width: widthLabel(s) })),
    models: saunaModels.map((m) => ({ ...m, ...modelSize(m) })),
    woods: woods.map((w) => ({ ...w, colour: woodColours[w.name] })),
    heaters,
    controlPanels,
    accessorySets,
    steps: consultationSteps,
  },
};

console.log(JSON.stringify(data, null, 2));
