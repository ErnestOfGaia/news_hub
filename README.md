# News Hub — news.ernestofgaia.xyz

A content publication by Ernest of Gaia. Build logs, trade observations, and honest notes on working with AI — written on the Oregon coast.

**This site is fully public.** No login, no paywall, no hoops. Read it, share it, subscribe to the RSS feed if that's your thing.

---

## What's Here

Three content series:

**The Build Log** — project updates from active software builds. What got built, what broke, what's next. Technical enough to be useful, plain enough that you don't need a CS degree to follow along.

**New News** — observations on AI tools and how they're changing daily work. Claude, Google AI, ChatGPT. Not theoretical — what's actually working for real people doing real jobs.

**The Jules Experience** — Ernest's running account of using Jules (Google's AI coding agent) to build this site. One honest issue per sprint. What Jules got right, what needed fixing, what the workflow actually feels like.

---

## Tech Stack

- **Next.js 15** (App Router, TypeScript strict mode)
- **Tailwind CSS**
- **SQLite** via `better-sqlite3`
- **Admin auth:** single env-var password — no OAuth, no user accounts
- **Deployment:** Docker + nginx on Hostinger VPS

Content is stored in a SQLite database. The schema supports a future premium tier (`tier: 'free' | 'premium'`) without breaking changes — but Phase 1 is fully public.

---

## Local Development

```bash
cp .env.example .env        # Set ADMIN_PASSWORD
npm install
npm run dev                 # http://localhost:3000
```

The SQLite database is created automatically at `./data/news.db` on first run.

## Production Deploy

```bash
docker compose up -d --build
```

Nginx on the host proxies `news.ernestofgaia.xyz` → container port 3001. TLS via Certbot / Let's Encrypt.

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx               Public home feed
│   ├── articles/[slug]/       Full article pages
│   ├── about/                 About Ernest
│   └── admin/                 Password-gated admin panel
├── components/
│   ├── layout/                Header, Footer, PostCard, ArticleCard
│   └── ui/                    MarkdownRenderer, XDiscussButton
├── lib/
│   ├── db.ts                  SQLite client + schema init
│   ├── auth.ts                Admin session cookie logic
│   └── utils.ts               slugify, formatDate, truncate
└── types/
    └── index.ts               Content, ContentTier, ContentSeries types
```

---

## For Jules

**Jules — read this before starting any issue.**

All architectural decisions are locked in [`ARCHITECTURE.md`](./ARCHITECTURE.md). Read it first. It is the single source of truth for every technical choice in this project. Do not re-decide anything documented there.

Before starting an issue:
1. Read `ARCHITECTURE.md` — decisions are made, not open questions
2. Read `CONTRIBUTING.md` — conventions, naming, do's and don'ts
3. Read the issue carefully — acceptance criteria are the contract
4. Open a PR when done; Ernest reviews and merges

Each issue is scoped to 2–4 hours of focused work. Stay within scope — do not add features not listed in the acceptance criteria. If you notice something out of scope that should be fixed, note it in the PR description rather than doing it.

**Do not install packages not in `package.json` without noting why in the PR.**

---

## Contact

Ernest of Gaia — Oregon coast
Text: 503-664-0546 · Email: eog@ernestofgaia.xyz · [ernestofgaia.xyz](https://ernestofgaia.xyz)
