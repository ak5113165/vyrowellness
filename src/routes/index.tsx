import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { EnquiryForm } from "@/components/enquiry-form";
import { site, whatsappLink } from "@/content/site";

import heroImage from "@/assets/hero.jpg";
import saunaImage from "@/assets/sauna.jpg";
import coldImage from "@/assets/cold-plunge.jpg";
import lightImage from "@/assets/red-light.jpg";
import homeWellnessImage from "@/assets/home-wellness.jpg";
import hospitalityImage from "@/assets/hospitality.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "VYRO — Premium Saunas, Cold Plunge & Red Light Therapy in India" },
      {
        name: "description",
        content:
          "VYRO designs and installs premium saunas, cold plunge baths and red light therapy for homes and businesses across India. Book a consultation.",
      },
      { property: "og:title", content: "VYRO — Wellness, Reimagined." },
      {
        property: "og:description",
        content:
          "Saunas, cold plunge and red light therapy — specified for your space and installed by our team across India.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const pillars = [
  {
    n: "01",
    image: saunaImage,
    alt: "A warm natural-wood sauna interior with soft amber lighting and wooden benches",
    name: "Saunas",
    tag: "Traditional Finnish & Infrared",
    copy: "Custom timber cabins for villas, penthouses and wellness suites.",
    to: "/saunas" as const,
    soon: false,
  },
  {
    n: "02",
    image: coldImage,
    alt: "A sculptural stone cold plunge tub with still water in a minimalist room",
    name: "Cold Plunge",
    tag: "Temperature-Controlled Recovery Baths",
    copy: "Chilled, filtered plunge systems — freestanding or built into your space.",
    to: "/cold-plunge" as const,
    soon: true,
  },
  {
    n: "03",
    image: lightImage,
    alt: "A sleek black red light therapy panel glowing deep red in a minimalist interior",
    name: "Red Light Therapy",
    tag: "Red & Near-Infrared Light Panels",
    copy: "Full-body and targeted panels for an everyday wellness routine.",
    to: "/red-light-therapy" as const,
    soon: true,
  },
];

const steps = [
  {
    n: "01",
    title: "Space Assessment",
    copy: "We review your floor plan, electrical layout and ventilation requirements.",
  },
  {
    n: "02",
    title: "Bespoke Specification",
    copy: "Dimensions, timber and finishes tailored to your architecture.",
  },
  {
    n: "03",
    title: "White-Glove Installation",
    copy: "Delivery, installation, commissioning and ongoing support in India.",
  },
];

