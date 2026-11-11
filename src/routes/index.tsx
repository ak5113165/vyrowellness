import { Link, createFileRoute } from "@tanstack/react-router";
import { responsive, SIZES } from "@/lib/responsive-image";
import { faqJsonLd, pageHead } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { ArrowRight, BookOpen } from "lucide-react";
import { specSheets } from "@/components/download-link";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section";
import { VyroDifference } from "@/components/vyro-difference";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { EnquiryForm } from "@/components/enquiry-form";
import { coldPlungeLaunch, saunaAvailability, saunaInstallation, site, whatsappLink } from "@/content/site";
import { fromPrice as glacierFromPrice } from "@/content/glacier-catalogue";
import { consultationSteps } from "@/content/process";
import { beforeYouBuyFaqs } from "@/content/buyer-faqs";
import { FaqSection } from "@/components/faq-section";
import { SpecialistCallout } from "@/components/specialist-callout";

// Hero: a VYRO-branded spruce sauna (the previous hero showed a stone plunge VYRO does not sell).
import heroImage from "@/assets/products/sauna-hero-spruce.jpg";
// Collection cards use the product renders from the product pages (cream
// background, shown whole). Red light has no product render yet, so it keeps
// its lifestyle photo until one exists.
import saunaImage from "@/assets/products/haven-s02.jpg";
import coldImage from "@/assets/plunge/glacier-inflatable.jpg";
import lightImage from "@/assets/red-light.jpg";
// Private Residences card: warm sauna interior (replaces a photo with a stone plunge VYRO does not sell).
import homeWellnessImage from "@/assets/sauna.jpg";
import hospitalityImage from "@/assets/hospitality.jpg";

export const Route = createFileRoute("/")({
  head: () =>
    pageHead({
      path: "/",
      title: "VYRO Wellness — Premium Saunas, Cold Plunge & Red Light Therapy in India",
      description:
        `VYRO designs and installs premium saunas ${saunaInstallation.label}, with Glacier cold plunges launching ${coldPlungeLaunch.label} and red light therapy coming soon. Book a consultation.`,
      ogTitle: "VYRO — Wellness, Reimagined.",
      ogDescription:
        "Saunas, cold plunge and red light therapy — specified for your space and installed by our team in India.",
      jsonLd: [faqJsonLd(beforeYouBuyFaqs)],
    }),
  component: Index,
});

