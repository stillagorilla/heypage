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
- feed: `mockups-original/feed.html`
- owner profile: `mockups-original/my-profile.html`
- public profile: `mockups-original/user-profile.html`

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
Source mockup: `mockups-original/includes_topnav.html`

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
Source mockup: `mockups-original/includes_sidenav.html`

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
- Public profile header: `mockups-original/includes_profile-head.html`
- Owner profile header: `mockups-original/includes_my-profile-head.html`

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
(from `includes_my-profile-head.html`)
- “Change Photo” button
- pencil overlay on avatar
- “Edit Photo” modal with file upload UI

### Public/other-user UI
(from `includes_profile-head.html`)
- “Add to Friends” button (with toast success UI)
- kebab dropdown (Block User, Report User)

### Implementation rule
Do NOT keep separate templates for my-profile vs user-profile headers.
Use `is_owner` to toggle owner controls vs public controls.

## Entity header component (business + group)

### Business header (entity header variant)
Source: `mockups-original/business-page.html`

Contains:
- cover image
- business name + category
- kebab menu actions (Report Profile, Leave Group, Post a Job, Edit)
- external website link
- tab pills: About / Team / Jobs / Reviews
- action buttons: Invite / Join Company

### Group header (entity header variant)
Source: `mockups-original/group-page.html`

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

## Post composer variants by context

Group About tab uses a composer placeholder "Send a message to the group" and a visibility selector with "Everyone / Admins".

Implementation:
- reuse `partials/post/post_composer.html`
- drive variations with context:
  - `composer_prompt`
  - `audience_options` (list)
  - `default_audience`

## Implementation rule

Every time we find a repeated block in mockups:
1) Extract into `templates/partials/...`
2) Replace on templates via `{% include %}`
3) Record the include in this doc (so future refactors don’t re-split components).

## Reviews (Business + User profile)

Goal: determine whether the Business Reviews composer and review cards are close enough to Posts to share components.
Recommendation: share a small "base shell", then keep post vs review as thin specializations.

### Composer base + specializations

Base include (shared chrome):
- `templates/partials/composer/composer_base.html`

Responsibilities:
- avatar block
- container layout + spacing
- textarea slot
- attachments slot
- submit button slot

Post composer (specialization):
- `templates/partials/post/post_composer.html`
- adds: visibility selector (Everyone/Friends/Private) and any post-only controls

Review composer (specialization):
- `templates/partials/reviews/review_composer.html`
- adds: star rating widget (1–5) + any review-only labels (e.g., "Rate this business")

### Content card base + specializations

Base include (shared card structure):
- `templates/partials/cards/content_card_base.html`

Responsibilities:
- header: author, timestamp
- kebab slot (actions)
- body slot (text/media)
- optional footer slot

Post card (specialization):
- `templates/partials/post/post_card.html`
- adds: reactions, comments, share, moderation panel region

Review card (specialization):
- `templates/partials/reviews/review_card.html`
- adds: star rating display (and optionally business link if shown on user profile)

### Reviews summary / distribution

Business reviews page includes a rating summary + distribution visualization.
Include:
- `templates/partials/reviews/review_summary_card.html`

### Moderation reuse on reviews (pending decision)

If reviews can be proposed for deletion (recommended for consistency), reuse:
- `templates/partials/moderation/deletion_vote_panel.html`

Decision needed:
- Are reviews moderation targets with the same "Propose Deletion" → Yes/No → stats/bypass panel flow?
(See OPEN_QUESTIONS.md.)

## Search (topnav live search + hard results)

Sources:
- Hard results page: `mockups-original/search.html`
- Interaction demo JS: `mockups-original/assets/js/app.js`

### Search box (topnav) live results dropdown
Component:
- `templates/partials/search/search_box.html` (embedded inside topnav partial)
- `templates/partials/search/live_results_dropdown.html`

Behavior (mock demo):
- On focus of `#searchBox`: show `.searchResults` dropdown (fade in)
- On blur of `#searchBox`: hide `.searchResults` dropdown (fade out)

Implementation recommendation:
- Phase 1: show/hide dropdown on focus/blur (matches mock)
- Phase 2: HTMX endpoint for live results, debounced input, with "View All" linking to hard results page

### Hard search results page
Template:
- `templates/search/search_results.html`

UI:
- Tabs: Users / Groups / Business
- Users: list rows with avatar + name linking to profile
- Groups/Business: result "row cards" with square image + name + metadata
- Business tab includes an "Add Business" call-to-action linking to create business

Reusable subcomponents:
- `templates/partials/search/user_result_row.html`
- `templates/partials/search/group_result_row.html`
- `templates/partials/search/business_result_row.html`
- `templates/partials/search/add_business_cta.html`

## Modals and interaction demos (system-wide)

Sources:
- Group About page (`group-page.html`)
- Interaction demo JS (`assets/js/app.js`)
- Hard search results (`search.html`)
- Group Members (`group-members.html`)

### Important implementation rule: do not reuse DOM IDs for multiple buttons

Some mockups and demo JS use the same ID (example: `#liveToastBtn`) for multiple actions (Join Group, Add to Friends).
In production templates, IDs must be unique per page.

Rule:
- Replace repeated ID selectors with class selectors (e.g., `.js-show-toast`).
- Use `data-*` attributes to pass toast message/type (e.g., `data-toast-title`, `data-toast-body`).
- Attach event listeners using event delegation on a stable container (e.g., `document.body`).

### Modal taxonomy (normalize naming and reuse)

