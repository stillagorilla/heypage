# Architecture Snapshot

This is the condensed system map for starting implementation without re-reading all mockups and mapping docs.

## North Star
A Facebook-like social platform with a core differentiator:
- Distributed, user-driven content moderation via deletion proposals and voting.

## Stack assumptions (current)
- Backend: Django, server-rendered templates first.
- API: optional DRF for endpoints like search suggest and voting.
- Real-time: not required for MVP, upgrade path via Django Channels.
- DB: Postgres preferred (search), MySQL acceptable if required by hosting.

## Deployment target (Phase 1–MVP): DreamCompute VM (OpenStack)

Hosting decision:
- Deploy to a self-managed DreamHost DreamCompute VM with full root access.

MVP architecture:
- Single VM:
  - Nginx (TLS) → Gunicorn → Django
  - Postgres on same host initially
  - Optional Redis (cache/sessions; later task queue broker)
- Storage:
  - Prefer volume-backed disk for Postgres/media so snapshots and migrations are straightforward.

Operational baseline:
- Backups are the operator’s responsibility:
  - scheduled DB backups + volume snapshots
  - offsite copies
- Security:
  - SSH key-only
  - restrict SSH ingress to known IP(s)
  - open only 80/443 publicly
- Monitoring:
  - uptime + resource/disk alerts

Scale-out plan:
1) Upgrade VM flavor (vertical)
2) Split DB to dedicated VM on private network
3) Add additional web VMs behind load balancer

## Public URL scheme (locked)
- Users: `/<username>/`
- Groups: `/g/<slug>/`
- Businesses: `/b/<slug>/`

Routing rule:
- Prefix routes and all fixed routes must be registered before the user catch-all.
- `/<username>/` is last.
- Enforce reserved words for usernames.

Reserved words (minimum set):
- `g`, `b`, `grp`, `biz`
- `search`, `login`, `logout`, `register`, `settings`, `reset-password`
- `chat`, `messages`, `notifications`
- `api`, `admin`, `static`, `media`
- `help`, `about`, `terms`, `privacy`

## App boundaries (recommended)
- `accounts`: custom User, profile, auth, password reset wiring
- `social`: friendships, blocks, memberships
- `entities`: groups, businesses, awards, locations
- `content`: post-like content items and attachments
- `comments`: threaded comments
- `reactions`: reactions on content and optionally comments
- `moderation`: deletion proposals, votes, outcomes, suppression
- `search`: SearchDocument index, suggest API, hard results
- `chat`: conversations, messages, mute and block actions
- `notifications`: notification events, preferences, email digests

## Template architecture (server-rendered)
Base layouts:
- `base.html` for app pages
- `auth_base.html` for auth pages (optional)

Global includes:
- `includes_topnav.html` (search dropdown, notifications dropdown, profile)
- `includes_sidenav.html`
- Entity header wrappers:
  - user_header_public
  - user_header_owner
  - group_header_public
  - business_header_public

Owner pages follow a consistent pattern:
- `page_actions` row above tabs for owner-context actions (Create Group, Create Business, etc.)

## Canonical “post-like” component system
One shared backbone across:
- Posts
- Business reviews
- Business jobs
- Photo-like content (when shown in a feed format)

Core partials:
- composer (make post / make review / make job)
- post-like card
- reactions bar
- comment thread
- moderation panel

Moderation states (locked):
- PROPOSED (viewer not voted): shows `Deletion Proposed Agree?`, buttons enabled, results visible.
- VOTE IN PROGRESS (viewer voted): shows `Deletion Proposed Voted.`, buttons disabled, results visible.
- Proposer auto-votes: proposing deletion immediately records YES for proposer, so proposer sees Voted. state.
- RESOLVED removal: content is suppressed (not hard-deleted) and renders tombstone `Content removed by vote.`

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

## Known cleanup item in docs
The older “shared slug namespace” handle registry concept is not required under the locked URL scheme (users at root, groups and businesses prefixed).
If that section still exists in Data Model Notes, mark it deprecated or update it to match the locked scheme.

## Current phase and next phase naming
- Current chat: Phase 0, Mockup Review + Architecture Blueprint
- Next chat: Phase 1, Environment + Django Scaffold

---

## Phase 1 Implementation Notes (As Deployed)

### Production VM (single-host MVP)
- Host: `hp-prd-web01`
- OS: Ubuntu 22.04 LTS
- Public IP: `208.113.165.79`
- Domains: `heypage.com`, `www.heypage.com` (DNS A records pointed to `208.113.165.79`)
- Note: Floating IP association in DreamCompute UI failed with errors; using instance-assigned public IP.

### Service topology (Phase 1)
- Nginx (80/443) → Gunicorn (unix socket) → Django
- Postgres on same host (local)
- Optional Redis not enabled yet

### Systemd units
- `heypage.socket` (unix socket: `/run/heypage/gunicorn.sock`)
- `heypage.service` (gunicorn serving `config.wsgi:application`)
- `heypage-backup-db.timer` / `heypage-backup-db.service` (daily pg_dump)
- `certbot.timer` enabled for automatic TLS renewal

### Standard filesystem layout
- `/srv/heypage/app` (git checkout)
- `/srv/heypage/venv` (python venv)
- `/srv/heypage/.env` (env vars; owned/readable by `heypage`)
- `/srv/heypage/staticfiles` (collectstatic target)
- `/srv/heypage/media` (uploads)
- `/srv/heypage/logs` (gunicorn logs)
- `/srv/heypage/backups/db` (compressed SQL dumps)

### Health check
- `/healthz/` returns JSON `{ "status": "ok" }` and is verified over HTTPS externally.
