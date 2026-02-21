# Project Ledger (decisions + notable changes)

This file is the historical “why” log. If something was discovered the hard way, it belongs here so we don’t repeat it.

Last updated: 2026-02-21

## 2026-02-21 — Phase 2 (Core Models + Routing) vertical slice landed

### Routing surfaces locked (and username catch-all order preserved)
- Confirmed and implemented locked routing surfaces:
  - `/feed/`, `/search/`, `/settings/`, `/chat/`
  - `/g/<slug>/`, `/b/<slug>/`
  - `/<username>/` catch-all registered last.
- Reserved words enforcement added:
  - `apps/accounts/reserved_words.py` defines reserved route segments/prefixes.
  - `profile_view` denies reserved usernames (route-time guard) to prevent collisions.

### App registration pitfall on prod (INSTALLED_APPS mismatch)
- Symptom:
  - `RuntimeError: Model class apps.feed.models.Post doesn't declare an explicit app_label and isn't in an application in INSTALLED_APPS.`
  - Same error later for `apps.entities`.
- Root cause:
  - Production settings module (`config.settings.prod`) did not include local apps in `INSTALLED_APPS`.
- Fix:
  - Added `apps.feed.apps.FeedConfig` and `apps.entities.apps.EntitiesConfig` (plus corresponding `apps.py`).
  - Updated `config/settings/prod.py` to prepend local apps safely.

### Migrations write-permission gotcha (makemigrations on prod)
- Symptom:
  - `PermissionError: ... apps/entities/migrations/__init__.py` when running `makemigrations`.
- Root cause:
  - OS user `heypage` lacked write perms to create `migrations/__init__.py`.
- Fix:
  - Standardized that prod should not be generating migrations.
  - Ensured migrations directories exist, have `__init__.py`, and are readable by `heypage`.

### Minimal MVP models wired
- Feed:
  - `Post(author, body, created_at, updated_at)` with ordering by newest first.
- Entities:
  - `Group(slug, name)` and `Business(slug, name)` stubs to support routing.

### Feed write path implemented (server-rendered)
- `/feed/` GET renders composer + post list.
- `/feed/` POST creates a Post and redirects back to feed.
- Post list renders via `templates/components/post_card.html`.

### Moderation mechanism: modal-first propose deletion + deterministic UI state
- Mockup-accurate flow implemented:
  1) Kebab menu → Propose Deletion
  2) Propose Deletion modal appears (under `templates/components/modals/`)
  3) Confirm proposal
  4) Moderation mechanism becomes visible on that post
- Initial client-side toggling produced “Voted.” without consistently showing extras.
  - Root cause likely interference from other scripts/CSS or event ordering.
- Fix: moved Phase 2 moderation state to server-rendered truth:
  - Proposals stored in session (`moderation_proposals`) keyed by post id.
  - Feed view projects `moderation_state` and `moderation_reason` into each rendered card.
  - Voted state renders the “extras” (progress bar + representative votes) exactly as mockup.
- Proposer auto-vote behavior honored:
  - Proposal sets state to `VOTE_IN_PROGRESS` for proposer immediately.
- Dev convenience:
  - Added a session-clear endpoint to reset moderation stubs quickly: `/feed/moderation/clear/`.

## 2026-02-20 — Phase 1 scaffold (templates + static pipeline) stabilized

### Template architecture locked (base + shells + includes + components)
- Confirmed canonical rule set:
  - `templates/base.html` is skeleton only.
  - Layout families have shells under `templates/layouts/` (page templates never rebuild grids).
  - Shells include chrome (top nav + side nav).
  - Components live in `templates/components/`.

### Static + nginx gotchas fixed
- ManifestStaticFilesStorage missing manifest entry for favicon fixed by pointing to correct asset path.
- nginx 403 on `/static/` fixed by directory traverse permissions for nginx worker user.
- collectstatic permission issues fixed by standardizing that prod management commands run as OS user `heypage`.

## 2026-02-15 — Architecture decisions confirmed from mockups

### URL scheme locked (public entity URLs)
- Users: `/<username>/`
- Groups: `/g/<slug>/`
- Businesses: `/b/<slug>/`
- User catch-all must be registered last.
- Maintain reserved-words list to prevent collisions.

### Moderation states locked (UI + behavior)
- PROPOSED (viewer not voted): “Deletion Proposed Agree?”, buttons enabled.
- VOTE IN PROGRESS (viewer voted): “Deletion Proposed Voted.”, buttons disabled, extra info visible.
- Proposer auto-votes YES.
- Removal is a tombstone, not a hard delete.
