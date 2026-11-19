# Final checklist

Run through this before reporting done. Mark only what you actually verified.

## Structure
- [ ] Routes in `app/` are thin and only compose features
- [ ] Each component sits in its own kebab-case folder with an `index.ts`
- [ ] Skeleton files live next to the component they mimic
- [ ] Utils are at the narrowest scope (component -> feature -> `lib/utils`)
- [ ] No `utils.ts` / `helpers.ts` dumping files
- [ ] No feature imports another feature's internals

## Code limits
- [ ] `node .claude/skills/nextjs-best-practices/scripts/check-rules.mjs src` reports 0 violations
- [ ] No file over 250 lines
- [ ] One function or component per file

## Rendering
- [ ] Components are server components unless they need interactivity
- [ ] `"use client"` only on small leaf components
- [ ] Every slow async block has `<Suspense>` with a skeleton fallback
- [ ] Each new route segment has `loading.tsx` and `error.tsx`
- [ ] Independent fetches run in parallel
- [ ] Caching / revalidation chosen deliberately
- [ ] `metadata` exported from each page

## Styling
- [ ] Tailwind only, no inline styles or CSS modules
- [ ] Colors and fonts come from tokens in `globals.css`
- [ ] `cn()` used for conditional classes; `className` accepted by reusable components
- [ ] Hover, focus-visible and disabled states present
- [ ] Layout checked at mobile, tablet and desktop widths

## Quality
- [ ] `npx tsc --noEmit` passes
- [ ] `npm run lint` passes
- [ ] No `any`, no unused exports, no commented-out code
- [ ] External input validated with zod
- [ ] Images use `next/image`; fonts use `next/font`
