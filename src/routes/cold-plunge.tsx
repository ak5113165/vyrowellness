import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, Zap } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { EnquiryForm } from "@/components/enquiry-form";
import { SpecialistCallout } from "@/components/specialist-callout";
import { DownloadLink } from "@/components/download-link";
import { responsive, SIZES } from "@/lib/responsive-image";
import { absoluteUrl, pageHead, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";
import {
  coldPlungeLaunch,
  externalChillerSpecs,
  glacierDimensions,
  glacierLaunchPricing,
  whatsappLink,
} from "@/content/site";
import {
  chillerRequirements,
  chillers,
  formatInr,
  fromPrice,
  launchLabel,
  upgradePrice,
  waterCapacity,
  launchModels,
  launchPrice,
  projectModels,
} from "@/content/glacier-catalogue";

// Cinematic Glacier Acrylic installation; replace with real lifestyle photography when available.
import heroImg from "@/assets/plunge/glacier-hero.jpg";

const cities = coldPlungeLaunch.serviceLocations.join(", ").replace(/, ([^,]*)$/, " and $1");
const launchIso = `${coldPlungeLaunch.year}-${String(coldPlungeLaunch.month).padStart(2, "0")}-${String(coldPlungeLaunch.day).padStart(2, "0")}`;

function productJsonLd() {
  return launchModels.map((m) => {
    const price = glacierLaunchPricing[m.name].priceInr;
    return {
      "@context": "https://schema.org",
      "@type": "Product",
      name: `VYRO ${m.name}`,
      description: `${m.positioning} ${m.size}. MRP includes the 1HP chiller and installation; 2HP chiller upgrade available.`,
      image: absoluteUrl(m.image),
      brand: { "@type": "Brand", name: "VYRO" },
      ...(price === null
        ? {}
        : {
            offers: {
              "@type": "Offer",
              price: String(price),
              priceCurrency: "INR",
              availability: "https://schema.org/PreOrder",
              availabilityStarts: launchIso,
              url: absoluteUrl("/cold-plunge"),
            },
          }),
    };
  });
}

export const Route = createFileRoute("/cold-plunge")({
  head: () =>
    pageHead({
      path: "/cold-plunge",
      title: `Glacier Cold Plunges, Made in India — Launching ${launchLabel} | VYRO Wellness`,
      description: `VYRO Glacier cold plunges, made in ${coldPlungeLaunch.madeIn}. Glacier Barrel, Portable and Acrylic launch on ${launchLabel}${fromPrice ? `, from ${fromPrice} MRP` : ""} including the 1HP chiller and installation, cooling down to ${externalChillerSpecs.minimumTemperatureC}°C. Register for launch.`,
      ogTitle: `VYRO Glacier Cold Plunges — Launching ${launchLabel}`,
      ogDescription: `Glacier Barrel, Glacier Portable and Glacier Acrylic. Made in India, available first in ${cities}.`,
      image: "/og/cold-plunge.jpg",
      jsonLd: [
        breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Cold Plunge", path: "/cold-plunge" }]),
        faqJsonLd(faqs),
        ...productJsonLd(),
      ],
    }),
  component: ColdPlungePage,
});

// Shown on the page and published as FAQ structured data — keep them in one place.
const faqs = [
  {
    q: "When do VYRO Glacier cold plunges launch?",
    a: `Glacier Barrel, Glacier Portable and Glacier Acrylic launch on ${launchLabel}, together with the 1HP and 2HP chillers, available first in ${cities}. Glacier Pro, Steel, Signature and Integrated are coming soon for custom and premium projects.`,
  },
  {
    q: "How cold does the water get?",
    a: `With an external VYRO chiller, Glacier plunges can be cooled down to ${externalChillerSpecs.minimumTemperatureC}°C.`,
  },
  {
    q: "Is a chiller included, and should I upgrade to 2HP?",
    a: `Every Glacier launch model comes with the 1HP chiller, which suits most home plunges and personal use. You can upgrade to the 2HP for faster cooling for ${upgradePrice.slice(1)} more; it's also our choice for larger tubs and busier spaces like gyms and spas. We'll help you decide during your consultation.`,
  },
  {
    q: "Is installation included in the price?",
    a: "Yes. The MRP of every Glacier launch model includes the 1HP chiller and installation by our team.",
  },
  {
    q: "What does installation need?",
    a: `External chiller setups need a ${externalChillerSpecs.electricalPhase.toLowerCase()} power supply, ${externalChillerSpecs.wiringOptionsMm2.join(" mm² or ")} mm² wiring, ${externalChillerSpecs.waterInletPoints} water inlet point and ${externalChillerSpecs.drainPoints} drain point for discharge when needed. Our team confirms the details for your space.`,
  },
  {
    q: "How much space does a cold plunge need?",
    a: `Glacier Barrel is ${glacierDimensions["Glacier Barrel"].split(" · ")[0]}, so it suits smaller spaces. Glacier Portable and Glacier Acrylic are both ${glacierDimensions["Glacier Acrylic"]}. The launch range holds ${waterCapacity.replace("–", " to ").replace(" L", " litres")} of water. Allow room for the chiller beside the tub — share your space with us and we'll suggest what fits.`,
  },
  {
    q: "Can a cold plunge be placed outdoors?",
    a: "Some setups suit covered outdoor spaces. Our team will advise based on your space.",
  },
];

function StatusBadge({ children, tone = "dark" }: { children: string; tone?: "dark" | "light" }) {
  return (
    <span
      className={`absolute left-3 top-3 px-2.5 py-1 text-xs uppercase tracking-[0.18em] ${
        tone === "dark" ? "bg-ink text-ink-foreground" : "border border-border bg-background text-muted-foreground"
      }`}
    >
      {children}
    </span>
  );
}

function ColdPlungePage() {
  const [message, setMessage] = useState<string | undefined>(undefined);

  const enquire = (text: string) => {
    setMessage(text);
    requestAnimationFrame(() => document.getElementById("enquire")?.scrollIntoView({ behavior: "smooth" }));
  };

  const specLabels = launchModels[0]?.specs.map((s) => s.label) ?? [];

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main id="main">
        {/* Cinematic collection hero: a real-feeling Glacier Acrylic installation at dusk. */}
        <section className="bg-ink text-ink-foreground">
          <div className="mx-auto grid max-w-[1600px] items-stretch lg:grid-cols-[0.85fr_1.15fr]">
            <div className="flex flex-col justify-center px-5 py-14 sm:px-10 lg:px-16 lg:py-20">
              <p className="eyebrow text-bronze">
                VYRO Glacier · Made in {coldPlungeLaunch.madeIn}
              </p>
              <h1 className="mt-3 font-display text-5xl font-medium sm:text-7xl">Cold Plunges</h1>
              <p className="mt-4 max-w-xl text-ink-foreground/80">
                Three Glacier plunges launch on {launchLabel}: Barrel, Portable and Acrylic
                {fromPrice ? `, from ${fromPrice} MRP including the 1HP chiller and installation` : ""}. Available first in {cities}.
              </p>
              <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 border-t border-ink-border pt-6 text-[13px] uppercase tracking-[0.16em]">
                <a href="#launch" className="text-ink-foreground/75 hover:text-ink-foreground">Launch Range</a>
                <a href="#compare" className="text-ink-foreground/75 hover:text-ink-foreground">Compare</a>
                <a href="#chillers" className="text-ink-foreground/75 hover:text-ink-foreground">Chillers</a>
                <a href="#projects" className="text-ink-foreground/75 hover:text-ink-foreground">Project Collection</a>
                <a href="#enquire" className="text-ink-foreground/75 hover:text-ink-foreground">Register</a>
              </div>
            </div>
            <div className="relative aspect-[6/5] lg:aspect-auto lg:min-h-[620px]">
              <img
                src={heroImg}
                {...responsive(heroImg, SIZES.half)}
                alt="A person taking a cold plunge in a VYRO Glacier Acrylic tub beside its 1HP chiller in a luxury wellness suite at dusk"
                width={1440}
                height={1200}
                className="absolute inset-0 h-full w-full object-cover object-center"
                fetchPriority="high"
              />
            </div>
          </div>
        </section>

        {/* Launch strip */}
        <section className="border-b border-bronze/40 bg-secondary/60">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8 lg:px-8">
            <p className="eyebrow shrink-0 text-bronze-strong">Launching {launchLabel}</p>
            <p className="text-sm text-muted-foreground">
              {launchModels.map((m) => m.name).join(" · ")} · 1HP &amp; 2HP chillers — {cities}
            </p>
          </div>
        </section>

        {/* Launch range: three hero products */}
        <section id="launch" className="scroll-mt-24 mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24">
          <SectionHeading
            overline="The Launch Range"
            title="Three Plunges for Launch Day."
            copy="Choose by how you want to plunge and how much space you have. Each works with a VYRO external chiller."
          />
          <div className="mt-14 grid gap-x-8 gap-y-16 lg:grid-cols-3">
            {launchModels.map((m, i) => {
              const price = launchPrice(m.name);
              const wa = whatsappLink(`Hello VYRO, I'd like to know more about the ${m.name} launching on ${launchLabel}.`);
              return (
                <Reveal key={m.name} delayMs={i * 80} className="h-full">
                  <article className="flex h-full flex-col">
                    <div className="relative bg-card">
                      <StatusBadge>{`Launching ${coldPlungeLaunch.shortLabel}`}</StatusBadge>
                      <img
                        src={m.image}
                        {...responsive(m.image, SIZES.third)}
                        alt={m.alt}
                        width={1024}
                        height={1024}
                        loading="lazy"
                        className="aspect-square w-full object-contain"
                      />
                    </div>
                    <p className="eyebrow mt-6 text-bronze-strong">{m.tag}</p>
                    <h3 className="mt-2 font-display text-3xl font-medium">{m.name}</h3>
                    <p className="mt-1 text-sm text-foreground/80">{m.size}</p>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{m.positioning}</p>

                    <div className="mt-6 border-y border-border py-4">
                      <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">MRP</p>
                      <p className="mt-1 font-display text-2xl font-medium">{price.display}</p>
                      {price.note && <p className="mt-1 text-xs text-muted-foreground">{price.note}</p>}
                      <p className="mt-1 text-xs text-muted-foreground">2HP chiller upgrade: {upgradePrice}</p>
                    </div>

                    <ul className="mt-5 flex-1 space-y-2.5 text-sm">
                      {m.keyFacts.map((f) => (
                        <li key={f} className="flex items-start gap-2.5">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-bronze-strong" aria-hidden />
                          {f}
                        </li>
                      ))}
                      <li className="pt-1 text-xs text-muted-foreground">Best for: {m.bestFor}</li>
                    </ul>

                    <button
                      type="button"
                      onClick={() =>
                        enquire(`I'd like to register for the ${m.name} launch on ${launchLabel}.`)
                      }
                      className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-sm bg-primary px-5 py-3.5 text-[12px] uppercase tracking-[0.16em] text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                      Register for Launch <ArrowRight className="h-4 w-4" aria-hidden />
                    </button>
                    {wa && (
                      <a
                        href={wa}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 text-center text-[12px] uppercase tracking-[0.16em] underline decoration-bronze underline-offset-8 hover:text-bronze-strong"
                      >
                        Ask on WhatsApp
                      </a>
                    )}
                    <Link
                      to="/cold-plunge/$model"
                      params={{ model: m.slug }}
                      className="mt-3 text-center text-[12px] uppercase tracking-[0.16em] text-muted-foreground hover:text-foreground"
                    >
                      Full Details &amp; Specs →
                    </Link>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </section>

        {/* Comparison */}
        <section id="compare" className="scroll-mt-24 border-t border-border bg-card">
          <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
            <SectionHeading overline="Compare" title="At a Glance." />
            <div className="mt-10 overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                <caption className="sr-only">Comparison of the Glacier launch range</caption>
                <thead>
                  <tr className="border-b border-foreground">
                    <th scope="col" className="w-1/4 py-4 pr-4 font-normal text-muted-foreground" />
                    {launchModels.map((m) => (
                      <th key={m.name} scope="col" className="py-4 pr-4 font-display text-xl font-medium">
                        {m.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {specLabels.map((label) => (
                    <tr key={label} className="border-b border-border">
                      <th scope="row" className="py-4 pr-4 text-xs font-normal uppercase tracking-[0.14em] text-muted-foreground">
                        {label}
                      </th>
                      {launchModels.map((m) => (
                        <td key={m.name} className="py-4 pr-4">
                          {m.specs.find((s) => s.label === label)?.value ?? "—"}
                        </td>
                      ))}
                    </tr>
                  ))}
                  <tr className="border-b border-border">
                    <th scope="row" className="py-4 pr-4 text-xs font-normal uppercase tracking-[0.14em] text-muted-foreground">
                      Launch
                    </th>
                    {launchModels.map((m) => (
                      <td key={m.name} className="py-4 pr-4">{launchLabel}</td>
                    ))}
                  </tr>
                  <tr className="border-b border-border">
                    <th scope="row" className="py-4 pr-4 text-xs font-normal uppercase tracking-[0.14em] text-muted-foreground">
                      MRP · incl. 1HP chiller &amp; installation
                    </th>
                    {launchModels.map((m) => (
                      <td key={m.name} className="py-4 pr-4 font-display text-lg font-medium">{launchPrice(m.name).display}</td>
                    ))}
                  </tr>
                  <tr className="border-b border-border">
                    <th scope="row" className="py-4 pr-4 text-xs font-normal uppercase tracking-[0.14em] text-muted-foreground">
                      2HP chiller upgrade
                    </th>
                    {launchModels.map((m) => (
                      <td key={m.name} className="py-4 pr-4">{upgradePrice}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-5 text-sm text-muted-foreground">
              Water capacity across the launch range: {waterCapacity}. All prices are MRP and include installation.
            </p>
            <DownloadLink sheet="glacier" className="mt-6" />
          </div>
        </section>

        <SpecialistCallout
          interest="Cold Plunge"
          page="cold plunge"
          whatsappMessage={`Hello VYRO, I'd like to talk to a specialist about the Glacier cold plunges launching on ${launchLabel}.`}
        />

        {/* Chillers + requirements */}
        <section id="chillers" className="scroll-mt-24 mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <SectionHeading
            overline="Chilling Systems"
            title="1HP or 2HP."
            copy={`Every Glacier launch model comes with the 1HP chiller. Upgrade to the 2HP for faster cooling (${upgradePrice}). Both chillers launch on ${launchLabel}.`}
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {chillers.map((c) => (
              <article key={c.name} className="grid items-center gap-6 border border-border bg-card p-6 sm:grid-cols-[1fr_1.1fr]">
                <div className="relative bg-card">
                  <StatusBadge>{`Launching ${coldPlungeLaunch.shortLabel}`}</StatusBadge>
                  <img
                    src={c.image}
                    {...responsive(c.image, SIZES.third)}
                    alt={`VYRO ${c.name} water chilling system`}
                    width={1024}
                    height={1024}
                    loading="lazy"
                    className="aspect-square w-full object-contain"
                  />
                </div>
                <div>
                  <p className="eyebrow flex items-center gap-2 text-bronze-strong">
                    <Zap className="h-3.5 w-3.5" aria-hidden /> {c.hp}HP
                  </p>
                  <h3 className="mt-2 font-display text-2xl font-medium">{c.name}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.copy}</p>
                  <p className="mt-3 text-sm">Best for: {c.best}</p>
                  <p className="mt-4 border-t border-border pt-3 text-sm">
                    <span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Chiller only · MRP</span>
                    <span className="mt-0.5 block font-display text-xl font-medium">{formatInr(c.mrpInr)}</span>
                  </p>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-10 border-t border-foreground pt-6">
            <h3 className="eyebrow text-bronze-strong">Installation requirements</h3>
            <dl className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
              {chillerRequirements.map((r) => (
                <div key={r.label}>
                  <dt className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{r.label}</dt>
                  <dd className="mt-1.5 font-display text-xl font-medium">{r.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Project collection: coming soon */}
        <section id="projects" className="scroll-mt-24 border-t border-border bg-card">
          <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
            <SectionHeading
              overline="Coming Soon · Custom & Premium Projects"
              title="The Project Collection."
              copy="Four further Glacier designs for villas, wellness suites, gyms and hospitality — specified project by project."
            />
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {projectModels.map((p) => (
                <article key={p.name} className="flex flex-col border border-border bg-background">
                  <div className="relative bg-card">
                    <StatusBadge tone="light">Coming Soon</StatusBadge>
                    <img
                      src={p.image}
                      {...responsive(p.image, SIZES.third)}
                      alt={`VYRO ${p.name} cold plunge`}
                      width={1024}
                      height={1024}
                      loading="lazy"
                      className="aspect-square w-full object-contain"
                    />
                  </div>
                  <div className="flex flex-1 flex-col border-t border-border p-5">
                    <p className="eyebrow text-bronze-strong">{p.tag}</p>
                    <h3 className="mt-1.5 font-display text-xl font-medium">{p.name}</h3>
                    <p className="mt-2 flex-1 text-xs leading-relaxed text-muted-foreground">{p.copy}</p>
                    <button
                      type="button"
                      onClick={() => enquire(`I'd like to discuss a custom or premium project with the ${p.name}.`)}
                      className="mt-4 inline-flex items-center gap-2 self-start text-[12px] uppercase tracking-[0.16em] hover:text-bronze-strong"
                    >
                      Discuss a Project <ArrowRight className="h-4 w-4" aria-hidden />
                    </button>
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
              [`Made in ${coldPlungeLaunch.madeIn}`, "Designed and manufactured in India, for Indian homes and climates."],
              ["Launch Cities", `Available first in ${cities}.`],
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
                {faqs.map((f) => (
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
              <p className="eyebrow text-bronze-strong">Register for Launch</p>
              <h2 className="mt-3 font-display text-4xl font-medium leading-[1.15] sm:text-5xl">Be First to Take the Plunge.</h2>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground">
                Tell us which Glacier plunge you're considering. We'll keep you updated ahead of the{" "}
                {launchLabel} launch and help you plan your space, power and drainage in advance.
              </p>
            </Reveal>
            <Reveal delayMs={120}>
              <EnquiryForm key={message ?? "blank"} variant="consumer" defaultProductInterest="Cold Plunge" defaultMessage={message} />
            </Reveal>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
