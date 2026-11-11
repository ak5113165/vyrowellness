import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { EnquiryForm } from "@/components/enquiry-form";
import { responsive, SIZES } from "@/lib/responsive-image";
import { pageHead, breadcrumbJsonLd } from "@/lib/seo";
import { coldPlungeLaunch, saunaInstallation, site, whatsappLink } from "@/content/site";
import { consultationSteps } from "@/content/process";
import { fromPrice as glacierFromPrice, launchLabel } from "@/content/glacier-catalogue";
// Only images of real VYRO products or neutral spaces: the hero is a spa corridor
// with sauna doorways; the cards use the product renders from the product pages.
import spaceImage from "@/assets/hospitality.jpg";
import saunaImage from "@/assets/products/haven-s02.jpg";
import plungeImage from "@/assets/plunge/glacier-inflatable.jpg";
import lightImage from "@/assets/red-light.jpg";

export const Route = createFileRoute("/wellness-spaces")({
  head: () =>
    pageHead({
      path: "/wellness-spaces",
      title: "Complete Wellness Spaces — Sauna, Cold Plunge & Red Light | VYRO Wellness",
      description:
        "Plan a complete wellness space with VYRO: a sauna, cold plunge and red light therapy designed together for your home or business in India, from space assessment to installation.",
      ogTitle: "Complete Wellness Spaces | VYRO",
      ogDescription:
        "Sauna, cold plunge and red light therapy, planned together as one space — for your home or your business.",
      image: "/og/wellness-spaces.jpg",
      jsonLd: [
        breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Wellness Spaces", path: "/wellness-spaces" },
        ]),
      ],
    }),
  component: WellnessSpacesPage,
});

const elements = [
  {
    name: "Sauna",
    series: "VYRO Haven",
    copy: `Traditional, glass-front, infrared and compact cabins in spruce, with six wood upgrades — installed ${saunaInstallation.label}.`,
    to: "/saunas" as const,
    cta: "Explore Saunas",
    image: saunaImage,
    alt: "VYRO Haven Classic S-02 sauna cabin in spruce",
  },
  {
    name: "Cold Plunge",
    series: "VYRO Glacier",
    copy: `Glacier Barrel, Portable and Acrylic launch on ${launchLabel}${
      glacierFromPrice ? `, from ${glacierFromPrice} MRP + GST, including the 1HP chiller and installation` : ""
    } — available first in ${coldPlungeLaunch.serviceLocations.join(", ")}.`,
    to: "/cold-plunge" as const,
    cta: "View the Launch Range",
    image: plungeImage,
    alt: "VYRO Glacier Barrel cold plunge with its 1HP chiller and step",
  },
  {
    name: "Red Light Therapy",
    series: "Coming Soon",
    copy: "Panels for personal routines and larger-format systems for dedicated rooms — plan the wall space now.",
    to: "/red-light-therapy" as const,
    cta: "Learn More",
    image: lightImage,
    alt: "A tall red light therapy panel glowing deep red against an ivory wall",
  },
];

const reasons = [
  {
    title: "One Assessment",
    copy: "Power, drainage and ventilation are reviewed once, for every piece in the room — not product by product.",
  },
  {
    title: "One Design Language",
    copy: "Timber, finishes and placement chosen so the sauna, plunge and light sit together as a single space.",
  },
  {
    title: "One Team",
    copy: "The same VYRO team from the first consultation to installation and support.",
  },
];

