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

## Business Reviews page (confirms review is post-like + moderation applies)

Sources:
- `mockups-original/my-reviews.html`
- `mockups-original/user-profile-reviews.html`
- `mockups-original/business-reviews.html`

### Conclusion: Reviews share the Post Card component

In mockups, a review is rendered using the same structure as a post card:
- author header + timestamp
- kebab menu with Edit / Delete / Propose Deletion
- reactions + share buttons
- comment composer ("Leave a comment")
Therefore, implement reviews by reusing the post card template and injecting review-specific subcomponents.

### Review composer (make-post variant)
This is the standard post composer layout with review-specific controls:
- star rating buttons (1..5)
- textarea placeholder: "Leave a review!"
- image + emoji buttons
- Post submit button

Recommendation:
- Implement as a specialization of the post composer:
  - `templates/partials/reviews/review_composer.html`
  - reuse shared composer shell layout

### Review card (post card with inserts)
Review cards match the post card structure and include:
- header with author + timestamp + star rating display
- kebab menu: Edit / Delete / Propose Deletion
- body text + optional media grid
- reaction/share actions
- comment composer

Recommendation:
- Reuse `templates/partials/post/post_card.html` and inject:
  - `templates/partials/reviews/review_stars_inline.html` (header insert)
  - optional media grid (already part of post card)
- Reviews support comment composer and reactions/share in MVP.

### Propose Deletion modal
`#reportModal` is included on Business Reviews page.
Recommendation:
- Centralize as `templates/partials/moderation/propose_deletion_modal.html` and include once per page template (or globally in base, if safe).

### Review-specific inserts within a Post Card

1) Star rating display (header)
Include:
- `templates/partials/reviews/review_stars_inline.html`
Context:
- `rating` (1..5)

2) Business preview block (body, before review text)
Include:
- `templates/partials/reviews/business_preview_block.html`
Context:
- `business` (name, category, address, cover/thumbnail)
- optional `preview_images` (0..3)

### Suggested template approach

Option A (preferred):
- `templates/partials/post/post_card.html` supports an optional `content_type`
- if `content_type == "review"`, render:
  - `review_stars_inline.html` in header
  - `business_preview_block.html` before body text

Option B:
- `templates/partials/reviews/review_card.html` extends a shared base card and reuses post footer/comment section.

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

### Moderation and comments on reviews
Mockups show:
- "Propose Deletion" on reviews
- comment composer on reviews
- reaction/share on reviews
So reviews are moderation targets and support comments + reactions in MVP.

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

## Friends (list + friend requests)

Source:
- `mockups-original/my-friends.html`

### Friends page layout
The Friends page is a tabbed card with:
- Tab A: Friends (list)
- Tab B: Friend Requests (inbound requests list)
- Search input: "Search Friends"

### Friend row component (Friends tab)
Reusable include:
- `templates/partials/friends/friend_row.html`

UI elements:
- user avatar + name link
- kebab dropdown with actions: Mute, Block User
- right-side relationship button that varies by state:
  - "Friends" (primary button)
  - "Add to Friends" (outline button)

Implementation note:
- The Friends tab mock includes mixed states in the same list, which implies the row must be driven by `friendship_state`.

### Friend request row component (Friend Requests tab)
Reusable include:
- `templates/partials/friends/friend_request_row.html`

UI elements:
- timestamp label (e.g., Today 10:55AM, Yesterday Apr 11, 4:23PM)
- user avatar + name link
- text "sent you a friend request"
- accept and decline buttons (check / times icons)

Implementation note:
- This tab likely represents inbound requests only. Outbound/pending requests are not depicted here.

### Friends tab scope (implementation decision)

Decision:
- The Friends tab is "accepted-only" (mutual friends).
- Any "Add to Friends" buttons shown within the Friends tab are treated as mock artifacts and will not appear in the implemented Friends list.

Rationale:
- Keeps relationship states cleanly separated:
  - Friends tab: accepted friendships only
  - Friend Requests tab: pending inbound requests with accept/decline

## Groups (My Groups + Group Administration + Create Group modal)

Source:
- `mockups-original/my-groups.html`

### My Groups page layout
Tabbed card with:
- Tab A: My Groups
- Tab B: Group Administration
- Create Group button opens a modal (`#groupModal`)

### Group tile/list item (used in both tabs)
Reusable include:
- `templates/partials/groups/group_tile_row.html`

UI elements:
- square image thumbnail
- group name
- member count
- category label
- link to `group-page.html`

