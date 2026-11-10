import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";
import {
  businessEnquirySchema,
  consumerEnquirySchema,
  homeStageValues,
  spaceStageValues,
} from "@/lib/enquiry-schema";
import { budgetOptions, businessTypes, productInterests, site, whatsappLink } from "@/content/site";
import { cn } from "@/lib/utils";

const inputClass =
  "h-11 w-full rounded-sm border border-input bg-transparent px-3.5 text-sm text-foreground placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:border-bronze";
const selectClass = cn(inputClass, "appearance-none bg-[var(--card)] pr-8");
const errorClass = "mt-1.5 text-xs text-destructive";

function Label({ children, htmlFor }: { children: string; htmlFor: string }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-xs uppercase tracking-[0.14em] text-muted-foreground">
      {children}
    </label>
  );
}

function FieldError({ message }: { message?: string | undefined }) {
  if (!message) return null;
  return (
    <p role="alert" className={errorClass}>
      {message}
    </p>
  );
}

type Status = "idle" | "submitting" | "success" | "error";

function firstProductInterest(value: string | undefined): (typeof productInterests)[number] {
  return productInterests.find((p) => p === value) ?? "Sauna";
}

function firstBusinessType(value: string | undefined): (typeof businessTypes)[number] {
  return businessTypes.find((t) => t === value) ?? "Gym / Fitness Centre";
}

