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
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // No other site may frame these pages — above all the Studio, where a
          // framed, logged-in editor could be clickjacked into publishing.
          { key: "Content-Security-Policy", value: "frame-ancestors 'self'" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
