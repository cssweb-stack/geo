/*
 * GEO Department News: original, locally hosted integration; no widget or SDK.
 * Public posts are read directly from Bluesky each time this page is opened.
 * API: https://docs.bsky.app/docs/api/app-bsky-feed-get-author-feed
 * Facets: https://bsky.network/docs/about-bluesky-content/post-richtext/
 * Post text is inserted as text nodes, never as HTML. Facet offsets use UTF-8.
 */
(() => {
  'use strict';

  const API = 'https://public.api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed';
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const dateFormat = new Intl.DateTimeFormat('en-US', {
    month: 'short', day: 'numeric', year: 'numeric', timeZone: 'Pacific/Honolulu'
  });

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function safeURL(value) {
    if (typeof value !== 'string') return null;
    try {
      const url = new URL(value);
      return ['https:', 'http:'].includes(url.protocol) && !url.username && !url.password ? url.href : null;
    } catch {
      return null;
    }
  }

  function profileURL(actor) {
    return 'https://bsky.app/profile/' + encodeURIComponent(actor).replace(/%3A/gi, ':');
  }

  function postURL(post) {
    const match = /^at:\/\/([^/]+)\/app\.bsky\.feed\.post\/([^/]+)$/.exec(post?.uri || '');
    return match ? profileURL(match[1]) + '/post/' + encodeURIComponent(match[2]) : null;
  }

  function link(url, className, text) {
    const node = element('a', className, text);
    node.href = url;
    return node;
  }

  function featureURL(feature) {
    if (feature?.$type === 'app.bsky.richtext.facet#link') return safeURL(feature.uri);
    if (feature?.$type === 'app.bsky.richtext.facet#mention' && typeof feature.did === 'string') return profileURL(feature.did);
    if (feature?.$type === 'app.bsky.richtext.facet#tag' && typeof feature.tag === 'string') {
      return 'https://bsky.app/hashtag/' + encodeURIComponent(feature.tag);
    }
    return null;
  }

  function richText(container, text, facets) {
    const bytes = encoder.encode(typeof text === 'string' ? text : '');
    const sorted = (Array.isArray(facets) ? facets : []).slice().sort((a, b) => (a?.index?.byteStart || 0) - (b?.index?.byteStart || 0));
    let cursor = 0;
    for (const facet of sorted) {
      const start = facet?.index?.byteStart;
      const end = facet?.index?.byteEnd;
      if (!Number.isInteger(start) || !Number.isInteger(end) || start < cursor || end <= start || end > bytes.length) continue;
      // Ignore malformed ranges cutting through a multi-byte character.
      if ((bytes[start] & 0xc0) === 0x80 || (end < bytes.length && (bytes[end] & 0xc0) === 0x80)) continue;
      container.append(document.createTextNode(decoder.decode(bytes.slice(cursor, start))));
      const label = decoder.decode(bytes.slice(start, end));
      const href = (Array.isArray(facet.features) ? facet.features : []).map(featureURL).find(Boolean);
      container.append(href ? link(href, '', label) : document.createTextNode(label));
      cursor = end;
    }
    container.append(document.createTextNode(decoder.decode(bytes.slice(cursor))));
  }

  function image(src, alt, className) {
    const url = safeURL(src);
    if (!url) return null;
    const img = element('img', className);
    img.src = url;
    img.alt = typeof alt === 'string' ? alt : '';
    img.loading = 'lazy';
    img.decoding = 'async';
    // A missing thumbnail must not leave a broken-image box in the card.
    img.addEventListener('error', () => img.remove(), { once: true });
    return img;
  }

  function renderImages(container, images, url) {
    if (!Array.isArray(images)) return;
    const group = element('div', 'news-post-images');
    group.dataset.count = String(Math.min(images.length, 4));
    images.slice(0, 4).forEach((item, index) => {
      const img = image(item.thumb || item.fullsize, item.alt, 'news-post-image');
      if (!img) return;
      const target = link(url, 'news-post-image-link');
      if (!item.alt) target.setAttribute('aria-label', 'View image ' + (index + 1) + ' with this post on Bluesky');
      const width = item.aspectRatio?.width;
      const height = item.aspectRatio?.height;
      if (Number.isFinite(width) && width > 0 && Number.isFinite(height) && height > 0) {
        img.width = width;
        img.height = height;
      }
      target.append(img);
      group.append(target);
    });
    if (group.childElementCount) container.append(group);
  }

  function renderExternal(container, external) {
    const url = safeURL(external?.uri);
    if (!url) return;
    const preview = link(url, 'news-link-preview');
    const thumb = image(external.thumb, '', 'news-link-preview-image');
    if (thumb) preview.append(thumb);
    const copy = element('div', 'news-link-preview-copy');
    copy.append(element('p', 'news-link-preview-title', external.title || 'Read the linked story'));
    copy.append(element('p', 'news-link-preview-domain', new URL(url).hostname.replace(/^www\./, '')));
    preview.append(copy);
    container.append(preview);
  }

  function renderQuote(container, record) {
    if (!record || record.$type !== 'app.bsky.embed.record#viewRecord') return;
    const url = postURL(record);
    if (!url) return;
    const quote = element('blockquote', 'news-quoted-post');
    const text = element('p', 'news-post-text');
    richText(text, record.value?.text, record.value?.facets);
    quote.append(text);
    const credit = element('p', 'news-quote-author');
    credit.append(link(url, '', record.author?.displayName || record.author?.handle || 'View quoted post'));
    quote.append(credit);
    container.append(quote);
  }

  function renderEmbed(container, embed, url) {
    if (!embed) return;
    if (embed.$type === 'app.bsky.embed.images#view') renderImages(container, embed.images, url);
    if (embed.$type === 'app.bsky.embed.external#view') renderExternal(container, embed.external);
    if (embed.$type === 'app.bsky.embed.video#view') {
      const video = link(url, 'news-video-preview');
      const poster = image(embed.thumbnail, '', 'news-post-image');
      if (poster) video.append(poster);
      video.append(element('span', 'news-video-label', 'Watch video on Bluesky'));
      container.append(video);
    }
    if (embed.$type === 'app.bsky.embed.record#view') renderQuote(container, embed.record);
    if (embed.$type === 'app.bsky.embed.recordWithMedia#view') {
      renderEmbed(container, embed.media, url);
      renderQuote(container, embed.record?.record);
    }
  }

  function renderPost(entry) {
    const post = entry?.post;
    const url = postURL(post);
    const record = post?.record;
    if (!url || typeof record?.text !== 'string' || record.reply) return null;
    const labels = [...(post.labels || []), ...(post.author?.labels || [])];
    if (labels.some(label => ['!hide', '!no-unauthenticated'].includes(label.val))) return null;
    const author = post.author?.displayName || post.author?.handle || 'Bluesky';
    const card = element('article', 'news-post');
    if (entry.reason?.$type === 'app.bsky.feed.defs#reasonRepost') {
      card.append(element('p', 'news-repost-label', 'Reposted by ' + (entry.reason.by?.displayName || entry.reason.by?.handle || 'the department')));
    }
    const header = element('header', 'news-post-header');
    const identity = element('p', 'news-post-author');
    identity.append(link(profileURL(post.author?.did || post.author?.handle || ''), '', author));
    header.append(identity);
    const date = new Date(record.createdAt || post.indexedAt);
    if (Number.isFinite(date.getTime())) {
      const time = element('time', '', dateFormat.format(date));
      time.dateTime = date.toISOString();
      const dateLink = link(url, 'news-post-date');
      dateLink.append(time);
      header.append(dateLink);
      card.setAttribute('aria-label', 'Post by ' + author + ', ' + dateFormat.format(date));
    } else {
      card.setAttribute('aria-label', 'Post by ' + author);
    }
    card.append(header);
    if (record.text) {
      const copy = element('p', 'news-post-text');
      richText(copy, record.text, record.facets);
      card.append(copy);
    }
    renderEmbed(card, post.embed, url);
    const footer = element('p', 'news-post-footer');
    const permalink = link(url, '', 'View post on Bluesky');
    permalink.setAttribute('aria-label', 'View post by ' + author + (Number.isFinite(date.getTime()) ? ' from ' + dateFormat.format(date) : '') + ' on Bluesky');
    footer.append(permalink);
    card.append(footer);
    return card;
  }

  function init(root) {
    const actor = root.dataset.blueskyActor;
    const parsedLimit = Number.parseInt(root.dataset.blueskyLimit, 10);
    const limit = Number.isFinite(parsedLimit) ? Math.max(1, Math.min(parsedLimit, 30)) : 9;
    const grid = root.querySelector('.news-feed-grid');
    const status = root.querySelector('.news-feed-status');
    const retry = root.querySelector('.news-feed-retry');
    if (!actor || !grid || !status || !retry) return;

    async function load() {
      grid.setAttribute('aria-busy', 'true');
      retry.hidden = true;
      retry.disabled = true;
      status.hidden = false;
      status.textContent = 'Loading the latest department updates…';
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 12000);
      try {
        const url = new URL(API);
        url.searchParams.set('actor', actor);
        url.searchParams.set('filter', 'posts_no_replies');
        url.searchParams.set('limit', String(Math.min(limit * 2, 100)));
        const response = await fetch(url, { signal: controller.signal, credentials: 'omit', headers: { Accept: 'application/json' } });
        if (!response.ok) throw new Error('Feed request failed: ' + response.status);
        const payload = await response.json();
        if (!Array.isArray(payload.feed)) throw new Error('Invalid feed response');
        const fragment = document.createDocumentFragment();
        const seen = new Set();
        let count = 0;
        for (const entry of payload.feed) {
          if (count >= limit) break;
          const uri = entry?.post?.uri;
          if (!uri || seen.has(uri)) continue;
          const card = renderPost(entry);
          if (!card) continue;
          seen.add(uri);
          fragment.append(card);
          count += 1;
        }
        grid.replaceChildren(fragment);
        status.textContent = count ? '' : 'No updates are available here yet. Visit our Bluesky account for the latest news.';
        status.hidden = count > 0;
      } catch {
        status.textContent = 'Updates could not be loaded right now. Try again, or use the Bluesky links on this page.';
        retry.hidden = false;
      } finally {
        clearTimeout(timeout);
        retry.disabled = false;
        grid.setAttribute('aria-busy', 'false');
      }
    }

    retry.addEventListener('click', load);
    load();
  }

  document.querySelectorAll('[data-bluesky-feed]').forEach(init);
})();
