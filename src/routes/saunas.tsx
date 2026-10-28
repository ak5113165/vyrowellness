import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { EnquiryForm } from "@/components/enquiry-form";
import { whatsappLink } from "@/content/site";
import {
  accessorySets,
  heaters,
  roomSizes,
  roomTypes,
  saunaModels,
  type RoomType,
} from "@/content/sauna-catalogue";

const HERO = roomTypes[0]!.image;

export const Route = createFileRoute("/saunas")({
  head: () => ({
    meta: [
      { title: "Sauna Rooms — Standard, Glass Front, Infrared & Compact | VYRO" },
      {
        name: "description",
        content:
          "Explore VYRO sauna rooms in India: standard, glass front, infrared and compact models in small, medium and large sizes. Choose your room, heater and accessories and enquire.",
      },
      { property: "og:title", content: "Sauna Rooms | VYRO" },
      {
        property: "og:description",
        content: "Every sauna room model, size, heater and accessory set — build your setup and enquire.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: HERO },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: HERO },
    ],
  }),
  component: SaunasPage,
});

const tabBtn = (active: boolean) =>
  `whitespace-nowrap border-b-2 px-1 pb-3 text-[13px] uppercase tracking-[0.16em] transition-colors ${
    active ? "border-bronze text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
  }`;

function SaunasPage() {
  const [tab, setTab] = useState<RoomType["id"]>("standard");
  const [step, setStep] = useState(1);
  const [room, setRoom] = useState<string | null>(null);
  const [heater, setHeater] = useState<string | null>(null);
  const [acc, setAcc] = useState<string[]>([]);
  const [message, setMessage] = useState<string | undefined>(undefined);

  const activeType = roomTypes.find((t) => t.id === tab)!;
  const typeModels = saunaModels.filter((m) => m.type === tab);
  const roomModel = saunaModels.find((m) => m.code === room);

  const summary = [
    `Sauna room: ${roomModel ? `${roomModel.name} - ${roomModel.code}` : "Not selected"}`,
    `Heater: ${heater ?? "Not selected"}`,
    `Accessories: ${acc.length ? acc.join(", ") : "Not selected"}`,
  ].join("\n");
  const wa = whatsappLink(`Hello VYRO, I'd like to enquire about this sauna setup:\n${summary}`);

  const enquire = () => {
    setMessage(`I'd like to enquire about this sauna setup:\n${summary}`);
    requestAnimationFrame(() =>
      document.getElementById("sauna-enquiry")?.scrollIntoView({ behavior: "smooth" }),
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        {/* Hero */}
        <section className="relative flex min-h-[60svh] items-end overflow-hidden bg-ink">
          <img src={HERO} alt="A Finnish-style timber sauna room with benches and a sauna heater" width={1920} height={1280} className="absolute inset-0 h-full w-full object-cover" fetchPriority="high" />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/10" />
          <div className="relative mx-auto w-full max-w-7xl px-5 pb-14 pt-32 lg:px-8">
            <p className="eyebrow text-bronze">Saunas</p>
            <h1 className="mt-3 font-display text-5xl font-medium text-ink-foreground sm:text-7xl">Sauna Rooms</h1>
            <nav aria-label="Room types" className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
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
                <span className="text-xs tracking-[0.2em] text-bronze-strong">0{i + 1}</span>
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
            <div role="tablist" className="flex gap-8 overflow-x-auto border-b border-border">
              {roomTypes.map((t) => (
                <button key={t.id} role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)} className={tabBtn(tab === t.id)}>
                  {t.name.replace(" Sauna Room", "")}
                </button>
              ))}
            </div>
            <div className="mt-12 grid items-center gap-10 lg:grid-cols-2">
              <img src={activeType.image} alt={activeType.name} width={1600} height={1200} loading="lazy" className="aspect-[4/3] w-full object-cover" />
              <div>
                <p className="eyebrow text-bronze-strong">About This Room</p>
                <h2 className="mt-3 font-display text-4xl font-medium">{activeType.name}</h2>
                <p className="mt-4 leading-relaxed text-muted-foreground">{activeType.about}</p>
              </div>
            </div>
            {typeModels.length > 0 ? (
              <div className="mt-14 grid gap-6 md:grid-cols-3">
                {typeModels.map((m) => (
                  <article key={m.code} className="flex flex-col border border-border bg-background">
                    <img src={m.image} alt={`${m.name} ${m.code}`} width={800} height={800} loading="lazy" className="aspect-square w-full object-contain p-4" />
                    <div className="flex flex-1 flex-col border-t border-border p-6">
                      <p className="eyebrow text-bronze-strong">{m.size} · {m.code}</p>
                      <h3 className="mt-2 font-display text-2xl font-medium">{m.name}</h3>
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
                Sizes and models for this room type are available on request — ask us in the enquiry form below.
              </p>
            )}
          </div>
        </section>

        {/* Sizes */}
        <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <SectionHeading overline="Room Sizes" title="Small, Medium or Large." />
          <div className="mt-12 grid border-t border-bronze/40 md:grid-cols-3">
            {roomSizes.map((s) => (
              <div key={s.name} className="border-b border-bronze/40 py-8 md:border-b-0 md:border-r md:px-6 md:first:pl-0 md:last:border-r-0">
                <h3 className="font-display text-3xl font-medium">{s.name}</h3>
                <p className="mt-3 text-sm text-muted-foreground">{s.spec}</p>
                <p className="text-sm text-muted-foreground">{s.people}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Builder */}
        <section id="builder" className="scroll-mt-24 bg-secondary/60">
          <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
            <SectionHeading overline="Build Your Sauna" title="Room, Heater, Accessories." />
            <ol className="mt-10 flex gap-8 border-b border-border">
              {["Room", "Heater", "Accessories"].map((l, i) => (
                <li key={l}>
                  <button type="button" onClick={() => setStep(i + 1)} className={tabBtn(step === i + 1)}>{i + 1} · {l}</button>
                </li>
              ))}
            </ol>
            <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_320px]">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {step === 1 && saunaModels.map((m) => (
                  <Choice key={m.code} selected={room === m.code} onClick={() => setRoom(m.code)} image={m.image} label={m.size} title={`${m.name} - ${m.code}`} copy={m.copy} />
                ))}
                {step === 2 && heaters.map((h) => (
                  <Choice key={h.name} selected={heater === h.name} onClick={() => setHeater(heater === h.name ? null : h.name)} image={h.image} label={h.kind} title={h.name} copy={h.copy} />
                ))}
                {step === 3 && accessorySets.map((a) => (
                  <Choice key={a.name} selected={acc.includes(a.name)} onClick={() => setAcc(acc.includes(a.name) ? acc.filter((x) => x !== a.name) : [...acc, a.name])} image={a.image} label={`Available in: ${a.finish}`} title={a.name} copy={a.copy} />
                ))}
              </div>
              <aside className="h-fit border border-border bg-card p-6 lg:sticky lg:top-24">
                <h3 className="font-display text-2xl font-medium">Your Selection</h3>
                <dl className="mt-5 space-y-4 text-sm">
                  <div><dt className="eyebrow text-bronze-strong">Room</dt><dd className="mt-1">{roomModel ? `${roomModel.name} - ${roomModel.code}` : "Not selected"}</dd></div>
                  <div><dt className="eyebrow text-bronze-strong">Heater</dt><dd className="mt-1">{heater ?? "Not selected"}</dd></div>
                  <div><dt className="eyebrow text-bronze-strong">Accessories</dt><dd className="mt-1">{acc.length ? acc.join(", ") : "Not selected"}</dd></div>
                </dl>
                <div className="mt-6 flex gap-3">
                  {step > 1 && <button type="button" onClick={() => setStep(step - 1)} className="text-[12px] uppercase tracking-[0.16em] text-muted-foreground hover:text-foreground">← Back</button>}
                  {step < 3 && <button type="button" onClick={() => setStep(step + 1)} className="ml-auto text-[12px] uppercase tracking-[0.16em] hover:text-bronze-strong">Next →</button>}
                </div>
                <button type="button" disabled={!room} onClick={enquire} className="mt-6 w-full rounded-sm bg-primary px-6 py-3 text-[13px] uppercase tracking-[0.16em] text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-40">
                  Enquire About This Setup
                </button>
                {!room && <p className="mt-2 text-xs text-muted-foreground">Select at least a room to continue.</p>}
                {room && wa && (
                  <a href={wa} target="_blank" rel="noopener noreferrer" className="mt-3 block text-center text-[12px] uppercase tracking-[0.16em] underline underline-offset-4 hover:text-bronze-strong">Send on WhatsApp</a>
                )}
              </aside>
            </div>
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

function Choice({ selected, onClick, image, label, title, copy }: { selected: boolean; onClick: () => void; image: string; label: string; title: string; copy: string }) {
  return (
    <button type="button" aria-pressed={selected} onClick={onClick} className={`relative flex flex-col border bg-card text-left transition-colors ${selected ? "border-bronze" : "border-border hover:border-foreground/40"}`}>
      {selected && <span className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground"><Check className="h-3.5 w-3.5" aria-hidden /></span>}
      <img src={image} alt={title} width={600} height={600} loading="lazy" className="aspect-square w-full object-contain p-4" />
      <div className="border-t border-border p-5">
        <p className="eyebrow text-bronze-strong">{label}</p>
        <h4 className="mt-1 font-display text-xl font-medium">{title}</h4>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{copy}</p>
      </div>
    </button>
  );
}
