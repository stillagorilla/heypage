# Pages and Context Depictions

This document maps static mockups to the fewest Django templates needed.

## Context depiction pairs to consolidate (owner vs public)

These mockups depict the same underlying page with different permissions/UI:

- user-profile.html + my-profile.html
- user-profile-groups.html + my-groups.html
- user-profile-photos.html + my-photos.html
- user-profile-friends.html + my-friends.html
- user-profile-reviews.html + my-reviews.html
- user-profile-business.html + my-business.html

### Proposed Django template consolidation pattern

**Profile shell (users)**
- Template: `templates/profiles/profile_detail.html`
- Context:
  - `profile_user` (User)
  - `is_owner` (bool)
  - `active_tab` in {posts, about, friends, photos, groups, reviews, business}
- Notes:
  - Owner-only UI is controlled by `is_owner` (edit buttons, privacy controls, etc.)
  - Public UI hides owner-only controls and shows follow/friend actions as applicable

## Canonical route patterns (high level)

### User profiles
- `/<username>/` → profile detail (default tab)
- `/<username>/photos/` → photos tab
- `/<username>/friends/` → friends tab
- etc.

### Business profiles
- `/<business-slug>/` → business profile
- Includes “Reviews” section that aggregates reviews posted by users.

### Group profiles
- `/<group-slug>/` → group profile

> Important: slugs must be unique across user, business, and group namespaces OR we must reserve distinct prefixes (e.g., /u/, /b/, /g/). Decide in OPEN_QUESTIONS.md.
