import { describe, expect, it } from "vitest";
import { site, whatsappLink } from "../content/site";

describe("VYRO contact number", () => {
  it("uses the confirmed Indian number for calls", () => {
    expect(site.phoneHref).toBe("tel:+918700015649");
    expect(site.phoneDisplay.replace(/\D/g, "")).toBe("918700015649");
  });

  it("sends WhatsApp enquiries to the confirmed number", () => {
    expect(whatsappLink("Hello VYRO")).toBe(
      "https://wa.me/918700015649?text=Hello%20VYRO",
    );
  });
});