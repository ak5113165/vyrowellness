// Shared enquiry validation schemas — imported by the enquiry form (client)
// and by the /api/public/enquiries server route (server-side re-validation).
import { z } from "zod";

const normalisePhone = (v: string) => v.replace(/[\s\-()]/g, "");

// Indian mobile formats: 10 digits starting 6-9, optional +91 prefix.
export const phoneSchema = z
  .string()
  .trim()
  .transform(normalisePhone)
  .pipe(
    z
      .string()
      .regex(/^(\+91)?[6-9]\d{9}$/, "Enter a valid Indian mobile number, e.g. 98765 43210"),
  );

const emptyToUndefined = (v: string) => {
  const t = v.trim();
  return t.length ? t : undefined;
};

const optionalText = (max: number) =>
  z.preprocess(
    (v) => (typeof v === "string" ? emptyToUndefined(v) : v),
    z.string().max(max).optional(),
  );

// Consumer email is optional: many buyers prefer to share only a WhatsApp
// number. A blank email is stored as an empty string by the API, because the
// enquiries.email column is NOT NULL — no database change is needed.
const optionalEmail = z.preprocess(
  (v) => (typeof v === "string" ? emptyToUndefined(v) : v),
  z.string().toLowerCase().email("Enter a valid email address").max(255).optional(),
);

export const productInterestValues = [
  "Sauna",
  "Cold Plunge",
  "Red Light Therapy",
  "Complete Home Wellness",
  "Commercial Wellness",
  "Other",
] as const;

export const businessTypeValues = [
  "Gym / Fitness Centre",
  "Hotel / Hospitality",
  "Spa / Wellness Centre",
  "Fitness Studio",
  "Residential Developer",
  "Architect / Interior Designer",
  "Corporate Wellness",
  "Other",
] as const;

export const consumerEnquirySchema = z.object({
  kind: z.literal("consumer"),
  fullName: z.string().trim().min(2, "Please enter your full name").max(100),
  phone: phoneSchema,
  email: optionalEmail,
  city: optionalText(80),
  productInterest: z.enum(productInterestValues),
  homeOrBusiness: z.enum(["Home", "Business"]),
  budget: optionalText(80),
  message: optionalText(2000),
});

export const businessEnquirySchema = z.object({
  kind: z.literal("business"),
  businessName: z.string().trim().min(2, "Please enter your business name").max(120),
  contactPerson: z.string().trim().min(2, "Please enter a contact name").max(100),
  phone: phoneSchema,
  email: z.string().trim().toLowerCase().email("Enter a valid email address").max(255),
  city: optionalText(80),
  businessType: z.enum(businessTypeValues),
  productsOfInterest: z.enum(productInterestValues),
  projectDescription: optionalText(2000),
});

export const enquirySchema = z.discriminatedUnion("kind", [
  consumerEnquirySchema,
  businessEnquirySchema,
]);

export type ConsumerEnquiry = z.infer<typeof consumerEnquirySchema>;
export type BusinessEnquiry = z.infer<typeof businessEnquirySchema>;
