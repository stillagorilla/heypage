# Documentation Map (Anti-Rediscovery Contract)

This file exists to prevent the “rediscovery loop”.

**Rule:** each category of guidance must have **one** home doc. Other docs may *link* to it, but should not duplicate the guidance.

Last reviewed: 2026-02-16

## Where to find what

### 1) Paths, canonical locations, and layout contracts
**Authoritative doc:** `CANONICAL_PATHS.md`

Includes:
- canonical filesystem paths on the VM and in the repo
- canonical template include locations (`templates/includes/`)
- canonical static source root (`static/`)
- canonical production `STATIC_ROOT` + nginx mapping contract
- any “this file wins” decisions

### 2) Production operations, “how to run it”
**Authoritative doc:** `OPERATIONS.md`

Includes:
- production host layout (`hp-prd-web01`)
- runtime user and permissions (especially for `collectstatic`)
- environment variables and where they live (`/srv/heypage/.env`)
- standard command patterns (using `bin/dj`)
- service topology and troubleshooting

### 3) Architecture decisions and locked product constraints
**Authoritative doc:** `ARCHITECTURE_SNAPSHOT.md`

Includes:
- the locked public URL scheme (`/<username>/`, `/g/<slug>/`, `/b/<slug>/`)
- reserved words policy and routing order constraints
- app boundaries and major components (moderation, search, etc.)
- “locked” moderation states and UI contracts

### 4) UI building blocks (components, template fragments)
**Authoritative doc:** `COMPONENTS_AND_INCLUDES.md`

Includes:
- the component inventory (post card, composer, entity header, etc.)
- where components live in templates
- naming and include conventions

### 5) Product surfaces (pages, contexts, navigation)
**Authoritative doc:** `PAGES_AND_CONTEXTS.md`

Includes:
- the page list, their contexts (anon vs authed), and which template renders what
- high-level routing behaviors (detailed URL scheme remains in Architecture Snapshot)

### 6) User journeys
**Authoritative docs:** `USER_FLOWS.md` (primary), `FEATURES.md` (secondary)

Includes:
- end-to-end flows (“register → land on feed”, “propose deletion → vote resolves”, etc.)
- feature inventory by area

### 7) Data model thinking
**Authoritative doc:** `DATA_MODEL_NOTES.md`

Includes:
- models and relationships
- “what gets stored” for moderation, posts, entities, etc.
- notes about migrations and future indexing

### 8) Project history and decision ledger
**Authoritative doc:** `PROJECT_LEDGER.md`

Includes:
- what was changed
- why it was changed
- dates and commits when possible
- operational incidents and their fixes

**Rule:** if it was discovered the hard way, it gets recorded here.

### 9) Current plan of action
**Authoritative doc:** `NEXT_STEPS.md`

Includes:
- only *forward-looking* tasks (the shortest viable list)
- current focus and sequencing
- “definition of done” for the next phase

### 10) Unresolved items
**Authoritative doc:** `OPEN_QUESTIONS.md`

Includes:
- only items that are actually unresolved
- each question should have: owner (if any), decision deadline (if any), and why it blocks work

## What not to do

- Don’t record operational procedures in multiple docs. Link to `OPERATIONS.md`.
- Don’t record canonical paths in multiple docs. Link to `CANONICAL_PATHS.md`.
- Don’t keep resolved questions in `OPEN_QUESTIONS.md`. Move the resolution into `PROJECT_LEDGER.md`.

