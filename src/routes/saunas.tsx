import { createFileRoute } from '@tanstack/react-router'
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { EnquiryForm } from "@/components/enquiry-form";

import saunaImage from "@/assets/sauna.jpg";
import infraredImage from "@/assets/infrared.jpg";
import homeWellnessImage from "@/assets/home-wellness.jpg";
import hospitalityImage from "@/assets/hospitality.jpg";

export const Route = createFileRoute("/saunas")({
  head: () => ({
    meta: [
      { title: "Saunas — The Art of Heat | VYRO" },
      {
        name: "description",
        content:
          "Thoughtfully designed traditional and infrared sauna systems for modern homes, personal wellness spaces and commercial environments in India. Explore premium home sauna solutions with VYRO.",
      },
      { property: "og:title", content: "Saunas — The Art of Heat | VYRO" },
      {
        property: "og:description",
        content:
          "Thoughtfully designed traditional and infrared sauna experiences for homes, wellness spaces and commercial environments.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: SaunasPage,
});

function SaunasPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <PageHero
          image={saunaImage}
          imageAlt="A warm natural-wood sauna interior with soft amber lighting, wooden benches and gentle steam"
          overline="Saunas"
          title="The Art of Heat."
          copy="Thoughtfully designed sauna experiences for modern homes, personal wellness spaces, and commercial environments."
        />

        {/* Traditional sauna systems */}
        <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <p className="eyebrow text-bronze-strong">Traditional Saunas</p>
              <h2 className="mt-3 font-display text-4xl font-medium leading-[1.15] sm:text-5xl">
                Warmth, the Classic Way.
              </h2>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
                Traditional sauna systems pair natural timber interiors with the timeless ritual of
                heat — the deep warmth, the gentle steam, the quiet afterwards. Designed as
                architectural spaces, they bring a sense of occasion to everyday recovery.
              </p>
              <ul className="mt-7 space-y-3 text-sm text-muted-foreground">
                <li className="border-b border-border pb-3">Natural timber interiors, crafted for calm</li>
                <li className="border-b border-border pb-3">Considered bench and lighting layouts</li>
                <li className="border-b border-border pb-3">Sizes and layouts shaped around your room</li>
              </ul>
            </Reveal>
            <Reveal delayMs={120}>
              <img
                src={saunaImage}
                alt="Traditional sauna interior in warm timber with soft lighting and a wooden bucket"
                width={1920}
                height={1280}
                loading="lazy"
                className="aspect-[4/3] w-full object-cover"
              />
            </Reveal>
          </div>
        </section>

        {/* Infrared sauna systems */}
        <section className="bg-ink">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 text-ink-foreground lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">
            <Reveal className="lg:order-2">
              <p className="eyebrow text-bronze">Infrared Saunas</p>
              <h2 className="mt-3 font-display text-4xl font-medium leading-[1.15] sm:text-5xl">
                Gentle, Modern Heat.
              </h2>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-muted">
                Infrared sauna systems offer a contemporary take on heat therapy — a softer,
                ambient warmth in a compact, beautifully finished cabin that fits more easily into
                everyday spaces and routines.
              </p>
              <ul className="mt-7 space-y-3 text-sm text-ink-muted">
                <li className="border-b border-ink-border pb-3">Compact cabins for homes and apartments</li>
                <li className="border-b border-ink-border pb-3">Warm, low-glare interior lighting</li>
                <li className="border-b border-ink-border pb-3">Simple controls designed for daily use</li>
              </ul>
            </Reveal>
            <Reveal delayMs={120} className="lg:order-1">
              <img
                src={infraredImage}
                alt="A modern infrared sauna cabin with warm red interior lighting and a glass door in a stone-walled wellness room"
                width={1920}
                height={1280}
                loading="lazy"
                className="aspect-[4/3] w-full object-cover"
              />
            </Reveal>
          </div>
        </section>

        {/* Installation possibilities */}
        <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24">
          <SectionHeading
            overline="Installation"
            title="Installation Possibilities."
            copy="Every space is different. During your consultation, our team helps you explore what's possible for your room, your building and your routine."
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-3">
            {[
              {
                title: "Within an Existing Room",
                copy: "Integrate a sauna cabin or infrared unit into a bathroom, spare room or corner of your home.",
              },
              {
                title: "A Dedicated Sauna Room",
                copy: "Plan a purpose-built wellness room, designed with your architect or interior designer.",
              },
              {
                title: "Outdoor & Garden Settings",
                copy: "Explore freestanding cabin possibilities for terraces, gardens and courtyard spaces.",
              },
            ].map((c, i) => (
              <Reveal key={c.title} delayMs={i * 80}>
                <div className="h-full rounded-sm border border-border bg-card p-7">
                  <p className="text-xs font-medium tracking-[0.2em] text-bronze-strong">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-3 font-display text-2xl font-medium">{c.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.copy}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Residential & commercial applications */}
        <section className="border-y border-border bg-secondary/60">
          <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24">
            <SectionHeading
              overline="Applications"
              title="At Home, and at Work."
              copy="The same considered design serves very different lives — a quiet ritual at home, or a signature experience in a commercial space."
            />
            <div className="mt-14 grid gap-6 lg:grid-cols-2">
              <Reveal>
                <img
                  src={homeWellnessImage}
                  alt="A private home sauna behind glass, integrated into a warm stone wellness suite"
                  width={1920}
                  height={1280}
                  loading="lazy"
                  className="aspect-[16/10] w-full rounded-sm object-cover"
                />
                <h3 className="mt-5 font-display text-3xl font-medium">For Your Home</h3>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
                  From a compact infrared cabin to a full traditional sauna room, designed around the
                  way you and your family actually live.
                </p>
              </Reveal>
              <Reveal delayMs={100}>
                <img
                  src={hospitalityImage}
                  alt="A luxury hotel spa corridor with arched stone doorways and a glimpse of a timber sauna"
                  width={1920}
                  height={1280}
                  loading="lazy"
                  className="aspect-[16/10] w-full rounded-sm object-cover"
                />
                <h3 className="mt-5 font-display text-3xl font-medium">For Your Business</h3>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
                  Saunas for gyms, hotels, spas and wellness centres — planned alongside your
                  operations and your members' experience.
                </p>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Consultation form */}
        <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
            <Reveal>
              <p className="eyebrow text-bronze-strong">Enquire</p>
              <h2 className="mt-3 font-display text-4xl font-medium leading-[1.15] sm:text-5xl">
                Begin with a Conversation.
              </h2>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground">
                Tell us about your space and what you're looking for. Our team will help you explore
                sauna options, installation possibilities and next steps.
              </p>
            </Reveal>
            <Reveal delayMs={120}>
              <EnquiryForm variant="consumer" defaultProductInterest="Sauna" />
            </Reveal>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
