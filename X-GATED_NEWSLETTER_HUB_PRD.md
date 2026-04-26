# X-Gated Newsletter Hub – Product Requirements Document

**Project**: news.ernestofgaia.xyz  
**Version**: 1.0 (Prototype → MVP)  
**Date**: 2026-04-26  
**Owner**: Ernest (Local Trades / Permaculture)  

---

## 1. Executive Summary

A **local relationship platform** where Ernest publishes a shared "build log" of his permaculture work and local services. Clients subscribe via X (Twitter), get personally verified by Ernest, and access gated content (full articles) on the news site. All community discussion happens on X; the site is the **archive and read experience only**.

This is not a scalable SaaS. It's a tradesperson's tool for maintaining relationships with 30–50 local clients over 2 years, similar to how a plumber or electrician might share project updates with recurring customers.

---

## 2. Core Principles

- **Personal relationship first**: Manual verification is a feature, not a bottleneck. It's the moment Ernest connects with new clients.
- **Local + intentional**: Audience is local, growth is organic. Max 50 subscribers within 2 years.
- **Slow solutions**: 48-hour response time is acceptable and on-brand.
- **Clients, not influencer audience**: Subscribers are treated as tutoring/project clients, not meme-hungry followers.
- **X-first, site-second**: X is where discovery, community, and discussion happen. The news site is where approved clients read full articles.
- **Content is durable**: Articles become the permanent record of Ernest's build log.

---

## 3. Tech Stack (Planned)

- **Frontend**: Next.js (App Router, TypeScript)
- **Auth**: X OAuth
- **Backend**: Node.js
- **Database**: PostgreSQL or SQLite
- **Deployment**: Docker on VPS (news.ernestofgaia.xyz)

**Future (v2/v3)**: Mastra SDK, MCP Server, SEO, analytics

---

## 4. Key Locked Decisions

| Decision | Choice | Why |
|----------|--------|-----|
| **Verification** | Manual DM + allowlist | Personal, relationship-building, max 50 subscribers |
| **Access Expiry** | Monthly (natural churn) | Simple, no re-verification needed |
| **Sessions** | Standard cookies | Familiar, no magic links or sharing loopholes |
| **Content Storage** | Database | Separate from code, easy to publish without redeploy |
| **Community** | X only | No on-site comments, all discussion on X |
| **Scale** | 30–50 clients in 2 years | Local, intentional, manageable by one person |

---

## 5. Functional Requirements

### Must Have (v1/Prototype)
- X OAuth login
- User approval/allowlist system
- Session cookies
- Markdown editor for articles
- Publish/unpublish workflow
- Gated content (approved users only)
- Admin dashboard
- Splash page + login
- "Ask on X" button per article

### Nice to Have (v1)
- Article view counter
- Client context notes for Ernest
- Email notifications for new subscribers

### Defer (v2/v3)
- SEO optimization
- Canonical X thread linking
- Scheduled publish
- Analytics
- Community surfacing

---

## 6. Success Metrics (v1)

- ✅ X OAuth login works end-to-end
- ✅ Ernest can approve a subscriber via admin dashboard
- ✅ Ernest can write, preview, and publish an article
- ✅ Approved users can read published articles
- ✅ "Ask on X" button functional
- ✅ Admin dashboard is usable
- ✅ Deployed to news.ernestofgaia.xyz and tested

---

## 7. Build Timeline

- **Phase 0**: Project setup + Docker (1–2 days)
- **Phase 1**: X OAuth auth (2–3 days)
- **Phase 2**: Admin approval system (2–3 days)
- **Phase 3**: Article creation + publish (3–4 days)
- **Phase 4**: Gating content (2–3 days)
- **Phase 5–8**: Polish, test, deploy (4–5 days)

**Total**: 2–3 weeks of focused work

---

See the full PRD at: https://github.com/ErnestOfGaia/news_hub
