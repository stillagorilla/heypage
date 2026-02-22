# Next Steps (forward-looking only)

This file lists only what we believe is still ahead.
Completed work should be moved into PROJECT_LEDGER.md so history stays stable.

Last updated: 2026-02-22

---

## Completed

### 4) Enforce timeline posting policy (wall posts) at write-time
Status: Completed (see PROJECT_LEDGER.md 2026-02-22 entry)

Scope that was delivered:
- Enforce `UserSettings.timeline_post_policy` for wall posts.
- Deny wall posts when blocked either direction.
- Do not silently re-route denied wall posts.
- Keep redirect behavior stable via safe `next` contract.

### 5) Post management actions (edit + delete)
Status: Completed (see PROJECT_LEDGER.md 2026-02-22 entry)

Scope that was delivered:
- Author-only edit.
- Author delete + staff/superuser delete override.
- Inline edit UI on post cards.
- Kebab menu actions show only when authorized.

---

## Do next (in order)

### 6) Fix “Propose Deletion” redirect contract across surfaces (do not assume /feed/)
Problem:
- `post_card.html` is included on multiple surfaces (feed, profile, and future entity pages).
- The Propose Deletion modal currently hardcodes `next` to `/feed/` in the modal form.
- This breaks the “stay on the page you acted from” contract and will create drift as more surfaces adopt post cards.

Target behavior (LOCKED intent):
- Propose Deletion should redirect back to the surface where the user clicked it.
- The server should continue to enforce a safe local redirect.

Implementation approach (v1):
- Set the modal form’s `next` value dynamically at click time to the current page:
  - Prefer `request.get_full_path` if available in context, or
  - Populate via JS using `window.location.pathname + window.location.search`.
- Keep the modal reusable and avoid embedding feed-specific assumptions.

Continuity notes:
- Later gating may be required (account age, reputation, etc.).
- For now, we only ensure correct redirect behavior across surfaces.

### 7) Reduce duplication of “friend relationship” helpers (optional, once stable)
Observation:
- `_are_friends` / friend visibility checks exist in multiple view modules.
- This is acceptable during iteration, but becomes drift-prone once more surfaces are added.

Candidate next step:
- Introduce a shared helper (or service) in one place and import it,
  once the friend graph rules stop changing weekly.

### 8) Comment placeholder “Leave a comment” UI (future work)
Scope:
- The post card shows a comment box placeholder that does not post anywhere yet.
- Add a clear comment marker that it is scaffold only (no endpoint yet),
  so we do not confuse it with a wired feature.

---

## Notes / constraints (keep stable)

- Preserve the anti-drift workflow:
  - Heavily comment files.
  - Always request the latest version of any file before editing.
  - Provide complete pasteable replacements only.
- Do not allow layout shells to drift:
  - `2col_shell.html` and `entity_shell.html` outer grid parity is locked.
- Do not assume a post is “feed content”:
  - Posts are cross-surface content owned by apps/posts.
