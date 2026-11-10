import { useEffect, useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { whatsappLink, winterSale, winterSaleLive } from "@/content/site";
import { responsive } from "@/lib/responsive-image";
// Haven Classic S-02 and Haven Glass G-02: the product renders with their
// studio backgrounds extended sideways, so cropping never cuts the cabin.
// Phones show the original square renders; larger screens show the widened ones.
import havenClassicSquare from "@/assets/products/haven-s02.jpg";
import havenClassicWide from "@/assets/products/haven-s02-popup-wide.jpg";
import havenGlassSquare from "@/assets/products/haven-g02.jpg";
import havenGlassWide from "@/assets/products/haven-g02-popup-wide.jpg";

const popupCabins = [
  {
    name: "Haven Classic S-02",
    square: havenClassicSquare,
    wide: havenClassicWide,
    alt: "VYRO Haven Classic S-02 sauna cabin in spruce with a timber door, glass panel and VYRO plaque",
    bg: "bg-[#f9eddf]",
  },
  {
    name: "Haven Glass G-02",
    square: havenGlassSquare,
    wide: havenGlassWide,
    alt: "VYRO Haven Glass G-02 sauna cabin in spruce with a full black-framed glass front and warm bench lighting",
    bg: "bg-[#e6d7c4]",
  },
] as const;

// Sauna offer pop-up for The Winter Sale (facts in site.ts → winterSale).
// Shows on the homepage and the sauna pages only, a few seconds after the
// page loads, once per browser session. Renders nothing on the server or
// after the sale ends, so it never affects hydration or SEO content.

const SEEN_KEY = "vyro-winter-sale-seen";
const DELAY_MS = 4000;

function onSaunaPages(pathname: string): boolean {
  return pathname === "/" || pathname === "/saunas" || pathname.startsWith("/saunas/");
}

function alreadySeen(): boolean {
  try {
    return window.sessionStorage.getItem(SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

function markSeen() {
  try {
    window.sessionStorage.setItem(SEEN_KEY, "1");
  } catch {
    // Storage blocked (private mode etc.): the pop-up may show again, which is fine.
  }
}

export function WinterSalePopup() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!onSaunaPages(pathname) || !winterSaleLive() || alreadySeen()) return;
    const timer = window.setTimeout(() => {
      // Don't interrupt someone who is typing into a form.
      const active = document.activeElement;
      if (active && ["INPUT", "TEXTAREA", "SELECT"].includes(active.tagName)) return;
      markSeen();
      setOpen(true);
    }, DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  const wa = whatsappLink(
    `Hello VYRO, I'd like to know more about ${winterSale.name} offer (${winterSale.discountPercent}% off MRP on saunas).`,
  );
  const onSaunasPage = pathname === "/saunas";

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-ink/60 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 grid max-h-[92svh] w-[calc(100%-2rem)] max-w-3xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto border border-bronze/50 bg-ink text-ink-foreground shadow-2xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:grid-cols-[1fr_1.1fr]">
          <DialogPrimitive.Close
            className="absolute right-3 top-3 z-10 rounded-full bg-ink/70 p-1.5 text-ink-foreground/80 transition-colors hover:text-ink-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-bronze"
            aria-label="Close offer"
          >
            <X className="h-5 w-5" aria-hidden />
          </DialogPrimitive.Close>

          {/* The two cabins: side by side on phones, stacked beside the offer on larger screens */}
          <div className="grid grid-cols-2 gap-px bg-ink sm:grid-cols-1 sm:grid-rows-2">
            {popupCabins.map((c) => (
              <figure key={c.name} className={`relative ${c.bg}`}>
                <img
                  src={c.square}
                  {...responsive(c.square, "50vw")}
                  alt={c.alt}
                  width={1024}
                  height={1024}
                  className="aspect-square w-full object-cover sm:hidden"
                />
                <img
                  src={c.wide}
                  {...responsive(c.wide, "400px")}
                  alt={c.alt}
                  width={1760}
                  height={1024}
                  loading="lazy"
                  className="hidden h-full w-full object-cover sm:absolute sm:inset-0 sm:block"
                />
                <figcaption className="absolute left-3 top-3 hidden bg-ink/80 px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-ink-foreground sm:block">
                  {c.name}
                </figcaption>
              </figure>
            ))}
          </div>

          <div className="p-7 sm:p-9">
            <p className="eyebrow text-bronze">Haven Saunas · Limited Period</p>
            <DialogPrimitive.Title className="mt-4 font-display text-4xl font-medium leading-tight">
              {winterSale.name} Is Live
            </DialogPrimitive.Title>
            <p className="mt-5 font-display text-5xl font-medium leading-none text-bronze sm:text-7xl">
              {winterSale.discountPercent}% Off
            </p>
            <DialogPrimitive.Description className="mt-4 text-sm leading-relaxed text-ink-foreground/85">
              Save {winterSale.discountPercent}% on MRP across {winterSale.appliesTo}. Offer ends{" "}
              {winterSale.endsLabel}.
            </DialogPrimitive.Description>

            <div className="mt-6 flex flex-col gap-3 sm:mt-8">
              {onSaunasPage ? (
                <a
                  href="#builder"
                  onClick={() => setOpen(false)}
                  className="inline-flex flex-1 items-center justify-center rounded-sm bg-ink-foreground px-6 py-3.5 text-[12px] uppercase tracking-[0.16em] text-ink transition-colors hover:bg-ink-foreground/90"
                >
                  Build Your Sauna
                </a>
              ) : (
                <Link
                  to="/saunas"
                  onClick={() => setOpen(false)}
                  className="inline-flex flex-1 items-center justify-center rounded-sm bg-ink-foreground px-6 py-3.5 text-[12px] uppercase tracking-[0.16em] text-ink transition-colors hover:bg-ink-foreground/90"
                >
                  Explore Saunas
                </Link>
              )}
              {wa && (
                <a
                  href={wa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex flex-1 items-center justify-center rounded-sm border border-ink-foreground/50 px-6 py-3.5 text-[12px] uppercase tracking-[0.16em] text-ink-foreground transition-colors hover:bg-ink-foreground hover:text-ink"
                >
                  Ask on WhatsApp
                </a>
              )}
            </div>
            <p className="mt-6 text-xs text-ink-muted">
              Valid till {winterSale.endsLabel}. Terms apply — our team will confirm the offer on your quote.
            </p>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
