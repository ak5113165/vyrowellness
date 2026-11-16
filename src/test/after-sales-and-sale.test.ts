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
    expect(full).toContain("1-year on-site warranty");
    // Removed at the founder's request — must not come back.
    expect(full).not.toMatch(/money-back|money back|token advance|price protection|price shall remain locked/i);
  });

  it("runs until the end of 31 December 2026, India time", () => {
    expect(winterSaleLive(Date.parse("2026-12-31T23:59:00+05:30"))).toBe(true);
    expect(winterSaleLive(Date.parse("2027-01-01T00:00:00+05:30"))).toBe(false);
  });
});
