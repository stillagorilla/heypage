# Heypage Project Ledger

This repo is the source of truth for scope, decisions, and progress. This ledger is designed to prevent “context loss” over long builds.

## North Star
Build a Facebook-like social platform with a core differentiator: distributed, user-driven content moderation (democratic voting, regional standards).

## Current Phase
Phase 0 — Mockup Review + Architecture Blueprint

### Immediate Objectives
- Inventory all mockup pages and consolidate “context depictions” into the fewest dynamic templates.
- Identify reusable UI blocks (header/footer/nav/sidebars/cards/tiles/modals/etc.) and convert them into Django template includes.
- Produce an initial Django project scaffold aligned with performance, scalability, and maintainability.

## Mockups status (source of truth)
- Mockups are complete and committed under `mockups-original/`. :contentReference[oaicite:1]{index=1}
- The following pages have **no context depictions** (single canonical mockup each):
  - `feed.html` (home for logged-in users)
  - `search.html` (hard results page after submit / “View All”)
  - `login-register.html`
  - `reset-password.html`
  - `settings.html`
  - `chat.html`
  - `emails/index.html` (email template)
  - `coming-soon.html` (temporary production placeholder)

## Working Assumptions (v0)
- Backend: Django (with optional DRF for API), server-rendered templates first, progressive enhancement for interactivity.
- Real-time later: WebSockets (Django Channels) for chat/notifications if/when required.
- Database: TBD (MySQL acceptable; Postgres preferred for long-term features like search + complex moderation analytics).

## Decisions Log
Record decisions with date, decision, and rationale.

- [2026-01-31] Start-over confirmed; prior chats used only for requirements capture, not as authoritative implementation history.

## Milestones
### M0 — Mockup ingestion complete
- [ ] All HTML mockups committed under /mockups-original (or similar)
- [ ] Page inventory created (route map + contexts)
- [ ] UI block inventory created (includes/components list)

### M1 — Django skeleton runnable
- [ ] Django project created
- [ ] Base template + includes wired
- [ ] Static assets pipeline defined
- [ ] Auth flows stubbed (login/register/reset)

### M2 — Core social objects
- [ ] Profiles (user, business, group) + slug routing
- [ ] Feed (list view + filtering)
- [ ] Posts + media + comments + reactions (baseline)

### M3 — Moderation MVP
- [ ] Propose deletion
- [ ] Voting window + thresholds
- [ ] Outcome transitions (active → removed / kept)
- [ ] Audit trail

## Repo Conventions
- /docs = architecture + specs + ledgers
- /mockups-original = untouched originals
- /heypage = Django project (eventual)
- Prefer fewer dynamic templates; use context variables to express page-state differences.

## Continuity rule
After each milestone or design decision, update the appropriate file(s) in `/docs` so the repository remains the authoritative memory for the project.

## Open Risks
- Slug namespace collisions across user/business/group (single shared URL space).
- Moderation mechanics require precise rules to prevent gaming / sybil attacks.


