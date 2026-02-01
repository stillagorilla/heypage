# Data Model Notes (v0)

These notes describe an initial direction; they will be refined after full mockup review.

## Key Principle: Shared Slug Namespace
User, Business, and Group pages all live at "/<slug>". This requires a single namespace.

### Recommended approach
A "Handle" (or "SlugRegistry") table that maps slug -> target object.

- Handle
  - slug (unique)
  - target_type (user | business | group)
  - target_id

Pros: guarantees uniqueness across all entity types and makes routing predictable.

## Core Entities
- User (Django auth user)
- Profile (one-to-one with user; bio, location, etc.)
- Business
- Group

## Social Graph
- Friendship (if mutual) OR Follow (if one-way) — decide which is canonical
- GroupMembership
- BusinessTeamMembership

## Content
- Post
  - author (likely User; may later support posting "as" Business/Group)
  - visibility (everyone/friends/private)
  - body text
  - created_at/updated_at
- MediaAsset
  - post FK
  - file
  - metadata (width/height/type)
- Comment
  - post FK
  - author FK
  - parent_comment FK (nullable for replies)

## Reactions
- Reaction
  - post/comment FK
  - user FK
  - type (like, etc.)

## Moderation (Differentiator)
- ModerationProposal
  - target (post/comment/etc.)
  - proposed_by user
  - reason_code
  - clarification_text
  - created_at
  - closes_at
  - threshold_rule (e.g., 2/3)
  - status (open/closed/passed/failed)
- ModerationVote
  - proposal FK
  - voter user
  - vote (yes/no)
  - created_at

- ModerationOutcome
  - proposal FK
  - final_yes
  - final_no
  - passed boolean
  - applied_at
  - action_taken (remove/hide/label/etc.)

Representative vote concept:
- Needs explicit rules. If it persists, model as a special permission/capacity assigned per proposal or per user tier.

## Businesses: Reviews
- Review
  - author user
  - business FK
  - body
  - rating (optional)
  - created_at

Review must render in two places:
- User profile → Reviews tab
- Business page → Reviews tab

### Review model details (recommended)

Minimum fields:
- Review
  - id
  - author (FK -> User)
  - business (FK -> Business)
  - rating (int 1..5) [recommend required, not optional]
  - body (text)
  - created_at
  - updated_at

Media:
- ReviewMediaAsset
  - review (FK -> Review)
  - file
  - metadata (width/height/type)
  - created_at

Aggregation (computed, not stored unless performance demands it):
- average_rating
- review_count
- rating_counts (1..5)

Optional denormalization for performance:
- BusinessReviewAggregate (1:1 with Business)
  - average_rating_cached
  - review_count_cached
  - star_1_count ... star_5_count
  - updated_at

Cross-posting rules:
- Reviews appear in two places:
  - Business → Reviews tab
  - User profile → Reviews tab
This suggests the canonical object is Review (not "BusinessReview" and "UserReview" separately).

Moderation targeting:
- If reviews are eligible for the deletion voting workflow, they should be valid ModerationProposal targets.
  - target_type: "review"
  - target_id: Review.id

## Business (Entity)

Core fields (inferred from mocks):
- name
- category (likely FK or controlled taxonomy)
- website_url
- logo_image
- cover_image (or banner)
- status: ACTIVE | CLOSED | ... (CLOSED triggers "This business has closed." banner)

Related models:
- BusinessLocation (1-to-many): address fields + optional label (Location A/B)
- BusinessMembership / TeamMember:
  - user
  - role (member/admin/owner/etc)
- BusinessReview:
  - business, author(user), rating(1-5), body, media, created_at
  - supports aggregation (avg rating, counts per star)
- BusinessAward (optional): image + label text (appears in ratings summary)

Moderation:
- Business content supports "Propose Deletion" modal and voting/approval workflow (shared mechanism across entity types).

## User attributes / roles

Users can have multiple attributes that control permissions and UI differences (e.g., owner vs public profile pages).

Initial attributes:
- user (default for registered users)
- rep (representative; can participate in expedited deletion-confirmation)
- admin (additional delete permissions)

Implementation concept:
- Table: UserAttribute (name, description)
- Join table: UserAttributeAssignment (user_id, attribute_id, assigned_at, assigned_by)

## Human-friendly profile URLs

User profile: /<username>
Business profile: /<business-slug> (spaces → hyphens; duplicates get numeric suffix)
Group profile: /<group-slug> (spaces → hyphens; duplicates get numeric suffix)

This implies we must decide how to avoid collisions between user/business/group slugs (see OPEN_QUESTIONS).

## Reviews cross-posting

Users can post business reviews that appear on:
- the author’s user profile
- the business profile’s “Reviews” section

## Moderation model: deletion proposals and votes (UI-driven notes)

The moderation panel is stateful and expands through a sequence:
- no proposal → proposal open + yes/no buttons → voted + stats + rep bypass requirement.

Recommended entities:
- ModerationProposal
  - target_type + target_id (post/comment/etc.)
  - proposed_by
  - reason_code / reason_text (if applicable)
  - created_at, closes_at
  - threshold_num, threshold_den (e.g., 2/3)
  - status (open/closed/passed/failed)
- ModerationVote
  - proposal
  - voter
  - vote (yes/no)
  - created_at
- RepBypassVote (optional, if rep-bypass is real and distinct)
  - proposal
  - rep_user
  - created_at

Computed fields used by UI:
- yes_count, no_count, total_count
- yes_percent
- time_remaining
- rep_votes_remaining (rule-driven)

## Search model notes (v0)

The UI supports:
- live search suggestions in top navigation (Users / Groups / Businesses)
- a hard results page with the same entity categories and tabbing

Initial search scope:
- Users (name + username/handle)
- Groups (name + category/tag)
- Businesses (name + category)

Implementation approach:
- Phase 1: simple DB queries with `icontains` and per-entity limits for live dropdown
- Phase 2: introduce PostgreSQL full-text (or a dedicated search service) when needed

Required API contracts:
- Live results endpoint returns top N of each entity type for the dropdown.
- Hard results endpoint returns paginated lists per tab.
