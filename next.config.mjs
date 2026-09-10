/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites: async () => {
    return [
      {
        source: "/api/py/:path*",
        destination: "/api/index",
      },
    ];
  },

  // HTTP Security + SEO headers applied to all public pages
  async headers() {
    return [
      {
        source: "/((?!_next|api|admin|instructor|dashboard).*)",
        headers: [
          // Prevent content sniffing (security + ranking signal)
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Prevent clickjacking
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          // Referrer policy — pass full URL on same-origin, only origin cross-origin
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Permissions policy (privacy-safe defaults)
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
      // Noindex private routes via X-Robots-Tag response header
      {
        source: "/(admin|instructor|dashboard|verify)(.*)",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
      // Long cache for static assets (good for Core Web Vitals / LCP)
      {
        source: "/(.*)\\.(ico|png|jpg|jpeg|gif|svg|webp|woff2|woff|ttf)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  // Compress responses (improves TTFB → ranking signal)
  compress: true,

  // Power header removal (minor security hardening)
  poweredByHeader: false,
};

export default nextConfig;

