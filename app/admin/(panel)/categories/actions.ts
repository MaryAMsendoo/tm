"use server";

import { count, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { categories, products } from "@/db/schema";
import { requireAdmin } from "@/lib/server/auth";
import { TAGS } from "@/lib/server/content";
import { firstIssue, moveRow, nextSortOrder, refreshContent, uniqueSlug, type ActionResult } from "@/lib/server/admin";

const PATH = "/admin/categories";
// Categories affect the catalogue, portfolio filters and hero slide links.
const TAGS_TO_REFRESH = [TAGS.catalog, TAGS.portfolio, TAGS.hero];

const labelSchema = z.string().trim().min(1, "Enter a name").max(60);

export async function createCategory(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const parsed = labelSchema.safeParse(formData.get("label"));
  if (!parsed.success) return { error: firstIssue(parsed.error) };

  await db.insert(categories).values({
    label: parsed.data,
    slug: await uniqueSlug(categories, parsed.data),
    sortOrder: await nextSortOrder(categories),
  });
  refreshContent(TAGS_TO_REFRESH, PATH);
  return { ok: true, message: `"${parsed.data}" added.` };
}

export async function updateCategory(id: number, _prev: ActionResult, formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const parsed = labelSchema.safeParse(formData.get("label"));
  if (!parsed.success) return { error: firstIssue(parsed.error) };

  // The slug (used in shop links like /shop?category=kitchen) stays the same when renaming.
  await db
    .update(categories)
    .set({ label: parsed.data, visible: formData.get("visible") === "on" })
    .where(eq(categories.id, id));
  refreshContent(TAGS_TO_REFRESH, PATH);
  return { ok: true };
}

export async function moveCategory(id: number, direction: "up" | "down") {
  await requireAdmin();
  await moveRow(categories, id, direction);
  refreshContent(TAGS_TO_REFRESH, PATH);
}

export async function deleteCategory(id: number): Promise<void> {
  await requireAdmin();
  const [{ n }] = await db.select({ n: count() }).from(products).where(eq(products.categoryId, id));
  // The page hides the delete button in this case; this guards a stale page.
  if (n > 0) throw new Error("Move or delete this category's products first.");
  await db.delete(categories).where(eq(categories.id, id));
  refreshContent(TAGS_TO_REFRESH, PATH);
}
