# Heypage Project Ledger

This repo is the source of truth for scope, decisions, and progress. This ledger is designed to prevent “context loss” over long builds.

## North Star
Build a Facebook-like social platform with a core differentiator: distributed, user-driven content moderation (democratic voting, regional standards).

## Current Phase
Phase 0 — Mockup Review + Architecture Blueprint

### Component extraction progress
- Confirmed core reusable components for most pages:
  - post composer
  - post card
  - comment thread (with variations)
  - deletion moderation voting panel (stateful)
These appear across feed + profile contexts and will be implemented as Django includes.

### Immediate Objectives
- Inventory all mockup pages and consolidate “context depictions” into the fewest dynamic templates.
- Identify reusable UI blocks (header/footer/nav/sidebars/cards/tiles/modals/etc.) and convert them into Django template includes.
- Produce an initial Django project scaffold aligned with performance, scalability, and maintainability.

## Mockups status (source of truth)
- Mockups are complete and committed under `mockups-original/`.
- The following pages have **no context depictions** (single canonical mockup each):
  - `feed.html` (home for logged-in users)
  - `search.html` (hard results page after submit / “View All”)
  - `login-register.html`
  - `reset-password.html`
  - `settings.html`
  - `chat.html`
  - `emails/index.html` (email template)
  - `coming-soon.html` (temporary production placeholder)

## Ledger entry — Business pages (closed state, edit modal, create business)
- Captured Business CLOSED banner state ("This business has closed.")
- Confirmed Edit Business modal exists in business-page.html with logo upload and category selector.
- Confirmed Create Business form supports multiple locations ("Add another location"), website, category, and upload.
- Confirmed Reviews UX includes rating summary + review composer with star buttons + review cards.
- Noted mock wiring inconsistency: "Other Social Profiles" edit button points to #bioModal on business-page, but #socialModal on my-profile.

## Working Assumptions (v0)
- Backend: Django (with optional DRF for API), server-rendered templates first, progressive enhancement for interactivity.
- Real-time later: WebSockets (Django Channels) for chat/notifications if/when required.
- Database: TBD (MySQL acceptable; Postgres preferred for long-term features like search + complex moderation analytics).

## Decisions Log
Record decisions with date, decision, and rationale.

- [2026-01-31] Start-over confirmed; prior chats used only for requirements capture, not as authoritative implementation history.
- Friends tab is accepted-only. Any "Add to Friends" rows shown inside Friends lists are treated as mock artifacts and will not be implemented.
- Decision: Reviews reuse post card pattern with review-specific inserts (stars + business preview).
- Email mock duplicate line ("You have new friend requests.") is a mock artifact. Implement deduped/grouped notification lines in production emails.
- Email logo asset `mockups-original/emails/images/image-1.png` should be served via absolute URL or embedded via CID for email client compatibility.
- Group membership requests/approvals will mirror Friend Requests UX and backend flow.
- Group Members page will follow the same context rules as Friends pages: admin context may include per-row kebabs; public/non-admin does not.
- Group listing uses a single reusable "group tile" grid include across public and owner contexts.
- Owner context adds: Create Group modal + Group Administration tab (admin/owner groups).
- Businesses owner page uses standard owner-context page_actions row above tabs with "Create Business" action.
- Business create flow requires repeatable locations ("Add another location") and an image upload at creation time.

### Decisions confirmed from feed.html (moderation)

- **Proposer auto-vote:** when a user proposes deletion, the system immediately records a YES vote for the proposer, so the panel renders the “Voted.” state for them right away.
- **Results visible before voting:** the “Agree?” (not yet voted) state still displays vote results (progress + representative bypass UI). Do not gate totals behind voting.
- **Resolved removal is a tombstone:** when deletion passes, the post-like card is suppressed (not hard-deleted) and renders as a minimal placeholder: “Content removed by vote.”
- **Resolved tombstone behavior:** tombstone variant should not render reactions/comments/vote controls (unless an admin/audit view is added later).

### Auth + email templates (mock-confirmed)

- Login and registration share a single public page template with two forms (Register + Login).
- Registration collects Name, Username, Email, Password, and requires Terms & Privacy acceptance.
- Password reset request page collects Email and sends a reset link.
- Email template supports multi-item notification emails (digest-style) and includes unsubscribe + notification settings links.
- Social auth buttons (Google/Facebook) are depicted; MVP can ship with buttons disabled/hidden until OAuth is implemented.

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

- Business Team tab reuses the friends-list row pattern (team members are users with friend actions).
- Business Jobs tab uses a post-like job card with kebab actions (Edit/Delete/Propose Deletion), expandable details ("Show more"), reactions/share, and comment composer.
- Jobs should be modeled as a first-class content type and may share moderation/comments/reactions via polymorphic targets.

### Reviewed mockups
- login/register page and reset password page reviewed and mapped to Django auth templates and custom user model requirements.

### URL scheme locked (public entity URLs)

Decision:
- Users: `/<username>/`
- Groups: `/g/<slug>/`
- Businesses: `/b/<slug>/`

Notes:
- The root-level user route is a catch-all and must be registered last in Django URL patterns.
- Maintain a reserved-words list so usernames cannot collide with system routes or entity prefixes.

### Business edit modals clarified (two different "Edit Business" actions)

Decision:
- Business page has two edit entry points that are both titled "Edit Business" but serve different purposes:
  1) Header kebab "Edit" opens the identity modal (name/logo/category).
  2) About card pencil opens the details modal (about/contact/locations).
- These must be implemented as two distinct modals with distinct IDs and distinct partials to avoid wiring confusion.

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

















