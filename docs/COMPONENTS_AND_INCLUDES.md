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

### Top navigation (includes_topnav)
Source:
- `mockups-original/includes_topnav.html`

Topnav includes:
- Mobile side-nav toggle: `#sideNavToggle`
- Friend requests dropdown (badge + accept/decline buttons + "View All" -> my-friends.html)
- Chat icon (badge) linking to chat.html
- Notifications bell (placeholder)
- Profile dropdown: View My Profile / Settings / Logout

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

### Global search (topnav live dropdown)
Elements:
- Search input: `#searchBox`
- Dropdown container: `.searchResults` (initially `display:none`)
- Sections: Users / Groups / Businesses
- "View All" CTA linking to search.html

Implementation recommendation:
- Phase 1: show/hide `.searchResults` on focus/blur (per interaction demo JS).
- Phase 2: live query endpoint with debounced input; render results via HTMX into the dropdown.

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

### Business header kebab menu labeling artifact

In `business-reviews.html`, the business entity header dropdown contains "Leave Group". This is a mock labeling artifact.
Implementation:
- Replace with "Leave Business" (or "Leave Company" for consistency with "Join Company"), or remove entirely if leaving is not supported.

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

### Reviews: additional canonical UI rules (Business Reviews)

Source:
- `business-reviews.html`

#### First-ever review highlight
The first-ever review for a business is specially highlighted:
- Shows a "First Review" trophy badge
- Uses a distinct post-card background color (highlight styling)
Implementation:
- Add an optional boolean on the review card context:
  - `is_first_review_for_business`
- `post_card` (review variant) should support a highlight modifier:
  - adds badge + optional CSS class (e.g., `post--highlight`)

#### Review Summary Card details (rating + awards)
The Review Summary Card includes:
- Average rating number
- Star row that supports half-star display
- Review count
- Rating distribution rows (5→1) with counts + progress bars

Awards block inside the summary card:
- Renders 0..N awards as list items:
  - icon/image thumbnail + title text
- Awards are accumulated (business can show multiple awards across years/categories)

Reusable partials (recommended):
- `templates/partials/reviews/review_summary_card.html`
- `templates/partials/reviews/rating_stars.html` (supports half-star)
- `templates/partials/reviews/rating_distribution.html`
- `templates/partials/awards/award_list.html`
- `templates/partials/awards/award_list_item.html`

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

## Entity listing tiles (shared across pages)

### Business tile
Used in:
- Search results (Businesses tab)
- User profile → Businesses
- My Businesses (both tabs)

Partials:
- `templates/partials/business/business_tile.html`
- `templates/partials/business/business_tile_grid.html`

Inputs:
- name, image_url, category/subcategory label(s), href
- optional status badge (e.g., "Closed")

## Modals and interaction demos (system-wide)

Sources:
- Group About page (`group-page.html`)
- Interaction demo JS (`assets/js/app.js`)
- Hard search results (`search.html`)
- Group Members (`group-members.html`)

### Implementation pitfall: duplicate modal IDs / element IDs (avoid future bug)

Some mockups and demo JS use the same ID (example: `#liveToastBtn`) for multiple actions (Join Group, Add to Friends).
In production templates, IDs must be unique per page.

When we convert mockups into Django includes, it becomes easy to accidentally render the same modal (or form control)
multiple times on one page, causing duplicate DOM IDs and broken/fragile JS behavior.

Examples from mockups:
- Feed post composer opens an image upload modal `#uploadImgModal`. (feed.html)
- Photos pages use `#uploadModal` (Add Photos) and `#albumModal` (New Album). (my-photos.html)

Rule:
- Every reusable include that defines a modal MUST accept a `modal_id` (and any related input IDs) as parameters,
  and MUST NOT hardcode `id="..."` in a way that could collide if reused.
- Prefer component-scoped IDs derived from the component name + object id, e.g.:
  - `modal_id="uploadImgModal_post_{{ post.id }}"`
  - `modal_id="reportModal_post_{{ post.id }}"`
  - `modal_id="uploadModal_album_{{ album.id }}"`

Suggested pattern:
- `partials/modals/<modal_name>.html` should take:
  - `modal_id`
  - `form_id`
  - `file_input_id` (if applicable)
- `partials/post/post_card.html` should pass unique IDs per post for:
  - propose deletion modal
  - share modal (if modal-based)
  - any per-post upload/attachment modal (if supported later)

Also note: the comment thread has interaction affordances like "Show X replies" and "Show N more comments"
that should be driven by consistent selectors/data-attributes, not brittle ID assumptions.

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

### Business: About card edit buttons (business-page.html)

**Intent:** In the Business About card, the first pencil is an *Edit Business* action (not "Edit Bio"), and the second pencil (Other Social Profiles) opens the shared Social Profiles modal (same component as User).

#### Current mockup observations (business-page.html)
- Business details modal exists as `#editBusinessModal` with title **"Edit Business"**.
- Business details modal footer button label currently says **"Create"** (artifact; should be "Save").
- Business "bioModal" currently titled **"Edit Bio"** but should be treated/renamed as **"Edit Business"** (per latest correction).
- Business "Other Social Profiles" pencil currently targets `#bioModal` (artifact; should target `#socialModal`).
- User profile "Other Social Profiles" pencil targets `#socialModal` and uses the modal title **"Edit Social Profiles"**.

#### Canonical implementation decision (Django templates)
- **Business About-card pencil** ⇒ opens business edit modal (title: "Edit Business").
- **Business Other Social Profiles pencil** ⇒ opens the shared **Edit Social Profiles** modal (`socialModal`) used on the User profile.

#### Recommended partials
- `partials/business_about_card.html` (includes both pencils)
- `partials/modals/business_edit_modal.html` (business-specific edit fields, title "Edit Business")
- `partials/modals/social_profiles_modal.html` (shared; used by User + Business)

## Chat (messages + sidebar)

Source:
- `mockups-original/chat.html`

### Chat layout components
Chat page is a two-pane layout:
- Left: chat sidebar list (search chats + list of conversations with unread badge counts)
- Right: active conversation (header with user + kebab actions + message history + composer)

Recommended partials:
- `templates/partials/chat/chat_sidebar.html`
- `templates/partials/chat/chat_thread_header.html`
- `templates/partials/chat/chat_message_bubble.html`
- `templates/partials/chat/chat_composer.html`

### Chat message bubble variants
- incoming message: shows sender avatar + bubble
- outgoing message: `.me` bubble, no avatar

### Chat thread header actions
Dropdown includes:
- Mute Conversation
- Block

### Chat composer
Composer includes:
- image button
- emoji button
- textarea
- send button (paper plane icon)

## Settings & Privacy (privacy + notifications + blocked contacts)

Source:
- `mockups-original/settings.html`

Recommended template:
- `templates/settings/settings_privacy.html`

Sections:
1) My Account: username, name, email
2) Privacy Settings:
   - who can see your posts?
   - who can send you a friend request?
   - who can post to your timeline?
   - who can see your friends?
   - change who can see all existing posts (bulk change)
   - blocked contacts modal (count badge)
3) Notification Settings:
   - proposed deletion notifications
   - new friend requests notifications
   - comment notifications
4) Security Settings:
   - reset password link
   - enable MFA (setup link)
5) Cookie notice (sitewide alert)

Blocked contacts modal:
- `templates/partials/modals/blocked_contacts_modal.html`

## Auth pages (Login, Register, Reset Password)

Sources:
- `mockups-original/login-register.html`
- `mockups-original/reset-password.html`

### Login and Register combined page
Template:
- `templates/auth/login_register.html`

UI layout:
- Two-column layout:
  - Left: Register form with branding and optional mobile Login button anchor
  - Right: Login form

Register form elements:
- Social sign-up buttons: Google, Facebook
- Fields: Name, Username, Email, Password
- Terms checkbox (Terms & Privacy link)
- Submit: "Create an Account"

Login form elements:
- Fields: Email, Password
- Link: "Forgot Password?" -> reset password page
- Submit: "Login"
- Social login buttons: Google, Facebook

Implementation recommendation:
- Use Django auth (custom User model recommended because Username is required).
- Social buttons are placeholders in mockups. Wire later via django-allauth if desired.

