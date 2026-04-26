# The News Hub – X-Gated Newsletter Platform

**A local relationship platform for sharing a build log with 30–50 clients on the Oregon coast.**

---

## What This Is

A web app where Ernest publishes gated, long-form "build log" content. Readers subscribe on X (Twitter), get verified by Ernest personally, and access full articles on the news site. All community discussion happens on X; the site is the archive and read experience.

**Not a SaaS.** Not a scalable newsletter platform. It's how a tradesperson shares work with recurring local clients.

---

## Quick Links

- **PRD**: `X-GATED_NEWSLETTER_HUB_PRD.md` — Full spec, locked decisions
- **GitHub Issues Roadmap**: `GITHUB_ISSUES_ROADMAP.md` — 19 baby-step issues, 8 phases, 2–3 weeks
- **Stress Test Interview**: `X-Gated Newsletter Hub_Stress Test Interview.md` — All assumptions locked down
- **Build Log Routine**: `routines/BUILD_LOG_NEWSLETTER_ROUTINE.md` — How to run daily updates

---

## Core Concept

### User Journey

1. User follows Ernest on X, becomes a paid subscriber
2. Visits `news.ernestofgaia.xyz`, logs in with X OAuth
3. If not yet approved, sees "pending access" message
4. Ernest reaches out via DM (within 48 hours), adds them to allowlist
5. User logs back in, sees full article list
6. Reads gated articles, asks questions on X

### Admin (Ernest)

1. Write article in Markdown (admin UI)
2. Preview → publish to database
3. Post teaser on X (manual or template)
4. Approved users can read full article
5. Store client context notes (projects, interests) for relationship building

---

## Tech Stack (Planned)

- **Frontend**: Next.js (App Router, TypeScript)
- **Auth**: X OAuth
- **Backend**: Node.js
- **Database**: PostgreSQL or SQLite (tbd)
- **Deployment**: Docker on personal VPS (news.ernestofgaia.xyz)
- **Content Storage**: Database (no email newsletter, articles live on site)

**Future (v2/v3)**:
- Mastra SDK for smarter content drafting
- MCP Server for client context enhancement
- SEO optimization
- Analytics (view counts, engagement)

---

## Build Status

**Phase**: Prototype (Issue #1–19)  
**Timeline**: 2–3 weeks of focused work  
**Status**: Planning complete, architecture locked, ready to scaffold

### What's Done
- ✅ Stress-tested concept with 20+ questions
- ✅ Reframed from "scalable SaaS" to "local relationship platform"
- ✅ PRD finalized with all decisions locked
- ✅ 19-issue roadmap with vertical slices
- ✅ Build Log routine documented

### What's Next
- Issue #1: Project setup + Docker
- Issues #2–4: X OAuth login
- Issues #5–7: Admin approval system
- Issues #8–11: Article creation + publish
- Issues #12–14: Gating + content access
- Issues #15–19: Polish, test, deploy

---

## Getting Started (When Building)

### Prerequisites
- Node.js 18+
- Docker
- X OAuth credentials
- GitHub account

### Local Setup (Planned)

```bash
git clone https://github.com/ErnestOfGaia/news_hub.git
cd news_hub
npm install
cp .env.example .env.local
npm run dev
```

---

## Key Decisions (Locked)

| Decision | Choice | Why |
|----------|--------|-----|
| **Verification** | Manual DM + allowlist | Personal, relationship-building, max 50 subscribers |
| **Access Expiry** | Monthly (natural churn) | Simple, no re-verification needed |
| **Sessions** | Standard cookies | Familiar, no magic links |
| **Content Storage** | Database | Separate from code, easy to publish |
| **Community** | X only | No on-site comments |
| **Scale** | 30–50 clients in 2 years | Local, intentional, manageable |

---

## Contact & Feedback

**Questions?**  
Text: 503-664-0546 (SMS, "news hub")  
Email: eog@ernestofgaia.xyz

---

*Built on the Oregon coast, 2026.*
*Last updated: 2026-04-26*
