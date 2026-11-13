import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { pageHead } from "@/lib/seo";
import { checkStudioAccess, generateSocialPosts } from "@/lib/social-studio.functions";
import type { SocialPlan } from "@/lib/social-studio.server";

export const Route = createFileRoute("/studio")({
  head: () =>
    pageHead({
      path: "/studio",
      title: "Social Studio | VYRO Wellness",
      description: "Internal tool for VYRO's social team to draft on-brand Instagram posts.",
      noindex: true,
    }),
  component: StudioPage,
});

const field = "w-full rounded-sm border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring";
const btn = "rounded-sm bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-50";

function StudioPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setReady(true); });
    return () => data.subscription.unsubscribe();
  }, []);
  return (
    <main className="min-h-screen bg-background px-5 py-16">
      <div className="mx-auto max-w-4xl">
        <p className="eyebrow text-bronze-strong">VYRO · Internal</p>
        <h1 className="mt-2 font-display text-5xl font-medium">Social Studio</h1>
        <p className="mt-3 text-sm text-muted-foreground">Turn a product or campaign brief into on-brand Instagram captions and post concepts.</p>
        <div className="mt-10">{!ready ? null : session ? <Studio email={session.user.email ?? ""} /> : <SignIn />}</div>
      </div>
    </main>
  );
}

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"in" | "up">("in");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setMsg(null);
    const { error } = mode === "in"
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/studio` } });
    setBusy(false);
    if (error) setMsg(error.message);
    else if (mode === "up") setMsg("Check your email to confirm your account, then sign in.");
  }
  return (
    <form onSubmit={submit} className="max-w-sm space-y-4 border border-border p-6">
      <h2 className="font-display text-2xl">{mode === "in" ? "Sign in" : "Create account"}</h2>
      <input className={field} type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input className={field} type="password" required minLength={8} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      {msg && <p className="text-sm text-muted-foreground">{msg}</p>}
      <button className={btn} disabled={busy}>{busy ? "Please wait…" : mode === "in" ? "Sign in" : "Create account"}</button>
      <button type="button" className="block text-xs underline text-muted-foreground" onClick={() => setMode(mode === "in" ? "up" : "in")}>
        {mode === "in" ? "Need an account? Create one" : "Have an account? Sign in"}
      </button>
    </form>
  );
}

function Studio({ email }: { email: string }) {
  const check = useServerFn(checkStudioAccess);
  const generate = useServerFn(generateSocialPosts);
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [form, setForm] = useState({ product: "", goal: "", audience: "", keyPoints: "", tone: "", postCount: 3 });
  const [plan, setPlan] = useState<SocialPlan | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  useEffect(() => { check().then((r) => setAllowed(r.allowed)).catch(() => setAllowed(false)); }, [check]);

  const signOut = <button className="text-xs underline text-muted-foreground" onClick={() => supabase.auth.signOut()}>Sign out ({email})</button>;
  if (allowed === null) return <p className="text-sm text-muted-foreground">Checking access…</p>;
  if (!allowed) return <div className="space-y-3"><p className="text-sm">This account isn't set up for the Social Studio yet. Ask the VYRO admin to grant access.</p>{signOut}</div>;

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm({ ...form, [k]: k === "postCount" ? Number(e.target.value) : e.target.value });

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setError(null); setPlan(null);
    try {
      const r = await generate({ data: form });
      if (r.ok) setPlan(r.plan); else setError(r.error);
    } catch { setError("Couldn't generate posts. Please try again."); }
    setBusy(false);
  }

  return (
    <div className="space-y-10">
      <form onSubmit={submit} className="grid gap-4 border border-border p-6 sm:grid-cols-2">
        <label className="sm:col-span-2 text-sm">Product or campaign *
          <input className={`${field} mt-1`} required minLength={2} value={form.product} onChange={set("product")} placeholder="e.g. Haven S-01 spruce sauna — Diwali home wellness" /></label>
        <label className="text-sm">Goal
          <input className={`${field} mt-1`} value={form.goal} onChange={set("goal")} placeholder="Consultation enquiries" /></label>
        <label className="text-sm">Audience
          <input className={`${field} mt-1`} value={form.audience} onChange={set("audience")} placeholder="Homeowners building villas in Delhi NCR" /></label>
        <label className="sm:col-span-2 text-sm">Key facts to use (only confirmed facts)
          <textarea className={`${field} mt-1 min-h-28`} value={form.keyPoints} onChange={set("keyPoints")} placeholder="Spruce standard, 6 wood upgrades, installed by VYRO's own team…" /></label>
        <label className="text-sm">Tone notes
          <input className={`${field} mt-1`} value={form.tone} onChange={set("tone")} placeholder="Calm, festive, understated" /></label>
        <label className="text-sm">Number of posts
          <select className={`${field} mt-1`} value={form.postCount} onChange={set("postCount")}>{[1, 2, 3, 4, 5].map((n) => <option key={n}>{n}</option>)}</select></label>
        <div className="sm:col-span-2 flex items-center justify-between">
          <button className={btn} disabled={busy}>{busy ? "Writing posts…" : "Generate posts"}</button>{signOut}
        </div>
        {error && <p className="sm:col-span-2 text-sm text-destructive">{error}</p>}
      </form>

      {plan && (
        <section className="space-y-6">
          {plan.posts.map((p, i) => <PostCard key={i} index={i + 1} post={p} />)}
          {plan.notes && <div className="border border-border bg-secondary/60 p-4 text-sm"><p className="eyebrow mb-1">Check before posting</p>{plan.notes}</div>}
        </section>
      )}
    </div>
  );
}

function PostCard({ index, post }: { index: number; post: SocialPlan["posts"][number] }) {
  const full = `${post.caption}\n\n${post.callToAction}\n\n${post.hashtags.map((h) => (h.startsWith("#") ? h : `#${h}`)).join(" ")}`;
  const [copied, setCopied] = useState(false);
  return (
    <article className="border border-border p-6">
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="font-display text-2xl">Post {index} · {post.format}</h3>
        <button className="text-xs underline" onClick={() => { navigator.clipboard.writeText(full); setCopied(true); setTimeout(() => setCopied(false), 1500); }}>{copied ? "Copied" : "Copy caption"}</button>
      </div>
      <p className="mt-3 text-sm"><span className="eyebrow mr-2">Concept</span>{post.concept}</p>
      <p className="mt-2 text-sm"><span className="eyebrow mr-2">Visual</span>{post.visualDirection}</p>
      <pre className="mt-4 whitespace-pre-wrap bg-secondary/60 p-4 font-sans text-sm">{full}</pre>
    </article>
  );
}
