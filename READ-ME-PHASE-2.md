# GEO — Phase 2

Phase 2 turns the repeated styling and markup into reusable components, with university data separated from local unit details. The source still lives in this GEO project. Shared repository hosting/distribution comes next.

## Install this version

1. Stop the local development server and keep a backup of your current project.
2. Replace your project's entire `src` folder with the `src` folder from this archive. This is a COMPLETE source folder, including all existing media; it is not a partial folder like the Phase 1 patch.
3. Replace `eleventy.config.js` at the project root with the included version. Copy this readme and `working/SHARED-COMPONENTS.md` into the corresponding locations if you want the reference material.
4. Start your usual preview with `npm run dev`. Keep your existing package files, `node_modules`, Git configuration and hosting settings.

Preview the homepage, GIS Certificate, MA page, faculty directory/profile, Support GEO and footer. Try a phone-sized window too. This is a local review package; no production site or GitHub repository has been changed.

The guide is optional reference. You do not need to read it before looking at the website.

## What changed

| Shared part | What is now reusable |
| --- | --- |
| Shell | Header/footer templates read shared university data and local unit identity/navigation; long unit names wrap |
| Common style | Typography, palette, photo frames, callouts, text treatments, buttons, tiles and contour finish |
| Rows and grids | Small/medium/large left-media rows, three-column content, five-column programs |
| Dividers | Independent gray small/medium/large includes; white callout divider; matching blank spacers |
| Local data | Unit contacts/logo/search/resources, navigation/icons, advisors, faculty, optional Bluesky account |
| Profiles | Shared directory card, profile identity/contact block, sidebar and page layout with optional fields |
| Optional news | Shared feed include, retaining the current card appearance for a separate design review |

`geo.css` remains available for local overrides. Its previous generic rules now live in `common.css`, so no GEO-only overrides are currently necessary.

## Visible differences to review

- Shared button spacing, colors, edges and hover/focus states replace the separate donation, news and pale arrow-button treatments.
- Media rows and icon boxes use the shared sizes and finish; the formerly smaller plain pathway tile now has the contour treatment and standard small width.
- Explicit divider/spacer includes control separation, so some vertical spacing is intentionally more consistent.
- Existing faculty/Bluesky card designs, advisor photo mats and large handbook tiles remain for the next visual refinement discussion. Small/medium/large photo mats and a medium row option are ready to use.

The university links, language links, department contact details, local page content and link destinations are preserved. A previously nonexistent default hero path was corrected for future unassigned pages; assigned existing page heroes are unchanged.

## Validation

- Both `/geo/` and `/` builds produce 32 pages.
- Page text and link destination counts match Phase 1 on all 32 pages.
- All 32 pages checked at 1440, 820 and 390px: no horizontal overflow, missing local image requests or browser script errors.
- Separate component/unit fixtures checked all 12 supplied unit names, optional main-menu icons, missing advisor/resource/feed data, missing faculty fields, a seventeenth interpretation language, three row widths, three photo-mat sizes and button variants.
- All original media files retained byte-for-byte.

Browser checks use locally cached Bootstrap/fonts and a controlled Bluesky response. They verify our layout and rendering, not the availability of Google, YouTube or Bluesky. Live embeds still need an ordinary browser check in your preview.

## Next review

Open the local preview first. Tell me what looks wrong or what you want adjusted. After this visual review, we can move to the shared repository/distribution step and the component sandbox.
