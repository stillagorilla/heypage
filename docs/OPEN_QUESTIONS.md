# Open Questions (v0)

These are the questions we should answer early because they impact routing, data model, and long-term maintainability.

## URLs / Identity Namespace
1. Are usernames, business names, and group names all required to be unique across each other (single shared namespace)? The "/<slug>" requirement implies yes.
2. If a user registers "acme" and later someone creates business "acme", should business become "acme-2"?

## Posting Identity
3. Can users post "as" a business or group, or only as themselves?
4. Are posts attachable to a location (feed scope) or only author + visibility?

## Social Graph
5. Is the relationship model mutual friends, one-way follows, or both?

## Moderation Rules (highest priority)
6. Who is eligible to vote on a deletion proposal?
7. How is “region” determined for regional standards (user-selected, IP-based, profile location, group membership, etc.)?
8. What is the voting window duration by default? Is it configurable per content type?
9. Threshold rules:
   - always 2/3 supermajority?
   - does quorum matter (minimum # of votes)?
10. Representative vote:
   - what is it, who gets it, how earned, how many per proposal, how replenished?
11. What actions can moderation take?
   - remove entirely
   - hide in certain regions
   - label/warn
   - temporary quarantine pending more votes
12. Is there an appeal process? If yes, who hears it and what are the rules?

## Reviews vs Posts (resolved + remaining rules)

Resolved from mockups:
- Reviews use post-like cards including reactions, share, comment composer, and moderation actions.
- Implement reviews by reusing the post card pattern with review-specific inserts (stars + business preview).

Remaining rule questions:
1) Can a user create multiple reviews for the same business, or only one active review?
2) Are reviews editable after posting? (UI shows Edit in kebab menu.)
3) Do reviews appear in the main feed, or only on Business Reviews tab and User Reviews tab?
4) If reviews support comments/reactions, are they visible to everyone who can view the review, or restricted (friends only)?
5) Should the Business preview block in a review link to the business page (recommended)?
6) When a Review is shown on the user profile Reviews tab, does it always show the business name/link?
7) Do we show the review rating distribution summary anywhere on the user profile, or only on the business page?
8) Are photos/videos allowed on reviews in MVP?
9) Any limits per review?

## Tech / Deployment
13. Database choice: MySQL (as preferred) vs Postgres (recommended for long-term search/analytics).
14. Do we require real-time chat/notifications in MVP, or can they be “refresh/polling” first?
15. Media storage: local disk vs S3-compatible (DreamObjects) from day one?

## Frontend composition / DOM ID safety (prevent hard-to-debug bugs)

When converting mockups into Django includes, we must prevent duplicate DOM IDs for modals and form elements.

Questions / decisions:
1) Should we adopt a project-wide convention that every include that defines a modal requires:
   - `modal_id`, `form_id`, and any input IDs as parameters?
2) Should we forbid component includes from defining modals inline, and instead centralize modals in one place
   (e.g., page-level `{% block modals %}`) to guarantee uniqueness?
3) JS interaction approach:
   - Do we want progressive enhancement via `data-*` attributes + event delegation (recommended),
     so we avoid brittle selectors tied to IDs?
4) Comment thread behavior:
   - Will "Show X replies" and "Show N more comments" be server-driven pagination, client expand/collapse,
     or a hybrid?

## Mockup Consolidation
16. Confirm naming standard: we will replace “tile/card/voting stuff” with a consistent component taxonomy (e.g., `components/post_card.html`, `components/moderation_panel.html`, etc.).
17. Any mockup sections that are intentionally one-off (should NOT be componentized)?

## Moderation mechanics (critical)

- What is the exact voting model behind the "voting stuff" UI?
- What are the objects being voted on (post deletion only, visibility suppression, labels, etc.)?
- Does voting vary by region/locale and how is locale determined?

## Rep/admin permissions

- Confirm the exact behavior:
  - admin users can directly delete posts
  - post authors can edit posts
  - others can propose deletion via kebab menu
  - reps can expedite confirmations

## URL namespace collisions

