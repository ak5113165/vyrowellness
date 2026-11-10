import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { pageHead, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { EnquiryForm } from "@/components/enquiry-form";
import { FaqSection } from "@/components/faq-section";
import { site, whatsappLink } from "@/content/site";

import lightImage from "@/assets/red-light.jpg";

// Red light therapy is not launched yet, so this is a short register-interest
// page. No product specs, prices or health claims until the range is confirmed.

export const Route = createFileRoute("/red-light-therapy")({
  head: () =>
    pageHead({
      path: "/red-light-therapy",
      title: "Red Light Therapy — Coming Soon to VYRO | VYRO Wellness",
      description:
        "VYRO red light therapy panels and larger-format systems for homes, gyms, studios and wellness rooms in India are coming soon. Register your interest to hear first.",
      ogTitle: "Red Light Therapy — Coming Soon | VYRO",
      ogDescription:
        "Panels for personal routines and larger-format systems for dedicated rooms. Register your interest to hear first.",
      image: "/og/red-light-therapy.jpg",
      jsonLd: [
        breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Red Light Therapy", path: "/red-light-therapy" }]),
        faqJsonLd(faqs),
      ],
    }),
  component: RedLightPage,
});

const formats = [
  {
    name: "Panels",
    for: "Homes and personal routines",
    copy: "Designed to stand, lean or mount in a bedroom, home gym or wellness corner.",
  },
  {
    name: "Larger-format systems",
    for: "Dedicated rooms and professional settings",
    copy: "For wellness suites, gyms, studios and spas, where light sits alongside sauna and cold plunge.",
  },
];

// Shown on the page and published as FAQ structured data — keep them in one place.
const faqs = [
  {
    q: "When will VYRO red light therapy be available?",
    a: "The range is coming soon. Register your interest on this page and we'll let you know as soon as it launches.",
  },
  {
    q: "What is red light therapy used for?",
    a: "Red light therapy panels are used in everyday wellness routines at homes, gyms and studios. We don't make medical claims — if you have a health condition, please consult your doctor.",
  },
  {
    q: "What's the difference between a panel and a larger system?",
    a: "Panels suit personal routines and smaller spaces; larger-format systems are designed for dedicated rooms, studios and professional settings. The right choice depends on your space and how you plan to use it.",
  },
  {
    q: "Can I plan for red light in a wellness room now?",
    a: "Yes. If you're planning a sauna or cold plunge, we can allow wall space and power for red light in the same room, so it's ready when the range launches.",
  },
];

function RedLightPage() {
  const wa = whatsappLink("Hello VYRO, please keep me updated on your red light therapy launch.");

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main id="main">
        <PageHero
          image={lightImage}
          imageAlt="A tall black red light therapy panel glowing deep red against an ivory wall"
          overline="Red Light Therapy · Coming Soon"
          title="Red Light Therapy, Coming to VYRO"
          copy="Panels for personal routines and larger-format systems for dedicated rooms. Register your interest and we'll tell you first."
        >
          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
            <a
              href="#register"
              className="inline-flex items-center gap-2 rounded-sm bg-ink-foreground px-6 py-3 text-[12px] uppercase tracking-[0.16em] text-ink transition-colors hover:bg-ink-foreground/90"
            >
              Register Interest <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
            {wa && (
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[12px] uppercase tracking-[0.16em] text-ink-foreground/85 underline decoration-bronze underline-offset-8 hover:text-ink-foreground"
              >
                Ask on WhatsApp
              </a>
            )}
          </div>
        </PageHero>

        {/* What's coming */}
        <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24">
          <p className="eyebrow text-bronze-strong">What's Coming</p>
          <h2 className="mt-3 max-w-2xl font-display text-4xl font-medium leading-[1.15] sm:text-5xl">
            Two Formats, for Homes and for Professional Spaces
          </h2>
          <div className="mt-12 grid gap-px border border-border bg-border md:grid-cols-2">
            {formats.map((f) => (
              <Reveal key={f.name} className="bg-card p-8 lg:p-10">
                <p className="eyebrow text-bronze-strong">{f.for}</p>
                <h3 className="mt-3 font-display text-3xl font-medium">{f.name}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.copy}</p>
              </Reveal>
            ))}
          </div>

          <div className="mt-12 flex flex-col gap-4 border-t border-foreground pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-xl text-base leading-relaxed text-muted-foreground">
              Planning a sauna or cold plunge now? We can allow space and power for red light in the same room.
            </p>
            <Link
              to="/wellness-spaces"
              className="inline-flex shrink-0 items-center gap-2 text-[12px] uppercase tracking-[0.16em] hover:text-bronze-strong"
            >
              Plan a Wellness Space <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </section>

        <FaqSection title="Red Light Questions" faqs={faqs} />

        {/* Register interest */}
        <section id="register" className="scroll-mt-24 mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
            <Reveal>
              <p className="eyebrow text-bronze-strong">Register Interest</p>
              <h2 className="mt-3 font-display text-4xl font-medium leading-[1.15] sm:text-5xl">Be the First to Know</h2>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground">
                Leave your details and we'll let you know when VYRO red light therapy launches. Our team replies{" "}
                {site.enquiryResponseTime} if you'd like to talk sooner.
              </p>
            </Reveal>
            <Reveal delayMs={120}>
              <EnquiryForm
                variant="consumer"
                defaultProductInterest="Red Light Therapy"
                defaultMessage="Please keep me updated on the VYRO red light therapy launch."
              />
            </Reveal>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
