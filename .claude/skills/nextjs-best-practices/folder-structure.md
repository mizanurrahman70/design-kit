# Folder structure

```
src/
├── app/                              # ROUTES ONLY. Thin files that compose features.
│   ├── layout.tsx
│   ├── page.tsx
│   ├── loading.tsx                   # route-level Suspense fallback
│   ├── error.tsx                     # "use client" error boundary
│   ├── not-found.tsx
│   ├── (marketing)/about/page.tsx    # route groups for layout separation
│   └── api/products/route.ts         # route handler, one HTTP concern per file
│
├── features/                         # one folder per business feature
│   └── products/
│       ├── components/
│       │   ├── product-card/
│       │   │   ├── product-card.tsx
│       │   │   ├── product-card-skeleton.tsx
│       │   │   ├── utils/            # used ONLY by product-card
│       │   │   └── index.ts
│       │   └── product-list/
│       │       ├── product-list.tsx
│       │       ├── product-list-skeleton.tsx
│       │       ├── utils/sort-products.ts
│       │       └── index.ts
│       ├── actions/create-product.ts     # server actions, "use server"
│       ├── services/get-products.ts      # server-side data fetching
│       ├── hooks/use-product-filter.ts   # client hooks for this feature
│       ├── utils/format-price.ts         # shared by several product components
│       ├── types/product.ts
│       ├── schemas/product-schema.ts     # zod validation
│       └── constants/product-limits.ts
│
├── components/                       # SHARED UI used by 2+ features
│   ├── ui/                           # primitives
│   │   ├── button/
│   │   │   ├── button.tsx
│   │   │   ├── button-variants.ts
│   │   │   ├── button.types.ts
│   │   │   └── index.ts
│   │   └── card/...
│   └── layout/
│       └── site-header/
│           ├── site-header.tsx
│           ├── nav-links.tsx
│           ├── utils/get-active-link.ts
│           └── index.ts
│
├── lib/
│   ├── utils/                        # GLOBAL utils, one function per file
│   │   ├── cn.ts
│   │   └── format-date.ts
│   ├── api/fetcher.ts                # shared fetch wrapper
│   └── env.ts                        # validated environment variables
│
├── hooks/                            # GLOBAL hooks (use-debounce.ts ...)
├── types/                            # GLOBAL types
├── config/site.ts                    # site name, nav, metadata defaults
└── styles/globals.css                # Tailwind import + @theme tokens
```

## Where does a new file go?

| File is... | Put it in |
|---|---|
| A page or layout | `app/<route>/` |
| A component used by one feature | `features/<f>/components/<name>/` |
| A component used by 2+ features | `components/ui/<name>/` or `components/layout/<name>/` |
| A skeleton | Same folder as the component it mimics |
| A helper used by one component | `<component-folder>/utils/` |
| A helper used by several components of one feature | `features/<f>/utils/` |
| A helper used by several features | `lib/utils/` |
| A data fetch | `features/<f>/services/` |
| A mutation | `features/<f>/actions/` |
| A type used by one feature | `features/<f>/types/` |
| A type used everywhere | `types/` |

## Import rules
- Always import through the folder `index.ts`:
  `import { Button } from "@/components/ui/button"`
- A feature never imports from another feature's internals. If two features need it, move it to
  `components/` or `lib/`.
- `app/` may import from `features/`, `components/`, `lib/`. Nothing imports from `app/`.
- `lib/` imports from nothing in `features/` or `components/`.
