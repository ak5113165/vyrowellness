import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { EnquiryForm } from "@/components/enquiry-form";
import { SpecialistCallout } from "@/components/specialist-callout";
import { DownloadLink } from "@/components/download-link";
import { Reveal } from "@/components/reveal";
import { responsive, SIZES } from "@/lib/responsive-image";
import { absoluteUrl, breadcrumbJsonLd, pageHead } from "@/lib/seo";
import { saunaAvailability, saunaInstallation, site, whatsappLink } from "@/content/site";
import { consultationSteps } from "@/content/process";
import {
  accessorySets,
  controlPanels,
  heaters,
  modelSize,
  modelsInSeries,
  roomTypes,
  seriesBySlug,
  seriesSlug,
  standardWood,
  woods,
  type RoomType,
} from "@/content/sauna-catalogue";

// One page per Haven series: /saunas/haven-classic etc. Content comes from
// sauna-catalogue.ts. Sizes are the confirmed standard sizes (W × D × H).

function seriesJsonLd(t: RoomType) {
  return modelsInSeries(t).map((m) => ({
    "@context": "https://schema.org",
    "@type": "Product",
    name: `VYRO ${m.name} ${m.code}`,
    description: `${m.copy} Standard size ${modelSize(m).dims}, ${modelSize(m).people}. Installed ${saunaInstallation.label}.`,
    image: absoluteUrl(m.image),
    brand: { "@type": "Brand", name: "VYRO" },
  }));
}

export const Route = createFileRoute("/saunas_/$series")({
  loader: ({ params }) => {
    if (!seriesBySlug(params.series)) throw notFound();
  },
  head: ({ params }) => {
    const t = seriesBySlug(params.series);
    if (!t) return { meta: [{ title: "Not found | VYRO Wellness" }] };
    const models = modelsInSeries(t);
    const codes = models.map((m) => m.code).join(", ");
    return pageHead({
      path: `/saunas/${seriesSlug(t)}`,
      title: `${t.name} Sauna (${t.series}) — ${codes} | VYRO Wellness`,
      description: `${t.about} ${models.length > 1 ? `${models.length} sizes` : "One size"}: ${models
        .map((m) => `${m.code} ${modelSize(m).dimsShort}`)
        .join("; ")}. Installed by our team ${saunaInstallation.label}.`,
      ogTitle: `VYRO ${t.name} Sauna`,
      ogDescription: t.short,
      image: "/og/saunas.jpg",
      jsonLd: [
        breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Saunas", path: "/saunas" },
          { name: t.name, path: `/saunas/${seriesSlug(t)}` },
        ]),
        ...seriesJsonLd(t),
      ],
    });
  },
  component: HavenSeriesPage,
});

