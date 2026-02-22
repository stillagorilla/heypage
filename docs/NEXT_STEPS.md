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

---

## Remaining / upcoming

### #7 - (Staged) Post card identity + navigation polish
Goal:
- The post card should link to the author profile (/username/) instead of `href="#"`.
- Ensure this stays cross-surface and does not assume /feed/.

Notes:
- This is pure template polish but touches a shared component; keep it conservative.
- Preserve the “single-line include-with tags inside loops” rule.

Likely files:
- templates/components/post_card.html
- templates/entities/user/profile.html (if it supplies extra context)
- templates/feed/feed.html (no duplication; shells own modals)

---

### Future (not scheduled yet)
- Eligibility gating for “Propose Deletion” (account age/reputation/etc.) - enforce server-side.
- Comments (real model + endpoints) - current UI is placeholder only.
- Moderation resolution/tombstones vs hard delete - staged decision.