const pillars = [
  {
    n: "01",
    image: saunaImage,
    alt: "VYRO Haven Classic S-02 sauna cabin in spruce with a timber door and glass panel",
    product: true,
    name: "Saunas",
    tag: "Traditional Finnish & Infrared",
    copy: `Custom timber cabins for villas, penthouses and wellness suites — installed ${saunaInstallation.label}.`,
    to: "/saunas" as const,
    soon: false,
    badge: saunaAvailability.availableNow ? saunaAvailability.label : undefined,
  },
  {
    n: "02",
    image: coldImage,
    alt: "VYRO Glacier Barrel cold plunge with its 1HP chiller and step",
    product: true,
    name: "Cold Plunge",
    tag: "VYRO Glacier · Made in India",
    copy: `Glacier Barrel, Portable and Acrylic — launching ${coldPlungeLaunch.label}${glacierFromPrice ? `, from ${glacierFromPrice} MRP + GST, including chiller and installation` : ""}.`,
    to: "/cold-plunge" as const,
    soon: true,
    soonLabel: `Launching ${coldPlungeLaunch.shortLabel}`,
    navLabel: `Launching ${coldPlungeLaunch.shortLabel}`,
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

const steps = consultationSteps;

function Index() {
  const wa = whatsappLink("Hello VYRO, I'd like to book a wellness consultation.");

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main id="main">
        {/* 1. Hero */}
        <section className="relative flex min-h-[92svh] items-end overflow-hidden bg-ink">
          <img
            src={heroImage}
            {...responsive(heroImage, SIZES.fullBleed)}
            alt="A VYRO spruce sauna at night with glowing tiered benches, a stone tower heater and the VYRO Wellness plaque"
            width={1920}
            height={1088}
            className="absolute inset-0 h-full w-full object-cover"
            fetchPriority="high"
          />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-ink/25" />
          <div className="relative mx-auto w-full max-w-7xl px-5 pb-20 pt-32 sm:pb-24 lg:px-8">
            <p className="eyebrow text-bronze">{site.tagline.replace(/\.$/, "")}</p>
            <h1 className="mt-4 max-w-4xl font-display text-5xl font-medium leading-[1.05] text-ink-foreground sm:text-7xl">
              Saunas and Cold Plunges for Indian Homes and Businesses
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-foreground/85 sm:text-lg">
              Haven sauna cabins, available now and installed by our team {saunaInstallation.label}. Glacier cold plunges,
              made in {coldPlungeLaunch.madeIn} and launching {coldPlungeLaunch.label}. Red
              light therapy to follow.
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
              <a
                href={specSheets.catalogue.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-2 py-3.5 text-[13px] uppercase tracking-[0.16em] text-ink-foreground underline decoration-bronze underline-offset-8 transition-colors hover:text-bronze"
              >
                <BookOpen className="h-4 w-4" aria-hidden /> View Catalogue
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
                    {(p.soon || p.badge) && (
                      <span className="hidden text-xs uppercase tracking-[0.2em] text-bronze lg:inline">
                        {p.soon ? (p.navLabel ?? "Coming Soon") : p.badge}
                      </span>
                    )}
                  </span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              ))}
            </nav>
          </div>
        </section>

        {/* Confirmed facts strip */}
        <section aria-label="Why VYRO" className="border-b border-border bg-card">
          <dl className="mx-auto grid max-w-7xl grid-cols-1 gap-px bg-border sm:grid-cols-3">
            {[
              { label: "Saunas", value: `Installed ${saunaInstallation.label}` },
              {
                label: "Glacier Cold Plunge",
                value: `Made in ${coldPlungeLaunch.madeIn} · launching ${coldPlungeLaunch.shortLabel}`,
              },
              { label: "Every Enquiry", value: `Answered ${site.enquiryResponseTime}` },
            ].map(({ label, value }) => (
              <div key={label} className="bg-card px-5 py-6 lg:px-8">
                <dt className="eyebrow text-bronze-strong">{label}</dt>
                <dd className="mt-2 font-display text-lg font-medium leading-snug sm:text-xl">{value}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* 2. Three pillars triptych */}
        <section id="products" className="scroll-mt-28 border-t border-border bg-card">
          <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
            <SectionHeading
              overline="The Collection"
              title="Heat, Cold and Light"
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
                      {/* Square frames: the square product renders fill them exactly; the
                          red light lifestyle photo is cropped to match. */}
                      <img
                        src={p.image}
                        {...responsive(p.image, SIZES.third)}
                        alt={p.alt}
                        width={p.product ? 1024 : 1200}
                        height={p.product ? 1024 : 1200}
                        loading="lazy"
                        className={cn(
                          "aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]",
                          !p.product && "object-[center_60%]",
                        )}
                      />
                      {(p.soon || p.badge) && (
                        <span className="absolute left-4 top-4 bg-ink px-3 py-1.5 text-xs uppercase tracking-[0.2em] text-ink-foreground">
                          {p.soon ? (p.soonLabel ?? "Coming Soon") : p.badge}
                        </span>
                      )}
                    </div>
                    <p className="eyebrow mt-6 text-bronze-strong">{p.tag}</p>
                    <h3 className="mt-2 font-display text-3xl font-medium text-foreground">{p.name}</h3>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{p.copy}</p>
                    <span className="mt-6 inline-flex items-center gap-2 text-[13px] uppercase tracking-[0.16em] text-foreground transition-colors group-hover:text-bronze-strong">
                      {p.to === "/cold-plunge" ? "View the Launch Range" : p.soon ? "Learn More" : "View Products"}{" "}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <SpecialistCallout
          interest="Other"
          page="home"
          whatsappMessage="Hello VYRO, I'd like to talk to a specialist about my space."
        />

        {/* 3. Residential vs Commercial */}
        <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
          <SectionHeading overline="Who It's For" title="For Your Home, or Your Business" />
          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {[
              {
                image: homeWellnessImage,
                alt: "A warm timber home sauna with tiered benches, a wooden bucket and a stone heater",
                title: "Private Residences",
                copy: "Villas, apartments and penthouses — from a single sauna to a complete home wellness space.",
                to: "/wellness-spaces" as const,
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
                  to={c.to}
                  className="group block overflow-hidden rounded-sm border border-border bg-card"
                >
                  <div className="overflow-hidden">
                    <img
                      src={c.image}
                      {...responsive(c.image, SIZES.half)}
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
                      {c.title === "Private Residences" ? "Plan Your Space" : "Request Specifications"}
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

        {/* The VYRO Difference: consultants and after-sales */}
        <VyroDifference />

        {/* Before you buy */}
        <FaqSection
          overline="Before You Buy"
          title="Practical Questions, Answered"
          copy="Delivery, installation, power and space — what to know before you plan."
          faqs={beforeYouBuyFaqs}
        />

        {/* 5. Consultation form */}
        <section id="consultation" className="scroll-mt-28 bg-secondary/60">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 lg:grid-cols-[1fr_1.2fr] lg:gap-20 lg:px-8 lg:py-24">
            <Reveal>
              <p className="eyebrow text-bronze-strong">Private Consultation</p>
              <h2 className="mt-3 font-display text-4xl font-medium leading-[1.15] sm:text-5xl">
                Book a Consultation.
              </h2>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground">
                Tell us about your space and what you're considering. Our team replies{" "}
                {site.enquiryResponseTime} with next steps — no obligation.
              </p>
              <div className="mt-8 space-y-3 text-sm text-muted-foreground">
                <p>
                  General:{" "}
                  <a href={`mailto:${site.infoEmail}`} className="text-foreground underline underline-offset-4">
                    {site.infoEmail}
                  </a>
                </p>
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
