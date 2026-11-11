import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SectionHeading, CtaBand } from "@/components/section";
import { Reveal } from "@/components/reveal";
import { responsive } from "@/lib/responsive-image";
import { breadcrumbJsonLd, pageHead } from "@/lib/seo";
import { coldPlungeLaunch, saunaInstallation } from "@/content/site";
import { cityPages, coldPlungeServed } from "@/content/locations";

export const Route = createFileRoute("/locations")({
  head: () =>
    pageHead({
      path: "/locations",
      title: "Where We Install — Saunas Across India, Cold Plunges in 4 Cities | VYRO Wellness",
      description: `Haven saunas are installed by our team ${saunaInstallation.label}. Glacier cold plunges launch ${coldPlungeLaunch.label}, installed first in ${coldPlungeLaunch.serviceLocations.join(", ")}.`,
      jsonLd: [breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Locations", path: "/locations" }])],
    }),
  component: LocationsPage,
});

function LocationsPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main id="main">
        <section className="mx-auto max-w-7xl px-5 pb-10 pt-20 lg:px-8 lg:pt-28">
          <Reveal>
            <p className="eyebrow text-bronze-strong">Where We Install</p>
            <h1 className="mt-4 max-w-3xl font-display text-5xl font-medium leading-[1.08] sm:text-6xl">
              Saunas Across India. Cold Plunges in Four Cities.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground">
              Haven saunas are installed by our own team {saunaInstallation.label}. Glacier cold plunges launch on{" "}
              {coldPlungeLaunch.label}, installed first in {coldPlungeLaunch.serviceLocations.slice(0, -1).join(", ")} and{" "}
              {coldPlungeLaunch.serviceLocations.slice(-1)[0]}.
            </p>
          </Reveal>
        </section>

        <section className="mx-auto max-w-7xl px-5 pb-20 lg:px-8 lg:pb-24">
          <SectionHeading overline="Cities" title="Find VYRO Near You" />
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {cityPages.map((c, i) => (
              <Reveal key={c.slug} delayMs={i * 60}>
                <Link to="/locations/$city" params={{ city: c.slug }} className="group block">
                  <div className="overflow-hidden">
                    <img
                      src={c.image}
                      {...responsive(c.image, "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw")}
                      alt={c.imageAlt}
                      width={1920}
                      height={1280}
                      loading="lazy"
                      className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                  </div>
                  <p className="eyebrow mt-5 text-bronze-strong">
                    Saunas{coldPlungeServed(c) ? " · Cold Plunge" : ""}
                  </p>
                  <h2 className="mt-2 font-display text-3xl font-medium">{c.city}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">{c.areas.join(" · ")}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.16em] group-hover:text-bronze-strong">
                    View {c.city} <ArrowRight className="h-4 w-4" aria-hidden />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>

        <CtaBand
          title="Elsewhere in India?"
          copy={`Haven saunas are installed ${saunaInstallation.label}. Tell us where you are and a VYRO consultant will plan your sauna with you.`}
          cta={{ label: "Book a Consultation", to: "/contact" }}
        />
      </main>
      <SiteFooter />
    </div>
  );
}
