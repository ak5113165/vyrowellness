import { describe, expect, it } from "vitest";
import { businessEnquirySchema, consumerEnquirySchema } from "@/lib/enquiry-schema";

const consumer = {
  kind: "consumer" as const,
  fullName: "Asha Rao",
  phone: "98765 43210",
  productInterest: "Sauna" as const,
  homeOrBusiness: "Home" as const,
};

describe("Consumer enquiry email", () => {
  it("is optional", () => {
    const parsed = consumerEnquirySchema.safeParse(consumer);
    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data.email).toBeUndefined();
  });
  it("treats a blank email as not given", () => {
    const parsed = consumerEnquirySchema.safeParse({ ...consumer, email: "   " });
    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data.email).toBeUndefined();
  });
  it("still validates an email when one is given", () => {
    expect(consumerEnquirySchema.safeParse({ ...consumer, email: "not-an-email" }).success).toBe(false);
    const parsed = consumerEnquirySchema.safeParse({ ...consumer, email: "Asha@Example.com" });
    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data.email).toBe("asha@example.com");
  });
});

describe("Business enquiry email", () => {
  it("is still required", () => {
    const parsed = businessEnquirySchema.safeParse({
      kind: "business",
      businessName: "Studio North",
      contactPerson: "Asha Rao",
      phone: "98765 43210",
      businessType: "Fitness Studio",
      productsOfInterest: "Sauna",
    });
    expect(parsed.success).toBe(false);
  });
});
