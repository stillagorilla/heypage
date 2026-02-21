# Components and Includes

This doc defines the reusable UI building blocks (templates-first) and where they live.

## Directory conventions

### Global includes
- `templates/includes/`

### Reusable UI components (canonical)

Reusable components that are not “global chrome” (cards, panels, headers, modals):

- `templates/components/`

Common subfolders:
- `templates/components/entity/` (entity header + entity cards)
- `templates/components/modals/` (Bootstrap modals extracted from mockups)
- `templates/components/` (top-level for shared blocks used broadly, for example post_card.html, composer.html)

### Modals (canonical)
All modals live under:
- `templates/components/modals/`

Do not include modals once per post card; include once per page.

## Component inventory (current reality)

### Navigation and chrome
- `templates/includes/top_nav.html`
- `templates/includes/side_nav.html`

### Post system (current reality)

Core components:
- `templates/components/composer.html`
- `templates/components/post_card.html`

Clean architecture (locked):
- `apps/posts` owns the Post model and post write endpoints.
- `/feed/` and profile pages include the shared composer and post cards.
- Surfaces control redirect by passing `next` in the composer form.

Phase A DB note (locked for now):
- Post table name remains `feed_post` as a legacy name.
- Table rename is deferred to a deliberate Phase B migration.

### Moderation UI (locked behavior)

Templates:
- `templates/components/moderation_panel.html` (panel shown after a proposal is created)
- `templates/components/modals/propose_deletion_modal.html` (from mockups; launched from kebab)

Behavior (from mockups, locked):
- Propose Deletion is initiated from post kebab → modal → confirm
- Proposer auto-votes YES
- Viewer states:
  - “Agree?” (not voted): buttons enabled, extras hidden
  - “Voted.” (voted): buttons disabled, extras visible (progress + representative vote status)

## Moderation: propose deletion modal + vote panel (confirmed behavior)

### Shared modal
- Location: `templates/components/modals/propose_deletion_modal.html`
- Trigger: kebab menu “Propose Deletion”
- Behavior:
  - opens modal
  - “Propose Deletion” confirms proposal (stub now; real POST later)

### Vote panel states (from feed.html mockup)
Inline indicator (same row as reactions/share):
- Always shows: `Deletion Proposed`
- `voteName` text:
  - `Agree?` when viewer has not voted
  - `Voted.` when viewer has voted (or proposer auto-yes)

Panel body (“voting stuff”) behavior:
- Not voted (`Agree?`):
  - Yes/No enabled
  - extras hidden (no progress or rep-votes section)
- Voted (`Voted.`):
  - Yes/No disabled
  - extras visible:
    - progress bar text (example stub)
    - representative vote status list + “remaining” line

Proposer auto-vote rule:
- When a user proposes deletion, they are treated as having voted Yes immediately.
- Therefore proposer sees `Voted.` + extras right after proposing.

### Planned
- Tombstone: `templates/components/moderation_tombstone.html`

## Entity header system (current reality, do not drift)
- `templates/components/entity/entity_header.html`
  - Single template handles owner vs public branching.
  - Intended to be reusable across entity types (User now, Group and Business later) if inputs remain stable.
  - Inputs:
    - `entity` (User today)
    - `is_owner` (bool)
    - `active_tab` (string)
    - `header_uid` (unique suffix for IDs)

## Left column profile cards (current reality)
- Profile left-column cards (Bio and Social combined, Friends preview, Recent Photos preview) are still inline in:
  - `templates/entities/user/profile.html`
- Extraction into reusable card components under `templates/components/entity/` is planned,
  but only after mockup parity and a stable card API are finalized.

## Workflow and anti-drift rules (locked)

These rules are part of the project’s operating discipline. They exist to prevent regressions and preserve continuity.

### File-first workflow (required)
- Before generating an updated version of any file, always request and review the latest file contents.
- Do not assume previous assistant output matches the current live file.

### Comments as continuity
- Keep comment blocks in templates and views as embedded project documentation.
- Prefer `{% comment %} ... {% endcomment %}` for template notes that must never render.

### Pasteable full-file replacements
- When a file is changed, provide a complete pasteable replacement (not a partial diff).
- Keep changes minimal and explicitly scoped.

### Known template-engine gotchas discovered on hp-prd-web01
These are not theoretical. They were observed during Phase 2 work and must be treated as constraints.

- Inline Django comments `{# ... #}` have rendered in-page in some contexts.
  - Rule: prefer `{% comment %} ... {% endcomment %}` for continuity notes.
- Multi-line `{% include ... with ... %}` tags have rendered as literal text in some contexts.
  - Rule: keep complex include tags on a single line, especially inside loops.
