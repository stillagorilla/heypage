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
- User header is rendered via `templates/components/entity/entity_header.html` using:
  - `is_owner` (viewer == profile user)
  - `profile_user` (the profile being viewed)
  - `header_uid` (username recommended)

### 3) Wire profile routing + view contract (DONE, keep locked)
- `apps/accounts.views.profile_view`:
  - enforces reserved usernames
  - loads `profile_user`
  - computes `is_owner`, passes `active_tab="about"`
  - renders `templates/entities/user/profile.html`

### 4) Keep mockups as the source of truth
- When in doubt, copy the structure/classes/ordering from mockups first, then extract components.
- Avoid “simplifying” markup until parity is achieved.

### 1) Re-lock the entity shell layout
Goal: Ensure entity pages match the “sidenav-wrap + mainWrap” structure used by the mockups and the 2col shell.

- `templates/layouts/entity_shell.html` must:
  - include `includes/top_nav.html`
  - include `includes/side_nav.html`
  - preserve spacer + sidenav-wrap + `#mainWrap` parity with `templates/layouts/2col_shell.html`
  - provide only block slots (`entity_left`, `entity_center`, `entity_right`) — no page template grid rebuilding

### 2) Implement user profile route + page
Goal: `/@username/` catch-all renders user profile page (owner vs public context) using the locked entity shell.

- `apps/accounts.views.profile_view` should:
  - enforce reserved usernames
  - load profile user
  - pass `is_owner`, `active_tab="about"`
  - render `templates/entities/user/profile.html`

### 3) Build user entity header from mockups
Goal: Match `mockups-original/my-profile.html` and `mockups-original/user-profile.html`.

- Decide + document the final `entity_header` structure:
  ### 3) Build user entity header from mockups
...
### 3) Keep entity header stable (DO NOT DRIFT)
- Current implementation is a single template:
  - `templates/components/entity/entity_header.html`
- Any refactor to base/wrappers must be a deliberate migration step with docs + shims,
  not an ad-hoc change, to prevent drift.

### 4) Left-column cards + center composer + post cards
- Bring left column cards into parity with mockups (Intro, Photos, Friends, etc.)
- Ensure center column:
  - header card
  - post composer
  - post cards list
  - moderation panel behavior remains consistent on posts

### 5) Naming cleanup (later)
- Rename `templates/components/composer.html` → `post_composer.html`
- Provide a shim include so existing pages don’t break during the rename window.
