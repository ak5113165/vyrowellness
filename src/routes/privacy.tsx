import { Reveal } from "@/components/reveal";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | VYRO" },
      {
        name: "description",
        content: "VYRO privacy policy.",
      },
      { property: "og:title", content: "Privacy Policy | VYRO" },
      { property: "og:description", content: "How VYRO handles your personal information." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: PrivacyPage,
});

// PLACEHOLDER CONTENT — replace this skeleton with your final Privacy Policy
// before launch. Search the codebase for "PLACEHOLDER" to find all such spots.
function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-5 py-20 lg:py-28">
        <Reveal>
          <p className="overline text-bronze-strong">Legal</p>
          <h1 className="mt-3 font-display text-5xl font-medium">Privacy Policy</h1>
          <div className="mt-4 rounded-sm border border-border bg-secondary/60 p-4 text-xs text-muted-foreground">
            Placeholder content — replace with your final Privacy Policy before launch.
          </div>
          <div className="mt-10 space-y-6 text-sm leading-relaxed text-muted-foreground">
            <p>
              VYRO respects your privacy. This policy will describe what personal information we
              collect when you enquire or make a purchase, how we use it, and the choices available
              to you.
            </p>
            <h2 className="font-display text-2xl font-medium text-foreground">Information We Collect</h2>
            <p>
              When you submit an enquiry, we collect the details you share with us — such as your
              name, phone number, email, city and the nature of your interest — so that our team can
              respond to you.
            </p>
            <h2 className="font-display text-2xl font-medium text-foreground">How We Use Information</h2>
            <p>
              We use enquiry details to respond to your request and to plan follow-up conversations.
              We do not sell your personal information.
            </p>
            <h2 className="font-display text-2xl font-medium text-foreground">Contact</h2>
            <p>
              Questions about privacy can be sent to us through the contact page. This placeholder
              will be replaced with your organisation's registered contact details.
            </p>
          </div>
        </Reveal>
      </main>
      <SiteFooter />
    </div>
  );
}
