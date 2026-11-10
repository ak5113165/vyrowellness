import { SectionHeading } from "@/components/section";
import { Reveal } from "@/components/reveal";
import { vyroDifferencePoints } from "@/content/vyro-difference";

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
