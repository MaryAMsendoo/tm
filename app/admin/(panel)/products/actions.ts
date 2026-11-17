"use server";

import { and, eq } from "drizzle-orm";
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

function readProductForm(formData: FormData) {
  return productSchema.safeParse({
    name: formData.get("name") ?? "",
    categoryId: formData.get("categoryId") ?? "",
    description: formData.get("description") ?? "",
    dimensions: formData.get("dimensions") ?? "",
    materials: formData.get("materials") ?? "",
    customisable: formData.get("customisable") === "on",
    featured: formData.get("featured") === "on",
    inShop: formData.get("inShop") === "on",
    visible: formData.get("visible") === "on",
  });
}

async function categoryExists(id: number) {
  const [row] = await db.select({ id: categories.id }).from(categories).where(eq(categories.id, id));
  return !!row;
}

export async function createProduct(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const parsed = readProductForm(formData);
  if (!parsed.success) return { error: firstIssue(parsed.error) };
  if (!(await categoryExists(parsed.data.categoryId))) return { error: "Pick a category." };

  const [row] = await db
    .insert(products)
    .values({
      ...parsed.data,
      slug: await uniqueSlug(products, parsed.data.name),
      sortOrder: await nextSortOrder(products),
    })
    .returning({ id: products.id });
  refreshContent(TAGS_TO_REFRESH, "/admin/products");
  redirect(`/admin/products/${row.id}?created=1`);
}

export async function updateProduct(id: number, _prev: ActionResult, formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const parsed = readProductForm(formData);
  if (!parsed.success) return { error: firstIssue(parsed.error) };
  if (!(await categoryExists(parsed.data.categoryId))) return { error: "Pick a category." };

  // The slug stays the same on rename, so links and quote lists keep working.
  await db.update(products).set(parsed.data).where(eq(products.id, id));
  refreshContent(TAGS_TO_REFRESH, `/admin/products/${id}`);
  return { ok: true };
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

// ------------------------------------------------------------- media

export async function addProductMedia(productId: number, input: MediaRef) {
  await requireAdmin();
  const media = parseUploadedMedia(input);
  await db.insert(productMedia).values({
    productId,
    kind: media.kind,
    publicId: media.publicId,
    url: media.url,
    posterUrl: media.posterUrl ?? null,
    width: media.width ?? null,
    height: media.height ?? null,
    sortOrder: await nextSortOrder(productMedia, eq(productMedia.productId, productId)),
  });
  refreshContent(TAGS_TO_REFRESH, `/admin/products/${productId}`);
}

const captionSchema = z.object({
  title: z.string().trim().max(120),
  description: z.string().trim().max(1000),
});

export async function updateProductMedia(mediaId: number, _prev: ActionResult, formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const parsed = captionSchema.safeParse({ title: formData.get("title") ?? "", description: formData.get("description") ?? "" });
  if (!parsed.success) return { error: firstIssue(parsed.error) };
  const [row] = await db
    .update(productMedia)
    .set({ title: parsed.data.title || null, description: parsed.data.description || null })
    .where(eq(productMedia.id, mediaId))
    .returning({ productId: productMedia.productId });
  if (row) refreshContent(TAGS_TO_REFRESH, `/admin/products/${row.productId}`);
  return { ok: true };
}

export async function moveProductMedia(mediaId: number, productId: number, direction: "up" | "down") {
  await requireAdmin();
  await moveRow(productMedia, mediaId, direction, eq(productMedia.productId, productId));
  refreshContent(TAGS_TO_REFRESH, `/admin/products/${productId}`);
}

export async function deleteProductMedia(mediaId: number, productId: number) {
  await requireAdmin();
  const [row] = await db
    .delete(productMedia)
    .where(and(eq(productMedia.id, mediaId), eq(productMedia.productId, productId)))
    .returning();
  await deleteMediaIfUnused(row);
  refreshContent(TAGS_TO_REFRESH, `/admin/products/${productId}`);
}