### Reset Password page
Template:
- `templates/auth/reset_password.html`

UI:
- Single form with Email field and "Send Reset Link" button

Notes:
- Mock includes topnav for dev purposes. In production, consider whether reset pages should use a minimal auth layout rather than full site chrome.

## Email templates (site-generated emails)

Source:
- `mockups-original/emails/index.html`

### Email base template
This file is a single email template that demonstrates:
- branded header with centered logo
- greeting line: "Hi {User},"
- a stack of notification lines (unread messages, friend requests, comment added, deletion proposed, group approval needed, new business review)
- optional CTA button block
- legal footer with unsubscribe + notification settings links

Django email templating approach:
- Create a base HTML email:
  - `templates/emails/base.html`
- Create a content block template:
  - `templates/emails/notification_digest.html` (or `notification_single.html`)

Variables shown in the mock:
- `{User}` placeholder for recipient name
- CTA button has empty `href` and generic label "CTA button" (should be filled per email type)
- footer includes unsubscribe + settings links (currently `href="#"`)

Reusable partial concept (optional):
- `templates/emails/partials/notification_line.html`
- `templates/emails/partials/cta_button.html`
- `templates/emails/partials/legal_footer.html`

Implementation notes:
- Email HTML uses table layout and inline-ish styling suitable for email clients; avoid relying on external CSS.
- Replace `images/image-1.png` with an absolute URL or CID-embedded image (choose one strategy and standardize).

## Email assets (logo)

Source:
- `mockups-original/emails/index.html`

The email template references a header logo at:
- `images/image-1.png` (relative to the email HTML template location)

Repo note:
- There is a `mockups-original/emails/images/` directory that contains `image-1.png` (the HeyPage logo used in the email header).

Implementation note (Django):
- Email images cannot reliably use relative paths.
- Choose one approach and standardize:
  1) Absolute URL: host the logo at a public URL (recommended for simplicity), and render `src="{{ SITE_URL }}{{ STATIC_URL }}emails/image-1.png"` or a dedicated `EMAIL_LOGO_URL`.
  2) CID embedded image: attach the logo and reference it as `src="cid:heypage_logo"` for best inbox compatibility.

## Client-side UI behaviors present in mockups (from assets/js)

The mockups include a JavaScript layer primarily intended to demonstrate UI interactions, not production-ready behavior. The Django build should treat these as reference behaviors and re-implement selectively with clean selectors, unique IDs, and server-backed endpoints.

### Current behavior inventory (app.js reference)

- Mobile side nav toggle:
  - Click `#sideNavToggle` toggles `#sideNav.open`.
- Navbar live search dropdown:
  - Focus on `#searchBox` shows `.searchResults`.
  - Blur hides `.searchResults`.
  - In Django, implement live results via HTMX (or a small fetch endpoint) and keep "View All" pointing to the hard results page.
- Toast demo trigger:
  - Click `#liveToastBtn` shows `.toast`.
  - IMPORTANT: multiple elements in mockups reuse `id="liveToastBtn"`. This must become a class selector for production (example: `.js-live-toast-btn`) and use event delegation.
- Comment composer button reveal:
  - In `.response-group`, clicking into `.form-control` reveals the `.p-2` block containing the Post button.
  - Blur hides it again if the textarea is empty.
- Reply threads:
  - `.toggleReply` toggles a `.showReply` region and flips button text.
  - `.addReply` injects a reply form under a comment (demo only).
- Reactions and sharing:
  - `.addReaction` and `.shareLink` create popovers (demo only).
  - Production should use a real popover component, or a lightweight custom menu.
- Moderation and voting UI:
  - Voting buttons reveal `.voteResults` and disable voting after a vote.
  - Star voting toggles `.selected`.
- Chat sidebar:
  - `#toggle-chat-sidebar` opens `#chat-sidebar` and shades `<main>`.
  - `#chat-side-close` closes it.
- Media:
  - `.gallery-img` uses `Am2_SimpleSlider()` for a gallery popup.
- Sticky sidebar:
  - Scroll logic toggles `#sticky-side` classes `stickTop`/`stickBottom`.
- Select2:
  - `.select2` uses Select2 with bootstrap theme.

### Implementation rules for the Django port

1) Do not rely on duplicated IDs from mockups.
   - Replace `#liveToastBtn` with a class such as `.js-live-toast-btn`.
   - Replace repeated upload input IDs like `id="file"` with unique IDs, or refactor so the label is scoped and does not require global uniqueness.

2) Replace `includeHTML.js` includes with Django template includes.
   - Remove `includeHTML()` usage and keep includes purely server-side (`{% include %}`).

3) JS structure
   - Use event delegation from `document` for dynamic content (feed items, comments, modals).
   - Keep behavior modules small and grouped by feature: search, feed, comments, moderation, media, nav.

## Search UX contract (Topnav live search → Hard results page)

Sources:
- `mockups-original/includes_topnav.html`
- `mockups-original/search.html`

### Topnav live search dropdown (global)
Location:
- Implemented inside topnav include (`includes_topnav.html`).

Elements:
- Search input: `#searchBox`
- Dropdown container: `.searchResults` (initially `display:none`)
- Sections: Users / Groups / Businesses
- "View All" button routes to `search.html`

Behavior (per app.js reference):
- Show dropdown on focus of `#searchBox`
- Hide dropdown on blur
(Implementation should be improved to avoid closing when clicking inside dropdown; see OPEN_QUESTIONS.md.)

### Hard results page (Search results)
Template target:
- `templates/search/search_results.html`

UI:
- Tabbed results: Users / Groups / Business
- Users tab uses a simple list row pattern (same “friends-list” style).
- Groups tab uses a tile row: square image + name + member count + category.
- Business tab uses a tile row: square image + name + category and includes an "Add Business" CTA linking to `create-business.html`.

Reusable partials:
- `templates/partials/search/live_results_dropdown.html`
- `templates/partials/search/user_result_row.html`
- `templates/partials/search/group_result_row.html`
- `templates/partials/search/business_result_row.html`
- `templates/partials/search/add_business_cta.html`

### DEV-only include system (to replace)
`search.html` currently uses `w3-include-html` and `includeHTML.js` to inject topnav/sidenav for development.

Rule:
- Replace all `w3-include-html` usage with Django `{% include %}` / `{% extends %}` templates.
- `includeHTML()` is not part of production.

## Notifications (topnav bell dropdown)

Decision:
- The notifications bell in the top navigation uses a dropdown (not a dedicated /notifications/ page).

Implementation:
- Add a notifications dropdown menu similar to the Friend Requests dropdown:
  - list of notifications (unread first)
  - per-notification link to target content
  - "Mark all as read" action (optional MVP)
- This dropdown is powered by the Notification model and user notification settings.

## Side navigation (includes_sidenav)

Source:
- `mockups-original/includes_sidenav.html`

Sidenav links (logged-in):
- News Feed -> `feed.html`
- My Profile -> `my-profile.html`
- Friends -> `my-friends.html`
- Photos -> `my-photos.html`
- Reviews -> `my-reviews.html`
- Groups -> `my-groups.html`
- Businesses -> `my-business.html`

Footer:
- Privacy Policy link (placeholder)
- Terms & Conditions link (placeholder)
- Copyright: "© 2021 Heypage, LLC"

Implementation recommendation:
- Convert to `templates/partials/sidenav.html`.
- Active state should be computed server-side:
  - pass `active_nav` or `request.path` into the template and highlight the current link.

## Entity header system (base partial + variants)

Sources:
- Owner user header: `includes_my-profile-head.html`
- Public user header: `includes_profile-head.html`

### Goal
Unify all user/group/business page headers into a consistent, reusable template system:
- shared layout (cover image, avatar, name, badges)
- right-side action area (varies by viewer context and entity type)
- tab navigation (varies by entity type and viewer context)

### Recommended template structure

Base shell (shared cover/avatar/name/badges + slots):
- `templates/partials/entity/entity_header_base.html`

Entity-specific wrappers:
- `templates/partials/entity/user_header.html`
- `templates/partials/entity/group_header.html`
- `templates/partials/entity/business_header.html`

