import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const briefSchema = z.object({
  product: z.string().trim().min(2).max(300),
  goal: z.string().trim().max(200).default(""),
  audience: z.string().trim().max(300).default(""),
  keyPoints: z.string().trim().max(3000).default(""),
  tone: z.string().trim().max(200).default(""),
  postCount: z.number().int().min(1).max(5).default(3),
});

export const checkStudioAccess = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase.from("user_roles").select("role").eq("user_id", context.userId);
    return { allowed: (data ?? []).some((r) => r.role === "admin" || r.role === "social_manager") };
  });

export const generateSocialPosts = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => briefSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { data: roles } = await context.supabase.from("user_roles").select("role").eq("user_id", context.userId);
    if (!(roles ?? []).some((r) => r.role === "admin" || r.role === "social_manager")) {
      return { ok: false as const, error: "Your account doesn't have access to the Social Studio." };
    }
    try {
      const { generateSocialPlan } = await import("./social-studio.server");
      const plan = await generateSocialPlan(data);
      return { ok: true as const, plan };
    } catch (err: unknown) {
      console.error("social studio generation failed", err);
      const status = (err as { statusCode?: number })?.statusCode;
      const error =
        status === 402 ? "AI credits have run out. Top up in Settings → Plans & credits."
        : status === 429 ? "Too many requests right now — please wait a minute and try again."
        : status === 403 ? "AI access is currently blocked for this workspace."
        : "Couldn't generate posts. Please try again.";
      return { ok: false as const, error };
    }
  });
