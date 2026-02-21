# Next Steps

This file is forward-looking only. Completed work should move to PROJECT_LEDGER.md.

Current date: 2026-02-21

## Current status (1 paragraph)

Phase 2 is delivering a working vertical slice on hp-prd-web01. Routing surfaces are locked (including username catch-all last with reserved-words enforcement). Template architecture remains locked (base skeleton only; shells under templates/layouts; chrome in templates/includes; reusable blocks in templates/components). Post architecture has been cleaned up so Post is owned by apps/posts and the composer is reusable across surfaces. Moderation UI matches mockup state behavior (Agree? vs Voted with extras). Template rendering gotchas were discovered and mitigations were locked as project rules.

## Do next (in order)

### 1) Update documentation to prevent drift (immediate)
- Ensure these files reflect current reality and locked rules:
  - COMPONENTS_AND_INCLUDES.md
  - PROJECT_LEDGER.md
  - NEXT_STEPS.md
- Include the workflow discipline as a locked rule:
  - always request and review latest file contents before changes
  - preserve continuity comments
  - provide complete pasteable replacements

### 2) Finish post visibility and timeline policy implementation (Settings + friends)
Goal: Implement the rules already agreed upon:
- Feed belongs to the user and shows posts of interest to them.
- Profile shows a user’s own timeline posts.
- Visibility is dynamic at read-time for FRIENDS and can be edited later.
- “Who can post to your Timeline?” is enforced by category (everyone, friends, no one).

Work items:
- Implement friend graph model and friend checks.
- Add user settings persistence for timeline posting policy and default post audience.
- Enforce timeline posting policy at post_create (write-time).
- Update feed query to:
  - include friends’ posts according to visibility
  - include viewer’s own posts (to avoid the “I posted and cannot see it” UX)
- Update profile query to show timeline posts and apply visibility based on viewer relationship.

### 3) Post management actions (edit, delete, visibility changes)
- Wire author-only visibility edit UI to posts visibility endpoint.
- Add post edit and delete endpoints (author-only), then update kebab actions in post_card.
- Document any new contracts in COMPONENTS_AND_INCLUDES.md.

### 4) Resume mockup parity improvements on user profile page
- Continue matching mockups-original/my-profile.html and user-profile.html:
  - left stack spacing and card internals
  - header actions owner vs public
  - tabs behavior when implemented

### 5) Phase B: rename legacy DB table (optional, deliberate)
- Rename feed_post to a posts-owned name in a deliberate migration.
- Update docs and confirm no references assume the old table name.