Context variants (viewer):
- `templates/partials/entity/user_header_owner.html` (my profile)
- `templates/partials/entity/user_header_public.html` (viewing another user)

### Slots/inputs to the base header
- `entity_type` in {"user","group","business"}
- `viewer_context` in {"owner","public"}
- `cover_image_url`
- `avatar_image_url`
- `display_name`
- `badges` (list of labels: e.g., Representative, Influencer)
- `primary_action` (button or button group on the right)
- `kebab_menu_items` (optional)
- `tabs` (list of {label, href, count?} with active state)

### User header: owner vs public behaviors

Owner ("My profile") header:
- Shows edit avatar controls:
  - pen overlay button and "Change Photo" button open a photo upload modal `#photoModal`.
- Includes `photoModal` markup (upload form). Must be componentized and avoid hardcoded input IDs (see below).

Public user header:
- Shows relationship action (e.g., "Add to Friends") plus kebab menu:
  - Block User
  - Report User
- Includes toast success markup in mock; in Django this should be centralized and triggered via class selectors (no duplicate IDs).

### Tabs
Both headers include tabs:
- About, Photos, Friends, Groups, Reviews, Businesses
with owner linking to `my-*` routes and public linking to `user-profile-*` routes.

Implementation:
- In Django, tabs should be generated from a single tab config per entity type:
  - `entity_tabs_user(owner/public)`
  - `entity_tabs_group(owner/public)`
  - `entity_tabs_business(owner/public)`

### Modal ID + input ID safety (critical)
Owner header includes an upload input with `id="file"` inside `#photoModal`.
Rule:
- Any modal partial must accept a `modal_id` and input IDs as parameters (e.g., `file_input_id`),
  so multiple instances never collide when reused across entity pages.

## Entity header system: extend to Group + Business variants

Sources:
- User header (owner): `includes_my-profile-head.html`
- User header (public): `includes_profile-head.html`
- Group page header: `group-page.html`
- Business page header: `business-page.html`

### Shared header skeleton (applies to user, group, business)
All entity headers can be standardized to one base layout:

1) Cover image region (optional)
2) Title row:
   - entity name (required)
   - optional subtitle (category/type)
   - optional badges/awards strip
   - kebab dropdown (menu items vary)
3) Tab row:
   - nav pills with optional counts/badges
4) Right-side actions cluster:
   - one or two primary buttons (Invite, Join, Add Friend, Change Photo, etc.)

### Recommended template layout

Base:
- `templates/partials/entity/entity_header_base.html`

Entity wrappers:
- `templates/partials/entity/user_header.html`
- `templates/partials/entity/group_header.html`
- `templates/partials/entity/business_header.html`

Viewer-context variants:
- `templates/partials/entity/user_header_owner.html`
- `templates/partials/entity/user_header_public.html`

Group and business currently appear as public-facing headers (owner tools can be added later).

### Group header variant

Source: `group-page.html`

Header fields:
- cover image (food bg)
- group name: "Healthy Foodies"
- kebab items: Report Page, Leave Group
- tabs:
  - About
  - Photos (count)
  - Members (count)
- actions cluster:
  - Invite button opens `#inviteModal`
  - Join Group button currently uses `id="liveToastBtn"` (demo) and should be a class selector in production

Template recommendation:
- `templates/partials/entity/group_header_public.html`
Inputs:
- `group.name`, `group.cover_url`
- `group.photo_count`, `group.member_count`
- `viewer_membership_state` (joined/pending/not_joined)
- actions:
  - Invite (only if member? TBD)
  - Join/Leave (based on membership state)

### Business header variant

Source: `business-page.html`

Header fields:
- cover image (construction bg)
- awards strip (award-2020, award-2021 icons)
- business name: "Aliquot Inc"
- subtitle/category: "Civil Engineering"
- website link: "aliquot.com"
- kebab items: Report Profile, Leave Group (artifact), Post a Job, Edit (opens `#editBusinessModal`)
- tabs:
  - About
  - Team
  - Jobs (badge count)
  - Reviews
- actions cluster:
  - Invite
  - Join Company button currently uses `id="liveToastBtn"` (demo) and should be a class selector in production

Template recommendation:
- `templates/partials/entity/business_header_public.html`
Inputs:
- `business.name`, `business.cover_url`, `business.category_label`, `business.website_url`
- `business.awards` (list of icon URLs, optional)
- `business.job_count` (for badge)
- `viewer_membership_state` (joined/pending/not_joined)
- actions:
  - Invite (only if member/admin? TBD)
  - Join/Leave (based on membership state)
  - Post a Job (only if admin/owner)
  - Edit (only if admin/owner)

### Labeling artifact (business kebab)
Business header dropdown contains "Leave Group". This is a mock labeling artifact.
Implementation:
- Replace with "Leave Business" or "Leave Company" (preferred, since the primary action says "Join Company").

### DOM ID safety rules reinforced
- Group header and business header both use `id="liveToastBtn"` on join buttons. This must become a class selector to avoid duplicate IDs when lists/cards repeat.
- Owner user header photo modal uses `id="photoModal"` and file input `id="file"`. Modal and inputs must accept parameterized IDs when componentized.

## Entity header slot contract (single source of truth)

Goal:
- `entity_header_base.html` is the shared skeleton for user/group/business headers.
- Entity-specific wrappers build a `header_context` dict and pass it to the base.

### Base template
- `templates/partials/entity/entity_header_base.html`

### Required context object
Pass a single dict named `header` with the following keys:

#### Identity + media
- `header.entity_type` (str): "user" | "group" | "business"
- `header.viewer_context` (str): "owner" | "public"
- `header.title` (str): display name (user name, group name, business name)
- `header.subtitle` (str|None): optional secondary line (e.g., business category, group category)
- `header.cover_url` (str|None): cover image URL
- `header.avatar_url` (str|None): avatar/logo URL (square/circle)

#### Badges / metadata row
- `header.badges` (list[dict]): optional labels and/or icons
  - each badge: `{ "label": str, "icon_url": str|None }`
  - examples:
    - user: Representative, Influencer
    - business: award icons list (year + icon), or just icons

#### Primary actions cluster (right side)
- `header.actions` (list[dict]): ordered list of buttons
  - each action:
    - `label` (str)
    - `href` (str|None) — for link buttons
    - `button_class` (str) — e.g., "btn btn-primary btn-sm"
    - `icon_class` (str|None) — e.g., "fa fa-plus"
    - `data_toggle` (str|None) — e.g., "modal"
    - `data_target` (str|None) — e.g., "#inviteModal"
    - `js_hook` (str|None) — e.g., "js-live-toast-btn"
    - `disabled` (bool, default false)
    - `visible` (bool, default true)

Notes:
- Avoid using hardcoded IDs for JS triggers (no repeated `#liveToastBtn`).
- Use class hooks via `js_hook` + event delegation.

#### Kebab menu (optional)
- `header.kebab` (dict|None):
  - `header.kebab.items` (list[dict]) where each item has:
    - `label` (str)
    - `href` (str|None)
    - `data_toggle` (str|None)
    - `data_target` (str|None)
    - `icon_class` (str|None)
    - `danger` (bool, default false)
    - `visible` (bool, default true)

#### Tabs row
- `header.tabs` (list[dict]) required:
  - each tab:
    - `key` (str) — stable identifier: "about", "photos", "friends", "members", "jobs", "reviews", "groups", "businesses"
    - `label` (str)
    - `href` (str)
    - `count` (int|None) — optional count/badge
    - `active` (bool)

### Modal + input ID requirements (critical)
If a header variant includes modals (e.g., owner user photo modal):
- the wrapper MUST pass:
  - `modal_id` (unique)
  - `file_input_id` (unique)
  - `form_id` (unique)
Do not hardcode `id="file"` or fixed modal IDs in reusable partials.

### Suggested wrapper templates
- `templates/partials/entity/user_header_owner.html`
- `templates/partials/entity/user_header_public.html`
- `templates/partials/entity/group_header_public.html`
- `templates/partials/entity/business_header_public.html`

