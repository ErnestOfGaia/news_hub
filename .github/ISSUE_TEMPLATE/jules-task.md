---
name: Jules Task
about: A scoped implementation task for the Jules AI coding agent
title: "[TASK] "
labels: jules
assignees: ''
---

## Context

<!-- Why this task exists and where it fits in the overall project. Jules reads ARCHITECTURE.md and CONTRIBUTING.md before starting — do not repeat what's there. Focus on the specific context this issue adds. -->

## Task

<!-- Exactly what to build. Be specific about file paths, function names, and behavior. Jules cannot ask follow-up questions — ambiguity becomes wrong code. -->

## Acceptance Criteria

<!-- Each item is a testable, binary outcome. Jules is done when all boxes can be checked. -->

- [ ] 
- [ ] 
- [ ] 

## Files to Create or Modify

<!-- List every file path Jules should touch. If a file should NOT be touched, say so. -->

**Create:**
- `src/...`

**Modify:**
- `src/...`

## Technical Notes

<!-- Constraints, library choices, patterns to follow. Reference ARCHITECTURE.md sections if relevant. -->

- Framework: Next.js 15 App Router, TypeScript strict, Tailwind CSS
- DB client: import `getDb` from `@/lib/db`
- Auth helper: import `requireAdmin` from `@/lib/auth`
- Do NOT add features beyond what's listed in acceptance criteria
- Do NOT install new packages without noting why in the PR

## Out of Scope

<!-- Explicitly list things Jules might reasonably add but should not. Prevents scope creep. -->

- 