function HavenSeriesPage() {
  const { series } = Route.useParams();
  const t = seriesBySlug(series);
  if (!t) return null;

  const models = modelsInSeries(t);
  const others = roomTypes.filter((o) => o.id !== t.id);
  const upgrades = woods.filter((w) => !w.standard).map((w) => w.name);
  const wa = whatsappLink(`Hello VYRO, I'm interested in the ${t.name} sauna.`);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main id="main">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mx-auto max-w-7xl px-5 pt-8 text-xs uppercase tracking-[0.16em] text-muted-foreground lg:px-8">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <span aria-hidden className="mx-2">/</span>
          <Link to="/saunas" className="hover:text-foreground">Saunas</Link>
          <span aria-hidden className="mx-2">/</span>
          <span aria-current="page" className="text-foreground">{t.name}</span>
        </nav>

        {/* Series */}
        <section className="mx-auto grid max-w-7xl gap-10 px-5 py-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:px-8 lg:py-14">
          <img
            src={t.image}
            {...responsive(t.image, SIZES.half)}
            alt={`VYRO ${t.name} sauna cabin`}
            width={1024}
            height={1024}
            fetchPriority="high"
            className="aspect-square w-full"
          />
          <div className="flex flex-col justify-center">
            <p className="eyebrow text-bronze-strong">{t.series}{saunaAvailability.availableNow ? ` · ${saunaAvailability.label}` : ""} · Installed {saunaInstallation.label}</p>
            <h1 className="mt-3 font-display text-5xl font-medium sm:text-6xl">{t.name}</h1>
            <p className="mt-4 text-lg leading-relaxed text-foreground/85">{t.short}</p>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-muted-foreground">{t.about}</p>
            <p className="mt-5 text-sm text-muted-foreground">
              Crafted in {standardWood.toLowerCase()} as standard, with {upgrades.length} wood upgrades, {heaters.length} Ember
              heaters, {controlPanels.length} Pulse control panels and {accessorySets.length} Ritual accessory sets.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
              <a
                href="#sizes"
                className="inline-flex items-center gap-2 rounded-sm bg-primary px-6 py-3.5 text-xs uppercase tracking-[0.16em] text-primary-foreground transition-colors hover:bg-primary/90"
              >
                {models.length > 1 ? "Choose a Size" : "See the Details"} <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
              {wa && (
                <a
                  href={wa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs uppercase tracking-[0.16em] underline decoration-bronze underline-offset-8 hover:text-bronze-strong"
                >
                  Talk on WhatsApp
                </a>
              )}
            </div>
          </div>
        </section>

        {/* Models in this series */}
        <section id="sizes" className="scroll-mt-24 border-t border-border bg-card">
          <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
            <p className="eyebrow text-bronze-strong">{models.length > 1 ? "Sizes" : "The Cabin"}</p>
            <h2 className="mt-3 font-display text-3xl font-medium sm:text-4xl">
              {models.length > 1 ? `${models.length} ${t.name} Sizes` : `${models[0]?.name} ${models[0]?.code}`}
            </h2>
            <div className="mt-10 grid gap-8 md:grid-cols-3">
              {models.map((m) => (
                <Reveal key={m.code}>
                  <article className="flex h-full flex-col border border-border bg-background">
                    <img
                      src={m.image}
                      {...responsive(m.image, SIZES.third)}
                      alt={`VYRO ${m.name} ${m.code} sauna cabin`}
                      width={1024}
                      height={1024}
                      loading="lazy"
                      className="aspect-square w-full"
                    />
                    <div className="flex flex-1 flex-col p-6">
                      <p className="eyebrow text-bronze-strong">{m.size}</p>
                      <h3 className="mt-1.5 font-display text-2xl font-medium">
                        {m.name} {m.code}
                      </h3>
                      <p className="mt-1 text-sm text-foreground/80">
                        {modelSize(m).dims} · {modelSize(m).people}
                      </p>
                      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{m.copy}</p>
                      <Link
                        to="/saunas"
                        search={{ cabin: m.code }}
                        hash="builder"
                        className="mt-6 inline-flex items-center justify-center gap-2 rounded-sm border border-foreground px-5 py-3 text-xs uppercase tracking-[0.16em] transition-colors hover:bg-foreground hover:text-background"
                      >
                        Build This Cabin <ArrowRight className="h-4 w-4" aria-hidden />
                      </Link>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
            <p className="mt-8 text-sm text-muted-foreground">
              Standard sizes shown as width × depth × height. We confirm the layout for your space. Pricing depends on
              the wood, heater, control panel and accessories you choose.
            </p>
            <DownloadLink sheet="haven" className="mt-6" />
          </div>
        </section>

        {/* Process */}
        <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
          <p className="eyebrow text-bronze-strong">How It Comes Together</p>
          <ol className="mt-8 grid gap-10 md:grid-cols-3">
            {consultationSteps.map((st) => (
              <li key={st.n} className="border-t border-foreground pt-6">
                <span className="text-xs tracking-[0.2em] text-bronze-strong">{st.n}</span>
                <h3 className="mt-3 font-display text-2xl font-medium">{st.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{st.copy}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Other series */}
        <section className="border-t border-border">
          <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
            <p className="eyebrow text-bronze-strong">Other Haven Cabins</p>
            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              {others.map((o) => (
                <Link
                  key={o.id}
                  to="/saunas/$series"
                  params={{ series: seriesSlug(o) }}
                  className="group flex items-center gap-4"
                >
                  <img
                    src={o.image}
                    {...responsive(o.image, "96px")}
                    alt={`VYRO ${o.name} sauna cabin`}
                    width={1024}
                    height={1024}
                    loading="lazy"
                    className="h-24 w-24 shrink-0"
                  />
                  <div>
                    <p className="font-display text-xl font-medium group-hover:text-bronze-strong">{o.name}</p>
                    <p className="text-xs text-muted-foreground">{o.series}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <SpecialistCallout
          interest="Sauna"
          page={t.name}
          whatsappMessage={`Hello VYRO, I'd like to talk to a specialist about the ${t.name} sauna.`}
        />

        {/* Enquiry */}
        <section id="enquire" className="scroll-mt-24 mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
            <Reveal>
              <p className="eyebrow text-bronze-strong">Enquire</p>
              <h2 className="mt-3 font-display text-4xl font-medium leading-[1.15] sm:text-5xl">Plan Your {t.name}</h2>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground">
                Tell us about your space. Our team replies {site.enquiryResponseTime} with next steps — no obligation.
              </p>
            </Reveal>
            <Reveal delayMs={120}>
              <EnquiryForm
                variant="consumer"
                defaultProductInterest="Sauna"
                defaultMessage={`I'm interested in the ${t.name} (${models.map((m) => m.code).join(" / ")}).`}
              />
            </Reveal>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
