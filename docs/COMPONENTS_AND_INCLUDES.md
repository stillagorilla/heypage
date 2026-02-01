# Components and Includes

Goal: normalize inconsistent mockup terms ("tile", "card", "voting stuff") into a single component taxonomy
so we can convert static HTML into reusable Django includes.

## Naming standards

Use: `component_*` names for conceptual UI blocks, and `partials/` for Django includes.

Examples:
- component_post → `templates/partials/post/post_card.html`
- component_comment → `templates/partials/post/comment.html`
- component_composer ("make post") → `templates/partials/post/composer.html`
- component_moderation ("voting stuff") → `templates/partials/moderation/mod_controls.html`

## Highest-value reusable blocks (initial list)

Global layout:
- `base.html` (page frame)
- `partials/nav/top_nav.html`
- `partials/nav/left_nav.html`
- `partials/footer.html` (if present)

Feed + posts:
- Post composer ("make post")
- Post card ("Post")
- Post kebab menu + actions (edit / propose deletion / delete)
- Comment list
- Comment composer (text + image + emoji)
- Media grid (post photos)
- Reaction picker / reaction summary

Moderation:
- "voting stuff" block (placeholder name in mockups)
  - Must match the custom democratic moderation model (not upvote/downvote/report).

Profile pages:
- Profile header (avatar, name, stats, buttons)
- Profile tabs nav
- “About”/details blocks
- Friends list grid
- Photo grid
- Groups list
- Reviews list

## Feed + posts (confirmed from feed + profile mockups)

Sources:
- feed: `mockups-original/feed.html` :contentReference[oaicite:11]{index=11}
- owner profile: `mockups-original/my-profile.html` :contentReference[oaicite:12]{index=12}
- public profile: `mockups-original/user-profile.html` :contentReference[oaicite:13]{index=13}

### Post composer ("make post" card)
Django include:
- `templates/partials/post/post_composer.html`

Contains:
- textarea
- attach image button (modal on feed)
- emoji button
- visibility selector (Everyone/Friends/Private)
- Post submit button

Context:
- `placeholder_text` (varies by page/context)
- `visibility_default`
- `allow_media` (bool)

### Post card
Django include:
- `templates/partials/post/post_card.html`

Contains:
- author avatar/name + timestamp
- kebab menu: Edit / Delete / Propose Deletion
- body text and/or media grid
- reaction controls + counts
- share button
- comment thread (see below)
- moderation panel (conditional)

Context:
- `post`
- `viewer` / `request.user`
- `can_edit`, `can_delete`
- `show_moderation_panel` (bool)

### Comment thread (variants)
Django includes:
- `templates/partials/post/comment_thread.html`
- `templates/partials/post/comment.html` (recursive for replies)
- `templates/partials/post/comment_form.html`

Depicts:
- nested replies + "Show X replies"
- "Show N more comments" paging
- comment-level reactions in some variations

### Moderation: deletion voting panel ("voting stuff")
Django include:
- `templates/partials/moderation/deletion_vote_panel.html`

State sequence:
1) User selects "Propose Deletion" from kebab menu.
2) Panel expands to show proposal details + Yes/No voting controls.
3) After a vote, panel expands to show vote totals + threshold + representative bypass requirement.

Context:
- `proposal` (nullable)
- `user_vote` (nullable)
- `proposal_status` (open/closed/passed/failed)
- `time_remaining`
- `threshold_rule` (e.g., 2/3 supermajority)
- `rep_votes_remaining` + rep-bypass UI state (if applicable)

## Global layout includes (confirmed from mockups)

### Top navigation
Source mockup: `mockups-original/includes_topnav.html` :contentReference[oaicite:4]{index=4}

Django include:
- `templates/partials/nav/top_nav.html`

Contains:
- brand/logo → feed
- mobile side nav toggle (`#sideNavToggle`)
- friend request dropdown (accept/decline actions)
- chat link + badge
- notifications icon
- profile dropdown (view profile/settings/logout)
- live search UI:
  - input `#searchBox`
  - dropdown categorized Users / Groups / Businesses
  - “View All” button → hard results page (`search.html`)

### Side navigation
Source mockup: `mockups-original/includes_sidenav.html` :contentReference[oaicite:5]{index=5}

Django include:
- `templates/partials/nav/side_nav.html`

Contains:
- links to feed + owner-context pages (my-profile, my-friends, my-photos, my-reviews, my-groups, my-business)
- footer links and copyright

Implementation notes:
- Drive active state via context var `active_nav`.
- Use Django `url` names instead of hardcoded HTML filenames once routes exist.

## Profile header component (owner/public consolidated)

### Source mockups
- Public profile header: `mockups-original/includes_profile-head.html` :contentReference[oaicite:6]{index=6}
- Owner profile header: `mockups-original/includes_my-profile-head.html` :contentReference[oaicite:7]{index=7}

### Django include
- `templates/partials/profile/profile_header.html`

### Context
- `profile_user`
- `is_owner` (bool)
- `active_tab` in {about, photos, friends, groups, reviews, business}
- `badges` (e.g., Representative, Influencer)
- `friendship_state` (none/requested/friends/blocked) [initial enum]
- `counts` (photos_count, friends_count, etc.) [optional]

### Owner-only UI
(from `includes_my-profile-head.html`) :contentReference[oaicite:8]{index=8}
- “Change Photo” button
- pencil overlay on avatar
- “Edit Photo” modal with file upload UI

### Public/other-user UI
(from `includes_profile-head.html`) :contentReference[oaicite:9]{index=9}
- “Add to Friends” button (with toast success UI)
- kebab dropdown (Block User, Report User)

### Implementation rule
Do NOT keep separate templates for my-profile vs user-profile headers.
Use `is_owner` to toggle owner controls vs public controls.

## Entity header component (business + group)

### Business header (entity header variant)
Source: `mockups-original/business-page.html` :contentReference[oaicite:6]{index=6}

Contains:
- cover image
- business name + category
- kebab menu actions (Report Profile, Leave Group, Post a Job, Edit)
- external website link
- tab pills: About / Team / Jobs / Reviews
- action buttons: Invite / Join Company

### Group header (entity header variant)
Source: `mockups-original/group-page.html` :contentReference[oaicite:7]{index=7}

Contains:
- cover image
- group name
- kebab menu actions (Report Page, Leave Group)
- tab pills: About / Photos / Members
- action buttons: Invite / Join Group

### Django include
- `templates/partials/entity/entity_header.html`

Context:
- `entity_type` in {user, business, group}
- `entity` object
- `active_tab`
- `viewer_membership_state` (none/requested/member/admin/etc.)
- optional counters for tab badges

## Implementation rule

Every time we find a repeated block in mockups:
1) Extract into `templates/partials/...`
2) Replace on templates via `{% include %}`
3) Record the include in this doc (so future refactors don’t re-split components).
