# Server components, Suspense and data

## Server vs client
- **Default is Server Component.** It can be `async`, fetch directly, and ships no JS to the browser.
- Add `"use client"` only when the component needs state, effects, event handlers, browser APIs or
  client-only libraries.
- Keep client components small and at the leaves. Pass server-rendered content in as `children`
  instead of making a whole page a client component.
- Never import a server-only module into a client component. Mark secrets and DB code with
  `import "server-only"`.

## Data fetching
- Fetch in Server Components by calling a function from `features/<f>/services/`.
- One service per file: `get-products.ts`, `get-product-by-id.ts`.
- Wrap services used in several places with React `cache()` so one request dedupes:

```ts
// features/products/services/get-product-by-id.ts
import "server-only";
import { cache } from "react";
import type { Product } from "../types/product";

export const getProductById = cache(async (id: string): Promise<Product> => {
  const res = await fetch(`${process.env.API_URL}/products/${id}`, {
    next: { revalidate: 60, tags: [`product-${id}`] },
  });
  if (!res.ok) throw new Error(`Failed to load product ${id}`);
  return res.json();
});
```

- Start independent fetches in parallel (`Promise.all`), never in a waterfall.
- Pick caching on purpose: `revalidate` for semi-static, `cache: "no-store"` for per-user data,
  tags + `revalidateTag` after mutations.
- Mutations are Server Actions in `features/<f>/actions/`, validated with zod, then call
  `revalidatePath` or `revalidateTag`.

## Suspense pattern
The page renders the shell instantly. Each slow block streams in behind its own boundary.

```tsx
// app/products/page.tsx
import { Suspense } from "react";
import { ProductList, ProductListSkeleton } from "@/features/products/components/product-list";

export default function ProductsPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Products</h1>
      <Suspense fallback={<ProductListSkeleton />}>
        <ProductList />
      </Suspense>
    </main>
  );
}
```

```tsx
// features/products/components/product-list/product-list.tsx  (async server component)
import { getProducts } from "../../services/get-products";
import { ProductCard } from "../product-card";

export async function ProductList() {
  const products = await getProducts();
  return (
    <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((p) => (
        <li key={p.id}><ProductCard product={p} /></li>
      ))}
    </ul>
  );
}
```

```ts
// features/products/components/product-list/index.ts
export { ProductList } from "./product-list";
export { ProductListSkeleton } from "./product-list-skeleton";
```

### Suspense rules
1. Wrap each independent slow section in its own `<Suspense>`. Do not wrap the whole page in one.
2. The fallback is always a dedicated skeleton file, same dimensions as the real content to avoid
   layout shift. Never a bare "Loading..." text.
3. The component inside Suspense does the awaiting; the page itself stays fast.
4. Components reading `searchParams` or dynamic APIs must be inside a Suspense boundary.
5. Use `loading.tsx` for the whole route transition, and finer `<Suspense>` for sections inside.

## Special route files (add for each new segment)
- `loading.tsx`: instant fallback while the segment streams. Server component, uses a skeleton.
- `error.tsx`: must be `"use client"`, receives `error` and `reset`, shows a friendly retry UI.
- `not-found.tsx`: shown when `notFound()` is called.
- `global-error.tsx` at the root for layout-level failures.

```tsx
// app/products/error.tsx
"use client";

import { Button } from "@/components/ui/button";

export default function ProductsError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div role="alert" className="mx-auto max-w-md py-24 text-center">
      <h2 className="text-xl font-semibold">Something went wrong</h2>
      <p className="mt-2 text-muted">Please try again.</p>
      <Button className="mt-6" onClick={reset}>Try again</Button>
    </div>
  );
}
```

## Metadata and performance
- Export `metadata` or `generateMetadata` from each `page.tsx`.
- Use `next/image` with `width`/`height` or `fill` + `sizes`; use `priority` only for the LCP image.
- Use `next/font` for fonts (no external CSS links).
- Use `next/dynamic` for heavy client-only widgets (charts, editors).
- Keep `"use client"` boundaries low so bundles stay small.
