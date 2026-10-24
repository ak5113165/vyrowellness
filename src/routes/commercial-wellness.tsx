import { Building2, Dumbbell, PenTool, Briefcase, Sparkles, Trees } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { EnquiryForm } from "@/components/enquiry-form";

import hospitalityImage from "@/assets/hospitality.jpg";
import fitnessImage from "@/assets/fitness.jpg";
import studioImage from "@/assets/wellness-studio.jpg";

export const Route = createFileRoute("/commercial-wellness")({
  head: () => ({
    meta: [
      { title: "Commercial Wellness — Wellness Designed for Business | VYRO" },
      {
        name: "description",
        content:
          "Commercial wellness solutions for gyms, luxury hotels, spas, fitness studios, architects and workplaces in India. Sauna, cold plunge and red light therapy equipment and wellness-space planning with VYRO.",
      },
      { property: "og:title", content: "Commercial Wellness — Wellness Designed for Business | VYRO" },
      {
        property: "og:description",
        content:
          "Thoughtfully planned wellness solutions for gyms, hotels, spas, studios, architects and commercial spaces.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: CommercialPage,
});

function CommercialPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <PageHero
          image={hospitalityImage}
          imageAlt="A luxury hotel spa corridor with arched stone doorways and warm cove lighting"
          overline="Commercial Wellness"
          title="Wellness Designed for Business."
          copy="Thoughtfully planned wellness solutions for gyms, hotels, spas, fitness studios, architects, and commercial wellness spaces."
        />

        {/* Audiences */}
        <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24">
          <SectionHeading
            overline="Who We Work With"
            title="Different Spaces, One Standard."
            copy="Every commercial wellness project starts with the experience you want your members, guests and teams to have — we plan backwards from there."
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Building2,
                title: "Luxury Hotels & Hospitality",
                copy: "Sauna, cold and light experiences that become part of your property's signature.",
              },
              {
                icon: Dumbbell,
                title: "Premium Gyms",
                copy: "Recovery zones that match the quality of your training floor — and keep members coming back.",
              },
              {
                icon: Sparkles,
                title: "Wellness Studios & Spas",
                copy: "Heat, cold and light therapies woven into considered treatment and class journeys.",
              },
              {
                icon: Trees,
                title: "Residential Developments",
                copy: "Shared wellness amenities that set a development apart, planned with developers and facility teams.",
              },
              {
                icon: PenTool,
                title: "Architects & Interior Designers",
                copy: "A partner for planning wellness rooms, services and equipment into your drawings.",
              },
              {
                icon: Briefcase,
                title: "Corporate Wellness Spaces",
                copy: "Recovery environments for workplaces that invest in how their people feel.",
              },
            ].map((c, i) => (
              <Reveal key={c.title} delayMs={i * 60}>
                <div className="h-full rounded-sm border border-border bg-card p-7">
                  <c.icon className="h-6 w-6 text-bronze-strong" aria-hidden />
                  <h3 className="mt-4 font-display text-2xl font-medium">{c.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.copy}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* How VYRO helps */}
        <section className="bg-ink">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 text-ink-foreground lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">
            <Reveal className="lg:order-2">
              <p className="overline text-bronze">How VYRO Helps</p>
              <h2 className="mt-3 font-display text-4xl font-medium leading-[1.15] sm:text-5xl">
                From First Sketch to First Session.
              </h2>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-muted">
                VYRO helps businesses explore equipment selection and wellness-space planning —
                matching heat, cold and light solutions to your space, your operations and the
                experience you want to create. Share your project and we'll shape the direction
                together.
              </p>
            </Reveal>
            <Reveal delayMs={120} className="lg:order-1">
              <img
                src={fitnessImage}
                alt="A premium gym recovery zone with a cold plunge tub and sauna cabin under warm lighting"
                width={1920}
                height={1280}
                loading="lazy"
                className="aspect-[4/3] w-full object-cover"
              />
            </Reveal>
          </div>
        </section>

        {/* Studio imagery band */}
        <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24">
          <Reveal>
            <img
              src={studioImage}
              alt="A boutique wellness studio interior with timber, stone, linen textures and a sauna cabin"
              width={1920}
              height={1280}
              loading="lazy"
              className="aspect-[16/9] w-full rounded-sm object-cover"
            />
          </Reveal>
        </section>

        {/* B2B enquiry form */}
        <section className="border-t border-border bg-secondary/60">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 lg:grid-cols-[1fr_1.2fr] lg:gap-20 lg:px-8 lg:py-24">
            <Reveal>
              <p className="overline text-bronze-strong">Project Enquiry</p>
              <h2 className="mt-3 font-display text-4xl font-medium leading-[1.15] sm:text-5xl">
                Let's Talk About Your Project.
              </h2>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground">
                Tell us about your business, your space and your plans. Our commercial team will
                help you explore equipment options and wellness-space planning for your project.
              </p>
            </Reveal>
            <Reveal delayMs={120}>
              <EnquiryForm variant="business" />
            </Reveal>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
