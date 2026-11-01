# Shared components — Phase 2

This is a reference, not homework. Use it when adding or adjusting a component.

## Where things live

| File | Controls |
| --- | --- |
| `src/shell.css` | University bar, unit bar, navigation, footer, interpretation services, subfooter, responsive shell |
| `src/common.css` | Typography, palette, dividers, spacing, rows, grids, callouts, tiles, frames, buttons, profile and optional news components |
| `src/geo.css` | Future GEO-only exceptions; currently no overrides are needed |
| `src/_data/university.json` | University logo and navigation, shared footer links, interpretation languages, legal links/year |
| `src/_data/site.json` | Unit name, acronym, logo, contacts, search domain, course resources, optional Bluesky account |
| `src/_data/navigation.json` | Unit navigation labels, URLs, submenu structure and icon names |
| `src/_data/advising.json` | Unit advisor records |
| `src/_data/faculty.json` | Unit faculty directory/profile identity and contact records |
| `src/_includes/components/` | Reusable markup and macros |
| `src/_includes/layouts/faculty-profile.njk` | Shared faculty profile page layout |
| `src/_includes/faculty/` | Local faculty biography content |
| `src/_data/heroes.json`, `faculty_heroes.json` | Local hero assignments and treatments |

Everything still ships inside the GEO project. This phase prepares reuse; it does not yet host shared files remotely or update other sites automatically. That distribution mechanism is Phase 3.

## Dividers and empty space

Insert a standalone include exactly where the line should go:

```njk
{% include "components/divider-small.njk" %}
{% include "components/divider-medium.njk" %}
{% include "components/divider-large.njk" %}
```

Choose one. Each uses the same gray and thickness; space on each side is 12, 24 or 36px. Adjust `--separator-small`, `--separator-medium`, `--separator-large`, `--divider-color` and `--divider-thickness` in `common.css`.

For blank space without a line, use `space-small.njk`, `space-medium.njk` or `space-large.njk`. These occupy the corresponding total gap: 24, 48 or 72px.

Inside a colored callout, insert the single white-divider style:

```njk
{% include "components/divider-white.njk" %}
```

Rows and callouts do not create their own separator lines. The includes do. Avoid placing two dividers directly beside each other.

## Left media / right text

Use one layout with a small, medium or large media column. These are currently 112, 162 and 212px; the common gap is 24px. They stack on phones. Both photos and tiles can use any of the three sizes.

```html
<div class="media-row media-row-medium">
<img class="media-visual photo-frame photo-frame-medium" src="{{ '/_media/example.webp' | url }}" alt="Describe the image">
<div class="media-content">
<h2>Section heading</h2>
<p>Local content.</p>
</div>
</div>
```

Adjust `--media-width-small`, `--media-width-medium`, `--media-width-large`, and `--media-gap` centrally. Widths control the column; photo mat sizes control padding independently.

A macro is also available:

```njk
{% from "components/layouts.njk" import mediaRow %}
{% call mediaRow("medium") %}
<div class="media-visual icon-tile tile tile-blue" aria-hidden="true">{% include "icons/book.svg" %}</div>
<div class="media-content"><h2>Heading</h2><p>Local content.</p></div>
{% endcall %}
```

Existing handbook blocks retain their large size for this review. The new medium option is ready when we want to resize them.

## Three- and five-column grids

```html
<div class="grid-three">
<section>First item</section>
<section>Second item</section>
<section>Third item</section>
</div>
```

Use `grid-five` for five items. Shared controls are `--grid-column-gap`, `--grid-row-gap`, and `--grid-five-gap`. Three-column grids stack below 992px; five-column grids show three then two centered items on tablets, then one column on phones.

## Palette, callouts and tiles

Color families are green, teal, blue, purple, bronze, brown, gold and pink; black is also available for tiles. Their exact shades live in `--color-*` variables. Pale callout/button surfaces use `--surface-*`. An adjustment within a color family changes the token; a new family gets its own token and modifier.

```html
<section class="callout callout-gold">
<h2>Local heading</h2>
<p>Local content.</p>
</section>
```

Callout variants: `green`, `blue`, `gold`, `bronze`, `purple`, `brown`, `pink`. Their padding, edge width and corners use `--callout-padding`, `--callout-border-width` and `--callout-radius`.

For a small icon box:

