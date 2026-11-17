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
};

export default nextConfig;
