import { useState } from "react";
import { responsive, SIZES } from "@/lib/responsive-image";
import { pageHead, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { EnquiryForm } from "@/components/enquiry-form";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { saunaInstallation, site, whatsappLink } from "@/content/site";
import { consultationSteps } from "@/content/process";
import { SpecialistCallout } from "@/components/specialist-callout";
import { CabinFitFinder } from "@/components/cabin-fit-finder";
import { DownloadLink } from "@/components/download-link";
// Page hero differs from the homepage hero (the VYRO spruce sauna) so the two pages don't open identically.
import saunaInteriorImage from "@/assets/sauna.jpg";
import {
  accessorySets,
  controlPanels,
  heaters,
  modelSize,
  roomSizes,
  roomTypes,
  widthLabel,
  saunaModels,
  standardWood,
  woods,
  type RoomType,
} from "@/content/sauna-catalogue";


export const Route = createFileRoute("/saunas")({
  head: () =>
    pageHead({
      path: "/saunas",
      title: "Premium Saunas in India — VYRO Haven Cabins | VYRO Wellness",
      description:
        "Explore the VYRO Haven sauna range: Classic, Glass, Infrared and Compact cabins in spruce, with wood upgrades, Ember heaters, Pulse control panels and Ritual accessories — installed by our team across India.",
      ogTitle: "VYRO Haven Sauna Cabins",
      ogDescription:
        "Every Haven cabin, wood option, heater, control panel and accessory set — build your sauna and enquire.",
      image: "/og/saunas.jpg",
      jsonLd: [
        breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Saunas", path: "/saunas" }]),
        faqJsonLd(faqs),
      ],
    }),
  component: SaunasPage,
});

// Built only from facts already on this page (catalogue sizes, woods, heaters,
// panels and the consultation process). Shown on the page and published as
// FAQ structured data — keep them in one place.
const sizeItems = roomSizes.map((r) => `${r.name} (${widthLabel(r).replace("Approx. ", "approx. ")}, ${r.people})`);
const sizeSummary = `${sizeItems.slice(0, -1).join(", ")} and ${sizeItems.at(-1)}`;
const upgradeWoods = woods.filter((w) => !w.standard).map((w) => w.name);

const faqs = [
  {
    q: "Which Haven cabin suits my space?",
    a: `Haven cabins come in three sizes: ${sizeSummary}. Haven Compact is made for apartments and smaller rooms. Sizes are indicative — we confirm final dimensions for your project.`,
  },
  {
    q: "What's the difference between a traditional and an infrared sauna?",
    a: "Haven Infrared uses infrared panels that warm the body with gentle radiant heat at lower air temperatures — a calm, simple option for everyday sessions. Our other Haven cabins are heated by an Ember sauna heater and stones, in floor-standing, tower or wall-mounted designs.",
  },
  {
    q: "Which wood should I choose?",
    a: `Every Haven cabin is crafted in ${standardWood.toLowerCase()} as standard. The wood upgrades — ${upgradeWoods.slice(0, -1).join(", ")} and ${upgradeWoods.at(-1)} — change the colour, grain and character of your sauna. We'll help you choose for your space.`,
  },
  {
    q: "Which heater and control panel do I need?",
    a: `There are ${heaters.length} Ember heaters in floor-standing, tower and wall-mounted designs, and ${controlPanels.length} Pulse control panels: a simple button panel or a black-glass touch panel. The right pairing depends on your cabin and room — we'll recommend one during your consultation.`,
  },
  {
    q: "What do you need from me to plan a sauna?",
    a: "Your floor plan, plus details of the room's electrical layout and ventilation. We review these in a space assessment, then specify dimensions, timber and finishes for your architecture.",
  },
  {
    q: "Do you install saunas everywhere in India?",
    a: `Yes. We install VYRO saunas ${saunaInstallation.label} — our team handles delivery, installation and commissioning, with ongoing support afterwards.`,
  },
  {
    q: "How much does a VYRO sauna cost?",
    a: `It depends on the cabin, wood, heater, control panel and accessories you choose. Build your setup on this page and send it to us — our team replies ${site.enquiryResponseTime}.`,
  },
];

const tabBtn = (active: boolean) =>
  `whitespace-nowrap border-b-2 px-1 pb-3 text-[13px] uppercase tracking-[0.16em] transition-colors ${
    active ? "border-bronze text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
  }`;

function SaunasPage() {
  const [tab, setTab] = useState<RoomType["id"]>("standard");
  const [step, setStep] = useState(1);
  const [room, setRoom] = useState<string | null>(null);
  const [wood, setWood] = useState<string>(standardWood);
  const [heater, setHeater] = useState<string | null>(null);
  const [panel, setPanel] = useState<string | null>(null);
  const [acc, setAcc] = useState<string[]>([]);
  const [message, setMessage] = useState<string | undefined>(undefined);

  const activeType = roomTypes.find((t) => t.id === tab)!;
  const typeModels = saunaModels.filter((m) => m.type === tab);
  const roomModel = saunaModels.find((m) => m.code === room);

  const summary = [
    `Sauna cabin: ${roomModel ? `VYRO ${roomModel.name} ${roomModel.code}` : "Not selected"}`,
    `Wood: ${wood}${wood === standardWood ? " (standard)" : " (upgrade)"}`,
    `Heater: ${heater ?? "Not selected"}`,
    `Control panel: ${panel ?? "Not selected"}`,
    `Accessories: ${acc.length ? acc.join(", ") : "Not selected"}`,
  ].join("\n");
  const wa = whatsappLink(`Hello VYRO, I'd like to enquire about this sauna setup:\n${summary}`);
  const heroWa = whatsappLink("Hello VYRO, I'm interested in a VYRO sauna.");

  // Phones: move between steps from the sticky bar and bring the options back into view.
  const goStep = (n: number) => {
    setStep(n);
    requestAnimationFrame(() => document.getElementById("builder")?.scrollIntoView({ behavior: "smooth" }));
  };

  const enquire = () => {
    setMessage(`I'd like to enquire about this sauna setup:\n${summary}`);
    requestAnimationFrame(() =>
      document.getElementById("sauna-enquiry")?.scrollIntoView({ behavior: "smooth" }),
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main id="main">
        {/* Hero */}
        <section className="relative flex min-h-[60svh] items-end overflow-hidden bg-ink">
          <img src={saunaInteriorImage} {...responsive(saunaInteriorImage, SIZES.fullBleed)} alt="A warm timber sauna interior with tiered benches, a wooden bucket and a stone heater under soft amber light" width={1920} height={1280} className="absolute inset-0 h-full w-full object-cover" fetchPriority="high" />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/10" />
          <div className="relative mx-auto w-full max-w-7xl px-5 pb-14 pt-32 lg:px-8">
            <p className="eyebrow text-bronze">VYRO Haven Series</p>
            <h1 className="mt-3 font-display text-5xl font-medium text-ink-foreground sm:text-7xl">Sauna Cabins</h1>
            <p className="mt-4 max-w-xl text-ink-foreground/80">Every Haven cabin is crafted in spruce as standard, with six premium wood upgrades — and installed by our team {saunaInstallation.label}.</p>
            <div className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-4">
              <a href="#builder" className="inline-flex items-center gap-2 rounded-sm bg-ink-foreground px-6 py-3 text-[12px] uppercase tracking-[0.16em] text-ink transition-colors hover:bg-ink-foreground/90">
                Build Your Sauna <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
              {heroWa && (
                <a href={heroWa} target="_blank" rel="noopener noreferrer" className="text-[12px] uppercase tracking-[0.16em] text-ink-foreground/85 underline decoration-bronze underline-offset-8 hover:text-ink-foreground">
                  Talk on WhatsApp
                </a>
              )}
            </div>
            <nav aria-label="Room types" className="mt-8 flex flex-wrap gap-x-8 gap-y-3 border-t border-ink-foreground/15 pt-6">
              {roomTypes.map((t) => (
                <a key={t.id} href="#room-types" onClick={() => setTab(t.id)} className="text-[13px] uppercase tracking-[0.16em] text-ink-foreground/85 hover:text-ink-foreground">
                  {t.name}
                </a>
              ))}
            </nav>
          </div>
        </section>

        {/* Room types overview */}
        <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <SectionHeading overline="The Range" title="Four Ways to Sauna." />
          <div className="mt-12 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {roomTypes.map((t, i) => (
              <button key={t.id} type="button" onClick={() => { setTab(t.id); document.getElementById("room-types")?.scrollIntoView({ behavior: "smooth" }); }} className="group flex flex-col bg-card p-6 text-left">
                <span className="text-xs tracking-[0.2em] text-bronze-strong">0{i + 1} · {t.series}</span>
                <h3 className="mt-3 font-display text-2xl font-medium">{t.name}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{t.short}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.16em] group-hover:text-bronze-strong">View <ArrowRight className="h-4 w-4" aria-hidden /></span>
              </button>
            ))}
          </div>
        </section>

        {/* Tabs: about + models */}
        <section id="room-types" className="scroll-mt-24 border-t border-border bg-card">
          <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
            <div role="tablist" aria-label="Haven cabins" className="flex gap-8 overflow-x-auto border-b border-border">
              {roomTypes.map((t) => (
                <button key={t.id} id={`tab-${t.id}`} type="button" role="tab" aria-selected={tab === t.id} aria-controls="room-panel" onClick={() => setTab(t.id)} className={tabBtn(tab === t.id)}>
                  {t.name.replace("Haven ", "")}
                </button>
              ))}
            </div>
            <div id="room-panel" role="tabpanel" aria-labelledby={`tab-${tab}`}>
            <div className="mt-12 grid items-center gap-10 lg:grid-cols-2">
              <img src={activeType.image} {...responsive(activeType.image, SIZES.half)} alt={activeType.name} width={1600} height={1200} loading="lazy" className="aspect-[4/3] w-full bg-background object-contain p-4" />
              <div>
                <p className="eyebrow text-bronze-strong">VYRO {activeType.series}</p>
                <h2 className="mt-3 font-display text-4xl font-medium">{activeType.name}</h2>
                <p className="mt-4 leading-relaxed text-muted-foreground">{activeType.about}</p>
              </div>
            </div>
            {typeModels.length > 0 ? (
              <div className="mt-14 grid gap-6 md:grid-cols-3">
                {typeModels.map((m) => (
                  <article key={m.code} className="flex flex-col border border-border bg-background">
                    <img src={m.image} {...responsive(m.image, SIZES.third)} alt={`VYRO ${m.name} ${m.code} sauna cabin in spruce`} width={800} height={800} loading="lazy" className="aspect-square w-full object-contain p-4" />
                    <div className="flex flex-1 flex-col border-t border-border p-6">
                      <p className="eyebrow text-bronze-strong">{m.size} · Spruce</p>
                      <h3 className="mt-2 font-display text-2xl font-medium">{m.name} {m.code}</h3>
                      <p className="mt-1 text-sm text-foreground/80">
                        {modelSize(m).width} · {modelSize(m).people}
                      </p>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{m.copy}</p>
                      <button type="button" onClick={() => { setRoom(m.code); setStep(2); document.getElementById("builder")?.scrollIntoView({ behavior: "smooth" }); }} className="mt-5 inline-flex items-center gap-2 self-start text-[12px] uppercase tracking-[0.16em] hover:text-bronze-strong">
                        Customise this room <ArrowRight className="h-4 w-4" aria-hidden />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="mt-12 border-t border-border pt-8 text-sm text-muted-foreground">
                More sizes for this cabin are available on request — ask us in the enquiry form below.
              </p>
            )}
            </div>
          </div>
        </section>

        {/* Sizes */}
        <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <SectionHeading overline="Room Sizes" title="Small, Medium or Large." />
          <div className="mt-12 grid border-t border-bronze/40 md:grid-cols-3">
            {roomSizes.map((s) => (
              <div key={s.name} className="border-b border-bronze/40 py-8 md:border-b-0 md:border-r md:px-6 md:first:pl-0 md:last:border-r-0">
                <h3 className="font-display text-3xl font-medium">{s.name}</h3>
                <p className="mt-3 text-sm text-muted-foreground">{widthLabel(s)}</p>
                <p className="text-sm text-muted-foreground">{s.people}</p>
              </div>
            ))}
          </div>
          <CabinFitFinder onChoose={(code) => { setRoom(code); goStep(2); }} />
          <DownloadLink sheet="haven" className="mt-8" />
        </section>

        {/* Woods */}
        <section id="woods" className="scroll-mt-24 border-t border-border bg-card">
          <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
            <SectionHeading overline="Wood Options" title="Spruce as Standard. Six Upgrades." copy="Every Haven cabin is crafted in spruce. Choose an upgrade to change the colour, grain and character of your sauna." />
            <div className="mt-12 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
              {woods.map((w, i) => (
                <div key={w.name} className="flex flex-col bg-card p-6">
                  <span className="text-xs tracking-[0.2em] text-bronze-strong">{String(i + 1).padStart(2, "0")} · {w.standard ? "Standard" : "Upgrade"}</span>
                  <h3 className="mt-3 font-display text-2xl font-medium">{w.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{w.note}</p>
                </div>
              ))}
              <a href="#sauna-enquiry" className="group flex flex-col justify-end bg-ink p-6 text-ink-foreground">
                <p className="eyebrow text-bronze">Not sure?</p>
                <p className="mt-3 font-display text-2xl font-medium">Ask us which wood suits your space.</p>
                <span className="mt-4 inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.16em] group-hover:text-bronze">Enquire <ArrowRight className="h-4 w-4" aria-hidden /></span>
              </a>
            </div>
          </div>
        </section>

        {/* Builder */}
        <section id="builder" className="scroll-mt-24 bg-secondary/60" data-hide-mobile-bar>
          <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
            <SectionHeading overline="Build Your Sauna" title="Cabin, Wood, Heater, Control, Accessories." />
            <ol className="mt-10 flex gap-8 overflow-x-auto border-b border-border">
              {STEPS.map((l, i) => (
                <li key={l}>
                  <button type="button" onClick={() => setStep(i + 1)} className={tabBtn(step === i + 1)}>{i + 1} · {l}</button>
                </li>
              ))}
            </ol>
            <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_320px]">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {step === 1 && saunaModels.map((m) => (
                  <Choice key={m.code} selected={room === m.code} onClick={() => setRoom(m.code)} image={m.image} label={`${m.size} · ${modelSize(m).widthShort}`} title={`${m.name} ${m.code}`} copy={m.copy} />
                ))}
                {step === 2 && woods.map((w) => (
                  <button key={w.name} type="button" aria-pressed={wood === w.name} onClick={() => setWood(w.name)} className={`relative flex flex-col border bg-card p-5 text-left transition-colors ${wood === w.name ? "border-bronze" : "border-border hover:border-foreground/40"}`}>
                    {wood === w.name && <span className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground"><Check className="h-3.5 w-3.5" aria-hidden /></span>}
                    <p className="eyebrow text-bronze-strong">{w.standard ? "Standard" : "Upgrade"}</p>
                    <h4 className="mt-1 font-display text-xl font-medium">{w.name}</h4>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{w.note}</p>
                  </button>
                ))}
                {step === 3 && heaters.map((h) => (
                  <Choice key={h.name} selected={heater === h.name} onClick={() => setHeater(heater === h.name ? null : h.name)} image={h.image} label={h.kind} title={h.name} copy={h.copy} />
                ))}
                {step === 4 && controlPanels.map((c) => (
                  <Choice key={c.name} selected={panel === c.name} onClick={() => setPanel(panel === c.name ? null : c.name)} image={c.image} label={c.kind} title={c.name} copy={c.copy} />
                ))}
                {step === 5 && accessorySets.map((a) => (
                  <Choice key={a.name} selected={acc.includes(a.name)} onClick={() => setAcc(acc.includes(a.name) ? acc.filter((x) => x !== a.name) : [...acc, a.name])} image={a.image} label={`Available in: ${a.finish}`} title={a.name} copy={a.copy} />
                ))}
              </div>
              <aside className="h-fit border border-border bg-card p-6 lg:sticky lg:top-24">
                <h3 className="font-display text-2xl font-medium">Your Selection</h3>
                <dl className="mt-5 space-y-4 text-sm">
                  <div><dt className="eyebrow text-bronze-strong">Cabin</dt><dd className="mt-1">{roomModel ? `${roomModel.name} ${roomModel.code}` : "Not selected"}</dd></div>
                  <div><dt className="eyebrow text-bronze-strong">Wood</dt><dd className="mt-1">{wood}{wood === standardWood ? " (standard)" : " (upgrade)"}</dd></div>
                  <div><dt className="eyebrow text-bronze-strong">Heater</dt><dd className="mt-1">{heater ?? "Not selected"}</dd></div>
                  <div><dt className="eyebrow text-bronze-strong">Control Panel</dt><dd className="mt-1">{panel ?? "Not selected"}</dd></div>
                  <div><dt className="eyebrow text-bronze-strong">Accessories</dt><dd className="mt-1">{acc.length ? acc.join(", ") : "Not selected"}</dd></div>
                </dl>
                <div className="mt-6 flex gap-3">
                  {step > 1 && <button type="button" onClick={() => setStep(step - 1)} className="text-[12px] uppercase tracking-[0.16em] text-muted-foreground hover:text-foreground">← Back</button>}
                  {step < STEPS.length && <button type="button" onClick={() => setStep(step + 1)} className="ml-auto text-[12px] uppercase tracking-[0.16em] hover:text-bronze-strong">Next →</button>}
                </div>
                <button type="button" disabled={!room} onClick={enquire} className="mt-6 w-full rounded-sm bg-primary px-6 py-3 text-[13px] uppercase tracking-[0.16em] text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-40">
                  Enquire About This Setup
                </button>
                {!room && <p className="mt-2 text-xs text-muted-foreground">Select at least a cabin to continue.</p>}
                {room && wa && (
                  <a href={wa} target="_blank" rel="noopener noreferrer" className="mt-3 block text-center text-[12px] uppercase tracking-[0.16em] underline underline-offset-4 hover:text-bronze-strong">Send on WhatsApp</a>
                )}
              </aside>
            </div>

            {/* Phones: step controls stay within reach while scrolling through the options. */}
            <div className="sticky bottom-0 z-30 -mx-5 mt-8 flex items-center gap-3 border-t border-border bg-card/95 px-5 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur lg:hidden">
              <div className="min-w-0 flex-1">
                <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                  Step {step} of {STEPS.length} · {STEPS[step - 1]}
                </p>
                <p className="truncate text-sm">{roomModel ? `${roomModel.name} ${roomModel.code}` : "Choose a cabin"}</p>
              </div>
              {step > 1 && (
                <button type="button" onClick={() => goStep(step - 1)} aria-label="Previous step" className="rounded-sm border border-border px-3 py-2.5 text-xs uppercase tracking-[0.16em]">
                  ←
                </button>
              )}
              {step < STEPS.length ? (
                <button type="button" onClick={() => goStep(step + 1)} className="rounded-sm bg-primary px-4 py-2.5 text-xs uppercase tracking-[0.16em] text-primary-foreground">
                  Next
                </button>
              ) : (
                <button type="button" disabled={!room} onClick={enquire} className="rounded-sm bg-primary px-4 py-2.5 text-xs uppercase tracking-[0.16em] text-primary-foreground disabled:opacity-40">
                  Enquire
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <SectionHeading overline="How It Comes Together" title="From Floor Plan to First Session" />
          <ol className="mt-12 grid gap-10 md:grid-cols-3">
            {consultationSteps.map((st) => (
              <li key={st.n} className="border-t border-foreground pt-6">
                <span className="text-xs tracking-[0.2em] text-bronze-strong">{st.n}</span>
                <h3 className="mt-3 font-display text-2xl font-medium">{st.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{st.copy}</p>
              </li>
            ))}
          </ol>
        </section>

        <SpecialistCallout
          interest="Sauna"
          page="saunas"
          whatsappMessage="Hello VYRO, I'd like to talk to a specialist about a sauna."
        />

        {/* FAQs */}
        <section className="border-y border-border bg-secondary/60">
          <div className="mx-auto max-w-3xl px-5 py-20">
            <SectionHeading align="center" overline="FAQs" title="Sauna Questions, Answered" />
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
        <section id="sauna-enquiry" className="scroll-mt-24 mx-auto max-w-3xl px-5 py-20 lg:px-8">
          <Reveal>
            <SectionHeading overline="Your Wellness Awaits" title="Ready to Build Your Sauna?" copy="Our team will guide you from design consultation to installation." />
            <EnquiryForm key={message ?? "blank"} variant="consumer" defaultProductInterest="Sauna" defaultMessage={message} className="mt-10" />
          </Reveal>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

const STEPS = ["Cabin", "Wood", "Heater", "Control", "Accessories"];

function Choice({ selected, onClick, image, label, title, copy }: { selected: boolean; onClick: () => void; image: string; label: string; title: string; copy: string }) {
  return (
    <button type="button" aria-pressed={selected} onClick={onClick} className={`relative flex flex-col border bg-card text-left transition-colors ${selected ? "border-bronze" : "border-border hover:border-foreground/40"}`}>
      {selected && <span className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground"><Check className="h-3.5 w-3.5" aria-hidden /></span>}
      <img src={image} {...responsive(image, SIZES.third)} alt={title} width={600} height={600} loading="lazy" className="aspect-square w-full object-contain p-4" />
      <div className="border-t border-border p-5">
        <p className="eyebrow text-bronze-strong">{label}</p>
        <h4 className="mt-1 font-display text-xl font-medium">{title}</h4>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{copy}</p>
      </div>
    </button>
  );
}
