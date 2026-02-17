# Data Model Notes (v0)

These notes describe an initial modeling direction. They should be refined as we implement the first
end-to-end vertical slice (auth → feed → post-like content → moderation).

## Public URL scheme (locked)

- User profile: `/<username>/`
- Group: `/g/<slug>/`
- Business: `/b/<slug>/`

Uniqueness rules:
- `User.username` unique (case-insensitive compare recommended).
- `Group.slug` unique (case-insensitive compare recommended).
- `Business.slug` unique (case-insensitive compare recommended).

Reserved words:
- Usernames must not equal any reserved route segment.
- Minimum reserved list is maintained in `ARCHITECTURE_SNAPSHOT.md`.

Routing order requirement (Django):
- Define `/g/<slug>/` and `/b/<slug>/` before the root `/<username>/` route.
- Define fixed routes (`/search/`, `/settings/`, etc.) before `/<username>/` as well.
- Place `/<username>/` last as the catch-all.

## Core entities

- User (`AUTH_USER_MODEL`, custom user)
- Profile (optional, 1:1 with User; bio, location, etc.)
- Business
- Group

## Social graph

- Friendship (mutual) or Follow (one-way) — decision required (see `OPEN_QUESTIONS.md`)
- GroupMembership
- BusinessTeamMembership

## Content

### Post
- author (User; later may support posting “as” Business/Group)
- visibility (everyone / friends / private)
- body text
- created_at / updated_at

### MediaAsset
- post FK
- file
- metadata (width/height/type)

### Comment (threaded)
- target (post-like target, see below)
- author FK
- parent_comment FK (nullable for replies)

## Reactions

- Reaction
  - target (post-like target)
  - user FK
  - type (like, etc.)

## Moderation (core differentiator)

### ModerationProposal
- target (post-like target)
- proposed_by user
- reason_code
- clarification_text
- created_at
- closes_at
- threshold_rule (e.g., 2/3)
- status (open/closed/passed/failed)

### ModerationVote
- proposal FK
- voter user
- vote (yes/no)
- created_at

### ModerationOutcome
- proposal FK
- final_yes
- final_no
- passed boolean
- applied_at
- action_taken (remove/hide/label/etc.)

Confirmed behavior:
- Proposer auto-votes YES when creating a proposal.
- A “passed” removal suppresses content and renders a tombstone card; it is not hard-deleted.

## Post-like targets (important)

Several surfaces behave “post-like” in the mockups (reactions, comments, moderation).
We should model these targets consistently.

MVP options:
- Option A: separate tables (Post, Review, Job) + GenericForeignKey for Reaction/Comment/Moderation.
- Option B: a unified ContentItem table with a type discriminator (harder upfront, simpler targeting).

Choose one when implementing the first vertical slice; record the decision in `PROJECT_LEDGER.md`.

## Businesses: Reviews (confirmed)

Reviews render like posts (reactions, share, comment composer) and support the moderation workflow.

Minimum fields:
- Review
  - author (FK -> User)
  - business (FK -> Business)
  - rating (int 1..5)
  - body (text)
  - created_at / updated_at

Reviews appear in two places:
- Business → Reviews tab
- User profile → Reviews tab

This implies Review is the canonical object (not duplicated per surface).

## Awards (driven by Review Summary Card)

A business can accumulate awards across years/categories.

Recommended model:
- Award
  - year (int)
  - city (string or FK)
  - category (string or FK)
  - subcategory (string/FK, nullable)
  - title (display string)
  - icon/image (optional)
  - winning_business (FK -> Business)
  - created_at

Uniqueness constraint (recommended):
- unique (year, city, category, subcategory) → one winner per bucket
