# UH Mānoa Geography and Environment

GEO contains pages, faculty biography fragments, department images, and a small local stylesheet. Shared source and all GEO JSON records live in the sibling css-shared repository.

## Start

Keep geo and css-shared beside each other. From geo, run:

```bash
npm ci
npm run clean
npm run build
npm run dev
```

Use `SITE_PATH_PREFIX=/geo/ npm run build` for the GitHub Pages project path. The default preview/build uses /. The existing workflow supplies /geo/ automatically.

## Where to edit

| Change | Location |
| --- | --- |
| GEO page content | geo/src/<page> |
| Faculty biography paragraphs | geo/src/includes/faculty/ |
| GEO photos and satellite hero images | geo/src/media/ |
| GEO contour background rule | geo/src/css/geo.css |
| GEO site, navigation, people, events, hero assignments | css-shared/src/data/units/geo/ |
| Shared header/footer and reusable displays | css-shared/src/includes/ |
| Shared CSS | css-shared/src/css/ |
| Unit/college/UH logos | css-shared/src/media/branding/logos/ |

shared.config.json selects the unit and authoritative shared repository. SHARED_SOURCE can override the local shared checkout location. npm run shared:check verifies the source and writes a receipt without copying shared files into src.

The privacy route remains a GEO page. Its common footer link and webmaster contact are configured in shared UH footer.json. The site-wide shared privacy-policy content can be reviewed separately; it was not generalized during a structure migration.

The existing deployment workflow still checks out shared source, installs locked dependencies, builds with /geo/, and publishes _site. Both repositories must be updated together for this migration; do not push just one and assume an older build can read the new source layout.