If a username and a business name collide, which wins?
Options:
A) Global unique slug across all entity types (users, businesses, groups)
B) Prefix namespaces (/u/<username>, /b/<slug>, /g/<slug>)
C) Reserved keywords + conflict resolution rules

## Friend requests + friendship state (from top nav)
Top nav includes a friend request dropdown with accept/decline actions.

Open questions:
- Is the relationship model mutual friends only, or also follower/following?
- What are the states? (none, requested_by_me, requested_of_me, friends, blocked)
- Do “Add to Friends” and “Accept” create the same model record with different state transitions?

## Live search behavior
Top nav includes a “filter-as-you-type” dropdown showing Users/Groups/Businesses and a “View All” button to `search.html`.

Open questions:
- Do we support debounced live search on every keypress or only after N characters?
- What ranking rules for Users vs Groups vs Businesses?
- Are there privacy constraints (e.g., private groups not shown)?

## Business & Group membership rules (implied by headers)
- Business page supports Join Company + Invite + Team list + "Post a Job" action.
- Group page supports Join Group + Invite + Admins list.

Questions:
1) What are the membership states for business and group? (none/requested/member/admin/owner)
2) Who can invite? Members only, admins only, or any user?
3) Who can post as the entity vs post to the entity? (e.g., “company announcement” vs “user post on company page”)
4) For groups: what does "Admins" audience mean for posts? Visibility restriction or posting permission?

## Moderation: key rule questions (blocking)

Depicted moderation mechanics include:
- a timed vote window
- supermajority threshold
- an expedited "representative bypass" requirement with remaining rep votes shown.

Questions:
1) Who can propose deletion? Any authenticated user, or only friends/group members/etc.?
2) Who can vote? Any authenticated user who can view the content, or a narrower eligible set?
3) What is the default voting window duration (hours remaining is shown)?
4) Is there a quorum requirement (minimum total votes) in addition to 2/3 threshold?
5) Representative bypass:
   - What qualifies a user as a representative?
   - What exactly does the bypass do (immediate removal? counts as multiple votes? ends the vote early?) 
   - How are "rep votes remaining" allocated and replenished?
6) What happens to content after passing? Hard delete vs soft delete vs hidden + audit trail?

## Business: open questions

1) Who can mark a business as CLOSED?
   - owner/admin only, or community moderation?

2) Is CLOSED reversible? (re-open flow)

3) Business editing permissions:
   - Is there a "claim business" flow?
   - Can multiple admins edit? How are admins assigned?

4) Categories:
   - Do we need a fixed taxonomy table? Who can create categories?

5) Locations:
   - What minimum address structure do we need?
   - Are multiple locations always allowed? Any max?

6) Reviews:
   - Can a user post multiple reviews per business, or one active review that can be edited?
   - Can reviews be proposed for deletion via the same mechanism?

7) “Other Social Profiles” modal:
   - The business mock currently targets #bioModal but user-profile uses #socialModal. Confirm intended reuse and fields.

## Business header dropdown labeling artifact (resolved)

On Business pages, "Leave Group" appears in the business entity header dropdown. This is a mock artifact.
Decision:
- Replace with "Leave Business" (or "Leave Company") or remove if not supported.

## Business Team and Jobs rules

Sources:
- `business-team.html`
- `business-jobs.html`

### Team
1) What qualifies someone to appear on a business team?
   - membership record, business admin assignment, or profile field?
2) Who can see the team list? Everyone, members only, or hidden for some businesses?
3) Does joining a company create a BusinessMembership record (role=member)?

### Jobs
1) Who can create/edit/delete job posts? owner/admin only?
2) Is "Apply" always an external link (apply_url), or do we support internal applications later?
3) Do job posts appear in the main feed, or only within the business Jobs tab?
4) Are comments/reactions enabled for job posts in MVP?
5) Can job posts be proposed for deletion using the same voting mechanism as posts/reviews?
6) What does "Show more" reveal?
   - is it a single long description field, or separate sections (responsibilities, skills, etc.)?

## Search behavior (from UI + demo JS)

Hard results page:
- Tabs for Users / Groups / Business