Each wrapper constructs `header` and calls:
- `{% include "partials/entity/entity_header_base.html" with header=header %}`

## Entity header slot mapping: User (public vs owner)

Sources:
- Public user header include: `includes_profile-head.html`
- Owner user header include: `includes_my-profile-head.html`

This section maps the current mockup HTML fields into the `header` slot contract for `entity_header_base.html`.

### Public user header → `header` mapping

Identity + media:
- `header.entity_type = "user"`
- `header.viewer_context = "public"`
- `header.cover_url` ← `img.card-img-top` inside `.bg-wrap` (profile-bg-test1.jpg)
- `header.avatar_url` ← `.user-img.user-xl` (profile-pic-test1.jpg)
- `header.title` ← `<h2>Patrick Ford</h2>`
- `header.subtitle = None` (not shown)

Badges:
- `header.badges` ← badge pills ("Representative", "Influencer")

Actions cluster:
- Primary action button: "Add to Friends"
  - IMPORTANT: mock uses `id="liveToastBtn"` which must become `js_hook="js-live-toast-btn"` in production.

Kebab menu:
- Items: Block User, Report User

Tabs:
- About → user-profile.html (active)
- Photos (count=234) → user-profile-photos.html
- Friends (count=328) → user-profile-friends.html
- Groups → user-profile-groups.html
- Reviews → user-profile-reviews.html
- Businesses → user-profile-business.html

Toast component:
- Toast markup exists inline after the header in the include.
Rule:
- Centralize the toast HTML in a shared partial and trigger via class hooks + event delegation (no repeated IDs).

### Owner user header → `header` mapping

Identity + media:
- `header.entity_type = "user"`
- `header.viewer_context = "owner"`
- `header.cover_url` ← profile-bg-test2.jpg
- `header.avatar_url` ← profile-pic-test2.jpg
- `header.title` ← `<h2>James Atkinson</h2>`
- `header.subtitle = None`

Badges:
- `header.badges` ← badge pill ("Influencer")

Actions cluster:
- Owner action: "Change Photo" (opens `#photoModal`)
- Avatar pen overlay action also opens `#photoModal`

Tabs:
- About → my-profile.html (active)
- Photos (count=234) → my-photos.html
- Friends (count=328) → my-friends.html
- Groups → my-groups.html
- Reviews → my-reviews.html
- Businesses → my-business.html

Owner photo modal:
- Modal id: `#photoModal`
- File input id: `id="file"` with `<label for="file">`

Critical implementation rule:
- When componentizing, `photoModal` and the file input must be parameterized:
  - `modal_id`, `file_input_id`, `form_id`
so we can safely reuse photo upload UI across multiple entity types without ID collisions.

## Entity header slot mapping: Group (public)

Source:
- Group header (public): `group-page.html`

This section maps the current group-page header into the `header` slot contract for `entity_header_base.html`.

### Group header (public) → `header` mapping

Identity + media:
- `header.entity_type = "group"`
- `header.viewer_context = "public"`
- `header.cover_url` ← `.bg-wrap img.card-img-top` (`assets/img/food-bg.jpg`)
- `header.avatar_url = None` (no group avatar/logo shown in the header)
- `header.title` ← `<h2 class="mb-1">Healthy Foodies</h2>`
- `header.subtitle = None` (not shown)

Badges:
- `header.badges = []` (no badges/awards shown in group header)

Actions cluster:
- Action 1: "Invite"
  - modal trigger: `data-toggle="modal" data-target="#inviteModal"`
- Action 2: "Join Group"
  - IMPORTANT: mock uses `id="liveToastBtn"` (demo) which must become `js_hook="js-live-toast-btn"` in production to avoid duplicate IDs.

Kebab menu:
- Items:
  - "Report Page"
  - "Leave Group"

Tabs:
- About → `group-page.html` (active)
- Photos (count=234) → `group-photos.html`
- Members (count=328) → `group-members.html`

Notes:
- Group header currently has no subtitle/category; if groups later have categories (e.g., “Food”), map to `header.subtitle`.
- If membership can be pending/approved, `Join Group` should be rendered from `viewer_membership_state` (join / requested / joined / blocked).

## Entity header slot mapping: Business (public)

Source:
- Business header (public): `business-page.html`

This section maps the current business-page header into the `header` slot contract for `entity_header_base.html`.

### Business header (public) → `header` mapping

Identity + media:
- `header.entity_type = "business"`
- `header.viewer_context = "public"`
- `header.cover_url` ← `.bg-wrap img.card-img-top` (`assets/img/construction-bg.jpg`)
- `header.avatar_url = None` (logo image is commented out in mock: `<!-- <img src="assets/img/aliquot.png" ...> -->`)
- `header.title` ← `<h2 class="mb-1">Aliquot Inc</h2>`
- `header.subtitle` ← `<p class="smaller text-muted mb-0">Civil Engineering</p>`

Badges / awards:
- `header.badges` ← awards strip rendered as icons:
  - `assets/img/award-2020.png` (Award 2020)
  - `assets/img/award-2021.png` (Award 2021)
Recommendation:
- represent these as badges with `{label: "Award 2020", icon_url: ...}` etc.

Actions cluster:
- Action 1: "Invite" (currently a link-style button; no destination set)
- Action 2: "Join Company"
  - IMPORTANT: mock uses `id="liveToastBtn"` (demo) which must become `js_hook="js-live-toast-btn"` in production.

Kebab menu:
- Items:
  - "Report Profile"
  - "Leave Group" (mock labeling artifact — should be “Leave Business” or “Leave Company”)
  - "Post a Job"
  - "Edit" (modal trigger: `data-toggle="modal" data-target="#editBusinessModal"`) 

Additional header metadata:
- Website link shown in header: `aliquot.com` (currently `href="#"`)
Mapping:
- Store as `business.website_url` and render as a normal anchor in the base header’s “meta row” slot.

Tabs:
- About → `business-page.html` (active)
- Team → `business-team.html`
- Jobs → `business-jobs.html` with badge count=2
- Reviews → `business-reviews.html`

Notes:
- Kebab permissioning in Django should gate:
  - Post a Job / Edit (admin/owner only)
  - Leave Company (members only)
- The “Join Company” label suggests we should standardize business membership terminology as “Company” in UI (Join/Leave Company).

## Entity header mini mapping: what goes in base vs wrappers (User/Group/Business)

Purpose:
- Keep `entity_header_base.html` minimal and stable.
- Push entity-specific details into wrappers (user/group/business + owner/public).

### Belongs in `entity_header_base.html` (shared across entity types)
Always render:
- Cover region: `header.cover_url` (optional)
- Avatar/logo region: `header.avatar_url` (optional)
- Title: `header.title`
- Subtitle/meta line: `header.subtitle` (optional)
- Badges strip: `header.badges` (optional)
- Right-side actions cluster: loop over `header.actions` (0..N)
- Kebab menu: render if `header.kebab.items` exists
- Tabs row: loop over `header.tabs` and highlight `active`

Shared safety rules:
- No hardcoded modal IDs or form/input IDs inside the base; any modal triggers must use wrapper-provided `data_target` or `modal_id` values.
- No JS bindings to hardcoded IDs (use wrapper-provided class hooks and event delegation).

### Belongs in wrappers (entity-specific and/or viewer-context-specific)

User wrappers:
- Owner vs public action logic:
  - Owner: "Change Photo" (modal), avatar edit controls
  - Public: relationship button state + block/report kebab options
- Optional toast trigger wiring for friend actions (via class hook, not ID)
- User-specific tabs (About/Photos/Friends/Groups/Reviews/Businesses) and counts

Group wrapper:
- Group-specific tabs (About/Photos/Members) and counts
- Membership state logic (Join/Leave/Requested) and Invite visibility
- Kebab items (Report Page / Leave Group)

Business wrapper:
- Awards icons mapping into `header.badges`
- Website link (meta row content)
- Kebab items and permission gating:
  - Edit (modal), Post a Job, Leave Company, Report Profile
- Business tabs (About/Team/Jobs/Reviews) and job count badge
- Membership state logic (Join/Leave Company) and Invite visibility

