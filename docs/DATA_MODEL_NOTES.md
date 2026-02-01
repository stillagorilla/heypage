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

## Reviews participate in moderation + comments (confirmed)

Source:
- `business-reviews.html`

Confirmed behaviors:
- Reviews expose "Propose Deletion" via kebab menu and include the Propose Deletion modal (`#reportModal`).
- Reviews include reaction/share actions and a comment composer.

Model implications:
- Reviews must be valid targets for:
  - ModerationProposal (target_type="review")
  - Comment (target_type="review")
  - Reaction (target_type="review")

Optional:
- Store review rating as integer 1..5.
- Support review media attachments (images) as shown in review card media grid.

## Review is a first-class content type (post-like behavior)

Sources:
- `my-reviews.html`
- `user-profile-reviews.html`

Observed behaviors:
- Reviews render like posts: reactions, share, and comment composer are present.
- Reviews have kebab actions including "Propose Deletion".

Recommended modeling:
- Review is a first-class entity tied to a Business.
- Reviews can be targeted by:
  - Comment (same comment model as posts, via GenericForeignKey/polymorphic target)
  - ModerationProposal (target_type="review")
  - Reaction (same reaction model as posts, via polymorphic target)

Additions to Review entity:
- business (FK)
- rating (1..5)
- body (text)
- created_at / updated_at

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

## Business Team and Jobs (tab content types)

Sources:
- `business-team.html`
- `business-jobs.html`

### Team
Business Team tab displays users who are associated with the business.

Recommended modeling:
- BusinessMembership (or BusinessTeamMember)
  - business (FK -> Business)
  - user (FK -> User)
  - role in {owner, admin, member}
  - status in {active, pending} (optional)
  - created_at

### Jobs
Business Jobs tab displays job postings as post-like cards with comments, reactions, and moderation actions.

Recommended modeling:
- JobPosting
  - business (FK -> Business)
  - title (string)
  - location_label (string)
  - description (text)
  - responsibilities (text or structured list)
  - qualifications (text or structured list)
  - apply_url (url)
  - created_at
  - updated_at
  - status in {active, closed, deleted}

Cross-cutting behaviors (post-like):
- If jobs allow reactions/comments, model them via the same polymorphic targets used for posts/reviews:
  - Reaction(target_type="job_posting", target_id=JobPosting.id)
  - Comment(target_type="job_posting", target_id=JobPosting.id)
- Jobs also expose "Propose Deletion" from kebab menu, so they should be valid ModerationProposal targets:
  - target_type="job_posting"
  - target_id=JobPosting.id

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

## Media: Photos and Albums (groups)

Suggested entities:
- MediaAsset
  - uploaded_by (User)
  - file
  - created_at
  - metadata (width/height/type)
- Album
  - owner_type (group/user/business)
  - owner_id
  - title
  - created_by (User)
  - created_at
- AlbumItem
  - album
  - media_asset
  - added_by (User)
  - added_at

## Media model (Photos + Albums)

UI shows the same photo/album patterns across user and group contexts.

Recommended entities:

- MediaAsset
  - uploaded_by (FK -> User)
  - file
  - created_at
  - taken_at (optional)
  - metadata (width/height/mime)
  - visibility (optional, if user media can be private)

- Album
  - owner_type in {"user", "group", "business"} (polymorphic)
  - owner_id
  - title
  - created_by (FK -> User)
  - created_at
  - cover_media_asset (FK -> MediaAsset, optional)

- AlbumItem
  - album (FK -> Album)
  - media_asset (FK -> MediaAsset)
  - added_by (FK -> User)
  - added_at

Owner actions implied by UI:
- create album (New Album modal)
- rename album (Rename Album modal)
- upload/add photos (Add Photos / Add To Album modal)
- move photos to album (Move to Album modal from Edit Photos)

## Friendship model (from My Friends UI)

Source: `my-friends.html`

Observed features:
- Friends list with a relationship button that varies by state ("Friends" vs "Add to Friends")
- Friend requests tab with accept/decline for inbound requests

Recommended entities:
- Friendship
  - requester (FK -> User)
  - addressee (FK -> User)
  - status in {pending, accepted, declined, blocked}
  - created_at
  - responded_at

Optional:
- FriendshipMute
  - user (FK -> User)
  - muted_user (FK -> User)
  - created_at

Notes:
- UI includes "Mute" and "Block User" actions per friend row.
- Topnav also includes friend request accept/decline, so the same model must power both.

## Group model (from My Groups + Create Group)

Source: `my-groups.html`

Observed features:
- My Groups list and Group Administration list (same tile layout)
- Create Group modal with Category and Group Type

Recommended entities:
- Group
  - name
  - slug
  - category (FK or controlled list)
  - visibility_type in {public, semi_public, private}
  - created_by (FK -> User)
  - created_at
  - cover_media_asset (optional)
  - avatar_media_asset (optional)

- GroupMembership
  - group (FK -> Group)
  - user (FK -> User)
  - role in {member, admin, owner}
  - status in {active, pending} (if join requests exist)
  - created_at

Notes:
- "Group Type" UI implies different rules for viewing content and joining the group.

