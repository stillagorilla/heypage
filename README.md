# Heypage

Static HTML mockups + project documentation for building **Heypage**, a Facebook-like social platform with key distinguishing features (including community-driven moderation/voting).

This repository is the source of truth for scope, page inventory, reusable UI blocks, and the Django implementation plan.

---

## What’s in this repo

- `mockups-original/`
  The static HTML mockups (source material).

- `docs/`
  The continuity documentation. This folder is the authoritative "memory" for the project and must be updated whenever decisions are made or progress is completed.
  - `PROJECT_LEDGER.md` — progress, decisions, milestone tracking
  - `FEATURES.md` — feature inventory (MVP → later phases)
  - `USER_FLOWS.md` — user journeys (register → post → comment → moderation → etc.)
  - `PAGES_AND_CONTEXTS.md` — which mockups consolidate into which Django templates
  - `COMPONENTS_AND_INCLUDES.md` — reusable UI components/includes taxonomy
  - `DATA_MODEL_NOTES.md` — working data model draft
  - `OPEN_QUESTIONS.md` — decisions needed early

---

## Project goals

### Primary goal
Build a **fully functional** version of these mockups in **Django**, optimized for:
- performance
- scalability
- ease of maintenance

### Key engineering goals
- Consolidate “context depiction” pages into the fewest dynamic templates possible.
- Identify and maximize reusable content blocks (cards/tiles/panels/modals/etc.) as Django template includes.
- Treat header/footer/nav and common layout structures the same way (includes + base templates).

### Reusable search and member list components
Search results and group member lists will be implemented as reusable partials so the same "result row" patterns can be used across search, invites, and member directories.

---

## Context depictions to consolidate

The following pairs depict the **same page** in two contexts (owner vs public) and should become **one** Django template driven by context/permissions:

- `user-profile.html` and `my-profile.html`
- `my-groups.html` and `user-profile-groups.html`
- `my-photos.html` and `user-profile-photos.html`
- `my-friends.html` and `user-profile-friends.html`
- `my-reviews.html` and `user-profile-reviews.html`
- `my-business.html` and `user-profile-business.html`

Rule of thumb:
- “my-*” = owner context (editable controls, private data)
- “user-profile-*” = public/other-user context (follow/friend controls, limited/private data hidden)

---

## Business lists (owner vs public)

- Owner context uses a tabbed Businesses page with:
  - Businesses directory
  - My Businesses (managed businesses)
  - Create Business CTA
- Public context shows a Businesses list only.

Both reuse the same business tile/list row component.

---

## Groups and friends

- Friends are managed via a tabbed Friends page (Friends list + Friend Requests with accept/decline).
- Groups are managed via a tabbed My Groups page (My Groups + Group Administration) with a Create Group modal.

These screens define relationship and membership rules that will be encoded in the Django data model and permission system.

---

## Naming cleanup for reusable blocks

Mockups may refer to reusable blocks inconsistently (e.g., "tile", "card", or unnamed blocks like "voting stuff").
Implementation will normalize these into a consistent Django partial taxonomy under `templates/partials/`, for example:

- `templates/partials/post/post_card.html`
- `templates/partials/post/post_composer.html`
- `templates/partials/post/comment_thread.html`
- `templates/partials/moderation/deletion_vote_panel.html`
- `templates/partials/entity/entity_header.html` (user/group/business)
- `templates/partials/reviews/review_card.html`
- `templates/partials/reviews/review_composer.html`
- `templates/partials/modals/*.html`

---

## Development approach (high level)

1) Thoroughly review mockups to extract:
   - page map (routes + contexts)
   - component inventory (reusable blocks)
   - required data model + permissions rules

2) Recommend stack (Django-first; API + realtime as needed).

3) Implement Django project in phases:
   - base templates/includes
   - authentication + profiles
   - feed + posts/comments/media
   - moderation/voting MVP
   - chat/notifications (as needed)

### Global search UX
The top navigation includes a live search dropdown for Users / Groups / Businesses, plus a "View All" path to a hard search results page with the same entity categories.

### JS
assets/js/app.js is primarily interaction demo code; production behavior will be implemented in Django/HTMX/Channels as needed.

---

## Content types reuse

Posts, reviews, and business job posts share a common post-card pattern (header, kebab actions, body/media, reactions/share, comment composer, moderation entrypoint).
Reviews add a star rating control (composer) and star rating display (card).

---

## Mockup artifacts & corrections

