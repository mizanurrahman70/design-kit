# How to use this skill

## 1. Start it
Type in Claude Code:

```
/nextjs-best-practices
```

Or just ask in plain words. It also triggers on phrases like "next js best practice", "folder structure",
"use suspense".

## 2. Example prompts

| Goal | Prompt |
|---|---|
| New project | `/nextjs-best-practices create a new Next.js project for an online store` |
| New feature | `/nextjs-best-practices add a products feature with list, card and filter` |
| New page | `/nextjs-best-practices add an /about page with Suspense and loading state` |
| Clean up old code | `/nextjs-best-practices refactor src/ to follow the rules` |
| Check only | `/nextjs-best-practices check my project against the rules` |

## 3. What happens
1. Claude reads your project (or scaffolds a new one).
2. It shows a **plan**: the list of files, one job per file.
3. After you approve, it builds the files.
4. It runs the checker and reports the result.

## 4. Run the checker yourself
From the project root:

```
node .claude/skills/nextjs-best-practices/scripts/check-rules.mjs src
```

It reports any file over 250 lines or with more than one top-level function.

## 5. The rules in one minute
- Max **250 lines** per file.
- **One function** per file. Helpers go in their own file.
- Each component has **its own folder** + `index.ts` (`button/button.tsx`).
- Utils: component `utils/` -> feature `utils/` -> global `lib/utils/` (move up only when shared).
- Server components by default; `"use client"` only for small interactive parts.
- Slow data wrapped in `<Suspense>` with a skeleton file; each route has `loading.tsx` + `error.tsx`.
- Tailwind only, colors from tokens in `globals.css`, `cn()` for class merging.

## 6. Use it in another project
Copy the whole `nextjs-best-practices` folder into that project's `.claude/skills/`.
To use it everywhere, copy it to `~/.claude/skills/` instead.

## 7. More detail
`folder-structure.md`, `code-rules.md`, `suspense-data.md`, `tailwind-ui.md`, `checklist.md`.
