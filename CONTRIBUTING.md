# Contributing — News Hub

Guidelines for Jules (AI coding agent) and any future contributors.

---

## Before You Start

1. Read `README.md` for the project overview and local setup
2. Read `ARCHITECTURE.md` — all technical decisions are made there; do not re-decide them
3. Read the issue you're assigned — acceptance criteria are the contract

---

## Conventions

### TypeScript

- Strict mode is on — no `any` unless you add a comment explaining why
- Prefer `type` over `interface` for data shapes
- All server-only code (DB calls, auth) stays in `src/lib/` or Route Handlers
- Never import `better-sqlite3` in a Client Component

### File Naming

- Components: PascalCase (`ArticleCard.tsx`)
- Utilities/lib: camelCase (`db.ts`, `auth.ts`)
- Route files: `page.tsx`, `layout.tsx`, `route.ts` (Next.js App Router convention)

### Components

- Default to **Server Components** — only add `'use client'` when state or browser APIs are strictly required
- One component per file
- Props defined as a `type` at the top of the file, not inline

### Styling

- **Tailwind only** — no inline styles, no CSS modules
- Use Tailwind's `prose` class from `@tailwindcss/typography` for rendered Markdown
- Mobile-first responsive design (`sm:`, `md:`, `lg:` breakpoints)

### Database

- All DB access goes through `src/lib/db.ts`
- Use the `getDb()` function — never instantiate `Database` directly elsewhere
- Raw SQL only — no ORMs
- Always parameterize queries (`?` placeholders) — never string-interpolate user input

### Admin Auth

- Use the `requireAdmin()` helper from `src/lib/auth.ts` in any server action or route handler that mutates data
- The admin layout (`src/app/admin/layout.tsx`) handles the session check for page routes

---

## PR Guidelines

- One issue per PR
- PR title: `[#issue-number] Short description`
- Include a brief description of what was built and any decisions made
- Do not include unrelated cleanup or refactors
- The PR is Ernest's chance to review — keep diffs focused and readable

---

## What Jules Should NOT Do

- Install packages not in `package.json` without noting why in the PR
- Add features not listed in the issue's acceptance criteria
- Use client-side data fetching (`useEffect` + `fetch`) when a Server Component can do it
- Add comments explaining *what* code does — only add comments for *why* something non-obvious is happening
- Create placeholder or "TODO" implementations — if something is out of scope, note it in the PR description instead
