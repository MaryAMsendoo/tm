/**
 * Global next/image loader (see next.config.ts). Cloudinary images are
 * resized and converted by Cloudinary's CDN; local brand files are served
 * as they are.
 */
import { imageUrl } from "./media";

export default function imageLoader({ src, width }: { src: string; width: number; quality?: number }) {
  if (src.includes("res.cloudinary.com")) return imageUrl(src, width);
  // Static files in public/: no resizing service, the query only satisfies next/image.
  return `${src}?w=${width}`;
}
