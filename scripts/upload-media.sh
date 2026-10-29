#!/usr/bin/env bash
# Uploads a video or large animation to the R2 bucket behind media.nehiljain.dev and prints its URL.
# Usage: scripts/upload-media.sh <post-slug> <file>
# The key carries a hash of the file, so a URL never changes content and browsers can cache it for a year.
# Needs a Cloudflare login (npx wrangler login) or CLOUDFLARE_API_TOKEN.
set -euo pipefail

if [ $# -ne 2 ] || [ ! -f "$2" ]; then
  echo "usage: scripts/upload-media.sh <post-slug> <file>" >&2
  exit 1
fi

slug=$1
file=$2
name=$(basename "$file")
stem=${name%.*}
ext=$(printf '%s' "${name##*.}" | tr '[:upper:]' '[:lower:]')
case $ext in
  mp4) type=video/mp4 ;;
  webm) type=video/webm ;;
  mov) type=video/quicktime ;;
  gif) type=image/gif ;;
  webp) type=image/webp ;;
  png) type=image/png ;;
  jpg | jpeg) type=image/jpeg ;;
  *) echo "unknown file type: .$ext" >&2; exit 1 ;;
esac

hash=$(shasum -a 256 "$file" | cut -c1-10)
key="$slug/$stem.$hash.$ext"

npx --yes wrangler@4.155.0 r2 object put "nehiljain-media/$key" \
  --file "$file" --remote \
  --content-type "$type" \
  --cache-control "public, max-age=31536000, immutable"

echo "https://media.nehiljain.dev/$key"
