# Project Ledger (decisions + notable changes)

This file is the historical “why” log. If something was discovered the hard way,
it belongs here so we don’t repeat it.

Last updated: 2026-02-22

---

## 2026-02-21 — Anti-drift workflow was formalized (comments + file-first)

What changed:
- We adopted a strict workflow to prevent regressions:
  - Comments in templates/views are embedded project documentation.
  - Before changing any file, request and review the latest version of that file.
  - Provide complete pasteable replacements only.

Why:
- We had multiple drift incidents (shell parity regressions, template behavior surprises).
- The workflow makes changes repeatable and auditable across new chats and different contributors.

---

## 2026-02-21 — Template rendering gotchas discovered on hp-prd-web01 (LOCKED mitigations)

Observed:
- Inline `{# ... #}` comments rendered in-page in some contexts.
- Multi-line `{% include ... with ... %}` tags rendered as literal text inside loops.

Mitigations locked:
- Prefer `{% comment %} ... {% endcomment %}` for continuity notes that must never render.
- Keep complex include-with tags on a single line, especially inside loops.

---

## 2026-02-21 — Clean post architecture implemented (apps/posts owns Post)

Intent:
- Post is cross-surface content, not feed-specific.
- `apps/posts` owns:
  - Post model (logical ownership)
  - write endpoints (composer POST target)
- Feed is a read-only surface that displays posts.

Implementation (Phase A):
- Kept legacy DB table name `feed_post` to avoid risky table rename during live development.
- State-only / alignment migrations were used where needed to avoid duplicating tables.
- Feed no longer owns the Post model; it reads via `apps/posts`.

Why:
- Composer is reused across multiple surfaces (feed + profile now; more later).
- Posting from a profile must redirect back to the profile via next= contract.

---

## 2026-02-21 — Timeline targeting and visibility foundations added to Post

Added:
- `timeline_owner`: whose timeline the post appears on (supports wall posts).
- `visibility`: PUBLIC / FRIENDS / PRIVATE.

Locked rules captured:
- Friendship is evaluated at read-time (dynamic), not frozen at write-time.
- Users can change post visibility later.

Sequencing decision:
- Settings enforcement + full friend graph UX are staged.
- Wall posting is conservative until timeline policy is enforced.

---

## 2026-02-21 — Drift correction: entity shell + profile contract re-locked

What happened:
- entity_shell drift caused loss of side nav / mainWrap parity.

Fix:
- entity_shell contract was restored and locked:
  - chrome included (top_nav + side_nav)
  - spacer + sideNav + mainWrap parity preserved
  - header spans both columns via entity_header block

---

## 2026-02-21 — Settings mockup implemented (Settings & Privacy)

What was implemented:
- `/settings/` route exists and renders a mockup-aligned template.
- `UserSettings` persists:
  - privacy dropdowns (mockup set)
  - notification toggles
  - blocked contacts (list + unblock)
- “My Account” fields update User (username/display_name/email) best-effort.

Important note:
- “bulk change existing posts visibility” is a UI control in v1; do not imply it applies automatically unless implemented as an explicit action.

---

## 2026-02-21 — Friend graph model and endpoints introduced (v1 foundations)

What was added:
- Minimal Friendship data model (directional row, ACCEPTED treated symmetric at read-time).
- Friend endpoints as CSRF-safe POSTs (request/accept/decline/cancel/remove).
- Entity header “Add to Friends” became a real POST form (no JS dependency).

Why:
- FRIENDS visibility and friend-request policies require a queryable relationship.

Caveat:
- UI beyond header wiring is staged; endpoints exist for v1 iteration.

---

## 2026-02-22 — Friend header UI contract + actions parity completed (NEXT_STEPS #2)

What changed:
- Public profile header renders stateful friend controls with real CSRF-safe POST forms:
  - Add to Friends (send request)
  - Requested (cancel outgoing pending)
  - Friends (remove/unfriend)
- Server computes header state (`friend_state`, `friend_request_id`) and passes it into the header include.
- Redirect behavior is caller-controlled via hidden `next=` and enforced as safe local redirect server-side.

Why:
- Friend actions are invoked from multiple surfaces and must return the user to the origin surface.
- Keeping header actions server-rendered (no JS dependency) reduces drift and avoids inconsistent UI state.

---

## 2026-02-22 — Timeline posting policy enforced at write-time (NEXT_STEPS #4)

What changed:
- `posts:create` now enforces `UserSettings.timeline_post_policy` for wall posts:
  - EVERYONE: allow
  - FRIENDS: allow only when currently friends
  - NO_ONE: deny
