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
- `DATABASE_URL="postgres://heypage:***@127.0.0.1:5432/heypage"`
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

Store canonical values in:
- `/srv/heypage/.env` (loaded by `bin/dj`)

## Canonical command runner: `bin/dj`

### Purpose
`bin/dj` standardizes:
- the working directory (`/srv/heypage/app`)
- the python interpreter (via `/srv/heypage/venv`)
- loading `/srv/heypage/.env` in a safe way
- defaulting `DJANGO_SETTINGS_MODULE` to `config.settings.prod`

### Running as the correct OS user
`bin/dj` itself does **not** change OS user. In production, run management commands as `heypage`:

Examples:
- `sudo -u heypage -H /srv/heypage/app/bin/dj check`
- `sudo -u heypage -H /srv/heypage/app/bin/dj migrate`
- `sudo -u heypage -H /srv/heypage/app/bin/dj collectstatic --noinput -v 1`
- `sudo -u heypage -H /srv/heypage/app/bin/dj diffsettings`

> Optional future improvement: teach `bin/dj` to honor an env var like `DJANGO_RUN_AS_USER`,
> but the canonical approach above works everywhere and is explicit.

### Usage patterns (canonical)

Validate config:
- `sudo -u heypage -H bin/dj check`

DB migrations:
- `sudo -u heypage -H bin/dj migrate`

Static collection (canonical):
- `sudo -u heypage -H bin/dj collectstatic --noinput -v 1`

Show effective settings deltas:
- `sudo -u heypage -H bin/dj diffsettings | egrep 'SETTINGS_MODULE|STATIC_ROOT|STATIC_URL|DATABASES'`

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
   - `sudo -u heypage -H bin/dj collectstatic --noinput`

### Wrong settings loaded (sqlite, missing apps)
Symptoms:
- `diffsettings` shows sqlite, minimal `INSTALLED_APPS`, or missing `collectstatic` command.

Fix:
- ensure `/srv/heypage/.env` contains `DJANGO_SETTINGS_MODULE=config.settings.prod`
- ensure `/srv/heypage/.env` contains `DATABASE_URL=...`
- run via `bin/dj` (it loads `/srv/heypage/.env`) and prefer `sudo -u heypage -H`
