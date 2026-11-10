import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { EnquiryForm } from "@/components/enquiry-form";
import { SpecialistCallout } from "@/components/specialist-callout";
import { DownloadLink } from "@/components/download-link";
import { Reveal } from "@/components/reveal";
import { responsive, SIZES } from "@/lib/responsive-image";
import { absoluteUrl, breadcrumbJsonLd, pageHead } from "@/lib/seo";
import { coldPlungeLaunch, site, whatsappLink } from "@/content/site";
import {
  chillerRequirements,
  launchLabel,
  launchModelBySlug,
  launchModels,
  launchPrice,
  upgradePrice,
  waterCapacity,
  type LaunchModel,
} from "@/content/glacier-catalogue";

// One page per Glacier launch model: /cold-plunge/glacier-barrel etc.
// Everything shown comes from glacier-catalogue.ts / site.ts.

const cities = coldPlungeLaunch.serviceLocations.join(", ").replace(/, ([^,]*)$/, " and $1");
const launchIso = `${coldPlungeLaunch.year}-${String(coldPlungeLaunch.month).padStart(2, "0")}-${String(coldPlungeLaunch.day).padStart(2, "0")}`;

function productJsonLd(m: LaunchModel) {
  const price = launchPrice(m.name);
  const priceDigits = price.display.replace(/[^\d]/g, "");
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `VYRO ${m.name}`,
    description: `${m.positioning} ${m.size}. MRP includes the 1HP chiller and installation; 2HP chiller upgrade available.`,
    image: absoluteUrl(m.image),
    brand: { "@type": "Brand", name: "VYRO" },
    ...(priceDigits
      ? {
          offers: {
            "@type": "Offer",
            price: priceDigits,
            priceCurrency: "INR",
            availability: "https://schema.org/PreOrder",
            availabilityStarts: launchIso,
            url: absoluteUrl(`/cold-plunge/${m.slug}`),
          },
        }
      : {}),
  };
}

export const Route = createFileRoute("/cold-plunge_/$model")({
  loader: ({ params }) => {
    if (!launchModelBySlug(params.model)) throw notFound();
  },
  head: ({ params }) => {
    const m = launchModelBySlug(params.model);
    if (!m) return { meta: [{ title: "Not found | VYRO Wellness" }] };
    const price = launchPrice(m.name).display;
    return pageHead({
      path: `/cold-plunge/${m.slug}`,
      title: `${m.name} Cold Plunge — ${price} MRP, Launching ${launchLabel} | VYRO Wellness`,
      description: `${m.positioning} ${m.size}. ${price} MRP including the 1HP chiller and installation; 2HP upgrade ${upgradePrice}. Made in India, launching ${launchLabel}.`,
      ogTitle: `VYRO ${m.name} — ${price} MRP`,
      ogDescription: `${m.positioning} Launching ${launchLabel}, available first in ${cities}.`,
      image: "/og/cold-plunge.jpg",
      jsonLd: [
        breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Cold Plunge", path: "/cold-plunge" },
          { name: m.name, path: `/cold-plunge/${m.slug}` },
        ]),
        productJsonLd(m),
      ],
    });
  },
  component: GlacierModelPage,
});

