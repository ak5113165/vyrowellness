import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { responsive, SIZES } from "@/lib/responsive-image";
import { pageHead, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";
import { ArrowRight, Building2, Dumbbell, PenTool, Briefcase, Sparkles, Trees } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { EnquiryForm } from "@/components/enquiry-form";
import { DownloadLink } from "@/components/download-link";
import {
  coldPlungeLaunch,
  externalChillerSpecs,
  glacierDimensions,
  saunaInstallation,
  site,
  whatsappLink,
} from "@/content/site";
import { consultationSteps } from "@/content/process";
import { launchLabel } from "@/content/glacier-catalogue";
import { metresToFeet, roomSizes } from "@/content/sauna-catalogue";

import hospitalityImage from "@/assets/hospitality.jpg";
// The VYRO spruce sauna (replaces a gym photo showing a concrete plunge VYRO does not sell).
import saunaImage from "@/assets/products/sauna-hero-spruce.jpg";
import studioImage from "@/assets/wellness-studio.jpg";

export const Route = createFileRoute("/commercial-wellness")({
  head: () =>
    pageHead({
      path: "/commercial-wellness",
      title: "Commercial Wellness for Gyms, Hotels & Spas | VYRO Wellness",
      description:
        "Commercial wellness solutions for gyms, luxury hotels, spas, fitness studios, architects and workplaces in India. Sauna, cold plunge and red light therapy equipment and wellness-space planning with VYRO.",
      ogTitle: "Commercial Wellness — Wellness Designed for Business | VYRO",
      ogDescription:
        "Thoughtfully planned wellness solutions for gyms, hotels, spas, studios, architects and commercial spaces.",
      image: "/og/commercial-wellness.jpg",
      jsonLd: [
        breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Commercial Wellness", path: "/commercial-wellness" }]),
        faqJsonLd(faqs),
      ],
    }),
  component: CommercialPage,
});

const cities = coldPlungeLaunch.serviceLocations.join(", ").replace(/, ([^,]*)$/, " and $1");
const wiring = `${externalChillerSpecs.wiringOptionsMm2.join(" or ")} mm²`;
const saunaMinM = Math.min(...roomSizes.map((r) => r.minWidthM));
const saunaMaxM = Math.max(...roomSizes.map((r) => r.maxWidthM));

// What VYRO can specify for a commercial project — only products and facts
// already confirmed elsewhere on the site.
const offer = [
  {
    eyebrow: "Sauna · VYRO Haven",
    title: "Large Cabins for Shared Sessions",
    copy: `Haven Classic S-03 and Haven Glass G-03 seat 6 or more — for clubs, hotels and wellness spaces. Installed ${saunaInstallation.label}.`,
    to: "/saunas" as const,
    cta: "Explore Saunas",
  },
  {
    eyebrow: "Cold Plunge · VYRO Glacier",
    title: "The 2HP Chiller and the Project Collection",
    copy: `The Glacier 2HP chiller is built for larger tubs and busier spaces like gyms and spas, launching ${launchLabel}. Glacier Pro, Steel, Signature and Integrated are coming soon for custom and premium projects.`,
    to: "/cold-plunge" as const,
    cta: "View Glacier",
  },
  {
    eyebrow: "Red Light Therapy · Coming Soon",
    title: "Larger-Format Systems",
    copy: "Designed for dedicated rooms, studios and professional settings — plan the space now and we'll keep you updated on launch.",
    to: "/red-light-therapy" as const,
    cta: "Learn More",
  },
  {
    eyebrow: "Planning",
    title: "Complete Wellness Spaces",
    copy: "Heat, cold and light planned together as one recovery zone or wellness suite, with one assessment and one team.",
    to: "/wellness-spaces" as const,
    cta: "Wellness Spaces",
  },
];

// Planning facts an architect or designer can use straight away.
const planningFacts = [
  {
    label: "Haven sauna cabins",
    value: `Indicative widths from approx. ${metresToFeet(saunaMinM)} to ${metresToFeet(saunaMaxM)} ft (${saunaMinM}–${saunaMaxM} m); final dimensions confirmed per project.`,
  },
  {
    label: "Glacier cold plunge tubs",
    value: `From ${glacierDimensions["Glacier Barrel"].split(" · ")[0]} (Barrel) to ${glacierDimensions["Glacier Acrylic"].split(" · ")[0]} (Portable, Acrylic); 30 in deep.`,
  },
  {
    label: "Glacier cold plunge services",
    value: `${externalChillerSpecs.electricalPhase} supply, ${wiring} wiring, ${externalChillerSpecs.waterInletPoints} water inlet point and ${externalChillerSpecs.drainPoints} drain point for discharge when needed.`,
  },
  {
    label: "Installation coverage",
    value: `Saunas ${saunaInstallation.label}; cold plunges first in ${cities}.`,
  },
];

// Shown on the page and published as FAQ structured data — keep them in one place.
const faqs = [
  {
    q: "Which VYRO products suit a commercial space?",
    a: "Large Haven sauna cabins (S-03 and G-03) seat 6 or more. The Glacier 2HP chiller is our choice for larger tubs and busier spaces like gyms and spas, and the Glacier Project Collection is designed for custom and premium projects.",
  },
  {
    q: "Where do you install?",
    a: `We install saunas ${saunaInstallation.label}. Glacier cold plunges launch on ${launchLabel}, available first in ${cities}.`,
  },
  {
    q: "Do you work with architects and interior designers?",
    a: "Yes. We help plan wellness rooms, services and equipment into your drawings — share your project in the form on this page.",
  },
  {
    q: "What services does a cold plunge need?",
    a: `A Glacier cold plunge with an external chiller needs a ${externalChillerSpecs.electricalPhase.toLowerCase()} supply, ${wiring} wiring, ${externalChillerSpecs.waterInletPoints} water inlet point and ${externalChillerSpecs.drainPoints} drain point for discharge when needed.`,
  },
  {
    q: "How quickly will you respond?",
    a: `Our team replies to every enquiry ${site.enquiryResponseTime}.`,
  },
];

function CommercialPage() {
  const [preset, setPreset] = useState<{ type?: string; message?: string }>({});
  const wa = whatsappLink("Hello VYRO, I'd like to discuss a commercial wellness project.");

  const startProject = (type: string, message: string) => {
    setPreset({ type, message });
    requestAnimationFrame(() =>
      document.getElementById("project-enquiry")?.scrollIntoView({ behavior: "smooth" }),
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main id="main">
        <PageHero
          image={hospitalityImage}
          imageAlt="A luxury hotel spa corridor with arched stone doorways and warm cove lighting"
          overline="Commercial Wellness"
          title="Wellness Designed for Business."
          copy="Thoughtfully planned wellness solutions for gyms, hotels, spas, fitness studios, architects, and commercial wellness spaces."
        >
          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
            <a
              href="#project-enquiry"
              className="inline-flex items-center gap-2 rounded-sm bg-ink-foreground px-6 py-3 text-[12px] uppercase tracking-[0.16em] text-ink transition-colors hover:bg-ink-foreground/90"
            >
              Discuss Your Project <ArrowRight className="h-4 w-4" aria-hidden />
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
        </PageHero>

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
                <div className="h-full border-t border-border bg-card p-7">
                  <c.icon className="h-6 w-6 text-bronze-strong" aria-hidden />
                  <h3 className="mt-4 font-display text-2xl font-medium">{c.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.copy}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* What we specify */}
        <section className="border-t border-border bg-card">
          <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24">
            <SectionHeading
              overline="What We Specify"
              title="Equipment Chosen for Daily, Shared Use"
              copy="The parts of the VYRO range we recommend most often for commercial projects."
            />
            <div className="mt-12 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
              {offer.map((o) => (
                <Link key={o.title} to={o.to} className="group flex flex-col bg-background p-7">
                  <p className="eyebrow text-bronze-strong">{o.eyebrow}</p>
                  <h3 className="mt-3 font-display text-2xl font-medium">{o.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{o.copy}</p>
                  <span className="mt-6 inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.16em] group-hover:text-bronze-strong">
                    {o.cta} <ArrowRight className="h-4 w-4" aria-hidden />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* How VYRO helps */}
        <section className="bg-ink">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 text-ink-foreground lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">
            <Reveal className="lg:order-2">
              <p className="eyebrow text-bronze">How VYRO Helps</p>
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
                src={saunaImage}
                {...responsive(saunaImage, SIZES.half)}
                alt="A VYRO spruce sauna with glowing tiered benches, a stone tower heater and the VYRO Wellness plaque"
                width={1920}
                height={1088}
                loading="lazy"
                className="aspect-[4/3] w-full object-cover"
              />
            </Reveal>
          </div>
        </section>

        {/* Architects & interior designers */}
        <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <img
                src={studioImage}
                {...responsive(studioImage, SIZES.half)}
                alt="A boutique wellness studio interior with timber, stone, linen textures and a sauna cabin"
                width={1920}
                height={1280}
                loading="lazy"
                className="aspect-[4/3] w-full rounded-sm object-cover"
              />
            </Reveal>
            <Reveal delayMs={120}>
              <p className="eyebrow text-bronze-strong">For Architects &amp; Interior Designers</p>
              <h2 className="mt-3 font-display text-4xl font-medium leading-[1.15] sm:text-5xl">
                Plan Wellness Into Your Drawings
              </h2>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
                Bring us in early. We'll help you plan room sizes, power, drainage and ventilation for saunas and
                cold plunges — and the equipment that goes into them.
              </p>
              <dl className="mt-8 divide-y divide-border border-y border-border">
                {planningFacts.map((f) => (
                  <div key={f.label} className="grid gap-1 py-4 sm:grid-cols-[180px_1fr] sm:gap-6">
                    <dt className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{f.label}</dt>
                    <dd className="text-sm">{f.value}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-6 flex flex-wrap gap-x-8 gap-y-4">
                <DownloadLink sheet="haven" />
                <DownloadLink sheet="glacier" />
              </div>
              <button
                type="button"
                onClick={() =>
                  startProject(
                    "Architect / Interior Designer",
                    "We're an architecture / interior design practice planning a wellness space for a client.",
                  )
                }
                className="mt-8 inline-flex items-center gap-2 rounded-sm bg-primary px-6 py-3 text-[12px] uppercase tracking-[0.16em] text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Start a Project With Us <ArrowRight className="h-4 w-4" aria-hidden />
              </button>
            </Reveal>
          </div>
        </section>

        {/* Process */}
        <section className="border-t border-border bg-card">
          <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
            <SectionHeading overline="How It Comes Together" title="From Floor Plan to First Session" />
            <ol className="mt-12 grid gap-10 md:grid-cols-3">
              {consultationSteps.map((st) => (
                <li key={st.n} className="border-t border-foreground pt-6">
                  <span className="text-xs tracking-[0.2em] text-bronze-strong">{st.n}</span>
                  <h3 className="mt-3 font-display text-2xl font-medium">{st.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{st.copy}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* FAQs */}
        <section className="border-t border-border">
          <div className="mx-auto max-w-3xl px-5 py-20">
            <SectionHeading align="center" overline="FAQs" title="Commercial Questions, Answered" />
            <Reveal className="mt-10">
              <Accordion type="single" collapsible className="border-t border-border">
                {faqs.map((f) => (
                  <AccordionItem key={f.q} value={f.q} className="border-b border-border">
                    <AccordionTrigger className="text-left font-display text-xl font-medium text-foreground hover:no-underline">{f.q}</AccordionTrigger>
                    <AccordionContent className="text-sm leading-relaxed text-muted-foreground">{f.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Reveal>
          </div>
        </section>

        {/* B2B enquiry form */}
        <section id="project-enquiry" className="scroll-mt-24 border-t border-border bg-secondary/60">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 lg:grid-cols-[1fr_1.2fr] lg:gap-20 lg:px-8 lg:py-24">
            <Reveal>
              <p className="eyebrow text-bronze-strong">Project Enquiry</p>
              <h2 className="mt-3 font-display text-4xl font-medium leading-[1.15] sm:text-5xl">
                Let's Talk About Your Project.
              </h2>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground">
                Tell us about your business, your space and your plans. Our commercial team replies{" "}
                {site.enquiryResponseTime} to help you explore equipment options and wellness-space planning.
              </p>
            </Reveal>
            <Reveal delayMs={120}>
              <EnquiryForm
                key={`${preset.type ?? ""}|${preset.message ?? ""}`}
                variant="business"
                defaultProductInterest="Commercial Wellness"
                defaultBusinessType={preset.type}
                defaultMessage={preset.message}
              />
            </Reveal>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
