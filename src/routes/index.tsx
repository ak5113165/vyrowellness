import { Link } from "@tanstack/react-router";
import { ArrowRight, Compass, Cpu, ShieldCheck, Users } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { CtaBand, CtaLink, SectionHeading } from "@/components/section";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { EnquiryForm } from "@/components/enquiry-form";
import { site, whatsappLink } from "@/content/site";

import heroImage from "@/assets/hero.jpg";
import introImage from "@/assets/still-life.jpg";
import saunaImage from "@/assets/sauna.jpg";
import coldImage from "@/assets/cold-plunge.jpg";
import lightImage from "@/assets/red-light.jpg";
import homeWellnessImage from "@/assets/home-wellness.jpg";
import fitnessImage from "@/assets/fitness.jpg";
import hospitalityImage from "@/assets/hospitality.jpg";
import studioImage from "@/assets/wellness-studio.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "VYRO — Premium Saunas, Cold Plunge & Red Light Therapy in India",
      },
      {
        name: "description",
        content:
          "VYRO brings thoughtfully designed wellness technology — premium saunas, cold plunge systems and red light therapy — to homes and businesses across India. Wellness, Reimagined.",
      },
      { property: "og:title", content: "VYRO — Wellness, Reimagined." },
      {
        property: "og:description",
        content:
          "Premium heat, cold and light therapy, thoughtfully designed for everyday life. Explore saunas, cold plunge and red light therapy for homes and businesses in India.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Index,
});

