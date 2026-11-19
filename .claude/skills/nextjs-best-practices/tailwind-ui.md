# Tailwind and professional UI

## Setup (Tailwind v4)
- `src/styles/globals.css` is the single source of design tokens:

```css
@import "tailwindcss";

@theme {
  --font-sans: var(--font-inter), ui-sans-serif, system-ui, sans-serif;
  --color-background: oklch(99% 0.003 250);
  --color-foreground: oklch(20% 0.02 260);
  --color-muted: oklch(52% 0.02 260);
  --color-border: oklch(92% 0.005 260);
  --color-brand: oklch(55% 0.18 255);
  --color-brand-foreground: oklch(99% 0 0);
  --radius-card: 0.75rem;
}
```

- Components use token classes (`bg-brand`, `text-muted`, `border-border`), never raw hex values.
- Dark mode: redefine the tokens under `.dark` or `@media (prefers-color-scheme: dark)`; components
  need no changes.
- Replace the sample palette above with the project's real brand colors.

## Class handling
- One global helper, `lib/utils/cn.ts`:

```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

- Variants use `class-variance-authority` in a separate `<component>-variants.ts` file.
- Every reusable component accepts `className` and merges it last with `cn()`.
- If a class list passes about 10 utilities and repeats, extract a component, not an `@apply` rule.

## Layout and spacing
- Container: `mx-auto max-w-6xl px-4 sm:px-6 lg:px-8`.
- Use a consistent spacing scale (4, 6, 8, 12, 16, 24). No arbitrary values like `mt-[13px]`.
- Mobile first: write the base style, then add `sm:`, `md:`, `lg:`.
- Prefer `grid` and `gap-*` over margins between siblings.

## Professional UI rules
- **Typography:** one font family via `next/font`, max 3 sizes per section, `tracking-tight` on large
  headings, body at `text-base` with `leading-relaxed`.
- **Color:** one brand color, neutral greys, one accent at most. Contrast must pass WCAG AA.
- **Components:** consistent radius and border everywhere; subtle shadows only.
- **States:** every interactive element has `hover:`, `focus-visible:` and `disabled:` styles.
- **Accessibility:** semantic HTML (`main`, `nav`, `section`, `button`), labels on inputs, `alt` on
  images, `aria-live` for async updates, visible focus rings, 44px touch targets.
- **Skeletons:** use `animate-pulse` on `bg-border` blocks with the same size as real content, plus
  `motion-reduce:animate-none`.
- **Empty and error states** are designed, not left blank.
- Avoid generic template looks (gradient hero with three icon cards, purple gradients, emoji icons).
  For visual direction, follow `../human-design/anti-ai-rules.md` (use Glob if the path does not
  resolve).

## Skeleton example

```tsx
// features/products/components/product-card/product-card-skeleton.tsx
export function ProductCardSkeleton() {
  return (
    <div aria-hidden className="space-y-3 motion-reduce:animate-none animate-pulse">
      <div className="aspect-4/3 rounded-card bg-border" />
      <div className="h-4 w-2/3 rounded bg-border" />
      <div className="h-4 w-1/3 rounded bg-border" />
    </div>
  );
}
```