Implementation note:
- The same group-tile layout is used in both My Groups and Group Administration.

### Create Group modal
Reusable include:
- `templates/partials/modals/create_group_modal.html`

Fields:
- Group Name (text)
- Category (select)
- Group Type (select: Public / Semi-Public / Private)
- A descriptive hint below Group Type (content depends on selected type)

Footer actions:
- Cancel
- Create

Implementation note:
- Group Type implies a permissions model (viewability + joinability) tied to group visibility.

## Public profile: Friends and Groups tabs

Sources:
- `mockups-original/user-profile-friends.html`
- `mockups-original/user-profile-groups.html`

### User Profile Friends tab
UI:
- Tabs: Friends / Shared Friends
- Search input: "Search Friends"
- Friend row layout matches "friends-list" pattern

Reusable includes:
- `templates/partials/friends/friend_row.html`
- `templates/partials/friends/shared_friend_row.html` (can reuse friend_row with a different dataset)

Notes:
- Mock includes some "Add to Friends" rows; per project decision, the implemented Friends tab will show accepted-only.

### User Profile Groups list
UI:
- A simple list/grid of group tiles:
  - square image
  - group name
  - member count
  - category label
  - links to group page

Reusable includes:
- `templates/partials/groups/group_tile_row.html`
- `templates/partials/groups/group_grid.html` (wraps rows into responsive grid)

## Businesses list pages (owner vs public)

Sources:
- Owner context: `mockups-original/my-business.html`
- Public context: `mockups-original/user-profile-business.html`

### Business tile (list item)
Reusable include:
- `templates/partials/business/business_tile_row.html`

Used in:
- My Business (both tabs)
- User Profile Businesses list
- Search Business results (same visual pattern)

UI elements:
- square image thumbnail
- business name
- category and optional subcategory (shown as "Category > Subcategory" in some tiles)
- link to business page (or closed state page)

### Owner-context business list page
Template:
- `templates/business/business_directory.html` (or `templates/entities/entity_list_business.html`)

Components:
- tabbed card include: `templates/partials/business/business_tabs_card.html`
  - Tab A: Businesses (directory)
  - Tab B: My Businesses (businesses where viewer is owner/admin)
- Create Business CTA button linking to create business

Notes:
- The "Businesses" tab contains a directory-like list.
- The "My Businesses" tab contains businesses where the user has management permissions.
- Some tiles link to `business-page-closed.html`, implying closed status affects routing/UI.

### Public-context business list
Template:
- `templates/profiles/user_businesses.html` (or `templates/entities/entity_businesses_tab.html`)

Components:
- uses the same `business_tile_row.html` include
- no tabs and no Create Business CTA

## Business: Team and Jobs tabs

Sources:
- `mockups-original/business-team.html`
- `mockups-original/business-jobs.html`

### Business Team tab

UI:
- Team page uses the same "friends-list" row pattern:
  - avatar + name link to user profile
  - right-side relationship button ("Add to Friends" or "Friends")
  - toast success feedback for Add to Friends

Reusable includes:
- `templates/partials/friends/friend_row.html`
  - configured for use inside business context (team list)
- `templates/partials/toasts/toast_success.html` (shared toast component)

Implementation rule:
- Do not reuse DOM IDs like `#liveToastBtn` for multiple rows. Use a class selector (e.g., `.js-show-toast`) and data attributes for message content.

### Business Jobs tab

UI:
- Jobs page is a feed of "job post" cards.
- Each job post card includes:
  - business header (logo + business link + timestamp)
  - kebab menu: Edit / Delete / Propose Deletion
  - job header insert: title + location + Apply button (external link icon)
  - job body text
  - expandable "Show more" section (hidden-content toggled by `.showHidden`)
  - reactions and share icons
  - comment composer ("Leave a comment") with image + emoji buttons and Post submit
- Propose Deletion modal (`#reportModal`) is present on this page.

Reusable includes:
- `templates/partials/jobs/job_post_card.html`
  - derived from `post_card.html` pattern with job-specific inserts
- `templates/partials/jobs/job_header_insert.html`
  - title, location, apply_url
- `templates/partials/post/comment_form.html` (shared)
- `templates/partials/moderation/propose_deletion_modal.html` (shared modal)
- `templates/partials/moderation/deletion_vote_panel.html` (if jobs participate in the voting mechanism post-proposal)

Interaction demo alignment:
- "Show more" uses the same class pattern (`.showHidden` toggles `.hidden-content`) used elsewhere in demo interactions.
