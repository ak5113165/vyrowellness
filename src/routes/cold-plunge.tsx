import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { EnquiryForm } from "@/components/enquiry-form";

import coldImage from "@/assets/cold-plunge.jpg";
import heroImage from "@/assets/hero.jpg";
import fitnessImage from "@/assets/fitness.jpg";

export const Route = createFileRoute("/cold-plunge")({
  head: () => ({
    meta: [
      { title: "Cold Plunge — Embrace the Cold | VYRO" },
      {
        name: "description",
        content:
          "Contemporary cold plunge tubs and ice bath systems for personal wellness spaces, fitness environments and professional recovery facilities in India. Explore cold plunge solutions with VYRO.",
      },
      { property: "og:title", content: "Cold Plunge — Embrace the Cold | VYRO" },
      {
        property: "og:description",
        content:
          "Contemporary cold plunge systems designed for personal wellness spaces, fitness environments and professional recovery facilities.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: ColdPlungePage,
});

function ColdPlungePage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <PageHero
          image={coldImage}
          imageAlt="A sculptural stone cold plunge tub with still water in a minimalist wellness room"
          overline="Cold Plunge"
          title="Embrace the Cold."
          copy="Contemporary cold plunge systems designed for personal wellness spaces, fitness environments, and professional recovery facilities."
        />

        {/* Home solutions */}
        <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <p className="overline text-bronze-strong">Home Solutions</p>
              <h2 className="mt-3 font-display text-4xl font-medium leading-[1.15] sm:text-5xl">
                Recovery, Steps from Your Door.
              </h2>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
                A cold plunge at home turns recovery into a daily ritual rather than an occasional
                treat. From compact tubs that suit a corner of a room to sculptural basins that
                anchor a wellness suite, we help you find a system that fits your space and your
                routine.
              </p>
            </Reveal>
            <Reveal delayMs={120}>
              <img
                src={coldImage}
                alt="A stone cold plunge tub in a private wellness room with timber floors and soft daylight"
                width={1920}
                height={1280}
                loading="lazy"
                className="aspect-[4/3] w-full object-cover"
              />
            </Reveal>
          </div>
        </section>

        {/* Premium installations */}
        <section className="bg-ink">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 text-ink-foreground lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">
            <Reveal className="lg:order-2">
              <p className="overline text-bronze">Premium Installations</p>
              <h2 className="mt-3 font-display text-4xl font-medium leading-[1.15] sm:text-5xl">
                Designed as Architecture.
              </h2>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-muted">
                For villas, farmhouses and considered new builds, a plunge can be planned as part of
                the architecture itself — integrated with saunas, terraces and landscape. We work
                alongside your architect or designer from concept to completion.
              </p>
            </Reveal>
            <Reveal delayMs={120} className="lg:order-1">
              <img
                src={heroImage}
                alt="An outdoor wellness terrace at dusk with a stone plunge basin beside a timber sauna cabin"
                width={1920}
                height={1280}
                loading="lazy"
                className="aspect-[4/3] w-full object-cover"
              />
            </Reveal>
          </div>
        </section>

        {/* Commercial recovery solutions */}
        <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <img
                src={fitnessImage}
                alt="A premium gym recovery zone with a dark cold plunge tub and a glass sauna cabin"
                width={1920}
                height={1280}
                loading="lazy"
                className="aspect-[4/3] w-full object-cover"
              />
            </Reveal>
            <Reveal delayMs={120}>
              <p className="overline text-bronze-strong">Commercial Recovery</p>
              <h2 className="mt-3 font-display text-4xl font-medium leading-[1.15] sm:text-5xl">
                Built for Daily Demand.
              </h2>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
                Gyms, performance centres, spas and sports facilities need cold therapy that holds
                up to daily use. We help commercial teams plan plunge and ice bath setups around
                member flow, maintenance and the wider recovery offer.
              </p>
              <div className="mt-7">
                <a
                  href="/commercial-wellness"
                  className="inline-flex items-center gap-2 text-[13px] uppercase tracking-[0.16em] text-foreground underline decoration-bronze decoration-2 underline-offset-8 transition-colors hover:text-bronze-strong"
                >
                  Explore Commercial Wellness
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        {/* FAQs */}
        <section className="border-y border-border bg-secondary/60">
          <div className="mx-auto max-w-3xl px-5 py-20 lg:py-24">
            <SectionHeading align="center" overline="FAQs" title="Questions, Answered Simply." />
            <Reveal className="mt-10">
              <Accordion type="single" collapsible className="border-t border-border">
                {[
                  {
                    q: "How much space does a cold plunge need?",
                    a: "It depends on the system. Compact plunges can suit smaller rooms, while premium installations need more room and planning. Share your floor plan in a consultation and we'll help you explore what fits.",
                  },
                  {
                    q: "Do you help with installation?",
                    a: "We guide you through the considerations for your space — plumbing, positioning and surroundings — during your consultation. Ask us about installation when you enquire.",
                  },
                  {
                    q: "Can a cold plunge be placed outdoors?",
                    a: "Some systems are suited to outdoor settings and others belong indoors. The right choice depends on the system and your space — our team can advise during your consultation.",
                  },
                  {
                    q: "How do I choose the right system?",
                    a: "Start with how and where you plan to use it. Our consultation covers your space, your routine and your preferences so you can choose with confidence.",
                  },
                ].map((f) => (
                  <AccordionItem key={f.q} value={f.q} className="border-b border-border">
                    <AccordionTrigger className="text-left font-display text-xl font-medium text-foreground hover:no-underline">
                      {f.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                      {f.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Reveal>
          </div>
        </section>

        {/* Consultation form */}
        <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
            <Reveal>
              <p className="overline text-bronze-strong">Enquire</p>
              <h2 className="mt-3 font-display text-4xl font-medium leading-[1.15] sm:text-5xl">
                Talk Cold with Our Team.
              </h2>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground">
                Tell us about your space and your recovery routine. We'll help you explore cold
                plunge options and the next steps.
              </p>
            </Reveal>
            <Reveal delayMs={120}>
              <EnquiryForm variant="consumer" defaultProductInterest="Cold Plunge" />
            </Reveal>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
