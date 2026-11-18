import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pages are prerendered and cached; admin edits refresh them with updateTag().
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    // Cloudinary does the resizing and format conversion (lib/image-loader.ts).
    loader: "custom",
    loaderFile: "./lib/image-loader.ts",
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // No other website may show these pages inside a frame (stops click-jacking of the dashboard).
          { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