Some HTML mockups intentionally include labeling/wiring artifacts that should NOT be reproduced in Django:

- **Business page modals**
  - The business details modal currently labeled `bioModal` is intended to be **"Edit Business"** (not "Edit Bio").
  - The "Other Social Profiles" pencil on the Business About card must open the shared **Edit Social Profiles** modal (`socialModal`) used on the User profile.
  - `editBusinessModal` footer button label "Create" is a mock artifact and should be "Save".

---

## Reviews implementation note

Reviews are implemented as a specialized post-like content type.
In the mockups, review cards include the same structure and interactions as post cards (reactions, share, comments, and moderation actions), plus:
- a star rating display
- an embedded business preview block

Implementation will reuse the post card partial and inject review-specific subcomponents.

---

## Privacy and chat

- The Settings page defines privacy controls for posts, friend requests, timeline posting, and friend list visibility, plus notification toggles and blocked contacts management.
- Chat is a two-pane conversation UI with mute and block actions and an input composer for messages (and potential image/emoji attachments).

---

## Auth pages

The mockups include:
- a combined login and registration page with username-based registration and optional social login buttons
- a reset password page that sends a reset link to an email address

---

## Interaction demos

The mockups include an interaction demo script at `mockups-original/assets/js/app.js`. It demonstrates intended UI behaviors for early implementation, including:
- topnav live search dropdown show/hide on focus/blur
- side nav toggle
- reaction/share popovers
- reply toggles
- vote panel expansion
- toast confirmations for Join Group and Add to Friends

This file is not production JavaScript. It is a reference for intended UX.

---

## How to contribute changes (quick reminders)

Edits made in github.dev only appear on GitHub after:
1) Commit
2) Push / Sync Changes

If you renamed a directory in github.dev but don’t see it on github.com:
- verify you committed & pushed to `main`
- verify you’re viewing the correct branch on github.com

---

## Important implementation gotcha (save future debugging time)

When converting the mockups into Django template includes, avoid duplicate DOM IDs (especially modals).
Multiple pages/components use Bootstrap modals (e.g., post composer image upload, photos upload, new album, propose deletion).
If an include hardcodes `id="uploadModal"` (etc.) and gets rendered more than once, JS/modal behavior will break.

Recommendation:
- any include that defines a modal should accept a `modal_id` parameter (and related input IDs)
- prefer event delegation + `data-*` attributes over ID-based JS hooks

---

## Continuity rule

This repo is designed to support long gaps in activity without losing context.

When a decision is made or progress is completed:
1) Update the relevant file(s) in `docs/` in the same commit, and
2) Keep `docs/` consistent with the current repository state.

## Email templates

The repo includes an HTML email template under `mockups-original/emails/index.html` that demonstrates the branded header, greeting, notification lines, CTA button, and legal footer (unsubscribe + notification settings links).

## Email assets

The email mock template references a header logo at `images/image-1.png`. In production, email images should use an absolute URL or be embedded as a CID attachment for reliable rendering across email clients.

## Front-end JS in mockups (what it is and how we will use it)

The mockups include JavaScript under `assets/js/` that primarily demonstrates UI interactions (dropdowns, replies, voting demos, toasts, etc.). It is not production-ready logic.

During the Django build, we will:
- treat mockup JS as a behavior reference only,
- re-implement the chosen behaviors cleanly in Django templates + a small, modular JS layer,
- avoid duplicated IDs found in mockups (example: multiple `id="liveToastBtn"` buttons on the same page),
- replace `includeHTML.js` and client-side includes with Django template includes.

If you add or change mockup JS behavior, capture the decision in `docs/COMPONENTS_AND_INCLUDES.md` and any unresolved questions in `docs/OPEN_QUESTIONS.md`.

## Search

The top navigation includes a live search dropdown (Users / Groups / Businesses) with a "View All" button that routes to the hard search results page.
The hard results page is tabbed (Users / Groups / Business) and the Business tab includes an "Add Business" CTA linking to the create business flow.

## Navigation

- Side navigation provides primary logged-in routes (Feed, My Profile, Friends, Photos, Reviews, Groups, Businesses).
- Notifications are accessed via the bell dropdown in the top navigation (no dedicated /notifications/ page).

## Entity header reuse

User/group/business pages share a common "entity header" pattern (cover, avatar, name/badges, actions, tabs). Owner vs public views are implemented as variants of the same base partial to minimize duplication and keep navigation consistent.
