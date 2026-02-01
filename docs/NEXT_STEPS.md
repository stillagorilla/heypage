# Next Steps

This file is an execution checklist for the transition from mockup mapping to a runnable Django implementation.

## Phase 1 (next chat): Environment + Django scaffold

### 1) Local dev environment
- [ ] Choose Python version (pin it).
- [ ] Create `requirements.txt` or `pyproject.toml` and pin dependencies.
- [ ] Create `.env.example` and standardize environment variables (SECRET_KEY, DB, EMAIL, etc.).
- [ ] Decide database for local dev (SQLite is fine for scaffold; Postgres recommended for search long-term).
- [ ] Create a standard `make` or `just` command list:
  - [ ] `make dev` (runserver)
  - [ ] `make migrate`
  - [ ] `make test`
  - [ ] `make lint`

### 2) Django project creation
- [ ] Create Django project (repo-root convention to be decided):
  - [ ] `config/` (settings, urls, wsgi, asgi)
  - [ ] `apps/` (Django apps)
- [ ] Add a custom User model now (before first migration).
- [ ] Configure static/media:
  - [ ] `static/` (compiled assets)
  - [ ] `static_src/` (optional source)
  - [ ] `media/` (uploads, dev only)
- [ ] Add base templates:
  - [ ] `templates/base.html`
  - [ ] `templates/partials/topnav.html`
  - [ ] `templates/partials/sidenav.html`
  - [ ] `templates/partials/entity_header/` (wrappers already documented)
- [ ] Add a minimal “coming soon” route and template for production placeholder.

### 3) URL routing (locked scheme)
- [ ] Implement routes in this order:
  - [ ] `/g/<slug>/` group pages
  - [ ] `/b/<slug>/` business pages
  - [ ] fixed routes: `/search/`, `/settings/`, `/login/`, `/register/`, `/reset-password/`, `/chat/`, etc.
  - [ ] `/<username>/` user catch-all (last)
- [ ] Implement reserved-words validation for usernames.

### 4) App structure (initial)
Create apps (names can be adjusted, but keep responsibilities clean):
- [ ] `accounts` (User, Profile, auth views, password reset wiring)
- [ ] `social` (friends, blocks, memberships)
- [ ] `entities` (Business, Group, awards)
- [ ] `content` (post-like content items, attachments)
- [ ] `comments` (comment threads)
- [ ] `reactions` (reactions on content and optionally comments)
- [ ] `moderation` (deletion proposals, votes, outcomes, suppression)
- [ ] `search` (SearchDocument index, suggest API, hard results)
- [ ] `chat` (DM conversations, messages)
- [ ] `notifications` (events, preferences, email digests)

### 5) First runnable milestone (M1)
- [ ] App boots locally with migrations.
- [ ] Login/register page renders from Django template.
- [ ] Settings page renders from Django template.
- [ ] Feed page renders with static stub data.
- [ ] Search page renders with stub data.
- [ ] Chat page renders with stub data.
- [ ] `collectstatic` works.

## Phase 2: Core models + migrations

### 1) Models (minimum viable)
- [ ] Accounts:
  - [ ] Custom User (username, email, display_name)
  - [ ] Profile (bio, location, social links)
  - [ ] BlockedContact
  - [ ] Privacy and notification settings models
- [ ] Entities:
  - [ ] Group, GroupMembership
  - [ ] Business, BusinessLocation
  - [ ] Awards
- [ ] Content:
  - [ ] ContentItem (post-like base)
  - [ ] Attachments (images first)
  - [ ] Comments (threaded)
  - [ ] Reactions
- [ ] Moderation:
  - [ ] DeletionProposal
  - [ ] DeletionVote
  - [ ] Outcome or suppression flag on ContentItem
  - [ ] Proposer auto-vote behavior
- [ ] Search:
  - [ ] SearchDocument
- [ ] Chat:
  - [ ] Conversation, Participants, Message

### 2) Permissions and audiences
- [ ] Implement content audience enum and enforcement hooks:
  - [ ] everyone, friends_of_friends, friends, private
- [ ] Implement block enforcement hooks (chat, viewing, interactions).

## Phase 3: Template integration (read-only first)

- [ ] Wire canonical includes:
  - [ ] composer
  - [ ] post-like card
  - [ ] comment thread
  - [ ] moderation vote panel
  - [ ] entity headers (user, group, business)
  - [ ] tiles (business_tile, group_tile, search result rows)
- [ ] Implement read-only routes:
  - [ ] feed
  - [ ] user profile and tabs
  - [ ] group page and tabs
  - [ ] business page and tabs
  - [ ] photos and albums pages

## Phase 4: Interactions (write paths)

- [ ] Auth completes end-to-end (register, login, logout, password reset).
- [ ] Create post and upload media.
- [ ] Propose deletion (modal), proposer auto-vote yes.
- [ ] Voting yes/no, show results in both Agree? and Voted. states.
- [ ] Resolve proposal into suppression and tombstone rendering.
- [ ] Create group and membership requests.
- [ ] Create business and locations.
- [ ] Create business reviews and job posts.
- [ ] Search suggest endpoint and hard results.

## Phase naming conventions
- Phase 0: Mockup Review + Architecture Blueprint (completed in this chat)
- Phase 1: Environment + Django Scaffold (next chat)
- Phase 2: Core Models + Routing
- Phase 3: Template Integration (read-only)
- Phase 4: Interactions + Moderation MVP
- Phase 5: Search/Notifications hardening + Chat MVP
- Phase 6: Deployment hardening + performance
