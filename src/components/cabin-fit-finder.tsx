import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { fitsFloor, modelSize, saunaModels } from "@/content/sauna-catalogue";
import { cn } from "@/lib/utils";

const M_TO_FT = 3.28084;

/**
 * "Which cabin fits?" — enter the room's width and length and see which Haven
 * cabins fit the floor, using each cabin's confirmed standard size. Door
 * swing, clearances, power and ventilation are confirmed in the space
 * assessment.
 */
export function CabinFitFinder({ onChoose }: { onChoose: (code: string) => void }) {
  // Feet first: most buyers in India measure rooms in feet.
  const [unit, setUnit] = useState<"m" | "ft">("ft");
  const [widthIn, setWidthIn] = useState("");
  const [lengthIn, setLengthIn] = useState("");

  const toFt = (v: string) => {
    const n = Number.parseFloat(v.replace(",", "."));
    return Number.isFinite(n) && n > 0 ? (unit === "m" ? n * M_TO_FT : n) : null;
  };
  const w = toFt(widthIn);
  const l = toFt(lengthIn);
  const ready = w !== null && l !== null;
  const fits = ready ? saunaModels.filter((m) => fitsFloor(m, w, l)) : [];

  const toggle = (u: "m" | "ft") =>
    cn(
      "px-3 py-2 text-xs uppercase tracking-[0.16em] transition-colors",
      unit === u ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground",
    );
  const input =
    "h-11 w-32 rounded-sm border border-input bg-transparent px-3.5 text-sm focus-visible:border-bronze focus-visible:outline-none";

  return (
    <div className="mt-12 border border-border bg-card p-6 sm:p-8">
      <p className="eyebrow text-bronze-strong">Which Cabin Fits?</p>
      <h3 className="mt-2 font-display text-3xl font-medium">Check your room</h3>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        Enter the width and length of the floor space where the sauna will go.
      </p>

      <div className="mt-6 flex flex-wrap items-end gap-3">
        <div>
          <label htmlFor="fit-width" className="eyebrow block text-muted-foreground">
            Width
          </label>
          <input id="fit-width" inputMode="decimal" placeholder={unit === "m" ? "e.g. 2" : "e.g. 6"} value={widthIn} onChange={(e) => setWidthIn(e.target.value)} className={cn("mt-1.5", input)} />
        </div>
        <span className="pb-3 text-muted-foreground" aria-hidden>
          ×
        </span>
        <div>
          <label htmlFor="fit-length" className="eyebrow block text-muted-foreground">
            Length
          </label>
          <input id="fit-length" inputMode="decimal" placeholder={unit === "m" ? "e.g. 1.6" : "e.g. 5"} value={lengthIn} onChange={(e) => setLengthIn(e.target.value)} className={cn("mt-1.5", input)} />
        </div>
        <div role="group" aria-label="Unit" className="flex border border-border">
          <button type="button" aria-pressed={unit === "ft"} onClick={() => setUnit("ft")} className={toggle("ft")}>
            Feet
          </button>
          <button type="button" aria-pressed={unit === "m"} onClick={() => setUnit("m")} className={toggle("m")}>
            Metres
          </button>
        </div>
      </div>

      <div aria-live="polite" className="mt-6">
        {!ready ? null : fits.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            That's smaller than our most compact cabin ({modelSize(saunaModels.find((m) => m.code === "C-01") ?? saunaModels[0]!).dims}).
            Ask us in the enquiry form — we'll look at what's possible for your space.
          </p>
        ) : (
          <>
            <p className="text-sm">
              {fits.length} {fits.length === 1 ? "cabin fits" : "cabins fit"} that floor space:
            </p>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {fits.map((m) => (
                <li key={m.code}>
                  <button
                    type="button"
                    onClick={() => onChoose(m.code)}
                    className="flex h-full w-full items-start justify-between gap-2 border border-border bg-background p-4 text-left transition-colors hover:border-foreground/50"
                  >
                    <span>
                      <span className="block font-display text-xl font-medium">
                        {m.name} {m.code}
                      </span>
                      <span className="mt-1 block text-xs text-muted-foreground">
                        {modelSize(m).dims} · {modelSize(m).people}
                      </span>
                    </span>
                    <ArrowRight className="mt-1 h-4 w-4 shrink-0" aria-hidden />
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      <p className="mt-6 text-xs text-muted-foreground">
        Every cabin is 7 ft tall, so check your ceiling height too. Leave room for the door, power and ventilation — we
        confirm everything in your space assessment.
      </p>
    </div>
  );
}
