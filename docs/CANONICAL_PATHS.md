# Canonical Paths

This document defines **canonical locations** for key project artifacts (templates, static assets, docs),
and establishes a single source of truth to prevent duplicate/competing implementations.

If a path or convention conflicts with other documentation, **this file wins**. Update the other docs.

## Django settings and project roots

- Project root (repo): `/srv/heypage/app`
- Django `BASE_DIR`: computed in `config/settings/base.py` as:
  - `BASE_DIR = Path(__file__).resolve().parent.parent.parent`
  - Effective `BASE_DIR`: `/srv/heypage/app`

### Settings modules

- Default settings module (when not overridden): `config.settings`
  - Set in `manage.py`, `wsgi.py`, `asgi.py`
- Production settings module: `config.settings.prod`

**Production commands must run with:**
- `DJANGO_SETTINGS_MODULE=config.settings.prod`
- `DATABASE_URL=...` (required by `config/settings/prod.py`; see `OPERATIONS.md`)

## Templates

- Templates root: `BASE_DIR / "templates"` → `/srv/heypage/app/templates`

### Canonical shared fragments
All shared fragments (navigation, headers, reusable UI blocks) live in:

- `templates/includes/`

Canonical filenames (current contract):
- `templates/includes/top_nav.html`
- `templates/includes/side_nav.html`

> If additional shared fragments are introduced (e.g., `site_footer.html`), they must be added here.

### Deprecated template directories
The following directories are deprecated and must not be referenced by `{% include %}` / `{% extends %}`:

- `templates/partials/` (deprecated; legacy only)
- `templates/_deprecated_partials/` (deprecated quarantine; legacy only)

Policy:
- New work must be done in `templates/includes/`.
- Any legacy fragments must be migrated into `templates/includes/` and the deprecated version removed or quarantined.

### Base layout contract
`templates/base.html` must include shared fragments via canonical paths:
- `{% include "includes/top_nav.html" %}`
- `{% include "includes/side_nav.html" %}`

## Static files

### Canonical static source root (in repo)
All source static assets live under:

- `BASE_DIR / "static"` → `/srv/heypage/app/static`

Examples:
- `static/css/app.css`
- `static/js/app.js`
- `static/img/...`

### Canonical production static collection root (deploy artifact)
**Production `STATIC_ROOT` must be:**

- `/srv/heypage/staticfiles`

This is implemented by:
- `STATIC_ROOT = os.environ.get("DJANGO_STATIC_ROOT", str(BASE_DIR / "staticfiles"))`
- and setting `DJANGO_STATIC_ROOT="/srv/heypage/staticfiles"` in `/srv/heypage/.env` (see `OPERATIONS.md`)

**Non-canonical / dev fallback (do not use in prod):**
- `/srv/heypage/app/staticfiles` (only used if `DJANGO_STATIC_ROOT` is not set)

### Nginx static mapping contract
Nginx must serve static via:
- `location /static/ { alias /srv/heypage/staticfiles/; }`

Contract:
- Django `STATIC_ROOT` and nginx `alias` must always agree.

### FontAwesome webfonts (path compatibility)
Some FontAwesome CSS (example: `static/css/font-awesome/light.css`) references `../webfonts/...`
relative to the CSS directory (e.g., `static/css/font-awesome/`), which implies webfonts are at:

- `static/css/webfonts/`

Canonical resolution (kept in repo):
- `static/css/webfonts/` exists and contains the FontAwesome webfont files.

Additional compatibility copy (kept in repo):
- `static/fonts/font-awesome/webfonts/` exists and contains the same webfont files.

Rationale:
- Avoid brittle CSS rewrites and prevent `collectstatic` failures due to missing referenced assets.

### CSS asset reference policy
To keep `collectstatic` with `ManifestStaticFilesStorage` (WhiteNoise) reliable:
- Prefer referencing assets via paths that exist in `static/` exactly as written.
- Remove unused or legacy CSS that references non-existent assets.
- If a static CSS file is unused, remove it to reduce post-processing risk.

## Canonical operational helpers

### Management wrapper
- `bin/dj` is the canonical wrapper for Django management commands on the production VM.

Operational behavior (how to run commands, which user to run as, env loading) is documented in:
- `OPERATIONS.md`

## Documentation

Canonical documentation location (current):
- Project docs live at the repo root: `/srv/heypage/app/*.md`

> Future option: move docs into `/srv/heypage/app/docs/`, but do not do so until we update all references.
