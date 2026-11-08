import { Link, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { navLinks, site } from "@/content/site";
import { cn } from "@/lib/utils";
import logoDark from "@/assets/brand/vyro-logo-dark.png.asset.json";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // Close the mobile menu whenever navigation happens.
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-50">
      {/* Announcement bar */}
      <div className="bg-ink px-4 py-2 text-center">
        {site.announcementLink ? (
          <Link
            to={site.announcementLink}
            className="text-[11px] uppercase tracking-[0.22em] text-ink-foreground/90 transition-colors hover:text-ink-foreground"
          >
            {site.announcement} <span aria-hidden>→</span>
          </Link>
        ) : (
          <p className="text-[11px] uppercase tracking-[0.22em] text-ink-foreground/90">{site.announcement}</p>
        )}
      </div>

      {/* Sticky navigation */}
      <nav
        aria-label="Primary"
        className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85"
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
          <Link
            to="/"
            className="transition-opacity hover:opacity-70"
            aria-label="VYRO Wellness — home"
          >
            <img src={logoDark.url} alt="VYRO Wellness" width={52} height={52} className="h-[52px] w-[52px]" />
          </Link>

          <div className="hidden items-center gap-7 lg:flex">
            {navLinks.map((link) => {
              const active = location.pathname.startsWith(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "text-[13px] uppercase tracking-[0.14em] transition-colors hover:text-foreground",
                    active ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              to="/contact"
              className="rounded-sm border border-foreground px-5 py-2 text-[13px] uppercase tracking-[0.14em] text-foreground transition-colors hover:bg-foreground hover:text-background"
            >
              Book a Consultation
            </Link>
          </div>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center text-foreground lg:hidden"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        <div
          className={cn(
            "overflow-hidden border-t border-border bg-background transition-[max-height] duration-300 ease-in-out lg:hidden",
            open ? "max-h-[32rem]" : "max-h-0 border-t-0",
          )}
        >
          <div className="flex flex-col px-5 pb-6 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="border-b border-border/60 py-3.5 text-sm uppercase tracking-[0.16em] text-foreground"
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/contact"
              className="mt-5 inline-flex items-center justify-center rounded-sm bg-primary px-5 py-3 text-sm uppercase tracking-[0.16em] text-primary-foreground"
            >
              Book a Consultation
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