### Known mock artifacts to normalize in wrappers
- Business kebab menu label "Leave Group" should become "Leave Company" (preferred) or "Leave Business".
- Any use of `id="liveToastBtn"` should be replaced with a class hook (e.g., `.js-live-toast-btn`) to avoid duplicate IDs.
- Any upload input `id="file"` inside reusable modals must be parameterized.

## Entity header wrapper pseudocode (constructing the `header` dict)

Purpose:
- Each wrapper builds a single `header` dict (slot contract) and includes the canonical base partial:
  `{% include "partials/entity/entity_header.html" with header=header %}`

Notes:
- This is pseudocode intended to document exactly what each wrapper must construct.
- Replace hardcoded strings/URLs with real model fields and Django `url`/`static` helpers.
- Do not use duplicated IDs like `liveToastBtn`; use `js_hook` + `data-*` attributes.
- Any modal triggers should reference unique `modal_id` values or page-level modal includes.

---

### `templates/partials/entity/user_header_public.html`

Pseudocode:

header = {
  "entity_type": "user",
  "viewer_context": "public",

  # identity + media
  "cover_url": user.cover_url,
  "avatar_url": user.avatar_url,
  "title": user.display_name,
  "subtitle": None,

  # badges (e.g., Representative, Influencer)
  "badges": [
    # Example:
    # {"label": "Representative", "icon_url": None},
    # {"label": "Influencer", "icon_url": None},
  ],

  # right-side actions cluster
  "actions": [
    # Friendship action button (state-driven)
    # One of: "Add to Friends" / "Requested" / "Friends"
    {
      "label": friendship_button_label,            # e.g., "Add to Friends"
      "href": None,                                # action is handled via JS/POST
      "button_class": "btn btn-outline-primary btn-sm",
      "icon_class": "fa fa-user-plus",
      "data_toggle": None,
      "data_target": None,
      "js_hook": "js-friend-action",               # class hook, not an id
      "disabled": friendship_button_disabled,      # e.g., true if requested
      "visible": True,
      # recommended data attrs for JS:
      # data-user-id, data-action
    },
  ],

  # kebab dropdown (public profile actions)
  "kebab": {
    "items": [
      {"label": "Block User",  "href": block_user_url,  "data_toggle": None, "data_target": None, "icon_class": None, "danger": True,  "visible": True},
      {"label": "Report User", "href": None,            "data_toggle": "modal", "data_target": "#reportUserModal", "icon_class": None, "danger": False, "visible": True},
    ]
  },

  # tabs
  "tabs": [
    {"key": "about",      "label": "About",      "href": url("user_about", user.username),      "count": None,          "active": active_tab == "about"},
    {"key": "photos",     "label": "Photos",     "href": url("user_photos", user.username),     "count": user.photo_count, "active": active_tab == "photos"},
    {"key": "friends",    "label": "Friends",    "href": url("user_friends", user.username),    "count": user.friend_count, "active": active_tab == "friends"},
    {"key": "groups",     "label": "Groups",     "href": url("user_groups", user.username),     "count": None,          "active": active_tab == "groups"},
    {"key": "reviews",    "label": "Reviews",    "href": url("user_reviews", user.username),    "count": None,          "active": active_tab == "reviews"},
    {"key": "businesses", "label": "Businesses", "href": url("user_businesses", user.username), "count": None,          "active": active_tab == "businesses"},
  ],
}

---

### `templates/partials/entity/user_header_owner.html`

Pseudocode:

header = {
  "entity_type": "user",
  "viewer_context": "owner",

  "cover_url": request.user.cover_url,
  "avatar_url": request.user.avatar_url,
  "title": request.user.display_name,
  "subtitle": None,

  "badges": [
    # e.g., {"label": "Influencer", "icon_url": None},
  ],

  "actions": [
    {
      "label": "Change Photo",
      "href": None,
      "button_class": "btn btn-primary btn-sm",
      "icon_class": None,
      "data_toggle": "modal",
      "data_target": "#photoModal",      # in production: pass unique modal_id
      "js_hook": None,
      "disabled": False,
      "visible": True,
    },
  ],

  "kebab": None,  # owner header does not show kebab in mock

  "tabs": [
    {"key": "about",      "label": "About",      "href": url("my_profile"),      "count": None,                "active": active_tab == "about"},
    {"key": "photos",     "label": "Photos",     "href": url("my_photos"),       "count": request.user.photo_count,  "active": active_tab == "photos"},
    {"key": "friends",    "label": "Friends",    "href": url("my_friends"),      "count": request.user.friend_count, "active": active_tab == "friends"},
    {"key": "groups",     "label": "Groups",     "href": url("my_groups"),       "count": None,                "active": active_tab == "groups"},
    {"key": "reviews",    "label": "Reviews",    "href": url("my_reviews"),      "count": None,                "active": active_tab == "reviews"},
    {"key": "businesses", "label": "Businesses", "href": url("my_businesses"),   "count": None,                "active": active_tab == "businesses"},
  ],
}

Owner-only modal note:
- The photo upload modal should be included once per page via a partial.
- Parameterize `modal_id`, `form_id`, and `file_input_id` (avoid `id="file"` collisions).

---

### `templates/partials/entity/group_header_public.html`

Pseudocode:

header = {
  "entity_type": "group",
  "viewer_context": "public",

  "cover_url": group.cover_url,
  "avatar_url": group.avatar_url_or_none,  # mock does not show; keep optional
  "title": group.name,
  "subtitle": None,                        # optional: group.category_label

  "badges": [],

  "actions": [
    # Invite (visibility depends on membership/admin policy)
    {
      "label": "Invite",
      "href": None,
      "button_class": "btn btn-outline-primary btn-sm",
      "icon_class": "fa fa-user-plus",
      "data_toggle": "modal",
      "data_target": "#inviteModal",
      "js_hook": None,
      "disabled": False,
      "visible": can_invite,               # bool
    },

    # Join/Leave group (state-driven)
    {
      "label": group_membership_label,     # "Join Group" / "Requested" / "Leave Group"
      "href": None,
      "button_class": group_membership_btn_class,  # primary vs outline
      "icon_class": None,
      "data_toggle": None,
      "data_target": None,
      "js_hook": "js-group-membership-action",
      "disabled": group_membership_disabled,       # true if requested/pending
      "visible": True,
      # data attrs: data-group-id, data-action
    },
  ],

  "kebab": {
    "items": [
      {"label": "Report Page", "href": None, "data_toggle": "modal", "data_target": "#reportGroupModal", "icon_class": None, "danger": False, "visible": True},
      {"label": "Leave Group", "href": None, "data_toggle": None, "data_target": None, "icon_class": None, "danger": True,  "visible": is_member},
    ]
  },

  "tabs": [
    {"key": "about",   "label": "About",   "href": url("group_about", group.slug),   "count": None,              "active": active_tab == "about"},
    {"key": "photos",  "label": "Photos",  "href": url("group_photos", group.slug),  "count": group.photo_count, "active": active_tab == "photos"},
    {"key": "members", "label": "Members", "href": url("group_members", group.slug), "count": group.member_count,"active": active_tab == "members"},
  ],
}

---

### `templates/partials/entity/business_header_public.html`

Pseudocode:

