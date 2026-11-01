GEO CSS SPLIT: PHASE 1

Use these files with the GEO project supplied in Archive(20261101-163011).zip.
This package contains only the files needed for the CSS split.

INSTALL
1. Keep a backup or commit of your current project.
2. ADD src/common.css and src/shell.css.
3. REPLACE src/geo.css.
4. REPLACE src/_includes/layouts/base.njk.
5. REPLACE eleventy.config.js in the project root, beside package.json.
6. In the VS Code terminal, run:

npm run clean
npm run dev

Check the local preview before committing and pushing.
Merge the supplied src folders into your existing src folder. Do not delete or
replace your entire src folder. Do not put eleventy.config.js inside src.

FILE RESPONSIBILITIES
common.css: fonts, shared variables, typography, content components and layouts.
shell.css: university branding, unit header/search, navigation, footer/subfooter.
geo.css: remaining GEO page-specific layouts and homepage presentation.

STYLESHEET ORDER
Bootstrap, common.css, shell.css, geo.css.
common.css supplies the fonts, colors and other variables used by shell.css.
The updated base.njk sets this order. Eleventy copies all three CSS files and
watches them for local preview changes.

SCOPE
This pass moves existing CSS without redesigning components. Existing class
names, legacy --geo-* variables, colors, spacing, borders and animations remain.
The homepage's existing inline CSS remains in its HTML for this pass.
All stylesheet paths remain local, so no shared repository or hosting setup is
required yet. Keep the existing _media folder; CSS background image paths still
resolve against the same directory as before.

NEXT PHASE
Generalize component names and variants; add explicit divider/spacer includes;
move unit settings into JSON. Apply the discussed design refinements separately.

AGREED SHARED COMPONENTS FOR PHASE 2
- Typography: H1-H6, tagline, intro, paragraphs, nested lists, strong weight.
- Palette: shared color variables with selectable color-family variants.
- Text: credits/accent treatment, muted notes, chevron action links.
- Dividers: small/medium/large gray lines and matching space-only includes;
  one white divider with standard spacing. Remove competing automatic borders.
- Media-and-text rows: small/medium/large left-column sizes with shared gaps
  and responsive stacking; optional divider includes between rows.
- Photo frames: shared border, background, corners and shadow; 3/6/9px mats.
- Icon/date/program tiles: shared border, corners, shadow and contours;
  selectable colors and icons, including the related-pathway tile.
- Three-column and five-column grids with shared gaps and responsive rules.
- One button family with palette colors, filled/outline and optional icon/arrow.
- Course resource strip: shared appearance, local labels and destination URLs.
- Advising: shared layout and optional local advisor records.
- Faculty directory cards, profile sidebars and full profile-page layout;
  optional fields disappear without empty rows. Data and biographies stay local.
- Optional Bluesky feed: reusable script/styles with a local account setting.
- Mini callout: selectable icon/color, short message and optional link.
- Shared assets: university and unit logos, four UH patterns, icons, contours;
  shared font delivery to be decided when central hosting is connected.
- Custom spacing scale in multiples of three; tune exact sizes in preview.

SEPARATE DESIGN REVIEW
Faculty and Bluesky card appearance; medium handbook tile; compact advisor
photo mats; stronger homepage smiley; deliberate divider/spacing adjustments.
These changes are not included in the Phase 1 files.

VALIDATION
- Original and split sites both build 32 HTML pages.
- Split site builds at both /geo/ and / path prefixes, copying all three CSS files.
- Every original CSS node occurs exactly once in the actual split stylesheets.
- All 32 generated pages are identical except the two added stylesheet links.
- All 32 pages match in Chromium at 1440px, 820px and 390px widths, comparing
  computed CSS and element geometry against the original.
- Desktop dropdown/search focus and tablet/phone menu, submenu, search and
  university-menu states match.
- Full-page screenshots checked for home, MA and faculty profile at all three
  widths: eight pairs are byte-for-byte identical. The phone homepage has six
  slightly different edge pixels out of 2,717,520, with identical computed CSS
  and geometry; no layout or style change was detected.
- No JavaScript page errors in the comparison runs.

Browser comparisons used locally cached Bootstrap 5.3.3 and Inter resources.
Third-party embeds were blocked, and Bluesky used a fixed sample feed so both
versions could be compared with identical content. Live external-service
behavior was not part of this CSS-only comparison.