function WellnessSpacesPage() {
  const wa = whatsappLink("Hello VYRO, I'd like to plan a complete wellness space.");

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main id="main">
        {/* Hero */}
        <section className="relative flex min-h-[70svh] items-end overflow-hidden bg-ink">
          <img
            src={spaceImage}
            {...responsive(spaceImage, SIZES.fullBleed)}
            alt="A calm spa corridor with arched stone doorways, a timber sauna and warm cove lighting"
            width={1920}
            height={1280}
            className="absolute inset-0 h-full w-full object-cover"
            fetchPriority="high"
          />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/10" />
          <div className="relative mx-auto w-full max-w-7xl px-5 pb-14 pt-40 lg:px-8">
            <p className="eyebrow text-bronze">Complete Wellness Spaces</p>
            <h1 className="mt-3 max-w-3xl font-display text-5xl font-medium leading-[1.05] text-ink-foreground sm:text-7xl">
              Heat, Cold and Light, Planned as One Room
            </h1>
            <p className="mt-5 max-w-xl text-ink-foreground/80">
              A sauna, a cold plunge and red light therapy, designed together for your home or your business.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
              <a
                href="#enquire"
                className="inline-flex items-center gap-2 rounded-sm bg-ink-foreground px-6 py-3 text-[12px] uppercase tracking-[0.16em] text-ink transition-colors hover:bg-ink-foreground/90"
              >
                Plan Your Space <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
              {wa && (
                <a
                  href={wa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[12px] uppercase tracking-[0.16em] text-ink-foreground/85 underline decoration-bronze underline-offset-8 hover:text-ink-foreground"
                >
                  Talk on WhatsApp
                </a>
              )}
            </div>
          </div>
        </section>

        {/* What a space can include */}
        <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24">
          <SectionHeading
            overline="What a Space Can Include"
            title="Choose One, Two or All Three"
            copy="Start with a single sauna and plan for the rest, or bring everything in at once."
          />
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {elements.map((e, i) => (
              <Reveal key={e.name} delayMs={i * 80}>
                <Link to={e.to} className="group flex h-full flex-col">
                  <div className="overflow-hidden bg-ink">
                    <img
                      src={e.image}
                      {...responsive(e.image, SIZES.third)}
                      alt={e.alt}
                      width={1024}
                      height={1024}
                      loading="lazy"
                      className="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                  </div>
                  <p className="eyebrow mt-6 text-bronze-strong">{e.series}</p>
                  <h3 className="mt-2 font-display text-3xl font-medium">{e.name}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{e.copy}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.16em] group-hover:text-bronze-strong">
                    {e.cta} <ArrowRight className="h-4 w-4" aria-hidden />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Why plan together */}
        <section className="bg-ink text-ink-foreground">
          <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
            <p className="eyebrow text-bronze">Planned Together</p>
            <h2 className="mt-3 max-w-2xl font-display text-4xl font-medium leading-[1.15] sm:text-5xl">
              Better as One Project Than Three Purchases
            </h2>
            <div className="mt-12 grid gap-10 md:grid-cols-3">
              {reasons.map((r) => (
                <div key={r.title} className="border-t border-ink-foreground/20 pt-6">
                  <h3 className="font-display text-2xl font-medium">{r.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-muted">{r.copy}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Homes / businesses */}
        <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <div className="grid gap-px border border-border bg-border md:grid-cols-2">
            <div className="flex flex-col bg-card p-8 lg:p-10">
              <p className="eyebrow text-bronze-strong">For Homes</p>
              <h3 className="mt-3 font-display text-3xl font-medium">Villas, Apartments and Penthouses</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                From a compact sauna in an apartment to a full wellness room in a villa — sized to your floor plan.
              </p>
              <a href="#enquire" className="mt-6 inline-flex items-center gap-2 self-start text-[12px] uppercase tracking-[0.16em] hover:text-bronze-strong">
                Plan Your Home Space <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
            </div>
            <div className="flex flex-col bg-card p-8 lg:p-10">
              <p className="eyebrow text-bronze-strong">For Businesses</p>
              <h3 className="mt-3 font-display text-3xl font-medium">Gyms, Hotels, Spas and Studios</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                Recovery zones and wellness suites for members and guests, planned with your architects and designers.
              </p>
              <Link to="/commercial-wellness" className="mt-6 inline-flex items-center gap-2 self-start text-[12px] uppercase tracking-[0.16em] hover:text-bronze-strong">
                Commercial Wellness <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="border-y border-border bg-secondary/60">
          <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
            <SectionHeading overline="How It Comes Together" title="From Floor Plan to First Session" />
            <ol className="mt-12 grid gap-10 md:grid-cols-3">
              {consultationSteps.map((s) => (
                <li key={s.n} className="border-t border-foreground pt-6">
                  <span className="text-xs tracking-[0.2em] text-bronze-strong">{s.n}</span>
                  <h3 className="mt-3 font-display text-2xl font-medium">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.copy}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Enquiry */}
        <section id="enquire" className="scroll-mt-24 mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
            <Reveal>
              <p className="eyebrow text-bronze-strong">Start With a Conversation</p>
              <h2 className="mt-3 font-display text-4xl font-medium leading-[1.15] sm:text-5xl">Plan Your Wellness Space</h2>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground">
                Tell us about the room and what you'd like in it. Our team replies {site.enquiryResponseTime} with next
                steps — no obligation.
              </p>
            </Reveal>
            <Reveal delayMs={120}>
              <EnquiryForm variant="consumer" defaultProductInterest="Complete Home Wellness" />
            </Reveal>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
