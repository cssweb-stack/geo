GEO Courses and navigation update

1. Copy the src folder from this ZIP into your existing project, merging folders and replacing the matching files.
2. Run npm run build, or npm run dev to preview locally.

Included files:
src/_data/navigation.json
src/_data/heroes.json
src/about-geo/geo-courses.html
src/geo.css

Changes:
GEO Courses follows Areas of Study in About GEO.
Support GEO is now a main navigation item immediately before Contact.
The new page has an introduction, three image-and-text rows, and the existing course resources include.
The three levels are introductory, upper division, and graduate courses.
Rows use the Current Cohort top-divider spacing and the existing mobile stacking behavior.
The page reuses existing images and assigns the existing Kahului hero.

Support GEO is already located at src/support-geo/index.html in the supplied site, with the URL /support-geo/. No directory move or deletion is needed.
The new page uses /about-geo/geo-courses.html to match the existing About GEO directory and page URLs.

Validation:
Eleventy built all 31 pages using SITE_PATH_PREFIX=/geo/.
Checked navigation order and internal navigation destinations on every output page.
Checked the new page headings, three rows, images, hero assignment, resource links, and flush-left formatting.
