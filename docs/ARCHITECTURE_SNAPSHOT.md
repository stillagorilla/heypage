# Architecture Snapshot (locked decisions + system map)

Last updated: 2026-02-21

This file is the “what is true” snapshot. If a decision is locked, it belongs here.
If a behavior is not implemented yet, it must be marked PLANNED (not implied as working).

---

## Workflow discipline (LOCKED)

These rules exist because drift happened. They are non-negotiable.

1) **Comments are documentation.**
   - Preserve intent-heavy comments in templates and views.
   - Comments are part of the project’s continuity and prevent regressions.

2) **File-first workflow (required).**
   - Before proposing or producing updates to any file, always request and review the latest
     version of each file that will be modified.
   - Do not assume prior assistant output matches what’s currently deployed.

3) **Pasteable full-file replacements only.**
   - When a file changes, provide a complete pasteable replacement (not a partial diff).
   - Keep changes minimal and explicitly scoped.

4) **Known template-engine gotchas (observed on hp-prd-web01).**
   - Inline template comments `{# ... #}` have rendered in-page in some contexts.
     - Rule: use `{% comment %} ... {% endcomment %}` for continuity comments that must never render.
   - Multi-line `{% include ... with ... %}` tags have rendered as literal text inside loops.
     - Rule: keep complex include-with tags on a single line, especially within loops.

---

## Template architecture rules (LOCKED)

- `templates/base.html` is skeleton only.
- Layout families are shells under `templates/layouts/`.
- Page templates extend a shell and never rebuild the grid.
- Shells include their own chrome:
  - `includes/top_nav.html` (must include search UX markup)
  - `includes/side_nav.html`
- Reusable content blocks live under `templates/components/`.

Canonical shells (actual filenames):
- `templates/layouts/entity_shell.html` (entity pages: user/group/business)
- `templates/layouts/2col_shell.html` (feed/search/settings family)
- `templates/layouts/chat_shell.html` (chat family; later)

Consistency rule (LOCKED):
- Horizontal positioning and spacing must match across shell families where applicable.
- Specifically, `#mainWrap` positioning in entity vs 2col shells must remain consistent.

---

## URL scheme locked (public entity URLs)

- Users: `/<username>/`
- Groups: `/g/<slug>/`
- Businesses: `/b/<slug>/`

Notes (LOCKED):
- Root-level user route is a catch-all and must be registered last.
- Reserved-words list prevents collisions with fixed routes/prefixes:
  `/feed/ /search/ /settings/ /chat/ /g/ /b/ /posts/ /moderation/ /mockups/` etc.

---

## Posts system (current reality, LOCKED intent)

Ownership:
- Posts are cross-surface content (not feed-specific).
- `apps/posts` owns:
  - the Post model
  - post write endpoints (composer POST target)
- `/feed/` and profile pages display posts; they do not own the write path.

Timeline targeting (LOCKED intent):
- A post has:
  - `author`: who wrote it
  - `timeline_owner`: whose timeline/profile it appears on
- Self-posts: `author == timeline_owner`
- Timeline posts (wall posts): `author != timeline_owner`
  - Permission will be enforced by Settings + friendships (PLANNED enforcement; conservative now).

Visibility (LOCKED intent):
- Visibility is chosen by author at creation time (Public/Friends/Private).
- Visibility can be changed later by author.
- FRIENDS visibility is evaluated at read-time (friend state is dynamic and can change).

DB note (LOCKED for Phase A):
- Physical table currently exists as legacy `feed_post`.
- We keep that name during Phase A to avoid production churn.
- Phase B will deliberately rename the table (planned).

---

## Moderation states locked (UI + behavior)

- PROPOSED (viewer not voted): shows “Deletion Proposed Agree?”, buttons enabled, extras hidden.
- VOTE IN PROGRESS (viewer voted): shows “Deletion Proposed Voted.”, buttons disabled, extras visible.
- Proposer auto-votes YES when proposing deletion.
- Resolved removal suppresses content (tombstone), not hard-delete.

---

## Entity-specific notes

### Entity header (LOCKED intent, current reality)
- Single template `templates/components/entity/entity_header.html`
- Handles owner vs public branching.
- Intended to be reusable across User/Group/Business as long as inputs remain stable:
  - `entity`, `is_owner`, `active_tab`, `header_uid`, optional `badges`
- Public header includes stateful friend controls (CSRF-safe forms).

### Business edit modals (important distinction)
Two different entry points both titled “Edit Business”, but different scopes:
1) Header kebab Edit
- Identity edit: name, logo/image, category
- Must be a distinct modal id and partial

2) About card pencil
- Details/profile edit: about, contact, locations
- Must be a distinct modal id and partial

Social profiles pencil:
- opens social profiles modal (separate)

### Photos and albums (PLANNED)
Shared tabs pattern:
- Photos grid and Albums grid

Owner actions:
- Add Photos modal, New Album modal, Edit Photos bulk page

Bulk edit implies:
- photo taken_on editable
- move or add selected photos to albums

---

## Search (PLANNED, locked surfaces)

Two surfaces:
1) Live dropdown in topnav (suggest)
- Users, Groups, Businesses sections
- View All routes to hard results

2) Hard results page
- Tabbed: Users, Groups, Business
- Business tab includes Add Business CTA

Implementation approach (planned):
- SearchDocument table (entity_type + object_id + indexed fields)
- Suggest endpoint returns grouped top-N per type.

---

## Settings and preferences (current reality + planned enforcement)

Settings page implies (mockup-aligned):
- account edits: username, name (display_name), email
- privacy settings:
  - audiences for posts (default)
  - friend requests policy
  - timeline posts policy
  - friends visibility
  - bulk change existing posts visibility (UI control; action planned)
- blocked contacts modal + unblock action
- notification toggles
- security: password reset link, MFA placeholder

Enforcement notes (LOCKED intent):
- Bulk change selector does not automatically apply in v1 unless explicitly implemented as an action.
- Friend-related policies will be evaluated at read-time and/or write-time depending on feature:
  - visibility: read-time
  - wall-post permission: write-time

---

## Messaging (chat) (PLANNED)

MVP recommended approach:
- Standard HTTP endpoints with polling.

Upgrade path:
- Channels/WebSockets later.
