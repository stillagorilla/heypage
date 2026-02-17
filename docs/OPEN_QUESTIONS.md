# Open Questions

Only unresolved items belong here. Resolved items should be moved to `PROJECT_LEDGER.md` (with date/commit if possible).

## High priority (blocks core implementation)

### Moderation eligibility + rules
1) Who can propose deletion?
   - Any authenticated viewer of the content, or a narrower set (friends, group members, etc.)?

2) Who can vote?
   - Any authenticated viewer of the content, or a narrower eligible set?

3) Vote window duration
   - Default duration (hours/days) and whether it varies by content type.

4) Threshold rules
   - Is it always 2/3 supermajority?
   - Is quorum required (minimum total votes)?

5) Representative bypass (depicted in UI)
   - What qualifies a user as a representative?
   - What does a rep vote do (end vote early? counts as multiple votes? separate veto/confirm)?
   - How are “rep votes remaining” allocated and replenished?

6) Post-resolution behavior
   - Should the moderation panel remain visible after pass/fail as an audit trail?
   - Is the tombstone visible to everyone who could view the original content?

### Social graph model
7) Relationship model
   - Mutual friends only, one-way follow, or both?

8) States + transitions
   - none / requested_by_me / requested_of_me / friends / blocked (or alternatives)

### Posting identity
9) Can users post “as” a Business or Group, or only as themselves?

## Medium priority (can be deferred until first vertical slice is complete)

### Reviews
10) One review per business, or multiple?
11) Are reviews editable after posting?
12) Do reviews appear in the main feed, or only on Business Reviews + User Reviews tabs?

### Groups and businesses
13) Membership states (none / requested / member / admin / owner)
14) Who can invite members (admins only vs members)?

### Media storage
15) Local disk vs S3-compatible (DreamObjects) from day one?

### Real-time requirements
16) Chat/notifications: polling first (MVP) vs real-time now?

## Resolved decisions (do not re-open here)

- URL scheme: **locked** to `/<username>/`, `/g/<slug>/`, `/b/<slug>/` (see `ARCHITECTURE_SNAPSHOT.md`)
- Moderation UI behaviors:
  - proposer auto-votes YES on proposal creation
  - vote results visible before a viewer votes
  - passed deletion renders tombstone “Content removed by vote.” (suppressed, not hard-deleted)
