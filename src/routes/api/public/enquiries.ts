// Public enquiry intake. Validates server-side and stores the lead in the
// `enquiries` table using server-side credentials. The table has RLS enabled
// with no policies, so it is never readable or writable through the client
// API — this handler is the only write path.
import { createFileRoute } from "@tanstack/react-router";
import { enquirySchema } from "@/lib/enquiry-schema";

export const Route = createFileRoute("/api/public/enquiries")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
        }

        const parsed = enquirySchema.safeParse(body);
        if (!parsed.success) {
          return Response.json(
            {
              ok: false,
              error: "Please check the highlighted fields.",
              issues: parsed.error.flatten().fieldErrors,
            },
            { status: 422 },
          );
        }

        const d = parsed.data;
        const isConsumer = d.kind === "consumer";

        // Privileged insert only — loaded inside the handler, never at module scope.
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data, error } = await supabaseAdmin
          .from("enquiries")
          .insert({
            kind: d.kind,
            full_name: isConsumer ? d.fullName : d.contactPerson,
            phone: d.phone,
            // Consumer email is optional; the column is NOT NULL, so blank = "".
            email: d.email ?? "",
            city: d.city ?? null,
            product_interest: isConsumer ? d.productInterest : null,
            home_or_business: isConsumer ? d.homeOrBusiness : null,
            budget: isConsumer ? (d.budget ?? null) : null,
            message: isConsumer ? (d.message ?? null) : null,
            business_name: isConsumer ? null : d.businessName,
            business_type: isConsumer ? null : d.businessType,
            products_of_interest: isConsumer ? null : d.productsOfInterest,
            project_description: isConsumer ? null : (d.projectDescription ?? null),
          })
          .select("id")
          .single();

        if (error) {
          console.error("Enquiry insert failed:", error.message);
          return Response.json(
            {
              ok: false,
              error: "We couldn't record your enquiry right now. Please try again shortly.",
            },
            { status: 500 },
          );
        }

        // Never return PII — only the record id for confirmation.
        return Response.json({ ok: true, id: data.id }, { status: 201 });
      },
    },
  },
});