header = {
  "entity_type": "business",
  "viewer_context": "public",

  "cover_url": business.cover_url,
  "avatar_url": business.logo_url_or_none,     # mock logo is commented; keep optional
  "title": business.name,
  "subtitle": business.category_label,         # e.g., "Civil Engineering"

  # awards strip maps cleanly to badges with icon URLs
  "badges": [
    # Example:
    # {"label": "Award 2020", "icon_url": static("img/award-2020.png")},
    # {"label": "Award 2021", "icon_url": static("img/award-2021.png")},
  ],

  "actions": [
    # Invite (visibility depends on membership/admin policy)
    {
      "label": "Invite",
      "href": None,
      "button_class": "btn btn-outline-primary btn-sm",
      "icon_class": "fa fa-user-plus",
      "data_toggle": "modal",
      "data_target": "#inviteBusinessModal",
      "js_hook": None,
      "disabled": False,
      "visible": can_invite_business,
    },

    # Join/Leave company (state-driven)
    {
      "label": business_membership_label,   # "Join Company" / "Requested" / "Leave Company"
      "href": None,
      "button_class": business_membership_btn_class,
      "icon_class": None,
      "data_toggle": None,
      "data_target": None,
      "js_hook": "js-business-membership-action",
      "disabled": business_membership_disabled,
      "visible": True,
      # data attrs: data-business-id, data-action
    },
  ],

  "kebab": {
    "items": [
      {"label": "Report Profile", "href": None, "data_toggle": "modal", "data_target": "#reportBusinessModal", "icon_class": None, "danger": False, "visible": True},

      # Label normalization: mock says "Leave Group" (artifact). Use Leave Company.
      {"label": "Leave Company", "href": None, "data_toggle": None, "data_target": None, "icon_class": None, "danger": True,  "visible": is_business_member},

      # Admin/owner only actions:
      {"label": "Post a Job", "href": url("business_job_create", business.slug), "data_toggle": None, "data_target": None, "icon_class": None, "danger": False, "visible": is_business_admin},
      {"label": "Edit",       "href": None, "data_toggle": "modal", "data_target": "#editBusinessModal", "icon_class": None, "danger": False, "visible": is_business_admin},
    ]
  },

  # business header also has a website link in the header meta row.
  # Implement in base header as an optional "meta_links" slot if desired.
  # Minimal approach: treat as a badge-like link or render under subtitle via wrapper.
  "tabs": [
    {"key": "about",   "label": "About",   "href": url("business_about", business.slug),   "count": None,               "active": active_tab == "about"},
    {"key": "team",    "label": "Team",    "href": url("business_team", business.slug),    "count": None,               "active": active_tab == "team"},
    {"key": "jobs",    "label": "Jobs",    "href": url("business_jobs", business.slug),    "count": business.job_count, "active": active_tab == "jobs"},
    {"key": "reviews", "label": "Reviews", "href": url("business_reviews", business.slug), "count": None,               "active": active_tab == "reviews"},
  ],
}

Optional base-slot extension:
- If we want the business website link to be standardized in the base header, add:
  - `header.meta_links = [ {"label": "aliquot.com", "href": business.website_url} ]`
and render `meta_links` under subtitle in the base template.

## Friends/Members list pattern reuse (User friends + Group members)

Sources:
- Owner Friends (my context): `my-friends.html`
- Public Friends (user context): `user-profile-friends.html`
- Group Members: `group-members.html`

### Canonical list component
These pages share a common list pattern:
- `<ul class="friends-list">` rows with:
  - left: user avatar + name link
  - right: relationship/action button (Add to Friends / Friends) and sometimes a kebab.

Create a single reusable include:
- `templates/partials/lists/user_relation_list.html`

And a single row include:
- `templates/partials/lists/user_relation_row.html`

Row inputs:
- `person` (User)
- `right_action` (button spec: label + state + js_hook)
- `show_kebab` (bool)
- `kebab_items` (list of actions)
- `context` in {"friends_owner","friends_public","group_members_admin","group_members_public"}

### Context differences (important)
Owner Friends (`my-friends.html`) includes per-row kebab actions (Mute, Block User) in the Friends list.
Public Friends (`user-profile-friends.html`) does not include per-row kebabs.

Decision:
- Group Members will follow the same pattern:
  - Public/non-admin Members tab: no per-row kebabs
  - Admin Members tab: per-row kebabs are allowed (mirror owner-context behavior)

### Tab structure reuse: requests tab vs shared/common tab
Owner Friends includes:
- Tab 1: Friends
- Tab 2: Friend Requests (with badge count) and accept/decline controls (check / X).

Public Friends includes:
- Tab 1: Friends
- Tab 2: Shared Friends.

Group Members currently shows:
- Tab 1: Members
- Tab 2: Members I know (mirrors "Shared Friends" concept).

Decision:
- Group administrator will see "Membership Requests" as the second tab under Members,
  replacing "Members I know" in admin context (same UI and controls as Friend Requests).
- Non-admin/public context keeps "Members I know" as the second tab (shared/common concept).

## Groups listing pages (My Groups vs User Groups) reuse + admin context

Sources:
- Owner context: `my-groups.html`
- Public context: `user-profile-groups.html`

### Shared "group tile" list pattern
Both pages render groups as a grid of link tiles:
- square image thumbnail
- group name
- member count line
- category line
- each tile links to `group-page.html`

Create reusable includes:
- `templates/partials/groups/group_tile.html`
  Inputs:
  - `group` (name, image_url, member_count, category_label, href)
- `templates/partials/groups/group_tile_grid.html`
  Inputs:
  - `groups` list

### Public context: user-profile groups page
`user-profile-groups.html`:
- Displays a simple header ("Groups") and then the group tile grid.
- No group administration controls.

Template target:
- `templates/user/user_groups.html` (public profile groups tab)

### Owner context: my groups page (adds admin + create group)
`my-groups.html`:
- Renders owner user header include (`includes_my-profile-head.html`) at the top.
- Adds a "Create Group" button that opens `#groupModal` (Create New Group form).
- Adds a two-tab layout:
  - "My Groups"
  - "Group Administration"

Group Administration tab:
- Displays a group tile grid (currently a subset in the mock).
- Intended to list groups where the user is an admin/owner.

Correction/clarification:
- The "Create Group" button is rendered above the tab pills (My Groups / Group Administration).
- Because it is outside the tab panes, it is effectively available while viewing BOTH:
  - My Groups tab
  - Group Administration tab

Implementation:
- Render the Create Group trigger once per page (not per tab content).
- Include the Create Group modal once per page (`#groupModal`), not inside a tab pane.

Create Group modal (`#groupModal`):
- Fields:
  - Group Name (text)
  - Category (select)
  - Group Type (select: Public / Semi-Public / Private) + descriptive helper text

Template targets:
- `templates/user/my_groups.html` (owner groups tabbed page)
- Modal partial: `templates/partials/groups/group_create_modal.html`

### Normalization decisions (for maintainability)
- Use the same `group_tile_grid.html` include for:
  - public user groups page
  - owner my groups page (My Groups tab)
  - owner my groups page (Group Administration tab)
- Only the owner page adds:
  - Create Group modal and trigger
  - Group Administration tab

## Owner-context tabbed pages: standard "page_actions row above tabs" pattern

Source example:
- `my-groups.html`

### Pattern definition
For owner-context pages that use tabs (e.g., My Groups with My Groups/Admin tabs),
render a single `page_actions` row ABOVE the tab nav (and outside tab panes) to keep
owner-only actions consistent and always available across tabs.

This row typically contains:
- Right-aligned owner actions (e.g., "Create Group", later "Create Business")
- Left side: tab pills nav

Rationale:
- Avoid duplicating the action button per tab
- Keep owner-only actions always accessible regardless of the active tab
- Establish a reusable template pattern for similar owner pages (My Friends, My Photos, My Businesses, etc.)

### Recommended template extraction
Create a reusable include:
- `templates/partials/layout/page_actions_tabs_row.html`

Inputs:
- `actions` (list of action button specs; same schema used by entity header actions)
- `tabs` (list of {key,label,href|target,active} OR render slot for a nav-pills block)

Usage example (conceptual):
- Owner page template:
  1) entity header (owner variant)
  2) card body:
     - include `page_actions_tabs_row.html` (Create button + tabs)
     - tab content panes

### Example: My Groups
- The Create Group button is rendered once (outside panes), triggers `#groupModal`,
  and therefore applies to both "My Groups" and "Group Administration" tabs.

### Forward application
Apply the same pattern to:
- `my-business.html` (owner-context Businesses tab) with "Create Business"
- any future owner tabbed pages with create/admin flows

## Component mapping: Business About card (display + edit actions + modals)

Source:
- `business-page.html` (About tab → left/sidebar “About” card)

This section maps the Business **About card** into reusable components + canonical modal wiring.

---

### Business About card → component mapping

#### Component
- `templates/partials/business/business_about_card.html`

#### Card sections (display)
1) **About (description)**
   - Displays business “About” text (e.g., “We build everything.”).
