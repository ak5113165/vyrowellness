// Lead alerts: emails the sales team the moment an enquiry is saved.
//
// Sent with Resend (https://resend.com) from the enquiries API route. Never
// blocks or fails an enquiry: if the key is missing or sending fails, the
// enquiry is still saved and the problem is only logged.
//
// Secrets (add in Lovable → Cloud → Secrets):
//   RESEND_API_KEY     required — from resend.com → API Keys
//   LEAD_ALERT_EMAIL   optional — who receives alerts (default: site.salesEmail)
//   LEAD_ALERT_FROM    optional — sender (default: "VYRO Website <leads@vyrowellness.in>";
//                      the vyrowellness.in domain must be verified in Resend)

import { site } from "@/content/site";

export type Lead = {
  id: string;
  kind: "consumer" | "business";
  name: string;
  phone: string;
  email?: string | undefined;
  city?: string | undefined;
  productInterest?: string | undefined;
  homeOrBusiness?: string | undefined;
  /** Home/space stage: existing, under construction or under renovation. */
  projectStage?: string | undefined;
  /** Facility type on a consumer lead that is for a business space. */
  facilityType?: string | undefined;
  budget?: string | undefined;
  message?: string | undefined;
  businessName?: string | undefined;
  businessType?: string | undefined;
  projectDescription?: string | undefined;
};

const escapeHtml = (v: string) =>
  v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** "9876543210" or "+919876543210" → "919876543210" (for wa.me and tel: links). */
export function internationalIndianNumber(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return digits.length === 10 ? `91${digits}` : digits;
}

export function buildLeadAlert(lead: Lead): { subject: string; text: string; html: string } {
  const isCallBack = lead.message?.startsWith("Call-back requested") ?? false;
  const topic = lead.kind === "business" ? (lead.businessType ?? "Business") : (lead.productInterest ?? "General");
  const label = isCallBack ? "Call-back request" : lead.kind === "business" ? "Business enquiry" : "New enquiry";
  const who = lead.kind === "business" && lead.businessName ? `${lead.name}, ${lead.businessName}` : lead.name;
  const subject = `${label}: ${who} — ${topic}`;

  const intl = internationalIndianNumber(lead.phone);
  const rows: [string, string | undefined][] = [
    ["Name", lead.name],
    ["Business", lead.businessName],
    ["Business type", lead.businessType],
    ["Mobile", `+${intl}`],
    ["Email", lead.email],
    ["City", lead.city],
    ["Interested in", lead.productInterest],
    ["Home or business", lead.homeOrBusiness],
    ["Project stage", lead.projectStage],
    ["Facility", lead.facilityType],
    ["Budget", lead.budget],
    ["Message", lead.message],
    ["Project", lead.projectDescription],
  ];
  const filled = rows.filter((r): r is [string, string] => Boolean(r[1]));

  const deadline = `Reply ${site.enquiryResponseTime} — that's the promise on the website.`;
  const text = [
    subject,
    "",
    ...filled.map(([k, v]) => `${k}: ${v}`),
    "",
    `Call: tel:+${intl}`,
    `WhatsApp: https://wa.me/${intl}`,
    "",
    deadline,
    `Reference: ${lead.id}`,
  ].join("\n");

  const html = `<!doctype html><html><body style="margin:0;padding:24px;background:#f4efe7;font-family:Arial,Helvetica,sans-serif;color:#1b1d1f">
<table role="presentation" width="100%" style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #ddd5c8">
<tr><td style="background:#1b1d1f;color:#f4efe7;padding:18px 24px;font-size:13px;letter-spacing:3px">VYRO &nbsp;·&nbsp; <span style="color:#a98a5e">${escapeHtml(label.toUpperCase())}</span></td></tr>
<tr><td style="padding:24px">
<p style="margin:0 0 16px;font-size:20px">${escapeHtml(who)} <span style="color:#8c6a3f">— ${escapeHtml(topic)}</span></p>
<table role="presentation" width="100%" style="border-collapse:collapse;font-size:14px">
${filled
  .map(
    ([k, v]) =>
      `<tr><td style="padding:8px 12px 8px 0;border-bottom:1px solid #eee6da;color:#5f5a54;white-space:nowrap;vertical-align:top">${escapeHtml(k)}</td><td style="padding:8px 0;border-bottom:1px solid #eee6da;white-space:pre-wrap">${escapeHtml(v)}</td></tr>`,
  )
  .join("\n")}
</table>
<p style="margin:22px 0 8px">
<a href="tel:+${intl}" style="display:inline-block;background:#1b1d1f;color:#f4efe7;text-decoration:none;padding:11px 18px;font-size:13px;letter-spacing:1px">CALL</a>
&nbsp;
<a href="https://wa.me/${intl}" style="display:inline-block;border:1px solid #1b1d1f;color:#1b1d1f;text-decoration:none;padding:10px 18px;font-size:13px;letter-spacing:1px">WHATSAPP</a>
</p>
<p style="margin:18px 0 0;font-size:12px;color:#5f5a54">${escapeHtml(deadline)}<br>Reference: ${escapeHtml(lead.id)}</p>
</td></tr></table></body></html>`;

  return { subject, text, html };
}

/** Email the alert. Resolves either way; logs instead of throwing. */
export async function sendLeadAlert(lead: Lead): Promise<void> {
  const apiKey = process.env["RESEND_API_KEY"];
  if (!apiKey) {
    console.warn("Lead alert not sent: RESEND_API_KEY is not set.");
    return;
  }
  const to = process.env["LEAD_ALERT_EMAIL"] || site.salesEmail;
  const from = process.env["LEAD_ALERT_FROM"] || "VYRO Website <leads@vyrowellness.in>";
  const { subject, text, html } = buildLeadAlert(lead);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5000);
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        subject,
        text,
        html,
        ...(lead.email ? { reply_to: lead.email } : {}),
      }),
      signal: controller.signal,
    });
    if (!res.ok) console.error("Lead alert failed:", res.status, await res.text().catch(() => ""));
  } catch (err) {
    console.error("Lead alert failed:", err instanceof Error ? err.message : err);
  } finally {
    clearTimeout(timer);
  }
}
