# Features (v0)

This is the evolving feature inventory. It’s OK for this list to be broader than MVP; each item should eventually be tagged with MVP / Phase 2 / Phase 3.

## Core Platform
- [ ] Authentication: register, login, logout, reset password
- [ ] Profiles:
  - [ ] User profile
  - [ ] Business profile
  - [ ] Group profile
  - [ ] “My profile” vs “User profile” handled via context, not separate templates
- [ ] Unique public URLs:
  - /<username> for users
  - /<business-name> and /<group-name> with de-dupe suffix (-2, -3, ...)
- [ ] Feed:
  - [ ] Post composer
  - [ ] Visibility filter (e.g., Everyone / Friends / Private)
  - [ ] Pagination / infinite scroll (implementation choice later)
- [ ] Search (people, groups, businesses, posts)
- [ ] Media uploads:
  - [ ] Photos
  - [ ] Albums (as depicted)
- [ ] Comments + replies
- [ ] Reactions (like + counts)

## Key static pages (no context depictions)
- Feed (logged-in home): `feed.html`
- Search results: `search.html`
- Authentication: `login-register.html`, `reset-password.html`
- Settings: `settings.html`
- Chat: `chat.html`
- System email template: `emails/index.html`
- Temporary “prod placeholder”: `coming-soon.html`

## Differentiator: democratic content moderation
Heypage is Facebook-like, but is primarily distinguished by user-driven content moderation mechanics that decentralize moderation decisions. This feature is a primary purpose of the site. :contentReference[oaicite:3]{index=3}

Notes:
- Mockups mark moderation UI as "voting stuff".
- The moderation UI is NOT assumed to be simple upvote/downvote/report.

## Messaging / Notifications
- [ ] Chat (DMs)
- [ ] Notifications (mentions, comments, moderation events)

## Groups
- [ ] Group page
- [ ] Members
- [ ] Photos
- [ ] Join/leave (or request/invite — TBD)

## Businesses
- [ ] Create business
- [ ] Business page sections:
  - [ ] Reviews
  - [ ] Jobs
  - [ ] Team
  - [ ] Closed business state

## Differentiator: Democratic Moderation MVP
- [ ] Propose deletion (select reason + optional clarification)
- [ ] Voting UI:
  - [ ] Countdown/time remaining
  - [ ] Threshold requirement (e.g., supermajority 2/3)
  - [ ] Current vote tally + percentage
  - [ ] “Voted” state
- [ ] Outcome states:
  - [ ] Content removed by vote
  - [ ] Content kept after vote window ends
- [ ] Representative vote concept (as depicted) — rules TBD

## External Integrations (Future)
- [ ] OAuth-based integrations to import/export content with other platforms (scoped later)


