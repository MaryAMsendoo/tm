/**
 * Cloudinary account access (uses the API secret). Server and scripts only.
 * Not marked "server-only" so the seed script can use it; never import it
 * from a client component.
 */
import { v2 as cloudinary } from "cloudinary";

/** All uploads go under this folder in the Cloudinary media library. */
export const MEDIA_FOLDER = "tm-artisan";

let configured = false;

export function getCloudinary() {
  if (!configured) {
    const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
      throw new Error(
        "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET in .env.local.",
      );
    }
    cloudinary.config({
      cloud_name: CLOUDINARY_CLOUD_NAME,
      api_key: CLOUDINARY_API_KEY,
      api_secret: CLOUDINARY_API_SECRET,
      secure: true,
    });
    configured = true;
  }
  return cloudinary;
}

/**
 * Signature for a direct browser-to-Cloudinary upload. The browser sends the
 * file straight to Cloudinary, so large videos never pass through our server.
 */
export function signUpload(subfolder: string) {
  const cld = getCloudinary();
  const timestamp = Math.round(Date.now() / 1000);
  const folder = `${MEDIA_FOLDER}/${subfolder}`;
  const params = { folder, timestamp };
  const signature = cld.utils.api_sign_request(params, process.env.CLOUDINARY_API_SECRET!);
  return {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME!,
    apiKey: process.env.CLOUDINARY_API_KEY!,
    folder,
    timestamp,
    signature,
  };
}

/** Delete a file from Cloudinary. Missing files are ignored. */
export async function deleteMedia(publicId: string, kind: "image" | "video") {
  await getCloudinary().uploader.destroy(publicId, { resource_type: kind, invalidate: true });
}
