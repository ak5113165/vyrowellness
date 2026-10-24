import { createFileRoute } from '@tanstack/react-router'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { EnquiryForm } from "@/components/enquiry-form";

import lightImage from "@/assets/red-light.jpg";
import homeWellnessImage from "@/assets/home-wellness.jpg";
import fitnessImage from "@/assets/fitness.jpg";

export const Route = createFileRoute("/red-light-therapy")({
  head: () => ({
    meta: [
      { title: "Red Light Therapy — Light, Reconsidered | VYRO" },
      {
        name: "description",
        content:
          "Modern red light therapy panels and larger-format systems for homes, gyms, studios and professional wellness spaces in India. Explore red light therapy equipment with VYRO.",
      },
      { property: "og:title", content: "Red Light Therapy — Light, Reconsidered | VYRO" },
      {
        property: "og:description",
        content:
          "Modern red light therapy equipment designed to integrate into personal routines and professional spaces.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: RedLightPage,
});

function RedLightPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <PageHero
          image={lightImage}
          imageAlt="A sleek black red light therapy panel glowing deep red in a minimalist interior"
          overline="Red Light Therapy"
          title="Light, Reconsidered."
          copy="Modern red light therapy equipment designed to integrate quietly into your personal wellness routine."
        />

        {/* Panels */}
        <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <p className="eyebrow text-bronze-strong">Panels</p>
              <h2 className="mt-3 font-display text-4xl font-medium leading-[1.15] sm:text-5xl">
                Everyday Light, Beautifully Made.
              </h2>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
                Red light therapy panels bring light-based wellness into daily life. Designed to
                stand, lean or mount in bedrooms, home gyms and wellness corners, they turn a few
                quiet minutes into a ritual you'll keep.
              </p>
              <ul className="mt-7 space-y-3 text-sm text-muted-foreground">
                <li className="border-b border-border pb-3">Designed to complement modern interiors</li>
                <li className="border-b border-border pb-3">Simple, unobtrusive controls</li>
                <li className="border-b border-border pb-3">Suited to personal routines at home</li>
              </ul>
            </Reveal>
            <Reveal delayMs={120}>
              <img
                src={lightImage}
                alt="A tall black red light therapy panel leaning against an ivory wall, glowing deep red"
                width={1920}
                height={1280}
                loading="lazy"
                className="aspect-[4/3] w-full object-cover"
              />
            </Reveal>
          </div>
        </section>

        {/* Larger-format systems */}
        <section className="bg-ink">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 text-ink-foreground lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">
            <Reveal className="lg:order-2">
              <p className="eyebrow text-bronze">Larger-Format Systems</p>
              <h2 className="mt-3 font-display text-4xl font-medium leading-[1.15] sm:text-5xl">
                For Dedicated Spaces.
              </h2>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-muted">
                Larger-format light systems are designed for dedicated wellness rooms, home suites,
                gyms and professional settings — where light therapy is part of a wider recovery and
                wellness environment.
              </p>
            </Reveal>
            <Reveal delayMs={120} className="lg:order-1">
              <img
                src={homeWellnessImage}
                alt="A red light panel mounted within a private wellness suite alongside a sauna and plunge bath"
                width={1920}
                height={1280}
                loading="lazy"
                className="aspect-[4/3] w-full object-cover"
              />
            </Reveal>
          </div>
        </section>

        {/* Residential & professional applications */}
        <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24">
          <SectionHeading
            overline="Applications"
            title="At Home, and in Practice."
            copy="From a quiet corner at home to a professional recovery room, light therapy adapts to the setting."
          />
          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            <Reveal>
              <div className="h-full border-t-2 border-foreground pt-6">
                <p className="eyebrow text-bronze-strong">At Home</p>
                <h3 className="mt-3 font-display text-3xl font-medium">Residential</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Panels and compact systems that integrate into bedrooms, home gyms and personal
                  wellness spaces — used on your schedule, in your space.
                </p>
              </div>
            </Reveal>
            <Reveal delayMs={100}>
              <div className="h-full border-t-2 border-foreground pt-6">
                <p className="eyebrow text-bronze-strong">In Practice</p>
                <h3 className="mt-3 font-display text-3xl font-medium">Professional</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Larger systems for gyms, studios, spas and recovery centres — planned around your
                  members and the wider wellness experience you offer.
                </p>
              </div>
            </Reveal>
          </div>
          <Reveal className="mt-10">
            <img
              src={fitnessImage}
              alt="A premium gym recovery zone with dark walls, warm lighting and a sauna cabin"
              width={1920}
              height={1280}
              loading="lazy"
              className="aspect-[16/10] w-full rounded-sm object-cover"
            />
          </Reveal>
        </section>

        {/* FAQs */}
        <section className="border-y border-border bg-secondary/60">
          <div className="mx-auto max-w-3xl px-5 py-20 lg:py-24">
            <SectionHeading align="center" overline="FAQs" title="Good Questions, Straight Answers." />
            <Reveal className="mt-10">
              <Accordion type="single" collapsible className="border-t border-border">
                {[
                  {
                    q: "What is red light therapy used for?",
                    a: "Red light therapy panels are used in everyday wellness routines at homes, gyms and studios. We don't make medical claims — if you have a health condition, please consult your doctor.",
                  },
                  {
                    q: "What's the difference between a panel and a larger system?",
                    a: "Panels suit personal routines and smaller spaces; larger-format systems are designed for dedicated rooms, studios and professional settings. The right choice depends on your space and how you plan to use it.",
                  },
                  {
                    q: "Where can a panel be placed?",
                    a: "Most panels are designed to integrate into bedrooms, home gyms and wellness rooms. We can help you think through placement and surroundings during a consultation.",
                  },
                  {
                    q: "Will you help us understand how to use it?",
                    a: "Yes — we're happy to walk you through setup and everyday use. Ask us during your consultation.",
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

        {/* Enquiry */}
        <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
            <Reveal>
              <p className="eyebrow text-bronze-strong">Enquire</p>
              <h2 className="mt-3 font-display text-4xl font-medium leading-[1.15] sm:text-5xl">
                Find Your Light.
              </h2>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground">
                Tell us about your space and routine. We'll help you explore red light therapy
                options that fit.
              </p>
            </Reveal>
            <Reveal delayMs={120}>
              <EnquiryForm variant="consumer" defaultProductInterest="Red Light Therapy" />
            </Reveal>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
