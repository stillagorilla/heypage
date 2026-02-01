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
