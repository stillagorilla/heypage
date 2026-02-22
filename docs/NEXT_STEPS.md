# Next Steps

This file is forward-looking only. Completed work should move to PROJECT_LEDGER.md.

Current date: 2026-02-21

---

## Current status (1 paragraph)

Phase 2 has a working vertical slice on hp-prd-web01. Routing surfaces are locked (including username catch-all last with reserved-words enforcement). Template architecture remains locked (base skeleton only; shells under templates/layouts; chrome in templates/includes; reusable blocks in templates/components). Post architecture is now cross-surface: Post is owned by apps/posts, the composer posts to posts:create with a next= redirect contract, and timelines/visibility are in place. Moderation UI matches mockup state behavior. Settings mockup is implemented and persists User + UserSettings controls. Friend graph foundations and CSRF-safe friend endpoints exist; UI wiring is staged.

---

## Do next (in order)

### 1) Keep documentation current (always)
- If any decision is “locked,” it must be recorded in:
  - ARCHITECTURE_SNAPSHOT.md
  - COMPONENTS_AND_INCLUDES.md
- If something changed because we learned the hard way, add it to:
  - PROJECT_LEDGER.md

### 2) Friends UI parity and policy wiring (next increment)
Goal:
- Make entity header friend controls match mockups for:
  - button styles per state (Add / Requested / Friends / Accept / Decline)
  - state transitions from actual Friendship rows

Work items:
- Ensure profile_view computes:
  - `friend_state` and `friend_request_id` for header template
- Ensure header uses mockup-correct classes per state.

### 3) Visibility filtering with friendships (read-time rules)
Goal:
- Make read-time visibility reflect current friendship state.

Work items:
- Profile timeline query:
  - owner sees all
  - non-owner sees PUBLIC
  - non-owner sees FRIENDS only if viewer and profile_user are currently friends
- Feed query:
  - include viewer’s own posts (all visibility)
  - include PUBLIC posts by anyone
  - include FRIENDS posts by accepted friends (once friend graph is used in query)

### 4) Timeline posting policy (write-time enforcement for wall posts)
Goal:
- Enforce “Who can post to your Timeline?” once policy + friends are stable.

Work items:
- In posts:create:
  - allow wall posts only if policy allows (EVERYONE / FRIENDS / PRIVATE)
  - deny when blocked either direction
- UI for posting to others’ timelines is staged; do not ship silent wall posts that are later hidden.

### 5) Post management actions (edit/delete/visibility update)
Goal:
- Wire post kebab actions to real endpoints.

Work items:
- Author-only edit endpoint + UI
- Author-only delete endpoint (soft-delete vs tombstone decision later)
- Author-only visibility update endpoint is already present; wire UI when ready.

### 6) Resume mockup parity improvements (profile)
- Continue matching mockups for:
  - left stack cards and spacing
  - header actions
  - tabs behavior as those routes/components are implemented

### 7) Phase B: rename legacy DB table (deliberate migration)
- Rename `feed_post` to a posts-owned name in a deliberate migration.
- Update docs and confirm no code assumes the old table name.
