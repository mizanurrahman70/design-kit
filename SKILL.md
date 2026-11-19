# Skills Guide

Type `/skill-name` and say what you want. That's it.

| I want to... | Type | Example |
|---|---|---|
| Design a new client website | `/human-design` | `/human-design garment factory, B2B buyers` |
| Add a section to an existing site | `/section-design` | `/section-design add pricing section to index.html` |
| Build a Next.js app or feature | `/nextjs-best-practices` | `/nextjs-best-practices add a products feature` |
| Check if a design looks AI-made | ask the `design-critic` agent | `review my design in index.html` |

## Tips
- Put the logo, photos and real text in the project folder first.
- Claude shows a plan first. Say yes, then it builds.

## Next.js rules (short)
- Max 250 lines per file
- One function per file
- Each component has its own folder
- Use Suspense with a skeleton for slow data
- Tailwind only

Check the rules: `node .claude/skills/nextjs-best-practices/scripts/check-rules.mjs src`

## Use in another project
Copy the skill folder into that project's `.claude/skills/`.
