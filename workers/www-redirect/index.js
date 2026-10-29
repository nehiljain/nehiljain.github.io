// Permanent redirect to the apex domain, keeping the path and query.
export default {
  fetch(request) {
    const url = new URL(request.url);
    url.protocol = 'https:';
    url.hostname = 'nehiljain.dev';
    return Response.redirect(url.toString(), 301);
  }
};
