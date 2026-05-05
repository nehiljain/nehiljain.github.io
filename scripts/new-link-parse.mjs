const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" };

function decodeEntities(s) {
  return s.replace(/&(amp|lt|gt|quot|apos);/g, (_, n) => ENTITIES[n]);
}

function metaContent(html, attr, name) {
  const re = new RegExp(
    `<meta[^>]*${attr}=["']${name}["'][^>]*content=["']([^"']*)["']`,
    'i'
  );
  const m = html.match(re);
  if (m) return decodeEntities(m[1]);
  const re2 = new RegExp(
    `<meta[^>]*content=["']([^"']*)["'][^>]*${attr}=["']${name}["']`,
    'i'
  );
  const m2 = html.match(re2);
  return m2 ? decodeEntities(m2[1]) : undefined;
}

export function parseOgTags(html) {
  if (!html) return {};
  const ogTitle = metaContent(html, 'property', 'og:title');
  const titleTag = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  return {
    title:
      ogTitle ||
      (titleTag ? decodeEntities(titleTag[1].trim()) : undefined),
    description:
      metaContent(html, 'property', 'og:description') ||
      metaContent(html, 'name', 'description'),
    author: metaContent(html, 'name', 'author'),
    siteName: metaContent(html, 'property', 'og:site_name')
  };
}
