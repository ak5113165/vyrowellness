import { useEffect, useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { MessageCircle, Phone } from "lucide-react";
import { coldPlungeLaunch, site, whatsappLink } from "@/content/site";
import { cn } from "@/lib/utils";

// WhatsApp opening line for each page, so the team knows what the visitor
// was looking at before they say a word.
const whatsappMessages: Record<string, string> = {
  "/": "Hello VYRO, I'd like to know more about your wellness products.",
  "/saunas": "Hello VYRO, I'm interested in a VYRO sauna.",
  "/cold-plunge": `Hello VYRO, I'm interested in the Glacier cold plunges launching on ${coldPlungeLaunch.label}.`,
  "/red-light-therapy": "Hello VYRO, I'd like to hear about your red light therapy range.",
  "/commercial-wellness": "Hello VYRO, I'd like to discuss a commercial wellness project.",
  "/wellness-spaces": "Hello VYRO, I'd like to plan a complete wellness space.",
};
const defaultMessage = "Hello VYRO, I'd like to book a consultation.";

/** Elements that hide the bar while on screen: enquiry forms and the sauna builder. */
const HIDE_SELECTOR = "[data-hide-mobile-bar]";

/**
 * Phones only: WhatsApp · Call · Enquire, fixed to the bottom of the screen.
 * "Enquire" scrolls to the page's own enquiry form when it has one, otherwise
 * opens /contact. The bar steps aside while a form or the builder is in view.
 */
export function MobileActionBar() {
  const { pathname } = useLocation();
  const [hidden, setHidden] = useState(false);
  const [hasForm, setHasForm] = useState(false);

  useEffect(() => {
    setHasForm(Boolean(document.querySelector("[data-enquiry-form]")));
    // Looked up on every check (not cached): forms remount when a CTA pre-fills them.
    let frame = 0;
    const check = () => {
      frame = 0;
      const limit = window.innerHeight * 0.85;
      const overlapping = Array.from(document.querySelectorAll(HIDE_SELECTOR)).some((el) => {
        const r = el.getBoundingClientRect();
        return r.top < limit && r.bottom > 0;
      });
      setHidden(overlapping);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };
    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [pathname]);

  const wa = whatsappLink(whatsappMessages[pathname] ?? defaultMessage);

  const scrollToForm = () =>
    document.querySelector("[data-enquiry-form]")?.scrollIntoView({ behavior: "smooth", block: "start" });

  const item =
    "flex flex-1 flex-col items-center justify-center gap-1 py-2.5 text-xs uppercase tracking-[0.16em]";

  return (
    <nav
      aria-label="Quick contact"
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-ink-foreground/10 bg-ink pb-[env(safe-area-inset-bottom)] text-ink-foreground transition-transform duration-300 lg:hidden",
        hidden && "translate-y-full",
      )}
    >
      <div className="flex divide-x divide-ink-foreground/10">
        {wa && (
          <a href={wa} target="_blank" rel="noopener noreferrer" className={item}>
            <MessageCircle className="h-4 w-4" aria-hidden />
            WhatsApp
          </a>
        )}
        <a href={site.phoneHref} className={item}>
          <Phone className="h-4 w-4" aria-hidden />
          Call
        </a>
        {hasForm ? (
          <button type="button" onClick={scrollToForm} className={cn(item, "bg-bronze text-ink")}>
            <span className="text-[13px] leading-none" aria-hidden>→</span>
            Enquire
          </button>
        ) : (
          <Link to="/contact" className={cn(item, "bg-bronze text-ink")}>
            <span className="text-[13px] leading-none" aria-hidden>→</span>
            Enquire
          </Link>
        )}
      </div>
    </nav>
  );
}
