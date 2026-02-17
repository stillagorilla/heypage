# Pages and Context Depictions

This document maps static mockups to the fewest Django templates needed, by consolidating “context depictions”
(owner vs public) into single dynamic templates.

The mockup set lives in `mockups-original/`.

## Pages with no context depictions (single canonical page)

These pages exist as a single mockup each (no owner/public variants):

- `feed.html` — home page for logged-in users
- `search.html` — hard search results after submit (or “View All” from live search)
- `login-register.html` — registration/login
- `reset-password.html`
- `settings.html`
- `chat.html`
- `emails/index.html` — base template for site-generated emails
- `coming-soon.html` — placeholder for production while under development

## Pages with context depictions (owner vs public)

These mockups depict the same underlying page with different permissions/UI and should become **one** Django template per surface:

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

## Proposed Django template consolidation pattern

### User profile shell (tab-driven)
- Template: `templates/profiles/profile_detail.html`
- Context:
  - `profile_user` (User)
  - `is_owner` (bool)
  - `active_tab` in `{posts, about, friends, photos, groups, reviews, business}`

Owner/public differences are controlled by `is_owner` and permissions (not separate templates).

### Entity pages share a common layout skeleton (user / business / group)
Observation: business and group pages use the same structural layout as user profiles:
- global chrome (topnav + sidenav)
- entity header card (business/group equivalent of profile header)
- left sidebar cards
- center feed-like column when About tab is active

Recommended consolidation:
- `templates/entities/entity_detail.html` (generic entity shell)
- wrappers that set context:
  - `templates/profiles/profile_detail.html` extends entity shell
  - `templates/business/business_detail.html` extends entity shell
  - `templates/groups/group_detail.html` extends entity shell

Tabs are context-driven (`active_tab`), not separate templates.

## Confirmed include usage (canonical)

Global includes must use canonical include paths from `CANONICAL_PATHS.md`:

- `templates/includes/top_nav.html`
- `templates/includes/side_nav.html`

Any mockup “includes_*.html” files are considered source material only.

## Canonical route patterns (locked)

The public URL scheme is locked (see `ARCHITECTURE_SNAPSHOT.md`):

- User profiles: `/<username>/`
- Group pages: `/g/<slug>/`
- Business pages: `/b/<slug>/`

Important:
- Register fixed routes and prefixed routes before the user catch-all.
- Place `/<username>/` last.

