import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Reveal } from "@/components/reveal";

export function SectionHeading({
  overline,
  title,
  copy,
  align = "left",
  dark = false,
}: {
  overline?: string;
  title: string;
  copy?: string;
  align?: "left" | "center";
  dark?: boolean;
}) {
  return (
    <Reveal className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow && <p className={`eyebrow ${dark ? "text-bronze" : "text-bronze-strong"}`}>{overline}</p>}
      <h2
        className={`mt-3 font-display text-4xl font-medium leading-[1.15] sm:text-5xl ${
          dark ? "text-ink-foreground" : "text-foreground"
        }`}
      >
        {title}
      </h2>
      {copy && (
        <p className={`mt-4 text-base leading-relaxed ${dark ? "text-ink-muted" : "text-muted-foreground"}`}>
          {copy}
        </p>
      )}
    </Reveal>
  );
}

export function CtaLink({
  to,
  children,
  variant = "primary",
  dark = false,
}: {
  to: string;
  children: ReactNode;
  variant?: "primary" | "outline";
  dark?: boolean;
}) {
  const base =
    "inline-flex items-center justify-center rounded-sm px-7 py-3 text-[13px] uppercase tracking-[0.16em] transition-colors";
  if (variant === "outline") {
    return (
      <Link
        to={to}
        className={`${base} ${
          dark
            ? "border border-ink-foreground/50 text-ink-foreground hover:bg-ink-foreground hover:text-ink"
            : "border border-foreground/40 text-foreground hover:bg-foreground hover:text-background"
        }`}
      >
        {children}
      </Link>
    );
  }
  return (
    <Link
      to={to}
      className={`${base} ${
        dark
          ? "bg-ink-foreground text-ink hover:bg-ink-foreground/90"
          : "bg-primary text-primary-foreground hover:bg-primary/90"
      }`}
    >
      {children}
    </Link>
  );
}

export function CtaBand({
  title,
  copy,
  cta,
}: {
  title: string;
  copy: string;
  cta: { label: string; to: string };
}) {
  return (
    <section className="bg-ink">
      <div className="mx-auto max-w-4xl px-5 py-20 text-center lg:py-24">
        <Reveal>
          <h2 className="font-display text-4xl font-medium leading-tight text-ink-foreground sm:text-5xl">
            {title}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-ink-muted">{copy}</p>
          <div className="mt-8">
            <CtaLink to={cta.to} dark>
              {cta.label}
            </CtaLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
