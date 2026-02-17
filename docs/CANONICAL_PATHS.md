# Canonical Paths

This document defines **canonical locations** for key project artifacts (templates, static assets, docs)
and establishes a single source of truth to prevent duplicate/competing implementations.

If a path or convention conflicts with other documentation, **this file wins**. Update the other docs.

## Project roots and settings

- Project root (repo checkout): `/srv/heypage/app`
- Django `BASE_DIR` (computed in `config/settings/base.py`):
  - `BASE_DIR = Path(__file__).resolve().parent.parent.parent`
  - Effective `BASE_DIR`: `/srv/heypage/app`

### Canonical environment file (production)
- Canonical env file: `/srv/heypage/.env`
- `bin/dj` loads this file and exports variables.
- Production must define at minimum:
  - `DJANGO_SETTINGS_MODULE="config.settings.prod"`
  - `DATABASE_URL="postgresql://..."` (required by `config/settings/prod.py`)

### Settings modules
- Default module (used if not overridden): `config.settings` (set in `manage.py`, `wsgi.py`, `asgi.py`)
- Production module: `config.settings.prod`

Policy:
- Any production management command must run with `DJANGO_SETTINGS_MODULE=config.settings.prod`
  and a valid `DATABASE_URL` (via `/srv/heypage/.env` or explicit env).

## Templates

- Templates root: `BASE_DIR / "templates"` → `/srv/heypage/app/templates`

### Canonical shared fragments
All shared fragments (header, footer, navigation, reusable UI components) live in:

- `templates/includes/`

Canonical filenames:
- `templates/includes/site_header.html`
- `templates/includes/site_footer.html`
- `templates/includes/top_nav.html`
- `templates/includes/side_nav.html`
- `templates/includes/entity_header.html`

### Deprecated template directories (do not reference)
The following directories must not be referenced by `{% include %}`, `{% extends %}`, or template loaders:

- `templates/partials/` (deprecated; legacy only)
- `templates/_deprecated_partials/` (deprecated quarantine; legacy only)

Policy:
- New work must be done in `templates/includes/`.
- Legacy fragments must be migrated into `templates/includes/` and the deprecated version removed or quarantined.

### Base layout contract
- `templates/base.html` includes shared fragments explicitly via canonical paths:
  - `{% include "includes/top_nav.html" %}`
  - `{% include "includes/side_nav.html" %}`
  - `{% include "includes/site_header.html" %}` (if used)
  - `{% include "includes/site_footer.html" %}` (if used)

## Static files

### Canonical static source root (in repo)
- Static source directory (checked into repo): `BASE_DIR / "static"` → `/srv/heypage/app/static`

### Canonical production static collection root (deploy artifact)
- Canonical production `STATIC_ROOT`: **`/srv/heypage/staticfiles`**
- Implemented via `config/settings/base.py`:
  - `STATIC_ROOT = os.environ.get("DJANGO_STATIC_ROOT", str(BASE_DIR / "staticfiles"))`
- Production must set:
  - `DJANGO_STATIC_ROOT="/srv/heypage/staticfiles"` (in `/srv/heypage/.env`)

Policy:
- The `STATIC_ROOT` directory must be writable by the user running `collectstatic`
  (typically the service/deploy user: `heypage`).

### Nginx static mapping contract
- Nginx serves static via:
  - `location /static/ { alias /srv/heypage/staticfiles/; }`

Hard rule:
- Django `STATIC_ROOT` and nginx `alias` must always agree.

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

### `bin/dj` (canonical Django management wrapper)
- Canonical wrapper: `bin/dj`
- Responsibilities:
  - `cd /srv/heypage/app`
  - activate `/srv/heypage/venv`
  - load `/srv/heypage/.env`
  - default `DJANGO_SETTINGS_MODULE` to `config.settings.prod` if not set

Policy:
- When capturing command output in this chat or in docs, prefer running management commands via `bin/dj`
  (especially `collectstatic`, `migrate`, `check`, `createsuperuser`).

### Running as the correct user (important)
`bin/dj` does not switch users. If a command must run as `heypage`, run it explicitly as that user:

- Example:
  - `sudo -u heypage -H /srv/heypage/app/bin/dj collectstatic --noinput`

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
