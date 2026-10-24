import { createFileRoute } from '@tanstack/react-router'
import { Reveal } from "@/components/reveal";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions | VYRO" },
      {
        name: "description",
        content: "VYRO terms and conditions.",
      },
      { property: "og:title", content: "Terms & Conditions | VYRO" },
      { property: "og:description", content: "Terms governing the use of the VYRO website." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: TermsPage,
});

// PLACEHOLDER CONTENT — replace this skeleton with your final Terms &
// Conditions before launch. Search the codebase for "PLACEHOLDER" to find all
// such spots.
function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-5 py-20 lg:py-28">
        <Reveal>
          <p className="eyebrow text-bronze-strong">Legal</p>
          <h1 className="mt-3 font-display text-5xl font-medium">Terms &amp; Conditions</h1>
          <div className="mt-4 rounded-sm border border-border bg-secondary/60 p-4 text-xs text-muted-foreground">
            Placeholder content — replace with your final Terms &amp; Conditions before launch.
          </div>
          <div className="mt-10 space-y-6 text-sm leading-relaxed text-muted-foreground">
            <p>
              These terms will govern the use of the VYRO website and any purchases or consultations
              arranged through it.
            </p>
            <h2 className="font-display text-2xl font-medium text-foreground">Use of This Website</h2>
            <p>
              Content on this site — including imagery and copy — is provided for information about
              VYRO and its wellness solutions, and may not be reproduced without permission.
            </p>
            <h2 className="font-display text-2xl font-medium text-foreground">Enquiries & Consultations</h2>
            <p>
              Submitting an enquiry does not create a contract. Details about products, pricing,
              availability and installation are confirmed during your consultation.
            </p>
            <h2 className="font-display text-2xl font-medium text-foreground">Wellness Disclaimer</h2>
            <p>
              VYRO products are designed for everyday wellness. We make no medical claims, and our
              products are not intended to diagnose, treat, cure or prevent any medical condition.
              If you have a health condition, please consult your doctor.
            </p>
          </div>
        </Reveal>
      </main>
      <SiteFooter />
    </div>
  );
}
