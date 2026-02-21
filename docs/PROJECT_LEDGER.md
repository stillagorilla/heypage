# Project Ledger (decisions + notable changes)

This file is the historical “why” log. If something was discovered the hard way, it belongs here so we don’t repeat it.

Last updated: 2026-02-21

## 2026-02-21 — Drift correction: user profile + entity header contracts re-locked

- Re-aligned `templates/entities/user/profile.html` to the existing `profile_view` contract:
  - uses `profile_user` (not `subject_user`)
  - continues to include `templates/components/entity/entity_header.html`
- Confirmed current entity header strategy is a single template with owner/public branching:
  - No `entity_header_base.html` / wrapper split has been adopted yet.
- Left-column profile cards (Bio/Social/Friends/Recent Photos) remain inline in profile.html for now:
  - Planned extraction into reusable card components only after mockup parity and a stable card API are finalized.

## 2026-02-21 — Re-locked entity shell + finalized entity_header design (prevent regressions)

- Restored `templates/layouts/entity_shell.html` to the Phase 1 contract:
  - includes `includes/top_nav.html` + `includes/side_nav.html`
  - preserves spacer + `#sideNav` + `#mainWrap` parity
  - internal 4/8 columns for left cards + center feed-like

- Finalized entity_header system design:
  - base skeleton + owner/public wrappers (per Phase 0 guidance)
  - user header implemented first under `templates/components/entity/`
  - wrappers must pass `header_uid` to avoid duplicate IDs for modals/inputs

## 2026-02-21 — Phase 2 progress: routing + feed write path + moderation stub + auth + user profile groundwork

### Completed
- Locked routing surfaces in `config/urls.py`:
  - `/feed/`, `/search/`, `/settings/`, `/chat/`, `/g/<slug>/`, `/b/<slug>/`, and `/<username>/` catch-all LAST.
- Reserved username enforcement:
  - Added/confirmed `apps/accounts/reserved_words.py` and guarded profile routing against reserved routes.
- Feed MVP:
  - `apps/feed.models.Post` created and migrated (`feed_post` table exists).
  - Server-rendered feed supports GET list + composer + POST create.
- Entity stubs:
  - `apps/entities.models.Group` + `Business` created and migrated.
- Moderation MVP (global, post-like targets):
  - Added `apps/moderation` with `ModerationProposal` + `ModerationVote` using generic target (ContentType + object_id).
  - Implemented “Propose Deletion” flow aligned to `mockups-original/feed.html`:
    - kebab → modal → propose → proposer sees “Voted.” + extras
    - other viewer sees “Agree?” (not voted) panel
    - vote Yes/No transitions to Voted + extras
- Auth MVP:
  - Implemented working `/login/` and `/register/` flow using `accounts/login_register.html` mockup.
  - Confirmed login redirects honor `?next=...`.

### Key fixes / incidents (to avoid regressions)
- `INSTALLED_APPS` duplication caused “Application labels aren’t unique, duplicates: feed”.
  - Fix: ensure prod settings do not prepend local apps if they’re already present.
- Migrations failed due to permissions in `apps/*/migrations/`.
  - Fix: ensure migrations directories are owned by `heypage:heypage` and writable before running `makemigrations`.
- Template comment text rendered unexpectedly once; resolved by correcting template comment usage.
- Entity layout regression: `entity_shell.html` was unintentionally changed to a different grid, causing missing side nav / wrong columns.
  - Decision: `entity_shell.html` is a locked shell and must retain the spacer + side_nav + mainWrap parity pattern from Phase 1.

### Open / next
- Restore and re-lock `templates/layouts/entity_shell.html` to the Phase 1 contract (chrome + fixed grid).
- Implement user profile page parity with `mockups-original/my-profile.html` and `mockups-original/user-profile.html`:
  - header + left cards + center feed column using the standard post composer + post card.
- Decide final `entity_header.html` architecture:
  - single base + “owner/public” variant logic, or wrappers per type/context (user/group/business + owner/public).
  - Document the decision in `COMPONENTS_AND_INCLUDES.md` to prevent drift.

## 2026-02-21 — Phase 2: moderation vertical slice + entity shell regression found

### Moderation app + models added (site-wide, not feed-specific)
- Added `apps.moderation` as a site-wide app because moderation applies to post-like content across the site (not just feed posts).
- Implemented `ModerationProposal` + `ModerationVote` models and migrated successfully.
- Confirmed proposer auto-votes YES and non-proposer can vote YES/NO; UI reflects mockups (Agree? vs Voted + “extras”).

### Moderation UI implemented from mockups (modal + panel)
- “Propose Deletion” is launched from post kebab → opens a modal (from mockups) → confirming creates proposal + shows the moderation panel.
- Panel behavior matches mockups:
  - Agree? state: buttons active, extras hidden
  - Voted state: buttons disabled, extras shown (progress bar + rep vote status)
  - NO vote state added (disabled styling + voted label + extras visible)

### Ops gotchas discovered (recorded so we don’t repeat)
- Migration write permissions:
  - `makemigrations` can fail with PermissionError if migrations dirs or files are owned by root.
  - Standardize: create and chown `apps/*/migrations/` to `heypage:heypage` before running migrations on the VM.
- Installed apps duplication:
  - Prepending `LOCAL_APPS` in prod settings can create duplicate app labels if the base settings already include the app.
  - Fix is to only add missing local apps (set-style merge), not blindly prepend.
- Template pitfalls:
  - `{% static %}` cannot take variables beginning with underscore (e.g. `_avatar_url`) — Django raises `TemplateSyntaxError`.
  - Keep template comments as `{% comment %}...{% endcomment %}` when they must never render; `{# ... #}` should not render but is still risky in partial-copy scenarios.

### Entity layout shell regression identified
- A modified `templates/layouts/entity_shell.html` removed the shared chrome/grid pattern (top nav + side nav + spacer + mainWrap), causing user profile pages to look wrong.
- Action: restore entity_shell to the Phase 1 locked shell contract so entity pages match mockup structure.

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




