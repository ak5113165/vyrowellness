import { createFileRoute } from '@tanstack/react-router'
import { Compass, Cpu, HeartHandshake } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { CtaBand } from "@/components/section";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { site } from "@/content/site";

import stillLifeImage from "@/assets/still-life.jpg";

export const Route = createFileRoute("/philosophy")({
  head: () => ({
    meta: [
      { title: "Our Philosophy — Wellness Should Feel Personal | VYRO" },
      {
        name: "description",
        content:
          "VYRO's philosophy: wellness should feel personal. Thoughtful living, considered technology and personal wellbeing — premium wellness technology designed around real life.",
      },
      { property: "og:title", content: "Our Philosophy — Wellness Should Feel Personal | VYRO" },
      {
        property: "og:description",
        content:
          "Thoughtful living, considered technology and personal wellbeing — how VYRO thinks about everyday wellness.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: PhilosophyPage,
});

function PhilosophyPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        {/* Opening statement */}
        <section className="mx-auto max-w-4xl px-5 pb-4 pt-20 text-center lg:pt-28">
          <Reveal>
            <p className="wordmark text-sm text-bronze-strong">VYRO</p>
            <h1 className="mt-6 font-display text-5xl font-medium leading-[1.1] sm:text-6xl">
              Wellness Should Feel Personal.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground">
              We started VYRO with a simple belief: advanced wellness technology should serve
              everyday life, not interrupt it. Not a trend to follow or a routine to copy — a way of
              living that feels like yours.
            </p>
          </Reveal>
        </section>

        {/* Still life */}
        <section className="mx-auto max-w-5xl px-5 py-14">
          <Reveal>
            <img
              src={stillLifeImage}
              alt="Balanced stacked stones on warm timber with soft steam rising against a dark backdrop"
              width={1920}
              height={1280}
              loading="lazy"
              className="aspect-[16/10] w-full rounded-sm object-cover"
            />
          </Reveal>
        </section>

        {/* Three principles */}
        <section className="mx-auto max-w-7xl px-5 pb-20 lg:px-8 lg:pb-28">
          <div className="grid gap-12 lg:grid-cols-3">
            {[
              {
                icon: Compass,
                title: "Thoughtful Living",
                copy: "Wellness should fit naturally into everyday life. The best ritual is the one you'll actually keep — so we design for consistency, comfort and calm rather than extremes.",
              },
              {
                icon: Cpu,
                title: "Considered Technology",
                copy: "Technology should be functional, beautiful and quietly easy to live with. We choose and design equipment with a thoughtful user experience at its centre.",
              },
              {
                icon: HeartHandshake,
                title: "Personal Wellbeing",
                copy: "Every person, home and business has different needs. There is no single prescription — we help you shape a wellness experience that feels right for your life.",
              },
            ].map((p, i) => (
              <Reveal key={p.title} delayMs={i * 100}>
                <p.icon className="h-6 w-6 text-bronze-strong" aria-hidden />
                <h2 className="mt-4 font-display text-3xl font-medium">{p.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.copy}</p>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Brand promise */}
        <section className="border-y border-border bg-secondary/60">
          <div className="mx-auto max-w-3xl px-5 py-20 text-center lg:py-24">
            <Reveal>
              <p className="overline text-bronze-strong">Our Promise</p>
              <p className="mt-5 font-display text-3xl font-medium leading-snug text-foreground sm:text-4xl">
                Bringing advanced wellness technology into everyday life.
              </p>
              <p className="mt-6 text-sm text-muted-foreground">{site.secondaryLine}</p>
            </Reveal>
          </div>
        </section>
      </main>
      <CtaBand
        title="Experience It for Yourself."
        copy="The best way to understand VYRO is to talk through your own space and routine with our team."
        cta={{ label: "Book a Consultation", to: "/contact" }}
      />
      <SiteFooter />
    </div>
  );
}
