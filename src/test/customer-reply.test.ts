import { afterEach, describe, expect, it } from "vitest";
import { buildCustomerReply, catalogueUrl, sendCustomerReply } from "@/lib/customer-reply";
import { site } from "@/content/site";

const base = { id: "abc", kind: "consumer" as const, name: "Priya Sharma", phone: "9876543210" };

describe("customer auto-reply", () => {
  it("thanks the customer by first name, promises the reply time and links the catalogue", () => {
    const r = buildCustomerReply({ ...base, email: "priya@example.com", productInterest: "Sauna" });
    expect(r.subject).toContain("Thank you for your enquiry");
    expect(r.text).toContain("Hi Priya,");
    expect(r.text).toContain("about a sauna");
    expect(r.text).toContain(site.enquiryResponseTime);
    expect(r.html).toContain(catalogueUrl);
    expect(r.text).toContain(site.phoneDisplay);
  });

  it("words call-back requests as a call", () => {
    const r = buildCustomerReply({ ...base, email: "p@example.com", message: "Call-back requested from the Saunas page." });
    expect(r.subject).toContain("call-back");
    expect(r.text).toContain("will call you");
  });

  it("escapes names in the HTML", () => {
    const r = buildCustomerReply({ ...base, name: "<b>Ravi</b>", email: "r@example.com" });
    expect(r.html).not.toContain("<b>Ravi");
  });

  describe("sending", () => {
    const realFetch = globalThis.fetch;
    let calls: { url: string; body: Record<string, unknown> }[] = [];
    const fakeFetch = (fail = false) =>
      (async (url: string, init: { body: string }) => {
        if (fail) throw new Error("network");
        calls.push({ url, body: JSON.parse(init.body) });
        return new Response("{}", { status: 200 });
      }) as unknown as typeof fetch;

    afterEach(() => {
      globalThis.fetch = realFetch;
      calls = [];
      delete process.env["RESEND_API_KEY"];
    });

    it("sends nothing when the customer left no email", async () => {
      process.env["RESEND_API_KEY"] = "re_test";
      globalThis.fetch = fakeFetch();
      await sendCustomerReply({ ...base });
      expect(calls).toHaveLength(0);
    });

    it("sends to the customer with replies going to sales", async () => {
      process.env["RESEND_API_KEY"] = "re_test";
      globalThis.fetch = fakeFetch();
      await sendCustomerReply({ ...base, email: "priya@example.com" });
      expect(calls[0]!.body["to"]).toEqual(["priya@example.com"]);
      expect(calls[0]!.body["reply_to"]).toBe(site.salesEmail);
    });

    it("never throws when sending fails", async () => {
      process.env["RESEND_API_KEY"] = "re_test";
      globalThis.fetch = fakeFetch(true);
      const realError = console.error;
      console.error = () => {};
      await expect(sendCustomerReply({ ...base, email: "p@example.com" })).resolves.toBeUndefined();
      console.error = realError;
    });
  });
});
