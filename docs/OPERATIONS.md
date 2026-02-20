# Operations (production runbook)

Last updated: 2026-02-20

This is the operational source of truth for the production VM.

## Production host baseline

- Host: `hp-prd-web01`
- OS: Ubuntu 22.04
- App checkout: `/srv/heypage/app`
- Venv: `/srv/heypage/venv`
- Env file: `/srv/heypage/.env`
- Static root: `/srv/heypage/staticfiles`
- Media root: `/srv/heypage/media`
- Runtime user for Django management commands: `heypage`
- Nginx user: `www-data`

## Standard commands

### Restart app
- `sudo systemctl restart heypage.service`

### Check nginx config + reload
- `sudo nginx -t && sudo systemctl reload nginx`

### Run Django management commands (production)
Always run as OS user `heypage`:
- `sudo -u heypage -H bin/dj check`
- `sudo -u heypage -H bin/dj migrate`
- `sudo -u heypage -H bin/dj collectstatic --noinput`

## Static files (common failure modes)

### Symptom: 500 error rendering templates with `{% static %}` links
If using `ManifestStaticFilesStorage`, template rendering can fail when a referenced file is not present in the manifest.

Typical error:
- `ValueError: Missing staticfiles manifest entry for '...'`

Fix:
- Confirm the referenced path exists under `static/`
- Run `collectstatic` as `heypage`
- Update templates to reference the real asset path (example: favicon lives at `static/img/favicon/favicon.ico`)

### Symptom: nginx returns 403 for `/static/...` even though alias looks correct
Root cause is often directory traversal permissions: nginx (`www-data`) must be able to traverse each parent directory.

Verify:
- `sudo -u www-data test -x /srv && echo ok`
- `sudo -u www-data test -x /srv/heypage && echo ok`
- `sudo -u www-data test -x /srv/heypage/staticfiles && echo ok`
- `sudo -u www-data test -r /srv/heypage/staticfiles/css/<file>.css && echo ok`

Fix (canonical):
- `sudo chmod 0755 /srv`
- `sudo chmod 0755 /srv/heypage`
- `sudo chown -R heypage:heypage /srv/heypage/staticfiles`
- `sudo find /srv/heypage/staticfiles -type d -exec chmod 0755 {} \;`
- `sudo find /srv/heypage/staticfiles -type f -exec chmod 0644 {} \;`

Then:
- `sudo nginx -t && sudo systemctl reload nginx`

## Template debugging helpers

Resolve a URL:
- `sudo -u heypage -H bin/dj shell -c "from django.urls import resolve; print(resolve('/feed/'))"`

Render a view with a RequestFactory (useful to capture template errors):
- Use `RequestFactory()` and call the view directly, then `resp.render()` if it is a TemplateResponse.

## Backups

- DB backup jobs are managed by systemd timer units (see Phase 1 notes in `PROJECT_LEDGER.md`).
- Retention is local-only for now (future: off-host).
