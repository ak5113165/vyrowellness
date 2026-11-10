import { SectionHeading } from "@/components/section";
import { Reveal } from "@/components/reveal";
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

export function VyroDifference({ dark = false }: { dark?: boolean }) {
  return (
    <section className={dark ? "bg-ink" : "border-t border-border bg-card"}>
      <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24">
        <SectionHeading
          dark={dark}
          overline="The VYRO Difference"
          title="Expert Advice Before. Real Support After."
          copy="What sets VYRO apart is our wellness consultants and our after-sales service — from choosing the right product to looking after it for years."
        />
        <div
          className={`mt-14 grid gap-px border sm:grid-cols-2 lg:grid-cols-4 ${
            dark ? "border-ink-foreground/20 bg-ink-foreground/20" : "border-border bg-border"
          }`}
        >
          {vyroDifferencePoints.map((p, i) => (
            <Reveal key={p.title} delayMs={i * 80} className={dark ? "bg-ink p-7" : "bg-card p-7"}>
              <span className={`text-xs tracking-[0.2em] ${dark ? "text-bronze" : "text-bronze-strong"}`}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className={`mt-3 font-display text-2xl font-medium ${dark ? "text-ink-foreground" : "text-foreground"}`}>
                {p.title}
              </h3>
              <p className={`mt-3 text-sm leading-relaxed ${dark ? "text-ink-muted" : "text-muted-foreground"}`}>{p.copy}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