```njk
<div class="media-visual icon-tile tile tile-purple" aria-hidden="true">
{% include "icons/layers.svg" %}
</div>
```

All tiles share `--frame-border`, `--frame-radius`, `--frame-shadow`, and the `--tile-pattern-*` contour controls. Small icon/date tiles use `--tile-compact-pattern-opacity`. Content-specific classes such as `degree-tile`, `date-tile`, and `program-tile` arrange their content; color comes from `tile-blue`, `tile-teal`, etc. Use one color modifier per tile. Light gold tiles use dark text.

## Photo frames

`photo-frame` provides the white background, border and shadow. Add `photo-frame-small`, `photo-frame-medium` or `photo-frame-large` for 3, 6 or 9px of mat. The image size and mat size are separate choices. Existing photos retain their previous large mat; advisor frames can be switched to small during the visual refinement pass.

## Buttons

One family supplies consistent type, padding, corners and interaction states. Choose color and treatment independently:

```njk
{% from "components/button.njk" import button %}
{{ button("Give to the fund", "/support-geo/", "blue") }}
{{ button("Read the handbook", "/graduate/master-ma.html", "purple", "book", true, "soft") }}
{{ button("Course descriptions", "/about-geo/geo-courses.html", "green", "", false, "outline") }}
```

Arguments: label, URL, color, optional icon, optional right arrow, treatment. Treatments are `filled` (default), `outline`, and `soft`. Colors are green, blue, purple, teal, bronze, brown and pink. Hover and keyboard-focus states belong to the same family. Use a link for navigation and a `<button>` for an action; the same CSS classes work on both.

Direct HTML is also fine:

```html
<a class="button button-purple button-soft button-arrow" href="{{ '/undergraduate/geo-bam.html' | url }}"><span>Explore the pathway</span><span aria-hidden="true">→</span></a>
```

The filled donation/news links and pale arrow links now use this family. Program squares remain tiles. Search/menu controls belong to the shell.

## Text and chevron links

Use the shared opening block: `<header class="page-header">`, an H1, optional `<p class="intro-highlight">` tagline, then `<p class="page-intro">` introduction. Pages supplying this block set `hidePageTitle: true` to avoid a second H1.

`--font-weight-strong` controls `<strong>` and `<b>`. `--tagline-color` controls taglines. Heading size/leading tokens retain the existing responsive scale. Body lists, nested lists and paragraph styles are shared.

`text-accent` (also `credits`) is the orange text treatment; `text-note` is the smaller muted note. Adjust `--accent-color` and `--note-color` centrally.

```html
<a class="action-link" href="https://example.org/application"><span class="action-link-text">Application</span></a>
<span class="text-note">(UH login required)</span>
```

The chevron comes from shared CSS, with its spacing controlled in `.action-link`. It is not typed into each link.

## Mini callouts

```njk
{% from "components/mini-callout.njk" import miniCallout %}
{% call miniCallout("emoji-smile", "gold") %}
<p>Your message and <a href="https://example.org/">link</a>.</p>
{% endcall %}
```

Available mini-callout colors: gold, blue, teal and purple.

## Data-driven components

Footer and header includes read shared university data and local unit data. Add a language once to `university.languages`; all pages receive it at the next build. Unit name wrapping supports long names, and navigation accepts optional `icon` values on both main and submenu items. Icon names match files in `_includes/icons` without the `.svg` extension.

`course-resources.njk` reads `site.courseResources`; the first button is filled, subsequent buttons outlined. The local acronym prefixes labels automatically. Empty arrays hide the block. `undergraduate-advisors.njk` reads `advising.people`; photo, title, profile link and email are optional.

The faculty directory and faculty page sidebar share `profile-identity.njk` and `profile-contact.njk`. Name and slug identify a record. Photo, title, administrative role, office, email, phone, keywords, websites and publication services are optional; absent fields create no empty rows or publication block. Biography content remains local. Faculty card redesign is still a separate visual review; optional surface controls are `--profile-card-background`, `--profile-card-border`, `--profile-card-padding` and `--profile-card-shadow`.

`bluesky-feed.njk` is an optional component. `site.bluesky` sets enabled, actor, limit, URL and label. The feed renderer remains in `assets/bluesky-feed.js`. Card appearance has been retained for the planned visual redesign.

Shared logo, pattern and font files have not been moved to a remote repository in this phase. Hero imagery, unit biography content and site-specific data remain local.
