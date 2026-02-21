# Components and Includes

This doc defines the reusable UI building blocks (templates-first) and where they live.

## Directory conventions

### Global includes
- `templates/includes/`

### Reusable UI components
- `templates/components/`

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

### Moderation mechanism (Phase 2 current)
- `templates/components/moderation_panel.html`
  - owns the combined row (reactions/share + “Deletion Proposed … Agree?/Voted.”)
  - owns the voting panel
  - uses server-rendered state (`moderation_state`) for deterministic display
- `templates/components/modals/propose_deletion_modal.html`

### Planned
- Tombstone: `templates/components/moderation_tombstone.html`
- Entity header variants under `templates/components/entity_headers/`
