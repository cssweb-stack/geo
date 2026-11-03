# GEO website instructions

Before editing GEO, read and follow `../css-shared/AGENTS.md`. It contains the
permanent college HTML/CSS standards, verification requirements, and Git reporting
workflow. Those standards apply to every GEO page and future cleanup task.

- Use `src/undergraduate/gis-certificate.html` as the reference implementation.
  Prefer semantic headings, paragraphs, and lists; `.tagline`, `.intro`, the
  approved shared callout/note/link treatments, and universal `.media-row` grids.
- Keep GEO content, local data, and route decisions here. Shared content/component
  styles belong in `../css-shared/src/common.css`, never GEO-specific overrides.
- Files listed in `.shared-state.json` are generated shared assets. Change their
  authoritative source, then run `npm run shared:sync` and `npm run build` here.
  Do not transform CSS during synchronization or hand-edit generated copies.
- For class removals, check all consumers before deleting shared CSS. Keep live
  compatibility selectors only until the remaining consumers are migrated.
- For the next whole-site pass, follow the reference page's plain header and
  classless grid right column. Preserve compact row typography through shared
  structural selectors, rather than recreating removed presentation classes.
  Retain necessary action-link label spans and accessibility relationships.
- Preserve content, actual accessibility/anchor/script dependencies, image
  behavior, and responsive layout. All text must have line-height at least 1.5.
- Check generated HTML plus desktop/mobile computed styles. Do not commit or push.
  Check all five repository statuses and end with the shared-first numbered
  `Commit → Push origin:` report required by the college instructions.
