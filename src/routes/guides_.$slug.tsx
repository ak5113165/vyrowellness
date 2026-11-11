import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CtaLink } from "@/components/section";
import { responsive, SIZES } from "@/lib/responsive-image";
import { absoluteUrl, breadcrumbJsonLd, pageHead } from "@/lib/seo";
import { guideBySlug, guides, type GuideBlock } from "@/content/guides";

// Buying guides: /guides/<slug>. Content in content/guides.ts.

export const Route = createFileRoute("/guides_/$slug")({
  loader: ({ params }) => {
    if (!guideBySlug(params.slug)) throw notFound();
  },
  head: ({ params }) => {
    const g = guideBySlug(params.slug);
    if (!g) return { meta: [{ title: "Not found | VYRO Wellness" }] };
    const path = `/guides/${g.slug}`;
    return pageHead({
      path,
      title: `${g.title} | VYRO Wellness`,
      description: g.summary,
      image: "/og/default.jpg",
      jsonLd: [
        breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Guides", path: "/guides" },
          { name: g.title, path },
        ]),
        {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: g.title,
          description: g.summary,
          image: absoluteUrl(g.image),
          datePublished: g.published,
          author: { "@type": "Organization", name: "VYRO Wellness" },
          publisher: { "@type": "Organization", name: "VYRO Wellness", url: absoluteUrl("/") },
          mainEntityOfPage: absoluteUrl(path),
        },
      ],
    });
  },
  component: GuidePage,
});

function Block({ b }: { b: GuideBlock }) {
  switch (b.type) {
    case "h2":
      return <h2 className="mt-12 font-display text-3xl font-medium leading-tight">{b.text}</h2>;
    case "p":
      return <p className="mt-5 text-base leading-relaxed text-foreground/85">{b.text}</p>;
    case "ul":
      return (
        <ul className="mt-5 space-y-3 text-base leading-relaxed text-foreground/85">
          {b.items.map((t) => (
            <li key={t} className="flex gap-3">
              <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-bronze" aria-hidden />
              <span>{t}</span>
            </li>
          ))}
        </ul>
      );
    case "table":
      return (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[480px] border-collapse text-sm">
            <thead>
              <tr className="bg-ink text-left text-ink-foreground">
                {b.head.map((h, i) => (
                  <th key={i} scope="col" className="px-4 py-3 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {b.rows.map((r, i) => (
                <tr key={i} className="border-b border-border even:bg-card">
                  {r.map((cell, j) => (j === 0 ? <th key={j} scope="row" className="px-4 py-3 text-left font-medium">{cell}</th> : <td key={j} className="px-4 py-3">{cell}</td>))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "cta":
      return (
        <div className="mt-14 border border-border bg-card p-8">
          <p className="text-base leading-relaxed">{b.text}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <CtaLink to={b.to}>{b.label}</CtaLink>
            {b.to !== "/contact" && (
              <CtaLink to="/contact" variant="outline">
                Book a Consultation
              </CtaLink>
            )}
          </div>
        </div>
      );
  }
}

function GuidePage() {
  const { slug } = Route.useParams();
  const g = guideBySlug(slug)!;
  const more = guides.filter((x) => x.slug !== g.slug);
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main id="main">
        <article>
          <header className="mx-auto max-w-3xl px-5 pb-10 pt-16 lg:pt-24">
            <nav aria-label="Breadcrumb" className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
              <Link to="/guides" className="hover:text-foreground">Guides</Link> <span aria-hidden>/</span> {g.topic}
            </nav>
            <h1 className="mt-5 font-display text-4xl font-medium leading-[1.1] sm:text-5xl">{g.title}</h1>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{g.summary}</p>
            <p className="eyebrow mt-6 text-bronze-strong">{g.readMinutes} min read · VYRO Wellness</p>
          </header>
          <div className="mx-auto max-w-5xl px-5">
            <img
              src={g.image}
              {...responsive(g.image, SIZES.contained)}
              alt={g.imageAlt}
              width={1920}
              height={1080}
              className="aspect-[16/8] w-full rounded-sm object-cover"
              fetchPriority="high"
            />
          </div>
          <div className="mx-auto max-w-3xl px-5 pb-20 pt-6">
            {g.blocks.map((b, i) => (
              <Block key={i} b={b} />
            ))}
          </div>
        </article>

        <section className="border-t border-border bg-card">
          <div className="mx-auto max-w-5xl px-5 py-16">
            <p className="eyebrow text-bronze-strong">More guides</p>
            <ul className="mt-6 grid gap-6 sm:grid-cols-2">
              {more.map((m) => (
                <li key={m.slug}>
                  <Link to="/guides/$slug" params={{ slug: m.slug }} className="group block">
                    <h2 className="font-display text-2xl font-medium group-hover:text-bronze-strong">{m.title}</h2>
                    <p className="mt-2 text-sm text-muted-foreground">{m.summary}</p>
                    <span className="mt-3 inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.16em]">
                      Read <ArrowRight className="h-4 w-4" aria-hidden />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
