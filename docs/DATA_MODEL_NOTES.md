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