2) **Primary location + contact**
   - Displays a primary location label (e.g., “Location A”)
   - Displays address
   - Displays phone number
   - “More locations” link/button (implies multi-location support)
3) **Other Social Profiles**
   - Renders social icon links: Facebook / Instagram / LinkedIn / Twitter

#### Card edit actions (two pencil icons)
A) Pencil icon next to **About**
- **Current mock wiring:** targets `#bioModal`
- **Canonical wiring:** opens the **Edit Business (Details)** modal
  - Modal title must be: **“Edit Business”** (NOT “Edit Bio”)
  - This modal edits: about/description, website, phone, address fields, country, etc.
  - Implementation note: this can be either:
    1) a dedicated details modal (recommended ID: `#editBusinessDetailsModal`), OR
    2) a unified “Edit Business” modal with sections/tabs (identity + details)

B) Pencil icon next to **Other Social Profiles**
- **Current mock wiring:** targets `#bioModal` (artifact)
- **Canonical wiring:** opens the shared **Edit Social Profiles** modal (same component used on user profile)
  - Modal ID: `#socialModal`
  - Modal title: “Edit Social Profiles”
  - This keeps social profile editing consistent across User + Business

---

### Modal mapping (Business)

#### 1) Business identity modal (name/logo/category)
- Existing modal in mock: `#editBusinessModal`
- Fields:
  - Business Name
  - Logo upload
  - Category select
- Artifact:
  - Footer primary button says “Create” → should be “Save”
- Usage:
  - Triggered from business header kebab “Edit”
  - Optional: also used for About-card pencil if you decide to unify all edits into one modal

Recommended partial:
- `templates/partials/modals/business_edit_identity_modal.html`

#### 2) Business details modal (about/contact/address/location)
- Existing modal in mock: `#bioModal` (misnamed; title shows “Edit Bio”)
- Canonical:
  - Title must be “Edit Business”
  - Consider renaming:
    - `#editBusinessDetailsModal` (preferred) OR unify into `#editBusinessModal` with sections
- Fields currently depicted:
  - About (textarea)
  - Website
  - Phone
  - Address line 1 / Address line 2
  - City / ZIP
  - Country (Select2)

Recommended partial:
- `templates/partials/modals/business_edit_details_modal.html`

#### 3) Social profiles modal (shared User + Business)
- Canonical modal:
  - `#socialModal` titled “Edit Social Profiles”
- Trigger:
  - Business About card “Other Social Profiles” pencil
  - User profile Bio card “Other Social Profiles” pencil (shared behavior)

Recommended partial:
- `templates/partials/modals/social_profiles_modal.html`

---

### Data/Context inputs needed by `business_about_card.html`

- `business.about_text`
- `business.primary_location` (label/name)
- `business.primary_address` (formatted or components)
- `business.primary_phone`
- `business.website_url`
- `business.social_links` (facebook/instagram/linkedin/twitter URLs)
- `can_edit_business_details` (bool) → shows About pencil
- `can_edit_business_social` (bool) → shows Social pencil
- `has_multiple_locations` (bool) → shows “More locations”
- `more_locations_url` (URL) OR modal trigger if locations managed via modal

---

### Normalization rules (so it stays maintainable)

- The Business “Other Social Profiles” edit flow MUST reuse the same modal/partial as the User profile.
- Avoid duplicated DOM IDs inside modals (file inputs frequently use `id="file"` in mockups). Parameterize:
  - `modal_id`, `form_id`, `file_input_id`
- Standardize primary modal button labels:
  - “Save” for edits, “Create” only for create flows

## Businesses listing pages (My Businesses) reuse + owner page_actions pattern

Sources:
- Create Business page: `create-business.html`
- Owner context Businesses tab: `my-business.html`

### Owner-context page_actions row above tabs (Businesses)
`my-business.html` follows the same owner pattern as `my-groups.html`:
- A right-aligned owner action button exists ABOVE the tab panes and alongside the tab pills:
  - "Create Business" links to `create-business.html`
- Tab nav has two tabs:
  - "Businesses" (active)
  - "My Businesses"

Normalization decision:
- Treat this as the canonical owner-context pattern for entity listings:
  - entity header (owner)
  - card body:
    - page_actions row (Create button on the right + tabs on the left)
    - tab panes
- Reuse the same `page_actions_tabs_row.html` include used for My Groups.

### Business tile/list pattern (grid)
Both tabs display a grid of business tiles:
- square image thumbnail
- business name
- category hierarchy line using caret icon (e.g., "Tech > IT", "Civil Engineering > Architecture")
- each tile links to `business-page.html` (or `business-page-closed.html` for closed businesses)

Reusable includes:
- `templates/partials/business/business_tile.html`
  Inputs:
  - `business` (name, image_url, category_label, subcategory_label optional, href)
- `templates/partials/business/business_tile_grid.html`
  Inputs:
  - `businesses` list

### Tab meaning (semantic)
- Tab "Businesses": directory/search-like listing (general businesses user sees/joins)
- Tab "My Businesses": businesses where the viewer is an owner/admin (managed businesses)
Implementation:
- Filter lists using BusinessMembership role:
  - "My Businesses" includes businesses where role in {owner, admin}.

## Create Business (create-business.html) → component + field mapping

Source: `create-business.html`

### Page template target
- `templates/business/business_create.html`

### Fields depicted (create-time)
- Business Name (text input)
- Location (repeatable set):
  - Address
  - ZIP
  - Country select (Select2)
  - "Add another location" button adds another location block
- Website (text input)
- Category (Select2; optgroups)
- Image upload (drag/drop uploader)
- Submit button: "Create"

### Reusable partials
- `templates/partials/forms/location_block.html` (repeatable)
- `templates/partials/forms/image_uploader.html` (drag/drop uploader)

### DOM ID safety (critical)
The create page uses upload input `id="file"`. This MUST be parameterized in the reusable uploader partial
(e.g., `file_input_id`) to avoid collisions when multiple uploaders exist on a page.

### Include replacement
`create-business.html` uses DEV-only `w3-include-html` for topnav/sidenav injection. Replace with Django includes.

## Business: Team tab (business-team.html) → reuse of friends/members list component

Source:
- `business-team.html`

### Summary
The Business Team tab is effectively a "people list" identical to the Friends/Members list pattern:
- `<ul class="friends-list">` rows show:
  - left: user avatar + name link
  - right: friend action button ("Add to Friends" / "Friends")

### Component reuse decision
Reuse the existing canonical list partials (from Friends/Members work):
- `templates/partials/lists/user_relation_list.html`
- `templates/partials/lists/user_relation_row.html`

Context for Business Team:
- `context = "business_team"`
Row action:
- right-side button is FRIEND relationship state (not business membership).
- In production: replace repeated `id="liveToastBtn"` with a class hook (e.g., `.js-friend-action`) + event delegation.

### Business header reuse
Business Team page uses the standard Business entity header (cover + awards + title/subtitle + kebab + tabs + Invite/Join actions).

## Business: Jobs tab (business-jobs.html) → job post cards (post-like content)

Source:
- `business-jobs.html`

### Summary
The Jobs tab renders one or more "Job Post" cards that are structurally similar to a feed post card:
- header media: business logo + business link + timestamp
- kebab actions: Edit / Delete / Propose Deletion
- job content: title (h3), location (text-muted), Apply button with external-link icon
- long description with "Show more" toggle using `.showHidden` + `.hidden-content`
- reaction + share buttons (same UI class names as other post-like content: `addReaction`, `shareLink`)
- comment composer at bottom (textarea + image + emoji + Post)

### Recommended components
- `templates/partials/posts/job_post_card.html`
  - Implement as a specialization of the generic `post_card` (job-specific fields + apply link).
- `templates/partials/posts/post_kebab_menu.html`
  - Must support "Propose Deletion" as a menu option.
- `templates/partials/modals/propose_deletion_modal.html`
  - Jobs page includes `#reportModal` with reasons + clarification textarea.
- `templates/partials/comments/comment_composer.html` (shared)

### ID + modal safety rules (critical)
- Jobs page uses a single modal with id `#reportModal`. Keep this as ONE modal per page if possible.
- If we ever render multiple propose-deletion modals (not recommended), all checkbox IDs (`reason1`, `reason2`, etc.) must be parameterized to avoid collisions.

