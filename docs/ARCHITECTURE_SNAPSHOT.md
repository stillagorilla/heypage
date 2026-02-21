# Architecture Snapshot (locked decisions + system map)

Last updated: 2026-02-20

This file is the “what is true” snapshot. If a decision is locked, it belongs here.

## Template architecture rules (locked)

- `templates/base.html` is skeleton only.
- Layout families are shells under `templates/layouts/`.
- Page templates extend a shell and never rebuild the grid.
- Shells include their own chrome:
  - `includes/top_nav.html` (must include search UX markup)
  - `includes/side_nav.html`
- Reusable content blocks live under `templates/components/`.

Canonical shells (actual filenames):
- `templates/layouts/entity_shell.html` (entity pages: user/group/business)
- `templates/layouts/2col_shell.html` (feed/search/settings family)
- `templates/layouts/chat_shell.html` (chat family; later)

## URL scheme locked (public entity URLs)

- Users: `/<username>/`
- Groups: `/g/<slug>/`
- Businesses: `/b/<slug>/`

Notes:
- Root-level user route is a catch-all and must be registered last.
- Reserved-words list prevents collisions with fixed routes/prefixes.

## Moderation states locked (UI + behavior)

- PROPOSED (viewer not voted): shows “Deletion Proposed Agree?”, buttons enabled, results visible.
- VOTE IN PROGRESS (viewer voted): shows “Deletion Proposed Voted.”, buttons disabled, results visible.
- Proposer auto-votes YES when proposing deletion.
- Resolved removal suppresses content (tombstone), not hard-delete.

## Entity-specific notes

### Business edit modals (important distinction)
Two different edit entry points both titled “Edit Business”, but different scopes:
1) Header kebab Edit
- Identity edit: name, logo/image, category
- Must be a distinct modal id and partial

2) About card pencil
- Details/profile edit: about, contact, locations
- Must be a distinct modal id and partial

Social profiles pencil:
- opens social profiles modal (separate)

### Photos and albums
Shared tabs pattern:
- Photos grid and Albums grid

Owner actions:
- Add Photos modal, New Album modal, Edit Photos bulk page

Bulk edit implies:
- photo taken_on editable
- move or add selected photos to albums

## Search

Two surfaces:
1) Live dropdown in topnav (suggest)
- Users, Groups, Businesses sections
- View All routes to hard results

2) Hard results page
- Tabbed: Users, Groups, Business
- Business tab includes Add Business CTA

Implementation approach:
- SearchDocument table (entity_type + object_id + indexed fields)
- Suggest endpoint returns grouped top-N per type.

## Settings and preferences

Settings page implies:
- account edits: username, name, email
- privacy settings: audiences for posts, friend requests, timeline posts, friends visibility
- bulk change existing posts visibility (action)
- blocked contacts modal and unblock action
- notification toggles
- security: password reset link, MFA placeholder

## Messaging (chat)

MVP recommended approach:
- Standard HTTP endpoints with polling.

Upgrade path:
- Channels/WebSockets later.
