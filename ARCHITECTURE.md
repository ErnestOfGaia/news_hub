# Architecture — News Hub

All decisions below are **locked**. Jules and contributors should treat this document as the source of truth. Do not re-decide these during implementation.

---

## Access Model

**Phase 1:** All content is publicly readable. No authentication required to read. Admin panel at `/admin` is password-gated via env var.

**Future Phase 2:** Premium content tier added. Users will be able to create accounts and subscribe. The `tier` column in the `content` table supports this without schema changes.

---

## Framework

- **Next.js 15** with App Router (not Pages Router)
- **TypeScript strict mode** — `"strict": true` in tsconfig, no `any` without comment
- **React 19**
- **Tailwind CSS** for all styling — no CSS modules, no styled-components
- **No client components** unless interactivity strictly requires it — default to Server Components

---

## Database

- **SQLite** via `better-sqlite3` (synchronous API, no async needed)
- Database file: path from `DATABASE_URL` env var (default `./data/news.db`)
- Schema is initialized on startup in `src/lib/db.ts`
- **No ORM** — raw SQL only, kept simple and readable

### Schema

```sql
CREATE TABLE IF NOT EXISTS content (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  slug          TEXT UNIQUE NOT NULL,
  title         TEXT NOT NULL,
  body          TEXT NOT NULL,
  excerpt       TEXT,
  type          TEXT NOT NULL DEFAULT 'post',
  tier          TEXT NOT NULL DEFAULT 'free',
  published     INTEGER NOT NULL DEFAULT 0,
  x_thread_url  TEXT,
  created_at    TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at    TEXT NOT NULL DEFAULT (datetime('now'))
);
```

- `type`: `'post'` (short-form, LinkedIn-style) | `'article'` (long-form build log)
- `tier`: `'free'` (public) | `'premium'` (future subscription gating)
- `published`: `0` (draft) | `1` (live)

**Phase 1 public queries always filter:** `WHERE published = 1 AND tier = 'free'`

---

## Admin Authentication

- Single admin user: Ernest
- Auth: `ADMIN_PASSWORD` env var checked in `src/lib/auth.ts`
- Admin routes live under `src/app/admin/` with a layout that enforces the password check
- Password submitted as a form (no JWT, no sessions needed for a single user)
- Cookie: `admin_session=<hashed_token>`, 7-day expiry, httpOnly, sameSite strict

---

## Content Rendering

- Article body stored as **Markdown** in the database
- Rendered in the browser using `react-markdown` + `remark-gfm`
- `MarkdownRenderer` component wraps this with Tailwind prose styling
- No MDX — content is in the database, not in files

---

## Routing

| Route | Description |
|---|---|
| `/` | Home feed — published free content, newest first |
| `/articles/[slug]` | Full article page |
| `/about` | About Ernest page |
| `/admin` | Admin dashboard (password-gated) |
| `/admin/new` | New post/article form |
| `/admin/[id]` | Edit existing content |
| `/api/content` | POST — create content (admin only) |
| `/api/content/[id]` | PUT, DELETE — update/delete content (admin only) |
| `/rss.xml` | RSS feed — published free content |
| `/sitemap.xml` | Auto-generated sitemap |

---

## SEO

- `layout.tsx` sets default `metadata` — title, description, OG image, canonical URL
- Each article page overrides metadata with article title/excerpt
- `robots.txt` allows all crawlers (public site)
- Sitemap generated at `/sitemap.xml` via Next.js `generateSitemap`

---

## Deployment

- Docker multi-stage build (see `Dockerfile`)
- `docker-compose.yml` maps host port 3001 → container port 3000
- Host nginx reverse proxies `news.ernestofgaia.xyz` → port 3001
- TLS via Certbot / Let's Encrypt on the host (not in container)
- SQLite database persisted via Docker volume mount at `./data/`
- `next.config.ts` sets `serverExternalPackages: ['better-sqlite3']` to prevent webpack bundling errors

---

## What Is NOT in Scope for Phase 1

- User accounts / auth (beyond admin password)
- Premium content access
- Email or SMS delivery
- Payments or subscriptions
- Comments (discussion happens on X)
- Search
- Tags or categories