export function EnquiryForm({
  variant,
  defaultProductInterest,
  defaultBusinessType,
  defaultMessage,
  className,
}: {
  variant: "consumer" | "business";
  defaultProductInterest?: string | undefined;
  defaultBusinessType?: string | undefined;
  defaultMessage?: string | undefined;
  className?: string | undefined;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const [successName, setSuccessName] = useState("");
  const [successInterest, setSuccessInterest] = useState("");

  // Unmounted qualification fields (home stage vs facility type) drop out of the
  // payload when the shopper switches between Home and Business.
  const consumerForm = useForm({
    resolver: zodResolver(consumerEnquirySchema),
    shouldUnregister: true,
    defaultValues: {
      kind: "consumer" as const,
      fullName: "",
      phone: "",
      email: "",
      city: "",
      productInterest: firstProductInterest(defaultProductInterest),
      homeOrBusiness: "Home" as const,
      budget: "",
      message: defaultMessage ?? "",
    },
  });

  const businessForm = useForm({
    resolver: zodResolver(businessEnquirySchema),
    defaultValues: {
      kind: "business" as const,
      businessName: "",
      contactPerson: "",
      phone: "",
      email: "",
      city: "",
      businessType: firstBusinessType(defaultBusinessType),
      productsOfInterest: firstProductInterest(defaultProductInterest),
      projectDescription: defaultMessage ?? "",
    },
  });

  const submit = async (payload: unknown, firstName: string, interest: string) => {
    setStatus("submitting");
    setServerError(null);
    try {
      const res = await fetch("/api/public/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
      if (res.ok && json?.ok) {
        setSuccessName(firstName);
        setSuccessInterest(interest);
        setStatus("success");
      } else {
        setStatus("error");
        setServerError(json?.error ?? "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setServerError("We couldn't reach the server. Please check your connection and try again.");
    }
  };

  if (status === "success") {
    return <SuccessPanel name={successName} interest={successInterest} className={className} />;
  }

  if (variant === "business") {
    const {
      register,
      handleSubmit,
      formState: { errors },
    } = businessForm;

    return (
      <form
        onSubmit={handleSubmit((values) =>
          submit(values, values.contactPerson.trim().split(" ")[0] ?? "", values.productsOfInterest),
        )}
        className={cn("scroll-mt-28 space-y-5", className)}
        noValidate
        data-enquiry-form
        data-hide-mobile-bar
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="b-name">Business Name</Label>
            <input id="b-name" className={inputClass} {...register("businessName")} />
            <FieldError message={errors.businessName?.message} />
          </div>
          <div>
            <Label htmlFor="b-person">Contact Person</Label>
            <input id="b-person" className={inputClass} {...register("contactPerson")} />
            <FieldError message={errors.contactPerson?.message} />
          </div>
          <div>
            <Label htmlFor="b-phone">Mobile (WhatsApp)</Label>
            <input id="b-phone" type="tel" inputMode="tel" placeholder="98765 43210" className={inputClass} {...register("phone")} />
            <FieldError message={errors.phone?.message} />
          </div>
          <div>
            <Label htmlFor="b-email">Email</Label>
            <input id="b-email" type="email" className={inputClass} {...register("email")} />
            <FieldError message={errors.email?.message} />
          </div>
          <div>
            <Label htmlFor="b-city">City</Label>
            <input id="b-city" className={inputClass} {...register("city")} />
            <FieldError message={errors.city?.message} />
          </div>
          <div>
            <Label htmlFor="b-type">Facility Type</Label>
            <select id="b-type" className={selectClass} {...register("businessType")}>
              {businessTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <FieldError message={errors.businessType?.message} />
          </div>
        </div>
        <div>
          <Label htmlFor="b-stage">Which best describes your space?</Label>
          <select id="b-stage" className={selectClass} {...register("projectStage")}>
            <option value="">Select one</option>
            {spaceStageValues.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <FieldError message={errors.projectStage?.message} />
        </div>
        <div>
          <Label htmlFor="b-products">Products of Interest</Label>
          <select id="b-products" className={selectClass} {...register("productsOfInterest")}>
            {productInterests.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <FieldError message={errors.productsOfInterest?.message} />
        </div>
        <div>
          <Label htmlFor="b-desc">Project Description</Label>
          <textarea
            id="b-desc"
            rows={4}
            placeholder="Tell us about your space, timeline and what you're planning."
            className={cn(inputClass, "h-auto py-3")}
            {...register("projectDescription")}
          />
          <FieldError message={errors.projectDescription?.message} />
        </div>

        <SubmitButton status={status} label="Discuss Your Project" />
        <FormFooter status={status} serverError={serverError} />
      </form>
    );
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = consumerForm;
  const shoppingFor = useWatch({ control: consumerForm.control, name: "homeOrBusiness" });

  return (
    <form
      onSubmit={handleSubmit(
        (values) =>
          submit(values, values.fullName.trim().split(" ")[0] ?? "", values.productInterest),
        (errs) => console.log("RHF INVALID", JSON.stringify(errs)),
      )}
      className={cn("scroll-mt-28 space-y-5", className)}
      noValidate
      data-enquiry-form
      data-hide-mobile-bar
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="c-name">Full Name</Label>
          <input id="c-name" autoComplete="name" className={inputClass} {...register("fullName")} />
          <FieldError message={errors.fullName?.message} />
        </div>
        <div>
          <Label htmlFor="c-phone">Mobile (WhatsApp)</Label>
          <input
            id="c-phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="98765 43210"
            className={inputClass}
            {...register("phone")}
          />
          <FieldError message={errors.phone?.message} />
        </div>
        <div>
          <Label htmlFor="c-email">Email (optional)</Label>
          <input id="c-email" type="email" autoComplete="email" className={inputClass} {...register("email")} />
          <FieldError message={errors.email?.message} />
        </div>
        <div>
          <Label htmlFor="c-city">City</Label>
          <input id="c-city" autoComplete="address-level2" className={inputClass} {...register("city")} />
          <FieldError message={errors.city?.message} />
        </div>
        <div>
          <Label htmlFor="c-interest">Product Interest</Label>
          <select id="c-interest" className={selectClass} {...register("productInterest")}>
            {productInterests.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <FieldError message={errors.productInterest?.message} />
        </div>
        <div>
          <Label htmlFor="c-hob">Home or Business</Label>
          <select id="c-hob" className={selectClass} {...register("homeOrBusiness")}>
            <option value="Home">Home</option>
            <option value="Business">Business</option>
          </select>
          <FieldError message={errors.homeOrBusiness?.message} />
        </div>
      </div>
      {/* One qualifying question, matched to what they told us above. */}
      {shoppingFor === "Business" ? (
        <div>
          <Label htmlFor="c-facility">What kind of facility are you setting up?</Label>
          <select id="c-facility" className={selectClass} {...register("facilityType")}>
            <option value="">Select one</option>
            {businessTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <FieldError message={errors.facilityType?.message} />
        </div>
      ) : (
        <div>
          <Label htmlFor="c-stage">Which best describes your home?</Label>
          <select id="c-stage" className={selectClass} {...register("homeStage")}>
            <option value="">Select one</option>
            {homeStageValues.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <FieldError message={errors.homeStage?.message} />
        </div>
      )}
      {/* Optional details: collapsed to keep the form short, open when a CTA pre-filled the message. */}
      <details open={Boolean(defaultMessage)} className="group border-t border-border pt-4">
        <summary className="cursor-pointer list-none text-xs uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground [&::-webkit-details-marker]:hidden">
          <span className="group-open:hidden">+ Add details (optional)</span>
          <span className="hidden group-open:inline">− Details (optional)</span>
        </summary>
        <div className="mt-5 space-y-5">
          <div>
            <Label htmlFor="c-budget">Approximate Budget (optional)</Label>
            <select id="c-budget" className={selectClass} {...register("budget")}>
              <option value="">Prefer not to say</option>
              {budgetOptions.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
            <FieldError message={errors.budget?.message} />
          </div>
          <div>
            <Label htmlFor="c-message">Message (optional)</Label>
            <textarea
              id="c-message"
              rows={4}
              placeholder="Tell us a little about your space and what you're looking for."
              className={cn(inputClass, "h-auto py-3")}
              {...register("message")}
            />
            <FieldError message={errors.message?.message} />
          </div>
        </div>
      </details>

      <SubmitButton status={status} label="Request a Consultation" />
      <FormFooter status={status} serverError={serverError} />
    </form>
  );
}

function SubmitButton({ status, label }: { status: string; label: string }) {
  return (
    <button
      type="submit"
      disabled={status === "submitting"}
      className="inline-flex w-full items-center justify-center rounded-sm bg-primary px-7 py-3.5 text-[13px] uppercase tracking-[0.16em] text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
    >
      {status === "submitting" ? "Sending…" : label}
    </button>
  );
}

/** Reply promise + WhatsApp alternative under the submit button; error message when sending fails. */
function FormFooter({ status, serverError }: { status: Status; serverError: string | null }) {
  const wa = whatsappLink("Hello VYRO, I'd like to make an enquiry.");
  return (
    <>
      {status === "error" && serverError && (
        <p role="alert" className="text-sm text-destructive">
          {serverError}
          {wa && (
            <>
              {" "}
              You can also{" "}
              <a href={wa} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
                message us on WhatsApp
              </a>
              .
            </>
          )}
        </p>
      )}
      <p className="text-xs text-muted-foreground">
        Our team replies {site.enquiryResponseTime}.
        {wa && (
          <>
            {" "}
            Prefer WhatsApp?{" "}
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline decoration-bronze underline-offset-4 hover:text-bronze-strong"
            >
              Message us
            </a>
          </>
        )}
      </p>
    </>
  );
}

function SuccessPanel({
  name,
  interest,
  className,
}: {
  name: string;
  interest: string;
  className?: string | undefined;
}) {
  const wa = whatsappLink(
    `Hello VYRO, I've just submitted an enquiry on your website${interest ? ` about ${interest}` : ""}.`,
  );
  return (
    <div
      className={cn("scroll-mt-28 rounded-sm border border-border bg-card p-8 text-center", className)}
      role="status"
      data-enquiry-form
      data-hide-mobile-bar
    >
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-bronze text-bronze-strong">
        <Check className="h-5 w-5" aria-hidden />
      </span>
      <h3 className="mt-5 font-display text-3xl font-medium text-foreground">
        {name ? `Thank you, ${name}.` : "Thank you."}
      </h3>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
        Your enquiry has been received. Our team will reply {site.enquiryResponseTime}.
      </p>
      {wa && (
        <a
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center justify-center rounded-sm border border-foreground/40 px-6 py-2.5 text-[13px] uppercase tracking-[0.16em] text-foreground transition-colors hover:bg-foreground hover:text-background"
        >
          Continue on WhatsApp
        </a>
      )}
    </div>
  );
}
