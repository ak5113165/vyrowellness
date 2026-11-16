// Saunas page: price/trust strip, traditional-vs-infrared comparison,
// "ideal for" and installation requirements. Built from confirmed catalogue
// values; founder confirmations (16 Nov 2026): access door width 2.5 ft,
// show "10-year after-sales service" without naming the heater, show the
// lowest listed sauna price, NO free site survey and NO showroom — don't add
// either. Temperatures in the comparison are general typical ranges for each
// sauna type, not VYRO test figures.
import { afterSales, gstRatePercent, saunaInstallation, site } from "@/content/site";
import { formatInr } from "@/lib/format-inr";
import { heaters, saunaModels } from "@/content/sauna-catalogue";

/** Lowest listed Haven cabin MRP (cabin only), INR. */
export const saunaFromPriceInr = Math.min(...saunaModels.map((m) => m.priceInr));

const heaterKws = heaters.flatMap((h) => (h.options ?? []).map((o) => o.kw));
const heaterKwRange = heaterKws.length ? `${Math.min(...heaterKws)}–${Math.max(...heaterKws)} kW` : null;
const infraredKws = [...new Set(saunaModels.flatMap((m) => (m.infraredPanels ? [m.infraredPanels.kw] : [])))].sort((a, b) => a - b);

const footprints = saunaModels.map((m) => m.dimsFt);
const smallest = footprints.reduce((a, b) => (a.w * a.d <= b.w * b.d ? a : b));
const largest = footprints.reduce((a, b) => (a.w * a.d >= b.w * b.d ? a : b));
const cabinHeights = [...new Set(footprints.map((d) => d.h))];

export const saunaAccessDoorFt = 2.5;

export const saunaTrustStrip: string[] = [
  `Cabins from ${formatInr(saunaFromPriceInr)} + ${gstRatePercent}% GST`,
  `${saunaModels.length} cabin models`,
  `Installed by our team ${saunaInstallation.label}`,
  `${afterSales.heaterServiceYears}-year after-sales service`,
  `Every enquiry answered ${site.enquiryResponseTime}`,
];

export type ComparisonRow = { label: string; traditional: string; infrared: string };

export const saunaTypeComparison: { traditionalTitle: string; infraredTitle: string; rows: ComparisonRow[] } = {
  traditionalTitle: "Traditional · Haven Classic & Glass",
  infraredTitle: "Infrared · Haven Infrared & Compact",
  rows: [
    {
      label: "How it heats",
      traditional: "An electric heater warms the stones and the air around you.",
      infrared: "Infrared panels warm you directly, while the air stays cooler.",
    },
    {
      label: "Typical temperature",
      traditional: "Usually 70–90°C.",
      infrared: "Usually 45–60°C.",
    },
    {
      label: "Feel",
      traditional: "Dry, or add steam by pouring water over the stones.",
      infrared: "Gentle, dry warmth throughout.",
    },
    {
      label: "Warm-up",
      traditional: "Longer, as the whole room heats up.",
      infrared: "Quicker, as the panels warm you directly.",
    },
    {
      label: "Power",
      traditional: heaterKwRange ? `Ember heaters of ${heaterKwRange}, matched to your cabin.` : "An Ember heater matched to your cabin.",
      infrared: infraredKws.length ? `${infraredKws.join(" or ")} kW infrared panels.` : "Infrared panels.",
    },
    {
      label: "Seats",
      traditional: "1–3, 4–6 or 6+ people.",
      infrared: "1–2 people (IR-01) or 1 person (Compact).",
    },
    {
      label: "Best for",
      traditional: "The classic hot sauna, and shared sessions with family or guests.",
      infrared: "Gentler heat, solo sessions, apartments and smaller rooms.",
    },
  ],
};

export const saunaIdealFor: { title: string; copy: string; to?: "/commercial-wellness" }[] = [
  { title: "Homes & Villas", copy: "Classic or Glass cabins for a spare room, terrace or home gym." },
  { title: "Apartments", copy: "Haven Compact (3 × 3 ft) or Infrared (4 × 4 ft) for smaller rooms." },
  { title: "Hotels & Resorts", copy: "Large Classic and Glass cabins for guest wellness areas.", to: "/commercial-wellness" },
  { title: "Spas & Gyms", copy: "Larger cabins for busy wellness spaces, planned with your team.", to: "/commercial-wellness" },
];

export const saunaRequirements: { label: string; value: string }[] = [
  {
    label: "Floor space",
    value: `From ${smallest.w} × ${smallest.d} ft (Haven Compact) to ${largest.w} × ${largest.d} ft (Large cabins).`,
  },
  {
    label: "Height",
    value: `Every cabin is ${cabinHeights.join(" / ")} ft tall, so the room's ceiling must be higher than that.`,
  },
  {
    label: "Access door",
    value: `At least ${saunaAccessDoorFt} ft (76 cm) wide, so the cabin can be carried into the room.`,
  },
  {
    label: "Power",
    value: `A dedicated electrical supply for the heater${heaterKwRange ? ` (${heaterKwRange})` : ""} or infrared panels${infraredKws.length ? ` (${infraredKws.join("–")} kW)` : ""}. Your consultant confirms the exact load for your cabin.`,
  },
  {
    label: "Installation",
    value: `Delivered, installed and commissioned by our team ${saunaInstallation.label}.`,
  },
];
