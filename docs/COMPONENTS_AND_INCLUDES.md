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
- `templates/components/` (top-level for shared blocks used broadly, e.g., post_card.html, composer.html)

### Modals (canonical)
All modals live under:
- `templates/components/modals/`

Do not include modals once per post card; include once per page.

## Component inventory (current reality)

### Navigation and chrome
- `templates/includes/top_nav.html`
- `templates/includes/side_nav.html`

### Post-like system (Phase 2 current)
- `templates/components/composer.html`
- `templates/components/post_card.html`

### 4) Moderation UI (locked behavior)

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
  - extras hidden (no progress/rep-votes section)
- Voted (`Voted.`):
  - Yes/No disabled
  - extras visible:
    - progress bar text (example stub)
    - representative vote status list + “remaining” line

Proposer auto-vote rule:
- When a user proposes deletion, they are treated as having voted **Yes** immediately.
- Therefore proposer sees `Voted.` + extras right after proposing.

### Planned
- Tombstone: `templates/components/moderation_tombstone.html`
- Entity header variants under `templates/components/entity_headers/`
