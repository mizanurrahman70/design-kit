# Code rules

## 1. Max 250 lines per file
- Count every line, including imports and blank lines.
- Aim for under 150. If a file passes 200, split it now.
- How to split a large component: extract sub-components into their own files in the same component
  folder, extract logic into a hook, extract pure helpers into `utils/`.

## 2. One function per file
- A file exports one main function or component. That function is the file's reason to exist.
- The file name matches it: `format-price.ts` exports `formatPrice`, `product-card.tsx` exports `ProductCard`.
- Allowed inside the file: tiny inline handlers (`onClick={() => setOpen(true)}`), and types or props
  interfaces used only by that file.
- Not allowed: a second named function, a second component, or a "helpers" block at the bottom.
  Move it to its own file.
- No `utils.ts`, `helpers.ts` or `common.ts` dumping files.

```ts
// BAD: lib/utils.ts exporting formatDate, formatPrice, slugify
// GOOD:
// lib/utils/format-date.ts   -> export function formatDate
// lib/utils/format-price.ts  -> export function formatPrice
// lib/utils/slugify.ts       -> export function slugify
```

## 3. Util placement (narrowest scope first)
1. Used by one component -> `<component>/utils/<name>.ts`
2. Used by several components in one feature -> `features/<f>/utils/<name>.ts`
3. Used by several features -> `lib/utils/<name>.ts`

Start at level 1. When a second consumer appears, move the file up one level and fix imports.
Never create a global util "just in case".

## 4. Naming
| Thing | Convention | Example |
|---|---|---|
| Files and folders | kebab-case | `product-card.tsx` |
| Components | PascalCase | `ProductCard` |
| Functions, variables | camelCase | `getProducts` |
| Hooks | `use` prefix | `useProductFilter` |
| Types, interfaces | PascalCase, no `I` prefix | `Product`, `ProductCardProps` |
| Constants | UPPER_SNAKE_CASE | `MAX_PRODUCTS` |
| Skeletons | `<component>-skeleton.tsx` | `product-card-skeleton.tsx` |
| Server actions | verb first | `create-product.ts` |

## 5. Exports
- Named exports everywhere. Default exports only where Next.js requires them
  (`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`, `route.ts` uses named HTTP verbs).
- Every component folder has an `index.ts` re-exporting the component (and its skeleton or types if public).

## 6. TypeScript
- `"strict": true`. No `any`; use `unknown` and narrow.
- Props are typed with an interface named `<Component>Props` in the same file (or `.types.ts` if long).
- Validate all external input (forms, route params, API bodies) with zod at the boundary.
- Prefer `type` imports: `import type { Product } from "../types/product"`.

## 7. Comments and clarity
- Names explain the code. Comment only the "why", never the "what".
- No commented-out code. No TODOs without an owner.

## 8. Error handling
- Services throw typed errors or return a result object; they never swallow errors silently.
- Route segments have `error.tsx`. Not-found cases call `notFound()`.
- Server actions return `{ ok: true, data }` or `{ ok: false, error }` instead of throwing to the client.

## 9. Imports order
1. React / Next
2. Third-party
3. `@/` absolute imports
4. Relative imports
5. Type imports last

Run `scripts/check-rules.mjs` to enforce rules 1 and 2 automatically.
