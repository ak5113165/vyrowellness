import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Reveal } from "@/components/reveal";
import { responsive } from "@/lib/responsive-image";
import { breadcrumbJsonLd, pageHead } from "@/lib/seo";
import { guides } from "@/content/guides";

export const Route = createFileRoute("/guides")({
  head: () =>
    pageHead({
      path: "/guides",
      title: "Sauna & Cold Plunge Buying Guides | VYRO Wellness",
      description:
        "Practical guides to choosing a home sauna in India, sauna vs steam room, and what you need before installing a cold plunge.",
      jsonLd: [breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Guides", path: "/guides" }])],
    }),
  component: GuidesPage,
});

function GuidesPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main id="main">
        <section className="mx-auto max-w-7xl px-5 pb-10 pt-20 lg:px-8 lg:pt-28">
          <Reveal>
            <p className="eyebrow text-bronze-strong">Guides</p>
            <h1 className="mt-4 max-w-3xl font-display text-5xl font-medium leading-[1.08] sm:text-6xl">
              Plan It Right the First Time.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground">
              The questions our wellness consultants answer every day — written down, so you can plan your sauna or cold
              plunge with confidence.
            </p>
          </Reveal>
        </section>
        <section className="mx-auto max-w-7xl px-5 pb-24 lg:px-8">
          <div className="grid gap-10 md:grid-cols-3">
            {guides.map((g, i) => (
              <Reveal key={g.slug} delayMs={i * 80}>
                <Link to="/guides/$slug" params={{ slug: g.slug }} className="group block">
                  <div className="overflow-hidden">
                    <img
                      src={g.image}
                      {...responsive(g.image, "(min-width: 768px) 33vw, 100vw")}
                      alt={g.imageAlt}
                      width={1920}
                      height={1280}
                      loading="lazy"
                      className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                  </div>
                  <p className="eyebrow mt-5 text-bronze-strong">
                    {g.topic} · {g.readMinutes} min read
                  </p>
                  <h2 className="mt-2 font-display text-2xl font-medium leading-snug">{g.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{g.summary}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.16em] group-hover:text-bronze-strong">
                    Read the guide <ArrowRight className="h-4 w-4" aria-hidden />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
