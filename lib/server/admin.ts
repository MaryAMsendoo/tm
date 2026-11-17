import "server-only";

/** Helpers shared by the admin server actions. */
import { and, asc, eq, ne, sql, type SQL } from "drizzle-orm";
import { revalidatePath, updateTag } from "next/cache";
import type { AnyPgColumn, PgTable } from "drizzle-orm/pg-core";
import { db } from "../../db";
import * as t from "../../db/schema";
import { MEDIA_FOLDER, deleteMedia } from "../cloudinary-server";
import { mediaRefSchema } from "../content-schemas";

export type ActionResult = { ok?: boolean; error?: string; message?: string };

/**
 * After an admin change: expire the public site's cached content for these
 * tags (visitors see the change on their next page load) and refresh the
 * admin page that made the change. Server actions only.
 */
export function refreshContent(tags: string[], adminPath: string) {
  for (const tag of tags) updateTag(tag);
  revalidatePath(adminPath);
}

/** "Warm Wood Wardrobe!" -> "warm-wood-wardrobe" */
export function slugify(text: string) {
  return (
    text
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "item"
  );
}

/** A slug not used by another row (adds -2, -3, ... when needed). */
export async function uniqueSlug(
  table: typeof t.products | typeof t.categories,
  base: string,
  exceptId?: number,
) {
  const root = slugify(base);
  for (let n = 1; ; n++) {
    const candidate = n === 1 ? root : `${root}-${n}`;
    const where = exceptId
      ? and(eq(table.slug, candidate), ne(table.id, exceptId))
      : eq(table.slug, candidate);
    const [hit] = await db.select({ id: table.id }).from(table).where(where).limit(1);
    if (!hit) return candidate;
  }
}

type Sortable = PgTable & { id: AnyPgColumn; sortOrder: AnyPgColumn };

/**
 * Move a row one place up or down by swapping sort order with its
 * neighbour. `scope` limits the neighbours (e.g. media of one product).
 */
export async function moveRow(table: Sortable, id: number, direction: "up" | "down", scope?: SQL) {
  await db.transaction(async (tx) => {
    // Normalise first so equal sort orders can't get stuck.
    const rows = (await tx
      .select({ id: table.id, sortOrder: table.sortOrder })
      .from(table)
      .where(scope)
      .orderBy(asc(table.sortOrder), asc(table.id))) as { id: number; sortOrder: number }[];
    const index = rows.findIndex((r) => r.id === id);
    const target = direction === "up" ? index - 1 : index + 1;
    if (index === -1 || target < 0 || target >= rows.length) return;
    [rows[index], rows[target]] = [rows[target], rows[index]];
    for (const [i, row] of rows.entries()) {
      if (row.sortOrder !== i) {
        await tx.update(table).set({ sortOrder: i } as never).where(eq(table.id, row.id));
      }
    }
  });
}

/** Next sort position at the end of a list. */
export async function nextSortOrder(table: Sortable, scope?: SQL) {
  const [row] = await db
    .select({ max: sql<number>`coalesce(max(${table.sortOrder}), -1)` })
    .from(table)
    .where(scope);
  return Number(row.max) + 1;
}

/**
 * Whether any content still uses this Cloudinary file. The seed reused one
 * upload in several places (e.g. a product photo that is also a portfolio
 * item), so files are only deleted when nothing references them.
 */
export async function isMediaInUse(publicId: string) {
  const checks = await Promise.all([
    db.select({ id: t.productMedia.id }).from(t.productMedia).where(eq(t.productMedia.publicId, publicId)).limit(1),
    db.select({ id: t.portfolioItems.id }).from(t.portfolioItems).where(sql`${t.portfolioItems.media}->>'publicId' = ${publicId}`).limit(1),
    db.select({ id: t.heroSlides.id }).from(t.heroSlides).where(sql`${t.heroSlides.image}->>'publicId' = ${publicId}`).limit(1),
    db.select({ id: t.testimonials.id }).from(t.testimonials).where(sql`${t.testimonials.avatar}->>'publicId' = ${publicId}`).limit(1),
    db.select({ key: t.settings.key }).from(t.settings).where(sql`${t.settings.value}::text like ${"%" + JSON.stringify(publicId).slice(1, -1) + "%"}`).limit(1),
  ]);
  return checks.some((rows) => rows.length > 0);
}

/** Delete a Cloudinary file if no content uses it any more. Never throws. */
export async function deleteMediaIfUnused(media: { publicId: string; kind: "image" | "video" } | null | undefined) {
  if (!media) return;
  try {
    if (!(await isMediaInUse(media.publicId))) await deleteMedia(media.publicId, media.kind);
  } catch (err) {
    // The content change already succeeded; a leftover file only costs storage.
    console.error("Could not delete Cloudinary file", media.publicId, err);
  }
}

/**
 * Validate a file reference sent by the admin's browser after an upload:
 * it must be a Cloudinary file in this account's tm-artisan folder.
 */
export function parseUploadedMedia(input: unknown) {
  const parsed = mediaRefSchema.safeParse(input);
  if (!parsed.success) throw new Error("Invalid file details.");
  const media = parsed.data;
  const base = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/${media.kind}/upload/`;
  if (!media.url.startsWith(base) || !media.publicId.startsWith(`${MEDIA_FOLDER}/`)) {
    throw new Error("Files must be uploaded through the dashboard.");
  }
  if (media.posterUrl && !media.posterUrl.startsWith(base)) throw new Error("Invalid video poster.");
  return media;
}

/** Turn a Zod error into one readable sentence. */
export function firstIssue(error: { issues: { path: PropertyKey[]; message: string }[] }) {
  const issue = error.issues[0];
  if (!issue) return "Please check the form.";
  const field = issue.path.filter((p) => typeof p === "string").join(" ");
  return field ? `${field}: ${issue.message}` : issue.message;
}
