# Canonical Paths

This document defines **canonical locations** for key project artifacts (templates, static assets, docs),
and establishes a single source of truth to prevent duplicate/competing implementations.

If a path or convention conflicts with other documentation, **this file wins**. Update the other docs.

## Django settings and project roots

- Project root (repo): `/srv/heypage/app`
- Django `BASE_DIR`: `config/settings/base.py` computes `BASE_DIR = /srv/heypage/app`
- Templates root directory: `BASE_DIR / "templates"` → `/srv/heypage/app/templates`
- Static source directory (checked into repo): `BASE_DIR / "static"` → `/srv/heypage/app/static`
- Static collection directory (deploy artifact): `STATIC_ROOT` (default: `BASE_DIR / "staticfiles"`)
  - Default: `/srv/heypage/app/staticfiles`
  - Production override may set `DJANGO_STATIC_ROOT` (commonly `/srv/heypage/staticfiles`)

## Templates: canonical structure

### Canonical shared fragments
All shared fragments (header, footer, navigation, reusable UI components) live in:

- `templates/includes/`

Canonical filenames:
- `templates/includes/site_header.html`
- `templates/includes/site_footer.html`
- `templates/includes/top_nav.html`
- `templates/includes/side_nav.html`
- `templates/includes/entity_header.html`

### Deprecated template directories
The following directories are deprecated and must not be referenced by `{% include %}`, `{% extends %}`, or template loaders:

- `templates/partials/` (deprecated; legacy only)

Policy:
- New work must be done in `templates/includes/`.
- If a newer version exists under `templates/partials/`, it must be migrated into `templates/includes/` and the partial removed or quarantined.

### Base layout contract
- `templates/base.html` must include shared fragments explicitly via canonical paths:
  - `{% include "includes/top_nav.html" %}`
  - `{% include "includes/side_nav.html" %}`
  - `{% include "includes/site_header.html" %}` (if used)
  - `{% include "includes/site_footer.html" %}` (if used)

## Static files

### Canonical static source root
- All project-owned static assets live under: `static/`
  - Example: `static/css/app.css`
  - Example: `static/webfonts/...`

### CSS asset reference policy
To keep `collectstatic` with `ManifestStaticFilesStorage` (WhiteNoise) reliable:

- Prefer referencing assets via paths that exist in `static/` exactly as written.
- Avoid “mystery” legacy CSS that references non-existent assets.
- If a static CSS file is unused, it should be removed from `static/` to prevent `collectstatic` post-processing failures.

## Pages and routing (high-level)

- Anonymous users:
  - Root (`/`) should render the login/register experience (template under `templates/accounts/`).
- Authenticated users:
  - Root (`/`) should redirect to the feed experience.

(Precise routing rules belong in the routing docs; this section is only a contract.)

## Documentation

Canonical documentation location:
- `docs/` for project docs referenced by the team and this chat.

This file must be kept current as decisions are made.
