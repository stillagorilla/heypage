# Components and Includes

This doc defines the reusable UI building blocks (templates-first) and where they live.
It also records anti-drift rules related to template behavior and reuse contracts.

Last updated: 2026-02-21

---

## Workflow and anti-drift rules (LOCKED)

These rules are part of the project’s operating discipline.

### File-first workflow (required)
- Before generating an updated version of any file, always request and review the latest file contents.
- Do not assume previous assistant output matches the current live file.

### Comments as continuity
- Keep comment blocks in templates and views as embedded project documentation.
- Prefer `{% comment %} ... {% endcomment %}` for template notes that must never render.

### Pasteable full-file replacements
- When a file is changed, provide a complete pasteable replacement (not a partial diff).
- Keep changes minimal and explicitly scoped.

### Known template-engine gotchas discovered on hp-prd-web01 (LOCKED constraints)
- Inline `{# ... #}` comments have rendered in-page in some contexts.
  - Rule: prefer `{% comment %} ... {% endcomment %}` for continuity notes.
- Multi-line `{% include ... with ... %}` tags have rendered as literal text in some contexts.
  - Rule: keep complex include-with tags on a single line, especially inside loops.

---

## Directory conventions

### Global chrome includes
- `templates/includes/`
  - `top_nav.html`
  - `side_nav.html`

### Layout shells (grid owners)
- `templates/layouts/`
  - `2col_shell.html` (feed/search/settings)
  - `entity_shell.html` (user/group/business entity pages)
  - `chat_shell.html` (chat; later)

### Reusable UI components (canonical)
- `templates/components/`

Common subfolders:
- `templates/components/entity/` (entity header + entity cards)
- `templates/components/modals/` (Bootstrap modals extracted from mockups)
- `templates/components/` (shared blocks used broadly: post_card, composer, etc.)

---

## Component inventory (current reality)

### Navigation and chrome
- `templates/includes/top_nav.html`
- `templates/includes/side_nav.html`

### Entity header system (current reality, do not drift)
- `templates/components/entity/entity_header.html`
  - Single template handles owner vs public branching.
  - Intended reusable header for User now; Group/Business later as long as inputs remain stable.

Inputs (LOCKED contract):
- `entity` (User today)
- `is_owner` (bool)
- `active_tab` (string)
- `header_uid` (unique suffix)
- `badges` (optional)
- Friend wiring inputs (when enabled by profile_view):
  - `friend_state`
  - `friend_request_id`

Friend control contract (v1):
- Public header friend actions are real POST forms (CSRF-safe).
- Redirect via hidden `next=` and server-side safe redirect contract.

### Post system (current reality)

Core components:
- `templates/components/composer.html`
- `templates/components/post_card.html`

Clean architecture (LOCKED):
- `apps/posts` owns the Post model and write endpoints.
- `/feed/` and profile pages include the shared composer and post cards.
- Surfaces control redirect by passing `next` in the composer form.

Timeline targeting + visibility (LOCKED intent):
- Composer may pass `timeline_owner_id`.
- Post has `timeline_owner` and `visibility`.
- FRIENDS evaluation happens at read-time.

DB note (Phase A, locked for now):
- Post table name remains `feed_post` (legacy).
- Rename is deferred to deliberate Phase B migration.

### Moderation UI (locked behavior)

Templates:
- `templates/components/moderation_panel.html`
- `templates/components/modals/propose_deletion_modal.html`

Behavior (from mockups, locked):
- Viewer states:
  - “Agree?” (not voted): buttons enabled, extras hidden
  - “Voted.” (voted): buttons disabled, extras visible (progress + rep-votes section)
- Proposer auto-vote YES
- Include modals once per page (not per post card)

---

## Left column profile cards (current reality)

- Profile left-column cards (Bio + Social combined, Friends preview, Recent Photos preview)
  are currently inline in:
  - `templates/entities/user/profile.html`

Planned:
- Extract into reusable card components under:
  - `templates/components/entity/cards/`
- Extraction must not change shell grid; profile template should switch to includes only.

---

## Settings page (current reality)

Template:
- `templates/accounts/settings.html`
  - Must extend `layouts/2col_shell.html`
  - Must follow mockup structure (single card with sections + modal)

Persistence:
- `accounts.UserSettings` stores mockup-controlled values.
- `accounts.User` stores username/display_name/email edits (best-effort).

Note:
- Bulk change selector is a UI control unless implemented as an explicit action.
