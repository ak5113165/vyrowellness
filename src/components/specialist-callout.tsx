import { useState, type FormEvent } from "react";
import { Check, MessageCircle, Phone } from "lucide-react";
import { phoneSchema } from "@/lib/enquiry-schema";
import { site, whatsappLink, type productInterests } from "@/content/site";

type Interest = (typeof productInterests)[number];

const inputClass =
  "h-11 w-full rounded-sm border border-ink-foreground/25 bg-transparent px-3.5 text-sm text-ink-foreground placeholder:text-ink-foreground/45 focus-visible:border-bronze focus-visible:outline-none";

/**
 * "Talk to a specialist": call, WhatsApp, or leave a name and mobile for a
 * call-back. The call-back is stored as a normal consumer enquiry (email is
 * optional), so it reaches the same place as every other lead.
 *
 * Specialist names, photos and working hours can be added here once confirmed.
 */
export function SpecialistCallout({
  interest,
  whatsappMessage,
  page,
}: {
  interest: Interest;
  whatsappMessage: string;
  /** Where the request came from, recorded in the enquiry message. */
  page: string;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const wa = whatsappLink(whatsappMessage);
  const idBase = `cb-${page.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (name.trim().length < 2) return setError("Please enter your name.");
    const parsedPhone = phoneSchema.safeParse(phone);
    if (!parsedPhone.success) return setError("Enter a valid Indian mobile number, e.g. 98765 43210");

    setStatus("sending");
    try {
      const res = await fetch("/api/public/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "consumer",
          fullName: name.trim(),
          phone,
          productInterest: interest,
          homeOrBusiness: "Home",
          message: `Call-back requested from the ${page} page.`,
        }),
      });
      const json = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
      if (res.ok && json?.ok) {
        setStatus("done");
      } else {
        setStatus("idle");
        setError(json?.error ?? "Something went wrong. Please call or WhatsApp us instead.");
      }
    } catch {
      setStatus("idle");
      setError("We couldn't send that. Please call or WhatsApp us instead.");
    }
  };

  return (
    <section className="bg-ink text-ink-foreground" data-hide-mobile-bar>
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-16 lg:px-8 lg:py-20">
        <div>
          <p className="eyebrow text-bronze">Talk to a Specialist</p>
          <h2 className="mt-3 font-display text-4xl font-medium leading-[1.15] sm:text-5xl">
            Prefer to Talk It Through?
          </h2>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-ink-muted">
            Our team helps you choose the right setup for your space. Call or WhatsApp us now, or leave your number
            and we'll call you back {site.enquiryResponseTime}.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href={site.phoneHref}
              className="inline-flex items-center gap-2 rounded-sm border border-ink-foreground/40 px-5 py-3 text-[12px] uppercase tracking-[0.16em] transition-colors hover:bg-ink-foreground hover:text-ink"
            >
              <Phone className="h-4 w-4" aria-hidden /> {site.phoneDisplay}
            </a>
            {wa && (
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-sm border border-ink-foreground/40 px-5 py-3 text-[12px] uppercase tracking-[0.16em] transition-colors hover:bg-ink-foreground hover:text-ink"
              >
                <MessageCircle className="h-4 w-4" aria-hidden /> WhatsApp
              </a>
            )}
          </div>
        </div>

        <div className="border border-ink-foreground/15 p-6 sm:p-8">
          {status === "done" ? (
            <div role="status" className="text-center">
              <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full border border-bronze text-bronze">
                <Check className="h-5 w-5" aria-hidden />
              </span>
              <p className="mt-4 font-display text-2xl font-medium">Thank you, {name.trim().split(" ")[0]}.</p>
              <p className="mt-2 text-sm text-ink-muted">We'll call you back {site.enquiryResponseTime}.</p>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="space-y-4">
              <p className="font-display text-2xl font-medium">Request a Call-Back</p>
              <div>
                <label htmlFor={`${idBase}-name`} className="sr-only">
                  Your name
                </label>
                <input
                  id={`${idBase}-name`}
                  autoComplete="name"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor={`${idBase}-phone`} className="sr-only">
                  Mobile number
                </label>
                <input
                  id={`${idBase}-phone`}
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="Mobile (WhatsApp), e.g. 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={inputClass}
                />
              </div>
              {error && (
                <p role="alert" className="text-xs text-red-300">
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={status === "sending"}
                className="inline-flex w-full items-center justify-center rounded-sm bg-ink-foreground px-6 py-3.5 text-[12px] uppercase tracking-[0.16em] text-ink transition-colors hover:bg-ink-foreground/90 disabled:opacity-60"
              >
                {status === "sending" ? "Sending…" : "Call Me Back"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