- Also denies wall posts when blocked either direction.
- Denials do not silently re-route to self; they error + redirect back to the origin surface.

Why:
- This is the minimum “wall posting” safety gate to prevent surprise content placement.
- Policy is enforced at write-time; friendship remains dynamic at read-time.

---

## 2026-02-22 — Post management actions added (NEXT_STEPS #5)

What changed:
- Post cards now expose management actions via the kebab:
  - Author: Edit (inline), Delete
  - Staff/Superuser: Delete (temporary moderation override)
- Inline edit posts to `posts:edit` and maintains the shared next= redirect contract.
- Post permissions logic is centralized via `apps/posts/permissions.py` (via `can_manage_post`).

Why:
- Enables iteration on UX without introducing global JS or new page flows.
- Keeps server-side authorization the source of truth.

---

## 2026-02-22 — Propose Deletion cross-surface redirect contract locked (NEXT_STEPS #6)

What changed:
- Propose Deletion modal submits `next={{ request.get_full_path }}` so it returns to the current surface.
- Shells include shared modals once per page:
  - `layouts/2col_shell.html`
  - `layouts/entity_shell.html`
- Moderation views now enforce safe local redirects for `next=` (prevents open redirects):
  - safe local `next` allowed
  - safe local referer fallback allowed
  - final fallback `/feed/`

Why:
- post_card is cross-surface; it cannot assume /feed/.
- Modal ownership at the shell prevents duplication and missing-modal bugs as new surfaces are added.
- Safe redirect contract is required for security and continuity.

Future note:
- Eligibility gating for proposing deletion (account age, reputation, etc.) should be enforced server-side in `moderation:propose_deletion`.

---

## 2026-02-22 — Post card identity + navigation polish completed (NEXT_STEPS #7)

What changed:
- For real posts, author avatar + display name now link to the author profile catch-all: `/<username>/`.
- Kept cross-surface behavior (no assumptions about /feed/ routes or page context).

Why:
- Post cards are shared across feed and entity pages, so identity navigation must be stable everywhere.
- Direct linking to the canonical profile catch-all improves UX and reduces route coupling.

---

## Ops / deployment gotchas recorded

- Sporadic 500s were explained by mixed gunicorn workers running inconsistent code.
- Fix pattern: confirm expected callable exists, then restart gunicorn so all workers reload consistently.
- Migration file ownership can break makemigrations if created as root; keep app ownership consistent.

---

## 2026-02-22 — Prod migration workflow + permissions gotcha (makemigrations vs migrate)

Observed:
- Running `makemigrations <app>` on prod can fail with `PermissionError` writing into `apps/<app>/migrations/` when `bin/dj` runs as OS user `heypage` but the migrations directory/files are not writable/readable by that user. This was seen when attempting to generate migrations on prod.{index=2}
- “Sporadic 500” behavior can occur when gunicorn workers are running mixed code (some old, some new). Fix pattern is to restart the service after code/migration changes so all workers reload consistently.

Locked guidance (prod-safe default):
- Prefer **NOT** generating migrations on prod. If migration files are already in the repo, on prod run **migrate only**, then restart the service:
  - `sudo -u heypage -H bin/dj migrate`
  - `sudo systemctl restart heypage.service`

If prod must generate migrations (discouraged):
- Ensure migrations packages exist and are owned/permissioned for `heypage`:
  - Ensure directories exist:
    - `sudo install -d -m 0755 -o heypage -g heypage apps/feed/migrations`
    - `sudo install -d -m 0755 -o heypage -g heypage apps/entities/migrations`
  - Ensure `__init__.py` exists:
    - `sudo -u heypage -H bash -lc 'test -f apps/feed/migrations/__init__.py || : > apps/feed/migrations/__init__.py'`
    - `sudo -u heypage -H bash -lc 'test -f apps/entities/migrations/__init__.py || : > apps/entities/migrations/__init__.py'`
  - Fix ownership/permissions:
    - `sudo chown -R heypage:heypage apps/feed/migrations apps/entities/migrations`
    - `sudo chmod -R u=rwX,g=rX,o=rX apps/feed/migrations apps/entities/migrations`
  - Verify/apply:
    - `sudo -u heypage -H bin/dj showmigrations feed entities`
    - `sudo -u heypage -H bin/dj migrate`
    - `sudo systemctl restart heypage.service`

Why:
- Prevents permission-driven migration failures on prod and avoids drift from server-generated migrations.
- Restarting the app service after migrations/code changes prevents mixed-worker “sporadic 500” incidents.
