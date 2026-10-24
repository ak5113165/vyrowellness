import type { ReactNode } from "react";

// Immersive page hero used by the collection pages.
export function PageHero({
  image,
  imageAlt,
  overline,
  title,
  copy,
  children,
}: {
  image: string;
  imageAlt: string;
  overline?: string;
  title: string;
  copy?: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative flex min-h-[70svh] items-end overflow-hidden bg-ink">
      <img
        src={image}
        alt={imageAlt}
        width={1920}
        height={1280}
        className="absolute inset-0 h-full w-full object-cover"
        loading="lazy"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/20"
      />
      <div className="relative mx-auto w-full max-w-7xl px-5 pb-16 pt-40 sm:pb-20 lg:px-8">
        {eyebrow && <p className="eyebrow text-bronze">{overline}</p>}
        <h1 className="mt-3 max-w-3xl font-display text-5xl font-medium leading-[1.08] text-ink-foreground sm:text-6xl">
          {title}
        </h1>
        {copy && (
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-foreground/85 sm:text-lg">
            {copy}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}
