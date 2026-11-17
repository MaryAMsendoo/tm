import "server-only";

/**
 * Cached reads for the public site. Each function is cached until the admin
 * changes the matching content; admin actions call updateTag() with the tags
 * below, so visitors see changes immediately without a redeploy.
 */
import { asc, eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "../../db";
import * as t from "../../db/schema";
import { settingsSchemas, type SettingsKey, type SettingsValue } from "../content-schemas";
import type {
  Category,
  HeroSlide,
  PortfolioItem,
  Product,
  ShowroomArchiveItem,
  Testimonial,
} from "../types";

export const TAGS = {
  catalog: "catalog",
  portfolio: "portfolio",
  hero: "hero",
  testimonials: "testimonials",
  settings: (key: SettingsKey) => `settings:${key}`,
} as const;

// ------------------------------------------------------------------ settings

export async function getSettings<K extends SettingsKey>(key: K): Promise<SettingsValue<K>> {
  "use cache";
  cacheLife("max");
  cacheTag(TAGS.settings(key));

  const [row] = await db.select().from(t.settings).where(eq(t.settings.key, key));
  if (!row) throw new Error(`Missing site settings "${key}". Run npm run db:seed.`);
  return settingsSchemas[key].parse(row.value) as SettingsValue<K>;
}

// ----------------------------------------------------------------- catalogue

type CatalogRow = {
  product: typeof t.products.$inferSelect;
  categorySlug: string;
  media: (typeof t.productMedia.$inferSelect)[];
};

/** Visible products in visible categories, with their media, in admin order. */
async function loadCatalog() {
  "use cache";
  cacheLife("max");
  cacheTag(TAGS.catalog);

  const cats = await db
    .select()
    .from(t.categories)
    .where(eq(t.categories.visible, true))
    .orderBy(asc(t.categories.sortOrder), asc(t.categories.id));
  const productRows = await db
    .select()
    .from(t.products)
    .where(eq(t.products.visible, true))
    .orderBy(asc(t.products.sortOrder), asc(t.products.id));
  const mediaRows = await db
    .select()
    .from(t.productMedia)
    .orderBy(asc(t.productMedia.sortOrder), asc(t.productMedia.id));

  const slugById = new Map(cats.map((c) => [c.id, c.slug]));
  const rows: CatalogRow[] = productRows
    .filter((p) => slugById.has(p.categoryId))
    .map((p) => ({
      product: p,
      categorySlug: slugById.get(p.categoryId)!,
      media: mediaRows.filter((m) => m.productId === p.id),
    }));

  const categories: Category[] = cats.map((c) => ({ slug: c.slug, label: c.label }));

  const products: Product[] = rows
    .filter((r) => r.product.inShop && r.media.length > 0)
    .map(({ product: p, categorySlug, media }) => ({
      id: p.slug,
      name: p.name,
      category: categorySlug,
      images: media.map((m) => (m.kind === "image" ? m.url : m.posterUrl)).filter((u): u is string => !!u),
      description: p.description,
      dimensions: p.dimensions ?? undefined,
      materials: p.materials ?? undefined,
      customisable: p.customisable,
      featured: p.featured,
    }));

  const showroom: ShowroomArchiveItem[] = rows.flatMap(({ product: p, categorySlug, media }) =>
    media.map((m) => ({
      id: `media-${m.id}`,
      series: p.slug,
      title: m.title || p.name,
      category: categorySlug,
      image: m.url,
      poster: m.posterUrl ?? undefined,
      type: m.kind,
      description: m.description || p.description,
    })),
  );

  return { categories, products, showroom };
}

/** All visible categories, in admin order. */
export async function getCategories() {
  return (await loadCatalog()).categories;
}

/** Categories that have at least one product in the shop grid. */
export async function getActiveCategories() {
  const { categories, products } = await loadCatalog();
  return categories.filter((c) => products.some((p) => p.category === c.slug));
}

/** Products listed in the shop grid. */
export async function getShopProducts() {
  return (await loadCatalog()).products;
}

/** Every photo and video of every visible product, for the showroom gallery. */
export async function getShowroomItems() {
  return (await loadCatalog()).showroom;
}

// -------------------------------------------------------------- site content

export async function getPortfolio(): Promise<PortfolioItem[]> {
  "use cache";
  cacheLife("max");
  cacheTag(TAGS.portfolio, TAGS.catalog);

  const rows = await db
    .select({ item: t.portfolioItems, slug: t.categories.slug })
    .from(t.portfolioItems)
    .leftJoin(t.categories, eq(t.portfolioItems.categoryId, t.categories.id))
    .where(eq(t.portfolioItems.visible, true))
    .orderBy(asc(t.portfolioItems.sortOrder), asc(t.portfolioItems.id));

  return rows.map(({ item, slug }) => ({
    id: `portfolio-${item.id}`,
    title: item.title,
    category: slug ?? "",
    location: item.location ?? undefined,
    type: item.media.kind,
    src: item.media.url,
    poster: item.media.posterUrl ?? undefined,
  }));
}

export async function getHeroSlides(): Promise<HeroSlide[]> {
  "use cache";
  cacheLife("max");
  cacheTag(TAGS.hero, TAGS.catalog);

  const rows = await db
    .select({ slide: t.heroSlides, slug: t.categories.slug })
    .from(t.heroSlides)
    .leftJoin(t.categories, eq(t.heroSlides.categoryId, t.categories.id))
    .where(eq(t.heroSlides.visible, true))
    .orderBy(asc(t.heroSlides.sortOrder), asc(t.heroSlides.id));

  return rows.map(({ slide, slug }) => ({
    id: `hero-${slide.id}`,
    name: slide.name,
    category: slug ?? undefined,
    eyebrow: slide.eyebrow,
    title: slide.title,
    description: slide.description,
    image: slide.image.url,
    tag: slide.tag,
  }));
}

export async function getTestimonials(): Promise<Testimonial[]> {
  "use cache";
  cacheLife("max");
  cacheTag(TAGS.testimonials);

  const rows = await db
    .select()
    .from(t.testimonials)
    .where(eq(t.testimonials.visible, true))
    .orderBy(asc(t.testimonials.sortOrder), asc(t.testimonials.id));

  return rows.map((x) => ({
    id: `testimonial-${x.id}`,
    quote: x.quote,
    name: x.name,
    detail: x.detail ?? undefined,
    avatar: x.avatar?.url,
  }));
}
