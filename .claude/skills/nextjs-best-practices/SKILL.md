---
name: nextjs-best-practices
description: Build or refactor Next.js (App Router, TypeScript, Tailwind) code with a strict professional structure - feature folders, one folder per component, Suspense with skeleton files, max 250 lines per file, one function per file, and scoped utils. Use when the user asks to create a Next.js project, page, feature, component or API, asks for "next js best practice", "folder structure", "suspense", or invokes /nextjs-best-practices.
---

# Next.js Best Practices

Write Next.js code the way a senior engineer on a large team would: small files, clear ownership,
server-first rendering, streaming with Suspense, and Tailwind-only styling.

Supporting files (read the ones you need):
- `folder-structure.md`: full project tree and where every kind of file goes
- `code-rules.md`: 250-line limit, one function per file, naming, imports, util placement
- `suspense-data.md`: server vs client components, Suspense, loading/error files, data fetching
- `tailwind-ui.md`: Tailwind v4 setup, tokens, `cn()`, professional UI rules
- `checklist.md`: final check before reporting done
- `scripts/check-rules.mjs`: automatic check for line limit and one-function-per-file

## Hard rules (never break)
1. **No file over 250 lines.** Split it before it gets there.
2. **One function (or component) per file.** Helpers get their own file in the right `utils/` folder.
3. **Every component lives in its own folder**, named like the component (kebab-case), with an `index.ts`.
4. **Utils live at the narrowest scope that works:**
   component `utils/` -> feature `utils/` -> global `lib/utils/`. Move up only when a second user appears.
5. **Server Components by default.** `"use client"` only on small interactive leaf components.
6. **Every slow data block is wrapped in `<Suspense>`** with its own skeleton file. Each route has
   `loading.tsx` and `error.tsx`.
7. **Tailwind only.** No inline styles, no CSS modules, no hardcoded hex colors in components. Use tokens.
8. **TypeScript strict**, `@/` alias, no `any`.

## Workflow

### Step 1: Inspect
- If a Next.js project exists, read `package.json`, `tsconfig.json`, `src/` tree, and `globals.css`.
  Follow its existing conventions where they do not break the hard rules.
- If it is new, scaffold with `npx create-next-app@latest` (TypeScript, Tailwind, App Router, `src/` dir,
  `@/*` alias), then create the folders from `folder-structure.md`.

### Step 2: Plan the files
Before writing code, list every file you will create with its single responsibility and its folder.
Show this list to the user for non-trivial work. Decide for each helper: component scope, feature scope or global.

### Step 3: Build
- Routes in `app/` stay thin: they compose feature components and wrap slow parts in `<Suspense>`.
- Fetching lives in `features/<name>/services/`, one function per file.
- Create the skeleton file together with every async component.
- Add `loading.tsx` and `error.tsx` for each new route segment.

### Step 4: Verify
- Run `node .claude/skills/nextjs-best-practices/scripts/check-rules.mjs src` and fix every violation.
- Run `npx tsc --noEmit` and `npm run lint` if available.
- Walk through `checklist.md`.

### Step 5: Report
Short summary: files created (grouped by folder), rule-check result, anything intentionally skipped.
Do not claim a check passed unless you ran it.
