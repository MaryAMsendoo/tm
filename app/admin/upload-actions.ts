"use server";

import { signUpload } from "@/lib/cloudinary-server";
import { requireAdmin } from "@/lib/server/auth";

const FOLDERS = ["products", "portfolio", "hero", "testimonials", "site"] as const;

/** Short-lived permission for the admin's browser to upload one file to Cloudinary. */
export async function getUploadSignature(folder: (typeof FOLDERS)[number]) {
  await requireAdmin();
  if (!FOLDERS.includes(folder)) throw new Error("Unknown upload folder");
  return signUpload(folder);
}
