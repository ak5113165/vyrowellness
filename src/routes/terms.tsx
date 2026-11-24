import { createFileRoute } from '@tanstack/react-router'
import type { ReactNode } from "react";
import { pageHead } from "@/lib/seo";
import { Reveal } from "@/components/reveal";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { afterSales, gstRatePercent, site } from "@/content/site";

export const Route = createFileRoute("/terms")({
  head: () =>
    pageHead({
      path: "/terms",
      title: "Terms & Conditions | VYRO Wellness",
      description:
        "Terms for using the VYRO Wellness website and for VYRO orders: prices, payment, delivery, installation, warranty and after-sales service.",
    }),
  component: TermsPage,
});

// Drafted 24 Nov 2026 from terms the founder has confirmed (payment 50/40/10,
// non-refundable advance, dispatch and installation timelines, customer scope,
// installation disclaimer, warranty exclusions — see winterSaleFullTerms and
// afterSales in src/content/site.ts). Not yet reviewed by a lawyer/CA: the
// liability and jurisdiction sections in particular should be checked.
// Once the company is incorporated, put the registered name, CIN, GSTIN and
// registered office in "About These Terms" (via site.legalName and friends).
const LAST_UPDATED = "24 November 2026";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="font-display text-2xl font-medium text-foreground">{title}</h2>
      {children}
    </section>
  );
}

function List({ items }: { items: ReactNode[] }) {
  return (
    <ul className="list-disc space-y-2 pl-5">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

function Mail({ address }: { address: string }) {
  return (
    <a href={`mailto:${address}`} className="text-foreground underline underline-offset-4">
      {address}
    </a>
  );
}

function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main id="main" className="mx-auto max-w-3xl px-5 py-20 lg:py-28">
        <Reveal>
          <p className="eyebrow text-bronze-strong">Legal</p>
          <h1 className="mt-3 font-display text-5xl font-medium">Terms &amp; Conditions</h1>
          <p className="mt-4 text-sm text-muted-foreground">Last updated: {LAST_UPDATED}</p>

          <div className="mt-10 space-y-10 text-sm leading-relaxed text-muted-foreground">
            <Section title="About These Terms">
              <p>
                These terms apply when you use {site.domain} and when you order a VYRO product or service from{" "}
                {site.legalName} ("VYRO", "we", "us"). Your written quote and any offer terms shown on it form part of
                your order. If your quote and these terms differ, your quote applies.
              </p>
              <p>
                Questions about these terms: <Mail address={site.salesEmail} />.
              </p>
            </Section>

            <Section title="Prices and Quotes">
              <List
                items={[
                  `Prices on this website are MRP in Indian rupees and exclude GST, which is charged at ${gstRatePercent}%.`,
                  "Your final price is the one on your written quote. It depends on the model, size, wood, heater, accessories and your site.",
                  "Freight, packaging, shipping, lifting to upper floors and related charges are extra, charged as per actuals, and are in the customer's scope unless your quote says otherwise.",
                  "Website prices, specifications and images are for information and may change. Product images are illustrative; the finished product may differ slightly in colour, grain and detail.",
                ]}
              />
            </Section>

            <Section title="Orders and Payment">
              <List
                items={[
                  "Your order is confirmed when we receive a 50% advance payment against your quote.",
                  "40% is due before dispatch, and the remaining 10% after installation.",
                  "The 50% advance is non-refundable under any circumstances.",
                  "Sending an enquiry or receiving a quote does not create an order or a contract.",
                ]}
              />
            </Section>

            <Section title="Delivery and Installation">
              <List
                items={[
                  "Dispatch is planned within 7–10 working days of the 50% advance, unless your quote gives a different timeline.",
                  "On-site work starts within 27 days of receiving the payment due before dispatch, subject to your site being ready and utilities being available.",
                  "You are responsible for site readiness as set out in your quote: for example a suitable electrical supply, ventilation, access for the cabin or tub to reach the room, and water and drain points for cold plunges.",
                  "Installation may need drilling, cutting, customisation or changes to existing infrastructure. While we take the utmost care, we are not liable for damage to existing tiles, marble, granite, glass, civil works, pipes, fittings, wiring, fixtures, waterproofing or other incidental elements.",
                  "Please be present, or have someone present, during installation to supervise and verify the completed work.",
                ]}
              />
            </Section>

            <Section title="Warranty and After-Sales Service">
              <List
                items={[
                  `Sauna heaters: a ${afterSales.heaterComprehensiveWarrantyYears}-year comprehensive warranty, followed by ${afterSales.heaterSupportYears} more years of after-sales service support with ${afterSales.heaterSupportCharges} — ${afterSales.heaterServiceYears} years of service in total.`,
                  `Sauna woodwork: a ${afterSales.woodworkWorkmanshipMonths}-month warranty against workmanship defects.`,
                  "Other products: the warranty stated on your quote.",
                  "Warranty periods start from the date of final handover, exclude consumables, and are subject to the warranty conditions on your quote.",
                  "The warranty does not cover leakage of pipes, fittings, electrical switches, wiring, plumbing accessories or any third-party items after handover, or damage caused by improper use, water quality, power fluctuations, site conditions or unauthorised modifications.",
                  "Annual maintenance contracts (AMC) are available for every VYRO product.",
                ]}
              />
            </Section>

            <Section title="Offers">
              <p>
                Offers apply only as described on their own page and on your quote, and cannot be combined with any other
                offer or discount unless we say so in writing.
              </p>
            </Section>

            <Section title="Wellness Disclaimer">
              <p>
                VYRO products are designed for everyday wellness. We make no medical claims, and our products are not
                intended to diagnose, treat, cure or prevent any medical condition. If you have a health condition, are
                pregnant, or are unsure whether sauna, cold or light therapy suits you, please consult your doctor
                first. Always follow the usage guidance we give you at handover.
              </p>
            </Section>

            <Section title="Use of This Website">
              <p>
                The content on this website, including text, images, product designs and the VYRO name and logo,
                belongs to VYRO and may not be copied or reused without our written permission. We try to keep the
                information accurate and up to date, but it may contain errors and can change without notice.
              </p>
            </Section>

            <Section title="Limitation of Liability">
              <p>
                To the extent permitted by law, our total liability for any order is limited to the amount you have
                paid for that order, and we are not liable for indirect or consequential loss. Nothing in these terms
                limits any rights you have under Indian consumer protection law.
              </p>
            </Section>

            <Section title="Governing Law">
              <p>
                These terms are governed by the laws of India, and the courts at New Delhi have jurisdiction over any
                dispute.
              </p>
            </Section>

            <Section title="Changes to These Terms">
              <p>
                We may update these terms from time to time. The version on this page on the date your order is
                confirmed applies to that order.
              </p>
            </Section>
          </div>
        </Reveal>
      </main>
      <SiteFooter />
    </div>
  );
}
