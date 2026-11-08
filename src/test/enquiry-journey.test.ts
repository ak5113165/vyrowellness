import { describe, expect, it } from "vitest";
import { site, whatsappLink } from "@/content/site";

describe("Enquiry journey facts", () => {
  it("promises the confirmed reply time", () => {
    expect(site.enquiryResponseTime).toBe("within 24 hours");
  });
  it("builds WhatsApp links with the message encoded", () => {
    const link = whatsappLink("Hello VYRO, I'm interested in a VYRO sauna.");
    expect(link).toBe(
      `https://wa.me/${site.whatsappNumber}?text=Hello%20VYRO%2C%20I'm%20interested%20in%20a%20VYRO%20sauna.`,
    );
  });
});
