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
- Live search dropdown (Users/Groups/Businesses) + “View All” hard results page (`search.html`) :contentReference[oaicite:16]{index=16}
- Friend requests dropdown with accept/decline :contentReference[oaicite:17]{index=17}
- Add friend action + success toast :contentReference[oaicite:18]{index=18}
- Block/report user actions (kebab menu) :contentReference[oaicite:19]{index=19}
- Change profile photo (owner) with upload modal :contentReference[oaicite:20]{index=20}

## Posts, comments, and moderation UI (confirmed from mockups)
- Post composer ("make post" card) with visibility selector and media/emoji affordances :contentReference[oaicite:16]{index=16}
- Post card with kebab menu actions: Edit / Delete / Propose Deletion :contentReference[oaicite:17]{index=17}
- Comment thread with nested replies + "Show X replies" + "Show N more comments" :contentReference[oaicite:18]{index=18}
- Moderation mechanism:
  - propose deletion expands voting panel
  - yes/no vote expands to show stats + threshold + representative bypass requirement :contentReference[oaicite:19]{index=19}

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




