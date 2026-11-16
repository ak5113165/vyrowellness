import { createFileRoute } from '@tanstack/react-router'
import type { ReactNode } from "react";
import { pageHead } from "@/lib/seo";
import { Reveal } from "@/components/reveal";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { site } from "@/content/site";

export const Route = createFileRoute("/privacy")({
  head: () =>
    pageHead({
      path: "/privacy",
      title: "Privacy Policy | VYRO Wellness",
      description:
        "What personal information VYRO Wellness collects through its website, why, who it is shared with, and how to access, correct or delete it.",
    }),
  component: PrivacyPage,
});

// Written from what the site actually does (Nov 2026): enquiry and call-back
// forms -> Lovable Cloud database -> Resend email alerts / customer reply ->
// Zoho Mail inbox. If any of that changes (analytics, payments, new forms),
// update this page in the same change. Once the company is incorporated, add
// the registered name and address in "Who We Are".
const LAST_UPDATED = "16 November 2026";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="font-display text-2xl font-medium text-foreground">{title}</h2>
      {children}
    </section>
  );
}

function List({ items }: { items: ReactNode[] }) {
  return (
    <ul className="list-disc space-y-2 pl-5">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

function Mail({ address }: { address: string }) {
  return (
    <a href={`mailto:${address}`} className="text-foreground underline underline-offset-4">
      {address}
    </a>
  );
}

function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main id="main" className="mx-auto max-w-3xl px-5 py-20 lg:py-28">
        <Reveal>
          <p className="eyebrow text-bronze-strong">Legal</p>
          <h1 className="mt-3 font-display text-5xl font-medium">Privacy Policy</h1>
          <p className="mt-4 text-sm text-muted-foreground">Last updated: {LAST_UPDATED}</p>

          <div className="mt-10 space-y-10 text-sm leading-relaxed text-muted-foreground">
            <Section title="Summary">
              <List
                items={[
                  "We collect only what you type into our enquiry and call-back forms, so that we can reply to you.",
                  "We use it to answer your enquiry, prepare quotes and follow up with you. We do not sell it.",
                  "You can ask us at any time to show, correct or delete your details.",
                ]}
              />
            </Section>

            <Section title="Who We Are">
              <p>
                This website, {site.domain}, is run by {site.legalName} ("VYRO", "we", "us"). For
                anything in this policy, write to <Mail address={site.infoEmail} />.
              </p>
            </Section>

            <Section title="What We Collect">
              <p>When you send an enquiry or ask for a call back, we collect:</p>
              <List
                items={[
                  "your name and mobile (WhatsApp) number;",
                  "your email address, if you give one;",
                  "your city;",
                  "what you are interested in, such as a sauna, cold plunge or complete wellness space, and whether it is for a home or a business;",
                  "your project stage and budget range, if you choose them;",
                  "any message or project description you write;",
                  "for business enquiries, your business name and type;",
                  "which page of the website you sent the form from.",
                ]}
              />
              <p>
                We do not ask for payment details, ID numbers or passwords on this website, and we do
                not use advertising or tracking cookies. The site remembers in your browser, for that
                visit only, whether you have already closed our offer pop-up, so it does not show
                again. Like any website, our hosting provider receives technical information such as
                your IP address and browser type when you load a page.
              </p>
            </Section>

            <Section title="Why We Use It">
              <List
                items={[
                  "To reply to your enquiry by phone, WhatsApp or email, and send you an automatic confirmation email if you gave your email address.",
                  "To recommend products, plan your space and prepare quotations.",
                  "To follow up on the enquiry you made, and to arrange site visits, installation and after-sales service if you go ahead.",
                  "To keep records we are required to keep by law.",
                ]}
              />
              <p>
                We use your details only for the enquiry you made. We will not add you to marketing
                messages unless you agree to it separately.
              </p>
            </Section>

            <Section title="Your Consent">
              <p>
                By sending a form, you agree that we may use your details as described here. You can
                withdraw that consent at any time by writing to <Mail address={site.infoEmail} />.
                Withdrawing it is as easy as giving it. Once you do, we stop contacting you and delete
                your details, except anything we must keep by law.
              </p>
            </Section>

            <Section title="Who We Share It With">
              <p>We share your details only with the services that run this website and our email:</p>
              <List
                items={[
                  "Lovable Cloud, which hosts the website and the database where enquiries are stored;",
                  "Resend, which sends the email alert to our sales team and your confirmation email;",
                  "Zoho Mail, which hosts our company email inbox;",
                  "Google Fonts, which supplies the website's typefaces and receives your IP address when a page loads;",
                  "WhatsApp, only if you choose to message us there.",
                ]}
              />
              <p>
                These providers handle data on our behalf. Some of them store data on servers outside
                India. Our installation team sees your details only when it is needed to visit or
                install. We never sell your personal information, and we disclose it to authorities
                only when the law requires it.
              </p>
            </Section>

            <Section title="How Long We Keep It">
              <p>
                We keep your details only as long as we need them for your enquiry, any purchase and
                after-sales service, or as long as the law requires, such as for tax records. After
                that we delete them.
              </p>
            </Section>

            <Section title="How We Protect It">
              <p>
                Enquiries are stored in a database that cannot be read from the website itself; only
                our server and authorised VYRO staff can access it. Data is sent over encrypted (HTTPS)
                connections. If a breach ever affects your details, we will tell you and the
                authorities as the law requires.
              </p>
            </Section>

            <Section title="Your Rights">
              <p>Under India's Digital Personal Data Protection Act, 2023, you can ask us to:</p>
              <List
                items={[
                  "tell you what personal data we hold about you and how we use it;",
                  "correct, complete or update it;",
                  "delete it;",
                  "stop using it, by withdrawing your consent;",
                  "let someone you nominate exercise these rights for you if you are unable to.",
                ]}
              />
              <p>
                Email <Mail address={site.infoEmail} /> with your request. We may ask you to confirm
                your identity first. If you are not satisfied with our response, you can complain to
                the Data Protection Board of India.
              </p>
            </Section>

            <Section title="Children">
              <p>
                Our website is meant for adults. We do not knowingly collect details from anyone under
                18. If you believe a child has sent us their details, write to us and we will delete
                them.
              </p>
            </Section>

            <Section title="Changes to This Policy">
              <p>
                If we change how we handle personal data, we will update this page and the date at
                the top.
              </p>
            </Section>

            <Section title="Contact">
              <p>
                For privacy questions or requests: <Mail address={site.infoEmail} />. For anything
                else: <Mail address={site.salesEmail} /> or <Mail address={site.supportEmail} />.
              </p>
            </Section>
          </div>
        </Reveal>
      </main>
      <SiteFooter />
    </div>
  );
}