Live search dropdown behavior (demo JS):
- Dropdown shows on focus of search box and hides on blur

Questions:
1) Should live search update results on each keystroke (debounced), or remain a static dropdown until Phase 2?
2) Minimum characters before querying (e.g., 2 or 3)?
3) Ranking rules for each entity type (recent activity, mutual connections, popularity, etc.)?
4) Should results hide entities the viewer cannot access (private groups, blocked users)?
5) Should "View All" preserve the query term and open the hard results page pre-filtered?

## Groups: membership and member list behavior

Group Members page includes:
- Member list + "Members I know" tab
- Member search input "Search Members"
- Add to Friends buttons within the group member list (toast feedback)

Questions:
1) What determines "Members I know"? (existing friends only, or friends-of-friends, or mutual groups?)
2) Group membership states: none, requested, member, admin, owner?
3) Can non-members view the Members tab, or is it restricted?
4) Are member search results limited by viewer permissions?
5) Are "Add to Friends" actions allowed directly from group member list for all members?

## Modals and toast confirmations

1) Invite flows:
   - What does "Invite" do for groups and businesses?
   - Invite by username, email, contacts, or share link?
   - Are invites restricted to admins or any member?

2) Join behavior:
   - In mocks, "Join Group" is a toast confirmation trigger (`#liveToastBtn`), not a modal.
   - Should joining ever require approval (pending state) or always immediate?

3) Toast and DOM IDs:
   - Multiple pages reuse the same `#liveToastBtn` id for different actions (Join Group, Add to Friends).
   - Implementation should switch to class selectors so multiple buttons can coexist without invalid HTML.

4) Propose Deletion modal:
   - Confirm whether `#reportModal` is the single modal entry point for starting deletion proposals on any content type.

## Photos and Albums

From group photo mockups:
- Photos tab shows a grid of thumbnails.
- Albums tab shows album tiles.
- Album detail supports "Add To Album" and a file upload modal.

Questions:
1) Who can add photos to a group album? (admins only, any member, invited members?)
2) Can non-members view group photos/albums, or is it restricted?
3) Do we support album creation from the UI in MVP, or only adding to existing albums?
4) Do photos belong to:
   - the group (group-owned media), or
   - the uploading user but associated with the group?
5) Are we planning a lightbox / full-screen viewer in MVP (the mock has a commented lightbox script)?

## HTML/JS constraints

- Production templates must not reuse IDs across multiple buttons (example: `#liveToastBtn` appears as a repeated action trigger in mockups).
- Use class selectors plus `data-*` attributes for action wiring and toast messages.

## Photos and Albums (permissions + UX)

User owner context shows:
- Add Photos
- New Album
- Rename Album
- Edit Photos (multi-select + Move To Album)

Public user profile shows:
- Photos and Albums tabs, but no add/edit actions.

Group pages show the same tabs + grids and album detail pages support Add To Album upload.

Questions:
1) Group permissions: who can add photos to group albums?
   - admins only, any member, or creator-only?
2) Can non-members view group photos/albums?
3) Do we allow removing photos from an album (not just adding/moving)?
4) Does "Move To Album" apply to user photos only, or also group photos?
5) Are photo dates editable (as shown by the editable date field UI) and is that date "taken_at" or "posted_at"?
6) Should album tiles link to a real URL slug (recommended) or ID-based URL?

## Friendship rules (from My Friends page)

Source: `my-friends.html`

Questions:
1) Is the relationship model strictly mutual friends, or do we also support follow/follower?
2) What are the full friendship states shown in UI?
   - pending outbound vs pending inbound vs accepted vs blocked
3) How does Mute work?
   - hides posts in feed only?
   - hides notifications?
4) Does blocking remove an existing friendship and prevent future requests?
5) Are friend requests rate-limited or restricted (e.g., must share a group)?

## Group type rules (from Create Group modal)

Source: `my-groups.html`

Group Type options:
- Public
- Semi-Public
- Private

Questions:
1) Public: can anyone view content and join instantly? (UI hint suggests yes)
2) Semi-Public: can anyone view, but join requires approval? Or view requires membership?
3) Private: can only members view content, and joining requires invite/approval?
4) Can Group Type be changed after creation? If so, what happens to existing members/content visibility?

