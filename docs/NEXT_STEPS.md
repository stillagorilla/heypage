# Next Steps

This file is forward-looking only. Completed work should move to `PROJECT_LEDGER.md`.

Current date: 2026-02-21

## Current status (1 paragraph)

Phase 2 (Core Models + Routing) is delivering a working vertical slice on hp-prd-web01: `/feed/` is server-rendered, posts can be created and displayed, and Propose Deletion is wired via a modal and a session-backed stub that renders the correct “Voted + extras” state for the proposer. Routing surfaces are locked, including `/g/<slug>/`, `/b/<slug>/`, and root username catch-all last with reserved-words enforcement. Template architecture remains locked: base skeleton only, shells under `templates/layouts/`, chrome in `templates/includes/`, and reusable blocks in `templates/components/`.

## Do next (in order)

### 1) Moderation models (real persistence, still minimal)
- Add models (MVP):
  - ModerationProposal: target_post FK, proposed_by, reason(s)/clarification, created_at, closes_at, status
  - ModerationVote: proposal FK, voter FK, yes/no, created_at
- Rules:
  - proposer auto-votes YES at proposal creation
  - viewer state:
    - not voted -> PROPOSED (Agree?)
    - voted -> VOTE IN PROGRESS (Voted + extras)

### 2) Replace session stub with DB-backed behavior
- `/feed/propose-deletion/`:
  - Create proposal row
  - Auto-create vote YES for proposer
  - Redirect back to feed
- Feed render:
  - annotate each post with open proposal info
  - compute viewer state from vote existence

### 3) Tombstone UI state (suppressed content)
- Add `components/moderation_tombstone.html` and swap post body for tombstone copy when suppression applies.
- No hard delete.

### 4) Add a harness for “other user” PROPOSED state
- Use a second account, or add a dev-only querystring override (DEBUG-only).

### 5) Profile routing stubs (next horizontal slice)
- Implement minimal `/<username>/` profile template with correct layout shell (entity shell).
- Keep routing order and reserved words constraints intact.

## Verification checklist (hp-prd-web01)
- `sudo -u heypage -H bin/dj check`
- `sudo -u heypage -H bin/dj migrate`
- smoke:
  - login → create post → verify it appears
  - propose deletion → verify “Voted + extras”
  - clear moderation stub → verify moderation disappears
