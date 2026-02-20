# Next Steps

This file is forward-looking only. Completed work should move to `PROJECT_LEDGER.md`.

Current date: 2026-02-20

## Current status (1 paragraph)

Phase 1 (environment + Django scaffold) is deployed on `hp-prd-web01` with nginx→gunicorn→Django, Postgres, TLS, and `bin/dj` operational. Static serving is stable (nginx alias + directory perms fixed), and the template system is now locked as: `base.html` skeleton only, layout shells under `templates/layouts/`, chrome in includes, reusable blocks in components. Feed is rendering with converted templates, with minor UI deltas reserved for later refinement.

## Phase 2 goal (next milestone)

Deliver the first end-to-end vertical slice of real app data and routing:

**Auth → feed page loads → create a basic post → render it in feed (server-rendered) → stub moderation UI states (no voting logic yet) → add entity routing stubs for `/@username`-style root users and prefixed groups/businesses.**

(We can name Phase 2 “Core Models + Routing”. Template parity work continues opportunistically but is not the gating path.)

## Do next (in order)

### 1) Confirm baseline health (5 minutes)
- `curl -s https://heypage.com/healthz/`
- `sudo -u heypage -H bin/dj check`
- `sudo nginx -t`

### 2) Lock routing surfaces (no business logic yet)
- Confirm reserved-words policy file (where it lives and how it’s enforced).
- Add URL stubs:
  - `/feed/` (already)
  - `/search/` (route-level)
  - `/settings/` (route-level)
  - `/chat/` (route-level, different layout)
  - `/<username>/` (catch-all, registered last)
  - `/g/<slug>/`
  - `/b/<slug>/`

### 3) Implement minimal core models (MVP-first)
- `Post(author, body, created_at, updated_at)` plus migration.
- Optional (if needed immediately for routing stubs): lightweight “entity” models or placeholders:
  - Group (slug, name)
  - Business (slug, name)
- Keep “post-like” extensibility in mind, but do not over-generalize in Phase 2.

### 4) Feed write path (server-rendered)
- Feed view:
  - GET: render composer + recent posts list
  - POST: create post, redirect back to feed
- Render posts using a component include (post card).

### 5) Stub moderation UI states (no logic yet)
- Add “Propose deletion” affordance on post card
- Render locked UI states as static stubs behind temporary conditions:
  - PROPOSED
  - VOTE IN PROGRESS (viewer voted)

## Definition of done (Phase 2 milestone)

- Visiting `/feed/` as authed shows feed with composer and post list.
- Creating a post works and displays immediately.
- Post cards render “Propose deletion” panel stubs (copy consistent with docs).
- Entity routes exist as stubs (return 200 with placeholder template).
- Changes are committed and pushed to `origin/main`.
