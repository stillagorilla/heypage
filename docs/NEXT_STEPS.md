# Next Steps

This file is forward-looking only. Completed work should move to `PROJECT_LEDGER.md`.

Current date: 2026-02-21

## Current status (1 paragraph)

Phase 2 (Core Models + Routing) is delivering a working vertical slice on hp-prd-web01: `/feed/` is server-rendered, posts can be created and displayed, and Propose Deletion is wired via a modal and a session-backed stub that renders the correct “Voted + extras” state for the proposer. Routing surfaces are locked, including `/g/<slug>/`, `/b/<slug>/`, and root username catch-all last with reserved-words enforcement. Template architecture remains locked: base skeleton only, shells under `templates/layouts/`, chrome in `templates/includes/`, and reusable blocks in `templates/components/`.

## Do next (in order)

### 1) Restore entity shell parity (fix regression)
- Ensure `templates/layouts/entity_shell.html` matches the Phase 1 locked contract:
  - includes top_nav + side_nav
  - includes the sidenav spacer column
  - uses `#mainWrap` and the two internal columns (left cards + center feed-like)
- Verify `/hpuser2/` renders with sidenav and correct column structure.

### 2) Implement user profile page template from mockups (owner vs public)
- Add `templates/entities/user/profile.html` extending `layouts/entity_shell.html`.
- Build the page structure to match `my-profile.html` and `user-profile.html` mockups:
  - entity header card (center column, first)
  - left column: Bio card + Friends preview + Recent Photos preview
  - center column: composer + post cards (feed-like)
- Extract the user header into `templates/components/entity/entity_header.html` and render it via context:
  - `is_owner` (viewer == profile user)
  - `subject_user` (the profile being viewed)

### 3) Wire profile routing + view contract
- Update `apps/accounts.views.profile_view` to:
  - load `subject_user` by username (404 if missing)
  - compute `is_owner`
  - render `templates/entities/user/profile.html` with the expected context

### 4) Keep mockups as the source of truth
- When in doubt, copy the structure/classes/ordering from mockups first, then extract components.
- Avoid “simplifying” markup until parity is achieved.
