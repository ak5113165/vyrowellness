import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, Check, MapPin } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section";
import { FaqSection } from "@/components/faq-section";
import { EnquiryForm } from "@/components/enquiry-form";
import { VyroDifference } from "@/components/vyro-difference";
import { Reveal } from "@/components/reveal";
import { responsive } from "@/lib/responsive-image";
import { absoluteUrl, breadcrumbJsonLd, faqJsonLd, pageHead } from "@/lib/seo";
import { coldPlungeLaunch, saunaAvailability, saunaInstallation, site, whatsappLink } from "@/content/site";
import { consultationSteps } from "@/content/process";
import { modelSize, saunaModels, seriesSlug, roomTypes } from "@/content/sauna-catalogue";
import { launchLabel, launchModelBySlug, launchPrice } from "@/content/glacier-catalogue";
import { cityBySlug, cityPages, coldPlungeServed, type CityPage } from "@/content/locations";

// City landing pages: /locations/delhi-ncr etc. Content in content/locations.ts.

function cityFaqs(c: CityPage) {
  const plunge = coldPlungeServed(c);
  return [
    {
      q: `Do you install saunas in ${c.city}?`,
      a: `Yes. Haven saunas are ${saunaAvailability.label.toLowerCase()} and installed by our own team ${saunaInstallation.label}, including ${c.city}.`,
    },
    {
      q: `Is the Glacier cold plunge available in ${c.city}?`,
      a: plunge
        ? `Yes. ${c.city} is one of the first cities where we install Glacier cold plunges. Glacier Barrel, Portable and Acrylic launch on ${launchLabel}, each with the 1HP chiller and installation included in the MRP.`
        : `Glacier cold plunge installation starts in ${coldPlungeLaunch.serviceLocations.join(", ")}. Ask us about ${c.city}.`,
    },
    {
      q: "How do I get started?",
      a: `Send an enquiry or message us on WhatsApp. A VYRO wellness consultant will reply ${site.enquiryResponseTime} to understand your space and recommend the right set-up.`,
    },
    {
      q: "What do I need for a cold plunge at home?",
      a: "A single-phase power supply, one water inlet point and one drain point near where the plunge will sit. Your consultant confirms these before installation.",
    },
  ];
}

export const Route = createFileRoute("/locations_/$city")({
  loader: ({ params }) => {
    if (!cityBySlug(params.city)) throw notFound();
  },
  head: ({ params }) => {
    const c = cityBySlug(params.city);
    if (!c) return { meta: [{ title: "Not found | VYRO Wellness" }] };
    const path = `/locations/${c.slug}`;
    return pageHead({
      path,
      title: `Home Saunas & Cold Plunges in ${c.city} | VYRO Wellness`,
      description: `${c.intro} Areas include ${c.areas.join(", ")}.`,
      ogTitle: `VYRO Wellness in ${c.city}`,
      ogDescription: c.intro,
      image: "/og/default.jpg",
      jsonLd: [
        breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Locations", path: "/locations" },
          { name: c.city, path },
        ]),
        {
          "@context": "https://schema.org",
          "@type": "Service",
          name: `Sauna and cold plunge installation in ${c.city}`,
          serviceType: "Sauna and cold plunge supply and installation",
          provider: { "@type": "Organization", name: "VYRO Wellness", url: absoluteUrl("/"), telephone: site.phoneHref.replace("tel:", "") },
          areaServed: [{ "@type": "City", name: c.city }, ...c.areas.map((a) => ({ "@type": "Place", name: a }))],
          url: absoluteUrl(path),
        },
        faqJsonLd(cityFaqs(c)),
      ],
    });
  },
  component: CityPageView,
});

