import { afterSales } from "@/content/site";

// "The VYRO Difference": expert consultants and after-sales service.
// Every figure comes from afterSales in site.ts (founder-confirmed).

export const vyroDifferencePoints = [
  {
    title: "Expert Wellness Consultants",
    copy: "Every VYRO project is guided by a wellness consultant with in-depth knowledge of each product and of what works in the Indian market — so you choose the right fit for your space.",
  },
  {
    title: `${afterSales.heaterServiceYears} Years of Heater After-Sales`,
    copy: `Every VYRO sauna heater comes with ${afterSales.heaterServiceYears} years of after-sales service: a ${afterSales.heaterComprehensiveWarrantyYears}-year comprehensive warranty, followed by ${afterSales.heaterSupportYears} years of service support and spare parts (${afterSales.heaterSupportCharges}).`,
  },
  {
    title: "Woodwork Workmanship Warranty",
    copy: `Sauna woodwork carries a ${afterSales.woodworkWorkmanshipMonths}-month warranty against workmanship defects, subject to warranty conditions.`,
  },
  {
    title: "AMC on Every Product",
    copy: "Annual maintenance contracts are available for every VYRO product, so your sauna, cold plunge or wellness space is looked after year after year.",
  },
] as const;
