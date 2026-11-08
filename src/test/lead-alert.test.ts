import { afterEach, describe, expect, it } from "vitest";
import { buildLeadAlert, internationalIndianNumber, sendLeadAlert, type Lead } from "@/lib/lead-alert";

const lead: Lead = {
  id: "abc-123",
  kind: "consumer",
  name: "Asha <Rao>",
  phone: "9876543210",
  city: "Mumbai",
  productInterest: "Cold Plunge",
  homeOrBusiness: "Home",
  message: "I'd like to register for the Glacier Barrel launch on 1 January 2027.",
};

describe("Lead alert email", () => {
  it("leads with the product and name", () => {
    expect(buildLeadAlert(lead).subject).toBe("New enquiry: Asha <Rao> — Cold Plunge");
  });
  it("marks call-back requests", () => {
    const a = buildLeadAlert({ ...lead, message: "Call-back requested from the home page." });
    expect(a.subject.startsWith("Call-back request:")).toBe(true);
  });
  it("names the business for business enquiries", () => {
    const a = buildLeadAlert({ ...lead, kind: "business", businessName: "Studio North", businessType: "Fitness Studio" });
    expect(a.subject).toBe("Business enquiry: Asha <Rao>, Studio North — Fitness Studio");
  });
  it("gives one-tap call and WhatsApp links to the customer", () => {
    const { text, html } = buildLeadAlert(lead);
    expect(text).toContain("https://wa.me/919876543210");
    expect(html).toContain('href="tel:+919876543210"');
    expect(text).toContain("within 24 hours");
  });
  it("escapes customer input in the HTML", () => {
    expect(buildLeadAlert(lead).html).toContain("Asha &lt;Rao&gt;");
    expect(buildLeadAlert(lead).html).not.toContain("<Rao>");
  });
  it("normalises Indian numbers", () => {
    expect(internationalIndianNumber("+919876543210")).toBe("919876543210");
    expect(internationalIndianNumber("98765 43210")).toBe("919876543210");
  });
});

describe("Sending", () => {
  const realFetch = globalThis.fetch;
  afterEach(() => {
    globalThis.fetch = realFetch;
    delete process.env["RESEND_API_KEY"];
    delete process.env["LEAD_ALERT_EMAIL"];
  });

  it("does nothing (and does not throw) without an API key", async () => {
    let called = false;
    globalThis.fetch = (async () => {
      called = true;
      return new Response("{}");
    }) as typeof fetch;
    await sendLeadAlert(lead);
    expect(called).toBe(false);
  });

  it("emails sales@vyrowellness.in by default", async () => {
    process.env["RESEND_API_KEY"] = "test-key";
    let body: { to?: string[]; subject?: string } = {};
    globalThis.fetch = (async (_url: unknown, init?: RequestInit) => {
      body = JSON.parse(String(init?.body));
      return new Response("{}", { status: 200 });
    }) as typeof fetch;
    await sendLeadAlert(lead);
    expect(body.to).toEqual(["sales@vyrowellness.in"]);
    expect(body.subject).toContain("Cold Plunge");
  });

  it("never throws when sending fails", async () => {
    process.env["RESEND_API_KEY"] = "test-key";
    globalThis.fetch = (async () => {
      throw new Error("network down");
    }) as typeof fetch;
    await expect(sendLeadAlert(lead)).resolves.toBeUndefined();
  });
});