function PickCard({ pick }: { pick: CityPage["picks"][number] }) {
  if (pick.kind === "sauna") {
    const m = saunaModels.find((x) => x.code === pick.code);
    const t = m && roomTypes.find((r) => r.id === m.type);
    if (!m || !t) return null;
    return (
      <Link to="/saunas/$series" params={{ series: seriesSlug(t) }} className="group block">
        <div className="overflow-hidden bg-[#f8ecde]">
          <img src={m.image} {...responsive(m.image, "(min-width: 1024px) 33vw, 100vw")} alt={`VYRO ${m.name} ${m.code} sauna`} width={1024} height={1024} loading="lazy" className="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
        </div>
        <p className="eyebrow mt-5 text-bronze-strong">Sauna · {modelSize(m).people}</p>
        <h3 className="mt-2 font-display text-2xl font-medium">{m.name} {m.code}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{pick.why}</p>
        <span className="mt-4 inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.16em] group-hover:text-bronze-strong">
          View {m.name} <ArrowRight className="h-4 w-4" aria-hidden />
        </span>
      </Link>
    );
  }
  const g = launchModelBySlug(pick.slug);
  if (!g) return null;
  const price = launchPrice(g.name);
  return (
    <Link to="/cold-plunge/$model" params={{ model: g.slug }} className="group block">
      <div className="overflow-hidden bg-[#f8ecde]">
        <img src={g.image} {...responsive(g.image, "(min-width: 1024px) 33vw, 100vw")} alt={g.alt} width={1024} height={1024} loading="lazy" className="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
      </div>
      <p className="eyebrow mt-5 text-bronze-strong">Cold plunge · Launching {coldPlungeLaunch.shortLabel}</p>
      <h3 className="mt-2 font-display text-2xl font-medium">{g.name}</h3>
      <p className="mt-1 text-sm text-foreground">
        {price.display}
        {price.display.startsWith("₹") ? " MRP" : ""}
        {price.note ? ` · ${price.note}` : ""}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{pick.why}</p>
      <span className="mt-4 inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.16em] group-hover:text-bronze-strong">
        View {g.name} <ArrowRight className="h-4 w-4" aria-hidden />
      </span>
    </Link>
  );
}

