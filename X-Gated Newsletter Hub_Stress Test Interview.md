# X-Gated Newsletter Hub: Stress Test Interview

Comprehensive Q&A from planning phase. All assumptions verified and locked.

## Decision Summary

### Verification & Access
- **Process**: Manual DM welcome + allowlist addition
- **Friction Budget**: 48 hours (consistent with brand)
- **Scale**: Max 50 subscribers in 2 years

### Content Model
- **Publishing**: Draft → Preview → Publish workflow
- **Storage**: Database (not version-controlled for v1)
- **Rollback**: Yes, Ernest can unpublish anytime

### Auth & Sessions
- **Method**: Standard session cookies (no magic links)
- **Model**: Login once, stay logged in across visits
- **Sharing**: Not acceptable—clients can share tweets, not content links

### Access Expiry
- **Strategy**: Natural expiry (monthly X subscription)
- **Automation**: Manual removal if needed
- **Re-verification**: Not required for v1

### Admin Workflow
- **Scale Plan**: Manual until 100 subscribers; then re-evaluate
- **Client Notes**: Yes—dashboard remembers history/interests
- **Automation**: Forever-manual for local relationship focus

### X Integration
- **Subscriber Status**: Not exposed by X API (totally fine)
- **"Ask on X"**: Simple pre-filled intent URLs (no tracking for v1)
- **Canonical Posts**: Nice-to-have, defer to later

### Deployment
- **Separation**: Code via Docker; content via admin UI
- **Standards**: Follow existing deployment patterns
- **Mastra Integration**: Future enhancement (v2/v3)

---

## Core Insight

Reframed from "scalable newsletter platform" to "local relationship tool."

Ernest is a tradesperson sharing work with 30–50 recurring clients. All decisions now reflect that reality: manual verification becomes the relationship moment, 48-hour response time is on-brand, and scaling is genuinely limited (if it hits 100 in a year, he'll rebuild smarter).

---

For full details, see X-GATED_NEWSLETTER_HUB_PRD.md
