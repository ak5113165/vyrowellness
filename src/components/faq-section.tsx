import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section";
import { cn } from "@/lib/utils";

/** Centered FAQ accordion. Pair with faqJsonLd(faqs) in the page head. */
export function FaqSection({
  overline = "FAQs",
  title,
  copy,
  faqs,
  className,
}: {
  overline?: string;
  title: string;
  copy?: string;
  faqs: readonly { q: string; a: string }[];
  className?: string;
}) {
  return (
    <section className={cn("border-y border-border bg-secondary/60", className)}>
      <div className="mx-auto max-w-3xl px-5 py-20">
        {copy ? (
          <SectionHeading align="center" overline={overline} title={title} copy={copy} />
        ) : (
          <SectionHeading align="center" overline={overline} title={title} />
        )}
        <Reveal className="mt-10">
          <Accordion type="single" collapsible className="border-t border-border">
            {faqs.map((f) => (
              <AccordionItem key={f.q} value={f.q} className="border-b border-border">
                <AccordionTrigger className="text-left font-display text-xl font-medium text-foreground hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