function Index() {
  const wa = whatsappLink("Hello VYRO, I'd like to book a wellness consultation.");

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main>
        {/* 1. Hero */}
        <section className="relative flex min-h-[92svh] items-end overflow-hidden bg-ink">
          <img
            src={heroImage}
            alt="An architectural travertine wellness hall at dusk with a timber sauna cabin, a monolithic stone cold plunge and a glowing red light therapy panel"
            width={1920}
            height={1088}
            className="absolute inset-0 h-full w-full object-cover"
            fetchPriority="high"
          />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-ink/25" />
          <div className="relative mx-auto w-full max-w-7xl px-5 pb-20 pt-32 sm:pb-24 lg:px-8">
            <p className="eyebrow text-bronze">Saunas · Cold Plunge · Red Light Therapy</p>
            <h1 className="mt-4 max-w-3xl font-display text-5xl font-medium leading-[1.05] text-ink-foreground sm:text-7xl lg:text-8xl">
              Wellness, Reimagined.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-foreground/85 sm:text-lg">
              Premium heat, cold and light therapy — specified for your space and installed by our
              team, for homes and businesses across India.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <a
                href="#consultation"
                className="inline-flex items-center justify-center rounded-sm bg-ink-foreground px-7 py-3.5 text-[13px] uppercase tracking-[0.16em] text-ink transition-colors hover:bg-ink-foreground/90"
              >
                Book a Consultation
              </a>
              <a
                href="#products"
                className="inline-flex items-center justify-center rounded-sm border border-ink-foreground/50 px-7 py-3.5 text-[13px] uppercase tracking-[0.16em] text-ink-foreground transition-colors hover:bg-ink-foreground hover:text-ink"
              >
                View Products
              </a>
            </div>
            <nav aria-label="Our products" className="mt-14 grid grid-cols-1 border-t border-ink-foreground/20 sm:grid-cols-3">
              {pillars.map((p) => (
                <Link
                  key={p.to}
                  to={p.to}
                  className="group flex items-center justify-between border-b border-ink-foreground/20 py-4 text-ink-foreground sm:border-b-0 sm:border-r sm:px-5 sm:first:pl-0 sm:last:border-r-0"
                >
                  <span className="flex items-baseline gap-3">
                    <span className="text-xs text-bronze">{p.n}</span>
                    <span className="font-display text-xl sm:text-2xl">{p.name}</span>
                    {p.soon && (
                      <span className="hidden text-[10px] uppercase tracking-[0.2em] text-bronze lg:inline">
                        Coming Soon
                      </span>
                    )}
                  </span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              ))}
            </nav>
          </div>
        </section>

        {/* 2. Three pillars triptych */}
        <section id="products" className="scroll-mt-28 border-t border-border bg-card">
          <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
            <SectionHeading
              overline="The Collection"
              title="Three Products. One Standard."
              copy="Each one specified for your space and supported long after installation."
            />
            <div className="mt-14 grid border-t border-bronze/40 md:grid-cols-3">
              {pillars.map((p, i) => (
                <Reveal key={p.to} delayMs={i * 80}>
                  <Link
                    to={p.to}
                    className="group flex h-full flex-col border-b border-bronze/40 py-8 md:border-b-0 md:border-r md:px-6 md:first:pl-0 md:last:border-r-0 md:last:pr-0"
                  >
                    <span className="text-xs tracking-[0.2em] text-bronze-strong">{p.n}</span>
                    <div className="relative mt-5 overflow-hidden">
                      <img
                        src={p.image}
                        alt={p.alt}
                        width={1200}
                        height={1500}
                        loading="lazy"
                        className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      />
                      {p.soon && (
                        <span className="absolute left-4 top-4 bg-ink-foreground px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-ink">
                          Coming Soon · Made in India
                        </span>
                      )}
                    </div>
                    <p className="eyebrow mt-6 text-bronze-strong">{p.tag}</p>
                    <h3 className="mt-2 font-display text-3xl font-medium text-foreground">{p.name}</h3>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{p.copy}</p>
                    <span className="mt-6 inline-flex items-center gap-2 text-[13px] uppercase tracking-[0.16em] text-foreground transition-colors group-hover:text-bronze-strong">
                      {p.soon ? "Learn More" : "View Products"}{" "}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* 3. Residential vs Commercial */}
        <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
          <SectionHeading overline="Who It's For" title="Two Ways to Work With Us." />
          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {[
              {
                image: homeWellnessImage,
                alt: "A private home wellness suite with a glass-fronted sauna and stone plunge bath",
                title: "Private Residences",
                copy: "Villas, apartments and penthouses — from a single sauna to a complete home recovery suite.",
                to: "/saunas" as const,
                hash: "consultation",
              },
              {
                image: hospitalityImage,
                alt: "A luxury hotel spa corridor with arched stone doorways and warm cove lighting",
                title: "Studios, Clubs & Spas",
                copy: "Gyms, hotels, spas and workplaces planning wellness offerings for members and guests.",
                to: "/commercial-wellness" as const,
              },
            ].map((c, i) => (
              <Reveal key={c.title} delayMs={i * 80}>
                <Link
                  to={c.title === "Private Residences" ? "/contact" : c.to}
                  className="group block overflow-hidden rounded-sm border border-border bg-card"
                >
                  <div className="overflow-hidden">
                    <img
                      src={c.image}
                      alt={c.alt}
                      width={1920}
                      height={1280}
                      loading="lazy"
                      className="aspect-[16/10] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="p-7">
                    <h3 className="font-display text-3xl font-medium text-foreground">{c.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.copy}</p>
                    <span className="mt-5 inline-flex items-center gap-2 text-[13px] uppercase tracking-[0.16em] text-foreground group-hover:text-bronze-strong">
                      {c.title === "Private Residences" ? "Book a Consultation" : "Request Specifications"}
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>

        {/* 4. The VYRO Standard */}
        <section className="bg-ink">
          <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24">
            <SectionHeading dark overline="The VYRO Standard" title="From First Call to Final Fit." />
            <ol className="mt-14 grid border-t border-ink-foreground/20 md:grid-cols-3">
              {steps.map((s, i) => (
                <Reveal key={s.n} delayMs={i * 80}>
                  <li className="h-full border-b border-ink-foreground/20 py-8 md:border-b-0 md:border-r md:px-6 md:first:pl-0 md:last:border-r-0">
                    <span className="text-xs tracking-[0.2em] text-bronze">{s.n}</span>
                    <h3 className="mt-3 font-display text-2xl font-medium text-ink-foreground">{s.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-ink-muted">{s.copy}</p>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        {/* 5. Consultation form */}
        <section id="consultation" className="scroll-mt-28 bg-secondary/60">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 lg:grid-cols-[1fr_1.2fr] lg:gap-20 lg:px-8 lg:py-24">
            <Reveal>
              <p className="eyebrow text-bronze-strong">Private Consultation</p>
              <h2 className="mt-3 font-display text-4xl font-medium leading-[1.15] sm:text-5xl">
                Book a Consultation.
              </h2>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground">
                Tell us about your space and what you're considering. Our team will get back to you
                with next steps — no obligation.
              </p>
              <div className="mt-8 space-y-3 text-sm text-muted-foreground">
                <p>
                  Sales:{" "}
                  <a href={`mailto:${site.salesEmail}`} className="text-foreground underline underline-offset-4">
                    {site.salesEmail}
                  </a>
                </p>
                <p>
                  Support:{" "}
                  <a href={`mailto:${site.supportEmail}`} className="text-foreground underline underline-offset-4">
                    {site.supportEmail}
                  </a>
                </p>
                <p>
                  Phone:{" "}
                  <a href={site.phoneHref} className="text-foreground underline underline-offset-4">
                    {site.phoneDisplay}
                  </a>
                </p>
              </div>
              {wa && (
                <a
                  href={wa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-flex items-center justify-center gap-2 rounded-sm bg-primary px-7 py-3.5 text-[13px] uppercase tracking-[0.16em] text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Enquire on WhatsApp <ArrowRight className="h-4 w-4" aria-hidden />
                </a>
              )}
            </Reveal>
            <Reveal delayMs={120}>
              <EnquiryForm variant="consumer" />
            </Reveal>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
