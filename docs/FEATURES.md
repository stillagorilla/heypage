# Features (v0)

This is the evolving feature inventory. It’s OK for this list to be broader than MVP; each item should eventually be tagged with MVP / Phase 2 / Phase 3.

## Core Platform

- [ ] Authentication: register, login, logout, reset password
- [ ] Profiles:
  - [ ] User profile
  - [ ] Business profile
  - [ ] Group profile
  - [ ] “My profile” vs “User profile” handled via context, not separate templates
- [x] **Locked public URL scheme** (see `ARCHITECTURE_SNAPSHOT.md`)
  - Users: `/<username>/`
  - Groups: `/g/<slug>/`
  - Businesses: `/b/<slug>/`
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

## Posts, comments, and moderation UI (confirmed from mockups)

- Post composer ("make post" card) with visibility selector and media/emoji affordances
- Post card with kebab menu actions: Edit / Delete / Propose Deletion
- Comment thread with nested replies + "Show X replies" + "Show N more comments"
- Moderation mechanism:
  - propose deletion expands voting panel
  - yes/no vote expands to show stats + threshold + representative bypass requirement (rules TBD)

## Search surfaces (MVP)

- Live search dropdown (Users/Groups/Businesses) + “View All” hard results page
- Hard results page tabs: Users / Groups / Businesses

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

### Business status: CLOSED (permanently closed)
- Business pages support a "permanently closed" state that displays a prominent banner: "This business has closed."
- Source mock: business-page-closed.html.

### Create business
- Create Business form includes:
  - Business name
  - One-or-more locations (Address + ZIP + Country/Region select), with "Add another location"
  - Website
  - Category (select2 with optgroups)
  - Image/logo upload (drag/drop UI)

### Edit business (modal)
Two different edit entry points both titled “Edit Business”, but different scopes (see `ARCHITECTURE_SNAPSHOT.md`):
1) Header kebab “Edit” → identity (name, logo/image, category)
2) About card pencil → profile details (about, contact, locations)

### Reviews
- Businesses have a Reviews tab with:
  - Ratings summary card (avg rating, star visualization, review count, rating distribution progress bars, awards list)
  - Review composer with star rating buttons (5..1) + textarea + attachments UI
  - Review cards that display star ratings per review

## Differentiator: Democratic Moderation (MVP)

- [ ] Propose deletion (select reason + optional clarification)
- [ ] Voting UI:
  - [ ] Countdown/time remaining
  - [ ] Threshold requirement (e.g., supermajority 2/3)
  - [ ] Current vote tally + percentage
  - [ ] “Voted” state
- [ ] Outcome states:
  - [ ] Content removed by vote (suppressed/tombstone)
  - [ ] Content kept after vote window ends
- [ ] Representative vote concept (as depicted) — rules TBD

## Entity pages share a common layout

- User, Business, and Group pages share the same layout pattern: entity header + sidebar cards + center feed-like column (About tab).
- Group About includes a "Send a message to the group" composer and an audience selector that supports "Everyone" and "Admins".
- Business About includes locations, other social profiles, and team preview cards in the sidebar.

## External Integrations (Future)

- [ ] OAuth-based integrations to import/export content with other platforms (scoped later)
