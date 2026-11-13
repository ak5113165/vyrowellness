import { createOpenAI } from "@ai-sdk/openai";
import { Output, streamText } from "ai";
import { z } from "zod/v4";

export const socialPlanSchema = z.object({
  posts: z.array(
    z.object({
      format: z.string(),
      concept: z.string(),
      visualDirection: z.string(),
      caption: z.string(),
      hashtags: z.array(z.string()),
      callToAction: z.string(),
    }),
  ),
  notes: z.string(),
});
export type SocialPlan = z.infer<typeof socialPlanSchema>;

export type SocialBrief = {
  product: string;
  goal: string;
  audience: string;
  keyPoints: string;
  tone: string;
  postCount: number;
};

const INSTRUCTIONS = `You are the Instagram copywriter for VYRO Wellness, a premium Indian wellness brand (saunas — Haven cabins, Ember heaters, Pulse control panels; Glacier cold plunges and red light therapy are "Coming Soon · Made in India").
Brand voice: architectural luxury, calm, confident, precise. Short sentences. No hype, no emoji spam (max 1-2 tasteful emoji), no discounts unless the brief states one.
Visual world: charcoal, ivory, restrained bronze; sharp lines, warm wood, soft low light. Never neon, gradients or glassmorphism.
Strict honesty: never invent specifications, prices, certifications, testimonials, partners, launch dates or medical claims. Only use facts provided in the brief. Wellness benefits must be framed as experience ("feel restored"), never as medical outcomes.
Calls to action point to a consultation, WhatsApp (+91 87000 15649) or vyrowellness.in.
Write in Indian English. Hashtags: 5-10 relevant ones, no "#" duplicates.
In "notes", list any brief facts you could not verify or details the manager should confirm before posting.`;

export async function generateSocialPlan(brief: SocialBrief, signal?: AbortSignal): Promise<SocialPlan> {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) throw new Error("AI is not configured.");
  const provider = createOpenAI({
    baseURL: "https://ai.gateway.lovable.dev/v1",
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
  });
  const prompt = `Create ${brief.postCount} Instagram post concepts.
Product / campaign: ${brief.product}
Goal: ${brief.goal || "awareness"}
Audience: ${brief.audience || "premium Indian homeowners and wellness businesses"}
Tone notes: ${brief.tone || "brand default"}
Key facts and points (only facts you may use):
${brief.keyPoints || "(none provided)"}
Vary formats across single image, carousel and reel.`;
  const result = streamText({
    model: provider.responses("openai/gpt-6-astra"),
    instructions: INSTRUCTIONS,
    prompt,
    output: Output.object({ schema: socialPlanSchema }),
    ...(signal ? { abortSignal: signal } : {}),
    maxRetries: 0,
    providerOptions: {
      openai: {
        forceReasoning: true,
        reasoningEffort: "low",
        reasoningSummary: "auto",
        store: false,
        include: ["reasoning.encrypted_content"],
      },
    },
  });
  return (await result.output) as SocialPlan;
}