function GlacierModelPage() {
  const { model } = Route.useParams();
  const m = launchModelBySlug(model);
  if (!m) return null;

  const price = launchPrice(m.name);
  const others = launchModels.filter((o) => o.slug !== m.slug);
  const wa = whatsappLink(`Hello VYRO, I'd like to know more about the ${m.name} launching on ${launchLabel}.`);

  const specRows = [
    ...m.specs,
    { label: "MRP", value: `${price.display}${price.note ? ` — ${price.note.toLowerCase()}` : ""}` },
    { label: "2HP chiller upgrade", value: upgradePrice },
    { label: "Water capacity (launch range)", value: waterCapacity },
    { label: "Launch", value: `${launchLabel} · first in ${cities}` },
    { label: "Made in", value: coldPlungeLaunch.madeIn },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main id="main">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mx-auto max-w-7xl px-5 pt-8 text-xs uppercase tracking-[0.16em] text-muted-foreground lg:px-8">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <span aria-hidden className="mx-2">/</span>
          <Link to="/cold-plunge" className="hover:text-foreground">Cold Plunge</Link>
          <span aria-hidden className="mx-2">/</span>
          <span aria-current="page" className="text-foreground">{m.name}</span>
        </nav>

        {/* Product */}
        <section className="mx-auto grid max-w-7xl gap-10 px-5 py-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:px-8 lg:py-14">
          <div className="relative">
            <span className="absolute left-4 top-4 bg-ink px-3 py-1.5 text-xs uppercase tracking-[0.18em] text-ink-foreground">
              Launching {coldPlungeLaunch.shortLabel}
            </span>
            <img
              src={m.image}
              {...responsive(m.image, SIZES.half)}
              alt={m.alt}
              width={1024}
              height={1024}
              fetchPriority="high"
              className="aspect-square w-full"
            />
          </div>

          <div className="flex flex-col justify-center">
            <p className="eyebrow text-bronze-strong">{m.tag} · Made in {coldPlungeLaunch.madeIn}</p>
            <h1 className="mt-3 font-display text-5xl font-medium sm:text-6xl">{m.name}</h1>
            <p className="mt-2 text-base text-foreground/80">{m.size}</p>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground">{m.positioning}</p>

            <div className="mt-7 border-y border-border py-5">
              <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">MRP</p>
              <p className="mt-1 font-display text-4xl font-medium">{price.display}</p>
              {price.note && <p className="mt-1 text-sm text-muted-foreground">{price.note}</p>}
              <p className="mt-1 text-sm text-muted-foreground">2HP chiller upgrade for faster cooling: {upgradePrice}</p>
            </div>

            <ul className="mt-6 space-y-2.5 text-sm">
              {m.keyFacts.map((f) => (
                <li key={f} className="flex items-start gap-2.5">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-bronze-strong" aria-hidden />
                  {f}
                </li>
              ))}
              <li className="pt-1 text-muted-foreground">Best for: {m.bestFor}</li>
            </ul>

            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
              <a
                href="#enquire"
                className="inline-flex items-center gap-2 rounded-sm bg-primary px-6 py-3.5 text-xs uppercase tracking-[0.16em] text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Register for Launch <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
              {wa && (
                <a
                  href={wa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs uppercase tracking-[0.16em] underline decoration-bronze underline-offset-8 hover:text-bronze-strong"
                >
                  Ask on WhatsApp
                </a>
              )}
            </div>
          </div>
        </section>

        {/* Specifications */}
        <section className="border-t border-border bg-card">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-20">
            <div>
              <p className="eyebrow text-bronze-strong">Specifications</p>
              <h2 className="mt-3 font-display text-3xl font-medium sm:text-4xl">{m.name} at a Glance</h2>
              <dl className="mt-8 divide-y divide-border border-y border-border">
                {specRows.map((r) => (
                  <div key={r.label} className="grid gap-1 py-3.5 sm:grid-cols-[200px_1fr] sm:gap-6">
                    <dt className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{r.label}</dt>
                    <dd className="text-sm">{r.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div>
              <p className="eyebrow text-bronze-strong">Installation Requirements</p>
              <h2 className="mt-3 font-display text-3xl font-medium sm:text-4xl">What Your Space Needs</h2>
              <dl className="mt-8 divide-y divide-border border-y border-border">
                {chillerRequirements.map((r) => (
                  <div key={r.label} className="grid gap-1 py-3.5 sm:grid-cols-[200px_1fr] sm:gap-6">
                    <dt className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{r.label}</dt>
                    <dd className="text-sm">{r.value}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-5 text-sm text-muted-foreground">
                Our team confirms the details for your space before installation.
              </p>
              <DownloadLink sheet="glacier" className="mt-6" />
            </div>
          </div>
        </section>

        {/* Other launch models */}
        <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
          <p className="eyebrow text-bronze-strong">Also Launching {coldPlungeLaunch.shortLabel}</p>
          <div className="mt-8 grid gap-8 sm:grid-cols-2">
            {others.map((o) => (
              <Reveal key={o.slug}>
                <Link
                  to="/cold-plunge/$model"
                  params={{ model: o.slug }}
                  className="group grid items-center gap-5 sm:grid-cols-[160px_1fr]"
                >
                  <img
                    src={o.image}
                    {...responsive(o.image, "160px")}
                    alt={o.alt}
                    width={1024}
                    height={1024}
                    loading="lazy"
                    className="aspect-square w-full max-w-[200px]"
                  />
                  <div>
                    <p className="eyebrow text-bronze-strong">{o.tag}</p>
                    <h3 className="mt-1.5 font-display text-2xl font-medium">{o.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {o.size} · {launchPrice(o.name).display} MRP
                    </p>
                    <span className="mt-3 inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] group-hover:text-bronze-strong">
                      View {o.name} <ArrowRight className="h-4 w-4" aria-hidden />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
          <Link
            to="/cold-plunge"
            hash="compare"
            className="mt-10 inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] underline decoration-bronze underline-offset-8 hover:text-bronze-strong"
          >
            Compare all three <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </section>

        <SpecialistCallout
          interest="Cold Plunge"
          page={m.name}
          whatsappMessage={`Hello VYRO, I'd like to talk to a specialist about the ${m.name}.`}
        />

        {/* Register */}
        <section id="enquire" className="scroll-mt-24 mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
            <Reveal>
              <p className="eyebrow text-bronze-strong">Register for Launch</p>
              <h2 className="mt-3 font-display text-4xl font-medium leading-[1.15] sm:text-5xl">Register Your Interest</h2>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground">
                Register for the {m.name} and we'll keep you updated ahead of the {launchLabel} launch. Our team
                replies {site.enquiryResponseTime}.
              </p>
            </Reveal>
            <Reveal delayMs={120}>
              <EnquiryForm
                variant="consumer"
                defaultProductInterest="Cold Plunge"
                defaultMessage={`I'd like to register for the ${m.name} launch on ${launchLabel}.`}
              />
            </Reveal>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
