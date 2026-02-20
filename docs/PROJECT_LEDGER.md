# Project Ledger (decisions + notable changes)

This file is the historical “why” log. If something was discovered the hard way, it belongs here so we don’t repeat it.

Last updated: 2026-02-20

## 2026-02-20 — Phase 1 scaffold (templates + static pipeline) stabilized

### Template architecture locked (base + shells + includes + components)
- Confirmed canonical rule set:
  - `templates/base.html` is **skeleton only** (document chrome, blocks, scripts). It does **not** own grid layouts.
  - Each layout family gets a shell template under `templates/layouts/` (page templates never rebuild the grid).
  - Shells include their own chrome (top nav, side nav) and define the page grid.
  - Components are reusable content blocks under `templates/components/`.
- Naming convention:
  - Entity layout shell: `templates/layouts/entity_shell.html`
  - Route-level 2-column shell (used by feed/search/settings): `templates/layouts/2col_shell.html`
  - Chat shell: `templates/layouts/chat_shell.html` (reserved for later)
- “Canonical template taxonomy” is treated as locked.

### Feed route wired to Django view + template conversion started
- `/feed/` resolves to `apps.feed.views.feed_view`.
- `feed/feed.html` converted to extend the appropriate layout shell pattern (and does not re-declare base skeleton).

### Static pipeline failure mode discovered and fixed (manifest storage + favicon)
- Root cause of 500 during feed render:
  - Django `ManifestStaticFilesStorage` raised:
    - `Missing staticfiles manifest entry for 'img/favicon.ico'`
  - Fix:
    - Updated head favicon reference to the actual committed asset location:
      - `static/img/favicon/favicon.ico`
- Additional “gotcha” fixed:
  - Missing `{% load static %}` in several included templates caused runtime template errors.
  - Added `{% load static %}` at top of affected includes/components.

### Nginx 403 on /static/ discovered and fixed (directory traversal perms)
- Symptom:
  - `/static/...` returned `403 Forbidden` from nginx even though alias was correct.
- Root cause:
  - nginx worker user (`www-data`) could not traverse `/srv/heypage` (directory permissions too restrictive).
- Fix:
  - Ensured directory execute (traverse) permissions for nginx:
    - `/srv` and `/srv/heypage` set to `0755`
    - staticfiles tree set to directories `0755`, files `0644`
- Result:
  - `/static/css/...` and `/static/img/...` served 200 OK.

### Known UI deltas accepted for now (Phase 1 scope)
- Top nav icon ordering differs slightly from mockup (chat icon placement).
- Side nav footer spacing and centering differs slightly from mockup.
- Decision: treat these as refinement items to adjust later in shells/includes/components once core routing/models are in place.

## 2026-02-16/17 — Phase 1 stabilized on production VM

- GitHub deploy key troubleshooting:
  - `git push` failed due to missing SSH private key under `/home/steven/.ssh/`.
  - Resolved by copying the deploy key from `/srv/heypage/.ssh/id_ed25519` into `/home/steven/.ssh/id_ed25519` with correct perms, then re-syncing with `origin/main`.
- Repo was behind `origin/main`; resolved by stashing, rebasing onto `origin/main`, then popping stash.
- Static assets work:
  - FontAwesome CSS referenced `../webfonts/` relative to `static/css/font-awesome/`.
  - Added compatibility copies to ensure those relative references resolve:
    - `static/css/webfonts/` (required by the CSS)
    - `static/fonts/font-awesome/webfonts/` (additional compatibility)
- Unused/legacy assets were removed to reduce `collectstatic` post-processing risk.
- `collectstatic` PermissionError (WhiteNoise `utime`) occurred when running as the wrong OS user.
  - Standardized that production management commands (especially `collectstatic`) must run as OS user `heypage`.
  - Set canonical production `STATIC_ROOT` to `/srv/heypage/staticfiles` via `DJANGO_STATIC_ROOT` in `/srv/heypage/.env`.
  - Ensured nginx static alias matches: `location /static/ { alias /srv/heypage/staticfiles/; }`.

## 2026-02-15 — Architecture decisions confirmed from mockups

### URL scheme locked (public entity URLs)
Decision:
- Users: `/<username>/`
- Groups: `/g/<slug>/`
- Businesses: `/b/<slug>/`

Notes:
- Root-level user route is a catch-all and must be registered last in Django URL patterns.
- Maintain a reserved-words list so usernames cannot collide with system routes or entity prefixes.

### Moderation states locked (UI + behavior)
- PROPOSED (viewer not voted): shows “Deletion Proposed Agree?”, buttons enabled, results visible.
- VOTE IN PROGRESS (viewer voted): shows “Deletion Proposed Voted.”, buttons disabled, results visible.
- Proposer auto-votes YES when proposing deletion.
- Resolved removal suppresses content (tombstone), not hard-delete.

### Business edit modals clarified (two different "Edit Business" actions)
Decision:
- Header kebab “Edit” → identity modal (name/logo/category)
- About card pencil → details modal (about/contact/locations)

They must be distinct modals/partials to avoid wiring confusion.

## Milestones (status)

### M0 — Mockup ingestion complete
- [x] Mockups committed under `mockups-original/`
- [x] Page inventory created (see `PAGES_AND_CONTEXTS.md`)
- [x] UI block inventory started (see `COMPONENTS_AND_INCLUDES.md`)

### M1 — Django skeleton runnable (production-ready layout)
- [x] Django project created
- [x] Base template + includes wired
- [x] Static assets pipeline defined (`WhiteNoise`, `collectstatic`), nginx alias contract in place
- [ ] Auth surface stubbed (login/register template renders)

### M2 — Core social objects (next)
- [ ] Profiles (user, business, group) + routing stubs
- [ ] Minimal Post model + feed query + render loop
- [ ] Moderation UI stub (no vote logic yet)
