# Project Ledger (decisions + notable changes)

This file is the historical “why” log. If something was discovered the hard way, it belongs here so we don’t repeat it.

Last updated: 2026-02-21

## 2026-02-21 — Clean post architecture implemented (apps/posts owns Post)

What changed (intent):
- Post is cross-surface content, not feed-specific.
- apps/posts now owns:
  - Post model (logical ownership)
  - write endpoints (composer POST target)
- Feed is a read-only surface that displays posts.

How it was implemented (Phase A, no DB churn beyond required fields):
- Kept legacy DB table name `feed_post` to avoid risky table rename during live development.
- Added state alignment migration so posts app state matches the real BigAutoField ID shape.
- Prevented Django model conflicts by removing the feed.Post model class and re-exporting:
  - apps/feed/models.py re-exports Post from apps/posts for compatibility.

Why we did it:
- The composer is used on multiple surfaces (feed and entity profiles now; more later).
- Posting from a profile must redirect back to the profile, not force a feed redirect.
- Ownership in apps/posts prevents repeated “feed owns Post” coupling.

## 2026-02-21 — Timeline targeting and visibility foundations added to Post

What was added:
- timeline_owner: whose timeline the post appears on (supports future wall posts).
- visibility: PUBLIC, FRIENDS, PRIVATE.

Locked rules captured:
- Friendship is evaluated at read-time (dynamic), not frozen at write-time.
- Users can change post visibility later (visibility is not write-once).

Important sequencing decision:
- “Who can post to your Timeline?” settings and friend graph enforcement are deferred.
- Until those exist, wall posting behavior should remain conservative.

## 2026-02-21 — Template rendering gotchas discovered and locked as rules

Observed issues on hp-prd-web01:
- Inline `{# ... #}` comments unexpectedly rendered in-page in some contexts.
- Multi-line `{% include ... with ... %}` tags rendered as literal text inside loops, appearing once per loop iteration.

Locked mitigations:
- Prefer `{% comment %} ... {% endcomment %}` for all continuity comments in templates.
- Keep complex include tags on a single line, especially within loops.

## 2026-02-21 — Drift correction: user profile and entity shell contracts re-locked

- Re-aligned templates/entities/user/profile.html to the profile_view contract:
  - uses profile_user
  - includes templates/components/entity/entity_header.html
- Left-column profile cards remain inline for now:
  - extraction only after mockup parity and stable card API.

## 2026-02-21 — Phase 2 progress: routing + moderation + auth + profile groundwork

Completed highlights:
- Locked routing surfaces in config/urls.py:
  - /feed/, /search/, /settings/, /chat/, /g/<slug>/, /b/<slug>/, and /<username>/ catch-all last.
- Reserved username enforcement:
  - apps/accounts/reserved_words.py and route-time guard in profile_view.
- Moderation MVP:
  - apps/moderation models with generic targets and server-rendered panel state.
- Auth MVP:
  - /login/ and /register/ honor next= redirect contract.

Key ops gotchas recorded:
- INSTALLED_APPS duplication in prod settings can create duplicate app labels.
- Migration write permissions on the VM can break makemigrations if owned by root.

Template architecture regression found and fixed:
- entity_shell.html drift caused side nav and grid parity loss.
- Decision: entity_shell is locked and must match the phase contract (spacer, sideNav, mainWrap parity).

## Workflow rule set adopted (anti-drift discipline)

These rules are now part of the project process:

- Always request and review the latest file contents before producing updates.
- Treat comments in templates and views as embedded documentation and preserve them.
- Provide complete pasteable file replacements for any changed file.
- Keep changes minimal and explicitly scoped.