function Index() {
  const wa = whatsappLink("Hello VYRO, I'd like to book a wellness consultation.");

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main>
        {/* C. Full-screen cinematic hero */}
        <section className="relative flex min-h-[92svh] items-end overflow-hidden bg-ink">
          <img
            src={heroImage}
            alt="A premium wellness terrace at dusk with a glowing timber sauna cabin and a stone cold plunge basin surrounded by rising steam"
            width={1920}
            height={1088}
            className="absolute inset-0 h-full w-full object-cover"
            fetchPriority="high"
          />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-ink/25" />
          <div className="relative mx-auto w-full max-w-7xl px-5 pb-20 pt-32 sm:pb-24 lg:px-8">
            <p className="overline text-bronze">Heat. Cold. Light. Recovery.</p>
            <h1 className="mt-4 max-w-3xl font-display text-5xl font-medium leading-[1.05] text-ink-foreground sm:text-7xl lg:text-8xl">
              Wellness, Reimagined.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-foreground/85 sm:text-lg">
              Discover a more considered approach to recovery, relaxation, and everyday wellbeing
              through premium heat, cold, and light therapy.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <a
                href="#collection"
                className="inline-flex items-center justify-center rounded-sm bg-ink-foreground px-7 py-3.5 text-[13px] uppercase tracking-[0.16em] text-ink transition-colors hover:bg-ink-foreground/90"
              >
                Explore Our Collection
              </a>
              <CtaLink to="/philosophy" variant="outline" dark>
                Discover VYRO
              </CtaLink>
            </div>
          </div>
        </section>

        {/* D. Brand introduction */}
        <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <Reveal>
              <img
                src={introImage}
                alt="Balanced stacked stones on warm timber with soft steam rising, lit against a dark backdrop"
                width={1920}
                height={1280}
                loading="lazy"
                className="aspect-[4/5] w-full object-cover"
              />
            </Reveal>
            <Reveal delayMs={120}>
              <p className="overline text-bronze-strong">The VYRO Approach</p>
              <h2 className="mt-3 font-display text-4xl font-medium leading-[1.15] sm:text-5xl">
                Designed for a Better Way of Living.
              </h2>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
                At VYRO, we believe wellness should be more than an occasional ritual. It should be
                part of how you live. We bring together thoughtfully designed wellness equipment and
                modern recovery technologies to help you create a more personal wellness experience
                at home and beyond.
              </p>
              <div className="mt-8">
                <CtaLink to="/philosophy" variant="outline">
                  Our Philosophy
                </CtaLink>
              </div>
            </Reveal>
          </div>
        </section>

        {/* E. Find Your Element — four editorial category sections */}
        <section id="collection" className="scroll-mt-28 border-t border-border bg-card">
          <div className="mx-auto max-w-7xl space-y-20 px-5 py-20 lg:space-y-28 lg:px-8 lg:py-28">
            <SectionHeading
              overline="The Collection"
              title="Find Your Element."
              copy="Four paths into everyday wellness — each designed around how you want to live, recover and recharge."
            />
            <CategoryBlock
              image={saunaImage}
              alt="A warm natural-wood sauna interior with soft amber lighting, wooden benches, a bucket and ladle, and gentle steam"
              overline="Saunas"
              title="The Art of Heat."
              copy="Discover thoughtfully designed sauna experiences that bring warmth, relaxation, and personal wellness into your space."
              cta="Explore Saunas"
              to="/saunas"
            />
            <CategoryBlock
              image={coldImage}
              alt="A sculptural stone cold plunge tub with still water in a minimalist wellness room with timber flooring and soft daylight"
              overline="Cold Plunge"
              title="Embrace the Cold."
              copy="Explore contemporary cold plunge systems designed for a considered approach to recovery and everyday wellness."
              cta="Explore Cold Plunge"
              to="/cold-plunge"
              reverse
            />
            <CategoryBlock
              image={lightImage}
              alt="A sleek black red light therapy panel glowing deep red in a minimalist interior with warm timber flooring"
              overline="Red Light Therapy"
              title="See Wellness Differently."
              copy="Discover modern red light therapy equipment designed to integrate into your personal wellness routine."
              cta="Explore Light Therapy"
              to="/red-light-therapy"
            />
            <CategoryBlock
              image={heroImage}
              alt="An integrated wellness space with a timber sauna cabin, stone plunge pool and warm indirect lighting at dusk"
              overline="Complete Wellness"
              title="Your Personal Wellness Space."
              copy="Bring heat, cold, and light together in a thoughtfully designed wellness environment for your home or business."
              cta="Explore Wellness Solutions"
              to="/commercial-wellness"
              reverse
            />
          </div>
        </section>

        {/* F. Three Elements. One Vision. */}
        <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
          <SectionHeading
            align="center"
            overline="Our Elements"
            title="Three Elements. One Vision."
            copy="Heat. Cold. Light. Recovery."
          />
          <div className="mt-14 grid gap-12 text-center sm:grid-cols-3">
            {[
              {
                word: "HEAT",
                copy: "Make space for warmth, relaxation, and a more considered wellness ritual.",
              },
              {
                word: "COLD",
                copy: "Discover a refreshing approach to recovery and personal wellbeing.",
              },
              {
                word: "LIGHT",
                copy: "Explore light-based wellness technology designed for everyday routines.",
              },
            ].map((el, i) => (
              <Reveal key={el.word} delayMs={i * 100}>
                <p className="wordmark text-4xl text-bronze sm:text-5xl">{el.word}</p>
                <p className="mx-auto mt-5 max-w-xs text-sm leading-relaxed text-muted-foreground">
                  {el.copy}
                </p>
              </Reveal>
            ))}
          </div>
        </section>

        {/* G. Wellness, Thoughtfully Considered — four principles */}
        <section className="border-y border-border bg-secondary/60">
          <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24">
            <SectionHeading
              overline="What We Stand For"
              title="Wellness, Thoughtfully Considered."
            />
            <div className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: Compass,
                  title: "Thoughtful Design",
                  copy: "Considered forms, honest materials and spaces that feel calm the moment you enter.",
                },
                {
                  icon: Cpu,
                  title: "Modern Technology",
                  copy: "Contemporary wellness technology, chosen for everyday reliability and ease of use.",
                },
                {
                  icon: Users,
                  title: "Personalised Solutions",
                  copy: "Every home and business is different. We help you find what fits your life, not a template.",
                },
                {
                  icon: ShieldCheck,
                  title: "Support Beyond Purchase",
                  copy: "From first questions to aftercare, our team stays with you through the journey.",
                },
              ].map((p, i) => (
                <Reveal key={p.title} delayMs={i * 80}>
                  <p.icon className="h-6 w-6 text-bronze-strong" aria-hidden />
                  <h3 className="mt-4 font-display text-2xl font-medium text-foreground">{p.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.copy}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* H. Designed for your world */}
        <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
          <SectionHeading
            overline="Who It's For"
            title="Designed for Your World."
            copy="From private homes to professional spaces, VYRO brings considered wellness to the places you live, train and work."
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2">
            {[
              {
                image: homeWellnessImage,
                alt: "A private home wellness suite with a glass-fronted sauna, stone plunge bath and warm lighting",
                title: "Modern Homes",
                copy: "Personal wellness spaces that blend into the way you live — from a quiet corner to a dedicated suite.",
              },
              {
                image: fitnessImage,
                alt: "A premium gym recovery zone with a dark cold plunge tub and a glass sauna cabin",
                title: "Fitness & Performance",
                copy: "Recovery tools for athletes and enthusiasts who take training — and rest — seriously.",
              },
              {
                image: hospitalityImage,
                alt: "A luxury hotel spa corridor with arched stone doorways, warm cove lighting and glimpses of sauna rooms",
                title: "Hospitality & Luxury Living",
                copy: "Wellness experiences that give guests one more reason to remember their stay.",
              },
              {
                image: studioImage,
                alt: "A boutique wellness studio interior with timber, stone, linen textures and a sauna cabin",
                title: "Commercial Wellness Spaces",
                copy: "Gyms, spas, studios and workplaces planning wellness offerings for their members and teams.",
              },
            ].map((c, i) => (
              <Reveal key={c.title} delayMs={i * 60}>
                <Link
                  to="/commercial-wellness"
                  className="group block overflow-hidden rounded-sm border border-border bg-card"
                >
                  <div className="overflow-hidden">
                    <img
                      src={c.image}
                      alt={c.alt}
                      width={1920}
                      height={1280}
                      loading="lazy"
                      className="aspect-[16/10] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="p-7">
                    <h3 className="font-display text-2xl font-medium text-foreground">{c.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.copy}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>

        {/* I. Make Wellness Part of Your Space */}
        <CtaBand
          title="Make Wellness Part of Your Space."
          copy="From a dedicated sauna room to a complete home recovery environment, discover possibilities designed around your space, preferences, and lifestyle."
          cta={{ label: "Plan Your Wellness Space", to: "/contact" }}
        />

        {/* J. A New Perspective on Wellbeing */}
        <section className="mx-auto max-w-4xl px-5 py-20 text-center lg:py-28">
          <Reveal>
            <p className="overline text-bronze-strong">Our Philosophy</p>
            <h2 className="mt-4 font-display text-4xl font-medium leading-tight sm:text-5xl">
              A New Perspective on Wellbeing.
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground">
              Wellness is personal. The way we rest, recover, and recharge should be too. VYRO brings
              together contemporary design and modern wellness technology to help you create
              experiences that feel right for your life.
            </p>
            <div className="mt-8 flex justify-center">
              <CtaLink to="/philosophy" variant="outline">
                Discover Our Philosophy
              </CtaLink>
            </div>
          </Reveal>
        </section>

        {/* K. Lead section with enquiry form */}
        <section className="border-t border-border bg-secondary/60">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 lg:grid-cols-[1fr_1.2fr] lg:gap-20 lg:px-8 lg:py-24">
            <Reveal>
              <p className="overline text-bronze-strong">Enquire</p>
              <h2 className="mt-3 font-display text-4xl font-medium leading-[1.15] sm:text-5xl">
                Let's Create Your Wellness Space.
              </h2>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground">
                Whether you're exploring a sauna for your home, a cold plunge for your recovery
                routine, or a complete wellness solution for your business, our team can help you
                find the right direction.
              </p>
              <div className="mt-8 space-y-3 text-sm text-muted-foreground">
                <p>
                  Email:{" "}
                  <a href={`mailto:${site.email}`} className="text-foreground underline underline-offset-4">
                    {site.email}
                  </a>
                </p>
                <p>Phone: {site.phoneDisplay}</p>
              </div>
              {wa && (
                <a
                  href={wa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-flex items-center justify-center gap-2 rounded-sm bg-primary px-7 py-3.5 text-[13px] uppercase tracking-[0.16em] text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Enquire on WhatsApp <ArrowRight className="h-4 w-4" aria-hidden />
                </a>
              )}
            </Reveal>
            <Reveal delayMs={120}>
              <EnquiryForm variant="consumer" />
            </Reveal>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

function CategoryBlock({
  image,
  alt,
  overline,
  title,
  copy,
  cta,
  to,
  reverse = false,
}: {
  image: string;
  alt: string;
  overline: string;
  title: string;
  copy: string;
  cta: string;
  to: string;
  reverse?: boolean;
}) {
  return (
    <Reveal>
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className={reverse ? "lg:order-2" : undefined}>
          <Link to={to} className="group block overflow-hidden">
            <img
              src={image}
              alt={alt}
              width={1920}
              height={1280}
              loading="lazy"
              className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />
          </Link>
        </div>
        <div className={reverse ? "lg:order-1" : undefined}>
          <p className="overline text-bronze-strong">{overline}</p>
          <h3 className="mt-3 font-display text-4xl font-medium leading-[1.12] sm:text-5xl">{title}</h3>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-muted-foreground">{copy}</p>
          <div className="mt-7">
            <Link
              to={to}
              className="inline-flex items-center gap-2 text-[13px] uppercase tracking-[0.16em] text-foreground underline decoration-bronze decoration-2 underline-offset-8 transition-colors hover:text-bronze-strong"
            >
              {cta} <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
