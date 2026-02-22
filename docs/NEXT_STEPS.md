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
- #7: Post card identity + navigation polish (author avatar + name link to /<username>/).

---

## Remaining / upcoming

### #8 — Comments (real model + endpoints)
Goal:
- Replace placeholder “Leave a comment” UI with a real DB-backed comment model + create endpoint.
- Render comments under posts (read path) and allow authenticated users to add a comment (write path).
- Keep cross-surface: feed + profile must behave the same; do not assume /feed/.

Notes:
- Preserve existing cross-surface redirect contract pattern using `next=` (safe local redirects).
- Keep template changes conservative (avoid global JS; prefer tiny, local-only JS if needed).
- v1 can be “create-only” (no edit/delete yet) unless already required elsewhere.

Likely files:
- apps/comments/models.py (new)
- apps/comments/views.py (new)
- apps/comments/urls.py (new)
- config/urls.py (or root urls.py) to include comments routes
- templates/components/post_card.html (wire form action + display list)
- templates/layouts/2col_shell.html and templates/layouts/entity_shell.html (only if any shared modals are introduced)

---

### Future (not scheduled yet)
- Eligibility gating for “Propose Deletion” (account age/reputation/etc.) - enforce server-side.
- Moderation resolution/tombstones vs hard delete - staged decision.
