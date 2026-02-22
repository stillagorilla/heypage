# NEXT_STEPS.md
# Next Steps (Phase 2)

This file is the forward-looking work queue.
Anything completed should be moved into PROJECT_LEDGER.md with the “why”.

Last updated: 2026-02-22

---

## Completed (moved to ledger)
- #3: Read-time visibility rules implemented (Feed + Profile filtering for PUBLIC/FRIENDS/PRIVATE).
- #4: Enforce timeline posting policy at write-time in posts:create (wall posts).
- #5: Post management actions (author edit/delete; staff delete override; inline edit UX).
- #6: Propose Deletion redirect contract + cross-surface modal ownership + safe next= redirects.

---

## Remaining / upcoming

### #2 — Friend header UI contract + actions parity (verify end-to-end)
Goal:
- Public profile header shows correct state (Add / Requested / Friends).
- Accept/Decline remains in Friends tab UI (header stays simple).

Notes:
- Server-side computation exists in accounts:profile_view (`friend_state`, `friend_request_id`).
- Verify the header include consumes these correctly and POST endpoints are wired.

Likely files:
- templates/components/entity/entity_header.html
- apps/accounts/urls.py
- apps/accounts/views.py (profile_view wiring + friend state computation)
- apps/accounts/views_friends.py (friend endpoints)
- templates/entities/user/profile.html (header include wiring)

---

### #7 — (Staged) Post card identity + navigation polish
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
- Eligibility gating for “Propose Deletion” (account age/reputation/etc.) — enforce server-side.
- Comments (real model + endpoints) — current UI is placeholder only.
- Moderation resolution/tombstones vs hard delete — staged decision.
