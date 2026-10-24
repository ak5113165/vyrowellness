import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";
import {
  businessEnquirySchema,
  consumerEnquirySchema,
} from "@/lib/enquiry-schema";
import { budgetOptions, businessTypes, productInterests, whatsappLink } from "@/content/site";
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

export function EnquiryForm({
  variant,
  defaultProductInterest,
  className,
}: {
  variant: "consumer" | "business";
  defaultProductInterest?: string | undefined;
  className?: string | undefined;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const [successName, setSuccessName] = useState("");

  const consumerForm = useForm({
    resolver: zodResolver(consumerEnquirySchema),
    defaultValues: {
      kind: "consumer" as const,
      fullName: "",
      phone: "",
      email: "",
      city: "",
      productInterest: firstProductInterest(defaultProductInterest),
      homeOrBusiness: "Home" as const,
      budget: "",
      message: "",
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
      businessType: "Gym / Fitness Centre" as const,
      productsOfInterest: firstProductInterest(defaultProductInterest),
      projectDescription: "",
    },
  });

  const submit = async (payload: unknown, firstName: string) => {
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
    return <SuccessPanel name={successName} className={className} />;
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
          submit(values, values.contactPerson.trim().split(" ")[0] ?? ""),
        )}
        className={cn("space-y-5", className)}
        noValidate
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
            <Label htmlFor="b-phone">Phone Number</Label>
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
            <Label htmlFor="b-type">Business Type</Label>
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
        {status === "error" && serverError && (
          <p role="alert" className="text-sm text-destructive">
            {serverError}
          </p>
        )}
      </form>
    );
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = consumerForm;

  return (
    <form
      onSubmit={handleSubmit((values) => submit(values, values.fullName.trim().split(" ")[0] ?? ""))}
      className={cn("space-y-5", className)}
      noValidate
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="c-name">Full Name</Label>
          <input id="c-name" autoComplete="name" className={inputClass} {...register("fullName")} />
          <FieldError message={errors.fullName?.message} />
        </div>
        <div>
          <Label htmlFor="c-phone">Phone Number</Label>
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
          <Label htmlFor="c-email">Email</Label>
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

      <SubmitButton status={status} label="Request a Consultation" />
      {status === "error" && serverError && (
        <p role="alert" className="text-sm text-destructive">
          {serverError}
        </p>
      )}
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

function SuccessPanel({
  name,
  className,
}: {
  name: string;
  className?: string | undefined;
}) {
  const wa = whatsappLink("Hello VYRO, I've just submitted an enquiry on your website.");
  return (
    <div className={cn("rounded-sm border border-border bg-card p-8 text-center", className)} role="status">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-bronze text-bronze-strong">
        <Check className="h-5 w-5" aria-hidden />
      </span>
      <h3 className="mt-5 font-display text-3xl font-medium text-foreground">
        {name ? `Thank you, ${name}.` : "Thank you."}
      </h3>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
        Your enquiry has been received. Our team will be in touch with you.
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
