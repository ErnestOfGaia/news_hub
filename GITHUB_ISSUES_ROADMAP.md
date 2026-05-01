# GitHub Issues Roadmap: The News Hub

**Project**: news.ernestofgaia.xyz
**Timeline**: 2–3 weeks
**Total Issues**: 19

This roadmap breaks down the construction of the X-Gated Newsletter Hub into vertical slices, following the phases defined in the PRD.

---

## Phase 0: Foundation
*Goal: Working local development environment with database connectivity.*

- **[ ] Issue #1: Project setup & Docker configuration**
  - Initialize Next.js (App Router, TypeScript, Tailwind).
  - Set up `Dockerfile` and `docker-compose.yml` for local PostgreSQL/SQLite.
  - Configure `.env.local` templates.

---

## Phase 1: Authentication
*Goal: Users can log in using their X (Twitter) accounts.*

- **[ ] Issue #2: Set up NextAuth with X (Twitter) provider**
  - Install dependencies and configure `[...nextauth]/route.ts`.
  - Handle OAuth callback and basic session creation.
- **[ ] Issue #3: Create database schema for Users & Accounts**
  - Define schema to store X profiles, IDs, and internal `status` (pending/approved).
  - Sync X login data to database.
- **[ ] Issue #4: Build Splash/Login page UI**
  - Create the public landing page explaining the platform.
  - Add the "Sign in with X" button and handle error states.

---

## Phase 2: User Approval System
*Goal: Ernest can manually verify and approve clients.*

- **[ ] Issue #5: Build Admin Dashboard (Users View)**
  - Create a protected `/admin` route (restricted to Ernest's X ID).
  - Display a table of all registered users and their current status.
- **[ ] Issue #6: Implement approval/rejection API**
  - Create Server Actions/API routes to change a user's status to `approved`.
  - Add client context notes schema (projects, interests) and UI for Ernest to edit them.
- **[ ] Issue #7: "Pending Access" UI for users**
  - Update the logged-in home page to show a "Pending Verification" message for new logins.

---

## Phase 3: Content Creation
*Goal: Ernest can write and publish Markdown articles.*

- **[ ] Issue #8: Create database schema for Articles**
  - Define schema (title, slug, markdown content, published status, created/updated timestamps).
- **[ ] Issue #9: Build Admin Dashboard (Articles View)**
  - Create a UI to list drafts and published articles in `/admin`.
- **[ ] Issue #10: Build Markdown Editor UI**
  - Integrate a Markdown text area with a live preview toggle for drafting.
- **[ ] Issue #11: Implement Publish/Unpublish workflow**
  - Create Server Actions/API routes to save drafts and toggle publish status.

---

## Phase 4: Gated Content Delivery
*Goal: Approved users can read full articles.*

- **[ ] Issue #12: Build Reader Home Page (Article Feed)**
  - Display a list of published articles for `approved` users.
  - Implement basic pagination or infinite scroll.
- **[ ] Issue #13: Build Individual Article Page**
  - Render Markdown content dynamically based on the article slug.
  - Add server-side protection to ensure only `approved` users can view the content.
- **[ ] Issue #14: Implement "Ask on X" functionality**
  - Add a button at the bottom of articles that generates a pre-filled intent URL for X, referencing the article.

---

## Phase 5-8: Polish, Test & Deploy
*Goal: Production-ready MVP.*

- **[ ] Issue #15: Styling & UI Polish**
  - Refine typography, spacing, and responsive design using Tailwind.
  - Ensure the reading experience is excellent on mobile.
- **[ ] Issue #16: Implement Article View Counter (Nice-to-have)**
  - Add a simple page view incrementer to the database for published articles.
- **[ ] Issue #17: Add Email Notifications (Nice-to-have)**
  - Set up a basic webhook/email alert for Ernest when a new user registers and needs verification.
- **[ ] Issue #18: Comprehensive Testing**
  - Write basic tests for critical paths (Auth, Article Access rules).
  - Perform manual QA on the "Pending" -> "Approved" flow.
- **[ ] Issue #19: Production Deployment**
  - Finalize Docker build for the VPS.
  - Set up production environment variables, database, and domain (news.ernestofgaia.xyz).