## Public profile: friends visibility

Source: `user-profile-friends.html`

Questions:
1) Can users hide their friends list (privacy setting)?
2) If hidden, does "Shared Friends" still show as a count only, or as a list?
3) Is "Shared Friends" computed as mutual accepted friendships only?

## Public profile: groups visibility

Source: `user-profile-groups.html`

Questions:
1) Should private groups appear on a user's public Groups tab?
2) If a group is private, do we show it only to members, or not at all?
3) Should the Groups list include role badges (admin/member) when viewing your own groups, but not when viewing others?

## My Business page rules (directory vs managed)

Sources:
- `my-business.html`
- `user-profile-business.html`

Questions:
1) Does the "Businesses" tab show all businesses on the platform or only those in a certain geographic area?
2) What exactly qualifies a business to appear under "My Businesses"?
   - created_by user
   - claimed_by user
   - membership role owner/admin
3) Is there a "claim business" flow, or does Create Business always create a new managed business?
4) Should CLOSED businesses appear in the directory by default?
5) If a business is CLOSED, can it still be reviewed and can new posts be made on its page?

## Reviews: moderation and interaction scope (confirmed + remaining details)

Source:
- `business-reviews.html`

Confirmed:
- Reviews support Propose Deletion (modal entry point exists).
- Reviews have reaction/share actions and a comment composer.

Remaining questions:
1) Do comments on reviews support the same nested reply UI as post comments?
2) Are review reactions the same reaction set as posts?
3) Can business owners/admins delete reviews directly, or only via moderation proposal?
4) Are reviews visible in main feed, or only on Business Reviews tab and User Reviews tab?

## Chat scope (MVP)

Source: `chat.html`

Questions:
1) Is chat real-time (WebSockets) in MVP, or polling/refresh?
2) Are conversations strictly 1:1, or do we support group chats later?
3) Does "Block" in chat:
   - block user globally (prevents friend requests/messages), or
   - only mute/hide the conversation?
4) Are image attachments supported in MVP, or is the image icon decorative for now?
5) Unread counts: do we compute via last_read_at per participant?

## Settings enforcement (privacy + bulk changes)

Source: `settings.html`

Questions:
1) Does "Change who can see all existing post" retroactively update visibility on every prior post, or only future posts?
2) How does friends list visibility affect:
   - public profile Friends tab
   - Shared Friends tab
3) When user sets friend-request visibility to "Private", does that block all new requests or only from non-friends-of-friends?
4) Are blocked contacts hidden from:
   - search results
   - chat
   - group membership lists
   - business team lists

## Auth flows and security scope

Sources:
- `login-register.html`
- `reset-password.html`

Questions:
1) Username rules: allowed characters, minimum length, case sensitivity?
2) Email verification: required before first login or not?
3) Terms acceptance: do we store acceptance timestamp and version?
4) Password policy: minimum length, complexity rules?
5) Reset password: do we use Django's built-in reset flow with emailed token links (recommended)?
6) Social login: are Google/Facebook required for MVP or placeholders for later?

## Email notifications (template-driven)

Source:
- `emails/index.html`

Questions:
1) Are emails sent per-event (transactional) or as a periodic digest?
2) Which events are email-worthy in MVP?
   - unread messages
   - friend requests
   - comment on post
   - deletion proposed
   - group approvals needed
   - business new review
3) CTA behavior: does each email type have a specific CTA destination (e.g., open chat, view requests, review post)?
4) Unsubscribe scope:
   - global unsubscribe from all non-critical emails, or per-category unsubscribe?
5) Email branding assets:
   - Should the logo be an absolute URL hosted on the site, or CID-embedded in outbound emails?
6) Should emails also have a plain-text alternative (recommended)?

## Email notification line duplication (resolved)

Source:
- `emails/index.html`

The email mock repeats "You have new friend requests." twice. This is a mock artifact.

Decision:
- Implement email notifications using a normalized list of notification lines (deduped) and/or grouped counts.
- No duplicated notification lines should appear in real emails.

