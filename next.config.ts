import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  // The site and the Studio are separate root layouts, so a URL that matches no route
  // needs its own 404 page (app/global-not-found.tsx).
  experimental: { globalNotFound: true },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
