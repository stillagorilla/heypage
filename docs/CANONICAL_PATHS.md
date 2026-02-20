# Canonical Paths and Template Contracts

Last updated: 2026-02-20

This document is the single source of truth for:
- URL scheme (public canonical routes)
- Template taxonomy and “who owns layout”
- Where templates/includes/components live

## Canonical URL scheme (locked)

### Entity pages (shared 3-column entity layout family)
- User: `/<username>/`
- Group: `/g/<slug>/`
- Business: `/b/<slug>/`

Notes:
- `/<username>/` is a catch-all and must be registered last in Django URL patterns.
- Maintain a reserved-words list so usernames cannot collide with fixed routes (`feed`, `search`, `settings`, `login`, etc.) or entity prefixes (`g`, `b`).

### Route-level pages (fixed routes, not entity layout)
Examples:
- `/feed/`
- `/search/`
- `/chat/`
- `/settings/`
- Auth routes: `/login/`, `/logout/`, `/register/`, `/reset-password/`, etc.

## Template taxonomy (locked)

### Rule 1 — `templates/base.html` is skeleton only
`base.html` provides:
- `<html>`, `<head>`, shared `includes/head.html`
- common blocks: `title`, `extra_head`, `content`, `extra_js`
- shared script include: `includes/scripts.html`

`base.html` does not provide:
- grid layout
- page chrome placement (top nav, side nav)
- page-specific containers/rows/cols

### Rule 2 — Layout families are shell templates under `templates/layouts/`
Every layout family gets one shell template that:
- extends `base.html`
- owns the grid for that family
- includes chrome (top nav, side nav) appropriate to that family

Canonical shells:
- `templates/layouts/entity_shell.html` (3-column entity pages)
- `templates/layouts/2col_shell.html` (feed/search/settings family)
- `templates/layouts/chat_shell.html` (chat layout family, later)
- Optional later: `templates/layouts/_auth_shell.html` (auth pages)

### Rule 3 — Page templates never rebuild the grid
Page templates:
- extend a shell template
- fill content blocks and include components
- do not declare the family grid again

### Rule 4 — Includes own chrome, components own reusable content blocks
- Chrome includes:
  - `templates/includes/top_nav.html` (must include search UX markup)
  - `templates/includes/side_nav.html`
  - `templates/includes/head.html`
  - `templates/includes/scripts.html`
- Reusable blocks:
  - `templates/components/...` (composer, post card, entity headers, modals, etc.)

## Static assets contract (production)

- Static source assets are committed under `static/` in repo.
- `collectstatic` output goes to:
  - `STATIC_ROOT = /srv/heypage/staticfiles`
- nginx serves:
  - `location /static/ { alias /srv/heypage/staticfiles/; }`
- If nginx returns 403 on `/static/`, confirm directory traverse perms on `/srv` and `/srv/heypage` (see `OPERATIONS.md`).
