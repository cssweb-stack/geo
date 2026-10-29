# Department News

## How it works

The page is `src/about-geo/department-news.html`; its public URL is `/about-geo/department-news.html`. The menu label and H1 are Department News.

`src/assets/bluesky-feed.js` is stored and served with this website. It requests the department's public posts directly from Bluesky when a visitor opens the news page. New Bluesky posts appear on the next page visit or reload without rebuilding the site. Changes to the website code still need the normal build and publish workflow.

The script is an original integration for this site. It includes no third-party widget, SDK, framework, or icon font library. No widget credit or subscription is needed. Bluesky supplies the public data and media; external story links still belong to their respective publishers. Reposts identify the original author and the account that reposted them.

## Controls

| Change | Edit |
| --- | --- |
| Page title, intro, or hero | Front matter and HTML in `src/about-geo/department-news.html` |
| Menu label | The existing news entry in `src/_data/navigation.json` |
| Bluesky account | `data-bluesky-actor` on the news section; update the static button/noscript links too |
| Number of posts | `data-bluesky-limit="9"` on the news section |
| Card layout, typography, and images | The `Department news — locally hosted Bluesky feed` section of `src/geo.css` |
| Retrieval and rendering behavior | `src/assets/bluesky-feed.js` |

The grid uses three columns at 992px and above, two from 576px, and one below 576px. Full post text is preserved. Source image descriptions are retained when supplied. Images are contained rather than cropped; the single-image height limit is 20rem. Clicking a post image opens the original post, where the full image can be viewed.

The centered bottom button uses the same inline Bootstrap Bluesky SVG as the footer, with no additional icon download. Its blue, hover, and focus styles are in `.news-bluesky-button`.

## Feed behavior

- Shows the latest nine public posts and reposts; conversational replies are excluded.
- Keeps link previews, image posts, quoted post text, and links/mentions/hashtags supplied by Bluesky.
- Video posts link to playback on Bluesky; no video player library or autoplay is loaded here.
- Dates use Hawaiʻi time.
- Retrieves data without a password, token, login, or cookies sent by the fetch request.
- If the feed fails or takes longer than 12 seconds, displays a message and retry button. The department's Bluesky links remain available.
- Without JavaScript, visitors receive a useful link to the department's Bluesky account.
- Uses text nodes for external post content rather than interpreting it as HTML. Rich-text link offsets are decoded as UTF-8 so Hawaiian text and emoji do not shift the links.

The page remains dependent on Bluesky's public API and media service. If Bluesky changes that API, this local script may need an update. It is a live feed, not a permanent archive of department news.

## References

- Public author feed: https://docs.bsky.app/docs/api/app-bsky-feed-get-author-feed
- Rich text and UTF-8 offsets: https://bsky.network/docs/about-bluesky-content/post-richtext/

Build with `npm run build`. Preview normally with `npm run dev`.
