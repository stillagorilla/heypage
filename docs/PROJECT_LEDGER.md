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
- `timeline_owner`: whose timeline the post appears on (supports future wall posts).
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

## 2026-02-22 — NEXT_STEPS #4 completed: enforce timeline posting policy at write-time

What was implemented:
- `posts:create` enforces `UserSettings.timeline_post_policy` for wall posts:
  - EVERYONE: allow
  - FRIENDS: allow only when currently friends
  - NO_ONE: deny
- Blocking is enforced at write-time: if either user blocked the other, deny wall posts.
- Denied wall posts do not silently re-route to author timeline.
- Redirect contract remains stable via safe `next` handling.

Why:
- Wall posts are permissioned by the timeline owner, not by the viewing surface.
- Write-time enforcement prevents “surprising” cross-user content writes and reduces moderation burden.

---

## 2026-02-22 — NEXT_STEPS #5 completed: post management actions (edit + delete)

What was implemented:
- Post management actions exist and are enforced server-side:
  - Edit: author-only.
  - Delete: author or staff/superuser override (temporary moderation seam).
- Inline edit UI exists on post cards (Edit toggles an in-card form with Save/Cancel).
- Delete is exposed in the kebab menu for authorized users (author and staff/superuser).

Continuity note:
- Hard delete is currently used to unblock moderation UX iteration.
- Later decision: replace with tombstones / soft-delete rules once moderation resolution UI is stable.

---

## Ops / deployment gotchas recorded

- Sporadic 500s were explained by mixed gunicorn workers running inconsistent code.
- Fix pattern: confirm expected callable exists, then restart gunicorn so all workers reload consistently.
- Migration file ownership can break makemigrations if created as root; keep app ownership consistent.
