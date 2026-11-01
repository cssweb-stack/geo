# GEO shared-source connection

Shared source: `cssweb-stack/css-shared`, branch `main`. Local default: `../css-shared`. Change these in `shared.config.json` if the approved repository location changes.

- `npm run shared:adopt`: one-time migration inside the existing GEO Git repository; loads shared files, then untracks their generated mirrors without deleting them from disk.
- `npm run dev`: starts the preview and watches both local and shared source.
- `npm run build`: loads shared files before building.
- `npm run shared:sync`: refreshes only the generated shared mirrors.

Edit common/shell CSS, shared templates, icons, university data and branding in the shared repository. Edit unit pages/data, biographies, photography, hero settings and geo.css here. Existing `working/SHARED-COMPONENTS.md` describes the components; its Phase 2 statement that all authoritative source is inside GEO is superseded by this connection.

The build synchronizes shared source into ignored local mirror paths because Eleventy expects those files in the source tree. The mirror files are not a second maintained source. A missing shared repository stops the build. Changed shared files overwrite their managed mirrors; new filename collisions with local components stop the build for review.

The deployment workflow checks out the shared repository afresh. It runs on pushes to main, manual workflow runs and the hourly schedule at minute 23. Published pages serve their own built assets, so visitors do not depend on a separate shared-asset web server. The shared source remains authoritative at build time.

The workflow records the shared commit in its run summary. Scheduled runs may be delayed or disabled after prolonged inactivity on public repositories; see start-here.md for operational details. For now, no event-driven cross-repository credentials are required.

GEO's CSS filename and `/geo/` Pages prefix are preserved. When preparing a different unit, its local stylesheet name/passthrough mapping, local JSON data, navigation and Pages prefix must be configured for that unit.

The reviewed visual refinement list remains pending. This migration intentionally preserves Phase 2 output.