## Topnav: friend requests and notifications

Source:
- `includes_topnav.html`

Questions:
1) Friend requests in the dropdown: do accept/decline actions trigger a toast and remove the row immediately?
2) What should the bell/notifications icon open in MVP (dropdown list vs dedicated notifications page)?
3) Should friend request timestamps use relative time ("Just now") or absolute time formatting?

## UI behavior decisions (mockup JS review)

1) Live search behavior:
   - Should `.searchResults` show on focus only, or only after N characters typed?
   - Should blur hide immediately, or should clicking inside the results keep it open?

2) Toast behavior:
   - Toasts are triggered in mockups by `#liveToastBtn`, but IDs are duplicated across repeated buttons.
   - Decision: standardize on `.js-live-toast-btn` and use a single toast component, or per-page toasts.

3) Popovers (reactions/share/add emoji):
   - Mockups implement popovers by injecting raw HTML into the DOM.
   - Decision: implement via Bootstrap popover, a small custom menu, or an HTMX modal/menu.

4) Reply form behavior:
   - Mockups inject reply forms into the DOM as a demo.
   - Decision: do we render reply forms server-side (templates) and toggle visibility, or create them client-side?

5) Sticky sidebar:
   - Mockups include two approaches (custom scroll code and sticky-sidebar plugin).
   - Decision: pick one. Prefer CSS `position: sticky` where possible for performance and simplicity.

6) Upload widgets:
   - Mockups reuse `id="file"` in multiple upload forms. This will break when more than one uploader exists on the same page.
   - Decision: generate unique IDs per uploader or avoid label-for patterns that require global uniqueness.

## Search UX details (live dropdown + hard results)

Sources:
- `includes_topnav.html`
- `search.html`

Questions / decisions:
1) Live dropdown close behavior:
   - Current demo hides on blur. Should clicking inside `.searchResults` keep it open until selection?

2) When to query:
   - Show dropdown on focus only (static sections) vs query after N characters (debounced)?

3) "View All" behavior:
   - Should it carry the current query string into the hard results page (recommended)?

4) Access control:
   - Should search hide private groups / blocked users / blocked businesses from results?

5) Business “Add Business” CTA:
   - Is this always shown when searching Businesses, or only when results are empty / below a threshold?

## Notifications dropdown behavior

Decision:
- Bell icon opens a dropdown (not a dedicated /notifications/ page).

Open questions:
1) Maximum number of notifications shown in dropdown (e.g., 8)?
2) Do we include a "View older" link that opens a modal, or is the dropdown limited only?
3) Do notifications auto-mark as read when clicked, or only when explicitly marked?
4) Do we group duplicates (e.g., "3 new friend requests") or show individual lines?

## Entity header standardization (user/group/business)

Sources:
- Owner user header include
- Public user header include

Questions:
1) Should avatar edit be available only to owner, or also admins/representatives for certain entity types (business/group)?
2) Should cover photo be editable too (not shown as an edit control in the header yet)?
3) Relationship button states for public user header:
   - Add Friend / Requested / Friends / Blocked (confirm full state list)
4) Kebab actions for public user header:
   - Block User, Report User (confirm whether "Mute" belongs here too)
5) Toast behavior:
   - Replace `id="liveToastBtn"` with `.js-live-toast-btn` + data attributes everywhere.

## Entity header decisions for Group and Business

Sources:
- `group-page.html`
- `business-page.html`

Questions:
1) Invite button visibility:
   - Group: can anyone invite, only members, or only admins?
   - Business: can anyone invite, only members, or only admins?

2) Join behavior:
   - Is Join immediate (auto-membership), or does it create a join request pending approval?

3) Leave behavior:
   - Group: confirm modal before leaving?
   - Business: should label be "Leave Company" (recommended) or "Leave Business"?

4) Kebab menu permissions:
   - "Post a Job" and "Edit" should be restricted to business admins/owners. Confirm exact rule.

5) Header awards:
   - Are awards purely decorative images, or derived from structured data (award name, year, icon)?
