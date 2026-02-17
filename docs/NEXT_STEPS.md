# Next Steps

This file is **forward-looking only**. Completed work should move to `PROJECT_LEDGER.md`.

Current date: 2026-02-16

## Current status (1 paragraph)

Phase 1 (production environment + Django scaffold) is deployed on `hp-prd-web01` with nginx→gunicorn→Django, Postgres, TLS, and `bin/dj` operational. Static assets are committed and `collectstatic` is stable when run as OS user `heypage` (see `OPERATIONS.md`).

## Phase 2 goal (next milestone)

Deliver the first end-to-end vertical slice:

**Auth → feed page loads → create a basic post → render it in feed (server-rendered) → propose deletion UI stub (no voting logic yet).**

## Do next (in order)

### 1) Confirm baseline health (5 minutes)
- `curl -s https://heypage.com/healthz/`
- `sudo -u heypage -H bin/dj check`
- `sudo nginx -t`

### 2) Clean repo hygiene before new feature work
- Ensure `.pyc` and `__pycache__/` are ignored (confirm `.gitignore` covers this).
- Confirm docs references are consistent with `CANONICAL_PATHS.md` and `OPERATIONS.md`.

### 3) Implement minimal Feed surface
- Create `apps/feed/` routes + views if not already present.
- Add `/` behavior:
  - anon: render login/register (`templates/accounts/login_register.html`)
  - authed: render feed (`templates/feed/feed.html`)

### 4) Create a minimal Post model + migration
- Decide “post-like target” modeling option A vs B (record in `PROJECT_LEDGER.md`).
- Implement MVP:
  - `Post(author, body, created_at, updated_at)`
- Add basic create form on feed (POST to create).

### 5) Render posts in feed
- Query recent posts
- Render using a reusable template component (see `COMPONENTS_AND_INCLUDES.md` for recommended layout)

### 6) Stub moderation UI (no logic yet)
- Add “Propose deletion” affordance on a post card
- Render the locked UI states as static stubs (PROPOSED / VOTED) behind temporary conditions
- Keep the copy consistent with `ARCHITECTURE_SNAPSHOT.md`

## Definition of done (Phase 2 milestone)

- Visiting `/` as anon shows login/register.
- Visiting `/` as authed shows feed with composer and post list.
- Creating a post works and displays immediately.
- Post cards render a “Propose deletion” stub panel.
- Changes are committed and pushed to `origin/main`.
