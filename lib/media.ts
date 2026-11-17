/**
 * Cloudinary delivery helpers. Safe for the browser: they only rewrite
 * public URLs, no secrets involved.
 *
 * Every stored URL looks like
 *   https://res.cloudinary.com/<cloud>/<image|video>/upload/v123/<public-id>.<ext>
 * and we insert transformations right after "/upload/".
 */

const UPLOAD = "/upload/";

function withTransform(url: string, transform: string) {
  const at = url.indexOf(UPLOAD);
  if (at === -1 || !url.includes("res.cloudinary.com")) return url;
  return url.slice(0, at + UPLOAD.length) + transform + "/" + url.slice(at + UPLOAD.length);
}

/** Image in the best format and quality for the browser, resized to `width`. */
export function imageUrl(url: string, width?: number) {
  return withTransform(url, ["f_auto", "q_auto", width ? `c_limit,w_${width}` : ""].filter(Boolean).join(","));
}

/** Video compressed for the visitor's browser, capped at `width`. */
export function videoUrl(url: string, width = 1280) {
  return withTransform(url, `f_auto:video,q_auto,c_limit,w_${width}`);
}

/** JPEG still frame taken 1 second into a Cloudinary video. */
export function videoPosterUrl(videoUrl: string) {
  return withTransform(videoUrl, "so_1,f_jpg,q_auto").replace(/\.[a-z0-9]+(\?.*)?$/i, ".jpg");
}

/** Loader for next/image: Cloudinary does the resizing, not the Next.js server. */
export function cloudinaryLoader({ src, width }: { src: string; width: number; quality?: number }) {
  return imageUrl(src, width);
}
