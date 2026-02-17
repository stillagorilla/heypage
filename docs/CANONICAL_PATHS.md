# Canonical Paths

This document defines **canonical locations** for key project artifacts (templates, static assets, docs)
and establishes a single source of truth to prevent duplicate/competing implementations.

If a path or convention conflicts with other documentation, **this file wins**. Update the other docs.

## Django settings and project roots

- Project root (repo): `/srv/heypage/app`
- Django `BASE_DIR`: `config/settings/base.py` computes:
  - `BASE_DIR = Path(__file__).resolve().parent.parent.parent`
  - Effective `BASE_DIR`: `/srv/heypage/app`

### Settings modules
- Default settings module (when not overridden): `config.settings` (set in `manage.py`, `wsgi.py`, `asgi.py`)
- Production settings module: `config.settings.prod`

**Production commands MUST run with:**
- `DJANGO_SETTINGS_MODULE=config.settings.prod`
- `DATABASE_URL=...` (required by `config/settings/prod.py`)

## Templates

- Templates root directory: `BASE_DIR / "templates"` → `/srv/heypage/app/templates`

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
- `templates/_deprecated_partials/` (deprecated quarantine; legacy only)

Policy:
- New work must be done in `templates/includes/`.
- Any legacy fragments must be migrated into `templates/includes/` and the deprecated version removed or quarantined.

### Base layout contract
- `templates/base.html` must include shared fragments explicitly via canonical paths:
  - `{% include "includes/top_nav.html" %}`
  - `{% include "includes/side_nav.html" %}`
  - `{% include "includes/site_header.html" %}` (if used)
  - `{% include "includes/site_footer.html" %}` (if used)

## Static files

### Canonical static source root (in repo)
- Static source directory (checked into repo): `BASE_DIR / "static"` → `/srv/heypage/app/static`

### Canonical production static collection root (deploy artifact)
- **Production `STATIC_ROOT`: `/srv/heypage/staticfiles`**
  - Django setting: `STATIC_ROOT = os.environ.get("DJANGO_STATIC_ROOT", str(BASE_DIR / "staticfiles"))`
  - In production, `DJANGO_STATIC_ROOT` must be set such that `STATIC_ROOT=/srv/heypage/staticfiles`.
  - This path must be writable by the deploy user used for `collectstatic` (typically `heypage`).

**Non-canonical / dev fallback (do not use in prod):**
- `/srv/heypage/app/staticfiles` (only used if `DJANGO_STATIC_ROOT` is not set)

### Nginx static mapping contract
- Nginx serves static via:
  - `location /static/ { alias /srv/heypage/staticfiles/; }`

The Django `STATIC_ROOT` and nginx `alias` must always agree.

### FontAwesome webfonts (path compatibility)
Some FontAwesome CSS (example: `static/css/font-awesome/light.css`) references `../webfonts/...`
relative to the CSS directory (e.g., `static/css/font-awesome/`), which implies webfonts are at:

- `static/css/webfonts/`

Canonical resolution (kept in repo):
- `static/css/webfonts/` exists and contains FontAwesome webfont files.

Additional compatibility copy (kept in repo):
- `static/fonts/font-awesome/webfonts/` also exists and contains FontAwesome webfont files.

Rationale:
- Avoid brittle CSS rewrites and prevent `collectstatic` failures due to missing referenced assets.

### CSS asset reference policy
To keep `collectstatic` with `ManifestStaticFilesStorage` (WhiteNoise) reliable:
- Prefer referencing assets via paths that exist in `static/` exactly as written.
- Remove unused or legacy CSS that references non-existent assets.
- If a static CSS file is unused, remove it to reduce post-processing risk.

## Canonical operational commands

### bin/dj (canonical Django management wrapper)
- Canonical wrapper: `bin/dj`
- Purpose:
  - Runs `manage.py` with the correct interpreter and defaults.
  - Standardizes `DJANGO_SETTINGS_MODULE` and required env vars so production commands are reproducible.

Policy:
- When capturing command output in this chat or in docs, prefer running management commands via `bin/dj`
  (especially for `collectstatic`, `migrate`, `createsuperuser`, and `check`).

(Implementation details belong in the ops/deploy docs; this is the path/usage contract.)

## Pages and routing (high-level contract)

- Anonymous users:
  - Root (`/`) renders the login/register experience (template under `templates/accounts/`).
- Authenticated users:
  - Root (`/`) redirects to the feed experience.

(Precise routing rules belong in routing docs; this section is only a contract.)

## Documentation

Canonical documentation location:
- `docs/` for project docs referenced by the team and this chat.

This file must be kept current as decisions are made.
