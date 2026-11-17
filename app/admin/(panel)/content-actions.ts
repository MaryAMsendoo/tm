"use server";

/** Server actions for portfolio, hero, testimonials and the editable site sections. */
import { and, count, eq, ne } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { categories, heroSlides, portfolioItems, settings, testimonials } from "@/db/schema";
import type { MediaRef } from "@/lib/types";
import { settingsSchemas, type SettingsKey } from "@/lib/content-schemas";
import { requireAdmin } from "@/lib/server/auth";
import { TAGS } from "@/lib/server/content";
import {
  deleteMediaIfUnused,
  firstIssue,
  moveRow,
  nextSortOrder,
  parseUploadedMedia,
  refreshContent,
  type ActionResult,
} from "@/lib/server/admin";

const text = (max: number) => z.string().trim().max(max);
const optionalText = (max: number) => text(max).transform((v) => v || null);
const categoryIdField = z
  .string()
  .optional()
  .transform((v) => (v ? Number(v) : null))
  .pipe(z.number().int().positive().nullable());

async function validCategory(id: number | null) {
  if (id === null) return true;
  const [row] = await db.select({ id: categories.id }).from(categories).where(eq(categories.id, id));
  return !!row;
}

// =============================================================== portfolio

const PORTFOLIO = { tags: [TAGS.portfolio], path: "/admin/portfolio" };

/** New uploads start hidden so a half-finished item never shows on the site. */
export async function addPortfolioItem(input: MediaRef) {
  await requireAdmin();
  const media = parseUploadedMedia(input);
  await db.insert(portfolioItems).values({
    title: "New project",
    media,
    visible: false,
    sortOrder: await nextSortOrder(portfolioItems),
  });
  refreshContent(PORTFOLIO.tags, PORTFOLIO.path);
}

const portfolioSchema = z.object({
  title: text(120).min(1, "Enter a title"),
  categoryId: categoryIdField,
  location: optionalText(120),
  visible: z.boolean(),
});

export async function updatePortfolioItem(id: number, _prev: ActionResult, formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const parsed = portfolioSchema.safeParse({
    title: formData.get("title") ?? "",
    categoryId: formData.get("categoryId") || undefined,
    location: formData.get("location") ?? "",
    visible: formData.get("visible") === "on",
  });
  if (!parsed.success) return { error: firstIssue(parsed.error) };
  if (!(await validCategory(parsed.data.categoryId))) return { error: "Pick a category." };
  await db.update(portfolioItems).set(parsed.data).where(eq(portfolioItems.id, id));
  refreshContent(PORTFOLIO.tags, PORTFOLIO.path);
  return { ok: true };
}

export async function replacePortfolioMedia(id: number, input: MediaRef) {
  await requireAdmin();
  const media = parseUploadedMedia(input);
  const [old] = await db.select({ media: portfolioItems.media }).from(portfolioItems).where(eq(portfolioItems.id, id));
  await db.update(portfolioItems).set({ media }).where(eq(portfolioItems.id, id));
  await deleteMediaIfUnused(old?.media);
  refreshContent(PORTFOLIO.tags, PORTFOLIO.path);
}

export async function movePortfolioItem(id: number, direction: "up" | "down") {
  await requireAdmin();
  await moveRow(portfolioItems, id, direction);
  refreshContent(PORTFOLIO.tags, PORTFOLIO.path);
}

export async function deletePortfolioItem(id: number) {
  await requireAdmin();
  const [row] = await db.delete(portfolioItems).where(eq(portfolioItems.id, id)).returning();
  await deleteMediaIfUnused(row?.media);
  refreshContent(PORTFOLIO.tags, PORTFOLIO.path);
}

// ============================================================ hero slides

const HERO = { tags: [TAGS.hero], path: "/admin/hero" };

export async function addHeroSlide(input: MediaRef) {
  await requireAdmin();
  const image = parseUploadedMedia(input);
  if (image.kind !== "image") throw new Error("Hero slides need a photo, not a video.");
  await db.insert(heroSlides).values({
    name: "New slide",
    title: "New slide",
    image,
    visible: false,
    sortOrder: await nextSortOrder(heroSlides),
  });
  refreshContent(HERO.tags, HERO.path);
}

const slideSchema = z.object({
  name: text(80).min(1, "Enter a name"),
  eyebrow: text(60),
  title: text(160).min(1, "Enter a headline"),
  description: text(400),
  tag: text(40),
  categoryId: categoryIdField,
  visible: z.boolean(),
});

async function otherVisibleSlides(id: number) {
  const [{ n }] = await db
    .select({ n: count() })
    .from(heroSlides)
    .where(and(eq(heroSlides.visible, true), ne(heroSlides.id, id)));
  return n;
}

export async function updateHeroSlide(id: number, _prev: ActionResult, formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const parsed = slideSchema.safeParse({
    name: formData.get("name") ?? "",
    eyebrow: formData.get("eyebrow") ?? "",
    title: formData.get("title") ?? "",
    description: formData.get("description") ?? "",
    tag: formData.get("tag") ?? "",
    categoryId: formData.get("categoryId") || undefined,
    visible: formData.get("visible") === "on",
  });
  if (!parsed.success) return { error: firstIssue(parsed.error) };
  if (!(await validCategory(parsed.data.categoryId))) return { error: "Pick a category." };
  if (!parsed.data.visible && (await otherVisibleSlides(id)) === 0) {
    return { error: "The home page needs at least one visible slide." };
  }
  await db.update(heroSlides).set(parsed.data).where(eq(heroSlides.id, id));
  refreshContent(HERO.tags, HERO.path);
  return { ok: true };
}

