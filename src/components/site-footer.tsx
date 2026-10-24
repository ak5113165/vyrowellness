import { Link } from "@tanstack/react-router";
import { Instagram } from "lucide-react";
import { navLinks, site, whatsappLink } from "@/content/site";

export function SiteFooter() {
  const wa = whatsappLink("Hello VYRO, I'd like to know more about your wellness solutions.");
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink text-ink-foreground">
      <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <p className="wordmark text-lg text-ink-foreground">VYRO</p>
            <p className="mt-4 font-display text-2xl italic text-ink-muted">{site.tagline}</p>
            <p className="mt-3 text-sm text-ink-muted">{site.secondaryLine}</p>
          </div>

          {/* Collections */}
          <nav aria-label="Collections">
            <h3 className="eyebrow text-bronze">Collections</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {navLinks
                .filter((l) => l.to !== "/" && l.to !== "/philosophy")
                .map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="text-ink-foreground/80 transition-colors hover:text-ink-foreground">
                      {l.label}
                    </Link>
                  </li>
                ))}
              <li>
                <Link to="/" className="text-ink-foreground/80 transition-colors hover:text-ink-foreground">
                  Complete Home Wellness
                </Link>
              </li>
            </ul>
          </nav>

          {/* Company */}
          <nav aria-label="Company">
            <h3 className="eyebrow text-bronze">Company</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link to="/philosophy" className="text-ink-foreground/80 transition-colors hover:text-ink-foreground">
                  Our Philosophy
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-ink-foreground/80 transition-colors hover:text-ink-foreground">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-ink-foreground/80 transition-colors hover:text-ink-foreground">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-ink-foreground/80 transition-colors hover:text-ink-foreground">
                  Terms &amp; Conditions
                </Link>
              </li>
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h3 className="eyebrow text-bronze">Contact</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-ink-foreground/80">
              <li>
                <a href={`mailto:${site.email}`} className="transition-colors hover:text-ink-foreground">
                  {site.email}
                </a>
              </li>
              {/* PLACEHOLDER — replace phoneDisplay in src/content/site.ts */}
              <li>
                <span aria-label="Phone number — placeholder, to be configured">{site.phoneDisplay}</span>
              </li>
              {wa && (
                <li>
                  <a
                    href={wa}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-ink-foreground"
                  >
                    WhatsApp
                  </a>
                </li>
              )}
              {site.instagramUrl ? (
                <li>
                  <a
                    href={site.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 transition-colors hover:text-ink-foreground"
                  >
                    <Instagram className="h-4 w-4" aria-hidden /> Instagram
                  </a>
                </li>
              ) : (
                <li className="inline-flex items-center gap-2 text-ink-foreground/50">
                  <Instagram className="h-4 w-4" aria-hidden /> Instagram — coming soon
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-3 border-t border-ink-border pt-7 text-xs text-ink-muted sm:flex-row sm:items-center">
          <p>© {year} VYRO. All rights reserved.</p>
          <p className="uppercase tracking-[0.18em]">Heat. Cold. Light. Recovery.</p>
        </div>
      </div>
    </footer>
  );
}
