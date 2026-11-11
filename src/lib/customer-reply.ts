// Customer auto-reply: a branded thank-you email to the person who enquired,
// sent the moment their enquiry is saved — only when they gave an email.
//
// Sent with Resend, like the lead alert. Never blocks or fails an enquiry.
// Replies go to the sales inbox.
//
// Secrets (Lovable → Cloud → Secrets):
//   RESEND_API_KEY        required (already set for lead alerts)
//   CUSTOMER_REPLY_FROM   optional — default "VYRO Wellness <info@vyrowellness.in>"
//   CUSTOMER_REPLY_OFF    optional — set to "1" to stop these emails

import { site, whatsappLink } from "@/content/site";
import type { Lead } from "@/lib/lead-alert";

const escapeHtml = (v: string) =>
  v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const siteUrl = `https://${site.domain}`;
export const catalogueUrl = `${siteUrl}/downloads/vyro-product-catalogue.pdf`;

function firstName(name: string): string {
  const first = name.trim().split(/\s+/)[0] ?? "";
  return first.length > 1 ? first : name.trim();
}

const interestPhrase: Record<string, string> = {
  Sauna: "a sauna",
  "Cold Plunge": "a cold plunge",
  "Red Light Therapy": "red light therapy",
  "Complete Home Wellness": "a complete home wellness space",
  "Commercial Wellness": "commercial wellness",
};

/** What the enquiry was about, in a few words, for the email. */
function topicOf(lead: Lead): string | null {
  if (lead.kind === "business") return lead.businessName ? `your project at ${lead.businessName}` : "your project";
  return interestPhrase[lead.productInterest ?? ""] ?? null;
}

export function buildCustomerReply(lead: Lead): { subject: string; text: string; html: string } {
  const isCallBack = lead.message?.startsWith("Call-back requested") ?? false;
  const name = firstName(lead.name);
  const topic = topicOf(lead);
  const subject = isCallBack
    ? "We've received your call-back request — VYRO Wellness"
    : "Thank you for your enquiry — VYRO Wellness";
  const opening = isCallBack
    ? `Thank you for asking us to call you. A VYRO wellness consultant will call you ${site.enquiryResponseTime}.`
    : `Thank you for getting in touch${topic ? ` about ${topic}` : ""}. A VYRO wellness consultant will reply ${site.enquiryResponseTime}.`;
  const meanwhile =
    "In the meantime, our product catalogue has every Haven sauna, Glacier cold plunge and wellness space we offer.";
  const wa = whatsappLink(`Hello VYRO, I've just sent an enquiry from the website (${lead.name}).`);

  const text = [
    `Hi ${name},`,
    "",
    opening,
    "",
    meanwhile,
    `Product catalogue: ${catalogueUrl}`,
    "",
    `Questions before then? Call ${site.phoneDisplay}${wa ? ` or WhatsApp ${wa}` : ""}, or simply reply to this email.`,
    "",
    "Warm regards,",
    "Team VYRO Wellness",
    siteUrl.replace("https://", "www."),
  ].join("\n");

  const button = (href: string, label: string, solid: boolean) =>
    `<a href="${href}" style="display:inline-block;${
      solid ? "background:#1b1d1f;color:#f4efe7;" : "border:1px solid #1b1d1f;color:#1b1d1f;"
    }text-decoration:none;padding:12px 20px;font-size:12px;letter-spacing:2px;margin:0 8px 8px 0">${label}</a>`;

  const html = `<!doctype html><html><body style="margin:0;padding:24px;background:#f4efe7;font-family:Arial,Helvetica,sans-serif;color:#1b1d1f">
<table role="presentation" width="100%" style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #ddd5c8">
<tr><td style="background:#1b1d1f;color:#f4efe7;padding:22px 28px;font-size:16px;letter-spacing:6px">VYRO <span style="font-size:10px;letter-spacing:4px;color:#a98a5e">&nbsp;WELLNESS</span></td></tr>
<tr><td style="padding:28px;font-size:15px;line-height:1.6">
<p style="margin:0 0 16px">Hi ${escapeHtml(name)},</p>
<p style="margin:0 0 16px">${escapeHtml(opening)}</p>
<p style="margin:0 0 20px;color:#5f5a54">${escapeHtml(meanwhile)}</p>
<p style="margin:0 0 12px">${button(catalogueUrl, "VIEW CATALOGUE", true)}${wa ? button(wa, "WHATSAPP US", false) : ""}</p>
<p style="margin:12px 0 0;font-size:13px;color:#5f5a54">Questions before then? Call <a href="${site.phoneHref}" style="color:#8c6a3f">${escapeHtml(site.phoneDisplay)}</a> or simply reply to this email.</p>
<p style="margin:24px 0 0">Warm regards,<br>Team VYRO Wellness</p>
</td></tr>
<tr><td style="padding:16px 28px;border-top:1px solid #eee6da;font-size:12px;color:#5f5a54"><a href="${siteUrl}" style="color:#5f5a54">www.${escapeHtml(site.domain)}</a> &nbsp;·&nbsp; ${escapeHtml(site.infoEmail)}</td></tr>
</table></body></html>`;

  return { subject, text, html };
}

/** Send the auto-reply if the customer gave an email. Resolves either way. */
export async function sendCustomerReply(lead: Lead): Promise<void> {
  if (!lead.email) return;
  const apiKey = process.env["RESEND_API_KEY"];
  if (!apiKey || process.env["CUSTOMER_REPLY_OFF"] === "1") return;
  const from = process.env["CUSTOMER_REPLY_FROM"] || "VYRO Wellness <info@vyrowellness.in>";
  const { subject, text, html } = buildCustomerReply(lead);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5000);
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [lead.email], subject, text, html, reply_to: site.salesEmail }),
      signal: controller.signal,
    });
    if (!res.ok) console.error("Customer reply failed:", res.status, await res.text().catch(() => ""));
  } catch (err) {
    console.error("Customer reply failed:", err instanceof Error ? err.message : err);
  } finally {
    clearTimeout(timer);
  }
}
