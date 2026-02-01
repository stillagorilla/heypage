# Pages and Context Depictions

This document maps static mockups to the fewest Django templates needed, by consolidating “context depictions”
(owner vs public) into single dynamic templates.

The mockup set lives in `mockups-original/`. :contentReference[oaicite:2]{index=2}

## Pages with NO context depictions (single canonical page)

These pages exist as a single mockup each (no owner/public variants):

- `feed.html` — home page for logged-in users
- `search.html` — hard search results after submit (or “View All” from live search)
- `login-register.html` — registration/login
- `reset-password.html`
- `settings.html`
- `chat.html`
- `emails/index.html` — base template for site-generated emails
- `coming-soon.html` — placeholder for production while under development

These mockups depict the same underlying page with different permissions/UI and should become ONE Django template per feature area:

- `user-profile.html` + `my-profile.html`
- `user-profile-groups.html` + `my-groups.html`
- `user-profile-photos.html` + `my-photos.html`
- `user-profile-friends.html` + `my-friends.html`
- `user-profile-reviews.html` + `my-reviews.html`
- `user-profile-business.html` + `my-business.html`

Rule of thumb:
- “my-*” = owner context (editable controls, owner-only widgets, private data)
- “user-profile-*” = public/other-user context (follow/friend controls, privacy-respected data)

## Other key pages (non-profile)

Business:
- `create-business.html`
- `business-page.html`
- `business-page-closed.html`
- `business-team.html`
- `business-jobs.html`
- `business-reviews.html`

Groups:
- `group-page.html`
- `group-members.html`
- `group-photos.html`
- `group-photos-album.html`

Photos:
- `edit-photos.html`
- `my-photos-album.html` (album view in owner context)

System / index:
- `index.html` (mockup index/navigation; not a production page)

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

## Confirmed include usage

The mockups implement the following as reusable includes, and these map directly to Django `{% include %}` partials:

- `includes_topnav.html` → `partials/nav/top_nav.html` :contentReference[oaicite:10]{index=10}
- `includes_sidenav.html` → `partials/nav/side_nav.html` :contentReference[oaicite:11]{index=11}
- Profile header:
  - `includes_profile-head.html` + `includes_my-profile-head.html`
  → `partials/profile/profile_header.html` driven by `is_owner` :contentReference[oaicite:12]{index=12} :contentReference[oaicite:13]{index=13}

## Canonical route patterns (high level)

### User profiles: one template, tab-driven
- Template: `templates/profiles/profile_detail.html`
- Context:
  - `profile_user`
  - `is_owner`
  - `active_tab` in `{posts, about, friends, photos, groups, reviews, business}`

Owner/public differences are controlled by `is_owner` and permissions, NOT separate templates.

> NOTE: This same “tab-driven” pattern can apply to business/group pages if the UI uses tabbed sections.

### Business profiles
- `/<business-slug>/` → business profile
- Includes “Reviews” section that aggregates reviews posted by users.

### Group profiles
- `/<group-slug>/` → group profile

> Important: slugs must be unique across user, business, and group namespaces OR we must reserve distinct prefixes (e.g., /u/, /b/, /g/). Decide in OPEN_QUESTIONS.md.