## Friendship state enforcement

Decision:
- "Friends" list pages/tabs represent accepted friendships only.
- Pending requests are shown separately under Friend Requests (inbound) and, if needed later, under a Pending/Outgoing tab.

Implementation:
- Friendship.status = accepted is the only status included in friends lists.

## Business directory vs managed businesses (from My Business UI)

Sources:
- `my-business.html`
- `user-profile-business.html`

Observed behavior:
- There is a global "Businesses" directory and a separate "My Businesses" list for businesses the user manages.
- Owner context includes a Create Business action.

Recommended modeling:
- BusinessMembership (or BusinessTeamMember)
  - business (FK -> Business)
  - user (FK -> User)
  - role in {owner, admin, member}
  - status in {active, pending} (optional if invites/requests exist)
  - created_at

Directory queries:
- "Businesses" tab: Business.objects.filter(status=ACTIVE or include CLOSED with banner)
- "My Businesses" tab: businesses where request.user has membership role in {owner, admin}

Business closed state:
- Business.status includes CLOSED (used to show "This business has closed" banner and potentially alter behavior).

## Chat model notes

Source: `chat.html`

Recommended entities:
- Conversation
  - id
  - created_at
- ConversationParticipant
  - conversation (FK)
  - user (FK)
  - last_read_at (optional, for unread badge counts)
  - muted (bool)
  - created_at
- Message
  - conversation (FK)
  - sender (FK -> User)
  - body (text)
  - media_asset (optional, for image attachment)
  - created_at

Notes:
- UI shows unread badge counts on chat list items.
- UI includes "Mute Conversation" action and "Block" action.

## Settings and privacy model notes

Source: `settings.html`

Privacy fields implied (initial):
- posts_visibility in {everyone, friends_of_friends, friends, private}
- friend_request_visibility in {everyone, friends_of_friends, friends, private}
- timeline_post_visibility in {everyone, friends_of_friends, friends, private}
- friends_list_visibility in {everyone, friends_of_friends, friends, private}
- bulk_change_existing_posts_visibility option (applies retroactively)

Notifications:
- notify_on_deletion_proposed (bool)
- notify_on_friend_requests (bool)
- notify_on_post_comments (bool)

Blocked contacts:
- BlockList
  - user (FK -> User)
  - blocked_user (FK -> User)
  - created_at

## User model requirements (from Login/Register)

Source: `login-register.html`

Registration requires:
- name (display name)
- username
- email
- password

Recommendation:
- Implement a custom Django user model from the start:
  - unique email
  - unique username
  - display_name (or first_name/last_name, depending on preference)

Optional future:
- Social auth identities (Google/Facebook) if social login is implemented later.

## Notifications and email delivery (from email template)

Source:
- `emails/index.html`

Email notifications implied:
- unread messages
- new friend requests
- comment added to your post
- deletion proposed on your post
- group membership approval needed for a managed group
- business received a new review

Recommended entities (minimal viable):
- Notification
  - recipient (FK -> User)
  - notification_type (enum)
  - actor_user (FK -> User, nullable)
  - target_type (string, e.g., "post", "comment", "group", "business", "review", "message")
  - target_id (int)
  - created_at
  - read_at (nullable)

Email dispatch strategy:
- Phase 1: send transactional emails per event type (or daily digest if preferred)
- Phase 2: add digest scheduling + batching

Unsubscribe and settings:
- Footer shows unsubscribe + notification settings link.
- Store per-user email notification preferences (already implied by Settings page).

## Moderation eligibility + soft-delete behavior (confirmed requirements)

Eligibility gating:
- Users registered for < 1 month:
  - do NOT see "Propose Deletion" under the post kebab
  - do NOT see Yes/No vote buttons
  - DO see that deletion has been proposed + voting status/progress UI
- Users registered for >= 1 month:
  - CAN propose deletion
  - CAN vote Yes/No during the voting window
- Users with the "representative" attribute:
  - can expedite deletion confirmation (e.g., 3 rep Yes votes can finalize regardless of remaining time)

Deletion is soft-delete:
- a "deleted" post is NOT physically removed; it is marked deleted and hidden everywhere it would normally appear.

Implementation notes (data model):
- User:
  - use `date_joined` to compute eligibility (or store a derived flag if needed for performance)
  - role/attribute system should support `rep` and `admin` (and any future types)
- Post:
  - `status` (active / proposed_deletion / deleted)
  - `deleted_at`, `deleted_reason` (optional), and `deleted_by_proposal_id` (nullable FK)
- ModerationProposal / DeletionProposal:
  - `target` (GenericForeignKey or explicit FK to Post to start)
  - `proposed_by`, `created_at`, `closes_at`
  - `status` (open/passed/failed/expired)
  - thresholds (e.g., 2/3) + any quorum requirement (TBD)
- ModerationVote:
  - `proposal`, `voter`, `vote` (yes/no), `created_at`
  - uniqueness constraint: one vote per user per proposal
- RepresentativeVote (if distinct from ModerationVote):
  - either:
    A) a flag on ModerationVote indicating rep-vote, or
    B) a separate model if reps have special limits/capacity accounting
