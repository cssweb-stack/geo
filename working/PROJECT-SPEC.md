# GEO Website — Approved decisions / working specification

Status: Version 1 approved for prototype. Not approved to replace live WordPress website.

## Stack and workflow

Bootstrap 5, Eleventy 3, Nunjucks for reusable layouts/includes, HTML content files, one `geo.css` in project root, GitHub account `cssweb-stack` repository `geo`, GitHub Actions and GitHub Pages for prototype publishing. Home and university computers run VS Code and GitHub Desktop. Fetch/pull before editing, commit/push after editing.

## Page structure (full-width outer, Bootstrap `.container` inner)

1. Sticky UH Brand Nav: green `#024731`; placeholder `<p>UH Brand and Nav</p>` centered white. Real university branding and search to be negotiated later.
2. Sticky Unit Name: light gray `#f7f7f7`, department name `Department of Geography and Environment`; desktop site-scoped search field at right; mobile search icon left of hamburger, expandable search input.
3. Sticky Unit Nav: light gray, 1px solid `#d2d2d2` bottom border. Desktop hover dropdowns where parent labels are not links and use arrow/default cursor; keyboard and mobile toggle support; full menu remains in own include; mobile hamburger button lives in Unit Name include.
4. Hero: one shared include, page-specific front matter image with fallback `/_media/dev/hero.webp`, background cover/center, desktop 250px, tablet 187.5px, and phone 90px. The SVG pattern remains at 60% of hero height and scales with it.
5. Main: single Bootstrap contained column; H1 driven by page title; four placeholder paragraphs; four image cards after first paragraph; image `/_media/dev/place.webp`; responsive 4 desktop, 2 tablet, 1 mobile; placeholders nonclickable, later individual cards may link.
6. Footer: UH green background and `/_media/branding/footer-watermark-desktop.png` right-aligned, repeated vertically. Four columns on desktop; centered 2×2 tablet layout with columns around 33% of available width; one centered phone column around 66% width.
7. Subfooter: `#2d2d2d`, one centered white paragraph containing UH equality statement, usage policy and 2026 copyright links as supplied.

## Fonts and colors

Inter variable font all weights/styles during development, Bootstrap's default body/heading sizes and spacing, accessible focus outlines. CSS variables: `--uh-green:#024731`, `--text:#222222`, `--light:#ffffff`, `--light-gray:#f7f7f7`, `--dark-gray:#2d2d2d`, `--border-gray:#d2d2d2`. The `--light` variable controls main background and may later change to off-white.

## Navigation

- Home: direct link
- About GEO: dropdown trigger; Why Study GEO, Areas of Study, Public Lectures, News
- Undergraduate: dropdown trigger; GIS Certificate, Minor, Major (BA), GEO BAM, SUST/GEO BAM
- Graduate: dropdown trigger; Master (MA), Doctorate (PhD), Recipients, Current Cohort, Funding
- Faculty: direct link to directory
- Give a Gift: direct link
- Contact: direct link

The three dropdown headings have no landing pages. Desktop dropdown opens on hover, but must remain keyboard and mobile accessible. Dropdown pages live under their section paths as `.html` URLs. About 18 navigable destinations (3 direct destination sections plus home and 14 submenu pages = 18).

## Faculty and graduate student directories

Faculty directory `/faculty/` and profile sidebars share `src/_data/faculty.json` for names, separate academic and administrative titles, contact details, photos, research keywords, optional personal links, and optional publication-platform links. Profiles are generated automatically as `/faculty/<slug>.html` using Eleventy pagination. Their long-form right-column content is maintained as plain HTML in `src/_includes/faculty/<slug>.html`, never inside JSON. Awards are optional text sections in that HTML, beneath Courses; no award badge is used. Empty optional fields produce no blank lines or sections. The directory photo and name share one link. The ten current core faculty were migrated from the department's current directory on October 28, 2026; source conflicts are recorded in `working/FACULTY-EDITING.md`. Graduate cohort `/graduate/current-cohort.html` uses a query loop / Nunjucks iteration without individual student pages; advisors link to the corresponding faculty biography if provided.

## Not yet decided / out of scope

- Home page may eventually use a large slideshow instead of standard 250px hero; for Version 1 use standard page.
- Department remarketing, message, calls to action and final content remain pending chair input.
- Exact UH search service endpoint needs verification; Version 1 Google site-restricted search is temporary.
- Real university top bar and required footer content will be supplied later.
- Exact GA4 insertion, Search Console verification token, URL migration/redirects and production DNS changes happen only with proper approval.
- Design of faculty and student cards and actual real data will be refined incrementally.

## Assets supplied

`/_media/dev/hero.webp`, `/_media/dev/place.webp`, `/_media/branding/footer-watermark-desktop.png`. Preserve filenames.

## Quality requirements

Semantic HTML; responsive Bootstrap; keyboard and touch operability; WCAG 2.1 AA target; no unnecessary extra frameworks; minimal JavaScript; generate and check output with `npm run build`; no deployment to university domain before review/approval.

## Responsive layout update — October 29, 2026

- Phone: below 576px. Tablet: 576px through 1199.98px. Desktop: 1200px and above for shared header/footer. Individual content grids retain their existing Bootstrap breakpoints.
- Keep the full department name on every device; phone unit name is 1rem.
- Both header menu icons and department search icon are 22.5px on phone/tablet, inside 44px buttons.
- Header bars use 1rem padding on all four sides on phone/tablet.
- Main content padding is 2rem equally on phones, 2.25rem equally on tablets; desktop keeps its existing spacing.
- Subfooter text is centered at 50% of available width on tablet/desktop and full available width on phones.
- Bootstrap owns grid and interactive navigation behavior. geo.css owns shared component spacing, responsive sizing, footer layout, and custom page styling. The hero inline background image comes from page front matter.
- HTML, Nunjucks includes, and CSS use flush-left source formatting with compact blank lines. Preserve YAML and other whitespace-sensitive syntax.
