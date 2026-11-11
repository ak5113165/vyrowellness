import { Link } from "@tanstack/react-router";
import { Instagram } from "lucide-react";
import { navLinks, site, whatsappLink } from "@/content/site";
import { MobileActionBar } from "@/components/mobile-action-bar";
import { WinterSalePopup } from "@/components/winter-sale-popup";
import { DownloadLink } from "@/components/download-link";
import logoLight from "@/assets/brand/vyro-logo-light.png.asset.json";

export function SiteFooter() {
  const wa = whatsappLink("Hello VYRO, I'd like to know more about your wellness solutions.");
  const year = new Date().getFullYear();

  return (
    // Bottom padding on phones keeps the footer clear of the fixed MobileActionBar.
    <footer className="bg-ink pb-16 text-ink-foreground lg:pb-0">
      <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <img src={logoLight.url} alt="VYRO Wellness" width={88} height={88} className="h-[88px] w-[88px]" />
            <p className="mt-4 font-display text-2xl italic text-ink-muted">{site.tagline}</p>
            <p className="mt-3 text-sm text-ink-muted">{site.secondaryLine}</p>
          </div>

          {/* Collections */}
          <nav aria-label="Collections">
            <h3 className="eyebrow text-bronze">Collections</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {navLinks
                .filter((l) => l.to !== "/philosophy")
                .map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="text-ink-foreground/80 transition-colors hover:text-ink-foreground">
                      {l.label}
                    </Link>
                  </li>
                ))}
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
                <Link to="/guides" className="text-ink-foreground/80 transition-colors hover:text-ink-foreground">
                  Buying Guides
                </Link>
              </li>
              <li>
                <Link to="/locations" className="text-ink-foreground/80 transition-colors hover:text-ink-foreground">
                  Where We Install
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
                <span className="text-ink-muted">General: </span>
                <a href={`mailto:${site.infoEmail}`} className="transition-colors hover:text-ink-foreground">
                  {site.infoEmail}
                </a>
              </li>
              <li>
                <span className="text-ink-muted">Sales: </span>
                <a href={`mailto:${site.salesEmail}`} className="transition-colors hover:text-ink-foreground">
                  {site.salesEmail}
                </a>
              </li>
              <li>
                <span className="text-ink-muted">Support: </span>
                <a href={`mailto:${site.supportEmail}`} className="transition-colors hover:text-ink-foreground">
                  {site.supportEmail}
                </a>
              </li>
              <li>
                <span className="text-ink-muted">Phone: </span>
                <a href={site.phoneHref} className="transition-colors hover:text-ink-foreground">
                  {site.phoneDisplay}
                </a>
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
              <li className="pt-2">
                <DownloadLink sheet="catalogue" className="text-[11px] text-ink-foreground/80 hover:text-ink-foreground" />
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-3 border-t border-ink-border pt-7 text-xs text-ink-muted sm:flex-row sm:items-center">
          <p>© {year} VYRO Wellness. All rights reserved.</p>
          <p className="uppercase tracking-[0.18em]">Heat. Cold. Light. Recovery.</p>
        </div>
      </div>
      <MobileActionBar />
      <WinterSalePopup />
    </footer>
  );
}
