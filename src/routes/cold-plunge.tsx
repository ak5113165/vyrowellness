import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Snowflake, Move, Gauge, Home, Layers, Zap } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { EnquiryForm } from "@/components/enquiry-form";

import proImg from "@/assets/plunge/glacier-pro.jpg";
import acrylicImg from "@/assets/plunge/glacier-acrylic.jpg";
import steelImg from "@/assets/plunge/glacier-steel.jpg";
import signatureImg from "@/assets/plunge/glacier-xtreme.jpg";
import inflatableImg from "@/assets/plunge/glacier-inflatable.jpg";
import portableImg from "@/assets/plunge/glacier-portable.jpg";
import chiller1Img from "@/assets/plunge/chiller-1hp.jpg";
import chiller2Img from "@/assets/plunge/chiller-2hp.jpg";
import heroImg from "@/assets/plunge/glacier-hero.jpg";

export const Route = createFileRoute("/cold-plunge")({
  head: () => ({
    meta: [
      { title: "VYRO Glacier Cold Plunges & Chillers — Made in India | VYRO Wellness" },
      {
        name: "description",
        content:
          "The VYRO Glacier cold plunge range — Inflatable, Portable, Pro, Acrylic, Steel and Signature tubs with 1HP and 2HP chilling systems. Made in India, coming soon.",
      },
      { property: "og:title", content: "VYRO Glacier Cold Plunges — Made in India" },
      {
        property: "og:description",
        content: "Six Glacier cold plunge tubs and 1HP / 2HP chilling systems. Coming soon — register your interest.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ColdPlungePage,
});

type Feature = { icon: typeof Snowflake; title: string; note: string };

const plunges: { name: string; tag: string; image: string; copy: string; features: Feature[] }[] = [
  {
    name: "GLACIER | inflatable",
    tag: "Inflatable Series",
    image: inflatableImg,
    copy: "An upright inflatable barrel with an insulated lid and strap closures. Pairs with a VYRO chiller and step.",
    features: [
      { icon: Move, title: "inflatable", note: "set up anywhere" },
      { icon: Snowflake, title: "chiller ready", note: "1HP or 2HP" },
    ],
  },
  {
    name: "GLACIER | portable",
    tag: "Portable Series",
    image: portableImg,
    copy: "A full-length inflatable tub with an insulated lid — lie back and immerse, then pack it away.",
    features: [
      { icon: Layers, title: "full-length", note: "lie-back immersion" },
      { icon: Snowflake, title: "chiller ready", note: "1HP or 2HP" },
    ],
  },
  {
    name: "GLACIER | pro",
    tag: "Flagship",
    image: proImg,
    copy: "A sturdy one-piece shell in matte black, built for a daily cold ritual at home or in the gym.",
    features: [
      { icon: Layers, title: "one-piece shell", note: "strong & seamless" },
      { icon: Snowflake, title: "chiller ready", note: "1HP or 2HP" },
    ],
  },
  {
    name: "GLACIER | acrylic",
    tag: "Acrylic Series",
    image: acrylicImg,
    copy: "A seamless gloss-white acrylic tub measuring 5 × 2.5 ft — clean, bright and easy to keep spotless.",
    features: [
      { icon: Layers, title: "5 × 2.5 ft", note: "white acrylic" },
      { icon: Snowflake, title: "chiller ready", note: "1HP or 2HP" },
    ],
  },
  {
    name: "GLACIER | steel",
    tag: "Stainless Steel",
    image: steelImg,
    copy: "An all-stainless-steel plunge with no timber cladding — a pure, minimal metal finish.",
    features: [
      { icon: Layers, title: "stainless steel", note: "no timber clad" },
      { icon: Snowflake, title: "chiller ready", note: "1HP or 2HP" },
    ],
  },
  {
    name: "GLACIER | signature",
    tag: "Premium",
    image: signatureImg,
    copy: "Timber-clad with a steel rim — a statement piece for villas, wellness suites and hospitality.",
    features: [
      { icon: Home, title: "inside or outside", note: "placement" },
      { icon: Snowflake, title: "chiller ready", note: "1HP or 2HP" },
    ],
  },
];

const chillers = [
  {
    name: "GLACIER | chiller 1HP",
    image: chiller1Img,
    copy: "Our compact chilling system for home plunges and personal use.",
    best: "Best for: home & personal use",
  },
  {
    name: "GLACIER | chiller 2HP",
    image: chiller2Img,
    copy: "Our more powerful chilling system for larger tubs and busier spaces like gyms and spas.",
    best: "Best for: larger tubs & commercial use",
  },
];

function SoonBadge({ bottom = false }: { bottom?: boolean }) {
  return (
    <span className={`absolute left-3 ${bottom ? "bottom-3" : "top-3"} bg-ink px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-ink-foreground`}>
      Coming Soon
    </span>
  );
}

function ColdPlungePage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        {/* Collection header */}
        <section className="relative flex min-h-[60svh] items-end overflow-hidden bg-ink">
          <img
            src={heroImg}
            alt="A VYRO Glacier cold plunge tub beside a chilling system in a dark, moody wellness space"
            width={1920}
            height={1088}
            className="absolute inset-0 h-full w-full object-cover"
            fetchPriority="high"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/25"
          />
          <div className="relative mx-auto w-full max-w-7xl px-5 pb-14 pt-40 lg:px-8">
            <p className="eyebrow text-bronze">VYRO Glacier Series · Made in India</p>
            <h1 className="mt-3 font-display text-5xl font-medium text-ink-foreground sm:text-7xl">Cold Plunges</h1>
            <p className="mt-4 max-w-xl text-ink-foreground/80">
              Six plunge tubs and two chilling systems, being manufactured in India. Launching soon —
              register your interest to be first in line.
            </p>
            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-[13px] uppercase tracking-[0.16em]">
              <a href="#plunges" className="text-ink-foreground/85 hover:text-ink-foreground">Plunge Tubs</a>
              <a href="#chillers" className="text-ink-foreground/85 hover:text-ink-foreground">Chilling Systems</a>
              <a href="#enquire" className="text-ink-foreground/85 hover:text-ink-foreground">Register Interest</a>
            </div>
          </div>
        </section>

        {/* Product grid */}
        <section id="plunges" className="scroll-mt-24 mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
          <div className="flex items-end justify-between gap-4 border-b border-border pb-4">
            <h2 className="font-display text-3xl font-medium">Plunge Tubs</h2>
            <p className="text-sm text-muted-foreground">{plunges.length} products</p>
          </div>
          <div className="mt-8 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {plunges.map((p) => (
              <article key={p.name} className="flex flex-col">
                <div className="relative bg-card">
                  <SoonBadge />
                  <img src={p.image} alt={`VYRO ${p.name.replace(" | ", " ")} cold plunge tub`} width={1024} height={1024} loading="lazy" className="aspect-square w-full object-contain" />
                </div>
                <p className="mt-4 eyebrow text-bronze-strong">{p.tag}</p>
                <h3 className="mt-1 font-display text-2xl font-medium">{p.name}</h3>
                <p className="mt-1 text-sm uppercase tracking-[0.14em] text-muted-foreground">Coming Soon</p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.copy}</p>
                <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-4">
                  {p.features.map((f) => (
                    <div key={f.title} className="flex items-start gap-2">
                      <f.icon className="mt-0.5 h-4 w-4 shrink-0 text-bronze-strong" aria-hidden />
                      <div>
                        <p className="text-sm font-medium">{f.title}</p>
                        <p className="text-xs text-muted-foreground">{f.note}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <a href="#enquire" className="mt-5 inline-flex items-center justify-center gap-2 border border-foreground px-4 py-3 text-[12px] uppercase tracking-[0.16em] transition-colors hover:bg-foreground hover:text-background">
                  Notify Me <ArrowRight className="h-4 w-4" aria-hidden />
                </a>
              </article>
            ))}
          </div>
        </section>

        {/* Chillers */}
        <section id="chillers" className="scroll-mt-24 border-t border-border bg-card">
          <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
            <SectionHeading overline="Chilling Systems" title="Choose Your Power: 1HP or 2HP." copy="Every Glacier tub pairs with a VYRO chilling system. Pick the power that suits your tub size and how often it's used." />
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {chillers.map((c) => (
                <article key={c.name} className="grid items-center gap-6 border border-border bg-background p-6 sm:grid-cols-[1fr_1.1fr]">
                  <div className="relative">
                    <SoonBadge bottom />
                    <img src={c.image} alt={`VYRO ${c.name.replace(" | ", " ")} water chilling system`} width={1024} height={1024} loading="lazy" className="aspect-square w-full object-contain" />
                  </div>
                  <div>
                    <p className="eyebrow text-bronze-strong flex items-center gap-2"><Zap className="h-3.5 w-3.5" aria-hidden /> {c.name.includes("1HP") ? "1HP" : "2HP"}</p>
                    <h3 className="mt-2 font-display text-2xl font-medium">{c.name}</h3>
                    <p className="mt-1 text-sm uppercase tracking-[0.14em] text-muted-foreground">Coming Soon</p>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.copy}</p>
                    <p className="mt-3 flex items-center gap-2 text-sm"><Gauge className="h-4 w-4 text-bronze-strong" aria-hidden /> {c.best}</p>
                    <a href="#enquire" className="mt-5 inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.16em] underline decoration-bronze underline-offset-8 hover:text-bronze-strong">
                      Notify Me <ArrowRight className="h-4 w-4" aria-hidden />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Made in India strip */}
        <section className="bg-ink text-ink-foreground">
          <div className="mx-auto grid max-w-7xl gap-px px-5 py-14 sm:grid-cols-3 lg:px-8">
            {[
              ["Made in India", "Designed and manufactured here, for Indian homes and climates."],
              ["Tub + Chiller", "Every tub pairs with a 1HP or 2HP VYRO chilling system."],
              ["Guided Setup", "Our team helps you plan placement, power and plumbing."],
            ].map(([t, d]) => (
              <div key={t} className="py-4 sm:px-6 sm:first:pl-0">
                <p className="font-display text-2xl font-medium">{t}</p>
                <p className="mt-2 text-sm text-ink-muted">{d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQs */}
        <section className="border-b border-border bg-secondary/60">
          <div className="mx-auto max-w-3xl px-5 py-20">
            <SectionHeading align="center" overline="FAQs" title="Questions, Answered Simply." />
            <Reveal className="mt-10">
              <Accordion type="single" collapsible className="border-t border-border">
                {[
                  { q: "When will VYRO Glacier cold plunges be available?", a: "The range is being manufactured in India and launches soon. Register your interest below and we'll tell you the moment it's available." },
                  { q: "Should I choose the 1HP or 2HP chiller?", a: "The 1HP suits most home plunges and personal use. The 2HP is for larger tubs and busier spaces like gyms and spas. We'll help you choose during your consultation." },
                  { q: "How much space does a cold plunge need?", a: "The Inflatable suits smaller spaces; the Acrylic, Steel and Signature need more room. Share your space with us and we'll suggest what fits." },
                  { q: "Can a cold plunge be placed outdoors?", a: "Some setups suit covered outdoor spaces. Our team will advise based on your space." },
                ].map((f) => (
                  <AccordionItem key={f.q} value={f.q} className="border-b border-border">
                    <AccordionTrigger className="text-left font-display text-xl font-medium text-foreground hover:no-underline">{f.q}</AccordionTrigger>
                    <AccordionContent className="text-sm leading-relaxed text-muted-foreground">{f.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Reveal>
          </div>
        </section>

        {/* Enquiry */}
        <section id="enquire" className="scroll-mt-24 mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
            <Reveal>
              <p className="eyebrow text-bronze-strong">Register Interest</p>
              <h2 className="mt-3 font-display text-4xl font-medium leading-[1.15] sm:text-5xl">Be First to Take the Plunge.</h2>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground">
                Tell us which Glacier tub and chiller you're interested in. We'll keep you updated as the
                Made-in-India range launches and help you plan your space in advance.
              </p>
            </Reveal>
            <Reveal delayMs={120}>
              <EnquiryForm variant="consumer" defaultProductInterest="Cold Plunge" />
            </Reveal>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
