# Components and Includes

This doc defines the **reusable UI building blocks** (templates-first) and where they live.
It complements `CANONICAL_PATHS.md` (paths) and `PAGES_AND_CONTEXTS.md` (pages).

**Goal:** keep component guidance in *one* place so we don’t “rediscover” where things belong.

## Directory conventions

### Global includes (canonical)
Shared fragments that appear on many pages:

- `templates/includes/`

Examples:
- `templates/includes/top_nav.html`
- `templates/includes/side_nav.html`

### Reusable UI components (recommended)
Reusable components that are not “global chrome” (cards, panels, headers):

- `templates/components/`

Suggested structure:
- `templates/components/entity_headers/`
- `templates/components/post_like/`
- `templates/components/moderation/`
- `templates/components/forms/`

> If `templates/components/` does not exist yet, create it when the first component is extracted.

### Deprecated directories (do not use)
- `templates/partials/`
- `templates/_deprecated_partials/`

If something exists there, migrate it into `templates/includes/` or `templates/components/`.

## Component inventory (MVP-target)

### 1) Navigation and chrome
- **Top nav** (`includes/top_nav.html`)
  - search input + dropdown
  - notifications dropdown placeholder
  - profile menu
- **Side nav** (`includes/side_nav.html`)
  - main sections / shortcuts

### 2) Auth surface
- **Login/register page** (`templates/accounts/login_register.html`)
  - server-rendered form shells
  - includes base chrome only if intentionally shown to anon users

### 3) Post-like system (core reusable set)
These are shared across Posts / Reviews / Jobs (and later photo feed cards).

Recommended templates (under `templates/components/post_like/`):
- `composer.html`
- `card.html`
- `reactions_bar.html`
- `comments_thread.html`

### 4) Moderation UI (locked behavior)
Recommended templates (under `templates/components/moderation/`):
- `proposal_panel.html` (shows state, buttons, vote counts)
- `tombstone.html` (rendered when suppressed)

States and copy are locked in `ARCHITECTURE_SNAPSHOT.md`.

### 5) Entity headers (user / group / business)
Recommended templates (under `templates/components/entity_headers/`):
- `user_public.html`
- `user_owner.html`
- `group_public.html`
- `business_public.html`

### 6) Cards and panels (repeatable patterns)
Recommended templates:
- `templates/components/cards/about_card.html`
- `templates/components/cards/photos_grid.html`
- `templates/components/cards/albums_grid.html`

## Include rules (to avoid duplication)

- Includes must use canonical paths:
  - `{% include "includes/top_nav.html" %}`
  - `{% include "includes/side_nav.html" %}`
- Component includes should be namespaced by folder:
  - `{% include "components/post_like/card.html" %}`

## When to create a new component

Create a component template when:
- the same block appears in 2+ places, or
- a mockup shows a repeated pattern across contexts, or
- a block is likely to change in one place and must change everywhere.

If it’s a one-off for a single page, keep it in the page template.

