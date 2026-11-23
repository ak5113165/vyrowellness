// Google Analytics (GA4) via gtag.js, plus lead events.
//
// The tag only loads on the live domain, so Lovable previews and local
// development never pollute the numbers. Page views (including in-app
// navigation) come from GA4 Enhanced measurement; the events below are the
// lead actions we care about. Mark `generate_lead` as a Key event in GA4
// (Admin → Events) to see conversions per page and per traffic source.

// GA4 Measurement ID for the "Vyro Website" stream (property: VYRO Wellness).
export const GA_MEASUREMENT_ID = "G-1SXYX17Y9L";

const LIVE_HOSTS = ["vyrowellness.in", "www.vyrowellness.in"];

/** Inline <head> script: sets up dataLayer/gtag and loads the tag on the live site only. */
export const googleTagSnippet = `(function(){
  if (${JSON.stringify(LIVE_HOSTS)}.indexOf(location.hostname) === -1) return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function(){ window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', '${GA_MEASUREMENT_ID}');
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}';
  document.head.appendChild(s);
})();`;

type Params = Record<string, string | number | boolean | (() => void) | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/** Send a GA4 event. A no-op off the live site or if the tag is blocked. */
export function trackEvent(name: string, params: Params = {}) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  try {
    window.gtag("event", name, { page_path: window.location.pathname, ...params });
  } catch {
    /* analytics must never break the site */
  }
}

/** A submitted enquiry or call-back request: the main conversion. */
export function trackLead(formType: "enquiry" | "callback", interest?: string) {
  trackEvent("generate_lead", { form_type: formType, product_interest: interest });
}

/**
 * One delegated click listener for contact actions anywhere on the site:
 * WhatsApp links, phone links, email links and PDF downloads (catalogue,
 * spec sheets). Returns a cleanup function.
 */
export function installClickTracking(): () => void {
  if (typeof document === "undefined") return () => {};
  const onClick = (e: MouseEvent) => {
    const link = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
    if (!link) return;
    const href = link.getAttribute("href") ?? "";
    if (href.startsWith("https://wa.me/") || href.includes("api.whatsapp.com")) {
      trackEvent("whatsapp_click", { link_url: href.split("?")[0] });
    } else if (href.startsWith("tel:")) {
      // Opening the dialer can freeze the page (notably on iPhone) before
      // Analytics has sent its batch, so the tap is lost. Hold the call for a
      // moment until the event is sent (or 800 ms at most), then dial.
      if (typeof window.gtag === "function" && !e.defaultPrevented && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        let dialled = false;
        const dial = () => {
          if (dialled) return;
          dialled = true;
          window.location.href = href;
        };
        trackEvent("phone_click", { event_callback: dial, event_timeout: 800 });
        window.setTimeout(dial, 900);
      } else {
        trackEvent("phone_click");
      }
    } else if (href.startsWith("mailto:")) {
      trackEvent("email_click", { email: href.slice(7).split("?")[0] });
    } else if (/\.pdf($|\?)/i.test(href)) {
      const file = (href.split("?")[0] ?? href).split("/").pop() ?? href;
      trackEvent(/catalogue/i.test(file) ? "catalogue_download" : "spec_sheet_download", { file_name: file });
    }
  };
  document.addEventListener("click", onClick, { capture: true });
  return () => document.removeEventListener("click", onClick, { capture: true });
}
