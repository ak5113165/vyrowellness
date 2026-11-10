import { ArrowRight, Mail } from "lucide-react";
import { pageHead } from "@/lib/seo";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Reveal } from "@/components/reveal";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { EnquiryForm } from "@/components/enquiry-form";
import { coldPlungeLaunch, saunaInstallation, site, whatsappLink } from "@/content/site";

export const Route = createFileRoute("/contact")({
  head: () =>
    pageHead({
      path: "/contact",
      title: "Contact VYRO — Book a Consultation | VYRO Wellness",
      description:
        "Contact VYRO for product consultations, business enquiries and wellness-space planning. Premium saunas, cold plunge and red light therapy for homes and businesses in India.",
      ogDescription:
        "Talk to the VYRO team about saunas, cold plunge, red light therapy and wellness spaces for your home or business.",
    }),
  component: ContactPage,
});

function ContactPage() {
  const wa = whatsappLink("Hello VYRO, I'd like to get in touch about your wellness solutions.");

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main id="main">
        <section className="mx-auto max-w-7xl px-5 pb-20 pt-16 lg:px-8 lg:pt-24">
          <div className="grid gap-14 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
            {/* Contact options */}
            <Reveal>
              <p className="eyebrow text-bronze-strong">Contact</p>
              <h1 className="mt-3 font-display text-5xl font-medium leading-[1.1] sm:text-6xl">
                Let's Start a Conversation.
              </h1>
              <p className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground">
                Whether you're exploring a product for your home or planning a wellness space for
                your business, we'd like to hear from you.
              </p>

              <div className="mt-10 space-y-8">
                <div>
                  <h2 className="eyebrow text-bronze-strong">Product Consultation</h2>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                    For saunas, cold plunge, red light therapy and complete wellness spaces — use the
                    form and our team will reply {site.enquiryResponseTime}.
                  </p>
                </div>
                <div>
                  <h2 className="eyebrow text-bronze-strong">Business Enquiry</h2>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                    For gyms, hotels, spas, studios and projects, our commercial team is ready to
                    help.
                  </p>
                  <Link
                    to="/commercial-wellness"
                    className="mt-3 inline-flex items-center gap-2 text-[13px] uppercase tracking-[0.16em] text-foreground underline decoration-bronze decoration-2 underline-offset-8 transition-colors hover:text-bronze-strong"
                  >
                    Commercial Wellness Enquiry <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                </div>
                <div>
                  <h2 className="eyebrow text-bronze-strong">Where We Install</h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Saunas {saunaInstallation.label}. Glacier cold plunges first in{" "}
                    {coldPlungeLaunch.serviceLocations.join(", ").replace(/, ([^,]*)$/, " and $1")}, launching{" "}
                    {coldPlungeLaunch.label}.
                  </p>
                </div>
                <div>
                  <h2 className="eyebrow text-bronze-strong">Reach Us Directly</h2>
                  <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-bronze-strong" aria-hidden />
                      General:{" "}
                      <a href={`mailto:${site.infoEmail}`} className="text-foreground underline underline-offset-4">
                        {site.infoEmail}
                      </a>
                    </li>
                    <li className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-bronze-strong" aria-hidden />
                      Sales:{" "}
                      <a href={`mailto:${site.salesEmail}`} className="text-foreground underline underline-offset-4">
                        {site.salesEmail}
                      </a>
                    </li>
                    <li className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-bronze-strong" aria-hidden />
                      Support:{" "}
                      <a href={`mailto:${site.supportEmail}`} className="text-foreground underline underline-offset-4">
                        {site.supportEmail}
                      </a>
                    </li>
                    <li>
                      Instagram:{" "}
                      <a href={site.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-foreground underline underline-offset-4">
                        @{site.instagramHandle}
                      </a>
                    </li>
                    <li>
                      Phone:{" "}
                      <a href={site.phoneHref} className="text-foreground underline underline-offset-4">
                        {site.phoneDisplay}
                      </a>
                    </li>
                  </ul>
                  {wa && (
                    <a
                      href={wa}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 inline-flex items-center justify-center rounded-sm bg-primary px-7 py-3 text-[13px] uppercase tracking-[0.16em] text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                      Chat on WhatsApp
                    </a>
                  )}
                </div>
              </div>
            </Reveal>

            {/* Form */}
            <Reveal delayMs={120}>
              <div className="rounded-sm border border-border bg-card p-6 sm:p-10">
                <h2 className="font-display text-3xl font-medium">Send an Enquiry</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Share a few details and our team will reply {site.enquiryResponseTime}.
                </p>
                <EnquiryForm variant="consumer" className="mt-8" />
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