export async function replaceHeroSlideImage(id: number, input: MediaRef) {
  await requireAdmin();
  const image = parseUploadedMedia(input);
  if (image.kind !== "image") throw new Error("Hero slides need a photo, not a video.");
  const [old] = await db.select({ image: heroSlides.image }).from(heroSlides).where(eq(heroSlides.id, id));
  await db.update(heroSlides).set({ image }).where(eq(heroSlides.id, id));
  await deleteMediaIfUnused(old?.image);
  refreshContent(HERO.tags, HERO.path);
}

export async function moveHeroSlide(id: number, direction: "up" | "down") {
  await requireAdmin();
  await moveRow(heroSlides, id, direction);
  refreshContent(HERO.tags, HERO.path);
}

export async function deleteHeroSlide(id: number) {
  await requireAdmin();
  const [slide] = await db.select().from(heroSlides).where(eq(heroSlides.id, id));
  if (!slide) return;
  if (slide.visible && (await otherVisibleSlides(id)) === 0) {
    throw new Error("The home page needs at least one visible slide.");
  }
  await db.delete(heroSlides).where(eq(heroSlides.id, id));
  await deleteMediaIfUnused(slide.image);
  refreshContent(HERO.tags, HERO.path);
}

// =========================================================== testimonials

const TESTIMONIALS = { tags: [TAGS.testimonials], path: "/admin/testimonials" };

const testimonialSchema = z.object({
  quote: text(1500).min(1, "Enter the quote"),
  name: text(80).min(1, "Enter the client's name"),
  detail: optionalText(160),
  visible: z.boolean(),
});

function readTestimonial(formData: FormData) {
  return testimonialSchema.safeParse({
    quote: formData.get("quote") ?? "",
    name: formData.get("name") ?? "",
    detail: formData.get("detail") ?? "",
    visible: formData.get("visible") === "on",
  });
}

export async function createTestimonial(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const parsed = readTestimonial(formData);
  if (!parsed.success) return { error: firstIssue(parsed.error) };
  await db.insert(testimonials).values({ ...parsed.data, sortOrder: await nextSortOrder(testimonials) });
  refreshContent(TESTIMONIALS.tags, TESTIMONIALS.path);
  return { ok: true, message: "Testimonial added." };
}

export async function updateTestimonial(id: number, _prev: ActionResult, formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const parsed = readTestimonial(formData);
  if (!parsed.success) return { error: firstIssue(parsed.error) };
  await db.update(testimonials).set(parsed.data).where(eq(testimonials.id, id));
  refreshContent(TESTIMONIALS.tags, TESTIMONIALS.path);
  return { ok: true };
}

export async function setTestimonialAvatar(id: number, input: MediaRef | null) {
  await requireAdmin();
  const avatar = input ? parseUploadedMedia(input) : null;
  if (avatar && avatar.kind !== "image") throw new Error("Use a photo for the client picture.");
  const [old] = await db.select({ avatar: testimonials.avatar }).from(testimonials).where(eq(testimonials.id, id));
  await db.update(testimonials).set({ avatar }).where(eq(testimonials.id, id));
  await deleteMediaIfUnused(old?.avatar);
  refreshContent(TESTIMONIALS.tags, TESTIMONIALS.path);
}

export async function moveTestimonial(id: number, direction: "up" | "down") {
  await requireAdmin();
  await moveRow(testimonials, id, direction);
  refreshContent(TESTIMONIALS.tags, TESTIMONIALS.path);
}

export async function deleteTestimonial(id: number) {
  await requireAdmin();
  const [row] = await db.delete(testimonials).where(eq(testimonials.id, id)).returning();
  await deleteMediaIfUnused(row?.avatar);
  refreshContent(TESTIMONIALS.tags, TESTIMONIALS.path);
}

// ======================================================== editable sections

/** Every photo/video reference inside a settings document. */
function mediaIn(value: unknown, found: MediaRef[] = []): MediaRef[] {
  if (Array.isArray(value)) value.forEach((v) => mediaIn(v, found));
  else if (value && typeof value === "object") {
    const v = value as Record<string, unknown>;
    if (typeof v.publicId === "string" && (v.kind === "image" || v.kind === "video")) found.push(v as MediaRef);
    else Object.values(v).forEach((x) => mediaIn(x, found));
  }
  return found;
}

const SETTINGS_PATHS: Record<SettingsKey, string> = {
  site: "/admin/settings",
  hero: "/admin/hero",
  about: "/admin/settings",
  founder: "/admin/settings",
};

/** Save one editable section (business details, hero text, About page, founder message). */
export async function saveSettings(key: SettingsKey, value: unknown): Promise<ActionResult> {
  await requireAdmin();
  if (!(key in settingsSchemas)) return { error: "Unknown section." };

  const parsed = settingsSchemas[key].safeParse(value);
  if (!parsed.success) return { error: firstIssue(parsed.error) };

  const [old] = await db.select().from(settings).where(eq(settings.key, key));
  const oldMedia = mediaIn(old?.value);
  const newMedia = mediaIn(parsed.data);
  // Photos that were already saved are trusted; new ones must be fresh dashboard uploads.
  try {
    for (const m of newMedia) {
      if (!oldMedia.some((o) => o.publicId === m.publicId)) parseUploadedMedia(m);
    }
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Invalid file." };
  }

  await db
    .insert(settings)
    .values({ key, value: parsed.data })
    .onConflictDoUpdate({ target: settings.key, set: { value: parsed.data } });

  for (const m of oldMedia) {
    if (!newMedia.some((n) => n.publicId === m.publicId)) await deleteMediaIfUnused(m);
  }
  refreshContent([TAGS.settings(key)], SETTINGS_PATHS[key]);
  return { ok: true };
}