### Permission gating (template-level)
- Show kebab items based on permissions:
  - Edit/Delete: business admins/owners only
  - Propose Deletion: anyone who can see the job post (or at least members)

## Photos (User + Group): shared tabs + gallery grid + album views + edit flow

Sources:
- Owner user photos: `my-photos.html`
- Public user photos: `user-profile-photos.html`
- Owner album view: `my-photos-album.html`
- Group photos: `group-photos.html`
- Group album view: `group-photos-album.html`
- Edit photos bulk action page: `edit-photos.html`

### Canonical structure: Photos/Albums tabs
Photos pages share a two-tab layout in a card:
- Tab 1: Photos (grid)
- Tab 2: Albums (grid of album tiles)
This pattern exists on:
- User (owner) `my-photos.html`
- User (public) `user-profile-photos.html`
- Group `group-photos.html`

Reusable include:
- `templates/partials/photos/photos_albums_tabs.html`
Inputs:
- `photos_count`, `albums_count`
- `photos` (list)
- `albums` (list)
- `context` in {"user_owner","user_public","group_public","group_admin"}

### Gallery grid cells
Photo grid uses repeated cells:
- `.gallery-img` wrapper
- `.square-img > img`
Reusable include:
- `templates/partials/photos/photo_grid.html`
- `templates/partials/photos/photo_grid_item.html`
Inputs:
- `photo` (thumb_url, alt, href optional)

Album grid uses repeated tiles:
- album cover image + album name + item count
Reusable include:
- `templates/partials/photos/album_tile_grid.html`
- `templates/partials/photos/album_tile.html`
Inputs:
- `album` (name, cover_thumb_url, item_count, href)

### Owner-only page actions (Add Photos / New Album / Edit Photos)
Owner user photos page has page actions above tabs:
- "Add Photos" opens `#uploadModal`
- "New Album" opens `#albumModal` (Create New Album)
- "Edit Photos" is a link to `edit-photos.html`

Public user photos page has no page actions/modals.

Group photos page has no add/new actions shown (public context), and top area is group header + tabs.

Reusable pattern:
- For owner-context tabbed pages, keep owner actions in the `page_actions` row above tabs (same convention as Groups/Businesses).
- `uploadModal` and `albumModal` included once per page, outside tab panes.

### Modals: New Album + Add Photos (owner user context)
`my-photos.html` includes:
- `#albumModal` Create New Album (Album Name input + Create button)
- `#uploadModal` Add Photos drag/drop uploader using file input `id="file"` (must be parameterized)

Reusable partials:
- `templates/partials/modals/album_create_modal.html`
- `templates/partials/modals/photo_upload_modal.html`
- `templates/partials/forms/image_uploader.html` (shared with other uploaders)

Critical ID safety rule:
- file input uses `id="file"` in multiple pages/modals → MUST be parameterized to avoid collisions.

### Album view page (User + Group)
Album view pages show:
- Breadcrumb back to Albums tab (`...photos.html#albums`)
- Album name + item count
- Photo grid
Owner user album view includes:
- Rename Album modal trigger (pencil icon) + `#albumNameModal` Rename Album (Save)
Both user and group album views include:
- "Add To Album" button opens `#uploadModal` (Add Photos) :contentReference[oaicite:18]{index=18}

Reusable template targets:
- `templates/photos/album_detail.html` with context for:
  - `is_owner` (show rename pencil + rename modal)
  - `can_add_photos` (show Add Photos modal)

### Bulk edit flow: Edit Photos page
`edit-photos.html` is a bulk-selection page for the owner:
- grid of images with checkboxes (`check1..check6`)
- each tile has a read-only date input that becomes editable on click (`.editDate` click→editable)
- "Move To Album" opens `#albumModal` which lists albums with checkboxes and a "New Album" button (currently link placeholder)
- "Select All" is a link (placeholder)

Reusable partials (recommended):
- `templates/photos/photo_bulk_edit.html`
- `templates/partials/photos/photo_select_tile.html` (image + checkbox + date input)
- `templates/partials/modals/move_to_album_modal.html`

Implementation note:
- checkbox IDs (`check1`, etc.) are mock-only; in Django, generate unique IDs per photo.

## Canonical “post-like” architecture (Posts / Reviews / Jobs / Photos)

Goal: normalize all feed-like content into a single composable component system.

### component_post_like (base)
Django include:
- `templates/partials/content/post_like_card.html`

This is the base card used for:
- Posts (feed + user pages)
- Reviews (business pages)
- Jobs (business pages)
- Photo posts (if/when photos appear in a feed format)

Slots / subcomponents:
1) `component_card_header_author` (author avatar/name + timestamp + kebab)
2) `component_card_body` (text, optional)
3) `component_media_block` (0..N attachments; grid variants)
4) `component_reactions_bar` (reaction summary + add reaction + share)
5) `component_moderation_panel` (conditional)
6) `component_comments` (thread + composer)

---

### component_composer (post-like composer)
Django include:
- `templates/partials/content/composer.html`

Confirmed affordances from feed “make post”:
- textarea
- media button opens `#uploadImgModal`
- emoji button
- visibility selector: Everyone / Friends / Private
- submit button (“Post”)

Context/props:
- `placeholder_text` (varies by page/context)
- `audience_default` (Everyone/Friends/Private)
- `allow_media` (bool)
- `allow_emoji` (bool)
- `submit_label` (Post / Review / etc.)

---

### component_card_header_author + kebab menu
Django include:
- `templates/partials/content/card_header_author.html`

Kebab menu actions (post-like):
- Edit
- Delete
- Propose Deletion (opens `#reportModal`) (feed page contains the post card; kebab is present there)

Implementation notes:
- Permission-gated display of Edit/Delete
- Propose Deletion displayed when viewer can propose moderation

---

### component_reactions_bar
Django include:
- `templates/partials/content/reactions_bar.html`

Depicts:
- multiple emoji “reaction pills” with counts
- addReaction button (smile-plus)
- shareLink button (share icon) (reaction UI is inside feed post cards)

Props:
- `reactions_summary`
- `viewer_can_react` (bool)
- `viewer_can_share` (bool)

---

### component_comments (thread + recursive comment + composer)
Django includes:
- `templates/partials/content/comment_thread.html`
- `templates/partials/content/comment.html` (recursive)
- `templates/partials/content/comment_form.html`

Depicts:
- nested replies
- “Show X replies”
- “Show N more comments”
- comment-level reaction controls in some variants

Props:
- `comments` (tree)
- `viewer` / `request.user`
- paging/collapse state

---

## Moderation (democratic deletion voting)

### component_propose_deletion_modal
Django include:
- `templates/partials/moderation/propose_deletion_modal.html`

Modal: “Propose Deletion”
- multi-checkbox reason list (Reason 1/2/3 placeholders in mockups)
- (other optional fields may exist in other pages)

Note: This same modal appears in other post-like contexts (e.g., business reviews).

---

### component_deletion_vote_panel (inline “voting stuff”)
Django include:
- `templates/partials/moderation/deletion_vote_panel.html`

State: **PROPOSED (not yet voted)**
- Banner: “Deletion Proposed”
- Prompt: “Agree?”
- Proposal text line (e.g., “Proposed for violation of terms”)
- Time remaining (e.g., “8 hours remaining”)
- Threshold requirement (e.g., “Supermajority needed (2/3) to pass”)
- Yes/No buttons

State: **VOTE IN PROGRESS (results visible)**
- Progress bar with YES tally (e.g., “4/9 (45%)”)
- Representative-votes UI:
  - voted markers vs remaining markers
  - “1 representative vote remaining for content deletion.”

Future (not yet depicted in these lines; keep as TODO):
- RESOLVED: passed → removed
- RESOLVED: failed/expired → kept
- Viewer already voted (disable buttons / show “Voted”)

---

## Media upload modal used by composer

### component_upload_image_modal
Django include:
- `templates/partials/media/upload_image_modal.html`

Confirmed control:
- checkbox: “Fit image instead of showing a cropped preview” (store as an upload/display preference)
