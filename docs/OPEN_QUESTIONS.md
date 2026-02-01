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
  - reps can expedite confirmations :contentReference[oaicite:7]{index=7}

## URL namespace collisions

If a username and a business name collide, which wins?
Options:
A) Global unique slug across all entity types (users, businesses, groups)
B) Prefix namespaces (/u/<username>, /b/<slug>, /g/<slug>)
C) Reserved keywords + conflict resolution rules

## Friend requests + friendship state (from top nav)
Top nav includes a friend request dropdown with accept/decline actions. :contentReference[oaicite:14]{index=14}

Open questions:
- Is the relationship model mutual friends only, or also follower/following?
- What are the states? (none, requested_by_me, requested_of_me, friends, blocked)
- Do “Add to Friends” and “Accept” create the same model record with different state transitions?

## Live search behavior
Top nav includes a “filter-as-you-type” dropdown showing Users/Groups/Businesses and a “View All” button to `search.html`. :contentReference[oaicite:15]{index=15}

Open questions:
- Do we support debounced live search on every keypress or only after N characters?
- What ranking rules for Users vs Groups vs Businesses?
- Are there privacy constraints (e.g., private groups not shown)?

## Business & Group membership rules (implied by headers)
- Business page supports Join Company + Invite + Team list + "Post a Job" action. :contentReference[oaicite:13]{index=13}
- Group page supports Join Group + Invite + Admins list. :contentReference[oaicite:14]{index=14}

Questions:
1) What are the membership states for business and group? (none/requested/member/admin/owner)
2) Who can invite? Members only, admins only, or any user?
3) Who can post as the entity vs post to the entity? (e.g., “company announcement” vs “user post on company page”)
4) For groups: what does "Admins" audience mean for posts? Visibility restriction or posting permission?

## Moderation: key rule questions (blocking)

Depicted moderation mechanics include:
- a timed vote window
- supermajority threshold
- an expedited "representative bypass" requirement with remaining rep votes shown. :contentReference[oaicite:21]{index=21}

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

