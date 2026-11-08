import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { roomSizes, saunaModels } from "@/content/sauna-catalogue";
import { cn } from "@/lib/utils";

const FT_TO_M = 0.3048;

type Fit = "fits" | "maybe";

/**
 * "Which cabin fits?" — enter the width of the wall the sauna will stand
 * against and see which Haven sizes fit, using the catalogue's indicative
 * widths. Final dimensions are always confirmed in the space assessment.
 */
export function CabinFitFinder({ onChoose }: { onChoose: (code: string) => void }) {
  const [unit, setUnit] = useState<"m" | "ft">("m");
  const [value, setValue] = useState("");

  const width = Number.parseFloat(value.replace(",", "."));
  const widthM = Number.isFinite(width) && width > 0 ? (unit === "ft" ? width * FT_TO_M : width) : null;

  const results = widthM
    ? roomSizes.flatMap((size) => {
        const fit: Fit | null = widthM >= size.maxWidthM ? "fits" : widthM >= size.minWidthM ? "maybe" : null;
        return fit ? [{ size, fit, models: saunaModels.filter((m) => m.size === size.name) }] : [];
      })
    : [];

  const toggle = (u: "m" | "ft") =>
    cn(
      "px-3 py-2 text-[11px] uppercase tracking-[0.16em] transition-colors",
      unit === u ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground",
    );

  return (
    <div className="mt-12 border border-border bg-card p-6 sm:p-8">
      <p className="eyebrow text-bronze-strong">Which Cabin Fits?</p>
      <h3 className="mt-2 font-display text-3xl font-medium">Check your wall width</h3>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        Measure the wall the sauna will stand against and enter its width.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <label htmlFor="fit-width" className="sr-only">
          Wall width
        </label>
        <input
          id="fit-width"
          inputMode="decimal"
          placeholder={unit === "m" ? "e.g. 1.8" : "e.g. 6"}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="h-11 w-36 rounded-sm border border-input bg-transparent px-3.5 text-sm focus-visible:border-bronze focus-visible:outline-none"
        />
        <div role="group" aria-label="Unit" className="flex border border-border">
          <button type="button" aria-pressed={unit === "m"} onClick={() => setUnit("m")} className={toggle("m")}>
            Metres
          </button>
          <button type="button" aria-pressed={unit === "ft"} onClick={() => setUnit("ft")} className={toggle("ft")}>
            Feet
          </button>
        </div>
      </div>

      <div aria-live="polite" className="mt-6">
        {widthM === null ? null : results.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            That's narrower than our smallest indicative cabin (approx. {roomSizes[0].minWidthM}m). Ask us in the
            enquiry form — we'll look at what's possible for your space.
          </p>
        ) : (
          <ul className="grid gap-4 md:grid-cols-3">
            {results.map(({ size, fit, models }) => (
              <li key={size.name} className="flex flex-col border border-border bg-background p-5">
                <p className={cn("eyebrow", fit === "fits" ? "text-bronze-strong" : "text-muted-foreground")}>
                  {fit === "fits" ? "Fits" : "May fit — depends on model"}
                </p>
                <p className="mt-1 font-display text-2xl font-medium">{size.name}</p>
                <p className="text-xs text-muted-foreground">
                  {size.spec} · {size.people}
                </p>
                <div className="mt-4 flex flex-1 flex-col gap-2">
                  {models.map((m) => (
                    <button
                      key={m.code}
                      type="button"
                      onClick={() => onChoose(m.code)}
                      className="inline-flex items-center justify-between gap-2 border-t border-border pt-2 text-left text-sm hover:text-bronze-strong"
                    >
                      {m.name} {m.code}
                      <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
                    </button>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="mt-6 text-xs text-muted-foreground">
        Widths are indicative. Leave room for the door and ventilation — we confirm final dimensions in your space
        assessment.
      </p>
    </div>
  );
}