function CityPageView() {
  const { city } = Route.useParams();
  const c = cityBySlug(city)!;
  const plunge = coldPlungeServed(c);
  const faqs = cityFaqs(c);
  const wa = whatsappLink(`Hello VYRO, I'm in ${c.city} and I'd like to know more about a sauna or cold plunge.`);
  const others = cityPages.filter((x) => x.slug !== c.slug);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main id="main">
        <PageHero image={c.image} imageAlt={c.imageAlt} overline={`VYRO in ${c.city}`} title={`Home Saunas & Cold Plunges in ${c.city}`} copy={c.intro}>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#enquire" className="inline-flex items-center justify-center rounded-sm bg-ink-foreground px-7 py-3.5 text-[13px] uppercase tracking-[0.16em] text-ink transition-colors hover:bg-ink-foreground/90">
              Book a Consultation
            </a>
            {wa && (
              <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-sm border border-ink-foreground/50 px-7 py-3.5 text-[13px] uppercase tracking-[0.16em] text-ink-foreground transition-colors hover:bg-ink-foreground hover:text-ink">
                WhatsApp Us
              </a>
            )}
          </div>
        </PageHero>

        {/* What we install here */}
        <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24">
          <SectionHeading overline={`What we install in ${c.city}`} title="Heat and Cold, Installed by Our Team" copy={c.homes} />
          <div className="mt-12 grid gap-px border border-border bg-border md:grid-cols-2">
            <Reveal className="bg-card p-8">
              <p className="eyebrow text-bronze-strong">Haven Saunas · {saunaAvailability.label}</p>
              <h3 className="mt-3 font-display text-3xl font-medium">Saunas in {c.city}</h3>
              <ul className="mt-5 space-y-2.5 text-sm">
                {["Traditional, glass-front, infrared and compact cabins", "Crafted in spruce, with six wood upgrades", `Installed by our team ${saunaInstallation.label}, including ${c.city}`].map((t) => (
                  <li key={t} className="flex gap-2.5"><Check className="mt-0.5 h-4 w-4 shrink-0 text-bronze-strong" aria-hidden />{t}</li>
                ))}
              </ul>
              <Link to="/saunas" className="mt-6 inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.16em] underline decoration-bronze underline-offset-8 hover:text-bronze-strong">
                Explore Haven Saunas <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </Reveal>
            <Reveal delayMs={80} className="bg-card p-8">
              <p className="eyebrow text-bronze-strong">Glacier Cold Plunge · Launching {coldPlungeLaunch.label}</p>
              <h3 className="mt-3 font-display text-3xl font-medium">Cold Plunges in {c.city}</h3>
              <ul className="mt-5 space-y-2.5 text-sm">
                {[
                  "Glacier Barrel, Portable and Acrylic",
                  "1HP chiller and installation included in the MRP (18% GST extra)",
                  plunge ? `${c.city} is one of the first cities we install in` : `Installation starts in ${coldPlungeLaunch.serviceLocations.join(", ")}`,
                ].map((t) => (
                  <li key={t} className="flex gap-2.5"><Check className="mt-0.5 h-4 w-4 shrink-0 text-bronze-strong" aria-hidden />{t}</li>
                ))}
              </ul>
              <Link to="/cold-plunge" className="mt-6 inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.16em] underline decoration-bronze underline-offset-8 hover:text-bronze-strong">
                Explore Glacier <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </Reveal>
          </div>
        </section>

        {/* Picks */}
        <section className="border-t border-border bg-card">
          <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24">
            <SectionHeading overline={`Popular in ${c.city}`} title={`Good Fits for ${c.city} Homes and Spaces`} />
            <div className="mt-12 grid gap-10 md:grid-cols-3">
              {c.picks.map((p, i) => (
                <Reveal key={p.kind === "sauna" ? p.code : p.slug} delayMs={i * 80}>
                  <PickCard pick={p} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Planning notes + process */}
        <section className="mx-auto grid max-w-7xl gap-12 px-5 py-20 lg:grid-cols-2 lg:px-8 lg:py-24">
          <Reveal>
            <p className="eyebrow text-bronze-strong">Planning in {c.city}</p>
            <h2 className="mt-3 font-display text-4xl font-medium">Before We Install</h2>
            <ul className="mt-6 space-y-4 text-sm leading-relaxed">
              {c.planning.map((t) => (
                <li key={t} className="flex gap-3"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-bronze-strong" aria-hidden />{t}</li>
              ))}
            </ul>
          </Reveal>
          <Reveal delayMs={80}>
            <p className="eyebrow text-bronze-strong">How it works</p>
            <ol className="mt-6 space-y-6">
              {consultationSteps.map((s) => (
                <li key={s.n} className="border-t border-border pt-4">
                  <p className="text-xs tracking-[0.2em] text-bronze-strong">{s.n}</p>
                  <h3 className="mt-1 font-display text-2xl font-medium">{s.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{s.copy}</p>
                </li>
              ))}
            </ol>
          </Reveal>
        </section>

        <VyroDifference />

        <FaqSection title={`Questions from ${c.city}`} faqs={faqs} />

        {/* Enquire */}
        <section id="enquire" className="border-t border-border bg-card" data-hide-mobile-bar>
          <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 lg:grid-cols-[1fr_1.2fr] lg:px-8 lg:py-24">
            <Reveal>
              <p className="eyebrow text-bronze-strong">Book a Consultation</p>
              <h2 className="mt-3 font-display text-4xl font-medium">Talk to a VYRO Consultant in {c.city}</h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Tell us about your space. We reply {site.enquiryResponseTime}.
              </p>
              <p className="eyebrow mt-10 text-bronze-strong">Other cities</p>
              <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm">
                {others.map((o) => (
                  <li key={o.slug}>
                    <Link to="/locations/$city" params={{ city: o.slug }} className="underline decoration-bronze underline-offset-4 hover:text-bronze-strong">
                      {o.city}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link to="/locations" className="underline decoration-bronze underline-offset-4 hover:text-bronze-strong">All locations</Link>
                </li>
              </ul>
            </Reveal>
            <Reveal delayMs={80}>
              <EnquiryForm variant="consumer" defaultCity={c.city} defaultMessage={`I'm in ${c.city}.`} />
            </Reveal>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
