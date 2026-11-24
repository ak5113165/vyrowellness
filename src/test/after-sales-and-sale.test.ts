import { describe, expect, it } from "vitest";
import { afterSales, winterSale, winterSaleFullTerms, winterSaleLive } from "@/content/site";
import { beforeYouBuyFaqs, saunaWarrantyFaq } from "@/content/buyer-faqs";

// Founder-confirmed 11 Nov 2026. Change these only with the founder's approval.
describe("after-sales commitments", () => {
  it("heater: 10 years = 1-year comprehensive warranty + 9 years support, parts and labour charged", () => {
    expect(afterSales.heaterServiceYears).toBe(10);
    expect(afterSales.heaterComprehensiveWarrantyYears + afterSales.heaterSupportYears).toBe(afterSales.heaterServiceYears);
    expect(afterSales.heaterSupportCharges).toBe("parts and labour charged");
  });

  it("woodwork: 6-month workmanship warranty, subject to conditions; AMC on every product", () => {
    expect(afterSales.woodworkWorkmanshipMonths).toBe(6);
    expect(saunaWarrantyFaq.a).toContain("subject to warranty conditions");
    expect(saunaWarrantyFaq.a).toContain("AMC");
    expect(beforeYouBuyFaqs).toContain(saunaWarrantyFaq);
  });
});

describe("The Winter Sale", () => {
  it("is 40% off MRP on saunas, heaters and accessories", () => {
    expect(winterSale.discountPercent).toBe(40);
    expect(winterSale.appliesTo).toContain("heaters and accessories");
  });

  it("lists the confirmed terms (16 Nov 2026)", () => {
    const t = winterSale.terms.join(" ");
    expect(t).toContain("Flat 40% off the MRP of your Haven sauna");
    expect(t).toContain("Saunas only");
    expect(t).toMatch(/Installation and commissioning are not discounted/);
    expect(t).toMatch(/lifting and related charges are extra/);
    expect(t).toMatch(/50% advance.*40% before dispatch.*10% after installation/);
    expect(winterSale.termsHref).toBe("/winter-sale");
    const full = JSON.stringify(winterSaleFullTerms);
    expect(full).toContain("27 days");
    expect(full).toContain("confirmed when the 50% advance is received");
    expect(full).toContain("within 6 months of order confirmation");
    expect(full).toContain("non-refundable under any circumstances");
    expect(full).toContain("from the date of final handover");
    expect(full).toContain("7–10 working days");
    expect(full).toContain("cannot be combined with any other offer");
    expect(full).toContain("charged as per your quote");
    expect(full).toContain("1-year comprehensive warranty on the sauna heater");
    expect(full).toContain("6-month warranty against workmanship defects on the sauna woodwork");
    expect(full).not.toContain("1-year on-site warranty");
    // Removed at the founder's request — must not come back.
    expect(full).not.toMatch(/money-back|money back|token advance|price protection|price shall remain locked/i);
  });

  it("runs until the end of 31 December 2026, India time", () => {
    expect(winterSaleLive(Date.parse("2026-12-31T23:59:00+05:30"))).toBe(true);
    expect(winterSaleLive(Date.parse("2027-01-01T00:00:00+05:30"))).toBe(false);
  });
});

describe("Terms page and enquiry form (24 Nov 2026)", () => {
  it("has real terms, not the placeholder, and is indexable", async () => {
    const fs = await import("node:fs");
    const terms = fs.readFileSync("src/routes/terms.tsx", "utf8");
    expect(terms).not.toContain("Placeholder content");
    expect(terms).not.toContain("noindex: true");
    expect(terms).toContain("The 50% advance is non-refundable under any circumstances.");
  });

  it("does not ask for a budget and states the starting price instead", async () => {
    const fs = await import("node:fs");
    const form = fs.readFileSync("src/components/enquiry-form.tsx", "utf8");
    expect(form).not.toContain("c-budget");
    expect(form).toContain("VYRO saunas start from");
    const { saunaFromPriceInr } = await import("@/content/sauna-planning");
    expect((saunaFromPriceInr / 100000).toFixed(1)).toBe("1.5");
  });

  it("privacy policy mentions no WhatsApp or budget", async () => {
    const fs = await import("node:fs");
    const privacy = fs.readFileSync("src/routes/privacy.tsx", "utf8");
    expect(privacy).not.toMatch(/whatsapp/i);
    expect(privacy).not.toMatch(/budget/i);
  });
});
