/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    // Image files only. Their URLs carry ?v=<ASSET_VERSION> (src/lib/asset-version.ts),
    // so a re-encode changes the URL and the long cache is safe.
    // /pov and /pov-sm have sub-paths for the images only: the /pov page HTML is not matched.
    const immutable = [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }];
    return [
      { source: '/frames/:path(.+\\.webp)', headers: immutable },
      { source: '/frames-sm/:path(.+\\.webp)', headers: immutable },
      { source: '/brand/:path(.+\\.webp)', headers: immutable },
      { source: '/pov/:slug/:file(.+\\.webp)', headers: immutable },
      { source: '/pov-sm/:slug/:file(.+\\.webp)', headers: immutable },
    ];
  },
};

export default nextConfig;
