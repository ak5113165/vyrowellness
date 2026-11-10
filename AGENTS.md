<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- The small uppercase section label style is a custom utility named `eyebrow` in src/styles.css. Never use Tailwind's built-in `overline` class name for it — it also applies a text-overline decoration.
- Keep confirmed Cold Plunge launch facts and external-chiller ratings in src/content/site.ts; product specification views and tests consume those values to avoid conflicting claims across models.
- Return JSON-LD structured data in the route head `scripts` array, never as a `meta` entry — TanStack's meta type rejects it and the build fails.
- In src/components/enquiry-form.tsx keep every hook above the component's early returns, and never set `shouldUnregister: true` on the consumer form — it drops the hidden `kind` field, so submits fail validation with no visible error.
