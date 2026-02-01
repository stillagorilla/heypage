# Components and Includes

Goal: normalize inconsistent mockup terms ("tile", "card", "voting stuff") into a single component taxonomy
so we can convert static HTML into reusable Django includes.

## Naming standards

Use: `component_*` names for conceptual UI blocks, and `partials/` for Django includes.

Examples:
- component_post → `templates/partials/post/post_card.html`
- component_comment → `templates/partials/post/comment.html`
- component_composer ("make post") → `templates/partials/post/composer.html`
- component_moderation ("voting stuff") → `templates/partials/moderation/mod_controls.html`

## Highest-value reusable blocks (initial list)

Global layout:
- `base.html` (page frame)
- `partials/nav/top_nav.html`
- `partials/nav/left_nav.html`
- `partials/footer.html` (if present)

Feed + posts:
- Post composer ("make post")
- Post card ("Post")
- Post kebab menu + actions (edit / propose deletion / delete)
- Comment list
- Comment composer (text + image + emoji)
- Media grid (post photos)
- Reaction picker / reaction summary

Moderation:
- "voting stuff" block (placeholder name in mockups)
  - Must match the custom democratic moderation model (not upvote/downvote/report).

Profile pages:
- Profile header (avatar, name, stats, buttons)
- Profile tabs nav
- “About”/details blocks
- Friends list grid
- Photo grid
- Groups list
- Reviews list

## Implementation rule

Every time we find a repeated block in mockups:
1) Extract into `templates/partials/...`
2) Replace on templates via `{% include %}`
3) Record the include in this doc (so future refactors don’t re-split components).
