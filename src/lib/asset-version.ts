/**
 * Version of the animation and logo files. Bump it after a re-encode, so
 * browsers that cached the old files fetch the new ones.
 * CSS files cannot import this. They hardcode `?v=2` and point here.
 */
export const ASSET_VERSION = '2';

/** Adds the version query to a public file URL, e.g. /frames/dough/0001.webp?v=2. */
export function withVersion(url: string): string {
  return `${url}?v=${ASSET_VERSION}`;
}
