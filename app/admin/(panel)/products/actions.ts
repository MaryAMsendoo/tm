"use server";

import { and, eq, inArray } from "drizzle-orm";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/db";
import { categories, productMedia, products } from "@/db/schema";
import type { MediaRef } from "@/lib/types";
import { requireAdmin } from "@/lib/server/auth";
import { TAGS } from "@/lib/server/content";
import {
  deleteMediaIfUnused,
  firstIssue,
  moveRow,
  nextSortOrder,
  parseUploadedMedia,
  refreshContent,
  uniqueSlug,
  type ActionResult,
} from "@/lib/server/admin";

const TAGS_TO_REFRESH = [TAGS.catalog];
const optional = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((v) => v || null);

const productSchema = z.object({
  name: z.string().trim().min(1, "Enter a name").max(120),
  categoryId: z.coerce.number().int().positive("Pick a category"),
  description: z.string().trim().max(2000),
  dimensions: optional(200),
  materials: optional(200),
  customisable: z.boolean(),
  featured: z.boolean(),
  inShop: z.boolean(),
  visible: z.boolean(),
});

const captionSchema = z.object({
  title: z.string().trim().max(120),
  description: z.string().trim().max(1000),
});

/**
 * What the product editor sends: the details plus the full, ordered list of
 * photos/videos. Existing items are referred to by `id`; new uploads carry
 * their Cloudinary `file`.
 */
export type ProductInput = {
  name: string;
  categoryId: number | string;
  description: string;
  dimensions: string;
  materials: string;
  customisable: boolean;
  featured: boolean;
  inShop: boolean;
  visible: boolean;
  media: ({ id: number; title: string; description: string } | { file: MediaRef; title: string; description: string })[];
};

type ParsedMedia =
  | { id: number; title: string; description: string }
  | { file: ReturnType<typeof parseUploadedMedia>; title: string; description: string };

async function categoryExists(id: number) {
  const [row] = await db.select({ id: categories.id }).from(categories).where(eq(categories.id, id));
  return !!row;
}

/** Validate details and media list; returns an error message or the clean data. */
async function readInput(input: ProductInput) {
  const parsed = productSchema.safeParse(input);
  if (!parsed.success) return { error: firstIssue(parsed.error) } as const;
  if (!(await categoryExists(parsed.data.categoryId))) return { error: "Pick a category." } as const;

  const list = Array.isArray(input.media) ? input.media.slice(0, 200) : [];
  try {
    const media: ParsedMedia[] = list.map((m) => {
      const caption = captionSchema.parse({ title: m.title ?? "", description: m.description ?? "" });
      if ("id" in m) return { id: z.number().int().positive().parse(m.id), ...caption };
      return { file: parseUploadedMedia(m.file), ...caption };
    });
    return { details: parsed.data, media } as const;
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Invalid photo details." } as const;
  }
}

const mediaRow = (productId: number, file: ReturnType<typeof parseUploadedMedia>, title: string, description: string, sortOrder: number) => ({
  productId,
  kind: file.kind,
  publicId: file.publicId,
  url: file.url,
  posterUrl: file.posterUrl ?? null,
  width: file.width ?? null,
  height: file.height ?? null,
  title: title || null,
  description: description || null,
  sortOrder,
});

/** Create a product and all its photos/videos (already uploaded to Cloudinary) in one step. */
export async function createProductWithMedia(input: ProductInput): Promise<ActionResult> {
  await requireAdmin();
  const data = await readInput(input);
  if ("error" in data) return { error: data.error };

  const slug = await uniqueSlug(products, data.details.name);
  const sortOrder = await nextSortOrder(products);
  const id = await db.transaction(async (tx) => {
    const [row] = await tx.insert(products).values({ ...data.details, slug, sortOrder }).returning({ id: products.id });
    const rows = data.media.flatMap((m, i) => ("file" in m ? [mediaRow(row.id, m.file, m.title, m.description, i)] : []));
    if (rows.length) await tx.insert(productMedia).values(rows);
    return row.id;
  });
  refreshContent(TAGS_TO_REFRESH, "/admin/products");
  redirect(`/admin/products/${id}?created=1`);
}

/**
 * Save the whole product in one step: details, captions, order, removed
 * items and new uploads. Removed files are deleted from Cloudinary after
 * the save, unless other content still uses them.
 */
export async function updateProductWithMedia(id: number, input: ProductInput): Promise<ActionResult & { savedIds?: number[] }> {
  await requireAdmin();
  const data = await readInput(input);
  if ("error" in data) return { error: data.error };

  const current = await db.select().from(productMedia).where(eq(productMedia.productId, id));
  const currentIds = new Set(current.map((m) => m.id));
  const keptIds = new Set(data.media.flatMap((m) => ("id" in m ? [m.id] : [])));
  if ([...keptIds].some((mediaId) => !currentIds.has(mediaId))) {
    return { error: "This product changed in another window. Reload the page and try again." };
  }
  const removed = current.filter((m) => !keptIds.has(m.id));

  const [exists] = await db.select({ id: products.id }).from(products).where(eq(products.id, id));
  if (!exists) return { error: "This product no longer exists." };

  const savedIds = await db.transaction(async (tx) => {
    // The slug stays the same on rename, so links and quote lists keep working.
    await tx.update(products).set(data.details).where(eq(products.id, id));
    if (removed.length) {
      await tx.delete(productMedia).where(and(eq(productMedia.productId, id), inArray(productMedia.id, removed.map((m) => m.id))));
    }
    const ids: number[] = [];
    for (const [i, m] of data.media.entries()) {
      if ("id" in m) {
        await tx
          .update(productMedia)
          .set({ title: m.title || null, description: m.description || null, sortOrder: i })
          .where(and(eq(productMedia.id, m.id), eq(productMedia.productId, id)));
        ids.push(m.id);
      } else {
        const [row] = await tx.insert(productMedia).values(mediaRow(id, m.file, m.title, m.description, i)).returning({ id: productMedia.id });
        ids.push(row.id);
      }
    }
    return ids;
  });

  for (const m of removed) await deleteMediaIfUnused(m);
  refreshContent(TAGS_TO_REFRESH, `/admin/products/${id}`);
  // The editor uses these to mark new uploads as saved, so a second save won't add them twice.
  return { ok: true, message: "All changes saved.", savedIds };
}

/**
 * A file uploaded in the editor, then removed before saving.
 * Deleted from Cloudinary unless something already uses it.
 */
export async function discardUpload(input: MediaRef) {
  await requireAdmin();
  const file = parseUploadedMedia(input);
  await deleteMediaIfUnused(file);
}

export async function deleteProduct(id: number) {
  await requireAdmin();
  const media = await db.select().from(productMedia).where(eq(productMedia.productId, id));
  await db.delete(products).where(eq(products.id, id)); // media rows go with it (cascade)
  for (const m of media) await deleteMediaIfUnused(m);
  refreshContent(TAGS_TO_REFRESH, "/admin/products");
  redirect("/admin/products");
}

export async function moveProduct(id: number, direction: "up" | "down") {
  await requireAdmin();
  await moveRow(products, id, direction);
  refreshContent(TAGS_TO_REFRESH, "/admin/products");
}
