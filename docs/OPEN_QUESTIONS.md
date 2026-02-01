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

## Reviews vs Posts (component sharing + feature scope)

1) Are Reviews first-class "content items" with the same capabilities as Posts?
   - Comments allowed on reviews?
   - Reactions allowed on reviews?
   - Share allowed on reviews?

2) Moderation scope:
   - Can Reviews be proposed for deletion using the same mechanism as Posts?
     (Propose Deletion → Yes/No vote → expanded stats + rep bypass UI)

3) Authoring rules:
   - Can a user create multiple reviews for the same business, or only one review that can be edited?
   - If only one, does posting again overwrite (update) or create a new revision entry?

4) Display rules:
   - When a Review is shown on the user profile Reviews tab, does it always show the business name/link?
   - Do we show the review rating distribution summary anywhere on the user profile, or only on the business page?

5) Attachments:
   - Are photos/videos allowed on reviews in MVP?
   - Any limits per review?

## Tech / Deployment
13. Database choice: MySQL (as preferred) vs Postgres (recommended for long-term search/analytics).
14. Do we require real-time chat/notifications in MVP, or can they be “refresh/polling” first?
15. Media storage: local disk vs S3-compatible (DreamObjects) from day one?

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
