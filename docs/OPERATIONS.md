# Operations (Production VM)

This document is the canonical operational reference for `hp-prd-web01` and is intended to prevent
repeat “rediscovery” of production command patterns, users, paths, and permissions.

## Host + layout (canonical)

- Host: `hp-prd-web01`
- App repo: `/srv/heypage/app`
- Venv: `/srv/heypage/venv`
- Env file: `/srv/heypage/.env`
- Static source (in repo): `/srv/heypage/app/static`
- Static collection (served by nginx): `/srv/heypage/staticfiles`
- Media: `/srv/heypage/media`
- Logs: `/srv/heypage/logs`
- DB backups: `/srv/heypage/backups/db`

## Identity and permissions (important)

### Canonical runtime user
The canonical OS user for running production Django management commands is:

- `heypage`

Rationale:
- WhiteNoise `CompressedManifestStaticFilesStorage` post-processing can perform `utime()` calls.
- If `collectstatic` writes files owned by a different user (e.g., `steven`), later runs can fail with:
  `PermissionError: [Errno 1] Operation not permitted`

### Static directory ownership
`/srv/heypage/staticfiles` must be writable by `heypage` and keep group-write permissions.

Recommended baseline (idempotent):
- `sudo mkdir -p /srv/heypage/staticfiles`
- `sudo chown -R heypage:heypage /srv/heypage/staticfiles`
- `sudo chmod -R g+rwX /srv/heypage/staticfiles`
- `sudo find /srv/heypage/staticfiles -type d -exec chmod g+s {} \;`

## Environment variables (canonical: /srv/heypage/.env)

### Required in production
- `DJANGO_SETTINGS_MODULE="config.settings.prod"`
- `DATABASE_URL="postgresql://heypage:***@127.0.0.1:5432/heypage"`
- `DJANGO_SECRET_KEY="***"`
- `DJANGO_ALLOWED_HOSTS="heypage.com,www.heypage.com,208.113.165.79,127.0.0.1,localhost,hp-prd-web01"`

### Security + HTTPS
- `DJANGO_CSRF_TRUSTED_ORIGINS="https://heypage.com,https://www.heypage.com"`
- `DJANGO_SECURE_SSL_REDIRECT="1"`

### Paths
- `DJANGO_STATIC_ROOT="/srv/heypage/staticfiles"`
- `DJANGO_MEDIA_ROOT="/srv/heypage/media"`

### Mockups access control
- `HP_MOCKUPS_ENABLED="1"`
- `HP_MOCKUPS_ALLOWED_IPS="24.5.206.70,127.0.0.1,208.113.165.79"`

### Production settings module
Production runs with:
- `DJANGO_SETTINGS_MODULE=config.settings.prod`

### Required
- `DATABASE_URL` is required in production (`config/settings/prod.py` enforces this).

Store canonical values in:
- `/srv/heypage/.env` (read by `bin/dj`)

## Canonical command runner: `bin/dj`

### Purpose
`bin/dj` standardizes:
- the python interpreter (`/srv/heypage/venv/bin/python`)
- loading `/srv/heypage/.env`
- defaulting `DJANGO_SETTINGS_MODULE` to `config.settings.prod`
- optionally running as the canonical OS user (`heypage`)

### Usage patterns (canonical)

Validate config:
- `bin/dj check`

DB migrations:
- `DJANGO_RUN_AS_USER=heypage bin/dj migrate`

Static collection (canonical):
- `DJANGO_RUN_AS_USER=heypage bin/dj collectstatic --noinput -v 1`

Show effective settings deltas:
- `DJANGO_RUN_AS_USER=heypage bin/dj diffsettings`

## Nginx static mapping contract

Nginx must serve:
- `location /static/ { alias /srv/heypage/staticfiles/; }`

Contract:
- Django `STATIC_ROOT` must evaluate to `/srv/heypage/staticfiles`
- Nginx `alias` must match exactly

## Services (Phase 1 topology)

- Nginx (80/443) → Gunicorn (unix socket) → Django
- Postgres on same host (local)

### Systemd units (current)
- `heypage.socket` (socket: `/run/heypage/gunicorn.sock`)
- `heypage.service` (gunicorn serving `config.wsgi:application`)
- `heypage-backup-db.timer` / `heypage-backup-db.service` (daily pg_dump)
- `certbot.timer` (TLS renewal)

## Troubleshooting quick hits

### `collectstatic` PermissionError (WhiteNoise utime)
Symptoms:
- `PermissionError: [Errno 1] Operation not permitted` during post-process/compression.

Fix:
1) ensure `/srv/heypage/staticfiles` is owned by `heypage`
2) run:
   - `DJANGO_RUN_AS_USER=heypage bin/dj collectstatic --noinput`

### Wrong settings loaded (sqlite, missing apps)
Symptoms:
- `diffsettings` shows sqlite, minimal INSTALLED_APPS, or missing `collectstatic` command.

Fix:
- ensure `DJANGO_SETTINGS_MODULE=config.settings.prod`
- ensure `DATABASE_URL` is set (via `/srv/heypage/.env` or exported)
- use `bin/dj` to standardize invocation