Recommended Django partials:
- `templates/partials/modals/invite_modal.html`
- `templates/partials/modals/propose_deletion_modal.html`
- `templates/partials/modals/upload_image_modal.html`
- `templates/partials/modals/edit_business_modal.html`
- `templates/partials/modals/edit_profile_photo_modal.html` (owner profile photo)

Observed in mockups:
- Invite modal:
  - Triggered from Group About page via Invite button: `data-target="#inviteModal"`.
- Propose Deletion modal:
  - Triggered from post kebab menus using `data-target="#reportModal"` across feed/entity pages.
- Upload image modal:
  - Used by demo JS when generating edit-post composer (references `#uploadImgModal`).
- Toast-based join/confirmations:
  - Group About "Join Group" uses `#liveToastBtn` and triggers a toast, not a modal.
  - Group Members "Add to Friends" uses the same `#liveToastBtn` pattern for success feedback.

Implementation rule:
- Prefer reusable modal partials with consistent IDs.
- Do not duplicate modal HTML across pages. Include once in `base.html` (or per template) and trigger it via data attributes.
- Replace demo-only IDs that are reused incorrectly (e.g., multiple `#liveToastBtn` instances) with class-based selectors.

### Topnav search and related interactions (demo JS)

Search dropdown:
- Show live search dropdown on focus of `#searchBox`
- Hide on blur of `#searchBox`

Hard results page:
- Tabbed results for Users / Groups / Business, plus an "Add Business" CTA.

Other interaction demos worth implementing in MVP:
- Side nav open/close via `#sideNavToggle`.
- Reaction popover on `.addReaction` hover/click.
- Share popover on `.shareLink` click.
- Emoji popover on `.addEmoji`.
- Reply toggle "Show replies" on `.toggleReply`.
- Voting panel: clicking Yes/No changes label and reveals vote results.

## Group Photos and Albums (shared with user/group/business contexts)

Sources:
- `mockups-original/group-photos.html`
- `mockups-original/group-photos-album.html`

### Photo grid (square thumbnails)
Django include:
- `templates/partials/media/photo_grid.html`

Used for:
- group photos tab
- (future) user photos tab
- (future) business photos/media areas

Notes:
- grid uses "square" image tiles (`square-img` pattern)

### Album tile grid
Django include:
- `templates/partials/media/album_tile.html`
- `templates/partials/media/album_grid.html`

Depicts:
- album cover image (square)
- album title
- item count

### Album detail page
Template:
- `templates/groups/group_album_detail.html` (or a generic `album_detail.html`)

Includes:
- `photo_grid.html`
- "Add To Album" action button (permission gated)

### Upload photos modal (Add Photos)
Observed:
- `group-photos-album.html` includes `#uploadModal` with drag/drop file input UI.

Django include:
- `templates/partials/modals/upload_photos_modal.html`

Rule:
- modal HTML should not be duplicated across pages; include once per template (or in `base.html`) and trigger via `data-target`.

## Photos and Albums (shared across user + group)

Sources:
- User (owner) photos: `my-photos.html`
- User (public) photos: `user-profile-photos.html`
- User album detail: `my-photos-album.html`
- User edit photos: `edit-photos.html`
- Group photos: `group-photos.html`
- Group album detail: `group-photos-album.html`

### Shared layout pattern
Photos pages use:
- entity header include (user/group)
- a tabbed card with Photos and Albums tabs
- grid of square thumbnails (`square-img` inside `.gallery-img`)
- album tiles with cover image + title + item count

### Reusable partials

Photo thumbnail tile:
- `templates/partials/media/photo_tile.html`
- Inputs: `media_asset`, optional `selectable` (for edit mode)

Photo grid:
- `templates/partials/media/photo_grid.html`
- Inputs: list of `media_assets`, grid sizing options

Album tile:
- `templates/partials/media/album_tile.html`
- Inputs: `album` (title, cover, item_count), `href`

Album grid:
- `templates/partials/media/album_grid.html`

Photos/Albums tabs card:
- `templates/partials/media/photos_tabs_card.html`
- Inputs:
  - `active_tab` in {photos, albums}
  - `photos_count`, `albums_count`
  - `show_owner_actions` (bool)
  - `photos` list
  - `albums` list

### Owner-only actions (user owner context)
From `my-photos.html`:
- Add Photos modal button
- New Album modal button
- Edit Photos link to `edit-photos.html`

From `my-photos-album.html`:
- Rename album modal (`#albumNameModal`)
- Add To Album upload modal (`#uploadModal`)
- Edit Photos link to `edit-photos.html`

### Public/other-user photos (no owner actions)
`user-profile-photos.html` shows photos + album tiles, but no add/edit actions.

### Group photos
`group-photos.html` and `group-photos-album.html` mirror the same tabs + grids.
Album tiles link to `group-photos-album.html`.

### Edit Photos (selection + move to album)
`edit-photos.html` depicts:
- selectable thumbnails (checkbox overlay)
- per-photo date field that becomes editable on click (readonly -> editable input)
- "Move To Album" modal (`#albumModal`) listing albums with checkbox selection
- "Select All" action (currently a link)

Recommended include:
- `templates/partials/media/edit_photos_grid.html`
- `templates/partials/modals/move_to_album_modal.html`

### Upload/Add Photos modal (shared)
Both user and group album detail pages use an `#uploadModal` "Add Photos" drag/drop upload UI.

Normalize into a single partial:
- `templates/partials/modals/upload_photos_modal.html`

Permission gating:
- only show upload/new/rename/move/edit actions when viewer has edit permission:
  - user owner viewing own profile
  - group members/admins as configured
