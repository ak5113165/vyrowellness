import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { pageHead } from "@/lib/seo";
import { Reveal } from "@/components/reveal";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { whatsappLink, winterSale, winterSaleFullTerms, winterSaleLive } from "@/content/site";

export const Route = createFileRoute("/winter-sale")({
  head: () =>
    pageHead({
      path: "/winter-sale",
      title: "Winter Sale Terms | VYRO Wellness",
      description: `Terms of the VYRO Winter Sale: flat ${winterSale.discountPercent}% off Haven sauna MRP till ${winterSale.endsLabel}.`,
      // A time-limited offer page: keep it out of search results.
      noindex: true,
    }),
  component: WinterSalePage,
});

function WinterSalePage() {
  const live = winterSaleLive();
  const wa = whatsappLink(`Hello VYRO, I'd like a quote under ${winterSale.name} (${winterSale.discountPercent}% off).`);
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main id="main" className="mx-auto max-w-3xl px-5 py-20 lg:py-28">
        <Reveal>
          <p className="eyebrow text-bronze-strong">{live ? `Limited period · till ${winterSale.endsLabel}` : "Offer ended"}</p>
          <h1 className="mt-3 font-display text-5xl font-medium">
            {winterSale.name}: Flat {winterSale.discountPercent}% Off Saunas
          </h1>
          {!live && (
            <p className="mt-4 rounded-sm border border-border bg-secondary/60 p-4 text-sm text-muted-foreground">
              This offer ended on {winterSale.endsLabel}.
            </p>
          )}
          <div className="mt-10 space-y-10 text-sm leading-relaxed text-muted-foreground">
            {winterSaleFullTerms.map((section) => (
              <section key={section.title} className="space-y-3">
                <h2 className="font-display text-2xl font-medium text-foreground">{section.title}</h2>
                <ul className="space-y-2">
                  {section.points.map((pt) => (
                    <li key={pt} className="flex gap-3">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-bronze-strong" aria-hidden /> {pt}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
          {live && (
            <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-border pt-8">
              <Link
                to="/saunas"
                hash="builder"
                className="inline-flex items-center rounded-sm bg-foreground px-6 py-3 text-[12px] uppercase tracking-[0.16em] text-background hover:bg-foreground/90"
              >
                Build Your Sauna
              </Link>
              {wa && (
                <a href={wa} target="_blank" rel="noopener noreferrer" className="text-[12px] uppercase tracking-[0.16em] underline underline-offset-8 hover:text-bronze-strong">
                  Ask on WhatsApp
                </a>
              )}
            </div>
          )}
        </Reveal>
      </main>
      <SiteFooter />
    </div>
  );
}
