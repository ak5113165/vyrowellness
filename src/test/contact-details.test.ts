import { describe, expect, it } from "vitest";
import { site, whatsappLink } from "../content/site";

// Until the new company number is ready (24 Nov 2026), the site shows email only.
describe("VYRO contact details", () => {
  it("shows no phone number", () => {
    expect(site.phoneHref).toBe("");
    expect(site.phoneDisplay).toBe("");
  });

  it("shows no WhatsApp buttons", () => {
    expect(whatsappLink("Hello VYRO")).toBeNull();
  });

  it("keeps the sales email as the main contact", () => {
    expect(site.email).toBe("sales@vyrowellness.in");
  });
});
