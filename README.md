# Heypage

Heypage is a Django-first, server-rendered web app targeting an MVP of a Facebook-like social platform with a differentiator:
**distributed, user-driven moderation via deletion proposals + voting**.

This repo is deliberately structured to prevent “rediscovery loops” by making the documentation authoritative.

## Quick links (read these first)

If you are resuming work or starting a new chat, read in this order:

1. `DOCUMENTATION_MAP.md` (where each kind of guidance lives)
2. `CANONICAL_PATHS.md` (single source of truth for paths + layout contracts)
3. `OPERATIONS.md` (how to run/operate on the production VM)
4. `ARCHITECTURE_SNAPSHOT.md` (system map + locked URL scheme)
5. `NEXT_STEPS.md` (what to do next, and only what’s next)

## Local development (high-level)

This project assumes:
- Django, templates-first
- Postgres in production (SQLite is acceptable for local dev)

Typical local commands (adjust env as needed):
- `python -m venv .venv && source .venv/bin/activate`
- `pip install -r requirements.txt`
- `python manage.py migrate`
- `python manage.py runserver`

## Production (DreamCompute VM)

The production VM is documented in `OPERATIONS.md` and is the **canonical** reference for:
- host layout (`/srv/heypage/...`)
- the runtime user (`heypage`)
- static collection (`/srv/heypage/staticfiles`)
- the management command wrapper (`bin/dj`)
- nginx/gunicorn/systemd wiring

## Repo layout (relevant pieces)

- `apps/` — Django apps (accounts, core, search, feed, etc.)
- `config/` — Django project config (`config/settings/`, `urls.py`, `wsgi.py`)
- `templates/` — server-rendered templates
  - `templates/includes/` — canonical shared fragments (nav, etc.)
- `static/` — static source assets committed to the repo
- `bin/` — operational helpers (most importantly `bin/dj`)
- `docs/` — project documentation

## Documentation discipline (important)

- **Paths and layout contracts:** update `CANONICAL_PATHS.md`
- **Operational procedures:** update `OPERATIONS.md`
- **Architecture and locked decisions (URL scheme, moderation states):** update `ARCHITECTURE_SNAPSHOT.md`
- **“What happened and why”:** append to `PROJECT_LEDGER.md`
- **What to do next (only):** update `NEXT_STEPS.md`

