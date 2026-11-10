import { describe, expect, it } from "vitest";
import {
  businessTypeValues,
  businessEnquirySchema,
  consumerEnquirySchema,
  homeStageValues,
  spaceStageValues,
} from "@/lib/enquiry-schema";

// Confirmed by the founder (10 Nov 2026): the enquiry form must ask what stage
// the home is at, and what kind of facility a business enquiry is for.

const consumer = {
  kind: "consumer" as const,
  fullName: "Asha Rao",
  phone: "98765 43210",
  productInterest: "Sauna" as const,
  homeOrBusiness: "Home" as const,
};

const business = {
  kind: "business" as const,
  businessName: "Studio North",
  contactPerson: "Asha Rao",
  phone: "98765 43210",
  email: "asha@studionorth.in",
  businessType: "Gym / Fitness Centre" as const,
  productsOfInterest: "Sauna" as const,
};

describe("Home stage question", () => {
  it("offers existing home, under construction and under renovation", () => {
    expect(homeStageValues).toContain("Existing Home");
    expect(homeStageValues).toContain("Under Construction");
    expect(homeStageValues).toContain("Under Renovation");
  });

  it("stores the chosen home stage", () => {
    const parsed = consumerEnquirySchema.safeParse({ ...consumer, homeStage: "Under Construction" });
    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data.homeStage).toBe("Under Construction");
  });

  it("treats a blank home stage as not given", () => {
    const parsed = consumerEnquirySchema.safeParse({ ...consumer, homeStage: "   " });
    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data.homeStage).toBeUndefined();
  });

  it("rejects a home stage that is not on the list", () => {
    expect(consumerEnquirySchema.safeParse({ ...consumer, homeStage: "Brand New Villa" }).success).toBe(false);
  });
});

describe("Business facility question", () => {
  it("offers gym, spa and wellness centre", () => {
    expect(businessTypeValues).toContain("Gym / Fitness Centre");
    expect(businessTypeValues).toContain("Spa / Wellness Centre");
  });

  it("stores the facility type on a consumer lead", () => {
    const parsed = consumerEnquirySchema.safeParse({
      ...consumer,
      homeOrBusiness: "Business",
      facilityType: "Gym / Fitness Centre",
    });
    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data.facilityType).toBe("Gym / Fitness Centre");
  });

  it("stores the space stage on a business lead", () => {
    const parsed = businessEnquirySchema.safeParse({ ...business, projectStage: "Under Renovation" });
    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data.projectStage).toBe("Under Renovation");
  });

  it("rejects a space stage that is not on the list", () => {
    expect(businessEnquirySchema.safeParse({ ...business, projectStage: "New Building" }).success).toBe(false);
  });

  it("still accepts a business lead with no space stage", () => {
    const parsed = businessEnquirySchema.safeParse(business);
    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data.projectStage).toBeUndefined();
  });
});

describe("Space stage wording for businesses", () => {
  it("uses space wording, not home wording", () => {
    expect(spaceStageValues).toContain("Existing Space");
    expect(spaceStageValues).toContain("Under Construction");
    expect(spaceStageValues).toContain("Under Renovation");
    expect(spaceStageValues).not.toContain("Existing Home");
  });
});
