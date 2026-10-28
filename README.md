# GEO — UH Mānoa Department of Geography and Environment

Prototype v1 using Eleventy 3, Nunjucks includes, Bootstrap 5, and one root `geo.css` file.

## Run locally

```bash
npm install
npm run dev
```

The development server prints the local preview URL, usually `http://localhost:8080/`.

## Production build

```bash
npm run build
```

Generated static pages are written to `_site/` (ignored by Git).

## Important paths

- `geo.css`: all custom CSS, in repository root
- `_media/`: the three supplied image assets
- `src/_includes/components/`: UH bar, department name/search, nav, hero, footer, subfooter, card/sample content
- `src/_includes/layouts/base.njk`: shared document shell
- `src/_data/navigation.json`: navigation labels and destinations
- `src/_data/faculty.json`: single source for faculty directory **and** biographies
- `src/_data/students.json`: single source for graduate cohort directory
- `src/faculty/profile.njk`: generates `/faculty/<slug>.html` via Eleventy pagination
- `src/**/*.html`: ordinary HTML page content with front matter
- `working/PROJECT-SPEC.md`: complete project decisions
- `.github/workflows/deploy.yml`: GitHub Pages deployment

## Website editing

Edit any page's HTML content directly. Use `hero: /_media/your-image.webp` in its front matter to override the shared default. All heroes share the same height and styling from `geo.css`.

For faculty, edit the dataset only once: directory cards and generated profile pages use the same records. The present records are clearly labeled placeholders, not real faculty.

## GitHub Desktop workflow

At start: Fetch origin → Pull origin (if available). At finish: Save → Commit to main → Push origin. Clone this repository separately on home and university computers.

## Search and verification

Site search is **temporarily** configured as Google `site:`-restricted search for `geography.manoa.hawaii.edu`. Replace the form endpoint when the UH search service's site-restricted URL format is confirmed. No university search integration is claimed yet.

**Before a live migration:** copy the current Search Console HTML verification file to the published root and/or insert the verification meta tag in `base.njk`; add verified GA4 tracking; preserve critical old URL paths or implement redirects; review accessibility and university hosting approvals.

## Deployment

Under repository Settings → Pages, choose GitHub Actions. Push a commit to `main` after adding these files, and watch Actions for the build/deploy status. Public preview will ordinarily be `https://cssweb-stack.github.io/geo/`. The GitHub Actions build sets `SITE_PATH_PREFIX=/geo/`, allowing the GitHub Pages project URL to work. Local development uses `/` by default. When eventually deploying to the Geography subdomain root, remove the `SITE_PATH_PREFIX` environment variable from the workflow. Do not switch live DNS during prototype work.
