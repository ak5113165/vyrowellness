// Shared SEO helpers: one place for canonical URLs, Open Graph / Twitter
// tags and JSON-LD structured data, so every page is described the same way.
//
// Share images live in public/og/ (1200×630). Child routes override the
// site-wide defaults set in __root.tsx because the router keeps the deepest
// tag for each meta name/property.

import { site } from "@/content/site";

export const SITE_URL = `https://${site.domain}`;

type MetaTag =
  | { title: string }
  | { name: string; content: string }
  | { property: string; content: string }
  | { "script:ld+json": Record<string, unknown> };

export function absoluteUrl(path: string): string {
  return path.startsWith("http") ? path : `${SITE_URL}${path}`;
}

export function pageHead({
  path,
  title,
  description,
  ogTitle,
  ogDescription,
  image = "/og/default.jpg",
  noindex = false,
  jsonLd = [],
}: {
  path: string;
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
  image?: string;
  noindex?: boolean;
  jsonLd?: Record<string, unknown>[];
}) {
  const url = absoluteUrl(path);
  const img = absoluteUrl(image);
  const shareTitle = ogTitle ?? title;
  const shareDescription = ogDescription ?? description;

  const meta: MetaTag[] = [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: shareTitle },
    { property: "og:description", content: shareDescription },
    { property: "og:url", content: url },
    { property: "og:type", content: "website" },
    { property: "og:image", content: img },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: shareTitle },
    { name: "twitter:description", content: shareDescription },
    { name: "twitter:image", content: img },
  ];
  if (noindex) meta.push({ name: "robots", content: "noindex, follow" });
  for (const data of jsonLd) meta.push({ "script:ld+json": data });

  return {
    meta,
    links: [{ rel: "canonical", href: url }],
  };
}

export function faqJsonLd(faqs: readonly { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function organizationJsonLd(logoPath: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "VYRO Wellness",
    url: SITE_URL,
    logo: absoluteUrl(logoPath),
    email: site.salesEmail,
    telephone: site.phoneHref.replace("tel:", ""),
    sameAs: site.instagramUrl ? [site.instagramUrl] : [],
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        telephone: site.phoneHref.replace("tel:", ""),
        email: site.salesEmail,
        areaServed: "IN",
      },
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: site.supportEmail,
        areaServed: "IN",
      },
    ],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "VYRO Wellness",
    url: SITE_URL,
  };
}
