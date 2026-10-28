// Sauna catalogue — SAWO is VYRO's confirmed supplier (user-confirmed, Oct 2026).
// Model names, sizes and copy are taken from SAWO's sauna-rooms page.
// Images are hosted by SAWO; replace with local vendor files when supplied.

const S = "https://www.sawo.com/wp-content/uploads";

export type RoomType = {
  id: "standard" | "glass-front" | "infrared" | "compact";
  name: string;
  short: string;
  about: string;
  image: string;
};

export const roomTypes: RoomType[] = [
  {
    id: "standard",
    name: "Standard Sauna Room",
    short: "A timeless sauna experience with high-quality Nordic wood and practical bench layouts.",
    about:
      "Brings the authentic Finnish sauna experience to your home. Designed with simplicity and elegance, it combines traditional craftsmanship with modern engineering.",
    image: `${S}/2026/02/STANDARD-SAUNA-ROOM-COVER-scaled.webp`,
  },
  {
    id: "glass-front",
    name: "Glass Front Sauna Room",
    short: "A modern sauna with durable glass to overlook your view without compromising on practicality.",
    about:
      "Combines contemporary design with traditional sauna benefits. A full glass front panel creates an open, airy atmosphere while maintaining heat retention.",
    image: `${S}/2026/02/1420-Glass-Front-Sauna-Room-scaled-1.webp`,
  },
  {
    id: "infrared",
    name: "Infrared Sauna Room",
    short: "Gentle heat using infrared technology for a relaxing, restorative session.",
    about:
      "Infrared sauna rooms warm the body with gentle radiant heat at lower air temperatures — a calm, easy-to-use option for everyday sessions.",
    image: `${S}/2026/02/IR-1111RS-_SCENE-.webp`,
  },
  {
    id: "compact",
    name: "Compact Sauna Room",
    short: "An instant, stable, plug-and-play setup for urban spaces, with a hidden heater.",
    about:
      "Plug-and-play convenience offers instant use and stability, saving set-up cost and downtime — made for apartments and smaller rooms.",
    image: `${S}/2026/07/SR02-60001630-New-Compact-Sauna-Room-SCENE-COVER-A1.webp`,
  },
];

export const roomSizes = [
  { name: "Small Rooms", spec: "1.16m–1.54m wide", people: "1–3 people" },
  { name: "Medium Rooms", spec: "1.36m–1.85m wide", people: "4–6 people" },
  { name: "Large Rooms", spec: "1.85m–2.23m wide", people: "6+ people" },
];

export type SaunaModel = {
  code: string;
  name: string;
  size: "Small" | "Medium" | "Large";
  type: RoomType["id"];
  copy: string;
  image: string;
};

export const saunaModels: SaunaModel[] = [
  { code: "1214RS", name: "Small Classic Sauna Room", size: "Small", type: "standard", image: `${S}/2026/02/1214RS_LATEST-NEW-SAUNA-ROOM.webp`, copy: "A compact Finnish-style sauna for 1–3 people. Perfect for private relaxation and smaller spaces." },
  { code: "1419RS", name: "Medium Classic Sauna Room", size: "Medium", type: "standard", image: `${S}/2026/02/1419RS_LATEST-NEW-SAUNA-ROOM.webp`, copy: "A spacious, versatile sauna for 4–6 people. Ideal for families or shared sessions." },
  { code: "1922RL", name: "Large Classic Sauna Room", size: "Large", type: "standard", image: `${S}/2026/02/1922RL_LATEST-NEW-SAUNA-ROOM.webp`, copy: "A generous room for 6 or more people — for larger homes and wellness spaces." },
  { code: "1414RS", name: "Small Glass Front Sauna Room", size: "Small", type: "glass-front", image: `${S}/2026/02/1414RS_GLASS-FRONT-CEDAR_PERSPECTIVE-VIEW-V2.webp`, copy: "A 1–3 person sauna with a full glass front that brings in light and opens up the space." },
  { code: "1420RS", name: "Medium Glass Front Sauna Room", size: "Medium", type: "glass-front", image: `${S}/2026/02/1420RS_GLASS-FRONT-CEDAR_PERSPECTIVE-VIEW-V2.webp`, copy: "For 4–6 people — spacious comfort with a transparent, contemporary façade." },
  { code: "1922RS", name: "Large Glass Front Sauna Room", size: "Large", type: "glass-front", image: `${S}/2026/02/1922RS_GLASS-FRONT-CEDAR_PERSPECTIVE-VIEW-V2.webp`, copy: "A 6+ person statement sauna with a striking full-glass front." },
];

export const heaters = [
  { name: "Taurus D NS", kind: "Floor Heater", image: `${S}/2025/10/SAWO_sauna_heaters_floor_TRD_NS.webp`, copy: "Two or more power options in one heater — built for spas, pools and heavy use." },
  { name: "SAWO30 Round Ni2", kind: "Tower Heater", image: `${S}/2025/10/SAWO_sauna_heaters_tower_SW3_Round_Ni2.webp`, copy: "A tall, sleek tower holding a large stone mass for a rich, steamy atmosphere." },
  { name: "Nordex Pro NS", kind: "Floor Heater", image: `${S}/2025/10/SAWO_sauna_heaters_floor_Nordex_Pro_NS.webp`, copy: "Separate stone compartment protects the elements for long-lasting performance." },
  { name: "Krios Ni2", kind: "Wall-Mounted Heater", image: `${S}/2025/10/SAWO_sauna_heaters_wall_KRI_Ni2.webp`, copy: "A larger stone container for a more humid Finnish experience, in stainless steel." },
  { name: "Aries Round Black Ni2", kind: "Tower Heater", image: `${S}/2025/10/SAWO_sauna_series_tower_ARI_Round_Black_Ni2.webp`, copy: "Tall and space-saving; spreads heat evenly from the centre or within a bench." },
  { name: "Scandia NS", kind: "Wall-Mounted Heater", image: `${S}/2025/10/SAWO_sauna_heaters_wall_SCA_NS.webp`, copy: "A classic heater for a truly traditional Finnish sauna — simple and reliable." },
];

export const accessorySets = [
  { name: "Traditional Set", finish: "Cedar", image: `${S}/2026/02/Traditional.jpg`, copy: "A clean, timeless finish with all the essentials for everyday sauna use." },
  { name: "Essential Set", finish: "Cedar", image: `${S}/2026/01/Essential-v3.png`, copy: "A wider collection of sauna items for added comfort and style." },
  { name: "Signature Set", finish: "Black & Cedar", image: `${S}/2026/02/Signature-BL-v4-copy.jpg`, copy: "An elegant, sophisticated set for a refined sauna ritual." },
  { name: "Dragon Set", finish: "Black & Cedar", image: `${S}/2025/12/Dragon-BL-v3.png`, copy: "A bold look from the Dragonfire Series by Finnish designer Stefan Lindfors." },
];
