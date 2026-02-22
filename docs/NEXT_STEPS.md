# Next Steps (Phase 2)

This file is the forward-looking work queue.
Anything completed should be moved into PROJECT_LEDGER.md with the “why”.

Last updated: 2026-02-22

---

## Completed (moved to ledger)
- #2: Friend header UI contract + actions parity (Add / Requested / Friends; CSRF-safe POSTs; next= redirects).
- #3: Read-time visibility rules implemented (Feed + Profile filtering for PUBLIC/FRIENDS/PRIVATE).
- #4: Enforce timeline posting policy at write-time in posts:create (wall posts).
- #5: Post management actions (author edit/delete; staff delete override; inline edit UX).
- #6: Propose Deletion redirect contract + cross-surface modal ownership + safe next= redirects.
- #7: Post card identity + navigation polish (author links to `/username/`, cross-surface safe).

---

## Remaining / upcoming

### Future (not scheduled yet)
- Eligibility gating for “Propose Deletion” (account age/reputation/etc.) - enforce server-side.
- Comments (real model + endpoints) - current UI is placeholder only.
- Moderation resolution/tombstones vs hard delete - staged decision.
