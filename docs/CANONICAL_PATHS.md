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

## Django folder structure (canonical)

The goal is to prevent drift by defining *one* expected layout for Django apps, templates, and reusable UI.

### Apps (Python packages)

- All Django apps live under: `apps/`
- Each app is a normal Django app package: `apps/<app_name>/`
  - `apps/<app_name>/views.py`, `urls.py`, `models.py`, `admin.py`, `apps.py`, `migrations/`, etc.

Current/expected app namespaces (Phase 1–2):
- `apps/accounts` (auth, profile, settings)
- `apps/core` (root routing helpers, healthz, simple static pages)
- `apps/feed` (feed views)
- `apps/entities` (groups + businesses)
- `apps/search`, `apps/chat`, `apps/mockups` (dev-only mockup browser)

### Templates (HTML)

Canonical template roots:
- Global templates root: `templates/`
- Per-app / per-feature templates: `templates/<area>/...`
  - Examples:
    - `templates/accounts/login_register.html`
    - `templates/feed/feed.html`
    - `templates/search/results.html`
    - `templates/chat/inbox.html`
    - `templates/mockups/index.html`

Shared UI layers (the “no drift” contracts):
- **Global includes (site-wide chrome + page-level plumbing):** `templates/includes/`
- **Reusable components (content building blocks):** `templates/components/`

#### Decision: entities vs route-level pages

We have two kinds of pages:

1) **Entity pages** (same core 3-column layout pattern):
- User: `/<username>/`
- Group: `/g/<slug>/`
- Business: `/b/<slug>/`

2) **Route-level pages** (fixed routes; may reuse components but do not follow entity layout):
- `/feed/`, `/search/`, `/chat/`, `/settings/`, auth routes, etc.

**Rule:** if a page follows the entity layout contract, it must live under `templates/entities/` and extend the canonical entity base template.

## Templates taxonomy (locked)

### 1) Site-wide includes (`templates/includes/`)

These are the *site chrome* + boilerplate blocks that should be used across most pages.

Canonical filenames (current contract):
- `templates/includes/top_nav.html`
- `templates/includes/side_nav.html`
- `templates/includes/head.html` (shared `<head>` block: CSS links, meta, title blocks)
- `templates/includes/scripts.html` (shared JS includes at end of `<body>`)

We intentionally do **not** use `site_header.html` / `site_footer.html`. If a real header/footer UI becomes necessary later, it should still be implemented via `includes/` and explicitly added here.

### 2) Reusable components (`templates/components/`)

These are composable building blocks used by multiple pages.

Policy:
- If a block is reused across *two or more* pages, it belongs in `templates/components/`.
- Components may have subfolders when it improves clarity.

Locked (Phase 0-derived) component families:
- `templates/components/entity_header.html`
  - Single canonical “entity header card” structure (User/Business/Group share the same markup pattern).
  - Do not create separate variants unless we can prove meaningful divergence.

- `templates/components/cards/`
  - Reusable left-column cards (about/bio/contact, stats, mini lists, etc.)

- `templates/components/`
  - `composer.html` (make post / later: make review variants)
  - `post_card.html` (the “post-like” card shell)
  - Optional later: `reactions_bar.html`, `comment_thread.html`, `moderation_panel.html`

- `templates/components/modals/`
  - All modal markup lives here (not scattered inside page templates).
  - Organize into subfolders only when it becomes necessary:
    - `templates/components/modals/accounts/`
    - `templates/components/modals/entities/`
    - `templates/components/modals/content/`
  - Naming rule: one modal per file; filenames match modal purpose (e.g., `edit_profile_modal.html`).

### 3) Entity page templates (`templates/entities/`)

Canonical entity base template:
- `templates/entities/_entity_base.html`
  - Extends `templates/base.html`
  - Includes `components/entity_header.html`
  - Provides the standard entity layout zones:
    - left column (cards)
    - center column (composer + feed cards)
    - optional right column (future)

Entity profile pages (canonical names):
- `templates/entities/user/profile.html`
- `templates/entities/group/profile.html`
- `templates/entities/business/profile.html`

Naming rule:
- Use `profile.html` for the main “profile” page of each entity type (user/group/business).

### 4) Route-level page templates (fixed routes)

These do not use the entity base template, but they may reuse many of the same components.

Canonical examples:
- `templates/feed/feed.html`
- `templates/search/results.html`
- `templates/chat/inbox.html`
- `templates/accounts/login_register.html`

Rationale for `templates/feed/` etc.:
- Feed/search/chat have different layout shells (even if they reuse entity-like components).
- Keeping them separate reduces confusion and prevents the entity base contract from being stretched.

### Deprecated template directories

The following directories are deprecated and must not be referenced by `{% include %}` / `{% extends %}`:

- `templates/partials/` (deprecated; legacy only)
- `templates/_deprecated_partials/` (deprecated quarantine; legacy only)

Policy:
- New work must be done in `templates/includes/` and `templates/components/`.
- Any legacy fragments must be migrated into the canonical locations and the deprecated version removed or quarantined.

### Base layout contract

`templates/base.html` must include shared fragments via canonical paths:
- `{% include "includes/head.html" %}`
- `{% include "includes/top_nav.html" %}`
- `{% include "includes/side_nav.html" %}`
- `{% include "includes/scripts.html" %}`

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
- `docs/OPERATIONS.md`

## Documentation

Canonical documentation location:
- `docs/` contains all project docs (this file included).
- Repo root contains only: `README.md` and `context_pack.sh` (plus repo/ops files as needed).

This file must be kept current as decisions are made.
